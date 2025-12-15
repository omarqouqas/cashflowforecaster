'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, RotateCcw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { sendInvoice } from '@/lib/actions/send-invoice';
import { showError, showSuccess } from '@/lib/toast';

export type SendInvoiceButtonProps = {
  invoiceId: string;
  clientEmail: string | null | undefined;
  disabled?: boolean;
  /** default: 'send' */
  mode?: 'send' | 'resend';
  /** default: false (icon-only button) */
  compact?: boolean;
  /** show a collapsible message field before sending */
  allowMessage?: boolean;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function SendInvoiceButton({
  invoiceId,
  clientEmail,
  disabled,
  mode = 'send',
  compact = false,
  allowMessage = false,
}: SendInvoiceButtonProps) {
  const router = useRouter();
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [messageOpen, setMessageOpen] = useState(false);
  const [message, setMessage] = useState('');

  const email = (clientEmail ?? '').trim();

  const canSend = useMemo(() => {
    if (disabled) return false;
    if (!email) return false;
    if (!isValidEmail(email)) return false;
    return true;
  }, [disabled, email]);

  const label = mode === 'resend' ? 'Resend' : 'Send Invoice';

  const icon = useMemo(() => {
    if (state === 'loading') {
      return (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      );
    }

    if (state === 'success') return <CheckCircle2 className="w-4 h-4" />;
    if (state === 'error') return <AlertTriangle className="w-4 h-4" />;

    return mode === 'resend' ? <RotateCcw className="w-4 h-4" /> : <Send className="w-4 h-4" />;
  }, [mode, state]);

  const handleClick = async () => {
    if (!canSend || state === 'loading') return;

    if (mode === 'resend') {
      const ok = window.confirm(`Resend this invoice to ${email}?`);
      if (!ok) return;
    }

    if (!email) {
      showError('Client email is required to send an invoice.');
      setState('error');
      return;
    }

    if (!isValidEmail(email)) {
      showError('Please enter a valid email address.');
      setState('error');
      return;
    }

    setState('loading');

    const res = await sendInvoice({
      invoiceId,
      message: allowMessage ? message : undefined,
      forceResend: mode === 'resend',
    });

    if (!res.ok) {
      if (res.code === 'already_sent') {
        showError('This invoice was already sent. Use “Resend” to send it again.');
      } else if (res.code === 'invalid_email') {
        showError('Please enter a valid email address.');
      } else {
        showError('Failed to send invoice. Please try again.');
      }

      setState('error');
      setTimeout(() => setState('idle'), 2000);
      return;
    }

    showSuccess(`Invoice sent to ${res.sentTo}`);
    setState('success');

    // Refresh to update status + timestamps
    router.refresh();

    setTimeout(() => setState('idle'), 2500);
  };

  const buttonClasses = [
    'inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md border min-h-[32px] transition-colors',
    canSend
      ? 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700'
      : 'border-zinc-200 bg-zinc-50 text-zinc-400 cursor-not-allowed',
    state === 'error' ? 'border-rose-200 bg-rose-50 text-rose-700' : '',
    state === 'success' ? 'border-teal-200 bg-teal-50 text-teal-800' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClick}
        className={compact ? buttonClasses.replace('px-3', 'px-2') : buttonClasses}
        disabled={!canSend || state === 'loading'}
        aria-label={label}
        title={!email ? 'Add a client email to send' : label}
      >
        {icon}
        {!compact && <span>{label}</span>}
      </button>

      {allowMessage && !compact && mode === 'send' && (
        <div className="border border-zinc-200 bg-white rounded-lg p-3">
          <button
            type="button"
            onClick={() => setMessageOpen((v) => !v)}
            className="text-xs font-medium text-teal-700 hover:text-teal-800"
          >
            {messageOpen ? 'Hide message' : 'Add a message (optional)'}
          </button>

          {messageOpen && (
            <div className="mt-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Please find your invoice attached."
              />
              <p className="mt-1 text-xs text-zinc-500">This message will be included in the email.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
