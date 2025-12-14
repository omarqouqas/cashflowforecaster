import Link from 'next/link';
import * as React from 'react';

import type { BillingPeriod } from './billing-toggle';

type CtaVariant = 'solid' | 'outline';

export interface PricingFeature {
  text: string;
  kind?: 'included' | 'coming_soon';
  badgeText?: string;
}

export interface PricingCta {
  label: string;
  href: string;
  variant: CtaVariant;
}

export interface PricingCardProps {
  name: string;
  priceMonthly: number;
  priceYearly?: number;
  period: BillingPeriod;
  description?: string;
  features: PricingFeature[];
  cta: PricingCta;
  popular?: boolean;
  priceTransitioning?: boolean;
}

function formatMoney(amount: number) {
  return amount.toFixed(2);
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      <path
        d="M16.25 5.75L8.375 13.625L3.75 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SoonIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      <path
        d="M10 18a8 8 0 100-16 8 8 0 000 16z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M10 5.75v4.5l3 1.75"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ctaClass(variant: CtaVariant) {
  const base =
    'inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950';

  if (variant === 'solid') {
    return [base, 'bg-teal-500 text-zinc-950 hover:bg-teal-400'].join(' ');
  }

  return [
    base,
    'border border-teal-500/60 text-teal-200 hover:bg-teal-500/10',
  ].join(' ');
}

export function PricingCard({
  name,
  description,
  priceMonthly,
  priceYearly,
  period,
  features,
  cta,
  popular = false,
  priceTransitioning = false,
}: PricingCardProps) {
  const isYearly = period === 'yearly';
  const showYearly = isYearly && typeof priceYearly === 'number';

  const mainPrice = showYearly ? priceYearly! : priceMonthly;
  const suffix = showYearly ? '/year' : priceMonthly === 0 ? '/forever' : '/month';

  const monthlyEquivalent = showYearly ? priceYearly! / 12 : undefined;

  return (
    <div
      className={[
        'relative rounded-xl border bg-zinc-900 p-6',
        popular
          ? 'border-teal-500/40 ring-2 ring-teal-500/50 shadow-[0_20px_80px_-40px_rgba(20,184,166,0.55)]'
          : 'border-zinc-800',
      ].join(' ')}
    >
      {popular && (
        <div className="absolute inset-x-0 -top-3 flex justify-center">
          <span className="rounded-full bg-teal-500 px-3 py-1 text-xs font-semibold text-zinc-950 shadow-sm">
            Most Popular
          </span>
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{name}</h3>
          {description && <p className="mt-1 text-sm text-zinc-400">{description}</p>}
        </div>
      </div>

      <div
        className={[
          'mt-5 transition-all duration-200',
          priceTransitioning ? 'opacity-0 -translate-y-0.5' : 'opacity-100 translate-y-0',
        ].join(' ')}
      >
        <div className="flex items-end gap-2">
          <p className="text-white">
            <span className="text-4xl font-semibold tracking-tight">
              {priceMonthly === 0 ? '$0' : `$${formatMoney(mainPrice)}`}
            </span>
            <span className="ml-1 text-sm text-zinc-400">{suffix}</span>
          </p>
        </div>

        {showYearly && priceMonthly > 0 && monthlyEquivalent !== undefined && (
          <p className="mt-2 text-sm text-zinc-400">
            <span className="line-through text-zinc-500">${formatMoney(priceMonthly)}</span>{' '}
            <span className="text-zinc-300">${formatMoney(monthlyEquivalent)}/mo</span>
          </p>
        )}
      </div>

      <ul className="mt-6 space-y-3">
        {features.map((feature) => {
          const kind = feature.kind ?? 'included';
          const isSoon = kind === 'coming_soon';

          return (
            <li key={feature.text} className="flex items-start gap-3">
              <span className="mt-0.5">
                {isSoon ? (
                  <SoonIcon className="h-5 w-5 text-zinc-600" />
                ) : (
                  <CheckIcon className="h-5 w-5 text-teal-500" />
                )}
              </span>

              <div className="min-w-0">
                <p className={isSoon ? 'text-sm text-zinc-500' : 'text-sm text-zinc-200'}>
                  {feature.text}{' '}
                  {isSoon && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-zinc-800 px-2 py-0.5 text-[11px] font-medium text-zinc-400 ring-1 ring-zinc-700">
                      {feature.badgeText ?? 'Coming soon'}
                    </span>
                  )}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-7">
        <Link href={cta.href} className={ctaClass(cta.variant)}>
          {cta.label}
        </Link>
      </div>
    </div>
  );
}
