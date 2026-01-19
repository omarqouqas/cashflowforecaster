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
import { Wallet, CreditCard, PiggyBank, Building2 } from 'lucide-react';

export type AccountType = 'checking' | 'savings' | 'credit_card';

export interface DashboardFilters {
  forecastHorizon: '7' | '14' | '30' | '60';
  selectedAccountIds: string[];
  accountTypes: AccountType[];
}

const allAccountTypes: AccountType[] = ['checking', 'savings', 'credit_card'];

export const defaultDashboardFilters: DashboardFilters = {
  forecastHorizon: '60',
  selectedAccountIds: [], // Empty means "all accounts"
  accountTypes: allAccountTypes,
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

const accountTypeOptions: FilterOption[] = [
  {
    value: 'checking',
    label: 'Checking',
    icon: <Building2 className="w-3.5 h-3.5" />,
    color: 'teal',
  },
  {
    value: 'savings',
    label: 'Savings',
    icon: <PiggyBank className="w-3.5 h-3.5" />,
    color: 'green',
  },
  {
    value: 'credit_card',
    label: 'Credit Card',
    icon: <CreditCard className="w-3.5 h-3.5" />,
    color: 'orange',
  },
];

/**
 * DashboardFiltersPanel - Filter controls for the Dashboard page
 *
 * Allows filtering by:
 * - Forecast horizon (7/14/30/60 days)
 * - Account selection (filter which accounts to include)
 * - Account type (Checking / Savings / Credit Card)
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

  // Get unique account types from the user's accounts
  const userAccountTypes = Array.from(new Set(accounts.map((a) => a.account_type)));
  const availableAccountTypeOptions = accountTypeOptions.filter((opt) =>
    userAccountTypes.includes(opt.value)
  );

  // Count active filters
  const activeFilterCount = React.useMemo(() => {
    let count = 0;
    const defaultHorizon =
      maxForecastDays >= 60 ? '60' : maxForecastDays >= 30 ? '30' : '14';
    if (filters.forecastHorizon !== defaultHorizon) count++;
    if (filters.selectedAccountIds.length > 0) count++;
    if (filters.accountTypes.length !== allAccountTypes.length) count++;
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
  // Show account type filter if there are multiple types
  const showAccountTypeFilter = availableAccountTypeOptions.length > 1;

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

        {showAccountTypeFilter && (
          <FilterToggleGroup
            label="Account Type"
            options={availableAccountTypeOptions}
            value={filters.accountTypes}
            onChange={(value) =>
              onChange({
                ...filters,
                accountTypes: value as AccountType[],
              })
            }
            allowEmpty={false}
          />
        )}
      </FilterSection>

      {showAccountFilter && (
        <FilterSection>
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
        </FilterSection>
      )}
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
    const types = searchParams.get('types');

    return {
      forecastHorizon: (horizon as DashboardFilters['forecastHorizon']) || defaultHorizon,
      selectedAccountIds: accounts ? accounts.split(',').filter(Boolean) : [],
      accountTypes: types
        ? (types.split(',') as AccountType[])
        : allAccountTypes,
    };
  }, [searchParams, defaultHorizon]);

  const [filters, setFiltersState] = React.useState<DashboardFilters>(() => ({
    forecastHorizon: filtersFromUrl.forecastHorizon || (defaultHorizon as DashboardFilters['forecastHorizon']),
    selectedAccountIds: initialFilters?.selectedAccountIds ?? filtersFromUrl.selectedAccountIds ?? [],
    accountTypes: filtersFromUrl.accountTypes,
  }));

  // Sync state with URL changes
  React.useEffect(() => {
    setFiltersState({
      forecastHorizon: filtersFromUrl.forecastHorizon || (defaultHorizon as DashboardFilters['forecastHorizon']),
      selectedAccountIds: filtersFromUrl.selectedAccountIds,
      accountTypes: filtersFromUrl.accountTypes,
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

      // Account types
      const isDefaultTypes = newFilters.accountTypes.length === allAccountTypes.length;
      if (isDefaultTypes) {
        params.delete('types');
      } else {
        params.set('types', newFilters.accountTypes.join(','));
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
      filters.selectedAccountIds.length > 0 ||
      filters.accountTypes.length !== allAccountTypes.length
    );
  }, [filters, defaultHorizon]);

  return {
    filters,
    setFilters,
    resetFilters,
    isFiltered,
  };
}
