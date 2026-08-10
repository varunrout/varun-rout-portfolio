// content/experience.ts
// Source of truth for the experience timeline and education (brief section 5, "Experience").
// Every value traces to MASTER_PROFILE.md. See content-rules.md before editing.
// British English. No em dashes. Only Manor Park carries the title "Data Scientist".

export type ExperienceEntry = {
  role: string;
  org: string;
  start: string;
  end: string;
  current?: boolean;
  summary: string;
  highlights: string[];
};

export const experience: ExperienceEntry[] = [
  {
    role: 'Independent research',
    org: 'Portfolio · football analytics focus',
    start: 'Jan 2026',
    end: 'Present',
    current: true,
    summary:
      'Full-time, deliberate investment in this portfolio and an active search for the next role, after the ' +
      'E.ON fixed-term contract ran its course in December 2025.',
    highlights: [
      'Opponent-adjusted football metrics benchmarked against StatsBomb xG',
      'Retail uplift modelling and the model scorecard behind this site',
    ],
  },
  {
    role: 'Quantitative Market Analyst',
    org: 'E.ON Energy Markets',
    start: 'Jan 2025',
    end: 'Dec 2025',
    summary:
      'Rebuilt hourly power forecasting around a residual-load framework, ran it in production with drift ' +
      'monitoring, and led the stakeholder-facing forecast reviews that used it.',
    highlights: [
      'Residual-load framework: forward price curve +15% far seasons, +9.7% near seasons vs the previous methodology',
      'Christmas-period demand RMSE reduced ~18% after diagnosing holiday-specific error',
      'Built and ran the model in Azure ML Studio with Azure DevOps CI/CD and production drift detection',
      'Built forward-curve and shape reporting in Power BI; led the fortnightly review with commercial stakeholders',
    ],
  },
  {
    role: 'Quantitative Research Intern',
    org: 'E.ON Energy Markets',
    start: 'Jul 2024',
    end: 'Dec 2024',
    summary:
      'Built a half-hourly network-charge forecasting engine and a Monte Carlo risk model, and migrated ' +
      'legacy spreadsheet processes into governed Python and SQL.',
    highlights: [
      '~23% improvement in network-charge forecast accuracy vs the previous internal approach',
      '10,000-run Monte Carlo producing P5/P50/P95 cost outcomes',
      'Migrated Access/spreadsheet processes into Python, SQL and Snowflake; saved ~6 to 7 hours per reporting cycle',
    ],
  },
  {
    role: 'Business Analytics Consultant',
    org: 'University of Birmingham Sport & Fitness',
    start: 'Jun 2024',
    end: 'Aug 2024',
    summary:
      'MSc capstone: benchmarked four forecasting methods on out-of-sample MAE across six activity categories, ' +
      'then applied ABC/Pareto prioritisation to booking and revenue data.',
    highlights: [
      'Benchmarked SARIMA, Prophet, Holt-Winters and Random Forest; a tuned Random Forest roughly halved error on the hardest categories',
      'Cardio MAE 23.8 to 11.2, Holistic MAE 26.5 to 13.4, Toning MAE 14.3 to 10.3',
      'ABC/Pareto prioritisation: three member groups drove ~80% of revenue (~£5.68m); a ~5% class tail flagged for review',
    ],
  },
  {
    role: 'Data Scientist',
    org: 'Manor Park Trading Company',
    start: 'Jan 2024',
    end: 'Jun 2024',
    summary:
      'Multi-horizon demand forecasting across ~7,000 SKUs and four sales channels, paired with customer and ' +
      'product segmentation for campaign targeting.',
    highlights: [
      'Demand forecast accuracy +28% weekly, +19% monthly, +37% quarterly',
      'Seven-cluster customer and product segmentation for targeted campaigns',
      'Designed and ran a randomised holdout test on campaign targeting (random assignment, concurrent control); ' +
        'measured ~7% ROAS improvement against the holdout group',
      '~£78k incremental revenue associated with campaign and product analysis; no holdout behind that figure, ' +
        'so association rather than a causal claim',
      'Reporting automation cut per-draft production time ~50%',
    ],
  },
  {
    role: 'Systems Engineer',
    org: 'Infosys · John Deere account',
    start: 'Jul 2021',
    end: 'Aug 2023',
    summary:
      'Two years of production ETL/ELT engineering on high-volume operational data.',
    highlights: [
      'Production pipelines in Python, SQL, Azure Data Factory and Azure Databricks',
      'Complex SQL transformations and automated data-quality checks',
      'Cloud-migration and legacy-modernisation initiatives',
    ],
  },
];

export type EducationEntry = {
  qualification: string;
  institution: string;
  start: string;
  end: string;
};

export const education: EducationEntry[] = [
  {
    qualification: 'MSc Business Analytics',
    institution: 'University of Birmingham',
    start: '2023',
    end: '2024',
  },
  {
    qualification: 'B.Tech Polymer Science & Chemical Technology',
    institution: 'Delhi Technological University',
    start: '2016',
    end: '2020',
  },
];
