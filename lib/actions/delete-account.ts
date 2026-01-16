'use server';

import { revalidatePath } from 'next/cache';

import { requireAuth } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/admin';
import { captureServerEvent } from '@/lib/posthog/server';

/**
 * Deletes a user account and all associated data.
 * This is a destructive operation that cannot be undone.
 *
 * Deletes data from these tables (in order):
 * 1. invoice_reminders
 * 2. invoices
 * 3. income
 * 4. bills
 * 5. imported_transactions
 * 6. scenarios
 * 7. accounts
 * 8. subscriptions
 * 9. user_settings
 * 10. feedback
 * 11. auth.users (CASCADE will handle remaining public.users)
 */
export async function deleteAccount(): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requireAuth();
    const supabase = createAdminClient();

    // Track deletion attempt
    await captureServerEvent('account_deletion_initiated', {
      distinctId: user.id,
      properties: {
        email: user.email,
      },
    });

    // Delete all user data in order of dependencies
    // Note: Most tables have CASCADE delete configured, but we delete explicitly for safety

    // 1. Delete invoice reminders (depends on invoices)
    const { error: remindersError } = await supabase
      .from('invoice_reminders')
      .delete()
      .eq('user_id', user.id);

    if (remindersError) {
      console.error('Error deleting invoice_reminders:', remindersError);
      // Continue anyway - this is not critical
    }

    // 2. Delete invoices (referenced by income records)
    const { error: invoicesError } = await supabase
      .from('invoices')
      .delete()
      .eq('user_id', user.id);

    if (invoicesError) {
      console.error('Error deleting invoices:', invoicesError);
      return { success: false, error: 'Failed to delete invoices' };
    }

    // 3. Delete income records
    const { error: incomeError } = await supabase
      .from('income')
      .delete()
      .eq('user_id', user.id);

    if (incomeError) {
      console.error('Error deleting income:', incomeError);
      return { success: false, error: 'Failed to delete income records' };
    }

    // 4. Delete bills
    const { error: billsError } = await supabase
      .from('bills')
      .delete()
      .eq('user_id', user.id);

    if (billsError) {
      console.error('Error deleting bills:', billsError);
      return { success: false, error: 'Failed to delete bills' };
    }

    // 5. Delete imported transactions
    const { error: transactionsError } = await supabase
      .from('imported_transactions')
      .delete()
      .eq('user_id', user.id);

    if (transactionsError) {
      console.error('Error deleting imported_transactions:', transactionsError);
      // Continue anyway - this is not critical
    }

    // 6. Delete scenarios
    const { error: scenariosError } = await supabase
      .from('scenarios')
      .delete()
      .eq('user_id', user.id);

    if (scenariosError) {
      console.error('Error deleting scenarios:', scenariosError);
      // Continue anyway - this is not critical
    }

    // 7. Delete accounts
    const { error: accountsError } = await supabase
      .from('accounts')
      .delete()
      .eq('user_id', user.id);

    if (accountsError) {
      console.error('Error deleting accounts:', accountsError);
      return { success: false, error: 'Failed to delete accounts' };
    }

    // 8. Delete subscriptions
    const { error: subscriptionsError } = await supabase
      .from('subscriptions')
      .delete()
      .eq('user_id', user.id);

    if (subscriptionsError) {
      console.error('Error deleting subscriptions:', subscriptionsError);
      // Continue anyway - this is not critical
    }

    // 9. Delete user settings
    const { error: settingsError } = await supabase
      .from('user_settings')
      .delete()
      .eq('user_id', user.id);

    if (settingsError) {
      console.error('Error deleting user_settings:', settingsError);
      // Continue anyway - this is not critical
    }

    // 10. Delete feedback (if any - this uses SET NULL but we'll delete it)
    const { error: feedbackError } = await supabase
      .from('feedback')
      .delete()
      .eq('user_id', user.id);

    if (feedbackError) {
      console.error('Error deleting feedback:', feedbackError);
      // Continue anyway - this is not critical
    }

    // 11. Delete the auth user (this will CASCADE to public.users)
    // Using admin client which has service_role privileges
    const { error: authError } = await supabase.auth.admin.deleteUser(user.id);

    if (authError) {
      console.error('Error deleting auth user:', authError);
      return { success: false, error: 'Failed to delete user account. Please contact support.' };
    }

    // Track successful deletion
    await captureServerEvent('account_deleted', {
      distinctId: user.id,
      properties: {
        email: user.email,
      },
    });

    // Clear any cached paths
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/settings');

    return { success: true };
  } catch (e: any) {
    console.error('Unexpected error during account deletion:', e);
    return { success: false, error: e?.message ?? 'Failed to delete account' };
  }
}
