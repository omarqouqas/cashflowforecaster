// lib/stripe/config.ts
// ============================================
// Stripe Configuration for Cash Flow Forecaster
// ============================================

// NOTE: Keep 'premium' for backwards compatibility with any legacy subscriptions.
// Premium is not currently offered in the UI/checkout flows pre-launch.
export type SubscriptionTier = 'free' | 'pro' | 'premium';
export type BillingInterval = 'month' | 'year';

export function isSubscriptionTier(value: unknown): value is SubscriptionTier {
  return value === 'free' || value === 'pro' || value === 'premium';
}

export function normalizeSubscriptionTier(
  value: unknown,
  fallback: SubscriptionTier = 'free'
): SubscriptionTier {
  return isSubscriptionTier(value) ? value : fallback;
}

export interface PricingTier {
  name: string;
  description: string;
  features: string[];
  limits: {
    maxBills: number;
    maxIncome: number;
    forecastDays: number;
    invoicesEnabled: boolean;
    bankSyncEnabled: boolean;
    smsAlertsEnabled: boolean;
    couplesModeEnabled: boolean;
  };
  prices: {
    monthly: {
      amount: number;
      priceId: string;
    };
    yearly: {
      amount: number;
      priceId: string;
    };
  };
}

// ============================================
// Stripe Price IDs from environment variables
// Server-side (STRIPE_*) takes precedence, falls back to client-side (NEXT_PUBLIC_*)
// ============================================
export const STRIPE_PRICE_IDS = {
  pro: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY || '',
    yearly: process.env.STRIPE_PRICE_PRO_YEARLY || process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY || '',
  },
  premium: {
    monthly: process.env.STRIPE_PRICE_PREMIUM_MONTHLY || process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_MONTHLY || '',
    yearly: process.env.STRIPE_PRICE_PREMIUM_YEARLY || process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_YEARLY || '',
  },
} as const;

// Placeholder patterns to detect unconfigured price IDs
const PLACEHOLDER_PATTERNS = [
  'price_pro_monthly',
  'price_pro_yearly', 
  'price_premium_monthly',
  'price_premium_yearly',
];

/**
 * Check if a price ID is a placeholder (not a real Stripe price ID)
 */
export function isPlaceholderPriceId(priceId: string): boolean {
  // Empty or undefined
  if (!priceId) return true;
  
  // Known placeholder patterns
  if (PLACEHOLDER_PATTERNS.includes(priceId)) return true;
  
  // Real Stripe price IDs are longer and contain underscores after "price_"
  // e.g., price_1ABC123def456... (at least 20+ chars)
  if (priceId.startsWith('price_') && priceId.length < 20) return true;
  
  return false;
}

/**
 * Check if Stripe pricing is properly configured
 */
export function isStripePricingConfigured(): boolean {
  return (
    !isPlaceholderPriceId(STRIPE_PRICE_IDS.pro.monthly) &&
    !isPlaceholderPriceId(STRIPE_PRICE_IDS.pro.yearly) &&
    !isPlaceholderPriceId(STRIPE_PRICE_IDS.premium.monthly) &&
    !isPlaceholderPriceId(STRIPE_PRICE_IDS.premium.yearly)
  );
}

// Pricing tier definitions
export const PRICING_TIERS: Record<SubscriptionTier, PricingTier> = {
  free: {
    name: 'Free',
    description: 'Perfect for getting started',
    features: [
      '60-day cash flow forecast',
      'Up to 10 bills & income sources',
      'Manual entry only',
      'Basic color coding',
      'Email support (48hr response)',
    ],
    limits: {
      maxBills: 10,
      maxIncome: 10,
      forecastDays: 60,
      invoicesEnabled: false,
      bankSyncEnabled: false,
      smsAlertsEnabled: false,
      couplesModeEnabled: false,
    },
    prices: {
      monthly: { amount: 0, priceId: '' },
      yearly: { amount: 0, priceId: '' },
    },
  },
  pro: {
    name: 'Pro',
    description: 'For serious freelancers',
    features: [
      'Everything in Free',
      'Runway Collect invoicing',
      'Unlimited bills & income',
      '365-day forecast (12 months ahead)',
      'Scenario testing',
      'Payment reminders',
      'Priority support (24hr)',
    ],
    limits: {
      maxBills: Infinity,
      maxIncome: Infinity,
      forecastDays: 365,
      invoicesEnabled: true,
      bankSyncEnabled: false,
      smsAlertsEnabled: false,
      couplesModeEnabled: false,
    },
    prices: {
      monthly: { amount: 799, priceId: STRIPE_PRICE_IDS.pro.monthly },
      yearly: { amount: 7900, priceId: STRIPE_PRICE_IDS.pro.yearly },
    },
  },
  premium: {
    // Legacy tier (not offered pre-launch). Treat as Pro for access/limits.
    name: 'Premium (Legacy)',
    description: 'Legacy subscription (not offered pre-launch)',
    features: [
      'Everything in Pro',
    ],
    limits: {
      maxBills: Infinity,
      maxIncome: Infinity,
      forecastDays: 365,
      invoicesEnabled: true,
      bankSyncEnabled: false,
      smsAlertsEnabled: false,
      couplesModeEnabled: false,
    },
    prices: {
      monthly: { amount: 1499, priceId: STRIPE_PRICE_IDS.premium.monthly },
      yearly: { amount: 14900, priceId: STRIPE_PRICE_IDS.premium.yearly },
    },
  },
};

// Helper to format price for display
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

/**
 * Get tier from price ID
 * Returns null if price ID is not recognized (prevents silent downgrades)
 */
export function getTierFromPriceId(priceId: string): SubscriptionTier | null {
  if (!priceId) return null;
  
  if (
    priceId === STRIPE_PRICE_IDS.premium.monthly ||
    priceId === STRIPE_PRICE_IDS.premium.yearly
  ) {
    return 'premium';
  }
  
  if (
    priceId === STRIPE_PRICE_IDS.pro.monthly ||
    priceId === STRIPE_PRICE_IDS.pro.yearly
  ) {
    return 'pro';
  }
  
  // Don't silently return 'free' for unknown price IDs
  return null;
}

// Helper to check if a tier has a specific feature
export function tierHasFeature(
  tier: SubscriptionTier,
  feature: keyof PricingTier['limits']
): boolean {
  const tierConfig = PRICING_TIERS[tier];
  const value = tierConfig.limits[feature];
  return typeof value === 'boolean' ? value : value > 0;
}