'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, ArrowRight, CreditCard, Wallet, PiggyBank, Trash2, Pause, Play, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { deleteTransfer, updateTransfer } from '@/lib/actions/transfers';
import { showError, showSuccess } from '@/lib/toast';
import type { Tables } from '@/types/supabase';

type Account = Pick<Tables<'accounts'>, 'id' | 'name' | 'account_type' | 'current_balance'> & {
  credit_limit?: number | null;
};

type TransferWithAccounts = Tables<'transfers'> & {
  from_account: Account;
  to_account: Account;
};

interface TransfersContentProps {
  transfers: TransferWithAccounts[];
  accounts: Account[];
  currency: string;
}

function getAccountIcon(accountType: string | null) {
  switch (accountType) {
    case 'credit_card':
      return <CreditCard className="w-4 h-4 text-amber-400" />;
    case 'savings':
      return <PiggyBank className="w-4 h-4 text-emerald-400" />;
    default:
      return <Wallet className="w-4 h-4 text-blue-400" />;
  }
}

function getFrequencyLabel(frequency: string) {
  switch (frequency) {
    case 'one-time':
      return 'One-time';
    case 'weekly':
      return 'Weekly';
    case 'biweekly':
      return 'Bi-weekly';
    case 'semi-monthly':
      return 'Semi-monthly';
    case 'monthly':
      return 'Monthly';
    case 'quarterly':
      return 'Quarterly';
    case 'annually':
      return 'Annually';
    default:
      return frequency;
  }
}

export function TransfersContent({ transfers, accounts, currency }: TransfersContentProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const activeTransfers = transfers.filter(t => t.is_active !== false);
  const pausedTransfers = transfers.filter(t => t.is_active === false);

  // Calculate totals
  const monthlyTransferTotal = activeTransfers.reduce((sum, t) => {
    if (!t.is_active) return sum;
    switch (t.frequency) {
      case 'weekly':
        return sum + (t.amount * 52) / 12;
      case 'biweekly':
        return sum + (t.amount * 26) / 12;
      case 'semi-monthly':
        return sum + t.amount * 2;
      case 'monthly':
        return sum + t.amount;
      case 'quarterly':
        return sum + t.amount / 3;
      case 'annually':
        return sum + t.amount / 12;
      default:
        return sum;
    }
  }, 0);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transfer?')) return;

    setDeletingId(id);
    const result = await deleteTransfer(id);

    if (result.success) {
      showSuccess('Transfer deleted');
      router.refresh();
    } else {
      showError(result.error || 'Failed to delete transfer');
    }
    setDeletingId(null);
  };

  const handleToggleActive = async (id: string, currentlyActive: boolean) => {
    setTogglingId(id);
    const result = await updateTransfer({
      id,
      is_active: !currentlyActive,
    });

    if (result.success) {
      showSuccess(currentlyActive ? 'Transfer paused' : 'Transfer resumed');
      router.refresh();
    } else {
      showError(result.error || 'Failed to update transfer');
    }
    setTogglingId(null);
  };

  const creditCards = accounts.filter(a => a.account_type === 'credit_card');
  const hasCreditCards = creditCards.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100">Transfers</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Schedule recurring or one-time transfers between accounts
          </p>
        </div>
        <div className="flex gap-2">
          {hasCreditCards && (
            <Link href={`/dashboard/transfers/new?to=${creditCards[0]?.id}`}>
              <Button
                variant="outline"
                className="border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Pay Credit Card
              </Button>
            </Link>
          )}
          <Link href="/dashboard/transfers/new">
            <Button className="bg-teal-600 hover:bg-teal-500 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Transfer
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Card */}
      {activeTransfers.length > 0 && (
        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400">Monthly Transfer Total</p>
              <p className="text-2xl font-bold text-zinc-100">
                {formatCurrency(monthlyTransferTotal, currency)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-zinc-400">Active Transfers</p>
              <p className="text-2xl font-bold text-teal-400">{activeTransfers.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {transfers.length === 0 && (
        <div className="border border-zinc-700/50 bg-zinc-800/30 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-zinc-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ArrowRight className="w-8 h-8 text-zinc-500" />
          </div>
          <h3 className="text-lg font-medium text-zinc-200 mb-2">No transfers yet</h3>
          <p className="text-zinc-400 mb-6 max-w-md mx-auto">
            Set up transfers between accounts to track money movement. Great for credit card payments,
            savings contributions, or moving funds between checking accounts.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard/transfers/new">
              <Button className="bg-teal-600 hover:bg-teal-500 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create First Transfer
              </Button>
            </Link>
            {hasCreditCards && (
              <Link href={`/dashboard/transfers/new?to=${creditCards[0]?.id}`}>
                <Button
                  variant="outline"
                  className="border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Set Up CC Payment
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Active Transfers */}
      {activeTransfers.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-medium text-zinc-200">Active Transfers</h2>
          <div className="grid gap-3">
            {activeTransfers.map((transfer) => (
              <TransferCard
                key={transfer.id}
                transfer={transfer}
                currency={currency}
                onDelete={handleDelete}
                onToggleActive={handleToggleActive}
                isDeleting={deletingId === transfer.id}
                isToggling={togglingId === transfer.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* Paused Transfers */}
      {pausedTransfers.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-medium text-zinc-400">Paused Transfers</h2>
          <div className="grid gap-3 opacity-60">
            {pausedTransfers.map((transfer) => (
              <TransferCard
                key={transfer.id}
                transfer={transfer}
                currency={currency}
                onDelete={handleDelete}
                onToggleActive={handleToggleActive}
                isDeleting={deletingId === transfer.id}
                isToggling={togglingId === transfer.id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface TransferCardProps {
  transfer: TransferWithAccounts;
  currency: string;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
  isDeleting: boolean;
  isToggling: boolean;
}

function TransferCard({
  transfer,
  currency,
  onDelete,
  onToggleActive,
  isDeleting,
  isToggling,
}: TransferCardProps) {
  const isActive = transfer.is_active !== false;
  const isCCPayment = transfer.to_account?.account_type === 'credit_card';

  return (
    <div className="border border-zinc-700/50 bg-zinc-800/50 rounded-lg p-4 hover:bg-zinc-800/80 transition-colors">
      <div className="flex items-start gap-4">
        {/* Transfer Visual */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-700/50">
            {getAccountIcon(transfer.from_account?.account_type)}
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-500" />
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-700/50">
            {getAccountIcon(transfer.to_account?.account_type)}
          </div>
        </div>

        {/* Transfer Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium text-zinc-100">
                {transfer.description || (isCCPayment ? 'Credit Card Payment' : 'Transfer')}
              </p>
              <p className="text-sm text-zinc-400">
                {transfer.from_account?.name} → {transfer.to_account?.name}
              </p>
            </div>
            <p className="text-lg font-bold text-zinc-100 tabular-nums">
              {formatCurrency(transfer.amount, currency)}
            </p>
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1 text-xs text-zinc-400">
              <Calendar className="w-3 h-3" />
              {formatDate(transfer.transfer_date)}
            </span>
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
              transfer.frequency === 'one-time'
                ? 'bg-zinc-700 text-zinc-300'
                : 'bg-teal-500/10 border border-teal-500/30 text-teal-300'
            }`}>
              {getFrequencyLabel(transfer.frequency)}
            </span>
            {isCCPayment && (
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-amber-500/10 border border-amber-500/30 text-amber-300">
                <CreditCard className="w-3 h-3" />
                CC Payment
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleActive(transfer.id, isActive)}
              disabled={isToggling}
              className="text-zinc-400 hover:text-zinc-100"
            >
              {isActive ? (
                <>
                  <Pause className="w-4 h-4 mr-1" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-1" />
                  Resume
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(transfer.id)}
              disabled={isDeleting}
              className="text-zinc-400 hover:text-rose-400"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
