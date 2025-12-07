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
        case 'monthly':
          return total + bill.amount * 1;
        case 'quarterly':
          return total + (bill.amount * 4) / 12;
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
                  title="This is your average monthly bills. Quarterly bills are converted to monthly (amount × 4 ÷ 12). Annually bills are converted to monthly (amount ÷ 12). One-time bills are excluded."
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
                * Quarterly = amount × 4 ÷ 12 | Annually = amount ÷ 12
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
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <Receipt className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No bills yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Add your first bill to start tracking your expenses
              </p>
              <Link href="/dashboard/bills/new">
                <Button variant="primary">Add Your First Bill</Button>
              </Link>
            </div>
          ) : (
            /* Bills Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  const categoryColors: Record<string, string> = {
    rent: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    utilities: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    subscriptions: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    insurance: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    other: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  };

  const frequencyColors: Record<string, string> = {
    monthly: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    quarterly: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    annually: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    'one-time': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  };

  const categoryColor =
    categoryColors[bill.category || 'other'] ||
    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';

  const frequencyColor =
    frequencyColors[bill.frequency] ||
    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';

  const isActive = bill.is_active ?? true;

  return (
    <div
      className={`
        bg-white dark:bg-slate-800 border rounded-lg p-6 shadow-sm transition-all h-[200px] flex flex-col
        ${
          !isActive
            ? 'opacity-60 border-gray-300 dark:border-slate-600'
            : 'border-slate-200 dark:border-slate-700 hover:shadow-md'
        }
      `}
    >
      <div className="flex justify-between items-start mb-4 flex-shrink-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 truncate">
            {bill.name}
          </h3>
          <div className="flex gap-2 flex-wrap">
            {/* Category badge */}
            {bill.category && (
              <span
                className={`inline-block px-2 py-1 text-xs rounded font-medium capitalize ${categoryColor}`}
              >
                {bill.category}
              </span>
            )}

            {/* Frequency badge */}
            <span
              className={`inline-block px-2 py-1 text-xs rounded font-medium capitalize ${frequencyColor}`}
            >
              {bill.frequency}
            </span>

            {/* Active/Inactive badge */}
            <ActiveToggleButton
              id={bill.id}
              isActive={bill.is_active}
              tableName="bills"
              itemName={bill.name}
            />
          </div>
        </div>

        <div className="flex gap-2 flex-shrink-0 ml-2">
          <Link href={`/dashboard/bills/${bill.id}/edit`}>
            <button
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors"
              aria-label="Edit bill"
            >
              <Edit className="w-4 h-4" />
            </button>
          </Link>
          <DeleteBillButton billId={bill.id} billName={bill.name} />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-end">
        <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
          {formatCurrency(bill.amount)}
        </div>

        {bill.due_date && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Due: {formatDateOnly(bill.due_date)}
          </p>
        )}
      </div>
    </div>
  );
}

