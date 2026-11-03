import Link from 'next/link';
import { BenchmarkRuler } from '@/components/figures/benchmark-ruler';
import { FigurePlate } from '@/components/figures/figure-plate';
import { site } from '@/lib/site';

const toolkit = [
  'StatsBomb-benchmarked xG',
  'Two-stage X-learner uplift',
  'Azure ML in production',
  'Drift & leakage monitoring',
];

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-20 pb-16 sm:px-6 sm:pt-28">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-16">
        <div>
          <div className="hero-reveal">
            <p className="font-mono text-xs tracking-[0.06em] text-pencil uppercase">
              {site.role} · {site.location}
            </p>
          </div>

          <div className="hero-reveal" style={{ animationDelay: '0.05s' }}>
            <h1 className="mt-6 max-w-3xl text-[clamp(2.75rem,7vw,5rem)] leading-[1.02] font-medium tracking-[-0.025em] text-balance text-ink">
              Models that{' '}
              <span className="relative inline-block whitespace-nowrap">
                earn their claims
                {/* A pen stroke, not a gradient: the claim is underlined the way a reader marks a page. */}
                <svg
                  aria-hidden
                  viewBox="0 0 300 14"
                  preserveAspectRatio="none"
                  className="absolute -bottom-[0.12em] left-0 h-[0.2em] w-full overflow-visible text-quill"
                >
                  <path
                    className="pen-stroke"
                    pathLength={1}
                    d="M3 9.5 C 60 4, 120 3.5, 180 6.5 S 270 10, 297 4.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              .
            </h1>
          </div>

          <div className="hero-reveal" style={{ animationDelay: '0.1s' }}>
            <p className="mt-8 max-w-xl text-xl leading-normal text-pretty text-graphite">
              Forecasting, causal ML, and models that earn their claims. Every metric on this site sits next to
              the thing it aims to beat, and the failures are on the page too.
            </p>
          </div>

          <div className="hero-reveal" style={{ animationDelay: '0.15s' }}>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link
                href="#work"
                className="rounded-xs bg-ink px-4 py-2.5 font-mono text-sm text-paper transition-[opacity,translate] duration-200 hover:opacity-85 active:translate-y-px"
              >
                See the work →
              </Link>
              <a
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-ink underline decoration-rule underline-offset-4 transition-colors duration-200 hover:decoration-ink"
              >
                GitHub ↗
              </a>
            </div>
          </div>

          <div className="hero-reveal" style={{ animationDelay: '0.2s' }}>
            <FigurePlate
              number={1}
              className="mt-14"
              caption="CxG diagnostic, within ~0.01 AUC of StatsBomb’s own xG (0.820): a parity check, not a contest."
            >
              <BenchmarkRuler
                ours={{ label: 'CxG', value: 0.809, display: '0.809' }}
                incumbent={{ label: 'StatsBomb xG', value: 0.82, display: '0.820' }}
                domain={[0.78, 0.84]}
                ticks={[0.78, 0.79, 0.8, 0.81, 0.82, 0.83, 0.84]}
                tickDecimals={2}
              />
            </FigurePlate>
          </div>
        </div>

        <aside
          aria-label="Notes"
          className="hero-reveal border-l border-rule pl-4 font-mono text-[12.5px] leading-relaxed text-graphite lg:border-0 lg:pt-14 lg:pl-0"
          style={{ animationDelay: '0.25s' }}
        >
          <dl className="grid gap-5">
            <div>
              <dt className="text-[11px] tracking-[0.06em] text-pencil uppercase">Reading this site</dt>
              <dd className="mt-1 text-ink">
                <span className="text-quill">●</span> marks my model. <span className="font-semibold">┃</span>{' '}
                marks the incumbent it was measured against.
              </dd>
            </div>
            <div>
              <dt className="text-[11px] tracking-[0.06em] text-pencil uppercase">Red notes</dt>
              <dd className="mt-1 border-l-2 border-redpen pl-2 text-ink">Results that did not hold up, kept on the page.</dd>
            </div>
            <div>
              <dt className="text-[11px] tracking-[0.06em] text-pencil uppercase">Toolkit</dt>
              <dd className="mt-1">
                <ul className="grid gap-1 text-ink">
                  {toolkit.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}
