'use client';

import { useState, useEffect } from 'react';
import { Gift, Copy, Check, Users, CreditCard, Award } from 'lucide-react';
import type { ReferralStats } from '@/lib/referrals';

interface ReferralWidgetProps {
  stats: ReferralStats | null;
  isLoading?: boolean;
}

export function ReferralWidget({ stats, isLoading = false }: ReferralWidgetProps) {
  const [copied, setCopied] = useState(false);
  const [referralUrl, setReferralUrl] = useState(stats?.code ? `/r/${stats.code}` : '');

  // Update to full URL after hydration to avoid mismatch
  useEffect(() => {
    if (stats?.code) {
      setReferralUrl(`${window.location.origin}/r/${stats.code}`);
    }
  }, [stats?.code]);

  const handleCopy = async () => {
    if (!referralUrl) return;
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = referralUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 animate-pulse">
        <div className="h-6 bg-zinc-800 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-zinc-800 rounded w-2/3 mb-6"></div>
        <div className="h-10 bg-zinc-800 rounded mb-4"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-16 bg-zinc-800 rounded"></div>
          <div className="h-16 bg-zinc-800 rounded"></div>
          <div className="h-16 bg-zinc-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-zinc-100">Refer &amp; Earn</h3>
          <p className="mt-1 text-sm text-zinc-400">
            Give friends 30 days free, get 1 month Pro when they subscribe
          </p>
        </div>
        <Gift className="h-5 w-5 text-teal-400" />
      </div>

      {/* Referral Link */}
      {stats?.code && (
        <div className="mt-4">
          <label className="block text-xs font-medium text-zinc-400 mb-2">
            Your referral link
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-2 bg-zinc-800 rounded-lg text-sm text-zinc-300 font-mono truncate">
              {referralUrl}
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 transition-colors"
              title="Copy link"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-full bg-zinc-800 mb-2">
            <Users className="h-5 w-5 text-zinc-400" />
          </div>
          <p className="text-2xl font-semibold text-zinc-100">{stats?.signedUp ?? 0}</p>
          <p className="text-xs text-zinc-400">Signed up</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-full bg-zinc-800 mb-2">
            <CreditCard className="h-5 w-5 text-zinc-400" />
          </div>
          <p className="text-2xl font-semibold text-zinc-100">{stats?.converted ?? 0}</p>
          <p className="text-xs text-zinc-400">Subscribed</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-full bg-teal-500/20 mb-2">
            <Award className="h-5 w-5 text-teal-400" />
          </div>
          <p className="text-2xl font-semibold text-teal-400">{stats?.rewarded ?? 0}</p>
          <p className="text-xs text-zinc-400">Rewards</p>
        </div>
      </div>

      {/* Pending Rewards Banner */}
      {(stats?.pendingRewards ?? 0) > 0 && (
        <div className="mt-4 p-3 rounded-lg bg-teal-500/10 border border-teal-500/20">
          <p className="text-sm text-teal-400">
            <span className="font-medium">{stats?.pendingRewards}</span> reward{(stats?.pendingRewards ?? 0) > 1 ? 's' : ''} pending!
            Your friends subscribed and you'll receive your Pro credit soon.
          </p>
        </div>
      )}

      {/* How it works */}
      <details className="mt-4 group">
        <summary className="cursor-pointer text-sm font-medium text-teal-400 hover:text-teal-300 list-none flex items-center gap-1">
          How it works
          <span className="text-xs transition-transform group-open:rotate-180">▼</span>
        </summary>
        <div className="mt-3 space-y-3 text-sm text-zinc-400">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-medium text-zinc-300">
              1
            </span>
            <p>Share your referral link with friends</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-medium text-zinc-300">
              2
            </span>
            <p>They sign up and get 30 days of Pro free</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center text-xs font-medium text-teal-400">
              3
            </span>
            <p>When they subscribe to Pro, you get 1 month free</p>
          </div>
        </div>
      </details>
    </div>
  );
}
