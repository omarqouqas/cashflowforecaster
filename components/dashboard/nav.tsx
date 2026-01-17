'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Wallet, TrendingUp, Calendar, Settings, Receipt, FileText, Upload, User, ChevronDown } from 'lucide-react'
import { ScenarioButton } from '@/components/scenarios/scenario-button'
import { LogoutButton } from '@/components/auth/logout-button'

interface DashboardNavProps {
  userEmail: string
}

export function DashboardNav({ userEmail }: DashboardNavProps) {
  const pathname = usePathname()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const links = [
    { href: '/dashboard/calendar', label: 'Calendar', icon: Calendar },
    { href: '/dashboard/accounts', label: 'Accounts', icon: Wallet },
    { href: '/dashboard/income', label: 'Income', icon: TrendingUp },
    { href: '/dashboard/bills', label: 'Bills', icon: FileText },
    { href: '/dashboard/import', label: 'Import', icon: Upload },
    { href: '/dashboard/invoices', label: 'Invoices', icon: Receipt },
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
    { href: '/dashboard/import', label: 'Import', icon: Upload },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <>
      {/* Desktop Navigation - Hidden on mobile */}
      <div className="hidden md:flex items-center gap-4">
        <nav className="flex gap-1">
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
                    ? 'text-zinc-100 bg-zinc-800'
                    : isCalendar
                      ? 'text-teal-400 hover:text-zinc-100 hover:bg-zinc-800'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800',
                ].join(' ')}
              >
                <Icon className="w-4 h-4" />
                <span>
                  {link.label}
                  {isCalendar && !isActive && (
                    <span className="bg-teal-500/20 text-teal-300 text-xs px-1.5 rounded ml-1 border border-teal-500/30">
                      NEW
                    </span>
                  )}
                </span>
              </Link>
            )
          })}

          {/* Desktop-only: Scenario tester lives in the nav */}
          <ScenarioButton variant="nav" source="nav" label="Afford it?" />
        </nav>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-md transition-colors"
          >
            <User className="w-4 h-4" />
            <span className="hidden lg:inline max-w-[150px] truncate">{userEmail}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isUserMenuOpen && (
            <>
              {/* Backdrop to close dropdown */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsUserMenuOpen(false)}
              />

              {/* Menu */}
              <div className="absolute right-0 mt-2 w-64 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-20">
                <div className="p-3 border-b border-zinc-700">
                  <p className="text-sm text-zinc-400">Signed in as</p>
                  <p className="text-sm font-medium text-zinc-100 truncate">{userEmail}</p>
                </div>

                <div className="p-2">
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:text-zinc-100 hover:bg-zinc-700 rounded-md transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                </div>

                <div className="p-2 border-t border-zinc-700">
                  <LogoutButton />
                </div>
              </div>
            </>
          )}
        </div>
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