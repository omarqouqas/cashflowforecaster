import 'server-only';

import { resend } from '@/lib/email/resend';
import { generateDigestData } from '@/lib/email/generate-digest-data';
import { buildWeeklyDigestEmail } from '@/components/emails/weekly-digest';
import { createAdminClient } from '@/lib/supabase/admin';
import { generateDigestEmailToken } from '@/lib/email/digest-token';
import { captureServerEvent } from '@/lib/posthog/server';

interface SendDigestResult {
  success: boolean;
  error?: string;
  messageId?: string;
}

function getAppUrl() {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.APP_URL?.trim() ||
    'http://localhost:3000';
  return raw.replace(/\/+$/, '');
}

export async function sendWeeklyDigest(userId: string): Promise<SendDigestResult> {
  try {
    if (!process.env.RESEND_API_KEY) {
      return { success: false, error: 'Missing RESEND_API_KEY' };
    }

    const data = await generateDigestData(userId);
    if (!data) return { success: true };

    const appUrl = getAppUrl();
    const token = generateDigestEmailToken(userId);

    const clickBase = `${appUrl}/api/email/click?token=${encodeURIComponent(token)}`;
    const unsubscribeDirect = `${appUrl}/api/email/unsubscribe?token=${encodeURIComponent(token)}`;

    const { subject, html } = buildWeeklyDigestEmail(data, {
      viewForecastUrl: `${clickBase}&link=view_forecast`,
      managePreferencesUrl: `${clickBase}&link=manage_preferences`,
      unsubscribeUrl: `${clickBase}&link=unsubscribe`,
      trackingPixelUrl: `${appUrl}/api/email/track?token=${encodeURIComponent(token)}`,
    });

    const from =
      process.env.RESEND_FROM_EMAIL?.trim() || 'Cash Flow Forecaster <onboarding@resend.dev>';

    const res = await resend.emails.send({
      from,
      to: data.user.email,
      subject,
      html,
      headers: {
        // Most clients respect this for one-click unsubscribe flows (where supported)
        'List-Unsubscribe': `<${unsubscribeDirect}>`,
      },
    });

    if (res.error) {
      // eslint-disable-next-line no-console
      console.error('Resend weekly digest error:', res.error);
      return { success: false, error: 'Failed to send digest email.' };
    }

    const messageId = (res.data as any)?.id as string | undefined;

    const supabase = createAdminClient();
    const sentAt = new Date().toISOString();
    const { error: upsertErr } = await supabase
      .from('user_settings')
      .upsert(
        {
          user_id: userId,
          last_digest_sent_at: sentAt,
        },
        { onConflict: 'user_id' }
      );

    if (upsertErr) {
      // eslint-disable-next-line no-console
      console.error('Failed updating last_digest_sent_at:', upsertErr);
    }

    await captureServerEvent('digest_sent', {
      distinctId: userId,
      properties: {
        user_id: userId,
        has_alerts:
          data.alerts.hasLowBalance || data.alerts.hasOverdraftRisk || data.alerts.hasBillCollisions,
        bill_count: data.upcomingBills.length,
        income_count: data.upcomingIncome.length,
      },
    });

    return { success: true, messageId };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('sendWeeklyDigest failed:', e);
    return { success: false, error: 'Failed to send weekly digest.' };
  }
}


