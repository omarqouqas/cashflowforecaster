'use client';

import * as React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  FilterBar,
  FilterBarRow,
} from '@/components/filters/filter-bar';
import { FilterBarSearch } from '@/components/filters/filter-bar-search';
import { FilterDropdown, type FilterDropdownOption } from '@/components/filters/filter-dropdown';
import { ActiveFilterPills, type ActiveFilter } from '@/components/filters/active-filter-pills';
import {
  Wallet,
  PiggyBank,
  CreditCard,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export type AccountType = 'checking' | 'savings' | 'credit_card';
export type SpendableStatus = 'spendable' | 'non-spendable';

export interface AccountsFilters {
  accountTypes: AccountType[];
  spendable: SpendableStatus[];
  search: string;
}

const allAccountTypes: AccountType[] = ['checking', 'savings', 'credit_card'];
const allSpendableStatuses: SpendableStatus[] = ['spendable', 'non-spendable'];

export const defaultAccountsFilters: AccountsFilters = {
  accountTypes: allAccountTypes,
  spendable: allSpendableStatuses,
  search: '',
};

// Filter dropdown options
const accountTypeOptions: FilterDropdownOption[] = [
  { value: 'checking', label: 'Checking', icon: <Wallet className="w-3.5 h-3.5" /> },
  { value: 'savings', label: 'Savings', icon: <PiggyBank className="w-3.5 h-3.5" /> },
  { value: 'credit_card', label: 'Credit Card', icon: <CreditCard className="w-3.5 h-3.5" /> },
];

const spendableOptions: FilterDropdownOption[] = [
  { value: 'spendable', label: 'Spendable', icon: <CheckCircle className="w-3.5 h-3.5" /> },
  { value: 'non-spendable', label: 'Non-spendable', icon: <XCircle className="w-3.5 h-3.5" /> },
];

interface AccountsFilterBarProps {
  filters: AccountsFilters;
  onChange: (filters: AccountsFilters) => void;
  resultCount: number;
}

/**
 * AccountsFilterBar - Linear-style filter bar for the Accounts page
 * Minimal filters - no "Add filter" menu needed
 */
export function AccountsFilterBar({
  filters,
  onChange,
  resultCount,
}: AccountsFilterBarProps) {
  // Build active filter pills
  const activeFilterPills = React.useMemo((): ActiveFilter[] => {
    const pills: ActiveFilter[] = [];

    // Account type filter
    if (filters.accountTypes.length > 0 && filters.accountTypes.length < allAccountTypes.length) {
      filters.accountTypes.forEach((type) => {
        const option = accountTypeOptions.find((o) => o.value === type);
        if (option) {
          pills.push({ key: 'accountType', label: 'Type', value: option.label });
        }
      });
    }

    // Spendable filter
    if (filters.spendable.length > 0 && filters.spendable.length < allSpendableStatuses.length) {
      filters.spendable.forEach((status) => {
        const option = spendableOptions.find((o) => o.value === status);
        if (option) {
          pills.push({ key: 'spendable', label: 'Spendable', value: option.label });
        }
      });
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
      case 'spendable': {
        const spendableValue = spendableOptions.find((o) => o.label === value)?.value as SpendableStatus;
        if (spendableValue) {
          const newSpendable = filters.spendable.filter((s) => s !== spendableValue);
          onChange({
            ...filters,
            spendable: newSpendable.length > 0 ? newSpendable : allSpendableStatuses,
          });
        }
        break;
      }
      case 'search':
        onChange({ ...filters, search: '' });
        break;
    }
  };

  // Handle clearing all filters
  const handleClearAll = () => {
    onChange(defaultAccountsFilters);
  };

  return (
    <FilterBar>
      <FilterBarRow>
        <FilterBarSearch
          value={filters.search}
          onChange={(value) => onChange({ ...filters, search: value })}
          placeholder="Search accounts..."
        />

        <FilterDropdown
          label="Account Type"
          options={accountTypeOptions}
          value={filters.accountTypes}
          onChange={(value) =>
            onChange({ ...filters, accountTypes: value as AccountType[] })
          }
          allowEmpty={false}
        />

        <FilterDropdown
          label="Spendable"
          options={spendableOptions}
          value={filters.spendable}
          onChange={(value) =>
            onChange({ ...filters, spendable: value as SpendableStatus[] })
          }
          allowEmpty={false}
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
 * Hook to manage accounts filter state with URL persistence
 */
export function useAccountsFilters(initialFilters?: Partial<AccountsFilters>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse filters from URL on initial load
  const filtersFromUrl = React.useMemo((): AccountsFilters => {
    const types = searchParams.get('type');
    const spendable = searchParams.get('spendable');
    const search = searchParams.get('q');

    return {
      accountTypes: types
        ? (types.split(',') as AccountType[])
        : defaultAccountsFilters.accountTypes,
      spendable: spendable
        ? (spendable.split(',') as SpendableStatus[])
        : defaultAccountsFilters.spendable,
      search: search || '',
    };
  }, [searchParams]);

  const [filters, setFiltersState] = React.useState<AccountsFilters>({
    ...defaultAccountsFilters,
    ...filtersFromUrl,
    ...initialFilters,
  });

  // Sync state with URL changes
  React.useEffect(() => {
    setFiltersState({
      ...defaultAccountsFilters,
      ...filtersFromUrl,
    });
  }, [filtersFromUrl]);

  // Update URL when filters change
  const setFilters = React.useCallback(
    (newFilters: AccountsFilters) => {
      setFiltersState(newFilters);

      const params = new URLSearchParams(searchParams.toString());

      // Account types
      const isDefaultTypes = newFilters.accountTypes.length === allAccountTypes.length;
      if (isDefaultTypes) {
        params.delete('type');
      } else {
        params.set('type', newFilters.accountTypes.join(','));
      }

      // Spendable
      const isDefaultSpendable = newFilters.spendable.length === allSpendableStatuses.length;
      if (isDefaultSpendable) {
        params.delete('spendable');
      } else {
        params.set('spendable', newFilters.spendable.join(','));
      }

      // Search
      if (newFilters.search) {
        params.set('q', newFilters.search);
      } else {
        params.delete('q');
      }

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(newUrl, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const resetFilters = React.useCallback(() => {
    setFilters(defaultAccountsFilters);
  }, [setFilters]);

  const isFiltered = React.useMemo(() => {
    return (
      filters.accountTypes.length !== allAccountTypes.length ||
      filters.spendable.length !== allSpendableStatuses.length ||
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
