'use client';

import * as React from 'react';
import * as Popover from '@radix-ui/react-popover';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilterDropdownSingleOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface FilterDropdownSingleProps {
  label: string;
  options: FilterDropdownSingleOption[];
  value: string;
  onChange: (value: string) => void;
  allowClear?: boolean;
  showLabelPrefix?: boolean;
  className?: string;
}

/**
 * FilterDropdownSingle - Single-select dropdown for filters (Linear-style)
 *
 * Shows a button with current value that opens a popover with
 * a radio-style list (only one can be selected).
 */
export function FilterDropdownSingle({
  label,
  options,
  value,
  onChange,
  allowClear = false,
  showLabelPrefix = false,
  className,
}: FilterDropdownSingleProps) {
  const [open, setOpen] = React.useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setOpen(false);
  };

  const handleClear = () => {
    onChange('');
    setOpen(false);
  };

  const hasValue = value !== '';

  // Display text: "Label: Value" if showLabelPrefix, otherwise just value or label
  const displayText = showLabelPrefix && selectedOption
    ? `${label}: ${selectedOption.label}`
    : selectedOption?.label || label;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border transition-colors',
            'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-100',
            hasValue && 'border-teal-500/50 bg-teal-500/10 text-teal-300',
            className
          )}
        >
          {displayText}
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
          className="z-50 min-w-[160px] bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl overflow-hidden"
          sideOffset={4}
          align="start"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <div className="p-1">
            {options.map((option) => {
              const isSelected = value === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    'w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors text-left',
                    'hover:bg-zinc-700',
                    isSelected && 'text-teal-300 bg-teal-500/10'
                  )}
                >
                  {option.icon && (
                    <span className="flex-shrink-0 text-zinc-400">{option.icon}</span>
                  )}
                  <span className="flex-1 truncate text-zinc-100">{option.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-teal-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
          {allowClear && hasValue && (
            <div className="border-t border-zinc-700 p-1">
              <button
                type="button"
                onClick={handleClear}
                className="w-full px-2 py-1.5 text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700 rounded-md transition-colors text-left"
              >
                Clear
              </button>
            </div>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
