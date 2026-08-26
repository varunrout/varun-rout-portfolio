'use client';

import * as React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import climate from '@/data/climate.json';
import { cn } from '@/lib/utils';

const CYAN = '#28e0c6';
const LINE = '#2c2c3a';
const DIM = '#6e6e80';

type Tab = 'backtest' | 'gate' | 'rejected';

const tabs: { key: Tab; label: string }[] = [
  { key: 'backtest', label: 'Backtest reproduction' },
  { key: 'gate', label: 'Energy-feature gate' },
  { key: 'rejected', label: 'Rejected track' },
];

function BacktestPanel() {
  const data = climate.backtest.series.map((s) => ({ name: s.metric, value: s.value }));
  const cov = climate.backtest.coverage;

  return (
    <div>
      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 24, right: 12, bottom: 8, left: 4 }}>
            <CartesianGrid stroke={LINE} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: DIM, fontSize: 11 }} tickLine={false} axisLine={{ stroke: LINE }} interval={0} />
            <YAxis tick={{ fill: DIM, fontSize: 12 }} tickLine={false} axisLine={{ stroke: LINE }} width={48} />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              contentStyle={{ background: '#181824', border: `1px solid ${LINE}`, borderRadius: 12, color: '#f3f3f7' }}
              formatter={(value) => [`${Number(value)} MAE`, 'Median absolute error']}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} fill={CYAN} maxBarSize={72}>
              <LabelList dataKey="value" position="top" fill="#f3f3f7" fontSize={12} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 text-sm text-dim">{climate.backtest.note}</p>

      <div className="mt-5 rounded-xl border border-amber/30 bg-bg-2 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-amber/40 px-2.5 py-0.5 text-xs text-amber">
            Published miss, not tuned away
          </span>
          <span className="text-xs text-dim">90% interval coverage</span>
        </div>
        <div className="mt-3 flex items-end gap-6">
          <div>
            <p className="font-mono text-2xl text-amber">{cov.measured}%</p>
            <p className="text-xs text-dim">measured, across {cov.splits} splits</p>
          </div>
          <div>
            <p className="font-mono text-2xl text-dim">{cov.target}%</p>
            <p className="text-xs text-dim">target</p>
          </div>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{cov.note}</p>
      </div>
    </div>
  );
}

function GatePanel() {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{climate.energyGate.note}</p>
      <div className="mt-4 space-y-2">
        {climate.energyGate.checks.map((c) => (
          <div
            key={c.name}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line/60 bg-bg-2 px-4 py-2.5"
          >
            <span className="text-sm text-txt">{c.name}</span>
            <span className="flex items-center gap-2 text-xs text-dim">
              {c.threshold}
              <span className="rounded-full border border-cyan/40 px-2 py-0.5 text-cyan">{c.result}</span>
            </span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-dim">
        Frozen as <span className="font-mono text-txt">{climate.energyGate.frozenAs}</span>. The v1 baseline score
        is preserved as a permanent comparison artefact; publishing requires both v1 and v2 to exist.
      </p>
    </div>
  );
}

function RejectedPanel() {
  return (
    <div className="rounded-xl border border-line/60 bg-bg-2 p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-line px-2.5 py-0.5 text-xs text-dim">Built, evaluated, not shipped</span>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{climate.rejectedTrack.note}</p>
      <p className="mt-3 font-mono text-xs text-dim">Decision: {climate.rejectedTrack.decision}</p>
    </div>
  );
}

export function ClimateExplorer() {
  const [tab, setTab] = React.useState<Tab>('backtest');

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            aria-pressed={tab === t.key}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-sm transition-colors',
              tab === t.key ? 'border-pink/40 bg-panel text-txt' : 'border-line text-dim hover:text-txt',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-5">
        {tab === 'backtest' && <BacktestPanel />}
        {tab === 'gate' && <GatePanel />}
        {tab === 'rejected' && <RejectedPanel />}
      </div>
    </div>
  );
}
