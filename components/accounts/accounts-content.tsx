'use client';

import { useMemo } from 'react';
import { AccountCard } from './account-card';
import {
  AccountsFilterBar,
  useAccountsFilters,
  defaultAccountsFilters,
  type AccountsFilters,
  type AccountType,
  type SpendableStatus,
} from './accounts-filters';

interface Account {
  id: string;
  name: string;
  account_type: string | null;
  current_balance: number | null;
  is_spendable: boolean | null;
  currency: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface AccountsContentProps {
  accounts: Account[];
}

/**
 * Filter accounts based on the current filter settings
 */
function filterAccounts(accounts: Account[], filters: AccountsFilters): Account[] {
  return accounts.filter((account) => {
    // Filter by account type
    const rawAccountType = (account.account_type ?? 'checking').toLowerCase();
    let normalizedType: AccountType;
    if (rawAccountType === 'savings') {
      normalizedType = 'savings';
    } else if (rawAccountType === 'credit_card') {
      normalizedType = 'credit_card';
    } else {
      normalizedType = 'checking';
    }
    if (!filters.accountTypes.includes(normalizedType)) return false;

    // Filter by spendable status
    const isSpendable = account.is_spendable ?? true;
    const spendableStatus: SpendableStatus = isSpendable ? 'spendable' : 'non-spendable';
    if (!filters.spendable.includes(spendableStatus)) return false;

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!account.name.toLowerCase().includes(searchLower)) return false;
    }

    return true;
  });
}

/**
 * AccountsContent - Client component for Accounts page with filtering
 */
export function AccountsContent({ accounts }: AccountsContentProps) {
  const { filters, setFilters } = useAccountsFilters();

  // Apply filters to accounts
  const filteredAccounts = useMemo(
    () => filterAccounts(accounts, filters),
    [accounts, filters]
  );

  // Show empty state when all accounts are filtered out
  const showEmptyState = accounts.length > 0 && filteredAccounts.length === 0;

  return (
    <>
      {/* Filter Bar */}
      {accounts.length > 0 && (
        <div className="mb-6">
          <AccountsFilterBar
            filters={filters}
            onChange={setFilters}
            resultCount={filteredAccounts.length}
          />
        </div>
      )}

      {showEmptyState ? (
        <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-zinc-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-zinc-300 mb-2">
            No accounts match your filters
          </h3>
          <p className="text-sm text-zinc-500 mb-4">
            Try adjusting your filters to see more results.
          </p>
          <button
            onClick={() => setFilters(defaultAccountsFilters)}
            className="text-sm font-medium text-teal-400 hover:text-teal-300 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredAccounts.map((account) => (
            <AccountCard key={account.id} account={account as any} />
          ))}
        </div>
      )}
    </>
  );
}
