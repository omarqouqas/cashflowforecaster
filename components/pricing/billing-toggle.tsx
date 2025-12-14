'use client';

import * as React from 'react';

export type BillingPeriod = 'monthly' | 'yearly';

export interface BillingToggleProps {
  value: BillingPeriod;
  onChange: (value: BillingPeriod) => void;
  yearlyBadgeText?: string;
}

export function BillingToggle({
  value,
  onChange,
  yearlyBadgeText = '2 months free',
}: BillingToggleProps) {
  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    onChange(value === 'monthly' ? 'yearly' : 'monthly');
  };

  return (
    <div className="flex items-center justify-center">
      <div
        role="radiogroup"
        aria-label="Billing period"
        onKeyDown={onKeyDown}
        className="inline-flex items-center rounded-xl border border-zinc-800 bg-zinc-950 p-1"
      >
        <button
          type="button"
          role="radio"
          aria-checked={value === 'monthly'}
          onClick={() => onChange('monthly')}
          className={[
            'relative rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none',
            'focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950',
            value === 'monthly'
              ? 'bg-zinc-900 text-white'
              : 'text-zinc-400 hover:text-zinc-200',
          ].join(' ')}
        >
          Monthly
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={value === 'yearly'}
          onClick={() => onChange('yearly')}
          className={[
            'relative rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none',
            'focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950',
            value === 'yearly'
              ? 'bg-zinc-900 text-white'
              : 'text-zinc-400 hover:text-zinc-200',
          ].join(' ')}
        >
          <span className="inline-flex items-center gap-2">
            Yearly
            <span className="rounded-full bg-teal-500/15 px-2 py-0.5 text-xs font-semibold text-teal-300 ring-1 ring-teal-500/20">
              {yearlyBadgeText}
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
