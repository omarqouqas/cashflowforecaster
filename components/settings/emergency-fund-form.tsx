'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { updateEmergencyFundSettings } from '@/lib/actions/update-emergency-fund';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

type Account = {
  id: string;
  name: string;
  account_type: string;
  current_balance: number;
};

type Props = {
  initialEnabled: boolean;
  initialGoalMonths: number;
  initialAccountId: string | null;
  accounts: Account[];
  monthlyExpenses: number;
};

const GOAL_OPTIONS = [
  { value: 3, label: '3 months', description: 'Minimum recommended' },
  { value: 6, label: '6 months', description: 'Standard recommendation' },
  { value: 12, label: '12 months', description: 'Extra security' },
] as const;

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function EmergencyFundForm({
  initialEnabled,
  initialGoalMonths,
  initialAccountId,
  accounts,
  monthlyExpenses,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [enabled, setEnabled] = useState(initialEnabled);
  const [goalMonths, setGoalMonths] = useState(initialGoalMonths);
  const [accountId, setAccountId] = useState<string | null>(initialAccountId);

  const goalAmount = monthlyExpenses * goalMonths;
  const savingsAccounts = accounts.filter((a) => a.account_type === 'savings');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      const result = await updateEmergencyFundSettings({
        enabled,
        goalMonths,
        accountId,
      });

      if (result.success) {
        toast.success('Emergency fund settings saved');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to save settings');
      }
    });
  }

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-teal-400" />
        </div>
        <div>
          <h3 className="font-semibold text-zinc-100">Emergency Fund Tracker</h3>
          <p className="text-sm text-zinc-400">Build your financial safety net</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Enable Toggle */}
        <div className="flex items-center justify-between py-3 border-b border-zinc-800">
          <div>
            <p className="text-zinc-100 font-medium">Enable Emergency Fund Tracking</p>
            <p className="text-sm text-zinc-500">Show progress on your dashboard</p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => setEnabled((v) => !v)}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0',
              enabled ? 'bg-teal-500' : 'bg-zinc-700'
            )}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                enabled ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        </div>

        {enabled && (
          <>
            {/* Goal Months Selection */}
            <div>
              <label className="block text-sm font-medium text-zinc-200 mb-3">
                Savings Goal
              </label>
              <div className="grid grid-cols-3 gap-3">
                {GOAL_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setGoalMonths(option.value)}
                    className={cn(
                      'rounded-lg border px-3 py-3 text-left transition-colors',
                      goalMonths === option.value
                        ? 'border-teal-500 bg-teal-500/10'
                        : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'
                    )}
                  >
                    <p
                      className={cn(
                        'font-semibold',
                        goalMonths === option.value ? 'text-teal-400' : 'text-zinc-100'
                      )}
                    >
                      {option.label}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Calculated Goal */}
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-zinc-400">Your monthly expenses</p>
                  <p className="text-lg font-semibold text-zinc-100">
                    {formatCurrency(monthlyExpenses)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-zinc-400">Goal amount</p>
                  <p className="text-lg font-semibold text-teal-400">
                    {formatCurrency(goalAmount)}
                  </p>
                </div>
              </div>
              <p className="text-xs text-zinc-500 mt-2">
                Calculated from your recurring bills. Add or update bills to adjust.
              </p>
            </div>

            {/* Savings Account Selection (Optional) */}
            {savingsAccounts.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-zinc-200 mb-2">
                  Designated Savings Account (Optional)
                </label>
                <select
                  value={accountId ?? ''}
                  onChange={(e) => setAccountId(e.target.value || null)}
                  className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Use total balance (all accounts)</option>
                  {savingsAccounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} ({formatCurrency(account.current_balance)})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-zinc-500 mt-1.5">
                  If selected, only this account&apos;s balance will count toward your emergency fund.
                </p>
              </div>
            )}

            {/* Info Box */}
            <div className="text-sm text-zinc-500 bg-zinc-800/50 rounded-lg p-3">
              <p>
                Financial experts typically recommend saving 3-6 months of expenses as an
                emergency fund to cover unexpected costs or income disruptions.
              </p>
            </div>
          </>
        )}

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={isPending} loading={isPending}>
            {isPending ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </form>
    </div>
  );
}
