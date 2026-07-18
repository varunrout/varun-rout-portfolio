# Portfolio Build Brief — Varun Rout

A spec for a Next.js + React portfolio, hand-off ready for Claude Code, deployed on Vercel.
Written 2026-07-18. British English. Every content claim must trace to `MASTER_PROFILE.md`.

---

## 0. The through-line (read this first)

Most DS portfolios are a wall of green metrics with no baseline and no failure. Yours does the
opposite, and that is the entire differentiator:

- **Every number sits next to the thing it aims to beat.** CxG next to StatsBomb's own xG. Not "0.809 AUC" in isolation.
- **The failures are on the page.** The betting model does not beat the market, and the site says so.
- **The integrity work is a feature, not a footnote.** Leakage guards, archived compromised results, drift monitoring.

The tagline is already good: *"Forecasting, causal ML, and models that earn their claims."* Build the whole
site around that promise and then prove it with interactive demos a reviewer can poke at. A QuantumBlack
reviewer has seen a thousand confident portfolios. They have not seen one that shows its working and its losses.

Do not out-clever this. Ship a tight, fast, honest site. The restraint is the flex.

---

## 1. Tech stack (opinionated)

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15, App Router, React 19, TypeScript (strict)** | Server components, native Vercel, fast. |
| Styling | **Tailwind CSS v4** + CSS variables for the theme tokens | Matches the token system below; no runtime cost. |
| Components | **shadcn/ui** (Radix under the hood) | Accessible primitives, you own the code, no lock-in. |
| Animation | **Motion (framer-motion)** | Scroll reveals, number count-ups, chart transitions. Keep it subtle. |
| Charts | **visx** (D3 primitives + React) for the custom demos; **Recharts** only for trivial bar/line | visx gives control for the pitch and Qini curve; Recharts is fine for the simple stuff. |
| Table | **TanStack Table** | The sortable model scorecard. |
| Content | **MDX in-repo** via `next-mdx-remote/rsc`, project data as typed TS in `/content` | Version-controlled, no CMS, easy for the agent to generate. |
| Fonts | **Geist Sans + Geist Mono** (`next/font`) | Native to Vercel, clean, and the mono is perfect for metrics. |
| Analytics | **Vercel Analytics + Speed Insights** | One line each, privacy-friendly. |
| Deploy | **Vercel**, GitHub integration, preview deploys per PR | Push to deploy. |

Deliberately NOT using: a headless CMS (overkill), Contentlayer (effectively unmaintained), a component
library beyond shadcn (bloat), or a state manager (URL + React state is enough).

---

## 2. Repo structure

```
portfolio/
  app/
    layout.tsx                 # fonts, theme, analytics, global chrome
    page.tsx                   # home (assembles sections)
    work/[slug]/page.tsx       # per-project deep-dive pages (generateStaticParams)
    playground/page.tsx        # hub linking the four interactive demos
    about/page.tsx
    api/og/route.tsx           # dynamic OG images (optional, nice)
  components/
    sections/                  # Hero, ProofStrip, FeaturedWork, RigourManifesto, StackGrid, Timeline, Contact
    demos/                     # ShotMapExplorer, UpliftExplorer, ForecastVisualiser, ModelScorecard
    ui/                        # shadcn components
    charts/                    # shared visx wrappers (BarSeries, axes, tooltip)
    Chrome/                    # Nav, Footer, ThemeDot, CommandMenu
  content/
    projects.ts                # typed Project[] (see §8) — THE source of truth for cards
    metrics.ts                 # typed Metric[] for the scorecard
    experience.ts
    case-studies/*.mdx         # long-form deep dives (tier: full)
  data/
    shots.sample.json          # xG demo data (see §7.1 — must be REAL exported preds)
    uplift-deciles.json        # from retail-intelligence committed outputs
    forecast.json              # E.ON / Manor Park / UoB aggregate numbers
  lib/
    theme.ts                   # token exports if needed in JS
    format.ts                  # number/metric formatters (fixed dp, no fake precision)
  content-rules.md             # the honesty contract (see §9) — agent MUST read before writing copy
  CLAUDE.md                    # points the agent at content-rules.md and MASTER_PROFILE
```

---

## 3. Design system

Reuse the aesthetic from the existing PDF/site so the brand is consistent.

**Tokens (CSS variables, dark-first):**

```
--bg:        #0A0A0F   /* page */
--bg-2:      #101018   /* strip / raised */
--panel:     #14141D   /* cards */
--panel-2:   #181824
--line:      #2C2C3A   /* borders, gridlines */
--txt:       #F3F3F7
--muted:     #9C9CAD
--dim:       #6E6E80
--pink:      #FF2E7E   /* primary accent — use sparingly */
--cyan:      #28E0C6   /* secondary — benchmarks, "good" */
--violet:    #B14BF4   /* gradient mid only */
--amber:     #F5B841   /* "in development" state */
--grad:      linear-gradient(120deg,#FF2E7E,#B14BF4 55%,#28E0C6 120%)
```

**Rules of the system:**

- Accent discipline. Pink is for one thing per view (the hero verb, a single CTA, the "your model" bar).
  Cyan is reserved for the benchmark/incumbent so the comparison reads instantly. Never rainbow a chart.
- Type scale: display 48-68px (clamp), h2 28-34, body 16-17, mono for every number. Tight letter-spacing on headings (-0.02em).
- Generous whitespace, thin 1px borders, 12-16px radii, no drop shadows (glow via radial gradients instead).
- Motion: 150-250ms ease-out. Reveal-on-scroll with 12-20px translate. Number count-ups on first view.
  Respect `prefers-reduced-motion` and disable all of it if set.
- A subtle background grid + a single radial glow in the hero. Do not animate the background.
- Everything works at 360px wide. Charts collapse to single column, pitch scales down, table becomes cards.

**Signature motif:** the "benchmark bar pair" — your metric in pink directly beside the incumbent in cyan,
with the gap annotated. Reuse it in the hero, the scorecard, and the xG demo. It becomes your visual identity.

---

## 4. Information architecture

- `/` — home. Single scroll: Hero -> Proof strip -> Featured work (5) -> Playground teaser -> Rigour manifesto -> Stack -> Experience -> About/contact.
- `/work/[slug]` — one page per project. The card on home links here. Full write-up, model card, embedded relevant demo, links.
- `/playground` — the four demos with intro copy for each.
- `/about` — longer narrative, the transition story, how you work.
- Global: sticky nav, command menu (Cmd-K) to jump around and to repos, footer.

Keep it to these. A blog is a tier-3 stretch (§13), not v1.

---

## 5. Section-by-section content spec

**Hero.** Eyebrow "Applied data science · Birmingham, UK". H1 with the gradient verb. One-line lede (the
promise). Four pill tags (StatsBomb-benchmarked xG, two-stage X-learner uplift, Azure ML in production,
drift & leakage monitoring). Two CTAs: "See the work", "GitHub". Background grid + radial glow.

**Proof strip.** Four stat cells, mono numbers, count-up on view: `0.809 AUC` (CxG vs StatsBomb 0.820),
`2.14M events`, `+37%` quarterly forecast accuracy, `15%` price-curve gain. Each with a one-line caption.

**Featured work.** Five cards, balanced mix, each linking to `/work/[slug]`:
1. Residual-Load Forecasting & Price Curves (E.ON, professional)
2. Opponent-Adjusted Football Metrics (flagship, links repo)
3. Retail Growth Intelligence — Uplift Modelling (causal ML, links repo)
4. Multi-Horizon Demand Forecasting (Manor Park, professional)
5. Frame2Threat — Possession-Danger Prediction (deep learning)
Card = kicker, title, role, 2-line summary, key metric with benchmark, tech chips, state badge (Live repo /
Professional / In development). Hover: subtle lift + accent border.

**Playground teaser.** A band that previews the four demos with a thumbnail each, linking to `/playground`.

**Rigour manifesto.** The four habits: benchmark against the incumbent, report negative results, test for
leakage then enforce it, calibrate and validate out of sample. This is the section that wins interviews.

**Stack.** Three columns: Modelling, Engineering & data, MLOps & delivery. Only tools that are imported and
executed in committed code or evidenced in a role (see the list in `MASTER_PROFILE.md`).

**Experience.** Vertical timeline: E.ON Market Analyst, E.ON Costing & Risk Intern, UoB Sport & Fitness
Consultant, Manor Park Data Scientist, Infosys Systems Engineer, plus education.

**About + contact.** The narrative (§ below). Email, phone, LinkedIn, GitHub, CV download button.

---

## 6. Per-project deep-dive page (`/work/[slug]`)

This is where you go beyond the PDF. Each page:

- Hero band: title, role, dates, state, repo link (clean repos only).
- **Model card** (borrow the Google "model card" idea — signals maturity): Problem, Data + provenance,
  Model(s), Metrics + benchmark, Validation method, Known limitations, What I would not claim. That last row
  is the honesty hook and it is memorable.
- Narrative in MDX: the story, the decisions, the dead ends.
- The relevant interactive demo embedded inline where it exists.
- "Provenance" note where AI-assisted scaffolding is real (Frame2Threat), stated plainly.

---

## 7. The four interactive demos (detailed)

General rules: each demo is a client component, keyboard accessible, has loading/empty/error states, reads
from a static JSON in `/data`, and carries a small "Data provenance" caption. **No invented data.** Where the
real export does not yet exist, the demo ships with a clearly labelled documented sample, never silent fakery.

### 7.1 xG shot-map explorer  `components/demos/ShotMapExplorer`

- **What it shows:** an SVG football pitch (attacking third). Each shot is a dot sized/coloured by value.
  Toggle between "My CxG" and "StatsBomb xG"; a diff mode colours dots by (CxG − xG) so over/under-valued
  shots pop. Hover a shot: tooltip with both values, distance, angle, context (game state, pressure).
  A side panel shows aggregate: mean CxG vs mean xG, Brier for both, count of shots.
- **Interactions:** metric toggle, diff mode, filter by team/match/pressure, brush-select a pitch zone to
  recompute the aggregate for that zone.
- **Data source (IMPORTANT):** `opponent-adjusted-metrics` gitignores `outputs/`. You must export a sample
  from your model: run the eval, dump ~200-400 shots to `data/shots.sample.json`. Schema:
  ```ts
  type Shot = { id:string; x:number; y:number; team:string; match:string;
    cxg:number; statsbomb_xg:number; goal:0|1; distance:number; angle:number;
    pressure:boolean; game_state:string }
  ```
  Caption it "Sample of N real shots from the CxG diagnostic model; full set in the repo." If you cannot
  export in time, ship the demo behind a "coming soon" state rather than faking coordinates.
- **Tech:** visx `Group` + custom scales, or plain SVG with D3 scales. Pitch drawn once as a memoised component.
- **Why it leads:** it is visual, it is football, and it makes the "benchmarked against the incumbent" claim
  literally interactive. This is your headline demo.

### 7.2 Uplift decile explorer  `components/demos/UpliftExplorer`

- **What it shows:** the Qini/uplift-by-decile story from the retail X-learner. A bar chart of observed
  uplift per decile (decile 1 = highest predicted), a cumulative Qini curve vs the random line, and callouts:
  overall ATE 0.0444, top-decile 0.0754 (~1.7x), Qini area 744.8, Spearman 0.406. A slider "target the top
  K% of customers" recomputes cumulative captured uplift, making the targeting value tangible.
- **Data source:** REAL and committed. `retail-intelligence/outputs/phase_uplift_v2_model_comparison.csv`
  plus the decile table. Convert to `data/uplift-deciles.json`:
  ```ts
  type UpliftDecile = { decile:number; n:number; observed_uplift:number; cumulative:number; qini:number }
  ```
- **Tech:** visx bars + line, one slider (Radix). Animate bars on view.
- **Honesty note:** caption "Synthetic retail data; demonstrates method, not a measured commercial outcome."
- **Why it matters:** causal/uplift ML is rare in junior portfolios. This screams "I understand treatment effects".

### 7.3 Forecast error visualiser  `components/demos/ForecastVisualiser`

- **What it shows:** three small linked panels. (a) E.ON: price-curve improvement far/near + Christmas RMSE fix,
  before/after. (b) Manor Park: accuracy uplift by horizon (weekly/monthly/quarterly). (c) UoB: MAE before/after
  RF tuning across categories (Cardio 23.8->11.2, Holistic 26.5->13.4, Toning 14.3->10.3). Toggle between them.
- **Data source:** aggregate numbers from `MASTER_PROFILE.md`, typed into `data/forecast.json`. All safe, all
  measured. No raw series needed.
- **Tech:** Recharts is fine here (simple grouped bars), or reuse the visx bar wrapper for consistency.
- **Honesty note:** E.ON and Manor Park are professional results; label as such. Do not invent time series you
  do not have — show the aggregate deltas you can defend.

### 7.4 Model scorecard  `components/demos/ModelScorecard`

- **What it shows:** one sortable, filterable table of every model across the portfolio: project, model, task,
  primary metric, value, benchmark/baseline, dataset (real/synthetic/open), tests, state. Filter by domain
  (football/energy/retail), sort by metric, search. The "benchmark" column is the point: a metric with nothing
  to beat is greyed.
- **Data source:** `content/metrics.ts`, typed, hand-authored from the profile. Schema:
  ```ts
  type ModelMetric = { project:string; model:string; task:string; metric:string; value:number;
    benchmark?:{ name:string; value:number }; dataset:'real'|'synthetic'|'open';
    tests?:number; state:'live'|'professional'|'in-development' }
  ```
- **Tech:** TanStack Table + shadcn table styling.
- **Why it matters:** it reads as an engineer's artefact. Understated, scannable, and it lets a technical
  reviewer verify your consistency at a glance.

---

## 7.5 Data sourcing map (real outputs only)

Demo data comes from each project's committed reports/outputs, not from anything authored by hand. The build
does not read repos at runtime; a one-off local step copies or transforms the real output files into
`/data/*.json`, which is what ships. Run it where the repos are checked out.

| Demo | Source repo | Committed file(s) | Transform -> `/data` | Status |
|---|---|---|---|---|
| Uplift explorer | `retail-intelligence` | `outputs/phase_uplift_v2_model_comparison.csv` + the decile table under `outputs/` | CSV -> `uplift-deciles.json` (§7.2 schema) | Real, committed. Ready. |
| Model scorecard | all repos | aggregate metrics already in `content/metrics.ts` | none (typed by hand from committed results) | Ready. |
| Forecast visualiser | none (employment) | E.ON / Manor Park / UoB aggregate deltas from `MASTER_PROFILE.md`; UoB MAE from `capstone-uob` / `uob-snf-forecast` | typed into `forecast.json` | Ready. No raw series exist; use the aggregate deltas only. |
| xG shot-map | `opponent-adjusted-metrics` | aggregate from `docs/modeling/v1_results_summary.md` (committed). **Shot-level preds are in `outputs/`, which is gitignored.** | run the eval, export ~200-400 shots -> `shots.sample.json` (§7.1 schema) | **Needs an export.** Build last. |

Supporting facts for the scorecard/pages, all committed and safe to cite:
`contextual-football-metrics/reports/cxg_training_summary.json`; `Frame2Threat/models/results_summary.json`;
`bet-intelligence/src/modeling/evaluate.py` (numbers from executed notebook 05, which is untracked, so quote
values, do not link the notebook); `defensive-actions-expected/docs/results/current_results_summary.md`
(data-completeness only, no AUC).

**Do not use** `uk-network-charge-forecast/outputs/monte_carlo_summary_*.csv` for the E.ON network-charge
figures. That repo is a personal synthetic reimplementation with different numbers (P10/P50/P90, n=5000, no
23% figure) and contains no E.ON data. The E.ON figures are employment-evidenced only.

Suggested implementation: a `scripts/build-data.ts` run with `pnpm data` that reads the repo output paths (set
via a local `.env` pointing at your GitHub Portfolio checkout), validates shape, and writes `/data/*.json`.
Keep the generated JSON committed so Vercel builds without needing the repos. Never let the script emit a row
it could not read; fail loudly instead.

## 8. Content data model (`content/projects.ts`)

Type the projects once; every card, page, and OG image reads from this. Keep metrics as structured objects so
you can never accidentally render fake precision.

```ts
export type Metric = {
  label: string;
  value: string;              // pre-formatted, e.g. "0.809 AUC"
  benchmark?: string;         // e.g. "vs StatsBomb 0.820"
  measured: boolean;          // true = defensible result; false = illustrative (NEVER shown as headline)
};

export type Project = {
  slug: string;
  title: string;
  kicker: string;             // "Football analytics · flagship"
  role: string;               // "Independent research · 8 months of active development"
  state: 'live' | 'professional' | 'in-development';
  summary: string;            // 2 lines
  metrics: Metric[];
  stack: string[];
  repo?: string;              // ONLY the four clean repos
  demo?: 'shotmap' | 'uplift' | 'forecast' | 'scorecard';
  provenanceNote?: string;    // e.g. AI-assisted scaffolding disclosure
  neverClaim?: string[];      // machine-readable guardrail mirrored from content-rules
};
```

---

## 9. Honesty guardrails — `content-rules.md` (the agent MUST read this before writing any copy)

This is the most important file in the repo. It carries the same fail-closed discipline as your CV pipeline so
Claude Code cannot reintroduce a Barclays-style false claim. Put this verbatim in the repo:

```
# CONTENT RULES — non-negotiable

1. MASTER_PROFILE.md is the only factual source. If a claim is not traceable to it, it does not ship.
2. Never invent, infer, or strengthen a fact, metric, skill, status or title. Fail closed: remove and flag.
3. Titles are exact. Only Manor Park carries "Data Scientist".
4. Illustrative figures (e.g. ~£78k, £115k, ROAS mechanics) are NEVER shown as measured headline metrics.
   The ~£78k is "analysis associated with", never a causal claim.
5. Per-repo NEVER-claim list, enforced:
   - opponent-adjusted-metrics: NEVER headline LightGBM or "gradient boosting" as the tech. Models are
     sklearn LogisticRegression / Ridge / GradientBoostingClassifier. NEVER claim plotly.
   - contextual-football-metrics: NEVER claim catboost, captum, plotly, kaleido, pydantic, imbalanced-learn,
     DVC-tracked pipeline, or CI. Cloud/GPU is documented setup only.
   - bet-intelligence: NEVER claim xgboost, statsmodels, plotly, or any positive market edge. The negative
     result is the asset. Best config +6.72% ROI / 118 bets; most configs negative.
   - retail-intelligence: real X-learner + LightGBM (used). Synthetic data. Not a measured commercial outcome.
   - retail-analytics (HealthBeauty360): NEVER claim Isolation Forest, Prophet, XGBoost, Mann-Kendall, SHAP,
     Great Expectations, dbt, BigQuery/Cloud Run. Real: Docker, PSI/KS drift monitor, FastAPI, Ridge, K-Means.
   - energy-market-tracker: ELEXON only. NEVER claim ENTSO-E/EIA/Nord Pool, fallback, mock mode, Prophet, or
     any forecasting accuracy number (the notebook has a target-leakage bug).
   - sales-insight-agent: NEVER claim LLM, GenAI, LangGraph, or semantic/vector RAG. It is a deterministic
     keyword-routed multi-tool agent with a TF-overlap retriever.
   - defensive-actions-expected: in development. NO model metric may be quoted.
   - between-lines-availability: architecture only, never results (nothing has been run).
6. Demos must not render invented data. If a real export is unavailable, ship a labelled documented sample or
   a "coming soon" state. Never fabricate coordinates, predictions, or series.
7. British English. No em dashes. Never claim a document or model is error-free.
8. Where AI-assisted scaffolding is real (Frame2Threat: 11/16 commits by copilot-swe-agent), state it. Do not
   claim solo end-to-end authorship of a scaffold.
```

Also fix two live-repo contradictions before launch, or a reviewer clicking through will catch them:
`opponent-adjusted-metrics` README says "LightGBM classifier" and lists CxA as "planned" (your code uses
sklearn and you have CxA results); `sales-insight-agent`'s GitHub tagline still advertises "LangGraph, RAG,
LLM APIs" which its own README contradicts.

---

## 10. SEO, performance, accessibility

- Metadata API: per-page title/description, canonical, `opengraph-image` (static or the `/api/og` route).
- Dynamic OG image per project via `@vercel/og` (ImageResponse) using the same dark theme — great share cards.
- Target Lighthouse 95+ everywhere. Server-render everything; demos are the only client islands.
- `next/image` for any raster; prefer SVG. Self-host fonts via `next/font` (no layout shift).
- Semantic HTML, focus-visible rings, `aria-label`s on icon buttons, keyboard paths through every demo,
  colour contrast checked (the muted greys must clear 4.5:1 on body text — bump `--muted` if not).
- `prefers-reduced-motion` disables count-ups, reveals, and chart transitions.
- `sitemap.ts` and `robots.ts`.

---

## 11. Deployment (Vercel)

- Push repo to GitHub, import to Vercel, framework auto-detected. Preview deploy per PR, production on `main`.
- Custom domain: `varunrout.com` or `varunrout.dev` (buy via Vercel or a registrar; the `.dev` reads well for
  a data scientist). Set it as primary, force HTTPS.
- Env vars: none needed for v1 (all data is static). Add Vercel Analytics + Speed Insights.
- Add a `CV` download (the existing PDF, or a lighter one-pager) served from `/public`.

---

## 12. Build sequence (phased — paste these as tasks to Claude Code)

1. **Scaffold.** `create-next-app` (TS, Tailwind v4, App Router, ESLint). Add shadcn, motion, visx, TanStack
   Table, Geist fonts. Drop in `content-rules.md` + `CLAUDE.md`. Commit.
2. **Theme + chrome.** Tokens, layout, nav, footer, command menu, reduced-motion plumbing. A blank themed page.
3. **Content layer.** Author `content/projects.ts`, `metrics.ts`, `experience.ts` from MASTER_PROFILE. This is
   the gate: get the facts right here and everything downstream inherits them.
4. **Home sections.** Hero, proof strip, featured work, rigour manifesto, stack, timeline, contact. Static, responsive.
5. **Project pages.** `/work/[slug]` with the model card + MDX narrative for the top 3 projects first.
6. **Demos, in order of value:** scorecard (pure data, no export needed) -> forecast visualiser (aggregates) ->
   uplift explorer (committed CSV) -> shot-map (needs the export; do last).
7. **Polish.** OG images, SEO, analytics, Lighthouse pass, a11y pass, 360px pass.
8. **Ship.** Vercel, domain, then iterate.

Ship after step 4 if you want something live fast, then layer demos in behind `/playground`.

---

## 13. Ready-to-paste kickoff prompt for Claude Code

> Build a personal portfolio for a data scientist using Next.js 15 (App Router, React 19, TypeScript strict),
> Tailwind v4, shadcn/ui, Motion, visx, and TanStack Table, deployed to Vercel. Read `content-rules.md` and
> `MASTER_PROFILE.md` before writing any copy: every factual claim must trace to the profile, and the per-repo
> NEVER-claim lists are hard constraints. Use the dark QuantumBlack-style token system in this brief. Start
> with phases 1-4 from the build sequence: scaffold, theme + chrome, the typed content layer in `/content`,
> then the home page sections. Do not build the interactive demos yet. Keep everything server-rendered except
> where interactivity is required. British English, no em dashes. Ask me before inventing any content.

Give it `MASTER_PROFILE.md`, this brief, and `content-rules.md` in the repo so the facts and guardrails travel.

---

## 14. Profile / positioning ideas (the distinctive angles)

Beyond structure, the things that make *your* profile stand out:

- **"What I won't claim" as a recurring element.** On every model card, a row stating the limit (no holdout,
  synthetic data, AI-assisted scaffold). Almost nobody does this. It reads as senior.
- **The benchmark-pair motif everywhere.** Your bar in pink, the incumbent in cyan, the gap annotated. Make it
  the visual signature so the "earn their claims" promise is felt, not just read.
- **Model cards, Google-style.** Problem / data / model / metric+benchmark / validation / limitations. Signals
  you have seen how mature teams document models.
- **A negative-results section, proudly.** The betting backtest that does not beat the market, framed as the
  integrity asset. This is the single most memorable thing you can put on the site.
- **Provenance honesty.** State AI-assisted scaffolding where it is real. Counterintuitively, admitting it
  builds more trust than hiding it, and reviewers can see commit history anyway.
- **A quiet "how I work" strip** on /about: benchmark, calibrate, test for leakage, monitor drift. Four verbs,
  your operating system. It answers "what kind of DS are you" in one glance.
- **Domain range as a strength, not a scatter.** Energy, retail, football. Frame it as "the same rigour across
  three domains", tied together by the manifesto, so breadth reads as transferable method not lack of focus.
- **Interview hooks planted deliberately.** The +0.001 AUC from 360 context, the 2023/24 structural break that
  zeroes the betting book, the residual-load lookback choice. Put them on the page so they ask about them.

## 15. Stretch (do not build in v1)

MDX blog with technical write-ups; a live "reading/now" note; dark/light toggle (dark is stronger, skip it);
a downloadable model card PDF per project; a Cmd-K that also searches project metrics.
