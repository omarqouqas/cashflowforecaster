// app/api/webhooks/stripe/route.ts
// ============================================
// Stripe Webhook Handler - Fixed for API 2025-11-17.clover
// Period dates are now inside subscription.items.data[0]
// Fixed: Now checks both cancel_at_period_end AND cancel_at timestamp
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
    // In development, try to parse the event without verification if using Stripe CLI
    if (process.env.NODE_ENV === 'development') {
      console.warn('Webhook signature verification failed, parsing without verification (dev mode)');
      try {
        event = JSON.parse(body) as Stripe.Event;
      } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
      }
    } else {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error(`Webhook signature verification failed: ${errorMessage}`);
      return NextResponse.json(
        { error: `Webhook Error: ${errorMessage}` },
        { status: 400 }
      );
    }
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        // Check if this is an invoice payment or subscription checkout
        if (session.metadata?.type === 'invoice_payment') {
          await handleInvoicePaymentCompleted(session);
        } else {
          await handleCheckoutCompleted(session);
        }
        break;
      }

      case 'account.updated': {
        const account = event.data.object as Stripe.Account;
        await handleConnectAccountUpdated(account);
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
 * Extract period dates from subscription object
 * In Stripe API 2025-11-17.clover, dates are inside items.data[0]
 */
function extractPeriodDates(subscription: any): { start: string | null; end: string | null } {
  let startTimestamp: number | null = null;
  let endTimestamp: number | null = null;

  // NEW API (2025-11-17.clover): dates are in items.data[0]
  const firstItem = subscription.items?.data?.[0];
  if (firstItem) {
    if (typeof firstItem.current_period_start === 'number') {
      startTimestamp = firstItem.current_period_start;
    }
    if (typeof firstItem.current_period_end === 'number') {
      endTimestamp = firstItem.current_period_end;
    }
  }

  // FALLBACK: Old API format (dates on subscription object directly)
  if (!startTimestamp && typeof subscription.current_period_start === 'number') {
    startTimestamp = subscription.current_period_start;
  }
  if (!endTimestamp && typeof subscription.current_period_end === 'number') {
    endTimestamp = subscription.current_period_end;
  }

  // FALLBACK 2: Nested current_period object
  if (!startTimestamp && subscription.current_period?.start) {
    startTimestamp = subscription.current_period.start;
  }
  if (!endTimestamp && subscription.current_period?.end) {
    endTimestamp = subscription.current_period.end;
  }

  // Log for debugging
  console.log('Period extraction:', {
    from_items: {
      start: firstItem?.current_period_start,
      end: firstItem?.current_period_end,
    },
    from_root: {
      start: subscription.current_period_start,
      end: subscription.current_period_end,
    },
    extracted: {
      start: startTimestamp,
      end: endTimestamp,
    },
  });

  return {
    start: startTimestamp ? new Date(startTimestamp * 1000).toISOString() : null,
    end: endTimestamp ? new Date(endTimestamp * 1000).toISOString() : null,
  };
}

/**
 * Check if subscription is scheduled for cancellation
 * Stripe uses either cancel_at_period_end (boolean) OR cancel_at (timestamp)
 */
function isSubscriptionCanceling(subscription: any): boolean {
  // Check the boolean flag
  if (subscription.cancel_at_period_end === true) {
    return true;
  }
  // Check if there's a cancel_at timestamp set
  if (subscription.cancel_at !== null && subscription.cancel_at !== undefined) {
    return true;
  }
  return false;
}

/**
 * Handle successful checkout completion
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;
  
  // Get user ID from metadata
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
  
  // Get FULL subscription details from Stripe API with items expanded
  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['items.data'],
  });
  
  const priceId = subscription.items.data[0]?.price.id;
  
  if (!priceId) {
    console.error(`Missing price ID for subscription: ${subscriptionId}`);
    return;
  }
  
  const tier = getTierFromPriceId(priceId);
  
  if (!tier) {
    console.error(`Unknown price ID received in checkout: ${priceId}`);
    return;
  }

  // Get interval from the subscription item's price
  const price = subscription.items.data[0]?.price;
  const interval = price?.recurring?.interval === 'year' ? 'year' : 'month';

  // Extract period dates (now from items.data[0])
  const periodDates = extractPeriodDates(subscription);
  
  // Check if subscription is scheduled for cancellation
  const isCanceling = isSubscriptionCanceling(subscription);
  
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
      current_period_start: periodDates.start,
      current_period_end: periodDates.end,
      cancel_at_period_end: isCanceling,
    }, {
      onConflict: 'user_id',
    });
  
  if (error) {
    console.error('Database error in handleCheckoutCompleted:', error);
    throw error;
  }
  
  console.log(`Checkout completed for user ${userId}, tier: ${tier}, period_end: ${periodDates.end}, canceling: ${isCanceling}`);
}

/**
 * Handle subscription changes (created/updated)
 */
async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  // Get user ID from subscription metadata
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
      status = 'active';
  }

  // Get interval from the subscription item's price
  const price = subscription.items.data[0]?.price;
  const interval = price?.recurring?.interval === 'year' ? 'year' : 'month';

  // Extract period dates (now from items.data[0])
  const periodDates = extractPeriodDates(subscription);
  
  // Check if subscription is scheduled for cancellation
  // Stripe uses either cancel_at_period_end (boolean) OR cancel_at (timestamp)
  const isCanceling = isSubscriptionCanceling(subscription);
  
  console.log('Subscription change detected:', {
    subscriptionId: subscription.id,
    userId,
    status,
    tier,
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancel_at: subscription.cancel_at,
    isCanceling,
  });
  
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
      current_period_start: periodDates.start,
      current_period_end: periodDates.end,
      cancel_at_period_end: isCanceling,
    }, {
      onConflict: 'user_id',
    });
  
  if (error) {
    console.error('Database error in handleSubscriptionChange:', error);
    throw error;
  }
  
  console.log(`Subscription updated for user ${userId}: ${status}, tier: ${tier}, period_end: ${periodDates.end}, canceling: ${isCanceling}`);
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
      current_period_start: null,
      current_period_end: null,
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
  
  // Get subscription ID from invoice
  const subscriptionId = (invoice as any).subscription as string | null;
  
  if (!subscriptionId) {
    console.log('Invoice not associated with a subscription');
    return;
  }
  
  // Find user
  const { data } = await supabaseAdmin
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single();
  
  if (data?.user_id) {
    // Fetch fresh subscription data with items expanded
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['items.data'],
    });
    const periodDates = extractPeriodDates(subscription);
    
    // Check if still canceling (in case they resubscribed)
    const isCanceling = isSubscriptionCanceling(subscription);
    
    const { error } = await supabaseAdmin
      .from('subscriptions')
      .update({ 
        status: 'active',
        current_period_start: periodDates.start,
        current_period_end: periodDates.end,
        cancel_at_period_end: isCanceling,
      })
      .eq('user_id', data.user_id);
    
    if (error) {
      console.error('Database error in handlePaymentSucceeded:', error);
      throw error;
    }
    
    console.log(`Payment succeeded for user ${data.user_id}, period_end: ${periodDates.end}, canceling: ${isCanceling}`);
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

/**
 * Handle invoice payment completed via Stripe Connect
 */
async function handleInvoicePaymentCompleted(session: Stripe.Checkout.Session) {
  const invoiceId = session.metadata?.invoice_id;
  const invoiceNumber = session.metadata?.invoice_number;

  if (!invoiceId) {
    console.error('Invoice payment webhook missing invoice_id in metadata');
    return;
  }

  // Mark invoice as paid
  const { error: invoiceError } = await supabaseAdmin
    .from('invoices')
    .update({
      status: 'paid',
      paid_at: new Date().toISOString(),
      payment_method: 'stripe',
      updated_at: new Date().toISOString(),
    })
    .eq('id', invoiceId);

  if (invoiceError) {
    console.error('Failed to update invoice as paid:', invoiceError);
    throw invoiceError;
  }

  console.log(`Invoice ${invoiceNumber || invoiceId} marked as paid via Stripe`);
}

/**
 * Handle Connect account status updates
 */
async function handleConnectAccountUpdated(account: Stripe.Account) {
  // Determine status
  let status: 'pending' | 'active' | 'restricted' = 'pending';
  if (account.charges_enabled && account.payouts_enabled) {
    status = 'active';
  } else if (account.requirements?.disabled_reason) {
    status = 'restricted';
  } else if (account.details_submitted) {
    status = 'pending'; // Submitted but not yet fully verified
  }

  // Update our database
  const { error } = await supabaseAdmin
    .from('stripe_connect_accounts')
    .update({
      account_status: status,
      charges_enabled: account.charges_enabled ?? false,
      payouts_enabled: account.payouts_enabled ?? false,
      details_submitted: account.details_submitted ?? false,
      onboarding_completed_at: status === 'active' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_account_id', account.id);

  if (error) {
    console.error('Failed to update Connect account status:', error);
    throw error;
  }

  console.log(`Connect account ${account.id} updated to status: ${status}`);
}
