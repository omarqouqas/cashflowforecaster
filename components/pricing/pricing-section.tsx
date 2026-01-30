// components/pricing/pricing-section.tsx
// ============================================
// Pricing Section with Stripe Checkout Integration
// ============================================

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { BillingToggle, type BillingPeriod } from './billing-toggle';
import { PricingCard, type PricingFeature, type PricingCta } from './pricing-card';
import { createCheckoutSession, createLifetimeCheckoutSession } from '@/lib/actions/stripe';
import type { SubscriptionTier } from '@/lib/stripe/config';
import { Sparkles, Check } from 'lucide-react';

interface PricingSectionProps {
  isLoggedIn?: boolean;
  currentTier?: SubscriptionTier;
  showHeader?: boolean;
}

// Tier configuration without CTA (we'll add that dynamically)
interface TierConfig {
  name: string;
  tier: SubscriptionTier;
  priceMonthly: number;
  priceYearly?: number;
  description: string;
  features: PricingFeature[];
  popular?: boolean;
  ctaSubtext?: string;
}

const TIERS: TierConfig[] = [
  {
    name: 'Free',
    tier: 'free',
    priceMonthly: 0,
    description: 'For getting clarity fast',
    features: [
      { text: '90-day cash flow forecast' },
      { text: 'Weekly Email Digest' },
      { text: 'Bill Collision Alerts' },
      { text: 'Low Balance Alerts' },
      { text: 'CSV Import' },
      { text: 'Up to 10 bills & income sources' },
      { text: 'Basic calendar view' },
      { text: 'Email support (48hr)' },
    ],
  },
  {
    name: 'Pro',
    tier: 'pro',
    priceMonthly: 7.99,
    priceYearly: 79,
    description: 'For freelancers who want year-round clarity',
    popular: true,
    features: [
      { text: 'Everything in Free' },
      { text: '365-day forecast (12 months ahead)' },
      { text: 'Runway Collect: Quotes & Invoices' },
      { text: 'Send quotes, convert to invoices when accepted' },
      { text: 'One-click Stripe payments for invoices' },
      { text: 'Generate & download PDF quotes & invoices' },
      { text: 'Custom invoice branding (logo + business name)' },
      { text: 'Unlimited bills & income sources' },
      { text: 'Priority support (24hr)' },
    ],
  },
];

export default function PricingSection({
  isLoggedIn = false,
  currentTier = 'free',
  showHeader = true,
}: PricingSectionProps) {
  const router = useRouter();
  // Treat premium and lifetime as having Pro-level access
  const effectiveTier: SubscriptionTier = currentTier === 'premium' ? 'pro' : currentTier;
  const hasProAccess = effectiveTier === 'pro' || effectiveTier === 'lifetime';
  const [period, setPeriod] = React.useState<BillingPeriod>('monthly');
  const [priceTransitioning, setPriceTransitioning] = React.useState(false);
  const [loadingTier, setLoadingTier] = React.useState<SubscriptionTier | null>(null);
  const [loadingLifetime, setLoadingLifetime] = React.useState(false);

  // Animate price transition
  React.useEffect(() => {
    setPriceTransitioning(true);
    const t = window.setTimeout(() => setPriceTransitioning(false), 160);
    return () => window.clearTimeout(t);
  }, [period]);

  // Handle subscription checkout (excludes lifetime which has its own handler)
  const handleSubscribe = async (tier: Exclude<SubscriptionTier, 'free' | 'lifetime'>) => {
    // If not logged in, redirect to signup with plan info
    if (!isLoggedIn) {
      router.push(`/auth/signup?redirect=/pricing&plan=${tier}`);
      return;
    }

    setLoadingTier(tier);

    try {
      const billingInterval = period === 'yearly' ? 'year' : 'month';
      const result = await createCheckoutSession(tier, billingInterval);

      if ('error' in result) {
        toast.error(result.error);
      } else {
        // Redirect to Stripe Checkout
        window.location.href = result.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoadingTier(null);
    }
  };

  // Handle free tier CTA
  const handleFreeTier = () => {
    if (isLoggedIn) {
      router.push('/dashboard');
    } else {
      router.push('/auth/signup');
    }
  };

  // Handle lifetime purchase
  const handleLifetimePurchase = async () => {
    if (!isLoggedIn) {
      router.push('/auth/signup?redirect=/pricing&plan=lifetime');
      return;
    }

    setLoadingLifetime(true);

    try {
      const result = await createLifetimeCheckoutSession();

      if ('error' in result) {
        toast.error(result.error);
      } else {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error('Lifetime checkout error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoadingLifetime(false);
    }
  };

  // Build CTA for each tier
  const buildCta = (tierConfig: TierConfig): PricingCta => {
    const { tier } = tierConfig;
    const isCurrentTier = effectiveTier === tier;
    const isLoading = loadingTier === tier;

    // Current plan - disabled
    if (isCurrentTier && isLoggedIn) {
      return {
        label: 'Current Plan',
        variant: 'outline',
        disabled: true,
      };
    }

    // Free tier
    if (tier === 'free') {
      return {
        label: isLoggedIn ? 'Upgrade to Pro' : 'Get Started Free',
        variant: 'solid',
        onClick: () => {
          if (!isLoggedIn) return handleFreeTier();
          void handleSubscribe('pro');
        },
      };
    }

    // Pro tier - trigger Stripe checkout (or signup)
    return {
      label: isLoading ? 'Loading...' : isLoggedIn ? 'Upgrade to Pro' : 'Try Pro Free for 14 Days',
      variant: 'solid',
      onClick: () => handleSubscribe(tier as Exclude<SubscriptionTier, 'free' | 'lifetime'>),
      loading: isLoading,
    };
  };

  return (
    <section
      id="pricing"
      aria-labelledby={showHeader ? 'pricing-heading' : undefined}
      aria-label={!showHeader ? 'Pricing' : undefined}
      className="px-6 py-16 bg-zinc-950 border-y border-zinc-900"
    >
      <div className="mx-auto max-w-6xl">
        {showHeader ? (
          <div className="text-center">
            <h2 
              id="pricing-heading" 
              className="text-3xl md:text-4xl font-semibold text-white tracking-tight"
            >
              Simple, transparent pricing
            </h2>
            <p className="mt-3 text-zinc-400 max-w-2xl mx-auto">
              Start free. Upgrade when you want invoicing, longer forecasts, and priority support.
            </p>

            <div className="mt-8">
              <BillingToggle 
                value={period} 
                onChange={setPeriod} 
                yearlyBadgeText="2 months free" 
              />
            </div>
          </div>
        ) : (
          <div className="flex justify-center mb-10">
            <BillingToggle 
              value={period} 
              onChange={setPeriod} 
              yearlyBadgeText="2 months free" 
            />
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {TIERS.map((tierConfig) => (
            <PricingCard
              key={tierConfig.name}
              name={tierConfig.name}
              priceMonthly={tierConfig.priceMonthly}
              priceYearly={tierConfig.priceYearly}
              description={tierConfig.description}
              features={tierConfig.features}
              popular={tierConfig.popular}
              ctaSubtext={
                tierConfig.ctaSubtext ??
                (tierConfig.tier === 'pro' && !isLoggedIn
                  ? 'Cancel anytime during trial'
                  : tierConfig.tier === 'free' && !isLoggedIn
                    ? 'No credit card required'
                    : undefined)
              }
              period={period}
              priceTransitioning={priceTransitioning}
              cta={buildCta(tierConfig)}
            />
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-zinc-500">
          Cancel anytime • 14-day money-back guarantee • No credit card required for free tier
        </p>

        {/* Lifetime Deal Section */}
        <div id="lifetime" className="mt-12 border border-amber-500/30 bg-amber-500/5 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto scroll-mt-20">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-medium text-amber-400 uppercase tracking-wide">
              Limited Time Offer
            </span>
          </div>

          <h3 className="text-2xl font-bold text-white mb-2">
            Lifetime Deal — Pay Once, Use Forever
          </h3>

          <p className="text-zinc-400 mb-6">
            Get permanent Pro access with a single payment. No monthly fees, no renewals,
            all future updates included.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white">$149</span>
              <span className="text-zinc-500 line-through">$192/2yr</span>
            </div>
            <span className="text-sm text-amber-400 font-medium">
              Save over 22% vs 2 years of Pro
            </span>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6 text-sm text-zinc-300">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-teal-400 flex-shrink-0" />
              Everything in Pro
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-teal-400 flex-shrink-0" />
              One-time payment
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-teal-400 flex-shrink-0" />
              Lifetime access
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-teal-400 flex-shrink-0" />
              All future updates
            </li>
          </ul>

          {effectiveTier === 'lifetime' ? (
            <button
              disabled
              className="w-full py-3 px-6 rounded-lg font-medium bg-zinc-800 text-zinc-500 cursor-not-allowed"
            >
              You Have Lifetime Access
            </button>
          ) : hasProAccess ? (
            <button
              onClick={handleLifetimePurchase}
              disabled={loadingLifetime}
              className="w-full py-3 px-6 rounded-lg font-medium bg-amber-500 hover:bg-amber-400 text-zinc-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingLifetime ? 'Loading...' : 'Switch to Lifetime'}
            </button>
          ) : (
            <button
              onClick={handleLifetimePurchase}
              disabled={loadingLifetime}
              className="w-full py-3 px-6 rounded-lg font-medium bg-amber-500 hover:bg-amber-400 text-zinc-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingLifetime ? 'Loading...' : 'Get Lifetime Access'}
            </button>
          )}

          <p className="mt-3 text-center text-xs text-zinc-500">
            Secure payment via Stripe • 30-day money-back guarantee
          </p>
        </div>
      </div>
    </section>
  );
}
