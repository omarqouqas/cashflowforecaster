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

/**
 * Generate a unique ID (UUID v4)
 * Uses crypto.randomUUID when available, falls back to a polyfill for older browsers
 */
export function generateId(): string {
  // Use native crypto.randomUUID if available (modern browsers)
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  // Fallback for older browsers
  // Generate UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
