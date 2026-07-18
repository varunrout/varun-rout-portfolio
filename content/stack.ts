// content/stack.ts
// Source of truth for the Stack section (brief section 5). Only tools imported and executed in
// committed code, or evidenced in a professional role. See content-rules.md and MASTER_PROFILE.md section 5.

export type StackColumn = {
  title: string;
  items: string[];
};

export const stack: StackColumn[] = [
  {
    title: 'Modelling',
    items: [
      'Python',
      'scikit-learn',
      'LightGBM',
      'X-learner (causal uplift)',
      'GLM / logistic regression / Ridge',
      'GradientBoostingClassifier',
      'PyTorch (GNN, GRU)',
      'SHAP',
      'XGBoost',
      'Isotonic calibration',
      'Monte Carlo simulation',
      'Time-series forecasting',
    ],
  },
  {
    title: 'Engineering & data',
    items: [
      'SQL',
      'DuckDB',
      'PostgreSQL',
      'SQLAlchemy',
      'Snowflake',
      'FastAPI',
      'Docker',
      'Azure Data Factory',
      'Azure Databricks',
      'Power BI',
    ],
  },
  {
    title: 'MLOps & delivery',
    items: [
      'Azure ML Studio',
      'Azure DevOps CI/CD',
      'MLflow',
      'Prefect',
      'GitHub Actions',
      'Drift / PSI monitoring',
      'Leakage guards',
      'Walk-forward cross-validation',
    ],
  },
];
