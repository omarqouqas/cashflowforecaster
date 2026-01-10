'use client';

import { formatCurrency } from '@/lib/utils/format';

type Props = {
  data: Array<{
    label: string;
    amount: number;
    status: 'good' | 'below_average' | 'danger';
  }>;
  average: number;
  dangerThreshold?: number | null;
};

function statusClass(status: Props['data'][number]['status']) {
  if (status === 'danger') return 'bg-rose-500';
  if (status === 'below_average') return 'bg-amber-500';
  return 'bg-teal-500';
}

export function IncomeBarChart({ data, average, dangerThreshold }: Props) {
  const maxValue = Math.max(
    1,
    ...data.map((d) => d.amount),
    average || 0,
    dangerThreshold || 0
  );

  const averagePct = Math.min(100, Math.max(0, (average / maxValue) * 100));
  const dangerPct =
    dangerThreshold && dangerThreshold > 0 ? Math.min(100, Math.max(0, (dangerThreshold / maxValue) * 100)) : null;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">Monthly income</p>
          <p className="mt-1 text-xs text-zinc-500">
            Teal = above average • Amber = below average • Rose = below expense threshold
          </p>
        </div>
        <div className="text-xs text-zinc-500">
          Average: <span className="text-zinc-200 tabular-nums">{formatCurrency(average)}</span>
          {dangerThreshold ? (
            <>
              {' '}
              • Expenses: <span className="text-rose-200 tabular-nums">{formatCurrency(dangerThreshold)}</span>
            </>
          ) : null}
        </div>
      </div>

      <div className="mt-5 relative">
        {/* average line */}
        <div
          aria-hidden="true"
          className="absolute left-0 right-0 border-t border-dashed border-zinc-500/60"
          style={{ bottom: `${averagePct}%` }}
        />

        {/* danger threshold line */}
        {dangerPct !== null ? (
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 border-t border-dashed border-rose-500/60"
            style={{ bottom: `${dangerPct}%` }}
          />
        ) : null}

        {/* IMPORTANT: this container has explicit height so % bar heights render correctly */}
        <div className="h-[220px]" aria-label="Income bar chart">
          <div className="absolute inset-0 flex items-end gap-2 px-1">
            {data.map((d, idx) => {
              const pct = Math.min(100, Math.max(0, (d.amount / maxValue) * 100));
              return (
                <div key={`${d.label}-${idx}`} className="flex-1 min-w-0 h-full flex items-end">
                  <div
                    title={`${d.label}: ${formatCurrency(d.amount)}`}
                    className={['w-full rounded-t-md', statusClass(d.status)].join(' ')}
                    style={{ height: `${pct}%` }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* labels */}
      <div className="mt-3 flex gap-2 px-1">
        {data.map((d, idx) => (
          <div key={`${d.label}-label-${idx}`} className="flex-1 min-w-0">
            <p className="text-[11px] text-zinc-500 text-center truncate">{d.label}</p>
            <p className="text-[11px] text-zinc-300 text-center tabular-nums">{formatCurrency(d.amount)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

