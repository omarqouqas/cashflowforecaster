import { requireAuth } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { Tables } from '@/types/supabase';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import generateCalendar from '@/lib/calendar/generate';
import { CalendarView } from '@/components/calendar/calendar-view';
import { CalendarSummary } from '@/components/calendar/calendar-summary';
import { EmptyCalendarState } from '@/components/calendar/empty-calendar-state';

type Account = Tables<'accounts'>;
type Income = Tables<'income'>;
type Bill = Tables<'bills'>;

export default async function CalendarPage() {
  const user = await requireAuth();
  const supabase = await createClient();

  // Fetch accounts, income, bills, and user settings in parallel
  const [accountsResult, incomeResult, billsResult, settingsResult] = await Promise.all([
    supabase
      .from('accounts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('income')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('bills')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('user_settings')
      .select('safety_buffer')
      .eq('user_id', user.id)
      .single(),
  ]);

  const accounts = accountsResult.data || [];
  const income = incomeResult.data || [];
  const bills = billsResult.data || [];

  // Extract safety buffer with fallback to default
  // Note: settingsResult.error is expected if user_settings doesn't exist yet, so we ignore it
  const safetyBuffer = settingsResult.data?.safety_buffer ?? 500;

  // Handle errors (exclude settings errors as they're expected if no settings exist)
  const errors = [
    accountsResult.error,
    incomeResult.error,
    billsResult.error,
  ].filter(Boolean);

  if (errors.length > 0) {
    console.error('Error fetching calendar data:', errors);
  }

  // Show empty state if user has no accounts
  if (accounts.length === 0) {
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
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            60-Day Cash Flow Forecast
          </h2>
        </div>

        {/* Empty State */}
        <EmptyCalendarState type="no-accounts" />
      </>
    );
  }

  // Generate calendar data with user's safety buffer
  const calendarData = generateCalendar(accounts, income, bills, safetyBuffer);

  // Check if user has accounts but no income/bills
  const hasIncome = income.length > 0;
  const hasBills = bills.length > 0;
  const showTipBanner = !hasIncome && !hasBills;

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
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          60-Day Cash Flow Forecast
        </h2>
      </div>

      {/* Error State */}
      {errors.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-800 dark:text-red-200">
            Error loading calendar data. Please try refreshing the page.
          </p>
        </div>
      )}

      {/* Tip Banner */}
      {showTipBanner && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 <strong>Tip:</strong> Add income sources and bills to see your 60-day cash flow
            forecast. Your calendar will show projected balances based on your recurring
            transactions.
          </p>
        </div>
      )}

      {/* Calendar Summary */}
      <CalendarSummary calendarData={calendarData} safetyBuffer={safetyBuffer} />

      {/* Calendar View */}
      <CalendarView calendarData={calendarData} safetyBuffer={safetyBuffer} />
    </>
  );
}

