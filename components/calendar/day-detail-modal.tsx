'use client';

import { useEffect } from 'react';
import { CalendarDay } from '@/lib/calendar/types';
import { formatCurrency } from '@/lib/utils/format';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DayDetailModalProps {
  day: CalendarDay;
  onClose: () => void;
}

/**
 * DayDetailModal component - displays detailed information about a selected day
 * 
 * Features:
 * - Fixed overlay with backdrop blur and click-to-close
 * - Centered modal with max-width and max-height
 * - Header with full date format and status badge
 * - Balance card with status-colored background
 * - Net change indicator
 * - Income and bills sections
 * - Empty state message
 * - Footer with Close button
 * - Keyboard handling (Escape key)
 * - Prevents body scroll while open
 */
export function DayDetailModal({ day, onClose }: DayDetailModalProps) {
  // Handle Escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Status colors mapping
  const statusColors = {
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-700 dark:text-green-300',
      badge: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700',
    },
    yellow: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      text: 'text-yellow-700 dark:text-yellow-300',
      badge: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700',
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      border: 'border-orange-200 dark:border-orange-800',
      text: 'text-orange-700 dark:text-orange-300',
      badge: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 border-orange-300 dark:border-orange-700',
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-700 dark:text-red-300',
      badge: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700',
    },
  };

  const colors = statusColors[day.status];

  // Calculate totals
  const totalIncome = day.income.reduce((sum, t) => sum + t.amount, 0);
  const totalBills = day.bills.reduce((sum, t) => sum + t.amount, 0);
  const netChange = totalIncome - totalBills;

  // Capitalize frequency string
  const capitalizeFrequency = (freq: string) => {
    return freq.charAt(0).toUpperCase() + freq.slice(1);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={cn(
          'bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col',
          'border border-slate-200 dark:border-slate-700'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={cn('p-6 border-b', colors.border)}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {format(day.date, 'EEEE, MMMM d, yyyy')}
                </h2>
                <span
                  className={cn(
                    'px-2.5 py-1 text-xs font-semibold rounded border',
                    colors.badge
                  )}
                >
                  {day.status.charAt(0).toUpperCase() + day.status.slice(1)}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Balance Card */}
          <div className={cn('rounded-lg p-4 mb-6 border', colors.bg, colors.border)}>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Projected Balance</p>
            <p className={cn('text-3xl font-bold', colors.text)}>
              {formatCurrency(day.balance)}
            </p>
          </div>

          {/* Net Change Indicator */}
          {netChange !== 0 && (
            <div
              className={cn(
                'rounded-lg p-4 mb-6 border',
                netChange > 0
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              )}
            >
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Net Change</p>
              <p
                className={cn(
                  'text-2xl font-bold',
                  netChange > 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                )}
              >
                {netChange > 0 ? '+' : ''}
                {formatCurrency(netChange)}
              </p>
            </div>
          )}

          {/* Income Section */}
          {day.income.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Income Transactions
              </h3>
              <div className="space-y-2">
                {day.income.map((transaction, index) => (
                  <div
                    key={index}
                    className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {transaction.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                        {capitalizeFrequency(transaction.frequency)}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400 ml-4">
                      +{formatCurrency(transaction.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bills Section */}
          {day.bills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Bill Transactions
              </h3>
              <div className="space-y-2">
                {day.bills.map((transaction, index) => (
                  <div
                    key={index}
                    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {transaction.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                        {capitalizeFrequency(transaction.frequency)}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-red-600 dark:text-red-400 ml-4">
                      -{formatCurrency(transaction.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {day.income.length === 0 && day.bills.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                No transactions on this day
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700">
          <Button variant="primary" onClick={onClose} fullWidth>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

