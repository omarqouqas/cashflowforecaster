'use client';

import Link from 'next/link';
import { Shield, Settings } from 'lucide-react';

interface EmergencyFundWidgetProps {
  enabled: boolean;
  goalMonths: number;
  monthlyExpenses: number;
  currentBalance: number;
  accountName?: string; // Name of designated savings account, if any
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function EmergencyFundWidget({
  enabled,
  goalMonths,
  monthlyExpenses,
  currentBalance,
  accountName,
}: EmergencyFundWidgetProps) {
  // Calculate metrics
  const goalAmount = monthlyExpenses * goalMonths;
  const progressPercent = goalAmount > 0 ? Math.min((currentBalance / goalAmount) * 100, 100) : 0;
  const monthsCovered = monthlyExpenses > 0 ? currentBalance / monthlyExpenses : 0;
  const amountToGo = Math.max(goalAmount - currentBalance, 0);

  // Determine progress bar color
  const getProgressColor = () => {
    if (progressPercent >= 100) return 'bg-teal-500';
    if (progressPercent >= 75) return 'bg-teal-400';
    if (progressPercent >= 50) return 'bg-amber-400';
    return 'bg-rose-400';
  };

  // Determine status badge
  const getStatusBadge = () => {
    if (progressPercent >= 100) {
      return (
        <span className="inline-flex items-center rounded-full bg-teal-500/10 px-2 py-1 text-xs font-medium text-teal-400">
          Goal Reached
        </span>
      );
    }
    if (progressPercent >= 75) {
      return (
        <span className="inline-flex items-center rounded-full bg-teal-500/10 px-2 py-1 text-xs font-medium text-teal-400">
          Almost There
        </span>
      );
    }
    if (progressPercent >= 50) {
      return (
        <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-400">
          On Track
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-rose-500/10 px-2 py-1 text-xs font-medium text-rose-400">
        Building
      </span>
    );
  };

  // Disabled state
  if (!enabled) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800">
              <Shield className="h-5 w-5 text-zinc-500" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-300">Emergency Fund</h3>
              <p className="text-sm text-zinc-500">Track your financial safety net</p>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-zinc-800/50 p-4">
          <p className="text-sm text-zinc-400">
            Set a savings goal and track how many months of expenses you have covered.
            Financial experts recommend saving 3-6 months of expenses.
          </p>
          <Link
            href="/dashboard/settings"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-teal-400 hover:text-teal-300"
          >
            <Settings className="h-4 w-4" />
            Enable in Settings
          </Link>
        </div>
      </div>
    );
  }

  // Enabled state
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10">
            <Shield className="h-5 w-5 text-teal-400" />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-100">Emergency Fund</h3>
            <p className="text-sm text-zinc-500">Your financial safety net</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge()}
          <Link
            href="/dashboard/settings"
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
            title="Configure"
          >
            <Settings className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Goal Info */}
      <div className="mt-4">
        <p className="text-sm text-zinc-400">
          Goal: {goalMonths} months of expenses ({formatCurrency(goalAmount)})
          {accountName && (
            <span className="text-zinc-500"> &middot; {accountName}</span>
          )}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-zinc-100">{formatCurrency(currentBalance)}</span>
          <span className="text-zinc-500">{Math.round(progressPercent)}%</span>
        </div>
        <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-zinc-800">
          <div
            className={`h-full transition-all duration-500 ${getProgressColor()}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-zinc-800/50 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Months Covered
          </p>
          <p className="mt-1 text-xl font-semibold text-zinc-100">
            {monthsCovered.toFixed(1)}
          </p>
        </div>
        <div className="rounded-lg bg-zinc-800/50 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            To Go
          </p>
          <p className="mt-1 text-xl font-semibold text-zinc-100">
            {amountToGo > 0 ? formatCurrency(amountToGo) : 'Done!'}
          </p>
        </div>
      </div>

      {/* Encouragement message for those close to goal */}
      {progressPercent >= 75 && progressPercent < 100 && (
        <div className="mt-4 rounded-lg bg-teal-500/10 p-3">
          <p className="text-sm text-teal-400">
            Great progress! You&apos;re only {formatCurrency(amountToGo)} away from your goal.
          </p>
        </div>
      )}

      {progressPercent >= 100 && (
        <div className="mt-4 rounded-lg bg-teal-500/10 p-3">
          <p className="text-sm text-teal-400">
            Congratulations! You&apos;ve reached your {goalMonths}-month emergency fund goal.
          </p>
        </div>
      )}
    </div>
  );
}
