import 'server-only';
import { formatCurrency, formatDateOnly } from '@/lib/utils/format';

export type InvoiceEmailTemplateData = {
  invoice_number: string;
  amount: number;
  due_date: string; // YYYY-MM-DD
  client_name?: string | null;
  sender_name: string;
  note?: string | null;
};

function escapeHtml(input: string) {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function buildInvoiceEmail({
  invoice_number,
  amount,
  due_date,
  client_name,
  sender_name,
  note,
}: InvoiceEmailTemplateData): { subject: string; html: string } {
  const safeInvoiceNumber = escapeHtml(invoice_number);
  const safeSenderName = escapeHtml(sender_name);
  const safeClientName = client_name ? escapeHtml(client_name) : null;
  const message = (note?.trim() || 'Please find your invoice attached.').trim();
  const safeMessage = escapeHtml(message);

  const subject = `Invoice ${invoice_number} from ${sender_name}`;

  const amountFormatted = formatCurrency(amount);
  const dueDateFormatted = formatDateOnly(due_date);

  const previewText = `Invoice ${invoice_number} for ${amountFormatted} due ${dueDateFormatted}`;

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
                  <div style="margin-top:6px;font-size:20px;font-weight:700;color:#18181b;">You've received an invoice</div>
                  ${
                    safeClientName
                      ? `<div style="margin-top:4px;font-size:14px;color:#3f3f46;">Hi ${safeClientName},</div>`
                      : ''
                  }
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:0 24px 20px 24px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;background-color:#fafafa;border:1px solid #f4f4f5;border-radius:10px;">
                  <tr>
                    <td style="padding:18px;">
                      <div style="font-family:Inter,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
                        <div style="font-size:13px;color:#52525b;">Invoice</div>
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
              <td style="padding:0 24px 24px 24px;">
                <div style="font-family:Inter,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
                  <div style="font-size:13px;color:#52525b;font-weight:600;">Message from ${safeSenderName}</div>
                  <div style="margin-top:8px;font-size:14px;line-height:20px;color:#18181b;white-space:pre-wrap;">${safeMessage}</div>
                  <div style="margin-top:14px;font-size:13px;color:#52525b;">Your invoice PDF is attached to this email.</div>
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 24px;border-top:1px solid #f4f4f5;background-color:#ffffff;">
                <div style="font-family:Inter,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:12px;color:#71717a;">
                  This invoice was sent via Cash Flow Forecaster.
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
