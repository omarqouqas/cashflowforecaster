'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, RotateCcw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { sendQuote } from '@/lib/actions/send-quote';
import { showError, showSuccess } from '@/lib/toast';

export type SendQuoteButtonProps = {
  quoteId: string;
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

export function SendQuoteButton({
  quoteId,
  clientEmail,
  disabled,
  mode = 'send',
  compact = false,
  allowMessage = false,
}: SendQuoteButtonProps) {
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

  const label = mode === 'resend' ? 'Resend' : 'Send Quote';

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
      const ok = window.confirm(`Resend this quote to ${email}?`);
      if (!ok) return;
    }

    if (!email) {
      showError('Client email is required to send a quote.');
      setState('error');
      return;
    }

    if (!isValidEmail(email)) {
      showError('Please enter a valid email address.');
      setState('error');
      return;
    }

    setState('loading');

    const res = await sendQuote({
      quoteId,
      message: allowMessage ? message : undefined,
      forceResend: mode === 'resend',
    });

    if (!res.ok) {
      if (res.code === 'already_sent') {
        showError('This quote was already sent. Use "Resend" to send it again.');
      } else if (res.code === 'invalid_email') {
        showError('Please enter a valid email address.');
      } else if (res.code === 'expired') {
        showError('Cannot send an expired quote. Please update the valid until date.');
      } else {
        showError('Failed to send quote. Please try again.');
      }

      setState('error');
      setTimeout(() => setState('idle'), 2000);
      return;
    }

    showSuccess(`Quote sent to ${res.sentTo}`);
    setState('success');

    // Refresh to update status + timestamps
    router.refresh();

    setTimeout(() => setState('idle'), 2500);
  };

  const buttonClasses = [
    'inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md border min-h-[32px] transition-colors',
    canSend
      ? 'border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-100'
      : 'border-zinc-700 bg-zinc-800/50 text-zinc-500 cursor-not-allowed',
    state === 'error' ? 'border-rose-500/30 bg-rose-500/10 text-rose-400' : '',
    state === 'success' ? 'border-teal-500/30 bg-teal-500/10 text-teal-400' : '',
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
        <div className="border border-zinc-700 bg-zinc-800 rounded-lg p-3">
          <button
            type="button"
            onClick={() => setMessageOpen((v) => !v)}
            className="text-xs font-medium text-teal-400 hover:text-teal-300"
          >
            {messageOpen ? 'Hide message' : 'Add a message (optional)'}
          </button>

          {messageOpen && (
            <div className="mt-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Please find your quote attached."
              />
              <p className="mt-1 text-xs text-zinc-400">This message will be included in the email.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
