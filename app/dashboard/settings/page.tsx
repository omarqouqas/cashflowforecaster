import { requireAuth } from '@/lib/auth/session';
import { UserMenu } from '@/components/dashboard/user-menu';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function SettingsPage() {
  const user = await requireAuth();

  // Format the created_at date
  const accountCreatedDate = user.created_at
    ? formatDate(new Date(user.created_at))
    : 'N/A';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Header/Nav - same as dashboard */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Cash Flow Forecaster
            </h1>
            <UserMenu user={user} />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
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
                  Timezone
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
      </main>
    </div>
  );
}

