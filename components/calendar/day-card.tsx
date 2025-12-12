'use client';

import { CalendarDay } from '@/lib/calendar/types';
import { formatCurrency } from '@/lib/utils/format';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
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
      bg: 'bg-zinc-50',
      border: 'border-zinc-200',
      hover: 'hover:bg-zinc-100',
      indicator: 'bg-emerald-500',
      text: 'text-emerald-700',
      balanceText: 'text-emerald-700',
    },
    yellow: {
      bg: 'bg-zinc-50',
      border: 'border-zinc-200',
      hover: 'hover:bg-zinc-100',
      indicator: 'bg-amber-400',
      text: 'text-amber-700',
      balanceText: 'text-amber-700',
    },
    orange: {
      bg: 'bg-zinc-50',
      border: 'border-zinc-200',
      hover: 'hover:bg-zinc-100',
      indicator: 'bg-orange-500',
      text: 'text-orange-700',
      balanceText: 'text-orange-700',
    },
    red: {
      bg: 'bg-zinc-50',
      border: 'border-zinc-200',
      hover: 'hover:bg-zinc-100',
      indicator: 'bg-rose-500',
      text: 'text-rose-700',
      balanceText: 'text-rose-700',
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
  const totalIncome = day.income.reduce((sum, t) => sum + t.amount, 0);
  const totalBills = day.bills.reduce((sum, t) => sum + t.amount, 0);
  const totalTransactions = day.income.length + day.bills.length;

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative border rounded-lg p-3 text-left transition-colors cursor-pointer',
        'focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 focus:ring-offset-white',
        'hover:border-zinc-300',
        colors.bg,
        colors.border,
        colors.hover,
        isToday && 'ring-2 ring-zinc-900 ring-offset-2 ring-offset-white',
        isLowestDay && 'ring-2 ring-rose-500 ring-offset-2 ring-offset-white'
      )}
      aria-label={`View details for ${format(day.date, 'EEEE, MMMM d, yyyy')}`}
    >
      {/* Status dot indicator - top right */}
      <div className={cn('absolute top-2 right-2 w-2 h-2 rounded-full', colors.indicator)} />

      {/* AlertTriangle badge for lowest balance day */}
      {isLowestDay && (
        <div className="absolute top-1 right-1 bg-rose-500 text-white rounded-full p-0.5">
          <AlertTriangle className="w-3 h-3" />
        </div>
      )}

      {/* Date header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-zinc-500">
          {format(day.date, 'EEE')}
        </span>
        <span className="text-sm font-semibold text-zinc-900">
          {format(day.date, 'd')}
        </span>
      </div>

      {/* Balance */}
      <div className={cn('text-lg font-semibold mb-2 tabular-nums tracking-tight', colors.balanceText)}>
        {formatCurrency(day.balance)}
      </div>

      {/* Transaction indicators */}
      {totalTransactions > 0 && (
        <div className="space-y-1.5">
          {/* Income indicator */}
          {day.income.length > 0 && (
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
              <span className="text-xs font-medium text-emerald-700 tabular-nums">
                +{formatCurrency(totalIncome)}
              </span>
            </div>
          )}

          {/* Bills indicator */}
          {day.bills.length > 0 && (
            <div className="flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-rose-700 flex-shrink-0" />
              <span className="text-xs font-medium text-rose-700 tabular-nums">
                -{formatCurrency(totalBills)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Transaction count badge - bottom right */}
      {totalTransactions > 0 && (
        <div className="absolute bottom-2 right-2 bg-zinc-900 text-white text-xs font-medium px-1.5 py-0.5 rounded">
          {totalTransactions} {totalTransactions === 1 ? 'item' : 'items'}
        </div>
      )}
    </button>
  );
}

