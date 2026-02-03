'use client';

import { useEffect, useMemo, useRef } from 'react';
import { trackCalendarView } from '@/lib/posthog/events';
import { CalendarView } from './calendar-view';
import { CalendarContainer } from './calendar-container';
import type { CalendarContainerProps } from './calendar-container';
import {
  CalendarFilterBar,
  useCalendarFilters,
  defaultCalendarFilters,
  type CalendarFilters,
  type FrequencyType,
} from './calendar-filters';
import type { CalendarDay, Transaction } from '@/lib/calendar/types';

/**
 * Safely convert any date-like value to a Date object.
 * Server components serialize Date objects as strings, so we need to normalize them.
 */
function toDate(value: unknown): Date {
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') return new Date(value);
  return new Date(String(value));
}

function normalizeTransaction(t: Transaction): Transaction {
  return {
    ...t,
    date: toDate((t as unknown as { date: unknown }).date),
  };
}

function normalizeDay(day: CalendarDay): CalendarDay {
  return {
    ...day,
    date: toDate((day as unknown as { date: unknown }).date),
    income: (day.income || []).map(normalizeTransaction),
    bills: (day.bills || []).map(normalizeTransaction),
  };
}

/**
 * Filter a single transaction based on filter criteria
 */
function matchesTransactionFilters(
  transaction: Transaction,
  filters: CalendarFilters
): boolean {
  // Filter by frequency
  if (!filters.frequencies.includes(transaction.frequency as FrequencyType)) {
    return false;
  }

  // Filter by amount range
  if (filters.amountMin !== null && transaction.amount < filters.amountMin) {
    return false;
  }
  if (filters.amountMax !== null && transaction.amount > filters.amountMax) {
    return false;
  }

  // Filter by search term
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    if (!transaction.name.toLowerCase().includes(searchLower)) {
      return false;
    }
  }

  return true;
}

/**
 * Apply filters to calendar days
 */
function filterCalendarDays(
  days: CalendarDay[],
  filters: CalendarFilters
): CalendarDay[] {
  return days
    .filter((day) => {
      // Filter by balance status
      if (!filters.balanceStatuses.includes(day.status)) {
        return false;
      }
      return true;
    })
    .map((day) => {
      // Filter transactions within each day
      let filteredIncome: Transaction[] = [];
      let filteredBills: Transaction[] = [];

      if (filters.transactionTypes.includes('income')) {
        filteredIncome = day.income.filter((t) =>
          matchesTransactionFilters(t, filters)
        );
      }

      if (filters.transactionTypes.includes('bill')) {
        filteredBills = day.bills.filter((t) =>
          matchesTransactionFilters(t, filters)
        );
      }

      return {
        ...day,
        income: filteredIncome,
        bills: filteredBills,
      };
    });
}

/**
 * CalendarHybridView - Responsive calendar layout with filters
 *
 * Desktop (≥ md): Grid layout with month grouping
 * Mobile (< md): Timeline vertical scrolling layout
 *
 * Provides the best experience for each screen size.
 */
export function CalendarHybridView({ calendarData }: CalendarContainerProps) {
  const { filters, setFilters, visibleFilters, setVisibleFilters } = useCalendarFilters();
  const trackedRef = useRef(false);

  // Normalize dates from server component serialization (Date objects become strings)
  const normalizedDays = useMemo(
    () => calendarData.days.map(normalizeDay),
    [calendarData.days]
  );
  const normalizedLowestBalanceDate = useMemo(
    () => toDate(calendarData.lowestBalanceDate),
    [calendarData.lowestBalanceDate]
  );

  // Track calendar view once on mount
  useEffect(() => {
    if (!trackedRef.current) {
      trackedRef.current = true;
      trackCalendarView(normalizedDays.length);
    }
  }, [normalizedDays.length]);

  // Apply filters to the calendar data
  const filteredDays = useMemo(
    () => filterCalendarDays(normalizedDays, filters),
    [normalizedDays, filters]
  );

  // Recalculate derived values based on filtered days
  const filteredCalendarData = useMemo(() => {
    const lowestIn14Days =
      filteredDays.length > 0
        ? Math.min(...filteredDays.slice(0, 14).map((d) => d.balance))
        : calendarData.startingBalance;

    const totalIncome = filteredDays.reduce(
      (sum, day) => sum + day.income.reduce((s, t) => s + t.amount, 0),
      0
    );

    const totalBills = filteredDays.reduce(
      (sum, day) => sum + day.bills.reduce((s, t) => s + t.amount, 0),
      0
    );

    const endingBalance =
      filteredDays[filteredDays.length - 1]?.balance ?? calendarData.startingBalance;

    // Find lowest balance in filtered days
    const lowestBalance =
      filteredDays.length > 0
        ? Math.min(...filteredDays.map((d) => d.balance))
        : calendarData.lowestBalance;

    const lowestBalanceDay =
      filteredDays.find((d) => d.balance === lowestBalance)?.date ??
      normalizedLowestBalanceDate;

    return {
      days: filteredDays,
      startingBalance: calendarData.startingBalance,
      lowestBalance,
      lowestBalanceDate: lowestBalanceDay,
      lowestIn14Days,
      totalIncome,
      totalBills,
      endingBalance,
      safetyBuffer: calendarData.safetyBuffer,
      safeToSpend: calendarData.safeToSpend,
      currency: calendarData.currency,
      collisions: calendarData.collisions,
      forecastDays: calendarData.forecastDays,
    };
  }, [filteredDays, calendarData, normalizedLowestBalanceDate]);

  // Show empty state when all days are filtered out
  const showEmptyState = filteredDays.length === 0;

  return (
    <>
      {/* Filters Panel */}
      <div className="px-4 pt-4">
        <CalendarFilterBar
          filters={filters}
          onChange={setFilters}
          visibleFilters={visibleFilters}
          onVisibleFiltersChange={setVisibleFilters}
        />
      </div>

      {showEmptyState ? (
        <div className="px-4 py-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-zinc-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-zinc-300 mb-2">
            No days match your filters
          </h3>
          <p className="text-sm text-zinc-500 mb-4">
            Try adjusting your filters to see more results.
          </p>
          <button
            onClick={() => setFilters(defaultCalendarFilters)}
            className="text-sm font-medium text-teal-400 hover:text-teal-300 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          {/* Desktop: Grid Layout */}
          <div className="hidden md:block">
            <CalendarView
              calendarData={{
                days: filteredCalendarData.days,
                startingBalance: filteredCalendarData.startingBalance,
                lowestBalance: filteredCalendarData.lowestBalance,
                lowestBalanceDay: filteredCalendarData.lowestBalanceDate,
                safeToSpend: filteredCalendarData.safeToSpend,
                collisions: filteredCalendarData.collisions,
              }}
              safetyBuffer={filteredCalendarData.safetyBuffer}
              lowestIn14Days={filteredCalendarData.lowestIn14Days}
              totalIncome={filteredCalendarData.totalIncome}
              totalBills={filteredCalendarData.totalBills}
              endingBalance={filteredCalendarData.endingBalance}
              currency={filteredCalendarData.currency}
              forecastDays={filteredCalendarData.forecastDays}
            />
          </div>

          {/* Mobile: Timeline Layout */}
          <div className="md:hidden">
            <CalendarContainer calendarData={filteredCalendarData} />
          </div>
        </>
      )}
    </>
  );
}
