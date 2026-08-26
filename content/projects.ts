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
export type DemoKey = 'shotmap' | 'uplift' | 'forecast' | 'scorecard' | 'contextual' | 'climate' | 'availability';

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
  repo?: string; // ONLY the six clean repos (see content-rules.md rule 9)
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
      { label: 'CxG model (FastAPI era)', value: '0.80920 AUC', benchmark: 'vs StatsBomb xG 0.81957', measured: true },
      { label: 'CxG calibration', value: 'Brier 0.07325 · log loss 0.26110', measured: true },
      { label: 'CxA baseline', value: '0.85814 AUC · Brier 0.04046', benchmark: 'over 1,091,388 rows', measured: true },
      { label: 'CxG event-wide v3 (GCP era)', value: '0.7148 AUC', benchmark: 'vs StatsBomb xG 0.7972', measured: true },
      { label: 'CxG+ v3 (GCP era)', value: '0.8313 AUC · log loss 0.2555', benchmark: 'vs StatsBomb xG 0.8476', measured: true },
      { label: 'Testing', value: '332 tests across 46 files', measured: true },
    ],
    stack: ['scikit-learn', 'FastAPI', 'PostgreSQL', 'SQLAlchemy', 'Alembic', 'GCP: GCS + BigQuery', 'Terraform', 'CI: lint+type+test'],
    repo: 'https://github.com/varunrout/opponent-adjusted-metrics',
    demo: 'shotmap',
    provenanceNote:
      'Computed outputs are gitignored; the FastAPI-era numbers above live in committed docs, not rendered ' +
      'dashboards. The GCP-era v3 figures are independently BigQuery-verified (queried directly, not taken ' +
      'from project docs) from the 2026-08 productionisation phase onto Cloud Storage + BigQuery, and both ' +
      'eras are shown together rather than one replacing the other.',
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
      { label: 'Overall ATE', value: '0.0444 mean response-rate uplift', measured: true },
      { label: 'Top decile', value: '0.0754 (~1.7x average)', measured: true },
      { label: 'Qini-like area', value: '744.8', benchmark: 'vs 502 baseline', measured: true },
      { label: 'Churn ROC-AUC', value: '0.844', benchmark: 'vs LightGBM 0.812, paired bootstrap', measured: true },
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
      { label: 'Validation', value: 'Match-level split, so no possession spans train and test', measured: true },
      { label: 'Components', value: 'PossessionGRU 0.9524 · XGBoost 0.9505', measured: true },
      { label: 'Pass-level', value: '0.882 AUC (n=7,344)', measured: true },
      { label: 'Honesty', value: '360 context adds only +0.001 AUC', measured: true },
    ],
    stack: ['XGBoost', 'PyTorch GNN', 'GRU', 'SHAP', 'StatsBomb'],
    neverClaim: [
      'Not a production tracking-data model: StatsBomb open data with partial 360 coverage.',
    ],
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
      { label: 'Honesty', value: 'Season-level CxA ranks assist-makers weakly: Spearman 0.39 vs CxG 0.69 for goals', measured: true },
      { label: 'Testing', value: '560 tests · CI with an enforced coverage floor', measured: true },
    ],
    stack: ['Prefect', 'MLflow', 'PyTorch', 'GitHub Actions CI', '560 tests'],
    repo: 'https://github.com/varunrout/contextual-football-metrics',
    demo: 'contextual',
    neverClaim: ['catboost', 'captum', 'plotly', 'kaleido', 'pydantic', 'imbalanced-learn', 'DVC-tracked pipeline', 'cloud/GPU training'],
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
      'synthetic sales data. Retrieval is genuinely semantic (Chroma vector store, MiniLM embeddings, ' +
      'cosine nearest-neighbour), the forecasting tool is a real gradient-boosting regressor, and there ' +
      'is no LLM anywhere in it.',
    metrics: [
      { label: 'Honesty', value: '80% prediction intervals reach only 72-75% coverage; the repo says they are too narrow', measured: true },
      { label: 'Retrieval', value: 'Hit-rate@3 8/8 on a judged relevance set', measured: true },
      { label: 'Tool routing', value: '6/7 exact/set match, run in CI', measured: true },
      { label: 'Forecasting', value: 'Beats seasonal-naive on all three series', measured: true },
      { label: 'Testing', value: '90 tests across 8 files, real GitHub Actions CI', measured: true },
    ],
    stack: ['scikit-learn', 'Chroma', 'MiniLM embeddings', 'GitHub Actions', '90 tests'],
    repo: 'https://github.com/varunrout/sales-insight-agent',
    provenanceNote:
      'Synthetic sales data throughout. Retrieval is vector search over embeddings; routing is deterministic ' +
      'keyword matching. There is no LLM, generative model or agent framework in the repository.',
    neverClaim: ['LLM', 'GenAI', 'LangChain', 'LangGraph', 'agentic AI'],
  },
  {
    slug: 'climate-transition-risk-platform',
    title: 'Climate Transition Risk Intelligence Platform',
    kicker: 'Energy & climate · live repo',
    role: 'Independent research · real Azure production deployment',
    state: 'live',
    featured: false,
    dataset: 'real',
    summary:
      'Country-level decarbonisation and transition-risk analytics on public data (Our World in Data, ' +
      'World Bank), with a real Azure production deployment and a published, honestly-undershot coverage finding.',
    metrics: [
      { label: 'Backtest reproduction', value: '0.0262 MAE', benchmark: 'vs documented scratch finding 0.0263', measured: true },
      { label: 'Interval coverage (honesty finding)', value: '76.3% measured', benchmark: 'vs 90% target, 114 splits', measured: true },
      { label: 'Energy-feature gate', value: 'p ≤ 0.10, robust at ±10/20/30% weight perturbation', measured: true },
      { label: 'Reproducibility (v1.0.0)', value: '287 Python tests + 31 frontend tests, independently re-run clean-checkout', measured: true },
      { label: 'Azure footprint', value: '8 resources, independently confirmed via Azure MCP', measured: true },
    ],
    stack: ['Python', 'Terraform', 'Azure Container Apps', 'ADLS Gen2', 'GitHub Actions CI', 'React/TypeScript', 'FastAPI'],
    repo: 'https://github.com/varunrout/climate-transition-risk-platform',
    demo: 'climate',
    provenanceNote:
      'Solo-authored, public, CI-green. A real Azure production deployment (Terraform-managed, least-privilege ' +
      'managed identities, weekly schedule) runs the full pipeline end to end against live storage. The 76.3% ' +
      'interval-coverage figure is reported as an open undercoverage finding, not tuned away, in the same style ' +
      'as the negative results elsewhere in this portfolio.',
    neverClaim: [
      'a completed Power BI/PBIX native report (superseded by the live React/TypeScript dashboard)',
      'real-time, streaming or low-latency serving',
      'regime-aware or recency-weighted forecasting in production (evaluated, explicitly not promoted)',
      'external or paying customers',
      'unqualified "production-grade"',
    ],
  },
  {
    slug: 'player-availability-analysis',
    title: 'Player Availability Analysis',
    kicker: 'Football · methodology, not performance',
    role: 'Independent research · deployed two-service product',
    state: 'live',
    featured: false,
    dataset: 'real',
    summary:
      'Per-player-per-day availability-risk decision support from public subjective athlete-monitoring data. ' +
      'Its headline is process rigour and honest negative results: three pre-registered audits overturned ' +
      'favourable-looking results, including its own promoted champion.',
    metrics: [
      { label: 'Champion (pooled rolling-origin)', value: '0.836 ROC-AUC · AP 0.097 · Brier 0.0063', benchmark: 'vs prevalence-null 0.500', measured: true },
      { label: 'Alert budget, 2.5% review rate', value: '11 of 18 onsets (recall 0.61)', benchmark: '34.8 false alerts per captured onset', measured: true },
      { label: 'Alert budget, 5% review rate', value: '13 of 18 onsets (recall 0.72)', benchmark: '60.4 false alerts per captured onset', measured: true },
      { label: 'Testing', value: '175 tests, GitHub Actions CI on every push', measured: true },
    ],
    stack: ['Python', 'GCP: BigQuery + Cloud Storage', 'FastAPI', 'Next.js', 'Cloud Run', 'GitHub Actions CI'],
    repo: 'https://github.com/varunrout/player-availability-analysis',
    demo: 'availability',
    provenanceNote:
      'Decision support only: not a diagnostic or clearance tool, no causal claims. Deployed as two Cloud Run ' +
      'services behind a shared review credential (never a production authentication claim). The single-use ' +
      'confirmatory final-test ROC-AUC (0.827) rests on five onsets and is barred from ever being cited as a ' +
      'performance figure, by the project’s own governance.',
    neverClaim: [
      '"production" (shared review credential, not production authentication)',
      'real-time or online serving (batch inference; deferred to V2)',
      'the final-test ROC-AUC (0.827) as a performance figure, anywhere',
      'clinical, diagnostic, clearance or causal framing',
      'the review credential itself, in any public document',
    ],
  },
  {
    slug: 'retail-analytics',
    title: 'HealthBeauty360 Retail Analytics',
    kicker: 'Retail · synthetic demo',
    role: 'Independent project · synthetic data',
    state: 'live',
    featured: false,
    dataset: 'synthetic',
    summary:
      'A synthetic-data retail analytics demo: churn, K-Means RFM segmentation, price elasticity, Ridge ' +
      'demand forecasting and PSI/KS drift monitoring, served behind FastAPI in Docker. Every figure is a ' +
      'synthetic-data result.',
    metrics: [
      { label: 'Churn ROC-AUC', value: '0.73', benchmark: 'vs recency rule 0.72; majority 0.50', measured: true },
      { label: 'Price elasticity', value: '5 of 7 categories significant, 95% CIs', measured: true },
      { label: 'Segmentation', value: 'k=4 by swept silhouette (0.25)', measured: true },
      { label: 'Demand forecast', value: 'Beats seasonal-naive on ~77% of SKUs', measured: true },
    ],
    stack: ['Docker', 'FastAPI', 'Ridge', 'K-Means RFM', 'PSI/KS drift', 'Mann-Kendall', 'GitHub Actions CI'],
    provenanceNote:
      'Synthetic data throughout; every figure is a synthetic-data result, not a measured commercial outcome. ' +
      'The absolute forecast error is deliberately not published: the only defensible framing is the relative ' +
      'one, that the forecast beats a seasonal-naive baseline on ~77% of SKUs.',
    neverClaim: [
      'Isolation Forest or anomaly detection',
      'Prophet, XGBoost, SHAP or an ensemble',
      'Great Expectations, a feature store, dbt, BigQuery or Cloud Run',
      'production-grade',
      'the absolute forecast error',
    ],
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
