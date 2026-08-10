/**
 * scripts/build-data.ts
 * Turns COMMITTED project outputs into the static JSON the demos ship with.
 * Run locally where the repos are checked out:  pnpm data
 *
 * Rules (see ../content-rules.md):
 *  - Only real, committed outputs. Never fabricate a row.
 *  - If a source file is missing, FAIL LOUDLY (non-zero exit). Do not write partial or guessed data.
 *  - The one exception is the shot-map sample: outputs/ is gitignored in opponent-adjusted-metrics, so if the
 *    export is absent the demo ships a { available: false } marker and renders a "coming soon" state.
 *
 * Deps:  pnpm add -D tsx csv-parse
 * Env (.env.local at repo root):
 *    REPO_ROOT=/absolute/path/to/GitHub Portfolio     # the folder containing Retail/, Football/, ...
 *    SHOTS_EXPORT=/absolute/path/to/shots.sample.json  # optional; your exported CxG shots (§7.1 schema)
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parse } from 'csv-parse/sync';

const REPO_ROOT = process.env.REPO_ROOT;
const SHOTS_EXPORT = process.env.SHOTS_EXPORT;
const OUT_DIR = resolve(process.cwd(), 'data');

function fail(msg: string): never {
  console.error(`\n[build-data] FAILED: ${msg}\n`);
  process.exit(1);
}
function ok(msg: string) {
  console.log(`[build-data] ${msg}`);
}
function ensureOut() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
}
function write(name: string, data: unknown) {
  ensureOut();
  writeFileSync(join(OUT_DIR, name), JSON.stringify(data, null, 2) + '\n');
  ok(`wrote data/${name}`);
}

/* ------------------------------------------------------------------ */
/* 1. UPLIFT DECILES  (retail-intelligence, REAL committed output)     */
/* ------------------------------------------------------------------ */
/**
 * Confirmed against the real committed files (2026-07-18). The per-decile table lives in
 * phase_uplift_v2_decile_summary.csv; phase_uplift_v2_model_comparison.csv holds the single-row
 * headline (ATE, top-decile, Qini area, Spearman). Both are git-tracked in retail-intelligence.
 *
 * REPO_ROOT is the checkout parent. The retail-intelligence output dir is resolved from a couple of
 * candidate layouts so this works whether the repo sits under `Retail/` or directly under REPO_ROOT.
 */
const UPLIFT_OUTPUT_CANDIDATES = [
  'Retail/retail-intelligence/outputs',
  'retail-intelligence/outputs',
];
const UPLIFT_DECILE_FILE = 'phase_uplift_v2_decile_summary.csv';
const UPLIFT_SUMMARY_FILE = 'phase_uplift_v2_model_comparison.csv';

// Real header of phase_uplift_v2_decile_summary.csv. `n` is derived (n_treatment + n_control); the
// Qini curve is derived from committed values (see below), not read from a column.
const UPLIFT_COLS = {
  decile: 'decile', // 1..10, 1 = highest predicted uplift
  n_treatment: 'n_treatment',
  n_control: 'n_control',
  observed_uplift: 'observed_uplift',
  cumulative: 'cumulative_observed_uplift',
} as const;

// Real header of phase_uplift_v2_model_comparison.csv (single row).
const UPLIFT_SUMMARY_COLS = {
  ate: 'overall_ate_test',
  topDecile: 'top1_decile_observed_uplift',
  qiniArea: 'qini_like_area',
  spearman: 'spearman_rank_corr',
} as const;

type UpliftDecile = {
  decile: number;
  n: number;
  n_treatment: number;
  n_control: number;
  observed_uplift: number;
  cumulative: number;
  qini: number; // cumulative incremental responders = cumSum(n_treatment * observed_uplift). Derived.
};

function resolveUpliftDir(): string {
  for (const rel of UPLIFT_OUTPUT_CANDIDATES) {
    const dir = join(REPO_ROOT ?? '', rel);
    if (existsSync(join(dir, UPLIFT_DECILE_FILE))) return dir;
  }
  fail(
    `uplift decile CSV not found. Looked for ${UPLIFT_DECILE_FILE} under: ` +
      UPLIFT_OUTPUT_CANDIDATES.map((r) => join(REPO_ROOT ?? '', r)).join(' | ') +
      '. Set REPO_ROOT to the checkout that contains the committed retail-intelligence outputs.',
  );
}

function readCsv(path: string): Record<string, string>[] {
  return parse(readFileSync(path, 'utf8'), { columns: true, skip_empty_lines: true, trim: true });
}

function requireCols(header: string[], cols: readonly string[], path: string) {
  for (const col of cols) {
    if (!header.includes(col)) {
      fail(
        `column "${col}" missing from ${path}. ` +
          `Found columns: [${header.join(', ')}]. Update the column map to match the real header.`,
      );
    }
  }
}

function buildUplift() {
  if (!REPO_ROOT) fail('REPO_ROOT is not set. Add it to .env.local (see header).');
  const dir = resolveUpliftDir();
  const decilePath = join(dir, UPLIFT_DECILE_FILE);
  const summaryPath = join(dir, UPLIFT_SUMMARY_FILE);
  if (!existsSync(summaryPath)) fail(`uplift summary not found at ${summaryPath}.`);

  const decileRows = readCsv(decilePath);
  requireCols(Object.keys(decileRows[0] ?? {}), Object.values(UPLIFT_COLS), decilePath);

  const summaryRows = readCsv(summaryPath);
  requireCols(Object.keys(summaryRows[0] ?? {}), Object.values(UPLIFT_SUMMARY_COLS), summaryPath);
  if (summaryRows.length !== 1) fail(`expected one summary row in ${summaryPath}, got ${summaryRows.length}`);

  const num = (v: string, col: string, i: number, path: string) => {
    const n = Number(v);
    if (Number.isNaN(n)) fail(`non-numeric "${v}" in column ${col}, row ${i + 1} of ${path}`);
    return n;
  };

  // Sort by decile so the cumulative Qini derivation follows the ranking (1 = highest predicted).
  const sorted = [...decileRows].sort(
    (a, b) => Number(a[UPLIFT_COLS.decile]) - Number(b[UPLIFT_COLS.decile]),
  );
  let cumQini = 0;
  const deciles: UpliftDecile[] = sorted.map((r, i) => {
    const nT = num(r[UPLIFT_COLS.n_treatment], UPLIFT_COLS.n_treatment, i, decilePath);
    const nC = num(r[UPLIFT_COLS.n_control], UPLIFT_COLS.n_control, i, decilePath);
    const observed = num(r[UPLIFT_COLS.observed_uplift], UPLIFT_COLS.observed_uplift, i, decilePath);
    // Standard Qini increment per decile: incremental responders vs matched control = n_treatment * uplift.
    cumQini += nT * observed;
    return {
      decile: num(r[UPLIFT_COLS.decile], UPLIFT_COLS.decile, i, decilePath),
      n: nT + nC,
      n_treatment: nT,
      n_control: nC,
      observed_uplift: observed,
      cumulative: num(r[UPLIFT_COLS.cumulative], UPLIFT_COLS.cumulative, i, decilePath),
      qini: cumQini,
    };
  });
  if (deciles.length < 5) fail(`expected a decile table, got ${deciles.length} rows from ${decilePath}`);

  const s = summaryRows[0];
  const headline = {
    ate: num(s[UPLIFT_SUMMARY_COLS.ate], UPLIFT_SUMMARY_COLS.ate, 0, summaryPath),
    topDecile: num(s[UPLIFT_SUMMARY_COLS.topDecile], UPLIFT_SUMMARY_COLS.topDecile, 0, summaryPath),
    qiniArea: num(s[UPLIFT_SUMMARY_COLS.qiniArea], UPLIFT_SUMMARY_COLS.qiniArea, 0, summaryPath),
    spearman: num(s[UPLIFT_SUMMARY_COLS.spearman], UPLIFT_SUMMARY_COLS.spearman, 0, summaryPath),
  };

  write('uplift-deciles.json', {
    provenance:
      'retail-intelligence phase_uplift_v2 (X-learner, synthetic data). Per-decile rows from ' +
      'phase_uplift_v2_decile_summary.csv; headline from phase_uplift_v2_model_comparison.csv. The Qini ' +
      'series is derived (cumulative n_treatment * observed_uplift). Demonstrates method, not a measured ' +
      'commercial outcome.',
    headline,
    deciles,
  });
}

/* ------------------------------------------------------------------ */
/* 1c. CxA  (opponent-adjusted-metrics, portfolio export)              */
/* ------------------------------------------------------------------ */
/**
 * Diagnostic v1 CxA against its OWN baseline, over 1,091,388 action rows. There is no off-the-shelf
 * xA to compare against, so this is an INTERNAL baseline, never an industry incumbent. The demo copy
 * must say so (see content-rules.md rule 5 on this repo).
 *
 * Sources, all under outputs/portfolio/cxa/ in opponent-adjusted-metrics. That directory is gitignored,
 * so this reads it via REPO_ROOT and the generated data/cxa.json is what ships.
 *   headline_metrics.json | top_players_by_cxa.csv | top_teams_by_cxa.csv | feature_driver_summary.csv
 */
const CXA_DIR_CANDIDATES = [
  'Football/opponent-adjusted-metrics/outputs/portfolio/cxa',
  'opponent-adjusted-metrics/outputs/portfolio/cxa',
];
const CXA_HEADLINE_FILE = 'headline_metrics.json';
const CXA_PLAYERS_FILE = 'top_players_by_cxa.csv';
const CXA_TEAMS_FILE = 'top_teams_by_cxa.csv';
const CXA_DRIVERS_FILE = 'feature_driver_summary.csv';

// Real headers, confirmed 2026-07-21.
const CXA_PLAYER_COLS = [
  'player_name', 'team_name', 'actions', 'shot_creating_actions',
  'total_diagnostic_cxa', 'mean_diagnostic_cxa', 'rank',
] as const;
const CXA_TEAM_COLS = [
  'team_name', 'actions', 'shot_creating_actions',
  'total_diagnostic_cxa', 'mean_diagnostic_cxa', 'rank',
] as const;
const CXA_DRIVER_COLS = ['driver_type', 'name', 'feature_group', 'impact', 'rank'] as const;

/** The seven committed metrics, with direction so the UI can never imply a lower log loss is worse. */
const CXA_METRICS = [
  { key: 'precision_at_top_1pct', label: 'Precision @ top 1%', direction: 'higher-better' },
  { key: 'precision_at_top_5pct', label: 'Precision @ top 5%', direction: 'higher-better' },
  { key: 'roc_auc', label: 'ROC AUC', direction: 'higher-better' },
  { key: 'average_precision', label: 'Average precision', direction: 'higher-better' },
  { key: 'log_loss', label: 'Log loss', direction: 'lower-better' },
  { key: 'brier', label: 'Brier', direction: 'lower-better' },
  { key: 'expected_calibration_error', label: 'Expected calibration error', direction: 'lower-better' },
] as const;

function resolveCxaDir(): string {
  for (const rel of CXA_DIR_CANDIDATES) {
    const dir = join(REPO_ROOT ?? '', rel);
    if (existsSync(join(dir, CXA_HEADLINE_FILE))) return dir;
  }
  fail(
    `CxA portfolio export not found. Looked for ${CXA_HEADLINE_FILE} under: ` +
      CXA_DIR_CANDIDATES.map((r) => join(REPO_ROOT ?? '', r)).join(' | ') +
      '. Run scripts/build_cxa_portfolio_summary.py in opponent-adjusted-metrics first.',
  );
}

function buildCxa() {
  if (!REPO_ROOT) fail('REPO_ROOT is not set. Add it to .env.local (see header).');
  const dir = resolveCxaDir();

  const headlinePath = join(dir, CXA_HEADLINE_FILE);
  const headline = JSON.parse(readFileSync(headlinePath, 'utf8'));
  const bvd = headline?.baseline_vs_diagnostic;
  if (!bvd?.baseline || !bvd?.diagnostic) {
    fail(`baseline_vs_diagnostic missing from ${headlinePath}. Re-run the CxA portfolio export.`);
  }

  const numAt = (obj: Record<string, unknown>, key: string, path: string) => {
    const n = Number(obj?.[key]);
    if (Number.isNaN(n)) fail(`non-numeric or missing "${key}" in ${path}`);
    return n;
  };

  // Baseline and diagnostic carried through unchanged; delta recomputed so it can never drift.
  const metrics = CXA_METRICS.map((m) => {
    const baseline = numAt(bvd.baseline, m.key, headlinePath);
    const diagnostic = numAt(bvd.diagnostic, m.key, headlinePath);
    return { key: m.key, label: m.label, direction: m.direction, baseline, diagnostic, delta: diagnostic - baseline };
  });

  const readTable = (file: string, cols: readonly string[]) => {
    const path = join(dir, file);
    if (!existsSync(path)) fail(`CxA source not found at ${path}.`);
    const rows = readCsv(path);
    if (!rows.length) fail(`${path} contained no rows.`);
    requireCols(Object.keys(rows[0]), cols, path);
    return { rows, path };
  };

  const num = (v: string, col: string, i: number, path: string) => {
    const n = Number(v);
    if (Number.isNaN(n)) fail(`non-numeric "${v}" in column ${col}, row ${i + 1} of ${path}`);
    return n;
  };

  const { rows: playerRows, path: playersPath } = readTable(CXA_PLAYERS_FILE, CXA_PLAYER_COLS);
  const players = playerRows.map((r, i) => ({
    name: r.player_name,
    team: r.team_name,
    actions: num(r.actions, 'actions', i, playersPath),
    shotCreating: num(r.shot_creating_actions, 'shot_creating_actions', i, playersPath),
    total: num(r.total_diagnostic_cxa, 'total_diagnostic_cxa', i, playersPath),
    mean: num(r.mean_diagnostic_cxa, 'mean_diagnostic_cxa', i, playersPath),
    rank: num(r.rank, 'rank', i, playersPath),
  }));

  const { rows: teamRows, path: teamsPath } = readTable(CXA_TEAMS_FILE, CXA_TEAM_COLS);
  const teams = teamRows.map((r, i) => ({
    name: r.team_name,
    actions: num(r.actions, 'actions', i, teamsPath),
    shotCreating: num(r.shot_creating_actions, 'shot_creating_actions', i, teamsPath),
    total: num(r.total_diagnostic_cxa, 'total_diagnostic_cxa', i, teamsPath),
    mean: num(r.mean_diagnostic_cxa, 'mean_diagnostic_cxa', i, teamsPath),
    rank: num(r.rank, 'rank', i, teamsPath),
  }));

  const { rows: driverRows, path: driversPath } = readTable(CXA_DRIVERS_FILE, CXA_DRIVER_COLS);
  const drivers = driverRows.map((r, i) => ({
    driverType: r.driver_type, // 'feature' or the group-level rollup
    name: r.name,
    featureGroup: r.feature_group,
    impact: num(r.impact, 'impact', i, driversPath),
    rank: num(r.rank, 'rank', i, driversPath),
  }));

  write('cxa.json', {
    provenance:
      'opponent-adjusted-metrics CxA diagnostic v1, from outputs/portfolio/cxa (headline_metrics.json, ' +
      'top_players_by_cxa.csv, top_teams_by_cxa.csv, feature_driver_summary.csv). Open StatsBomb data. ' +
      'The comparison is against this project’s OWN baseline, not an industry xA incumbent.',
    model: {
      selectedModel: String(headline.selected_model ?? ''),
      promotionStatus: String(headline.promotion_status ?? ''),
      promotionGatePassed: Boolean(headline.promotion_gate_passed),
      selectedFeatureCount: Number(headline.selected_feature_count),
      actionRowCount: Number(headline.action_row_count),
      totalDiagnosticCxa: Number(headline.total_diagnostic_cxa),
      meanPredictedProbability: Number(headline.mean_predicted_probability),
      probabilityMin: Number(headline.probability_min),
      probabilityMax: Number(headline.probability_max),
      topFeatureDriver: headline.top_feature_driver ?? null,
      topFeatureGroupDriver: headline.top_feature_group_driver ?? null,
    },
    metrics,
    players,
    teams,
    drivers,
  });
}

/* ------------------------------------------------------------------ */
/* 2. FORECAST  (employment aggregates from MASTER_PROFILE, no repo)   */
/* ------------------------------------------------------------------ */
/**
 * No raw series exist. These are the defensible aggregate deltas only. Do not synthesise time series.
 * All values traced to MASTER_PROFILE.md.
 */
function buildForecast() {
  write('forecast.json', {
    provenance: 'E.ON and Manor Park are professional results; UoB is the MSc capstone. Aggregate deltas only.',
    eon: {
      label: 'E.ON residual-load forecasting',
      series: [
        { metric: 'Forward curve, far seasons', unit: '%', improvement: 15 },
        { metric: 'Forward curve, near seasons', unit: '%', improvement: 9.7 },
        { metric: 'Christmas-period demand RMSE', unit: '%', improvement: 18 },
      ],
      note:
        'Residual-load framework improved forward-curve accuracy on both near and far seasons; the ' +
        'Christmas-period fix followed a holiday-specific error diagnosis. Relative improvements only, ' +
        'against an internal baseline.',
    },
    manorPark: {
      label: 'Manor Park multi-horizon demand',
      series: [
        { metric: 'Weekly', unit: '%', improvement: 28 },
        { metric: 'Monthly', unit: '%', improvement: 19 },
        { metric: 'Quarterly', unit: '%', improvement: 37 },
      ],
      note: 'Across ~7,000 SKUs (Shopify, Amazon, eBay, The Range).',
    },
    uob: {
      label: 'UoB attendance forecasting (MAE, lower is better; counts not %)',
      series: [
        { category: 'Cardio', before: 23.8, after: 11.2 },
        { category: 'Holistic', before: 26.5, after: 13.4 },
        { category: 'Toning', before: 14.3, after: 10.3 },
      ],
      note: 'GridSearchCV Random Forest vs classical baselines on out-of-sample MAE.',
    },
  });
}

/* ------------------------------------------------------------------ */
/* 3. SHOT-MAP SAMPLE  (opponent-adjusted-metrics; outputs/ gitignored) */
/* ------------------------------------------------------------------ */
/**
 * Shot-level predictions are not committed. Provide a real export via SHOTS_EXPORT (§7.1 schema).
 * If absent, write a marker so the demo renders a "coming soon" state. NEVER fabricate shots.
 */
type Shot = {
  id: string;
  x: number;
  y: number;
  team: string;
  match: string;
  cxg: number;
  statsbomb_xg: number;
  goal: 0 | 1;
  distance: number;
  angle: number;
  pressure: boolean;
  game_state: string;
};

function buildShots() {
  if (!SHOTS_EXPORT || !existsSync(SHOTS_EXPORT)) {
    ok('SHOTS_EXPORT not set or file missing -> writing { available: false } (demo shows "coming soon").');
    write('shots.sample.json', {
      available: false,
      provenance:
        'Shot-level CxG predictions are gitignored in opponent-adjusted-metrics. Export ~200-400 shots to ' +
        'enable this demo. Aggregate AUCs (0.809 vs StatsBomb 0.820) come from committed docs and are shown ' +
        'regardless.',
      shots: [],
    });
    return;
  }
  const raw = JSON.parse(readFileSync(SHOTS_EXPORT, 'utf8'));
  const arr: unknown[] = Array.isArray(raw) ? raw : (raw.shots ?? []);
  if (!Array.isArray(arr) || arr.length === 0) fail(`SHOTS_EXPORT ${SHOTS_EXPORT} contained no shots`);
  const required: (keyof Shot)[] = [
    'id', 'x', 'y', 'team', 'match', 'cxg', 'statsbomb_xg', 'goal', 'distance', 'angle', 'pressure', 'game_state',
  ];
  arr.forEach((s, i) => {
    for (const k of required) {
      if ((s as Record<string, unknown>)[k] === undefined)
        fail(`shot ${i} in ${SHOTS_EXPORT} is missing field "${k}"`);
    }
  });
  write('shots.sample.json', {
    available: true,
    provenance: `Sample of ${arr.length} real shots from the CxG diagnostic model. Full set in the repo.`,
    shots: arr as Shot[],
  });
}

/* ------------------------------------------------------------------ */
function main() {
  ok(`REPO_ROOT = ${REPO_ROOT ?? '(unset)'}`);
  buildForecast(); // always safe
  buildUplift(); // fails loudly if the committed CSV is absent
  buildCxa(); // fails loudly if the CxA portfolio export is absent
  buildShots(); // graceful "coming soon" if no export
  ok('done. Commit the generated data/*.json so Vercel builds without the repos.');
}

main();
