'use client';

import * as React from 'react';
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { metrics, type ModelMetric } from '@/content/metrics';
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
  // Percentage-style metrics carry the unit; AUC/Brier/ATE are bare decimals; MAE/counts are integers-ish.
  if (metric.includes('%')) return `${value > 0 ? '+' : ''}${value}%`;
  if (metric === 'MAE') return value.toString();
  return value.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 5 });
}

const columns: ColumnDef<ModelMetric>[] = [
  {
    accessorKey: 'project',
    header: 'Project',
    cell: ({ row }) => <span className="text-txt">{row.original.project}</span>,
  },
  {
    accessorKey: 'model',
    header: 'Model',
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.model}</span>,
    enableSorting: false,
  },
  {
    accessorKey: 'metric',
    header: 'Metric',
    cell: ({ row }) => <span className="text-dim">{row.original.metric}</span>,
    enableSorting: false,
  },
  {
    accessorKey: 'value',
    header: 'Value',
    cell: ({ row }) => (
      <span className="font-mono text-pink">{formatValue(row.original.metric, row.original.value)}</span>
    ),
    sortingFn: (a, b) => a.original.value - b.original.value,
  },
  {
    id: 'benchmark',
    header: 'Benchmark',
    enableSorting: false,
    cell: ({ row }) => {
      const bench = row.original.benchmark;
      if (!bench) {
        return <span className="text-dim/50 italic">nothing to beat</span>;
      }
      return (
        <span className="font-mono text-cyan">
          {formatValue(row.original.metric, bench.value)}{' '}
          <span className="text-dim">{bench.name}</span>
        </span>
      );
    },
  },
  {
    accessorKey: 'dataset',
    header: 'Data',
    enableSorting: false,
    cell: ({ row }) => <span className="text-dim">{datasetLabel[row.original.dataset]}</span>,
  },
  {
    accessorKey: 'tests',
    header: 'Tests',
    cell: ({ row }) =>
      row.original.tests ? (
        <span className="font-mono text-muted-foreground">{row.original.tests}</span>
      ) : (
        <span className="text-dim/50">—</span>
      ),
    sortingFn: (a, b) => (a.original.tests ?? 0) - (b.original.tests ?? 0),
  },
  {
    accessorKey: 'state',
    header: 'State',
    enableSorting: false,
    cell: ({ row }) => {
      const s = row.original.state;
      return (
        <span
          className={cn(
            'rounded-full border px-2 py-0.5 text-xs',
            s === 'live' && 'border-cyan/30 text-cyan',
            s === 'professional' && 'border-line text-muted-foreground',
            s === 'in-development' && 'border-amber/30 text-amber',
          )}
        >
          {stateLabel[s]}
        </span>
      );
    },
  },
];

export function ModelScorecard() {
  const [domain, setDomain] = React.useState<DomainFilter>('all');
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const data = React.useMemo(
    () => (domain === 'all' ? metrics : metrics.filter((m) => m.domain === domain)),
    [domain],
  );

  // TanStack Table returns non-memoizable functions; React Compiler skips this component by design.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {domains.map((d) => (
          <button
            key={d.key}
            onClick={() => setDomain(d.key)}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-sm transition-colors',
              domain === d.key
                ? 'border-pink/40 bg-panel text-txt'
                : 'border-line text-dim hover:border-line hover:text-txt',
            )}
            aria-pressed={domain === d.key}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-line bg-bg-2">
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left font-medium text-dim"
                      aria-sort={sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : 'none'}
                    >
                      {canSort ? (
                        <button
                          onClick={header.column.getToggleSortingHandler()}
                          className="inline-flex items-center gap-1 transition-colors hover:text-txt"
                          title={
                            header.column.id === 'value'
                              ? 'Note: MAE is lower-better; other metrics higher-better'
                              : undefined
                          }
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {sorted === 'asc' ? (
                            <ArrowUp className="size-3" />
                          ) : sorted === 'desc' ? (
                            <ArrowDown className="size-3" />
                          ) : (
                            <ArrowUpDown className="size-3 opacity-40" />
                          )}
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-line/60 last:border-0 hover:bg-panel/40">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 align-top">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-dim">
        MAE is lower-better and reported as a count, not a percentage. Every value traces to a committed
        result; a greyed benchmark means the metric has no incumbent to beat.
      </p>
    </div>
  );
}
