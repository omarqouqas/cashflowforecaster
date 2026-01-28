import { requireAuth } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'
import { DebtPayoffPlanner } from '@/components/debt-payoff/debt-payoff-planner'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function DebtPayoffPage() {
  const user = await requireAuth()
  const supabase = await createClient()

  // Fetch credit cards with balance > 0
  const { data: accounts, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('user_id', user.id)
    .eq('account_type', 'credit_card')
    .gt('current_balance', 0)
    .order('current_balance', { ascending: true })

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

  // Get currency from the first account, default to USD
  const firstAccount = accounts?.[0] as { currency?: string } | undefined
  const currency = firstAccount?.currency ?? 'USD'

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/dashboard/accounts"
        className="inline-flex items-center text-sm text-zinc-400 hover:text-teal-400 transition-colors group mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Accounts
      </Link>

      <DebtPayoffPlanner cards={creditCards} currency={currency} />
    </div>
  )
}
