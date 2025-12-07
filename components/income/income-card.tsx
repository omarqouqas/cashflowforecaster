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
  const isActive = income.is_active ?? true

  const frequencyColors: Record<string, string> = {
    weekly: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    biweekly: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    monthly: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    irregular: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    'one-time': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  }

  const frequencyColor =
    frequencyColors[income.frequency] ||
    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'

  return (
    <div className={`
      bg-white dark:bg-slate-800 border rounded-lg p-6 shadow-sm transition-all
      ${!isActive ? 'opacity-60 border-gray-300 dark:border-slate-600' : 'border-slate-200 dark:border-slate-700 hover:shadow-md'}
    `}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{income.name}</h3>
          <div className="flex gap-2 flex-wrap">
            {/* Frequency badge */}
            <span className={`inline-block px-2 py-1 text-xs rounded font-medium capitalize ${frequencyColor}`}>
              {income.frequency}
            </span>
            
            {/* Active/Inactive badge */}
            <ActiveToggleButton
              id={income.id}
              isActive={income.is_active}
              tableName="income"
              itemName={income.name}
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Link href={`/dashboard/income/${income.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>
          <DeleteIncomeButton 
            incomeId={income.id} 
            incomeName={income.name} 
          />
        </div>
      </div>
      
      <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
        {formatCurrency(income.amount)}
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Next payment: {formatDateOnly(income.next_date)}
      </p>
    </div>
  )
}

