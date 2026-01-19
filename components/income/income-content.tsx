'use client';

import { useMemo } from 'react';
import { IncomeCard } from './income-card';
import {
  IncomeFiltersPanel,
  useIncomeFilters,
  defaultIncomeFilters,
  type IncomeFilters,
  type FrequencyType,
  type SourceType,
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
}

/**
 * Filter income sources based on the current filter settings
 */
function filterIncomes(incomes: Income[], filters: IncomeFilters): Income[] {
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

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!income.name.toLowerCase().includes(searchLower)) return false;
    }

    return true;
  });
}

/**
 * IncomeContent - Client component for Income page with filtering
 */
export function IncomeContent({ incomes }: IncomeContentProps) {
  const { filters, setFilters } = useIncomeFilters();

  // Apply filters to incomes
  const filteredIncomes = useMemo(
    () => filterIncomes(incomes, filters),
    [incomes, filters]
  );

  // Show empty state when all incomes are filtered out
  const showEmptyState = incomes.length > 0 && filteredIncomes.length === 0;

  return (
    <>
      {/* Filters Panel */}
      {incomes.length > 0 && (
        <div className="mb-6">
          <IncomeFiltersPanel filters={filters} onChange={setFilters} />
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
            <IncomeCard key={income.id} income={income as any} />
          ))}
        </div>
      )}
    </>
  );
}
