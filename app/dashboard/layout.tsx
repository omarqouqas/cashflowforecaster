import type { Metadata } from 'next'
import { requireAuth } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'
import { EmailVerificationBanner } from '@/components/auth/email-verification-banner'
import { MobileNav } from '@/components/dashboard/mobile-nav'
import { Sidebar, SidebarProvider, SidebarContentWrapper } from '@/components/dashboard/sidebar'
import { redirect } from 'next/navigation'
import { IdentifyUser } from '@/components/analytics/identify-user'
import { AskButton } from '@/components/ask'
import { TimerProvider } from '@/components/time/timer-context'
import { ThemeProvider } from '@/components/theme/theme-provider'
import Link from 'next/link'
/* eslint-disable @next/next/no-img-element */

// Prevent search engines from indexing authenticated dashboard pages
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

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

  // Fetch time settings separately (table may not exist yet)
  let timeSettingsData: { default_hourly_rate?: number } | null = null
  try {
    const { data } = await (supabase as unknown as { from: (table: string) => { select: (cols: string) => { eq: (col: string, val: string) => { maybeSingle: () => Promise<{ data: { default_hourly_rate?: number } | null }> } } } })
      .from('user_time_settings')
      .select('default_hourly_rate')
      .eq('user_id', user.id)
      .maybeSingle()
    timeSettingsData = data
  } catch {
    // Table doesn't exist yet, use default
  }

  const settingsData = settingsRow.data as { onboarding_complete?: boolean } | null
  const userData = userRow.data as { full_name?: string } | null
  const subscriptionData = subscriptionRow.data as { tier?: string } | null

  const isOnboarded = settingsData?.onboarding_complete === true
  const hasAccounts = (accountCount ?? 0) > 0
  const userName = userData?.full_name ?? undefined
  const userTier = (subscriptionData?.tier as 'free' | 'pro' | 'premium' | 'lifetime') ?? 'free'
  const canUseTimeTracking = userTier !== 'free'
  const defaultHourlyRate = timeSettingsData?.default_hourly_rate ?? 0

  if (!isOnboarded && !hasAccounts) {
    redirect('/onboarding')
  }

  return (
    <ThemeProvider>
      <TimerProvider>
        <SidebarProvider>
          <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <IdentifyUser />
            <EmailVerificationBanner user={user} />

            {/* Desktop Sidebar - Hidden on mobile */}
            <div className="hidden md:block">
              <Sidebar
                userEmail={user.email ?? ''}
                userName={userName}
                userTier={userTier}
                canUseTimeTracking={canUseTimeTracking}
                defaultHourlyRate={defaultHourlyRate}
              />
            </div>

            {/* Mobile Header - Visible only on mobile */}
            <header className="md:hidden bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 relative z-30">
              <div className="px-4">
                <div className="flex justify-between items-center h-16">
                  <Link href="/dashboard" className="flex-shrink-0">
                    <img
                      src="/cashcast-lockup.svg"
                      alt="Cashcast logo"
                      height={32}
                      width={180}
                      className="h-8 w-auto"
                    />
                  </Link>
                  <MobileNav
                    userEmail={user.email ?? ''}
                    userName={userName}
                    userTier={userTier}
                  />
                </div>
              </div>
            </header>

            {/* Main content area */}
            <SidebarContentWrapper>
              {children}
            </SidebarContentWrapper>

            {/* Floating button */}
            <AskButton variant="fab" />
          </div>
        </SidebarProvider>
      </TimerProvider>
    </ThemeProvider>
  )
}
