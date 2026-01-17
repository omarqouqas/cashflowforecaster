import { requireAuth } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Wallet, ArrowLeft } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import { AccountCard } from '@/components/accounts/account-card';
import { InfoTooltip } from '@/components/ui/tooltip';

interface AccountsPageProps {
  searchParams: { success?: string };
}

export default async function AccountsPage({ searchParams }: AccountsPageProps) {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data: accounts, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // Handle error
  if (error) {
    console.error('Error fetching accounts:', error);
  }

  const success = searchParams?.success;
  const accountList = (accounts ?? []) as any[];
  const currency = accountList.find((a) => a.currency)?.currency || 'USD';
  const totalBalance = accountList.reduce((sum, a) => sum + (a.current_balance || 0), 0);
  const spendableTotal = accountList.reduce((sum, a) => {
    const spendable = a.is_spendable ?? true;
    return spendable ? sum + (a.current_balance || 0) : sum;
  }, 0);

  return (
    <>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>
      </div>

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Accounts</h2>
          <p className="text-sm text-zinc-400 mt-1">
            Track your bank accounts and balances
          </p>
        </div>
        <Link href="/dashboard/accounts/new">
          <Button variant="primary">+ Add Account</Button>
        </Link>
      </div>

      {/* Success Message */}
      {success === 'account-created' && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 mb-6">
          <p className="text-sm text-emerald-300">✓ Account created successfully</p>
        </div>
      )}
      {success === 'account-updated' && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 mb-6">
          <p className="text-sm text-emerald-300">✓ Account updated successfully</p>
        </div>
      )}
      {success === 'account-deleted' && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 mb-6">
          <p className="text-sm text-emerald-300">✓ Account deleted successfully</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-4 mb-6">
          <p className="text-sm text-rose-300">
            Error loading accounts. Please try refreshing the page.
          </p>
        </div>
      )}

      {/* Summary */}
      {!error && accountList.length > 0 && (
        <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm text-zinc-400">Total Balance</p>
                <InfoTooltip content="Sum of current balances across all accounts." />
              </div>
              <p className="text-3xl font-bold text-teal-300 tabular-nums">
                {formatCurrency(totalBalance, currency)}
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                Across {accountList.length} account{accountList.length !== 1 ? 's' : ''}
              </p>
              <p className="text-sm text-zinc-300 mt-2">
                Spendable:{' '}
                <span className="font-semibold tabular-nums text-emerald-400">
                  {formatCurrency(spendableTotal, currency)}
                </span>
              </p>
            </div>

            <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Wallet className="w-8 h-8 text-teal-300" />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {!error && (
        <>
          {accountList.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="w-10 h-10 mx-auto mb-3 text-zinc-500" />
              <p className="text-zinc-200 font-medium">No accounts yet</p>
              <p className="text-sm text-zinc-400 mt-1 mb-6">
                Add your checking account to start tracking your 60-day cash flow.
              </p>
              <Link href="/dashboard/accounts/new">
                <Button variant="primary">Add Account</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {accountList.map((account) => (
                <AccountCard key={account.id} account={account} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
