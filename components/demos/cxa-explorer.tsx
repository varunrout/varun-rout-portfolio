'use client';

import * as React from 'react';
import cxa from '@/data/cxa.json';
import { cn } from '@/lib/utils';

const PINK = '#ff2e7e';
const CYAN = '#28e0c6';

type Metric = {
  key: string;
  label: string;
  direction: string;
  baseline: number;
  diagnostic: number;
  delta: number;
};
type Player = { name: string; team: string; actions: number; shotCreating: number; total: number; mean: number; rank: number };
type Team = Omit<Player, 'team'>;
type Driver = { driverType: string; name: string; featureGroup: string; impact: number; rank: number };

const metrics = cxa.metrics as Metric[];
const players = cxa.players as Player[];
const teams = cxa.teams as Team[];
const drivers = cxa.drivers as Driver[];
const model = cxa.model;

type Board = 'players' | 'teams';
type SortKey = 'total' | 'mean' | 'actions' | 'shotCreating';

const sorts: { key: SortKey; label: string }[] = [
  { key: 'total', label: 'Total CxA' },
  { key: 'mean', label: 'Mean CxA per action' },
  { key: 'actions', label: 'Actions' },
  { key: 'shotCreating', label: 'Shot-creating actions' },
];

const fmt = (v: number, dp = 4) =>
  v.toLocaleString('en-GB', { minimumFractionDigits: dp, maximumFractionDigits: dp });
const fmtInt = (v: number) => v.toLocaleString('en-GB', { maximumFractionDigits: 0 });

/** Baseline vs diagnostic as the benchmark-pair motif, scaled within the selected metric. */
function MetricPair({ m }: { m: Metric }) {
  const lowerBetter = m.direction === 'lower-better';
  const improved = lowerBetter ? m.delta < 0 : m.delta > 0;
  const max = Math.max(m.baseline, m.diagnostic) || 1;

  return (
    <div className="mt-4 space-y-3">
      <div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-dim">Diagnostic v1</span>
          <span className="font-mono text-pink">{fmt(m.diagnostic)}</span>
        </div>
        <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-bg-2">
          <div className="h-full rounded-full" style={{ width: `${(m.diagnostic / max) * 100}%`, background: PINK }} />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-dim">Own baseline</span>
          <span className="font-mono text-cyan">{fmt(m.baseline)}</span>
        </div>
        <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-bg-2">
          <div className="h-full rounded-full" style={{ width: `${(m.baseline / max) * 100}%`, background: CYAN }} />
        </div>
      </div>
      <p className="text-xs text-dim">
        <span className={improved ? 'text-pink' : 'text-amber'}>
          {m.delta > 0 ? '+' : ''}
          {fmt(m.delta)}
        </span>{' '}
        {improved ? 'better than' : 'worse than'} the baseline. {lowerBetter ? 'Lower is better' : 'Higher is better'}{' '}
        for this metric.
      </p>
    </div>
  );
}

function LeaderCard({ row, board, sortKey }: { row: Player | Team; board: Board; sortKey: SortKey }) {
  const team = board === 'players' ? (row as Player).team : null;
  const primary =
    sortKey === 'total' ? row.total : sortKey === 'mean' ? row.mean : sortKey === 'actions' ? row.actions : row.shotCreating;
  const primaryLabel = sorts.find((s) => s.key === sortKey)!.label;
  const isCount = sortKey === 'actions' || sortKey === 'shotCreating';

  return (
    <div className="flex flex-col rounded-xl border border-line bg-panel p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-txt">{row.name}</p>
          {team ? <p className="truncate text-xs text-dim">{team}</p> : null}
        </div>
        <span className="shrink-0 font-mono text-xs text-dim">#{row.rank}</span>
      </div>
      <p className="mt-3 font-mono text-xl text-pink">{isCount ? fmtInt(primary) : fmt(primary, sortKey === 'mean' ? 4 : 2)}</p>
      <p className="text-[11px] text-dim">{primaryLabel}</p>
      <div className="mt-auto grid grid-cols-2 gap-x-3 gap-y-1 pt-3 text-[11px] text-dim">
        <span>Total {fmt(row.total, 2)}</span>
        <span>Mean {fmt(row.mean)}</span>
        <span>{fmtInt(row.actions)} actions</span>
        <span>{fmtInt(row.shotCreating)} shot-creating</span>
      </div>
    </div>
  );
}

export function CxaExplorer() {
  const [metricKey, setMetricKey] = React.useState('precision_at_top_1pct');
  const [board, setBoard] = React.useState<Board>('players');
  const [sortKey, setSortKey] = React.useState<SortKey>('total');
  const [showAll, setShowAll] = React.useState(false);
  const [driverView, setDriverView] = React.useState<'feature' | 'feature_group'>('feature');

  const metric = metrics.find((m) => m.key === metricKey) ?? metrics[0];

  const rows = React.useMemo(() => {
    const source: (Player | Team)[] = board === 'players' ? players : teams;
    return [...source].sort((a, b) => (b[sortKey] as number) - (a[sortKey] as number));
  }, [board, sortKey]);

  const TOP_N = 12;
  const visible = showAll ? rows : rows.slice(0, TOP_N);

  const driverRows = React.useMemo(
    () => drivers.filter((d) => d.driverType === driverView).sort((a, b) => b.impact - a.impact).slice(0, 10),
    [driverView],
  );
  const driverMax = Math.max(...driverRows.map((d) => d.impact), 0.0001);

  if (!metrics.length) {
    return (
      <div className="rounded-lg border border-line bg-bg-2 p-6 text-sm text-dim">
        CxA data is unavailable. Re-run <span className="font-mono text-txt">pnpm data</span> to regenerate
        <span className="font-mono text-txt"> data/cxa.json</span>.
      </div>
    );
  }

  const selectCls =
    'rounded-lg border border-line bg-bg-2 px-3 py-1.5 text-sm text-txt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink/60';

  return (
    <div>
      {/* 1. Model panel */}
      <div className="rounded-xl border border-line bg-panel p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-txt">Diagnostic v1 against its own baseline</p>
            <p className="mt-1 max-w-xl text-xs text-dim">
              Over {fmtInt(model.actionRowCount)} action rows. There is no off-the-shelf expected-assists model to
              compare against, so this is an internal baseline, not an industry incumbent.
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-amber/30 px-2.5 py-0.5 text-xs text-amber">
            {model.promotionStatus.replace(/_/g, ' ')}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="cxa-metric">
            Choose metric
          </label>
          <select id="cxa-metric" value={metricKey} onChange={(e) => setMetricKey(e.target.value)} className={selectCls}>
            {metrics.map((m) => (
              <option key={m.key} value={m.key}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <MetricPair m={metric} />

        {metric.key === 'precision_at_top_1pct' && (
          <p className="mt-3 rounded-lg border border-line/60 bg-bg-2 p-3 text-xs text-muted-foreground">
            The headline. Among the actions the model is most confident about, the share that actually created a shot
            rose from {fmt(metric.baseline, 3)} to {fmt(metric.diagnostic, 3)} — {fmt(metric.delta * 100, 1)} percentage
            points.
          </p>
        )}

        <p className="mt-3 text-xs text-dim">
          scikit-learn GradientBoostingClassifier, sigmoid-calibrated · {model.selectedFeatureCount} selected features ·
          promotion gate {model.promotionGatePassed ? 'passed' : 'not passed'}
        </p>
      </div>

      {/* 2. Leaderboard */}
      <div className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          {(['players', 'teams'] as Board[]).map((b) => (
            <button
              key={b}
              onClick={() => { setBoard(b); setShowAll(false); }}
              aria-pressed={board === b}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-sm capitalize transition-colors',
                board === b ? 'border-pink/40 bg-panel text-txt' : 'border-line text-dim hover:text-txt',
              )}
            >
              {b}
            </button>
          ))}
          <label className="sr-only" htmlFor="cxa-sort">
            Sort leaderboard by
          </label>
          <select id="cxa-sort" value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)} className={selectCls}>
            {sorts.map((s) => (
              <option key={s.key} value={s.key}>
                Sort by {s.label}
              </option>
            ))}
          </select>
        </div>

        <p className="mt-3 text-xs text-dim">
          Volume and efficiency tell different stories: sort by total and by mean to see it. Özil leads on total CxA,
          but Sánchez creates more per action, and Fàbregas has the most actions of the leaders with the lowest mean.
        </p>

        <div className="mt-4 grid gap-3 sm:auto-rows-fr sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((row) => (
            <LeaderCard key={`${board}-${row.name}`} row={row} board={board} sortKey={sortKey} />
          ))}
        </div>

        {rows.length > TOP_N && (
          <button
            onClick={() => setShowAll((v) => !v)}
            className="mt-4 rounded-lg border border-line px-3 py-1.5 text-sm text-dim transition-colors hover:text-txt"
          >
            {showAll ? `Show top ${TOP_N}` : `Show all ${rows.length}`}
          </button>
        )}

        {/* Screen-reader mirror of the leaderboard */}
        <table className="sr-only">
          <caption>{board === 'players' ? 'Players' : 'Teams'} by diagnostic CxA</caption>
          <thead>
            <tr>
              <th>Rank</th><th>Name</th><th>Total CxA</th><th>Mean CxA</th><th>Actions</th><th>Shot-creating</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`sr-${r.name}`}>
                <td>{r.rank}</td><td>{r.name}</td><td>{fmt(r.total, 2)}</td>
                <td>{fmt(r.mean)}</td><td>{fmtInt(r.actions)}</td><td>{fmtInt(r.shotCreating)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 3. Feature drivers */}
      <div className="mt-6 rounded-xl border border-line bg-panel p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium text-txt">What drives the model</p>
          <div className="flex items-center gap-1">
            {([['feature', 'Features'], ['feature_group', 'Groups']] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setDriverView(key)}
                aria-pressed={driverView === key}
                className={cn(
                  'rounded-lg border px-2.5 py-1 text-xs transition-colors',
                  driverView === key ? 'border-cyan/40 bg-bg-2 text-txt' : 'border-line text-dim hover:text-txt',
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {driverRows.map((d) => (
            <div key={d.name}>
              <div className="flex items-center justify-between text-xs">
                <span className="truncate text-txt">{d.name}</span>
                <span className="ml-3 shrink-0 font-mono text-dim">{fmt(d.impact)}</span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-bg-2">
                <div className="h-full rounded-full" style={{ width: `${(d.impact / driverMax) * 100}%`, background: PINK }} />
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs text-dim">
          Progression and location dominate, led by {model.topFeatureDriver?.name}. That is an honest description of
          what the model leans on, not a claim of subtle contextual insight.
        </p>
      </div>
    </div>
  );
}
