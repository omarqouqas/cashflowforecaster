'use client';

import * as React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  FilterPanel,
  FilterSection,
  FilterToggleGroup,
  FilterSearch,
  type FilterOption,
} from '@/components/filters';
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

interface AccountsFiltersProps {
  filters: AccountsFilters;
  onChange: (filters: AccountsFilters) => void;
}

const accountTypeOptions: FilterOption[] = [
  {
    value: 'checking',
    label: 'Checking',
    icon: <Wallet className="w-3.5 h-3.5" />,
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

const spendableOptions: FilterOption[] = [
  {
    value: 'spendable',
    label: 'Spendable',
    icon: <CheckCircle className="w-3.5 h-3.5" />,
    color: 'green',
  },
  {
    value: 'non-spendable',
    label: 'Non-spendable',
    icon: <XCircle className="w-3.5 h-3.5" />,
    color: 'default',
  },
];

/**
 * AccountsFiltersPanel - Filter controls for the Accounts page
 *
 * Allows filtering by:
 * - Account type (Checking / Savings / Credit Card)
 * - Spendable status (Spendable / Non-spendable)
 * - Search by name
 */
export function AccountsFiltersPanel({ filters, onChange }: AccountsFiltersProps) {
  // Count active filters (filters that differ from defaults)
  const activeFilterCount = React.useMemo(() => {
    let count = 0;
    if (filters.accountTypes.length !== allAccountTypes.length) count++;
    if (filters.spendable.length !== allSpendableStatuses.length) count++;
    if (filters.search) count++;
    return count;
  }, [filters]);

  const handleClearAll = () => {
    onChange(defaultAccountsFilters);
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
          label="Account Type"
          options={accountTypeOptions}
          value={filters.accountTypes}
          onChange={(value) =>
            onChange({
              ...filters,
              accountTypes: value as AccountType[],
            })
          }
          allowEmpty={false}
        />

        <FilterToggleGroup
          label="Spendable"
          options={spendableOptions}
          value={filters.spendable}
          onChange={(value) =>
            onChange({
              ...filters,
              spendable: value as SpendableStatus[],
            })
          }
          allowEmpty={false}
        />
      </FilterSection>

      <FilterSection>
        <FilterSearch
          label="Search"
          value={filters.search}
          onChange={(value) =>
            onChange({
              ...filters,
              search: value,
            })
          }
          placeholder="Search accounts..."
        />
      </FilterSection>
    </FilterPanel>
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

      // Update URL params
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

      // Update URL without scroll
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
