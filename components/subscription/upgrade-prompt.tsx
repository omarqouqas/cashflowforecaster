// components/subscription/upgrade-prompt.tsx
// ============================================
// Upgrade Prompt Modal - Shows when user hits tier limits
// ============================================

'use client';

import { useState } from 'react';
import { X, Sparkles, Check } from 'lucide-react';
import { createCheckoutSession } from '@/lib/actions/stripe';
import { PRICING_TIERS } from '@/lib/stripe/config';

interface UpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
  feature: 'bills' | 'income' | 'invoices' | 'forecast' | 'general';
  currentCount?: number;
  limit?: number;
}

const FEATURE_COPY: Record<UpgradePromptProps['feature'], { title: string; description: string }> = {
  bills: {
    title: "You've reached your bills limit",
    description: "Free accounts can track up to 10 bills. Upgrade to Pro for unlimited bills and more features.",
  },
  income: {
    title: "You've reached your income sources limit",
    description: "Free accounts can track up to 10 income sources. Upgrade to Pro for unlimited tracking.",
  },
  invoices: {
    title: "Invoicing is a Pro feature",
    description: "Create professional invoices, send them to clients, and track payments with Runway Collect.",
  },
  forecast: {
    title: "Extended forecasting is a Pro feature",
    description: "Free accounts get 60-day forecasts. Upgrade to Pro for 90 days, or Premium for a full year.",
  },
  general: {
    title: "Upgrade to unlock more features",
    description: "Get unlimited bills & income, invoicing, extended forecasts, and priority support.",
  },
};

export function UpgradePrompt({ isOpen, onClose, feature, currentCount, limit }: UpgradePromptProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');

  if (!isOpen) return null;

  const copy = FEATURE_COPY[feature];
  const proFeatures = PRICING_TIERS.pro.features.slice(1); // Skip "Everything in Free"

  async function handleUpgrade() {
    setIsLoading(true);
    try {
      const result = await createCheckoutSession('pro', billingInterval);
      if ('url' in result) {
        window.location.href = result.url;
      } else {
        console.error('Checkout error:', result.error);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header gradient */}
        <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-8 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
              Pro Feature
            </span>
          </div>
          
          <h2 className="text-2xl font-bold">{copy.title}</h2>
          
          {currentCount !== undefined && limit !== undefined && (
            <p className="mt-2 text-white/90">
              You&apos;re using <span className="font-semibold">{currentCount}</span> of{' '}
              <span className="font-semibold">{limit}</span> available.
            </p>
          )}
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-zinc-600 mb-6">{copy.description}</p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <button
              onClick={() => setBillingInterval('month')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                billingInterval === 'month'
                  ? 'bg-teal-100 text-teal-700'
                  : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval('year')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                billingInterval === 'year'
                  ? 'bg-teal-100 text-teal-700'
                  : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              Yearly
              <span className="ml-1 text-xs text-emerald-600 font-semibold">Save 17%</span>
            </button>
          </div>

          {/* Price */}
          <div className="text-center mb-6">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-bold text-zinc-900">
                ${billingInterval === 'month' ? '7.99' : '79'}
              </span>
              <span className="text-zinc-500">
                /{billingInterval === 'month' ? 'month' : 'year'}
              </span>
            </div>
            {billingInterval === 'year' && (
              <p className="text-sm text-emerald-600 mt-1">2 months free!</p>
            )}
          </div>

          {/* Features list */}
          <div className="space-y-2 mb-6">
            {proFeatures.slice(0, 5).map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-zinc-700">
                <Check className="w-4 h-4 text-teal-500 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl px-4 py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Redirecting...' : 'Upgrade to Pro'}
          </button>

          <button
            onClick={onClose}
            className="w-full mt-3 text-sm text-zinc-500 hover:text-zinc-700"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Inline upgrade banner (for use in list pages)
 */
export function UpgradeBanner({ 
  feature, 
  currentCount, 
  limit,
  onUpgradeClick 
}: { 
  feature: 'bills' | 'income';
  currentCount: number;
  limit: number;
  onUpgradeClick: () => void;
}) {
  const remaining = limit - currentCount;
  const isAtLimit = remaining <= 0;
  const isNearLimit = remaining <= 2 && remaining > 0;

  if (!isAtLimit && !isNearLimit) return null;

  return (
    <div className={`rounded-lg p-4 mb-6 ${
      isAtLimit 
        ? 'bg-amber-50 border border-amber-200' 
        : 'bg-blue-50 border border-blue-200'
    }`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            isAtLimit ? 'bg-amber-100' : 'bg-blue-100'
          }`}>
            <Sparkles className={`w-5 h-5 ${
              isAtLimit ? 'text-amber-600' : 'text-blue-600'
            }`} />
          </div>
          <div>
            <p className={`font-medium ${
              isAtLimit ? 'text-amber-900' : 'text-blue-900'
            }`}>
              {isAtLimit 
                ? `You've reached your ${feature} limit` 
                : `${remaining} ${feature} remaining`}
            </p>
            <p className={`text-sm ${
              isAtLimit ? 'text-amber-700' : 'text-blue-700'
            }`}>
              {isAtLimit 
                ? 'Upgrade to Pro for unlimited tracking' 
                : 'Upgrade anytime for unlimited tracking'}
            </p>
          </div>
        </div>
        <button
          onClick={onUpgradeClick}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isAtLimit
              ? 'bg-amber-600 hover:bg-amber-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          Upgrade
        </button>
      </div>
    </div>
  );
}

/**
 * Usage indicator (e.g., "3/10 bills")
 */
export function UsageIndicator({ 
  current, 
  limit, 
  label 
}: { 
  current: number; 
  limit: number; 
  label: string;
}) {
  const percentage = limit === Infinity ? 0 : (current / limit) * 100;
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  if (limit === Infinity) {
    return (
      <span className="text-xs text-zinc-500">
        {current} {label}
      </span>
    );
  }

  return (
    <span className={`text-xs font-medium ${
      isAtLimit 
        ? 'text-amber-600' 
        : isNearLimit 
          ? 'text-amber-500' 
          : 'text-zinc-500'
    }`}>
      {current}/{limit} {label}
    </span>
  );
}
