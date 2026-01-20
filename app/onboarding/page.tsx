'use client'

import { useEffect, useMemo, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

import { showError } from '@/lib/toast'
import { ProgressSteps } from '@/components/onboarding/progress-steps'
import { StepQuickSetup } from '@/components/onboarding/step-quick-setup'
import { StepBills } from '@/components/onboarding/step-bills'

import {
  onboardingCreateAccount,
  onboardingCreateBills,
  onboardingCreateIncomes,
  onboardingMarkComplete,
} from '@/lib/actions/onboarding'

export default function OnboardingPage() {
  const router = useRouter()

  const STORAGE_KEY = 'cff_onboarding_state_v2' // Bumped version for new 2-step flow

  type PersistedState = {
    step: number
    completed: boolean[]
    startingBalance: number | null
    currency: string
    billsTracked: number
  }

  // Track if we've shown storage warning to avoid repeated toasts
  const storageWarningShown = useRef(false)

  function isStorageAvailable(): boolean {
    if (typeof window === 'undefined') return false
    try {
      const testKey = '__storage_test__'
      window.sessionStorage.setItem(testKey, testKey)
      window.sessionStorage.removeItem(testKey)
      return true
    } catch {
      return false
    }
  }

  function loadPersisted(): PersistedState | null {
    if (typeof window === 'undefined') return null

    // Check if storage is available (private browsing mode may block it)
    if (!isStorageAvailable()) {
      if (!storageWarningShown.current) {
        storageWarningShown.current = true
        // Delay toast to avoid hydration issues
        setTimeout(() => {
          showError('Private browsing detected. Your progress won\'t be saved if you refresh.')
        }, 100)
      }
      return null
    }

    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      const parsed = JSON.parse(raw) as Partial<PersistedState>
      if (typeof parsed.step !== 'number') return null
      return {
        step: Math.min(1, Math.max(0, parsed.step)), // Max step is now 1 (Bills)
        completed: Array.isArray(parsed.completed) ? parsed.completed.map(Boolean).slice(0, 2) : [false, false],
        startingBalance:
          typeof parsed.startingBalance === 'number' || parsed.startingBalance === null
            ? parsed.startingBalance
            : null,
        currency: typeof parsed.currency === 'string' && parsed.currency ? parsed.currency : 'USD',
        billsTracked: typeof parsed.billsTracked === 'number' ? parsed.billsTracked : 0,
      }
    } catch {
      // JSON parsing failed - corrupted data, start fresh
      if (!storageWarningShown.current) {
        storageWarningShown.current = true
        setTimeout(() => {
          showError('Could not restore your progress. Starting fresh.')
        }, 100)
      }
      // Clear corrupted data
      try {
        window.sessionStorage.removeItem(STORAGE_KEY)
      } catch {
        // ignore cleanup failure
      }
      return null
    }
  }

  const persisted = loadPersisted()

  const [step, setStep] = useState<number>(persisted?.step ?? 0)
  const [completed, setCompleted] = useState<boolean[]>(persisted?.completed ?? [false, false])

  const [startingBalance, setStartingBalance] = useState<number | null>(persisted?.startingBalance ?? null)
  const [currency, setCurrency] = useState<string>(persisted?.currency ?? 'USD')
  const [billsTracked, setBillsTracked] = useState<number>(persisted?.billsTracked ?? 0)

  const [globalError, setGlobalError] = useState<string | null>(null)

  useEffect(() => {
    // Persist wizard progress so server action refreshes don't reset the step back to 0.
    if (!isStorageAvailable()) {
      return
    }
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
      // Storage write failed - only warn once
      if (!storageWarningShown.current) {
        storageWarningShown.current = true
        showError('Could not save your progress. Complete setup without refreshing.')
      }
    }
  }, [step, completed, startingBalance, currency, billsTracked])

  const pageTitle = useMemo(() => {
    switch (step) {
      case 0:
        return 'Quick Setup'
      case 1:
        return 'Bills'
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
    setStep((s) => Math.min(1, s + 1))
  }

  async function finishOnboarding() {
    setGlobalError(null)
    const res = await onboardingMarkComplete()
    if ('error' in res) {
      setGlobalError(res.error)
      return false
    }
    try {
      window.sessionStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
    return true
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="mx-auto w-full max-w-lg px-4 pt-10 pb-32">
        <div className="mb-8">
          <p className="text-xs font-medium tracking-wide text-zinc-500">Setup</p>
          <h1 className="mt-1 text-2xl font-semibold">{pageTitle}</h1>
          <p className="mt-1 text-sm text-zinc-400">
            See your first forecast in under 60 seconds.
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
            <StepQuickSetup
              onContinue={async (values) => {
                setGlobalError(null)

                // Create account with defaults
                const accountRes = await onboardingCreateAccount({
                  name: 'Main Account',
                  account_type: 'checking',
                  current_balance: values.balance,
                  currency: 'USD',
                  is_spendable: true,
                })

                if ('error' in accountRes) throw new Error(accountRes.error)

                setStartingBalance(accountRes.account.current_balance ?? values.balance)
                setCurrency(accountRes.account.currency ?? 'USD')

                // Create income if provided
                if (values.income) {
                  const incomeRes = await onboardingCreateIncomes([values.income])
                  if ('error' in incomeRes) throw new Error(incomeRes.error)
                }

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
            <StepBills
              onContinue={async (rows) => {
                setGlobalError(null)
                const res = await onboardingCreateBills(rows)
                if ('error' in res) throw new Error(res.error)

                setBillsTracked(res.bills.length)
                markStepComplete(1)

                // Mark onboarding complete and redirect to calendar
                const success = await finishOnboarding()
                if (success) {
                  router.push('/dashboard/calendar')
                }
              }}
              onSkip={async () => {
                setGlobalError(null)
                setBillsTracked(0)
                markStepComplete(1)

                // Mark onboarding complete and redirect to calendar
                const success = await finishOnboarding()
                if (success) {
                  router.push('/dashboard/calendar')
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
