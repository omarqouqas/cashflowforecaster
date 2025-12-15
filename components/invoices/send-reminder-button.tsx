'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ChevronDown, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { sendInvoiceReminder } from '@/lib/actions/send-reminder';
import { showError, showSuccess } from '@/lib/toast';

export type SendReminderButtonProps = {
  invoiceId: string;
  invoiceStatus: string | null | undefined;
  // NOTE: Client component props must be serializable from Server Components.
  // Pass ISO string (e.g. invoice.last_reminder_at) and we convert it here.
  lastReminderAt: string | null;
  reminderCount: number;
};

type ReminderType = 'friendly' | 'firm' | 'final';

const OPTIONS: Array<{
  type: ReminderType;
  label: string;
  description: string;
}> = [
  { type: 'friendly', label: 'Friendly Reminder', description: 'Polite check-in (3 days overdue)' },
  { type: 'firm', label: 'Firm Reminder', description: 'Professional, emphasizes amount due (7 days overdue)' },
  { type: 'final', label: 'Final Notice', description: 'Urgent, mentions next steps (14+ days overdue)' },
];

function safeRelative(date: Date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return null;
  return formatDistanceToNow(date, { addSuffix: true });
}

export function SendReminderButton({
  invoiceId,
  invoiceStatus,
  lastReminderAt,
  reminderCount,
}: SendReminderButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loadingType, setLoadingType] = useState<ReminderType | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const isPaid = (invoiceStatus ?? 'draft') === 'paid';
  const isLoading = loadingType !== null;

  const lastSent = useMemo(() => {
    if (!lastReminderAt) return null;
    const parsed = new Date(lastReminderAt);
    return safeRelative(parsed);
  }, [lastReminderAt]);

  useEffect(() => {
    if (!open) return;

    const onMouseDown = (e: MouseEvent) => {
      const el = rootRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const send = async (type: ReminderType) => {
    if (isPaid || isLoading) return;

    setLoadingType(type);
    try {
      const res = await sendInvoiceReminder(invoiceId, type);
      if (!res.ok) {
        showError(res.message);
        return;
      }
      showSuccess(res.message);
      setOpen(false);
      router.refresh();
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Failed to send reminder.');
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div ref={rootRef} className="relative inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={isPaid}
        className={[
          'inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md border min-h-[32px] transition-colors',
          !isPaid
            ? 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700'
            : 'border-zinc-200 bg-zinc-50 text-zinc-400 cursor-not-allowed',
        ].join(' ')}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Mail className="w-4 h-4" />
        <span>Send Reminder</span>
        <ChevronDown className="w-4 h-4 opacity-90" />
      </button>

      {(lastSent || reminderCount > 0) && (
        <div className="flex items-center gap-1 text-[11px] text-zinc-500">
          <Clock className="w-3.5 h-3.5" />
          {lastSent ? (
            <span>Last sent {lastSent}</span>
          ) : (
            <span>{reminderCount} reminder{reminderCount === 1 ? '' : 's'} sent</span>
          )}
        </div>
      )}

      {open && (
        <div
          role="menu"
          aria-label="Send reminder options"
          className="absolute z-50 mt-9 w-[280px] rounded-lg border border-zinc-200 bg-white shadow-lg p-1"
        >
          <div className="px-2 py-2">
            <p className="text-xs font-semibold text-zinc-900">Choose a reminder</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Select the tone you want to send for this overdue invoice.
            </p>
          </div>

          <div className="h-px bg-zinc-100 my-1" />

          {OPTIONS.map((opt) => {
            const loading = loadingType === opt.type;
            return (
              <button
                key={opt.type}
                type="button"
                role="menuitem"
                onClick={() => void send(opt.type)}
                disabled={isPaid || isLoading}
                className={[
                  'w-full text-left rounded-md px-2 py-2 transition-colors',
                  'hover:bg-zinc-50 focus:bg-zinc-50 focus:outline-none',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                ].join(' ')}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-zinc-900">{opt.label}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">{opt.description}</div>
                  </div>
                  <div className="shrink-0">
                    {loading ? (
                      <svg
                        className="animate-spin h-4 w-4 text-zinc-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    ) : (
                      <span className="text-[11px] font-semibold text-teal-700">Send</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}

          {isPaid && (
            <div className="px-2 py-2 text-xs text-zinc-500">
              Reminders are disabled for paid invoices.
            </div>
          )}
        </div>
      )}
    </div>
  );
}


