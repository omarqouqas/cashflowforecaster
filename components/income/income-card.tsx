'use client'

import { Tables } from '@/types/supabase'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Clock, Edit, Briefcase, DollarSign, FileText } from 'lucide-react'
import { DeleteIncomeButton } from './delete-income-button'
import { formatCurrency, formatDateOnly } from '@/lib/utils/format'
import { ActiveToggleButton } from '@/components/ui/active-toggle-button'
import Link from 'next/link'

type Income = Tables<'income'>

interface IncomeCardProps {
  income: Income
  currency?: string
}

function getActualNextDate(nextDate: string, frequency: string | null | undefined): Date {
  const storedDate = new Date(nextDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // If the stored date is in the future, use it
  if (storedDate >= today) {
    return storedDate
  }

  // Otherwise, calculate the next occurrence
  const freq = (frequency ?? 'monthly').toLowerCase()
  let currentDate = new Date(storedDate)

  switch (freq) {
    case 'weekly':
      while (currentDate < today) {
        currentDate.setDate(currentDate.getDate() + 7)
      }
      break

    case 'biweekly':
      while (currentDate < today) {
        currentDate.setDate(currentDate.getDate() + 14)
      }
      break

    case 'semi-monthly':
      // Semi-monthly: twice per month (e.g., 1st & 15th)
      const semiMonthlyDay = storedDate.getDate()
      while (currentDate < today) {
        if (semiMonthlyDay <= 15) {
          // If original is 1st-15th, next is either 15th+ or 1st of next month
          if (currentDate.getDate() <= 15) {
            currentDate.setDate(semiMonthlyDay + 15)
          } else {
            currentDate.setMonth(currentDate.getMonth() + 1)
            currentDate.setDate(semiMonthlyDay)
          }
        } else {
          // If original is 16th+, next is either 1st-15th of next month or same day next month
          if (currentDate.getDate() >= 16) {
            currentDate.setMonth(currentDate.getMonth() + 1)
            currentDate.setDate(semiMonthlyDay - 15)
          } else {
            currentDate.setDate(semiMonthlyDay)
          }
        }
      }
      break

    case 'monthly':
      const targetDay = storedDate.getDate()
      while (currentDate < today) {
        let nextMonth = currentDate.getMonth() + 1
        let nextYear = currentDate.getFullYear()

        if (nextMonth > 11) {
          nextMonth = 0
          nextYear++
        }

        const lastDayOfNextMonth = new Date(nextYear, nextMonth + 1, 0).getDate()
        const dayToUse = Math.min(targetDay, lastDayOfNextMonth)

        currentDate = new Date(nextYear, nextMonth, dayToUse)
      }
      break

    case 'one-time':
    case 'irregular':
      // For one-time and irregular, just return the stored date
      return storedDate

    default:
      return storedDate
  }

  return currentDate
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

  if (freq === 'monthly' || freq === 'semi-monthly' || freq === 'biweekly' || freq === 'weekly') {
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
  const actualNextDate = getActualNextDate(income.next_date, income.frequency)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Only show next payment date if it's in the future
  const showNextPayment = actualNextDate >= today
  const nextDateString = actualNextDate.toISOString().split('T')[0] ?? ''

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
                  Next payment: {formatDateOnly(nextDateString)}
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

