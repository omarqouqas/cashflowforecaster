import { requireAuth } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { Tables } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import { DeleteAccountButton } from '@/components/accounts/delete-account-button';
import Link from 'next/link';
import { Wallet, Edit, ArrowLeft } from 'lucide-react';
import { formatCurrency, formatRelativeTime } from '@/lib/utils/format';

type Account = Tables<'accounts'>;

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
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Accounts</h2>
          <Link href="/dashboard/accounts/new">
            <Button variant="primary">Add Account</Button>
          </Link>
        </div>

        {/* Success Message */}
        {success === 'account-created' && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-6">
            <p className="text-sm text-green-800 dark:text-green-200">
              ✓ Account created successfully
            </p>
          </div>
        )}
        {success === 'account-deleted' && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-6">
            <p className="text-sm text-green-800 dark:text-green-200">
              ✓ Account deleted successfully
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800 dark:text-red-200">
              Error loading accounts. Please try refreshing the page.
            </p>
          </div>
        )}

        {/* Content */}
        {!error && (
          <>
            {!accounts || accounts.length === 0 ? (
              /* Empty State */
              <div className="text-center py-12">
                <Wallet className="w-10 h-10 mx-auto mb-3 text-zinc-400" />
                <p className="text-zinc-500">No accounts yet</p>
                <p className="text-sm text-zinc-500 mt-1 mb-6">
                  Add your first bank account to start tracking your cash flow
                </p>
                <Link href="/dashboard/accounts/new">
                  <Button variant="primary">Add Your First Account</Button>
                </Link>
              </div>
            ) : (
              /* Accounts List */
              <div className="space-y-3">
                {accounts.map((account) => (
                  <AccountCard key={account.id} account={account} />
                ))}
              </div>
            )}
          </>
        )}
    </>
  );
}

function AccountCard({ account }: { account: Account }) {
  const accountTypeColors: Record<string, string> = {
    checking: 'bg-blue-50 text-blue-700',
    savings: 'bg-violet-50 text-violet-700',
  };

  const accountTypeColor =
    accountTypeColors[account.account_type || 'checking'] ||
    'bg-zinc-100 text-zinc-600';

  return (
    <div className="border border-zinc-200 bg-white rounded-lg p-4 hover:bg-zinc-50 transition-colors">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-base font-medium text-zinc-900 truncate">{account.name}</p>
          {account.updated_at ? (
            <p className="text-sm text-zinc-500">
              Updated {formatRelativeTime(account.updated_at)}
            </p>
          ) : (
            <p className="text-sm text-zinc-500">&nbsp;</p>
          )}
          <div className="flex gap-2 flex-wrap mt-2">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded capitalize ${accountTypeColor}`}
            >
              {account.account_type || 'checking'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <p className="text-lg font-semibold tabular-nums text-zinc-900">
            {formatCurrency(account.current_balance, account.currency || 'USD')}
          </p>
          <Link href={`/dashboard/accounts/${account.id}/edit`}>
            <button
              className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded transition-colors"
              aria-label="Edit account"
            >
              <Edit className="w-4 h-4" />
            </button>
          </Link>
          <DeleteAccountButton accountId={account.id} accountName={account.name} />
        </div>
      </div>
    </div>
  );
}

