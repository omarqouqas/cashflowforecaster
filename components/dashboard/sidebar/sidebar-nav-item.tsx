'use client';

import Link from 'next/link';
import { Lock } from 'lucide-react';
import { SidebarTooltip } from './sidebar-tooltip';
import type { LucideIcon } from 'lucide-react';

interface SidebarNavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  isCollapsed: boolean;
  isLocked?: boolean;
  isPro?: boolean;
  onClick?: () => void;
}

export function SidebarNavItem({
  href,
  label,
  icon: Icon,
  isActive,
  isCollapsed,
  isLocked = false,
  isPro = false,
  onClick,
}: SidebarNavItemProps) {
  const baseClasses = [
    'flex items-center gap-3 px-3 py-2.5 rounded-lg',
    'text-sm font-medium transition-colors',
    'min-h-[44px]',
  ].join(' ');

  const stateClasses = isActive
    ? 'bg-zinc-800 text-zinc-100'
    : isLocked
      ? 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-400 cursor-pointer'
      : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100';

  const content = (
    <>
      <div className="relative flex-shrink-0">
        <Icon className="w-5 h-5" />
        {isLocked && (
          <Lock className="absolute -bottom-1 -right-1 w-3 h-3 text-zinc-500" />
        )}
      </div>
      {!isCollapsed && (
        <span className="flex-1 truncate">{label}</span>
      )}
      {!isCollapsed && isPro && !isLocked && (
        <span className="text-xs px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-400 border border-teal-500/30">
          PRO
        </span>
      )}
    </>
  );

  if (isLocked) {
    const button = (
      <button
        onClick={onClick}
        className={`${baseClasses} ${stateClasses} w-full text-left`}
      >
        {content}
      </button>
    );

    if (isCollapsed) {
      return <SidebarTooltip content={label} show>{button}</SidebarTooltip>;
    }
    return button;
  }

  const link = (
    <Link
      href={href}
      className={`${baseClasses} ${stateClasses}`}
    >
      {content}
    </Link>
  );

  if (isCollapsed) {
    return <SidebarTooltip content={label} show>{link}</SidebarTooltip>;
  }
  return link;
}
