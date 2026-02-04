'use client';

import * as React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  FilterBar,
  FilterBarRow,
} from '@/components/filters/filter-bar';
import { FilterBarSearch } from '@/components/filters/filter-bar-search';
import { FilterDropdown, type FilterDropdownOption } from '@/components/filters/filter-dropdown';
import { FilterDropdownSingle } from '@/components/filters/filter-dropdown-single';
import { FilterAmountPresets } from '@/components/filters/filter-amount-presets';
import { AddFilterMenu, type AddFilterOption } from '@/components/filters/add-filter-menu';
import { ActiveFilterPills, type ActiveFilter } from '@/components/filters/active-filter-pills';
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  FileText,
  Briefcase,
  DollarSign,
  Clock,
} from 'lucide-react';
import { getCurrencySymbol } from '@/lib/utils/format';

export type FrequencyType = 'one-time' | 'weekly' | 'biweekly' | 'semi-monthly' | 'monthly' | 'quarterly' | 'annually' | 'irregular';
export type SourceType = 'regular' | 'invoice';
export type SortOption = 'next_date' | 'name' | 'amount' | 'created_at';

export interface IncomeFilters {
  status: ('active' | 'inactive')[];
  frequencies: FrequencyType[];
  sourceTypes: SourceType[];
  amountMin: number | null;
  amountMax: number | null;
  expectedSoonDays: number | null; // null = no filter, 7/14/21/30 = days
  search: string;
  sortBy: SortOption;
}

const allFrequencies: FrequencyType[] = ['one-time', 'weekly', 'biweekly', 'semi-monthly', 'monthly', 'quarterly', 'annually', 'irregular'];
const allSourceTypes: SourceType[] = ['regular', 'invoice'];

export const defaultIncomeFilters: IncomeFilters = {
  status: ['active', 'inactive'],
  frequencies: allFrequencies,
  sourceTypes: allSourceTypes,
  amountMin: null,
  amountMax: null,
  expectedSoonDays: null,
  search: '',
  sortBy: 'next_date',
};

// Filter dropdown options
const statusOptions: FilterDropdownOption[] = [
  { value: 'active', label: 'Active', icon: <CheckCircle className="w-3.5 h-3.5" /> },
  { value: 'inactive', label: 'Inactive', icon: <XCircle className="w-3.5 h-3.5" /> },
];

const sourceTypeOptions: FilterDropdownOption[] = [
  { value: 'regular', label: 'Regular', icon: <Briefcase className="w-3.5 h-3.5" /> },
  { value: 'invoice', label: 'Invoice-linked', icon: <FileText className="w-3.5 h-3.5" /> },
];

const frequencyOptions: FilterDropdownOption[] = [
  { value: 'one-time', label: 'One-time' },
  { value: 'weekly', label: 'Weekly', icon: <RefreshCw className="w-3.5 h-3.5" /> },
  { value: 'biweekly', label: 'Biweekly', icon: <RefreshCw className="w-3.5 h-3.5" /> },
  { value: 'semi-monthly', label: 'Semi-monthly', icon: <RefreshCw className="w-3.5 h-3.5" /> },
  { value: 'monthly', label: 'Monthly', icon: <RefreshCw className="w-3.5 h-3.5" /> },
  { value: 'quarterly', label: 'Quarterly', icon: <RefreshCw className="w-3.5 h-3.5" /> },
  { value: 'annually', label: 'Annually', icon: <RefreshCw className="w-3.5 h-3.5" /> },
  { value: 'irregular', label: 'Irregular' },
];

const expectedSoonOptions: FilterDropdownOption[] = [
  { value: '7', label: 'Next 7 days', icon: <Clock className="w-3.5 h-3.5" /> },
  { value: '14', label: 'Next 14 days', icon: <Clock className="w-3.5 h-3.5" /> },
  { value: '21', label: 'Next 21 days', icon: <Clock className="w-3.5 h-3.5" /> },
  { value: '30', label: 'Next 30 days', icon: <Clock className="w-3.5 h-3.5" /> },
];

const sortOptions: FilterDropdownOption[] = [
  { value: 'next_date', label: 'Next Payment', icon: <Clock className="w-3.5 h-3.5" /> },
  { value: 'name', label: 'Name' },
  { value: 'amount', label: 'Amount', icon: <DollarSign className="w-3.5 h-3.5" /> },
  { value: 'created_at', label: 'Date Added' },
];

// Filters that can be added via "+ Add filter" menu
const additionalFilters: AddFilterOption[] = [
  { key: 'frequency', label: 'Frequency', icon: <RefreshCw className="w-4 h-4" /> },
  { key: 'amount', label: 'Amount', icon: <DollarSign className="w-4 h-4" /> },
  { key: 'expectedSoon', label: 'Expected Soon', icon: <Clock className="w-4 h-4" /> },
];

// Default visible filters (always shown)
const defaultVisibleFilters = ['status', 'sourceType'];

interface IncomeFilterBarProps {
  filters: IncomeFilters;
  onChange: (filters: IncomeFilters) => void;
  resultCount: number;
  totalCount: number;
  visibleFilters: string[];
  onVisibleFiltersChange: (filters: string[]) => void;
  currency?: string;
}

/**
 * IncomeFilterBar - Linear-style filter bar for the Income page
 */
export function IncomeFilterBar({
  filters,
  onChange,
  resultCount,
  totalCount,
  visibleFilters,
  onVisibleFiltersChange,
  currency = 'USD',
}: IncomeFilterBarProps) {
  const currencySymbol = getCurrencySymbol(currency);
  // Build active filter pills
  const activeFilterPills = React.useMemo((): ActiveFilter[] => {
    const pills: ActiveFilter[] = [];

    // Status filter
    if (filters.status.length > 0 && filters.status.length < 2) {
      filters.status.forEach((status) => {
        const option = statusOptions.find((o) => o.value === status);
        if (option) {
          pills.push({ key: 'status', label: 'Status', value: option.label });
        }
      });
    }

    // Source type filter
    if (filters.sourceTypes.length > 0 && filters.sourceTypes.length < allSourceTypes.length) {
      filters.sourceTypes.forEach((source) => {
        const option = sourceTypeOptions.find((o) => o.value === source);
        if (option) {
          pills.push({ key: 'sourceType', label: 'Source', value: option.label });
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
        amountLabel = `${currencySymbol}${filters.amountMin} - ${currencySymbol}${filters.amountMax}`;
      } else if (filters.amountMin !== null) {
        amountLabel = `${currencySymbol}${filters.amountMin}+`;
      } else if (filters.amountMax !== null) {
        amountLabel = `Under ${currencySymbol}${filters.amountMax}`;
      }
      pills.push({ key: 'amount', label: 'Amount', value: amountLabel });
    }

    // Expected soon filter
    if (filters.expectedSoonDays !== null) {
      const option = expectedSoonOptions.find((o) => o.value === String(filters.expectedSoonDays));
      if (option) {
        pills.push({ key: 'expectedSoon', label: 'Expected', value: option.label });
      }
    }

    // Search filter
    if (filters.search) {
      pills.push({ key: 'search', label: 'Search', value: filters.search });
    }

    return pills;
  }, [filters, currencySymbol]);

  // Handle removing a filter pill
  const handleRemoveFilter = (key: string, value: string) => {
    switch (key) {
      case 'status': {
        const statusValue = statusOptions.find((o) => o.label === value)?.value;
        if (statusValue) {
          const newStatus = filters.status.filter((s) => s !== statusValue);
          onChange({
            ...filters,
            status: newStatus.length > 0 ? newStatus : ['active', 'inactive'],
          });
        }
        break;
      }
      case 'sourceType': {
        const sourceValue = sourceTypeOptions.find((o) => o.label === value)?.value as SourceType;
        if (sourceValue) {
          const newSources = filters.sourceTypes.filter((s) => s !== sourceValue);
          onChange({
            ...filters,
            sourceTypes: newSources.length > 0 ? newSources : allSourceTypes,
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
      case 'expectedSoon':
        onChange({ ...filters, expectedSoonDays: null });
        break;
      case 'search':
        onChange({ ...filters, search: '' });
        break;
    }
  };

  // Handle clearing all filters
  const handleClearAll = () => {
    onChange(defaultIncomeFilters);
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
          placeholder="Search income..."
        />

        <FilterDropdown
          label="Status"
          options={statusOptions}
          value={filters.status}
          onChange={(value) =>
            onChange({ ...filters, status: value as ('active' | 'inactive')[] })
          }
          allowEmpty={false}
        />

        <FilterDropdown
          label="Source Type"
          options={sourceTypeOptions}
          value={filters.sourceTypes}
          onChange={(value) =>
            onChange({ ...filters, sourceTypes: value as SourceType[] })
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

        {visibleFilters.includes('expectedSoon') && (
          <FilterDropdownSingle
            label="Expected Soon"
            options={expectedSoonOptions}
            value={filters.expectedSoonDays !== null ? String(filters.expectedSoonDays) : ''}
            onChange={(value) =>
              onChange({ ...filters, expectedSoonDays: value ? parseInt(value, 10) : null })
            }
            allowClear
          />
        )}

        <AddFilterMenu
          availableFilters={availableFilters}
          onAdd={handleAddFilter}
        />
      </FilterBarRow>

      {/* Sort row - separated from filters */}
      <FilterBarRow
        rightSection={
          <>
            <FilterDropdownSingle
              label="Sort"
              options={sortOptions}
              value={filters.sortBy}
              onChange={(value) =>
                onChange({ ...filters, sortBy: value as SortOption })
              }
              showLabelPrefix
            />
            <span className="text-xs text-zinc-500">
              {resultCount !== totalCount
                ? `${resultCount} of ${totalCount} results`
                : `${resultCount} ${resultCount === 1 ? 'result' : 'results'}`}
            </span>
          </>
        }
      />

      {/* Active filter pills row (only shown when filters are active) */}
      <ActiveFilterPills
        filters={activeFilterPills}
        onRemove={handleRemoveFilter}
        onClearAll={activeFilterPills.length > 0 ? handleClearAll : undefined}
      />
    </FilterBar>
  );
}

/**
 * Hook to manage income filter state with URL persistence
 */
export function useIncomeFilters(initialFilters?: Partial<IncomeFilters>) {
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
  const filtersFromUrl = React.useMemo((): IncomeFilters => {
    const status = searchParams.get('status');
    const freqs = searchParams.get('freq');
    const sources = searchParams.get('source');
    const minAmount = searchParams.get('min');
    const maxAmount = searchParams.get('max');
    const expectedSoon = searchParams.get('expected');
    const search = searchParams.get('q');
    const sort = searchParams.get('sort');

    return {
      status: status
        ? (status.split(',') as ('active' | 'inactive')[])
        : defaultIncomeFilters.status,
      frequencies: freqs
        ? (freqs.split(',') as FrequencyType[])
        : defaultIncomeFilters.frequencies,
      sourceTypes: sources
        ? (sources.split(',') as SourceType[])
        : defaultIncomeFilters.sourceTypes,
      amountMin: minAmount ? parseFloat(minAmount) : null,
      amountMax: maxAmount ? parseFloat(maxAmount) : null,
      expectedSoonDays: expectedSoon ? parseInt(expectedSoon, 10) : null,
      search: search || '',
      sortBy: (sort as SortOption) || defaultIncomeFilters.sortBy,
    };
  }, [searchParams]);

  const [filters, setFiltersState] = React.useState<IncomeFilters>({
    ...defaultIncomeFilters,
    ...filtersFromUrl,
    ...initialFilters,
  });

  // Sync state with URL changes
  React.useEffect(() => {
    setFiltersState({
      ...defaultIncomeFilters,
      ...filtersFromUrl,
    });
  }, [filtersFromUrl]);

  React.useEffect(() => {
    setVisibleFiltersState(visibleFiltersFromUrl);
  }, [visibleFiltersFromUrl]);

  // Update URL when filters change
  const updateUrl = React.useCallback(
    (newFilters: IncomeFilters, newVisibleFilters: string[]) => {
      const params = new URLSearchParams(searchParams.toString());

      // Status
      const isDefaultStatus =
        newFilters.status.length === 2 &&
        newFilters.status.includes('active') &&
        newFilters.status.includes('inactive');
      if (isDefaultStatus) {
        params.delete('status');
      } else {
        params.set('status', newFilters.status.join(','));
      }

      // Frequencies
      const isDefaultFreqs = newFilters.frequencies.length === allFrequencies.length;
      if (isDefaultFreqs) {
        params.delete('freq');
      } else {
        params.set('freq', newFilters.frequencies.join(','));
      }

      // Source types
      const isDefaultSources = newFilters.sourceTypes.length === allSourceTypes.length;
      if (isDefaultSources) {
        params.delete('source');
      } else {
        params.set('source', newFilters.sourceTypes.join(','));
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

      // Expected soon
      if (newFilters.expectedSoonDays !== null) {
        params.set('expected', newFilters.expectedSoonDays.toString());
      } else {
        params.delete('expected');
      }

      // Sort
      if (newFilters.sortBy !== defaultIncomeFilters.sortBy) {
        params.set('sort', newFilters.sortBy);
      } else {
        params.delete('sort');
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
    (newFilters: IncomeFilters) => {
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
    setFiltersState(defaultIncomeFilters);
    setVisibleFiltersState(defaultVisibleFilters);
    updateUrl(defaultIncomeFilters, defaultVisibleFilters);
  }, [updateUrl]);

  const isFiltered = React.useMemo(() => {
    return (
      filters.status.length !== 2 ||
      filters.frequencies.length !== allFrequencies.length ||
      filters.sourceTypes.length !== allSourceTypes.length ||
      filters.amountMin !== null ||
      filters.amountMax !== null ||
      filters.expectedSoonDays !== null ||
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
