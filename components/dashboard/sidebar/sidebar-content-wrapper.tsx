'use client';

import { useSidebar } from './sidebar-context';

interface SidebarContentWrapperProps {
  children: React.ReactNode;
  hasTopBar?: boolean;
}

export function SidebarContentWrapper({ children, hasTopBar = false }: SidebarContentWrapperProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div
      className={[
        'transition-all duration-200',
        isCollapsed ? 'md:ml-16' : 'md:ml-60',
      ].join(' ')}
    >
      <main
        className={[
          'px-4 sm:px-6 lg:px-8 py-8',
          'pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-8',
          hasTopBar ? 'md:pt-20' : 'md:pt-8',
        ].join(' ')}
      >
        {children}
      </main>
    </div>
  );
}

export function SidebarTopBar({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <header
      className={[
        'hidden md:block fixed top-0 right-0 z-20',
        'bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800',
        'transition-all duration-200',
        isCollapsed ? 'left-16' : 'left-60',
      ].join(' ')}
    >
      <div className="flex justify-end items-center h-12 px-6">
        {children}
      </div>
    </header>
  );
}
