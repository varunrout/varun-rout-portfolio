// content/projects.ts
// Source of truth for project cards, /work/[slug] pages, OG images.
// Every value traces to MASTER_PROFILE.md. See content-rules.md before editing.
// British English. No em dashes.

export type Metric = {
  label: string;
  value: string; // pre-formatted, e.g. "0.809 AUC" — never compute fake precision at render time
  benchmark?: string; // the incumbent/baseline, e.g. "vs StatsBomb 0.820"
  measured: boolean; // true = defensible result; false = illustrative (NEVER shown as a headline metric)
};

export type ProjectState = 'live' | 'professional' | 'in-development';
export type Dataset = 'real' | 'synthetic' | 'open' | 'mixed';
export type DemoKey = 'shotmap' | 'uplift' | 'forecast' | 'scorecard';

export type Project = {
  slug: string;
  title: string;
  kicker: string;
  role: string;
  state: ProjectState;
  featured: boolean; // true = one of the 5 home hero cards
  dataset: Dataset;
  summary: string; // 2 lines
  metrics: Metric[];
  stack: string[];
  repo?: string; // ONLY the four clean repos (see content-rules.md rule 9)
  demo?: DemoKey;
  provenanceNote?: string;
  neverClaim?: string[]; // machine-readable mirror of content-rules.md rule 5
};

export const projects: Project[] = [
  // ---------- FEATURED (5) ----------
  {
    slug: 'residual-load-forecasting',
    title: 'Residual-Load Forecasting & Price Curves',
    kicker: 'Energy markets · production',
    role: 'Quantitative Market Analyst · E.ON Energy Markets · 2025',
    state: 'professional',
    featured: true,
    dataset: 'real',
    summary:
      'Rebuilt hourly power forecasting around a residual-load framework (demand net of wind and solar), ' +
      'benchmarked against the previous demand-based methodology and monitored for drift in production.',
    metrics: [
      { label: 'Forward curve', value: '+15% far / +9.7% near', benchmark: 'vs previous methodology', measured: true },
      { label: 'Christmas fix', value: 'RMSE -18%', benchmark: 'vs pre-fix', measured: true },
      { label: 'Signal', value: 'Strong residual-demand/price relationship', measured: true },
    ],
    stack: ['Azure ML Studio', 'Azure DevOps', 'Python', 'Power BI', 'Drift detection', 'Time-series'],
    demo: 'forecast',
    provenanceNote:
      'Professional work at E.ON Energy Markets. Methodology and relative improvements only: no E.ON data, ' +
      'code, models, absolute error figures or commercially sensitive parameters are published here.',
    neverClaim: [
      'No absolute forecast error, volume or price figures are disclosed.',
      'Improvements are relative to an internal baseline that is deliberately not characterised.',
      'No E.ON code, data or model artefacts are shared; none of this work is reproducible from this site.',
    ],
  },
  {
    slug: 'opponent-adjusted-metrics',
    title: 'Opponent-Adjusted Football Metrics',
    kicker: 'Football analytics · flagship',
    role: 'Independent research · 8 months of active development',
    state: 'live',
    featured: true,
    dataset: 'open',
    summary:
      'Contextual expected goals (CxG) and assists (CxA) over 2,143,146 raw StatsBomb events, benchmarked ' +
      "directly against StatsBomb's own xG on the same shots rather than self-reported in isolation.",
    metrics: [
      { label: 'CxG model', value: '0.80920 AUC', benchmark: 'vs StatsBomb xG 0.81957', measured: true },
      { label: 'CxG calibration', value: 'Brier 0.07325 · log loss 0.26110', measured: true },
      { label: 'CxA baseline', value: '0.85814 AUC · Brier 0.04046', benchmark: 'over 1,091,388 rows', measured: true },
      { label: 'Testing', value: '332 tests across 46 files', measured: true },
    ],
    stack: ['scikit-learn', 'FastAPI', 'PostgreSQL', 'SQLAlchemy', 'Alembic', 'CI: lint+type+test'],
    repo: 'https://github.com/varunrout/opponent-adjusted-metrics',
    demo: 'shotmap',
    provenanceNote:
      'Computed outputs are gitignored; the numbers above live in committed docs, not rendered dashboards.',
    neverClaim: ['LightGBM as headline tech', 'gradient boosting as headline tech', 'plotly'],
  },
  {
    slug: 'retail-growth-intelligence',
    title: 'Retail Growth Intelligence — Uplift Modelling',
    kicker: 'Causal ML · the rare one',
    role: 'Independent research · synthetic data',
    state: 'live',
    featured: true,
    dataset: 'synthetic',
    summary:
      'A genuine two-stage X-learner for campaign uplift with control-arm up-weighting and per-campaign ' +
      'propensity blending. Committed outputs, unlike most of the portfolio.',
    metrics: [
      { label: 'Overall ATE', value: '0.0444', measured: true },
      { label: 'Top decile', value: '0.0754 (~1.7x average)', measured: true },
      { label: 'Qini-like area', value: '744.8', measured: true },
      { label: 'Rank corr.', value: 'Spearman 0.406', measured: true },
    ],
    stack: ['X-learner', 'LightGBM', 'DuckDB', 'Qini / uplift deciles', 'PCA segmentation'],
    repo: 'https://github.com/varunrout/retail-intelligence',
    demo: 'uplift',
    provenanceNote: 'Synthetic data throughout. Figures demonstrate method, not a measured commercial outcome.',
  },
  {
    slug: 'multi-horizon-demand-forecasting',
    title: 'Multi-Horizon Demand Forecasting',
    kicker: 'Retail · demand forecasting',
    role: 'Data Scientist · Manor Park Trading Company · 2024',
    state: 'professional',
    featured: true,
    dataset: 'real',
    summary:
      'Demand forecasting across ~7,000 SKUs over Shopify, Amazon, eBay and The Range at three horizons, ' +
      'paired with a seven-cluster customer and product segmentation.',
    metrics: [
      { label: 'Accuracy', value: '+28% weekly · +19% monthly · +37% quarterly', measured: true },
      { label: 'Segmentation', value: 'Seven clusters for prioritisation', measured: true },
      { label: 'Campaign test', value: '~7% ROAS', benchmark: 'vs a randomly assigned holdout group', measured: true },
      { label: 'Associated revenue', value: '~£78k, association only', measured: true },
      { label: 'Reporting', value: 'Automation cut per-draft time ~50%', measured: true },
    ],
    stack: ['Python', 'Forecasting', 'Clustering', 'Randomised holdout testing', 'Campaign analytics'],
    demo: 'forecast',
    provenanceNote:
      'Two separate claims, deliberately kept apart. The ~7% ROAS improvement was measured against a ' +
      'randomly assigned control group held back while the new segment-based targeting ran concurrently, ' +
      'so it is a controlled comparison. The ~£78k is not: it is revenue associated with the analysis with ' +
      'no holdout behind it, and is never a causal claim.',
    neverClaim: [
      'The holdout covered the campaign targeting test only. It does not make the ~£78k a causal figure.',
      'No sample size, split ratio, test duration, statistical power, MDE, p-value or number of variants is published, because none is on file.',
    ],
  },
  {
    slug: 'frame2threat',
    title: 'Frame2Threat — Possession-Danger Prediction',
    kicker: 'Football analytics · deep learning',
    role: 'Independent research · StatsBomb open data',
    state: 'live',
    featured: true,
    dataset: 'open',
    summary:
      'Predicts possession danger from partial event sequences with an XGBoost + GRU ensemble, a graph ' +
      'neural network (SAGEConv) and a SHAP explanation layer. Executed notebooks and 49 committed figures.',
    metrics: [
      { label: 'Ensemble', value: '0.965 AUC (n=2,475)', measured: true },
      { label: 'Components', value: 'PossessionGRU 0.9524 · XGBoost 0.9505', measured: true },
      { label: 'Pass-level', value: '0.882 AUC (n=7,344)', measured: true },
      { label: 'Honesty', value: '360 context adds only +0.001 AUC', measured: true },
    ],
    stack: ['XGBoost', 'PyTorch GNN', 'GRU', 'SHAP', 'StatsBomb'],
  },

  // ---------- FURTHER PROJECTS ----------
  {
    slug: 'contextual-football-metrics',
    title: 'Contextual Football Metrics',
    kicker: 'Football · live repo',
    role: 'CxG / CxA / CxT training pipeline',
    state: 'live',
    featured: false,
    dataset: 'open',
    summary:
      'A single Prefect flow under one MLflow parent run, with a model ladder from baseline through GLM to ' +
      'boosting and neural, and a from-scratch graph-attention encoder in plain PyTorch.',
    metrics: [
      { label: 'Contextual GLM', value: '0.8131 AUC · Brier 0.06669', benchmark: 'vs logistic 0.7982', measured: true },
      { label: 'Validation', value: '5-fold CV 0.8083', measured: true },
      { label: 'Testing', value: '560 tests', measured: true },
    ],
    stack: ['Prefect', 'MLflow', 'PyTorch', '560 tests'],
    repo: 'https://github.com/varunrout/contextual-football-metrics',
    neverClaim: ['catboost', 'captum', 'plotly', 'kaleido', 'pydantic', 'imbalanced-learn', 'DVC-tracked pipeline', 'CI'],
  },
  {
    slug: 'football-market-intelligence',
    title: 'Football Market Intelligence',
    kicker: 'Football · honest result',
    role: 'Betting-market modelling & backtest',
    state: 'live',
    featured: false,
    dataset: 'real',
    summary:
      'An honest negative result. The custom models do not beat the market, and it says so. Built with ' +
      'walk-forward CV, isotonic calibration and explicit feature-leakage and temporal-split tests.',
    metrics: [
      { label: 'Best config', value: '+6.72% ROI over 118 bets (Market LR, Pinnacle)', measured: true },
      { label: 'Reality', value: 'Most configs negative; zero bets in 2023/24 on a structural break', measured: true },
      { label: 'Testing', value: '80 tests incl. leakage and temporal-split', measured: true },
    ],
    stack: ['DuckDB', 'Walk-forward CV', 'Isotonic calibration', 'Leakage tests'],
    neverClaim: ['xgboost', 'statsmodels', 'plotly', 'any positive market edge'],
  },
  {
    slug: 'defensive-actions-expected',
    title: 'Defensive Actions Expected',
    kicker: 'Football · in development',
    role: 'Methodology-first modelling',
    state: 'in-development',
    featured: false,
    dataset: 'open',
    summary:
      'Notable for what it refuses to claim. Compromised v0-v9 results were archived rather than presented. ' +
      'Ships an enforced leakage-classification guard checked in CI. No model metric is quoted, deliberately.',
    metrics: [
      { label: 'Guardrails', value: 'CI matrix 3.10-3.12 + leakage smoke test', measured: true },
      { label: 'Testing', value: '195 tests', measured: true },
    ],
    stack: ['CI matrix', 'Leakage guard', 'MLflow', '195 tests'],
    neverClaim: ['any model accuracy or AUC metric', 'player DAx ranking'],
  },
  {
    slug: 'sales-insight-agent',
    title: 'Sales Insight Agent',
    kicker: 'Engineering · live repo',
    role: 'Deterministic multi-tool analytics agent',
    state: 'live',
    featured: false,
    dataset: 'synthetic',
    summary:
      'A deterministic, keyword-routed multi-tool agent (forecast / visualise / analyse / search) over ' +
      'synthetic sales data, with a real HistGradientBoosting/RandomForest forecasting tool and a ' +
      'term-frequency keyword-overlap retriever. An engineering-discipline example.',
    metrics: [
      { label: 'Testing', value: '90 tests across 8 files', measured: true },
      { label: 'CI', value: 'Real GitHub Actions pipeline', measured: true },
    ],
    stack: ['scikit-learn', 'GitHub Actions', '90 tests'],
    repo: 'https://github.com/varunrout/sales-insight-agent',
    neverClaim: ['LLM', 'GenAI', 'LangGraph', 'semantic/vector RAG'],
  },
  {
    slug: 'attendance-forecasting',
    title: 'Attendance Forecasting & Prioritisation',
    kicker: 'Consulting · MSc capstone',
    role: 'UoB Sport & Fitness · 2024',
    state: 'professional',
    featured: false,
    dataset: 'real',
    summary:
      'Benchmarked SARIMA, Prophet, Holt-Winters and Random Forest across six categories on out-of-sample ' +
      'MAE; a tuned Random Forest roughly halved error on the hardest categories. Paired with ABC/Pareto ' +
      'prioritisation. Genuine model-selection rigour, not optimisation.',
    metrics: [
      { label: 'Cardio MAE', value: '23.8 to 11.2', measured: true },
      { label: 'Holistic MAE', value: '26.5 to 13.4', measured: true },
      { label: 'Driver', value: 'Previous-week bookings strongest predictor', measured: true },
    ],
    stack: ['SARIMA', 'Prophet', 'Random Forest', 'Pareto/ABC'],
  },
  {
    slug: 'network-charge-monte-carlo',
    title: 'Network-Charge Forecasting & Monte Carlo',
    kicker: 'Energy · risk',
    role: 'Costing & Risk Intern · E.ON · 2024',
    state: 'professional',
    featured: false,
    dataset: 'real',
    summary:
      'A half-hourly DUoS/TNUoS network-charge forecasting engine improving accuracy ~23% over the prior ' +
      'approach, plus a 10,000-run Monte Carlo for P5/P50/P95 cost outcomes and migration of legacy ' +
      'processes into governed Python, SQL and Snowflake.',
    metrics: [
      { label: 'Accuracy', value: '~23% improvement vs prior approach', measured: true },
      { label: 'Risk', value: '10,000-run Monte Carlo, P5/P50/P95', measured: true },
      { label: 'Automation', value: 'Saved ~6 to 7 hours per reporting cycle', measured: true },
    ],
    stack: ['Python', 'SQL', 'Snowflake', 'Monte Carlo'],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const furtherProjects = projects.filter((p) => !p.featured);
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
