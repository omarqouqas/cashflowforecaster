'use client';

import * as React from 'react';
import * as Popover from '@radix-ui/react-popover';
import { ChevronDown, Check, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AmountRange {
  min: number | null;
  max: number | null;
}

interface AmountPreset {
  label: string;
  min: number | null;
  max: number | null;
}

const defaultPresets: AmountPreset[] = [
  { label: 'Under $50', min: null, max: 50 },
  { label: '$50 - $200', min: 50, max: 200 },
  { label: '$200 - $500', min: 200, max: 500 },
  { label: '$500+', min: 500, max: null },
];

interface FilterAmountPresetsProps {
  value: AmountRange;
  onChange: (value: AmountRange) => void;
  presets?: AmountPreset[];
  label?: string;
  currency?: string;
  className?: string;
}

/**
 * FilterAmountPresets - Amount filter with preset chips + custom range (Linear-style)
 *
 * Shows presets like "Under $50", "$50-200", etc. plus a "Custom range"
 * option that expands to show min/max inputs.
 */
export function FilterAmountPresets({
  value,
  onChange,
  presets = defaultPresets,
  label = 'Amount',
  currency = '$',
  className,
}: FilterAmountPresetsProps) {
  const [open, setOpen] = React.useState(false);
  const [showCustom, setShowCustom] = React.useState(false);
  const [customMin, setCustomMin] = React.useState<string>(
    value.min?.toString() || ''
  );
  const [customMax, setCustomMax] = React.useState<string>(
    value.max?.toString() || ''
  );

  // Sync custom inputs when external value changes
  React.useEffect(() => {
    setCustomMin(value.min?.toString() || '');
    setCustomMax(value.max?.toString() || '');
  }, [value.min, value.max]);

  // Check if current value matches a preset
  const matchingPreset = presets.find(
    (p) => p.min === value.min && p.max === value.max
  );

  const hasValue = value.min !== null || value.max !== null;
  const isCustomValue = hasValue && !matchingPreset;

  // Determine button label
  const getButtonLabel = () => {
    if (!hasValue) return label;
    if (matchingPreset) return matchingPreset.label;
    if (value.min !== null && value.max !== null) {
      return `${currency}${value.min} - ${currency}${value.max}`;
    }
    if (value.min !== null) return `${currency}${value.min}+`;
    if (value.max !== null) return `Under ${currency}${value.max}`;
    return label;
  };

  const handlePresetSelect = (preset: AmountPreset) => {
    onChange({ min: preset.min, max: preset.max });
    setShowCustom(false);
    setOpen(false);
  };

  const handleCustomApply = () => {
    const min = customMin ? parseFloat(customMin) : null;
    const max = customMax ? parseFloat(customMax) : null;
    onChange({ min, max });
    setOpen(false);
  };

  const handleClear = () => {
    onChange({ min: null, max: null });
    setCustomMin('');
    setCustomMax('');
    setShowCustom(false);
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
          <DollarSign className="w-3.5 h-3.5" />
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
          className="z-50 w-[240px] bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl overflow-hidden"
          sideOffset={4}
          align="start"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {/* Presets */}
          <div className="p-1">
            {presets.map((preset) => {
              const isSelected =
                preset.min === value.min && preset.max === value.max;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handlePresetSelect(preset)}
                  className={cn(
                    'w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-md transition-colors text-left',
                    'hover:bg-zinc-700',
                    isSelected && 'text-teal-300 bg-teal-500/10'
                  )}
                >
                  <span className="text-zinc-100">{preset.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-teal-400" />}
                </button>
              );
            })}

            {/* Custom range toggle */}
            <button
              type="button"
              onClick={() => setShowCustom(!showCustom)}
              className={cn(
                'w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-md transition-colors text-left',
                'hover:bg-zinc-700',
                isCustomValue && 'text-teal-300 bg-teal-500/10'
              )}
            >
              <span className="text-zinc-100">Custom range</span>
              {isCustomValue && <Check className="w-4 h-4 text-teal-400" />}
            </button>
          </div>

          {/* Custom range inputs */}
          {showCustom && (
            <div className="p-2 border-t border-zinc-700 space-y-2">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
                    {currency}
                  </span>
                  <input
                    type="number"
                    value={customMin}
                    onChange={(e) => setCustomMin(e.target.value)}
                    placeholder="Min"
                    className="w-full pl-6 pr-2 py-1.5 text-sm bg-zinc-900 border border-zinc-700 rounded-md text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-teal-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <span className="text-zinc-500 text-sm">to</span>
                <div className="relative flex-1">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
                    {currency}
                  </span>
                  <input
                    type="number"
                    value={customMax}
                    onChange={(e) => setCustomMax(e.target.value)}
                    placeholder="Max"
                    className="w-full pl-6 pr-2 py-1.5 text-sm bg-zinc-900 border border-zinc-700 rounded-md text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-teal-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleCustomApply}
                className="w-full py-1.5 text-sm font-medium bg-teal-600 hover:bg-teal-500 text-white rounded-md transition-colors"
              >
                Apply
              </button>
            </div>
          )}

          {/* Clear button */}
          {hasValue && (
            <div className="px-2 py-1.5 border-t border-zinc-700">
              <button
                type="button"
                onClick={handleClear}
                className="w-full py-1 text-xs text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                Clear amount filter
              </button>
            </div>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
