'use client'

import { Tables } from '@/types/supabase'
import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-react'
import { DeleteIncomeButton } from './delete-income-button'
import { formatCurrency, formatDateOnly } from '@/lib/utils/format'
import { ActiveToggleButton } from '@/components/ui/active-toggle-button'
import Link from 'next/link'

type Income = Tables<'income'>['Row']

interface IncomeCardProps {
  income: Income
}

export function IncomeCard({ income }: IncomeCardProps) {
  return (
    <div className="border border-zinc-200 bg-white rounded-lg p-4 hover:bg-zinc-50 transition-colors">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-base font-medium text-zinc-900 truncate">{income.name}</p>
          <p className="text-sm text-zinc-500">
            Next payment: {formatDateOnly(income.next_date)}
          </p>
          <div className="flex gap-2 flex-wrap mt-2">
            <span className="bg-zinc-100 text-zinc-600 text-xs font-medium px-2 py-0.5 rounded capitalize">
              {income.frequency}
            </span>
            <ActiveToggleButton
              id={income.id}
              isActive={income.is_active}
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

