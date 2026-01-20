'use client';

import Link from 'next/link';

export function ChangePasswordButton() {
  return (
    <Link
      href="/auth/reset-password"
      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 rounded-lg transition-colors"
    >
      Change Password
    </Link>
  );
}
