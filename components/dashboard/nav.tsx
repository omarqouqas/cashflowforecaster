'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Wallet, TrendingUp, FileText, Calendar, Settings, Receipt, CircleDollarSign } from 'lucide-react'
import { ScenarioButton } from '@/components/scenarios/scenario-button'

export function DashboardNav() {
  const pathname = usePathname()
  
  const links = [
    { href: '/dashboard/calendar', label: 'Calendar', icon: Calendar },
    { href: '/dashboard/accounts', label: 'Accounts', icon: Wallet },
    { href: '/dashboard/income', label: 'Income', icon: TrendingUp },
    { href: '/dashboard/bills', label: 'Bills', icon: FileText },
    { href: '/dashboard/invoices', label: 'Invoices', icon: Receipt },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ]

  // Mobile bottom nav - only the most important items
  const mobileLinks = [
    { href: '/dashboard/calendar', label: 'Calendar', icon: Calendar },
    { href: '/dashboard/accounts', label: 'Accounts', icon: Wallet },
    { href: '/dashboard/income', label: 'Income', icon: TrendingUp },
    { href: '/dashboard/bills', label: 'Bills', icon: FileText },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ]
  
  return (
    <>
      {/* Desktop Navigation - Hidden on mobile */}
      <div className="border-b border-zinc-200 bg-white sticky top-0 z-10 backdrop-blur-sm bg-white/90 hidden md:block">
        <nav className="flex gap-1 px-4 py-2 overflow-x-auto scrollbar-hide">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname.startsWith(link.href)
            const isCalendar = link.href === '/dashboard/calendar'

            return (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  'px-3 py-2 min-h-[44px]',
                  'text-sm font-medium rounded-md whitespace-nowrap',
                  'transition-colors',
                  'inline-flex items-center gap-2',
                  isActive
                    ? 'text-zinc-900 bg-zinc-100'
                    : isCalendar
                      ? 'text-teal-700 hover:text-zinc-900 hover:bg-zinc-100'
                      : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100',
                ].join(' ')}
              >
                <Icon className="w-4 h-4" />
                <span>
                  {link.label}
                  {isCalendar && !isActive && (
                    <span className="bg-teal-100 text-teal-700 text-xs px-1.5 rounded ml-1">
                      NEW
                    </span>
                  )}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Mobile Bottom Navigation - Visible only on mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <nav className="bg-zinc-900/95 backdrop-blur-sm border-t border-zinc-800 px-2 pb-safe">
          <div className="flex items-center justify-between gap-1 h-16">
            {mobileLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname.startsWith(link.href)

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    'flex flex-col items-center justify-center',
                    'flex-1 h-full min-w-0',
                    'transition-colors',
                    isActive ? 'text-teal-400' : 'text-zinc-400 active:text-zinc-200',
                  ].join(' ')}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-[11px] mt-1 font-medium truncate w-full text-center px-1">{link.label}</span>
                </Link>
              )
            })}

            {/* "Can I Afford It?" Button - Special treatment */}
            <ScenarioButton 
              variant="mobile-nav" 
              source="mobile-nav"
              className="flex flex-col items-center justify-center flex-1 h-full min-w-0 text-teal-400 active:text-teal-300"
            />
          </div>
        </nav>
      </div>
    </>
  )
}

// Fallback if ScenarioButton doesn't support mobile-nav variant yet
// You may need to update ScenarioButton to handle this variant
// For now, here's a simple standalone version:

export function MobileAffordButton() {
  return (
    <button
      type="button"
      className="flex flex-col items-center justify-center w-16 h-full text-teal-400 active:text-teal-300"
      onClick={() => {
        // Trigger your scenario modal
        // This depends on how ScenarioButton works
      }}
    >
      <CircleDollarSign className="w-6 h-6" />
      <span className="text-xs mt-1 font-medium">Afford?</span>
    </button>
  )
}