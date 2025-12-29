import 'server-only';

import { formatCurrency } from '@/lib/utils/format';
import type { DigestData } from '@/lib/email/generate-digest-data';

type WeeklyDigestEmailLinks = {
  viewForecastUrl: string;
  managePreferencesUrl: string;
  unsubscribeUrl: string;
  trackingPixelUrl?: string;
};

function escapeHtml(input: string) {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatDateForEmail(date: Date, timezone?: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }
}

function truncate(input: string, max: number) {
  const s = (input || '').trim();
  if (s.length <= max) return s;
  return `${s.slice(0, Math.max(0, max - 1)).trimEnd()}…`;
}

function deriveNameFromEmail(email: string): string | null {
  const raw = (email || '').trim();
  const local = raw.split('@')[0] || '';
  const cleaned = local.replace(/[^a-zA-Z0-9._-]/g, '');
  const firstPart = cleaned.split(/[._-]+/).filter(Boolean)[0];
  if (!firstPart) return null;
  return firstPart.charAt(0).toUpperCase() + firstPart.slice(1).toLowerCase();
}

export function buildWeeklyDigestEmail(
  data: DigestData,
  links: WeeklyDigestEmailLinks
): { subject: string; html: string } {
  const tz = data.timezone ?? undefined;
  const name = (data.user.name || '').trim();
  const fallbackName = deriveNameFromEmail(data.user.email) || 'there';
  const greetingName = escapeHtml((name ? name.split(' ')[0] || name : fallbackName) || 'there');

  const currency = data.currency || 'USD';
  const subject = `Your weekly cash flow digest`;

  const weekStart = (() => {
    try {
      return new Intl.DateTimeFormat('en-US', { timeZone: tz, month: 'short', day: 'numeric' }).format(
        data.weekRange.start
      );
    } catch {
      return data.weekRange.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  })();
  const weekEnd = (() => {
    try {
      return new Intl.DateTimeFormat('en-US', { timeZone: tz, month: 'short', day: 'numeric' }).format(
        data.weekRange.end
      );
    } catch {
      return data.weekRange.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  })();

  const previewText = `Week of ${weekStart}–${weekEnd}: ${formatCurrency(data.summary.netChange, currency)} net change`;

  const incomeStr = escapeHtml(formatCurrency(data.summary.totalIncome, currency));
  const billsStr = escapeHtml(formatCurrency(-Math.abs(data.summary.totalBills), currency));
  const netStr = escapeHtml(formatCurrency(data.summary.netChange, currency));

  const lowestBalanceStr = escapeHtml(formatCurrency(data.summary.lowestBalance, currency));
  const lowestBalanceDateStr = escapeHtml(formatDateForEmail(data.summary.lowestBalanceDate, tz));

  const hasAlerts =
    data.alerts.hasLowBalance || data.alerts.hasOverdraftRisk || data.alerts.hasBillCollisions;

  const safeViewUrl = escapeHtml(links.viewForecastUrl.trim());
  const safeManageUrl = escapeHtml(links.managePreferencesUrl.trim());
  const safeUnsubUrl = escapeHtml(links.unsubscribeUrl.trim());
  const safePixelUrl = links.trackingPixelUrl ? escapeHtml(links.trackingPixelUrl.trim()) : null;

  const billsRows =
    data.upcomingBills.length === 0
      ? `<tr><td style="padding:12px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:16px;line-height:24px;color:#a1a1aa;">No bills due this week 🎉</td></tr>`
      : data.upcomingBills
          .map((b) => {
            const dateStr = escapeHtml(formatDateForEmail(b.date, tz));
            const nameStr = escapeHtml(truncate(b.name, 28));
            const amtStr = escapeHtml(formatCurrency(-Math.abs(b.amount), currency));
            return `<tr>
  <td style="padding:10px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:16px;line-height:22px;color:#e4e4e7;">
    <span style="color:#a1a1aa;">${dateStr}</span>
    <span style="display:inline-block;margin-left:10px;max-width:320px;vertical-align:top;">${nameStr}</span>
    <span style="float:right;color:#fca5a5;font-variant-numeric:tabular-nums;">${amtStr}</span>
  </td>
</tr>`;
          })
          .join('');

  const incomeRows =
    data.upcomingIncome.length === 0
      ? `<tr><td style="padding:12px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:16px;line-height:24px;color:#a1a1aa;">No income expected this week</td></tr>`
      : data.upcomingIncome
          .map((i) => {
            const dateStr = escapeHtml(formatDateForEmail(i.date, tz));
            const nameStr = escapeHtml(truncate(i.name, 28));
            const amtStr = escapeHtml(formatCurrency(Math.abs(i.amount), currency));
            return `<tr>
  <td style="padding:10px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:16px;line-height:22px;color:#e4e4e7;">
    <span style="color:#a1a1aa;">${dateStr}</span>
    <span style="display:inline-block;margin-left:10px;max-width:320px;vertical-align:top;">${nameStr}</span>
    <span style="float:right;color:#6ee7b7;font-variant-numeric:tabular-nums;">${amtStr}</span>
  </td>
</tr>`;
          })
          .join('');

  const alertsHtml = !hasAlerts
    ? ''
    : `<tr>
  <td style="padding:18px 24px;border-top:1px solid #27272a;">
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      <div style="font-size:14px;letter-spacing:0.08em;color:#a1a1aa;font-weight:700;">⚠️ HEADS UP</div>
      <ul style="margin:10px 0 0 18px;padding:0;color:#e4e4e7;font-size:16px;line-height:24px;">
        ${
          data.alerts.hasOverdraftRisk
            ? `<li>Overdraft risk this week (lowest: ${lowestBalanceStr} on ${lowestBalanceDateStr})</li>`
            : ''
        }
        ${
          !data.alerts.hasOverdraftRisk && data.alerts.hasLowBalance
            ? `<li>Low balance warning (lowest: ${lowestBalanceStr} on ${lowestBalanceDateStr})</li>`
            : ''
        }
        ${
          data.alerts.hasBillCollisions
            ? `<li>${data.alerts.collisionCount} day(s) with multiple bills due</li>`
            : ''
        }
      </ul>
    </div>
  </td>
</tr>`;

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#18181b;">
    <!-- Preheader (hidden) -->
    <div style="display:none;font-size:1px;color:#18181b;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
      ${escapeHtml(previewText)}
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#18181b;">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background-color:#111827;border:1px solid #27272a;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:20px 24px;">
                <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                  <div style="font-size:12px;color:#a1a1aa;letter-spacing:0.08em;font-weight:700;">CASH FLOW FORECASTER</div>
                  <div style="margin-top:6px;font-size:20px;font-weight:800;color:#e4e4e7;">Weekly Digest</div>
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:0 24px 14px 24px;">
                <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:16px;line-height:24px;color:#e4e4e7;">
                  Hi ${greetingName},<br />
                  Here’s your cash flow forecast for the week of <span style="color:#5eead4;font-weight:700;">${escapeHtml(
                    weekStart
                  )} - ${escapeHtml(weekEnd)}</span>
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:18px 24px;border-top:1px solid #27272a;">
                <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                  <div style="font-size:14px;letter-spacing:0.08em;color:#a1a1aa;font-weight:700;">📊 WEEK AT A GLANCE</div>
                  <div style="margin-top:12px;background:#0b1220;border:1px solid #1f2937;border-radius:12px;padding:12px;">
                    <!--[if mso]>
                      <table role="presentation" width="100%"><tr>
                        <td width="200" style="padding:8px 10px;color:#e4e4e7;font-family:Segoe UI,Roboto,sans-serif;">
                          <div style="font-size:12px;color:#a1a1aa;">Income</div>
                          <div style="font-size:18px;font-weight:800;color:#6ee7b7;">${incomeStr}</div>
                        </td>
                        <td width="200" style="padding:8px 10px;color:#e4e4e7;font-family:Segoe UI,Roboto,sans-serif;">
                          <div style="font-size:12px;color:#a1a1aa;">Bills</div>
                          <div style="font-size:18px;font-weight:800;color:#fca5a5;">${billsStr}</div>
                        </td>
                        <td width="200" style="padding:8px 10px;color:#e4e4e7;font-family:Segoe UI,Roboto,sans-serif;">
                          <div style="font-size:12px;color:#a1a1aa;">Net</div>
                          <div style="font-size:18px;font-weight:800;color:#5eead4;">${netStr}</div>
                        </td>
                      </tr></table>
                    <![endif]-->
                    <!--[if !mso]><!-->
                    <div style="display:flex;flex-wrap:wrap;">
                      <div style="flex:1 1 150px;min-width:150px;padding:8px 10px;">
                        <div style="font-size:12px;color:#a1a1aa;">Income</div>
                        <div style="margin-top:4px;font-size:18px;font-weight:800;color:#6ee7b7;">${incomeStr}</div>
                      </div>
                      <div style="flex:1 1 150px;min-width:150px;padding:8px 10px;">
                        <div style="font-size:12px;color:#a1a1aa;">Bills</div>
                        <div style="margin-top:4px;font-size:18px;font-weight:800;color:#fca5a5;">${billsStr}</div>
                      </div>
                      <div style="flex:1 1 150px;min-width:150px;padding:8px 10px;">
                        <div style="font-size:12px;color:#a1a1aa;">Net</div>
                        <div style="margin-top:4px;font-size:18px;font-weight:800;color:#5eead4;">${netStr}</div>
                      </div>
                    </div>
                    <!--<![endif]-->
                  </div>

                  <div style="margin-top:12px;font-size:16px;line-height:24px;color:#e4e4e7;">
                    💰 Lowest balance: <span style="font-weight:800;">${lowestBalanceStr}</span> on <span style="font-weight:700;color:#a1a1aa;">${lowestBalanceDateStr}</span>
                  </div>
                </div>
              </td>
            </tr>

            ${alertsHtml}

            <tr>
              <td style="padding:18px 24px;border-top:1px solid #27272a;">
                <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                  <div style="font-size:14px;letter-spacing:0.08em;color:#a1a1aa;font-weight:700;">📅 UPCOMING BILLS</div>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
                    ${billsRows}
                  </table>
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:18px 24px;border-top:1px solid #27272a;">
                <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                  <div style="font-size:14px;letter-spacing:0.08em;color:#a1a1aa;font-weight:700;">💵 EXPECTED INCOME</div>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
                    ${incomeRows}
                  </table>
                </div>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:22px 24px;border-top:1px solid #27272a;">
                <a href="${safeViewUrl}" style="display:inline-block;padding:16px 32px;background-color:#14b8a6;color:#061a17;text-decoration:none;border-radius:10px;font-weight:800;font-size:16px;min-width:200px;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                  View Full Forecast →
                </a>
                <div style="margin-top:10px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:12px;color:#a1a1aa;">
                  If the button doesn’t work, copy and paste: <a href="${safeViewUrl}" style="color:#5eead4;text-decoration:underline;">${safeViewUrl}</a>
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 24px;border-top:1px solid #27272a;">
                <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:12px;line-height:18px;color:#a1a1aa;">
                  You’re receiving this because you have weekly email digests enabled.
                  <a href="${safeManageUrl}" style="color:#5eead4;text-decoration:underline;">Manage preferences</a>
                  &nbsp;|&nbsp;
                  <a href="${safeUnsubUrl}" style="color:#5eead4;text-decoration:underline;">Unsubscribe</a>
                  <div style="margin-top:10px;color:#71717a;">© 2025 Cash Flow Forecaster</div>
                </div>
              </td>
            </tr>
          </table>
          ${safePixelUrl ? `<img src="${safePixelUrl}" width="1" height="1" alt="" style="display:none;opacity:0;max-height:0;max-width:0;overflow:hidden;" />` : ''}
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, html };
}


