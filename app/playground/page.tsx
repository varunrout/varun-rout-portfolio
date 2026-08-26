import type { Metadata } from 'next';
import Link from 'next/link';
import { Reveal } from '@/components/motion/reveal';
import { DemoFrame } from '@/components/demos/demo-frame';
import { ModelScorecard } from '@/components/demos/model-scorecard';
import { projects, type DemoKey } from '@/content/projects';

export const metadata: Metadata = {
  title: 'Playground',
  description:
    'Interactive demos: an xG shot-map explorer, a contextual lift and validity explorer, an uplift decile explorer, a forecast error visualiser, and a model scorecard.',
  alternates: { canonical: '/playground' },
};

/**
 * Project-specific demos live on their project pages, where the write-up gives them context.
 * This page indexes them and hosts the one demo with no single home: the cross-project scorecard.
 * Order is deliberate: the three that best carry the "earn their claims" promise come first.
 */
const index: { demo: DemoKey; title: string; blurb: string; why: string }[] = [
  {
    demo: 'shotmap',
    title: 'xG shot-map explorer',
    blurb:
      'Real shots on an attacking-half pitch. Toggle between my CxG and StatsBomb’s own xG, or a diff mode so over- and under-valued shots pop. Filter by team, match or pressure and the panel recomputes mean value and Brier calibration live.',
    why: '440 real shots, benchmarked against the incumbent',
  },
  {
    demo: 'contextual',
    title: 'Contextual lift and validity',
    blurb:
      'CxG, CxA and CxT each set against the baseline they have to beat, over identical held-out rows with a 2,000-sample paired bootstrap. Confidence intervals decide what may be claimed, and one of the three does not clear its benchmark.',
    why: 'Includes a committed negative result on the flagship metric',
  },
  {
    demo: 'uplift',
    title: 'Uplift decile explorer',
    blurb:
      'The Qini curve and per-decile uplift from the retail X-learner. Slide to target the top K% of customers and watch the captured incremental response recompute against random targeting.',
    why: 'Causal ML, rare in a junior portfolio',
  },
  {
    demo: 'forecast',
    title: 'Forecast error visualiser',
    blurb:
      'Before and after accuracy across three roles. E.ON and Manor Park are professional results; UoB is the MSc capstone. Aggregate deltas only, with no invented time series.',
    why: 'Measured deltas, honestly bounded',
  },
  {
    demo: 'climate',
    title: 'Climate backtest & gate explorer',
    blurb:
      'A rolling-origin backtest reproduction, the published 76.3%-vs-90% coverage shortfall, and the ' +
      'pre-registered statistical gate an energy feature had to clear before it reached production.',
    why: 'A real Azure deployment that publishes its own coverage miss',
  },
  {
    demo: 'availability',
    title: 'Alert-budget & honesty explorer',
    blurb:
      'The two disclosed alert-budget operating points, the baselines a champion model has to beat, and the ' +
      'three pre-registered audits that overturned favourable-looking results along the way.',
    why: 'Leads on rigour, never on a performance number',
  },
];

function hrefFor(demo: DemoKey): string | null {
  const project = projects.find((p) => p.demo === demo);
  return project ? `/work/${project.slug}` : null;
}

export default function PlaygroundPage() {
  const cards = index
    .map((item) => ({ ...item, href: hrefFor(item.demo) }))
    .filter((item): item is typeof item & { href: string } => item.href !== null);

  return (
    <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6">
      <Reveal>
        <p className="font-mono text-sm text-cyan">Playground</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-[-0.02em] text-txt">
          Demos a reviewer can poke at.
        </h1>
        <p className="mt-4 max-w-xl text-dim">
          These read from committed project outputs and a Supabase-backed sample of real shots. No demo here
          renders an invented number: every value traces to a committed result or a real model output. Each
          one sits on its project page, next to the write-up that explains it.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {cards.map((card, i) => (
          <Reveal key={card.demo} delay={i * 0.04}>
            <Link
              href={card.href}
              className="group flex h-full flex-col rounded-xl border border-line bg-panel p-5 transition-colors hover:border-pink/40"
            >
              <h2 className="text-lg font-medium text-txt">{card.title}</h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{card.blurb}</p>
              <p className="mt-3 text-xs text-cyan">{card.why}</p>
              <span className="mt-3 text-sm text-pink group-hover:underline">Open the demo →</span>
            </Link>
          </Reveal>
        ))}
      </div>

      {/* The scorecard spans every project, so it has no single work page to live on. */}
      <div className="mt-8">
        <Reveal>
          <DemoFrame
            title="Model scorecard"
            intro="Every model across the portfolio, one card each. Filter by domain. The benchmark is the point: each card sits its value beside the incumbent, and a metric with nothing to beat is greyed."
            provenance="Hand-typed from committed results (content/metrics.ts). Football and retail are open or synthetic data; energy and consulting are professional results."
          >
            <ModelScorecard />
          </DemoFrame>
        </Reveal>
      </div>
    </div>
  );
}
