// components/landing/pricing-section.tsx
// ============================================
// Landing Page Pricing Section with Checkout Links
// ============================================

'use client';

import { useState } from 'react';
import { Check, X, Zap } from 'lucide-react';
import Link from 'next/link';
import { PRICING_TIERS, formatPrice, type BillingInterval } from '@/lib/stripe/config';

export function PricingSection() {
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('year');

  const tiers = [
    {
      key: 'free' as const,
      icon: Zap,
      iconColor: 'text-zinc-400',
      iconBg: 'bg-zinc-800',
      buttonStyle: 'bg-zinc-800 text-white hover:bg-zinc-700',
      href: '/auth/signup',
      buttonText: 'Get Started Free',
    },
    {
      key: 'pro' as const,
      icon: Zap,
      iconColor: 'text-teal-400',
      iconBg: 'bg-teal-500/20',
      buttonStyle: 'bg-teal-500 text-white hover:bg-teal-600',
      href: '/auth/signup?plan=pro',
      buttonText: 'Get Started Free',
      popular: true,
    },
  ];

  return (
    <section id="pricing" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Start free. Upgrade when you need more power.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center items-center gap-4 mb-12">
          <span className={billingInterval === 'month' ? 'text-white font-medium' : 'text-zinc-500'}>
            Monthly
          </span>
          <button
            onClick={() => setBillingInterval(billingInterval === 'month' ? 'year' : 'month')}
            className="relative w-14 h-7 bg-zinc-800 rounded-full transition-colors hover:bg-zinc-700"
            aria-label="Toggle billing interval"
          >
            <span
              className={`absolute top-1 w-5 h-5 bg-teal-500 rounded-full transition-transform duration-200 ${
                billingInterval === 'year' ? 'translate-x-8' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={billingInterval === 'year' ? 'text-white font-medium' : 'text-zinc-500'}>
            Yearly
          </span>
          {billingInterval === 'year' && (
            <span className="px-2.5 py-1 bg-teal-500/20 text-teal-400 text-sm font-medium rounded-full">
              Save 2 months
            </span>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier) => {
            const config = PRICING_TIERS[tier.key];
            const price = billingInterval === 'month'
              ? config.prices.monthly.amount
              : config.prices.yearly.amount;
            const Icon = tier.icon;

            return (
              <div
                key={tier.key}
                className={`relative bg-zinc-900 rounded-2xl p-8 border ${
                  tier.popular
                    ? 'border-teal-500 ring-2 ring-teal-500/20'
                    : 'border-zinc-800'
                } flex flex-col h-full`}
              >
                {/* Popular Badge */}
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-teal-500 text-white text-sm font-medium rounded-full flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${tier.iconBg}`}>
                  <Icon className={`w-6 h-6 ${tier.iconColor}`} />
                </div>

                {/* Name & Description */}
                <h3 className="text-xl font-bold text-white mb-1">{config.name}</h3>
                <p className="text-zinc-400 text-sm mb-4">{config.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">
                    {formatPrice(price)}
                  </span>
                  {price > 0 && (
                    <span className="text-zinc-500 ml-2">
                      /{billingInterval === 'month' ? 'mo' : 'yr'}
                    </span>
                  )}
                </div>

                {/* Features */}
                <ul className="mt-6 space-y-3">
                  {config.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <Check className={`w-5 h-5 flex-shrink-0 ${
                        tier.key === 'free' ? 'text-zinc-500' :
                        tier.key === 'pro' ? 'text-teal-500' :
                        'text-amber-500'
                      }`} />
                      <span className="text-zinc-300">{feature}</span>
                    </li>
                  ))}

                  {/* Show what's not included */}
                  {tier.key === 'free' && (
                    <>
                      <li className="flex items-start gap-3 text-sm text-zinc-600">
                        <X className="w-5 h-5 flex-shrink-0" />
                        <span>Runway Collect invoicing</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm text-zinc-600">
                        <X className="w-5 h-5 flex-shrink-0" />
                        <span>Bank sync</span>
                      </li>
                    </>
                  )}
                  {tier.key === 'pro' && null}
                </ul>

                {/* CTA (anchored to bottom so buttons align across cards) */}
                <div className="mt-auto pt-6">
                  <Link
                    href={tier.href}
                    className={`block w-full py-3 px-4 rounded-lg font-medium transition-colors text-center ${tier.buttonStyle}`}
                  >
                    {tier.buttonText}
                  </Link>

                  {tier.key === 'pro' && (
                    <p className="text-zinc-400 text-sm text-center mt-2">
                      Start free, upgrade anytime
                    </p>
                  )}

                  {tier.key === 'free' && (
                    <p className="text-zinc-400 text-sm text-center mt-2">
                      {'\u00A0'}
                    </p>
                  )}

                  {/* "Coming soon" note for paid tiers */}
                  {tier.key !== 'free' && (
                    <p className="text-xs text-zinc-500 text-center mt-2">
                      Pro features available now
                    </p>
                  )}
                </div>

                {/* No Premium tier pre-launch */}
              </div>
            );
          })}
        </div>

        {/* Trust Signals */}
        <div className="mt-12 text-center">
          <p className="text-zinc-500 text-sm">
            Cancel anytime • 14-day money-back guarantee • No credit card required for free tier
          </p>
        </div>
      </div>
    </section>
  );
}