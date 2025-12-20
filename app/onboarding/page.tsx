'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { ProgressSteps } from '@/components/onboarding/progress-steps'
import { StepAccount } from '@/components/onboarding/step-account'
import { StepIncome } from '@/components/onboarding/step-income'
import { StepBills } from '@/components/onboarding/step-bills'
import { StepSuccess } from '@/components/onboarding/step-success'

import {
  onboardingCreateAccount,
  onboardingCreateBills,
  onboardingCreateIncomes,
  onboardingMarkComplete,
} from '@/lib/actions/onboarding'

export default function OnboardingPage() {
  const router = useRouter()

  const STORAGE_KEY = 'cff_onboarding_state_v1'

  type PersistedState = {
    step: number
    completed: boolean[]
    startingBalance: number | null
    currency: string
    billsTracked: number
  }

  function loadPersisted(): PersistedState | null {
    if (typeof window === 'undefined') return null
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      const parsed = JSON.parse(raw) as Partial<PersistedState>
      if (typeof parsed.step !== 'number') return null
      return {
        step: Math.min(3, Math.max(0, parsed.step)),
        completed: Array.isArray(parsed.completed) ? parsed.completed.map(Boolean).slice(0, 4) : [false, false, false, false],
        startingBalance:
          typeof parsed.startingBalance === 'number' || parsed.startingBalance === null
            ? parsed.startingBalance
            : null,
        currency: typeof parsed.currency === 'string' && parsed.currency ? parsed.currency : 'USD',
        billsTracked: typeof parsed.billsTracked === 'number' ? parsed.billsTracked : 0,
      }
    } catch {
      return null
    }
  }

  const persisted = loadPersisted()

  const [step, setStep] = useState<number>(persisted?.step ?? 0)
  const [completed, setCompleted] = useState<boolean[]>(persisted?.completed ?? [false, false, false, false])

  const [startingBalance, setStartingBalance] = useState<number | null>(persisted?.startingBalance ?? null)
  const [currency, setCurrency] = useState<string>(persisted?.currency ?? 'USD')
  const [billsTracked, setBillsTracked] = useState<number>(persisted?.billsTracked ?? 0)

  const [globalError, setGlobalError] = useState<string | null>(null)
  const [isFinalizing, setIsFinalizing] = useState(false)

  useEffect(() => {
    // Persist wizard progress so server action refreshes don't reset the step back to 0.
    try {
      const state: PersistedState = {
        step,
        completed,
        startingBalance,
        currency,
        billsTracked,
      }
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore storage failures (private mode / disabled storage)
    }
  }, [step, completed, startingBalance, currency, billsTracked])

  const pageTitle = useMemo(() => {
    switch (step) {
      case 0:
        return 'Account'
      case 1:
        return 'Income'
      case 2:
        return 'Bills'
      case 3:
        return 'Done'
      default:
        return 'Onboarding'
    }
  }, [step])

  function markStepComplete(idx: number) {
    setCompleted((prev) => {
      const next = [...prev]
      next[idx] = true
      return next
    })
  }

  function nextStep() {
    setStep((s) => Math.min(3, s + 1))
  }

  useEffect(() => {
    // When user reaches the success step, mark onboarding complete.
    if (step !== 3) return

    let cancelled = false

    async function run() {
      setIsFinalizing(true)
      setGlobalError(null)

      const res = await onboardingMarkComplete()
      if (cancelled) return

      if ('error' in res) {
        setGlobalError(res.error)
        setIsFinalizing(false)
        return
      }

      markStepComplete(3)
      try {
        window.sessionStorage.removeItem(STORAGE_KEY)
      } catch {
        // ignore
      }
      setIsFinalizing(false)
    }

    run()

    return () => {
      cancelled = true
    }
  }, [step])

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="mx-auto w-full max-w-lg px-4 pt-10 pb-32">
        <div className="mb-8">
          <p className="text-xs font-medium tracking-wide text-zinc-500">Setup</p>
          <h1 className="mt-1 text-2xl font-semibold">{pageTitle}</h1>
          <p className="mt-1 text-sm text-zinc-400">
            See your first forecast in under 2 minutes.
          </p>
        </div>

        <ProgressSteps currentStep={step} completed={completed} />

        {globalError && (
          <div className="mt-6 rounded-xl border border-rose-900/40 bg-rose-950/30 px-4 py-3 text-sm text-rose-200">
            {globalError}
          </div>
        )}

        <div key={step} className="mt-6 transition-opacity duration-200">
          {step === 0 && (
            <StepAccount
              defaultValues={{ name: 'Checking', account_type: 'checking' }}
              onContinue={async (values) => {
                setGlobalError(null)
                const res = await onboardingCreateAccount({
                  name: values.name,
                  account_type: values.account_type,
                  current_balance: values.current_balance,
                  currency: 'USD',
                  is_spendable: true,
                })

                if ('error' in res) throw new Error(res.error)

                setStartingBalance(res.account.current_balance ?? values.current_balance)
                setCurrency(res.account.currency ?? 'USD')

                markStepComplete(0)
                nextStep()
              }}
              onSkip={() => {
                setGlobalError(null)
                setStartingBalance(null)
                markStepComplete(0)
                nextStep()
              }}
            />
          )}

          {step === 1 && (
            <StepIncome
              onContinue={async (income) => {
                setGlobalError(null)
                const res = await onboardingCreateIncomes([income])
                if ('error' in res) throw new Error(res.error)

                markStepComplete(1)
                nextStep()
              }}
              onSkip={() => {
                setGlobalError(null)
                markStepComplete(1)
                nextStep()
              }}
            />
          )}

          {step === 2 && (
            <StepBills
              onContinue={async (rows) => {
                setGlobalError(null)
                const res = await onboardingCreateBills(rows)
                if ('error' in res) throw new Error(res.error)

                setBillsTracked(res.bills.length)

                markStepComplete(2)
                nextStep()
              }}
              onSkip={() => {
                setGlobalError(null)
                setBillsTracked(0)
                markStepComplete(2)
                nextStep()
              }}
            />
          )}

          {step === 3 && (
            <div className="space-y-4">
              <StepSuccess
                startingBalance={startingBalance}
                billsTracked={billsTracked}
                currency={currency}
                onSeeForecast={async () => {
                  if (!completed[3] && !isFinalizing) {
                    const res = await onboardingMarkComplete()
                    if ('error' in res) {
                      setGlobalError(res.error)
                      return
                    }
                    markStepComplete(3)
                  }

                  router.push('/dashboard/calendar')
                }}
                onGoDashboard={async () => {
                  if (!completed[3] && !isFinalizing) {
                    const res = await onboardingMarkComplete()
                    if ('error' in res) {
                      setGlobalError(res.error)
                      return
                    }
                    markStepComplete(3)
                  }

                  router.push('/dashboard')
                }}
              />

              {isFinalizing && (
                <p className="text-center text-xs text-zinc-500">
                  Finalizing your setup…
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}