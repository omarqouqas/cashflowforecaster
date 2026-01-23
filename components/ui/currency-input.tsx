'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type'> {
  value?: number | string;
  onChange?: (value: number | undefined) => void;
  allowNegative?: boolean;
}

/**
 * Currency input that formats numbers with commas as you type.
 * Displays: $1,234.56
 * Returns: 1234.56 (number)
 */
const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value, onChange, allowNegative = false, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState('');

    // Format number to display string with commas
    const formatForDisplay = (num: number | undefined): string => {
      if (num === undefined || num === null || isNaN(num)) return '';

      const isNegative = num < 0;
      const absNum = Math.abs(num);

      // Split into integer and decimal parts
      const parts = absNum.toString().split('.');
      const integerPart = parts[0] ?? '0';
      const decimalPart = parts[1];

      // Add commas to integer part
      const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      // Combine with decimal if exists
      let formatted = formattedInteger;
      if (decimalPart !== undefined) {
        formatted += '.' + decimalPart;
      }

      return (isNegative && allowNegative ? '-' : '') + formatted;
    };

    // Parse display string to number
    const parseToNumber = (str: string): number | undefined => {
      if (!str || str === '-') return undefined;
      const cleaned = str.replace(/,/g, '');
      const num = parseFloat(cleaned);
      return isNaN(num) ? undefined : num;
    };

    // Initialize display value from prop
    React.useEffect(() => {
      const numValue = typeof value === 'string' ? parseFloat(value) : value;
      if (numValue !== undefined && !isNaN(numValue)) {
        setDisplayValue(formatForDisplay(numValue));
      } else if (value === '' || value === undefined) {
        setDisplayValue('');
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let inputValue = e.target.value;

      // Allow empty input
      if (!inputValue) {
        setDisplayValue('');
        onChange?.(undefined);
        return;
      }

      // Handle negative sign at start
      const hasNegative = allowNegative && inputValue.startsWith('-');
      if (hasNegative) {
        inputValue = inputValue.substring(1);
      }

      // Remove all non-numeric characters except decimal
      const cleaned = inputValue.replace(/[^\d.]/g, '');

      // Only allow one decimal point
      const parts = cleaned.split('.');
      let sanitized = parts[0] ?? '';
      if (parts.length > 1 && parts[1] !== undefined) {
        // Limit to 2 decimal places
        sanitized += '.' + parts[1].slice(0, 2);
      }

      // Don't allow leading zeros (except for decimals like 0.xx)
      if (sanitized.length > 1 && sanitized.startsWith('0') && !sanitized.startsWith('0.')) {
        sanitized = sanitized.replace(/^0+/, '');
      }

      // Format with commas
      const numValue = parseFloat(sanitized);
      let formatted: string;

      if (sanitized === '' || sanitized === '.') {
        formatted = sanitized;
      } else if (sanitized.endsWith('.')) {
        // Preserve trailing decimal point while typing
        const intPart = sanitized.slice(0, -1);
        formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.';
      } else if (!isNaN(numValue)) {
        const splitParts = sanitized.split('.');
        const intPart = splitParts[0] ?? '';
        const decPart = splitParts[1];
        formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        if (decPart !== undefined) {
          formatted += '.' + decPart;
        }
      } else {
        formatted = sanitized;
      }

      // Add back negative sign if allowed
      if (hasNegative && formatted) {
        formatted = '-' + formatted;
      }

      setDisplayValue(formatted);

      // Parse and call onChange with numeric value
      const finalValue = parseToNumber((hasNegative ? '-' : '') + sanitized);
      onChange?.(finalValue);
    };

    return (
      <input
        type="text"
        inputMode="decimal"
        className={cn(
          'flex h-11 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100',
          'placeholder:text-zinc-500',
          'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        value={displayValue}
        onChange={handleChange}
        {...props}
      />
    );
  }
);
CurrencyInput.displayName = 'CurrencyInput';

export { CurrencyInput };
