# Cash Flow Forecaster - Complete Product Brief

**Version:** 5.3
**Last Updated:** January 20, 2026
**Status:** Live - Accepting Payments - Simpler Onboarding + Emergency Fund Tracker
**Product URL:** https://cashflowforecaster.io
**Repository:** https://github.com/omarqouqas/cashflowforecaster

---

## Executive Summary

**Product Name:** Cash Flow Forecaster

**Domains:** 
- Primary: cashflowforecaster.io
- Redirect: cashflowforecaster.app

**One-Liner:** "Stop guessing if you can cover rent."

**Hook:** "Your personal cash flow calendar for the next 60 days — with every invoice, bill, and payday mapped out."

Cash Flow Forecaster is a Progressive Web App that helps freelancers, gig workers, and anyone with irregular income see their bank balance 60 days into the future. Unlike traditional budgeting apps that focus on past spending, Cash Flow Forecaster uses a daily liquidity calendar to answer the critical question: "Can I afford this expense before my next paycheck arrives?"

### Problem Statement

Millions of freelancers and gig workers struggle with cash flow uncertainty. They don't know if they can afford an expense because they can't predict when money will arrive. Traditional budgeting apps (YNAB, Mint, Monarch) focus on tracking past spending, not projecting future liquidity. This leaves a critical gap for people who need forward-looking visibility.

**Research-Backed Pain Points:**
- 47% of freelancers cite income instability as their #1 financial worry
- 39% of freelancers say income inconsistency is their second-biggest challenge (2025)
- 80% of self-employed workers with gigs as primary income couldn't handle an unexpected $1,000 expense
- Gig workers collectively pay $15 billion in overdraft fees annually

### Solution

Cash Flow Forecaster projects bank balance 60 days into the future using a daily calendar interface. Users input:
- Current account balances
- Income sources (with frequency: weekly, bi-weekly, monthly)
- Recurring bills (with due dates)

The app calculates and displays a 60-day calendar showing projected daily balances, color-coded to highlight low-balance days. Users can test "Can I afford it?" scenarios before making purchases.

**Dashboard Guidance Features:**
- **Daily Budget / Daily Shortfall:** Per-day spending budget until next income
- **"Your Path Forward" card:** Shown when forecast goes negative; provides calm, actionable options
- **Forecast-aware status:** "In the green," "low-balance days," or "may overdraft on [date]"

---

## Target Market

### Primary Persona: "The Anxious Creative"

| Attribute | Detail |
|-----------|--------|
| **Age** | 25–35 years old |
| **Income** | $45,000–$90,000/year |
| **Location** | US urban metros (NYC, LA, Miami, Austin, Nashville, Denver) |
| **Professions** | Graphic designers, freelance writers/copywriters, web developers, marketing consultants, video editors/photographers |
| **Client Load** | 3–8 active clients at any time |
| **Payment Terms** | Net-15 to Net-30 invoices |
| **Behavior** | Has tried YNAB or spreadsheets, found them tedious; has experienced overdraft fees |
| **Core Question** | "Will I have enough in my account when rent hits on the 1st?" |

**Why This Persona:**
- Old enough to have real bills (rent, car payments, potential family)
- Young enough to be tech-comfortable with PWAs
- At the income level where cash flow anxiety peaks
- Not wealthy enough for "set it and forget it" finances
- Too busy to track manually, but too financially stretched to ignore

### Secondary Persona: "The Side-Gig Hustler"

| Attribute | Detail |
|-----------|--------|
| **Age** | 22–32 years old |
| **Income** | $25,000–$50,000/year |
| **Professions** | Rideshare drivers (Uber/Lyft), delivery workers (DoorDash, Instacart), TaskRabbit/Handy workers, part-time freelancers |
| **Pain Point** | High anxiety around cash timing; often hit with overdraft fees |
| **Strategy** | Target with free tier messaging; potential for Pro conversion over time |

**Why This Persona:**
- High volume, high pain around cash flow
- Great for free tier adoption and word-of-mouth
- Some will convert to Pro as income grows

### Geographic Focus

| Tier | Markets | Freelancer Population |
|------|---------|----------------------|
| **Tier 1 (Highest Volume)** | New York, Los Angeles, Chicago | NYC: 589k, LA: 429k, Chicago: 211k |
| **Tier 2 (High Growth)** | Miami, Austin, Houston, Orlando, Tampa, Dallas | Miami: 270k; fastest-growing markets |
| **Tier 3 (Emerging)** | Nashville, Denver, Atlanta, Charlotte, Raleigh | High creative freelancer concentration |

### Market Size

- **76.4 million** freelancers in the US (2025)
- **70+ million** Americans in the gig economy (36% of workforce)
- **70%** of freelancers are under age 35
- Freelance platforms market: **$5.6 billion** (2024), projected **$13.8 billion** by 2030
- Projected: Over **50%** of US workforce will freelance by 2027

### Demographics

- **Age Distribution:** 70% between 18-34, only 10% over 45
- **Gender:** 60% male, 40% female in US freelance market
- **Education:** 80% have bachelor's degree or higher

---

## Value Proposition

### Three Pillars of Cash Flow Clarity

**Pillar 1: Know Your Number Today**
- 60-day forward balance projection (365 days for Pro)
- Daily "safe to spend" visibility
- Color-coded low-balance warnings (amber/rose)
- Overdraft prevention before it happens

**Pillar 2: Get Paid Faster (Pro)**
- Runway Collect professional invoicing
- Automated payment reminders (friendly/firm/final)
- Invoice-to-forecast sync — see expected income immediately
- PDF generation and direct email delivery

**Pillar 3: Never Get Blindsided**
- Weekly email digest with cash flow summary
- Bill collision alerts (multiple bills same day)
- Upcoming expense warnings
- Monday morning financial clarity

### Landing Page Messaging

**Hero:**
- **Headline:** "Stop Guessing If You Can Cover Rent"
- **Subhead:** "Your personal cash flow calendar for the next 60 days — with every invoice, bill, and payday mapped out. Built for freelancers with irregular income."
- **Badge:** "Built for freelancers with irregular income"

**Stat Callout:**
- "Built for the **47%** of freelancers who say income instability is their #1 financial worry."

**Who It's For Section:**
- **Graphic Designers:** "Waiting on client approvals and Net-30 payments"
- **Freelance Writers:** "Juggling multiple clients with different payment schedules"
- **Marketing Consultants:** "Managing retainers and project-based work"
- **Web Developers:** "Balancing milestone payments across projects"

**Exclusion Statement:**
- "Not built for: Businesses with full-time bookkeepers or anyone who needs complex accounting. We keep it simple on purpose."

---

## Current Development Status

### ✅ ALL PHASES COMPLETE - LIVE AND ACCEPTING PAYMENTS

### Phase 1: Foundation ✅ COMPLETE (Days 1-3)
- Next.js 14 project with TypeScript
- Supabase backend integration
- Database schema (12 tables)
- Row Level Security configured
- Domains secured and DNS configured
- Git repository and version control

### Phase 2: Authentication ✅ COMPLETE (Days 4-5)
- Signup/login pages
- Google OAuth integration
- Protected routes
- User profile management
- Password reset flow

### Phase 3: Core Data Models ✅ COMPLETE (Days 6-8)
- Account management (full CRUD)
- Income sources management (full CRUD)
- Bills management (full CRUD)
- Dashboard with live summaries

### Phase 4: Calendar Feature ✅ COMPLETE (Days 9-15)
- 60-day cash flow projection algorithm
- Calendar UI with day detail modals
- Color-coded balance warnings (amber/rose)
- Today indicator with auto-scroll
- Dark theme design

### Phase 5: Landing Page ✅ COMPLETE (Day 16)
- Hero section with value proposition
- Feature highlights with mockups
- "How It Works" section
- Pricing section with tier comparison
- Footer with links

### Phase 5b: Landing Page Revamp ✅ COMPLETE (Day 29)
- Refined hero positioning ("Stop Guessing If You Can Cover Rent")
- Three-pillar structure (Know your number / Get paid faster / Never get blindsided)
- "Who It's For" section with four personas
- Added "Who It's For" to header navigation
- Mid-page CTA between personas and pricing
- Prominent stat callout (47% income instability worry)

### Phase 6: Runway Collect ✅ COMPLETE (Days 17-19)
- Invoice generator with PDF export
- Email sending via Resend
- Payment reminder system (3 escalating templates)
- Auto-sync invoices with income forecasts

### Phase 7: Onboarding ✅ COMPLETE (Day 18, simplified Day 41)
- 2-step guided wizard (Quick Setup + Bills)
- Combined account balance + income in step 1
- Pre-populated bill suggestions in step 2
- Auto-redirect to calendar on completion (~60 seconds)

### Phase 8: Stripe Integration ✅ COMPLETE (Day 21)
- Stripe Checkout for paid tiers (Pro)
- Webhook handler for subscription lifecycle
- Customer Portal for self-service management
- Subscription status in Settings page

### Phase 9: Feature Gating + Analytics ✅ COMPLETE (Day 22)
- PostHog analytics with full event tracking
- Bills/income quantity limits (Free: 10 each)
- Invoicing feature gate (Pro+ only)
- Upgrade prompts and modals
- Server-side validation

**Status:** FEATURE COMPLETE - READY FOR USER ACQUISITION 🎉

---

## Product Features

### Core Features (MVP) ✅ ALL COMPLETE

**1. Daily Liquidity Calendar ✅**
- Tier-based forward projection:
  - Free: 60 days
  - Pro: 365 days (12 months ahead)
- **Interactive balance trend chart** with hover tooltips and click-to-jump navigation
- **Inline transaction display** on day cards (top 2 transactions visible)
- **Hybrid responsive layout:**
  - Desktop: Grid layout with month grouping
  - Mobile: Timeline vertical scrolling
- Color-coded balance indicators (green/amber/rose)
- Enhanced visual polish (shimmer animations, fade-in effects, pulsing danger indicators)
- Daily transaction list with expandable detail panels
- Mobile-responsive dark theme design (YNAB-inspired minimalist aesthetic)
- Today indicator with auto-scroll
- Overdraft warning banners
- Custom SVG chart (no external dependencies)

**2. Dashboard Guidance & Daily Budgeting ✅**
- Daily Budget / Daily Shortfall until next income
- "Your Path Forward" card when forecast goes negative
- Forecast-aware status messaging

**3. Account Management ✅**
- Multiple bank accounts
- Starting balance tracking
- Account aggregation

**4. Income Sources ✅**
- Recurring income (weekly, bi-weekly, semi-monthly, monthly, etc.)
- One-time income
- Start/end date support
- **Gated:** 10 limit for Free tier

**5. Bill Management ✅**
- Recurring bills (rent, utilities, subscriptions)
- Due date tracking
- Category organization
- All frequencies supported (weekly through yearly)
- **Gated:** 10 limit for Free tier

**6. CSV Transaction Import ✅**
- **YNAB-inspired dark theme UI** with step progress indicator
- **Column auto-detection** for common CSV formats (date, description, amount patterns)
- **Duplicate detection** - compares against last 500 transactions with visual warnings
- **Enhanced drag-and-drop upload** with visual feedback
- Review table with search + filters
- Date cutoff filter (defaults to first day of current month)
- Select-all checkbox with indeterminate state

**6b. Comprehensive Filtering System ✅**
- **Reusable filter components** with dark theme styling
- **URL persistence** - filters saved in URL for bookmarking and sharing
- **Instant client-side filtering** - no page reloads
- **Collapsible filter panels** with active filter count badges
- **Page-specific filters:**
  - **Calendar:** Transaction type, balance status, frequency, amount range, search
  - **Dashboard:** Forecast horizon (7/14/30/60 days), account selection, account type
  - **Bills:** Status, frequency, category, amount range, due soon toggle, search
  - **Income:** Status, frequency, source type, amount range, search
  - **Invoices:** Status, overdue toggle, due date range, amount range, search
  - **Accounts:** Account type, spendable status, search
- **Empty state handling** with clear filter option

**7. Scenario Testing ✅**
- "Can I afford it?" calculator
- Test hypothetical expenses
- See impact on future balance
- Save scenarios for reference

**7b. Free Tools (No Login) ✅**
- `/tools/can-i-afford-it` — quick cash flow projection
- `/tools/freelance-rate-calculator` — freelance hourly rate calculator
- `/tools/invoice-payment-predictor` — invoice payment date predictor (Net terms + weekends + client lateness)
- `/tools/income-variability-calculator` — measure freelance income stability (CV%), danger months, and emergency fund target

**8. Runway Collect (Pro) ✅**
- **YNAB-inspired dark theme UI** for list and forms
- **Summary stats dashboard** (total outstanding, awaiting payment, overdue count)
- Create professional invoices with **payment terms helper** (Net-15/30/60 quick buttons)
- Generate & download PDFs
- Email invoices directly
- Payment reminder system (friendly/firm/final)
- Auto-sync with cash flow forecasts
- **Enhanced status badges** for dark theme (draft/sent/viewed/paid)
- **Improved empty state** with value proposition messaging
- **Gated:** Pro+ only

**9. Onboarding Wizard ✅**
- 2-step guided setup (~60 seconds)
- Step 1: Quick Setup (balance + optional income)
- Step 2: Bills (with pre-populated suggestions)
- Direct redirect to calendar on completion

**10. Stripe Payments ✅**
- Secure checkout via Stripe
- Customer portal for subscription management
- Automatic tier upgrades/downgrades

**11. Feature Gating ✅**
- Usage indicators ("3/10 bills")
- Upgrade banners (amber at limit, blue near limit)
- Upgrade modals with billing toggle
- Server-side validation

**12. Analytics (PostHog) ✅**
- User behavior tracking
- Conversion funnel analysis
- Feature usage metrics
- Session recording
- NPS surveys (triggered 7 days after signup)

**13. Weekly Email Digest ✅**
- Weekly summary of next 7 days (income, bills, net change)
- Alerts: low balance, overdraft risk, bill collisions
- User-configurable schedule (day + time) with timezone support
- Unsubscribe link + open/click tracking

**14. In-App Feedback Widget ✅**
- Floating feedback button on dashboard pages
- Feedback types: bug report, suggestion, question, other
- Email notification to support team via Resend
- PostHog event tracking for feedback submissions
- User email captured for follow-up

**15. Emergency Fund Tracker ✅**
- Dashboard widget showing progress toward financial safety net
- Configurable goal: 3, 6, or 12 months of expenses
- Optional designated savings account (or uses total balance)
- Progress bar with color-coded status (rose/amber/teal)
- Displays months covered and amount remaining
- Settings form in Settings page
- Calculates goal from actual monthly bill expenses
- PostHog event: `emergency_fund_settings_updated`

### Premium Features (Post-MVP / Planned)

**14. Email Parser** (Planned)
- Forward bills to bills@cashflowforecaster.io
- Automatic bill extraction
- One-click bill creation

**15. Bank Sync (Premium)** (Planned)
- Plaid integration
- Automatic transaction import
- Real-time balance updates

**16. Notifications** (Planned)
- Low balance alerts
- Bill due reminders
- SMS alerts (Premium)

---

## Business Model

### Pricing Strategy

**Target Conversion Rate:** 10-15% (free to paid)
**Revenue Goal:** $1,000 MRR by Month 6

### Pricing Tiers (Live)

*Note: Premium tier is sunset (kept only for backwards compatibility). Live offering is Free + Pro.*

| Feature | Free ($0) | Pro ($7.99/mo) |
|---------|-----------|----------------|
| Bills | 10 | Unlimited |
| Income Sources | 10 | Unlimited |
| Forecast Days | 60 | 365 |
| Calendar View | ✅ | ✅ |
| "Can I Afford It?" | ✅ | ✅ |
| Weekly Email Digest | ✅ | ✅ |
| Bill Collision Alerts | ✅ | ✅ |
| CSV Import | ✅ | ✅ |
| Onboarding Wizard | ✅ | ✅ |
| Runway Collect Invoicing | ❌ | ✅ |
| PDF Invoices | ❌ | ✅ |
| Payment Reminders | ❌ | ✅ |
| Support | 48hr email | 24hr priority |

**Yearly Pricing:**
- Pro: $79/year (2 months free)

### Revenue Projections

| Phase | Timeline | Users | Paying | MRR | Focus |
|-------|----------|-------|--------|-----|-------|
| Beta | Month 1-2 | 100 | 0 | $0 | Feedback, bug fixes |
| Launch | Month 3 | 500 | 50 | $400 | Product Hunt, Reddit |
| Growth | Month 6 | 1,000 | 100 | $800 | Content marketing, SEO |
| Scale | Month 12 | 5,000 | 500 | $4,000 | Paid ads, partnerships |

---

## Technical Implementation

### Architecture

- **Frontend:** Next.js 14 (App Router, Server Components)
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Payments:** Stripe (Checkout, Webhooks, Customer Portal)
- **Analytics:** PostHog (events, funnels, session recording)
- **Email:** Resend (transactional emails)
- **PDF:** @react-pdf/renderer
- **Deployment:** Vercel
- **Version Control:** Git + GitHub

### Database Schema (13 tables)

1. **accounts** - User bank accounts
2. **income** - Income sources
3. **bills** - Recurring expenses
4. **user_settings** - User preferences (timezone, safety buffer, digest settings, emergency fund)
5. **scenarios** - "Can I afford it?" calculations
6. **invoices** - Runway Collect invoices
7. **invoice_reminders** - Payment reminder history
8. **parsed_emails** - Email parser results (future)
9. **weekly_checkins** - Burn rate tracking (future)
10. **notifications** - User notifications
11. **users** - Extended user profiles
12. **subscriptions** - Stripe subscription data
13. **feedback** - User feedback submissions (bug reports, suggestions, questions)

### Feature Gating Architecture

```
User Request
     │
     ▼
┌─────────────────────────────────────────┐
│ Server Component                        │
│ - getUserUsageStats()                   │
│ - canUseInvoicing()                     │
└─────────────────────────────────────────┘
     │
     ├─── Has Access ───► Normal UI
     │
     └─── No Access ────► Upgrade Prompt
                              │
                              ▼
                    ┌─────────────────────┐
                    │ Stripe Checkout     │
                    └─────────────────────┘
```

### Security

- Row Level Security (RLS) on all tables
- Users can only access their own data
- Supabase Auth + Google OAuth
- Stripe webhook signature verification
- Environment variables for all secrets
- TypeScript for type safety
- Server-side feature gate validation

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
  "zod": "^3.x"
}
```

---

## Analytics & Tracking

### PostHog Events

**Conversion Funnel:**
1. `user_signed_up` → 2. `onboarding_completed` → 3. `calendar_viewed` → 4. `upgrade_prompt_shown` → 5. `subscription_created`

**Key Metrics to Monitor:**
- Signup → Onboarding completion rate
- Onboarding → First calendar view rate
- Free → Upgrade prompt shown rate
- Upgrade prompt → Checkout initiated rate
- Checkout → Subscription created rate

### Key Events Tracked

| Event | Properties | Purpose |
|-------|------------|---------|
| `user_signed_up` | email, method | Acquisition |
| `onboarding_completed` | accounts_count, etc. | Activation |
| `calendar_viewed` | days_shown | Engagement |
| `scenario_tested` | amount_range, result | Feature usage |
| `upgrade_prompt_shown` | trigger | Conversion funnel |
| `upgrade_initiated` | tier, interval | Conversion funnel |
| `subscription_created` | tier, interval, mrr | Revenue |

### Weekly Digest Events

| Event | Properties | Purpose |
|-------|------------|---------|
| `digest_sent` | user_id, has_alerts | Retention |
| `digest_opened` | user_id | Retention |
| `digest_clicked` | user_id, link | Retention |
| `digest_unsubscribed` | user_id | Compliance |

### Feedback Events

| Event | Properties | Purpose |
|-------|------------|---------|
| `feedback_submitted` | type, message_length | Product feedback |

### Survey Events (PostHog Surveys)

| Event | Properties | Purpose |
|-------|------------|---------|
| NPS Survey | score (0-10), follow_up_text | User satisfaction |

---

## Go-to-Market Strategy

### Launch Strategy

**Phase 1: Beta Launch (Current)**
- ✅ Deploy to production
- ✅ Stripe integration complete
- ✅ Feature gating complete
- ✅ Analytics tracking live
- ✅ Landing page optimized
- 📋 Reddit launch
- 📋 Invite 100 beta users
- 📋 Collect feedback

**Phase 2: Product Hunt (Week 2-3)**
- Prepare launch materials
- Build email list
- Launch on Product Hunt
- Target: Top 5 product of the day
- Goal: 500 signups

**Phase 3: Content Marketing (Month 2-6)**
- Blog posts (cash flow tips, freelancer guides)
- SEO optimization
- Guest posts on freelancer blogs
- YouTube tutorials
- Twitter/X presence

**Phase 4: Paid Acquisition (Month 6+)**
- Google Ads (target: "cash flow forecast")
- Facebook/Instagram ads (target: freelancers)
- Reddit ads (r/freelance, r/smallbusiness)
- Budget: $500/month initially

### Reddit Launch Plan

**Primary Subreddits (Target: Anxious Creatives)**

| Subreddit | Members | Strategy |
|-----------|---------|----------|
| r/freelance | 1.2M | Lead with pain point, offer free tier |
| r/graphic_design | 4.5M | Speak to Net-30 payment pain |
| r/freelanceWriters | 200K | Focus on juggling multiple clients |
| r/webdev | 2.1M | Milestone payment challenges |
| r/marketing | 1.2M | Retainer + project income mix |

**Secondary Subreddits (Target: Side-Gig Hustlers)**

| Subreddit | Members | Strategy |
|-----------|---------|----------|
| r/uberdrivers | 200K | Daily/weekly pay timing issues |
| r/doordash | 400K | Gig income unpredictability |
| r/sidehustle | 500K | Supplemental income management |
| r/povertyfinance | 2.1M | Overdraft prevention angle |

**Post Strategy:**
- Lead with personal story (struggling with cash flow as a freelancer)
- Use the hook: "Stop guessing if you can cover rent"
- Show the problem being solved (overdraft screenshot or calendar preview)
- Offer free tier (no credit card required)
- Ask for genuine feedback
- Use platform-specific discount codes (REDDIT50, TWITTER50, LINKEDIN50)

**Messaging Angle by Subreddit:**
- **r/freelance:** "Built for the 47% of freelancers who say income instability is their #1 worry"
- **r/graphic_design:** "Waiting on client approvals and Net-30 payments? See your balance 60 days ahead."
- **r/uberdrivers:** "Know if you can cover rent before your next payout hits"

---

## SEO & Content Strategy

### Keyword Strategy (Priority Tiers)

**Tier 1 — High Intent (Bottom Funnel) — Focus Here First**
- `cash flow app for freelancers`
- `freelance income forecaster`
- `irregular income budget tool`
- `YNAB alternative for freelancers`
- `predict bank balance app`

**Tier 2 — Problem-Aware (Middle Funnel)**
- `how to budget with irregular income`
- `freelancer overdraft prevention`
- `will I run out of money before client pays`
- `cash flow planning for self-employed`
- `stop living paycheck to paycheck freelancer`

**Tier 3 — Profession-Specific**
- `cash flow tool for graphic designers`
- `financial planning for freelance writers`
- `budget app for marketing consultants`
- `money management for web developers`

**Tier 4 — Location-Specific (Blog Content)**
- `freelance financial planning NYC`
- `Austin freelancer budget tips`
- `cash flow help for LA creatives`
- `Miami freelancer money management`

**Tier 5 — Competitor Comparison**
- `YNAB vs Cash Flow Forecaster`
- `Mint alternative irregular income`
- `why QuickBooks doesn't work for freelancers`
- `best budgeting app for irregular income`

### Content Roadmap

**Phase 1: Launch Content (Month 1)**
1. "How to Budget When Your Income Changes Every Month" (pillar post)
2. "Why Traditional Budgeting Apps Fail Freelancers" (comparison angle)
3. "The Freelancer's Guide to Never Overdrafting Again" (pain-point focused)

**Phase 2: SEO Content (Months 2-3)**
4. "YNAB Alternative for Freelancers: A Complete Comparison" (competitor page)
5. "Cash Flow Planning for Graphic Designers" (profession-specific)
6. "Financial Planning for Freelance Writers" (profession-specific)

**Phase 3: Location Content (Months 3-4)**
7. "NYC Freelancer Financial Survival Guide"
8. "Austin Freelancer Budget Tips"
9. "Cash Flow Tips for LA Creatives"

### Planned SEO Pages

| Page | URL | Target Keyword |
|------|-----|----------------|
| Cash Flow Calendar Apps Comparison | `/compare/cash-flow-calendar-apps` | cash flow calendar apps for freelancers |
| YNAB Comparison | `/compare/ynab` | YNAB alternative for freelancers |
| Mint Comparison | `/compare/mint` | Mint alternative irregular income |
| For Designers | `/for/graphic-designers` | cash flow tool for graphic designers |
| For Writers | `/for/freelance-writers` | financial planning for freelance writers |

---

## Competitive Positioning

**Positioning Statement:**
"The YNAB alternative for irregular income — forward-looking instead of backward-looking."

### Competitive Comparison

| Aspect | Cash Flow Forecaster | YNAB | Monarch Money | Mint |
|--------|---------------------|------|---------------|------|
| **Focus** | Future balance prediction | Past spending tracking | Wealth optimization | Expense categorization |
| **UI** | Calendar (60-day view) | Category budgets | Dashboard/graphs | Transaction feed |
| **Target User** | $45-90k freelancers | $80k+ households | $100k+ households | General consumers |
| **Price** | $7.99/mo | $14.99/mo | $14.99/mo | Free (ads) |
| **Unique Value** | Runway Collect invoicing | Envelope budgeting | AI insights | Bank sync |
| **Time Orientation** | Forward-looking | Backward-looking | Current state | Backward-looking |

### Why We Win

1. **Forward-Looking vs. Backward-Looking:** YNAB and Mint track where money went; we show where it will be
2. **Calendar Mental Model:** Freelancers think in dates ("Can I pay rent on the 1st?"), not categories
3. **Invoice-to-Forecast Sync:** Unique feature — invoices automatically appear as expected income
4. **Price Point:** $7.99 vs. $14.99 for YNAB/Monarch — 47% cheaper
5. **Simplicity:** No complex accounting features — just cash flow clarity

### Market Gap Confirmed

- No competitor focuses specifically on forward-looking cash flow for freelancers
- Calendar interface is unique and matches how freelancers think about money
- Invoice-to-forecast sync is a unique differentiator
- Underserved market: successful freelancers ($45-90k) who are "too busy to track, but too big to fail"

---

## Success Metrics

### Key Performance Indicators (KPIs)

**User Metrics:**
- Monthly Active Users (MAU)
- Daily Active Users (DAU)
- User retention (Day 7, Day 30)
- Onboarding completion rate
- Time to first calendar view

**Business Metrics:**
- Signup conversion rate
- Free-to-paid conversion rate
- Monthly Recurring Revenue (MRR)
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- Churn rate

**Product Metrics:**
- Calendar views per user per week
- Scenario tests per user
- Invoice creation rate (Pro users)
- Upgrade prompt → checkout rate
- Weekly digest open rate

### Target Metrics (Month 6)

| Metric | Target |
|--------|--------|
| Total Users | 1,000 |
| Paying Users | 100 |
| MRR | $800 |
| Day 7 Retention | 40% |
| Day 30 Retention | 20% |
| Free-to-Paid Conversion | 10% |
| CAC | < $10 |
| Monthly Churn | < 5% |

---

## Risk Assessment

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Supabase outage | Low | High | Error handling, status page monitoring |
| Stripe webhook failures | Medium | High | Retry logic, webhook logs |
| Calendar algorithm bugs | Low | Medium | Edge case testing, user feedback |

### Business Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Low conversion rate | Medium | High | A/B test pricing, improve onboarding |
| High churn | Medium | High | Feature improvements, user feedback |
| Competition enters market | Low | Medium | Move fast, build community |

### Mitigation Strategies

1. **Monitor PostHog conversion funnel** - Identify drop-off points
2. **Weekly user feedback review** - Stay close to customers
3. **Quick iteration cycles** - Ship improvements weekly
4. **Build community** - Reddit, Twitter presence

---

## Future Roadmap

### Phase 2 Features (Months 2-4)

- [ ] Bill collision warnings (enhanced)
- [ ] Sentry error monitoring
- [ ] Multi-currency support
- [ ] Export to CSV/PDF
- [ ] Email notifications (beyond digest)

### Phase 3 Features (Months 5-8)

- [ ] Email parser (bills@cashflowforecaster.io)
- [ ] Bank account integration (Plaid)
- [ ] AI-powered bill categorization
- [ ] Predictive analytics
- [ ] Weekly check-in prompts

### Phase 4 Features (Months 9-12)

- [ ] Couples mode
- [ ] Team/collaboration features
- [ ] API for integrations
- [ ] Mobile app (if needed)

### Long-Term Vision (Year 2+)

- B2B version (small businesses)
- White-label solution
- International expansion (UK, Canada first)
- Partnerships with freelancer platforms (Upwork, Fiverr)

---

## Contact Information

**Product:** Cash Flow Forecaster  
**Website:** https://cashflowforecaster.io  
**Email:** support@cashflowforecaster.io  
**Repository:** https://github.com/omarqouqas/cashflowforecaster

---

## Changelog

### Version 5.3 (January 20, 2026)
- Simpler Onboarding (2-step flow):
  - Reduced from 4 steps to 2 steps (~60 seconds completion)
  - Step 1: Quick Setup (balance + optional income)
  - Step 2: Bills with pre-populated suggestions
  - Direct redirect to calendar on completion
  - Removed success screen for faster time-to-value
- Emergency Fund Tracker:
  - Dashboard widget showing progress toward savings goal
  - Settings form with goal months selector (3/6/12)
  - Optional designated savings account
  - Progress bar with color-coded status
  - Calculates goal from actual monthly bill expenses
  - PostHog event tracking for settings changes
- Technical improvements:
  - Created `step-quick-setup.tsx` combining account + income
  - Database migration for emergency fund columns
  - Server action for emergency fund settings
  - Removed personal name from customer-facing emails

### Version 5.2 (January 19, 2026)
- Comprehensive filtering system:
  - Added reusable filter component library (`FilterPanel`, `FilterToggleGroup`, `FilterSegmentedControl`, `FilterAmountRange`, `FilterSearch`, `FilterDateRange`)
  - Calendar filters: transaction type, balance status, frequency, amount range, search
  - Dashboard filters: forecast horizon, account selection, account type
  - Bills filters: status, frequency, category, amount range, due soon, search
  - Income filters: status, frequency, source type, amount range, search
  - Invoices filters: status, overdue, due date range, amount range, search
  - Accounts filters: account type, spendable status, search
  - URL persistence for all filters (bookmarkable, shareable)
  - Instant client-side filtering with no page reloads
  - Collapsible filter panels with active filter count badges
  - Empty state handling with "clear all filters" option
  - Dark theme styling consistent with YNAB-inspired aesthetic
- Technical improvements:
  - Created wrapper client components for filtered views
  - Custom hooks for URL-persisted filter state management
  - TypeScript fixes for Set iteration and Stripe API version

### Version 5.1 (January 18, 2026)
- Import page YNAB-inspired redesign:
  - Applied dark theme consistency (zinc-900/800 backgrounds, zinc-100/300/400 text)
  - Added step progress indicator (Upload → Map → Import)
  - Implemented column auto-detection with regex pattern matching
  - Added duplicate detection (checks last 500 transactions)
  - Enhanced drag-and-drop upload with visual feedback
  - Improved review table with dark theme styling
- Invoices pages YNAB-inspired redesign:
  - Applied dark theme to list page, create form, and edit form
  - Added summary stats cards (total outstanding, awaiting payment, overdue count)
  - Updated status badges for dark theme (draft/sent/viewed/paid with proper colors)
  - Added payment terms helper buttons (Net-15/30/60) to create and edit forms
  - Enhanced empty state with value proposition
  - Improved table density and visual hierarchy
  - Updated Input component to dark theme globally
- UX improvements:
  - Follow-up indicator now pulses for better visibility
  - Overdue badge more prominent with colored background
  - Increased table padding for better readability
  - Enhanced hover states with teal-400 accents

### Version 5.0 (January 16, 2026)
- YNAB-inspired calendar redesign:
  - Added interactive balance trend chart (hover tooltips, click-to-jump)
  - Enhanced day cards with inline transaction display
  - Implemented hybrid responsive layout (grid/timeline)
  - Added visual polish (shimmer animations, fade-in effects, pulsing indicators)
  - Chart-to-calendar integration (click chart → scroll/expand day)
  - Fixed 8 TypeScript build errors for clean Vercel deployment
- Technical improvements:
  - Custom SVG chart (no external dependencies)
  - Touch support for mobile interactions
  - Memoized chart calculations for performance
  - Responsive layout switching at md breakpoint

### Version 4.9 (January 12, 2026)
- User feedback system:
  - Added PostHog NPS survey (triggered 7 days after signup)
  - Added in-app feedback widget (floating button on dashboard)
  - Created `feedback` database table with RLS
  - Server Action for feedback submission with email notification
- Income/Bills enhancements:
  - Added "semi-monthly" frequency option (twice a month)
  - Updated calculation logic for semi-monthly recurrence
  - Updated all income/bills forms and onboarding
- UI polish:
  - Changed "Rent" category label to "Rent/Mortgage"
  - Moved feedback button to bottom-left (avoids PostHog survey conflict)

### Version 4.8 (January 12, 2026)
- SEO positioning update:
  - Added “cash flow calendar” keyword targeting across global + homepage metadata
  - Updated landing page copy to naturally include “cash flow calendar” without changing the core hook/CTA
- New SEO pages:
  - Added `/compare` index page
  - Added `/compare/cash-flow-calendar-apps` comparison page + dedicated OG image
- Internal linking:
  - Added “Compare” to landing header navigation
  - Added footer compare link (“Compare Cash Flow Apps”)
  - Updated sitemap priorities and standardized sitemap URLs to `https://www.cashflowforecaster.io`
- UX polish:
  - Made “Safety buffer” clickable (links to Settings) with a mobile-friendly tap target
- Build stability:
  - Fixed Vercel build failure caused by Unicode regex flag usage in comparison page rendering

### Version 4.5 (January 8, 2026)
- Social sharing improvements:
  - Added dynamic OG image at `/opengraph-image` and Twitter image at `/twitter-image`
  - Updated homepage metadata (stronger social titles + canonical URL)
  - Fixed tool OG image routing for `/tools/can-i-afford-it` (removed static metadata image overrides so route `opengraph-image.tsx` is used)
- Dev stability:
  - Resolved Windows-specific Next/OG rendering issues by standardizing OG image routes on Edge runtime

### Version 4.6 (January 9, 2026)
- Added a third free tool: **Invoice Payment Predictor**
  - Predicts expected payment date from invoice date + terms (Net-7…Net-90/custom)
  - Adjusts for weekends and slow-paying clients
  - Supports multiple invoices list + optional amounts
- Fixed free tool email capture so `/api/tools/email-results` sends the correct subject/body for **invoice-payment-predictor**

### Version 4.7 (January 10, 2026)
- Added a fourth free tool: **Income Variability Calculator**
  - Measures income volatility using coefficient of variation (CV%)
  - Flags “danger months” below a monthly expense threshold (optional input)
  - Recommends an emergency fund target based on volatility level (low/medium/high)
- Fixed email capture subject/body for **income-variability-calculator** in `/api/tools/email-results`

### Version 4.4 (January 5, 2026)
- Refined target market based on comprehensive market research (Claude, Gemini, ChatGPT synthesis)
- Updated value proposition to three-pillar structure
- Added SEO keyword strategy (5 tiers)
- Added geographic focus with market size data
- Updated Reddit launch plan with subreddit-specific messaging
- Enhanced competitive positioning with YNAB/Mint/Monarch comparison
- Landing page revamped with new hero, three pillars, "Who It's For" section
- Added "Who It's For" to header navigation
- Added research-backed statistics (47% income instability, $15B overdraft fees, etc.)

### Version 4.3 (January 4, 2026)
- Pricing simplification: sunset Premium tier, fold 365-day forecast into Pro
- Forecast generation now tier-based (Free: 60 days, Pro: 365 days)
- Landing page CTA polish

### Version 4.2 (January 1, 2026)
- CSV import UX fixes
- List refresh bugs fixed
- Date cutoff filter for transaction import

### Version 4.1 (December 29, 2025)
- Weekly email digest implementation
- Dashboard guidance cards (Daily Budget, Your Path Forward)

### Version 4.0 (December 21, 2025)
- Stripe live mode enabled
- Feature gating complete
- PostHog analytics integration

### Version 3.0 (December 19, 2025)
- Stripe integration (checkout, webhooks, portal)
- Subscription management

### Version 2.0 (December 17, 2025)
- Runway Collect invoicing
- Payment reminders
- Onboarding wizard

### Version 1.0 (December 15, 2025)
- Initial MVP launch
- Calendar, accounts, income, bills
- Scenario testing

---

**Document Version:** 5.3
**Last Updated:** January 20, 2026
**Status:** Live - Simpler Onboarding + Emergency Fund Tracker 🎉
**Next Review:** February 2026
