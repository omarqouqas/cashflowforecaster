'use client';

interface SidebarSectionProps {
  title: string;
  isCollapsed: boolean;
  children: React.ReactNode;
}

export function SidebarSection({ title, isCollapsed, children }: SidebarSectionProps) {
  return (
    <div className="mt-4">
      {/* Section header */}
      <div className="px-3 mb-2">
        {isCollapsed ? (
          <div className="border-t border-zinc-200 dark:border-zinc-800" />
        ) : (
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-500 uppercase tracking-wider">
            {title}
          </span>
        )}
      </div>

      {/* Section items */}
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}
