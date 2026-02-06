'use client'

import { Tables } from '@/types/supabase'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Clock, Edit, Briefcase, DollarSign, FileText } from 'lucide-react'
import { DeleteIncomeButton } from './delete-income-button'
import { formatCurrency, formatDateOnly } from '@/lib/utils/format'
import { getActualNextDate } from '@/lib/utils/date'
import { ActiveToggleButton } from '@/components/ui/active-toggle-button'
import Link from 'next/link'

type Income = Tables<'income'>

interface IncomeCardProps {
  income: Income
  currency?: string
}

function getIncomeTypeIcon(frequency: string | null | undefined, isInvoiceLinked: boolean) {
  if (isInvoiceLinked) {
    return {
      icon: FileText,
      className: 'bg-blue-500/10 border border-blue-500/30',
      iconColor: 'text-blue-400'
    }
  }

  const freq = (frequency ?? 'monthly').toLowerCase()

  if (freq === 'monthly' || freq === 'semi-monthly' || freq === 'biweekly' || freq === 'weekly' || freq === 'quarterly' || freq === 'annually') {
    return {
      icon: Briefcase,
      className: 'bg-emerald-500/10 border border-emerald-500/30',
      iconColor: 'text-emerald-400'
    }
  }

  if (freq === 'irregular' || freq === 'one-time') {
    return {
      icon: DollarSign,
      className: 'bg-teal-500/10 border border-teal-500/30',
      iconColor: 'text-teal-400'
    }
  }

  return {
    icon: DollarSign,
    className: 'bg-zinc-700/50 border border-zinc-600',
    iconColor: 'text-zinc-400'
  }
}

function getFrequencyBadge(frequency: string | null | undefined) {
  const freq = (frequency ?? 'monthly').toLowerCase()

  if (freq === 'monthly') {
    return {
      label: 'Monthly',
      className: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
    }
  }

  if (freq === 'biweekly') {
    return {
      label: 'Biweekly',
      className: 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
    }
  }

  if (freq === 'semi-monthly') {
    return {
      label: 'Semi-monthly',
      className: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
    }
  }

  if (freq === 'weekly') {
    return {
      label: 'Weekly',
      className: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
    }
  }

  if (freq === 'irregular') {
    return {
      label: 'Irregular',
      className: 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
    }
  }

  if (freq === 'one-time') {
    return {
      label: 'One-time',
      className: 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
    }
  }

  if (freq === 'quarterly') {
    return {
      label: 'Quarterly',
      className: 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
    }
  }

  if (freq === 'annually') {
    return {
      label: 'Annually',
      className: 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
    }
  }

  return {
    label: frequency || 'Unknown',
    className: 'bg-zinc-700 text-zinc-300 border border-zinc-600'
  }
}

export function IncomeCard({ income, currency = 'USD' }: IncomeCardProps) {
  const isInvoiceLinked = Boolean(income.invoice_id)
  const isPending = income.status === 'pending'
  const isConfirmed = income.status === 'confirmed'
  const isActive = income.is_active ?? true

  const typeIcon = getIncomeTypeIcon(income.frequency, isInvoiceLinked)
  const frequencyBadge = getFrequencyBadge(income.frequency)
  const IncomeIcon = typeIcon.icon

  // Calculate the actual next payment date
  const actualNextDate = income.next_date ? getActualNextDate(income.next_date, income.frequency) : null
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Show next payment date if it's in the future, OR for one-time income (show historical date)
  const isOneTime = (income.frequency ?? '').toLowerCase() === 'one-time'
  const showNextPayment = actualNextDate && (actualNextDate >= today || isOneTime)
  const nextDateString = actualNextDate ? actualNextDate.toISOString().split('T')[0] ?? '' : ''
  const dateLabel = isOneTime && actualNextDate && actualNextDate < today ? 'Date' : 'Next payment'

  return (
    <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-4 hover:bg-zinc-800/80 transition-colors">
      <div className="flex items-start gap-3">
        {/* Income Type Icon */}
        <div className={`w-10 h-10 ${typeIcon.className} rounded-full flex items-center justify-center flex-shrink-0`}>
          <IncomeIcon className={`w-5 h-5 ${typeIcon.iconColor}`} />
        </div>

        {/* Income Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-base font-semibold text-zinc-100 truncate">{income.name}</p>
                {isInvoiceLinked && (
                  <span
                    className={[
                      'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap',
                      isConfirmed
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                        : isPending
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-zinc-700 text-zinc-300 border border-zinc-600',
                    ].join(' ')}
                    title={
                      isConfirmed
                        ? 'Invoice income has been marked as paid'
                        : isPending
                          ? 'Invoice income is still pending'
                          : 'Invoice-linked income'
                    }
                  >
                    {isConfirmed ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Paid
                      </>
                    ) : isPending ? (
                      <>
                        <Clock className="w-3.5 h-3.5" />
                        Pending
                      </>
                    ) : (
                      'Invoice'
                    )}
                  </span>
                )}
              </div>
              {showNextPayment && (
                <p className="text-sm text-zinc-400 mt-1">
                  {dateLabel}: {formatDateOnly(nextDateString)}
                </p>
              )}
            </div>

            <p className="text-xl font-bold tabular-nums text-emerald-400">
              {formatCurrency(income.amount, currency)}
            </p>
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <span
              className={[
                'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap',
                frequencyBadge.className,
              ].join(' ')}
            >
              {frequencyBadge.label}
            </span>

            {isActive && (
              <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-full px-2.5 py-1 text-xs font-medium">
                ✓ Active
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3">
            <Link href={`/dashboard/income/${income.id}/edit`} className="flex-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-zinc-700 bg-zinc-800 hover:bg-zinc-700 hover:border-teal-500/50 text-zinc-100 hover:text-teal-400 transition-all"
                aria-label="Edit income"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
            <ActiveToggleButton
              id={income.id}
              isActive={isActive}
              tableName="income"
              itemName={income.name}
            />
            <DeleteIncomeButton incomeId={income.id} incomeName={income.name} />
          </div>
        </div>
      </div>
    </div>
  )
}

