'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';

interface FilterSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  debounceMs?: number;
}

/**
 * FilterSearch - Text input for searching/filtering by name
 */
export function FilterSearch({
  value,
  onChange,
  placeholder = 'Search...',
  label,
  debounceMs = 300,
}: FilterSearchProps) {
  const [localValue, setLocalValue] = React.useState(value);
  const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

  // Sync local value with external value
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
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          value={localValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            'w-full h-9 pl-9 pr-8 rounded-md border border-zinc-700 bg-zinc-800 text-sm text-zinc-100',
            'placeholder:text-zinc-500',
            'focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent'
          )}
        />
        {localValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
