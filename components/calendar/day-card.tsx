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
  const totalIncome = day.income.reduce((sum, t) => sum + t.amount, 0);
  const totalBills = day.bills.reduce((sum, t) => sum + t.amount, 0);
  const totalTransactions = day.income.length + day.bills.length;
  const hasBillCollision = day.bills.length >= 2;

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative border rounded-lg p-3 text-left transition-colors cursor-pointer',
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
      <div className={cn('absolute top-2 right-2 w-2 h-2 rounded-full', colors.indicator)} />

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
      <div className={cn('text-lg font-semibold mb-2 tabular-nums tracking-tight', colors.balanceText)}>
        {formatCurrency(day.balance)}
      </div>

      {/* Transaction indicators */}
      {totalTransactions > 0 && (
        <div className="space-y-1.5">
          {/* Income indicator */}
          {day.income.length > 0 && (
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span className="text-xs font-medium text-zinc-300 tabular-nums">
                +{formatCurrency(totalIncome)}
              </span>
            </div>
          )}

          {/* Bills indicator */}
          {day.bills.length > 0 && (
            <div className="flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
              <span className="text-xs font-medium text-zinc-300 tabular-nums">
                -{formatCurrency(totalBills)}
              </span>
            </div>
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

