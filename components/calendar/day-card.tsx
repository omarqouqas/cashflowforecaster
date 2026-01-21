'use client';

import { CalendarDay } from '@/lib/calendar/types';
import { formatCurrency } from '@/lib/utils/format';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, AlertTriangle, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DayCardProps {
  day: CalendarDay;
  isLowestDay: boolean;
  onClick: () => void;
  previousDayBalance?: number;
}

/**
 * DayCard component - displays a single day in the calendar
 *
 * Features:
 * - Color-coded background based on status
 * - Day of week and day number
 * - Formatted balance
 * - Transaction indicators with icons
 * - Transaction count badge (in header)
 * - Status dot indicator
 * - Special styling for today and lowest balance day
 * - Tooltip shows full transaction names on hover
 */
export function DayCard({ day, isLowestDay, onClick, previousDayBalance }: DayCardProps) {
  // Calculate balance delta
  const delta = previousDayBalance !== undefined ? day.balance - previousDayBalance : 0;
  const showDelta = previousDayBalance !== undefined && delta !== 0;

  // Status colors mapping
  const statusColors = {
    green: {
      bg: 'bg-zinc-800',
      border: 'border-zinc-700',
      hover: 'hover:bg-zinc-700/60',
      indicator: 'bg-emerald-500',
      text: 'text-emerald-400',
      balanceText: 'text-zinc-100',
    },
    yellow: {
      bg: 'bg-zinc-800',
      border: 'border-zinc-700',
      hover: 'hover:bg-zinc-700/60',
      indicator: 'bg-amber-400',
      text: 'text-amber-300',
      balanceText: 'text-zinc-100',
    },
    orange: {
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/50',
      hover: 'hover:bg-rose-500/15',
      indicator: 'bg-orange-500',
      text: 'text-rose-200',
      balanceText: 'text-rose-300',
    },
    red: {
      bg: 'bg-rose-500/20',
      border: 'border-rose-500',
      hover: 'hover:bg-rose-500/25',
      indicator: 'bg-rose-500',
      text: 'text-rose-200',
      balanceText: 'text-rose-300',
    },
  };

  const colors = statusColors[day.status];

  // Check if today
  const isToday = (() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayDate = new Date(day.date);
    dayDate.setHours(0, 0, 0, 0);
    return dayDate.getTime() === today.getTime();
  })();

  // Calculate transaction totals
  const totalTransactions = day.income.length + day.bills.length;
  const hasBillCollision = day.bills.length >= 2;

  // Truncate name with more generous threshold
  const truncateName = (name: string, maxLen: number = 18) => {
    if (name.length <= maxLen) return name;
    return name.slice(0, maxLen - 1) + '…';
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative border rounded-lg p-2.5 text-left cursor-pointer w-full',
        'h-[170px] sm:h-[165px] flex flex-col overflow-hidden',
        'transition-all duration-200 ease-out',
        'hover:scale-[1.02] hover:shadow-lg hover:shadow-teal-500/10',
        'active:scale-[0.98]',
        'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-zinc-900',
        colors.bg,
        colors.border,
        colors.hover,
        hasBillCollision && 'border-l-4 border-l-amber-400/70',
        isToday && 'ring-1 ring-teal-500/50 border-teal-500',
        isLowestDay && 'ring-2 ring-rose-500/50'
      )}
      aria-label={`View details for ${format(day.date, 'EEEE, MMMM d, yyyy')}`}
    >
      {/* Status dot indicator - top right (only if not lowest day) */}
      {!isLowestDay && (
        <div className={cn(
          'absolute top-2 right-2 w-2 h-2 rounded-full',
          colors.indicator,
          (day.status === 'red' || day.status === 'orange') && 'animate-pulse'
        )} />
      )}

      {/* AlertTriangle badge for lowest balance day - top right */}
      {isLowestDay && (
        <div className="absolute top-1.5 right-1.5 bg-rose-500 text-white rounded-full p-0.5">
          <AlertTriangle className="w-3 h-3" />
        </div>
      )}

      {/* Collision indicator - bottom left corner */}
      {hasBillCollision && (
        <div className="absolute bottom-2 left-2 z-10">
          <div className="bg-amber-500/15 border border-amber-500/30 rounded-full p-0.5">
            <Layers className="w-2.5 h-2.5 text-amber-300" aria-hidden="true" />
          </div>
        </div>
      )}

      {/* Date header with transaction count */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          {isToday ? (
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wide">
              Today
            </span>
          ) : (
            <span className="text-xs font-medium text-zinc-400">
              {format(day.date, 'EEE')}
            </span>
          )}
          {/* Transaction count - subtle dot notation */}
          {totalTransactions > 0 && (
            <span className="text-zinc-500 text-[10px]">
              • {totalTransactions}
            </span>
          )}
        </div>
        <span className="text-sm font-semibold text-zinc-100">
          {format(day.date, 'd')}
        </span>
      </div>

      {/* Balance with Delta */}
      <div className="mb-2">
        <div className={cn('text-lg font-semibold tabular-nums tracking-tight', colors.balanceText)}>
          {formatCurrency(day.balance)}
        </div>
        {showDelta && (
          <div className={cn(
            'text-xs font-medium tabular-nums flex items-center gap-0.5',
            delta > 0 ? 'text-emerald-400' : 'text-rose-400'
          )}>
            {delta > 0 ? '▲' : '▼'} {formatCurrency(Math.abs(delta))}
          </div>
        )}
      </div>

      {/* Transaction indicators - Amount first, then name */}
      <div className="flex-1 min-h-0">
        {totalTransactions > 0 && (
          <div className="space-y-1">
            {/* Top Income - Amount more prominent */}
            {day.income.length > 0 && day.income[0] && (
              <div className="flex items-center gap-1.5 group/tx" title={day.income[0].name}>
                <TrendingUp className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                <p className="text-xs font-bold text-emerald-400 tabular-nums">
                  +{formatCurrency(day.income[0].amount)}
                </p>
                <p className="text-xs text-zinc-400 truncate flex-1">
                  {truncateName(day.income[0].name)}
                </p>
              </div>
            )}

            {/* Top Bill - Amount more prominent */}
            {day.bills.length > 0 && day.bills[0] && (
              <div className="flex items-center gap-1.5 group/tx" title={day.bills[0].name}>
                <TrendingDown className="w-3 h-3 text-rose-400 flex-shrink-0" />
                <p className="text-xs font-bold text-rose-400 tabular-nums">
                  -{formatCurrency(day.bills[0].amount)}
                </p>
                <p className="text-xs text-zinc-400 truncate flex-1">
                  {truncateName(day.bills[0].name)}
                </p>
              </div>
            )}

            {/* More indicator */}
            {totalTransactions > 2 && (
              <p className="text-xs text-zinc-500 italic">
                +{totalTransactions - 2} more
              </p>
            )}
          </div>
        )}
      </div>
    </button>
  );
}
