'use client';

import { useMemo } from 'react';
import { IncomeCard } from './income-card';
import {
  IncomeFilterBar,
  useIncomeFilters,
  defaultIncomeFilters,
  type IncomeFilters,
  type FrequencyType,
  type SourceType,
  type SortOption,
} from './income-filters';

interface Income {
  id: string;
  name: string;
  amount: number;
  frequency: string | null;
  next_date: string;
  is_active: boolean | null;
  invoice_id: string | null;
  status: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface IncomeContentProps {
  incomes: Income[];
  currency?: string;
}

// Helper function to calculate next payment date for recurring income
function getActualNextDate(nextDate: string, frequency: string | null | undefined): Date {
  const storedDate = new Date(nextDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (storedDate >= today) {
    return storedDate;
  }

  const freq = (frequency ?? 'monthly').toLowerCase();
  let currentDate = new Date(storedDate);

  switch (freq) {
    case 'weekly':
      while (currentDate < today) {
        currentDate.setDate(currentDate.getDate() + 7);
      }
      break;
    case 'biweekly':
      while (currentDate < today) {
        currentDate.setDate(currentDate.getDate() + 14);
      }
      break;
    case 'semi-monthly':
      // Semi-monthly: twice per month (e.g., 1st & 15th)
      const semiMonthlyDay = storedDate.getDate();
      while (currentDate < today) {
        if (semiMonthlyDay <= 15) {
          if (currentDate.getDate() <= 15) {
            currentDate.setDate(semiMonthlyDay + 15);
          } else {
            currentDate.setMonth(currentDate.getMonth() + 1);
            currentDate.setDate(semiMonthlyDay);
          }
        } else {
          if (currentDate.getDate() >= 16) {
            currentDate.setMonth(currentDate.getMonth() + 1);
            currentDate.setDate(semiMonthlyDay - 15);
          } else {
            currentDate.setDate(semiMonthlyDay);
          }
        }
      }
      break;
    case 'monthly': {
      const monthlyTargetDay = storedDate.getDate();
      while (currentDate < today) {
        let nextMonth = currentDate.getMonth() + 1;
        let nextYear = currentDate.getFullYear();
        if (nextMonth > 11) {
          nextMonth = 0;
          nextYear++;
        }
        const lastDayOfMonth = new Date(nextYear, nextMonth + 1, 0).getDate();
        const dayToUse = Math.min(monthlyTargetDay, lastDayOfMonth);
        currentDate = new Date(nextYear, nextMonth, dayToUse);
      }
      break;
    }
    case 'quarterly': {
      const quarterlyTargetDay = storedDate.getDate();
      while (currentDate < today) {
        let nextMonth = currentDate.getMonth() + 3;
        let nextYear = currentDate.getFullYear();
        while (nextMonth > 11) {
          nextMonth -= 12;
          nextYear++;
        }
        const lastDayOfMonth = new Date(nextYear, nextMonth + 1, 0).getDate();
        const dayToUse = Math.min(quarterlyTargetDay, lastDayOfMonth);
        currentDate = new Date(nextYear, nextMonth, dayToUse);
      }
      break;
    }
    case 'annually': {
      const annualTargetDay = storedDate.getDate();
      const annualTargetMonth = storedDate.getMonth();
      while (currentDate < today) {
        const nextYear = currentDate.getFullYear() + 1;
        const lastDayOfMonth = new Date(nextYear, annualTargetMonth + 1, 0).getDate();
        const dayToUse = Math.min(annualTargetDay, lastDayOfMonth);
        currentDate = new Date(nextYear, annualTargetMonth, dayToUse);
      }
      break;
    }
    default:
      return storedDate;
  }
  return currentDate;
}

/**
 * Filter income sources based on the current filter settings
 */
function filterIncomes(incomes: Income[], filters: IncomeFilters): Income[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate expected soon cutoff date based on selected days
  const expectedSoonCutoff = filters.expectedSoonDays !== null
    ? new Date(today.getTime() + filters.expectedSoonDays * 24 * 60 * 60 * 1000)
    : null;

  return incomes.filter((income) => {
    // Filter by status (active/inactive)
    const isActive = income.is_active ?? true;
    if (isActive && !filters.status.includes('active')) return false;
    if (!isActive && !filters.status.includes('inactive')) return false;

    // Filter by frequency
    const incomeFreq = (income.frequency ?? 'monthly').toLowerCase() as FrequencyType;
    if (!filters.frequencies.includes(incomeFreq)) return false;

    // Filter by source type (regular vs invoice-linked)
    const isInvoiceLinked = Boolean(income.invoice_id);
    const sourceType: SourceType = isInvoiceLinked ? 'invoice' : 'regular';
    if (!filters.sourceTypes.includes(sourceType)) return false;

    // Filter by amount range
    if (filters.amountMin !== null && income.amount < filters.amountMin) return false;
    if (filters.amountMax !== null && income.amount > filters.amountMax) return false;

    // Filter by expected soon
    if (expectedSoonCutoff !== null) {
      if (!income.next_date) return false;
      const nextPaymentDate = getActualNextDate(income.next_date, income.frequency);
      if (nextPaymentDate < today || nextPaymentDate > expectedSoonCutoff) return false;
    }

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!income.name.toLowerCase().includes(searchLower)) return false;
    }

    return true;
  });
}

/**
 * Sort income sources based on the selected sort option
 */
function sortIncomes(incomes: Income[], sortBy: SortOption): Income[] {
  return [...incomes].sort((a, b) => {
    switch (sortBy) {
      case 'next_date': {
        // Sort by next payment date (soonest first)
        const dateA = a.next_date ? getActualNextDate(a.next_date, a.frequency) : new Date(9999, 11, 31);
        const dateB = b.next_date ? getActualNextDate(b.next_date, b.frequency) : new Date(9999, 11, 31);
        return dateA.getTime() - dateB.getTime();
      }
      case 'name':
        return a.name.localeCompare(b.name);
      case 'amount':
        return b.amount - a.amount; // Highest first
      case 'created_at':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime(); // Newest first
      default:
        return 0;
    }
  });
}

/**
 * IncomeContent - Client component for Income page with filtering
 */
export function IncomeContent({ incomes, currency = 'USD' }: IncomeContentProps) {
  const { filters, setFilters, visibleFilters, setVisibleFilters } = useIncomeFilters();

  // Apply filters and sorting to incomes
  const filteredIncomes = useMemo(
    () => sortIncomes(filterIncomes(incomes, filters), filters.sortBy),
    [incomes, filters]
  );

  // Show empty state when all incomes are filtered out
  const showEmptyState = incomes.length > 0 && filteredIncomes.length === 0;

  return (
    <>
      {/* Filter Bar */}
      {incomes.length > 0 && (
        <div className="mb-6">
          <IncomeFilterBar
            filters={filters}
            onChange={setFilters}
            resultCount={filteredIncomes.length}
            totalCount={incomes.length}
            visibleFilters={visibleFilters}
            onVisibleFiltersChange={setVisibleFilters}
            currency={currency}
          />
        </div>
      )}

      {showEmptyState ? (
        <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-8 text-center">
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
            No income sources match your filters
          </h3>
          <p className="text-sm text-zinc-500 mb-4">
            Try adjusting your filters to see more results.
          </p>
          <button
            onClick={() => setFilters(defaultIncomeFilters)}
            className="text-sm font-medium text-teal-400 hover:text-teal-300 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredIncomes.map((income) => (
            <IncomeCard key={income.id} income={income as any} currency={currency} />
          ))}
        </div>
      )}
    </>
  );
}
