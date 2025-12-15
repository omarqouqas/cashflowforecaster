import 'server-only';
import { formatCurrency } from '@/lib/utils/format';

export type ReminderEmailTemplateData = {
  clientName: string;
  invoiceNumber: string;
  amount: number;
  dueDate: Date;
  invoiceUrl: string;
  senderName: string;
};

type ReminderKind = 'friendly' | 'firm' | 'final';

function escapeHtml(input: string) {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatDateForEmail(date: Date): string {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return 'Invalid date';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function buildReminderEmail(
  kind: ReminderKind,
  { clientName, invoiceNumber, amount, dueDate, invoiceUrl, senderName }: ReminderEmailTemplateData
): { subject: string; html: string } {
  const safeClientName = escapeHtml(clientName);
  const safeInvoiceNumber = escapeHtml(invoiceNumber);
  const safeSenderName = escapeHtml(senderName);
  const safeInvoiceUrl = escapeHtml(invoiceUrl.trim());

  const amountFormatted = formatCurrency(amount);
  const dueDateFormatted = formatDateForEmail(dueDate);

  const heading =
    kind === 'friendly'
      ? "Payment reminder — just checking in"
      : kind === 'firm'
        ? 'Payment reminder — action requested'
        : 'Final reminder — payment overdue';

  const intro =
    kind === 'friendly'
      ? `I hope you're doing well. I’m just checking in regarding the invoice below, which is now a few days overdue.`
      : kind === 'firm'
        ? `This is a reminder that the invoice below is overdue. Please arrange payment as soon as possible.`
        : `This is a final reminder that the invoice below remains unpaid. Please take care of this immediately.`;

  const nextSteps =
    kind === 'final'
      ? `If payment isn’t received shortly, I may need to consider next steps (for example pausing work, applying late fees if applicable, or using a collections process) in line with our agreement.`
      : '';

  const subject =
    kind === 'friendly'
      ? `Friendly reminder: Invoice ${invoiceNumber} is overdue`
      : kind === 'firm'
        ? `Payment due: Invoice ${invoiceNumber} (${amountFormatted})`
        : `Final notice: Invoice ${invoiceNumber} (${amountFormatted})`;

  const previewText =
    kind === 'friendly'
      ? `Quick reminder: Invoice ${invoiceNumber} for ${amountFormatted} was due ${dueDateFormatted}`
      : kind === 'firm'
        ? `Invoice ${invoiceNumber} for ${amountFormatted} is overdue (due ${dueDateFormatted})`
        : `Final reminder: Invoice ${invoiceNumber} for ${amountFormatted} overdue since ${dueDateFormatted}`;

  const ctaLabel =
    kind === 'friendly' ? 'View invoice' : kind === 'firm' ? 'Review & pay invoice' : 'Pay invoice now';

  const badgeColor = kind === 'friendly' ? '#0f766e' : kind === 'firm' ? '#b45309' : '#b91c1c';

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f4f5;">
    <!-- Preheader (hidden) -->
    <div style="display:none;font-size:1px;color:#f4f4f5;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
      ${escapeHtml(previewText)}
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background-color:#ffffff;border:1px solid #e4e4e7;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:20px 24px;background-color:#ffffff;">
                <div style="font-family:Inter,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
                  <div style="font-size:12px;color:#71717a;letter-spacing:0.06em;">CASH FLOW FORECASTER</div>
                  <div style="margin-top:6px;font-size:20px;font-weight:700;color:#18181b;">${escapeHtml(
                    heading
                  )}</div>
                  <div style="margin-top:4px;font-size:14px;color:#3f3f46;">Hi ${safeClientName},</div>
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:0 24px 16px 24px;">
                <div style="font-family:Inter,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:20px;color:#18181b;">
                  ${escapeHtml(intro)}
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:0 24px 20px 24px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;background-color:#fafafa;border:1px solid #f4f4f5;border-radius:10px;">
                  <tr>
                    <td style="padding:18px;">
                      <div style="font-family:Inter,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
                        <div style="display:inline-block;padding:6px 10px;border-radius:9999px;background:${badgeColor};color:#ffffff;font-size:12px;font-weight:700;letter-spacing:0.02em;">
                          ${escapeHtml(kind.toUpperCase())}
                        </div>

                        <div style="margin-top:14px;font-size:13px;color:#52525b;">Invoice</div>
                        <div style="margin-top:2px;font-size:15px;font-weight:600;color:#18181b;">#${safeInvoiceNumber}</div>

                        <div style="margin-top:14px;font-size:13px;color:#52525b;">Amount due</div>
                        <div style="margin-top:2px;font-size:32px;font-weight:800;color:#0f766e;letter-spacing:-0.02em;">${escapeHtml(
                          amountFormatted
                        )}</div>

                        <div style="margin-top:14px;font-size:13px;color:#52525b;">Due date</div>
                        <div style="margin-top:2px;font-size:15px;font-weight:600;color:#18181b;">${escapeHtml(
                          dueDateFormatted
                        )}</div>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:0 24px 18px 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td bgcolor="#0f766e" style="border-radius:10px;">
                      <a href="${safeInvoiceUrl}" target="_blank" rel="noreferrer"
                        style="display:inline-block;padding:12px 16px;font-family:Inter,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:10px;">
                        ${escapeHtml(ctaLabel)}
                      </a>
                    </td>
                  </tr>
                </table>
                <div style="margin-top:10px;font-family:Inter,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:12px;color:#71717a;">
                  If the button doesn’t work, copy and paste this link:
                  <div style="margin-top:6px;word-break:break-all;">
                    <a href="${safeInvoiceUrl}" target="_blank" rel="noreferrer" style="color:#0f766e;text-decoration:underline;">
                      ${safeInvoiceUrl}
                    </a>
                  </div>
                </div>
              </td>
            </tr>

            ${
              nextSteps
                ? `<tr>
              <td style="padding:0 24px 18px 24px;">
                <div style="font-family:Inter,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:13px;line-height:19px;color:#3f3f46;">
                  ${escapeHtml(nextSteps)}
                </div>
              </td>
            </tr>`
                : ''
            }

            <tr>
              <td style="padding:0 24px 24px 24px;">
                <div style="font-family:Inter,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:20px;color:#18181b;">
                  Thank you,<br />
                  <span style="font-weight:700;">${safeSenderName}</span>
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 24px;border-top:1px solid #f4f4f5;background-color:#ffffff;">
                <div style="font-family:Inter,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:12px;color:#71717a;">
                  This reminder was sent via Cash Flow Forecaster.
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, html };
}

export function buildFriendlyReminderEmail(
  data: ReminderEmailTemplateData
): { subject: string; html: string } {
  return buildReminderEmail('friendly', data);
}

export function buildFirmReminderEmail(
  data: ReminderEmailTemplateData
): { subject: string; html: string } {
  return buildReminderEmail('firm', data);
}

export function buildFinalReminderEmail(
  data: ReminderEmailTemplateData
): { subject: string; html: string } {
  return buildReminderEmail('final', data);
}


