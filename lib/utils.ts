import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

/**
 * Merge Tailwind CSS classes without conflicts
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as currency
 * @param amount - The number to format
 * @param currency - Currency code (default: 'USD')
 * @returns Formatted currency string, negative values shown in parentheses
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  const isNegative = amount < 0;
  const absoluteAmount = Math.abs(amount);

  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(absoluteAmount);

  return isNegative ? `(${formatted})` : formatted;
}

/**
 * Format a date as "MMM d, yyyy" (e.g., "Nov 26, 2024")
 * @param date - The date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  return format(date, 'MMM d, yyyy');
}
