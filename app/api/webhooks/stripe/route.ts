// app/api/webhooks/stripe/route.ts
// ============================================
// Stripe Webhook Handler
// ============================================

import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe, webhookSecret } from '@/lib/stripe/client';
import { createClient } from '@supabase/supabase-js';
import { getTierFromPriceId } from '@/lib/stripe/config';

// Validate environment variables at startup
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
}

// Create a Supabase client with service role for webhook handling
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    console.error('Missing stripe-signature header');
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error(`Webhook signature verification failed: ${errorMessage}`);
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCanceled(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle successful checkout completion
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;
  
  // Get user ID from metadata or customer
  let userId = session.metadata?.supabase_user_id;
  
  if (!userId) {
    // Try to get from customer
    const customer = await stripe.customers.retrieve(customerId);
    if (customer.deleted) return;
    userId = customer.metadata?.supabase_user_id;
  }
  
  if (!userId) {
    console.error('No user ID found for checkout session:', session.id);
    return;
  }
  
  // Get subscription details from Stripe
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = subscription.items.data[0]?.price.id;
  
  if (!priceId) {
    console.error(`Missing price ID for subscription: ${subscriptionId}`);
    return;
  }
  
  const tier = getTierFromPriceId(priceId);
  
  // Don't proceed if we can't determine the tier
  if (!tier) {
    console.error(`Unknown price ID received in checkout: ${priceId}`);
    return;
  }

  // Determine billing interval from price
  const price = await stripe.prices.retrieve(priceId);
  const interval = price.recurring?.interval === 'year' ? 'year' : 'month';
  
  // Update subscriptions table
  const { error } = await supabaseAdmin
    .from('subscriptions')
    .upsert({
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      price_id: priceId,
      tier: tier,
      status: subscription.status === 'active' ? 'active' : 'trialing',
      interval: interval,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
    }, {
      onConflict: 'user_id',
    });
  
  if (error) {
    console.error('Database error in handleCheckoutCompleted:', error);
    throw error; // Re-throw to return 500 to Stripe
  }
  
  console.log(`Checkout completed for user ${userId}, tier: ${tier}`);
}

/**
 * Handle subscription changes (created/updated)
 */
async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  // Get user ID from subscription metadata or customer
  let userId = subscription.metadata?.supabase_user_id;
  
  if (!userId) {
    const customer = await stripe.customers.retrieve(customerId);
    if (customer.deleted) return;
    userId = customer.metadata?.supabase_user_id;
  }
  
  if (!userId) {
    // Try to find by customer ID in our database
    const { data } = await supabaseAdmin
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_customer_id', customerId)
      .single();
    
    userId = data?.user_id;
  }
  
  if (!userId) {
    console.error('No user ID found for subscription:', subscription.id);
    return;
  }
  
  const priceId = subscription.items.data[0]?.price.id;
  
  if (!priceId) {
    console.error(`Missing price ID in subscription update: ${subscription.id}`);
    return;
  }
  
  const tier = getTierFromPriceId(priceId);
  
  // Don't proceed if we can't determine the tier
  if (!tier) {
    console.error(`Unknown price ID in subscription update: ${priceId}`);
    return;
  }
  
  // Map Stripe status to our status
  let status: string;
  switch (subscription.status) {
    case 'active':
      status = 'active';
      break;
    case 'trialing':
      status = 'trialing';
      break;
    case 'past_due':
      status = 'past_due';
      break;
    case 'canceled':
    case 'unpaid':
      status = 'canceled';
      break;
    default:
      status = 'active'; // Default to active for other statuses
  }

  // Determine billing interval from price
  const price = await stripe.prices.retrieve(priceId);
  const interval = price.recurring?.interval === 'year' ? 'year' : 'month';
  
  const { error } = await supabaseAdmin
    .from('subscriptions')
    .upsert({
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      price_id: priceId,
      tier: tier,
      status: status,
      interval: interval,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
    }, {
      onConflict: 'user_id',
    });
  
  if (error) {
    console.error('Database error in handleSubscriptionChange:', error);
    throw error;
  }
  
  console.log(`Subscription updated for user ${userId}: ${status}, tier: ${tier}`);
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  // Find user by customer ID
  const { data } = await supabaseAdmin
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single();
  
  if (!data?.user_id) {
    console.error('No user found for canceled subscription:', subscription.id);
    return;
  }
  
  // Downgrade to free tier
  const { error } = await supabaseAdmin
    .from('subscriptions')
    .update({
      tier: 'free',
      status: 'canceled',
      stripe_subscription_id: null,
      price_id: null,
      interval: null,
      cancel_at_period_end: false,
    })
    .eq('user_id', data.user_id);
  
  if (error) {
    console.error('Database error in handleSubscriptionCanceled:', error);
    throw error;
  }
  
  console.log(`Subscription canceled for user ${data.user_id}`);
}

/**
 * Handle successful payment
 */
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  
  // Find user and ensure they're active
  const { data } = await supabaseAdmin
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single();
  
  if (data?.user_id) {
    const { error } = await supabaseAdmin
      .from('subscriptions')
      .update({ status: 'active' })
      .eq('user_id', data.user_id);
    
    if (error) {
      console.error('Database error in handlePaymentSucceeded:', error);
      throw error;
    }
    
    console.log(`Payment succeeded for user ${data.user_id}`);
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  
  // Find user and mark as past_due
  const { data } = await supabaseAdmin
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single();
  
  if (data?.user_id) {
    const { error } = await supabaseAdmin
      .from('subscriptions')
      .update({ status: 'past_due' })
      .eq('user_id', data.user_id);
    
    if (error) {
      console.error('Database error in handlePaymentFailed:', error);
      throw error;
    }
    
    console.log(`Payment failed for user ${data.user_id}`);
  }
}