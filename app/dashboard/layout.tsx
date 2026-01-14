import { requireAuth } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'
import { EmailVerificationBanner } from '@/components/auth/email-verification-banner'
import { DashboardNav } from '@/components/dashboard/nav'
import { LogoutButton } from '@/components/auth/logout-button'
import { redirect } from 'next/navigation'
import { IdentifyUser } from '@/components/analytics/identify-user'
import { FeedbackButton } from '@/components/feedback/feedback-button'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAuth()

  // Onboarding gate: if user has no accounts and has not completed onboarding,
  // redirect them to the guided setup wizard.
  const supabase = await createClient()
  const [{ count: accountCount }, settingsRow] = await Promise.all([
    supabase
      .from('accounts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id),
    supabase
      .from('user_settings')
      .select('onboarding_complete')
      .eq('user_id', user.id)
      .maybeSingle(),
  ])

  const settingsData = settingsRow.data as any
  const isOnboarded = settingsData?.onboarding_complete === true
  const hasAccounts = (accountCount ?? 0) > 0

  if (!isOnboarded && !hasAccounts) {
    redirect('/onboarding')
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <IdentifyUser />
      <EmailVerificationBanner user={user} />
      
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Cash Flow Forecaster
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                {user.email}
              </span>
              <LogoutButton />
            </div>
          </div>
        </div>
        {/* DashboardNav now handles both desktop (top) and mobile (bottom) navigation */}
        <DashboardNav />
      </header>
      
      {/* 
        Main content area
        - Bottom padding accounts for fixed bottom nav (64px) + iPhone safe area
        - md:pb-8 on desktop (no bottom nav)
      */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-8">
        {children}
      </main>

      {/* Floating feedback button */}
      <FeedbackButton />
    </div>
  )
}