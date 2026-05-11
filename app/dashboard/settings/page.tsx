// app/dashboard/settings/page.tsx
import { requireAuth } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SettingsContent } from '@/components/settings/settings-content';
import { LifetimeDealBanner } from '@/components/subscription/lifetime-deal-banner';
import { getUserSubscription } from '@/lib/stripe/subscription';
import { getConnectAccount } from '@/lib/stripe/connect';

export const metadata = {
  title: 'Settings | Cashcast',
  description: 'Configure your Cashcast preferences',
};

export default async function SettingsPage() {
  const user = await requireAuth();
  const supabase = await createClient();

  // Fetch current user settings, accounts, bills, and categories in parallel
  const [settingsResult, accountsResult, billsResult, categoriesResult] = await Promise.all([
    supabase
      .from('user_settings')
      .select(
        'currency, safety_buffer, timezone, email_digest_enabled, email_digest_day, low_balance_alert_enabled, auto_reminders_enabled, tax_rate, tax_tracking_enabled, tax_year, estimated_tax_q1_paid, estimated_tax_q2_paid, estimated_tax_q3_paid, estimated_tax_q4_paid, emergency_fund_enabled, emergency_fund_goal_months, emergency_fund_account_id, business_name, logo_url, phone_number, phone_verified, sms_alerts_enabled, push_alerts_enabled, push_subscription'
      )
      .eq('user_id', user.id)
      .single(),
    supabase
      .from('accounts')
      .select('id, name, account_type, current_balance')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('bills')
      .select('amount, frequency, is_active')
      .eq('user_id', user.id)
      .eq('is_active', true),
    supabase
      .from('user_categories')
      .select('*')
      .eq('user_id', user.id)
      .order('sort_order', { ascending: true }),
  ]);

  const settingsData = settingsResult.data as Record<string, unknown> | null;
  const accounts = (accountsResult.data || []) as Array<{
    id: string;
    name: string;
    account_type: string;
    current_balance: number;
  }>;
  const bills = (billsResult.data || []) as Array<{
    amount: number;
    frequency: string;
    is_active: boolean;
  }>;
  const categories = (categoriesResult.data || []) as Array<{
    id: string;
    user_id: string;
    name: string;
    color: string;
    icon: string;
    sort_order: number;
    created_at: string;
  }>;

  // Extract settings with defaults
  const currency = (settingsData?.currency as string) ?? 'USD';
  const safetyBuffer = (settingsData?.safety_buffer as number) ?? 500;
  const timezone = (settingsData?.timezone as string | null) ?? null;
  const digestEnabled = (settingsData?.email_digest_enabled as boolean) ?? true;
  const digestDay = (settingsData?.email_digest_day as number) ?? 1;
  const lowBalanceAlertEnabled = (settingsData?.low_balance_alert_enabled as boolean) ?? true;
  const autoRemindersEnabled = (settingsData?.auto_reminders_enabled as boolean) ?? true;
  const taxRate = (settingsData?.tax_rate as number) ?? 25.0;
  const taxTrackingEnabled = (settingsData?.tax_tracking_enabled as boolean) ?? true;
  const taxYear = (settingsData?.tax_year as number) ?? new Date().getFullYear();
  const estimatedTaxQ1Paid = (settingsData?.estimated_tax_q1_paid as number) ?? 0;
  const estimatedTaxQ2Paid = (settingsData?.estimated_tax_q2_paid as number) ?? 0;
  const estimatedTaxQ3Paid = (settingsData?.estimated_tax_q3_paid as number) ?? 0;
  const estimatedTaxQ4Paid = (settingsData?.estimated_tax_q4_paid as number) ?? 0;

  // Emergency fund settings
  const emergencyFundEnabled = (settingsData?.emergency_fund_enabled as boolean) ?? false;
  const emergencyFundGoalMonths = (settingsData?.emergency_fund_goal_months as number) ?? 3;
  const emergencyFundAccountId = (settingsData?.emergency_fund_account_id as string | null) ?? null;

  // Invoice branding settings
  const businessName = (settingsData?.business_name as string | null) ?? null;
  const logoUrl = (settingsData?.logo_url as string | null) ?? null;

  // Notification channel settings
  const phoneNumber = (settingsData?.phone_number as string | null) ?? null;
  const phoneVerified = (settingsData?.phone_verified as boolean) ?? false;
  const smsEnabled = (settingsData?.sms_alerts_enabled as boolean) ?? false;
  const pushEnabled = (settingsData?.push_alerts_enabled as boolean) ?? false;
  const pushSubscribed = settingsData?.push_subscription != null;

  // Calculate monthly expenses from bills
  const monthlyExpenses = bills.reduce((total: number, bill) => {
    switch (bill.frequency) {
      case 'weekly':
        return total + (bill.amount * 52) / 12;
      case 'biweekly':
        return total + (bill.amount * 26) / 12;
      case 'semi-monthly':
        return total + bill.amount * 2;
      case 'monthly':
        return total + bill.amount;
      case 'quarterly':
        return total + bill.amount / 3;
      case 'annually':
        return total + bill.amount / 12;
      default:
        return total;
    }
  }, 0);

  // Fetch subscription status and connect account in parallel
  const [subscription, connectAccount] = await Promise.all([
    getUserSubscription(user.id),
    getConnectAccount(user.id),
  ]);

  // Format the created_at date
  const accountCreatedDate = user.created_at ? formatDate(new Date(user.created_at)) : 'N/A';

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Lifetime Deal Banner */}
      <LifetimeDealBanner currentTier={subscription.tier} />

      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-zinc-400 hover:text-teal-400 transition-colors group mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-zinc-100">Settings</h1>
        <p className="text-zinc-400 mt-1">Manage your account, preferences, and subscription</p>
      </div>

      {/* Tabbed Settings Content */}
      <SettingsContent
        // User info
        userEmail={user.email || 'N/A'}
        accountCreatedDate={accountCreatedDate}
        // Preferences
        currency={currency}
        timezone={timezone}
        safetyBuffer={safetyBuffer}
        categories={categories}
        // Notifications
        digestEnabled={digestEnabled}
        digestDay={digestDay}
        lowBalanceAlertEnabled={lowBalanceAlertEnabled}
        autoRemindersEnabled={autoRemindersEnabled}
        phoneNumber={phoneNumber}
        phoneVerified={phoneVerified}
        smsEnabled={smsEnabled}
        pushEnabled={pushEnabled}
        pushSubscribed={pushSubscribed}
        // Invoicing
        connectAccountStatus={
          connectAccount
            ? (connectAccount.accountStatus as 'pending' | 'active' | 'restricted')
            : 'not_connected'
        }
        chargesEnabled={connectAccount?.chargesEnabled}
        payoutsEnabled={connectAccount?.payoutsEnabled}
        businessName={businessName}
        logoUrl={logoUrl}
        taxSettings={{
          tax_rate: taxRate,
          tax_tracking_enabled: taxTrackingEnabled,
          tax_year: taxYear,
          estimated_tax_q1_paid: estimatedTaxQ1Paid,
          estimated_tax_q2_paid: estimatedTaxQ2Paid,
          estimated_tax_q3_paid: estimatedTaxQ3Paid,
          estimated_tax_q4_paid: estimatedTaxQ4Paid,
        }}
        emergencyFundEnabled={emergencyFundEnabled}
        emergencyFundGoalMonths={emergencyFundGoalMonths}
        emergencyFundAccountId={emergencyFundAccountId}
        accounts={accounts}
        monthlyExpenses={monthlyExpenses}
        // Subscription
        tier={subscription.tier}
        status={subscription.status}
        currentPeriodEnd={subscription.currentPeriodEnd}
        cancelAtPeriodEnd={subscription.cancelAtPeriodEnd}
      />
    </div>
  );
}
