'use client';

import * as React from 'react';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { Group } from '@visx/group';
import { ParentSize } from '@visx/responsive';
import { scaleBand, scaleLinear } from '@visx/scale';
import { Bar, Line, LinePath } from '@visx/shape';
import { useReducedMotion } from 'motion/react';
import uplift from '@/data/uplift-deciles.json';

/* Palette (mirrors the tokens in globals.css; charts need raw hex). */
const PINK = '#ff2e7e';
const CYAN = '#28e0c6';
const LINE = '#2c2c3a';
const DIM = '#6e6e80';
const TXT = '#f3f3f7';

type Decile = {
  decile: number;
  n: number;
  n_treatment: number;
  n_control: number;
  observed_uplift: number;
  cumulative: number;
  qini: number;
};

type Headline = { ate: number; topDecile: number; qiniArea: number; spearman: number };

const deciles = (uplift.deciles as Decile[]).slice().sort((a, b) => a.decile - b.decile);
const headline = uplift.headline as Headline;

/* Cumulative population fraction + captured Qini, with an origin point at (0, 0). */
const totalN = deciles.reduce((s, d) => s + d.n, 0);
const totalQini = deciles.length ? deciles[deciles.length - 1].qini : 0;

type CumPoint = { frac: number; qini: number };
const cumPoints: CumPoint[] = (() => {
  const pts: CumPoint[] = [{ frac: 0, qini: 0 }];
  let cumN = 0;
  for (const d of deciles) {
    cumN += d.n;
    pts.push({ frac: cumN / totalN, qini: d.qini });
  }
  return pts;
})();

/* Linear interpolation of captured incremental responders at a targeted population fraction. */
function capturedAt(frac: number): number {
  if (frac <= 0) return 0;
  if (frac >= 1) return totalQini;
  for (let i = 1; i < cumPoints.length; i++) {
    const p0 = cumPoints[i - 1];
    const p1 = cumPoints[i];
    if (frac <= p1.frac) {
      const t = (frac - p0.frac) / (p1.frac - p0.frac || 1);
      return p0.qini + t * (p1.qini - p0.qini);
    }
  }
  return totalQini;
}

const numberFmt = (v: number, dp = 0) =>
  v.toLocaleString('en-GB', { minimumFractionDigits: dp, maximumFractionDigits: dp });

/* ------------------------------------------------------------------ */
/* Bar chart: observed uplift per decile (pp)                          */
/* ------------------------------------------------------------------ */
function UpliftBars({
  width,
  targetedThrough,
  animate,
}: {
  width: number;
  targetedThrough: number; // deciles 1..targetedThrough are highlighted (0 = none)
  animate: boolean;
}) {
  const height = 288;
  const margin = { top: 20, right: 12, bottom: 36, left: 40 };
  const innerW = Math.max(0, width - margin.left - margin.right);
  const innerH = height - margin.top - margin.bottom;

  const x = scaleBand<number>({
    domain: deciles.map((d) => d.decile),
    range: [0, innerW],
    padding: 0.28,
  });
  const maxPp = Math.max(...deciles.map((d) => d.observed_uplift)) * 100;
  const y = scaleLinear<number>({ domain: [0, maxPp * 1.15], range: [innerH, 0], nice: true });

  return (
    <svg width={width} height={height} role="img" aria-label="Observed uplift per predicted decile, in percentage points">
      <Group left={margin.left} top={margin.top}>
        <AxisLeft
          scale={y}
          numTicks={4}
          tickFormat={(v) => `${Number(v)}`}
          stroke={LINE}
          tickStroke={LINE}
          tickLabelProps={() => ({ fill: DIM, fontSize: 11, dx: -4, dy: 3, textAnchor: 'end' })}
        />
        {deciles.map((d, i) => {
          const pp = d.observed_uplift * 100;
          const barH = innerH - (y(pp) ?? 0);
          const barX = x(d.decile) ?? 0;
          const targeted = d.decile <= targetedThrough;
          return (
            <g
              key={d.decile}
              style={{
                transformBox: 'fill-box',
                transformOrigin: 'center bottom',
                transform: animate ? 'scaleY(0)' : 'scaleY(1)',
                animation: animate ? `uplift-grow 480ms ease-out ${i * 45}ms forwards` : undefined,
              }}
            >
              <Bar
                x={barX}
                y={y(pp) ?? 0}
                width={x.bandwidth()}
                height={Math.max(0, barH)}
                rx={4}
                fill={targeted ? PINK : DIM}
                opacity={targetedThrough === 0 ? (d.decile === 1 ? 1 : 0.55) : targeted ? 1 : 0.35}
              />
            </g>
          );
        })}
        {deciles.map((d) => {
          const pp = d.observed_uplift * 100;
          return (
            <text
              key={`lbl-${d.decile}`}
              x={(x(d.decile) ?? 0) + x.bandwidth() / 2}
              y={(y(pp) ?? 0) - 6}
              textAnchor="middle"
              fill={TXT}
              fontSize={10}
              fontFamily="var(--font-mono)"
            >
              {pp.toFixed(1)}
            </text>
          );
        })}
        <AxisBottom
          scale={x}
          top={innerH}
          stroke={LINE}
          tickStroke={LINE}
          tickFormat={(v) => `${v}`}
          tickLabelProps={() => ({ fill: DIM, fontSize: 11, textAnchor: 'middle', dy: 2 })}
        />
        <text x={innerW / 2} y={height - margin.top - 2} textAnchor="middle" fill={DIM} fontSize={11}>
          Predicted decile (1 = highest predicted uplift)
        </text>
      </Group>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Qini curve: cumulative captured uplift vs random targeting          */
/* ------------------------------------------------------------------ */
function QiniCurve({ width, targetFrac }: { width: number; targetFrac: number }) {
  const height = 288;
  const margin = { top: 20, right: 16, bottom: 40, left: 44 };
  const innerW = Math.max(0, width - margin.left - margin.right);
  const innerH = height - margin.top - margin.bottom;

  const x = scaleLinear<number>({ domain: [0, 1], range: [0, innerW] });
  const y = scaleLinear<number>({ domain: [0, totalQini * 1.02], range: [innerH, 0], nice: true });

  const markerX = x(targetFrac);
  const markerY = y(capturedAt(targetFrac));

  return (
    <svg width={width} height={height} role="img" aria-label="Cumulative captured uplift versus random targeting (Qini curve)">
      <Group left={margin.left} top={margin.top}>
        <AxisLeft
          scale={y}
          numTicks={4}
          stroke={LINE}
          tickStroke={LINE}
          tickLabelProps={() => ({ fill: DIM, fontSize: 11, dx: -4, dy: 3, textAnchor: 'end' })}
        />
        <AxisBottom
          scale={x}
          top={innerH}
          numTicks={5}
          tickFormat={(v) => `${Math.round(Number(v) * 100)}%`}
          stroke={LINE}
          tickStroke={LINE}
          tickLabelProps={() => ({ fill: DIM, fontSize: 11, textAnchor: 'middle', dy: 2 })}
        />
        {/* random-targeting diagonal */}
        <Line
          from={{ x: x(0), y: y(0) }}
          to={{ x: x(1), y: y(totalQini) }}
          stroke={CYAN}
          strokeWidth={1.5}
          strokeDasharray="5 4"
          opacity={0.8}
        />
        {/* model Qini curve */}
        <LinePath<CumPoint>
          data={cumPoints}
          x={(p) => x(p.frac)}
          y={(p) => y(p.qini)}
          stroke={PINK}
          strokeWidth={2.25}
        />
        {/* target marker */}
        <Line from={{ x: markerX, y: innerH }} to={{ x: markerX, y: markerY }} stroke={TXT} strokeWidth={1} opacity={0.35} />
        <circle cx={markerX} cy={markerY} r={4.5} fill={PINK} stroke={TXT} strokeWidth={1.5} />
        <text x={innerW / 2} y={height - margin.top - 2} textAnchor="middle" fill={DIM} fontSize={11}>
          Share of customers targeted (highest predicted first)
        </text>
      </Group>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
function Callout({ value, label, sub }: { value: string; label: string; sub: string }) {
  return (
    <div className="rounded-lg border border-line/60 bg-bg-2 px-4 py-3">
      <p className="font-mono text-lg text-pink">{value}</p>
      <p className="mt-0.5 text-xs text-txt">{label}</p>
      <p className="text-xs text-dim">{sub}</p>
    </div>
  );
}

export function UpliftExplorer() {
  const reduceMotion = useReducedMotion();
  const [k, setK] = React.useState(20); // target the top K% of customers

  // Empty / malformed guard.
  if (!deciles.length) {
    return (
      <div className="rounded-lg border border-line bg-bg-2 p-6 text-sm text-dim">
        Uplift data is unavailable. Re-run <span className="font-mono text-txt">pnpm data</span> to regenerate
        <span className="font-mono text-txt"> data/uplift-deciles.json</span>.
      </div>
    );
  }

  const frac = k / 100;
  const captured = capturedAt(frac);
  const capturedPct = totalQini > 0 ? (captured / totalQini) * 100 : 0;
  const randomCaptured = frac * totalQini;
  const lift = randomCaptured > 0 ? captured / randomCaptured : 0;
  const targetedCustomers = Math.round(frac * totalN);
  const targetedThrough = Math.round(k / 10); // whole deciles fully covered (approx, for bar highlight)
  const animateBars = !reduceMotion;
  const multiple = headline.ate > 0 ? headline.topDecile / headline.ate : 0;

  return (
    <div>
      <style>{`@keyframes uplift-grow { from { transform: scaleY(0); } to { transform: scaleY(1); } }`}</style>

      {/* Headline callouts, all from committed results. */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Callout value={`+${headline.ate.toFixed(4)}`} label="Overall ATE" sub="response-rate lift" />
        <Callout
          value={`+${headline.topDecile.toFixed(4)}`}
          label="Top decile"
          sub={`~${multiple.toFixed(1)}x the average`}
        />
        <Callout value={numberFmt(headline.qiniArea, 1)} label="Qini area" sub="vs random targeting" />
        <Callout value={headline.spearman.toFixed(3)} label="Spearman rank" sub="predicted vs observed" />
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <p className="mb-1 text-sm font-medium text-txt">Observed uplift by decile</p>
          <p className="mb-2 text-xs text-dim">
            Percentage-point lift in response rate, treatment vs control, within each predicted decile.
          </p>
          <div className="h-72 w-full">
            <ParentSize>
              {({ width }) =>
                width > 0 ? (
                  <UpliftBars width={width} targetedThrough={targetedThrough} animate={animateBars} />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-dim">Loading chart…</div>
                )
              }
            </ParentSize>
          </div>
        </div>

        <div>
          <p className="mb-1 text-sm font-medium text-txt">Qini curve</p>
          <p className="mb-2 text-xs text-dim">
            Cumulative incremental responders captured (pink) against random targeting (cyan).
          </p>
          <div className="h-72 w-full">
            <ParentSize>
              {({ width }) =>
                width > 0 ? (
                  <QiniCurve width={width} targetFrac={frac} />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-dim">Loading chart…</div>
                )
              }
            </ParentSize>
          </div>
        </div>
      </div>

      {/* Targeting slider */}
      <div className="mt-6 rounded-xl border border-line bg-bg-2 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label htmlFor="uplift-k" className="text-sm font-medium text-txt">
            Target the top{' '}
            <span className="font-mono text-pink">{k}%</span> of customers
          </label>
          <span className="text-xs text-dim">≈ {numberFmt(targetedCustomers)} of {numberFmt(totalN)} customers</span>
        </div>
        <input
          id="uplift-k"
          type="range"
          min={0}
          max={100}
          step={1}
          value={k}
          onChange={(e) => setK(Number(e.target.value))}
          aria-valuetext={`${k}% of customers targeted`}
          className="mt-3 w-full accent-pink"
        />
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-line/60 bg-panel px-4 py-3">
            <p className="font-mono text-lg text-pink">{capturedPct.toFixed(1)}%</p>
            <p className="mt-0.5 text-xs text-dim">of total incremental response captured</p>
          </div>
          <div className="rounded-lg border border-line/60 bg-panel px-4 py-3">
            <p className="font-mono text-lg text-txt">{numberFmt(captured, 0)}</p>
            <p className="mt-0.5 text-xs text-dim">incremental responders (model units)</p>
          </div>
          <div className="rounded-lg border border-line/60 bg-panel px-4 py-3">
            <p className="font-mono text-lg text-cyan">{lift ? `${lift.toFixed(2)}x` : '—'}</p>
            <p className="mt-0.5 text-xs text-dim">the random-targeting baseline</p>
          </div>
        </div>
      </div>

      {/* Screen-reader table mirroring the chart data. */}
      <table className="sr-only">
        <caption>Observed uplift and cumulative captured responders per predicted decile</caption>
        <thead>
          <tr>
            <th>Decile</th>
            <th>Customers</th>
            <th>Observed uplift (pp)</th>
            <th>Cumulative captured responders</th>
          </tr>
        </thead>
        <tbody>
          {deciles.map((d) => (
            <tr key={d.decile}>
              <td>{d.decile}</td>
              <td>{numberFmt(d.n)}</td>
              <td>{(d.observed_uplift * 100).toFixed(2)}</td>
              <td>{numberFmt(d.qini, 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-4 text-xs text-dim">
        Synthetic retail data; demonstrates method, not a measured commercial outcome. The Qini series is
        derived from committed per-decile counts; headline figures are read straight from the committed
        model-comparison output.
      </p>
    </div>
  );
}
