import 'server-only';

import { resend } from '@/lib/email/resend';
import { buildWelcomeEmail } from '@/lib/email/templates/welcome-email';
import { createAdminClient } from '@/lib/supabase/admin';
import { captureServerEvent } from '@/lib/posthog/server';

interface SendWelcomeResult {
  success: boolean;
  error?: string;
  messageId?: string;
  alreadySent?: boolean;
}

export async function sendWelcomeEmail(userId: string): Promise<SendWelcomeResult> {
  try {
    if (!process.env.RESEND_API_KEY) {
      return { success: false, error: 'Missing RESEND_API_KEY' };
    }

    const supabase = createAdminClient();

    // Get user data
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);

    if (userError || !userData.user) {
      return { success: false, error: 'User not found' };
    }

    const userEmail = userData.user.email;
    if (!userEmail) {
      return { success: false, error: 'User has no email' };
    }

    // Check if welcome email was already sent
    const { data: settings } = await supabase
      .from('user_settings')
      .select('welcome_email_sent_at')
      .eq('user_id', userId)
      .single();

    if (settings?.welcome_email_sent_at) {
      return { success: true, alreadySent: true };
    }

    // Extract name from user metadata if available
    const userName = userData.user.user_metadata?.full_name ||
                     userData.user.user_metadata?.name ||
                     undefined;

    // Build and send the email
    const { subject, html } = buildWelcomeEmail({
      userEmail,
      userName,
    });

    const from = process.env.RESEND_FROM_EMAIL?.trim() ||
                 'Omar from Cash Flow Forecaster <notifications@cashflowforecaster.io>';

    const res = await resend.emails.send({
      from,
      to: userEmail,
      subject,
      html,
      replyTo: 'info@cashflowforecaster.io',
    });

    if (res.error) {
      console.error('Resend welcome email error:', res.error);
      return { success: false, error: 'Failed to send welcome email.' };
    }

    const messageId = (res.data as { id?: string })?.id;

    // Record that welcome email was sent
    const sentAt = new Date().toISOString();
    const { error: upsertErr } = await supabase
      .from('user_settings')
      .upsert(
        {
          user_id: userId,
          welcome_email_sent_at: sentAt,
        },
        { onConflict: 'user_id' }
      );

    if (upsertErr) {
      console.error('Failed updating welcome_email_sent_at:', upsertErr);
    }

    // Track event
    await captureServerEvent('welcome_email_sent', {
      distinctId: userId,
      properties: {
        user_id: userId,
        user_email: userEmail,
      },
    });

    return { success: true, messageId };
  } catch (e) {
    console.error('sendWelcomeEmail failed:', e);
    return { success: false, error: 'Failed to send welcome email.' };
  }
}
