// lib/stripe/feature-gate.ts
// ============================================
// Server-side feature gating utilities
// ============================================

import { createClient } from '@/lib/supabase/server';
import { PRICING_TIERS, type SubscriptionTier } from './config';

export interface FeatureGateResult {
  allowed: boolean;
  reason?: 'limit_reached' | 'feature_disabled' | 'unauthorized';
  currentCount?: number;
  limit?: number;
  tier: SubscriptionTier;
}

/**
 * Get user's subscription tier from the database
 */
async function getUserTier(userId: string): Promise<SubscriptionTier> {
  const supabase = await createClient();
  
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('tier, status')
    .eq('user_id', userId)
    .single();

  // Only honor the tier if subscription is active
  if (subscription && (subscription.status === 'active' || subscription.status === 'trialing')) {
    return (subscription.tier as SubscriptionTier) || 'free';
  }

  return 'free';
}

/**
 * Check if user can add a new bill
 */
export async function canAddBill(userId: string): Promise<FeatureGateResult> {
  const supabase = await createClient();
  const tier = await getUserTier(userId);
  const limits = PRICING_TIERS[tier].limits;

  if (limits.maxBills === Infinity) {
    return { allowed: true, tier };
  }

  const { count } = await supabase
    .from('bills')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  const currentCount = count ?? 0;

  if (currentCount >= limits.maxBills) {
    return {
      allowed: false,
      reason: 'limit_reached',
      currentCount,
      limit: limits.maxBills,
      tier,
    };
  }

  return { 
    allowed: true, 
    currentCount, 
    limit: limits.maxBills,
    tier,
  };
}

/**
 * Check if user can add a new income source
 */
export async function canAddIncome(userId: string): Promise<FeatureGateResult> {
  const supabase = await createClient();
  const tier = await getUserTier(userId);
  const limits = PRICING_TIERS[tier].limits;

  if (limits.maxIncome === Infinity) {
    return { allowed: true, tier };
  }

  const { count } = await supabase
    .from('income')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  const currentCount = count ?? 0;

  if (currentCount >= limits.maxIncome) {
    return {
      allowed: false,
      reason: 'limit_reached',
      currentCount,
      limit: limits.maxIncome,
      tier,
    };
  }

  return { 
    allowed: true, 
    currentCount, 
    limit: limits.maxIncome,
    tier,
  };
}

/**
 * Check if user can use invoicing feature
 */
export async function canUseInvoicing(userId: string): Promise<FeatureGateResult> {
  const tier = await getUserTier(userId);
  const limits = PRICING_TIERS[tier].limits;

  if (!limits.invoicesEnabled) {
    return {
      allowed: false,
      reason: 'feature_disabled',
      tier,
    };
  }

  return { allowed: true, tier };
}

/**
 * Check if user can use bank sync feature
 */
export async function canUseBankSync(userId: string): Promise<FeatureGateResult> {
  const tier = await getUserTier(userId);
  const limits = PRICING_TIERS[tier].limits;

  if (!limits.bankSyncEnabled) {
    return {
      allowed: false,
      reason: 'feature_disabled',
      tier,
    };
  }

  return { allowed: true, tier };
}

/**
 * Get user's forecast days limit
 */
export async function getForecastDaysLimit(userId: string): Promise<number> {
  const tier = await getUserTier(userId);
  // Premium is not offered pre-launch, but legacy Premium subscribers should not break.
  // Treat premium as pro-equivalent for forecast entitlement.
  if (tier === 'premium') return PRICING_TIERS.pro.limits.forecastDays;
  return PRICING_TIERS[tier].limits.forecastDays;
}

/**
 * Get all usage stats for a user (useful for displaying in UI)
 */
export async function getUserUsageStats(userId: string): Promise<{
  tier: SubscriptionTier;
  bills: { current: number; limit: number };
  income: { current: number; limit: number };
  forecastDays: number;
  features: {
    invoices: boolean;
    bankSync: boolean;
    smsAlerts: boolean;
    couplesMode: boolean;
  };
}> {
  const supabase = await createClient();
  const tier = await getUserTier(userId);
  const limits = PRICING_TIERS[tier].limits;

  const [billsResult, incomeResult] = await Promise.all([
    supabase
      .from('bills')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId),
    supabase
      .from('income')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId),
  ]);

  return {
    tier,
    bills: {
      current: billsResult.count ?? 0,
      limit: limits.maxBills,
    },
    income: {
      current: incomeResult.count ?? 0,
      limit: limits.maxIncome,
    },
    forecastDays: limits.forecastDays,
    features: {
      invoices: limits.invoicesEnabled,
      bankSync: limits.bankSyncEnabled,
      smsAlerts: limits.smsAlertsEnabled,
      couplesMode: limits.couplesModeEnabled,
    },
  };
}
