import 'server-only';

export type WelcomeEmailData = {
  userEmail: string;
  userName?: string;
};

function escapeHtml(input: string) {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function buildWelcomeEmail(data: WelcomeEmailData): { subject: string; html: string } {
  const greeting = data.userName ? `Hi ${escapeHtml(data.userName)}` : 'Hey';

  const subject = 'Welcome to Cash Flow Forecaster';
  const previewText = "You're in! Here's how to get started with your cash flow forecast.";

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
            <!-- Header -->
            <tr>
              <td style="padding:24px 24px 16px 24px;background-color:#ffffff;">
                <div style="font-family:Inter,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
                  <div style="font-size:12px;color:#71717a;letter-spacing:0.06em;">CASH FLOW FORECASTER</div>
                  <div style="margin-top:8px;font-size:24px;font-weight:700;color:#18181b;">Welcome aboard!</div>
                </div>
              </td>
            </tr>

            <!-- Greeting -->
            <tr>
              <td style="padding:0 24px 16px 24px;">
                <div style="font-family:Inter,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:24px;color:#18181b;">
                  ${greeting},
                </div>
              </td>
            </tr>

            <!-- Main content -->
            <tr>
              <td style="padding:0 24px 20px 24px;">
                <div style="font-family:Inter,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:24px;color:#3f3f46;">
                  Thanks for signing up for Cash Flow Forecaster. I built this to help freelancers and small business owners see their money ahead of time — so you're never caught off guard by a bill.
                </div>
              </td>
            </tr>

            <!-- Getting started section -->
            <tr>
              <td style="padding:0 24px 20px 24px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;background-color:#f0fdfa;border:1px solid #ccfbf1;border-radius:10px;">
                  <tr>
                    <td style="padding:20px;">
                      <div style="font-family:Inter,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
                        <div style="font-size:16px;font-weight:700;color:#0f766e;margin-bottom:12px;">Get started in 3 minutes:</div>

                        <div style="margin-bottom:12px;">
                          <div style="font-size:14px;color:#18181b;margin-bottom:4px;">
                            <span style="display:inline-block;width:24px;height:24px;background:#0f766e;color:#ffffff;border-radius:50%;text-align:center;line-height:24px;font-weight:700;font-size:12px;margin-right:8px;">1</span>
                            <strong>Add your accounts</strong>
                          </div>
                          <div style="font-size:13px;color:#52525b;margin-left:32px;">Enter your checking account balance</div>
                        </div>

                        <div style="margin-bottom:12px;">
                          <div style="font-size:14px;color:#18181b;margin-bottom:4px;">
                            <span style="display:inline-block;width:24px;height:24px;background:#0f766e;color:#ffffff;border-radius:50%;text-align:center;line-height:24px;font-weight:700;font-size:12px;margin-right:8px;">2</span>
                            <strong>Add your bills</strong>
                          </div>
                          <div style="font-size:13px;color:#52525b;margin-left:32px;">Rent, subscriptions, utilities, etc.</div>
                        </div>

                        <div>
                          <div style="font-size:14px;color:#18181b;margin-bottom:4px;">
                            <span style="display:inline-block;width:24px;height:24px;background:#0f766e;color:#ffffff;border-radius:50%;text-align:center;line-height:24px;font-weight:700;font-size:12px;margin-right:8px;">3</span>
                            <strong>See your forecast</strong>
                          </div>
                          <div style="font-size:13px;color:#52525b;margin-left:32px;">View your projected balance up to 365 days ahead</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- CTA Button -->
            <tr>
              <td style="padding:0 24px 24px 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td bgcolor="#0f766e" style="border-radius:10px;">
                      <a href="https://cashflowforecaster.io/dashboard" target="_blank" rel="noreferrer"
                        style="display:inline-block;padding:14px 24px;font-family:Inter,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:10px;">
                        Go to your dashboard
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Personal note -->
            <tr>
              <td style="padding:0 24px 24px 24px;">
                <div style="font-family:Inter,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:22px;color:#52525b;font-style:italic;border-left:3px solid #0f766e;padding-left:16px;">
                  I'm a solo founder, and I read every reply. If you have questions, feedback, or run into any issues — just hit reply.
                </div>
              </td>
            </tr>

            <!-- Sign off -->
            <tr>
              <td style="padding:0 24px 24px 24px;">
                <div style="font-family:Inter,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:22px;color:#18181b;">
                  Cheers,<br />
                  <span style="font-weight:700;">Omar</span>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:16px 24px;border-top:1px solid #f4f4f5;background-color:#fafafa;">
                <div style="font-family:Inter,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:12px;color:#71717a;">
                  <a href="https://cashflowforecaster.io" style="color:#0f766e;text-decoration:none;">Cash Flow Forecaster</a> — See your money ahead of time
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
