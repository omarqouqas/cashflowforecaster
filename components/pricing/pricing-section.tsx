'use client';

import * as React from 'react';

import { BillingToggle, type BillingPeriod } from './billing-toggle';
import { PricingCard, type PricingCardProps } from './pricing-card';

const TIERS: Array<Omit<PricingCardProps, 'period' | 'priceTransitioning'>> = [
  {
    name: 'Free',
    priceMonthly: 0,
    description: 'For getting clarity fast',
    features: [
      { text: '60-day cash flow forecast' },
      { text: 'Manual entry only' },
      { text: 'Up to 10 bills & income sources' },
      { text: 'Basic calendar view' },
      { text: 'Email support (48hr)' },
    ],
    cta: { label: 'Get Started', href: '/auth/signup', variant: 'outline' },
  },
  {
    name: 'Pro',
    priceMonthly: 7.99,
    priceYearly: 79,
    description: 'For freelancers who invoice clients',
    popular: true,
    features: [
      { text: 'Everything in Free' },
      { text: 'Runway Collect invoicing' },
      { text: 'Generate & download PDF invoices' },
      { text: 'Unlimited bills & income sources' },
      { text: '90-day forecast' },
      { text: 'Priority support (24hr)' },
    ],
    cta: { label: 'Start Free Trial', href: '/auth/signup', variant: 'solid' },
  },
  {
    name: 'Premium',
    priceMonthly: 14.99,
    priceYearly: 149,
    description: 'For power users and couples',
    features: [
      { text: 'Everything in Pro' },
      { text: 'Bank sync via Plaid', kind: 'coming_soon', badgeText: 'Coming soon' },
      { text: 'SMS alerts for low balance' },
      { text: 'Couples mode', kind: 'coming_soon', badgeText: 'Coming soon' },
      { text: '12 months history' },
    ],
    cta: { label: 'Start Free Trial', href: '/auth/signup', variant: 'outline' },
  },
];

export default function PricingSection() {
  const [period, setPeriod] = React.useState<BillingPeriod>('monthly');
  const [priceTransitioning, setPriceTransitioning] = React.useState(false);

  React.useEffect(() => {
    setPriceTransitioning(true);
    const t = window.setTimeout(() => setPriceTransitioning(false), 160);
    return () => window.clearTimeout(t);
  }, [period]);

  return (
    <section
      aria-labelledby="pricing"
      className="px-6 py-16 bg-zinc-950 border-y border-zinc-900"
    >
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 id="pricing" className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="mt-3 text-zinc-400 max-w-2xl mx-auto">
            Start free. Upgrade when you want invoicing, longer forecasts, and priority support.
          </p>

          <div className="mt-8">
            <BillingToggle value={period} onChange={setPeriod} yearlyBadgeText="2 months free" />
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {TIERS.map((tier) => (
            <PricingCard
              key={tier.name}
              {...tier}
              period={period}
              priceTransitioning={priceTransitioning}
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
