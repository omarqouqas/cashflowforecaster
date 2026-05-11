'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { SettingsTabs, type SettingsTab } from './settings-tabs';

// Profile tab components
import { ChangePasswordButton } from './change-password-button';

// Preferences tab components
import { CurrencyForm } from './currency-form';
import { TimezoneForm } from './timezone-form';
import { SafetyBufferForm } from './safety-buffer-form';
import { CategoryManagementForm } from './category-management-form';
import { ThemeForm } from './theme-form';

// Notifications tab components
import { EmailDigestForm } from './email-digest-form';
import { LowBalanceAlertForm } from './low-balance-alert-form';
import { NotificationChannelsForm } from './notification-channels-form';
import { AutoRemindersForm } from './auto-reminders-form';

// Invoicing tab components
import { StripeConnectForm } from './stripe-connect-form';
import { InvoiceBrandingForm } from './invoice-branding-form';
import { TaxSettingsForm } from './tax-settings-form';
import { EmergencyFundForm } from './emergency-fund-form';

// Billing tab components
import { SubscriptionStatus } from '@/components/subscription/subscription-status';
import { DeleteAccountSection } from './delete-account-section';

import { type UserCategory } from '@/lib/categories/constants';
import {
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
  FileImage,
  Palette,
} from 'lucide-react';

interface SettingsContentProps {
  // User info
  userEmail: string;
  accountCreatedDate: string;

  // Preferences
  currency: string;
  timezone: string | null;
  safetyBuffer: number;
  categories: UserCategory[];

  // Notifications
  digestEnabled: boolean;
  digestDay: number;
  lowBalanceAlertEnabled: boolean;
  autoRemindersEnabled: boolean;
  phoneNumber: string | null;
  phoneVerified: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  pushSubscribed: boolean;

  // Invoicing
  connectAccountStatus: 'not_connected' | 'pending' | 'active' | 'restricted';
  chargesEnabled?: boolean;
  payoutsEnabled?: boolean;
  businessName: string | null;
  logoUrl: string | null;
  taxSettings: {
    tax_rate: number;
    tax_tracking_enabled: boolean;
    tax_year: number;
    estimated_tax_q1_paid: number;
    estimated_tax_q2_paid: number;
    estimated_tax_q3_paid: number;
    estimated_tax_q4_paid: number;
  };
  emergencyFundEnabled: boolean;
  emergencyFundGoalMonths: number;
  emergencyFundAccountId: string | null;
  accounts: Array<{
    id: string;
    name: string;
    account_type: string;
    current_balance: number;
  }>;
  monthlyExpenses: number;

  // Subscription
  tier: 'free' | 'pro' | 'premium' | 'lifetime';
  status: string;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
}

function SettingsContentInner(props: SettingsContentProps) {
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get('tab') as SettingsTab) || 'profile';
  const isPro = props.tier !== 'free';

  return (
    <SettingsTabs defaultTab={activeTab}>
      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <SectionHeader icon={User} title="Account Information" />
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 divide-y divide-zinc-800">
            {/* Email */}
            <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-300">Email Address</p>
                  <p className="text-zinc-100">{props.userEmail}</p>
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
                  <p className="text-zinc-100">{props.accountCreatedDate}</p>
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
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="space-y-6">
          {/* Appearance */}
          <section>
            <SectionHeader icon={Palette} title="Appearance" />
            <ThemeForm />
          </section>

          {/* General Preferences */}
          <section>
            <SectionHeader icon={Sliders} title="General" />
            <div className="space-y-4">
              <CurrencyForm initialValue={props.currency} />
              <TimezoneForm initialValue={props.timezone} />
              <SafetyBufferForm initialValue={props.safetyBuffer} />
            </div>
          </section>

          {/* Categories */}
          <section>
            <SectionHeader icon={Tag} title="Bill Categories" />
            <CategoryManagementForm initialCategories={props.categories} />
          </section>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <SectionHeader icon={Bell} title="Notification Settings" />
          <div className="space-y-4">
            <EmailDigestForm initialEnabled={props.digestEnabled} initialDay={props.digestDay} />
            <LowBalanceAlertForm
              initialEnabled={props.lowBalanceAlertEnabled}
              safetyBuffer={props.safetyBuffer}
              currency={props.currency}
            />
            <NotificationChannelsForm
              initialPhoneNumber={props.phoneNumber}
              initialPhoneVerified={props.phoneVerified}
              initialSmsEnabled={props.smsEnabled}
              initialPushEnabled={props.pushEnabled}
              initialPushSubscribed={props.pushSubscribed}
              isPro={isPro}
            />
            {isPro && <AutoRemindersForm initialEnabled={props.autoRemindersEnabled} />}
          </div>
        </div>
      )}

      {/* Invoicing Tab */}
      {activeTab === 'invoicing' && (
        <div className="space-y-6">
          {/* Stripe Connect - Pro Only */}
          {isPro && (
            <section>
              <SectionHeader icon={Banknote} title="Invoice Payments" />
              <StripeConnectForm
                initialStatus={props.connectAccountStatus}
                chargesEnabled={props.chargesEnabled}
                payoutsEnabled={props.payoutsEnabled}
              />
            </section>
          )}

          {/* Invoice Branding */}
          <section>
            <SectionHeader icon={FileImage} title="Invoice Branding" />
            <InvoiceBrandingForm
              initialBusinessName={props.businessName}
              initialLogoUrl={props.logoUrl}
              userEmail={props.userEmail}
            />
          </section>

          {/* Tax Settings */}
          <section>
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
              <TaxSettingsForm initialSettings={props.taxSettings} />
            </div>
          </section>

          {/* Emergency Fund */}
          <section>
            <EmergencyFundForm
              initialEnabled={props.emergencyFundEnabled}
              initialGoalMonths={props.emergencyFundGoalMonths}
              initialAccountId={props.emergencyFundAccountId}
              accounts={props.accounts}
              monthlyExpenses={props.monthlyExpenses}
            />
          </section>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          {/* Subscription */}
          <section>
            <SectionHeader icon={CreditCard} title="Subscription" />
            <SubscriptionStatus
              tier={props.tier}
              status={props.status}
              currentPeriodEnd={props.currentPeriodEnd}
              cancelAtPeriodEnd={props.cancelAtPeriodEnd}
            />
          </section>

          {/* Danger Zone */}
          <section>
            <SectionHeader icon={Shield} title="Danger Zone" variant="danger" />
            <DeleteAccountSection />
          </section>
        </div>
      )}
    </SettingsTabs>
  );
}

// Wrap in Suspense for useSearchParams
export function SettingsContent(props: SettingsContentProps) {
  return (
    <Suspense fallback={<SettingsLoadingSkeleton />}>
      <SettingsContentInner {...props} />
    </Suspense>
  );
}

function SettingsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-12 bg-zinc-800 rounded-lg animate-pulse" />
      <div className="h-64 bg-zinc-800/50 rounded-xl animate-pulse" />
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
        className={`w-5 h-5 ${variant === 'danger' ? 'text-rose-400' : 'text-teal-400'}`}
      />
      <h2
        className={`text-lg font-semibold ${variant === 'danger' ? 'text-rose-400' : 'text-zinc-100'}`}
      >
        {title}
      </h2>
    </div>
  );
}
