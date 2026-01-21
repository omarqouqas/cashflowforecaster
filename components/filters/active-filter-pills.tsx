'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ActiveFilter {
  key: string;
  label: string;
  value: string;
}

interface ActiveFilterPillsProps {
  filters: ActiveFilter[];
  onRemove: (key: string, value: string) => void;
  onClearAll?: () => void;
  resultCount?: number;
  totalCount?: number;
  className?: string;
}

/**
 * ActiveFilterPills - Shows active filters as removable pills (Linear-style)
 *
 * Layout: Active: [Status: Active ×] [Monthly ×]      Clear all    10 results
 */
export function ActiveFilterPills({
  filters,
  onRemove,
  onClearAll,
  resultCount,
  totalCount,
  className,
}: ActiveFilterPillsProps) {
  // Hide the row entirely when no filters are active
  if (filters.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 w-full',
        className
      )}
    >
      {filters.length > 0 && (
        <>
          <span className="text-xs text-zinc-500 font-medium">Active:</span>
          {filters.map((filter, index) => (
            <FilterPill
              key={`${filter.key}-${filter.value}-${index}`}
              label={filter.label}
              value={filter.value}
              onRemove={() => onRemove(filter.key, filter.value)}
            />
          ))}
        </>
      )}

      <div className="flex-1" />

      {filters.length > 0 && onClearAll && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          Clear all
        </button>
      )}

      {resultCount !== undefined && (
        <span className="text-xs text-zinc-500">
          {totalCount !== undefined && totalCount !== resultCount
            ? `${resultCount} of ${totalCount} results`
            : `${resultCount} ${resultCount === 1 ? 'result' : 'results'}`}
        </span>
      )}
    </div>
  );
}

interface FilterPillProps {
  label: string;
  value: string;
  onRemove: () => void;
}

function FilterPill({ label, value, onRemove }: FilterPillProps) {
  return (
    <span className="inline-flex items-center gap-1 bg-zinc-700 text-zinc-100 rounded-full px-2.5 py-0.5 text-xs">
      <span className="text-zinc-400">{label}:</span>
      <span>{value}</span>
      <button
        type="button"
        onClick={onRemove}
        className="ml-0.5 p-0.5 rounded-full hover:bg-zinc-600 transition-colors"
        aria-label={`Remove ${label}: ${value} filter`}
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}
