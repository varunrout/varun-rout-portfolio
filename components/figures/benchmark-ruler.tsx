import type * as React from 'react';

type RulerMark = {
  label: string;
  value: number;
  /** Pre-formatted, as the content layer states it. Never derived here. */
  display: string;
};

type BenchmarkRulerProps = {
  ours: RulerMark;
  incumbent: RulerMark;
  domain: [number, number];
  ticks: number[];
  tickDecimals: number;
  /** Optional pre-formatted gap, e.g. "Δ +0.032". */
  delta?: string;
};

/*
 * The site's signature figure: my model (a quill dot) and the incumbent it was measured against (an ink
 * bar) on one number line, so the gap is read rather than claimed. Whichever mark sits further left takes
 * its label leftwards and the other rightwards, so close values never collide.
 */
export function BenchmarkRuler({ ours, incumbent, domain, ticks, tickDecimals, delta }: BenchmarkRulerProps) {
  const [min, max] = domain;
  const pct = (v: number) => `${((v - min) / (max - min)) * 100}%`;
  const oursLeft = ours.value <= incumbent.value;

  // A label running towards a near edge is pinned to that edge instead, so it never leaves the plate.
  const labelPlacement = (v: number, leftward: boolean): { className: string; style: React.CSSProperties } => {
    const at = (v - min) / (max - min);
    if (leftward && at < 0.4) return { className: 'left-0', style: {} };
    if (!leftward && at > 0.6) return { className: 'right-0 text-right', style: {} };
    return { className: leftward ? '-translate-x-full pr-2.5' : 'pl-2.5', style: { left: pct(v) } };
  };
  const oursPlace = labelPlacement(ours.value, oursLeft);
  const incumbentPlace = labelPlacement(incumbent.value, !oursLeft);
  const labelBase = 'absolute top-0 whitespace-nowrap font-mono text-xs';

  return (
    <div
      role="img"
      aria-label={`${ours.label} ${ours.display} against ${incumbent.label} ${incumbent.display}`}
      className="px-2"
    >
      <div aria-hidden className="relative h-[84px]">
        <span className={`${labelBase} ${oursPlace.className} font-medium text-quill`} style={oursPlace.style}>
          {ours.label} {ours.display}
        </span>
        <span className={`${labelBase} ${incumbentPlace.className} text-ink`} style={incumbentPlace.style}>
          {incumbent.label} {incumbent.display}
        </span>

        <div className="absolute inset-x-0 top-11 h-px bg-ink" />
        {ticks.map((t) => (
          <div key={t} className="absolute top-[40px]" style={{ left: pct(t) }}>
            <div className="h-2 w-px bg-pencil" />
            <span className="absolute top-5 -translate-x-1/2 font-mono text-[11px] text-pencil">
              {t.toFixed(tickDecimals)}
            </span>
          </div>
        ))}

        <div
          className="ruler-mark absolute top-8 h-6 w-[3px] -translate-x-1/2 bg-ink"
          style={{ left: pct(incumbent.value), animationDelay: '0.55s' }}
        />
        <div className="absolute top-11" style={{ left: pct(ours.value) }}>
          <div className="ruler-mark size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-quill ring-2 ring-plate" />
        </div>

        {delta ? (
          <span
            className="absolute top-[68px] -translate-x-1/2 font-mono text-[11px] text-graphite"
            style={{ left: pct((ours.value + incumbent.value) / 2) }}
          >
            {delta}
          </span>
        ) : null}
      </div>
    </div>
  );
}
