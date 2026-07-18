import type { Metadata } from 'next';
import { Reveal } from '@/components/motion/reveal';

export const metadata: Metadata = {
  title: 'Playground',
  description: 'Four interactive demos: an xG shot-map explorer, an uplift decile explorer, a forecast error visualiser, and a model scorecard.',
};

const demos = [
  {
    name: 'xG shot-map explorer',
    status: 'Needs a shot-level export from the CxG model; ships once available',
    body:
      'An SVG pitch of real shots, toggling between my CxG and StatsBomb’s own xG, with a diff mode so ' +
      'over- and under-valued shots pop.',
  },
  {
    name: 'Uplift decile explorer',
    status: 'Data ready, demo in progress',
    body:
      'The Qini curve and per-decile uplift from the retail X-learner, with a slider to target the top K% of ' +
      'customers and see captured uplift recompute live.',
  },
  {
    name: 'Forecast error visualiser',
    status: 'Data ready, demo in progress',
    body:
      'Before/after accuracy across E.ON residual-load forecasting, Manor Park demand forecasting, and the ' +
      'UoB attendance-forecasting capstone.',
  },
  {
    name: 'Model scorecard',
    status: 'Data ready, demo in progress',
    body:
      'Every model across the portfolio in one sortable, filterable table: metric, benchmark, dataset, and ' +
      'whether it is real, synthetic, or open data.',
  },
];

export default function PlaygroundPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6">
      <Reveal>
        <p className="font-mono text-sm text-cyan">Playground</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-[-0.02em] text-txt">
          Four demos, still being built in the open.
        </h1>
        <p className="mt-4 max-w-xl text-dim">
          These read from the same static, committed data as the rest of the site. No demo here will ever
          render an invented number: where a real export is not ready yet, it says so instead of faking it.
        </p>
      </Reveal>

      <div className="mt-12 space-y-4">
        {demos.map((demo, i) => (
          <Reveal key={demo.name} delay={i * 0.05}>
            <div className="rounded-xl border border-line bg-panel p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-medium text-txt">{demo.name}</h2>
                <span className="rounded-full border border-amber/30 px-2.5 py-0.5 text-xs text-amber">
                  {demo.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{demo.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
