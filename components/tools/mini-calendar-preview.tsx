'use client';

import { formatCurrency, formatDateOnly } from '@/lib/utils/format';
import type { TimelineDay } from '@/lib/tools/calculate-affordability';

type Props = {
  timeline: TimelineDay[];
  lowestDate?: string;
};

function statusColor(balance: number) {
  if (balance < 0) return 'bg-rose-500';
  if (balance < 200) return 'bg-amber-400';
  return 'bg-teal-500';
}

export function MiniCalendarPreview({ timeline, lowestDate }: Props) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-4">
        <p className="text-sm text-zinc-400">Run a calculation to see your timeline.</p>
      </div>
    );
  }

  const maxAbs = Math.max(
    1,
    ...timeline.map((d) => Math.abs(d.endingBalance)),
    ...timeline.map((d) => Math.abs(d.startingBalance))
  );

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">Balance timeline</p>
          <p className="mt-1 text-xs text-zinc-500">
            Each bar is one day. Color shows risk (teal = safe, amber = low, rose = negative).
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-14 gap-1">
        {timeline.slice(0, 28).map((day) => {
          const height = Math.max(10, Math.round((Math.abs(day.endingBalance) / maxAbs) * 44));
          const isLowest = lowestDate && day.date === lowestDate;
          return (
            <div key={day.date} className="flex flex-col items-center gap-1">
              <div
                title={`${formatDateOnly(day.date)}: ${formatCurrency(day.endingBalance)}`}
                className={[
                  'w-full rounded-sm opacity-90',
                  statusColor(day.endingBalance),
                  isLowest ? 'ring-2 ring-rose-400 ring-offset-2 ring-offset-zinc-950' : '',
                ].join(' ')}
                style={{ height }}
              />
              <span className="text-[10px] text-zinc-500 tabular-nums">
                {day.date.slice(8, 10)}
              </span>
            </div>
          );
        })}
      </div>

      {timeline.length > 28 && (
        <p className="mt-3 text-xs text-zinc-500">
          Showing the first 28 days. In the full product you can view 60+ days with day-level details.
        </p>
      )}
    </div>
  );
}

