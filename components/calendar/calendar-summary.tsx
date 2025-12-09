'use client';

import { CalendarData } from '@/lib/calendar/types';
import { formatCurrency } from '@/lib/utils/format';
import { Calendar, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { differenceInDays, startOfDay } from 'date-fns';

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
export function CalendarSummary({ calendarData, safetyBuffer }: CalendarSummaryProps) {
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

  // Determine lowest balance card styling using safety buffer
  const buffer = safetyBuffer ?? 500;
  const isLowBalanceWarning = calendarData.lowestBalance < buffer * 1.5; // Below caution threshold
  const isOverdraft = calendarData.lowestBalance < 0;

  const lowestBalanceCardClasses = isOverdraft
    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
    : isLowBalanceWarning
    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700';

  const lowestBalanceTextClasses = isOverdraft
    ? 'text-red-600 dark:text-red-400'
    : isLowBalanceWarning
    ? 'text-yellow-600 dark:text-yellow-400'
    : 'text-slate-900 dark:text-white';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Starting Balance Card */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Starting Balance</p>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {formatCurrency(calendarData.startingBalance)}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Today&apos;s balance</p>
      </div>

      {/* Lowest Balance Card */}
      <div className={`${lowestBalanceCardClasses} border rounded-lg p-6 shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isOverdraft
                ? 'bg-red-100 dark:bg-red-900/30'
                : isLowBalanceWarning
                ? 'bg-yellow-100 dark:bg-yellow-900/30'
                : 'bg-slate-100 dark:bg-slate-700'
            }`}
          >
            {isOverdraft || isLowBalanceWarning ? (
              <AlertTriangle
                className={`w-6 h-6 ${
                  isOverdraft
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-yellow-600 dark:text-yellow-400'
                }`}
              />
            ) : (
              <Calendar
                className={`w-6 h-6 ${
                  isOverdraft
                    ? 'text-red-600 dark:text-red-400'
                    : isLowBalanceWarning
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              />
            )}
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Lowest Balance</p>
        <p className={`text-2xl font-bold ${lowestBalanceTextClasses}`}>
          {formatCurrency(calendarData.lowestBalance)}
        </p>
        <div className="mt-2">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {calendarData.lowestBalanceDay.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            in {daysUntilLowest} {daysUntilLowest === 1 ? 'day' : 'days'}
          </p>
        </div>
      </div>

      {/* Expected Income Card */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Expected Income</p>
        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
          {formatCurrency(totalIncome)}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Over 60 days</p>
      </div>

      {/* Expected Bills Card */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Expected Bills</p>
        <p className="text-2xl font-bold text-red-600 dark:text-red-400">
          {formatCurrency(totalBills)}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Over 60 days</p>
      </div>
    </div>
  );
}

