'use client';

import * as React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  FilterPanel,
  FilterSection,
  FilterToggleGroup,
  FilterAmountRange,
  FilterSearch,
  type FilterOption,
} from '@/components/filters';
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  Clock,
} from 'lucide-react';

export type FrequencyType = 'one-time' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually';
export type CategoryType = 'rent' | 'utilities' | 'subscriptions' | 'insurance' | 'other';

export interface BillsFilters {
  status: ('active' | 'inactive')[];
  frequencies: FrequencyType[];
  categories: CategoryType[];
  amountMin: number | null;
  amountMax: number | null;
  dueSoon: boolean;
  search: string;
}

const allFrequencies: FrequencyType[] = ['one-time', 'weekly', 'biweekly', 'monthly', 'quarterly', 'annually'];
const allCategories: CategoryType[] = ['rent', 'utilities', 'subscriptions', 'insurance', 'other'];

export const defaultBillsFilters: BillsFilters = {
  status: ['active', 'inactive'],
  frequencies: allFrequencies,
  categories: allCategories,
  amountMin: null,
  amountMax: null,
  dueSoon: false,
  search: '',
};

interface BillsFiltersProps {
  filters: BillsFilters;
  onChange: (filters: BillsFilters) => void;
}

const statusOptions: FilterOption[] = [
  {
    value: 'active',
    label: 'Active',
    icon: <CheckCircle className="w-3.5 h-3.5" />,
    color: 'green',
  },
  {
    value: 'inactive',
    label: 'Inactive',
    icon: <XCircle className="w-3.5 h-3.5" />,
    color: 'default',
  },
];

const frequencyOptions: FilterOption[] = [
  { value: 'one-time', label: 'One-time', color: 'default' },
  { value: 'weekly', label: 'Weekly', icon: <RefreshCw className="w-3.5 h-3.5" />, color: 'teal' },
  { value: 'biweekly', label: 'Biweekly', icon: <RefreshCw className="w-3.5 h-3.5" />, color: 'teal' },
  { value: 'monthly', label: 'Monthly', icon: <RefreshCw className="w-3.5 h-3.5" />, color: 'teal' },
  { value: 'quarterly', label: 'Quarterly', icon: <RefreshCw className="w-3.5 h-3.5" />, color: 'teal' },
  { value: 'annually', label: 'Annually', icon: <RefreshCw className="w-3.5 h-3.5" />, color: 'teal' },
];

const categoryOptions: FilterOption[] = [
  { value: 'rent', label: 'Rent/Mortgage', color: 'teal' },
  { value: 'utilities', label: 'Utilities', color: 'teal' },
  { value: 'subscriptions', label: 'Subscriptions', color: 'teal' },
  { value: 'insurance', label: 'Insurance', color: 'green' },
  { value: 'other', label: 'Other', color: 'default' },
];

const dueSoonOptions: FilterOption[] = [
  {
    value: 'due-soon',
    label: 'Due in 7 days',
    icon: <Clock className="w-3.5 h-3.5" />,
    color: 'orange',
  },
];

/**
 * BillsFiltersPanel - Filter controls for the Bills page
 *
 * Allows filtering by:
 * - Status (Active / Inactive)
 * - Frequency (One-time, Weekly, Monthly, etc.)
 * - Category (Rent, Utilities, Subscriptions, etc.)
 * - Amount range (min/max)
 * - Due Soon (bills due in next 7 days)
 * - Search by name
 */
export function BillsFiltersPanel({ filters, onChange }: BillsFiltersProps) {
  // Count active filters (filters that differ from defaults)
  const activeFilterCount = React.useMemo(() => {
    let count = 0;
    if (filters.status.length !== 2) count++;
    if (filters.frequencies.length !== allFrequencies.length) count++;
    if (filters.categories.length !== allCategories.length) count++;
    if (filters.amountMin !== null || filters.amountMax !== null) count++;
    if (filters.dueSoon) count++;
    if (filters.search) count++;
    return count;
  }, [filters]);

  const handleClearAll = () => {
    onChange(defaultBillsFilters);
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
          label="Status"
          options={statusOptions}
          value={filters.status}
          onChange={(value) =>
            onChange({
              ...filters,
              status: value as ('active' | 'inactive')[],
            })
          }
          allowEmpty={false}
        />

        <FilterToggleGroup
          label="Due Soon"
          options={dueSoonOptions}
          value={filters.dueSoon ? ['due-soon'] : []}
          onChange={(value) =>
            onChange({
              ...filters,
              dueSoon: value.includes('due-soon'),
            })
          }
          allowEmpty={true}
        />
      </FilterSection>

      <FilterSection>
        <FilterToggleGroup
          label="Frequency"
          options={frequencyOptions}
          value={filters.frequencies}
          onChange={(value) =>
            onChange({
              ...filters,
              frequencies: value as FrequencyType[],
            })
          }
          allowEmpty={false}
        />
      </FilterSection>

      <FilterSection>
        <FilterToggleGroup
          label="Category"
          options={categoryOptions}
          value={filters.categories}
          onChange={(value) =>
            onChange({
              ...filters,
              categories: value as CategoryType[],
            })
          }
          allowEmpty={false}
        />
      </FilterSection>

      <FilterSection>
        <FilterAmountRange
          label="Amount Range"
          minValue={filters.amountMin}
          maxValue={filters.amountMax}
          onChange={(min, max) =>
            onChange({
              ...filters,
              amountMin: min,
              amountMax: max,
            })
          }
        />

        <FilterSearch
          label="Search"
          value={filters.search}
          onChange={(value) =>
            onChange({
              ...filters,
              search: value,
            })
          }
          placeholder="Search bills..."
        />
      </FilterSection>
    </FilterPanel>
  );
}

/**
 * Hook to manage bills filter state with URL persistence
 */
export function useBillsFilters(initialFilters?: Partial<BillsFilters>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse filters from URL on initial load
  const filtersFromUrl = React.useMemo((): BillsFilters => {
    const status = searchParams.get('status');
    const freqs = searchParams.get('freq');
    const cats = searchParams.get('cat');
    const minAmount = searchParams.get('min');
    const maxAmount = searchParams.get('max');
    const dueSoon = searchParams.get('due');
    const search = searchParams.get('q');

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
      dueSoon: dueSoon === 'true',
      search: search || '',
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

  // Update URL when filters change
  const setFilters = React.useCallback(
    (newFilters: BillsFilters) => {
      setFiltersState(newFilters);

      // Update URL params
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
      if (newFilters.dueSoon) {
        params.set('due', 'true');
      } else {
        params.delete('due');
      }

      // Search
      if (newFilters.search) {
        params.set('q', newFilters.search);
      } else {
        params.delete('q');
      }

      // Update URL without scroll
      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(newUrl, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const resetFilters = React.useCallback(() => {
    setFilters(defaultBillsFilters);
  }, [setFilters]);

  const isFiltered = React.useMemo(() => {
    return (
      filters.status.length !== 2 ||
      filters.frequencies.length !== allFrequencies.length ||
      filters.categories.length !== allCategories.length ||
      filters.amountMin !== null ||
      filters.amountMax !== null ||
      filters.dueSoon ||
      filters.search !== ''
    );
  }, [filters]);

  return {
    filters,
    setFilters,
    resetFilters,
    isFiltered,
  };
}
