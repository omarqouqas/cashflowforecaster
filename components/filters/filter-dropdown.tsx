'use client';

import * as React from 'react';
import * as Popover from '@radix-ui/react-popover';
import { ChevronDown, Check, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilterDropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface FilterDropdownProps {
  label: string;
  options: FilterDropdownOption[];
  value: string[];
  onChange: (value: string[]) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  allowEmpty?: boolean;
  className?: string;
}

/**
 * FilterDropdown - Multi-select dropdown for filters (Linear-style)
 *
 * Shows a button with label + chevron that opens a popover with
 * a searchable checkbox list.
 */
export function FilterDropdown({
  label,
  options,
  value,
  onChange,
  searchable = false,
  searchPlaceholder = 'Search...',
  allowEmpty = false,
  className,
}: FilterDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const filteredOptions = React.useMemo(() => {
    if (!search) return options;
    const lowerSearch = search.toLowerCase();
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(lowerSearch)
    );
  }, [options, search]);

  const handleToggle = (optionValue: string) => {
    const isSelected = value.includes(optionValue);

    if (isSelected) {
      // Don't allow deselecting if it would leave empty and allowEmpty is false
      if (!allowEmpty && value.length === 1) {
        return;
      }
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const handleClear = () => {
    if (allowEmpty) {
      onChange([]);
    }
  };

  const handleSelectAll = () => {
    onChange(options.map((opt) => opt.value));
  };

  // Count how many are selected vs total
  const selectedCount = value.length;
  const hasSelection = selectedCount > 0 && selectedCount < options.length;
  const allSelected = selectedCount === options.length;

  // Determine button label
  const getButtonLabel = () => {
    if (selectedCount === 0) return label;
    if (allSelected) return label;
    if (selectedCount === 1) {
      const selectedOption = options.find((opt) => opt.value === value[0]);
      return selectedOption?.label || label;
    }
    return `${label} (${selectedCount})`;
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border transition-colors',
            'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-100',
            hasSelection && 'border-teal-500/50 bg-teal-500/10 text-teal-300',
            className
          )}
        >
          {getButtonLabel()}
          <ChevronDown
            className={cn(
              'w-4 h-4 text-zinc-400 transition-transform',
              open && 'rotate-180'
            )}
          />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-50 min-w-[200px] max-w-[280px] bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl overflow-hidden"
          sideOffset={4}
          align="start"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {/* Search input */}
          {searchable && (
            <div className="p-2 border-b border-zinc-700">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-8 pr-3 py-1.5 text-sm bg-zinc-900 border border-zinc-700 rounded-md text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-zinc-500 hover:text-zinc-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Options list */}
          <div className="max-h-[280px] overflow-y-auto p-1">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-zinc-500">No options found</div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = value.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleToggle(option.value)}
                    className={cn(
                      'w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors text-left',
                      'hover:bg-zinc-700',
                      isSelected && 'text-teal-300'
                    )}
                  >
                    <div
                      className={cn(
                        'w-4 h-4 rounded border flex items-center justify-center flex-shrink-0',
                        isSelected
                          ? 'bg-teal-500 border-teal-500'
                          : 'border-zinc-600 bg-transparent'
                      )}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    {option.icon && (
                      <span className="flex-shrink-0 text-zinc-400">{option.icon}</span>
                    )}
                    <span className="truncate text-zinc-100">{option.label}</span>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between px-2 py-1.5 border-t border-zinc-700 text-xs">
            <button
              type="button"
              onClick={handleSelectAll}
              className="px-2 py-1 text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              Select all
            </button>
            {allowEmpty && (
              <button
                type="button"
                onClick={handleClear}
                className="px-2 py-1 text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
