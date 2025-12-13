'use client'

import { Tables } from '@/types/supabase'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Clock, Edit } from 'lucide-react'
import { DeleteIncomeButton } from './delete-income-button'
import { formatCurrency, formatDateOnly } from '@/lib/utils/format'
import { ActiveToggleButton } from '@/components/ui/active-toggle-button'
import Link from 'next/link'

type Income = Tables<'income'>

interface IncomeCardProps {
  income: Income
}

export function IncomeCard({ income }: IncomeCardProps) {
  const isInvoiceLinked = Boolean(income.invoice_id)
  const isPending = income.status === 'pending'
  const isConfirmed = income.status === 'confirmed'

  return (
    <div className="border border-zinc-200 bg-white rounded-lg p-4 hover:bg-zinc-50 transition-colors">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <p className="text-base font-medium text-zinc-900 truncate">{income.name}</p>
            {isInvoiceLinked && (
              <span
                className={[
                  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap',
                  isConfirmed
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : isPending
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-zinc-100 text-zinc-700 border border-zinc-200',
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
          <p className="text-sm text-zinc-500">
            Next payment: {formatDateOnly(income.next_date)}
          </p>
          <div className="flex gap-2 flex-wrap mt-2">
            <span className="bg-zinc-100 text-zinc-600 text-xs font-medium px-2 py-0.5 rounded capitalize">
              {income.frequency}
            </span>
            <ActiveToggleButton
              id={income.id}
              isActive={income.is_active ?? true}
              tableName="income"
              itemName={income.name}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <p className="text-lg font-semibold tabular-nums text-emerald-600">
            {formatCurrency(income.amount)}
          </p>
          <Link href={`/dashboard/income/${income.id}/edit`}>
            <Button variant="outline" size="sm" aria-label="Edit income">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>
          <DeleteIncomeButton incomeId={income.id} incomeName={income.name} />
        </div>
      </div>
    </div>
  )
}

