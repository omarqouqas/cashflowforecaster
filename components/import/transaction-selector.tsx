'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils/format';
import type { SubscriptionTier } from '@/lib/stripe/config';

export type ImportAction = 'ignore' | 'income' | 'bill' | 'income-recurring' | 'bill-recurring';

export type RecurringFrequency = 'weekly' | 'biweekly' | 'semi-monthly' | 'monthly' | 'quarterly' | 'annually';

export type NormalizedTransaction = {
  id: string;
  transaction_date: string; // YYYY-MM-DD
  description: string;
  amount: number; // signed
  raw_data: unknown;
  original_row_number: number | null;
  isPotentialDuplicate?: boolean;
  suggestedAction?: 'income' | 'bill'; // Pre-computed suggestion (e.g., from YNAB category)
};

export type ImportRow = NormalizedTransaction & {
  action: Exclude<ImportAction, 'ignore'>;
  frequency?: RecurringFrequency; // Only set when action is *-recurring
};

type Props = {
  transactions: NormalizedTransaction[];
  fileName: string;
  onImport: (rows: ImportRow[]) => Promise<void>;
  tier: SubscriptionTier;
  currentBills: number;
  currentIncome: number;
  billsLimit: number | null; // null = unlimited
  incomeLimit: number | null; // null = unlimited
  onRequestUpgrade?: (feature: 'bills' | 'income' | 'general') => void;
};

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function toYyyyMmDdLocal(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function getEarliestDateFromTransactions(transactions: NormalizedTransaction[]): Date | null {
  if (transactions.length === 0) return null;

  let earliest: Date | null = null;
  for (const tx of transactions) {
    const date = parseIsoDateToLocalDate(tx.transaction_date);
    if (date && (!earliest || date < earliest)) {
      earliest = date;
    }
  }
  return earliest;
}

function parseIsoDateToLocalDate(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return null;
  return new Date(year, month - 1, day);
}

function formatIsoDateHuman(iso: string): string | null {
  const d = parseIsoDateToLocalDate(iso);
  if (!d) return null;
  // Force unambiguous month name formatting (MMM D, YYYY)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}

function ActionSelect({
  value,
  onChange,
}: {
  value: ImportAction;
  onChange: (v: ImportAction) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as ImportAction)}
      className={[
        'w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-zinc-100 min-h-[40px]',
        'focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent',
      ].join(' ')}
    >
      <option value="ignore">Ignore</option>
      <option value="income">One-time income</option>
      <option value="income-recurring">Recurring income</option>
      <option value="bill">One-time bill</option>
      <option value="bill-recurring">Recurring bill</option>
    </select>
  );
}

function FrequencySelect({
  value,
  onChange,
}: {
  value: RecurringFrequency;
  onChange: (v: RecurringFrequency) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as RecurringFrequency)}
      className={[
        'w-full bg-zinc-800 border border-zinc-700 rounded-md px-2 py-1.5 text-zinc-100 text-sm min-h-[32px]',
        'focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent',
      ].join(' ')}
    >
      <option value="weekly">Weekly</option>
      <option value="biweekly">Bi-weekly</option>
      <option value="semi-monthly">Semi-monthly</option>
      <option value="monthly">Monthly</option>
      <option value="quarterly">Quarterly</option>
      <option value="annually">Annually</option>
    </select>
  );
}

export function TransactionSelector({
  transactions,
  fileName,
  onImport,
  tier,
  currentBills,
  currentIncome,
  billsLimit,
  incomeLimit,
  onRequestUpgrade,
}: Props) {
  const [query, setQuery] = useState('');
  const [direction, setDirection] = useState<'all' | 'in' | 'out'>('all');
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  // Initialize with empty string, will be set from transactions data
  const [minImportDate, setMinImportDate] = useState<string>('');
  const [hasInitializedDateFilter, setHasInitializedDateFilter] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>(() => ({}));
  const [actions, setActions] = useState<Record<string, ImportAction>>(() => ({}));
  const [frequencies, setFrequencies] = useState<Record<string, RecurringFrequency>>(() => ({}));

  // Auto-detect date range from transactions on first load
  useEffect(() => {
    if (hasInitializedDateFilter || transactions.length === 0) return;

    const earliest = getEarliestDateFromTransactions(transactions);
    if (earliest) {
      // Set to earliest date in the CSV so all transactions are shown by default
      setMinImportDate(toYyyyMmDdLocal(earliest));
    }
    setHasInitializedDateFilter(true);
  }, [transactions, hasInitializedDateFilter]);

  // Use pre-computed suggestion if available, otherwise fall back to amount-based detection
  const suggestedActionFor = (tx: NormalizedTransaction): Exclude<ImportAction, 'ignore'> => {
    if (tx.suggestedAction) return tx.suggestedAction;
    return tx.amount >= 0 ? 'income' : 'bill';
  };

  const dateFilteredTransactions = useMemo(() => {
    const cutoff = (minImportDate || '').trim();
    if (!cutoff) return transactions;
    // `transaction_date` is already YYYY-MM-DD; lexical compare is safe for this format.
    return transactions.filter((t) => t.transaction_date >= cutoff);
  }, [transactions, minImportDate]);

  const cutoffHuman = useMemo(() => {
    const cutoff = (minImportDate || '').trim();
    if (!cutoff) return null;
    return formatIsoDateHuman(cutoff);
  }, [minImportDate]);

  const enriched = useMemo(() => {
    return dateFilteredTransactions.map((t) => {
      // Default action suggestion (uses pre-computed suggestion if available, else amount-based)
      const action = actions[t.id] ?? suggestedActionFor(t);
      // Auto-select rows whose effective action is not "ignore" unless the user explicitly toggled selection.
      const selected = selectedIds[t.id] ?? action !== 'ignore';
      // Default frequency is monthly for recurring entries
      const frequency = frequencies[t.id] ?? 'monthly';
      return { ...t, selected, action, frequency };
    });
  }, [dateFilteredTransactions, selectedIds, actions, frequencies]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return enriched.filter((t) => {
      if (showSelectedOnly && !t.selected) return false;
      if (direction === 'in' && t.amount <= 0) return false;
      if (direction === 'out' && t.amount >= 0) return false;
      if (!q) return true;
      return t.description.toLowerCase().includes(q);
    });
  }, [enriched, query, direction, showSelectedOnly]);

  const visibleRows = useMemo(() => filtered.slice(0, 1000), [filtered]);

  const selectedRows = useMemo(() => enriched.filter((t) => t.selected), [enriched]);
  const actionableSelected = useMemo(
    () => selectedRows.filter((t) => t.action !== 'ignore'),
    [selectedRows]
  );

  const counts = useMemo(() => {
    const income = actionableSelected.filter((t) => t.action === 'income' || t.action === 'income-recurring').length;
    const bill = actionableSelected.filter((t) => t.action === 'bill' || t.action === 'bill-recurring').length;
    const recurring = actionableSelected.filter((t) => t.action === 'income-recurring' || t.action === 'bill-recurring').length;
    return { total: actionableSelected.length, income, bill, recurring };
  }, [actionableSelected]);

  const limits = useMemo(() => {
    const billsRemaining =
      billsLimit === null ? Infinity : Math.max(0, billsLimit - currentBills);
    const incomeRemaining =
      incomeLimit === null ? Infinity : Math.max(0, incomeLimit - currentIncome);
    return { billsRemaining, incomeRemaining };
  }, [billsLimit, incomeLimit, currentBills, currentIncome]);

  const over = useMemo(() => {
    const billsOverBy =
      limits.billsRemaining === Infinity ? 0 : Math.max(0, counts.bill - limits.billsRemaining);
    const incomeOverBy =
      limits.incomeRemaining === Infinity ? 0 : Math.max(0, counts.income - limits.incomeRemaining);
    return { billsOverBy, incomeOverBy };
  }, [counts.bill, counts.income, limits.billsRemaining, limits.incomeRemaining]);

  const setRowSelected = (id: string, selected: boolean) => {
    setError(null);
    setSelectedIds((prev) => ({ ...prev, [id]: selected }));
    if (selected) {
      // If user checks a row, keep any explicit action; otherwise apply suggested action.
      setActions((prev) => {
        if (prev[id] && prev[id] !== 'ignore') return prev;
        const tx = transactions.find((t) => t.id === id);
        if (!tx) return prev;
        return { ...prev, [id]: suggestedActionFor(tx) };
      });
    } else {
      // Unchecking implies "don't import"
      setActions((prev) => ({ ...prev, [id]: 'ignore' }));
    }
  };

  const setRowAction = (id: string, action: ImportAction) => {
    setError(null);
    setActions((prev) => ({ ...prev, [id]: action }));
    // If Action is not Ignore, auto-select the row. If Ignore, auto-deselect.
    setSelectedIds((prev) => ({ ...prev, [id]: action !== 'ignore' }));
  };

  const setRowFrequency = (id: string, frequency: RecurringFrequency) => {
    setFrequencies((prev) => ({ ...prev, [id]: frequency }));
  };

  const isRecurringAction = (action: ImportAction) => action === 'income-recurring' || action === 'bill-recurring';

  const selectAllVisible = () => {
    setError(null);
    const ids = visibleRows.map((t) => t.id);
    setSelectedIds((prev) => {
      const next = { ...prev };
      for (const id of ids) next[id] = true;
      return next;
    });
    setActions((prev) => {
      const next = { ...prev };
      for (const id of ids) {
        const tx = transactions.find((t) => t.id === id);
        if (!tx) continue;
        // Only set if missing/ignore, preserve explicit user choices
        if (!next[id] || next[id] === 'ignore') next[id] = suggestedActionFor(tx);
      }
      return next;
    });
  };

  const deselectAllVisible = () => {
    setError(null);
    const ids = visibleRows.map((t) => t.id);
    setSelectedIds((prev) => {
      const next = { ...prev };
      for (const id of ids) next[id] = false;
      return next;
    });
    setActions((prev) => {
      const next = { ...prev };
      for (const id of ids) next[id] = 'ignore';
      return next;
    });
  };

  const headerSelectAllRef = useRef<HTMLInputElement | null>(null);
  const selectedVisibleCount = useMemo(
    () => visibleRows.reduce((acc, t) => acc + (t.selected ? 1 : 0), 0),
    [visibleRows]
  );
  const allVisibleSelected = visibleRows.length > 0 && selectedVisibleCount === visibleRows.length;
  const someVisibleSelected = selectedVisibleCount > 0 && !allVisibleSelected;

  useEffect(() => {
    if (headerSelectAllRef.current) {
      headerSelectAllRef.current.indeterminate = someVisibleSelected;
    }
  }, [someVisibleSelected]);

  const trimToRemaining = () => {
    const billsKeep = limits.billsRemaining === Infinity ? Infinity : limits.billsRemaining;
    const incomeKeep = limits.incomeRemaining === Infinity ? Infinity : limits.incomeRemaining;

    let keptBills = 0;
    let keptIncome = 0;

    // Calculate new states outside of setState callbacks to avoid stale closure issues
    const nextSelected: Record<string, boolean> = { ...selectedIds };
    const nextActions: Record<string, ImportAction> = { ...actions };

    for (const t of transactions) {
      if (!nextSelected[t.id]) continue;

      const action = nextActions[t.id] ?? suggestedActionFor(t);
      if (action === 'bill' || action === 'bill-recurring') {
        if (keptBills < billsKeep) {
          keptBills++;
        } else {
          nextSelected[t.id] = false;
          nextActions[t.id] = 'ignore';
        }
      } else if (action === 'income' || action === 'income-recurring') {
        if (keptIncome < incomeKeep) {
          keptIncome++;
        } else {
          nextSelected[t.id] = false;
          nextActions[t.id] = 'ignore';
        }
      }
    }

    // Update both states atomically (React batches these)
    setSelectedIds(nextSelected);
    setActions(nextActions);
  };

  const submit = async () => {
    setError(null);
    if (actionableSelected.length === 0) {
      setError('Select rows to import.');
      return;
    }

    if (tier === 'free' && (over.billsOverBy > 0 || over.incomeOverBy > 0)) {
      const parts: string[] = [];
      if (over.billsOverBy > 0) {
        parts.push(
          `You can only add ${limits.billsRemaining} more bill${limits.billsRemaining === 1 ? '' : 's'} on the Free tier.`
        );
      }
      if (over.incomeOverBy > 0) {
        parts.push(
          `You can only add ${limits.incomeRemaining} more income source${limits.incomeRemaining === 1 ? '' : 's'} on the Free tier.`
        );
      }
      parts.push('Upgrade for unlimited, or trim your selection.');
      setError(parts.join(' '));

      if (onRequestUpgrade) {
        if (over.billsOverBy > 0 && over.incomeOverBy === 0) onRequestUpgrade('bills');
        else if (over.incomeOverBy > 0 && over.billsOverBy === 0) onRequestUpgrade('income');
        else onRequestUpgrade('general');
      }
      return;
    }

    setIsSubmitting(true);
    try {
      await onImport(
        actionableSelected.map((t) => ({
          id: t.id,
          transaction_date: t.transaction_date,
          description: t.description,
          amount: t.amount,
          raw_data: t.raw_data,
          original_row_number: t.original_row_number,
          action: t.action as Exclude<ImportAction, 'ignore'>,
          frequency: isRecurringAction(t.action) ? t.frequency : undefined,
        }))
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Import failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-6">
      <div className="min-w-0">
        <p className="text-base font-semibold text-zinc-100">Review transactions</p>
        <p className="text-sm text-zinc-400 mt-1">
          File: <span className="font-medium text-zinc-200">{fileName}</span>
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="text-sm text-zinc-200 font-medium block mb-1.5">
            Only import transactions after:
          </label>
          <Input
            type="date"
            value={minImportDate}
            onChange={(e) => setMinImportDate(e.target.value)}
          />
          {cutoffHuman && (
            <p className="text-xs text-zinc-400 mt-1.5">
              Showing transactions from <span className="font-medium text-zinc-200">{cutoffHuman}</span> onwards
            </p>
          )}
        </div>
        <div className="flex items-end">
          <div className="text-sm text-zinc-300">
            <span className="font-semibold text-zinc-100">{dateFilteredTransactions.length}</span> of{' '}
            <span className="font-semibold text-zinc-100">{transactions.length}</span> transactions
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search description…"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value as any)}
            className={[
              'w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-zinc-100 min-h-[44px]',
              'focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent',
            ].join(' ')}
          >
            <option value="all">All</option>
            <option value="in">Money in</option>
            <option value="out">Money out</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-zinc-200 select-none cursor-pointer">
            <input
              type="checkbox"
              checked={showSelectedOnly}
              onChange={(e) => setShowSelectedOnly(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-600 text-teal-500 focus:ring-2 focus:ring-teal-500 bg-zinc-800"
            />
            Selected only
          </label>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="text-sm text-zinc-300">
          {counts.total === 0 ? (
            <span className="text-zinc-400">Select transactions to import</span>
          ) : (
            <span>
              Ready to import: <span className="font-semibold text-zinc-100">{counts.total}</span>{' '}
              <span className="text-zinc-400">
                ({counts.income} income, {counts.bill} bill{counts.bill !== 1 ? 's' : ''})
              </span>
              {counts.recurring > 0 && (
                <span className="text-teal-400 ml-1">
                  including {counts.recurring} recurring
                </span>
              )}
            </span>
          )}
        </div>
        {(() => {
          const dupeCount = visibleRows.filter((t) => t.isPotentialDuplicate).length;
          if (dupeCount > 0) {
            return (
              <div className="text-sm text-amber-400 flex items-center gap-1">
                ⚠ {dupeCount} possible duplicate{dupeCount === 1 ? '' : 's'} detected
              </div>
            );
          }
          return null;
        })()}
      </div>

      {tier === 'free' && (billsLimit !== null || incomeLimit !== null) && (
        <div className="mt-3 text-sm text-zinc-300">
          <span className="font-medium text-zinc-200">Free tier remaining:</span>{' '}
          <span className="text-zinc-400">
            {limits.billsRemaining === Infinity ? '∞' : limits.billsRemaining} bills,{' '}
            {limits.incomeRemaining === Infinity ? '∞' : limits.incomeRemaining} income sources
          </span>
        </div>
      )}

      {tier === 'free' && (over.billsOverBy > 0 || over.incomeOverBy > 0) && (
        <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
          <p className="text-sm text-amber-300 font-medium">
            You&apos;re over the Free tier limit
          </p>
          <p className="text-sm text-amber-400/80 mt-1">
            {over.billsOverBy > 0 && (
              <span className="block">
                Bills: selected {counts.bill}, remaining {limits.billsRemaining}
              </span>
            )}
            {over.incomeOverBy > 0 && (
              <span className="block">
                Income: selected {counts.income}, remaining {limits.incomeRemaining}
              </span>
            )}
          </p>
          <div className="mt-3 flex flex-col sm:flex-row gap-2">
            <Button type="button" variant="secondary" onClick={trimToRemaining}>
              Keep only remaining slots
            </Button>
            {onRequestUpgrade && (
              <Button
                type="button"
                variant="primary"
                onClick={() => {
                  if (over.billsOverBy > 0 && over.incomeOverBy === 0) onRequestUpgrade('bills');
                  else if (over.incomeOverBy > 0 && over.billsOverBy === 0) onRequestUpgrade('income');
                  else onRequestUpgrade('general');
                }}
              >
                Upgrade for unlimited
              </Button>
            )}
          </div>
        </div>
      )}


      {/* Select all/Deselect all buttons - positioned near table */}
      <div className="mt-5 flex items-center justify-between gap-3 mb-3">
        <p className="text-sm text-zinc-400">
          {visibleRows.length} transaction{visibleRows.length === 1 ? '' : 's'} shown
          {selectedVisibleCount > 0 && (
            <span className="text-teal-400 ml-1">
              ({selectedVisibleCount} selected)
            </span>
          )}
        </p>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={selectAllVisible}>
            Select all
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={deselectAllVisible}>
            Deselect all
          </Button>
        </div>
      </div>

      <div className="overflow-auto border border-zinc-700 rounded-lg">
        <table className="min-w-[800px] w-full text-sm">
          <thead className="bg-zinc-800">
            <tr>
              <th className="text-left px-3 py-2.5 w-[44px]">
                <input
                  ref={headerSelectAllRef}
                  type="checkbox"
                  checked={allVisibleSelected}
                  disabled={visibleRows.length === 0}
                  onChange={(e) => {
                    if (e.target.checked) selectAllVisible();
                    else deselectAllVisible();
                  }}
                  className="h-4 w-4 rounded border-zinc-600 text-teal-500 focus:ring-2 focus:ring-teal-500 bg-zinc-700"
                  aria-label="Select all visible transactions"
                />
              </th>
              <th className="text-left px-3 py-2.5 w-[130px] text-zinc-200 font-semibold">Date</th>
              <th className="text-left px-3 py-2.5 text-zinc-200 font-semibold">Description</th>
              <th className="text-right px-3 py-2.5 w-[120px] text-zinc-200 font-semibold">Amount</th>
              <th className="text-left px-3 py-2.5 w-[200px] text-zinc-200 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((t) => {
              const amountColor = t.amount >= 0 ? 'text-emerald-400' : 'text-rose-400';
              const isDupe = t.isPotentialDuplicate;
              return (
                <tr key={t.id} className={`border-t border-zinc-800 ${isDupe ? 'bg-amber-500/5' : ''}`}>
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={t.selected}
                      onChange={(e) => setRowSelected(t.id, e.target.checked)}
                      className="h-4 w-4 rounded border-zinc-600 text-teal-500 focus:ring-2 focus:ring-teal-500"
                    />
                  </td>
                  <td className="px-3 py-2 text-zinc-200 tabular-nums whitespace-nowrap">
                    {formatIsoDateHuman(t.transaction_date) || t.transaction_date}
                  </td>
                  <td className="px-3 py-2 text-zinc-100">
                    <div className="flex items-center gap-2">
                      <div className="truncate max-w-[520px]" title={t.description}>
                        {t.description}
                      </div>
                      {isDupe && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30 whitespace-nowrap">
                          Possible duplicate
                        </span>
                      )}
                    </div>
                    {t.original_row_number !== null && (
                      <div className="text-xs text-zinc-500 mt-0.5">Row {t.original_row_number}</div>
                    )}
                  </td>
                  <td className={`px-3 py-2 text-right font-medium tabular-nums ${amountColor}`}>
                    {formatCurrency(t.amount)}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-col gap-1.5">
                      <ActionSelect
                        value={t.action}
                        onChange={(v) => setRowAction(t.id, v)}
                      />
                      {isRecurringAction(t.action) && (
                        <FrequencySelect
                          value={t.frequency}
                          onChange={(v) => setRowFrequency(t.id, v)}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filtered.length > 1000 && (
        <p className="text-sm text-amber-400 mt-3">
          Showing the first 1,000 transactions for performance. Use the search or date filter to find specific transactions.
        </p>
      )}

      {error && <p className="text-sm text-rose-400 mt-4">{error}</p>}

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Button
          type="button"
          variant="primary"
          fullWidth
          loading={isSubmitting}
          disabled={counts.total === 0 || (tier === 'free' && (over.billsOverBy > 0 || over.incomeOverBy > 0))}
          onClick={() => void submit()}
        >
          {counts.total === 0
            ? 'Select transactions to import'
            : `Import ${counts.total} transaction${counts.total === 1 ? '' : 's'}`}
        </Button>
      </div>
    </div>
  );
}


