'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';

interface FilterPanelProps {
  children: React.ReactNode;
  activeFilterCount?: number;
  onClearAll?: () => void;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  className?: string;
}

/**
 * FilterPanel - Container for filter controls
 *
 * Wraps filter components with a consistent header, active count badge,
 * and optional collapse functionality for mobile.
 */
export function FilterPanel({
  children,
  activeFilterCount = 0,
  onClearAll,
  collapsible = true,
  defaultCollapsed = true,
  className,
}: FilterPanelProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  // Auto-expand when filters are active
  React.useEffect(() => {
    if (activeFilterCount > 0 && isCollapsed) {
      setIsCollapsed(false);
    }
  }, [activeFilterCount, isCollapsed]);

  return (
    <div
      className={cn(
        'border border-zinc-800 bg-zinc-900/50 rounded-lg overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'flex items-center justify-between px-4 py-3',
          collapsible && 'cursor-pointer hover:bg-zinc-800/50 transition-colors',
          !isCollapsed && 'border-b border-zinc-800'
        )}
        onClick={collapsible ? () => setIsCollapsed(!isCollapsed) : undefined}
        role={collapsible ? 'button' : undefined}
        aria-expanded={collapsible ? !isCollapsed : undefined}
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-zinc-400" />
          <span className="text-sm font-medium text-zinc-200">Filters</span>
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-teal-500/20 border border-teal-500/30 text-xs font-medium text-teal-300">
              {activeFilterCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && onClearAll && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClearAll();
              }}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
          {collapsible && (
            <div className="text-zinc-400">
              {isCollapsed ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="p-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * FilterSection - Groups related filters with an optional label
 */
interface FilterSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function FilterSection({ children, className }: FilterSectionProps) {
  return (
    <div className={cn('flex flex-wrap items-start gap-4', className)}>
      {children}
    </div>
  );
}
