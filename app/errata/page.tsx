import type { Metadata } from 'next';
import Link from 'next/link';
import { Reveal } from '@/components/motion/reveal';

export const metadata: Metadata = {
  title: 'Errata',
  description:
    'Results I withdrew or corrected after auditing my own work, and shortfalls the projects still carry, each with the figure that replaced it.',
  alternates: { canonical: '/errata' },
};

type Entry = {
  project: string;
  slug: string;
  date?: string;
  was?: string;
  now: string;
  why: string;
};

const withdrawn: Entry[] = [
  {
    project: 'Contextual Football Metrics',
    slug: 'contextual-football-metrics',
    date: 'Withdrawn November 2026',
    was: 'Contextual xG at 0.8131 ROC AUC, ahead of a 0.7982 logistic baseline. A +0.08 AUC context lift for CxA.',
    now: 'With causal features: 0.8037 against 0.7996 on 1,340 Euro 2024 shots, and StatsBomb xG scores 0.8295. Context adds nothing measurable on Euro 2024 and makes La Liga worse.',
    why: 'My audit found whole-possession aggregates stored as pre-action features in all three metrics, and faulty CxA and CxT labels.',
  },
  {
    project: 'Frame2Threat',
    slug: 'frame2threat',
    date: 'Withdrawn October and November 2026',
    was: '0.965 ROC AUC from a full-possession ensemble, and 0.82 to 0.85 from early forecasting on partial possessions.',
    now: 'Event-time XGBoost 0.665 [0.647, 0.681] against a ball-position baseline of 0.642, on 15 held-out matches.',
    why: 'The early-forecasting results were leaky. The full-possession models use completed summaries, so they are diagnostics and not early warning.',
  },
  {
    project: 'Expected Next Threat',
    slug: 'expected-next-threat',
    date: 'Corrected November 2026',
    was: '+0.011 AUC [0.007, 0.016] over SkillCorner’s possession-start values.',
    now: '+0.008 AUC [0.004, 0.013]. No interval crossed zero, and the gains over SkillCorner’s values shrank by 0.002 to 0.003.',
    why: 'The xT and xG maps had been fitted on all 20 matches, held-out folds included. They are now fitted per fold.',
  },
];

const shortfalls: Entry[] = [
  {
    project: 'Climate Transition Risk Platform',
    slug: 'climate-transition-risk-platform',
    now: '76.3% measured interval coverage against a 90% target, over 114 splits.',
    why: 'Published as an open undercoverage finding rather than tuned away.',
  },
  {
    project: 'Sales Insight Agent',
    slug: 'sales-insight-agent',
    now: '80% prediction intervals reach only 72-75% coverage.',
    why: 'The repo states that the intervals are too narrow.',
  },
  {
    project: 'Football Market Intelligence',
    slug: 'football-market-intelligence',
    now: 'Most configurations lose money, and the best one places zero bets in 2023/24.',
    why: 'The models do not beat the market. That negative result is the finding.',
  },
];

function EntryList({ entries }: { entries: Entry[] }) {
  return (
    <div className="mt-6 divide-y divide-rule border-y border-rule">
      {entries.map((entry) => (
        <article key={entry.slug} className="py-6">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="text-xl font-medium text-ink">
              <Link
                href={`/work/${entry.slug}`}
                className="underline decoration-rule underline-offset-4 transition-colors duration-200 hover:decoration-ink"
              >
                {entry.project}
              </Link>
            </h3>
            {entry.date && <p className="font-mono text-xs text-pencil">{entry.date}</p>}
          </div>
          {entry.was && (
            <p className="mt-3 border-l-2 border-redpen pl-3 text-graphite">
              <span className="font-mono text-xs tracking-[0.06em] text-pencil uppercase">Was </span>
              {entry.was}
            </p>
          )}
          <p className="mt-3 text-ink">
            {entry.was && <span className="font-mono text-xs tracking-[0.06em] text-pencil uppercase">Now </span>}
            {entry.now}
          </p>
          <p className="mt-2 text-sm text-graphite">{entry.why}</p>
        </article>
      ))}
    </div>
  );
}

export default function ErrataPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <Reveal>
        <p className="font-mono text-xs tracking-[0.06em] text-pencil uppercase">Errata</p>
        <h1 className="mt-3 text-4xl font-medium tracking-[-0.02em] text-ink sm:text-5xl">
          What did not hold up.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-graphite">
          Numbers I once showed and no longer stand behind, with what replaced them. The figures marked
          &ldquo;was&rdquo; are recorded here as withdrawn. They are not results.
        </p>
      </Reveal>

      <Reveal delay={0.05}>
        <section className="mt-14">
          <h2 className="font-mono text-sm text-ink">Withdrawn or corrected</h2>
          <EntryList entries={withdrawn} />
        </section>
      </Reveal>

      <Reveal delay={0.1}>
        <section className="mt-14">
          <h2 className="font-mono text-sm text-ink">Shortfalls still on the page</h2>
          <p className="mt-2 text-sm text-graphite">Nothing to correct here: these are measured results that miss their target.</p>
          <EntryList entries={shortfalls} />
        </section>
      </Reveal>
    </div>
  );
}
