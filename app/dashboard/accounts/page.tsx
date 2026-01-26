import { requireAuth } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Wallet, ArrowLeft, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import { AccountsContent } from '@/components/accounts/accounts-content';
import { InfoTooltip } from '@/components/ui/tooltip';
import { differenceInDays } from 'date-fns';

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

  // Calculate account health metrics
  const today = new Date();
  const staleAccounts = accountList.filter(account => {
    if (!account.updated_at) return true;
    const daysSinceUpdate = differenceInDays(today, new Date(account.updated_at));
    return daysSinceUpdate > 7;
  });

  const spendableCount = accountList.filter(a => a.is_spendable ?? true).length;

  return (
    <>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-zinc-400 hover:text-teal-400 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
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

      {/* Quick Summary */}
      {!error && accountList.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-zinc-100 mb-3">Quick Summary</h3>

          {/* Balance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {/* Total Balance */}
            <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Wallet className="w-4 h-4 text-teal-400" />
                <p className="text-xs font-medium text-teal-300 uppercase tracking-wide">
                  Total Balance
                </p>
                <InfoTooltip content="Sum of current balances across all accounts." />
              </div>
              <p className="text-2xl font-bold text-teal-300 tabular-nums">
                {formatCurrency(totalBalance, currency)}
              </p>
              <p className="text-xs text-teal-300/80 mt-0.5">
                Across {accountList.length} account{accountList.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Spendable */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <p className="text-xs font-medium text-emerald-300 uppercase tracking-wide">
                  Spendable
                </p>
                <InfoTooltip content="Total balance from accounts marked as spendable. These are used in your cash flow forecast." />
              </div>
              <p className="text-2xl font-bold text-emerald-400 tabular-nums">
                {formatCurrency(spendableTotal, currency)}
              </p>
              <p className="text-xs text-emerald-300/80 mt-0.5">
                {spendableCount} spendable account{spendableCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Account Health Status */}
          <div className="grid grid-cols-1 gap-3">
            {staleAccounts.length > 0 ? (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <p className="text-xs font-medium text-amber-300 uppercase tracking-wide">
                    Needs Update
                  </p>
                </div>
                <p className="text-sm text-amber-300">
                  {staleAccounts.length} account{staleAccounts.length !== 1 ? 's' : ''} not updated in 7+ days
                </p>
              </div>
            ) : (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <p className="text-sm text-emerald-300 font-medium">
                    All accounts current (updated within 7 days)
                  </p>
                </div>
              </div>
            )}
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
                Add your checking account to start tracking your cash flow.
              </p>
              <Link href="/dashboard/accounts/new">
                <Button variant="primary">Add Account</Button>
              </Link>
            </div>
          ) : (
            /* Accounts List with Filters */
            <AccountsContent accounts={accountList} />
          )}
        </>
      )}
    </>
  );
}
