import Link from 'next/link'
import { Calendar } from 'lucide-react'

export function CalendarEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <Calendar className="w-12 h-12 text-zinc-300" />
      <h2 className="text-lg font-medium text-zinc-900 mt-4">No data yet</h2>
      <p className="text-sm text-zinc-500 text-center mt-2 max-w-xs">
        Add your accounts, income, and bills to see your 60-day cash flow projection.
      </p>
      <div className="mt-6">
        <Link
          href="/dashboard/accounts/new"
          className="inline-flex items-center justify-center w-full bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md px-4 py-2.5 min-h-[44px] transition-colors"
        >
          Add account
        </Link>
      </div>
    </div>
  )
}
