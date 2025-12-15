/**
 * Calendar constants.
 *
 * Note: These are currently hard-coded, but will be user-configurable later.
 */

export const LOW_BALANCE_THRESHOLD = 100; // $100 default

export type BalanceStatus = 'healthy' | 'low' | 'negative';

export const getBalanceStatus = (balance: number): BalanceStatus => {
  if (balance < 0) return 'negative';
  if (balance < LOW_BALANCE_THRESHOLD) return 'low';
  return 'healthy';
};
