import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import type { Database } from '@/types/supabase';

/**
 * Diagnostic page to test database connectivity and Row Level Security (RLS).
 * ⚠️ DELETE THIS PAGE BEFORE PRODUCTION
 */

type TableResult = {
  name: string;
  status: '✅ Ready' | '⚠️ RLS blocking' | '❌ Error';
  count: number | null;
  notes: string;
  errorMessage?: string;
};

export default async function TestDatabasePage() {
  // Check authentication
  const user = await getCurrentUser();

  // Create Supabase client
  const supabase = await createClient();

  // Define all tables to test
  const tables: Array<keyof Database['public']['Tables']> = [
    'accounts',
    'income',
    'bills',
    'user_settings',
    'scenarios',
    'parsed_emails',
    'weekly_checkins',
    'notifications',
    'users',
  ];

  // Test each table
  const tableResults: TableResult[] = await Promise.all(
    tables.map(async (tableName) => {
      try {
        // TypeScript knows the structure of each table
        const { data, error, count } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });

        if (error) {
          // Check if it's an RLS/permission error
          if (
            error.message.includes('permission denied') ||
            error.message.includes('new row violates row-level security') ||
            error.message.includes('RLS') ||
            error.code === '42501' ||
            error.code === 'PGRST301'
          ) {
            return {
              name: tableName,
              status: '⚠️ RLS blocking',
              count: null,
              notes: user
                ? 'RLS policy is blocking access (check policies)'
                : 'RLS is working correctly - not authenticated (this is GOOD!)',
              errorMessage: error.message,
            };
          }

          // Check if table doesn't exist
          if (
            error.message.includes('relation') ||
            error.message.includes('does not exist') ||
            error.code === '42P01'
          ) {
            return {
              name: tableName,
              status: '❌ Error',
              count: null,
              notes: 'Table does not exist in database',
              errorMessage: error.message,
            };
          }

          // Other errors
          return {
            name: tableName,
            status: '❌ Error',
            count: null,
            notes: 'Unexpected error occurred',
            errorMessage: error.message,
          };
        }

        // Success - table exists and is queryable
        return {
          name: tableName,
          status: '✅ Ready',
          count: count ?? 0,
          notes: user
            ? `Table exists and is accessible. Found ${count ?? 0} records.`
            : `Table exists. Found ${count ?? 0} records (may be filtered by RLS).`,
        };
      } catch (error) {
        return {
          name: tableName,
          status: '❌ Error',
          count: null,
          notes: 'Exception occurred during query',
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    })
  );

  // Calculate summary statistics
  const readyCount = tableResults.filter((r) => r.status === '✅ Ready').length;
  const rlsBlockingCount = tableResults.filter((r) => r.status === '⚠️ RLS blocking').length;
  const errorCount = tableResults.filter((r) => r.status === '❌ Error').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Warning Banner */}
        <div className="mb-8 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-700 rounded-lg p-4">
          <div className="flex items-start">
            <svg
              className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mr-3 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                ⚠️ DELETE THIS PAGE BEFORE PRODUCTION
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                This is a diagnostic page for development purposes only. Remove it before deploying
                to production.
              </p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">
              Cash Flow Forecaster - Database Connectivity & RLS Test
            </h1>
            <p className="text-blue-100 text-sm mt-1">
              Diagnostic page to verify database connectivity and Row Level Security policies
            </p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Auth Status */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Authentication Status
              </h2>
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">✅</span>
                  <div>
                    <p className="text-slate-900 dark:text-white font-medium">
                      Authenticated as: {user.email}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      User ID: {user.id}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <p className="text-slate-900 dark:text-white font-medium">
                      Not authenticated - RLS will block queries (this is correct!)
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      If you see &quot;⚠️ RLS blocking&quot; for tables, that means RLS is working
                      as expected.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {readyCount}
                </div>
                <div className="text-sm text-green-800 dark:text-green-300">✅ Ready</div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {rlsBlockingCount}
                </div>
                <div className="text-sm text-yellow-800 dark:text-yellow-300">⚠️ RLS Blocking</div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{errorCount}</div>
                <div className="text-sm text-red-800 dark:text-red-300">❌ Errors</div>
              </div>
            </div>

            {/* Table Status */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Table Status ({tables.length} tables)
              </h2>
              {tableResults.map((table) => (
                <div
                  key={table.name}
                  className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {table.name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        table.status === '✅ Ready'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : table.status === '⚠️ RLS blocking'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}
                    >
                      {table.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="text-slate-700 dark:text-slate-300">
                      <span className="font-medium">Count:</span>{' '}
                      {table.count !== null ? (
                        <span className="font-mono">{table.count}</span>
                      ) : (
                        <span className="text-slate-500 dark:text-slate-500">N/A</span>
                      )}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                      <span className="font-medium">Notes:</span> {table.notes}
                    </p>
                    {table.errorMessage && (
                      <div className="mt-2 pt-2 border-t border-slate-300 dark:border-slate-600">
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                          Error Details:
                        </p>
                        <code className="text-xs bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 px-2 py-1 rounded block break-words">
                          {table.errorMessage}
                        </code>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* TypeScript Type Safety Demo */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                TypeScript Type Safety
              </h2>
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  All queries are fully typed using the generated Supabase types. TypeScript knows
                  the structure of each table:
                </p>
                <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-4 overflow-x-auto">
                  <code className="text-xs text-green-400 font-mono">
                    <div className="text-slate-400">// Example query with full type safety:</div>
                    <div className="mt-2">
                      <span className="text-blue-400">const</span>{' '}
                      <span className="text-yellow-400">{'{ data, error, count }'}</span>{' '}
                      <span className="text-blue-400">= await</span>{' '}
                      <span className="text-yellow-400">supabase</span>
                    </div>
                    <div className="ml-4">
                      <span className="text-blue-400">.from</span>(
                      <span className="text-green-300">'accounts'</span>)
                    </div>
                    <div className="ml-4">
                      <span className="text-blue-400">.select</span>(
                      <span className="text-green-300">'*'</span>,{' '}
                      <span className="text-yellow-400">{'{ count: '}</span>
                      <span className="text-green-300">'exact'</span>
                      <span className="text-yellow-400">{', head: true }'}</span>)
                    </div>
                    <div className="mt-2 text-slate-400">
                      // TypeScript knows the structure of 'accounts' table
                    </div>
                    <div className="mt-2 text-slate-400">
                      // data: Database['public']['Tables']['accounts']['Row'][] | null
                    </div>
                  </code>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Test Details
              </h2>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    This page tests database connectivity and Row Level Security (RLS) policies
                    for all {tables.length} tables
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Each table is queried with a count operation using{' '}
                    <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">
                      select('*', {'{'} count: 'exact', head: true {'}'})
                    </code>
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    <strong>✅ Ready:</strong> Table exists and is queryable (RLS allows access)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    <strong>⚠️ RLS blocking:</strong> RLS policy is preventing access (expected if
                    not authenticated)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    <strong>❌ Error:</strong> Table doesn&apos;t exist or other database error
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    All queries use TypeScript types from{' '}
                    <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">
                      @/types/supabase
                    </code>{' '}
                    for full type safety
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>
            Database Connectivity Test • Generated at:{' '}
            {new Date().toLocaleString('en-US', {
              dateStyle: 'medium',
              timeStyle: 'medium',
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

