# Technical Requirements Document

## Development Progress

### ✅ Completed (Days 1-22)

- [x] Next.js 14 project setup with TypeScript
- [x] Supabase integration (client, server, route handlers)
- [x] Database schema created (12 tables)
- [x] Row Level Security enabled
- [x] TypeScript types generated from live database
- [x] Git repository initialized
- [x] GitHub remote connected
- [x] Domains secured (cashflowforecaster.io, .app)
- [x] DNS configured for Vercel
- [x] Authentication (email + Google OAuth)
- [x] Password reset flow
- [x] Protected routes
- [x] Account management (full CRUD)
- [x] Income management (full CRUD)
- [x] Bills management (full CRUD)
- [x] 60-day calendar algorithm
- [x] Calendar UI with day modals
- [x] "Can I Afford It?" scenarios
- [x] Landing page with pricing
- [x] Runway Collect invoicing
- [x] Payment reminders
- [x] Onboarding wizard
- [x] Stripe integration (checkout, webhooks, portal)
- [x] PostHog analytics
- [x] Feature gating (bills/income limits, invoicing gate)

### 📋 Upcoming

- [ ] Stripe live mode
- [ ] Bill collision warnings
- [ ] Sentry error monitoring
- [ ] Email parser
- [ ] Plaid bank sync

---

## Project Status

**Status:** Live - Accepting Payments

**Current Phase:** User Acquisition

**Last Updated:** December 21, 2025

---

## System Overview

**Product Name:** Cash Flow Forecaster

**Description:** A Progressive Web App that projects bank balance 60 days into the future using a daily liquidity calendar interface. Designed for freelancers, gig workers, and anyone who needs to know if they can afford expenses before payday arrives.

**Production Domains:** cashflowforecaster.io (primary), cashflowforecaster.app (redirect)

**Development URL:** http://localhost:3000

**Target Users:**

- Freelancers and gig workers
- Small business owners
- Anyone with irregular income
- Users who need forward-looking cash flow visibility

**Core Value Proposition:**

- See bank balance 60 days into the future
- Daily liquidity calendar interface
- "Can I afford it?" scenario planning
- Runway Collect invoicing (Pro tier)

---

## Technology Stack

### Frontend - Implemented ✅

- Next.js 14.2+ with App Router
- TypeScript 5.x (strict mode)
- Tailwind CSS 3.x
- React Hook Form + Zod validation
- date-fns for date handling
- Lucide React for icons
- react-hot-toast for notifications

### Backend - Implemented ✅

- Supabase (PostgreSQL 15)
- Supabase Auth (email + Google OAuth)
- Row Level Security enabled
- 12 tables created and tested

### Payments - Implemented ✅

- Stripe Checkout
- Stripe Webhooks
- Stripe Customer Portal
- Subscription management

### Analytics - Implemented ✅

- PostHog (user tracking, conversion funnel)
- Feature flags ready
- Session recording enabled

### Email - Implemented ✅

- Resend (transactional emails)
- Invoice sending
- Payment reminders

### PDF Generation - Implemented ✅

- @react-pdf/renderer
- Invoice PDF generation

### Infrastructure - Configured ✅

- Vercel (deployment)
- Namecheap DNS
- Git + GitHub

### Package Manager

- pnpm 8.0+

---

## Database Schema

**Status:** ✅ Implemented and Verified

All tables created in production Supabase instance. TypeScript types auto-generated from live schema.

Project ID: pyekssfaqarrpjtblnlx

To regenerate types:

```bash
npx supabase gen types typescript --project-id pyekssfaqarrpjtblnlx > types/supabase.ts
```

### Tables (12 total)

1. **accounts**
   - User bank accounts (checking, savings)
   - Fields: id, user_id, name, type, balance, currency

2. **income**
   - Income sources (salary, freelance, gigs)
   - Fields: id, user_id, name, amount, frequency, start_date, end_date

3. **bills**
   - Recurring expenses (rent, utilities, subscriptions)
   - Fields: id, user_id, name, amount, due_date, frequency, category

4. **user_settings**
   - User preferences and configuration
   - Fields: id, user_id, timezone, currency, notifications_enabled, safety_buffer

5. **scenarios**
   - "Can I afford it?" calculations
   - Fields: id, user_id, name, amount, date, result

6. **invoices**
   - Runway Collect invoices
   - Fields: id, user_id, client_name, client_email, amount, status, due_date, items

7. **invoice_reminders**
   - Payment reminder history
   - Fields: id, invoice_id, reminder_type, sent_at

8. **parsed_emails**
   - Email parser results (future feature)
   - Fields: id, user_id, email_id, parsed_data, created_at

9. **weekly_checkins**
   - Burn rate accuracy tracking (future feature)
   - Fields: id, user_id, week_start, actual_balance, projected_balance

10. **notifications**
    - User notification log
    - Fields: id, user_id, type, message, read, created_at

11. **users**
    - Extended user profile data
    - Fields: id (references auth.users), full_name, created_at, updated_at

12. **subscriptions**
    - Stripe subscription data
    - Fields: id, user_id, stripe_customer_id, stripe_subscription_id, tier, status, price_id, interval, current_period_start, current_period_end, cancel_at_period_end

### Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Authentication handled by Supabase Auth
- Service role key used only in secure server-side contexts

---

## Feature Gating System

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Feature Gating Flow                      │
└─────────────────────────────────────────────────────────────┘

User Request
     │
     ▼
┌─────────────────────────────────────────────────────────────┐
│ Page Component (Server)                                     │
│ - getUserUsageStats() → { billsCount, incomeCount, limits } │
│ - canUseInvoicing() → boolean                               │
└─────────────────────────────────────────────────────────────┘
     │
     ├─── Has Access ───► Normal UI
     │
     └─── No Access ────► Upgrade Prompt / Redirect
                              │
                              ▼
                    ┌─────────────────────┐
                    │ UpgradePrompt Modal │
                    │ - Billing toggle    │
                    │ - Feature list      │
                    │ - Stripe checkout   │
                    └─────────────────────┘
```

### Tier Limits

| Feature | Free | Pro ($7.99/mo) | Premium ($14.99/mo) |
|---------|------|----------------|---------------------|
| Bills | 10 | Unlimited | Unlimited |
| Income Sources | 10 | Unlimited | Unlimited |
| Forecast Days | 60 | 90 | 365 |
| Invoicing | ❌ | ✅ | ✅ |
| Bank Sync | ❌ | ❌ | ✅ (coming soon) |
| SMS Alerts | ❌ | ❌ | ✅ (coming soon) |

### Client-Side Hooks

**`lib/hooks/use-subscription.ts`**

```typescript
// Get current subscription
const { tier, status, isLoading } = useSubscription()

// Get usage counts
const { billsCount, incomeCount, limits } = useUsage()

// Combined hook for forms
const { 
  tier, 
  billsCount, 
  incomeCount, 
  limits, 
  canAddBill, 
  canAddIncome 
} = useSubscriptionWithUsage()
```

### Server-Side Utilities

**`lib/stripe/feature-gate.ts`**

```typescript
// Check if user can add more bills/income
const canAdd = await canAddBill() // returns boolean
const canAdd = await canAddIncome() // returns boolean

// Check feature access
const hasAccess = await canUseInvoicing() // Pro+
const hasAccess = await canUseBankSync() // Premium only

// Get full usage stats
const stats = await getUserUsageStats()
// { billsCount, incomeCount, limits: { maxBills, maxIncome } }
```

### Components

**`components/subscription/upgrade-prompt.tsx`**

- `UpgradePrompt` - Modal with billing toggle, pricing, feature list
- `UpgradeBanner` - Inline warning (amber at limit, blue near limit)
- `UsageIndicator` - Badge showing "3/10 bills"

**`components/subscription/gated-add-button.tsx`**

- `GatedAddButton` - Opens modal if at limit, navigates otherwise

---

## Analytics System (PostHog)

### Configuration

**`lib/posthog/client.ts`**

```typescript
import posthog from 'posthog-js'

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  capture_pageview: true,
  capture_pageleave: true,
})
```

### Tracked Events

#### Authentication
- `user_signed_up` - { email, method }
- `user_logged_in` - { method }

#### Onboarding
- `onboarding_started`
- `onboarding_step_completed` - { step }
- `onboarding_completed` - { accounts_count, income_count, bills_count }

#### Core Features
- `account_created` - { type }
- `income_created` - { frequency, amount_range }
- `bill_created` - { frequency, category }
- `calendar_viewed` - { days_shown }
- `scenario_tested` - { amount_range, result }

#### Invoicing (Pro)
- `invoice_created` - { amount_range }
- `invoice_sent` - { amount_range }
- `reminder_sent` - { reminder_type }

#### Conversion
- `upgrade_prompt_shown` - { trigger }
- `upgrade_initiated` - { tier, interval }
- `subscription_created` - { tier, interval, mrr }
- `subscription_cancelled` - { tier, reason }

### User Identification

```typescript
// On login/signup
posthog.identify(user.id, {
  email: user.email,
  created_at: user.created_at,
})

// On subscription change
posthog.people.set({
  tier: subscription.tier,
  subscription_status: subscription.status,
})
```

---

## API Endpoints

### Authentication Endpoints

**POST /api/auth/signup**
- Create new user account
- Returns: user object, session token

**POST /api/auth/login**
- Authenticate existing user
- Returns: user object, session token

**POST /api/auth/logout**
- End user session
- Returns: success status

**POST /api/auth/reset-password**
- Request password reset email
- Returns: success status

**GET /api/auth/callback**
- OAuth callback handler (Google)
- Redirects to dashboard

### Account Management Endpoints

**GET /api/accounts**
- List all user accounts
- Returns: array of account objects

**POST /api/accounts**
- Create new account
- Body: { name, type, balance, currency }
- Returns: created account object

**PUT /api/accounts/[id]**
- Update account details
- Returns: updated account object

**DELETE /api/accounts/[id]**
- Delete account
- Returns: success status

### Income Endpoints

**GET /api/income**
- List all income sources
- Returns: array of income objects

**POST /api/income**
- Create new income source
- **Gated:** Returns 403 if at limit (Free tier)
- Body: { name, amount, frequency, start_date, end_date? }
- Returns: created income object

**PUT /api/income/[id]**
- Update income source
- Returns: updated income object

**DELETE /api/income/[id]**
- Delete income source
- Returns: success status

### Bills Endpoints

**GET /api/bills**
- List all bills
- Returns: array of bill objects

**POST /api/bills**
- Create new bill
- **Gated:** Returns 403 if at limit (Free tier)
- Body: { name, amount, due_date, frequency, category }
- Returns: created bill object

**PUT /api/bills/[id]**
- Update bill
- Returns: updated bill object

**DELETE /api/bills/[id]**
- Delete bill
- Returns: success status

### Calendar Endpoints

**GET /api/calendar**
- Get 60/90/365-day liquidity projection (based on tier)
- Query params: start_date (optional)
- Returns: array of daily balance objects

**GET /api/calendar/scenarios**
- List all scenarios
- Returns: array of scenario objects

**POST /api/calendar/scenarios**
- Create "Can I afford it?" scenario
- Body: { name, amount, date }
- Returns: scenario object with result

### Invoice Endpoints (Pro+ Only)

**GET /api/invoices**
- List all invoices
- **Gated:** Returns 403 for Free tier
- Returns: array of invoice objects

**POST /api/invoices**
- Create new invoice
- **Gated:** Returns 403 for Free tier
- Body: { client_name, client_email, items, due_date }
- Returns: created invoice object

**GET /api/invoices/[id]/pdf**
- Generate PDF for invoice
- **Gated:** Returns 403 for Free tier
- Returns: PDF file

**POST /api/invoices/[id]/send**
- Send invoice via email
- **Gated:** Returns 403 for Free tier
- Returns: success status

**POST /api/invoices/[id]/remind**
- Send payment reminder
- **Gated:** Returns 403 for Free tier
- Body: { reminder_type: 'friendly' | 'firm' | 'final' }
- Returns: success status

### Stripe Endpoints

**POST /api/stripe/checkout**
- Create Stripe Checkout session
- Body: { tier, interval }
- Returns: { url: checkout_url }

**POST /api/stripe/portal**
- Create Stripe Customer Portal session
- Returns: { url: portal_url }

**POST /api/webhooks/stripe**
- Stripe webhook handler
- Handles: checkout.session.completed, subscription.*, invoice.*
- Returns: success status

---

## Calendar Algorithm

### Overview

The calendar algorithm projects bank balance into the future by:

1. Starting with current account balances
2. Adding income on scheduled dates
3. Subtracting bills on due dates
4. Handling recurring transactions based on frequency

### Algorithm Details

**Input:**
- Current account balances
- Income sources (amount, frequency, start_date, end_date)
- Bills (amount, due_date, frequency)
- Forecast days (60/90/365 based on tier)

**Processing:**

1. Initialize calendar array (60/90/365 days based on tier)
2. Set starting balance for day 0
3. For each day:
   - Copy previous day's balance
   - Add any income scheduled for this day
   - Subtract any bills due on this day
   - Store result in calendar array

**Frequency Handling:**
- **Daily:** Every day
- **Weekly:** Same day of week
- **Bi-weekly:** Every 2 weeks from start date
- **Monthly:** Same day of month (handles month-end edge cases)
- **Quarterly:** Every 3 months
- **Yearly:** Same month and day each year

**Output:**
- Array of daily balance objects
- Each object contains: date, balance, transactions, warnings

### Edge Cases

- Month-end dates (e.g., Jan 31 → Feb 28/29)
- Leap years
- Income/bills that end before forecast window
- Multiple accounts (aggregate balance)

---

## Progressive Web App (PWA)

### Features

- **Offline Support:** Cache calendar data for offline viewing
- **Install Prompt:** "Add to Home Screen" functionality
- **App-like Experience:** Full-screen mode, no browser chrome
- **Fast Loading:** Optimized assets, lazy loading

### Manifest Configuration

- App name: "Cash Flow Forecaster"
- Short name: "Cash Flow"
- Theme color: #14b8a6 (teal-500)
- Background color: #18181b (zinc-900)
- Display mode: "standalone"

---

## Security Requirements

### Authentication

- Supabase Auth for user management
- Google OAuth integration
- Secure password hashing (handled by Supabase)
- Session management via HTTP-only cookies
- Password reset via secure email tokens

### Data Protection

- Row Level Security (RLS) on all tables
- User data isolation
- Service role key only used server-side
- Environment variables for sensitive data

### Payment Security

- Stripe handles all payment data
- Webhook signature verification
- No credit card data stored locally

### API Security

- Rate limiting (Vercel)
- Input validation on all endpoints
- SQL injection prevention (Supabase handles this)
- XSS prevention (React escapes by default)
- Feature gating with server-side validation

---

## Performance Requirements

### Page Load Times

- Initial page load: < 2 seconds
- Calendar calculation: < 500ms
- API response times: < 200ms (p95)

### Optimization Strategies

- Code splitting (Next.js automatic)
- Image optimization (Next.js Image component)
- Lazy loading for calendar data
- Caching for static assets
- Database query optimization

---

## Environment Variables

### Required (Production)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_PRO_MONTHLY=price_xxx
STRIPE_PRICE_PRO_YEARLY=price_xxx
STRIPE_PRICE_PREMIUM_MONTHLY=price_xxx
STRIPE_PRICE_PREMIUM_YEARLY=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_MONTHLY=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_YEARLY=price_xxx

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# Resend
RESEND_API_KEY=re_xxx

# App
NEXT_PUBLIC_APP_URL=https://cashflowforecaster.io
```

---

## Repository Information

**GitHub:** https://github.com/omarqouqas/cashflowforecaster

**Branch Strategy:**
- `main` - Production-ready code
- Feature branches for new development

**Commit Convention:**
- Use descriptive commit messages
- Include "what" and "why"
- Reference day/phase when relevant

**Protected Files:**
- `.env.local` - Never commit (contains secrets)
- `.env.example` - Commit (templates only)
- `node_modules/` - Ignored

---

## Deployment

### Production Environment

- **Platform:** Vercel
- **Domain:** cashflowforecaster.io
- **SSL:** Automatic (Vercel)
- **CDN:** Vercel Edge Network

### CI/CD Pipeline

- Automatic deployments from `main` branch
- Preview deployments for pull requests
- Environment variables configured in Vercel dashboard

---

## Monitoring & Analytics

### Analytics (PostHog) ✅

- User behavior tracking
- Conversion funnel analysis
- Feature usage metrics
- Session recording
- Feature flags

### Error Tracking (Planned)

- Sentry integration
- Error boundary for React errors
- API error logging

---

## Project Structure

```
cash-flow-forecaster/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # Auth endpoints
│   │   ├── accounts/             # Account CRUD
│   │   ├── income/               # Income CRUD
│   │   ├── bills/                # Bills CRUD
│   │   ├── invoices/             # Invoice endpoints
│   │   ├── stripe/               # Stripe endpoints
│   │   └── webhooks/             # Webhook handlers
│   ├── (auth)/                   # Auth pages (login, signup)
│   ├── (dashboard)/              # Protected dashboard pages
│   │   ├── accounts/
│   │   ├── income/
│   │   ├── bills/
│   │   ├── invoices/
│   │   ├── scenarios/
│   │   └── settings/
│   ├── layout.tsx                # Root layout with providers
│   └── page.tsx                  # Landing page
├── components/
│   ├── ui/                       # Reusable UI components
│   ├── dashboard/                # Dashboard-specific components
│   ├── calendar/                 # Calendar components
│   ├── invoices/                 # Invoice components
│   ├── subscription/             # Subscription/gating components
│   └── pricing/                  # Pricing section
├── lib/
│   ├── actions/                  # Server actions
│   ├── hooks/                    # Custom React hooks
│   ├── stripe/                   # Stripe utilities
│   │   ├── client.ts             # Stripe SDK
│   │   ├── config.ts             # Pricing tiers
│   │   ├── subscription.ts       # Subscription helpers
│   │   └── feature-gate.ts       # Feature gating
│   ├── posthog/                  # PostHog utilities
│   │   ├── client.ts             # PostHog init
│   │   └── provider.tsx          # React provider
│   ├── supabase/                 # Supabase clients
│   └── utils/                    # General utilities
├── types/                        # TypeScript definitions
│   └── supabase.ts               # Generated DB types
└── public/                       # Static assets
```

### Key Dependencies

```json
{
  "next": "14.2.x",
  "react": "^18",
  "@supabase/ssr": "^0.8.0",
  "stripe": "^17.x",
  "posthog-js": "^1.195.1",
  "@react-pdf/renderer": "^4.x",
  "resend": "^4.x",
  "date-fns": "^4.x",
  "tailwindcss": "^3.4",
  "react-hot-toast": "^2.x",
  "zod": "^3.x",
  "lucide-react": "^0.x"
}
```

---

**Document Version:** 2.0
**Last Updated:** December 21, 2025
**Maintained By:** Development Team