'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * FilterBar - Horizontal container for filter controls (Linear-style)
 *
 * Layout: [Search] [Filter Dropdowns...] [+ Add filter]
 * Always visible, no accordion/collapse behavior.
 */
export function FilterBar({ children, className }: FilterBarProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2',
        className
      )}
    >
      {children}
    </div>
  );
}

interface FilterBarRowProps {
  children?: React.ReactNode;
  rightSection?: React.ReactNode;
  className?: string;
}

/**
 * FilterBarRow - Groups filter controls in a row
 * Use for the main filter controls row
 *
 * Layout: [filters...] [+ Add filter] ... [rightSection]
 */
export function FilterBarRow({ children, rightSection, className }: FilterBarRowProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2 w-full', className)}>
      {children}
      {rightSection && (
        <>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            {rightSection}
          </div>
        </>
      )}
    </div>
  );
}
