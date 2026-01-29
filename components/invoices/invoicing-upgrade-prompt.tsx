'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Bell, CreditCard, FileText, Lock, ClipboardCheck } from 'lucide-react';

import { createCheckoutSession } from '@/lib/actions/stripe';

const FEATURES = [
  {
    icon: ClipboardCheck,
    title: 'Professional Quotes',
    description: 'Send proposals, convert to invoices',
  },
  {
    icon: FileText,
    title: 'PDF Invoices',
    description: 'Professional, branded documents',
  },
  {
    icon: CreditCard,
    title: 'Get Paid Online',
    description: 'Stripe payment links included',
  },
  {
    icon: Bell,
    title: 'Auto Reminders',
    description: 'Friendly → Firm → Final sequence',
  },
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

  const price = billingInterval === 'month' ? '$7.99/month' : '$79/year';

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-800">
      {/* Subtle radial glow behind content */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto text-center space-y-8">
        {/* Icon with glow */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-500/10 rounded-full ring-1 ring-teal-500/20">
          <FileText className="w-10 h-10 text-teal-500" />
        </div>

        {/* Headline & Subhead */}
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Get Paid Faster with Runway Collect
          </h1>
          <p className="text-lg text-zinc-400 max-w-lg mx-auto">
            Stop chasing payments. Send quotes, convert to invoices, and get paid directly — all
            synced with your forecast.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 text-center"
              >
                <Icon className="w-8 h-8 text-teal-500 mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                <p className="text-sm text-zinc-400">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Social Proof */}
        <p className="text-sm text-zinc-500">
          Join 100+ freelancers getting paid faster
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setBillingInterval('month')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              billingInterval === 'month'
                ? 'bg-teal-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-300'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingInterval('year')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              billingInterval === 'year'
                ? 'bg-teal-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-300'
            }`}
          >
            Yearly
            <span className="text-teal-400 text-xs ml-1">Save 17%</span>
          </button>
        </div>

        {/* CTA Button */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={handleUpgrade}
            disabled={isLoading}
            className="w-full max-w-md py-4 text-lg font-semibold bg-teal-500 hover:bg-teal-400 text-zinc-900 rounded-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
          >
            {isLoading ? 'Redirecting to checkout...' : `Upgrade to Pro — ${price}`}
          </button>

          {error && (
            <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-4 py-2 max-w-md mx-auto">
              {error}
            </p>
          )}
        </div>

        {/* Trust Elements */}
        <div className="space-y-3">
          <Link
            href="/pricing"
            className="text-teal-400 hover:text-teal-300 underline text-sm transition-colors"
          >
            Learn more about Pro features
          </Link>
          <p className="text-sm text-zinc-500 flex items-center justify-center gap-2">
            <Lock className="w-4 h-4" />
            Cancel anytime. Secure checkout powered by Stripe.
          </p>
        </div>
      </div>
    </div>
  );
}
