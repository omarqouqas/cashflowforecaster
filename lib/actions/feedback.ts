'use server';

import { requireAuth } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { resend } from '@/lib/email/resend';
import { feedbackSchema, feedbackTypeLabels } from '@/lib/validations/feedback';
import type { CreateFeedbackInput, FeedbackType } from '@/lib/validations/feedback';

/**
 * Creates a new feedback entry in the database and sends an email notification
 */
export async function createFeedback(input: CreateFeedbackInput): Promise<{ success: boolean }> {
  const user = await requireAuth();
  const supabase = await createClient();

  // Validate input
  const parsed = feedbackSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message ?? 'Invalid feedback data');
  }

  const { type, message, page_url } = parsed.data;

  // Insert feedback into database
  const { error: insertError } = await supabase.from('feedback').insert({
    user_id: user.id,
    user_email: user.email,
    type,
    message,
    page_url: page_url ?? null,
    user_agent: input.user_agent ?? null,
    status: 'new',
  });

  if (insertError) {
    console.error('Failed to insert feedback:', insertError);
    throw new Error('Failed to submit feedback. Please try again.');
  }

  // Send email notification (fire and forget - don't block on email)
  sendFeedbackNotification({
    type,
    message,
    userEmail: user.email ?? 'Unknown',
    pageUrl: page_url,
  }).catch((err) => {
    console.error('Failed to send feedback notification email:', err);
  });

  return { success: true };
}

/**
 * Sends an email notification about new feedback
 */
async function sendFeedbackNotification({
  type,
  message,
  userEmail,
  pageUrl,
}: {
  type: FeedbackType;
  message: string;
  userEmail: string;
  pageUrl?: string;
}) {
  const typeLabel = feedbackTypeLabels[type];
  const subject = `[Feedback] ${typeLabel} from ${userEmail}`;

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #18181b; margin-bottom: 16px;">New Feedback Received</h2>
      
      <div style="background: #f4f4f5; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
        <p style="margin: 0 0 8px 0; color: #71717a; font-size: 14px;">Type</p>
        <p style="margin: 0; color: #18181b; font-size: 16px; font-weight: 500;">${typeLabel}</p>
      </div>
      
      <div style="background: #f4f4f5; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
        <p style="margin: 0 0 8px 0; color: #71717a; font-size: 14px;">From</p>
        <p style="margin: 0; color: #18181b; font-size: 16px;">
          <a href="mailto:${userEmail}" style="color: #0d9488; text-decoration: none;">${userEmail}</a>
        </p>
      </div>
      
      ${
        pageUrl
          ? `
      <div style="background: #f4f4f5; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
        <p style="margin: 0 0 8px 0; color: #71717a; font-size: 14px;">Page</p>
        <p style="margin: 0; color: #18181b; font-size: 14px; word-break: break-all;">${pageUrl}</p>
      </div>
      `
          : ''
      }
      
      <div style="background: #fafafa; border: 1px solid #e4e4e7; border-radius: 8px; padding: 16px;">
        <p style="margin: 0 0 8px 0; color: #71717a; font-size: 14px;">Message</p>
        <p style="margin: 0; color: #18181b; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
      </div>
      
      <p style="margin-top: 24px; color: #a1a1aa; font-size: 12px;">
        Cash Flow Forecaster • Feedback Notification
      </p>
    </div>
  `;

  await resend.emails.send({
    from: 'Cash Flow Forecaster <notifications@cashflowforecaster.io>',
    to: 'support@cashflowforecaster.io', // Your support email
    replyTo: userEmail,
    subject,
    html: htmlContent,
  });
}
