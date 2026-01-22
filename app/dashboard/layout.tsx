import { requireAuth } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'
import { EmailVerificationBanner } from '@/components/auth/email-verification-banner'
import { DashboardNav } from '@/components/dashboard/nav'
import { redirect } from 'next/navigation'
import { IdentifyUser } from '@/components/analytics/identify-user'
import { FeedbackButton } from '@/components/feedback/feedback-button'
import Link from 'next/link'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAuth()

  // Onboarding gate: if user has no accounts and has not completed onboarding,
  // redirect them to the guided setup wizard.
  const supabase = await createClient()
  const [{ count: accountCount }, settingsRow, userRow, subscriptionRow] = await Promise.all([
    supabase
      .from('accounts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id),
    supabase
      .from('user_settings')
      .select('onboarding_complete')
      .eq('user_id', user.id)
      .maybeSingle(),
    supabase
      .from('users')
      .select('full_name')
      .eq('id', user.id)
      .maybeSingle(),
    supabase
      .from('subscriptions')
      .select('tier')
      .eq('user_id', user.id)
      .maybeSingle(),
  ])

  const settingsData = settingsRow.data as { onboarding_complete?: boolean } | null
  const userData = userRow.data as { full_name?: string } | null
  const subscriptionData = subscriptionRow.data as { tier?: string } | null

  const isOnboarded = settingsData?.onboarding_complete === true
  const hasAccounts = (accountCount ?? 0) > 0
  const userName = userData?.full_name ?? undefined
  const userTier = (subscriptionData?.tier as 'free' | 'pro' | 'premium') ?? 'free'

  if (!isOnboarded && !hasAccounts) {
    redirect('/onboarding')
  }
  
  return (
    <div className="min-h-screen bg-zinc-950">
      <IdentifyUser />
      <EmailVerificationBanner user={user} />

      <header className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex-shrink-0">
              <h1 className="text-xl font-bold text-zinc-100 hover:text-teal-400 transition-colors cursor-pointer whitespace-nowrap">
                Cash Flow Forecaster
              </h1>
            </Link>
            <DashboardNav userEmail={user.email ?? ''} userName={userName} userTier={userTier} />
          </div>
        </div>
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