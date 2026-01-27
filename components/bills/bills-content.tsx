'use client';

import * as React from 'react';
import { useMemo } from 'react';
import { BillCard } from './bill-card';
import {
  BillsFilterBar,
  useBillsFilters,
  defaultBillsFilters,
  type BillsFilters,
  type FrequencyType,
  type SortOption,
} from './bills-filters';
import type { FilterDropdownOption } from '@/components/filters/filter-dropdown';
import { DEFAULT_CATEGORIES } from '@/lib/categories/constants';
import { Tables } from '@/types/supabase';

type Bill = Tables<'bills'>;

interface UserCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  sort_order: number;
}

interface BillsContentProps {
  bills: Bill[];
  categories?: UserCategory[];
}

// Helper function to calculate next due date for recurring bills
function getActualNextDueDate(dueDate: string, frequency: string | null | undefined): Date {
  const storedDate = new Date(dueDate);
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
    case 'monthly':
      const targetDay = storedDate.getDate();
      while (currentDate < today) {
        let nextMonth = currentDate.getMonth() + 1;
        let nextYear = currentDate.getFullYear();
        if (nextMonth > 11) {
          nextMonth = 0;
          nextYear++;
        }
        const lastDayOfNextMonth = new Date(nextYear, nextMonth + 1, 0).getDate();
        const dayToUse = Math.min(targetDay, lastDayOfNextMonth);
        currentDate = new Date(nextYear, nextMonth, dayToUse);
      }
      break;
    case 'quarterly':
      while (currentDate < today) {
        currentDate.setMonth(currentDate.getMonth() + 3);
      }
      break;
    case 'annually':
      while (currentDate < today) {
        currentDate.setFullYear(currentDate.getFullYear() + 1);
      }
      break;
    default:
      return storedDate;
  }
  return currentDate;
}

/**
 * Filter bills based on the current filter settings
 */
function filterBills(bills: Bill[], filters: BillsFilters): Bill[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate due soon cutoff date based on selected days
  const dueSoonCutoff = filters.dueSoonDays !== null
    ? new Date(today.getTime() + filters.dueSoonDays * 24 * 60 * 60 * 1000)
    : null;

  return bills.filter((bill) => {
    // Filter by status (active/inactive)
    const isActive = bill.is_active ?? true;
    if (isActive && !filters.status.includes('active')) return false;
    if (!isActive && !filters.status.includes('inactive')) return false;

    // Filter by frequency
    const billFreq = (bill.frequency ?? 'monthly').toLowerCase() as FrequencyType;
    if (!filters.frequencies.includes(billFreq)) return false;

    // Filter by category
    // categories array now stores EXCLUDED categories
    // Empty = nothing excluded = show all
    // Has values = those categories are excluded (hidden)
    if (filters.categories.length > 0) {
      const billCategory = (bill.category ?? 'Other').toLowerCase();
      // Case-insensitive comparison for excluded categories
      const isExcluded = filters.categories.some(
        excludedCat => excludedCat.toLowerCase() === billCategory
      );
      if (isExcluded) return false;
    }

    // Filter by amount range
    if (filters.amountMin !== null && bill.amount < filters.amountMin) return false;
    if (filters.amountMax !== null && bill.amount > filters.amountMax) return false;

    // Filter by due soon
    if (dueSoonCutoff !== null) {
      if (!bill.due_date) return false;
      const nextDueDate = getActualNextDueDate(bill.due_date, bill.frequency);
      if (nextDueDate < today || nextDueDate > dueSoonCutoff) return false;
    }

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!bill.name.toLowerCase().includes(searchLower)) return false;
    }

    return true;
  });
}

/**
 * Sort bills based on the selected sort option
 */
function sortBills(bills: Bill[], sortBy: SortOption): Bill[] {
  return [...bills].sort((a, b) => {
    switch (sortBy) {
      case 'due_date': {
        // Sort by next due date (soonest first)
        const dateA = a.due_date ? getActualNextDueDate(a.due_date, a.frequency) : new Date(9999, 11, 31);
        const dateB = b.due_date ? getActualNextDueDate(b.due_date, b.frequency) : new Date(9999, 11, 31);
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
 * BillsContent - Client component for Bills page with filtering
 */
export function BillsContent({ bills, categories = [] }: BillsContentProps) {
  // Build category options for the filter dropdown
  const categoryOptions: FilterDropdownOption[] = useMemo(() => {
    if (categories.length === 0) {
      // Fallback to default categories from constants
      return DEFAULT_CATEGORIES.map((cat) => ({
        value: cat.name,
        label: cat.name,
      }));
    }
    return categories.map((cat) => ({
      value: cat.name,
      label: cat.name,
    }));
  }, [categories]);

  // Pass categoryOptions to hook for slug conversion in URL
  const { filters, setFilters: setFiltersRaw, visibleFilters, setVisibleFilters } = useBillsFilters(undefined, categoryOptions);

  // All category values for comparison
  const allCategoryValues = useMemo(() => categoryOptions.map(opt => opt.value), [categoryOptions]);

  // Convert between "selected categories" (for display) and "excluded categories" (for storage/URL)
  // Storage: empty = nothing excluded = show all; has values = those are excluded
  // Display: shows which categories are checked (selected)

  // Get excluded categories from filters (what's stored)
  const excludedCategories = filters.categories; // Now stores EXCLUDED categories

  // For display: convert excluded to selected (all minus excluded)
  const displayFilters = useMemo((): BillsFilters => ({
    ...filters,
    categories: allCategoryValues.filter(cat => !excludedCategories.includes(cat)),
  }), [filters, allCategoryValues, excludedCategories]);

  // Wrap setFilters to convert from selected (display) to excluded (storage)
  const setFilters = React.useCallback((newFilters: BillsFilters) => {
    const selectedCategories = newFilters.categories;
    // Calculate which categories are EXCLUDED (not in selected list)
    const newExcluded = allCategoryValues.filter(cat => !selectedCategories.includes(cat));

    setFiltersRaw({
      ...newFilters,
      // Store excluded categories (empty = all selected = show all)
      categories: newExcluded,
    });
  }, [allCategoryValues, setFiltersRaw]);

  // Apply filters and sorting to bills
  const filteredBills = useMemo(
    () => sortBills(filterBills(bills, filters), filters.sortBy),
    [bills, filters]
  );

  // Show empty state when all bills are filtered out
  const showEmptyState = bills.length > 0 && filteredBills.length === 0;

  return (
    <>
      {/* Filter Bar */}
      {bills.length > 0 && (
        <div className="mb-6">
          <BillsFilterBar
            filters={displayFilters}
            onChange={setFilters}
            resultCount={filteredBills.length}
            totalCount={bills.length}
            visibleFilters={visibleFilters}
            onVisibleFiltersChange={setVisibleFilters}
            categoryOptions={categoryOptions}
            excludedCategories={excludedCategories}
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
            No bills match your filters
          </h3>
          <p className="text-sm text-zinc-500 mb-4">
            Try adjusting your filters to see more results.
          </p>
          <button
            onClick={() => setFilters(defaultBillsFilters)}
            className="text-sm font-medium text-teal-400 hover:text-teal-300 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBills.map((bill) => (
            <BillCard key={bill.id} bill={bill} categories={categories} />
          ))}
        </div>
      )}
    </>
  );
}
