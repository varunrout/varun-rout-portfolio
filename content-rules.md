# CONTENT RULES — non-negotiable

These rules carry the same fail-closed discipline as the CV pipeline. Read this before writing any copy,
metric, or demo. A false claim reaching the site is the failure this file exists to prevent.

1. **`MASTER_PROFILE.md` is the only factual source.** If a claim is not traceable to it, it does not ship.
   If unsure, remove it and flag it. Never resolve a gap by asserting a fact.
2. **Never invent, infer, or strengthen** a fact, metric, skill, status or title. Fail closed.
3. **Titles are exact.** Only Manor Park carries "Data Scientist". E.ON = **Quantitative Market Analyst /
   Quantitative Research Intern**. UoB = Business Analytics Consultant. Infosys = Systems Engineer.

   > CORRECTED 2026-08-10 on Varun's ruling. This rule previously read "E.ON = Market Analyst / Costing &
   > Risk Intern", which disagreed with `MASTER_PROFILE.md` section 3 and `evidence_register.json`'s
   > `allowed_titles`. Per rule 1 the profile is the only factual source, so this file was wrong. The old
   > titles shipped to the live site and were caught when a CV built from the profile contradicted the
   > site it links to. `RULES.md` section 3 in the CV pipeline carried the identical stale prose and was
   > corrected the same day.
4. **Illustrative figures are never shown as measured headline metrics.** The ~£115k forecast-variance figure
   and the ROAS worked examples are interview narrative only. The ~£78k Manor Park figure is "analysis
   associated with ~£78k incremental revenue", never a causal or headline claim: there is no holdout behind
   that figure.

   **Do NOT extend that caveat to the ~7% ROAS.** Corrected 2026-08-10: `MASTER_PROFILE.md` section 3
   records a randomised holdout with a concurrently run control as the source of the ~7% figure, so it is a
   controlled comparison and may be stated as one. The two claims are deliberately separate and the holdout
   must never be used to upgrade the ~£78k. Never publish a sample size, split ratio, duration, statistical
   power, MDE, p-value or number of variants for that test, because none is on file.
5. **Per-repo NEVER-claim list, enforced:**
   - `opponent-adjusted-metrics`: NEVER headline LightGBM or "gradient boosting" as the tech. Models are
     scikit-learn LogisticRegression / Ridge / GradientBoostingClassifier. NEVER claim plotly. (The repo
     README says "LightGBM classifier" and lists CxA as "planned"; the code and committed results say
     otherwise. Follow the code. Fix the README.)
   - `contextual-football-metrics`: NEVER claim catboost, captum, plotly, kaleido, pydantic,
     imbalanced-learn, or a DVC-tracked pipeline. Cloud/GPU is documented setup only, never exercised.
     **GitHub Actions CI IS real** (re-audited 2026-07-28: `.github/workflows/ci.yml` with an enforced
     coverage floor, an import smoke build, pre-commit and a secrets audit). The Prefect flow wrapping every
     stage under one MLflow parent run is real and is the strongest MLOps evidence on file.
   - `bet-intelligence`: NEVER claim xgboost, statsmodels, plotly, or any positive market edge. The negative
     result IS the asset. Best config +6.72% ROI over 118 bets; most configs negative; zero bets in 2023/24.
   - `retail-intelligence`: real two-stage X-learner + LightGBM (genuinely used). Synthetic data throughout.
     Figures demonstrate method, not a measured commercial outcome.
   - `retail-analytics` (HealthBeauty360): NEVER claim Isolation Forest, anomaly detection, Prophet, XGBoost,
     SHAP, an ensemble, Great Expectations, a feature store, dbt, BigQuery, Cloud Run, or "production-grade".
     Real, **re-audited 2026-07-28 against the 20 July rebuild**: Docker, a PSI/KS/chi2 drift monitor,
     FastAPI, Ridge demand model, K-Means RFM, **Mann-Kendall trend significance**, **price elasticity**
     and **GitHub Actions CI** (all four moved NEVER to HAS in that audit; this rule previously barred them
     and was therefore blocking true claims). Synthetic-data demo: every metric must say so.
     **HARD LIMIT, never publish:** the absolute forecast error (mean MAPE 0.70, WMAPE 1.06). A WMAPE above
     1.0 is worse than predicting zero in weighted terms. The only defensible framing is the relative one,
     that the forecast beats a seasonal-naive baseline on ~77% of SKUs.
   - `energy-market-tracker`: ELEXON only. NEVER claim ENTSO-E / EIA / Nord Pool, source fallback, mock
     mode, Prophet, or any forecasting accuracy number (the forecasting notebook has a target-leakage bug).
   - `sales-insight-agent`: NEVER claim an LLM, GenAI, LangChain, LangGraph or agentic AI. There is no LLM
     client anywhere in the repo and routing is still deterministic; the word "agent" in the repo name is not
     a licence. (The GitHub tagline oversells; the README is honest. Fix the tagline.)
     **Retrieval IS genuinely semantic, re-audited 2026-07-28 against the 19-20 July rebuild:** Chroma vector
     store, all-MiniLM-L6-v2 embeddings, cosine nearest-neighbour with a calibrated similarity floor,
     hit-rate@3 8/8 on a judged relevance set. This rule previously described a "TF-overlap retriever" and
     barred "semantic/vector RAG", which is now wrong: claim vector search and semantic retrieval, and never
     generative AI. The published negative is the asset here: the 80% prediction intervals achieve only
     72-75% measured coverage and the README says the intervals are too narrow.
   - `defensive-actions-expected`: in development. NO model metric may be quoted. The integrity story (archived
     compromised results, enforced leakage guard, CI leakage smoke test) is the asset.
   - `between-lines-availability`: architecture only, never results. Nothing has been run.
6. **Demos must not render invented data.** If a real export is unavailable, ship a labelled documented sample
   or a "coming soon" state. Never fabricate coordinates, predictions, or series.
7. **Never overclaim authorship.** Do not assert solo end-to-end authorship, hand-written implementation, or
   "every line my own" for any project. Describe what the work does and what the results are; development
   tooling is not disclosed either way. Results and analysis must always be genuinely yours and defensible.
8. **Style:** British English. No em dashes. Never claim a model or document is error-free; report what was
   checked and what is uncertain.
9. **Only the four clean repos may be linked:** `opponent-adjusted-metrics`, `retail-intelligence`,
   `contextual-football-metrics`, `sales-insight-agent`. Others are described without a clickable link.
