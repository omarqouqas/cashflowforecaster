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
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                  <Wallet className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">
                  No accounts yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Add your first bank account to start tracking your cash flow
                </p>
                <Link href="/dashboard/accounts/new">
                  <Button variant="primary">Add Your First Account</Button>
                </Link>
              </div>
            ) : (
              /* Accounts Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    checking: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    savings: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  };

  const accountTypeColor =
    accountTypeColors[account.account_type || 'checking'] ||
    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            {account.name}
          </h3>
          <span
            className={`inline-block px-2 py-1 text-xs rounded font-medium ${accountTypeColor}`}
          >
            {account.account_type || 'checking'}
          </span>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/accounts/${account.id}/edit`}>
            <button
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors"
              aria-label="Edit account"
            >
              <Edit className="w-4 h-4" />
            </button>
          </Link>
          <DeleteAccountButton accountId={account.id} accountName={account.name} />
        </div>
      </div>

      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {formatCurrency(account.current_balance, account.currency || 'USD')}
      </div>

      {account.updated_at && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Updated {formatRelativeTime(account.updated_at)}
        </p>
      )}
    </div>
  );
}

