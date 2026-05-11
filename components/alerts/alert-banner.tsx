'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  Sparkles,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { Alert, AlertPriority } from '@/lib/alerts/types';

interface AlertBannerProps {
  alerts: Alert[];
  className?: string;
}

const PRIORITY_STYLES: Record<
  AlertPriority,
  {
    bg: string;
    border: string;
    iconBg: string;
    iconColor: string;
    titleColor: string;
    textColor: string;
    actionColor: string;
  }
> = {
  critical: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    iconBg: 'bg-rose-500/20',
    iconColor: 'text-rose-400',
    titleColor: 'text-rose-300',
    textColor: 'text-rose-400',
    actionColor: 'text-rose-300 hover:text-rose-200',
  },
  warning: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-400',
    titleColor: 'text-amber-300',
    textColor: 'text-amber-400',
    actionColor: 'text-amber-300 hover:text-amber-200',
  },
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
    titleColor: 'text-blue-300',
    textColor: 'text-blue-400',
    actionColor: 'text-blue-300 hover:text-blue-200',
  },
  opportunity: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
    titleColor: 'text-emerald-300',
    textColor: 'text-emerald-400',
    actionColor: 'text-emerald-300 hover:text-emerald-200',
  },
};

const PRIORITY_ICONS: Record<AlertPriority, React.ComponentType<{ className?: string }>> = {
  critical: AlertTriangle,
  warning: AlertCircle,
  info: Info,
  opportunity: Sparkles,
};

function AlertCard({
  alert,
  onDismiss,
}: {
  alert: Alert;
  onDismiss?: (id: string) => void;
}) {
  const styles = PRIORITY_STYLES[alert.priority];
  const Icon = PRIORITY_ICONS[alert.priority];

  return (
    <div className={`rounded-lg border ${styles.border} ${styles.bg} p-4`}>
      <div className="flex items-start gap-3">
        <div
          className={`w-8 h-8 ${styles.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}
        >
          <Icon className={`w-4 h-4 ${styles.iconColor}`} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className={`text-sm font-medium ${styles.titleColor}`}>
              {alert.title}
            </p>
            {alert.dismissible && onDismiss && (
              <button
                onClick={() => onDismiss(alert.id)}
                className={`p-0.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700/50 transition-colors ${styles.iconColor}`}
                aria-label="Dismiss alert"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <p className={`text-sm ${styles.textColor} mt-1`}>{alert.message}</p>

          {alert.actionUrl && alert.actionText && (
            <Link
              href={alert.actionUrl}
              className={`inline-flex items-center text-sm font-medium ${styles.actionColor} transition-colors mt-2`}
            >
              {alert.actionText} →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export function AlertBanner({ alerts, className = '' }: AlertBannerProps) {
  const [dismissedIds, setDismissedIds] = React.useState<Set<string>>(new Set());
  const [isExpanded, setIsExpanded] = React.useState(true);

  // Filter out dismissed alerts
  const visibleAlerts = alerts.filter((alert) => !dismissedIds.has(alert.id));

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  if (visibleAlerts.length === 0) {
    return null;
  }

  // If only one alert, show it directly
  if (visibleAlerts.length === 1) {
    return (
      <div className={className}>
        <AlertCard alert={visibleAlerts[0]!} onDismiss={handleDismiss} />
      </div>
    );
  }

  // Multiple alerts - show collapsible list
  const criticalCount = visibleAlerts.filter(
    (a) => a.priority === 'critical'
  ).length;
  const warningCount = visibleAlerts.filter((a) => a.priority === 'warning').length;

  return (
    <div className={className}>
      {/* Header with collapse toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors mb-2"
      >
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
            {visibleAlerts.length} alert{visibleAlerts.length === 1 ? '' : 's'}
          </span>
          {criticalCount > 0 && (
            <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-rose-500/20 text-rose-300">
              {criticalCount} critical
            </span>
          )}
          {warningCount > 0 && (
            <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-amber-500/20 text-amber-300">
              {warningCount} warning
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        )}
      </button>

      {/* Alert list */}
      {isExpanded && (
        <div className="space-y-2">
          {visibleAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} onDismiss={handleDismiss} />
          ))}
        </div>
      )}
    </div>
  );
}
