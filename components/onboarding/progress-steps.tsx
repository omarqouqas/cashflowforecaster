'use client'

import { Check } from 'lucide-react'

const STEPS = ['Account', 'Income', 'Bills', 'Done!'] as const

export type OnboardingStepTitle = (typeof STEPS)[number]

export function ProgressSteps({
  currentStep,
  completed,
}: {
  currentStep: number
  completed: boolean[]
}) {
  const safeCurrent = Math.min(Math.max(currentStep, 0), STEPS.length - 1)
  const doneCount = completed.filter(Boolean).length
  const progress = (Math.min(doneCount, STEPS.length - 1) / (STEPS.length - 1)) * 100

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2">
        {STEPS.map((title, idx) => {
          const isDone = Boolean(completed[idx])
          const isCurrent = idx === safeCurrent

          return (
            <div key={title} className="flex flex-1 flex-col items-center gap-2">
              <div
                className={[
                  'h-8 w-8 rounded-full border flex items-center justify-center text-sm font-semibold',
                  isDone
                    ? 'bg-teal-500 border-teal-500 text-zinc-950'
                    : isCurrent
                      ? 'border-teal-500 text-teal-400 bg-zinc-950'
                      : 'border-zinc-700 text-zinc-400 bg-zinc-950',
                ].join(' ')}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isDone ? <Check className="h-4 w-4" /> : idx + 1}
              </div>

              <div
                className={[
                  'text-xs font-medium',
                  isCurrent ? 'text-teal-400' : isDone ? 'text-zinc-200' : 'text-zinc-500',
                ].join(' ')}
              >
                {title}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
        <div
          className="h-full bg-teal-500 transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  )
}
