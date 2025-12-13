'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Wallet, TrendingUp, FileText, Calendar, Settings, Receipt } from 'lucide-react'

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
  
  return (
    <div className="border-b border-zinc-200 bg-white sticky top-0 z-10 backdrop-blur-sm bg-white/90">
      <nav className="flex gap-1 px-4 py-2 overflow-x-auto -mx-4 px-4 scrollbar-hide">
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
  )
}

