import { requireAuth } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'
import { Tables } from '@/types/supabase'
import generateCalendar from '@/lib/calendar/generate'
import { getForecastDaysLimit } from '@/lib/stripe/subscription'
import Link from 'next/link'
import { ArrowLeft, Calendar as CalendarIcon } from 'lucide-react'
import { CalendarHybridView } from '@/components/calendar/calendar-hybrid-view'
import { ScenarioButton } from '@/components/scenarios/scenario-button'

type Account = Tables<'accounts'>
type Income = Tables<'income'>
type Bill = Tables<'bills'>

export default async function CalendarPage() {
  const user = await requireAuth()
  const supabase = await createClient()

  const forecastDays = await getForecastDaysLimit(user.id)

  // Fetch active data for current user
  const [accountsResult, incomeResult, billsResult, settingsResult] = await Promise.all([
    supabase
      .from('accounts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('income')
      .select('*')
      .eq('user_id', user.id)
      .or('is_active.is.null,is_active.eq.true')
      .order('created_at', { ascending: false }),
    supabase
      .from('bills')
      .select('*')
      .eq('user_id', user.id)
      .or('is_active.is.null,is_active.eq.true')
      .order('created_at', { ascending: false }),
    supabase
      .from('user_settings')
      .select('safety_buffer, timezone')
      .eq('user_id', user.id)
      .single(),
  ])

  const accounts: Account[] = (accountsResult.data || []) as any
  const income: Income[] = (incomeResult.data || []) as any
  const bills: Bill[] = (billsResult.data || []) as any

  const settings = settingsResult.data as any
  const safetyBuffer = settings?.safety_buffer ?? 500
  const timezone = settings?.timezone ?? null

  const fetchErrors = [accountsResult.error, incomeResult.error, billsResult.error].filter(
    Boolean
  )

  if (accounts.length === 0) {
    return (
      <div>
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-zinc-100">Cash Flow Calendar</h1>
          <p className="text-sm text-slate-600 dark:text-zinc-400">{forecastDays}-day projection</p>
        </div>

        <div className="border border-zinc-800 bg-zinc-900 rounded-lg overflow-hidden">
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center py-10">
            <div className="w-20 h-20 bg-teal-500/10 rounded-full flex items-center justify-center mb-6">
              <CalendarIcon className="w-10 h-10 text-teal-500" />
            </div>

            <h2 className="text-xl font-semibold text-zinc-100 mb-2">Your forecast starts here</h2>
            <p className="text-zinc-400 mb-8 max-w-xs">
              Add a bank account with your current balance to see your cash flow {forecastDays} days into the future.
            </p>

            <Link
              href="/dashboard/accounts/new"
              className="w-full max-w-xs bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-6 rounded-lg transition-colors min-h-[44px] inline-flex items-center justify-center"
            >
              Add your first account
            </Link>

            <p className="text-zinc-500 text-sm mt-6">Takes less than 2 minutes to set up</p>
          </div>
        </div>
      </div>
    )
  }

  let calendarData: ReturnType<typeof generateCalendar> | null = null
  let calendarError: string | null = null

  try {
    calendarData = generateCalendar(accounts, income, bills, safetyBuffer, timezone ?? undefined, forecastDays)
  } catch (e) {
    calendarError = e instanceof Error ? e.message : 'Failed to generate calendar'
  }

  if (!calendarData) {
    return (
      <div>
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-zinc-100">Cash Flow Calendar</h1>
          <p className="text-sm text-slate-600 dark:text-zinc-400">{forecastDays}-day projection</p>
        </div>

        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-200 rounded-md px-4 py-3 mb-6">
          {calendarError || 'Error generating calendar. Please try again.'}
        </div>
      </div>
    )
  }

  const startingBalance = calendarData.startingBalance
  const endingBalance = calendarData.days[calendarData.days.length - 1]?.balance ?? startingBalance
  const totalIncome = calendarData.days.reduce((sum, d) => sum + d.income.reduce((s, t) => s + t.amount, 0), 0)
  const totalBills = calendarData.days.reduce((sum, d) => sum + d.bills.reduce((s, t) => s + t.amount, 0), 0)
  const currency = accounts[0]?.currency || 'USD'

  // Calculate safe to spend
  const next14Days = calendarData.days.slice(0, 14)
  const lowestIn14Days =
    next14Days.length === 0 ? startingBalance : Math.min(...next14Days.map((d) => d.balance))
  const safeToSpend = Math.max(0, lowestIn14Days - safetyBuffer)

  // Prepare data for client component
  const calendarContainerData = {
    days: calendarData.days,
    startingBalance,
    lowestBalance: calendarData.lowestBalance,
    lowestBalanceDate: calendarData.lowestBalanceDay,
    lowestIn14Days,
    totalIncome,
    totalBills,
    endingBalance,
    safetyBuffer,
    safeToSpend, // NEW
    currency,
    collisions: calendarData.collisions,
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>
      </div>

      <div className="border border-zinc-800 bg-zinc-900 rounded-lg overflow-hidden">
        {/* Page Header */}
        <div className="px-4 py-4 border-b border-zinc-800">
          <h1 className="text-xl font-semibold text-zinc-100">Cash Flow Calendar</h1>
          <p className="text-sm text-zinc-400">{forecastDays}-day projection</p>
        </div>

        {fetchErrors.length > 0 && (
          <div className="px-4 pt-4">
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-200 rounded-md px-4 py-3">
              Error loading some calendar data. The projection may be incomplete.
            </div>
          </div>
        )}

        <CalendarHybridView calendarData={calendarContainerData} />
      </div>

      {/* Floating Scenario Tester */}
      <ScenarioButton variant="fab" source="calendar" />
    </div>
  )
}