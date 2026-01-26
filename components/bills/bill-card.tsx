'use client'

import { Tables } from '@/types/supabase'
import { Button } from '@/components/ui/button'
import { Edit, CreditCard, Home, Tv, Shield } from 'lucide-react'
import { DeleteBillButton } from './delete-bill-button'
import { formatCurrency, formatDateOnly } from '@/lib/utils/format'
import { ActiveToggleButton } from '@/components/ui/active-toggle-button'
import Link from 'next/link'

type Bill = Tables<'bills'>

interface BillCardProps {
  bill: Bill
}

function getActualNextDueDate(dueDate: string, frequency: string | null | undefined): Date {
  const storedDate = new Date(dueDate)
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
          if (currentDate.getDate() <= 15) {
            currentDate.setDate(semiMonthlyDay + 15)
          } else {
            currentDate.setMonth(currentDate.getMonth() + 1)
            currentDate.setDate(semiMonthlyDay)
          }
        } else {
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

    case 'quarterly':
      while (currentDate < today) {
        currentDate.setMonth(currentDate.getMonth() + 3)
      }
      break

    case 'annually':
      while (currentDate < today) {
        currentDate.setFullYear(currentDate.getFullYear() + 1)
      }
      break

    case 'one-time':
      // For one-time, just return the stored date
      return storedDate

    default:
      return storedDate
  }

  return currentDate
}

function getCategoryIcon(category: string | null | undefined) {
  const cat = (category ?? 'other').toLowerCase()

  if (cat === 'rent' || cat === 'utilities') {
    return {
      icon: Home,
      className: 'bg-blue-500/10 border border-blue-500/30',
      iconColor: 'text-blue-400'
    }
  }

  if (cat === 'subscriptions') {
    return {
      icon: Tv,
      className: 'bg-purple-500/10 border border-purple-500/30',
      iconColor: 'text-purple-400'
    }
  }

  if (cat === 'insurance') {
    return {
      icon: Shield,
      className: 'bg-emerald-500/10 border border-emerald-500/30',
      iconColor: 'text-emerald-400'
    }
  }

  // Other category
  return {
    icon: CreditCard,
    className: 'bg-rose-500/10 border border-rose-500/30',
    iconColor: 'text-rose-400'
  }
}

function getCategoryBadge(category: string | null | undefined) {
  const cat = (category ?? 'other').toLowerCase()

  const labels: Record<string, string> = {
    rent: 'Rent/Mortgage',
    utilities: 'Utilities',
    subscriptions: 'Subscriptions',
    insurance: 'Insurance',
    other: 'Other'
  }

  const colors: Record<string, string> = {
    rent: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    utilities: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
    subscriptions: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
    insurance: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    other: 'bg-zinc-700 text-zinc-300 border border-zinc-600'
  }

  return {
    label: labels[cat] || 'Other',
    className: colors[cat] || colors.other
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

  if (freq === 'quarterly') {
    return {
      label: 'Quarterly',
      className: 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
    }
  }

  if (freq === 'annually') {
    return {
      label: 'Annually',
      className: 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
    }
  }

  if (freq === 'one-time') {
    return {
      label: 'One-time',
      className: 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
    }
  }

  return {
    label: frequency || 'Unknown',
    className: 'bg-zinc-700 text-zinc-300 border border-zinc-600'
  }
}

export function BillCard({ bill }: BillCardProps) {
  const isActive = bill.is_active ?? true
  const categoryIcon = getCategoryIcon(bill.category)
  const categoryBadge = getCategoryBadge(bill.category)
  const frequencyBadge = getFrequencyBadge(bill.frequency)
  const CategoryIcon = categoryIcon.icon

  // Calculate the actual next due date
  const actualDueDate = bill.due_date ? getActualNextDueDate(bill.due_date, bill.frequency) : null
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Only show due date if it's in the future
  const showDueDate = actualDueDate && actualDueDate >= today
  const dueDateString = actualDueDate ? actualDueDate.toISOString().split('T')[0] ?? '' : ''

  return (
    <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-4 hover:bg-zinc-800/80 transition-colors">
      <div className="flex items-start gap-3">
        {/* Category Icon */}
        <div className={`w-10 h-10 ${categoryIcon.className} rounded-full flex items-center justify-center flex-shrink-0`}>
          <CategoryIcon className={`w-5 h-5 ${categoryIcon.iconColor}`} />
        </div>

        {/* Bill Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <p className="text-base font-semibold text-zinc-100 truncate">{bill.name}</p>
              {showDueDate && (
                <p className="text-sm text-zinc-400 mt-1">
                  Due: {formatDateOnly(dueDateString)}
                </p>
              )}
            </div>

            <p className="text-xl font-bold tabular-nums text-rose-400">
              {formatCurrency(bill.amount)}
            </p>
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <span
              className={[
                'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap',
                categoryBadge.className,
              ].join(' ')}
            >
              {categoryBadge.label}
            </span>

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
            <Link href={`/dashboard/bills/${bill.id}/edit`} className="flex-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-zinc-700 bg-zinc-800 hover:bg-zinc-700 hover:border-teal-500/50 text-zinc-100 hover:text-teal-400 transition-all"
                aria-label="Edit bill"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
            <ActiveToggleButton
              id={bill.id}
              isActive={isActive}
              tableName="bills"
              itemName={bill.name}
            />
            <DeleteBillButton billId={bill.id} billName={bill.name} />
          </div>
        </div>
      </div>
    </div>
  )
}
