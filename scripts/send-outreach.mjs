/**
 * Outreach Email Script
 *
 * Run with: node scripts/send-outreach.mjs
 */

import { Resend } from 'resend';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '..', '.env.local') });

const resend = new Resend(process.env.RESEND_API_KEY);

// ============================================
// OUTREACH EMAILS TO SEND
// ============================================

const emails = [
  // NEVER STARTED
  {
    to: 'soccerrefplanet@gmail.com',
    subject: 'Quick question about Cash Flow Forecaster',
    message: `Hey,

I noticed you signed up a few days ago but haven't added any accounts yet. Just wanted to check — did you run into any issues getting started?

The setup takes about 3 minutes:
• Add your checking account balance
• Enter a few upcoming bills
• See your cash flow forecast

If you have questions or need help, just reply — I read every email.

Omar`,
  },
  {
    to: 'o.bernie@gmail.com',
    subject: 'Still interested in Cash Flow Forecaster?',
    message: `Hey,

You signed up a few weeks ago but never got started. Totally understand if life got busy or it wasn't the right fit.

If you're still looking for a simple way to see your cash flow ahead, I'd love to help you get set up. Takes 3 minutes.

Or if you tried it and something wasn't working, I'd genuinely appreciate knowing what went wrong.

Either way, no pressure.

Omar`,
  },

  // COOLING OFF - Power User
  {
    to: 'itsdanmanole@gmail.com',
    subject: 'Your 73-bill forecast is waiting',
    message: `Hey Dan,

I noticed you haven't logged in for about 10 days — just wanted to let you know your forecast is still running with all 73 bills tracked.

A few things that have improved since you last visited:
• New interactive charts with hover details
• Smart filters to view specific accounts or date ranges
• Polished dark theme (easier on the eyes)

Your cash flow data is all still there. Just wanted to make sure you knew.

Omar

P.S. — If there's anything that would make the app more useful for you, I'm all ears.`,
  },

  // COOLING OFF - Good engagement
  {
    to: 'schroeder.crystal@gmail.com',
    subject: 'Your cash flow forecast is ready',
    message: `Hey Crystal,

You set up 10 bills when you signed up — your forecast should be showing some useful projections by now.

Haven't seen you log in recently. Did you run into any issues, or was something missing that you needed?

Would love to hear your feedback either way.

Omar`,
  },

  // COOLING OFF - Minimal setup
  {
    to: 'satwantsinghbansi90@gmail.com',
    subject: 'Quick tip to get more from Cash Flow Forecaster',
    message: `Hey,

I noticed you added one bill when you signed up. The forecast gets a lot more useful once you add a few more recurring expenses (rent, subscriptions, utilities, etc.).

Takes about 2 minutes to add 5-6 more, and then you'll see a much clearer picture of your next 60 days.

Let me know if you need any help.

Omar`,
  },

  // INACTIVE
  {
    to: 'joshaaronlevy@gmail.com',
    subject: 'Your Cash Flow Forecaster account',
    message: `Hey Josh,

It's been a few weeks since you logged in. Just checking — is there anything I can help with, or did the app not quite fit what you needed?

Your data is still there if you want to pick up where you left off. We've also added some new features since December:
• 365-day forecasts (up from 60)
• Interactive balance charts
• Smart filtering

No pressure either way. Just wanted to reach out.

Omar`,
  },
];

// ============================================
// EMAIL SENDING LOGIC
// ============================================

function generateEmailHtml(message) {
  const lines = message.split('\n');
  let html = '';
  let inList = false;

  for (const line of lines) {
    if (line.startsWith('•')) {
      if (!inList) {
        html += '<ul style="margin: 12px 0; padding-left: 20px;">';
        inList = true;
      }
      html += `<li style="margin: 4px 0; color: #18181b;">${line.substring(1).trim()}</li>`;
    } else {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      if (line.trim() === '') {
        html += '<br>';
      } else if (line.startsWith('P.S.')) {
        html += `<p style="margin: 16px 0 0 0; color: #71717a; font-style: italic;">${line}</p>`;
      } else {
        html += `<p style="margin: 0 0 12px 0; color: #18181b;">${line}</p>`;
      }
    }
  }

  if (inList) {
    html += '</ul>';
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
      <div style="font-size: 15px;">
        ${html}
      </div>

      <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e4e4e7;">
        <p style="margin: 0; color: #71717a; font-size: 13px;">
          Omar Qouqas<br>
          Founder, <a href="https://cashflowforecaster.io" style="color: #0d9488; text-decoration: none;">Cash Flow Forecaster</a>
        </p>
      </div>
    </body>
    </html>
  `;
}

async function sendEmails() {
  console.log('🚀 Starting outreach email campaign...\n');
  console.log(`📧 ${emails.length} emails to send\n`);

  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY not found in environment variables');
    console.log('   Make sure .env.local exists and has RESEND_API_KEY set');
    process.exit(1);
  }

  console.log('✅ RESEND_API_KEY found\n');

  const results = [];

  for (const email of emails) {
    try {
      console.log(`📤 Sending to ${email.to}...`);
      console.log(`   Subject: "${email.subject}"`);

      const { data, error } = await resend.emails.send({
        from: 'Omar from Cash Flow Forecaster <notifications@cashflowforecaster.io>',
        to: email.to,
        subject: email.subject,
        html: generateEmailHtml(email.message),
        replyTo: 'info@cashflowforecaster.io',
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log(`   ✅ Sent! (ID: ${data?.id})\n`);
      results.push({ email: email.to, success: true });

      // Wait 1 second between emails to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.log(`   ❌ Failed: ${errorMessage}\n`);
      results.push({ email: email.to, success: false, error: errorMessage });
    }
  }

  // Summary
  console.log('========================================');
  console.log('📊 SUMMARY');
  console.log('========================================');
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);

  if (failed > 0) {
    console.log('\nFailed emails:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.email}: ${r.error}`);
    });
  }

  console.log('\n🎉 Done!');
}

// Run the script
sendEmails().catch(console.error);
