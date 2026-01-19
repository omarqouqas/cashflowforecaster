import Link from 'next/link'
import { DollarSign, AlertCircle } from 'lucide-react'
import { formatCurrency, getNextQuarterlyDeadline, getCurrentQuarter } from '@/lib/tax/calculations'

interface TaxSavingsWidgetProps {
  totalIncome: number
  taxRate: number
  quarterlyIncome: [number, number, number, number]
  quarterlyPaid: [number, number, number, number]
  enabled: boolean
}

export function TaxSavingsWidget({
  totalIncome,
  taxRate,
  quarterlyIncome,
  quarterlyPaid,
  enabled,
}: TaxSavingsWidgetProps) {
  if (!enabled) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-zinc-100">Tax Savings Tracker</h3>
            <p className="mt-1 text-sm text-zinc-400">
              Track tax savings on your freelance income
            </p>
          </div>
          <DollarSign className="h-5 w-5 text-zinc-400" />
        </div>
        <div className="mt-4">
          <Link
            href="/dashboard/settings"
            className="inline-flex items-center gap-2 text-sm font-medium text-teal-400 hover:text-teal-300"
          >
            Enable in Settings →
          </Link>
        </div>
      </div>
    )
  }

  const totalTaxOwed = totalIncome * (taxRate / 100)
  const totalPaid = quarterlyPaid.reduce((sum, paid) => sum + paid, 0)
  const remaining = Math.max(0, totalTaxOwed - totalPaid)
  const afterTaxIncome = totalIncome - totalTaxOwed
  const savedPercentage = totalPaid > 0 ? (totalPaid / totalTaxOwed) * 100 : 0

  const currentQuarter = getCurrentQuarter()
  const currentQuarterIncome = quarterlyIncome[currentQuarter - 1] ?? 0
  const currentQuarterTax = currentQuarterIncome * (taxRate / 100)
  const currentQuarterPaid = quarterlyPaid[currentQuarter - 1] ?? 0
  const currentQuarterRemaining = Math.max(0, currentQuarterTax - currentQuarterPaid)

  const nextDeadline = getNextQuarterlyDeadline()
  const daysUntilDeadline = Math.ceil(
    (nextDeadline.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-zinc-100">Tax Savings Tracker</h3>
          <p className="mt-1 text-sm text-zinc-400">
            {taxRate}% rate • Year-to-date
          </p>
        </div>
        <DollarSign className="h-5 w-5 text-teal-400" />
      </div>

      {/* Main Stats */}
      <div className="mt-6 grid grid-cols-1 min-[375px]:grid-cols-2 gap-4">
        <div>
          <p className="text-xs sm:text-sm text-zinc-400">Total Income</p>
          <p className="mt-1 text-xl sm:text-2xl font-semibold text-zinc-100">
            {formatCurrency(totalIncome)}
          </p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-zinc-400">After-Tax</p>
          <p className="mt-1 text-xl sm:text-2xl font-semibold text-emerald-400">
            {formatCurrency(afterTaxIncome)}
          </p>
        </div>
      </div>

      {/* Tax Owed vs Saved */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="text-zinc-400">Tax Progress</span>
          <span className="font-medium text-zinc-100">
            {formatCurrency(totalPaid)} / {formatCurrency(totalTaxOwed)}
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-800">
          <div
            className={`h-full transition-all ${
              savedPercentage >= 100
                ? 'bg-teal-500'
                : savedPercentage >= 75
                ? 'bg-teal-400'
                : savedPercentage >= 50
                ? 'bg-amber-400'
                : 'bg-rose-400'
            }`}
            style={{ width: `${Math.min(savedPercentage, 100)}%` }}
          />
        </div>
        <p className="mt-2 text-xs sm:text-sm text-zinc-400">
          {savedPercentage >= 100 ? (
            <span className="text-teal-400 font-medium">✓ Fully saved</span>
          ) : (
            <>
              {formatCurrency(remaining)} remaining to save
            </>
          )}
        </p>
      </div>

      {/* Next Deadline Alert */}
      {currentQuarterRemaining > 0 && daysUntilDeadline <= 30 && (
        <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 sm:p-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base font-medium text-amber-300">
                Q{nextDeadline.quarter} deadline in {daysUntilDeadline} days
              </p>
              <p className="text-xs sm:text-sm text-amber-400 mt-1">
                {formatCurrency(currentQuarterRemaining)} estimated tax due by {nextDeadline.formatted}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center gap-3">
        <Link
          href="/dashboard/settings"
          className="text-sm font-medium text-teal-400 hover:text-teal-300"
        >
          Update tax settings →
        </Link>
      </div>
    </div>
  )
}
