'use client';

import * as React from 'react';
import type { Shot } from '@/lib/shots';
import { cn } from '@/lib/utils';

const PINK = '#ff2e7e';
const CYAN = '#28e0c6';
const LINE = '#2c2c3a';
const DIM = '#7e7e90';
const TXT = '#f3f3f7';

/* StatsBomb pitch: x 0-120 (goal at 120), y 0-80. We render the attacking end, goal at top. */
const X_NEAR = 58; // bottom of the view
const X_GOAL = 121; // just past the goal line for depth
const VB_W = 800;
const VB_H = 630;
const PAD = 26;
const innerW = VB_W - 2 * PAD;
const innerH = VB_H - 2 * PAD;

const px = (y: number) => PAD + (y / 80) * innerW;
const py = (x: number) => PAD + ((X_GOAL - x) / (X_GOAL - X_NEAR)) * innerH;

type MetricMode = 'cxg' | 'xg' | 'diff';
type PressureFilter = 'all' | 'pressure' | 'no-pressure';

const dotRadius = (value: number) => 3 + Math.sqrt(Math.max(0, value)) * 11;

function Pitch() {
  // Rectangles/lines in pitch coords, mapped through px/py. Drawn once.
  const stroke = LINE;
  const box = { x0: 18, x1: 62, yTop: 102, yBot: 120 }; // penalty area (y 18-62, x 102-120)
  const six = { x0: 30, x1: 50, yTop: 114, yBot: 120 }; // six-yard box
  return (
    <g fill="none" stroke={stroke} strokeWidth={1.5}>
      {/* outer bounds of the shown area */}
      <rect x={px(0)} y={py(X_GOAL)} width={px(80) - px(0)} height={py(X_NEAR) - py(X_GOAL)} />
      {/* penalty area */}
      <rect x={px(box.x0)} y={py(box.yBot)} width={px(box.x1) - px(box.x0)} height={py(box.yTop) - py(box.yBot)} />
      {/* six-yard box */}
      <rect x={px(six.x0)} y={py(six.yBot)} width={px(six.x1) - px(six.x0)} height={py(six.yTop) - py(six.yBot)} />
      {/* goal */}
      <line x1={px(36)} y1={py(120)} x2={px(44)} y2={py(120)} stroke={TXT} strokeWidth={2.5} />
      {/* penalty spot */}
      <circle cx={px(40)} cy={py(108)} r={2.5} fill={DIM} stroke="none" />
      {/* penalty arc (approx, the part outside the box) */}
      <path
        d={`M ${px(30.5)} ${py(102)} A ${(px(50) - px(30)) / 2} ${(py(102) - py(112)) / 1} 0 0 1 ${px(49.5)} ${py(102)}`}
      />
    </g>
  );
}

const MemoPitch = React.memo(Pitch);

function mean(xs: number[]) {
  return xs.length ? xs.reduce((s, v) => s + v, 0) / xs.length : 0;
}
function brier(shots: Shot[], key: 'cxg' | 'statsbomb_xg') {
  if (!shots.length) return 0;
  return mean(shots.map((s) => (s[key] - s.goal) ** 2));
}

export function ShotMapExplorer({ shots }: { shots: Shot[] }) {
  const [metric, setMetric] = React.useState<MetricMode>('cxg');
  const [team, setTeam] = React.useState<string>('all');
  const [match, setMatch] = React.useState<string>('all');
  const [pressure, setPressure] = React.useState<PressureFilter>('all');
  const [hovered, setHovered] = React.useState<{ shot: Shot; x: number; y: number } | null>(null);

  const teams = React.useMemo(() => Array.from(new Set(shots.map((s) => s.team))).sort(), [shots]);
  const matches = React.useMemo(() => Array.from(new Set(shots.map((s) => s.match))).sort(), [shots]);

  const filtered = React.useMemo(
    () =>
      shots.filter(
        (s) =>
          (team === 'all' || s.team === team) &&
          (match === 'all' || s.match === match) &&
          (pressure === 'all' || (pressure === 'pressure' ? s.pressure : !s.pressure)),
      ),
    [shots, team, match, pressure],
  );

  const agg = React.useMemo(() => {
    const meanCxg = mean(filtered.map((s) => s.cxg));
    const meanXg = mean(filtered.map((s) => s.statsbomb_xg));
    return {
      n: filtered.length,
      goals: filtered.reduce((s, r) => s + r.goal, 0),
      meanCxg,
      meanXg,
      brierCxg: brier(filtered, 'cxg'),
      brierXg: brier(filtered, 'statsbomb_xg'),
    };
  }, [filtered]);

  if (!shots.length) {
    return (
      <div className="rounded-lg border border-line bg-bg-2 p-6 text-sm text-dim">
        Shot data is unavailable right now. The sample lives in Supabase; check the connection and reload.
      </div>
    );
  }

  const colourFor = (s: Shot) => {
    if (metric === 'cxg') return PINK;
    if (metric === 'xg') return CYAN;
    return s.cxg >= s.statsbomb_xg ? PINK : CYAN; // diff: pink = my model higher, cyan = StatsBomb higher
  };
  const valueFor = (s: Shot) =>
    metric === 'cxg' ? s.cxg : metric === 'xg' ? s.statsbomb_xg : Math.abs(s.cxg - s.statsbomb_xg);

  const modes: { key: MetricMode; label: string }[] = [
    { key: 'cxg', label: 'My CxG' },
    { key: 'xg', label: 'StatsBomb xG' },
    { key: 'diff', label: 'Diff (CxG − xG)' },
  ];
  const pressures: { key: PressureFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pressure', label: 'Under pressure' },
    { key: 'no-pressure', label: 'No pressure' },
  ];

  const selectCls =
    'rounded-lg border border-line bg-bg-2 px-3 py-1.5 text-sm text-txt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink/60';

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {modes.map((m) => (
          <button
            key={m.key}
            onClick={() => setMetric(m.key)}
            aria-pressed={metric === m.key}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-sm transition-colors',
              metric === m.key ? 'border-pink/40 bg-panel text-txt' : 'border-line text-dim hover:text-txt',
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <label className="sr-only" htmlFor="shot-team">
          Filter by team
        </label>
        <select id="shot-team" value={team} onChange={(e) => setTeam(e.target.value)} className={selectCls}>
          <option value="all">All teams</option>
          {teams.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <label className="sr-only" htmlFor="shot-match">
          Filter by match
        </label>
        <select id="shot-match" value={match} onChange={(e) => setMatch(e.target.value)} className={selectCls}>
          <option value="all">All matches</option>
          {matches.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-1">
          {pressures.map((p) => (
            <button
              key={p.key}
              onClick={() => setPressure(p.key)}
              aria-pressed={pressure === p.key}
              className={cn(
                'rounded-lg border px-2.5 py-1.5 text-xs transition-colors',
                pressure === p.key ? 'border-cyan/40 bg-panel text-txt' : 'border-line text-dim hover:text-txt',
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Pitch */}
        <div className="relative">
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            className="w-full rounded-xl border border-line bg-bg-2"
            role="img"
            aria-label={`Shot map of ${agg.n} shots, coloured by ${metric === 'diff' ? 'CxG minus StatsBomb xG' : metric === 'cxg' ? 'my CxG' : 'StatsBomb xG'}`}
            onMouseLeave={() => setHovered(null)}
          >
            <MemoPitch />
            {filtered.map((s) => (
              <circle
                key={s.id}
                cx={px(s.y)}
                cy={py(s.x)}
                r={dotRadius(valueFor(s))}
                fill={colourFor(s)}
                fillOpacity={metric === 'diff' ? 0.7 : 0.35 + valueFor(s) * 0.6}
                stroke={s.goal ? TXT : 'none'}
                strokeWidth={s.goal ? 1.5 : 0}
                onMouseEnter={(e) => setHovered({ shot: s, x: e.clientX, y: e.clientY })}
                onMouseMove={(e) => setHovered({ shot: s, x: e.clientX, y: e.clientY })}
              />
            ))}
          </svg>

          {/* Legend */}
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-dim">
            {metric === 'diff' ? (
              <>
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full" style={{ background: PINK }} /> CxG higher
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full" style={{ background: CYAN }} /> StatsBomb higher
                </span>
              </>
            ) : (
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full" style={{ background: metric === 'cxg' ? PINK : CYAN }} />
                Larger, brighter dot = higher {metric === 'cxg' ? 'CxG' : 'xG'}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full border" style={{ borderColor: TXT }} /> White ring = goal
            </span>
          </div>

          {hovered && (
            <div
              className="pointer-events-none fixed z-50 rounded-lg border border-line bg-panel px-3 py-2 text-xs shadow-lg"
              style={{ left: hovered.x + 14, top: hovered.y + 14 }}
            >
              <p className="font-medium text-txt">
                {hovered.shot.team} {hovered.shot.goal ? '· goal' : ''}
              </p>
              <p className="mt-1 font-mono text-pink">CxG {hovered.shot.cxg.toFixed(3)}</p>
              <p className="font-mono text-cyan">xG {hovered.shot.statsbomb_xg.toFixed(3)}</p>
              <p className="mt-1 text-dim">
                {hovered.shot.distance.toFixed(1)} m · {hovered.shot.pressure ? 'under pressure' : 'no pressure'} ·{' '}
                {hovered.shot.game_state}
              </p>
            </div>
          )}
        </div>

        {/* Aggregate panel */}
        <div className="rounded-xl border border-line bg-panel p-5">
          <p className="text-sm font-medium text-txt">
            {agg.n} shots{team !== 'all' || match !== 'all' || pressure !== 'all' ? ' (filtered)' : ''}
          </p>
          <p className="mt-0.5 text-xs text-dim">{agg.goals} goals in this selection</p>

          {/* mean value bar-pair */}
          <div className="mt-5 space-y-3">
            <BarPair label="Mean CxG" value={agg.meanCxg} colour={PINK} max={Math.max(agg.meanCxg, agg.meanXg, 0.01)} />
            <BarPair
              label="Mean StatsBomb xG"
              value={agg.meanXg}
              colour={CYAN}
              max={Math.max(agg.meanCxg, agg.meanXg, 0.01)}
            />
          </div>

          {/* Brier calibration */}
          <div className="mt-6 border-t border-line/60 pt-4">
            <p className="text-xs text-dim">Brier score on this selection (lower is better calibrated)</p>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-txt">CxG</span>
              <span className={cn('font-mono', agg.brierCxg <= agg.brierXg ? 'text-pink' : 'text-dim')}>
                {agg.brierCxg.toFixed(4)}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between text-sm">
              <span className="text-txt">StatsBomb xG</span>
              <span className={cn('font-mono', agg.brierXg < agg.brierCxg ? 'text-cyan' : 'text-dim')}>
                {agg.brierXg.toFixed(4)}
              </span>
            </div>
          </div>

          <p className="mt-5 text-xs text-dim">
            Actual goal rate {agg.n ? (agg.goals / agg.n).toFixed(3) : '0.000'}. Both are shot-quality estimates;
            the point is that CxG sits next to StatsBomb&apos;s own number on the same shots, not in isolation.
          </p>
        </div>
      </div>
    </div>
  );
}

function BarPair({ label, value, colour, max }: { label: string; value: number; colour: string; max: number }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-dim">{label}</span>
        <span className="font-mono text-txt">{value.toFixed(4)}</span>
      </div>
      <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-bg-2">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: colour }} />
      </div>
    </div>
  );
}
