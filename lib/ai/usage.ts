/**
 * AI Query usage tracking for rate limiting.
 * Free tier: No access (Pro feature only)
 * Pro tier: Unlimited
 *
 * Note: The ai_query_usage table is created via migration.
 * Until supabase gen types is run, we use type assertions.
 */

import { createClient } from '@/lib/supabase/server';
import type { QueryUsageResult } from './types';

type SubscriptionTier = 'free' | 'pro' | 'premium' | 'lifetime';

/**
 * Check if a user can make an AI query based on their subscription tier.
 * AI Chat is a Pro-only feature - free users have no access.
 */
export async function checkQueryUsage(
  _userId: string,
  tier: SubscriptionTier
): Promise<QueryUsageResult> {
  // Pro, Premium, and Lifetime get unlimited queries
  if (tier !== 'free') {
    return { allowed: true, remaining: Infinity, limit: null };
  }

  // Free users have no access to AI Chat
  return {
    allowed: false,
    remaining: 0,
    limit: 0,
    reason: 'pro_required',
  };
}

/**
 * Increment the daily query count for a user.
 * Uses a database function for atomic upsert.
 */
export async function incrementQueryUsage(userId: string): Promise<void> {
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0] ?? '';

  // Use type assertion since the RPC function may not be in generated types yet
  const { error } = await (supabase as unknown as {
    rpc: (fn: string, params: Record<string, unknown>) => Promise<{ error: Error | null }>;
  }).rpc('increment_ai_query_usage', {
    p_user_id: userId,
    p_query_date: today,
  });

  if (error) {
    // Log but don't throw - we don't want to fail the request if usage tracking fails
    console.error('Failed to increment AI query usage:', error);
  }
}

/**
 * Get the current daily usage for a user.
 * Note: AI Chat is Pro-only, so free users will always have 0 remaining.
 */
export async function getQueryUsage(
  _userId: string,
  tier: SubscriptionTier = 'free'
): Promise<{ count: number; limit: number | null; remaining: number }> {
  // Pro users have unlimited access
  if (tier !== 'free') {
    return {
      count: 0,
      limit: null,
      remaining: Infinity,
    };
  }

  // Free users have no access
  return {
    count: 0,
    limit: 0,
    remaining: 0,
  };
}
