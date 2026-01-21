'use client';

import * as React from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AddFilterOption {
  key: string;
  label: string;
  icon?: React.ReactNode;
}

interface AddFilterMenuProps {
  availableFilters: AddFilterOption[];
  onAdd: (filterKey: string) => void;
  className?: string;
}

/**
 * AddFilterMenu - "+ Add filter" button that shows available filters (Linear-style)
 *
 * Opens a popover menu listing filter types not currently visible.
 */
export function AddFilterMenu({
  availableFilters,
  onAdd,
  className,
}: AddFilterMenuProps) {
  const [open, setOpen] = React.useState(false);

  if (availableFilters.length === 0) {
    return null;
  }

  const handleAdd = (filterKey: string) => {
    onAdd(filterKey);
    setOpen(false);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border transition-colors',
            'bg-zinc-800/50 hover:bg-zinc-700 border-zinc-700 border-dashed text-zinc-400 hover:text-zinc-100',
            className
          )}
        >
          <Plus className="w-4 h-4" />
          Add filter
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-50 min-w-[180px] bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl overflow-hidden"
          sideOffset={4}
          align="start"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <div className="p-1">
            <div className="px-2 py-1.5 text-xs text-zinc-500 font-medium">
              Add filter
            </div>
            {availableFilters.map((filter) => (
              <button
                key={filter.key}
                type="button"
                onClick={() => handleAdd(filter.key)}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-zinc-100 rounded-md transition-colors text-left hover:bg-zinc-700"
              >
                {filter.icon && (
                  <span className="flex-shrink-0 text-zinc-400">{filter.icon}</span>
                )}
                <span>{filter.label}</span>
              </button>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
