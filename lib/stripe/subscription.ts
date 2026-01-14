// lib/stripe/subscription.ts
// ============================================
// Subscription Helper Functions
// ============================================

import { createClient } from '@/lib/supabase/server';
import { PRICING_TIERS, normalizeSubscriptionTier, type SubscriptionTier } from './config';

export interface UserSubscription {
  tier: SubscriptionTier;
  status: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
}

/**
 * Get the current user's subscription from the database
 */
export async function getUserSubscription(userId?: string): Promise<UserSubscription> {
  const supabase = await createClient();
  
  // If no userId provided, get from current session
  let finalUserId = userId;
  if (!finalUserId) {
    // Use getSession() instead of getUser() to avoid refresh token errors
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return getDefaultSubscription();
    }
    finalUserId = session.user.id;
  }
  
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', finalUserId)
    .single();
  
  if (error || !subscription) {
    // No subscription record = free tier
    return getDefaultSubscription();
  }
  
  return {
    tier: normalizeSubscriptionTier(subscription.tier, 'free'),
    status: subscription.status,
    stripeCustomerId: subscription.stripe_customer_id,
    stripeSubscriptionId: subscription.stripe_subscription_id,
    currentPeriodEnd: subscription.current_period_end 
      ? new Date(subscription.current_period_end) 
      : null,
    cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
  };
}

/**
 * Get default (free) subscription
 */
function getDefaultSubscription(): UserSubscription {
  return {
    tier: 'free',
    status: 'active',
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
  };
}

/**
 * Check if user has access to a specific tier's features
 */
export async function userHasAccess(
  requiredTier: SubscriptionTier,
  userId?: string
): Promise<boolean> {
  const subscription = await getUserSubscription(userId);
  
  // User must have active subscription
  if (subscription.status !== 'active' && subscription.status !== 'trialing') {
    return subscription.tier === 'free' && requiredTier === 'free';
  }
  
  const tierHierarchy: Record<SubscriptionTier, number> = {
    free: 0,
    pro: 1,
    premium: 2,
  };
  
  return tierHierarchy[subscription.tier] >= tierHierarchy[requiredTier];
}

/**
 * Check if user can use invoicing feature (Pro+)
 */
export async function canUseInvoicing(userId?: string): Promise<boolean> {
  return userHasAccess('pro', userId);
}

/**
 * Check if user can use bank sync feature (Premium only)
 */
export async function canUseBankSync(_userId?: string): Promise<boolean> {
  // Premium is sunset pre-launch and bank sync is not available yet.
  return false;
}

/**
 * Get user's limits based on their tier
 */
export async function getUserLimits(userId?: string) {
  const subscription = await getUserSubscription(userId);
  return PRICING_TIERS[subscription.tier].limits;
}

/**
 * Check if user has reached their bills limit
 */
export async function hasReachedBillsLimit(userId?: string): Promise<boolean> {
  const supabase = await createClient();
  const limits = await getUserLimits(userId);
  
  if (limits.maxBills === Infinity) return false;
  
  let finalUserId = userId;
  if (!finalUserId) {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) return true;
    finalUserId = user.id;
  }
  
  const { count } = await supabase
    .from('bills')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', finalUserId);
  
  return (count ?? 0) >= limits.maxBills;
}

/**
 * Check if user has reached their income limit
 */
export async function hasReachedIncomeLimit(userId?: string): Promise<boolean> {
  const supabase = await createClient();
  const limits = await getUserLimits(userId);
  
  if (limits.maxIncome === Infinity) return false;
  
  let finalUserId = userId;
  if (!finalUserId) {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) return true;
    finalUserId = user.id;
  }
  
  const { count } = await supabase
    .from('income')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', finalUserId);
  
  return (count ?? 0) >= limits.maxIncome;
}

/**
 * Get user's forecast days limit
 */
export async function getForecastDaysLimit(userId?: string): Promise<number> {
  const limits = await getUserLimits(userId);
  return limits.forecastDays;
}

/**
 * Legacy support: premium tier is not offered pre-launch. If a user has a legacy
 * premium subscription, treat them as Pro-equivalent for entitlements.
 */
export async function getEffectiveTier(userId?: string): Promise<SubscriptionTier> {
  const subscription = await getUserSubscription(userId);
  return subscription.tier === 'premium' ? 'pro' : subscription.tier;
}
