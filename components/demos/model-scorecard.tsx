'use client';

import * as React from 'react';
import { metrics, metricDirection, type ModelMetric } from '@/content/metrics';
import { cn } from '@/lib/utils';

type DomainFilter = 'all' | ModelMetric['domain'];

const domains: { key: DomainFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'football', label: 'Football' },
  { key: 'energy', label: 'Energy' },
  { key: 'retail', label: 'Retail' },
  { key: 'consulting', label: 'Consulting' },
];

const stateLabel: Record<ModelMetric['state'], string> = {
  live: 'Live',
  professional: 'Professional',
  'in-development': 'In dev',
};

const datasetLabel: Record<ModelMetric['dataset'], string> = {
  real: 'Real',
  synthetic: 'Synthetic',
  open: 'Open',
};

function formatValue(metric: string, value: number): string {
  if (metric.includes('%')) return `${value > 0 ? '+' : ''}${value}%`;
  if (metric === 'MAE') return value.toString();
  return value.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 5 });
}

/** The benchmark bar-pair: my value in pink beside the incumbent in cyan, scaled within the card. */
function BarPair({ m }: { m: ModelMetric }) {
  const bench = m.benchmark!;
  const max = Math.max(m.value, bench.value) || 1;
  const mineW = (m.value / max) * 100;
  const benchW = (bench.value / max) * 100;
  const lowerBetter = metricDirection[m.metric] === 'lower-better';
  const ahead = lowerBetter ? m.value <= bench.value : m.value >= bench.value;

  return (
    <div className="mt-3 space-y-2">
      <div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-dim">This model</span>
          <span className="font-mono text-pink">{formatValue(m.metric, m.value)}</span>
        </div>
        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-bg-2">
          <div className="h-full rounded-full bg-pink" style={{ width: `${mineW}%` }} />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-dim">{bench.name}</span>
          <span className="font-mono text-cyan">{formatValue(m.metric, bench.value)}</span>
        </div>
        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-bg-2">
          <div className="h-full rounded-full bg-cyan" style={{ width: `${benchW}%` }} />
        </div>
      </div>
      <p className="text-[11px] text-dim">
        {ahead ? 'Ahead of' : 'Behind'} the benchmark{lowerBetter ? ' (lower is better)' : ''}.
      </p>
    </div>
  );
}

function ScoreCard({ m }: { m: ModelMetric }) {
  const hasBar = m.benchmark && m.benchmark.value !== 0;
  const improvementOverBaseline = m.benchmark && m.benchmark.value === 0;

  return (
    <div className="flex flex-col rounded-xl border border-line bg-panel p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-txt">{m.project}</p>
        <span
          className={cn(
            'shrink-0 rounded-full border px-2 py-0.5 text-[11px]',
            m.state === 'live' && 'border-cyan/30 text-cyan',
            m.state === 'professional' && 'border-line text-muted-foreground',
            m.state === 'in-development' && 'border-amber/30 text-amber',
          )}
        >
          {stateLabel[m.state]}
        </span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{m.model}</p>
      <p className="text-xs text-dim">{m.task}</p>

      {/* Headline value */}
      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-mono text-2xl text-pink">{formatValue(m.metric, m.value)}</span>
        <span className="text-xs text-dim">{m.metric}</span>
      </div>

      {hasBar ? (
        <BarPair m={m} />
      ) : improvementOverBaseline ? (
        <p className="mt-2 text-xs text-cyan">vs {m.benchmark!.name}</p>
      ) : (
        <p className="mt-2 text-xs italic text-dim/60">No incumbent to beat</p>
      )}

      <div className="mt-auto flex items-center gap-3 pt-4 text-[11px] text-dim">
        <span>{datasetLabel[m.dataset]}</span>
        {m.tests ? (
          <>
            <span aria-hidden>·</span>
            <span className="font-mono">{m.tests} tests</span>
          </>
        ) : null}
      </div>
    </div>
  );
}

export function ModelScorecard() {
  const [domain, setDomain] = React.useState<DomainFilter>('all');

  const data = React.useMemo(
    () => (domain === 'all' ? metrics : metrics.filter((m) => m.domain === domain)),
    [domain],
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {domains.map((d) => (
          <button
            key={d.key}
            onClick={() => setDomain(d.key)}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-sm transition-colors',
              domain === d.key ? 'border-pink/40 bg-panel text-txt' : 'border-line text-dim hover:text-txt',
            )}
            aria-pressed={domain === d.key}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {data.map((m, i) => (
          <ScoreCard key={`${m.project}-${m.metric}-${i}`} m={m} />
        ))}
      </div>

      <p className="mt-4 text-xs text-dim">
        Every value traces to a committed result. A card with no incumbent is greyed: a metric with nothing to
        beat is not a win. MAE is lower-better and reported as a count, not a percentage.
      </p>
    </div>
  );
}
