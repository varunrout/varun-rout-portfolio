import { Reveal } from '@/components/motion/reveal';
import { CountUp } from '@/components/motion/count-up';

const stats = [
  {
    value: 0.809,
    decimals: 3,
    caption: 'CxG diagnostic, within ~0.01 AUC of StatsBomb’s own xG (0.820): a parity check, not a contest',
  },
  {
    value: 2.14,
    decimals: 2,
    suffix: 'M',
    caption: 'raw StatsBomb events behind the football models',
  },
  {
    value: 37,
    decimals: 0,
    prefix: '+',
    suffix: '%',
    caption: 'Manor Park quarterly forecast accuracy vs the previous approach',
  },
  {
    value: 15,
    decimals: 0,
    suffix: '%',
    caption: 'E.ON forward price-curve improvement, far seasons',
  },
];

export function ProofStrip() {
  return (
    <section className="border-y border-line/60 bg-bg-2">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Reveal key={stat.caption} delay={i * 0.05}>
            <div className="text-3xl font-semibold text-txt sm:text-4xl">
              <CountUp value={stat.value} decimals={stat.decimals} prefix={stat.prefix} suffix={stat.suffix} />
            </div>
            <p className="mt-2 text-sm text-dim">{stat.caption}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
