'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface FilterOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  color?: 'green' | 'yellow' | 'orange' | 'red' | 'teal' | 'default';
}

interface FilterToggleGroupProps {
  options: FilterOption[];
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  allowEmpty?: boolean;
}

const colorClasses: Record<string, { active: string; inactive: string }> = {
  green: {
    active: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300',
    inactive: 'border-zinc-700 text-zinc-400 hover:border-emerald-500/30 hover:text-emerald-400',
  },
  yellow: {
    active: 'bg-amber-500/20 border-amber-500/50 text-amber-300',
    inactive: 'border-zinc-700 text-zinc-400 hover:border-amber-500/30 hover:text-amber-400',
  },
  orange: {
    active: 'bg-orange-500/20 border-orange-500/50 text-orange-300',
    inactive: 'border-zinc-700 text-zinc-400 hover:border-orange-500/30 hover:text-orange-400',
  },
  red: {
    active: 'bg-rose-500/20 border-rose-500/50 text-rose-300',
    inactive: 'border-zinc-700 text-zinc-400 hover:border-rose-500/30 hover:text-rose-400',
  },
  teal: {
    active: 'bg-teal-500/20 border-teal-500/50 text-teal-300',
    inactive: 'border-zinc-700 text-zinc-400 hover:border-teal-500/30 hover:text-teal-400',
  },
  default: {
    active: 'bg-zinc-700 border-zinc-600 text-zinc-100',
    inactive: 'border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300',
  },
};

/**
 * FilterToggleGroup - Multi-select toggle button group for filters
 *
 * Allows users to toggle multiple options on/off. Great for status filters
 * or transaction type filters.
 */
export function FilterToggleGroup({
  options,
  value,
  onChange,
  label,
  allowEmpty = false,
}: FilterToggleGroupProps) {
  const handleToggle = (optionValue: string) => {
    const isActive = value.includes(optionValue);

    if (isActive) {
      // Don't allow deselecting if it would result in empty and allowEmpty is false
      if (!allowEmpty && value.length === 1) {
        return;
      }
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = value.includes(option.value);
          const color = option.color || 'default';
          const classes = colorClasses[color] ?? colorClasses.default;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleToggle(option.value)}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm font-medium transition-all duration-150',
                'focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:ring-offset-1 focus:ring-offset-zinc-900',
                isActive ? classes!.active : classes!.inactive
              )}
              aria-pressed={isActive}
            >
              {option.icon}
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
