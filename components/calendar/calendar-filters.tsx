'use client';

import * as React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  FilterBar,
  FilterBarRow,
} from '@/components/filters/filter-bar';
import { FilterBarSearch } from '@/components/filters/filter-bar-search';
import { FilterDropdown, type FilterDropdownOption } from '@/components/filters/filter-dropdown';
import { FilterAmountPresets } from '@/components/filters/filter-amount-presets';
import { AddFilterMenu, type AddFilterOption } from '@/components/filters/add-filter-menu';
import { ActiveFilterPills, type ActiveFilter } from '@/components/filters/active-filter-pills';
import { TrendingUp, Receipt, CircleDot, RefreshCw, DollarSign } from 'lucide-react';

export type FrequencyType = 'one-time' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually' | 'irregular';

export interface CalendarFilters {
  transactionTypes: ('income' | 'bill')[];
  balanceStatuses: ('green' | 'yellow' | 'orange' | 'red')[];
  frequencies: FrequencyType[];
  amountMin: number | null;
  amountMax: number | null;
  search: string;
}

const allFrequencies: FrequencyType[] = ['one-time', 'weekly', 'biweekly', 'monthly', 'quarterly', 'annually', 'irregular'];
const allBalanceStatuses = ['green', 'yellow', 'orange', 'red'] as const;

export const defaultCalendarFilters: CalendarFilters = {
  transactionTypes: ['income', 'bill'],
  balanceStatuses: ['green', 'yellow', 'orange', 'red'],
  frequencies: allFrequencies,
  amountMin: null,
  amountMax: null,
  search: '',
};

// Filter dropdown options
const transactionTypeOptions: FilterDropdownOption[] = [
  { value: 'income', label: 'Income', icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { value: 'bill', label: 'Bills', icon: <Receipt className="w-3.5 h-3.5" /> },
];

const balanceStatusOptions: FilterDropdownOption[] = [
  { value: 'green', label: 'Safe', icon: <CircleDot className="w-3.5 h-3.5" /> },
  { value: 'yellow', label: 'Caution', icon: <CircleDot className="w-3.5 h-3.5" /> },
  { value: 'orange', label: 'Low', icon: <CircleDot className="w-3.5 h-3.5" /> },
  { value: 'red', label: 'Danger', icon: <CircleDot className="w-3.5 h-3.5" /> },
];

const frequencyOptions: FilterDropdownOption[] = [
  { value: 'one-time', label: 'One-time' },
  { value: 'weekly', label: 'Weekly', icon: <RefreshCw className="w-3.5 h-3.5" /> },
  { value: 'biweekly', label: 'Biweekly', icon: <RefreshCw className="w-3.5 h-3.5" /> },
  { value: 'monthly', label: 'Monthly', icon: <RefreshCw className="w-3.5 h-3.5" /> },
  { value: 'quarterly', label: 'Quarterly', icon: <RefreshCw className="w-3.5 h-3.5" /> },
  { value: 'annually', label: 'Annually', icon: <RefreshCw className="w-3.5 h-3.5" /> },
  { value: 'irregular', label: 'Irregular' },
];

// Filters that can be added via "+ Add filter" menu
const additionalFilters: AddFilterOption[] = [
  { key: 'frequency', label: 'Frequency', icon: <RefreshCw className="w-4 h-4" /> },
  { key: 'amount', label: 'Amount', icon: <DollarSign className="w-4 h-4" /> },
];

// Default visible filters (always shown)
const defaultVisibleFilters = ['transactionType', 'balanceStatus'];

interface CalendarFilterBarProps {
  filters: CalendarFilters;
  onChange: (filters: CalendarFilters) => void;
  resultCount?: number;
  visibleFilters: string[];
  onVisibleFiltersChange: (filters: string[]) => void;
}

/**
 * CalendarFilterBar - Linear-style filter bar for the Calendar page
 */
export function CalendarFilterBar({
  filters,
  onChange,
  resultCount,
  visibleFilters,
  onVisibleFiltersChange,
}: CalendarFilterBarProps) {
  // Build active filter pills
  const activeFilterPills = React.useMemo((): ActiveFilter[] => {
    const pills: ActiveFilter[] = [];

    // Transaction type filter
    if (filters.transactionTypes.length > 0 && filters.transactionTypes.length < 2) {
      filters.transactionTypes.forEach((type) => {
        const option = transactionTypeOptions.find((o) => o.value === type);
        if (option) {
          pills.push({ key: 'transactionType', label: 'Type', value: option.label });
        }
      });
    }

    // Balance status filter
    if (filters.balanceStatuses.length > 0 && filters.balanceStatuses.length < 4) {
      filters.balanceStatuses.forEach((status) => {
        const option = balanceStatusOptions.find((o) => o.value === status);
        if (option) {
          pills.push({ key: 'balanceStatus', label: 'Status', value: option.label });
        }
      });
    }

    // Frequency filter
    if (filters.frequencies.length > 0 && filters.frequencies.length < allFrequencies.length) {
      filters.frequencies.forEach((freq) => {
        const option = frequencyOptions.find((o) => o.value === freq);
        if (option) {
          pills.push({ key: 'frequency', label: 'Frequency', value: option.label });
        }
      });
    }

    // Amount filter
    if (filters.amountMin !== null || filters.amountMax !== null) {
      let amountLabel = '';
      if (filters.amountMin !== null && filters.amountMax !== null) {
        amountLabel = `$${filters.amountMin} - $${filters.amountMax}`;
      } else if (filters.amountMin !== null) {
        amountLabel = `$${filters.amountMin}+`;
      } else if (filters.amountMax !== null) {
        amountLabel = `Under $${filters.amountMax}`;
      }
      pills.push({ key: 'amount', label: 'Amount', value: amountLabel });
    }

    // Search filter
    if (filters.search) {
      pills.push({ key: 'search', label: 'Search', value: filters.search });
    }

    return pills;
  }, [filters]);

  // Handle removing a filter pill
  const handleRemoveFilter = (key: string, value: string) => {
    switch (key) {
      case 'transactionType': {
        const typeValue = transactionTypeOptions.find((o) => o.label === value)?.value as 'income' | 'bill';
        if (typeValue) {
          const newTypes = filters.transactionTypes.filter((t) => t !== typeValue);
          onChange({
            ...filters,
            transactionTypes: newTypes.length > 0 ? newTypes : ['income', 'bill'],
          });
        }
        break;
      }
      case 'balanceStatus': {
        const statusValue = balanceStatusOptions.find((o) => o.label === value)?.value as typeof allBalanceStatuses[number];
        if (statusValue) {
          const newStatuses = filters.balanceStatuses.filter((s) => s !== statusValue);
          onChange({
            ...filters,
            balanceStatuses: newStatuses.length > 0 ? newStatuses : [...allBalanceStatuses],
          });
        }
        break;
      }
      case 'frequency': {
        const freqValue = frequencyOptions.find((o) => o.label === value)?.value as FrequencyType;
        if (freqValue) {
          const newFrequencies = filters.frequencies.filter((f) => f !== freqValue);
          onChange({
            ...filters,
            frequencies: newFrequencies.length > 0 ? newFrequencies : allFrequencies,
          });
        }
        break;
      }
      case 'amount':
        onChange({ ...filters, amountMin: null, amountMax: null });
        break;
      case 'search':
        onChange({ ...filters, search: '' });
        break;
    }
  };

  // Handle clearing all filters
  const handleClearAll = () => {
    onChange(defaultCalendarFilters);
    onVisibleFiltersChange(defaultVisibleFilters);
  };

  // Get available filters for the "Add filter" menu
  const availableFilters = additionalFilters.filter(
    (f) => !visibleFilters.includes(f.key)
  );

  // Handle adding a filter to visible filters
  const handleAddFilter = (filterKey: string) => {
    onVisibleFiltersChange([...visibleFilters, filterKey]);
  };

  return (
    <FilterBar>
      <FilterBarRow>
        <FilterBarSearch
          value={filters.search}
          onChange={(value) => onChange({ ...filters, search: value })}
          placeholder="Search transactions..."
        />

        <FilterDropdown
          label="Show"
          options={transactionTypeOptions}
          value={filters.transactionTypes}
          onChange={(value) =>
            onChange({ ...filters, transactionTypes: value as ('income' | 'bill')[] })
          }
          allowEmpty={false}
        />

        <FilterDropdown
          label="Balance"
          options={balanceStatusOptions}
          value={filters.balanceStatuses}
          onChange={(value) =>
            onChange({ ...filters, balanceStatuses: value as ('green' | 'yellow' | 'orange' | 'red')[] })
          }
          allowEmpty={false}
        />

        {visibleFilters.includes('frequency') && (
          <FilterDropdown
            label="Frequency"
            options={frequencyOptions}
            value={filters.frequencies}
            onChange={(value) =>
              onChange({ ...filters, frequencies: value as FrequencyType[] })
            }
            allowEmpty={false}
          />
        )}

        {visibleFilters.includes('amount') && (
          <FilterAmountPresets
            value={{ min: filters.amountMin, max: filters.amountMax }}
            onChange={({ min, max }) =>
              onChange({ ...filters, amountMin: min, amountMax: max })
            }
          />
        )}

        <AddFilterMenu
          availableFilters={availableFilters}
          onAdd={handleAddFilter}
        />
      </FilterBarRow>

      <ActiveFilterPills
        filters={activeFilterPills}
        onRemove={handleRemoveFilter}
        onClearAll={activeFilterPills.length > 0 ? handleClearAll : undefined}
        resultCount={resultCount}
      />
    </FilterBar>
  );
}

/**
 * Hook to manage calendar filter state with URL persistence
 */
export function useCalendarFilters(initialFilters?: Partial<CalendarFilters>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse visible filters from URL
  const visibleFiltersFromUrl = React.useMemo((): string[] => {
    const show = searchParams.get('show');
    if (show) {
      return [...defaultVisibleFilters, ...show.split(',')];
    }
    return defaultVisibleFilters;
  }, [searchParams]);

  const [visibleFilters, setVisibleFiltersState] = React.useState<string[]>(visibleFiltersFromUrl);

  // Parse filters from URL on initial load
  const filtersFromUrl = React.useMemo((): CalendarFilters => {
    const types = searchParams.get('types');
    const statuses = searchParams.get('status');
    const freqs = searchParams.get('freq');
    const minAmount = searchParams.get('min');
    const maxAmount = searchParams.get('max');
    const search = searchParams.get('q');

    return {
      transactionTypes: types
        ? (types.split(',') as ('income' | 'bill')[])
        : defaultCalendarFilters.transactionTypes,
      balanceStatuses: statuses
        ? (statuses.split(',') as ('green' | 'yellow' | 'orange' | 'red')[])
        : defaultCalendarFilters.balanceStatuses,
      frequencies: freqs
        ? (freqs.split(',') as FrequencyType[])
        : defaultCalendarFilters.frequencies,
      amountMin: minAmount ? parseFloat(minAmount) : null,
      amountMax: maxAmount ? parseFloat(maxAmount) : null,
      search: search || '',
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

  React.useEffect(() => {
    setVisibleFiltersState(visibleFiltersFromUrl);
  }, [visibleFiltersFromUrl]);

  // Update URL when filters change
  const updateUrl = React.useCallback(
    (newFilters: CalendarFilters, newVisibleFilters: string[]) => {
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
        allBalanceStatuses.every((s) => newFilters.balanceStatuses.includes(s));
      if (isDefaultStatuses) {
        params.delete('status');
      } else {
        params.set('status', newFilters.balanceStatuses.join(','));
      }

      // Frequencies
      const isDefaultFreqs = newFilters.frequencies.length === allFrequencies.length;
      if (isDefaultFreqs) {
        params.delete('freq');
      } else {
        params.set('freq', newFilters.frequencies.join(','));
      }

      // Amount range
      if (newFilters.amountMin !== null) {
        params.set('min', newFilters.amountMin.toString());
      } else {
        params.delete('min');
      }
      if (newFilters.amountMax !== null) {
        params.set('max', newFilters.amountMax.toString());
      } else {
        params.delete('max');
      }

      // Search
      if (newFilters.search) {
        params.set('q', newFilters.search);
      } else {
        params.delete('q');
      }

      // Visible filters
      const additionalVisible = newVisibleFilters.filter(
        (f) => !defaultVisibleFilters.includes(f)
      );
      if (additionalVisible.length > 0) {
        params.set('show', additionalVisible.join(','));
      } else {
        params.delete('show');
      }

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(newUrl, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const setFilters = React.useCallback(
    (newFilters: CalendarFilters) => {
      setFiltersState(newFilters);
      updateUrl(newFilters, visibleFilters);
    },
    [updateUrl, visibleFilters]
  );

  const setVisibleFilters = React.useCallback(
    (newVisibleFilters: string[]) => {
      setVisibleFiltersState(newVisibleFilters);
      updateUrl(filters, newVisibleFilters);
    },
    [updateUrl, filters]
  );

  const resetFilters = React.useCallback(() => {
    setFiltersState(defaultCalendarFilters);
    setVisibleFiltersState(defaultVisibleFilters);
    updateUrl(defaultCalendarFilters, defaultVisibleFilters);
  }, [updateUrl]);

  const isFiltered = React.useMemo(() => {
    return (
      filters.transactionTypes.length !== 2 ||
      filters.balanceStatuses.length !== 4 ||
      filters.frequencies.length !== allFrequencies.length ||
      filters.amountMin !== null ||
      filters.amountMax !== null ||
      filters.search !== ''
    );
  }, [filters]);

  return {
    filters,
    setFilters,
    visibleFilters,
    setVisibleFilters,
    resetFilters,
    isFiltered,
  };
}
