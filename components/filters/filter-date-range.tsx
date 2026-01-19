'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface FilterDateRangeProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (start: Date | null, end: Date | null) => void;
  label?: string;
}

/**
 * FilterDateRange - Dual date inputs for filtering by date range
 */
export function FilterDateRange({
  startDate,
  endDate,
  onChange,
  label,
}: FilterDateRangeProps) {
  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? new Date(e.target.value + 'T00:00:00') : null;
    onChange(value, endDate);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? new Date(e.target.value + 'T00:00:00') : null;
    onChange(startDate, value);
  };

  const formatDateForInput = (date: Date | null) => {
    if (!date) return '';
    return format(date, 'yyyy-MM-dd');
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={formatDateForInput(startDate)}
          onChange={handleStartChange}
          className={cn(
            'h-9 px-3 rounded-md border border-zinc-700 bg-zinc-800 text-sm text-zinc-100',
            'focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent',
            '[color-scheme:dark]'
          )}
        />
        <span className="text-zinc-500 text-sm">to</span>
        <input
          type="date"
          value={formatDateForInput(endDate)}
          onChange={handleEndChange}
          className={cn(
            'h-9 px-3 rounded-md border border-zinc-700 bg-zinc-800 text-sm text-zinc-100',
            'focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent',
            '[color-scheme:dark]'
          )}
        />
      </div>
    </div>
  );
}
