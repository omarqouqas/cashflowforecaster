'use client'

import { useMemo, useState } from 'react'
import { Layers } from 'lucide-react'
import { format } from 'date-fns'
import { formatCurrency } from '@/lib/utils/format'
import type { CollisionSummary } from '@/lib/calendar/detect-collisions'

export interface BillCollisionWarningProps {
  collisions: CollisionSummary
  currency?: string
}

export function BillCollisionWarning({ collisions, currency = 'USD' }: BillCollisionWarningProps) {
  if (!collisions?.hasCollisions) return null

  const [expanded, setExpanded] = useState(false)

  const isCritical = collisions.criticalCount > 0
  const highlight =
    (isCritical ? collisions.collisions.find((c) => c.severity === 'critical') : collisions.collisions[0]) ??
    null

  if (!highlight) return null

  const billsCount = highlight.bills.length
  const totalAmount = highlight.totalAmount
  const dateLabel = format(highlight.date, 'EEE, MMM d')
  const amountLabel = formatCurrency(totalAmount, currency)
  const otherDaysCount = Math.max(0, collisions.collisions.length - 1)

  const listToShow = useMemo(() => {
    const all = collisions.collisions ?? []
    if (expanded) return all
    return all.slice(0, 3) // mobile-friendly default
  }, [collisions.collisions, expanded])

  return (
    <div
      className={`mx-4 mb-4 p-4 rounded-lg border ${
        isCritical ? 'bg-rose-500/10 border-rose-500/30' : 'bg-amber-500/10 border-amber-500/30'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full ${isCritical ? 'bg-rose-500/15' : 'bg-amber-500/15'}`}>
          <Layers className={`w-5 h-5 ${isCritical ? 'text-rose-300' : 'text-amber-300'}`} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold ${isCritical ? 'text-rose-100' : 'text-amber-100'}`}>
            {isCritical ? 'Heavy Bill Day Warning' : 'Bill Collision Alert'}
          </h3>

          <p className={`text-sm mt-1 ${isCritical ? 'text-rose-200' : 'text-amber-200'}`}>
            {isCritical ? (
              <>
                Watch out! <strong>{billsCount} bills</strong> totaling <strong>{amountLabel}</strong> hit on{' '}
                <strong>{dateLabel}</strong>
              </>
            ) : (
              <>
                You have <strong>{billsCount} bills</strong> totaling <strong>{amountLabel}</strong> due on{' '}
                <strong>{dateLabel}</strong>
              </>
            )}
          </p>

          {otherDaysCount > 0 ? (
            <p className={`text-sm mt-2 ${isCritical ? 'text-rose-200' : 'text-amber-200'}`}>
              Plus {otherDaysCount} other day{otherDaysCount === 1 ? '' : 's'} with multiple bills
            </p>
          ) : null}

          {/* Optional compact list (mobile-first, max 3 unless expanded) */}
          {collisions.collisions.length > 1 && (
            <div className="mt-3 space-y-1">
              {listToShow.map((c) => {
                const cDate = format(c.date, 'EEE, MMM d')
                const cAmount = formatCurrency(c.totalAmount, currency)
                const cCount = c.bills.length
                const cIsCritical = c.severity === 'critical'
                return (
                  <div
                    key={c.date.getTime()}
                    className={`rounded-md border px-3 py-2 text-sm ${
                      cIsCritical
                        ? 'border-rose-500/30 bg-rose-500/5 text-rose-200'
                        : 'border-amber-500/30 bg-amber-500/5 text-amber-200'
                    }`}
                  >
                    <span className="font-semibold">{cCount} bills</span> · {cAmount} · {cDate}
                  </div>
                )
              })}

              {collisions.collisions.length > 3 && (
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  className={`mt-1 inline-flex items-center justify-center rounded-md border px-3 py-2 min-h-[44px] text-sm font-medium cursor-pointer transition-transform active:scale-95 ${
                    isCritical
                      ? 'border-rose-500/30 text-rose-100 hover:bg-rose-500/10 active:bg-rose-500/10'
                      : 'border-amber-500/30 text-amber-100 hover:bg-amber-500/10 active:bg-amber-500/10'
                  }`}
                >
                  {expanded ? 'Show less' : `View all (${collisions.collisions.length})`}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


