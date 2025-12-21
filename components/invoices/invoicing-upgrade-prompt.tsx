'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Bell, FileText, Mail, TrendingUp } from 'lucide-react';

import { createCheckoutSession } from '@/lib/actions/stripe';

const FEATURES = [
  { icon: FileText, text: 'Generate PDF invoices' },
  { icon: Mail, text: 'Email invoices directly to clients' },
  { icon: Bell, text: 'Payment reminder system (friendly → firm → final)' },
  { icon: TrendingUp, text: 'Auto-sync pending income with forecasts' },
] as const;

export function InvoicingUpgradePrompt() {
  const [isLoading, setIsLoading] = useState(false);
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await createCheckoutSession('pro', billingInterval);
      if ('url' in result) {
        window.location.href = result.url;
        return;
      }
      setError(result.error);
    } catch (e) {
      console.error('Checkout error:', e);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-10">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileText className="w-8 h-8 text-teal-600 dark:text-teal-400" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100 mb-2">
          Unlock Runway Collect
        </h1>
        <p className="text-slate-600 dark:text-zinc-400 mb-8">
          Create professional invoices, send them via email, and track payments — all synced with
          your cash flow forecast.
        </p>

        <div className="bg-white dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-lg p-6 mb-6 text-left">
          <ul className="space-y-4">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <li key={i} className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-zinc-300">{feature.text}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => setBillingInterval('month')}
            className={[
              'px-3 py-1 rounded text-sm font-medium transition-colors',
              billingInterval === 'month'
                ? 'bg-teal-600 text-white'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200',
            ].join(' ')}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingInterval('year')}
            className={[
              'px-3 py-1 rounded text-sm font-medium transition-colors',
              billingInterval === 'year'
                ? 'bg-teal-600 text-white'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200',
            ].join(' ')}
          >
            Yearly <span className="ml-1 text-xs text-teal-700 dark:text-teal-400">Save 17%</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleUpgrade}
          disabled={isLoading}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading
            ? 'Redirecting...'
            : billingInterval === 'month'
              ? 'Upgrade to Pro — $7.99/month'
              : 'Upgrade to Pro — $79/year'}
        </button>

        <div className="mt-3">
          <Link
            href="/pricing"
            className="text-sm text-slate-600 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200 underline underline-offset-4"
          >
            Learn more about Pro features
          </Link>
        </div>

        {error && <p className="text-sm text-rose-600 mt-4">{error}</p>}

        <p className="text-slate-500 dark:text-zinc-500 text-sm mt-4">
          Cancel anytime. No questions asked.
        </p>
      </div>
    </div>
  );
}


