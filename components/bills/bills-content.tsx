'use client';

import { useMemo } from 'react';
import { BillCard } from './bill-card';
import {
  BillsFiltersPanel,
  useBillsFilters,
  defaultBillsFilters,
  type BillsFilters,
  type FrequencyType,
  type CategoryType,
} from './bills-filters';

interface Bill {
  id: string;
  name: string;
  amount: number;
  frequency: string | null;
  category: string | null;
  due_date: string | null;
  is_active: boolean | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface BillsContentProps {
  bills: Bill[];
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
  const sevenDaysFromNow = new Date(today);
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

  return bills.filter((bill) => {
    // Filter by status (active/inactive)
    const isActive = bill.is_active ?? true;
    if (isActive && !filters.status.includes('active')) return false;
    if (!isActive && !filters.status.includes('inactive')) return false;

    // Filter by frequency
    const billFreq = (bill.frequency ?? 'monthly').toLowerCase() as FrequencyType;
    if (!filters.frequencies.includes(billFreq)) return false;

    // Filter by category
    const billCategory = (bill.category ?? 'other').toLowerCase() as CategoryType;
    if (!filters.categories.includes(billCategory)) return false;

    // Filter by amount range
    if (filters.amountMin !== null && bill.amount < filters.amountMin) return false;
    if (filters.amountMax !== null && bill.amount > filters.amountMax) return false;

    // Filter by due soon (next 7 days)
    if (filters.dueSoon && bill.due_date) {
      const nextDueDate = getActualNextDueDate(bill.due_date, bill.frequency);
      if (nextDueDate < today || nextDueDate > sevenDaysFromNow) return false;
    } else if (filters.dueSoon && !bill.due_date) {
      return false;
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
 * BillsContent - Client component for Bills page with filtering
 */
export function BillsContent({ bills }: BillsContentProps) {
  const { filters, setFilters } = useBillsFilters();

  // Apply filters to bills
  const filteredBills = useMemo(
    () => filterBills(bills, filters),
    [bills, filters]
  );

  // Show empty state when all bills are filtered out
  const showEmptyState = bills.length > 0 && filteredBills.length === 0;

  return (
    <>
      {/* Filters Panel */}
      {bills.length > 0 && (
        <div className="mb-6">
          <BillsFiltersPanel filters={filters} onChange={setFilters} />
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
            <BillCard key={bill.id} bill={bill as any} />
          ))}
        </div>
      )}
    </>
  );
}
