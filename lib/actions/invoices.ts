'use server';

import { requireAuth } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import type { Tables } from '@/types/supabase';

export type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'paid';

export type CreateInvoiceInput = {
  invoice_number?: string | null;
  client_name: string;
  client_email?: string | null;
  amount: number;
  due_date: string; // YYYY-MM-DD
  description?: string | null;
};

export type UpdateInvoiceInput = {
  invoice_number?: string | null;
  client_name: string;
  client_email?: string | null;
  amount: number;
  due_date: string; // YYYY-MM-DD
  description?: string | null;
};

function nextInvoiceNumberFromLast(last?: string | null) {
  // Expected pattern: INV-0001, but we handle unknown formats gracefully.
  const match = (last ?? '').match(/(\d+)\s*$/);
  const lastNum = match ? Number.parseInt(match[1]!, 10) : 0;
  const nextNum = Number.isFinite(lastNum) ? lastNum + 1 : 1;
  return `INV-${String(nextNum).padStart(4, '0')}`;
}

export async function getInvoices(): Promise<Tables<'invoices'>[]> {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createInvoice(input: CreateInvoiceInput): Promise<{ id: string }> {
  const user = await requireAuth();
  const supabase = await createClient();

  const requestedInvoiceNumber = input.invoice_number?.trim() || null;

  // Generate invoice_number (fallback)
  const { data: lastInvoice, error: lastErr } = await supabase
    .from('invoices')
    .select('invoice_number')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (lastErr) throw new Error(lastErr.message);
  const generatedInvoiceNumber = nextInvoiceNumberFromLast(lastInvoice?.invoice_number);
  const invoice_number = requestedInvoiceNumber ?? generatedInvoiceNumber;

  // 1) Create invoice
  const { data: invoice, error: invoiceErr } = await supabase
    .from('invoices')
    .insert({
      user_id: user.id,
      invoice_number,
      client_name: input.client_name,
      client_email: input.client_email || null,
      amount: input.amount,
      due_date: input.due_date,
      description: input.description || null,
      status: 'draft',
    })
    .select('id, invoice_number')
    .single();

  if (invoiceErr) throw new Error(invoiceErr.message);

  // If the DB has a trigger that auto-sets invoice_number on INSERT, it may overwrite
  // the user's provided invoice number. Enforce the requested value after insert.
  if (requestedInvoiceNumber && invoice.invoice_number !== requestedInvoiceNumber) {
    const { error: enforceErr } = await supabase
      .from('invoices')
      .update({ invoice_number: requestedInvoiceNumber })
      .eq('id', invoice.id)
      .eq('user_id', user.id);

    if (enforceErr) {
      await supabase.from('invoices').delete().eq('id', invoice.id).eq('user_id', user.id);
      throw new Error(enforceErr.message);
    }
  }

  // 2) Create linked income entry (transaction-like: delete invoice on failure)
  const { error: incomeErr } = await supabase.from('income').insert({
    user_id: user.id,
    name: `Invoice: ${input.client_name}`,
    amount: input.amount,
    frequency: 'one-time',
    next_date: input.due_date,
    status: 'pending',
    invoice_id: invoice.id,
    is_active: true,
    notes: input.description || null,
  });

  if (incomeErr) {
    await supabase.from('invoices').delete().eq('id', invoice.id).eq('user_id', user.id);
    throw new Error(incomeErr.message);
  }

  return { id: invoice.id };
}

export async function updateInvoiceStatus(id: string, status: InvoiceStatus) {
  const user = await requireAuth();
  const supabase = await createClient();

  const updates: Partial<Tables<'invoices'>> = { status };
  if (status === 'paid') {
    updates.paid_at = new Date().toISOString();
  }

  const { error: invoiceErr } = await supabase
    .from('invoices')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id);

  if (invoiceErr) throw new Error(invoiceErr.message);

  if (status === 'paid') {
    const { error: incomeErr } = await supabase
      .from('income')
      .update({
        status: 'confirmed',
        status_updated_at: new Date().toISOString(),
      })
      .eq('invoice_id', id)
      .eq('user_id', user.id);

    if (incomeErr) throw new Error(incomeErr.message);
  }
}

export async function getInvoice(id: string): Promise<Tables<'invoices'> | null> {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ?? null;
}

export async function updateInvoice(id: string, input: UpdateInvoiceInput): Promise<void> {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data: invoice, error: invErr } = await supabase
    .from('invoices')
    .select('id, status, invoice_number')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (invErr) throw new Error(invErr.message);
  if (!invoice) throw new Error('Invoice not found');

  const status = (invoice.status ?? 'draft') as InvoiceStatus;
  if (status === 'paid') {
    throw new Error('Paid invoices cannot be edited');
  }

  // Prevent accidentally wiping invoice_number; keep existing if blank.
  const invoice_number = input.invoice_number?.trim() || invoice.invoice_number;

  const { error: updateInvoiceErr } = await supabase
    .from('invoices')
    .update({
      invoice_number,
      client_name: input.client_name,
      client_email: input.client_email || null,
      amount: input.amount,
      due_date: input.due_date,
      description: input.description || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (updateInvoiceErr) throw new Error(updateInvoiceErr.message);

  // Keep linked income entry in sync.
  const { data: linkedIncome, error: linkedIncomeErr } = await supabase
    .from('income')
    .select('id')
    .eq('invoice_id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (linkedIncomeErr) throw new Error(linkedIncomeErr.message);

  if (linkedIncome?.id) {
    const { error: incomeUpdateErr } = await supabase
      .from('income')
      .update({
        name: `Invoice: ${input.client_name}`,
        amount: input.amount,
        next_date: input.due_date,
        notes: input.description || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', linkedIncome.id)
      .eq('user_id', user.id);

    if (incomeUpdateErr) throw new Error(incomeUpdateErr.message);
  } else {
    const { error: incomeInsertErr } = await supabase.from('income').insert({
      user_id: user.id,
      name: `Invoice: ${input.client_name}`,
      amount: input.amount,
      frequency: 'one-time',
      next_date: input.due_date,
      status: 'pending',
      invoice_id: id,
      is_active: true,
      notes: input.description || null,
    });

    if (incomeInsertErr) throw new Error(incomeInsertErr.message);
  }
}

export async function deleteInvoice(id: string): Promise<void> {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data: invoice, error: invErr } = await supabase
    .from('invoices')
    .select('id, status')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (invErr) throw new Error(invErr.message);
  if (!invoice) throw new Error('Invoice not found');

  const status = (invoice.status ?? 'draft') as InvoiceStatus;
  if (status !== 'draft') {
    throw new Error('Only draft invoices can be deleted');
  }

  // Delete linked income entry first (or rely on FK cascade if configured).
  const { error: incomeErr } = await supabase
    .from('income')
    .delete()
    .eq('invoice_id', id)
    .eq('user_id', user.id);

  if (incomeErr) throw new Error(incomeErr.message);

  const { error: invoiceErr } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (invoiceErr) throw new Error(invoiceErr.message);
}

export async function getInvoiceSummary(): Promise<{
  unpaidCount: number;
  totalOutstanding: number;
  overdueCount: number;
}> {
  const user = await requireAuth();
  const supabase = await createClient();

  // Treat NULL status as unpaid (draft).
  const { data, error } = await supabase
    .from('invoices')
    .select('amount, due_date, status')
    .eq('user_id', user.id)
    .or('status.is.null,status.neq.paid');

  if (error) throw new Error(error.message);

  const invoices = data ?? [];
  const unpaidCount = invoices.length;
  const totalOutstanding = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);

  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const overdueCount = invoices.reduce((count, inv) => {
    if (!inv.due_date) return count;
    const due = new Date(`${inv.due_date}T00:00:00`);
    return due < todayMidnight ? count + 1 : count;
  }, 0);

  return { unpaidCount, totalOutstanding, overdueCount };
}


