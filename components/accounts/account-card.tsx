'use client'

import { useState } from 'react'
import type { Tables } from '@/types/supabase'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Edit, Wallet, PiggyBank, CreditCard, AlertCircle, TrendingUp, Calculator, DollarSign } from 'lucide-react'
import { formatCurrency, formatRelativeTime } from '@/lib/utils/format'
import { DeleteAccountButton } from '@/components/accounts/delete-account-button'
import { SpendableToggleButton } from '@/components/accounts/spendable-toggle-button'
import { InfoTooltip } from '@/components/ui/tooltip'
import { PaymentSimulator } from '@/components/accounts/payment-simulator'
import { differenceInDays } from 'date-fns'
import { calculateUtilization, getUtilizationStatus } from '@/lib/types/credit-card'

// Tables<'accounts'> already includes all CC fields from DB schema
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
    return {
      label: 'Checking',
      className: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
      icon: Wallet,
      iconColor: 'text-blue-400'
    }
  }
  if (t === 'savings') {
    return {
      label: 'Savings',
      className: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
      icon: PiggyBank,
      iconColor: 'text-emerald-400'
    }
  }
  if (t === 'credit_card' || t === 'credit' || t === 'card') {
    return {
      label: 'Credit Card',
      className: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
      icon: CreditCard,
      iconColor: 'text-amber-400'
    }
  }

  return {
    label: titleCase(t),
    className: 'bg-zinc-700 text-zinc-300 border border-zinc-600',
    icon: Wallet,
    iconColor: 'text-zinc-400'
  }
}

export function AccountCard({ account }: { account: Account }) {
  const [showSimulator, setShowSimulator] = useState(false)

  const badge = accountTypeBadge(account.account_type)
  const currency = account.currency || 'USD'
  const balance = account.current_balance ?? 0
  const isPositive = balance >= 0
  const isSpendable = account.is_spendable ?? true
  const isCreditCard = account.account_type === 'credit_card'

  // Calculate staleness
  const daysSinceUpdate = account.updated_at
    ? differenceInDays(new Date(), new Date(account.updated_at))
    : null
  const isStale = daysSinceUpdate !== null && daysSinceUpdate > 7

  // Credit card utilization
  const creditLimit = account.credit_limit
  const utilization = isCreditCard && creditLimit && creditLimit > 0
    ? calculateUtilization(balance, creditLimit)
    : null
  const utilizationStatus = utilization !== null ? getUtilizationStatus(utilization) : null

  const AccountIcon = badge.icon

  return (
    <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-4 hover:bg-zinc-800/80 transition-colors">
      <div className="flex items-start gap-3">
        {/* Account Type Icon */}
        <div className={`w-10 h-10 ${badge.className.replace('text-', 'bg-').replace('/20', '/10')} rounded-full flex items-center justify-center flex-shrink-0`}>
          <AccountIcon className={`w-5 h-5 ${badge.iconColor}`} />
        </div>

        {/* Account Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <p className="text-base font-semibold text-zinc-100 truncate">{account.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-zinc-400">
                  {account.updated_at ? `Updated ${formatRelativeTime(account.updated_at)}` : 'Never updated'}
                </p>
                {isStale && (
                  <div className="flex items-center gap-1 text-amber-400">
                    <AlertCircle className="w-3 h-3" />
                    <span className="text-xs font-medium">Stale</span>
                  </div>
                )}
              </div>
            </div>

            <p
              className={[
                'text-xl font-bold tabular-nums',
                // For credit cards, any balance is debt (show in amber), zero is good (emerald)
                // For other accounts, positive is good, negative is bad
                isCreditCard
                  ? balance > 0 ? 'text-amber-400' : 'text-emerald-400'
                  : isPositive ? 'text-emerald-400' : 'text-rose-400',
              ].join(' ')}
            >
              {formatCurrency(Math.abs(balance), currency)}
            </p>
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <span
              className={[
                'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap',
                badge.className,
              ].join(' ')}
            >
              {badge.label}
            </span>

            {/* Credit Card Utilization Badge */}
            {isCreditCard && utilization !== null && utilizationStatus && (
              <span
                className={[
                  'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
                  utilizationStatus.color === 'emerald' && 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300',
                  utilizationStatus.color === 'amber' && 'bg-amber-500/10 border border-amber-500/30 text-amber-300',
                  utilizationStatus.color === 'orange' && 'bg-orange-500/10 border border-orange-500/30 text-orange-300',
                  utilizationStatus.color === 'rose' && 'bg-rose-500/10 border border-rose-500/30 text-rose-300',
                ].filter(Boolean).join(' ')}
                title={utilizationStatus.message}
              >
                <TrendingUp className="w-3 h-3" />
                {utilization.toFixed(0)}% used
              </span>
            )}

            {/* Credit Limit Display */}
            {isCreditCard && creditLimit && creditLimit > 0 && (
              <span className="text-xs text-zinc-500">
                of {formatCurrency(creditLimit, currency)} limit
              </span>
            )}

            {isSpendable && !isCreditCard && (
              <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-full px-2.5 py-1 text-xs font-medium">
                ✓ Spendable
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3">
            <Link href={`/dashboard/accounts/${account.id}/edit`} className="flex-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-zinc-700 bg-zinc-800 hover:bg-zinc-700 hover:border-teal-500/50 text-zinc-100 hover:text-teal-400 transition-all"
                aria-label="Edit account"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
            {/* Payment Simulator and Pay button for credit cards */}
            {isCreditCard && (
              <>
                {balance > 0 && (
                  <Link href={`/dashboard/transfers/new?to=${account.id}&amount=${balance}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 transition-all"
                      aria-label="Pay credit card"
                    >
                      <DollarSign className="w-4 h-4 mr-1" />
                      Pay
                    </Button>
                  </Link>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSimulator(true)}
                  className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700 hover:border-amber-500/50 text-zinc-100 hover:text-amber-400 transition-all"
                  aria-label="Simulate payment"
                >
                  <Calculator className="w-4 h-4" />
                </Button>
              </>
            )}
            {!isCreditCard && (
              <div className="flex items-center gap-1">
                <SpendableToggleButton
                  id={account.id}
                  isSpendable={isSpendable}
                  accountName={account.name}
                />
                <InfoTooltip content="Spendable accounts are included in your cash flow forecast. Turn off for savings accounts or funds you don't regularly spend." />
              </div>
            )}
            <DeleteAccountButton accountId={account.id} accountName={account.name} />
          </div>
        </div>
      </div>

      {/* Payment Simulator Modal */}
      {isCreditCard && (
        <PaymentSimulator
          account={{
            id: account.id,
            name: account.name,
            current_balance: balance,
            currency,
            credit_limit: creditLimit,
            apr: account.apr ?? null,
            minimum_payment_percent: account.minimum_payment_percent ?? null,
            payment_due_day: account.payment_due_day ?? null,
          }}
          isOpen={showSimulator}
          onClose={() => setShowSimulator(false)}
        />
      )}
    </div>
  )
}
