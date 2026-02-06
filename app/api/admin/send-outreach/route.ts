import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/email/resend';
import crypto from 'crypto';

// Simple admin protection - check for admin secret
const ADMIN_SECRET = process.env.ADMIN_SECRET;

interface OutreachEmail {
  to: string;
  subject: string;
  message: string;
  recipientName?: string;
}

/**
 * Escape HTML entities to prevent XSS
 */
function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char] || char);
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Still do the comparison to maintain constant time
    crypto.timingSafeEqual(Buffer.from(a), Buffer.from(a));
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export async function POST(request: NextRequest) {
  try {
    // Check admin authorization with timing-safe comparison
    const authHeader = request.headers.get('authorization') || '';
    const expectedAuth = `Bearer ${ADMIN_SECRET || ''}`;
    if (!ADMIN_SECRET || !secureCompare(authHeader, expectedAuth)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { emails } = body as { emails: OutreachEmail[] };

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json({ error: 'No emails provided' }, { status: 400 });
    }

    const results: { email: string; success: boolean; error?: string }[] = [];

    for (const email of emails) {
      try {
        const htmlContent = generateEmailHtml(email.message);

        await resend.emails.send({
          from: 'Omar from Cash Flow Forecaster <notifications@cashflowforecaster.io>',
          to: email.to,
          subject: email.subject,
          html: htmlContent,
          replyTo: 'info@cashflowforecaster.io',
        });

        results.push({ email: email.to, success: true });

        // Small delay between emails to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        results.push({
          email: email.to,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    return NextResponse.json({
      message: `Sent ${successful} emails, ${failed} failed`,
      results,
    });
  } catch (error) {
    console.error('Outreach email error:', error);
    return NextResponse.json(
      { error: 'Failed to send emails' },
      { status: 500 }
    );
  }
}

function generateEmailHtml(message: string): string {
  // Convert line breaks to HTML with XSS protection
  const formattedMessage = message
    .split('\n')
    .map(line => {
      const escapedLine = escapeHtml(line);
      if (line.startsWith('•')) {
        return `<li style="margin: 4px 0;">${escapeHtml(line.substring(1).trim())}</li>`;
      }
      if (line.trim() === '') {
        return '<br>';
      }
      return `<p style="margin: 0 0 12px 0;">${escapedLine}</p>`;
    })
    .join('');

  // Wrap bullet points in ul
  const htmlWithLists = formattedMessage
    .replace(/(<li.*?<\/li>)+/g, '<ul style="margin: 12px 0; padding-left: 20px;">$&</ul>');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #18181b; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="font-size: 15px;">
        ${htmlWithLists}
      </div>

      <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e4e4e7;">
        <p style="margin: 0; color: #71717a; font-size: 13px;">
          Omar<br>
          Founder, <a href="https://cashflowforecaster.io" style="color: #0d9488; text-decoration: none;">Cash Flow Forecaster</a>
        </p>
      </div>
    </body>
    </html>
  `;
}
