import { requireAuth } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { Tables } from '@/types/supabase';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, ArrowLeft } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import { IncomeCard } from '@/components/income/income-card';

type Income = Tables<'income'>;

interface IncomePageProps {
  searchParams: { success?: string };
}

export default async function IncomePage({ searchParams }: IncomePageProps) {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data: incomes, error } = await supabase
    .from('income')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching income:', error);
  }

  const success = searchParams?.success;

  // Calculate total monthly income
  const calculateMonthlyIncome = (incomesList: Income[]): number => {
    return incomesList.reduce((total, income) => {
      if (!income.is_active) return total;

      // Convert all frequencies to monthly equivalent
      switch (income.frequency) {
        case 'weekly':
          return total + (income.amount * 52) / 12;
        case 'biweekly':
          return total + (income.amount * 26) / 12;
        case 'monthly':
          return total + income.amount;
        case 'irregular':
          return total; // Don't include irregular
        case 'one-time':
          return total; // Don't include one-time
        default:
          return total;
      }
    }, 0);
  };

  const monthlyTotal = calculateMonthlyIncome(incomes || []);
  const activeIncomes = incomes?.filter((i) => i.is_active) || [];

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
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Income Sources</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Track your regular and one-time income
          </p>
        </div>
        <Link href="/dashboard/income/new">
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Income
          </Button>
        </Link>
      </div>

      {/* Success Messages */}
      {success === 'income-created' && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-6">
          <p className="text-sm text-green-800 dark:text-green-200">
            ✓ Income source added successfully
          </p>
        </div>
      )}
      {success === 'income-updated' && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-6">
          <p className="text-sm text-green-800 dark:text-green-200">
            ✓ Income source updated successfully
          </p>
        </div>
      )}
      {success === 'income-deleted' && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-6">
          <p className="text-sm text-green-800 dark:text-green-200">
            ✓ Income source deleted successfully
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-800 dark:text-red-200">
            Error loading income sources. Please try refreshing the page.
          </p>
        </div>
      )}

      {/* Summary Section */}
      {!error && incomes && incomes.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">Estimated Monthly Income</p>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  title="This is your average monthly income. Biweekly and weekly income is converted to a monthly equivalent (26 biweekly payments per year ÷ 12 months)."
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(monthlyTotal)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                From {activeIncomes.length} active source{activeIncomes.length !== 1 ? 's' : ''}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                * Biweekly = 26 payments/year ÷ 12 months
              </p>
            </div>
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {!error && (
        <>
          {!incomes || incomes.length === 0 ? (
            /* Empty State */
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No income sources yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Add your salary, freelance work, or other income sources to track your cash flow
              </p>
              <Link href="/dashboard/income/new">
                <Button variant="primary">Add Your First Income Source</Button>
              </Link>
            </div>
          ) : (
            /* Income Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {incomes.map((income) => (
                <IncomeCard key={income.id} income={income} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}

