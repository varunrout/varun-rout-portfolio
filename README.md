# varun-rout-portfolio

Personal portfolio for Varun Rout. Applied data scientist: forecasting, causal ML, and models that earn their
claims. Next.js 15 + React 19 + TypeScript, deployed on Vercel.

The point of this site: every metric sits next to the thing it aims to beat, failures are on the page, and the
integrity work (benchmarking, leakage guards, drift monitoring) is a feature. Restraint is the flex.

## Read these before writing any code or copy

1. **`content-rules.md`** — the honesty contract. Non-negotiable. Per-repo NEVER-claim lists are hard constraints.
2. **`PORTFOLIO_BUILD_BRIEF.md`** — the full spec: stack, structure, design tokens, sections, the four demos,
   data schemas, and the phased build sequence (section 12).
3. **`MASTER_PROFILE.md`** — the only factual source. Copy it into the repo root before building. If a claim is
   not traceable to it, it does not ship.

## Stack

Next.js 15 (App Router), React 19, TypeScript strict, Tailwind v4, shadcn/ui, Motion, visx (custom charts) +
Recharts (trivial), TanStack Table, Geist fonts, MDX via `next-mdx-remote/rsc`. No CMS, no state manager.
Server-render everything; the four interactive demos are the only client islands. Dark theme only.

## Project layout

```
content/         projects.ts, metrics.ts, experience.ts  (typed source of truth)
content/case-studies/*.mdx
data/            generated JSON for the demos (committed; produced by pnpm data)
scripts/build-data.ts   turns committed repo outputs into data/*.json
content-rules.md CLAUDE.md PORTFOLIO_BUILD_BRIEF.md
```

## Getting started

```bash
pnpm install
pnpm add -D tsx csv-parse            # used by scripts/build-data.ts
cp .env.local.example .env.local     # then edit (see below)
pnpm data                            # generate data/*.json from real project outputs
pnpm dev                             # http://localhost:3000
```

`.env.local`:

```
# Absolute path to your GitHub Portfolio checkout (the folder containing Retail/, Football/, ...)
REPO_ROOT=/absolute/path/to/GitHub Portfolio
# Optional: your exported CxG shot sample for the xG demo (see brief section 7.1)
SHOTS_EXPORT=/absolute/path/to/shots.sample.json
```

## Data pipeline (`pnpm data`)

`scripts/build-data.ts` reads COMMITTED project outputs and writes `data/*.json`. It never fabricates a row and
fails loudly if a source is missing. See the data-sourcing map in `PORTFOLIO_BUILD_BRIEF.md` section 7.5.

- `forecast.json` — E.ON / Manor Park / UoB aggregate deltas from the profile. Always written.
- `uplift-deciles.json` — from `retail-intelligence/outputs/*.csv`. **Confirm the column names on first run**
  (the script prints the header and aborts if `UPLIFT_COLS` does not match).
- `shots.sample.json` — needs an export from `opponent-adjusted-metrics` (its `outputs/` is gitignored). Without
  `SHOTS_EXPORT` the file is written with `{ available: false }` and the xG demo shows a "coming soon" state.

Commit the generated `data/*.json` so Vercel builds without needing the source repos.

## Scripts

```
pnpm dev         local dev
pnpm data        regenerate data/*.json from project outputs
pnpm build       production build (run before pushing)
pnpm start       serve the production build
pnpm lint        eslint
pnpm typecheck   tsc --noEmit
```

## Build order

Follow `PORTFOLIO_BUILD_BRIEF.md` section 12. Phases 1-4 first (scaffold, theme + chrome, content layer, home
sections). Get `content/*.ts` factually correct and reviewed before building demos. Demo order by value:
scorecard -> forecast visualiser -> uplift explorer -> shot-map (needs the export, do last). You can ship a live
site after the home page and layer demos in behind `/playground`.

## Deploy

Push to GitHub, import to Vercel (framework auto-detected). Preview deploy per PR, production on `main`. All data
is static, so no env vars are needed on Vercel for v1. Add a custom domain (`varunrout.dev` reads well), Vercel
Analytics, and Speed Insights.

## Before launch

- Copy `MASTER_PROFILE.md` into the repo.
- Fix two live-repo contradictions a reviewer would catch: `opponent-adjusted-metrics` README says "LightGBM
  classifier" and lists CxA as "planned" (the code uses sklearn and CxA results exist); `sales-insight-agent`'s
  GitHub tagline advertises "LangGraph, RAG, LLM APIs" which its own README contradicts.
- Only link the four clean repos: opponent-adjusted-metrics, retail-intelligence, contextual-football-metrics,
  sales-insight-agent.

British English throughout. No em dashes. Never claim a model or document is error-free.
