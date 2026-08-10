// content/metrics.ts
// Source of truth for the Model Scorecard demo (§7.4 of the brief).
// Every row is hand-typed from a COMMITTED result. See content-rules.md before editing.
// A `benchmark` of undefined renders greyed: a metric with nothing to beat is not a win.
// British English. No em dashes.

export type Dataset = 'real' | 'synthetic' | 'open';
export type ModelState = 'live' | 'professional' | 'in-development';

// How `value` (and `benchmark.value`) are formatted. Set explicitly on every row: NEVER inferred from
// the metric name. Sniffing the name for "%" made "Precision @ top 1%" render 0.586 as "+0.586036%".
// 'percent' = a percentage in percent units (37 -> 37%); 'ratio' = a 0-1 quantity shown as a decimal
// (AUC 0.809); 'count' = a plain count (MAE 11.2).
export type MetricUnit = 'percent' | 'ratio' | 'count';

export type ModelMetric = {
  project: string; // matches a Project.title / slug family
  domain: 'football' | 'energy' | 'retail' | 'consulting';
  model: string;
  task: string;
  metric: string; // metric name, e.g. "ROC AUC"
  value: number;
  unit?: MetricUnit; // formatting unit for value/benchmark; set on every row
  benchmark?: { name: string; value: number }; // the incumbent/baseline
  dataset: Dataset;
  tests?: number;
  state: ModelState;
  source: string; // committed file the number came from (for your own traceability, not rendered)
};

export const metrics: ModelMetric[] = [
  // ---------- FOOTBALL ----------
  {
    project: 'Opponent-Adjusted Football Metrics',
    domain: 'football',
    model: 'CxG diagnostic (sklearn logistic/Ridge/GBM)',
    task: 'Contextual expected goals',
    metric: 'ROC AUC',
    value: 0.8092,
    unit: 'ratio',
    benchmark: { name: 'StatsBomb xG', value: 0.81957 },
    dataset: 'open',
    tests: 332,
    state: 'live',
    source: 'docs/modeling/v1_results_summary.md',
  },
  {
    project: 'Opponent-Adjusted Football Metrics',
    domain: 'football',
    model: 'CxG diagnostic',
    task: 'Calibration',
    metric: 'Brier',
    value: 0.07325,
    unit: 'ratio',
    dataset: 'open',
    state: 'live',
    source: 'docs/modeling/v1_results_summary.md',
  },
  // Both CxA rows cite headline_metrics.json as the single source. v1_results_summary.md reports the
  // baseline as 0.85814; the portfolio export reports 0.858312 for the same baseline. One source only.
  {
    project: 'Opponent-Adjusted Football Metrics',
    domain: 'football',
    model: 'CxA baseline',
    task: 'Contextual expected assists',
    metric: 'ROC AUC',
    value: 0.858312,
    unit: 'ratio',
    dataset: 'open',
    state: 'live',
    source: 'outputs/portfolio/cxa/headline_metrics.json (1,091,388 action rows)',
  },
  {
    project: 'Opponent-Adjusted Football Metrics',
    domain: 'football',
    model: 'CxA diagnostic v1 (sklearn GradientBoostingClassifier, sigmoid-calibrated)',
    task: 'Contextual expected assists',
    metric: 'ROC AUC',
    value: 0.866247,
    unit: 'ratio',
    // Internal baseline, NOT an industry incumbent: no off-the-shelf expected-assists model exists.
    benchmark: { name: 'Own CxA baseline', value: 0.858312 },
    dataset: 'open',
    state: 'live',
    source: 'outputs/portfolio/cxa/headline_metrics.json (provisionally promoted)',
  },
  {
    project: 'Opponent-Adjusted Football Metrics',
    domain: 'football',
    model: 'CxA diagnostic v1',
    task: 'Precision among the model’s most confident actions',
    metric: 'Precision @ top 1%',
    // Stored in percent units so it renders as 58.6% not 0.586. headline_metrics.json holds the ratios
    // 0.5860363 (diagnostic) and 0.4627084 (baseline); x100 here.
    value: 58.60363,
    unit: 'percent',
    benchmark: { name: 'Own CxA baseline', value: 46.27084 },
    dataset: 'open',
    state: 'live',
    source: 'outputs/portfolio/cxa/headline_metrics.json',
  },
  {
    project: 'Contextual Football Metrics',
    domain: 'football',
    model: 'Contextual GLM',
    task: 'Contextual expected goals',
    metric: 'ROC AUC (heldout)',
    value: 0.8131,
    unit: 'ratio',
    benchmark: { name: 'Logistic baseline', value: 0.7982 },
    dataset: 'open',
    tests: 560,
    state: 'live',
    source: 'reports/cxg_training_summary.json',
  },
  {
    project: 'Contextual Football Metrics',
    domain: 'football',
    model: 'Contextual GLM',
    task: 'Cross-validation',
    metric: '5-fold CV AUC',
    value: 0.8083,
    unit: 'ratio',
    dataset: 'open',
    state: 'live',
    source: 'reports/cxg_training_summary.json',
  },
  {
    project: 'Frame2Threat',
    domain: 'football',
    model: 'XGBoost + GRU ensemble',
    task: 'Possession-danger prediction',
    metric: 'ROC AUC (test)',
    value: 0.965,
    unit: 'ratio',
    dataset: 'open',
    tests: 69,
    state: 'live',
    source: 'models/results_summary.json (n_test=2475)',
  },
  {
    project: 'Frame2Threat',
    domain: 'football',
    model: 'PossessionGRU',
    task: 'Possession-danger prediction',
    metric: 'ROC AUC',
    value: 0.9524,
    unit: 'ratio',
    dataset: 'open',
    state: 'live',
    source: 'models/results_summary.json',
  },
  {
    project: 'Frame2Threat',
    domain: 'football',
    model: 'XGBoost (event+360)',
    task: 'Pass-level line-breaking',
    metric: 'ROC AUC',
    value: 0.882,
    unit: 'ratio',
    dataset: 'open',
    state: 'live',
    source: 'models/results_summary.json (n_test=7344)',
  },
  // Football Market Intelligence: intentionally NO metric row (removed 2026-08-10, Varun's ruling).
  // The best-config +6.72% ROI over 118 bets is a positive market edge, which content-rules rule 5 and
  // MASTER_PROFILE 4c bar for bet-intelligence, and which contradicted the rigour manifesto on the same
  // page. The honest negative result lives on the football-market-intelligence project card instead.
  // Do not add a row here, on the defensive-actions-expected precedent.
  // defensive-actions-expected: intentionally NO metric row. Data-completeness only, no AUC. Do not add one.

  // ---------- RETAIL ----------
  {
    project: 'Retail Growth Intelligence',
    domain: 'retail',
    model: 'Two-stage X-learner (LightGBM stage 2)',
    task: 'Uplift / campaign targeting',
    metric: 'Overall ATE',
    value: 0.0444,
    unit: 'ratio',
    dataset: 'synthetic',
    tests: 7,
    state: 'live',
    source: 'outputs/phase_uplift_v2_model_comparison.csv',
  },
  {
    project: 'Retail Growth Intelligence',
    domain: 'retail',
    model: 'Two-stage X-learner',
    task: 'Uplift / campaign targeting',
    metric: 'Top-decile uplift',
    value: 0.0754,
    unit: 'ratio',
    benchmark: { name: 'Overall ATE', value: 0.0444 },
    dataset: 'synthetic',
    state: 'live',
    source: 'outputs/phase_uplift_v2_model_comparison.csv',
  },
  {
    project: 'Retail Growth Intelligence',
    domain: 'retail',
    model: 'Two-stage X-learner',
    task: 'Uplift ranking quality',
    metric: 'Spearman rank corr.',
    value: 0.406,
    unit: 'ratio',
    dataset: 'synthetic',
    state: 'live',
    source: 'outputs/phase_uplift_v2_model_comparison.csv',
  },
  {
    project: 'Multi-Horizon Demand Forecasting',
    domain: 'retail',
    model: 'Demand forecaster',
    task: 'Quarterly SKU demand (~7,000 SKUs)',
    metric: 'Accuracy improvement %',
    value: 37,
    unit: 'percent',
    benchmark: { name: 'Previous approach', value: 0 },
    dataset: 'real',
    state: 'professional',
    source: 'MASTER_PROFILE.md (Manor Park; +28% weekly, +19% monthly, +37% quarterly)',
  },

  // ---------- ENERGY ----------
  {
    project: 'Residual-Load Forecasting',
    domain: 'energy',
    model: 'Residual-load framework',
    task: 'Forward price-curve accuracy (far seasons)',
    metric: 'Improvement %',
    value: 15,
    unit: 'percent',
    benchmark: { name: 'Previous methodology', value: 0 },
    dataset: 'real',
    state: 'professional',
    source: 'MASTER_PROFILE.md (E.ON; +15% far, +9.7% near)',
  },
  {
    project: 'Residual-Load Forecasting',
    domain: 'energy',
    model: 'Residual-load framework',
    task: 'Christmas-period demand RMSE',
    metric: 'RMSE reduction %',
    value: 18,
    unit: 'percent',
    benchmark: { name: 'Pre-fix', value: 0 },
    dataset: 'real',
    state: 'professional',
    source: 'MASTER_PROFILE.md (E.ON; Christmas-period RMSE reduction)',
  },
  {
    project: 'Network-Charge Forecasting',
    domain: 'energy',
    model: 'DUoS/TNUoS forecasting engine',
    task: 'Network-charge forecast accuracy',
    metric: 'Improvement %',
    value: 23,
    unit: 'percent',
    benchmark: { name: 'Prior internal approach', value: 0 },
    dataset: 'real',
    state: 'professional',
    source: 'MASTER_PROFILE.md (E.ON Costing & Risk)',
  },

  // ---------- CONSULTING ----------
  {
    project: 'Attendance Forecasting',
    domain: 'consulting',
    model: 'GridSearchCV Random Forest',
    task: 'Cardio attendance forecast (out-of-sample)',
    metric: 'MAE',
    value: 11.2,
    unit: 'count',
    benchmark: { name: 'Pre-tuning MAE', value: 23.8 },
    dataset: 'real',
    state: 'professional',
    source: 'capstone-uob (MAE counts, not %)',
  },
  {
    project: 'Attendance Forecasting',
    domain: 'consulting',
    model: 'GridSearchCV Random Forest',
    task: 'Holistic attendance forecast (out-of-sample)',
    metric: 'MAE',
    value: 13.4,
    unit: 'count',
    benchmark: { name: 'Pre-tuning MAE', value: 26.5 },
    dataset: 'real',
    state: 'professional',
    source: 'capstone-uob',
  },
];

// Note on MAE rows: lower is better and they are counts, not percentages. The scorecard must not render MAE
// with a "%" and must not sort MAE the same direction as AUC/ROI. Flag metric direction in the table config.
export const metricDirection: Record<string, 'higher-better' | 'lower-better'> = {
  'ROC AUC': 'higher-better',
  'ROC AUC (heldout)': 'higher-better',
  'ROC AUC (test)': 'higher-better',
  '5-fold CV AUC': 'higher-better',
  Brier: 'lower-better',
  'Precision @ top 1%': 'higher-better',
  MAE: 'lower-better',
  'Overall ATE': 'higher-better',
  'Top-decile uplift': 'higher-better',
  'Spearman rank corr.': 'higher-better',
  'Accuracy improvement %': 'higher-better',
  'Improvement %': 'higher-better',
  'RMSE reduction %': 'higher-better',
};
