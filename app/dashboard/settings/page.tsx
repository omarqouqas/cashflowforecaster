// app/dashboard/settings/page.tsx
import { requireAuth } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Shield,
  Bell,
  Sliders,
  CreditCard,
  Mail,
  Calendar,
  Lock,
  Banknote,
  Tag,
} from 'lucide-react';
import { SafetyBufferForm } from '@/components/settings/safety-buffer-form';
import { TimezoneForm } from '@/components/settings/timezone-form';
import { CurrencyForm } from '@/components/settings/currency-form';
import { EmailDigestForm } from '@/components/settings/email-digest-form';
import { LowBalanceAlertForm } from '@/components/settings/low-balance-alert-form';
import { TaxSettingsForm } from '@/components/settings/tax-settings-form';
import { EmergencyFundForm } from '@/components/settings/emergency-fund-form';
import { SubscriptionStatus } from '@/components/subscription/subscription-status';
import { getUserSubscription } from '@/lib/stripe/subscription';
import { DeleteAccountSection } from '@/components/settings/delete-account-section';
import { ChangePasswordButton } from '@/components/settings/change-password-button';
import { StripeConnectForm } from '@/components/settings/stripe-connect-form';
import { getConnectAccount } from '@/lib/stripe/connect';
import { InvoiceBrandingForm } from '@/components/settings/invoice-branding-form';
import { CategoryManagementForm } from '@/components/settings/category-management-form';
import { FileImage } from 'lucide-react';

export const metadata = {
  title: 'Settings | Cash Flow Forecaster',
  description: 'Configure your Cash Flow Forecaster preferences',
};

export default async function SettingsPage() {
  const user = await requireAuth();
  const supabase = await createClient();

  // Fetch current user settings, accounts, bills, and categories in parallel
  const [settingsResult, accountsResult, billsResult, categoriesResult] = await Promise.all([
    supabase
      .from('user_settings')
      .select(
        'currency, safety_buffer, timezone, email_digest_enabled, email_digest_day, low_balance_alert_enabled, tax_rate, tax_tracking_enabled, tax_year, estimated_tax_q1_paid, estimated_tax_q2_paid, estimated_tax_q3_paid, estimated_tax_q4_paid, emergency_fund_enabled, emergency_fund_goal_months, emergency_fund_account_id, business_name, logo_url'
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

  const settingsData = settingsResult.data as any;
  const accounts = (accountsResult.data || []) as any[];
  const bills = (billsResult.data || []) as any[];
  const categories = (categoriesResult.data || []) as any[];

  const currency = settingsData?.currency ?? 'USD';
  const safetyBuffer = settingsData?.safety_buffer ?? 500;
  const timezone = settingsData?.timezone ?? null;
  const digestEnabled = settingsData?.email_digest_enabled ?? true;
  const digestDay = settingsData?.email_digest_day ?? 1;
  const lowBalanceAlertEnabled = settingsData?.low_balance_alert_enabled ?? true;
  const taxRate = settingsData?.tax_rate ?? 25.0;
  const taxTrackingEnabled = settingsData?.tax_tracking_enabled ?? true;
  const taxYear = settingsData?.tax_year ?? new Date().getFullYear();
  const estimatedTaxQ1Paid = settingsData?.estimated_tax_q1_paid ?? 0;
  const estimatedTaxQ2Paid = settingsData?.estimated_tax_q2_paid ?? 0;
  const estimatedTaxQ3Paid = settingsData?.estimated_tax_q3_paid ?? 0;
  const estimatedTaxQ4Paid = settingsData?.estimated_tax_q4_paid ?? 0;

  // Emergency fund settings
  const emergencyFundEnabled = settingsData?.emergency_fund_enabled ?? false;
  const emergencyFundGoalMonths = settingsData?.emergency_fund_goal_months ?? 3;
  const emergencyFundAccountId = settingsData?.emergency_fund_account_id ?? null;

  // Invoice branding settings
  const businessName = settingsData?.business_name ?? null;
  const logoUrl = settingsData?.logo_url ?? null;

  // Calculate monthly expenses from bills
  const monthlyExpenses = bills.reduce((total: number, bill: any) => {
    switch (bill.frequency) {
      case 'weekly': return total + (bill.amount * 52) / 12;
      case 'biweekly': return total + (bill.amount * 26) / 12;
      case 'semi-monthly': return total + bill.amount * 2;
      case 'monthly': return total + bill.amount;
      case 'quarterly': return total + bill.amount / 3;
      case 'annually': return total + bill.amount / 12;
      default: return total;
    }
  }, 0);

  // Fetch subscription status and connect account in parallel
  const [subscription, connectAccount] = await Promise.all([
    getUserSubscription(user.id),
    getConnectAccount(user.id),
  ]);

  // Format the created_at date
  const accountCreatedDate = user.created_at
    ? formatDate(new Date(user.created_at))
    : 'N/A';

  return (
    <div className="max-w-4xl mx-auto pb-12">
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
        <p className="text-zinc-400 mt-1">
          Manage your account, preferences, and subscription
        </p>
      </div>

      <div className="space-y-8">
        {/* ===== SUBSCRIPTION SECTION ===== */}
        <section id="subscription" className="scroll-mt-20">
          <SectionHeader icon={CreditCard} title="Subscription" />
          <SubscriptionStatus
            tier={subscription.tier}
            status={subscription.status}
            currentPeriodEnd={subscription.currentPeriodEnd}
            cancelAtPeriodEnd={subscription.cancelAtPeriodEnd}
          />
        </section>

        {/* ===== ACCOUNT SECTION ===== */}
        <section id="account" className="scroll-mt-20">
          <SectionHeader icon={User} title="Account" />
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 divide-y divide-zinc-800">
            {/* Email */}
            <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-300">Email Address</p>
                  <p className="text-zinc-100">{user.email || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Account Created */}
            <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-300">Member Since</p>
                  <p className="text-zinc-100">{accountCreatedDate}</p>
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-300">Password</p>
                  <p className="text-sm text-zinc-500">••••••••••••</p>
                </div>
              </div>
              <ChangePasswordButton />
            </div>
          </div>
        </section>

        {/* ===== PREFERENCES SECTION ===== */}
        <section id="preferences" className="scroll-mt-20">
          <SectionHeader icon={Sliders} title="Preferences" />
          <div className="space-y-4">
            {/* Currency */}
            <div id="currency" className="scroll-mt-20">
              <CurrencyForm initialValue={currency} />
            </div>

            {/* Timezone */}
            <div id="timezone" className="scroll-mt-20">
              <TimezoneForm initialValue={timezone} />
            </div>

            {/* Safety Buffer */}
            <div id="safety-buffer" className="scroll-mt-20">
              <SafetyBufferForm initialValue={safetyBuffer} />
            </div>
          </div>
        </section>

        {/* ===== CATEGORIES SECTION ===== */}
        <section id="categories" className="scroll-mt-20">
          <SectionHeader icon={Tag} title="Bill Categories" />
          <CategoryManagementForm initialCategories={categories} />
        </section>

        {/* ===== NOTIFICATIONS SECTION ===== */}
        <section id="notifications" className="scroll-mt-20">
          <SectionHeader icon={Bell} title="Notifications" />
          <div className="space-y-4">
            <EmailDigestForm initialEnabled={digestEnabled} initialDay={digestDay} />
            <LowBalanceAlertForm initialEnabled={lowBalanceAlertEnabled} safetyBuffer={safetyBuffer} currency={currency} />
          </div>
        </section>

        {/* ===== STRIPE PAYMENTS SECTION (Pro Only) ===== */}
        {subscription.tier !== 'free' && (
          <section id="payments" className="scroll-mt-20">
            <SectionHeader icon={Banknote} title="Invoice Payments" />
            <StripeConnectForm
              initialStatus={
                connectAccount
                  ? (connectAccount.accountStatus as 'pending' | 'active' | 'restricted')
                  : 'not_connected'
              }
              chargesEnabled={connectAccount?.chargesEnabled}
              payoutsEnabled={connectAccount?.payoutsEnabled}
            />
          </section>
        )}

        {/* ===== INVOICE BRANDING SECTION ===== */}
        <section id="invoice-branding" className="scroll-mt-20">
          <SectionHeader icon={FileImage} title="Invoice Branding" />
          <InvoiceBrandingForm
            initialBusinessName={businessName}
            initialLogoUrl={logoUrl}
            userEmail={user.email || 'your@email.com'}
          />
        </section>

        {/* ===== TAX TRACKING SECTION ===== */}
        <section id="tax-settings" className="scroll-mt-20">
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
            <TaxSettingsForm
              initialSettings={{
                tax_rate: taxRate,
                tax_tracking_enabled: taxTrackingEnabled,
                tax_year: taxYear,
                estimated_tax_q1_paid: estimatedTaxQ1Paid,
                estimated_tax_q2_paid: estimatedTaxQ2Paid,
                estimated_tax_q3_paid: estimatedTaxQ3Paid,
                estimated_tax_q4_paid: estimatedTaxQ4Paid,
              }}
            />
          </div>
        </section>

        {/* ===== EMERGENCY FUND SECTION ===== */}
        <section id="emergency-fund" className="scroll-mt-20">
          <EmergencyFundForm
            initialEnabled={emergencyFundEnabled}
            initialGoalMonths={emergencyFundGoalMonths}
            initialAccountId={emergencyFundAccountId}
            accounts={accounts}
            monthlyExpenses={monthlyExpenses}
          />
        </section>

        {/* ===== DANGER ZONE ===== */}
        <section id="danger-zone" className="scroll-mt-20">
          <SectionHeader icon={Shield} title="Danger Zone" variant="danger" />
          <DeleteAccountSection />
        </section>
      </div>
    </div>
  );
}

// Section Header Component
function SectionHeader({
  icon: Icon,
  title,
  variant = 'default',
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  variant?: 'default' | 'danger';
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon
        className={`w-5 h-5 ${
          variant === 'danger' ? 'text-rose-400' : 'text-teal-400'
        }`}
      />
      <h2
        className={`text-lg font-semibold ${
          variant === 'danger' ? 'text-rose-400' : 'text-zinc-100'
        }`}
      >
        {title}
      </h2>
    </div>
  );
}
