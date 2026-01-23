# PostHog Tracking Status

Last updated: January 22, 2026

## Implemented Events

| Event | Location | Commit |
|-------|----------|--------|
| `user_signed_up` | `app/auth/signup/page.tsx`, `app/auth/oauth-success/page.tsx` | a8afee8 |
| `user_logged_in` | `app/auth/login/page.tsx` | a8afee8 |
| `onboarding_started` | `app/onboarding/page.tsx` | a8afee8 |
| `onboarding_step_completed` | `app/onboarding/page.tsx` | a8afee8 |
| `onboarding_completed` | `app/onboarding/page.tsx` | a8afee8 |
| `calendar_viewed` | `components/calendar/calendar-hybrid-view.tsx` | a8afee8 |
| `can_i_afford_it_checked` | `components/tools/can-i-afford-calculator.tsx` | (pre-existing) |
| `account_created` | `app/dashboard/accounts/new/page.tsx`, `app/onboarding/page.tsx` | a8afee8 |
| `income_added` | `app/dashboard/income/new/page.tsx`, `app/onboarding/page.tsx` | a8afee8 |
| `bill_added` | `app/dashboard/bills/new/page.tsx`, `app/onboarding/page.tsx` | a8afee8 |
| `upgrade_clicked` | `components/subscription/upgrade-prompt.tsx` | 3a8e623 |
| `feature_gate_hit` | `components/subscription/upgrade-prompt.tsx`, `components/subscription/gated-add-button.tsx` | 3a8e623 |
| `dashboard_viewed` | `components/dashboard/dashboard-content.tsx` | 3a8e623 |
| `invoice_created` | `components/invoices/new-invoice-form.tsx` | 3a8e623 |
| `day_detail_opened` | `components/calendar/day-detail-modal.tsx` | 3a8e623 |

## Not Yet Implemented

### Lower Priority - Code Changes Needed

| Event | Where to Add | Notes |
|-------|-------------|-------|
| `invoice_downloaded` | PDF download button in invoice detail page | Track when user downloads invoice PDF |
| `invoice_sent` | Email invoice action | Track when invoice is emailed to client |
| `invoice_marked_paid` | Mark paid action on invoice | Track with amount and days outstanding |
| `payment_reminder_sent` | Reminder email action | Track reminder type and days overdue |
| `subscription_started` | Stripe webhook or `/pay/success` page | Track tier, interval, amount |
| `subscription_canceled` | Stripe webhook | Track tier, reason, days active |
| `low_balance_warning_shown` | Dashboard warning banners in `dashboard-content.tsx` | Track when overdraft/low balance warnings display |
| `scenario_created` | "Can I Afford It" saved scenarios | Track saved scenario name/amount |
| `onboarding_skipped` | Skip buttons in onboarding steps | Track which step was skipped |
| `user_logged_in` (Google) | OAuth callback for returning users | Currently only tracks email login |
| `error_occurred` | Error boundaries, catch blocks | Track error type, message, component |

### Non-Code Tasks (PostHog Dashboard Setup)

1. **Build Conversion Funnels**
   - Signup → Onboarding Completed → Calendar Viewed → Upgrade Clicked → Subscription Started
   - Feature Gate Hit → Upgrade Clicked → Subscription Started

2. **User Identification**
   - Call `posthog.identify(userId, { email, created_at })` after login
   - This links anonymous pre-signup sessions to authenticated users
   - Add to auth callback or dashboard layout

3. **Enable Session Recordings**
   - Turn on in PostHog settings to watch real user sessions
   - Helps debug UX issues and understand user behavior

4. **Create Dashboards**
   - Daily/weekly signups
   - Onboarding completion rate
   - Feature adoption (which features get used)
   - Upgrade conversion rate

5. **Set Up Cohorts**
   - Free users who hit feature gates
   - Users who completed onboarding but never returned
   - Power users (high calendar_viewed count)

## Event Definitions Reference

All events are defined in `lib/posthog/events.ts`. Each function wraps `posthog.capture()` with typed parameters.

## Testing New Events

1. Open incognito/private browser
2. Perform the action that should trigger the event
3. Check PostHog Live Events or search for the event name
4. Note: Events only appear after code is deployed and action is performed
