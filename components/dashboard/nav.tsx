'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Wallet, TrendingUp, Calendar, Settings, Receipt } from 'lucide-react'

export function DashboardNav() {
  const pathname = usePathname()
  
  const links = [
    { href: '/dashboard/calendar', label: 'Calendar', icon: Calendar },
    { href: '/dashboard/accounts', label: 'Accounts', icon: Wallet },
    { href: '/dashboard/income', label: 'Income', icon: TrendingUp },
    { href: '/dashboard/bills', label: 'Bills', icon: Receipt },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ]

  const isLinkActive = (href: string) => {
    // Treat /dashboard as "Home" (calendar) for active state
    if (href === '/dashboard/calendar') {
      return pathname === '/dashboard' || pathname.startsWith('/dashboard/calendar')
    }

    return pathname.startsWith(href)
  }

  // Mobile bottom nav - 5 primary items (avoid truncation on iPhone)
  const mobileLinks = [
    { href: '/dashboard/calendar', label: 'Home', icon: Calendar },
    { href: '/dashboard/accounts', label: 'Accounts', icon: Wallet },
    { href: '/dashboard/income', label: 'Income', icon: TrendingUp },
    { href: '/dashboard/bills', label: 'Bills', icon: Receipt },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ]
  
  return (
    <>
      {/* Desktop Navigation - Hidden on mobile */}
      <div className="border-b border-zinc-200 bg-white sticky top-0 z-10 backdrop-blur-sm bg-white/90 hidden md:block">
        <nav className="flex gap-1 px-4 py-2 overflow-x-auto scrollbar-hide">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = isLinkActive(link.href)
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
              const isActive = isLinkActive(link.href)

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-label={link.label}
                  className={[
                    'flex flex-col items-center justify-center',
                    'flex-1 h-full min-w-0',
                    'transition-colors',
                    isActive ? 'text-teal-400' : 'text-zinc-400 active:text-zinc-200',
                  ].join(' ')}
                >
                  <Icon className="w-6 h-6" />
                  <span className="sr-only">{link.label}</span>
                  <span
                    aria-hidden="true"
                    className="mt-1 text-[10px] leading-none font-medium truncate max-w-[56px] hidden min-[375px]:block"
                  >
                    {link.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </>
  )
}