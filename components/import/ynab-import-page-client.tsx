'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react';
import { YnabCsvUpload } from '@/components/import/ynab-csv-upload';
import { TransactionSelector, type NormalizedTransaction } from '@/components/import/transaction-selector';
import { StepIndicator } from '@/components/import/step-indicator';
import { createClient } from '@/lib/supabase/client';
import { showError, showSuccess } from '@/lib/toast';
import { UpgradePrompt } from '@/components/subscription/upgrade-prompt';
import type { SubscriptionTier } from '@/lib/stripe/config';
import type { YnabParseResult, YnabCsvFormat } from '@/lib/import/parse-ynab-csv';
import { suggestActionFromCategory } from '@/lib/import/parse-ynab-csv';

type UsageForImport = {
  tier: SubscriptionTier;
  bills: { current: number; limit: number | null };
  income: { current: number; limit: number | null };
};

type Props = {
  userId: string;
  usage: UsageForImport;
};

type ParsedYnabData = {
  fileName: string;
  format: YnabCsvFormat;
  result: YnabParseResult;
};

function formatLabel(format: YnabCsvFormat): string {
  switch (format) {
    case 'basic':
      return 'YNAB Basic Export';
    case 'register':
      return 'YNAB Register Export';
    default:
      return 'Unknown Format';
  }
}

export function YnabImportPageClient({ userId, usage }: Props) {
  const router = useRouter();
  const [parsed, setParsed] = useState<ParsedYnabData | null>(null);

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState<'bills' | 'income' | 'general'>('general');
  const [upgradeCounts, setUpgradeCounts] = useState<{ current: number; limit: number | undefined }>({
    current: 0,
    limit: undefined,
  });

  const [existingTransactions, setExistingTransactions] = useState<
    Array<{ posted_at: string; description: string; amount: number }>
  >([]);

  // Load existing imported transactions for duplicate detection
  useEffect(() => {
    const loadExisting = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('imported_transactions')
        .select('posted_at, description, amount')
        .eq('user_id', userId)
        .order('posted_at', { ascending: false })
        .limit(500);

      if (data) {
        setExistingTransactions(data);
      }
    };

    loadExisting();
  }, [userId]);

  // Generate stable IDs when file is first parsed (not on every useMemo re-run)
  const stableIds = useMemo(() => {
    if (!parsed) return new Map<number, string>();
    const ids = new Map<number, string>();
    for (let i = 0; i < parsed.result.transactions.length; i++) {
      ids.set(i, crypto.randomUUID());
    }
    return ids;
  }, [parsed]); // Only regenerate when a new file is parsed

  // Convert YNAB transactions to NormalizedTransaction format
  const normalizedTransactions = useMemo(() => {
    if (!parsed) return [];

    return parsed.result.transactions.map((t, index) => {
      // Check for potential duplicate
      const isDuplicate = existingTransactions.some(
        (existing) =>
          existing.posted_at === t.date &&
          existing.description.toLowerCase().trim() === t.payee.toLowerCase().trim() &&
          Math.abs(existing.amount - t.amount) < 0.01
      );

      const normalized: NormalizedTransaction = {
        id: stableIds.get(index) ?? `fallback-${index}`,
        transaction_date: t.date,
        description: t.payee,
        amount: t.amount,
        raw_data: {
          ynab_format: parsed.format,
          ynab_category: t.category,
          ynab_memo: t.memo,
          ynab_account: t.account,
          ynab_flag: t.flag,
          ynab_cleared: t.cleared,
          row: t.rawRow,
          rowIndex: t.rowIndex,
        },
        original_row_number: t.rowIndex + 2, // +2 for header row + 1-indexed
        isPotentialDuplicate: isDuplicate,
        suggestedAction: suggestActionFromCategory(t.category, t.amount),
      };

      return normalized;
    });
  }, [parsed, existingTransactions, stableIds]);

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

    if (rows.length > 500) {
      showError('For now, please import 500 transactions or fewer at a time.');
      return;
    }

    const toCreateBills = rows.filter((r) => r.action === 'bill').length;
    const toCreateIncome = rows.filter((r) => r.action === 'income').length;

    // Re-check current counts
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

    const billsLimit = usage.bills.limit;
    const incomeLimit = usage.income.limit;

    const billsRemaining = billsLimit === null ? Infinity : Math.max(0, billsLimit - currentBills);
    const incomeRemaining = incomeLimit === null ? Infinity : Math.max(0, incomeLimit - currentIncome);

    const billsWouldExceed = billsRemaining !== Infinity && toCreateBills > billsRemaining;
    const incomeWouldExceed = incomeRemaining !== Infinity && toCreateIncome > incomeRemaining;

    if (billsWouldExceed || incomeWouldExceed) {
      if (billsWouldExceed && !incomeWouldExceed) openUpgrade('bills');
      else if (!billsWouldExceed && incomeWouldExceed) openUpgrade('income');
      else openUpgrade('general');

      const parts: string[] = [];
      if (billsWouldExceed) {
        parts.push(`You can only add ${billsRemaining} more bill${billsRemaining === 1 ? '' : 's'} on the Free tier.`);
      }
      if (incomeWouldExceed) {
        parts.push(`You can only add ${incomeRemaining} more income source${incomeRemaining === 1 ? '' : 's'} on the Free tier.`);
      }
      parts.push('Upgrade for unlimited, or import fewer items.');
      showError(parts.join(' '));
      return;
    }

    // Insert imported_transactions
    const mappedColumns = {
      date: 'Date',
      description: 'Payee',
      amount: 'Outflow/Inflow (combined)',
      source: 'YNAB',
      format: parsed?.format ?? 'unknown',
    };

    const importedRows = rows.map((r) => ({
      id: r.id,
      user_id: userId,
      posted_at: r.transaction_date,
      description: r.description,
      amount: r.amount,
      source_file_name: parsed?.fileName ?? null,
      mapped_columns: mappedColumns,
      raw: {
        ...((r.raw_data as Record<string, unknown>) ?? {}),
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

    // Create bills/income records
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

    const billsSucceeded = !billsInsertRes.error;
    const incomeSucceeded = !incomeInsertRes.error;
    const billsCount = billsToInsert.length;
    const incomeCount = incomeToInsert.length;

    if (!billsSucceeded && !incomeSucceeded) {
      showError(`Import failed. Bills error: ${billsInsertRes.error?.message || 'Unknown'}. Income error: ${incomeInsertRes.error?.message || 'Unknown'}`);
      return;
    }

    if (!billsSucceeded && billsCount > 0) {
      if (incomeCount > 0) {
        showError(`Imported ${incomeCount} income, but ${billsCount} bills failed: ${billsInsertRes.error?.message || 'Unknown error'}`);
      } else {
        showError(`Failed to import ${billsCount} bills: ${billsInsertRes.error?.message || 'Unknown error'}`);
        return;
      }
    } else if (!incomeSucceeded && incomeCount > 0) {
      if (billsCount > 0) {
        showError(`Imported ${billsCount} bills, but ${incomeCount} income failed: ${incomeInsertRes.error?.message || 'Unknown error'}`);
      } else {
        showError(`Failed to import ${incomeCount} income: ${incomeInsertRes.error?.message || 'Unknown error'}`);
        return;
      }
    } else {
      showSuccess(`Imported ${incomeCount} income and ${billsCount} bills from YNAB`);
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
        <h1 className="text-2xl font-bold text-zinc-100">Import from YNAB</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Upload your YNAB export and we&apos;ll automatically detect the format and convert transactions.
        </p>
        {usage.tier === 'free' && (
          <p className="text-sm text-zinc-500 mt-2">
            Free tier limits: {usage.bills.current}/{usage.bills.limit ?? '∞'} bills,{' '}
            {usage.income.current}/{usage.income.limit ?? '∞'} income sources.
          </p>
        )}
      </div>

      {/* Step Indicator - 2 steps for YNAB */}
      <StepIndicator
        steps={[
          {
            number: 1,
            title: 'Upload YNAB CSV',
            status: !parsed ? 'current' : 'completed',
          },
          {
            number: 2,
            title: 'Select & Import',
            status: !parsed ? 'pending' : 'current',
          },
        ]}
      />

      <YnabCsvUpload
        onLoaded={({ fileName, result }) => {
          setParsed({ fileName, format: result.format, result });
        }}
      />

      {/* Format detection banner */}
      {parsed && (
        <div className="rounded-lg border border-teal-500/30 bg-teal-500/10 p-4 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-teal-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-teal-200 font-medium">
              Detected: {formatLabel(parsed.format)}
            </p>
            <p className="mt-1 text-sm text-teal-200/70">
              Found {parsed.result.transactions.length} transaction{parsed.result.transactions.length === 1 ? '' : 's'} in your YNAB export.
            </p>
          </div>
        </div>
      )}

      {/* Parsing errors */}
      {parsed && parsed.result.errors.length > 0 && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-200 font-medium">
              {parsed.result.errors.length} row{parsed.result.errors.length === 1 ? '' : 's'} could not be parsed
            </p>
            <ul className="mt-2 text-sm text-amber-200/70 space-y-1">
              {parsed.result.errors.slice(0, 5).map((err, idx) => (
                <li key={idx}>
                  Row {err.row}: {err.message}
                </li>
              ))}
              {parsed.result.errors.length > 5 && (
                <li>...and {parsed.result.errors.length - 5} more</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Transaction selector */}
      {parsed && normalizedTransactions.length > 0 && (
        <TransactionSelector
          fileName={parsed.fileName}
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

      {parsed && normalizedTransactions.length === 0 && parsed.result.errors.length === 0 && (
        <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-6">
          <p className="text-base font-semibold text-zinc-100">No transactions found</p>
          <p className="text-sm text-zinc-400 mt-1">
            The file was recognized as a YNAB export, but it contains no transactions.
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
