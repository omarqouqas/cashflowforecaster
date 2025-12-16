// lib/stripe/config.ts
// ============================================
// Stripe Configuration for Cash Flow Forecaster
// ============================================

export type SubscriptionTier = 'free' | 'pro' | 'premium';
export type BillingInterval = 'month' | 'year';

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
// IMPORTANT: Replace these with your actual Stripe Price IDs
// Create these in Stripe Dashboard > Products > Add Product
// ============================================
export const STRIPE_PRICE_IDS = {
  pro: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY || 'price_pro_monthly',
    yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY || 'price_pro_yearly',
  },
  premium: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_MONTHLY || 'price_premium_monthly',
    yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_YEARLY || 'price_premium_yearly',
  },
} as const;

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
      '90-day calendar forecast',
      'Scenario testing',
      'Payment reminders',
      'Priority support (24hr)',
    ],
    limits: {
      maxBills: Infinity,
      maxIncome: Infinity,
      forecastDays: 90,
      invoicesEnabled: true,
      bankSyncEnabled: false,
      smsAlertsEnabled: false,
      couplesModeEnabled: false,
    },
    prices: {
      monthly: { amount: 799, priceId: STRIPE_PRICE_IDS.pro.monthly }, // $7.99
      yearly: { amount: 7900, priceId: STRIPE_PRICE_IDS.pro.yearly }, // $79.00
    },
  },
  premium: {
    name: 'Premium',
    description: 'Full power for growing businesses',
    features: [
      'Everything in Pro',
      'Bank sync via Plaid',
      'SMS alerts',
      'Couples mode',
      '12 months history',
      'Multi-account support',
      'Dedicated support',
    ],
    limits: {
      maxBills: Infinity,
      maxIncome: Infinity,
      forecastDays: 365,
      invoicesEnabled: true,
      bankSyncEnabled: true,
      smsAlertsEnabled: true,
      couplesModeEnabled: true,
    },
    prices: {
      monthly: { amount: 1499, priceId: STRIPE_PRICE_IDS.premium.monthly }, // $14.99
      yearly: { amount: 14900, priceId: STRIPE_PRICE_IDS.premium.yearly }, // $149.00
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

// Helper to get tier from price ID
export function getTierFromPriceId(priceId: string): SubscriptionTier {
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
  return 'free';
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
