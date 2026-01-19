'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SegmentOption {
  value: string;
  label: string;
}

interface FilterSegmentedControlProps {
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  size?: 'sm' | 'md';
}

/**
 * FilterSegmentedControl - Single-select segmented control for filters
 *
 * Best for mutually exclusive options like time horizons (7d/14d/30d/60d).
 * Only one option can be selected at a time.
 */
export function FilterSegmentedControl({
  options,
  value,
  onChange,
  label,
  size = 'md',
}: FilterSegmentedControlProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="inline-flex rounded-lg bg-zinc-800 p-1 border border-zinc-700">
        {options.map((option) => {
          const isActive = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                'relative rounded-md font-medium transition-all duration-150',
                'focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:ring-offset-1 focus:ring-offset-zinc-800',
                size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm',
                isActive
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              )}
              aria-pressed={isActive}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
