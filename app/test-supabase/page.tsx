import { createClient } from '@/lib/supabase/server';

/**
 * Diagnostic page to test Supabase connection.
 * ⚠️ DELETE THIS PAGE BEFORE PRODUCTION
 */
export default async function TestSupabasePage() {
  let connectionStatus = 'Unknown';
  let errorMessage: string | null = null;
  let queryResult: any = null;
  let projectUrl: string | null = null;
  let envCheck: {
    hasUrl: boolean;
    hasKey: boolean;
    urlMasked: string | null;
  } = {
    hasUrl: false,
    hasKey: false,
    urlMasked: null,
  };

  // Check environment variables first
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  envCheck.hasUrl = !!supabaseUrl && supabaseUrl.trim() !== '';
  envCheck.hasKey = !!supabaseAnonKey && supabaseAnonKey.trim() !== '';

  // Mask the URL for security (show only first and last parts)
  if (supabaseUrl) {
    try {
      const urlObj = new URL(supabaseUrl);
      const hostname = urlObj.hostname;
      if (hostname.length > 20) {
        envCheck.urlMasked = `${hostname.substring(0, 10)}...${hostname.substring(hostname.length - 6)}`;
      } else {
        envCheck.urlMasked = hostname;
      }
      projectUrl = supabaseUrl;
    } catch {
      envCheck.urlMasked = supabaseUrl.substring(0, 20) + '...';
    }
  }

  // Test connection
  try {
    const supabase = await createClient();

    // Test 1: Check if client was created
    connectionStatus = 'Client created ✅';

    // Test 2: Try a simple query (will fail if no tables exist, but proves connection works)
    const { data, error } = await supabase.from('users').select('count').limit(1);

    if (error) {
      // Expected error if table doesn't exist yet
      if (
        error.message.includes('relation') ||
        error.message.includes('does not exist') ||
        error.message.includes('permission denied')
      ) {
        connectionStatus = 'Connected ✅ (tables not created yet)';
        errorMessage = `Expected error: ${error.message}`;
      } else {
        throw error;
      }
    } else {
      connectionStatus = 'Connected ✅ and can query database';
      queryResult = data;
    }
  } catch (error) {
    connectionStatus = 'Failed ❌';
    errorMessage = error instanceof Error ? error.message : 'Unknown error';
  }

  const isSuccess = connectionStatus.includes('✅');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
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
            <h1 className="text-2xl font-bold text-white">Cash Flow Forecaster - Supabase Connection Test</h1>
            <p className="text-blue-100 text-sm mt-1">Diagnostic page to verify Supabase setup</p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Connection Status */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Connection Status
              </h2>
              <div
                className={`inline-flex items-center px-4 py-2 rounded-lg font-medium ${
                  isSuccess
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}
              >
                {connectionStatus}
              </div>
            </div>

            {/* Environment Variables Check */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Environment Variables
              </h2>
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    NEXT_PUBLIC_SUPABASE_URL:
                  </span>
                  <span
                    className={`font-semibold ${
                      envCheck.hasUrl
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {envCheck.hasUrl ? '✅ Set' : '❌ Missing'}
                  </span>
                </div>
                {envCheck.urlMasked && (
                  <div className="mt-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Masked URL: </span>
                    <code className="text-xs bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded text-slate-800 dark:text-slate-200">
                      {envCheck.urlMasked}
                    </code>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    NEXT_PUBLIC_SUPABASE_ANON_KEY:
                  </span>
                  <span
                    className={`font-semibold ${
                      envCheck.hasKey
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {envCheck.hasKey ? '✅ Set' : '❌ Missing'}
                  </span>
                </div>
              </div>
            </div>

            {/* Project URL */}
            {projectUrl && (
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Project URL
                </h2>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
                  <code className="text-sm font-mono text-slate-800 dark:text-slate-200 break-all">
                    {projectUrl}
                  </code>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Error Details
                </h2>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <code className="text-sm font-mono text-red-800 dark:text-red-300 whitespace-pre-wrap break-words">
                    {errorMessage}
                  </code>
                </div>
              </div>
            )}

            {/* Query Result */}
            {queryResult && (
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Query Result
                </h2>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <code className="text-sm font-mono text-green-800 dark:text-green-300 whitespace-pre-wrap">
                    {JSON.stringify(queryResult, null, 2)}
                  </code>
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Test Details
              </h2>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    This page tests the Supabase server client connection using{' '}
                    <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">
                      createClient()
                    </code>{' '}
                    from{' '}
                    <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">
                      @/lib/supabase/server
                    </code>
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    It attempts to query a{' '}
                    <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">users</code> table
                    (which may not exist yet)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    If you see &quot;relation does not exist&quot; error, that&apos;s expected and
                    confirms the connection is working correctly
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    The connection is successful if you see ✅ in the status, even if the query
                    fails due to missing tables
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>
            Server Component Test Page • Generated at:{' '}
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

