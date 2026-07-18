import type { Metadata } from 'next';
import { Reveal } from '@/components/motion/reveal';
import { DemoFrame } from '@/components/demos/demo-frame';
import { ModelScorecard } from '@/components/demos/model-scorecard';
import { ForecastVisualiser } from '@/components/demos/forecast-visualiser';
import { UpliftExplorer } from '@/components/demos/uplift-explorer';
import { ShotMapExplorer } from '@/components/demos/shot-map-explorer';
import { getShots } from '@/lib/shots';

export const metadata: Metadata = {
  title: 'Playground',
  description: 'Interactive demos: an xG shot-map explorer, a model scorecard, a forecast error visualiser, and an uplift decile explorer.',
  alternates: { canonical: '/playground' },
};

export default async function PlaygroundPage() {
  const shots = await getShots();

  return (
    <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6">
      <Reveal>
        <p className="font-mono text-sm text-cyan">Playground</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-[-0.02em] text-txt">
          Demos a reviewer can poke at.
        </h1>
        <p className="mt-4 max-w-xl text-dim">
          These read from committed project outputs and a Supabase-backed sample of real shots. No demo renders
          an invented number: every value traces to a committed result or a real model output.
        </p>
      </Reveal>

      <div className="mt-12 space-y-8">
        <Reveal>
          <DemoFrame
            title="xG shot-map explorer"
            intro="Real shots on an attacking-half pitch, coloured by value. Toggle between my CxG and StatsBomb's own xG, or a diff mode so over- and under-valued shots pop. Filter by team, match or pressure; the panel recomputes mean value and Brier calibration live."
            provenance="A 440-shot sample from the CxG diagnostic model (opponent-adjusted-metrics), benchmarked against StatsBomb xG on the same shots. Open StatsBomb data, served from Supabase. Full set lives in the repo."
          >
            <ShotMapExplorer shots={shots} />
          </DemoFrame>
        </Reveal>

        <Reveal>
          <DemoFrame
            title="Model scorecard"
            intro="Every model across the portfolio in one place. Sort by value or test count, filter by domain. The benchmark is the point: a metric with nothing to beat is greyed."
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
      </div>
    </div>
  );
}
