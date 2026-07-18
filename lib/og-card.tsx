/* Shared Open Graph card, rendered by next/og (Satori).
 * Satori supports a flexbox subset only: every multi-child node needs display:flex,
 * inline styles only, gradients allowed in backgroundImage. Keep it defensive. */

const BG = '#0a0a0f';
const LINE = '#2c2c3a';
const TXT = '#f3f3f7';
const DIM = '#9c9cad';
const PINK = '#ff2e7e';
const CYAN = '#28e0c6';

export const OG_SIZE = { width: 1200, height: 630 };

/** Best-effort: pull the first number out of a pre-formatted metric string. */
function firstNumber(s?: string): number | null {
  if (!s) return null;
  const m = s.match(/-?\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : null;
}

export type OgCardProps = {
  kicker: string;
  title: string;
  /** Optional benchmark pair — renders the signature bar motif when both parse. */
  metricLabel?: string;
  mineText?: string;
  benchText?: string;
};

export function OgCard({ kicker, title, metricLabel, mineText, benchText }: OgCardProps) {
  const mine = firstNumber(mineText);
  const bench = firstNumber(benchText);
  const showBars = mine !== null && bench !== null && mine > 0 && bench > 0;
  const max = showBars ? Math.max(mine!, bench!) : 1;
  const BAR_MAX = 560;
  const mineW = showBars ? Math.max(48, (mine! / max) * BAR_MAX) : 0;
  const benchW = showBars ? Math.max(48, (bench! / max) * BAR_MAX) : 0;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: BG,
        backgroundImage: `radial-gradient(900px 500px at 12% -10%, rgba(255,46,126,0.18), transparent 60%), linear-gradient(to right, ${LINE} 1px, transparent 1px), linear-gradient(to bottom, ${LINE} 1px, transparent 1px)`,
        backgroundSize: '100% 100%, 60px 60px, 60px 60px',
        padding: '64px 72px',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Top row: wordmark + eyebrow */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 30, letterSpacing: '-0.02em' }}>
          <span style={{ color: TXT, fontWeight: 700 }}>varun</span>
          <span style={{ color: PINK, fontWeight: 700 }}>.</span>
          <span style={{ color: DIM, fontWeight: 700 }}>rout</span>
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 22,
            color: DIM,
            border: `1px solid ${LINE}`,
            borderRadius: 999,
            padding: '8px 20px',
          }}
        >
          {kicker}
        </div>
      </div>

      {/* Title */}
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 1000 }}>
        <div style={{ display: 'flex', fontSize: 64, lineHeight: 1.08, color: TXT, fontWeight: 700, letterSpacing: '-0.02em' }}>
          {title}
        </div>
      </div>

      {/* Bottom: benchmark bar pair (signature motif) or a divider */}
      {showBars ? (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {metricLabel ? (
            <div style={{ display: 'flex', fontSize: 22, color: DIM, marginBottom: 16 }}>{metricLabel}</div>
          ) : null}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ display: 'flex', width: mineW, height: 44, backgroundColor: PINK, borderRadius: 10 }} />
            <div style={{ display: 'flex', marginLeft: 20, fontSize: 30, color: TXT, fontWeight: 700 }}>{mineText}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', width: benchW, height: 44, backgroundColor: CYAN, borderRadius: 10 }} />
            <div style={{ display: 'flex', marginLeft: 20, fontSize: 26, color: DIM }}>{benchText}</div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', height: 10, width: 220, borderRadius: 999, backgroundImage: `linear-gradient(120deg, ${PINK}, #b14bf4 55%, ${CYAN} 120%)` }} />
          <div style={{ display: 'flex', marginLeft: 24, fontSize: 26, color: DIM }}>
            Forecasting · causal ML · models that earn their claims
          </div>
        </div>
      )}
    </div>
  );
}
