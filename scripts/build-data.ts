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
 * CONFIRM THESE against the real file header before first run. The audited file is
 * outputs/phase_uplift_v2_model_comparison.csv, but the per-decile table may live in a sibling CSV.
 * Point UPLIFT_CSV at whichever file holds the decile rows, and map the columns here.
 */
const UPLIFT_CSV = join(
  REPO_ROOT ?? '',
  'Retail/retail-intelligence/outputs/phase_uplift_v2_model_comparison.csv',
);
const UPLIFT_COLS = {
  decile: 'decile', // 1..10, 1 = highest predicted uplift
  n: 'n',
  observed_uplift: 'observed_uplift',
  cumulative: 'cumulative_uplift',
  qini: 'qini',
} as const;

type UpliftDecile = {
  decile: number;
  n: number;
  observed_uplift: number;
  cumulative: number;
  qini: number;
};

function buildUplift() {
  if (!REPO_ROOT) fail('REPO_ROOT is not set. Add it to .env.local (see header).');
  if (!existsSync(UPLIFT_CSV)) {
    fail(
      `uplift source not found at ${UPLIFT_CSV}. ` +
        'Point UPLIFT_CSV at the committed decile CSV in retail-intelligence and re-run.',
    );
  }
  const rows: Record<string, string>[] = parse(readFileSync(UPLIFT_CSV, 'utf8'), {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
  const header = Object.keys(rows[0] ?? {});
  for (const col of Object.values(UPLIFT_COLS)) {
    if (!header.includes(col)) {
      fail(
        `column "${col}" missing from ${UPLIFT_CSV}. ` +
          `Found columns: [${header.join(', ')}]. Update UPLIFT_COLS to match the real header.`,
      );
    }
  }
  const num = (v: string, col: string, i: number) => {
    const n = Number(v);
    if (Number.isNaN(n)) fail(`non-numeric "${v}" in column ${col}, row ${i + 1} of ${UPLIFT_CSV}`);
    return n;
  };
  const deciles: UpliftDecile[] = rows.map((r, i) => ({
    decile: num(r[UPLIFT_COLS.decile], UPLIFT_COLS.decile, i),
    n: num(r[UPLIFT_COLS.n], UPLIFT_COLS.n, i),
    observed_uplift: num(r[UPLIFT_COLS.observed_uplift], UPLIFT_COLS.observed_uplift, i),
    cumulative: num(r[UPLIFT_COLS.cumulative], UPLIFT_COLS.cumulative, i),
    qini: num(r[UPLIFT_COLS.qini], UPLIFT_COLS.qini, i),
  }));
  if (deciles.length < 5) fail(`expected a decile table, got ${deciles.length} rows from ${UPLIFT_CSV}`);

  write('uplift-deciles.json', {
    provenance: 'retail-intelligence (synthetic data). Demonstrates method, not a measured commercial outcome.',
    headline: { ate: 0.0444, topDecile: 0.0754, qiniArea: 744.8, spearman: 0.406 },
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
