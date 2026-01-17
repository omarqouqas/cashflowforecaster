'use client'

import type { Tables } from '@/types/supabase'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-react'
import { formatCurrency, formatRelativeTime } from '@/lib/utils/format'
import { DeleteAccountButton } from '@/components/accounts/delete-account-button'
import { InfoTooltip } from '@/components/ui/tooltip'
import { SpendableToggleButton } from '@/components/accounts/spendable-toggle-button'

type Account = Tables<'accounts'>

function titleCase(s: string) {
  return s
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(' ')
}

function accountTypeBadge(type: string | null | undefined) {
  const t = (type ?? 'checking').toLowerCase()

  if (t === 'checking') {
    return { label: 'Checking', className: 'bg-blue-500/20 text-blue-300 border border-blue-500/30' }
  }
  if (t === 'savings') {
    return { label: 'Savings', className: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' }
  }
  if (t === 'credit_card' || t === 'credit' || t === 'card') {
    return { label: 'Credit Card', className: 'bg-amber-500/20 text-amber-300 border border-amber-500/30' }
  }

  return { label: titleCase(t), className: 'bg-zinc-700 text-zinc-300 border border-zinc-600' }
}

export function AccountCard({ account }: { account: Account }) {
  const badge = accountTypeBadge(account.account_type)
  const currency = account.currency || 'USD'
  const balance = account.current_balance ?? 0
  const isPositive = balance >= 0
  const isSpendable = account.is_spendable ?? true

  return (
    <div className="border border-zinc-800 bg-zinc-800 rounded-lg p-4 hover:bg-zinc-700/60 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-base font-medium text-zinc-100 truncate">{account.name}</p>
          <p className="text-sm text-zinc-400">
            {account.updated_at ? `Updated ${formatRelativeTime(account.updated_at)}` : ' '}
          </p>

          <div className="flex gap-2 flex-wrap mt-2 items-center">
            <span
              className={[
                'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap',
                badge.className,
              ].join(' ')}
            >
              {badge.label}
            </span>

            <div className="inline-flex items-center gap-2 bg-zinc-700 border border-zinc-600 rounded-full px-2 py-1">
              <span className="text-xs font-medium text-zinc-300">Spendable Account</span>
              <InfoTooltip content="Spendable accounts are used to calculate your daily cash flow. Mark accounts you pay bills from." />
              <SpendableToggleButton
                id={account.id}
                isSpendable={isSpendable}
                accountName={account.name}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <p
            className={[
              'text-lg font-semibold tabular-nums',
              isPositive ? 'text-emerald-400' : 'text-rose-400',
            ].join(' ')}
          >
            {formatCurrency(balance, currency)}
          </p>
          <Link href={`/dashboard/accounts/${account.id}/edit`}>
            <Button variant="outline" size="sm" aria-label="Edit account">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>
          <DeleteAccountButton accountId={account.id} accountName={account.name} />
        </div>
      </div>
    </div>
  )
}
