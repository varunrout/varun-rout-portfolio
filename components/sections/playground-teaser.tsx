import Link from 'next/link';
import { Reveal } from '@/components/motion/reveal';

const demos = [
  { name: 'xG shot-map explorer', blurb: 'CxG vs StatsBomb xG on real shots, pitch view' },
  { name: 'Uplift decile explorer', blurb: 'Qini curve and top-K targeting from the X-learner' },
  { name: 'Forecast error visualiser', blurb: 'Before/after accuracy across E.ON, Manor Park, UoB' },
  { name: 'Model scorecard', blurb: 'Every model, every benchmark, sortable and filterable' },
];

export function PlaygroundTeaser() {
  return (
    <section className="border-y border-line/60 bg-bg-2">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-sm text-cyan">Playground</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.02em] text-txt sm:text-4xl">
                Four demos a reviewer can poke at.
              </h2>
            </div>
            <Link href="/playground" className="text-sm text-pink hover:underline">
              Open the playground →
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {demos.map((demo, i) => (
            <Reveal key={demo.name} delay={i * 0.05}>
              <Link
                href="/playground"
                className="group flex h-full flex-col rounded-xl border border-line bg-panel p-5 transition-all hover:-translate-y-0.5 hover:border-cyan/40"
              >
                <p className="font-medium text-txt">{demo.name}</p>
                <p className="mt-2 text-sm text-dim">{demo.blurb}</p>
                <span className="mt-auto pt-4 text-xs text-dim transition-colors group-hover:text-cyan">
                  Coming soon
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
