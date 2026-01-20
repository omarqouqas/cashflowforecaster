import 'server-only';

export type LowBalanceAlertData = {
  userEmail: string;
  userName?: string;
  projectedLowDate: string; // Formatted date string
  projectedLowAmount: number;
  currentBalance: number;
  safetyBuffer: number;
  daysUntilLow: number;
  currency: string;
  unsubscribeUrl: string;
};

function escapeHtml(input: string) {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function buildLowBalanceAlertEmail(data: LowBalanceAlertData): { subject: string; html: string } {
  const greeting = data.userName ? `Hi ${escapeHtml(data.userName)}` : 'Hey';
  const isOverdraft = data.projectedLowAmount < 0;

  const urgencyText = data.daysUntilLow <= 1
    ? 'tomorrow'
    : data.daysUntilLow <= 3
      ? `in ${data.daysUntilLow} days`
      : `on ${data.projectedLowDate}`;

  const subject = isOverdraft
    ? `Overdraft risk detected - ${urgencyText}`
    : `Low balance alert - ${urgencyText}`;

  const previewText = isOverdraft
    ? `Your balance is projected to go negative ${urgencyText}. Take action now.`
    : `Your balance is projected to drop to ${formatCurrency(data.projectedLowAmount, data.currency)} ${urgencyText}.`;

  const alertColor = isOverdraft ? '#dc2626' : '#d97706'; // red-600 or amber-600
  const alertBgColor = isOverdraft ? '#fef2f2' : '#fffbeb'; // red-50 or amber-50
  const alertBorderColor = isOverdraft ? '#fecaca' : '#fde68a'; // red-200 or amber-200

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

            <!-- Alert Banner -->
            <tr>
              <td style="padding:0;">
                <div style="background-color:${alertColor};padding:16px 24px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <div style="font-family:Inter,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.05em;">
                          ${isOverdraft ? 'OVERDRAFT RISK' : 'LOW BALANCE ALERT'}
                        </div>
                      </td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>

            <!-- Greeting -->
            <tr>
              <td style="padding:24px 24px 16px 24px;">
                <div style="font-family:Inter,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:24px;color:#18181b;">
                  ${greeting},
                </div>
              </td>
            </tr>

            <!-- Main Message -->
            <tr>
              <td style="padding:0 24px 20px 24px;">
                <div style="font-family:Inter,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:24px;color:#3f3f46;">
                  ${isOverdraft
                    ? `Heads up: Your balance is projected to <strong style="color:${alertColor};">go negative</strong> ${urgencyText}.`
                    : `Heads up: Your balance is projected to <strong style="color:${alertColor};">drop below your safety buffer</strong> ${urgencyText}.`
                  }
                </div>
              </td>
            </tr>

            <!-- Alert Box -->
            <tr>
              <td style="padding:0 24px 24px 24px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;background-color:${alertBgColor};border:1px solid ${alertBorderColor};border-radius:10px;">
                  <tr>
                    <td style="padding:20px;">
                      <div style="font-family:Inter,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">

                        <!-- Projected Low -->
                        <div style="margin-bottom:16px;">
                          <div style="font-size:12px;color:#71717a;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">Projected Low</div>
                          <div style="font-size:28px;font-weight:700;color:${alertColor};">${formatCurrency(data.projectedLowAmount, data.currency)}</div>
                          <div style="font-size:14px;color:#52525b;margin-top:2px;">on ${escapeHtml(data.projectedLowDate)}</div>
                        </div>

                        <!-- Divider -->
                        <div style="border-top:1px solid ${alertBorderColor};margin:16px 0;"></div>

                        <!-- Current Balance -->
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="width:50%;">
                              <div style="font-size:12px;color:#71717a;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">Current Balance</div>
                              <div style="font-size:18px;font-weight:600;color:#18181b;">${formatCurrency(data.currentBalance, data.currency)}</div>
                            </td>
                            <td style="width:50%;">
                              <div style="font-size:12px;color:#71717a;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">Safety Buffer</div>
                              <div style="font-size:18px;font-weight:600;color:#18181b;">${formatCurrency(data.safetyBuffer, data.currency)}</div>
                            </td>
                          </tr>
                        </table>

                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- What You Can Do -->
            <tr>
              <td style="padding:0 24px 20px 24px;">
                <div style="font-family:Inter,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:22px;color:#52525b;">
                  <strong style="color:#18181b;">What you can do:</strong>
                  <ul style="margin:8px 0 0 0;padding-left:20px;">
                    <li style="margin-bottom:4px;">Review your upcoming bills and see if any can be rescheduled</li>
                    <li style="margin-bottom:4px;">Follow up on outstanding invoices</li>
                    <li style="margin-bottom:4px;">Use the "Can I Afford It?" tool to plan larger purchases</li>
                  </ul>
                </div>
              </td>
            </tr>

            <!-- CTA Button -->
            <tr>
              <td style="padding:0 24px 24px 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td bgcolor="#18181b" style="border-radius:10px;">
                      <a href="https://cashflowforecaster.io/dashboard/calendar?utm_source=low_balance_alert&utm_medium=email" target="_blank" rel="noreferrer"
                        style="display:inline-block;padding:14px 24px;font-family:Inter,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:10px;">
                        View Your Forecast
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:16px 24px;border-top:1px solid #f4f4f5;background-color:#fafafa;">
                <div style="font-family:Inter,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:12px;color:#71717a;">
                  <p style="margin:0 0 8px 0;">
                    You're receiving this because you have low balance alerts enabled.
                    <a href="${escapeHtml(data.unsubscribeUrl)}" style="color:#0f766e;text-decoration:underline;">Manage alert settings</a>
                  </p>
                  <p style="margin:0;">
                    <a href="https://cashflowforecaster.io" style="color:#0f766e;text-decoration:none;">Cash Flow Forecaster</a> — See your money ahead of time
                  </p>
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
