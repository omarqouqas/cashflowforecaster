'use client';

import * as React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  FilterBar,
  FilterBarRow,
} from '@/components/filters/filter-bar';
import { FilterDropdown, type FilterDropdownOption } from '@/components/filters/filter-dropdown';
import { FilterDropdownSingle, type FilterDropdownSingleOption } from '@/components/filters/filter-dropdown-single';
import { AddFilterMenu, type AddFilterOption } from '@/components/filters/add-filter-menu';
import { ActiveFilterPills, type ActiveFilter } from '@/components/filters/active-filter-pills';
import { Wallet, PiggyBank, Building2 } from 'lucide-react';

export type AccountType = 'checking' | 'savings';

export interface DashboardFilters {
  forecastHorizon: '7' | '14' | '30' | '60' | '90' | '365';
  selectedAccountIds: string[];
  accountTypes: AccountType[];
}

const allAccountTypes: AccountType[] = ['checking', 'savings'];

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

// Forecast horizon options
const forecastHorizonOptions: FilterDropdownSingleOption[] = [
  { value: '7', label: '7 Days' },
  { value: '14', label: '14 Days' },
  { value: '30', label: '30 Days' },
  { value: '60', label: '60 Days' },
  { value: '90', label: '90 Days' },
  { value: '365', label: '12 Months' },
];

const accountTypeOptions: FilterDropdownOption[] = [
  { value: 'checking', label: 'Checking', icon: <Building2 className="w-3.5 h-3.5" /> },
  { value: 'savings', label: 'Savings', icon: <PiggyBank className="w-3.5 h-3.5" /> },
];

// Filters that can be added via "+ Add filter" menu
const additionalFilters: AddFilterOption[] = [];

// Default visible filters (always shown)
const defaultVisibleFilters = ['horizon', 'accountType'];

interface DashboardFilterBarProps {
  filters: DashboardFilters;
  onChange: (filters: DashboardFilters) => void;
  accounts: Account[];
  maxForecastDays: number;
  visibleFilters: string[];
  onVisibleFiltersChange: (filters: string[]) => void;
}

/**
 * DashboardFilterBar - Linear-style filter bar for the Dashboard page
 */
export function DashboardFilterBar({
  filters,
  onChange,
  accounts,
  maxForecastDays,
  visibleFilters,
  onVisibleFiltersChange,
}: DashboardFilterBarProps) {
  // Filter horizon options based on subscription limit
  const availableHorizons = forecastHorizonOptions.filter(
    (opt) => parseInt(opt.value, 10) <= maxForecastDays
  );

  // Build account options dynamically
  const accountOptions: FilterDropdownOption[] = accounts.map((acc) => ({
    value: acc.id,
    label: acc.name,
    icon: <Wallet className="w-3.5 h-3.5" />,
  }));

  // Get unique account types from the user's accounts
  const userAccountTypes = Array.from(new Set(accounts.map((a) => a.account_type))) as AccountType[];
  const availableAccountTypeOptions = accountTypeOptions.filter((opt) =>
    userAccountTypes.includes(opt.value as AccountType)
  );

  // Pro users (365 days) default to 90 days, Free users default to their max (60)
  const defaultHorizon =
    maxForecastDays >= 365 ? '90' : maxForecastDays >= 60 ? '60' : maxForecastDays >= 30 ? '30' : '14';

  // Normalize accountTypes to only include types that exist in user's accounts
  // This handles the case where default state has types the user doesn't have
  const normalizedAccountTypes = React.useMemo(() => {
    return filters.accountTypes.filter((type) => userAccountTypes.includes(type));
  }, [filters.accountTypes, userAccountTypes]);

  // Check if all available account types are selected
  const allAccountTypesSelected = userAccountTypes.length > 0 &&
    userAccountTypes.every((type) => normalizedAccountTypes.includes(type));

  // Build active filter pills
  const activeFilterPills = React.useMemo((): ActiveFilter[] => {
    const pills: ActiveFilter[] = [];

    // Horizon filter (only if not default)
    if (filters.forecastHorizon !== defaultHorizon) {
      const option = forecastHorizonOptions.find((o) => o.value === filters.forecastHorizon);
      if (option) {
        pills.push({ key: 'horizon', label: 'Horizon', value: option.label });
      }
    }

    // Account type filter - only show pills when not all available types are selected
    if (normalizedAccountTypes.length > 0 && !allAccountTypesSelected) {
      normalizedAccountTypes.forEach((type) => {
        const option = accountTypeOptions.find((o) => o.value === type);
        if (option) {
          pills.push({ key: 'accountType', label: 'Type', value: option.label });
        }
      });
    }

    // Selected accounts filter
    if (filters.selectedAccountIds.length > 0) {
      filters.selectedAccountIds.forEach((id) => {
        const account = accounts.find((a) => a.id === id);
        if (account) {
          pills.push({ key: 'account', label: 'Account', value: account.name });
        }
      });
    }

    return pills;
  }, [filters, accounts, defaultHorizon, normalizedAccountTypes, allAccountTypesSelected]);

  // Handle removing a filter pill
  const handleRemoveFilter = (key: string, value: string) => {
    switch (key) {
      case 'horizon':
        onChange({ ...filters, forecastHorizon: defaultHorizon as DashboardFilters['forecastHorizon'] });
        break;
      case 'accountType': {
        const typeValue = accountTypeOptions.find((o) => o.label === value)?.value as AccountType;
        if (typeValue) {
          const newTypes = filters.accountTypes.filter((t) => t !== typeValue);
          onChange({
            ...filters,
            accountTypes: newTypes.length > 0 ? newTypes : allAccountTypes,
          });
        }
        break;
      }
      case 'account': {
        const account = accounts.find((a) => a.name === value);
        if (account) {
          const newIds = filters.selectedAccountIds.filter((id) => id !== account.id);
          onChange({ ...filters, selectedAccountIds: newIds });
        }
        break;
      }
    }
  };

  // Handle clearing all filters
  const handleClearAll = () => {
    onChange({
      ...defaultDashboardFilters,
      forecastHorizon: defaultHorizon as DashboardFilters['forecastHorizon'],
    });
    onVisibleFiltersChange(defaultVisibleFilters);
  };

  // Get available filters for the "Add filter" menu
  const availableFiltersForMenu = additionalFilters.filter(
    (f) => !visibleFilters.includes(f.key) && accounts.length > 1
  );

  // Handle adding a filter to visible filters
  const handleAddFilter = (filterKey: string) => {
    onVisibleFiltersChange([...visibleFilters, filterKey]);
  };

  // Show account type filter if there are multiple types
  const showAccountTypeFilter = availableAccountTypeOptions.length > 1;

  return (
    <FilterBar>
      <FilterBarRow>
        <FilterDropdownSingle
          label="Horizon"
          options={availableHorizons}
          value={filters.forecastHorizon}
          onChange={(value) =>
            onChange({ ...filters, forecastHorizon: value as DashboardFilters['forecastHorizon'] })
          }
        />

        {showAccountTypeFilter && (
          <FilterDropdown
            label="Account Type"
            options={availableAccountTypeOptions}
            value={normalizedAccountTypes}
            onChange={(value) =>
              onChange({ ...filters, accountTypes: value as AccountType[] })
            }
            allowEmpty={false}
          />
        )}

        {visibleFilters.includes('accounts') && accounts.length > 1 && (
          <FilterDropdown
            label="Accounts"
            options={accountOptions}
            value={
              filters.selectedAccountIds.length === 0
                ? accounts.map((a) => a.id)
                : filters.selectedAccountIds
            }
            onChange={(value) => {
              const allSelected = value.length === accounts.length;
              onChange({
                ...filters,
                selectedAccountIds: allSelected ? [] : value,
              });
            }}
            searchable={accounts.length > 5}
            searchPlaceholder="Search accounts..."
            allowEmpty={false}
          />
        )}

        {availableFiltersForMenu.length > 0 && (
          <AddFilterMenu
            availableFilters={availableFiltersForMenu}
            onAdd={handleAddFilter}
          />
        )}
      </FilterBarRow>

      <ActiveFilterPills
        filters={activeFilterPills}
        onRemove={handleRemoveFilter}
        onClearAll={activeFilterPills.length > 0 ? handleClearAll : undefined}
      />
    </FilterBar>
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

  // Pro users (365 days) default to 90 days, Free users default to their max (60)
  const defaultHorizon =
    maxForecastDays >= 365 ? '90' : maxForecastDays >= 60 ? '60' : maxForecastDays >= 30 ? '30' : '14';

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

  React.useEffect(() => {
    setVisibleFiltersState(visibleFiltersFromUrl);
  }, [visibleFiltersFromUrl]);

  // Update URL when filters change
  const updateUrl = React.useCallback(
    (newFilters: DashboardFilters, newVisibleFilters: string[]) => {
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
    [router, pathname, searchParams, defaultHorizon]
  );

  const setFilters = React.useCallback(
    (newFilters: DashboardFilters) => {
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
    const defaultFilters = {
      ...defaultDashboardFilters,
      forecastHorizon: defaultHorizon as DashboardFilters['forecastHorizon'],
    };
    setFiltersState(defaultFilters);
    setVisibleFiltersState(defaultVisibleFilters);
    updateUrl(defaultFilters, defaultVisibleFilters);
  }, [updateUrl, defaultHorizon]);

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
    visibleFilters,
    setVisibleFilters,
    resetFilters,
    isFiltered,
  };
}
