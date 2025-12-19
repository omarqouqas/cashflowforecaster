// lib/actions/stripe.ts
// ============================================
// Stripe Server Actions
// ============================================

'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { stripe, getURL } from '@/lib/stripe/client';
import { 
  STRIPE_PRICE_IDS, 
  isPlaceholderPriceId,
  type SubscriptionTier, 
  type BillingInterval 
} from '@/lib/stripe/config';

/**
 * Create a Stripe Checkout session for subscription
 */
export async function createCheckoutSession(
  tier: Exclude<SubscriptionTier, 'free'>,
  interval: BillingInterval
): Promise<{ url: string } | { error: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'You must be logged in to subscribe' };
    }
    if (!user.email) {
      return { error: 'Missing email for your account. Please contact support.' };
    }
    
    // Get the price ID based on tier and interval
    const priceId = STRIPE_PRICE_IDS[tier][interval === 'month' ? 'monthly' : 'yearly'];
    
    // Check if price ID is configured (not a placeholder)
    if (isPlaceholderPriceId(priceId)) {
      console.error(`Stripe price ID not configured for ${tier}/${interval}:`, priceId);
      return { error: 'Pricing not configured. Please contact support.' };
    }
    
    // Check if user already has a Stripe customer ID (billing data lives in `subscriptions`)
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();
    
    let customerId = existingSubscription?.stripe_customer_id ?? null;
    
    // Create or retrieve Stripe customer
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      });
      customerId = customer.id;
      
      // Save customer ID to database (billing data lives in `subscriptions`)
      await supabase
        .from('subscriptions')
        .upsert(
          {
            user_id: user.id,
            stripe_customer_id: customerId,
            tier: 'free',
            status: 'inactive',
          },
          { onConflict: 'user_id' }
        );
    }
    
    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${getURL()}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getURL()}/pricing?checkout=canceled`,
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    });
    
    if (!checkoutSession.url) {
      return { error: 'Failed to create checkout session' };
    }
    
    return { url: checkoutSession.url };
  } catch (error) {
    console.error('Checkout error:', error);
    return { error: 'Something went wrong. Please try again.' };
  }
}

/**
 * Create a Stripe Customer Portal session for managing subscription
 */
export async function createPortalSession(): Promise<{ url: string } | { error: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'You must be logged in' };
    }
    
    // Get user's Stripe customer ID (billing data lives in `subscriptions`)
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();
    
    if (!subscription?.stripe_customer_id) {
      return { error: 'No subscription found' };
    }
    
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${getURL()}/dashboard/settings`,
    });
    
    return { url: portalSession.url };
  } catch (error) {
    console.error('Portal error:', error);
    return { error: 'Something went wrong. Please try again.' };
  }
}

/**
 * Redirect to checkout (for use in form actions)
 */
export async function redirectToCheckout(formData: FormData) {
  const tier = formData.get('tier') as Exclude<SubscriptionTier, 'free'>;
  const interval = formData.get('interval') as BillingInterval;
  
  const result = await createCheckoutSession(tier, interval);
  
  if ('error' in result) {
    // Return to pricing page with error
    redirect(`/pricing?error=${encodeURIComponent(result.error)}`);
  }
  
  redirect(result.url);
}

/**
 * Redirect to customer portal (for use in form actions)
 */
export async function redirectToPortal() {
  const result = await createPortalSession();
  
  if ('error' in result) {
    redirect(`/dashboard/settings?error=${encodeURIComponent(result.error)}`);
  }
  
  redirect(result.url);
}
