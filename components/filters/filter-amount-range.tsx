'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface FilterAmountRangeProps {
  minValue: number | null;
  maxValue: number | null;
  onChange: (min: number | null, max: number | null) => void;
  label?: string;
  currency?: string;
  placeholder?: { min?: string; max?: string };
}

/**
 * FilterAmountRange - Dual number inputs for min/max amount filtering
 */
export function FilterAmountRange({
  minValue,
  maxValue,
  onChange,
  label,
  currency = '$',
  placeholder = { min: 'Min', max: 'Max' },
}: FilterAmountRangeProps) {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? null : parseFloat(e.target.value);
    onChange(value, maxValue);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? null : parseFloat(e.target.value);
    onChange(minValue, value);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
            {currency}
          </span>
          <input
            type="number"
            value={minValue ?? ''}
            onChange={handleMinChange}
            placeholder={placeholder.min}
            min={0}
            className={cn(
              'w-24 h-9 pl-7 pr-2 rounded-md border border-zinc-700 bg-zinc-800 text-sm text-zinc-100',
              'placeholder:text-zinc-500',
              'focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent',
              '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
            )}
          />
        </div>
        <span className="text-zinc-500 text-sm">to</span>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
            {currency}
          </span>
          <input
            type="number"
            value={maxValue ?? ''}
            onChange={handleMaxChange}
            placeholder={placeholder.max}
            min={0}
            className={cn(
              'w-24 h-9 pl-7 pr-2 rounded-md border border-zinc-700 bg-zinc-800 text-sm text-zinc-100',
              'placeholder:text-zinc-500',
              'focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent',
              '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
            )}
          />
        </div>
      </div>
    </div>
  );
}
