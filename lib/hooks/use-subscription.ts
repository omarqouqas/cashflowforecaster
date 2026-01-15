// lib/hooks/use-subscription.ts
// ============================================
// Client-side subscription hooks for feature gating
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PRICING_TIERS, type SubscriptionTier } from '@/lib/stripe/config';

export interface SubscriptionData {
  tier: SubscriptionTier;
  status: string;
  isLoading: boolean;
  limits: {
    maxBills: number;
    maxIncome: number;
    forecastDays: number;
    invoicesEnabled: boolean;
    bankSyncEnabled: boolean;
    smsAlertsEnabled: boolean;
    couplesModeEnabled: boolean;
  };
}

export interface UsageData {
  billsCount: number;
  incomeCount: number;
  isLoading: boolean;
}

/**
 * Hook to get current user's subscription tier and limits
 */
export function useSubscription(): SubscriptionData {
  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [status, setStatus] = useState<string>('active');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSubscription() {
      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data: subscriptionData } = await supabase
        .from('subscriptions')
        .select('tier, status')
        .eq('user_id', user.id)
        .single();

      const subscription = subscriptionData as any;
      if (subscription) {
        setTier((subscription.tier as SubscriptionTier) || 'free');
        setStatus(subscription.status || 'active');
      }
      
      setIsLoading(false);
    }

    fetchSubscription();
  }, []);

  return {
    tier,
    status,
    isLoading,
    limits: PRICING_TIERS[tier].limits,
  };
}

/**
 * Hook to get current usage counts for bills and income
 */
export function useUsage(): UsageData {
  const [billsCount, setBillsCount] = useState(0);
  const [incomeCount, setIncomeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUsage() {
      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const [billsResult, incomeResult] = await Promise.all([
        supabase
          .from('bills')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id),
        supabase
          .from('income')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id),
      ]);

      setBillsCount(billsResult.count ?? 0);
      setIncomeCount(incomeResult.count ?? 0);
      setIsLoading(false);
    }

    fetchUsage();
  }, []);

  return { billsCount, incomeCount, isLoading };
}

/**
 * Combined hook for subscription + usage (most common use case)
 */
export function useSubscriptionWithUsage() {
  const subscription = useSubscription();
  const usage = useUsage();

  const canAddBill = subscription.limits.maxBills === Infinity || 
    usage.billsCount < subscription.limits.maxBills;
  
  const canAddIncome = subscription.limits.maxIncome === Infinity || 
    usage.incomeCount < subscription.limits.maxIncome;

  const billsRemaining = subscription.limits.maxBills === Infinity 
    ? Infinity 
    : Math.max(0, subscription.limits.maxBills - usage.billsCount);

  const incomeRemaining = subscription.limits.maxIncome === Infinity 
    ? Infinity 
    : Math.max(0, subscription.limits.maxIncome - usage.incomeCount);

  return {
    ...subscription,
    usage,
    canAddBill,
    canAddIncome,
    billsRemaining,
    incomeRemaining,
    isLoading: subscription.isLoading || usage.isLoading,
  };
}
