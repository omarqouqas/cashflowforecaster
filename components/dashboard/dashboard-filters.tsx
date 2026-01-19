'use client';

import * as React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  FilterPanel,
  FilterSection,
  FilterSegmentedControl,
  FilterToggleGroup,
  type FilterOption,
} from '@/components/filters';
import { Wallet } from 'lucide-react';

export interface DashboardFilters {
  forecastHorizon: '7' | '14' | '30' | '60';
  selectedAccountIds: string[];
}

export const defaultDashboardFilters: DashboardFilters = {
  forecastHorizon: '60',
  selectedAccountIds: [], // Empty means "all accounts"
};

interface Account {
  id: string;
  name: string;
  account_type: string;
  current_balance: number;
  is_spendable?: boolean | null;
}

interface DashboardFiltersProps {
  filters: DashboardFilters;
  onChange: (filters: DashboardFilters) => void;
  accounts: Account[];
  maxForecastDays: number;
}

const forecastHorizonOptions = [
  { value: '7', label: '7 Days' },
  { value: '14', label: '14 Days' },
  { value: '30', label: '30 Days' },
  { value: '60', label: '60 Days' },
];

/**
 * DashboardFiltersPanel - Filter controls for the Dashboard page
 *
 * Allows filtering by:
 * - Forecast horizon (7/14/30/60 days)
 * - Account selection (filter which accounts to include)
 */
export function DashboardFiltersPanel({
  filters,
  onChange,
  accounts,
  maxForecastDays,
}: DashboardFiltersProps) {
  // Filter horizon options based on subscription limit
  const availableHorizons = forecastHorizonOptions.filter(
    (opt) => parseInt(opt.value, 10) <= maxForecastDays
  );

  // Build account options dynamically
  const accountOptions: FilterOption[] = accounts.map((acc) => ({
    value: acc.id,
    label: acc.name,
    icon: <Wallet className="w-3.5 h-3.5" />,
    color: 'teal' as const,
  }));

  // Count active filters
  const activeFilterCount = React.useMemo(() => {
    let count = 0;
    const defaultHorizon =
      maxForecastDays >= 60 ? '60' : maxForecastDays >= 30 ? '30' : '14';
    if (filters.forecastHorizon !== defaultHorizon) count++;
    if (filters.selectedAccountIds.length > 0) count++;
    return count;
  }, [filters, maxForecastDays]);

  const handleClearAll = () => {
    onChange({
      ...defaultDashboardFilters,
      forecastHorizon:
        maxForecastDays >= 60 ? '60' : maxForecastDays >= 30 ? '30' : '14',
    });
  };

  // If only one account or no accounts, don't show account filter
  const showAccountFilter = accounts.length > 1;

  return (
    <FilterPanel
      activeFilterCount={activeFilterCount}
      onClearAll={handleClearAll}
      collapsible={true}
      defaultCollapsed={activeFilterCount === 0}
    >
      <FilterSection>
        <FilterSegmentedControl
          label="Forecast Horizon"
          options={availableHorizons}
          value={filters.forecastHorizon}
          onChange={(value) =>
            onChange({
              ...filters,
              forecastHorizon: value as DashboardFilters['forecastHorizon'],
            })
          }
        />

        {showAccountFilter && (
          <FilterToggleGroup
            label="Accounts"
            options={accountOptions}
            value={
              filters.selectedAccountIds.length === 0
                ? accounts.map((a) => a.id) // All selected when empty
                : filters.selectedAccountIds
            }
            onChange={(value) => {
              // If all accounts are selected, store as empty array (means "all")
              const allSelected = value.length === accounts.length;
              onChange({
                ...filters,
                selectedAccountIds: allSelected ? [] : value,
              });
            }}
            allowEmpty={false}
          />
        )}
      </FilterSection>
    </FilterPanel>
  );
}

/**
 * Hook to manage dashboard filter state with URL persistence
 */
export function useDashboardFilters(
  initialFilters?: Partial<DashboardFilters>,
  maxForecastDays: number = 60
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const defaultHorizon =
    maxForecastDays >= 60 ? '60' : maxForecastDays >= 30 ? '30' : '14';

  // Parse filters from URL on initial load
  const filtersFromUrl = React.useMemo((): DashboardFilters => {
    const horizon = searchParams.get('horizon');
    const accounts = searchParams.get('accounts');

    return {
      forecastHorizon: (horizon as DashboardFilters['forecastHorizon']) || defaultHorizon,
      selectedAccountIds: accounts ? accounts.split(',').filter(Boolean) : [],
    };
  }, [searchParams, defaultHorizon]);

  const [filters, setFiltersState] = React.useState<DashboardFilters>(() => ({
    forecastHorizon: filtersFromUrl.forecastHorizon || (defaultHorizon as DashboardFilters['forecastHorizon']),
    selectedAccountIds: initialFilters?.selectedAccountIds ?? filtersFromUrl.selectedAccountIds ?? [],
  }));

  // Sync state with URL changes
  React.useEffect(() => {
    setFiltersState({
      forecastHorizon: filtersFromUrl.forecastHorizon || (defaultHorizon as DashboardFilters['forecastHorizon']),
      selectedAccountIds: filtersFromUrl.selectedAccountIds,
    });
  }, [filtersFromUrl, defaultHorizon]);

  // Update URL when filters change
  const setFilters = React.useCallback(
    (newFilters: DashboardFilters) => {
      setFiltersState(newFilters);

      // Update URL params
      const params = new URLSearchParams(searchParams.toString());

      // Forecast horizon
      if (newFilters.forecastHorizon === defaultHorizon) {
        params.delete('horizon');
      } else {
        params.set('horizon', newFilters.forecastHorizon);
      }

      // Selected accounts
      if (newFilters.selectedAccountIds.length === 0) {
        params.delete('accounts');
      } else {
        params.set('accounts', newFilters.selectedAccountIds.join(','));
      }

      // Update URL without scroll
      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(newUrl, { scroll: false });
    },
    [router, pathname, searchParams, defaultHorizon]
  );

  const resetFilters = React.useCallback(() => {
    setFilters({
      ...defaultDashboardFilters,
      forecastHorizon: defaultHorizon as DashboardFilters['forecastHorizon'],
    });
  }, [setFilters, defaultHorizon]);

  const isFiltered = React.useMemo(() => {
    return (
      filters.forecastHorizon !== defaultHorizon ||
      filters.selectedAccountIds.length > 0
    );
  }, [filters, defaultHorizon]);

  return {
    filters,
    setFilters,
    resetFilters,
    isFiltered,
  };
}
