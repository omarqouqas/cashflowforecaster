'use client';

import * as React from 'react';
import { Sparkles, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { createLifetimeCheckoutSession } from '@/lib/actions/stripe';
import type { SubscriptionTier } from '@/lib/stripe/config';

interface LifetimeDealBannerProps {
  currentTier: SubscriptionTier;
}

const STORAGE_KEY = 'lifetime-deal-banner-dismissed';
const COOLDOWN_DAYS = 7;

export function LifetimeDealBanner({ currentTier }: LifetimeDealBannerProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // Check visibility on mount (client-side only)
  React.useEffect(() => {
    // Don't show for lifetime or premium users
    if (currentTier === 'lifetime' || currentTier === 'premium') {
      return;
    }

    // Check localStorage for dismissal (with try-catch for Safari private mode)
    try {
      const dismissedAt = localStorage.getItem(STORAGE_KEY);
      if (dismissedAt) {
        const dismissedDate = new Date(dismissedAt);
        // Validate the date is valid
        if (!isNaN(dismissedDate.getTime())) {
          const now = new Date();
          const daysSinceDismissed = (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);

          // If within cooldown period, don't show
          if (daysSinceDismissed < COOLDOWN_DAYS) {
            return;
          }
        }
      }
    } catch {
      // localStorage unavailable (e.g., Safari private mode) - show banner
    }

    // Show the banner
    setIsVisible(true);
  }, [currentTier]);

  const handleDismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    } catch {
      // localStorage unavailable - just hide for this session
    }
    setIsVisible(false);
  };

  const handleGetDeal = async () => {
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="relative bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-amber-500/10 border border-amber-500/20 rounded-lg mb-6">
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-sm text-zinc-200 truncate">
            <span className="font-medium text-amber-400">Pay once, own forever</span>
            <span className="hidden sm:inline"> — Lifetime Pro access with no recurring fees.</span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleGetDeal}
            disabled={isLoading}
            className="px-3 py-1.5 text-sm font-medium bg-amber-500 hover:bg-amber-400 text-zinc-900 rounded-md transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Get Lifetime — $99'}
          </button>
          <button
            onClick={handleDismiss}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-md transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
