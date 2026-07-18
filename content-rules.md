# CONTENT RULES — non-negotiable

These rules carry the same fail-closed discipline as the CV pipeline. Read this before writing any copy,
metric, or demo. A false claim reaching the site is the failure this file exists to prevent.

1. **`MASTER_PROFILE.md` is the only factual source.** If a claim is not traceable to it, it does not ship.
   If unsure, remove it and flag it. Never resolve a gap by asserting a fact.
2. **Never invent, infer, or strengthen** a fact, metric, skill, status or title. Fail closed.
3. **Titles are exact.** Only Manor Park carries "Data Scientist". E.ON = Market Analyst / Costing & Risk
   Intern. UoB = Business Analytics Consultant. Infosys = Systems Engineer.
4. **Illustrative figures are never shown as measured headline metrics.** The ~£115k forecast-variance figure
   and the ROAS worked examples are interview narrative only. The ~£78k Manor Park figure is "analysis
   associated with ~£78k incremental revenue", never a causal or headline claim (no holdout test existed).
5. **Per-repo NEVER-claim list, enforced:**
   - `opponent-adjusted-metrics`: NEVER headline LightGBM or "gradient boosting" as the tech. Models are
     scikit-learn LogisticRegression / Ridge / GradientBoostingClassifier. NEVER claim plotly. (The repo
     README says "LightGBM classifier" and lists CxA as "planned"; the code and committed results say
     otherwise. Follow the code. Fix the README.)
   - `contextual-football-metrics`: NEVER claim catboost, captum, plotly, kaleido, pydantic,
     imbalanced-learn, a DVC-tracked pipeline, or CI. Cloud/GPU is documented setup only, never exercised.
   - `bet-intelligence`: NEVER claim xgboost, statsmodels, plotly, or any positive market edge. The negative
     result IS the asset. Best config +6.72% ROI over 118 bets; most configs negative; zero bets in 2023/24.
   - `retail-intelligence`: real two-stage X-learner + LightGBM (genuinely used). Synthetic data throughout.
     Figures demonstrate method, not a measured commercial outcome.
   - `retail-analytics` (HealthBeauty360): NEVER claim Isolation Forest, Prophet, XGBoost, Mann-Kendall,
     SHAP, Great Expectations, dbt, BigQuery, Cloud Run, or GitHub Actions CI. Real: Docker, a PSI/KS/chi2
     drift monitor, FastAPI, Ridge demand model, K-Means RFM. AI-scaffolded synthetic-data demo.
   - `energy-market-tracker`: ELEXON only. NEVER claim ENTSO-E / EIA / Nord Pool, source fallback, mock
     mode, Prophet, or any forecasting accuracy number (the forecasting notebook has a target-leakage bug).
   - `sales-insight-agent`: NEVER claim LLM, GenAI, LangGraph, or semantic/vector RAG. It is a deterministic
     keyword-routed multi-tool agent with a TF-overlap retriever. (The GitHub tagline oversells; the README
     is honest. Fix the tagline.)
   - `defensive-actions-expected`: in development. NO model metric may be quoted. The integrity story (archived
     compromised results, enforced leakage guard, CI leakage smoke test) is the asset.
   - `between-lines-availability`: architecture only, never results. Nothing has been run.
6. **Demos must not render invented data.** If a real export is unavailable, ship a labelled documented sample
   or a "coming soon" state. Never fabricate coordinates, predictions, or series.
7. **Where AI-assisted scaffolding is real, state it.** Frame2Threat: 11 of 16 commits by `copilot-swe-agent`.
   Do not claim solo end-to-end authorship of a scaffold. Reviewers can read commit history.
8. **Style:** British English. No em dashes. Never claim a model or document is error-free; report what was
   checked and what is uncertain.
9. **Only the four clean repos may be linked:** `opponent-adjusted-metrics`, `retail-intelligence`,
   `contextual-football-metrics`, `sales-insight-agent`. Others are described without a clickable link.
