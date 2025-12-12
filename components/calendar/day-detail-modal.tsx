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
      text: 'text-emerald-700',
      badge: 'bg-zinc-100 text-emerald-700 border border-zinc-200',
    },
    yellow: {
      text: 'text-amber-700',
      badge: 'bg-zinc-100 text-amber-700 border border-zinc-200',
    },
    orange: {
      text: 'text-orange-700',
      badge: 'bg-zinc-100 text-orange-700 border border-zinc-200',
    },
    red: {
      text: 'text-rose-700',
      badge: 'bg-zinc-100 text-rose-700 border border-zinc-200',
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={cn(
          'bg-white rounded-lg shadow-md max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col',
          'border border-zinc-200'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-semibold text-zinc-900">
                  {format(day.date, 'EEEE, MMMM d, yyyy')}
                </h2>
                <span
                  className={cn(
                    'px-2.5 py-1 text-xs font-semibold rounded-md',
                    colors.badge
                  )}
                >
                  {day.status.charAt(0).toUpperCase() + day.status.slice(1)}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors flex-shrink-0"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Balance Card */}
          <div className="rounded-lg p-4 mb-6 border border-zinc-200 bg-zinc-50">
            <p className="text-sm text-zinc-500 mb-1">Projected Balance</p>
            <p className={cn('text-2xl font-semibold tabular-nums tracking-tight', colors.text)}>
              {formatCurrency(day.balance)}
            </p>
          </div>

          {/* Net Change Indicator */}
          {netChange !== 0 && (
            <div
              className={cn(
                'rounded-lg p-4 mb-6 border',
                netChange > 0
                  ? 'bg-zinc-50 border-zinc-200'
                  : 'bg-zinc-50 border-zinc-200'
              )}
            >
              <p className="text-sm text-zinc-500 mb-1">Net Change</p>
              <p
                className={cn(
                  'text-2xl font-semibold tabular-nums tracking-tight',
                  netChange > 0
                    ? 'text-emerald-700'
                    : 'text-rose-600'
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
              <h3 className="text-lg font-semibold text-zinc-900 mb-3">
                Income Transactions
              </h3>
              <div className="space-y-2">
                {day.income.map((transaction, index) => (
                  <div
                    key={index}
                    className="bg-white border border-zinc-200 rounded-lg p-3 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-zinc-900">
                        {transaction.name}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {capitalizeFrequency(transaction.frequency)}
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-emerald-700 ml-4 tabular-nums">
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
              <h3 className="text-lg font-semibold text-zinc-900 mb-3">
                Bill Transactions
              </h3>
              <div className="space-y-2">
                {day.bills.map((transaction, index) => (
                  <div
                    key={index}
                    className="bg-white border border-zinc-200 rounded-lg p-3 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-zinc-900">
                        {transaction.name}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {capitalizeFrequency(transaction.frequency)}
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-rose-600 ml-4 tabular-nums">
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
              <p className="text-zinc-500">
                No transactions on this day
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-200">
          <Button variant="primary" onClick={onClose} fullWidth>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

