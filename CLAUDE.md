# CLAUDE.md — varun-rout-portfolio

A personal portfolio for Varun Rout: Next.js 15 + React 19 + TypeScript, deployed on Vercel.
Positioning: applied data scientist. Forecasting, causal ML, and models that earn their claims.

## Read before writing anything

1. `content-rules.md` — the honesty contract. Non-negotiable. Every factual claim traces to the profile,
   and the per-repo NEVER-claim lists are hard constraints.
2. `PORTFOLIO_BUILD_BRIEF.md` — the full spec: stack, structure, design tokens, sections, the four demos,
   data schemas, and the phased build sequence.
3. `MASTER_PROFILE.md` — the only factual source (kept at
   `C:\Users\USER\Documents\Claude Local\CVs Pipeline\MASTER_PROFILE.md`; copy the relevant facts in, do not
   invent). If a claim is not in here, it does not ship.

## Stack (fixed)

Next.js 15 App Router, React 19, TypeScript strict, Tailwind v4, shadcn/ui, Motion (framer-motion),
visx for custom charts, Recharts for trivial ones, TanStack Table, Geist Sans + Geist Mono via `next/font`,
Vercel Analytics + Speed Insights. MDX in-repo via `next-mdx-remote/rsc`. No CMS, no state manager.

## Conventions

- Content lives in `/content` as typed TS (`projects.ts`, `metrics.ts`, `experience.ts`) and `/content/case-studies/*.mdx`.
  These files are the source of truth for every card, page, OG image, and the scorecard. Get the facts right here.
- Demos read from static JSON in `/data`. Never fabricate demo data (rule 6).
- Server-render everything; the four demos are the only client islands.
- Dark theme only. Tokens are in the brief (section 3). Accent discipline: pink for one thing per view,
  cyan reserved for the benchmark/incumbent.
- British English. No em dashes. Respect `prefers-reduced-motion`.

## Non-negotiables (mirror of content-rules.md)

- Only Manor Park carries the title "Data Scientist".
- Only link the four clean repos: opponent-adjusted-metrics, retail-intelligence, contextual-football-metrics,
  sales-insight-agent.
- Illustrative figures (£115k, ROAS mechanics) never appear as headline metrics. The ~£78k is "associated with".
- Respect every per-repo NEVER-claim list in `content-rules.md`.
- Ask before inventing any content.

## Build sequence

Follow section 12 of the brief. Phases 1-4 first (scaffold, theme + chrome, content layer, home sections).
Do not build the interactive demos until the content layer is factually correct and reviewed.
Demo order by value: scorecard -> forecast visualiser -> uplift explorer -> shot-map (needs a data export, do last).

## Commands (once scaffolded)

- `pnpm dev` — local dev
- `pnpm build && pnpm start` — production build check before pushing
- `pnpm lint` / `pnpm typecheck` — must pass before commit

## Deploy

Vercel, GitHub integration. Preview deploy per PR, production on `main`. All data is static; no env vars for v1.
