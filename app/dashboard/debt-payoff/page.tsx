import { requireAuth } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'
import { DebtPayoffPlanner } from '@/components/debt-payoff/debt-payoff-planner'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function DebtPayoffPage() {
  const user = await requireAuth()
  const supabase = await createClient()

  // Fetch credit cards with balance > 0, user settings, and total count in parallel
  const [accountsResult, settingsResult, countResult] = await Promise.all([
    supabase
      .from('accounts')
      .select('*')
      .eq('user_id', user.id)
      .eq('account_type', 'credit_card')
      .gt('current_balance', 0)
      .order('current_balance', { ascending: true }),
    supabase
      .from('user_settings')
      .select('currency')
      .eq('user_id', user.id)
      .single(),
    // Also get total count of all credit cards (regardless of balance)
    // to distinguish "no cards added" from "all cards paid off"
    supabase
      .from('accounts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('account_type', 'credit_card'),
  ])

  const { data: accounts, error } = accountsResult
  const totalCreditCards = countResult.count

  if (error) {
    console.error('Error fetching credit cards:', error)
  }

  // Transform to the format expected by the planner
  const creditCards = (accounts ?? []).map((account: any) => ({
    id: account.id,
    name: account.name,
    balance: account.current_balance,
    apr: account.apr ?? 0,
    minimumPaymentPercent: account.minimum_payment_percent ?? 2,
    creditLimit: account.credit_limit ?? null,
  }))

  // Get currency from user settings
  const currency = settingsResult.data?.currency ?? 'USD'

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/dashboard/accounts"
        className="inline-flex items-center text-sm text-zinc-400 hover:text-teal-400 transition-colors group mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Accounts
      </Link>

      <DebtPayoffPlanner
        cards={creditCards}
        currency={currency}
        totalCreditCardCount={totalCreditCards ?? 0}
      />
    </div>
  )
}
