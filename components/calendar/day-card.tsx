'use client';

import { CalendarDay } from '@/lib/calendar/types';
import { formatCurrency } from '@/lib/utils/format';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, AlertTriangle, Layers, ArrowRightLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DayCardProps {
  day: CalendarDay;
  isLowestDay: boolean;
  onClick: () => void;
  previousDayBalance?: number;
  currency?: string;
}

/**
 * DayCard component - displays a single day in the calendar
 *
 * Features:
 * - Left border color indicates status (green/yellow/orange/red)
 * - Clean visual hierarchy with neutral background
 * - Day of week and day number
 * - Formatted balance with delta
 * - Transaction indicators with icons
 * - Collision indicator for multiple bills
 * - Special styling for today and lowest balance day
 */
export function DayCard({ day, isLowestDay, onClick, previousDayBalance, currency = 'USD' }: DayCardProps) {
  // Calculate balance delta
  const delta = previousDayBalance !== undefined ? day.balance - previousDayBalance : 0;
  const showDelta = previousDayBalance !== undefined && delta !== 0;

  // Status border colors - left border indicates financial health
  const borderColors = {
    green: 'border-l-emerald-500',
    yellow: 'border-l-amber-400',
    orange: 'border-l-orange-500',
    red: 'border-l-rose-500',
  };

  // Check if today
  const isToday = (() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayDate = new Date(day.date);
    dayDate.setHours(0, 0, 0, 0);
    return dayDate.getTime() === today.getTime();
  })();

  // Calculate transaction totals
  const transferCount = day.transfers?.length || 0;
  const totalTransactions = day.income.length + day.bills.length + transferCount;
  const hasBillCollision = day.bills.length >= 2;
  const hasActivity = totalTransactions > 0;

  // Truncate name with more generous threshold
  const truncateName = (name: string, maxLen: number = 16) => {
    if (name.length <= maxLen) return name;
    return name.slice(0, maxLen - 1) + '…';
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-left w-full',
        'h-[150px] flex flex-col overflow-hidden',
        'transition-all duration-200 ease-out',
        'hover:bg-zinc-750 hover:border-zinc-600',
        'hover:scale-[1.02] hover:shadow-lg hover:shadow-teal-500/10',
        'active:scale-[0.98]',
        'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-zinc-900',
        'border-l-4',
        borderColors[day.status],
        isToday && 'ring-1 ring-teal-500/50',
        isLowestDay && 'ring-2 ring-rose-500/50'
      )}
      aria-label={`View details for ${format(day.date, 'EEEE, MMMM d, yyyy')}`}
    >
      {/* Lowest day indicator */}
      {isLowestDay && (
        <div className="absolute top-2 right-2 bg-rose-500 text-white rounded-full p-0.5">
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

      {/* Date header */}
      <div className="flex items-center justify-between mb-2">
        <span className={cn(
          'text-xs font-medium',
          isToday ? 'text-teal-400 font-bold uppercase' : 'text-zinc-400'
        )}>
          {isToday ? 'Today' : format(day.date, 'EEE')}
        </span>
        <span className="text-sm font-semibold text-zinc-100">
          {format(day.date, 'd')}
        </span>
      </div>

      {/* Balance */}
      <div className={cn(
        'text-lg font-semibold tabular-nums',
        day.balance < 0 ? 'text-rose-400' : 'text-zinc-100'
      )}>
        {formatCurrency(day.balance, currency)}
      </div>

      {/* Delta indicator */}
      {showDelta && (
        <div className={cn(
          'text-xs font-medium tabular-nums',
          delta > 0 ? 'text-emerald-400' : 'text-rose-400'
        )}>
          {delta > 0 ? '+' : ''}{formatCurrency(delta, currency)}
        </div>
      )}

      {/* Transactions - minimal style, shown only on active days */}
      {hasActivity && (
        <div className="mt-auto space-y-1">
          {/* Income */}
          {day.income.length > 0 && day.income[0] && (
            <div className="flex items-center gap-1.5 text-xs" title={day.income[0].name}>
              <TrendingUp className="w-3 h-3 text-emerald-400 flex-shrink-0" />
              <span className="text-emerald-400 font-medium">+{formatCurrency(day.income[0].amount, currency)}</span>
              <span className="text-zinc-500 truncate">{truncateName(day.income[0].name)}</span>
            </div>
          )}

          {/* Bill */}
          {day.bills.length > 0 && day.bills[0] && (
            <div className="flex items-center gap-1.5 text-xs" title={day.bills[0].name}>
              <TrendingDown className="w-3 h-3 text-rose-400 flex-shrink-0" />
              <span className="text-rose-400 font-medium">-{formatCurrency(day.bills[0].amount, currency)}</span>
              <span className="text-zinc-500 truncate">{truncateName(day.bills[0].name)}</span>
            </div>
          )}

          {/* Transfer - only show if no income or bills */}
          {day.transfers && day.transfers.length > 0 && day.transfers[0] && day.income.length === 0 && day.bills.length === 0 && (
            <div className="flex items-center gap-1.5 text-xs" title={day.transfers[0].name}>
              <ArrowRightLeft className="w-3 h-3 text-blue-400 flex-shrink-0" />
              <span className="text-blue-400 font-medium">{formatCurrency(day.transfers[0].amount, currency)}</span>
              <span className="text-zinc-500 truncate">{truncateName(day.transfers[0].name)}</span>
            </div>
          )}

          {/* More indicator */}
          {totalTransactions > 1 && (
            <span className="text-xs text-zinc-500">+{totalTransactions - 1} more</span>
          )}
        </div>
      )}
    </button>
  );
}
