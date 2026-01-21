'use client';

import * as React from 'react';
import * as Popover from '@radix-ui/react-popover';
import { ChevronDown, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface FilterDateRangeDropdownProps {
  value: DateRange;
  onChange: (value: DateRange) => void;
  label?: string;
  className?: string;
}

/**
 * FilterDateRangeDropdown - Date range filter dropdown (Linear-style)
 *
 * Shows a button that opens a popover with start/end date inputs.
 */
export function FilterDateRangeDropdown({
  value,
  onChange,
  label = 'Date Range',
  className,
}: FilterDateRangeDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const [startInput, setStartInput] = React.useState(
    value.start ? format(value.start, 'yyyy-MM-dd') : ''
  );
  const [endInput, setEndInput] = React.useState(
    value.end ? format(value.end, 'yyyy-MM-dd') : ''
  );

  // Sync inputs when external value changes
  React.useEffect(() => {
    setStartInput(value.start ? format(value.start, 'yyyy-MM-dd') : '');
    setEndInput(value.end ? format(value.end, 'yyyy-MM-dd') : '');
  }, [value.start, value.end]);

  const hasValue = value.start !== null || value.end !== null;

  // Determine button label
  const getButtonLabel = () => {
    if (!hasValue) return label;
    if (value.start && value.end) {
      return `${format(value.start, 'MMM d')} - ${format(value.end, 'MMM d')}`;
    }
    if (value.start) return `From ${format(value.start, 'MMM d')}`;
    if (value.end) return `Until ${format(value.end, 'MMM d')}`;
    return label;
  };

  const handleApply = () => {
    const start = startInput ? parseISO(startInput) : null;
    const end = endInput ? parseISO(endInput) : null;
    onChange({ start, end });
    setOpen(false);
  };

  const handleClear = () => {
    onChange({ start: null, end: null });
    setStartInput('');
    setEndInput('');
    setOpen(false);
  };

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
          <Calendar className="w-3.5 h-3.5" />
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
          className="z-50 w-[260px] bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl overflow-hidden"
          sideOffset={4}
          align="start"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <div className="p-3 space-y-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Start Date</label>
              <input
                type="date"
                value={startInput}
                onChange={(e) => setStartInput(e.target.value)}
                className="w-full px-3 py-1.5 text-sm bg-zinc-900 border border-zinc-700 rounded-md text-zinc-100 focus:outline-none focus:ring-1 focus:ring-teal-500 [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">End Date</label>
              <input
                type="date"
                value={endInput}
                onChange={(e) => setEndInput(e.target.value)}
                className="w-full px-3 py-1.5 text-sm bg-zinc-900 border border-zinc-700 rounded-md text-zinc-100 focus:outline-none focus:ring-1 focus:ring-teal-500 [color-scheme:dark]"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleApply}
                className="flex-1 py-1.5 text-sm font-medium bg-teal-600 hover:bg-teal-500 text-white rounded-md transition-colors"
              >
                Apply
              </button>
              {hasValue && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700 rounded-md transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
