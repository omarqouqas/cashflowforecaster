'use client';

import Link from 'next/link';
import { CreditCard, Plus, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import { cn } from '@/lib/utils';

interface CreditCardAccount {
  id: string;
  name: string;
  current_balance: number;
  credit_limit?: number | null;
  payment_due_day?: number | null;
}

interface CreditCardsSectionProps {
  creditCards: CreditCardAccount[];
  currency?: string;
}

function getUtilizationColor(utilization: number): string {
  if (utilization >= 50) return 'text-rose-400';
  if (utilization >= 30) return 'text-amber-400';
  return 'text-emerald-400';
}

function getUtilizationBgColor(utilization: number): string {
  if (utilization >= 50) return 'bg-rose-500';
  if (utilization >= 30) return 'bg-amber-500';
  return 'bg-emerald-500';
}

export function CreditCardsSection({ creditCards, currency = 'USD' }: CreditCardsSectionProps) {
  // Calculate total debt (positive balance = money owed)
  const totalDebt = creditCards.reduce((sum, cc) => sum + Math.max(0, cc.current_balance), 0);
  const totalLimit = creditCards.reduce((sum, cc) => sum + (cc.credit_limit || 0), 0);
  const overallUtilization = totalLimit > 0 ? (totalDebt / totalLimit) * 100 : 0;

  // Find next payment due
  const today = new Date();
  const currentDay = today.getDate();

  const cardsWithPaymentDue = creditCards
    .filter(cc => cc.payment_due_day && cc.current_balance > 0)
    .map(cc => {
      const dueDay = cc.payment_due_day!;
      // Calculate days until due
      let daysUntil = dueDay - currentDay;
      if (daysUntil < 0) daysUntil += 30; // Approximate next month
      return { ...cc, daysUntil };
    })
    .sort((a, b) => a.daysUntil - b.daysUntil);

  const nextPayment = cardsWithPaymentDue[0];

  // If no credit cards, show empty state with add button
  if (creditCards.length === 0) {
    return (
      <div className="border border-zinc-800 bg-zinc-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-100">Credit Cards</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Track your credit card balances</p>
            </div>
          </div>
        </div>

        <div className="text-center py-6 border-t border-zinc-700/50">
          <p className="text-sm text-zinc-400 mb-4">
            Add your credit cards to track balances and schedule payments
          </p>
          <Link
            href="/dashboard/accounts/new?type=credit_card"
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg text-sm font-medium text-amber-300 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Credit Card
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-zinc-800 bg-zinc-800 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-zinc-100">Credit Cards</h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              {creditCards.length} card{creditCards.length === 1 ? '' : 's'} • {overallUtilization.toFixed(0)}% overall utilization
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/accounts/new?type=credit_card"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-700/50 hover:bg-zinc-700 border border-zinc-700 hover:border-amber-500/30 rounded text-xs font-medium text-zinc-300 hover:text-amber-400 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Card
        </Link>
      </div>

      {/* Total Debt */}
      <div className="flex items-baseline justify-between py-3 border-t border-zinc-700/50 mb-4">
        <p className="text-xs text-zinc-400">Total Balance Owed</p>
        <p className={cn(
          "text-2xl font-bold tabular-nums",
          totalDebt > 0 ? "text-amber-400" : "text-emerald-400"
        )}>
          {formatCurrency(totalDebt, currency)}
        </p>
      </div>

      {/* Credit Card List */}
      <div className="space-y-3 mb-4">
        {creditCards.map((card) => {
          const balance = Math.max(0, card.current_balance);
          const limit = card.credit_limit || 0;
          const utilization = limit > 0 ? (balance / limit) * 100 : 0;
          const utilizationCapped = Math.min(utilization, 100);

          return (
            <div
              key={card.id}
              className="bg-zinc-900 rounded-lg p-3 border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <Link
                  href={`/dashboard/accounts/${card.id}`}
                  className="text-sm font-medium text-zinc-100 hover:text-amber-400 transition-colors truncate flex-1 mr-2"
                >
                  {card.name}
                </Link>
                <Link
                  href={`/dashboard/transfers/new?to=${card.id}&amount=${balance > 0 ? balance : ''}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded text-xs font-medium text-amber-300 transition-colors flex-shrink-0"
                >
                  Pay
                </Link>
              </div>

              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-zinc-400">
                  {formatCurrency(balance, currency)} / {formatCurrency(limit, currency)}
                </span>
                <span className={cn("font-medium", getUtilizationColor(utilization))}>
                  {utilization.toFixed(0)}% used
                </span>
              </div>

              {/* Utilization Bar */}
              <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all", getUtilizationBgColor(utilization))}
                  style={{ width: `${utilizationCapped}%` }}
                />
              </div>

              {/* High utilization warning */}
              {utilization >= 30 && (
                <div className="flex items-center gap-1.5 mt-2">
                  <AlertTriangle className={cn("w-3 h-3", getUtilizationColor(utilization))} />
                  <span className={cn("text-xs", getUtilizationColor(utilization))}>
                    {utilization >= 50 ? 'High utilization may impact credit score' : 'Approaching 30% threshold'}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Next Payment Due */}
      {nextPayment && (
        <div className="pt-3 border-t border-zinc-700/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Next payment due:</span>
            <span className="text-zinc-100 font-medium">
              {nextPayment.name} on the {nextPayment.payment_due_day}
              {(() => {
                const day = nextPayment.payment_due_day!;
                if (day >= 11 && day <= 13) return 'th';
                const lastDigit = day % 10;
                if (lastDigit === 1) return 'st';
                if (lastDigit === 2) return 'nd';
                if (lastDigit === 3) return 'rd';
                return 'th';
              })()}
              {nextPayment.daysUntil <= 7 && (
                <span className="text-amber-400 ml-2">({nextPayment.daysUntil} days)</span>
              )}
            </span>
          </div>
        </div>
      )}

      {/* View All Link */}
      <div className="pt-4 mt-4 border-t border-zinc-700/50">
        <Link
          href="/dashboard/accounts"
          className="inline-flex items-center text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
        >
          Manage accounts →
        </Link>
      </div>
    </div>
  );
}
