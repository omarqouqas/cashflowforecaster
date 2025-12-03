import { requireAuth } from '@/lib/auth/session';
import { LogoutButton } from '@/components/auth/logout-button';

export default async function DashboardPage() {
  const user = await requireAuth(); // Redirects to /auth/login if not authenticated

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Cash Flow Forecaster
            </h1>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              Welcome to Cash Flow Forecaster
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Logged in as: <span className="font-medium text-slate-900 dark:text-white">{user.email}</span>
            </p>
          </div>

          {/* Placeholder for future features */}
          <div className="mt-12 p-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
            <p className="text-slate-600 dark:text-slate-400">
              Your calendar will appear here
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

