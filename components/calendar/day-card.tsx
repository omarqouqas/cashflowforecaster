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
}

/**
 * DayCard component - displays a single day in the calendar
 * 
 * Features:
 * - Color-coded background based on status
 * - Day of week and day number
 * - Formatted balance
 * - Transaction indicators with icons
 * - Transaction count badge
 * - Status dot indicator
 * - Special styling for today and lowest balance day
 */
export function DayCard({ day, isLowestDay, onClick }: DayCardProps) {
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

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative border rounded-lg p-3 text-left cursor-pointer',
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
      {/* Status dot indicator - top right */}
      <div className={cn(
        'absolute top-2 right-2 w-2 h-2 rounded-full',
        colors.indicator,
        (day.status === 'red' || day.status === 'orange') && 'animate-pulse'
      )} />

      {/* Collision indicator (small, non-overlapping) */}
      {hasBillCollision && (
        <div className="absolute top-2 left-2 z-10">
          <div className="bg-amber-500/15 border border-amber-500/30 rounded-full p-1">
            <Layers className="w-3 h-3 text-amber-300" aria-hidden="true" />
          </div>
        </div>
      )}

      {/* AlertTriangle badge for lowest balance day */}
      {isLowestDay && (
        <div className="absolute top-1 right-1 bg-rose-500 text-white rounded-full p-0.5">
          <AlertTriangle className="w-3 h-3" />
        </div>
      )}

      {/* Date header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-zinc-400">
          {format(day.date, 'EEE')}
        </span>
        <span className="text-sm font-semibold text-zinc-100">
          {format(day.date, 'd')}
        </span>
      </div>

      {/* Balance */}
      <div className={cn('text-lg font-semibold mb-3 tabular-nums tracking-tight', colors.balanceText)}>
        {formatCurrency(day.balance)}
      </div>

      {/* Transaction indicators - Enhanced with names */}
      {totalTransactions > 0 && (
        <div className="space-y-1.5">
          {/* Top Income - Show name inline */}
          {day.income.length > 0 && (
            <div className="flex items-start gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-zinc-300 truncate">
                  {day.income[0].name}
                </p>
                <p className="text-xs font-semibold text-emerald-400 tabular-nums">
                  +{formatCurrency(day.income[0].amount)}
                </p>
              </div>
            </div>
          )}

          {/* Top Bill - Show name inline */}
          {day.bills.length > 0 && (
            <div className="flex items-start gap-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-zinc-300 truncate">
                  {day.bills[0].name}
                </p>
                <p className="text-xs font-semibold text-rose-400 tabular-nums">
                  -{formatCurrency(day.bills[0].amount)}
                </p>
              </div>
            </div>
          )}

          {/* More indicator */}
          {totalTransactions > 2 && (
            <p className="text-xs text-zinc-400 italic pl-5">
              +{totalTransactions - 2} more →
            </p>
          )}
        </div>
      )}

      {/* Transaction count badge - bottom right */}
      {totalTransactions > 0 && (
        <div className="absolute bottom-2 right-2 bg-zinc-950 text-zinc-100 text-xs font-medium px-1.5 py-0.5 rounded border border-zinc-800">
          {totalTransactions} {totalTransactions === 1 ? 'item' : 'items'}
        </div>
      )}
    </button>
  );
}

