'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { captureServerEvent } from '@/lib/posthog/server';

/**
 * Quick action to set an account as the emergency fund.
 * Enables emergency fund tracking if not already enabled.
 */
export async function setAccountAsEmergencyFund(accountId: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Verify the account belongs to the user and is not a credit card
    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .select('id, name, account_type')
      .eq('id', accountId)
      .eq('user_id', user.id)
      .single();

    if (accountError || !account) {
      return { success: false, error: 'Invalid account' };
    }

    // Credit cards cannot be emergency funds
    if (account.account_type === 'credit_card') {
      return { success: false, error: 'Credit cards cannot be set as emergency fund' };
    }

    // Get current settings to preserve goal_months if already set
    const { data: currentSettings } = await supabase
      .from('user_settings')
      .select('emergency_fund_goal_months')
      .eq('user_id', user.id)
      .single();

    const goalMonths = currentSettings?.emergency_fund_goal_months || 6;

    const { error: dbError } = await supabase
      .from('user_settings')
      .upsert(
        {
          user_id: user.id,
          emergency_fund_enabled: true,
          emergency_fund_goal_months: goalMonths,
          emergency_fund_account_id: accountId,
        },
        { onConflict: 'user_id' }
      );

    if (dbError) {
      console.error('Failed to set emergency fund account:', dbError);
      return { success: false, error: 'Failed to save settings' };
    }

    await captureServerEvent('emergency_fund_account_set', {
      distinctId: user.id,
      properties: {
        account_id: accountId,
        goal_months: goalMonths,
      },
    });

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/accounts');
    revalidatePath('/dashboard/settings');

    return { success: true, accountName: account.name };
  } catch (err) {
    console.error('setAccountAsEmergencyFund error:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

type EmergencyFundSettings = {
  enabled: boolean;
  goalMonths: number;
  accountId: string | null;
};

export async function updateEmergencyFundSettings(data: EmergencyFundSettings) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Validate goal months
    if (![3, 6, 12].includes(data.goalMonths)) {
      return { success: false, error: 'Invalid goal months. Must be 3, 6, or 12.' };
    }

    // If accountId is provided, verify it belongs to the user
    if (data.accountId) {
      const { data: account, error: accountError } = await supabase
        .from('accounts')
        .select('id')
        .eq('id', data.accountId)
        .eq('user_id', user.id)
        .single();

      if (accountError || !account) {
        return { success: false, error: 'Invalid account selected' };
      }
    }

    const { error: dbError } = await supabase
      .from('user_settings')
      .upsert(
        {
          user_id: user.id,
          emergency_fund_enabled: data.enabled,
          emergency_fund_goal_months: data.goalMonths,
          emergency_fund_account_id: data.accountId,
        },
        { onConflict: 'user_id' }
      );

    if (dbError) {
      console.error('Failed to update emergency fund settings:', dbError);
      return { success: false, error: 'Failed to save settings' };
    }

    await captureServerEvent('emergency_fund_settings_updated', {
      distinctId: user.id,
      properties: {
        enabled: data.enabled,
        goal_months: data.goalMonths,
        has_designated_account: !!data.accountId,
      },
    });

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/settings');

    return { success: true };
  } catch (err) {
    console.error('updateEmergencyFundSettings error:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
}
