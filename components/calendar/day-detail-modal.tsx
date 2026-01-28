'use client';

import { useEffect, useState, useRef } from 'react';
import { CalendarDay } from '@/lib/calendar/types';
import { formatCurrency } from '@/lib/utils/format';
import { format, differenceInDays } from 'date-fns';
import { AlertTriangle, Clock, Layers, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getBalanceStatus } from '@/lib/calendar/constants';
import { trackDayDetailOpened } from '@/lib/posthog/events';

interface DayDetailModalProps {
  day: CalendarDay;
  onClose: () => void;
  currency?: string;
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
export function DayDetailModal({ day, onClose, currency = 'USD' }: DayDetailModalProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const trackedRef = useRef(false);

  // Track day detail opened once on mount
  useEffect(() => {
    if (!trackedRef.current) {
      trackedRef.current = true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const daysFromToday = differenceInDays(day.date, today);
      trackDayDetailOpened({
        balance: day.balance,
        isNegative: day.balance < 0,
        transactionCount: day.income.length + day.bills.length,
        daysFromToday,
      });
    }
  }, [day]);

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

  // Trigger slide-up animation for the mobile bottom sheet
  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsSheetOpen(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Status colors mapping
  const statusColors = {
    green: {
      text: 'text-emerald-400',
      badge: 'bg-zinc-800 text-emerald-200 border border-zinc-700',
    },
    yellow: {
      text: 'text-amber-400',
      badge: 'bg-zinc-800 text-amber-200 border border-zinc-700',
    },
    orange: {
      text: 'text-orange-400',
      badge: 'bg-zinc-800 text-orange-200 border border-zinc-700',
    },
    red: {
      text: 'text-rose-400',
      badge: 'bg-zinc-800 text-rose-200 border border-zinc-700',
    },
  };

  const colors = statusColors[day.status];

  // Calculate totals
  const totalIncome = day.income.reduce((sum, t) => sum + t.amount, 0);
  const totalBills = day.bills.reduce((sum, t) => sum + t.amount, 0);
  const netChange = totalIncome - totalBills;
  const hasBillCollision = day.bills.length >= 2;

  const balanceStatus = getBalanceStatus(day.balance);
  const showWarning = balanceStatus === 'low' || balanceStatus === 'negative';
  const isOverdraft = balanceStatus === 'negative';

  // Capitalize frequency string
  const capitalizeFrequency = (freq: string) => {
    return freq.charAt(0).toUpperCase() + freq.slice(1);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={cn(
          // Mobile (< md): bottom sheet
          'bottom-sheet w-full border border-zinc-800 shadow-md overflow-hidden flex flex-col',
          'translate-y-full md:translate-y-0',
          isSheetOpen ? 'translate-y-0' : 'translate-y-full',
          // Desktop (>= md): centered modal (keep existing behavior)
          'md:relative md:bottom-auto md:left-auto md:right-auto',
          'md:rounded-lg md:max-w-2xl md:max-h-[90vh] md:w-full'
        )}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Mobile drag handle */}
        <div className="md:hidden">
          <div className="bottom-sheet-handle" />
        </div>

        {/* Header */}
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-semibold text-zinc-100">
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
              className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-md transition-colors flex-shrink-0"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Warning Banner */}
          {showWarning && (
            <div
              className={cn(
                'rounded-lg border p-3 mb-6',
                isOverdraft
                  ? 'bg-rose-500/10 border-rose-500/50'
                  : 'bg-amber-500/10 border-amber-500/50'
              )}
            >
              <div className="flex items-start gap-2">
                <AlertTriangle
                  className={cn(
                    'w-4 h-4 mt-0.5',
                    isOverdraft ? 'text-rose-400' : 'text-amber-400'
                  )}
                  aria-hidden="true"
                />
                <p className={cn('text-sm', isOverdraft ? 'text-rose-200' : 'text-amber-200')}>
                  ⚠️ {isOverdraft ? 'Overdraft risk' : 'Low balance day'} - consider adjusting bills or adding income
                </p>
              </div>
            </div>
          )}

          {/* Collision Banner (inside scrollable content) */}
          {hasBillCollision && (
            <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-3 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400 mt-0.5" aria-hidden="true" />
                <p className="text-sm text-amber-200">
                  ⚠️ Multiple bills due today - {day.bills.length} bills totaling {formatCurrency(totalBills, currency)}
                </p>
              </div>
            </div>
          )}

          {/* Balance Card */}
          <div className="rounded-lg p-4 mb-6 border border-zinc-800 bg-zinc-800">
            <p className="text-sm text-zinc-400 mb-1">Projected Balance</p>
            <p className={cn('text-2xl font-semibold tabular-nums tracking-tight', colors.text)}>
              {formatCurrency(day.balance, currency)}
            </p>
          </div>

          {/* Net Change Indicator */}
          {netChange !== 0 && (
            <div
              className={cn(
                'rounded-lg p-4 mb-6 border',
                netChange > 0
                  ? 'bg-zinc-800 border-zinc-800'
                  : 'bg-zinc-800 border-zinc-800'
              )}
            >
              <p className="text-sm text-zinc-400 mb-1">Net Change</p>
              <p
                className={cn(
                  'text-2xl font-semibold tabular-nums tracking-tight',
                  netChange > 0
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                )}
              >
                {netChange > 0 ? '+' : ''}
                {formatCurrency(netChange, currency)}
              </p>
            </div>
          )}

          {/* Income Section */}
          {day.income.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-zinc-100 mb-3">
                Income Transactions
              </h3>
              <div className="space-y-2">
                {day.income.map((transaction, index) => (
                  <div
                    key={index}
                    className="bg-zinc-800 border border-zinc-800 rounded-lg p-3 flex items-center justify-between hover:bg-zinc-700/60 transition-colors border-l-2 border-l-teal-500"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <p className="font-medium text-zinc-300 truncate">
                          {transaction.name}
                        </p>
                        {transaction.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-200 whitespace-nowrap">
                            <Clock className="w-3 h-3" />
                            Pending
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {capitalizeFrequency(transaction.frequency)}
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-emerald-400 ml-4 tabular-nums">
                      +{formatCurrency(transaction.amount, currency)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bills Section */}
          {day.bills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-zinc-100 mb-3">
                Bill Transactions
              </h3>
              <div className="space-y-2">
                {day.bills.map((transaction, index) => (
                  <div
                    key={index}
                    className="bg-zinc-800 border border-zinc-800 rounded-lg p-3 flex items-center justify-between hover:bg-zinc-700/60 transition-colors border-l-2 border-l-rose-500"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-zinc-300">
                        {transaction.name}
                      </p>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {capitalizeFrequency(transaction.frequency)}
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-rose-400 ml-4 tabular-nums">
                      -{formatCurrency(transaction.amount, currency)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {day.income.length === 0 && day.bills.length === 0 && (
            <div className="text-center py-12">
              <p className="text-zinc-400">
                No transactions on this day
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-800 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] md:pb-6">
          <Button variant="primary" onClick={onClose} fullWidth>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

