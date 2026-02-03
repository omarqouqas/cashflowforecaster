'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CsvUpload } from '@/components/import/csv-upload';
import { ColumnMapper } from '@/components/import/column-mapper';
import { TransactionSelector, type NormalizedTransaction } from '@/components/import/transaction-selector';
import { StepIndicator } from '@/components/import/step-indicator';
import { type ColumnMapping, parseUsAmount, parseUsDateToIsoDate } from '@/lib/import/parse-csv';
import { createClient } from '@/lib/supabase/client';
import { showError, showSuccess } from '@/lib/toast';
import { UpgradePrompt } from '@/components/subscription/upgrade-prompt';
import type { SubscriptionTier } from '@/lib/stripe/config';

type UsageForImport = {
  tier: SubscriptionTier;
  bills: { current: number; limit: number | null }; // null = unlimited
  income: { current: number; limit: number | null }; // null = unlimited
};

type Props = {
  userId: string;
  usage: UsageForImport;
};

type LoadedCsv = {
  fileName: string;
  headers: string[];
  rows: string[][];
};

function normalizeRow(
  row: string[],
  mapping: ColumnMapping,
  rowIndex1Based: number
): Omit<NormalizedTransaction, 'id'> | null {
  if (mapping.dateIndex === null || mapping.descriptionIndex === null || mapping.amountIndex === null) return null;
  const dateRaw = row[mapping.dateIndex] ?? '';
  const descRaw = row[mapping.descriptionIndex] ?? '';
  const amountRaw = row[mapping.amountIndex] ?? '';

  const dateIso = parseUsDateToIsoDate(dateRaw);
  const amount = parseUsAmount(amountRaw);
  const description = descRaw.trim();

  if (!dateIso || amount === null || !description) return null;

  return {
    transaction_date: dateIso,
    description,
    amount,
    raw_data: { row, rowIndex1Based },
    original_row_number: rowIndex1Based,
  };
}

function remainingSlots(limit: number | null, current: number): number {
  if (limit === null) return Infinity;
  return Math.max(0, limit - current);
}

// Auto-detect column indices based on common header names
function autoDetectColumns(headers: string[]): ColumnMapping {
  const datePatterns = /^(date|posted.*date|transaction.*date|trans.*date|posting.*date)$/i;
  const descriptionPatterns = /^(description|payee|memo|merchant|name|narrative|details?)$/i;
  const amountPatterns = /^(amount|total|debit|credit|value|sum)$/i;

  let dateIndex: number | null = null;
  let descriptionIndex: number | null = null;
  let amountIndex: number | null = null;

  headers.forEach((header, idx) => {
    const trimmed = header.trim();
    if (dateIndex === null && datePatterns.test(trimmed)) {
      dateIndex = idx;
    }
    if (descriptionIndex === null && descriptionPatterns.test(trimmed)) {
      descriptionIndex = idx;
    }
    if (amountIndex === null && amountPatterns.test(trimmed)) {
      amountIndex = idx;
    }
  });

  return { dateIndex, descriptionIndex, amountIndex };
}

export function ImportPageClient({ userId, usage }: Props) {
  const router = useRouter();
  const [loaded, setLoaded] = useState<LoadedCsv | null>(null);
  const [mapping, setMapping] = useState<ColumnMapping>({
    dateIndex: null,
    descriptionIndex: null,
    amountIndex: null,
  });

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState<'bills' | 'income' | 'general'>('general');
  const [upgradeCounts, setUpgradeCounts] = useState<{ current: number; limit: number | undefined }>({
    current: 0,
    limit: undefined,
  });

  const [existingTransactions, setExistingTransactions] = useState<Array<{
    posted_at: string;
    description: string;
    amount: number;
  }>>([]);

  // Load existing imported transactions for duplicate detection
  useEffect(() => {
    const loadExisting = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('imported_transactions')
        .select('posted_at, description, amount')
        .eq('user_id', userId)
        .order('posted_at', { ascending: false })
        .limit(500); // Last 500 transactions should be enough for duplicate detection

      if (data) {
        setExistingTransactions(data);
      }
    };

    loadExisting();
  }, [userId]);

  const preview = useMemo(() => {
    if (!loaded) return null;
    return {
      headers: loaded.headers,
      rows: loaded.rows.slice(0, 10),
    };
  }, [loaded]);

  const normalizedTransactions = useMemo(() => {
    if (!loaded) return [];
    const dateIndex = mapping.dateIndex;
    const descriptionIndex = mapping.descriptionIndex;
    const amountIndex = mapping.amountIndex;
    if (dateIndex === null || descriptionIndex === null || amountIndex === null) return [];

    const result: NormalizedTransaction[] = [];
    for (let i = 0; i < loaded.rows.length; i++) {
      const normalized = normalizeRow(loaded.rows[i] ?? [], mapping, i + 2 /* header is row 1 */);
      if (!normalized) continue;

      // Check for potential duplicate
      const isDuplicate = existingTransactions.some(
        (existing) =>
          existing.posted_at === normalized.transaction_date &&
          existing.description.toLowerCase().trim() === normalized.description.toLowerCase().trim() &&
          Math.abs(existing.amount - normalized.amount) < 0.01 // Allow for small floating point differences
      );

      result.push({
        id: crypto.randomUUID(),
        ...normalized,
        isPotentialDuplicate: isDuplicate,
      });
    }
    return result;
  }, [loaded, mapping, existingTransactions]);

  const mappingReady =
    mapping.dateIndex !== null &&
    mapping.descriptionIndex !== null &&
    mapping.amountIndex !== null &&
    mapping.dateIndex !== mapping.descriptionIndex &&
    mapping.dateIndex !== mapping.amountIndex &&
    mapping.descriptionIndex !== mapping.amountIndex;

  const openUpgrade = (feature: 'bills' | 'income' | 'general') => {
    setUpgradeFeature(feature);
    if (feature === 'bills') {
      setUpgradeCounts({ current: usage.bills.current, limit: usage.bills.limit ?? undefined });
    } else if (feature === 'income') {
      setUpgradeCounts({ current: usage.income.current, limit: usage.income.limit ?? undefined });
    } else {
      setUpgradeCounts({ current: 0, limit: undefined });
    }
    setShowUpgradeModal(true);
  };

  const handleImport = async (
    rows: Array<NormalizedTransaction & { action: 'income' | 'bill' }>
  ) => {
    const supabase = createClient();

    // Simple sanity limits: prevent accidental huge imports
    if (rows.length > 500) {
      showError('For now, please import 500 transactions or fewer at a time.');
      return;
    }

    const toCreateBills = rows.filter((r) => r.action === 'bill').length;
    const toCreateIncome = rows.filter((r) => r.action === 'income').length;

    // Enforce tier limits using existing feature-gate limits.
    // We re-check current counts right before creating records (prevents stale UI / race issues).
    const [billsCountRes, incomeCountRes] = await Promise.all([
      supabase.from('bills').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('income').select('*', { count: 'exact', head: true }).eq('user_id', userId),
    ]);

    if (billsCountRes.error || incomeCountRes.error) {
      showError('Could not verify your current usage. Please try again.');
      return;
    }

    const currentBills = billsCountRes.count ?? usage.bills.current;
    const currentIncome = incomeCountRes.count ?? usage.income.current;

    const billsLimit = usage.bills.limit; // null = unlimited
    const incomeLimit = usage.income.limit; // null = unlimited

    const billsRemaining = remainingSlots(billsLimit, currentBills);
    const incomeRemaining = remainingSlots(incomeLimit, currentIncome);

    const billsWouldExceed = billsRemaining !== Infinity && toCreateBills > billsRemaining;
    const incomeWouldExceed = incomeRemaining !== Infinity && toCreateIncome > incomeRemaining;

    if (billsWouldExceed || incomeWouldExceed) {
      if (billsWouldExceed && !incomeWouldExceed) openUpgrade('bills');
      else if (!billsWouldExceed && incomeWouldExceed) openUpgrade('income');
      else openUpgrade('general');

      const parts: string[] = [];
      if (billsWouldExceed) {
        parts.push(
          `You can only add ${billsRemaining} more bill${billsRemaining === 1 ? '' : 's'} on the Free tier.`
        );
      }
      if (incomeWouldExceed) {
        parts.push(
          `You can only add ${incomeRemaining} more income source${incomeRemaining === 1 ? '' : 's'} on the Free tier.`
        );
      }
      parts.push('Upgrade for unlimited, or import fewer items.');
      showError(parts.join(' '));
      return;
    }

    // 1) Insert imported_transactions (client generates IDs so we can reference)
    // NOTE: The DB schema uses `posted_at`, `raw`, and `mapped_columns`.
    const mappedColumns =
      loaded && mapping.dateIndex !== null && mapping.descriptionIndex !== null && mapping.amountIndex !== null
        ? {
            date: loaded.headers[mapping.dateIndex] ?? null,
            description: loaded.headers[mapping.descriptionIndex] ?? null,
            amount: loaded.headers[mapping.amountIndex] ?? null,
          }
        : null;

    const importedRows = rows.map((r) => ({
      id: r.id,
      user_id: userId,
      posted_at: r.transaction_date, // DATE
      description: r.description,
      amount: r.amount,
      source_file_name: loaded?.fileName ?? null,
      mapped_columns: mappedColumns,
      raw: {
        ...((r.raw_data as any) ?? {}),
        normalized: {
          transaction_date: r.transaction_date,
          description: r.description,
          amount: r.amount,
          original_row_number: r.original_row_number,
        },
      },
      invoice_id: null,
    }));

    const { error: importErr } = await supabase.from('imported_transactions').insert(importedRows);
    if (importErr) {
      showError(importErr.message);
      return;
    }

    // 2) Create one-time income/bills referencing source_import_id
    const billsToInsert = rows
      .filter((r) => r.action === 'bill')
      .map((r) => ({
        user_id: userId,
        name: r.description.slice(0, 100),
        amount: Math.abs(r.amount),
        due_date: r.transaction_date,
        frequency: 'one-time',
        category: 'other',
        is_active: true,
        source_import_id: r.id,
      }));

    const incomeToInsert = rows
      .filter((r) => r.action === 'income')
      .map((r) => ({
        user_id: userId,
        name: r.description.slice(0, 100),
        amount: Math.abs(r.amount),
        frequency: 'one-time',
        next_date: r.transaction_date,
        account_id: null,
        is_active: true,
        status: 'active',
        source_import_id: r.id,
      }));

    const [billsInsertRes, incomeInsertRes] = await Promise.all([
      billsToInsert.length ? supabase.from('bills').insert(billsToInsert) : Promise.resolve({ error: null as any }),
      incomeToInsert.length ? supabase.from('income').insert(incomeToInsert) : Promise.resolve({ error: null as any }),
    ]);

    // Handle partial success - show user exactly what happened
    const billsSucceeded = !billsInsertRes.error;
    const incomeSucceeded = !incomeInsertRes.error;
    const billsCount = billsToInsert.length;
    const incomeCount = incomeToInsert.length;

    if (!billsSucceeded && !incomeSucceeded) {
      // Both failed
      showError(`Import failed. Bills error: ${billsInsertRes.error?.message || 'Unknown'}. Income error: ${incomeInsertRes.error?.message || 'Unknown'}`);
      return;
    }

    if (!billsSucceeded && billsCount > 0) {
      // Bills failed, income succeeded (or was empty)
      if (incomeCount > 0) {
        showError(`Imported ${incomeCount} income, but ${billsCount} bills failed: ${billsInsertRes.error?.message || 'Unknown error'}`);
      } else {
        showError(`Failed to import ${billsCount} bills: ${billsInsertRes.error?.message || 'Unknown error'}`);
        return;
      }
    } else if (!incomeSucceeded && incomeCount > 0) {
      // Income failed, bills succeeded (or was empty)
      if (billsCount > 0) {
        showError(`Imported ${billsCount} bills, but ${incomeCount} income failed: ${incomeInsertRes.error?.message || 'Unknown error'}`);
      } else {
        showError(`Failed to import ${incomeCount} income: ${incomeInsertRes.error?.message || 'Unknown error'}`);
        return;
      }
    } else {
      // Both succeeded
      showSuccess(`Imported ${incomeCount} income and ${billsCount} bills`);
    }
    router.refresh();
    router.push('/dashboard');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center text-sm text-zinc-400 hover:text-teal-400 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Import transactions</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Upload a CSV export from your bank, map columns, then select the transactions you want to track.
        </p>
        {usage.tier === 'free' && (
          <p className="text-sm text-zinc-500 mt-2">
            Free tier limits: {usage.bills.current}/{usage.bills.limit ?? '∞'} bills,{' '}
            {usage.income.current}/{usage.income.limit ?? '∞'} income sources.
          </p>
        )}
      </div>

      {/* YNAB Quick Import Banner */}
      <Link
        href="/dashboard/import/ynab"
        className="block border border-teal-500/30 bg-teal-500/10 rounded-lg p-4 hover:bg-teal-500/15 transition-colors group"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-teal-200 font-medium">Importing from YNAB?</p>
            <p className="text-sm text-teal-200/70 mt-0.5">
              Use our dedicated YNAB importer for automatic format detection - no column mapping needed.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-teal-400 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-4" />
        </div>
      </Link>

      {/* Step Indicator */}
      <StepIndicator
        steps={[
          {
            number: 1,
            title: 'Upload CSV',
            status: !loaded ? 'current' : 'completed',
          },
          {
            number: 2,
            title: 'Map Columns',
            status: !loaded ? 'pending' : mappingReady ? 'completed' : 'current',
          },
          {
            number: 3,
            title: 'Select & Import',
            status: !loaded || !mappingReady ? 'pending' : 'current',
          },
        ]}
      />

      <CsvUpload
        onLoaded={({ fileName, parsed }) => {
          setLoaded({ fileName, headers: parsed.headers, rows: parsed.rows });
          const detectedMapping = autoDetectColumns(parsed.headers);
          setMapping(detectedMapping);
        }}
      />

      {preview && (
        <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-6">
          <p className="text-base font-semibold text-zinc-100">Preview (first 10 rows)</p>
          <p className="text-sm text-zinc-400 mt-1">
            This is just a preview. You&apos;ll choose which rows to import later.
          </p>
          <div className="mt-4 overflow-auto border border-zinc-800 rounded-lg">
            <table className="min-w-full w-full text-sm">
              <thead className="bg-zinc-800">
                <tr>
                  {preview.headers.map((h, idx) => (
                    <th key={`${h}-${idx}`} className="text-left px-3 py-2 whitespace-nowrap text-zinc-300 font-medium">
                      {h || `(Column ${idx + 1})`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="border-t border-zinc-800">
                    {preview.headers.map((_, cIdx) => (
                      <td key={cIdx} className="px-3 py-2 text-zinc-400 whitespace-nowrap">
                        {row[cIdx] ?? ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {loaded && <ColumnMapper headers={loaded.headers} mapping={mapping} onChange={setMapping} />}

      {loaded && mappingReady && normalizedTransactions.length > 0 && (
        <TransactionSelector
          fileName={loaded.fileName}
          transactions={normalizedTransactions}
          onImport={handleImport}
          tier={usage.tier}
          currentBills={usage.bills.current}
          currentIncome={usage.income.current}
          billsLimit={usage.bills.limit}
          incomeLimit={usage.income.limit}
          onRequestUpgrade={openUpgrade}
        />
      )}

      {loaded && mappingReady && normalizedTransactions.length === 0 && (
        <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-6">
          <p className="text-base font-semibold text-zinc-100">No transactions found</p>
          <p className="text-sm text-zinc-400 mt-1">
            We couldn&apos;t parse any rows with the selected mapping. Try adjusting the column mapping.
          </p>
        </div>
      )}

      <UpgradePrompt
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature={upgradeFeature}
        currentCount={upgradeCounts.current}
        limit={upgradeCounts.limit}
      />
    </div>
  );
}


