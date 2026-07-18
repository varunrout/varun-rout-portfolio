import type { Metadata } from 'next';
import { Reveal } from '@/components/motion/reveal';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About',
  description: 'How Varun Rout works, and the move from energy markets into applied data science.',
  alternates: { canonical: '/about' },
};

const habits = [
  { verb: 'Benchmark', body: 'every metric against an incumbent, never in isolation.' },
  { verb: 'Calibrate', body: 'and check Brier scores and log loss, not just AUC.' },
  { verb: 'Test for leakage', body: 'then enforce it in CI, not just at review time.' },
  { verb: 'Monitor drift', body: 'once a model is in production, not just at launch.' },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <Reveal>
        <p className="font-mono text-sm text-cyan">About</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-[-0.02em] text-txt">
          From energy markets to models that show their working.
        </h1>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mt-8 space-y-5 text-dim">
          <p>
            I am {site.name}, an applied data scientist based in {site.location}. Most of my professional work
            has been forecasting: residual-load and price-curve modelling at E.ON, network-charge risk
            modelling before that, and multi-horizon demand forecasting at Manor Park Trading Company, the only
            role that carried the title &ldquo;Data Scientist&rdquo;.
          </p>
          <p>
            The E.ON contract was fixed-term and ran its course at the end of 2025. Since January 2026 I have
            put that time into an independent portfolio, with a deliberate focus on football analytics: an
            opponent-adjusted expected-goals model benchmarked directly against StatsBomb&rsquo;s own metric, a
            causal uplift model for retail campaign targeting, and a betting-market backtest that is honest
            about not beating the market.
          </p>
          <p>
            The thread across all of it is the same: a model is not finished when it trains. It is finished
            when you know what it gets wrong, what it should be compared to, and what you would not claim about
            it. That is what this site tries to show on every project page, not just the ones with good
            numbers.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-14">
          <p className="font-mono text-sm text-cyan">How I work</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {habits.map((habit) => (
              <div key={habit.verb} className="rounded-xl border border-line bg-panel p-5">
                <p className="font-medium text-txt">{habit.verb}</p>
                <p className="mt-1 text-sm text-muted-foreground">{habit.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="mt-14 rounded-xl border border-line bg-panel p-6">
          <p className="font-medium text-txt">Get in touch</p>
          <p className="mt-2 text-sm text-dim">
            <a href={`mailto:${site.email}`} className="text-pink hover:underline">
              {site.email}
            </a>{' '}
            · <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="text-pink hover:underline">LinkedIn</a>{' '}
            · <a href={site.github} target="_blank" rel="noopener noreferrer" className="text-pink hover:underline">GitHub</a>
          </p>
        </div>
      </Reveal>
    </div>
  );
}
