'use client';

import * as React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  FilterPanel,
  FilterSection,
  FilterToggleGroup,
  type FilterOption,
} from '@/components/filters';
import { TrendingUp, Receipt, CircleDot } from 'lucide-react';

export interface CalendarFilters {
  transactionTypes: ('income' | 'bill')[];
  balanceStatuses: ('green' | 'yellow' | 'orange' | 'red')[];
}

export const defaultCalendarFilters: CalendarFilters = {
  transactionTypes: ['income', 'bill'],
  balanceStatuses: ['green', 'yellow', 'orange', 'red'],
};

interface CalendarFiltersProps {
  filters: CalendarFilters;
  onChange: (filters: CalendarFilters) => void;
}

const transactionTypeOptions: FilterOption[] = [
  {
    value: 'income',
    label: 'Income',
    icon: <TrendingUp className="w-3.5 h-3.5" />,
    color: 'green',
  },
  {
    value: 'bill',
    label: 'Bills',
    icon: <Receipt className="w-3.5 h-3.5" />,
    color: 'red',
  },
];

const balanceStatusOptions: FilterOption[] = [
  {
    value: 'green',
    label: 'Safe',
    icon: <CircleDot className="w-3.5 h-3.5" />,
    color: 'green',
  },
  {
    value: 'yellow',
    label: 'Caution',
    icon: <CircleDot className="w-3.5 h-3.5" />,
    color: 'yellow',
  },
  {
    value: 'orange',
    label: 'Low',
    icon: <CircleDot className="w-3.5 h-3.5" />,
    color: 'orange',
  },
  {
    value: 'red',
    label: 'Danger',
    icon: <CircleDot className="w-3.5 h-3.5" />,
    color: 'red',
  },
];

/**
 * CalendarFiltersPanel - Filter controls for the Calendar page
 *
 * Allows filtering by:
 * - Transaction type (Income / Bills)
 * - Balance status (Safe / Caution / Low / Danger)
 */
export function CalendarFiltersPanel({ filters, onChange }: CalendarFiltersProps) {
  // Count active filters (filters that differ from defaults)
  const activeFilterCount = React.useMemo(() => {
    let count = 0;
    if (filters.transactionTypes.length !== 2) count++;
    if (filters.balanceStatuses.length !== 4) count++;
    return count;
  }, [filters]);

  const handleClearAll = () => {
    onChange(defaultCalendarFilters);
  };

  return (
    <FilterPanel
      activeFilterCount={activeFilterCount}
      onClearAll={handleClearAll}
      collapsible={true}
      defaultCollapsed={activeFilterCount === 0}
    >
      <FilterSection>
        <FilterToggleGroup
          label="Show"
          options={transactionTypeOptions}
          value={filters.transactionTypes}
          onChange={(value) =>
            onChange({
              ...filters,
              transactionTypes: value as ('income' | 'bill')[],
            })
          }
          allowEmpty={false}
        />

        <FilterToggleGroup
          label="Balance Status"
          options={balanceStatusOptions}
          value={filters.balanceStatuses}
          onChange={(value) =>
            onChange({
              ...filters,
              balanceStatuses: value as ('green' | 'yellow' | 'orange' | 'red')[],
            })
          }
          allowEmpty={false}
        />
      </FilterSection>
    </FilterPanel>
  );
}

/**
 * Hook to manage calendar filter state with URL persistence
 */
export function useCalendarFilters(initialFilters?: Partial<CalendarFilters>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse filters from URL on initial load
  const filtersFromUrl = React.useMemo((): CalendarFilters => {
    const types = searchParams.get('types');
    const statuses = searchParams.get('status');

    return {
      transactionTypes: types
        ? (types.split(',') as ('income' | 'bill')[])
        : defaultCalendarFilters.transactionTypes,
      balanceStatuses: statuses
        ? (statuses.split(',') as ('green' | 'yellow' | 'orange' | 'red')[])
        : defaultCalendarFilters.balanceStatuses,
    };
  }, [searchParams]);

  const [filters, setFiltersState] = React.useState<CalendarFilters>({
    ...defaultCalendarFilters,
    ...filtersFromUrl,
    ...initialFilters,
  });

  // Sync state with URL changes
  React.useEffect(() => {
    setFiltersState({
      ...defaultCalendarFilters,
      ...filtersFromUrl,
    });
  }, [filtersFromUrl]);

  // Update URL when filters change
  const setFilters = React.useCallback(
    (newFilters: CalendarFilters) => {
      setFiltersState(newFilters);

      // Update URL params
      const params = new URLSearchParams(searchParams.toString());

      // Transaction types
      const isDefaultTypes =
        newFilters.transactionTypes.length === 2 &&
        newFilters.transactionTypes.includes('income') &&
        newFilters.transactionTypes.includes('bill');

      if (isDefaultTypes) {
        params.delete('types');
      } else {
        params.set('types', newFilters.transactionTypes.join(','));
      }

      // Balance statuses
      const isDefaultStatuses =
        newFilters.balanceStatuses.length === 4 &&
        ['green', 'yellow', 'orange', 'red'].every((s) =>
          newFilters.balanceStatuses.includes(s as any)
        );

      if (isDefaultStatuses) {
        params.delete('status');
      } else {
        params.set('status', newFilters.balanceStatuses.join(','));
      }

      // Update URL without scroll
      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(newUrl, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const resetFilters = React.useCallback(() => {
    setFilters(defaultCalendarFilters);
  }, [setFilters]);

  const isFiltered = React.useMemo(() => {
    return (
      filters.transactionTypes.length !== 2 ||
      filters.balanceStatuses.length !== 4
    );
  }, [filters]);

  return {
    filters,
    setFilters,
    resetFilters,
    isFiltered,
  };
}
