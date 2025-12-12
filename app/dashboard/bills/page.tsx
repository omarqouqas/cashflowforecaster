import { requireAuth } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { Tables } from '@/types/supabase';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Receipt, ArrowLeft, Edit } from 'lucide-react';
import { formatCurrency, formatDateOnly } from '@/lib/utils/format';
import { DeleteBillButton } from '@/components/bills/delete-bill-button';
import { ActiveToggleButton } from '@/components/ui/active-toggle-button';

type Bill = Tables<'bills'>;

interface BillsPageProps {
  searchParams: { success?: string };
}

export default async function BillsPage({ searchParams }: BillsPageProps) {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data: bills, error } = await supabase
    .from('bills')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bills:', error);
  }

  const success = searchParams?.success;

  // Calculate total monthly bills
  const calculateMonthlyBills = (billsList: Bill[]): number => {
    return billsList.reduce((total, bill) => {
      if (!bill.is_active) return total;

      // Convert all frequencies to monthly equivalent
      switch (bill.frequency) {
        case 'weekly':
          return total + (bill.amount * 52) / 12;
        case 'biweekly':
          return total + (bill.amount * 26) / 12;
        case 'monthly':
          return total + bill.amount * 1;
        case 'quarterly':
          return total + bill.amount / 3;
        case 'annually':
          return total + bill.amount / 12;
        case 'one-time':
          return total; // Don't include one-time
        default:
          return total;
      }
    }, 0);
  };

  const monthlyTotal = calculateMonthlyBills(bills || []);
  const activeBills = bills?.filter((b) => b.is_active) || [];

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
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Bills</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Track your recurring and one-time bills
          </p>
        </div>
        <Link href="/dashboard/bills/new">
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Bill
          </Button>
        </Link>
      </div>

      {/* Success Messages */}
      {success === 'bill-created' && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-6">
          <p className="text-sm text-green-800 dark:text-green-200">
            ✓ Bill created successfully
          </p>
        </div>
      )}
      {success === 'bill-updated' && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-6">
          <p className="text-sm text-green-800 dark:text-green-200">
            ✓ Bill updated successfully
          </p>
        </div>
      )}
      {success === 'bill-deleted' && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-6">
          <p className="text-sm text-green-800 dark:text-green-200">
            ✓ Bill deleted successfully
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-800 dark:text-red-200">
            Error loading bills. Please try refreshing the page.
          </p>
        </div>
      )}

      {/* Summary Section */}
      {!error && bills && bills.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">Estimated Monthly Bills</p>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  title="This is your average monthly bills. Weekly bills are converted to monthly (amount × 52 ÷ 12). Biweekly bills are converted to monthly (amount × 26 ÷ 12). Quarterly bills are converted to monthly (amount ÷ 3). Annually bills are converted to monthly (amount ÷ 12). One-time bills are excluded."
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(monthlyTotal)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                From {activeBills.length} active bill{activeBills.length !== 1 ? 's' : ''}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                * Weekly = amount × 52 ÷ 12 | Biweekly = amount × 26 ÷ 12 | Quarterly = amount ÷ 3 | Annually = amount ÷ 12
              </p>
            </div>
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <Receipt className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {!error && (
        <>
          {!bills || bills.length === 0 ? (
            /* Empty State */
            <div className="text-center py-12">
              <Receipt className="w-10 h-10 mx-auto mb-3 text-zinc-400" />
              <p className="text-zinc-500">No bills yet</p>
              <p className="text-sm text-zinc-500 mt-1 mb-6">
                Add your first bill to start tracking your expenses
              </p>
              <Link href="/dashboard/bills/new">
                <Button variant="primary">Add Your First Bill</Button>
              </Link>
            </div>
          ) : (
            /* Bills List */
            <div className="space-y-3">
              {bills.map((bill) => (
                <BillCard key={bill.id} bill={bill} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}

function BillCard({ bill }: { bill: Bill }) {
  return (
    <div className="border border-zinc-200 bg-white rounded-lg p-4 hover:bg-zinc-50 transition-colors">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-base font-medium text-zinc-900 truncate">{bill.name}</p>
          {bill.due_date ? (
            <p className="text-sm text-zinc-500">Due: {formatDateOnly(bill.due_date)}</p>
          ) : (
            <p className="text-sm text-zinc-500">&nbsp;</p>
          )}

          <div className="flex gap-2 flex-wrap mt-2">
            {bill.category && (
              <span className="bg-zinc-100 text-zinc-600 text-xs font-medium px-2 py-0.5 rounded capitalize">
                {bill.category}
              </span>
            )}
            <span className="bg-zinc-100 text-zinc-600 text-xs font-medium px-2 py-0.5 rounded capitalize">
              {bill.frequency}
            </span>
            <ActiveToggleButton
              id={bill.id}
              isActive={bill.is_active}
              tableName="bills"
              itemName={bill.name}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <p className="text-lg font-semibold tabular-nums text-rose-600">
            {formatCurrency(bill.amount)}
          </p>
          <Link href={`/dashboard/bills/${bill.id}/edit`}>
            <button
              className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded transition-colors"
              aria-label="Edit bill"
            >
              <Edit className="w-4 h-4" />
            </button>
          </Link>
          <DeleteBillButton billId={bill.id} billName={bill.name} />
        </div>
      </div>
    </div>
  );
}

