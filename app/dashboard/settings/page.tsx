// app/dashboard/settings/page.tsx
// ============================================
// Settings Page - Updated with Subscription Management
// ============================================

import { requireAuth } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { ChevronRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SafetyBufferForm } from '@/components/settings/safety-buffer-form';
import { TimezoneForm } from '@/components/settings/timezone-form';
import { EmailDigestForm } from '@/components/settings/email-digest-form';
import { SubscriptionStatus } from '@/components/subscription/subscription-status';
import { getUserSubscription } from '@/lib/stripe/subscription';

export const metadata = {
  title: 'Settings | Cash Flow Forecaster',
  description: 'Configure your Cash Flow Forecaster preferences',
};

export default async function SettingsPage() {
  const user = await requireAuth();
  const supabase = await createClient();

  // Fetch current user settings
  const { data: settings } = await supabase
    .from('user_settings')
    .select('safety_buffer, timezone, email_digest_enabled, email_digest_day, email_digest_time')
    .eq('user_id', user.id)
    .single();

  const safetyBuffer = settings?.safety_buffer ?? 500;
  const timezone = settings?.timezone ?? null;
  const digestEnabled = settings?.email_digest_enabled ?? true;
  const digestDay = settings?.email_digest_day ?? 1;
  const digestTime = settings?.email_digest_time ?? '08:00:00';

  // Fetch subscription status
  const subscription = await getUserSubscription(user.id);

  // Format the created_at date
  const accountCreatedDate = user.created_at
    ? formatDate(new Date(user.created_at))
    : 'N/A';

  return (
    <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link
            href="/dashboard"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            ← Back to Dashboard
          </Link>
          <span className="text-sm text-gray-400 dark:text-gray-500 mx-2">/</span>
          <span className="text-sm text-gray-900 dark:text-white font-medium">
            Settings
          </span>
        </nav>

        <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
          Settings
        </h1>

        {/* Settings sections */}
        <div className="space-y-6">
          {/* Subscription Card - NEW */}
          <SubscriptionStatus
            tier={subscription.tier}
            status={subscription.status}
            currentPeriodEnd={subscription.currentPeriodEnd}
            cancelAtPeriodEnd={subscription.cancelAtPeriodEnd}
          />

          {/* Mobile-only quick access */}
          <div className="md:hidden">
            <h3 className="text-sm font-medium text-zinc-400 mb-3">Quick Access</h3>
            <Link
              href="/dashboard/invoices"
              className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-lg"
            >
              <FileText className="w-5 h-5 text-teal-500" />
              <div className="min-w-0">
                <p className="text-zinc-100 font-medium">Invoices</p>
                <p className="text-xs text-zinc-400">Runway Collect</p>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-500 ml-auto" />
            </Link>
          </div>

          {/* Desktop/tablet quick link (redundant on mobile) */}
          <div className="hidden md:block bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">Invoices</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              View and manage your invoices.
            </p>
            <Link href="/dashboard/invoices">
              <Button variant="outline">Open Invoices</Button>
            </Link>
          </div>

          {/* Account Information Card */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
              Account Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {user.email || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Account Created
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {accountCreatedDate}
                </p>
              </div>
            </div>
          </div>

          {/* Password Card */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
              Password
            </h2>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Update your password to keep your account secure.
              </p>
              <Link href="/auth/reset-password">
                <Button variant="outline">Change Password</Button>
              </Link>
            </div>
          </div>

          {/* Timezone Card */}
          <TimezoneForm initialValue={timezone} />

          {/* Email Preferences */}
          <EmailDigestForm initialEnabled={digestEnabled} initialDay={digestDay} initialTime={digestTime} />

          {/* Safety Buffer Card */}
          <SafetyBufferForm initialValue={safetyBuffer} />

          {/* Preferences Card */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
              Preferences
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Currency
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  Coming soon
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notifications
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  Coming soon
                </p>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
