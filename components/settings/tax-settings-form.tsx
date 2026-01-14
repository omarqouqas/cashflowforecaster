'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { updateTaxSettings } from '@/lib/actions/update-tax-settings'
import { usePostHog } from 'posthog-js/react'

interface TaxSettingsFormProps {
  initialSettings: {
    tax_rate: number
    tax_tracking_enabled: boolean
    tax_year: number
    estimated_tax_q1_paid: number
    estimated_tax_q2_paid: number
    estimated_tax_q3_paid: number
    estimated_tax_q4_paid: number
  }
}

const QUARTERLY_DEADLINES = [
  { quarter: 'Q1', label: 'Q1 (Jan-Mar)', dueDate: 'April 15', months: 'Jan-Mar' },
  { quarter: 'Q2', label: 'Q2 (Apr-Jun)', dueDate: 'June 15', months: 'Apr-Jun' },
  { quarter: 'Q3', label: 'Q3 (Jul-Sep)', dueDate: 'September 15', months: 'Jul-Sep' },
  { quarter: 'Q4', label: 'Q4 (Oct-Dec)', dueDate: 'January 15', months: 'Oct-Dec' },
]

export function TaxSettingsForm({ initialSettings }: TaxSettingsFormProps) {
  const router = useRouter()
  const posthog = usePostHog()
  const [isPending, startTransition] = useTransition()
  const [enabled, setEnabled] = useState(initialSettings.tax_tracking_enabled)
  const [taxRate, setTaxRate] = useState(initialSettings.tax_rate.toString())
  const [q1Paid, setQ1Paid] = useState(initialSettings.estimated_tax_q1_paid.toString())
  const [q2Paid, setQ2Paid] = useState(initialSettings.estimated_tax_q2_paid.toString())
  const [q3Paid, setQ3Paid] = useState(initialSettings.estimated_tax_q3_paid.toString())
  const [q4Paid, setQ4Paid] = useState(initialSettings.estimated_tax_q4_paid.toString())

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      const result = await updateTaxSettings({
        tax_rate: parseFloat(taxRate),
        tax_tracking_enabled: enabled,
        estimated_tax_q1_paid: parseFloat(q1Paid) || 0,
        estimated_tax_q2_paid: parseFloat(q2Paid) || 0,
        estimated_tax_q3_paid: parseFloat(q3Paid) || 0,
        estimated_tax_q4_paid: parseFloat(q4Paid) || 0,
      })

      if (result.success) {
        // Track tax settings update
        posthog?.capture('tax_settings_updated', {
          tax_rate: parseFloat(taxRate),
          tax_tracking_enabled: enabled,
          has_quarterly_payments:
            parseFloat(q1Paid) > 0 ||
            parseFloat(q2Paid) > 0 ||
            parseFloat(q3Paid) > 0 ||
            parseFloat(q4Paid) > 0,
        })

        toast.success('Tax settings updated')
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to update tax settings')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Enable/Disable Toggle */}
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <label htmlFor="tax-tracking-enabled" className="block text-sm font-medium text-zinc-900">
            Tax Tracking
          </label>
          <p className="mt-1 text-sm text-zinc-500">
            Automatically calculate and track tax savings on your income
          </p>
        </div>
        <button
          type="button"
          id="tax-tracking-enabled"
          role="switch"
          aria-checked={enabled}
          onClick={() => {
            const newValue = !enabled
            setEnabled(newValue)
            // Track toggle event
            posthog?.capture('tax_tracking_toggled', {
              enabled: newValue,
            })
          }}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            enabled ? 'bg-teal-500' : 'bg-zinc-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {enabled && (
        <>
          {/* Tax Rate */}
          <div>
            <label htmlFor="tax-rate" className="block text-sm font-medium text-zinc-900">
              Estimated Tax Rate
            </label>
            <p className="mt-1 text-sm text-zinc-500">
              Your estimated tax rate (federal + state + self-employment). Typical range: 25-35%
            </p>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                id="tax-rate"
                min="0"
                max="100"
                step="0.5"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="block w-24 rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                required
              />
              <span className="text-sm text-zinc-700">%</span>
            </div>
            <p className="mt-2 text-xs text-zinc-400">
              💡 Tip: Add federal (~15%), state (~5%), and self-employment tax (~15%)
            </p>
          </div>

          {/* Quarterly Estimated Tax Payments */}
          <div>
            <h3 className="text-sm font-medium text-zinc-900 mb-2">
              Quarterly Estimated Tax Payments ({initialSettings.tax_year})
            </h3>
            <p className="text-sm text-zinc-500 mb-4">
              Track what you've already paid for quarterly estimated taxes
            </p>
            <div className="space-y-4 sm:space-y-3">
              {QUARTERLY_DEADLINES.map((q, index) => {
                const value = [q1Paid, q2Paid, q3Paid, q4Paid][index]
                const setValue = [setQ1Paid, setQ2Paid, setQ3Paid, setQ4Paid][index]

                return (
                  <div key={q.quarter} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div className="flex-1">
                      <label htmlFor={`q${index + 1}-paid`} className="text-sm font-medium text-zinc-700">
                        {q.label}
                      </label>
                      <p className="text-xs text-zinc-500">Due {q.dueDate}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-zinc-500">$</span>
                      <input
                        type="number"
                        id={`q${index + 1}-paid`}
                        min="0"
                        step="0.01"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="block w-full sm:w-32 rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="mt-4 text-xs text-zinc-400">
              💡 These payments count toward your annual tax obligation
            </p>
          </div>
        </>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending} className="bg-teal-500 hover:bg-teal-600">
          {isPending ? 'Saving...' : 'Save Tax Settings'}
        </Button>
      </div>
    </form>
  )
}
