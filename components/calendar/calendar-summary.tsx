'use client';

import { CalendarData } from '@/lib/calendar/types';
import { formatCurrency } from '@/lib/utils/format';
import { Calendar, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { differenceInDays, startOfDay } from 'date-fns';
import { getBalanceStatus } from '@/lib/calendar/constants';

interface CalendarSummaryProps {
  calendarData: CalendarData;
  safetyBuffer?: number;
}

/**
 * CalendarSummary component - displays key metrics from the calendar
 * 
 * Shows 4 summary cards:
 * 1. Starting Balance (blue theme)
 * 2. Lowest Balance (with conditional warning styling)
 * 3. Expected Income (green theme)
 * 4. Expected Bills (red theme)
 */
export function CalendarSummary({ calendarData }: CalendarSummaryProps) {
  // Calculate days until lowest balance
  const today = startOfDay(new Date());
  const lowestBalanceDate = startOfDay(calendarData.lowestBalanceDay);
  const daysUntilLowest = differenceInDays(lowestBalanceDate, today);

  // Calculate total income and bills across all days
  const totalIncome = calendarData.days.reduce((sum, day) => {
    return sum + day.income.reduce((daySum, transaction) => daySum + transaction.amount, 0);
  }, 0);

  const totalBills = calendarData.days.reduce((sum, day) => {
    return sum + day.bills.reduce((daySum, transaction) => daySum + transaction.amount, 0);
  }, 0);

  // Lowest balance warning uses fixed $100 threshold for now (will be user-configurable later)
  const balanceStatus = getBalanceStatus(calendarData.lowestBalance);
  const isOverdraft = balanceStatus === 'negative';
  const isLowBalanceWarning = balanceStatus === 'low';

  const lowestBalanceCardClasses = isOverdraft
    ? 'bg-rose-500/10 border-rose-500/30'
    : isLowBalanceWarning
    ? 'bg-amber-500/10 border-amber-500/30'
    : 'bg-zinc-900 border-zinc-800';

  const lowestBalanceTextClasses = isOverdraft
    ? 'text-rose-400'
    : isLowBalanceWarning
    ? 'text-amber-400'
    : 'text-zinc-100';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Starting Balance Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center">
            <Calendar className="w-6 h-6 text-teal-400" />
          </div>
        </div>
        <p className="text-sm text-zinc-400 mb-1">Starting Balance</p>
        <p className="text-2xl font-bold text-zinc-100">
          {formatCurrency(calendarData.startingBalance)}
        </p>
        <p className="text-xs text-zinc-500 mt-2">Today&apos;s balance</p>
      </div>

      {/* Lowest Balance Card */}
      <div className={`${lowestBalanceCardClasses} border rounded-lg p-6 shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isOverdraft
                ? 'bg-rose-500/15'
                : isLowBalanceWarning
                ? 'bg-amber-500/15'
                : 'bg-zinc-800'
            }`}
          >
            {isOverdraft || isLowBalanceWarning ? (
              <AlertTriangle
                className={`w-6 h-6 ${
                  isOverdraft
                    ? 'text-rose-300'
                    : 'text-amber-300'
                }`}
              />
            ) : (
              <Calendar
                className={`w-6 h-6 ${
                  isOverdraft
                    ? 'text-rose-300'
                    : isLowBalanceWarning
                    ? 'text-amber-300'
                    : 'text-zinc-300'
                }`}
              />
            )}
          </div>
        </div>
        <p className="text-sm text-zinc-400 mb-1">Lowest Balance</p>
        <p className={`text-2xl font-bold ${lowestBalanceTextClasses} flex items-center gap-2`}>
          {formatCurrency(calendarData.lowestBalance)}
          {(isOverdraft || isLowBalanceWarning) && (
            <AlertTriangle className="w-5 h-5" aria-hidden="true" />
          )}
        </p>
        <div className="mt-2">
          <p className="text-xs text-zinc-400">
            {calendarData.lowestBalanceDay.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
          <p className="text-xs text-zinc-500">
            in {daysUntilLowest} {daysUntilLowest === 1 ? 'day' : 'days'}
          </p>
        </div>
      </div>

      {/* Expected Income Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
        <p className="text-sm text-zinc-400 mb-1">Expected Income</p>
        <p className="text-2xl font-bold text-zinc-100">
          {formatCurrency(totalIncome)}
        </p>
        <p className="text-xs text-zinc-500 mt-2">Over 60 days</p>
      </div>

      {/* Expected Bills Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center">
            <TrendingDown className="w-6 h-6 text-rose-400" />
          </div>
        </div>
        <p className="text-sm text-zinc-400 mb-1">Expected Bills</p>
        <p className="text-2xl font-bold text-zinc-100">
          {formatCurrency(totalBills)}
        </p>
        <p className="text-xs text-zinc-500 mt-2">Over 60 days</p>
      </div>
    </div>
  );
}

