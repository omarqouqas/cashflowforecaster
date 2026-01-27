// app/dashboard/bills/page.tsx
// ============================================
// Bills Page - With Feature Gating & Dark Theme
// ============================================

export const dynamic = 'force-dynamic';

import { requireAuth } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Receipt, ArrowLeft, Sparkles, Calendar, DollarSign } from 'lucide-react';
import { formatCurrency, formatDateOnly } from '@/lib/utils/format';
import { BillsContent } from '@/components/bills/bills-content';
import { getUserUsageStats } from '@/lib/stripe/feature-gate';
import { GatedAddButton } from '@/components/subscription/gated-add-button';
import { InfoTooltip } from '@/components/ui/tooltip';
import { Tables } from '@/types/supabase';

type Bill = Tables<'bills'>;

interface BillsPageProps {
  searchParams: { success?: string };
}

// Helper function to calculate next due date for recurring bills
function getActualNextDueDate(dueDate: string, frequency: string | null | undefined): Date {
  const storedDate = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (storedDate >= today) {
    return storedDate;
  }

  const freq = (frequency ?? 'monthly').toLowerCase();
  let currentDate = new Date(storedDate);

  switch (freq) {
    case 'weekly':
      while (currentDate < today) {
        currentDate.setDate(currentDate.getDate() + 7);
      }
      break;
    case 'biweekly':
      while (currentDate < today) {
        currentDate.setDate(currentDate.getDate() + 14);
      }
      break;
    case 'semi-monthly':
      // Semi-monthly: twice per month (e.g., 1st & 15th)
      const semiMonthlyDay = storedDate.getDate();
      while (currentDate < today) {
        if (semiMonthlyDay <= 15) {
          if (currentDate.getDate() <= 15) {
            currentDate.setDate(semiMonthlyDay + 15);
          } else {
            currentDate.setMonth(currentDate.getMonth() + 1);
            currentDate.setDate(semiMonthlyDay);
          }
        } else {
          if (currentDate.getDate() >= 16) {
            currentDate.setMonth(currentDate.getMonth() + 1);
            currentDate.setDate(semiMonthlyDay - 15);
          } else {
            currentDate.setDate(semiMonthlyDay);
          }
        }
      }
      break;
    case 'monthly':
      const targetDay = storedDate.getDate();
      while (currentDate < today) {
        let nextMonth = currentDate.getMonth() + 1;
        let nextYear = currentDate.getFullYear();
        if (nextMonth > 11) {
          nextMonth = 0;
          nextYear++;
        }
        const lastDayOfNextMonth = new Date(nextYear, nextMonth + 1, 0).getDate();
        const dayToUse = Math.min(targetDay, lastDayOfNextMonth);
        currentDate = new Date(nextYear, nextMonth, dayToUse);
      }
      break;
    case 'quarterly':
      while (currentDate < today) {
        currentDate.setMonth(currentDate.getMonth() + 3);
      }
      break;
    case 'annually':
      while (currentDate < today) {
        currentDate.setFullYear(currentDate.getFullYear() + 1);
      }
      break;
    default:
      return storedDate;
  }
  return currentDate;
}

// Helper function to calculate monthly bill total
function calculateMonthlyTotal(billsList: Bill[]) {
  return billsList.reduce(function(total, bill) {
    if (!bill.is_active) return total;

    switch (bill.frequency) {
      case 'weekly':
        return total + (bill.amount * 52) / 12;
      case 'biweekly':
        return total + (bill.amount * 26) / 12;
      case 'semi-monthly':
        return total + bill.amount * 2;
      case 'monthly':
        return total + bill.amount * 1;
      case 'quarterly':
        return total + bill.amount / 3;
      case 'annually':
        return total + bill.amount / 12;
      case 'one-time':
        return total;
      default:
        return total;
    }
  }, 0);
}

// Helper function to get active bills
function getActiveBills(billsList: Bill[]) {
  return billsList.filter(function(b) { return b.is_active; });
}

// Helper function to get next due bill
function getNextDueBill(activeBills: Bill[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const futureBills = activeBills.filter(function(bill) {
    if (!bill.due_date) return false;
    const nextDate = getActualNextDueDate(bill.due_date, bill.frequency);
    return nextDate >= today;
  });

  if (futureBills.length === 0) return null;

  return futureBills.reduce(function(earliest, current) {
    if (!earliest || !earliest.due_date || !current.due_date) return current;
    const earliestDate = getActualNextDueDate(earliest.due_date, earliest.frequency);
    const currentDate = getActualNextDueDate(current.due_date, current.frequency);
    return currentDate < earliestDate ? current : earliest;
  }, futureBills[0]);
}

export default async function BillsPage({ searchParams }: BillsPageProps) {
  const user = await requireAuth();
  const supabase = await createClient();

  // Fetch bills, categories, and usage stats in parallel
  const [billsResult, categoriesResult, usageStats] = await Promise.all([
    supabase
      .from('bills')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('user_categories')
      .select('*')
      .eq('user_id', user.id)
      .order('sort_order', { ascending: true }),
    getUserUsageStats(user.id),
  ]);

  const { data: bills, error } = billsResult;
  const userCategories = (categoriesResult.data || []) as Array<{
    id: string;
    name: string;
    color: string;
    icon: string;
    sort_order: number;
  }>;

  if (error) {
    console.error('Error fetching bills:', error);
  }

  const success = searchParams?.success;

  const billsList = (bills || []) as Bill[];

  // Build a comprehensive category list that includes:
  // 1. Default categories (always available)
  // 2. User's custom categories from user_categories table
  // 3. Any unique categories from existing bills (to avoid filtering out data)
  const defaultCategoryList = [
    { id: 'default-1', name: 'Rent/Mortgage', color: 'rose', icon: 'home', sort_order: 1 },
    { id: 'default-2', name: 'Utilities', color: 'amber', icon: 'zap', sort_order: 2 },
    { id: 'default-3', name: 'Subscriptions', color: 'violet', icon: 'repeat', sort_order: 3 },
    { id: 'default-4', name: 'Insurance', color: 'blue', icon: 'shield', sort_order: 4 },
    { id: 'default-5', name: 'Other', color: 'zinc', icon: 'tag', sort_order: 5 },
  ];

  // Get unique category names from bills that aren't in defaults or user categories
  const existingCategoryNames = new Set([
    ...defaultCategoryList.map(c => c.name.toLowerCase()),
    ...userCategories.map(c => c.name.toLowerCase()),
  ]);

  const billCategories = billsList
    .map(b => b.category)
    .filter((cat): cat is string => cat != null && !existingCategoryNames.has(cat.toLowerCase()))
    .filter((cat, i, arr) => arr.indexOf(cat) === i) // unique
    .map((name, i) => ({
      id: `bill-cat-${i}`,
      name,
      color: 'zinc',
      icon: 'tag',
      sort_order: 100 + i,
    }));

  // Merge all categories for the filter dropdown:
  // 1. User categories first (these are the user's customized categories)
  // 2. Default categories that aren't duplicated by user categories
  // 3. Any unique categories from bills that don't exist in either
  const userCategoryNames = new Set(userCategories.map(c => c.name.toLowerCase()));
  const defaultsNotInUserCats = defaultCategoryList.filter(
    d => !userCategoryNames.has(d.name.toLowerCase())
  );
  const categories = [...userCategories, ...defaultsNotInUserCats, ...billCategories];
  const monthlyTotal = calculateMonthlyTotal(billsList);
  const activeBills = getActiveBills(billsList);

  // Feature gating
  const billsCount = usageStats.bills.current;
  const billsLimit = usageStats.bills.limit;
  const isAtLimit = billsLimit !== Infinity && billsCount >= billsLimit;
  const isNearLimit = billsLimit !== Infinity && billsCount >= billsLimit - 2 && !isAtLimit;

  // Calculate next due bill
  const nextBill = getNextDueBill(activeBills);
  let nextBillDueDate = '';
  if (nextBill && nextBill.due_date) {
    const dueDateObj = getActualNextDueDate(nextBill.due_date, nextBill.frequency);
    const parts = dueDateObj.toISOString().split('T');
    nextBillDueDate = parts[0] || '';
  }

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
          <h2 className="text-2xl font-bold text-zinc-100">Bills</h2>
          <p className="text-sm text-zinc-400 mt-1">
            Track your recurring and one-time bills
          </p>
        </div>
        <GatedAddButton
          href="/dashboard/bills/new"
          feature="bills"
          currentCount={billsCount}
          limit={billsLimit}
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
                    ? "You've reached your bills limit"
                    : `${billsLimit - billsCount} bills remaining`}
                </p>
                <p className={`text-sm ${
                  isAtLimit ? 'text-amber-400' : 'text-teal-400'
                }`}>
                  {isAtLimit
                    ? 'Upgrade to Pro for unlimited bill tracking'
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
      {success === 'bill-created' && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 mb-6">
          <p className="text-sm text-emerald-300">✓ Bill created successfully</p>
        </div>
      )}
      {success === 'bill-updated' && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 mb-6">
          <p className="text-sm text-emerald-300">✓ Bill updated successfully</p>
        </div>
      )}
      {success === 'bill-deleted' && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 mb-6">
          <p className="text-sm text-emerald-300">✓ Bill deleted successfully</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-4 mb-6">
          <p className="text-sm text-rose-300">
            Error loading bills. Please try refreshing the page.
          </p>
        </div>
      )}

      {/* Quick Summary */}
      {!error && billsList.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-zinc-100 mb-3">Quick Summary</h3>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {/* Monthly Bills */}
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Receipt className="w-4 h-4 text-rose-400" />
                <p className="text-xs font-medium text-rose-300 uppercase tracking-wide">
                  Monthly Bills
                </p>
                <InfoTooltip content="Estimated average monthly expenses. Weekly (×52÷12), biweekly (×26÷12), quarterly (÷3), and annual (÷12) bills are converted to monthly equivalents." />
              </div>
              <p className="text-2xl font-bold text-rose-300 tabular-nums">
                {formatCurrency(monthlyTotal)}
              </p>
              <p className="text-xs text-rose-300/80 mt-0.5">
                From {activeBills.length} active bill{activeBills.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Total Bills */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-amber-400" />
                <p className="text-xs font-medium text-amber-300 uppercase tracking-wide">
                  Total Bills
                </p>
                <InfoTooltip content="Total number of bills you're tracking. Only active bills are included in forecasts." />
              </div>
              <p className="text-2xl font-bold text-amber-300 tabular-nums">
                {billsList.length}
              </p>
              <p className="text-xs text-amber-300/80 mt-0.5">
                {activeBills.length} active • {billsList.length - activeBills.length} inactive
              </p>
            </div>
          </div>

          {/* Next Due */}
          {nextBill && nextBillDueDate && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <p className="text-sm text-blue-300 font-medium">
                  Next due: {nextBill.name} on {formatDateOnly(nextBillDueDate)}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      {!error && (
        <>
          {!bills || bills.length === 0 ? (
            /* Empty State */
            <div className="border border-zinc-800 bg-zinc-900 rounded-lg overflow-hidden">
              <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center py-10">
                <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mb-6">
                  <Receipt className="w-10 h-10 text-rose-500" />
                </div>

                <h2 className="text-xl font-semibold text-zinc-100 mb-2">Track your bills</h2>
                <p className="text-zinc-400 mb-8 max-w-xs">
                  Add your recurring and one-time bills to stay on top of your expenses and improve your cash flow.
                </p>

                <Link
                  href="/dashboard/bills/new"
                  className="w-full max-w-xs bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-6 rounded-lg transition-colors min-h-[44px] inline-flex items-center justify-center"
                >
                  Add your first bill
                </Link>

                <p className="text-zinc-500 text-sm mt-6">Get started in seconds</p>
              </div>
            </div>
          ) : (
            /* Bills List with Filters */
            <BillsContent bills={billsList} categories={categories} />
          )}
        </>
      )}
    </>
  );
}