'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Calendar,
  Wallet,
  TrendingUp,
  FileText,
  ArrowRightLeft,
  Receipt,
  Clock,
  Upload,
  Sparkles,
  TrendingDown,
  ClipboardList,
  FileBarChart,
  PanelLeftClose,
  PanelLeft,
  Calculator,
} from 'lucide-react';
import { useSidebar } from './sidebar-context';
import { SidebarNavItem } from './sidebar-nav-item';
import { SidebarSection } from './sidebar-section';
import { SidebarUpgrade } from './sidebar-upgrade';
import { SidebarUser } from './sidebar-user';
import { SidebarTooltip } from './sidebar-tooltip';
import { SidebarTimer } from './sidebar-timer';
import { UpgradePrompt } from '@/components/subscription/upgrade-prompt';
import { ScenarioModal } from '@/components/scenarios/scenario-modal';

interface SidebarProps {
  userEmail: string;
  userName?: string;
  userTier: 'free' | 'pro' | 'premium' | 'lifetime';
  canUseTimeTracking?: boolean;
  defaultHourlyRate?: number;
}

export function Sidebar({ userEmail, userName, userTier, canUseTimeTracking = false, defaultHourlyRate = 0 }: SidebarProps) {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapsed } = useSidebar();
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState<'invoices' | 'general'>('general');
  const [scenarioOpen, setScenarioOpen] = useState(false);

  const isFree = userTier === 'free';

  const isLinkActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    if (href === '/dashboard/calendar') {
      return pathname.startsWith('/dashboard/calendar');
    }
    return pathname.startsWith(href);
  };

  const handleLockedClick = (feature: 'invoices' | 'general') => {
    setUpgradeFeature(feature);
    setUpgradeOpen(true);
  };

  return (
    <>
      <aside
        className={[
          'fixed left-0 top-0 h-screen z-40',
          'bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800',
          'flex flex-col',
          'transition-all duration-200',
          isCollapsed ? 'w-16' : 'w-60',
        ].join(' ')}
      >
        {/* Header */}
        <div className={[
          'flex items-center h-16 px-3 border-b border-zinc-200 dark:border-zinc-800',
          isCollapsed ? 'justify-center' : 'justify-between',
        ].join(' ')}>
          {!isCollapsed && (
            <Link href="/dashboard" className="flex-shrink-0">
              <img
                src="/cashcast-lockup.svg"
                alt="Cashcast"
                height={28}
                width={140}
                className="h-7 w-auto"
              />
            </Link>
          )}
          <SidebarTooltip content={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} show={isCollapsed}>
            <button
              onClick={toggleCollapsed}
              className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <PanelLeft className="w-5 h-5" />
              ) : (
                <PanelLeftClose className="w-5 h-5" />
              )}
            </button>
          </SidebarTooltip>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto scrollbar-hide px-2 py-3">
          {/* Main navigation */}
          <div className="space-y-1">
            <SidebarNavItem
              href="/dashboard"
              label="Dashboard"
              icon={Home}
              isActive={isLinkActive('/dashboard')}
              isCollapsed={isCollapsed}
            />
            <SidebarNavItem
              href="/dashboard/calendar"
              label="Calendar"
              icon={Calendar}
              isActive={isLinkActive('/dashboard/calendar')}
              isCollapsed={isCollapsed}
            />
          </div>

          {/* Money section */}
          <SidebarSection title="Money" isCollapsed={isCollapsed}>
            <SidebarNavItem
              href="/dashboard/accounts"
              label="Accounts"
              icon={Wallet}
              isActive={isLinkActive('/dashboard/accounts')}
              isCollapsed={isCollapsed}
            />
            <SidebarNavItem
              href="/dashboard/income"
              label="Income"
              icon={TrendingUp}
              isActive={isLinkActive('/dashboard/income')}
              isCollapsed={isCollapsed}
            />
            <SidebarNavItem
              href="/dashboard/bills"
              label="Bills"
              icon={FileText}
              isActive={isLinkActive('/dashboard/bills')}
              isCollapsed={isCollapsed}
            />
            <SidebarNavItem
              href="/dashboard/transfers"
              label="Transfers"
              icon={ArrowRightLeft}
              isActive={isLinkActive('/dashboard/transfers')}
              isCollapsed={isCollapsed}
            />
          </SidebarSection>

          {/* Tools section */}
          <SidebarSection title="Tools" isCollapsed={isCollapsed}>
            <SidebarNavItem
              href="/dashboard/invoices"
              label="Invoices"
              icon={Receipt}
              isActive={isLinkActive('/dashboard/invoices')}
              isCollapsed={isCollapsed}
              isLocked={isFree}
              onClick={() => handleLockedClick('invoices')}
            />
            <SidebarNavItem
              href="/dashboard/quotes"
              label="Quotes"
              icon={ClipboardList}
              isActive={isLinkActive('/dashboard/quotes')}
              isCollapsed={isCollapsed}
              isLocked={isFree}
              onClick={() => handleLockedClick('invoices')}
            />
            <SidebarNavItem
              href="/dashboard/time"
              label="Time Tracking"
              icon={Clock}
              isActive={isLinkActive('/dashboard/time')}
              isCollapsed={isCollapsed}
              isLocked={isFree}
              onClick={() => handleLockedClick('general')}
            />
            <SidebarNavItem
              href="/dashboard/insights"
              label="Insights"
              icon={Sparkles}
              isActive={isLinkActive('/dashboard/insights')}
              isCollapsed={isCollapsed}
              isLocked={isFree}
              onClick={() => handleLockedClick('general')}
            />
            <SidebarNavItem
              href="/dashboard/debt-payoff"
              label="Debt Payoff"
              icon={TrendingDown}
              isActive={isLinkActive('/dashboard/debt-payoff')}
              isCollapsed={isCollapsed}
              isLocked={isFree}
              onClick={() => handleLockedClick('general')}
            />
            <SidebarNavItem
              href="/dashboard/reports"
              label="Reports"
              icon={FileBarChart}
              isActive={isLinkActive('/dashboard/reports')}
              isCollapsed={isCollapsed}
              isLocked={isFree}
              onClick={() => handleLockedClick('general')}
            />
            <SidebarNavItem
              href="/dashboard/import"
              label="Import"
              icon={Upload}
              isActive={isLinkActive('/dashboard/import')}
              isCollapsed={isCollapsed}
            />
          </SidebarSection>

          {/* Afford It? button */}
          <div className="mt-4 px-1">
            <SidebarTooltip content="Afford it?" show={isCollapsed}>
              <button
                onClick={() => setScenarioOpen(true)}
                className={[
                  'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg',
                  'text-sm font-medium transition-colors',
                  'text-teal-400 hover:bg-teal-500/10',
                  'border border-teal-500/30',
                  isCollapsed ? 'justify-center' : '',
                ].join(' ')}
              >
                <Calculator className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span>Afford it?</span>}
              </button>
            </SidebarTooltip>
          </div>
        </nav>

        {/* Footer */}
        <div className="mt-auto">
          {/* Timer - only for Pro users */}
          {canUseTimeTracking && (
            <div className="border-t border-zinc-200 dark:border-zinc-800">
              <SidebarTimer defaultHourlyRate={defaultHourlyRate} isCollapsed={isCollapsed} />
            </div>
          )}

          {/* Upgrade CTA - only for free users */}
          {isFree && <SidebarUpgrade isCollapsed={isCollapsed} />}

          {/* User */}
          <SidebarUser
            userEmail={userEmail}
            userName={userName}
            userTier={userTier}
            isCollapsed={isCollapsed}
          />
        </div>
      </aside>

      {/* Upgrade modal */}
      <UpgradePrompt
        isOpen={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        feature={upgradeFeature}
      />

      {/* Scenario modal */}
      <ScenarioModal
        open={scenarioOpen}
        onClose={() => setScenarioOpen(false)}
        source="nav"
      />
    </>
  );
}
