import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/motion/reveal';
import { site } from '@/lib/site';

const pills = [
  'StatsBomb-benchmarked xG',
  'Two-stage X-learner uplift',
  'Azure ML in production',
  'Drift & leakage monitoring',
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[560px] w-[560px] -translate-x-1/2 rounded-full opacity-20 blur-[120px]"
        style={{ background: 'var(--grad)' }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6 sm:pt-36">
        <Reveal>
          <p className="font-mono text-sm text-cyan">
            {site.role} · {site.location}
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="mt-4 max-w-3xl text-[clamp(2.5rem,6vw,4.25rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-txt">
            Models that <span className="text-gradient">earn their claims</span>.
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-6 max-w-xl text-lg text-dim">
            Forecasting, causal ML, and models that earn their claims. Every metric on this site sits next to
            the thing it aims to beat, and the failures are on the page too.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-8 flex flex-wrap gap-2">
            {pills.map((pill) => (
              <span
                key={pill}
                className="rounded-full border border-line bg-panel px-3 py-1 text-xs text-muted-foreground"
              >
                {pill}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button size="lg" nativeButton={false} render={<Link href="#work" />}>
              See the work
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<a href={site.github} target="_blank" rel="noopener noreferrer" />}
            >
              GitHub
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
