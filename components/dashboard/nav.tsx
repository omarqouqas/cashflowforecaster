'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Calendar,
  Settings,
  Receipt,
  FileText,
  Upload,
  ChevronDown,
  CreditCard,
  HelpCircle,
  LogOut,
  Home,
  FileBarChart,
  ClipboardList,
  ArrowRightLeft,
} from 'lucide-react';
import { ScenarioButton } from '@/components/scenarios/scenario-button';
import { createPortalSession } from '@/lib/actions/stripe';

interface DashboardNavProps {
  userEmail: string;
  userName?: string;
  userTier: 'free' | 'pro' | 'premium';
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

export function DashboardNav({ userEmail, userName, userTier }: DashboardNavProps) {
  const pathname = usePathname();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isBillingLoading, setIsBillingLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const links = [
    { href: '/dashboard/calendar', label: 'Calendar', icon: Calendar },
    { href: '/dashboard/accounts', label: 'Accounts', icon: Wallet },
    { href: '/dashboard/income', label: 'Income', icon: TrendingUp },
    { href: '/dashboard/bills', label: 'Bills', icon: FileText },
    { href: '/dashboard/transfers', label: 'Transfers', icon: ArrowRightLeft },
    { href: '/dashboard/debt-payoff', label: 'Debt Payoff', icon: TrendingDown },
    { href: '/dashboard/import', label: 'Import', icon: Upload },
    { href: '/dashboard/invoices', label: 'Invoices', icon: Receipt },
    { href: '/dashboard/quotes', label: 'Quotes', icon: ClipboardList },
    { href: '/dashboard/reports', label: 'Reports', icon: FileBarChart },
  ];

  const isLinkActive = (href: string) => {
    if (href === '/dashboard') {
      // Home is active only on exact /dashboard match
      return pathname === '/dashboard';
    }
    if (href === '/dashboard/calendar') {
      return pathname.startsWith('/dashboard/calendar');
    }
    return pathname.startsWith(href);
  };

  const mobileLinks = [
    { href: '/dashboard', label: 'Home', icon: Home },
    { href: '/dashboard/accounts', label: 'Accounts', icon: Wallet },
    { href: '/dashboard/income', label: 'Income', icon: TrendingUp },
    { href: '/dashboard/bills', label: 'Bills', icon: Receipt },
    { href: '/dashboard/calendar', label: 'Calendar', icon: Calendar },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

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
        // Handle error - likely dev/prod Stripe mismatch
        console.error('Billing portal error:', result.error);
        setIsUserMenuOpen(false);
        // Redirect to settings with error message
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
      {/* Mobile User Avatar - Visible only on mobile, in header */}
      <div className="flex md:hidden items-center">
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <UserAvatar email={userEmail} name={userName} className="w-8 h-8 text-xs" />
            <ChevronDown
              className={`w-4 h-4 text-zinc-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Mobile Dropdown Menu */}
          {isUserMenuOpen && (
            <>
              {/* Backdrop to close dropdown */}
              <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)} />

              {/* Menu */}
              <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl z-20 p-1">
                {/* User Identity Section */}
                <div className="flex items-center gap-3 p-3 bg-zinc-700/30 rounded-lg mb-1">
                  <UserAvatar email={userEmail} name={userName} className="w-10 h-10 text-sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-100 truncate">{userEmail}</p>
                    <p
                      className={`text-xs ${userTier === 'free' ? 'text-zinc-400' : 'text-teal-400'}`}
                    >
                      {getPlanLabel()}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-zinc-700 my-1" />

                {/* Navigation Items */}
                <Link
                  href="/dashboard/settings"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 min-h-[44px] text-sm text-zinc-200 hover:bg-zinc-700/50 rounded-md transition-colors"
                >
                  <Settings className="w-4 h-4 text-zinc-400" />
                  Settings
                </Link>

                <button
                  onClick={handleBilling}
                  disabled={isBillingLoading}
                  className="w-full flex items-center gap-3 px-3 py-3 min-h-[44px] text-sm text-zinc-200 hover:bg-zinc-700/50 rounded-md transition-colors disabled:opacity-50"
                >
                  <CreditCard className="w-4 h-4 text-zinc-400" />
                  {isBillingLoading ? 'Loading...' : 'Billing'}
                </button>

                <a
                  href="mailto:support@cashflowforecaster.io"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 min-h-[44px] text-sm text-zinc-200 hover:bg-zinc-700/50 rounded-md transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-zinc-400" />
                  Help & Support
                </a>

                {/* Divider */}
                <div className="border-t border-zinc-700 my-1" />

                {/* Log Out */}
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-3 px-3 py-3 min-h-[44px] text-sm text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors disabled:opacity-50"
                >
                  <LogOut className="w-4 h-4" />
                  {isLoggingOut ? 'Logging out...' : 'Log out'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Desktop Navigation - Hidden on mobile */}
      <div className="hidden md:flex items-center gap-4">
        <nav className="flex gap-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = isLinkActive(link.href);
            const isCalendar = link.href === '/dashboard/calendar';

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
            );
          })}

          <ScenarioButton variant="nav" source="nav" label="Afford it?" />
        </nav>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <UserAvatar email={userEmail} name={userName} className="w-8 h-8 text-xs" />
            <span className="hidden lg:block text-sm text-zinc-300 truncate max-w-[150px]">
              {userEmail}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-zinc-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown Menu */}
          {isUserMenuOpen && (
            <>
              {/* Backdrop to close dropdown */}
              <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)} />

              {/* Menu */}
              <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl z-20 p-1">
                {/* User Identity Section */}
                <div className="flex items-center gap-3 p-3 bg-zinc-700/30 rounded-lg mb-1">
                  <UserAvatar email={userEmail} name={userName} className="w-10 h-10 text-sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-100 truncate">{userEmail}</p>
                    <p
                      className={`text-xs ${userTier === 'free' ? 'text-zinc-400' : 'text-teal-400'}`}
                    >
                      {getPlanLabel()}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-zinc-700 my-1" />

                {/* Navigation Items */}
                <Link
                  href="/dashboard/settings"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 min-h-[44px] text-sm text-zinc-200 hover:bg-zinc-700/50 rounded-md transition-colors"
                >
                  <Settings className="w-4 h-4 text-zinc-400" />
                  Settings
                </Link>

                <button
                  onClick={handleBilling}
                  disabled={isBillingLoading}
                  className="w-full flex items-center gap-3 px-3 py-3 min-h-[44px] text-sm text-zinc-200 hover:bg-zinc-700/50 rounded-md transition-colors disabled:opacity-50"
                >
                  <CreditCard className="w-4 h-4 text-zinc-400" />
                  {isBillingLoading ? 'Loading...' : 'Billing'}
                </button>

                <a
                  href="mailto:support@cashflowforecaster.io"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 min-h-[44px] text-sm text-zinc-200 hover:bg-zinc-700/50 rounded-md transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-zinc-400" />
                  Help & Support
                </a>

                {/* Divider */}
                <div className="border-t border-zinc-700 my-1" />

                {/* Log Out */}
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-3 px-3 py-3 min-h-[44px] text-sm text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors disabled:opacity-50"
                >
                  <LogOut className="w-4 h-4" />
                  {isLoggingOut ? 'Logging out...' : 'Log out'}
                </button>
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
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
}
