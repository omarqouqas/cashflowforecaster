import { requireAuth } from '@/lib/auth/session';
import { UserMenu } from '@/components/dashboard/user-menu';
import { SuccessMessage } from '@/components/ui/success-message';
import { EmailVerificationBanner } from '@/components/auth/email-verification-banner';

interface DashboardPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const user = await requireAuth(); // Redirects to /auth/login if not authenticated
  const message = searchParams.message;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Email verification banner (conditionally shown) */}
      <EmailVerificationBanner user={user} />

      {/* Header/Nav */}
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border border-slate-200 dark:border-slate-700">
          {/* Success Message */}
          {message === 'password-updated' && (
            <div className="mb-6">
              <SuccessMessage message="Password updated successfully" />
            </div>
          )}

          <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
            Welcome to Cash Flow Forecaster!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your 60-day cash flow calendar will appear here soon.
          </p>

          {/* Placeholder sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 text-center bg-slate-50 dark:bg-slate-900/50">
              <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">Accounts</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Coming soon</p>
            </div>
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 text-center bg-slate-50 dark:bg-slate-900/50">
              <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">Income</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Coming soon</p>
            </div>
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 text-center bg-slate-50 dark:bg-slate-900/50">
              <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">Bills</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Coming soon</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

