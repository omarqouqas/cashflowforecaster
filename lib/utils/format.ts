import { formatDistanceToNow } from 'date-fns';

/**
 * Gets the currency symbol for a given currency code
 * @param currency - The currency code (e.g., 'USD', 'EUR', 'GBP')
 * @returns The currency symbol (e.g., '$', '€', '£')
 */
export function getCurrencySymbol(currency: string = 'USD'): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      currencyDisplay: 'narrowSymbol',
    })
      .formatToParts(0)
      .find(part => part.type === 'currency')?.value || currency;
  } catch {
    return currency;
  }
}

/**
 * Formats a number as currency
 * @param amount - The amount to format
 * @param currency - The currency code (default: 'USD')
 * @param compact - Whether to use compact notation (e.g., "$1.2k") (default: false)
 * @returns Formatted currency string (e.g., "$1,234.56" or "$1.2k")
 */
export function formatCurrency(amount: number, currency: string = 'USD', compact: boolean = false): string {
  if (compact) {
    // For compact notation, use custom formatting
    const absAmount = Math.abs(amount);
    const sign = amount < 0 ? '-' : '';
    const currencySymbol = currency === 'USD' ? '$' : currency;

    if (absAmount >= 1000000) {
      return `${sign}${currencySymbol}${(absAmount / 1000000).toFixed(absAmount % 1000000 === 0 ? 0 : 1)}M`;
    } else if (absAmount >= 1000) {
      return `${sign}${currencySymbol}${(absAmount / 1000).toFixed(absAmount % 1000 === 0 ? 0 : 0)}K`;
    } else {
      return `${sign}${currencySymbol}${absAmount.toFixed(0)}`;
    }
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Formats a date string to a readable format
 * @param date - ISO date string
 * @returns Formatted date string (e.g., "Jan 15, 2024")
 */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Formats a date-only string (YYYY-MM-DD) to a readable format without timezone conversion
 * Use this for date-only values stored in the database to avoid timezone offset issues
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Formatted date string (e.g., "Jan 15, 2024")
 */
export function formatDateOnly(dateString: string): string {
  try {
    // Parse date as local midnight to avoid timezone issues
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Formats a date string to relative time (e.g., "2 hours ago")
 * @param date - ISO date string
 * @returns Relative time string
 */
export function formatRelativeTime(date: string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

