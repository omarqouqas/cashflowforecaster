// app/dashboard/income/page.tsx
// ============================================
// Income Page - With Feature Gating
// ============================================

export const dynamic = 'force-dynamic';

import { requireAuth } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { Tables } from '@/types/supabase';
import Link from 'next/link';
import { TrendingUp, ArrowLeft, Sparkles, Calendar, DollarSign } from 'lucide-react';
import { formatCurrency, formatDateOnly } from '@/lib/utils/format';
import { IncomeContent } from '@/components/income/income-content';
import { getUserUsageStats } from '@/lib/stripe/feature-gate';
import { GatedAddButton } from '@/components/subscription/gated-add-button';
import { InfoTooltip } from '@/components/ui/tooltip';

type Income = Tables<'income'>;

interface IncomePageProps {
  searchParams: { success?: string };
}

export default async function IncomePage({ searchParams }: IncomePageProps) {
  const user = await requireAuth();
  const supabase = await createClient();

  // Fetch income, user settings (for currency), and usage stats in parallel
  const [incomeResult, settingsResult, usageStats] = await Promise.all([
    supabase
      .from('income')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('user_settings')
      .select('currency')
      .eq('user_id', user.id)
      .single(),
    getUserUsageStats(user.id),
  ]);

  const { data: incomes, error } = incomeResult;
  const currency = settingsResult.data?.currency || 'USD';

  if (error) {
    console.error('Error fetching income:', error);
  }

  const success = searchParams?.success;

  // Calculate total monthly income
  const calculateMonthlyIncome = (incomesList: Income[]): number => {
    return incomesList.reduce((total, income) => {
      if (income.is_active === false) return total;

      switch (income.frequency) {
        case 'weekly':
          return total + (income.amount * 52) / 12;
        case 'biweekly':
          return total + (income.amount * 26) / 12;
        case 'semi-monthly':
          return total + income.amount * 2;
        case 'monthly':
          return total + income.amount;
        case 'quarterly':
          return total + income.amount / 3;
        case 'annually':
          return total + income.amount / 12;
        case 'irregular':
          return total;
        case 'one-time':
          return total;
        default:
          return total;
      }
    }, 0);
  };

  const incomesList = (incomes || []) as any[];
  const monthlyTotal = calculateMonthlyIncome(incomesList);
  const activeIncomes = incomesList.filter((i) => i.is_active !== false);

  // Feature gating
  const { current: incomeCount, limit: incomeLimit } = usageStats.income;
  const isAtLimit = incomeLimit !== Infinity && incomeCount >= incomeLimit;
  const isNearLimit = incomeLimit !== Infinity && incomeCount >= incomeLimit - 2 && !isAtLimit;

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
          <h2 className="text-2xl font-bold text-zinc-100">Income Sources</h2>
          <p className="text-sm text-zinc-400 mt-1">
            Track your regular and one-time income
          </p>
        </div>
        <GatedAddButton
          href="/dashboard/income/new"
          feature="income"
          currentCount={incomeCount}
          limit={incomeLimit}
        />
      </div>

      {/* Upgrade Banner - Show when at or near limit */}
      {(isAtLimit || isNearLimit) && (
        <div className={`rounded-lg p-4 mb-6 ${
          isAtLimit
            ? 'bg-amber-500/10 border border-amber-500/30'
            : 'bg-teal-500/10 border border-teal-500/30'
        }`}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                isAtLimit ? 'bg-amber-500/20' : 'bg-teal-500/20'
              }`}>
                <Sparkles className={`w-5 h-5 ${
                  isAtLimit ? 'text-amber-400' : 'text-teal-400'
                }`} />
              </div>
              <div>
                <p className={`font-medium ${
                  isAtLimit ? 'text-amber-300' : 'text-teal-300'
                }`}>
                  {isAtLimit
                    ? "You've reached your income sources limit"
                    : `${incomeLimit - incomeCount} income sources remaining`}
                </p>
                <p className={`text-sm ${
                  isAtLimit ? 'text-amber-400' : 'text-teal-400'
                }`}>
                  {isAtLimit
                    ? 'Upgrade to Pro for unlimited income tracking'
                    : 'Upgrade anytime for unlimited tracking'}
                </p>
              </div>
            </div>
            <Link
              href="/#pricing"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isAtLimit
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-teal-500 hover:bg-teal-600 text-white'
              }`}
            >
              Upgrade
            </Link>
          </div>
        </div>
      )}

      {/* Success Messages */}
      {success === 'income-created' && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 mb-6">
          <p className="text-sm text-emerald-300">✓ Income source added successfully</p>
        </div>
      )}
      {success === 'income-updated' && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 mb-6">
          <p className="text-sm text-emerald-300">✓ Income source updated successfully</p>
        </div>
      )}
      {success === 'income-deleted' && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 mb-6">
          <p className="text-sm text-emerald-300">✓ Income source deleted successfully</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-4 mb-6">
          <p className="text-sm text-rose-300">
            Error loading income sources. Please try refreshing the page.
          </p>
        </div>
      )}

      {/* Quick Summary */}
      {!error && incomesList.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-zinc-100 mb-3">Quick Summary</h3>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {/* Monthly Income */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <p className="text-xs font-medium text-emerald-300 uppercase tracking-wide">
                  Monthly Income
                </p>
                <InfoTooltip content="Estimated average monthly income. Weekly and biweekly payments are converted to monthly equivalents (e.g., 26 biweekly payments ÷ 12 months)." />
              </div>
              <p className="text-2xl font-bold text-emerald-300 tabular-nums">
                {formatCurrency(monthlyTotal, currency)}
              </p>
              <p className="text-xs text-emerald-300/80 mt-0.5">
                From {activeIncomes.length} active source{activeIncomes.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Total Sources */}
            <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-teal-400" />
                <p className="text-xs font-medium text-teal-300 uppercase tracking-wide">
                  Income Sources
                </p>
                <InfoTooltip content="Total number of income sources you're tracking. Only active sources are included in forecasts." />
              </div>
              <p className="text-2xl font-bold text-teal-300 tabular-nums">
                {incomesList.length}
              </p>
              <p className="text-xs text-teal-300/80 mt-0.5">
                {activeIncomes.length} active • {incomesList.length - activeIncomes.length} inactive
              </p>
            </div>
          </div>

          {/* Next Payment */}
          {activeIncomes.length > 0 && (() => {
            // Helper function to get actual next date
            const getActualNextDate = (nextDate: string, frequency: string | null | undefined): Date => {
              const storedDate = new Date(nextDate)
              const today = new Date()
              today.setHours(0, 0, 0, 0)

              if (storedDate >= today) {
                return storedDate
              }

              const freq = (frequency ?? 'monthly').toLowerCase()
              let currentDate = new Date(storedDate)

              switch (freq) {
                case 'weekly':
                  while (currentDate < today) {
                    currentDate.setDate(currentDate.getDate() + 7)
                  }
                  break
                case 'biweekly':
                  while (currentDate < today) {
                    currentDate.setDate(currentDate.getDate() + 14)
                  }
                  break
                case 'semi-monthly':
                  // Semi-monthly: twice per month (e.g., 1st & 15th)
                  const semiMonthlyDay = storedDate.getDate()
                  while (currentDate < today) {
                    if (semiMonthlyDay <= 15) {
                      if (currentDate.getDate() <= 15) {
                        currentDate.setDate(semiMonthlyDay + 15)
                      } else {
                        currentDate.setMonth(currentDate.getMonth() + 1)
                        currentDate.setDate(semiMonthlyDay)
                      }
                    } else {
                      if (currentDate.getDate() >= 16) {
                        currentDate.setMonth(currentDate.getMonth() + 1)
                        currentDate.setDate(semiMonthlyDay - 15)
                      } else {
                        currentDate.setDate(semiMonthlyDay)
                      }
                    }
                  }
                  break
                case 'monthly':
                  const targetDay = storedDate.getDate()
                  while (currentDate < today) {
                    let nextMonth = currentDate.getMonth() + 1
                    let nextYear = currentDate.getFullYear()
                    if (nextMonth > 11) {
                      nextMonth = 0
                      nextYear++
                    }
                    const lastDayOfNextMonth = new Date(nextYear, nextMonth + 1, 0).getDate()
                    const dayToUse = Math.min(targetDay, lastDayOfNextMonth)
                    currentDate = new Date(nextYear, nextMonth, dayToUse)
                  }
                  break
                case 'quarterly':
                  while (currentDate < today) {
                    currentDate.setMonth(currentDate.getMonth() + 3)
                  }
                  break
                case 'annually':
                  while (currentDate < today) {
                    currentDate.setFullYear(currentDate.getFullYear() + 1)
                  }
                  break
                default:
                  return storedDate
              }
              return currentDate
            }

            const today = new Date()
            today.setHours(0, 0, 0, 0)

            // Filter to only include income with future payment dates
            const futureIncomes = activeIncomes.filter(income => {
              const nextDate = getActualNextDate(income.next_date, income.frequency)
              return nextDate >= today
            })

            if (futureIncomes.length === 0) {
              return null
            }

            // Find the income with the earliest actual next date
            const nextIncome = futureIncomes.reduce((earliest, current) => {
              if (!earliest) return current
              const earliestDate = getActualNextDate(earliest.next_date, earliest.frequency)
              const currentDate = getActualNextDate(current.next_date, current.frequency)
              return currentDate < earliestDate ? current : earliest
            }, futureIncomes[0])

            const actualNextDate = getActualNextDate(nextIncome.next_date, nextIncome.frequency)
            const dateString = actualNextDate.toISOString().split('T')[0] ?? ''

            return (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <p className="text-sm text-blue-300 font-medium">
                    Next payment: {nextIncome.name} on {formatDateOnly(dateString)}
                  </p>
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {/* Content */}
      {!error && (
        <>
          {!incomes || incomes.length === 0 ? (
            /* Empty State */
            <div className="border border-zinc-800 bg-zinc-900 rounded-lg overflow-hidden">
              <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center py-10">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                  <TrendingUp className="w-10 h-10 text-emerald-500" />
                </div>

                <h2 className="text-xl font-semibold text-zinc-100 mb-2">Track your income</h2>
                <p className="text-zinc-400 mb-8 max-w-xs">
                  Add your salary, freelance work, or other income sources to see how they impact your cash flow forecast.
                </p>

                <Link
                  href="/dashboard/income/new"
                  className="w-full max-w-xs bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-6 rounded-lg transition-colors min-h-[44px] inline-flex items-center justify-center"
                >
                  Add your first income source
                </Link>

                <p className="text-zinc-500 text-sm mt-6">Takes less than a minute to set up</p>
              </div>
            </div>
          ) : (
            /* Income List with Filters */
            <IncomeContent incomes={incomesList} currency={currency} />
          )}
        </>
      )}
    </>
  );
}