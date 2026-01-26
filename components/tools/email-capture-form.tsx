'use client';

import { useState } from 'react';
import { z } from 'zod';
import posthog from 'posthog-js';
import { Input } from '@/components/ui/input';

const emailSchema = z.string().email('Enter a valid email');

type Props = {
  payload: Record<string, any>;
  events?: {
    sent?: string;
    failed?: string;
  };
};

export function EmailCaptureForm({ payload, events }: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  const sentEvent = events?.sent ?? 'tool_can_i_afford_it_email_sent';
  const failedEvent = events?.failed ?? 'tool_can_i_afford_it_email_failed';

  const submit = async () => {
    setMessage(null);

    const parsed = emailSchema.safeParse(email.trim());
    if (!parsed.success) {
      setStatus('error');
      setMessage(parsed.error.issues[0]?.message ?? 'Enter a valid email');
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('/api/tools/email-results', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: parsed.data,
          payload,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as any;
        throw new Error(data?.error || 'Failed to send email');
      }

      setStatus('sent');
      setMessage('Sent! Check your inbox.');

      try {
        posthog.capture(sentEvent, {
          email_domain: parsed.data.split('@')[1] ?? null,
        });
      } catch {}
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Something went wrong';
      setStatus('error');
      setMessage(msg);
      try {
        posthog.capture(failedEvent, { message: msg });
      } catch {}
    }
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm font-semibold text-white">Email me these results</p>
          <p className="mt-1 text-xs text-zinc-500">We'll send a copy + a link to get your full 90-day forecast.</p>
        </div>
      </div>

      <div className="mt-3 flex flex-col sm:flex-row gap-2">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@domain.com"
          className="bg-zinc-950/40 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:ring-teal-500 focus:ring-offset-zinc-950"
        />
        <button
          type="button"
          onClick={submit}
          disabled={status === 'sending'}
          className="rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold px-4 py-3 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
        >
          {status === 'sending' ? 'Sending…' : 'Send'}
        </button>
      </div>

      {message && (
        <p className={['mt-2 text-sm', status === 'error' ? 'text-rose-300' : 'text-teal-300'].join(' ')}>
          {message}
        </p>
      )}

      <p className="mt-2 text-xs text-zinc-600">
        No spam. You can unsubscribe any time.
      </p>
    </div>
  );
}

