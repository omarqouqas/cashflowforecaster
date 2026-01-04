'use client';

import * as React from 'react';

import { redirectToCheckout } from '@/lib/actions/stripe';
import type { BillingInterval, SubscriptionTier } from '@/lib/stripe/config';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const TIER_RANK: Record<SubscriptionTier, number> = {
  free: 0,
  pro: 1,
  premium: 2,
};

export interface ProFeatureGateProps {
  currentTier?: SubscriptionTier;
  requiredTier: SubscriptionTier;
  featureName: string;
  children: React.ReactNode;
  className?: string;
  /**
   * Defaults to 'month' when upgrading.
   * (Matches Stripe config type: 'month' | 'year')
   */
  upgradeInterval?: BillingInterval;
  /**
   * Override which tier to send users to checkout for.
   * Defaults to requiredTier (or 'pro' if requiredTier is 'free').
   */
  upgradeTierOverride?: Exclude<SubscriptionTier, 'free'>;
}

function hasTierAccess(current: SubscriptionTier, required: SubscriptionTier) {
  return TIER_RANK[current] >= TIER_RANK[required];
}

export function ProFeatureGate({
  currentTier = 'free',
  requiredTier,
  featureName,
  children,
  className,
  upgradeInterval = 'month',
  upgradeTierOverride,
}: ProFeatureGateProps) {
  // Premium is sunset pre-launch: treat legacy premium as pro-equivalent for gating.
  const effectiveCurrentTier: SubscriptionTier = currentTier === 'premium' ? 'pro' : currentTier;
  const effectiveRequiredTier: SubscriptionTier = requiredTier === 'premium' ? 'pro' : requiredTier;

  if (hasTierAccess(effectiveCurrentTier, effectiveRequiredTier)) {
    return <>{children}</>;
  }

  const upgradeTier: Exclude<SubscriptionTier, 'free'> =
    upgradeTierOverride ?? 'pro';

  return (
    <div
      className={cn(
        'rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6',
        className
      )}
      role="region"
      aria-label="Upgrade required"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Upgrade required
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {featureName} is available on the Pro plan.
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Current plan: {effectiveCurrentTier}
          </p>
        </div>

        <form action={redirectToCheckout} className="shrink-0">
          <input type="hidden" name="tier" value={upgradeTier} />
          <input type="hidden" name="interval" value={upgradeInterval} />
          <Button type="submit" variant="primary">
            Upgrade to {upgradeTier === 'pro' ? 'Pro' : 'Premium'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ProFeatureGate;


