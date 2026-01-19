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
  FileText,
  Briefcase,
} from 'lucide-react';

export type FrequencyType = 'one-time' | 'weekly' | 'biweekly' | 'monthly' | 'irregular';
export type SourceType = 'regular' | 'invoice';

export interface IncomeFilters {
  status: ('active' | 'inactive')[];
  frequencies: FrequencyType[];
  sourceTypes: SourceType[];
  amountMin: number | null;
  amountMax: number | null;
  search: string;
}

const allFrequencies: FrequencyType[] = ['one-time', 'weekly', 'biweekly', 'monthly', 'irregular'];
const allSourceTypes: SourceType[] = ['regular', 'invoice'];

export const defaultIncomeFilters: IncomeFilters = {
  status: ['active', 'inactive'],
  frequencies: allFrequencies,
  sourceTypes: allSourceTypes,
  amountMin: null,
  amountMax: null,
  search: '',
};

interface IncomeFiltersProps {
  filters: IncomeFilters;
  onChange: (filters: IncomeFilters) => void;
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
  { value: 'irregular', label: 'Irregular', color: 'orange' },
];

const sourceTypeOptions: FilterOption[] = [
  {
    value: 'regular',
    label: 'Regular',
    icon: <Briefcase className="w-3.5 h-3.5" />,
    color: 'green',
  },
  {
    value: 'invoice',
    label: 'Invoice-linked',
    icon: <FileText className="w-3.5 h-3.5" />,
    color: 'teal',
  },
];

/**
 * IncomeFiltersPanel - Filter controls for the Income page
 *
 * Allows filtering by:
 * - Status (Active / Inactive)
 * - Frequency (One-time, Weekly, Monthly, etc.)
 * - Source Type (Regular / Invoice-linked)
 * - Amount range (min/max)
 * - Search by name
 */
export function IncomeFiltersPanel({ filters, onChange }: IncomeFiltersProps) {
  // Count active filters (filters that differ from defaults)
  const activeFilterCount = React.useMemo(() => {
    let count = 0;
    if (filters.status.length !== 2) count++;
    if (filters.frequencies.length !== allFrequencies.length) count++;
    if (filters.sourceTypes.length !== allSourceTypes.length) count++;
    if (filters.amountMin !== null || filters.amountMax !== null) count++;
    if (filters.search) count++;
    return count;
  }, [filters]);

  const handleClearAll = () => {
    onChange(defaultIncomeFilters);
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
          label="Source Type"
          options={sourceTypeOptions}
          value={filters.sourceTypes}
          onChange={(value) =>
            onChange({
              ...filters,
              sourceTypes: value as SourceType[],
            })
          }
          allowEmpty={false}
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
          placeholder="Search income sources..."
        />
      </FilterSection>
    </FilterPanel>
  );
}

/**
 * Hook to manage income filter state with URL persistence
 */
export function useIncomeFilters(initialFilters?: Partial<IncomeFilters>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse filters from URL on initial load
  const filtersFromUrl = React.useMemo((): IncomeFilters => {
    const status = searchParams.get('status');
    const freqs = searchParams.get('freq');
    const sources = searchParams.get('source');
    const minAmount = searchParams.get('min');
    const maxAmount = searchParams.get('max');
    const search = searchParams.get('q');

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
      search: search || '',
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

  // Update URL when filters change
  const setFilters = React.useCallback(
    (newFilters: IncomeFilters) => {
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
    setFilters(defaultIncomeFilters);
  }, [setFilters]);

  const isFiltered = React.useMemo(() => {
    return (
      filters.status.length !== 2 ||
      filters.frequencies.length !== allFrequencies.length ||
      filters.sourceTypes.length !== allSourceTypes.length ||
      filters.amountMin !== null ||
      filters.amountMax !== null ||
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
