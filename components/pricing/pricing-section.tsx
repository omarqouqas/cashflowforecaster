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
import { createCheckoutSession } from '@/lib/actions/stripe';
import type { SubscriptionTier } from '@/lib/stripe/config';

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
      { text: '60-day cash flow forecast' },
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
      { text: 'Runway Collect invoicing' },
      { text: 'One-click Stripe payments for invoices' },
      { text: 'Generate & download PDF invoices' },
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
  const effectiveTier: SubscriptionTier = currentTier === 'premium' ? 'pro' : currentTier;
  const [period, setPeriod] = React.useState<BillingPeriod>('monthly');
  const [priceTransitioning, setPriceTransitioning] = React.useState(false);
  const [loadingTier, setLoadingTier] = React.useState<SubscriptionTier | null>(null);

  // Animate price transition
  React.useEffect(() => {
    setPriceTransitioning(true);
    const t = window.setTimeout(() => setPriceTransitioning(false), 160);
    return () => window.clearTimeout(t);
  }, [period]);

  // Handle subscription checkout
  const handleSubscribe = async (tier: Exclude<SubscriptionTier, 'free'>) => {
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
      label: isLoading ? 'Loading...' : isLoggedIn ? 'Upgrade to Pro' : 'Get Started Free',
      variant: 'solid',
      onClick: () => handleSubscribe(tier as Exclude<SubscriptionTier, 'free'>),
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
                  ? 'Start free, upgrade anytime'
                  : tierConfig.tier === 'free' && !isLoggedIn
                    ? '\u00A0'
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
      </div>
    </section>
  );
}
