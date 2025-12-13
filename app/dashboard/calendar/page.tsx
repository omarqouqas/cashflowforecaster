import { requireAuth } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'
import { Tables } from '@/types/supabase'
import generateCalendar from '@/lib/calendar/generate'
import Link from 'next/link'
import { Calendar as CalendarIcon } from 'lucide-react'
import { CalendarContainer } from '@/components/calendar/calendar-container'

type Account = Tables<'accounts'>
type Income = Tables<'income'>
type Bill = Tables<'bills'>

export default async function CalendarPage() {
  const user = await requireAuth()
  const supabase = await createClient()

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

  const accounts: Account[] = accountsResult.data || []
  const income: Income[] = incomeResult.data || []
  const bills: Bill[] = billsResult.data || []

  const safetyBuffer = settingsResult.data?.safety_buffer ?? 500
  const timezone = settingsResult.data?.timezone ?? null

  const fetchErrors = [accountsResult.error, incomeResult.error, billsResult.error].filter(
    Boolean
  )

  if (accounts.length === 0) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-zinc-900">Cash Flow Calendar</h1>
          <p className="text-sm text-zinc-500">60-day projection</p>
        </div>

        <div className="border border-zinc-200 bg-white rounded-lg p-6">
          <div className="text-center py-10">
            <CalendarIcon className="w-10 h-10 mx-auto mb-3 text-zinc-400" />
            <p className="text-zinc-500">Add an account to generate your forecast.</p>
            <div className="mt-6">
              <Link
                href="/dashboard/accounts/new"
                className="inline-flex items-center justify-center w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md px-4 py-2.5 min-h-[44px] transition-colors"
              >
                Add account
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  let calendarData: ReturnType<typeof generateCalendar> | null = null
  let calendarError: string | null = null

  try {
    calendarData = generateCalendar(accounts, income, bills, safetyBuffer, timezone ?? undefined)
  } catch (e) {
    calendarError = e instanceof Error ? e.message : 'Failed to generate calendar'
  }

  if (!calendarData) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-zinc-900">Cash Flow Calendar</h1>
          <p className="text-sm text-zinc-500">60-day projection</p>
        </div>

        <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-md px-4 py-3 mb-6">
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
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-zinc-900">Cash Flow Calendar</h1>
        <p className="text-sm text-zinc-500">60-day projection</p>
      </div>

      {fetchErrors.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-md px-4 py-3 mb-4">
          Error loading some calendar data. The projection may be incomplete.
        </div>
      )}

      <div className="border border-zinc-200 bg-white rounded-lg overflow-hidden">
        <CalendarContainer calendarData={calendarContainerData} />
      </div>
    </div>
  )
}