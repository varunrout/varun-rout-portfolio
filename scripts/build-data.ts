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
      note: 'Residual RMSE improved ~0.3 to 0.5 GWh/h; Christmas fix ~0.35 GWh/h. Correlation ~0.84.',
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
  buildShots(); // graceful "coming soon" if no export
  ok('done. Commit the generated data/*.json so Vercel builds without the repos.');
}

main();
