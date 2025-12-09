'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Wallet, TrendingUp, FileText, Calendar, Settings } from 'lucide-react'

export function DashboardNav() {
  const pathname = usePathname()
  
  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/accounts', label: 'Accounts', icon: Wallet },
    { href: '/dashboard/income', label: 'Income', icon: TrendingUp },
    { href: '/dashboard/bills', label: 'Bills', icon: FileText },
    { href: '/dashboard/calendar', label: 'Calendar', icon: Calendar },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ]
  
  return (
    <nav className="flex gap-1 sm:gap-4 overflow-x-auto border-b border-slate-200 dark:border-slate-700 px-4 bg-white dark:bg-slate-800">
      {links.map((link) => {
        const Icon = link.icon
        // For dashboard home, exact match. For other routes, check if pathname starts with the href
        const isActive = link.href === '/dashboard' 
          ? pathname === link.href
          : pathname.startsWith(link.href)
        
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`
              flex items-center gap-2 px-3 py-3 border-b-2 -mb-px transition-colors whitespace-nowrap
              ${isActive 
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' 
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }
            `}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">{link.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

