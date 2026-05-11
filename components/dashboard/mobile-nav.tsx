'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Wallet,
  TrendingUp,
  Calendar,
  Settings,
  Receipt,
  Home,
  ChevronDown,
  CreditCard,
  HelpCircle,
  LogOut,
  Clock,
} from 'lucide-react';
import { createPortalSession } from '@/lib/actions/stripe';

interface MobileNavProps {
  userEmail: string;
  userName?: string;
  userTier: 'free' | 'pro' | 'premium' | 'lifetime';
}

function UserAvatar({
  name,
  email,
  className = '',
}: {
  name?: string;
  email: string;
  className?: string;
}) {
  const getInitialsFromEmail = (email: string) => {
    const localPart = email.split('@')[0] ?? email;
    return localPart.slice(0, 2).toUpperCase();
  };

  const initials = name
    ? name
        .split(' ')
        .filter((n) => n.length > 0)
        .map((n) => n.charAt(0))
        .slice(0, 2)
        .join('')
        .toUpperCase() || getInitialsFromEmail(email)
    : getInitialsFromEmail(email);

  return (
    <div
      className={`rounded-full bg-teal-600 flex items-center justify-center text-white font-semibold ${className}`}
    >
      {initials}
    </div>
  );
}

export function MobileNav({ userEmail, userName, userTier }: MobileNavProps) {
  const pathname = usePathname();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isBillingLoading, setIsBillingLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const mobileLinks = [
    { href: '/dashboard', label: 'Home', icon: Home },
    { href: '/dashboard/accounts', label: 'Accounts', icon: Wallet },
    { href: '/dashboard/income', label: 'Income', icon: TrendingUp },
    { href: '/dashboard/bills', label: 'Bills', icon: Receipt },
    { href: '/dashboard/calendar', label: 'Calendar', icon: Calendar },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  const isLinkActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    if (href === '/dashboard/calendar') {
      return pathname.startsWith('/dashboard/calendar');
    }
    return pathname.startsWith(href);
  };

  const handleBilling = async () => {
    if (userTier === 'free') {
      setIsUserMenuOpen(false);
      window.location.href = '/pricing';
      return;
    }

    setIsBillingLoading(true);
    try {
      const result = await createPortalSession();
      if ('url' in result) {
        window.location.href = result.url;
      } else if ('error' in result) {
        console.error('Billing portal error:', result.error);
        setIsUserMenuOpen(false);
        window.location.href = `/dashboard/settings?error=${encodeURIComponent(result.error)}`;
      }
    } catch (error) {
      console.error('Billing portal error:', error);
    } finally {
      setIsBillingLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/auth/logout', { method: 'POST' });
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/auth/login';
    }
  };

  const getPlanLabel = () => {
    switch (userTier) {
      case 'pro':
        return 'Pro plan';
      case 'premium':
        return 'Premium plan';
      default:
        return 'Free plan';
    }
  };

  return (
    <>
      {/* Mobile User Avatar - In header */}
      <div className="flex md:hidden items-center">
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <UserAvatar email={userEmail} name={userName} className="w-8 h-8 text-xs" />
            <ChevronDown
              className={`w-4 h-4 text-zinc-500 dark:text-zinc-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Mobile Dropdown Menu */}
          {isUserMenuOpen && (
            <>
              {/* Backdrop to close dropdown */}
              <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)} />

              {/* Menu */}
              <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl z-20 p-1">
                {/* User Identity Section */}
                <div className="flex items-center gap-3 p-3 bg-zinc-100 dark:bg-zinc-700/30 rounded-lg mb-1">
                  <UserAvatar email={userEmail} name={userName} className="w-10 h-10 text-sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{userEmail}</p>
                    <p
                      className={`text-xs ${userTier === 'free' ? 'text-zinc-500 dark:text-zinc-400' : 'text-teal-600 dark:text-teal-400'}`}
                    >
                      {getPlanLabel()}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-zinc-200 dark:border-zinc-700 my-1" />

                {/* Quick Access */}
                <Link
                  href="/dashboard/time"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 min-h-[44px] text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 rounded-md transition-colors"
                >
                  <Clock className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                  Time Tracking
                </Link>

                <Link
                  href="/dashboard/invoices"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 min-h-[44px] text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 rounded-md transition-colors"
                >
                  <Receipt className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                  Invoices
                </Link>

                {/* Divider */}
                <div className="border-t border-zinc-200 dark:border-zinc-700 my-1" />

                {/* Navigation Items */}
                <Link
                  href="/dashboard/settings"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 min-h-[44px] text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 rounded-md transition-colors"
                >
                  <Settings className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                  Settings
                </Link>

                <button
                  onClick={handleBilling}
                  disabled={isBillingLoading}
                  className="w-full flex items-center gap-3 px-3 py-3 min-h-[44px] text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 rounded-md transition-colors disabled:opacity-50"
                >
                  <CreditCard className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                  {isBillingLoading ? 'Loading...' : 'Billing'}
                </button>

                <a
                  href="mailto:support@cashcast.money"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 min-h-[44px] text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 rounded-md transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                  Help & Support
                </a>

                {/* Divider */}
                <div className="border-t border-zinc-200 dark:border-zinc-700 my-1" />

                {/* Log Out */}
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-3 px-3 py-3 min-h-[44px] text-sm text-zinc-500 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors disabled:opacity-50"
                >
                  <LogOut className="w-4 h-4" />
                  {isLoggingOut ? 'Logging out...' : 'Log out'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <nav className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm border-t border-zinc-200 dark:border-zinc-800 px-2 pb-safe">
          <div className="flex items-center justify-between gap-1 h-16">
            {mobileLinks.map((link) => {
              const Icon = link.icon;
              const isActive = isLinkActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-label={link.label}
                  className={[
                    'flex flex-col items-center justify-center',
                    'flex-1 h-full min-w-0',
                    'transition-colors',
                    isActive ? 'text-teal-600 dark:text-teal-400' : 'text-zinc-500 dark:text-zinc-400 active:text-zinc-700 dark:active:text-zinc-200',
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
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
}
