'use client';

import * as React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import forecast from '@/data/forecast.json';
import { cn } from '@/lib/utils';

type ImprovementSeries = { metric: string; unit: string; improvement: number };
type MaeSeries = { category: string; before: number; after: number };

type PanelKey = 'eon' | 'manorPark' | 'uob';

const panels: { key: PanelKey; label: string }[] = [
  { key: 'eon', label: 'E.ON energy' },
  { key: 'manorPark', label: 'Manor Park retail' },
  { key: 'uob', label: 'UoB attendance' },
];

const PINK = '#ff2e7e';
const CYAN = '#28e0c6';
const LINE = '#2c2c3a';
const DIM = '#6e6e80';

function ImprovementPanel({
  series,
  note,
}: {
  series: ImprovementSeries[];
  note: string;
}) {
  const data = series.map((s) => ({ name: s.metric, value: s.improvement }));
  return (
    <div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 24, right: 12, bottom: 8, left: 4 }}>
            <CartesianGrid stroke={LINE} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: DIM, fontSize: 12 }} tickLine={false} axisLine={{ stroke: LINE }} interval={0} />
            <YAxis
              tick={{ fill: DIM, fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: LINE }}
              tickFormatter={(v) => `${v}%`}
              width={40}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              contentStyle={{ background: '#181824', border: `1px solid ${LINE}`, borderRadius: 12, color: '#f3f3f7' }}
              formatter={(value) => [`+${Number(value)}%`, 'Improvement']}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} fill={PINK} maxBarSize={72}>
              <LabelList dataKey="value" position="top" formatter={(value) => `+${Number(value)}%`} fill="#f3f3f7" fontSize={12} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 text-sm text-dim">{note}</p>
    </div>
  );
}

function MaePanel({ series, note }: { series: MaeSeries[]; note: string }) {
  const data = series.map((s) => ({ name: s.category, Before: s.before, After: s.after }));
  return (
    <div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 24, right: 12, bottom: 8, left: 4 }}>
            <CartesianGrid stroke={LINE} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: DIM, fontSize: 12 }} tickLine={false} axisLine={{ stroke: LINE }} interval={0} />
            <YAxis tick={{ fill: DIM, fontSize: 12 }} tickLine={false} axisLine={{ stroke: LINE }} width={32} />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              contentStyle={{ background: '#181824', border: `1px solid ${LINE}`, borderRadius: 12, color: '#f3f3f7' }}
              formatter={(value, name) => [`${Number(value)} MAE`, name]}
            />
            <Bar dataKey="Before" radius={[6, 6, 0, 0]} fill={DIM} maxBarSize={48}>
              <Cell />
            </Bar>
            <Bar dataKey="After" radius={[6, 6, 0, 0]} fill={CYAN} maxBarSize={48}>
              <LabelList dataKey="After" position="top" fill="#f3f3f7" fontSize={12} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-dim">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm" style={{ background: DIM }} /> Before tuning
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm" style={{ background: CYAN }} /> After tuning (lower is better)
        </span>
      </div>
      <p className="mt-2 text-sm text-dim">{note}</p>
    </div>
  );
}

export function ForecastVisualiser() {
  const [panel, setPanel] = React.useState<PanelKey>('eon');

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {panels.map((p) => (
          <button
            key={p.key}
            onClick={() => setPanel(p.key)}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-sm transition-colors',
              panel === p.key ? 'border-pink/40 bg-panel text-txt' : 'border-line text-dim hover:text-txt',
            )}
            aria-pressed={panel === p.key}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {panel === 'eon' && (
          <ImprovementPanel series={forecast.eon.series as ImprovementSeries[]} note={forecast.eon.note} />
        )}
        {panel === 'manorPark' && (
          <ImprovementPanel series={forecast.manorPark.series as ImprovementSeries[]} note={forecast.manorPark.note} />
        )}
        {panel === 'uob' && <MaePanel series={forecast.uob.series as MaeSeries[]} note={forecast.uob.note} />}
      </div>
    </div>
  );
}
