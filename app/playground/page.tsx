import type { Metadata } from 'next';
import { Reveal } from '@/components/motion/reveal';
import { DemoFrame } from '@/components/demos/demo-frame';
import { ModelScorecard } from '@/components/demos/model-scorecard';
import { ForecastVisualiser } from '@/components/demos/forecast-visualiser';
import { UpliftExplorer } from '@/components/demos/uplift-explorer';

export const metadata: Metadata = {
  title: 'Playground',
  description: 'Interactive demos: a model scorecard, a forecast error visualiser, an uplift decile explorer, and an xG shot-map explorer.',
};

const comingSoon = [
  {
    name: 'xG shot-map explorer',
    status: 'Needs a shot-level export from the CxG model',
    body:
      'An SVG pitch of real shots, toggling between my CxG and StatsBomb’s own xG, with a diff mode so ' +
      'over- and under-valued shots pop. Ships once the export exists.',
  },
];

export default function PlaygroundPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6">
      <Reveal>
        <p className="font-mono text-sm text-cyan">Playground</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-[-0.02em] text-txt">
          Demos a reviewer can poke at.
        </h1>
        <p className="mt-4 max-w-xl text-dim">
          These read from the same static, committed data as the rest of the site. No demo here renders an
          invented number: where a real export is not ready yet, it says so instead of faking it.
        </p>
      </Reveal>

      <div className="mt-12 space-y-8">
        <Reveal>
          <DemoFrame
            title="Model scorecard"
            intro="Every model across the portfolio in one table. Sort by value or test count, filter by domain. The benchmark column is the point: a metric with nothing to beat is greyed."
            provenance="Hand-typed from committed results (content/metrics.ts). Football and retail are open or synthetic data; energy and consulting are professional results."
          >
            <ModelScorecard />
          </DemoFrame>
        </Reveal>

        <Reveal>
          <DemoFrame
            title="Forecast error visualiser"
            intro="Before/after accuracy across three roles. E.ON and Manor Park are professional results; UoB is the MSc capstone. Aggregate deltas only, no invented time series."
            provenance="Aggregate figures from MASTER_PROFILE.md, generated into data/forecast.json. E.ON and Manor Park report accuracy improvement; UoB reports out-of-sample MAE, which is a count and lower-better."
          >
            <ForecastVisualiser />
          </DemoFrame>
        </Reveal>

        <Reveal>
          <DemoFrame
            title="Uplift decile explorer"
            intro="The Qini curve and per-decile uplift from the retail X-learner. Slide to target the top K% of customers and watch the captured incremental response recompute."
            provenance="Per-decile rows from retail-intelligence/outputs/phase_uplift_v2_decile_summary.csv and headline figures from phase_uplift_v2_model_comparison.csv, generated into data/uplift-deciles.json. Synthetic retail data; demonstrates method, not a measured commercial outcome."
          >
            <UpliftExplorer />
          </DemoFrame>
        </Reveal>

        {comingSoon.map((demo) => (
          <Reveal key={demo.name}>
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
