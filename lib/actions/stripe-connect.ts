'use server';

import { requireAuth } from '@/lib/auth/session';
import { getUserSubscription } from '@/lib/stripe/subscription';
import {
  createConnectAccount,
  createAccountLink,
  getConnectAccount,
  refreshAccountStatus,
  disconnectConnectAccount,
  type ConnectAccount,
} from '@/lib/stripe/connect';
import { revalidatePath } from 'next/cache';

export type ConnectResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

/**
 * Start Stripe Connect onboarding flow
 * Returns a URL to redirect the user to Stripe's onboarding
 */
export async function initiateStripeConnect(): Promise<ConnectResult<{ onboardingUrl: string }>> {
  try {
    const user = await requireAuth();

    // Check if user has Pro subscription
    const subscription = await getUserSubscription(user.id);
    if (subscription.tier === 'free') {
      return { ok: false, error: 'Stripe Connect is only available for Pro subscribers' };
    }

    // Check if user already has a Connect account
    const existingAccount = await getConnectAccount(user.id);
    if (existingAccount) {
      // If account exists but onboarding incomplete, get new onboarding link
      if (existingAccount.accountStatus !== 'active') {
        const onboardingUrl = await createAccountLink(existingAccount.stripeAccountId);
        return { ok: true, data: { onboardingUrl } };
      }
      return { ok: false, error: 'You already have a connected Stripe account' };
    }

    // Create new Connect account
    const { onboardingUrl } = await createConnectAccount(user.id, user.email || '');

    return { ok: true, data: { onboardingUrl } };
  } catch (e) {
    console.error('initiateStripeConnect failed:', e);
    return { ok: false, error: 'Failed to start Stripe Connect setup. Please try again.' };
  }
}

/**
 * Get the current user's Connect account status
 */
export async function getConnectStatus(): Promise<ConnectResult<ConnectAccount | null>> {
  try {
    const user = await requireAuth();

    // Check if user has Pro subscription
    const subscription = await getUserSubscription(user.id);
    if (subscription.tier === 'free') {
      return { ok: true, data: null };
    }

    const account = await getConnectAccount(user.id);
    return { ok: true, data: account };
  } catch (e) {
    console.error('getConnectStatus failed:', e);
    return { ok: false, error: 'Failed to get Stripe Connect status' };
  }
}

/**
 * Refresh Connect account status from Stripe
 */
export async function refreshConnectStatus(): Promise<ConnectResult<ConnectAccount | null>> {
  try {
    const user = await requireAuth();

    const account = await getConnectAccount(user.id);
    if (!account) {
      return { ok: true, data: null };
    }

    const updated = await refreshAccountStatus(account.stripeAccountId);
    revalidatePath('/dashboard/settings');

    return { ok: true, data: updated };
  } catch (e) {
    console.error('refreshConnectStatus failed:', e);
    return { ok: false, error: 'Failed to refresh Stripe Connect status' };
  }
}

/**
 * Disconnect Stripe Connect account
 */
export async function disconnectStripeConnect(): Promise<ConnectResult> {
  try {
    const user = await requireAuth();

    const success = await disconnectConnectAccount(user.id);
    if (!success) {
      return { ok: false, error: 'Failed to disconnect Stripe account' };
    }

    revalidatePath('/dashboard/settings');
    return { ok: true, data: undefined };
  } catch (e) {
    console.error('disconnectStripeConnect failed:', e);
    return { ok: false, error: 'Failed to disconnect Stripe account. Please try again.' };
  }
}

/**
 * Get a fresh onboarding link for incomplete setup
 */
export async function getOnboardingLink(): Promise<ConnectResult<{ onboardingUrl: string }>> {
  try {
    const user = await requireAuth();

    const account = await getConnectAccount(user.id);
    if (!account) {
      return { ok: false, error: 'No Stripe Connect account found' };
    }

    if (account.accountStatus === 'active') {
      return { ok: false, error: 'Your Stripe account is already fully set up' };
    }

    const onboardingUrl = await createAccountLink(account.stripeAccountId);
    return { ok: true, data: { onboardingUrl } };
  } catch (e) {
    console.error('getOnboardingLink failed:', e);
    return { ok: false, error: 'Failed to get onboarding link. Please try again.' };
  }
}
