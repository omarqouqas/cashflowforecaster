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
  Clock,
  DollarSign,
} from 'lucide-react';

export type FrequencyType = 'one-time' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually';
export type CategoryType = 'rent' | 'utilities' | 'subscriptions' | 'insurance' | 'other';
export type SortOption = 'due_date' | 'name' | 'amount' | 'created_at';

export interface BillsFilters {
  status: ('active' | 'inactive')[];
  frequencies: FrequencyType[];
  categories: CategoryType[];
  amountMin: number | null;
  amountMax: number | null;
  dueSoonDays: number | null; // null = no filter, 7/14/21/30 = days
  search: string;
  sortBy: SortOption;
}

const allFrequencies: FrequencyType[] = ['one-time', 'weekly', 'biweekly', 'monthly', 'quarterly', 'annually'];
const allCategories: CategoryType[] = ['rent', 'utilities', 'subscriptions', 'insurance', 'other'];

export const defaultBillsFilters: BillsFilters = {
  status: ['active', 'inactive'],
  frequencies: allFrequencies,
  categories: allCategories,
  amountMin: null,
  amountMax: null,
  dueSoonDays: null,
  search: '',
  sortBy: 'due_date',
};

// Filter dropdown options
const statusOptions: FilterDropdownOption[] = [
  { value: 'active', label: 'Active', icon: <CheckCircle className="w-3.5 h-3.5" /> },
  { value: 'inactive', label: 'Inactive', icon: <XCircle className="w-3.5 h-3.5" /> },
];

const categoryOptions: FilterDropdownOption[] = [
  { value: 'rent', label: 'Rent/Mortgage' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'subscriptions', label: 'Subscriptions' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'other', label: 'Other' },
];

const frequencyOptions: FilterDropdownOption[] = [
  { value: 'one-time', label: 'One-time' },
  { value: 'weekly', label: 'Weekly', icon: <RefreshCw className="w-3.5 h-3.5" /> },
  { value: 'biweekly', label: 'Biweekly', icon: <RefreshCw className="w-3.5 h-3.5" /> },
  { value: 'monthly', label: 'Monthly', icon: <RefreshCw className="w-3.5 h-3.5" /> },
  { value: 'quarterly', label: 'Quarterly', icon: <RefreshCw className="w-3.5 h-3.5" /> },
  { value: 'annually', label: 'Annually', icon: <RefreshCw className="w-3.5 h-3.5" /> },
];

const dueSoonOptions: FilterDropdownOption[] = [
  { value: '7', label: 'Next 7 days', icon: <Clock className="w-3.5 h-3.5" /> },
  { value: '14', label: 'Next 14 days', icon: <Clock className="w-3.5 h-3.5" /> },
  { value: '21', label: 'Next 21 days', icon: <Clock className="w-3.5 h-3.5" /> },
  { value: '30', label: 'Next 30 days', icon: <Clock className="w-3.5 h-3.5" /> },
];

const sortOptions: FilterDropdownOption[] = [
  { value: 'due_date', label: 'Due Date', icon: <Clock className="w-3.5 h-3.5" /> },
  { value: 'name', label: 'Name' },
  { value: 'amount', label: 'Amount', icon: <DollarSign className="w-3.5 h-3.5" /> },
  { value: 'created_at', label: 'Date Added' },
];

// Filters that can be added via "+ Add filter" menu
const additionalFilters: AddFilterOption[] = [
  { key: 'frequency', label: 'Frequency', icon: <RefreshCw className="w-4 h-4" /> },
  { key: 'amount', label: 'Amount', icon: <DollarSign className="w-4 h-4" /> },
  { key: 'dueSoon', label: 'Due Soon', icon: <Clock className="w-4 h-4" /> },
];

// Default visible filters (always shown)
const defaultVisibleFilters = ['status', 'category'];

interface BillsFilterBarProps {
  filters: BillsFilters;
  onChange: (filters: BillsFilters) => void;
  resultCount: number;
  totalCount: number;
  visibleFilters: string[];
  onVisibleFiltersChange: (filters: string[]) => void;
}

/**
 * BillsFilterBar - Linear-style filter bar for the Bills page
 */
export function BillsFilterBar({
  filters,
  onChange,
  resultCount,
  totalCount,
  visibleFilters,
  onVisibleFiltersChange,
}: BillsFilterBarProps) {
  // Build active filter pills
  const activeFilterPills = React.useMemo((): ActiveFilter[] => {
    const pills: ActiveFilter[] = [];

    // Status filter (only if not "all selected")
    if (filters.status.length > 0 && filters.status.length < 2) {
      filters.status.forEach((status) => {
        const option = statusOptions.find((o) => o.value === status);
        if (option) {
          pills.push({ key: 'status', label: 'Status', value: option.label });
        }
      });
    }

    // Category filter (only if not "all selected")
    if (filters.categories.length > 0 && filters.categories.length < allCategories.length) {
      filters.categories.forEach((cat) => {
        const option = categoryOptions.find((o) => o.value === cat);
        if (option) {
          pills.push({ key: 'category', label: 'Category', value: option.label });
        }
      });
    }

    // Frequency filter (only if not "all selected")
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

    // Due soon filter
    if (filters.dueSoonDays !== null) {
      const option = dueSoonOptions.find((o) => o.value === String(filters.dueSoonDays));
      if (option) {
        pills.push({ key: 'dueSoon', label: 'Due', value: option.label });
      }
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
      case 'status': {
        const statusValue = statusOptions.find((o) => o.label === value)?.value;
        if (statusValue) {
          const newStatus = filters.status.filter((s) => s !== statusValue);
          // Don't allow empty status - reset to all if removing last one
          onChange({
            ...filters,
            status: newStatus.length > 0 ? newStatus : ['active', 'inactive'],
          });
        }
        break;
      }
      case 'category': {
        const catValue = categoryOptions.find((o) => o.label === value)?.value as CategoryType;
        if (catValue) {
          const newCategories = filters.categories.filter((c) => c !== catValue);
          onChange({
            ...filters,
            categories: newCategories.length > 0 ? newCategories : allCategories,
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
      case 'dueSoon':
        onChange({ ...filters, dueSoonDays: null });
        break;
      case 'search':
        onChange({ ...filters, search: '' });
        break;
    }
  };

  // Handle clearing all filters
  const handleClearAll = () => {
    onChange(defaultBillsFilters);
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
      {/* First row: Search + dropdowns + Add filter */}
      <FilterBarRow>
        <FilterBarSearch
          value={filters.search}
          onChange={(value) => onChange({ ...filters, search: value })}
          placeholder="Search bills..."
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
          label="Category"
          options={categoryOptions}
          value={filters.categories}
          onChange={(value) =>
            onChange({ ...filters, categories: value as CategoryType[] })
          }
          searchable
          searchPlaceholder="Search categories..."
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

        {visibleFilters.includes('dueSoon') && (
          <FilterDropdownSingle
            label="Due Soon"
            options={dueSoonOptions}
            value={filters.dueSoonDays !== null ? String(filters.dueSoonDays) : ''}
            onChange={(value) =>
              onChange({ ...filters, dueSoonDays: value ? parseInt(value, 10) : null })
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
 * Hook to manage bills filter state with URL persistence
 */
export function useBillsFilters(initialFilters?: Partial<BillsFilters>) {
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
  const filtersFromUrl = React.useMemo((): BillsFilters => {
    const status = searchParams.get('status');
    const freqs = searchParams.get('freq');
    const cats = searchParams.get('cat');
    const minAmount = searchParams.get('min');
    const maxAmount = searchParams.get('max');
    const dueSoon = searchParams.get('due');
    const search = searchParams.get('q');
    const sort = searchParams.get('sort');

    return {
      status: status
        ? (status.split(',') as ('active' | 'inactive')[])
        : defaultBillsFilters.status,
      frequencies: freqs
        ? (freqs.split(',') as FrequencyType[])
        : defaultBillsFilters.frequencies,
      categories: cats
        ? (cats.split(',') as CategoryType[])
        : defaultBillsFilters.categories,
      amountMin: minAmount ? parseFloat(minAmount) : null,
      amountMax: maxAmount ? parseFloat(maxAmount) : null,
      dueSoonDays: dueSoon ? parseInt(dueSoon, 10) : null,
      search: search || '',
      sortBy: (sort as SortOption) || defaultBillsFilters.sortBy,
    };
  }, [searchParams]);

  const [filters, setFiltersState] = React.useState<BillsFilters>({
    ...defaultBillsFilters,
    ...filtersFromUrl,
    ...initialFilters,
  });

  // Sync state with URL changes
  React.useEffect(() => {
    setFiltersState({
      ...defaultBillsFilters,
      ...filtersFromUrl,
    });
  }, [filtersFromUrl]);

  React.useEffect(() => {
    setVisibleFiltersState(visibleFiltersFromUrl);
  }, [visibleFiltersFromUrl]);

  // Update URL when filters change
  const updateUrl = React.useCallback(
    (newFilters: BillsFilters, newVisibleFilters: string[]) => {
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

      // Categories
      const isDefaultCats = newFilters.categories.length === allCategories.length;
      if (isDefaultCats) {
        params.delete('cat');
      } else {
        params.set('cat', newFilters.categories.join(','));
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

      // Due soon
      if (newFilters.dueSoonDays !== null) {
        params.set('due', newFilters.dueSoonDays.toString());
      } else {
        params.delete('due');
      }

      // Sort
      if (newFilters.sortBy !== defaultBillsFilters.sortBy) {
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

      // Visible filters (only non-default ones)
      const additionalVisible = newVisibleFilters.filter(
        (f) => !defaultVisibleFilters.includes(f)
      );
      if (additionalVisible.length > 0) {
        params.set('show', additionalVisible.join(','));
      } else {
        params.delete('show');
      }

      // Update URL without scroll
      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(newUrl, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const setFilters = React.useCallback(
    (newFilters: BillsFilters) => {
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
    setFiltersState(defaultBillsFilters);
    setVisibleFiltersState(defaultVisibleFilters);
    updateUrl(defaultBillsFilters, defaultVisibleFilters);
  }, [updateUrl]);

  const isFiltered = React.useMemo(() => {
    return (
      filters.status.length !== 2 ||
      filters.frequencies.length !== allFrequencies.length ||
      filters.categories.length !== allCategories.length ||
      filters.amountMin !== null ||
      filters.amountMax !== null ||
      filters.dueSoonDays !== null ||
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
