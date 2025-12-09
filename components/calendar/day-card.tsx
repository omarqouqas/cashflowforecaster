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
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      hover: 'hover:bg-green-100 dark:hover:bg-green-900/30',
      indicator: 'bg-green-500 dark:bg-green-400',
      text: 'text-green-700 dark:text-green-300',
      balanceText: 'text-green-700 dark:text-green-300',
    },
    yellow: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      hover: 'hover:bg-yellow-100 dark:hover:bg-yellow-900/30',
      indicator: 'bg-yellow-500 dark:bg-yellow-400',
      text: 'text-yellow-700 dark:text-yellow-300',
      balanceText: 'text-yellow-700 dark:text-yellow-300',
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      border: 'border-orange-200 dark:border-orange-800',
      hover: 'hover:bg-orange-100 dark:hover:bg-orange-900/30',
      indicator: 'bg-orange-500 dark:bg-orange-400',
      text: 'text-orange-700 dark:text-orange-300',
      balanceText: 'text-orange-700 dark:text-orange-300',
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      hover: 'hover:bg-red-100 dark:hover:bg-red-900/30',
      indicator: 'bg-red-500 dark:bg-red-400',
      text: 'text-red-700 dark:text-red-300',
      balanceText: 'text-red-700 dark:text-red-300',
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
        'relative border rounded-lg p-3 text-left transition-all cursor-pointer',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800',
        'hover:shadow-md hover:scale-[1.02]',
        colors.bg,
        colors.border,
        colors.hover,
        isToday && 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-800',
        isLowestDay && 'ring-2 ring-red-500 ring-offset-2 dark:ring-offset-slate-800'
      )}
      aria-label={`View details for ${format(day.date, 'EEEE, MMMM d, yyyy')}`}
    >
      {/* Status dot indicator - top right */}
      <div className={cn('absolute top-2 right-2 w-2 h-2 rounded-full', colors.indicator)} />

      {/* AlertTriangle badge for lowest balance day */}
      {isLowestDay && (
        <div className="absolute top-1 right-1 bg-red-500 dark:bg-red-600 text-white rounded-full p-0.5">
          <AlertTriangle className="w-3 h-3" />
        </div>
      )}

      {/* Date header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
          {format(day.date, 'EEE')}
        </span>
        <span className="text-sm font-bold text-slate-900 dark:text-white">
          {format(day.date, 'd')}
        </span>
      </div>

      {/* Balance */}
      <div className={cn('text-lg font-bold mb-2', colors.balanceText)}>
        {formatCurrency(day.balance)}
      </div>

      {/* Transaction indicators */}
      {totalTransactions > 0 && (
        <div className="space-y-1.5">
          {/* Income indicator */}
          {day.income.length > 0 && (
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <span className="text-xs font-medium text-green-700 dark:text-green-300">
                +{formatCurrency(totalIncome)}
              </span>
            </div>
          )}

          {/* Bills indicator */}
          {day.bills.length > 0 && (
            <div className="flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <span className="text-xs font-medium text-red-700 dark:text-red-300">
                -{formatCurrency(totalBills)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Transaction count badge - bottom right */}
      {totalTransactions > 0 && (
        <div className="absolute bottom-2 right-2 bg-slate-900 dark:bg-slate-700 text-white text-xs font-medium px-1.5 py-0.5 rounded">
          {totalTransactions} {totalTransactions === 1 ? 'item' : 'items'}
        </div>
      )}
    </button>
  );
}

