'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { trackSignup } from '@/lib/posthog/events';

export default function OAuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track Google signup/login event
    trackSignup('google');

    // If OAuth succeeded, the user has an account; mark as "hasSignedUp".
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('hasSignedUp', 'true');
      } catch {
        // Ignore storage failures (privacy mode, blocked storage, etc.)
      }
    }

    // Trigger welcome email (fire-and-forget, will skip if already sent)
    fetch('/api/email/welcome', { method: 'POST' }).catch(() => {
      // Ignore errors - welcome email is best-effort
    });

    const next = searchParams.get('next') || '/dashboard';
    router.replace(next);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-6">
      <div className="text-center space-y-2">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Signing you in…</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">Please wait a moment.</p>
      </div>
    </div>
  );
}


