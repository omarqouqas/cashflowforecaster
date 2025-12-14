'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth/session'
import type { Tables } from '@/types/supabase'

export type OnboardingAccountInput = {
  name: string
  account_type: 'checking' | 'savings'
  current_balance: number
  currency?: string
  is_spendable?: boolean
}

export type OnboardingIncomeInput = {
  name: string
  amount: number
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'one-time'
  next_date: string // YYYY-MM-DD
}

export type OnboardingBillInput = {
  name: string
  amount: number
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually' | 'one-time'
  due_date: string // YYYY-MM-DD
  category?: string
}

export async function onboardingCreateAccount(
  input: OnboardingAccountInput
): Promise<{ account: Tables<'accounts'> } | { error: string }> {
  try {
    const user = await requireAuth()
    const supabase = await createClient()

    const name = (input.name || '').trim()
    if (!name) return { error: 'Account name is required.' }

    if (!Number.isFinite(input.current_balance)) {
      return { error: 'Current balance is required.' }
    }

    const { data, error } = await supabase
      .from('accounts')
      .insert({
        user_id: user.id,
        name,
        account_type: input.account_type,
        current_balance: input.current_balance,
        currency: input.currency ?? 'USD',
        is_spendable: input.is_spendable ?? true,
      })
      .select('*')
      .single()

    if (error) return { error: error.message }

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/calendar')

    return { account: data }
  } catch (e: any) {
    return { error: e?.message ?? 'Failed to create account.' }
  }
}

export async function onboardingCreateIncomes(
  inputs: OnboardingIncomeInput[]
): Promise<{ incomes: Tables<'income'>[] } | { error: string }> {
  try {
    const user = await requireAuth()
    const supabase = await createClient()

    if (!Array.isArray(inputs) || inputs.length === 0) {
      return { incomes: [] }
    }

    const cleaned = inputs
      .map((i) => ({
        name: (i.name || '').trim(),
        amount: i.amount,
        frequency: i.frequency,
        next_date: i.next_date,
      }))
      .filter((i) => i.name || Number.isFinite(i.amount) || i.next_date)

    // If user added a row, require it to be valid.
    for (const i of cleaned) {
      if (!i.name) return { error: 'Income name is required.' }
      if (!Number.isFinite(i.amount) || i.amount <= 0) return { error: 'Income amount must be positive.' }
      if (!i.next_date) return { error: 'Next payment date is required.' }
    }

    if (cleaned.length === 0) return { incomes: [] }

    const { data, error } = await supabase
      .from('income')
      .insert(
        cleaned.map((i) => ({
          user_id: user.id,
          name: i.name,
          amount: i.amount,
          frequency: i.frequency,
          next_date: i.next_date,
          status: 'active',
          is_active: true,
          account_id: null,
        }))
      )
      .select('*')

    if (error) return { error: error.message }

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/calendar')

    return { incomes: data ?? [] }
  } catch (e: any) {
    return { error: e?.message ?? 'Failed to create income.' }
  }
}

export async function onboardingCreateBills(
  inputs: OnboardingBillInput[]
): Promise<{ bills: Tables<'bills'>[] } | { error: string }> {
  try {
    const user = await requireAuth()
    const supabase = await createClient()

    if (!Array.isArray(inputs) || inputs.length === 0) {
      return { bills: [] }
    }

    const cleaned = inputs
      .map((b) => ({
        name: (b.name || '').trim(),
        amount: b.amount,
        frequency: b.frequency,
        due_date: b.due_date,
        category: b.category ?? 'other',
      }))
      .filter((b) => b.name || Number.isFinite(b.amount) || b.due_date)

    for (const b of cleaned) {
      if (!b.name) return { error: 'Bill name is required.' }
      if (!Number.isFinite(b.amount) || b.amount <= 0) return { error: 'Bill amount must be positive.' }
      if (!b.due_date) return { error: 'Bill due date is required.' }
    }

    if (cleaned.length === 0) return { bills: [] }

    const { data, error } = await supabase
      .from('bills')
      .insert(
        cleaned.map((b) => ({
          user_id: user.id,
          name: b.name,
          amount: b.amount,
          due_date: b.due_date,
          frequency: b.frequency,
          category: b.category,
          is_active: true,
        }))
      )
      .select('*')

    if (error) return { error: error.message }

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/calendar')

    return { bills: data ?? [] }
  } catch (e: any) {
    return { error: e?.message ?? 'Failed to create bills.' }
  }
}

export async function onboardingMarkComplete(): Promise<{ ok: true } | { error: string }> {
  try {
    const user = await requireAuth()
    const supabase = await createClient()

    // Mark complete in user_settings (this table is already writable by the user in-app).
    const { error } = await supabase
      .from('user_settings')
      .upsert(
        {
          user_id: user.id,
          onboarding_complete: true,
        },
        {
          onConflict: 'user_id',
        }
      )

    if (error) return { error: error.message }

    revalidatePath('/dashboard')
    revalidatePath('/onboarding')

    return { ok: true }
  } catch (e: any) {
    return { error: e?.message ?? 'Failed to complete onboarding.' }
  }
}
