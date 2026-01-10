import { NextResponse } from 'next/server';
import { z } from 'zod';
import { resend } from '@/lib/email/resend';

export const runtime = 'nodejs';

const requestSchema = z.object({
  email: z.string().email(),
  payload: z.record(z.any()).optional(),
});

function safeText(v: unknown, max = 200): string {
  const s = typeof v === 'string' ? v : '';
  return s.length > max ? s.slice(0, max) + '…' : s;
}

function formatDateOnly(dateOnly: unknown): string {
  const s = typeof dateOnly === 'string' ? dateOnly : '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return safeText(String(dateOnly ?? ''), 32) || '';
  try {
    const d = new Date(`${s}T00:00:00`);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return s;
  }
}

function formatCurrency(amount: unknown): string {
  const n = typeof amount === 'number' ? amount : Number(amount);
  if (!Number.isFinite(n)) return '$0.00';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Missing RESEND_API_KEY' }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { email, payload } = parsed.data;
  const tool = ((payload as any)?.tool ?? 'can-i-afford-it') as string;
  const result = (payload as any)?.result ?? {};

  const from = process.env.RESEND_FROM_EMAIL?.trim() || 'Cash Flow Forecaster <onboarding@resend.dev>';
  const signupUrl = 'https://cashflowforecaster.io/auth/signup';
  let subject = 'Your results from Cash Flow Forecaster';
  let toolUrl = 'https://cashflowforecaster.io/tools';
  let html = '';

  if (tool === 'freelance-rate-calculator') {
    subject = 'Your Freelance Rate Calculator results';
    toolUrl = 'https://cashflowforecaster.io/tools/freelance-rate-calculator';

    const minimumHourlyRate = (result as any)?.minimumHourlyRate;
    const suggestedHourlyRate = (result as any)?.suggestedHourlyRate;
    const premiumHourlyRate = (result as any)?.premiumHourlyRate;
    const monthlyRevenueNeeded = (result as any)?.monthlyRevenueNeeded;
    const annualRevenueNeeded = (result as any)?.annualRevenueNeeded;
    const annualBillableHours = (result as any)?.annualBillableHours;
    const workingWeeks = (result as any)?.workingWeeks;
    const annualExpenses = (result as any)?.annualExpenses;
    const dailyRate = (result as any)?.dailyRate;
    const tenHourProject = (result as any)?.tenHourProject;

    html = `
      <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; background:#09090b; color:#e4e4e7; padding:24px; border-radius:16px;">
        <div style="max-width:640px; margin:0 auto;">
          <h1 style="margin:0 0 8px; font-size:22px; line-height:1.2; color:#ffffff;">
            Freelance Rate Calculator
          </h1>
          <p style="margin:0 0 16px; color:#a1a1aa;">
            Here are your calculated hourly rates (minimum, suggested, and premium).
          </p>

          <div style="border:1px solid #27272a; background:rgba(24,24,27,0.7); border-radius:14px; padding:16px; margin:16px 0;">
            <table style="width:100%; border-collapse:collapse; font-size:14px;">
              <tr>
                <td style="padding:6px 0; color:#a1a1aa;">Suggested hourly rate</td>
                <td style="padding:6px 0; text-align:right; color:#ffffff;"><strong>${formatCurrency(suggestedHourlyRate)}</strong></td>
              </tr>
              <tr>
                <td style="padding:6px 0; color:#a1a1aa;">Minimum hourly rate</td>
                <td style="padding:6px 0; text-align:right; color:#ffffff;">${formatCurrency(minimumHourlyRate)}</td>
              </tr>
              <tr>
                <td style="padding:6px 0; color:#a1a1aa;">Premium hourly rate</td>
                <td style="padding:6px 0; text-align:right; color:#ffffff;">${formatCurrency(premiumHourlyRate)}</td>
              </tr>
            </table>
          </div>

          <div style="border:1px solid #27272a; border-radius:14px; padding:16px; margin:16px 0;">
            <p style="margin:0 0 10px; color:#a1a1aa; font-size:13px;">Breakdown</p>
            <table style="width:100%; border-collapse:collapse; font-size:14px;">
              <tr>
                <td style="padding:6px 0; color:#a1a1aa;">Monthly revenue needed</td>
                <td style="padding:6px 0; text-align:right; color:#ffffff;">${formatCurrency(monthlyRevenueNeeded)}</td>
              </tr>
              <tr>
                <td style="padding:6px 0; color:#a1a1aa;">Annual revenue needed</td>
                <td style="padding:6px 0; text-align:right; color:#ffffff;">${formatCurrency(annualRevenueNeeded)}</td>
              </tr>
              <tr>
                <td style="padding:6px 0; color:#a1a1aa;">Annual billable hours</td>
                <td style="padding:6px 0; text-align:right; color:#ffffff;">${safeText(String(annualBillableHours ?? ''), 32)}</td>
              </tr>
              <tr>
                <td style="padding:6px 0; color:#a1a1aa;">Working weeks</td>
                <td style="padding:6px 0; text-align:right; color:#ffffff;">${safeText(String(workingWeeks ?? ''), 32)}</td>
              </tr>
              <tr>
                <td style="padding:6px 0; color:#a1a1aa;">Annual expenses</td>
                <td style="padding:6px 0; text-align:right; color:#ffffff;">${formatCurrency(annualExpenses)}</td>
              </tr>
              <tr>
                <td style="padding:6px 0; color:#a1a1aa;">Daily rate (8 hours)</td>
                <td style="padding:6px 0; text-align:right; color:#ffffff;">${formatCurrency(dailyRate)}</td>
              </tr>
              <tr>
                <td style="padding:6px 0; color:#a1a1aa;">10-hour project</td>
                <td style="padding:6px 0; text-align:right; color:#ffffff;">${formatCurrency(tenHourProject)}</td>
              </tr>
            </table>
          </div>

          <div style="margin:18px 0;">
            <a href="${signupUrl}"
               style="display:inline-block; background:#14b8a6; color:#09090b; text-decoration:none; font-weight:700; padding:12px 16px; border-radius:10px;">
              Track your cash flow (free)
            </a>
            <div style="margin-top:10px;">
              <a href="${toolUrl}" style="color:#5eead4; text-decoration:none; font-size:13px;">Re-run this tool</a>
            </div>
          </div>

          <p style="margin:0; color:#71717a; font-size:12px;">
            Disclaimer: This calculator provides estimates based on the inputs you provide. Actual rates depend on your market and positioning.
          </p>
        </div>
      </div>
    `.trim();
  } else if (tool === 'invoice-payment-predictor') {
    subject = 'Your Invoice Payment Predictor results';
    toolUrl = 'https://cashflowforecaster.io/tools/invoice-payment-predictor';

    const expectedPaymentDate = (result as any)?.expectedPaymentDate;
    const dayOfWeek = (result as any)?.dayOfWeek;
    const daysFromToday = (result as any)?.daysFromToday;
    const paymentTermsLabel = (result as any)?.paymentTermsLabel;
    const paymentTermsDays = (result as any)?.paymentTermsDays;
    const weekendAdjustmentDays = (result as any)?.weekendAdjustmentDays;
    const lateClientAdjustmentDays = (result as any)?.lateClientAdjustmentDays;
    const invoiceDate = (result as any)?.invoiceDate ?? (payload as any)?.input?.invoiceDate;
    const invoices: Array<any> = Array.isArray((payload as any)?.invoices) ? (payload as any).invoices.slice(0, 25) : [];

    const daysLabel =
      typeof daysFromToday === 'number'
        ? daysFromToday === 0
          ? 'Today'
          : daysFromToday > 0
            ? `${Math.abs(daysFromToday)} day${Math.abs(daysFromToday) === 1 ? '' : 's'} from now`
            : `${Math.abs(daysFromToday)} day${Math.abs(daysFromToday) === 1 ? '' : 's'} ago`
        : '';

    const daysTone = typeof daysFromToday === 'number' && daysFromToday < 0 ? '#fbbf24' : '#5eead4';

    html = `
      <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; background:#09090b; color:#e4e4e7; padding:24px; border-radius:16px;">
        <div style="max-width:640px; margin:0 auto;">
          <h1 style="margin:0 0 8px; font-size:22px; line-height:1.2; color:#ffffff;">
            Invoice Payment Predictor
          </h1>
          <p style="margin:0 0 16px; color:#a1a1aa;">
            Here’s your expected payment date estimate (adjusted for weekends and client behavior).
          </p>

          <div style="border:1px solid #27272a; background:rgba(24,24,27,0.7); border-radius:14px; padding:16px; margin:16px 0;">
            <p style="margin:0 0 10px; font-size:13px; color:#a1a1aa;">Expected payment date</p>
            <div style="font-size:28px; font-weight:800; color:#ffffff; letter-spacing:-0.02em;">
              ${formatDateOnly(expectedPaymentDate)}
            </div>
            <p style="margin:10px 0 0; font-size:14px; color:#a1a1aa;">
              <span style="color:${daysTone}; font-weight:700;">${safeText(daysLabel, 48)}</span>
              ${dayOfWeek ? ` • That’s a <span style="color:#ffffff; font-weight:700;">${safeText(dayOfWeek, 20)}</span>` : ''}
            </p>
          </div>

          <div style="border:1px solid #27272a; border-radius:14px; padding:16px; margin:16px 0;">
            <p style="margin:0 0 10px; color:#a1a1aa; font-size:13px;">Breakdown</p>
            <table style="width:100%; border-collapse:collapse; font-size:14px;">
              <tr>
                <td style="padding:6px 0; color:#a1a1aa;">Invoice date</td>
                <td style="padding:6px 0; text-align:right; color:#ffffff;">${formatDateOnly(invoiceDate)}</td>
              </tr>
              <tr>
                <td style="padding:6px 0; color:#a1a1aa;">${safeText(paymentTermsLabel ?? 'Payment terms', 32)}</td>
                <td style="padding:6px 0; text-align:right; color:#ffffff;">${safeText(String(paymentTermsDays ?? ''), 32)} days</td>
              </tr>
              <tr>
                <td style="padding:6px 0; color:#a1a1aa;">Weekend shift</td>
                <td style="padding:6px 0; text-align:right; color:#ffffff;">${safeText(String(weekendAdjustmentDays ?? 0), 32)} days</td>
              </tr>
              <tr>
                <td style="padding:6px 0; color:#a1a1aa;">Late client adjustment</td>
                <td style="padding:6px 0; text-align:right; color:#ffffff;">${safeText(String(lateClientAdjustmentDays ?? 0), 32)} days</td>
              </tr>
            </table>
          </div>

          ${
            invoices.length
              ? `<div style="border:1px solid #27272a; border-radius:14px; padding:16px; margin:16px 0;">
                  <p style="margin:0 0 10px; color:#a1a1aa; font-size:13px;">Multiple invoices (sorted)</p>
                  <table style="width:100%; border-collapse:collapse; font-size:13px;">
                    <tr style="color:#71717a;">
                      <td style="padding:6px 0; font-weight:600;">Client</td>
                      <td style="padding:6px 0; font-weight:600;">Invoice</td>
                      <td style="padding:6px 0; font-weight:600; text-align:right;">Expected</td>
                    </tr>
                    ${invoices
                      .map((inv) => {
                        const name = safeText(inv?.clientName || '—', 36);
                        const invDate = formatDateOnly(inv?.invoiceDate);
                        const expDate = formatDateOnly(inv?.expectedPaymentDate);
                        const amt =
                          typeof inv?.invoiceAmount === 'number' && Number.isFinite(inv.invoiceAmount)
                            ? ` <span style="color:#71717a;">(${formatCurrency(inv.invoiceAmount)})</span>`
                            : '';
                        return `<tr>
                          <td style="padding:7px 0; color:#e4e4e7;">${name}${amt}</td>
                          <td style="padding:7px 0; color:#a1a1aa;">${invDate}</td>
                          <td style="padding:7px 0; text-align:right; color:#ffffff;">${expDate}</td>
                        </tr>`;
                      })
                      .join('')}
                  </table>
                </div>`
              : ''
          }

          <div style="margin:18px 0;">
            <a href="${signupUrl}"
               style="display:inline-block; background:#14b8a6; color:#09090b; text-decoration:none; font-weight:700; padding:12px 16px; border-radius:10px;">
              See all invoices on a calendar (free)
            </a>
            <div style="margin-top:10px;">
              <a href="${toolUrl}" style="color:#5eead4; text-decoration:none; font-size:13px;">Re-run this tool</a>
            </div>
          </div>

          <p style="margin:0; color:#71717a; font-size:12px;">
            Disclaimer: This calculator provides estimates based on standard terms. Actual payment timing depends on client behavior and processing.
          </p>
        </div>
      </div>
    `.trim();
  } else {
    // Default: Can I Afford It tool (backwards compatible)
    const canAfford = !!result?.canAfford;
    const purchaseAmount = result?.purchaseAmount ?? (payload as any)?.input?.purchaseAmount;
    const currentBalance = result?.currentBalance ?? (payload as any)?.input?.currentBalance;
    const lowestBalance = result?.lowestBalance?.amount;
    const lowestDate = result?.lowestBalance?.date;
    const overdraftDays = result?.overdraftDays;

    subject = canAfford ? 'Your “Can I Afford It?” result: ✅ Yes' : 'Your “Can I Afford It?” result: ⚠️ Not safely';
    toolUrl = 'https://cashflowforecaster.io/tools/can-i-afford-it';

    const timeline: Array<any> = Array.isArray(result?.timeline) ? result.timeline.slice(0, 20) : [];

    html = `
      <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; background:#09090b; color:#e4e4e7; padding:24px; border-radius:16px;">
        <div style="max-width:640px; margin:0 auto;">
          <h1 style="margin:0 0 8px; font-size:22px; line-height:1.2; color:#ffffff;">
            Can I Afford It?
          </h1>
          <p style="margin:0 0 16px; color:#a1a1aa;">
            Here’s your quick cash flow projection result.
          </p>

          <div style="border:1px solid #27272a; background:rgba(24,24,27,0.7); border-radius:14px; padding:16px; margin:16px 0;">
            <p style="margin:0 0 10px; font-size:14px;">
              <strong style="color:${canAfford ? '#5eead4' : '#fda4af'};">
                ${canAfford ? '✅ Yes — you can afford it' : '⚠️ No — this could take you negative'}
              </strong>
            </p>
            <table style="width:100%; border-collapse:collapse; font-size:14px;">
              <tr>
                <td style="padding:6px 0; color:#a1a1aa;">Current balance</td>
                <td style="padding:6px 0; text-align:right; color:#ffffff;">${formatCurrency(currentBalance)}</td>
              </tr>
              <tr>
                <td style="padding:6px 0; color:#a1a1aa;">Purchase amount</td>
                <td style="padding:6px 0; text-align:right; color:#ffffff;">${formatCurrency(purchaseAmount)}</td>
              </tr>
              <tr>
                <td style="padding:6px 0; color:#a1a1aa;">Lowest point</td>
                <td style="padding:6px 0; text-align:right; color:#ffffff;">
                  ${formatCurrency(lowestBalance)} ${lowestDate ? `<span style="color:#71717a;">(${safeText(lowestDate, 32)})</span>` : ''}
                </td>
              </tr>
              ${
                typeof overdraftDays === 'number'
                  ? `<tr>
                      <td style="padding:6px 0; color:#a1a1aa;">Days below $0</td>
                      <td style="padding:6px 0; text-align:right; color:#ffffff;">${overdraftDays}</td>
                    </tr>`
                  : ''
              }
            </table>
          </div>

          ${
            timeline.length
              ? `<div style="border:1px solid #27272a; border-radius:14px; padding:16px; margin:16px 0;">
                  <p style="margin:0 0 10px; color:#a1a1aa; font-size:13px;">Timeline (first ${timeline.length} days)</p>
                  <table style="width:100%; border-collapse:collapse; font-size:13px;">
                    ${timeline
                      .map((d) => {
                        const date = safeText(d?.date, 32);
                        const ending = formatCurrency(d?.endingBalance);
                        const color =
                          typeof d?.endingBalance === 'number' && d.endingBalance < 0 ? '#fda4af' : '#ffffff';
                        return `<tr>
                          <td style="padding:6px 0; color:#a1a1aa;">${date}</td>
                          <td style="padding:6px 0; text-align:right; color:${color};">${ending}</td>
                        </tr>`;
                      })
                      .join('')}
                  </table>
                </div>`
              : ''
          }

          <div style="margin:18px 0;">
            <a href="${signupUrl}"
               style="display:inline-block; background:#14b8a6; color:#09090b; text-decoration:none; font-weight:700; padding:12px 16px; border-radius:10px;">
              Get the full 60‑day forecast
            </a>
            <div style="margin-top:10px;">
              <a href="${toolUrl}" style="color:#5eead4; text-decoration:none; font-size:13px;">Re-run this tool</a>
            </div>
          </div>

          <p style="margin:0; color:#71717a; font-size:12px;">
            This is a simplified estimate using only what you entered. Cash Flow Forecaster gives you a full calendar forecast with recurring items.
          </p>
        </div>
      </div>
    `.trim();
  }

  const res = await resend.emails.send({
    from,
    to: email,
    subject,
    html,
  });

  if (res.error) {
    // eslint-disable-next-line no-console
    console.error('Resend error:', res.error);
    return NextResponse.json({ error: 'Failed to send email. Please try again.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

