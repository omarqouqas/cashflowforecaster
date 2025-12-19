// components/subscription/subscription-status.tsx
// ============================================
// Subscription Status Card for Dashboard/Settings
// ============================================

'use client';

import { useTransition } from 'react';
import { Crown, Zap, Settings, ExternalLink, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { type SubscriptionTier, PRICING_TIERS } from '@/lib/stripe/config';
import { createPortalSession } from '@/lib/actions/stripe';
import toast from 'react-hot-toast';

interface SubscriptionStatusProps {
  tier: SubscriptionTier;
  status: string;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
}

export function SubscriptionStatus({
  tier,
  status,
  currentPeriodEnd,
  cancelAtPeriodEnd,
}: SubscriptionStatusProps) {
  const [isPending, startTransition] = useTransition();
  const tierConfig = PRICING_TIERS[tier];
  const isPaid = tier !== 'free';

  const handleManageSubscription = () => {
    startTransition(async () => {
      try {
        const result = await createPortalSession();
        
        if ('error' in result) {
          toast.error(result.error);
        } else {
          window.location.href = result.url;
        }
      } catch (error) {
        toast.error('Something went wrong. Please try again.');
      }
    });
  };

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Subscription</h3>
        {isPaid && (
          <button
            onClick={handleManageSubscription}
            disabled={isPending}
            className="text-sm text-teal-400 hover:text-teal-300 flex items-center gap-1"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Settings className="w-4 h-4" />
                Manage
              </>
            )}
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Tier Badge */}
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
          tier === 'free' ? 'bg-zinc-800' :
          tier === 'pro' ? 'bg-teal-500/20' :
          'bg-amber-500/20'
        }`}>
          {tier === 'free' && <Zap className="w-7 h-7 text-zinc-400" />}
          {tier === 'pro' && <Zap className="w-7 h-7 text-teal-400" />}
          {tier === 'premium' && <Crown className="w-7 h-7 text-amber-400" />}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">{tierConfig.name}</span>
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              status === 'active' ? 'bg-teal-500/20 text-teal-400' :
              status === 'trialing' ? 'bg-blue-500/20 text-blue-400' :
              status === 'past_due' ? 'bg-amber-500/20 text-amber-400' :
              'bg-zinc-800 text-zinc-400'
            }`}>
              {status === 'active' ? 'Active' :
               status === 'trialing' ? 'Trial' :
               status === 'past_due' ? 'Past Due' :
               status === 'canceled' ? 'Canceled' : 'Free'}
            </span>
          </div>
          
          {isPaid && currentPeriodEnd && (
            <p className="text-sm text-zinc-400 mt-1">
              {cancelAtPeriodEnd ? (
                <>Cancels on {format(currentPeriodEnd, 'MMM d, yyyy')}</>
              ) : (
                <>Renews on {format(currentPeriodEnd, 'MMM d, yyyy')}</>
              )}
            </p>
          )}
          
          {!isPaid && (
            <p className="text-sm text-zinc-400 mt-1">
              Upgrade to unlock more features
            </p>
          )}
        </div>
      </div>

      {/* Upgrade CTA for free users */}
      {!isPaid && (
        <a
          href="/pricing"
          className="mt-4 w-full py-2 px-4 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors flex items-center justify-center gap-2"
        >
          Upgrade to Pro
          <ExternalLink className="w-4 h-4" />
        </a>
      )}

      {/* Warning for past due */}
      {status === 'past_due' && (
        <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <p className="text-sm text-amber-400">
            Your payment is past due. Please update your payment method to avoid service interruption.
          </p>
          <button
            onClick={handleManageSubscription}
            disabled={isPending}
            className="mt-2 text-sm text-amber-400 hover:text-amber-300 underline"
          >
            Update payment method
          </button>
        </div>
      )}

      {/* Notice for canceled subscription */}
      {cancelAtPeriodEnd && currentPeriodEnd && (
        <div className="mt-4 p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg">
          <p className="text-sm text-zinc-400">
            Your subscription will end on {format(currentPeriodEnd, 'MMM d, yyyy')}. 
            You'll be downgraded to the Free plan after that.
          </p>
          <button
            onClick={handleManageSubscription}
            disabled={isPending}
            className="mt-2 text-sm text-teal-400 hover:text-teal-300 underline"
          >
            Reactivate subscription
          </button>
        </div>
      )}
    </div>
  );
}
