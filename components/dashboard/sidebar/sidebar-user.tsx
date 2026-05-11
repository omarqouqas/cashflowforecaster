'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Settings,
  CreditCard,
  HelpCircle,
  MessageSquare,
  LogOut,
  ChevronUp,
} from 'lucide-react';
import { FeedbackModal } from '@/components/feedback/feedback-modal';
import { createPortalSession } from '@/lib/actions/stripe';
import { SidebarTooltip } from './sidebar-tooltip';

interface SidebarUserProps {
  userEmail: string;
  userName?: string;
  userTier: 'free' | 'pro' | 'premium' | 'lifetime';
  isCollapsed: boolean;
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
      className={`rounded-full bg-teal-600 flex items-center justify-center text-white font-semibold flex-shrink-0 ${className}`}
    >
      {initials}
    </div>
  );
}

export function SidebarUser({ userEmail, userName, userTier, isCollapsed }: SidebarUserProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBillingLoading, setIsBillingLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const getPlanLabel = () => {
    switch (userTier) {
      case 'pro':
        return 'Pro';
      case 'premium':
      case 'lifetime':
        return 'Premium';
      default:
        return 'Free';
    }
  };

  const handleBilling = async () => {
    if (userTier === 'free') {
      setIsMenuOpen(false);
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
        setIsMenuOpen(false);
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

  return (
    <div className="relative px-2 py-3 border-t border-zinc-200 dark:border-zinc-800">
      <SidebarTooltip content={userEmail} show={isCollapsed}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={[
            'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg',
            'text-left transition-colors',
            'hover:bg-zinc-100 dark:hover:bg-zinc-800/50',
            isCollapsed ? 'justify-center' : '',
          ].join(' ')}
        >
          <UserAvatar email={userEmail} name={userName} className="w-8 h-8 text-xs" />
          {!isCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                  {userName || userEmail.split('@')[0]}
                </p>
                <p className={`text-xs ${userTier === 'free' ? 'text-zinc-500' : 'text-teal-600 dark:text-teal-400'}`}>
                  {getPlanLabel()}
                </p>
              </div>
              <ChevronUp
                className={`w-4 h-4 text-zinc-500 dark:text-zinc-400 transition-transform ${isMenuOpen ? '' : 'rotate-180'}`}
              />
            </>
          )}
        </button>
      </SidebarTooltip>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />

          {/* Menu - positioned above the button */}
          <div className={[
            'absolute z-50 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl py-1',
            isCollapsed ? 'left-full ml-2 bottom-0 w-56' : 'left-2 right-2 bottom-full mb-2',
          ].join(' ')}>
            {/* User info when collapsed */}
            {isCollapsed && (
              <div className="px-3 py-2 border-b border-zinc-200 dark:border-zinc-700">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{userEmail}</p>
                <p className={`text-xs ${userTier === 'free' ? 'text-zinc-500' : 'text-teal-600 dark:text-teal-400'}`}>
                  {getPlanLabel()} plan
                </p>
              </div>
            )}

            <Link
              href="/dashboard/settings"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>

            <button
              onClick={handleBilling}
              disabled={isBillingLoading}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors disabled:opacity-50"
            >
              <CreditCard className="w-4 h-4" />
              {isBillingLoading ? 'Loading...' : 'Billing'}
            </button>

            <a
              href="mailto:support@cashcast.money"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              Help & Support
            </a>

            <button
              onClick={() => {
                setIsMenuOpen(false);
                setIsFeedbackOpen(true);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Send Feedback
            </button>

            <div className="border-t border-zinc-200 dark:border-zinc-700 my-1" />

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" />
              {isLoggingOut ? 'Logging out...' : 'Log out'}
            </button>
          </div>
        </>
      )}

      {/* Feedback Modal */}
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </div>
  );
}
