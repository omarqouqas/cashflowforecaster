'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Wallet, TrendingUp, FileText } from 'lucide-react'

export function DashboardNav() {
  const pathname = usePathname()
  
  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/accounts', label: 'Accounts', icon: Wallet },
    { href: '/dashboard/income', label: 'Income', icon: TrendingUp },
    { href: '/dashboard/bills', label: 'Bills', icon: FileText },
  ]
  
  return (
    <nav className="flex gap-4 border-b border-slate-200 dark:border-slate-700 px-4 bg-white dark:bg-slate-800">
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
              flex items-center gap-2 px-3 py-2 border-b-2 -mb-px transition-colors
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

