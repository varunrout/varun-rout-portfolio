import { Reveal } from '@/components/motion/reveal';

const habits = [
  {
    title: 'Benchmark against the incumbent',
    body:
      'CxG is reported next to StatsBomb’s own xG on the same shots, not in isolation. A metric with nothing ' +
      'to beat does not lead a headline.',
  },
  {
    title: 'Report negative results',
    body:
      'The betting-market model does not beat the market, most configurations are unprofitable, and the site ' +
      'says so. The honest negative result is the asset, not the edge.',
  },
  {
    title: 'Test for leakage, then enforce it',
    body:
      'Defensive Actions Expected (in development) archived its own compromised v0-v9 results rather than ' +
      'presenting them, and now runs an enforced leakage guard checked in CI.',
  },
  {
    title: 'Calibrate and validate out of sample',
    body:
      'Brier scores and log loss sit alongside AUC. Held-out and cross-validated results are reported ' +
      'separately from training numbers, and walk-forward splits protect the time-series work.',
  },
];

export function RigourManifesto() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <Reveal>
        <p className="font-mono text-sm text-cyan">The rigour manifesto</p>
        <h2 className="mt-2 max-w-2xl text-3xl font-semibold tracking-[-0.02em] text-txt sm:text-4xl">
          Four habits, applied the same way across three domains.
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-5 sm:auto-rows-fr sm:grid-cols-2">
        {habits.map((habit, i) => (
          <Reveal key={habit.title} delay={i * 0.05}>
            <div className="h-full rounded-xl border border-line bg-panel p-6">
              <span className="font-mono text-sm text-pink">0{i + 1}</span>
              <h3 className="mt-2 text-lg font-medium text-txt">{habit.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{habit.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
