'use server';

import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { Tables } from '@/types/supabase';

export type Transfer = Tables<'transfers'>;

export type TransferFrequency = 'one-time' | 'weekly' | 'biweekly' | 'semi-monthly' | 'monthly' | 'quarterly' | 'annually';

export interface CreateTransferInput {
  from_account_id: string;
  to_account_id: string;
  amount: number;
  description?: string;
  transfer_date: string;
  frequency: TransferFrequency;
  recurrence_day?: number;
}

export interface UpdateTransferInput {
  id: string;
  from_account_id?: string;
  to_account_id?: string;
  amount?: number;
  description?: string;
  transfer_date?: string;
  frequency?: TransferFrequency;
  recurrence_day?: number;
  is_active?: boolean;
}

/**
 * Creates a new transfer between accounts.
 */
export async function createTransfer(
  input: CreateTransferInput
): Promise<{ success: boolean; data?: Transfer; error?: string }> {
  try {
    const user = await requireAuth();
    const supabase = await createClient();

    // Validate that accounts belong to the user
    const { data: accounts, error: accountsError } = await supabase
      .from('accounts')
      .select('id')
      .eq('user_id', user.id)
      .in('id', [input.from_account_id, input.to_account_id]);

    if (accountsError || !accounts || accounts.length !== 2) {
      return { success: false, error: 'Invalid accounts selected' };
    }

    // Create the transfer
    const { data, error } = await supabase
      .from('transfers')
      .insert({
        user_id: user.id,
        from_account_id: input.from_account_id,
        to_account_id: input.to_account_id,
        amount: input.amount,
        description: input.description || null,
        transfer_date: input.transfer_date,
        frequency: input.frequency,
        recurrence_day: input.recurrence_day || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating transfer:', error);
      return { success: false, error: 'Failed to create transfer' };
    }

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/transfers');
    revalidatePath('/dashboard/accounts');
    revalidatePath('/dashboard/calendar');

    return { success: true, data };
  } catch (e: any) {
    console.error('Unexpected error creating transfer:', e);
    return { success: false, error: e?.message ?? 'Failed to create transfer' };
  }
}

/**
 * Updates an existing transfer.
 */
export async function updateTransfer(
  input: UpdateTransferInput
): Promise<{ success: boolean; data?: Transfer; error?: string }> {
  try {
    const user = await requireAuth();
    const supabase = await createClient();

    // Verify the transfer belongs to the user
    const { data: existing, error: existingError } = await supabase
      .from('transfers')
      .select('id')
      .eq('id', input.id)
      .eq('user_id', user.id)
      .single();

    if (existingError || !existing) {
      return { success: false, error: 'Transfer not found' };
    }

    // If accounts are being changed, validate they belong to the user
    if (input.from_account_id || input.to_account_id) {
      const accountIds = [input.from_account_id, input.to_account_id].filter(Boolean) as string[];
      const { data: accounts, error: accountsError } = await supabase
        .from('accounts')
        .select('id')
        .eq('user_id', user.id)
        .in('id', accountIds);

      if (accountsError || !accounts || accounts.length !== accountIds.length) {
        return { success: false, error: 'Invalid accounts selected' };
      }
    }

    // Build update object
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (input.from_account_id !== undefined) updateData.from_account_id = input.from_account_id;
    if (input.to_account_id !== undefined) updateData.to_account_id = input.to_account_id;
    if (input.amount !== undefined) updateData.amount = input.amount;
    if (input.description !== undefined) updateData.description = input.description || null;
    if (input.transfer_date !== undefined) updateData.transfer_date = input.transfer_date;
    if (input.frequency !== undefined) updateData.frequency = input.frequency;
    if (input.recurrence_day !== undefined) updateData.recurrence_day = input.recurrence_day || null;
    if (input.is_active !== undefined) updateData.is_active = input.is_active;

    const { data, error } = await supabase
      .from('transfers')
      .update(updateData)
      .eq('id', input.id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating transfer:', error);
      return { success: false, error: 'Failed to update transfer' };
    }

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/transfers');
    revalidatePath('/dashboard/accounts');
    revalidatePath('/dashboard/calendar');

    return { success: true, data };
  } catch (e: any) {
    console.error('Unexpected error updating transfer:', e);
    return { success: false, error: e?.message ?? 'Failed to update transfer' };
  }
}

/**
 * Deletes a transfer.
 */
export async function deleteTransfer(
  transferId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requireAuth();
    const supabase = await createClient();

    const { error } = await supabase
      .from('transfers')
      .delete()
      .eq('id', transferId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting transfer:', error);
      return { success: false, error: 'Failed to delete transfer' };
    }

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/transfers');
    revalidatePath('/dashboard/accounts');
    revalidatePath('/dashboard/calendar');

    return { success: true };
  } catch (e: any) {
    console.error('Unexpected error deleting transfer:', e);
    return { success: false, error: e?.message ?? 'Failed to delete transfer' };
  }
}

/**
 * Gets all transfers for the current user.
 */
export async function getTransfers(): Promise<{
  success: boolean;
  data?: (Transfer & { from_account: { name: string; account_type: string | null }; to_account: { name: string; account_type: string | null } })[];
  error?: string
}> {
  try {
    const user = await requireAuth();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('transfers')
      .select(`
        *,
        from_account:accounts!transfers_from_account_id_fkey(name, account_type),
        to_account:accounts!transfers_to_account_id_fkey(name, account_type)
      `)
      .eq('user_id', user.id)
      .order('transfer_date', { ascending: true });

    if (error) {
      console.error('Error fetching transfers:', error);
      return { success: false, error: 'Failed to fetch transfers' };
    }

    return { success: true, data: data as any };
  } catch (e: any) {
    console.error('Unexpected error fetching transfers:', e);
    return { success: false, error: e?.message ?? 'Failed to fetch transfers' };
  }
}

/**
 * Gets a single transfer by ID.
 */
export async function getTransfer(
  transferId: string
): Promise<{
  success: boolean;
  data?: Transfer & { from_account: { name: string; account_type: string | null }; to_account: { name: string; account_type: string | null } };
  error?: string
}> {
  try {
    const user = await requireAuth();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('transfers')
      .select(`
        *,
        from_account:accounts!transfers_from_account_id_fkey(name, account_type),
        to_account:accounts!transfers_to_account_id_fkey(name, account_type)
      `)
      .eq('id', transferId)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching transfer:', error);
      return { success: false, error: 'Transfer not found' };
    }

    return { success: true, data: data as any };
  } catch (e: any) {
    console.error('Unexpected error fetching transfer:', e);
    return { success: false, error: e?.message ?? 'Failed to fetch transfer' };
  }
}

/**
 * Gets upcoming transfers for the dashboard.
 */
export async function getUpcomingTransfers(limit: number = 5): Promise<{
  success: boolean;
  data?: (Transfer & { from_account: { name: string; account_type: string | null }; to_account: { name: string; account_type: string | null } })[];
  error?: string;
}> {
  try {
    const user = await requireAuth();
    const supabase = await createClient();

    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('transfers')
      .select(`
        *,
        from_account:accounts!transfers_from_account_id_fkey(name, account_type),
        to_account:accounts!transfers_to_account_id_fkey(name, account_type)
      `)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .gte('transfer_date', today)
      .order('transfer_date', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching upcoming transfers:', error);
      return { success: false, error: 'Failed to fetch upcoming transfers' };
    }

    return { success: true, data: data as any };
  } catch (e: any) {
    console.error('Unexpected error fetching upcoming transfers:', e);
    return { success: false, error: e?.message ?? 'Failed to fetch upcoming transfers' };
  }
}
