// lib/stripe/connect.ts
// ============================================
// Stripe Connect for Invoice Payment Links (SERVER-ONLY)
// ============================================

import 'server-only';
import { stripe, getURL } from './client';
import { createAdminClient } from '@/lib/supabase/admin';

export interface ConnectAccount {
  id: string;
  userId: string;
  stripeAccountId: string;
  accountStatus: 'pending' | 'active' | 'restricted';
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  onboardingCompletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create a new Stripe Connect Express account for a user
 */
export async function createConnectAccount(userId: string, email: string): Promise<{
  account: ConnectAccount;
  onboardingUrl: string;
}> {
  // Create Stripe Express account
  const stripeAccount = await stripe.accounts.create({
    type: 'express',
    email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    metadata: {
      user_id: userId,
    },
  });

  // Save to database
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('stripe_connect_accounts')
    .insert({
      user_id: userId,
      stripe_account_id: stripeAccount.id,
      account_status: 'pending',
      charges_enabled: false,
      payouts_enabled: false,
      details_submitted: false,
    })
    .select()
    .single();

  if (error) {
    // If insert failed, try to delete the Stripe account we just created
    try {
      await stripe.accounts.del(stripeAccount.id);
    } catch {
      // Ignore deletion errors
    }
    throw new Error(`Failed to save Connect account: ${error.message}`);
  }

  // Create onboarding link
  const accountLink = await stripe.accountLinks.create({
    account: stripeAccount.id,
    refresh_url: `${getURL()}/dashboard/settings?connect=refresh`,
    return_url: `${getURL()}/dashboard/settings?connect=success`,
    type: 'account_onboarding',
  });

  return {
    account: mapDbToConnectAccount(data),
    onboardingUrl: accountLink.url,
  };
}

/**
 * Create an account link for completing/refreshing onboarding
 */
export async function createAccountLink(stripeAccountId: string): Promise<string> {
  const accountLink = await stripe.accountLinks.create({
    account: stripeAccountId,
    refresh_url: `${getURL()}/dashboard/settings?connect=refresh`,
    return_url: `${getURL()}/dashboard/settings?connect=success`,
    type: 'account_onboarding',
  });

  return accountLink.url;
}

/**
 * Get a user's Connect account from the database
 */
export async function getConnectAccount(userId: string): Promise<ConnectAccount | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('stripe_connect_accounts')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  return mapDbToConnectAccount(data);
}

/**
 * Refresh account status from Stripe and update database
 */
export async function refreshAccountStatus(stripeAccountId: string): Promise<ConnectAccount | null> {
  // Fetch latest from Stripe
  const stripeAccount = await stripe.accounts.retrieve(stripeAccountId);

  // Determine status
  let status: 'pending' | 'active' | 'restricted' = 'pending';
  if (stripeAccount.charges_enabled && stripeAccount.payouts_enabled) {
    status = 'active';
  } else if (stripeAccount.requirements?.disabled_reason) {
    status = 'restricted';
  } else if (stripeAccount.details_submitted) {
    status = 'pending'; // Submitted but not yet fully verified
  }

  // Update database
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('stripe_connect_accounts')
    .update({
      account_status: status,
      charges_enabled: stripeAccount.charges_enabled ?? false,
      payouts_enabled: stripeAccount.payouts_enabled ?? false,
      details_submitted: stripeAccount.details_submitted ?? false,
      onboarding_completed_at: status === 'active' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_account_id', stripeAccountId)
    .select()
    .single();

  if (error || !data) {
    return null;
  }

  return mapDbToConnectAccount(data);
}

/**
 * Delete/disconnect a Connect account
 */
export async function disconnectConnectAccount(userId: string): Promise<boolean> {
  const supabase = createAdminClient();

  // Get the account first
  const { data: account } = await supabase
    .from('stripe_connect_accounts')
    .select('stripe_account_id')
    .eq('user_id', userId)
    .single();

  if (!account) {
    return false;
  }

  // Delete from Stripe (this revokes the connection)
  try {
    await stripe.accounts.del(account.stripe_account_id);
  } catch (err) {
    // Account might already be deleted on Stripe's side
    console.error('Error deleting Stripe account:', err);
  }

  // Delete from database
  const { error } = await supabase
    .from('stripe_connect_accounts')
    .delete()
    .eq('user_id', userId);

  return !error;
}

/**
 * Create a Checkout session for invoice payment
 */
export async function createInvoiceCheckoutSession(params: {
  invoiceId: string;
  invoiceNumber: string;
  amount: number; // in cents
  clientEmail: string;
  clientName: string;
  connectAccountId: string;
  description?: string;
}): Promise<{ url: string; sessionId: string }> {
  const { invoiceId, invoiceNumber, amount, clientEmail, clientName, connectAccountId, description } = params;

  // Create checkout session with 100% going to connected account (no platform fee)
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: clientEmail,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Invoice ${invoiceNumber}`,
            description: description || `Payment for Invoice ${invoiceNumber}`,
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    payment_intent_data: {
      // All funds go to connected account (no application fee)
      transfer_data: {
        destination: connectAccountId,
      },
      metadata: {
        invoice_id: invoiceId,
        invoice_number: invoiceNumber,
        client_name: clientName,
      },
    },
    metadata: {
      invoice_id: invoiceId,
      invoice_number: invoiceNumber,
      type: 'invoice_payment',
    },
    success_url: `${getURL()}/pay/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${getURL()}/pay/cancelled`,
  });

  if (!session.url) {
    throw new Error('Failed to create checkout session URL');
  }

  return {
    url: session.url,
    sessionId: session.id,
  };
}

/**
 * Verify a checkout session and return invoice details
 */
export async function verifyCheckoutSession(sessionId: string): Promise<{
  invoiceId: string;
  invoiceNumber: string;
  paid: boolean;
  amount: number;
  clientEmail: string | null;
} | null> {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent'],
    });

    if (!session.metadata?.invoice_id) {
      return null;
    }

    return {
      invoiceId: session.metadata.invoice_id,
      invoiceNumber: session.metadata.invoice_number || '',
      paid: session.payment_status === 'paid',
      amount: session.amount_total || 0,
      clientEmail: session.customer_email,
    };
  } catch {
    return null;
  }
}

// Helper to map database row to ConnectAccount type
function mapDbToConnectAccount(data: any): ConnectAccount {
  return {
    id: data.id,
    userId: data.user_id,
    stripeAccountId: data.stripe_account_id,
    accountStatus: data.account_status,
    chargesEnabled: data.charges_enabled,
    payoutsEnabled: data.payouts_enabled,
    detailsSubmitted: data.details_submitted,
    onboardingCompletedAt: data.onboarding_completed_at,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}
