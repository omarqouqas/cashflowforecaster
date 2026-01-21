'use client';

import * as React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterBarSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

/**
 * FilterBarSearch - Search input for the filter bar (Linear-style)
 *
 * Styled to match filter button height with search icon on left
 * and clear button on right.
 */
export function FilterBarSearch({
  value,
  onChange,
  placeholder = 'Search...',
  debounceMs = 300,
  className,
}: FilterBarSearchProps) {
  const [localValue, setLocalValue] = React.useState(value);
  const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

  // Sync local value when external value changes
  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    // Debounce the onChange callback
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      onChange(newValue);
    }, debounceMs);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(
          'w-48 pl-9 pr-8 py-2 text-sm rounded-lg border transition-colors',
          'bg-zinc-800 hover:bg-zinc-700/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-500',
          'focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500'
        )}
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-zinc-300 rounded transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
