'use client';

import * as React from 'react';
import { ParentSize } from '@visx/responsive';
import { scaleLinear } from '@visx/scale';
import data from '@/data/contextual-lift.json';
import { cn } from '@/lib/utils';

const PINK = '#ff2e7e';
const CYAN = '#28e0c6';
const LINE = '#2c2c3a';
const DIM = '#6e6e80';
const AMBER = '#f5b841';

type Delta = {
  baseline: string;
  metric: string;
  delta_mean: number;
  ci_low: number;
  ci_high: number;
  excludesZero: boolean;
};

type MetricBlock = {
  key: string;
  label: string;
  name: string;
  headlineMetric: string;
  evaluation: string;
  note: string;
  nBootstrap: number | null;
  sample: { shots: number | null; goals: number | null; actions: number | null; created: number | null };
  candidate: string;
  strictBaseline: string;
  perModel: Record<string, Record<string, number>>;
  deltas: Delta[];
  verdict: string;
  beatsStrictBaseline: boolean;
};

type Validity = {
  spearman: number;
  pearson: number;
  n_players: number;
  decision: string;
};

// The three reports carry different metric keys (classification vs regression), so the inferred
// JSON literal type is a union that does not overlap Record<string, number>. Widen deliberately;
// every field access below is guarded.
const metrics = data.metrics as unknown as MetricBlock[];
const lowerIsBetter = new Set(data.lowerIsBetter as string[]);
const externalValidity = data.externalValidity as unknown as {
  evaluation: string;
  cxgVsGoals: Validity;
  cxaVsAssists: Validity;
};

const prettyMetric: Record<string, string> = {
  log_loss: 'Log loss',
  brier: 'Brier',
  roc_auc: 'ROC AUC',
  pr_auc: 'PR AUC',
  ece: 'ECE',
  mae: 'MAE',
  rmse: 'RMSE',
  spearman: 'Spearman',
  mean_pred: 'Mean prediction',
};

const prettyModel = (m: string) =>
  m.replace(/_/g, ' ').replace(/\bxg\b/i, 'xG').replace(/\bglm\b/i, 'GLM');

const fmt = (v: number, dp = 4) =>
  v.toLocaleString('en-GB', { minimumFractionDigits: dp, maximumFractionDigits: dp });

/** A delta only licenses a claim if its CI excludes zero and points the helpful way. */
function direction(d: Delta): 'better' | 'worse' | 'none' {
  if (!d.excludesZero) return 'none';
  const lower = lowerIsBetter.has(d.metric);
  const improved = lower ? d.delta_mean < 0 : d.delta_mean > 0;
  return improved ? 'better' : 'worse';
}

/* ------------------------------------------------------------------ */
/* One bootstrap CI against zero. Each strip gets its own scale, because  */
/* an AUC delta and an MAE delta do not belong on a shared axis.          */
/* ------------------------------------------------------------------ */
function DeltaStrip({ d, width }: { d: Delta; width: number }) {
  const height = 44;
  const padX = 8;
  const innerW = Math.max(0, width - padX * 2);
  const midY = 22;

  const bound = Math.max(Math.abs(d.ci_low), Math.abs(d.ci_high), Math.abs(d.delta_mean)) * 1.25 || 1;
  const x = scaleLinear<number>({ domain: [-bound, bound], range: [0, innerW] });

  const dir = direction(d);
  const colour = dir === 'better' ? PINK : dir === 'worse' ? AMBER : DIM;

  return (
    <svg width={width} height={height} role="img" aria-label={`${d.metric} delta versus ${d.baseline}`}>
      <g transform={`translate(${padX},0)`}>
        {/* axis */}
        <line x1={0} x2={innerW} y1={midY} y2={midY} stroke={LINE} strokeWidth={1} />
        {/* zero reference: the line the CI has to clear */}
        <line x1={x(0)} x2={x(0)} y1={midY - 13} y2={midY + 13} stroke={CYAN} strokeWidth={1.5} strokeDasharray="3 3" />
        <text x={x(0)} y={midY + 25} textAnchor="middle" fill={DIM} fontSize={9}>
          0
        </text>
        {/* confidence interval */}
        <line x1={x(d.ci_low)} x2={x(d.ci_high)} y1={midY} y2={midY} stroke={colour} strokeWidth={2.5} />
        <line x1={x(d.ci_low)} x2={x(d.ci_low)} y1={midY - 6} y2={midY + 6} stroke={colour} strokeWidth={2} />
        <line x1={x(d.ci_high)} x2={x(d.ci_high)} y1={midY - 6} y2={midY + 6} stroke={colour} strokeWidth={2} />
        {/* point estimate */}
        <circle cx={x(d.delta_mean)} cy={midY} r={4} fill={colour} stroke="#0a0a0f" strokeWidth={1.5} />
      </g>
    </svg>
  );
}

function DeltaRow({ d }: { d: Delta }) {
  const dir = direction(d);
  const verdict =
    dir === 'better'
      ? 'CI excludes zero'
      : dir === 'worse'
        ? 'CI excludes zero, wrong way'
        : 'CI crosses zero';
  return (
    <div className="rounded-lg border border-line/60 bg-bg-2 px-4 py-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className="text-sm text-txt">
          {prettyMetric[d.metric] ?? d.metric}{' '}
          <span className="text-dim">vs {prettyModel(d.baseline)}</span>
        </p>
        <span
          className={cn(
            'rounded-full border px-2 py-0.5 text-xs',
            dir === 'better' && 'border-pink/40 text-pink',
            dir === 'worse' && 'border-amber/40 text-amber',
            dir === 'none' && 'border-line text-dim',
          )}
        >
          {verdict}
        </span>
      </div>
      <div className="mt-1">
        <ParentSize>
          {({ width }) => (width > 0 ? <DeltaStrip d={d} width={width} /> : <div className="h-11" />)}
        </ParentSize>
      </div>
      <p className="font-mono text-xs text-dim">
        Δ {fmt(d.delta_mean)} [{fmt(d.ci_low)}, {fmt(d.ci_high)}]
        <span className="ml-2 text-dim/70">
          {lowerIsBetter.has(d.metric) ? 'lower is better' : 'higher is better'}
        </span>
      </p>
    </div>
  );
}

function ModelTable({ block }: { block: MetricBlock }) {
  const models = Object.keys(block.perModel);
  const cols = Array.from(new Set(models.flatMap((m) => Object.keys(block.perModel[m]))));

  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full min-w-[420px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line bg-bg-2">
            <th className="px-3 py-2 text-left font-medium text-dim">Model</th>
            {cols.map((c) => (
              <th key={c} className="px-3 py-2 text-right font-medium text-dim">
                {prettyMetric[c] ?? c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {models.map((m) => {
            const isCandidate = m === block.candidate;
            const isStrict = m === block.strictBaseline;
            return (
              <tr key={m} className="border-b border-line/60 last:border-0">
                <td className="px-3 py-2">
                  <span className={cn(isCandidate && 'text-pink', isStrict && 'text-cyan', !isCandidate && !isStrict && 'text-muted-foreground')}>
                    {prettyModel(m)}
                  </span>
                  {isCandidate && <span className="ml-2 text-xs text-dim">this model</span>}
                  {isStrict && <span className="ml-2 text-xs text-dim">benchmark</span>}
                </td>
                {cols.map((c) => (
                  <td
                    key={c}
                    className={cn(
                      'px-3 py-2 text-right font-mono',
                      isCandidate ? 'text-pink' : isStrict ? 'text-cyan' : 'text-muted-foreground',
                    )}
                  >
                    {typeof block.perModel[m][c] === 'number' ? fmt(block.perModel[m][c], 4) : '—'}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function sampleLine(block: MetricBlock): string {
  const s = block.sample;
  const bits: string[] = [];
  if (s.shots !== null) bits.push(`${s.shots.toLocaleString('en-GB')} held-out shots`);
  if (s.goals !== null) bits.push(`${s.goals.toLocaleString('en-GB')} goals`);
  if (s.actions !== null) bits.push(`${s.actions.toLocaleString('en-GB')} held-out actions`);
  if (s.created !== null) bits.push(`${s.created.toLocaleString('en-GB')} created shots`);
  if (block.nBootstrap) bits.push(`${block.nBootstrap.toLocaleString('en-GB')}-sample paired bootstrap`);
  return bits.join(' · ');
}

export function ContextualLift() {
  const [active, setActive] = React.useState(metrics[0]?.key ?? 'cxg');

  if (!metrics.length) {
    return (
      <div className="rounded-lg border border-line bg-bg-2 p-6 text-sm text-dim">
        Contextual lift data is unavailable. Re-run <span className="font-mono text-txt">pnpm data</span>.
      </div>
    );
  }

  const block = metrics.find((m) => m.key === active) ?? metrics[0];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {metrics.map((m) => (
          <button
            key={m.key}
            onClick={() => setActive(m.key)}
            aria-pressed={m.key === active}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-sm transition-colors',
              m.key === active ? 'border-pink/40 bg-panel text-txt' : 'border-line text-dim hover:text-txt',
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Verdict, quoted verbatim from the committed report. */}
      <div
        className={cn(
          'mt-5 rounded-xl border p-4',
          block.beatsStrictBaseline ? 'border-cyan/30 bg-bg-2' : 'border-amber/30 bg-bg-2',
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              'rounded-full border px-2.5 py-0.5 text-xs',
              block.beatsStrictBaseline ? 'border-cyan/40 text-cyan' : 'border-amber/40 text-amber',
            )}
          >
            {block.beatsStrictBaseline ? 'Beats its benchmark' : 'Does not beat its benchmark'}
          </span>
          <span className="text-xs text-dim">
            {block.name} · benchmark: {prettyModel(block.strictBaseline)}
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{block.verdict}</p>
      </div>

      <p className="mt-4 text-xs text-dim">{sampleLine(block)}</p>
      {block.note && <p className="mt-1 text-xs text-dim">{block.note}</p>}

      <div className="mt-4">
        <ModelTable block={block} />
      </div>

      <p className="mt-6 text-sm font-medium text-txt">Change vs baseline, with 95% bootstrap interval</p>
      <p className="mt-1 text-xs text-dim">
        The dashed cyan line is zero. An interval that straddles it does not support a claim, however
        good the point estimate looks.
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {block.deltas.map((d) => (
          <DeltaRow key={`${d.baseline}-${d.metric}`} d={d} />
        ))}
      </div>

      {/* External validity: does the metric survive contact with real outcomes? */}
      <div className="mt-8 rounded-xl border border-line bg-bg-2 p-5">
        <p className="text-sm font-medium text-txt">External validity</p>
        <p className="mt-1 text-xs text-dim">{externalValidity.evaluation}</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {[
            { title: 'CxG vs actual goals', v: externalValidity.cxgVsGoals, good: true },
            { title: 'CxA vs actual assists', v: externalValidity.cxaVsAssists, good: false },
          ].map(({ title, v, good }) => (
            <div
              key={title}
              className={cn('rounded-lg border px-4 py-3', good ? 'border-line/60' : 'border-amber/30')}
            >
              <p className="text-xs text-dim">{title}</p>
              <p className={cn('mt-1 font-mono text-lg', good ? 'text-cyan' : 'text-amber')}>
                {v.spearman.toFixed(3)} <span className="text-xs text-dim">Spearman</span>
              </p>
              <p className="text-xs text-dim">n = {v.n_players.toLocaleString('en-GB')} players</p>
              <p className="mt-2 text-xs text-muted-foreground">{v.decision}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs text-dim">
        Open StatsBomb data. Verdict and decision strings are quoted verbatim from the committed reports,
        including where the conclusion is negative.
      </p>
    </div>
  );
}
