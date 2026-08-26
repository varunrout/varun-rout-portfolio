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
import availability from '@/data/availability.json';
import { cn } from '@/lib/utils';

const PINK = '#ff2e7e';
const LINE = '#2c2c3a';
const DIM = '#6e6e80';

function BaselineRow() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {availability.baselines.map((b) => (
        <div key={b.name} className="rounded-lg border border-line/60 bg-bg-2 px-4 py-3">
          <p className="text-xs text-dim">{b.name}</p>
          <p className="mt-1 font-mono text-lg text-txt">{b.rocAuc.toFixed(3)} <span className="text-xs text-dim">ROC-AUC</span></p>
          <p className="mt-1 text-xs text-muted-foreground">{b.note}</p>
        </div>
      ))}
    </div>
  );
}

function ChampionCard() {
  const c = availability.champion;
  return (
    <div className="rounded-xl border border-cyan/30 bg-bg-2 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-cyan/40 px-2.5 py-0.5 text-xs text-cyan">Champion</span>
        <span className="text-sm text-txt">{c.name}</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{c.note}</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-xs text-dim">Pooled rolling-origin</p>
          <p className="font-mono text-sm text-txt">
            AUC {c.pooledRollingOrigin.rocAuc} · AP {c.pooledRollingOrigin.averagePrecision} · Brier {c.pooledRollingOrigin.brier}
          </p>
        </div>
        <div>
          <p className="text-xs text-dim">Fixed validation window</p>
          <p className="font-mono text-sm text-txt">
            AUC {c.fixedValidationWindow.rocAuc} · Brier {c.fixedValidationWindow.brier}
          </p>
        </div>
      </div>
    </div>
  );
}

function AlertBudgetPanel() {
  const [rate, setRate] = React.useState<number>(availability.alertBudget.points[0].reviewRatePct);
  const point = availability.alertBudget.points.find((p) => p.reviewRatePct === rate)!;

  const data = [
    { name: 'Recall', value: point.recall },
    { name: 'False alerts / captured onset', value: point.falseAlertsPerOnset },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {availability.alertBudget.points.map((p) => (
          <button
            key={p.reviewRatePct}
            onClick={() => setRate(p.reviewRatePct)}
            aria-pressed={rate === p.reviewRatePct}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-sm transition-colors',
              rate === p.reviewRatePct ? 'border-pink/40 bg-panel text-txt' : 'border-line text-dim hover:text-txt',
            )}
          >
            {p.reviewRatePct}% review rate
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm text-dim">{availability.alertBudget.note}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-line/60 bg-bg-2 px-4 py-3">
          <p className="text-xs text-dim">Onsets captured</p>
          <p className="mt-1 font-mono text-lg text-txt">{point.onsetsCaptured} of {point.onsetsTotal}</p>
        </div>
        <div className="rounded-lg border border-line/60 bg-bg-2 px-4 py-3">
          <p className="text-xs text-dim">Recall</p>
          <p className="mt-1 font-mono text-lg text-cyan">{point.recall}</p>
        </div>
        <div className="rounded-lg border border-line/60 bg-bg-2 px-4 py-3">
          <p className="text-xs text-dim">False alerts / captured onset</p>
          <p className="mt-1 font-mono text-lg text-amber">{point.falseAlertsPerOnset}</p>
        </div>
      </div>

      <div className="mt-5 h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 24, right: 12, bottom: 8, left: 4 }}>
            <CartesianGrid stroke={LINE} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: DIM, fontSize: 11 }} tickLine={false} axisLine={{ stroke: LINE }} interval={0} />
            <YAxis tick={{ fill: DIM, fontSize: 12 }} tickLine={false} axisLine={{ stroke: LINE }} width={40} />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              contentStyle={{ background: '#181824', border: `1px solid ${LINE}`, borderRadius: 12, color: '#f3f3f7' }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} fill={PINK} maxBarSize={72}>
              <LabelList dataKey="value" position="top" fill="#f3f3f7" fontSize={12} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-dim">
        Only the two measured operating points are shown. Nothing between them is estimated.
      </p>
    </div>
  );
}

function NegativeResults() {
  return (
    <ul className="mt-2 space-y-2">
      {availability.negativeResults.map((r) => (
        <li key={r} className="rounded-lg border border-line/60 bg-bg-2 px-4 py-2.5 text-sm text-muted-foreground">
          {r}
        </li>
      ))}
    </ul>
  );
}

function BarredFigure() {
  const b = availability.barredFigure;
  return (
    <div className="rounded-xl border border-amber/30 bg-bg-2 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-amber/40 px-2.5 py-0.5 text-xs text-amber">Deliberately withheld</span>
        <span className="text-sm text-txt">{b.label}</span>
      </div>
      <p className="mt-2 font-mono text-lg text-dim line-through decoration-amber/60">{b.value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{b.note}</p>
    </div>
  );
}

export function AvailabilityExplorer() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-txt">Baselines the champion has to beat</p>
        <div className="mt-3">
          <BaselineRow />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-txt">The champion</p>
        <div className="mt-3">
          <ChampionCard />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-txt">Alert budget: two measured operating points</p>
        <div className="mt-3">
          <AlertBudgetPanel />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-txt">Reversed on my own evidence</p>
        <NegativeResults />
      </div>

      <div>
        <p className="text-sm font-medium text-txt">The number this project will never let you cite</p>
        <div className="mt-3">
          <BarredFigure />
        </div>
      </div>
    </div>
  );
}
