# Cashcast - Complete Product Brief

**Version:** 6.31
**Last Updated:** May 10, 2026
**Status:** Live - Tabbed Settings + Full-Width Layout + Sidebar Optimizations
**Product URL:** https://cashcast.money
**Repository:** https://github.com/omarqouqas/cashcast

---

## Executive Summary

**Product Name:** Cashcast

**Domains:** 
- Primary: cashcast.money
- Legacy redirect: cashflowforecaster.io → cashcast.money

**One-Liner:** "Stop guessing if you can cover rent."

**Hook:** "Your personal cash flow calendar for the next 365 days — with every invoice, bill, and payday mapped out."

Cashcast is a Progressive Web App that helps freelancers, gig workers, and anyone with irregular income see their bank balance up to 365 days into the future (90 days free, 365 days Pro). Unlike traditional budgeting apps that focus on past spending, Cashcast uses a daily liquidity calendar to answer the critical question: "Can I afford this expense before my next paycheck arrives?"

### Problem Statement

Millions of freelancers and gig workers struggle with cash flow uncertainty. They don't know if they can afford an expense because they can't predict when money will arrive. Traditional budgeting apps (YNAB, Mint, Monarch) focus on tracking past spending, not projecting future liquidity. This leaves a critical gap for people who need forward-looking visibility.

**Research-Backed Pain Points:**
- 47% of freelancers cite income instability as their #1 financial worry
- 39% of freelancers say income inconsistency is their second-biggest challenge (2025)
- 80% of self-employed workers with gigs as primary income couldn't handle an unexpected $1,000 expense
- Gig workers collectively pay $15 billion in overdraft fees annually

### Solution

Cashcast projects bank balance 90 days into the future using a daily calendar interface. Users input:
- Current account balances
- Income sources (with frequency: weekly, bi-weekly, monthly)
- Recurring bills (with due dates)

The app calculates and displays a 90-day calendar showing projected daily balances, color-coded to highlight low-balance days. Users can test "Can I afford it?" scenarios before making purchases.

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

**Global Freelance Economy:**
- **1.57 billion** freelancers globally (2025), projected **1.8 billion+** by 2030
- **$8.50 trillion** online freelance market value (2025), projected **$28.88 trillion** by 2033

**United States:**
- **76.4 million** freelancers in the US (2025), projected **90.1 million** by 2028
- Over **50%** of US workforce projected to freelance by 2027
- **48%** of Fortune 500 firms now use freelance platforms

**Platform Market:**
- **$7.65-8.39 billion** freelance platform market (2025)
- Projected **$16.54-16.89 billion** by 2030
- CAGR: **16.66-17.0%**

### Demographics

- **Age Distribution:** Millennials (28-43) comprise 34%, Gen Z (18-27) comprise 28% — combined 62% under age 43
- **Gen Z Growth:** By 2030, Gen Z will make up 30% of US labor force, significantly more likely to choose freelancing
- **Gender:** 60% male, 40% female in US freelance market
- **Education:** 80% have bachelor's degree or higher
- **Median Income:** Full-time independents report ~$85,000 median income

### Pain Point Statistics (Research-Backed)

| Challenge | Statistic | Source |
|-----------|-----------|--------|
| **Cash flow as failure cause** | 82% of freelance/small business failures due to poor cash flow management | Gemini Research |
| **Income instability** | 47% cite income instability as #1 financial worry | Industry surveys |
| **Can't handle emergencies** | 80% of self-employed can't comfortably face unexpected $1,000 expense | Gemini Research |
| **Late payments** | 47-50% experience late/missing payments in first 6 months | Freelancers Union |
| **Finding consistent work** | 66% struggle with securing consistent work | Industry surveys |
| **Non-billable admin time** | 36% of working hours spent on admin tasks | Gemini Research |
| **Overdraft fees** | Gig workers collectively pay $15 billion in overdraft fees annually | Industry research |

---

## Value Proposition

### North Star Metric: "Safe to Spend"

The most significant unmet need in the freelancer market is the answer to a single question: **"How much of the money in my bank account is actually mine to spend?"**

By automatically subtracting tax reserves, upcoming bills, and debt payments from the projected bank balance, Cashcast differentiates itself from QuickBooks (which shows history) and Float (which shows enterprise liquidity).

### Three Pillars of Cash Flow Clarity

**Pillar 1: Know Your Number Today**
- 90-day forward balance projection (365 days for Pro)
- Daily "safe to spend" visibility
- Color-coded low-balance warnings (amber/rose)
- Overdraft prevention before it happens
- **Value:** Eliminates the 36% of time freelancers spend on non-billable admin work

**Pillar 2: Get Paid Faster (Pro)**
- Runway Collect professional invoicing
- Automated payment reminders (friendly/firm/final)
- Invoice-to-forecast sync — see expected income immediately
- PDF generation and direct email delivery
- **Value:** Addresses the 47-50% of freelancers who experience late payments

**Pillar 3: Never Get Blindsided**
- Weekly email digest with cash flow summary
- Bill collision alerts (multiple bills same day)
- Upcoming expense warnings
- Monday morning financial clarity
- **Value:** Helps prevent the 82% of freelance failures caused by poor cash flow visibility

### Outcome Comparison: Spreadsheets vs. Automated Forecasting

| Metric | Spreadsheet Method | Automated AI Forecasting |
|--------|-------------------|--------------------------|
| **Forecast Accuracy** | Low (human error) | 30-50% higher |
| **Time Spent Weekly** | 2-5 hours | <15 minutes |
| **Liquidity Awareness** | Monthly/Quarterly | Real-time |
| **Tax Readiness** | Reactive | Proactive (automated buckets) |

*Source: Gemini Market Research (2026)*

### Landing Page Messaging

**Hero:**
- **Headline:** "Stop guessing if you can afford it."
- **Subhead:** "See your real bank balance 90 days out — no bank connection required. One number tells you what's safe to spend today without overdrafting later. Ask questions in plain English. AI answers instantly."
- **Badges:** "Built for designers, developers & consultants" | "Invoice → Forecast sync" | "AI-powered insights"
- **Social Proof:** "Join 50+ freelancers testing the beta"

**Trust Signal:**
- "No bank connection required" — addresses privacy/security objection

**Stat Callout:**
- "Built for the **47%** of freelancers who say income instability is their #1 financial worry."

**CTAs (Outcome-Focused):**
- Mid-page: "Know if you'll make rent — 90 days before it's due"
- Final: "Stop the 'can I afford this?' anxiety"

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
- 90-day cash flow projection algorithm
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
  - Free: 90 days
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
- **Custom bill categories** with user-defined names, colors, and icons
- Category management in Settings page
- Inline category creation in bill forms (no need to go to Settings)
- All frequencies supported (weekly through yearly)
- **Gated:** 10 limit for Free tier

**6. CSV & Excel Transaction Import ✅**
- **YNAB-inspired dark theme UI** with step progress indicator
- **Excel file support** (.xlsx, .xls) - parses first sheet, handles dates and formatted numbers
- **Column auto-detection** for common CSV/Excel formats (date, description, amount patterns)
- **Duplicate detection** - compares against last 500 transactions with visual warnings
- **Enhanced drag-and-drop upload** with visual feedback
- Review table with search + filters
- Date cutoff filter (defaults to first day of current month)
- Select-all checkbox with indeterminate state
- Error handling for password-protected, corrupted, or unsupported Excel files

**6b. Comprehensive Filtering System ✅**
- **Reusable filter components** with dark theme styling
- **URL persistence** - filters saved in URL for bookmarking and sharing
- **Instant client-side filtering** - no page reloads
- **Collapsible filter panels** with active filter count badges
- **Page-specific filters:**
  - **Calendar:** Transaction type, balance status, frequency, amount range, search
  - **Dashboard:** Forecast horizon (7/14/30/60/90 days), account selection, account type
  - **Bills:** Status, frequency, category, amount range, due soon toggle, search
  - **Income:** Status, frequency, source type, amount range, search
  - **Invoices:** Status, overdue toggle, due date range, amount range, search
  - **Accounts:** Account type, spendable status, search
- **Empty state handling** with clear filter option

**7. Scenario Testing ✅**
- "Can I afford it?" calculator with context-aware messaging
- Test hypothetical expenses (one-time or recurring)
- See impact on future balance with meaningful preview (expense dates only)
- "When can I afford it?" shows first affordable date when purchase isn't feasible
- Context-aware results: different messaging for already-negative vs would-go-negative
- Save scenarios for reference with correct recurring status display

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
- **Stripe Payment Links** - One-click payment for clients via Stripe Connect
- **Invoice Branding** - Upload logo and set business name for professional invoices
- **Quotes Feature:**
  - Create professional quotes with auto-generated numbers (QTE-0001)
  - Per-document currency support (independent from user default)
  - Valid until date with preset options (14/30/60 days)
  - Email quotes with PDF attachment
  - Download quote PDFs
  - Quote statuses: draft, sent, viewed, accepted, rejected, expired
  - Timeline tracking: Created → Sent → Viewed → Accepted/Rejected
  - Convert accepted quotes to invoices (preserves all details)
  - Multi-currency summary stats (Total Pending grouped by currency)
  - Expiring soon indicator (within 7 days)
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

**17. Credit Card Cash Flow Forecasting ✅**
- **Credit card account type** with specialized fields (credit limit, APR, statement/payment dates 1-31)
- **Credit utilization tracking** with color-coded badges (green <30%, amber 30-70%, rose >70%)
- **Calendar integration** showing CC payment due dates as recurring "bills"
- **Payment Scenario Simulator** modal:
  - Compare minimum payment, statement balance, and custom amounts
  - See payoff timeline and total interest for each option
  - Cash flow impact preview
  - Interest savings vs minimum payment
- CC-specific display in account cards (balance shown as debt, utilization percentage)
- **Debt Payoff Planner** (`/dashboard/debt-payoff`):
  - Compare Snowball (smallest balance first) vs Avalanche (highest APR first) strategies
  - Extra monthly payment input to see accelerated payoff
  - Side-by-side comparison showing debt-free date, total interest, total paid
  - Payoff order visualization with per-card payoff dates and interest
  - Navigation from Accounts page when 2+ credit cards have balances
  - **Payoff Timeline Chart** showing balance decrease over time with milestones
- **Credit Card filter** in Accounts page filter dropdown

**18. Account Transfers ✅**
- Transfer money between accounts with recurring or one-time schedules
- All frequencies supported (weekly, bi-weekly, semi-monthly, monthly, quarterly, annually)
- Transfers appear in calendar forecast on scheduled dates
- Smart cash flow impact: only affects balance when crossing spendable/non-spendable boundary
- "Pay Credit Card" quick action from credit card accounts
- Pause/resume functionality for recurring transfers
- Transfer form shows account balances for easy selection

**19. Data Visualization Charts ✅**
- Built with Recharts library for responsive, interactive charts
- **Forecast Balance Chart** on Dashboard:
  - Area chart showing projected balance trend
  - Lowest balance point marker
  - Safety buffer reference line
  - Color-coded positive (teal) vs negative (rose)
- **Payoff Timeline Chart** in Debt Payoff Planner:
  - Area chart showing debt decreasing over time
  - Reference lines for each card payoff milestone
  - Legend with payoff dates per card
- Dark theme styling consistent with app aesthetic
- Unique gradient IDs to prevent conflicts with multiple charts

**20. AI-Powered Probabilistic Forecasting ✅**
- **Monte Carlo Simulation** with 500 iterations for statistical robustness
- **Confidence bands** on forecast chart showing P10 (pessimistic) to P90 (optimistic) range
- **Risk metrics dashboard:**
  - "X% chance of overdraft" - probability of balance going below zero
  - "X% chance below safety buffer" - probability of dipping below user's buffer
  - "Worst case balance: $X" - P10 lowest balance across forecast period
- **Color-coded risk indicators** (emerald/amber/rose for low/medium/high risk)
- **Variance modeling** by income/bill frequency (irregular income: 25% CV, monthly: 5% CV)
- **Timing variance** for payment date uncertainty (e.g., monthly bills ±2 days)
- **Seeded PRNG** (mulberry32) for reproducible results
- **Performance optimized:** ~9ms compute time for 500 simulations × 60 days
- Addresses core user anxiety: "Will I run out of money?"

**21. AI Natural Language Queries ✅**
- **"Ask Cashcast"** - Chat modal where users ask financial questions in plain English
- **Powered by Claude** (Sonnet for complex queries, Haiku for simple ones)
- **Real-time streaming** responses via Server-Sent Events
- **Tool calling** with 6 exposed financial tools:
  - `calculate_affordability` - "Can I afford a $500 purchase next week?"
  - `calculate_payment_date` - "When will my client pay this invoice?"
  - `calculate_tax_reserve` - "How much should I set aside for taxes?"
  - `calculate_income_variability` - "How stable is my income?"
  - `calculate_hourly_rate` - "What should I charge per hour?"
  - `get_forecast_summary` - "When will my balance be lowest?"
- **Full financial context** - Claude sees user's accounts, income, bills, and settings
- **Conversation history** within session for follow-up questions
- **Tool execution indicator** shows which calculation is running
- **Rate limiting:**
  - Free tier: 5 queries per day (resets at midnight UTC)
  - Pro/Premium/Lifetime: Unlimited queries
- **Upgrade prompt** when free tier limit reached
- Marketing angle: "Talk to your finances"

**22. Smart Categorization ✅**
- **Hybrid approach:** Rule-based engine (instant, free) + Claude API fallback
- **Rule engine:** ~50 merchant patterns for common services
  - NETFLIX, SPOTIFY, HULU → Subscriptions
  - COMCAST, XFINITY, T-MOBILE → Utilities
  - GEICO, STATE FARM, BLUE CROSS → Insurance
  - UBER, LYFT, SHELL, EXXON → Transportation
- **AI fallback:** Claude categorizes unrecognized transactions
- **Tier-based limits:** Free (10), Pro/Premium/Lifetime (50) AI categorizations
- **UI integration:** Category column in import table with confidence badges
  - "Auto" (emerald) - High confidence rule match
  - "Likely" (amber) - Medium confidence AI suggestion
  - "Guess" (zinc) - Low confidence AI suggestion
- **User control:** Override any suggestion before import
- Marketing angle: "Import smarter, not harder"

**23. Proactive AI Alerts ✅**
- **Rule-based alert engine** surfacing insights before problems occur
- **4 alert types:**
  - Cash Crunch: warns when balance drops below safety buffer within 14 days
  - Bill Collision: detects 3+ bills within 2-day window
  - Invoice Risk: surfaces overdue and at-risk invoices
  - Opportunity: highlights 7+ days with sustained surplus
- **Priority system:** Critical (can't dismiss), Warning, Info, Opportunity
- **AlertBanner UI:** Collapsible list with color-coded styling
- **Email integration:** Proactive alerts included in weekly digest
- Server-side generation during dashboard page load
- Max 5 alerts to avoid overwhelming users

**24. AI Recurring Pattern Detection for PDF Import ✅**
- **Automatic detection** of recurring transactions from bank statement imports
- **Detection algorithm:** Groups transactions by similar description and amount
  - Fuzzy matching with Jaccard similarity for merchant names
  - 10% amount variance tolerance
  - Interval analysis to detect frequency (weekly to annually)
- **40+ merchant normalizations:**
  - Netflix, Spotify, Amazon, Apple Services, Google Services
  - Adobe, Microsoft 365, AWS, Heroku, Vercel, DigitalOcean
  - Planet Fitness, YMCA, Equinox
- **Confidence scoring** based on:
  - Number of occurrences (≥6 = +0.4)
  - Amount consistency (<1% variance = +0.3)
  - Interval regularity (>90% = +0.3)
- **UI integration:**
  - RecurringPatternsCard with collapsible pattern list
  - Pre-selected high-confidence patterns (≥60%)
  - Select all/none controls
  - Confidence badges with percentage
  - One-click "Apply X Patterns" to bulk-set recurring entries
- **Frequency detection thresholds:**
  - 5-9 days → Weekly
  - 10-18 days → Bi-weekly
  - ~15-20 days → Semi-monthly
  - 25-35 days → Monthly
  - 80-100 days → Quarterly
  - 350-380 days → Annually
- **Integration:** Patterns auto-apply to transaction selector when selected

**25. Automated Payment Reminders ✅**
- **Automated reminder sequence** based on invoice due dates
- Reminder stages: 3 days before, due day, 7 days overdue, 14 days overdue
- Uses existing professional templates (friendly → firm → final)
- Per-user toggle in Settings (Pro users)
- Per-invoice override option
- Daily cron job at 9 AM UTC
- Unique index prevents duplicate reminders per stage
- Coexists with manual reminder system

**26. Time Tracking + Invoicing ✅**
- **Persistent timer widget** in dashboard header
  - Start/stop/reset controls
  - Current session display with running time
  - Client/project dropdown (optional)
  - Rate input for billable tracking
  - localStorage-backed for persistence across pages
- **Time entries page** (`/dashboard/time`)
  - List of all time entries with filters (date range, client, project, billable)
  - Manual time entry form
  - Edit/delete functionality
  - Bulk selection for invoice creation
- **Invoice integration:**
  - Create invoice from selected time entries
  - Auto-calculates line items (hours × rate)
  - `invoice_items` table for detailed breakdown
  - PDF template with line items section
- **Dashboard widget:** Uninvoiced time summary
- **Settings page** (`/dashboard/time/settings`)
  - Default hourly rate
  - Default billable status
  - Rounding preferences (1, 5, 15, 30 min)

**27. Referral Program ✅**
- **Unique referral links:** 8-character codes (e.g., `cashcast.io/r/ABC123XY`)
- **Referrer reward:** 1 month free Pro when referee subscribes
- **Referee reward:** 30-day Pro trial on signup
- **Referral flow:**
  - Share link → Friend signs up → 30-day trial applied
  - When friend pays → Referrer gets 1 month credit
- **Reward logic (Stripe webhook):**
  - Lifetime users: Marked as rewarded (already have max benefits)
  - Pro subscribers: 1-month Stripe credit added to balance
  - Free users: 30-day Pro access granted in database
- **Dashboard widget:** Link sharing with copy button, stats (signed up, subscribed, rewards)
- **Database:** `referrals` table with status tracking (pending → signed_up → converted → rewarded)

**28. SMS/Push Low Balance Alerts ✅**
- **Multi-channel notification system** for critical alerts
- **SMS Alerts (via Twilio) - Pro Only:**
  - Phone number verification with 6-digit SMS code
  - Reserved for critical alerts only (cash crunch) to avoid fatigue
  - Cost: ~$0.0075/message (reason for Pro-only restriction)
  - Free users see "Upgrade to Pro" prompt in settings
- **Web Push Notifications - Free for All:**
  - Browser notifications for all alert types
  - Service worker (`public/sw.js`) for background delivery
  - Works even when app is closed
  - Free (Web Push API)
- **Unified notification router:**
  - Routes based on alert type, user preferences, and subscription tier
  - Channels: Email (default, all), SMS (Pro only, critical), Push (all, all types)
  - Per-alert-type channel preferences stored in user_settings
- **Settings UI:** Phone verification flow (Pro), push permission request (all), channel toggles
- **Integration:** Low balance cron job sends to all enabled channels after email

**13. Weekly Email Digest ✅**
- Weekly summary of next 7 days (income, bills, net change)
- Alerts: low balance, overdraft risk, bill collisions
- **Proactive AI Alerts section** with color-coded styling
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
- Designated account excluded from "Safe to Spend" and spendable balance calculations
- Quick "Set as Emergency Fund" button on all non-credit-card account cards
- Edit Account page toggle to add/remove emergency fund designation
- Settings page shows read-only designation with link to Accounts page
- "Safe to Spend" tooltip mentions emergency fund exclusion
- Progress bar with color-coded status (rose/amber/teal)
- Displays months covered and amount remaining
- Calculates goal from actual monthly bill expenses
- Server-side validation prevents credit cards as emergency fund
- PostHog events: `emergency_fund_settings_updated`, `emergency_fund_account_set`, `emergency_fund_cleared`

**16. Reports & Export ✅**
- **Reports Page** (`/dashboard/reports`) with quick reports and custom export builder
- **Quick Reports** - 4 one-click report cards:
  - Monthly Summary (free): Income vs expenses, net flow
  - Category Spending (free): Breakdown by bill category
  - Cash Forecast (Pro): Daily projected balances
  - All Data (Pro): Complete data backup
- **Custom Export Builder** - Modal with:
  - Data selection (bills, income, accounts, invoices)
  - Date range presets (This Month, Last Month, Last 30 Days, This Quarter, This Year)
  - Format selection with tier gating
- **Export Formats:**
  - CSV (free): Opens in Excel, Google Sheets, Numbers
  - Excel (Pro): Multi-sheet workbooks with auto-sized columns
  - JSON (Pro): Structured data for developers
  - PDF (coming soon)
- **Export History** - Recent exports with status, format badges, re-download
- **Tier Limits:**
  - Free: CSV only, 5 exports in history
  - Pro: All formats, unlimited history
- Database table: `exports` with 30-day retention and RLS

### Premium Features (Post-MVP / Planned)

**14. Email Parser** (Planned)
- Forward bills to bills@cashcast.money
- Automatic bill extraction
- One-click bill creation

**15. Bank Sync (Premium)** (Planned)
- Plaid integration
- Automatic transaction import
- Real-time balance updates

**16. SMS/Push Notification Channels ✅**
- **Multi-channel notification system** for critical alerts
- **SMS Alerts (via Twilio) - Pro Only:**
  - Phone number verification with 6-digit SMS code
  - Reserved for critical alerts only (cash crunch) to avoid fatigue
  - ~$0.0075/message cost (reason for Pro restriction)
- **Web Push Notifications - Free for All:**
  - Browser notifications for all alert types
  - Service worker for background delivery
  - Works even when app is closed
  - Free (Web Push API)
- **Notification Router:**
  - Unified routing based on alert type, preferences, and subscription tier
  - Channels: Email (all), SMS (Pro only, critical), Push (all)
  - Per-alert-type channel preferences in settings
- **Settings UI:**
  - Phone verification flow (Pro users only)
  - Push notification permission request (all users)
  - Enable/disable toggles per channel
- **Integration:** Low balance cron job sends to all enabled channels

---

## Business Model

### Pricing Strategy

**Target Conversion Rate:** 10-15% (free to paid)
**Revenue Goal:** $1,000 MRR by Month 6

### Pricing Tiers (Live)

*Note: Premium tier is sunset (kept only for backwards compatibility). Live offering is Free + Pro + Lifetime.*

| Feature | Free ($0) | Pro ($7.99/mo) | Lifetime ($99) |
|---------|-----------|----------------|-----------------|
| Bills | 10 | Unlimited | Unlimited |
| Income Sources | 10 | Unlimited | Unlimited |
| Forecast Days | 90 | 365 | 365 |
| AI Queries (Ask Cashcast) | 5/day | Unlimited | Unlimited |
| Calendar View | ✅ | ✅ | ✅ |
| "Can I Afford It?" | ✅ | ✅ | ✅ |
| Weekly Email Digest | ✅ | ✅ | ✅ |
| Bill Collision Alerts | ✅ | ✅ | ✅ |
| Push Notifications | ✅ | ✅ | ✅ |
| SMS Alerts (Critical) | ❌ | ✅ | ✅ |
| CSV Import | ✅ | ✅ | ✅ |
| Onboarding Wizard | ✅ | ✅ | ✅ |
| Runway Collect Invoicing | ❌ | ✅ | ✅ |
| PDF Invoices | ❌ | ✅ | ✅ |
| Payment Reminders | ❌ | ✅ | ✅ |
| Time Tracking | ❌ | ✅ | ✅ |
| Referral Rewards | ✅ | ✅ | ✅ |
| CSV Export | ✅ | ✅ | ✅ |
| Excel/JSON Export | ❌ | ✅ | ✅ |
| Export History | 5 items | Unlimited | Unlimited |
| Support | 48hr email | 24hr priority | 24hr priority |

**Pricing Options:**
- Pro Monthly: $7.99/mo
- Pro Yearly: $79/year (2 months free)
- Lifetime: $99 one-time (permanent Pro access, no renewals)

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

### Database Schema (17 tables + extended fields)

1. **accounts** - User bank accounts (extended with CC fields: credit_limit, apr, minimum_payment_percent, statement_close_day, payment_due_day)
2. **income** - Income sources
3. **bills** - Recurring expenses
4. **user_settings** - User preferences (timezone, safety buffer, digest settings, emergency fund, currency)
5. **scenarios** - "Can I afford it?" calculations
6. **invoices** - Runway Collect invoices
7. **invoice_reminders** - Payment reminder history
8. **quotes** - Runway Collect quotes (quote_number, client_name, client_email, amount, currency, valid_until, description, status, sent_at, viewed_at, accepted_at, rejected_at, converted_invoice_id)
9. **parsed_emails** - Email parser results (future)
10. **weekly_checkins** - Burn rate tracking (future)
11. **notifications** - User notifications
12. **users** - Extended user profiles
13. **subscriptions** - Stripe subscription data
14. **feedback** - User feedback submissions (bug reports, suggestions, questions)
15. **exports** - Export history (report type, format, config, file URL, status)
16. **user_categories** - Custom bill categories (name, color, icon, sort_order)
17. **transfers** - Account-to-account transfers (from_account_id, to_account_id, amount, frequency, transfer_date, is_active)

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
- `YNAB vs Cashcast`
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
"Cash flow forecasting built for freelancers — with invoicing and tax tooling that general budgeting apps lack."

**Note (May 2026):** Forward-looking forecasting is no longer a unique differentiator. PocketSmith, Quicken Simplifi, and Cash Flow Calendar all forecast forward. Our moat is freelancer specificity + invoicing + tax tooling.

### Competitive Comparison (Updated May 2026)

| Aspect | Cashcast | PocketSmith | Simplifi | YNAB | Monarch |
|--------|----------|-------------|----------|------|---------|
| **Focus** | Freelancer cash flow + invoicing | General forecasting | Household finances | Past spending | Wealth optimization |
| **Target User** | $45-90k freelancers | General consumers | Households | Households | Households |
| **Forward-Looking** | ✅ 90-365 days | ✅ Up to 30 years | ✅ 12 months | ❌ No | ⚠️ Partial |
| **Built-in Invoicing** | ✅ Runway Collect | ❌ | ❌ | ❌ | ❌ |
| **Tax Bucketing (US/CA)** | ✅ Full | ❌ | ❌ | ❌ | ❌ |
| **Price** | $7.99/mo | $9.95-26.63/mo | $5.99/mo | $14.99/mo | $8.33/mo |
| **Bank Sync** | ❌ (Coming) | ✅ 12,000+ | ✅ 14,000+ | ✅ | ✅ |

### Why We Win (Updated May 2026)

**Note:** "Forward-looking" is no longer a differentiator — PocketSmith, Simplifi, and CFF all forecast forward.

1. **Built for freelancers, not households** — Irregular income, project-based revenue, late client payments are first-class concerns
2. **Invoice-to-Forecast Sync:** Genuinely unique at our price point — invoices automatically appear as expected income
3. **Country-specific tax bucketing** — US quarterly estimates, Canadian GST/HST, CPP, installments. No competitor offers this.
4. **Calendar Mental Model:** "Can I pay rent on the 1st?" framing, not category budgets
5. **Price-to-Feature Ratio for Freelancers:** Cheaper than PocketSmith ($9.95), with freelancer features Simplifi ($5.99) lacks
6. **Simpler Setup:** 5 minutes vs PocketSmith's 30+ minute learning curve

### Recent Market Shifts (Q1-Q2 2026)

| Shift | Impact |
|-------|--------|
| Quicken Simplifi at $5.99/mo with 12-month forecasting | Undercuts our price; "forward-looking" no longer unique |
| Monarch added cash flow visualization at $8.33/mo | Partial forecasting in mainstream apps |
| PocketSmith actively positioning toward freelancers | Direct competitor with 16-year head start |

**Implication:** Forward-looking forecasting is now table stakes. Differentiation must come from:
- Freelancer specificity (irregular income handling)
- Invoice-to-forecast sync (unique)
- Country-specific tax tooling (unique)

### Specialized Forecasting Competitor Analysis

| Feature | Pulse | Float | PocketSmith | Cashcast |
|---------|-------|-------|-------------|----------|
| **Primary Value** | Cash Flow Management | Liquidity Visibility | Long-range forecasting | Freelancer cash flow + invoicing |
| **Data Method** | Enhanced Spreadsheet | Automated Sync (Xero/QBO) | Bank sync (12k+) | Manual + CSV Import |
| **Invoicing** | ❌ | ❌ | ❌ | ✅ Runway Collect |
| **Tax Tooling** | ❌ | ❌ | ❌ | ✅ US + Canada |
| **Pricing** | $29-$89/month | $59-$199/month | $9.95-$26.63/month | $7.99/month or $99 lifetime |
| **Target User** | Small Agencies | Growing SMBs | General consumers | Freelancers with irregular income |

### Market Gap (Updated May 2026)

The gap has shifted. Forward-looking is no longer unique. The remaining gap:

| Gap | Competitors | Our Position |
|-----|-------------|--------------|
| Invoicing + forecasting in one tool | None at <$15/mo | ✅ Runway Collect included |
| Self-employment tax planning | None | ✅ US + Canada specific |
| Freelancer-first design | CFF is similar | ✅ Core focus |

**Opportunity:** "Freelancer financial hub" — invoicing, forecasting, and tax tracking in one place.

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

### Competitive Response Priorities (May 2026)

| Priority | Item | Rationale |
|----------|------|-----------|
| P1 | Update homepage hero messaging | Lead with freelancer-specific + tax + invoicing, not "forward-looking" alone |
| P2 | Create Quicken Simplifi comparison page | `/compare/simplifi` — address $5.99/mo price competitor |
| P2 | Strengthen "Safe to Spend" positioning | This metric is unique and addresses core anxiety |
| P3 | Canadian bank sync (Flinks) | Neutralize PocketSmith/Simplifi advantage in Canada |

### Phase 2 Features (Months 2-4)

- [x] Bill collision warnings (calendar banner + day detail + email digest)
- [x] Export to CSV/Excel/JSON (Reports & Export feature)
- [x] PocketSmith comparison page (`/compare/pocketsmith`)
- [ ] Sentry error monitoring
- [ ] Multi-currency support
- [ ] Email notifications (beyond digest)

### Phase 3 Features (Months 5-8)

- [ ] Email parser (bills@cashcast.money)
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

## Canadian Market Opportunity (Ontario Focus)

### Why Canada Matters

Canada represents a strategic expansion opportunity due to:
- Clear regulatory framework (Consumer-Driven Banking Act launching 2026)
- Strong freelance ecosystem in major metros (Toronto, Vancouver, Montreal)
- Specific tax compliance requirements that create cash flow challenges

### Canadian Tax Compliance Pain Points

| Tax Type | Threshold | Cash Flow Impact |
|----------|-----------|------------------|
| **GST/HST Registration** | $30,000 gross revenue (4 consecutive quarters) | 13% of every invoice must be "set aside" for remittance |
| **Income Tax Installments** | $3,000 net tax owing | Quarterly outflows (March 15, June 15, Sept 15, Dec 15) |
| **CPP Contributions** | >$3,500 earnings | Up to $8,068.20 annually (self-employed pay both portions) |
| **Corporate Tax (CCPC)** | $500,000 active income | Access to Small Business Deduction rates |

### Product Implications for Canada

**Potential Canadian-Specific Features:**
- **HST Vault:** Automatically "slice" 13% off incoming payments in Ontario to show true liquidity
- **Quarterly Installment Reminders:** Deadlines specific to Canadian tax calendar
- **CPP Planning:** Help freelancers budget for the "double-whammy" of paying both employee and employer CPP portions
- **GST/HST Threshold Tracking:** Alert when approaching $30,000 registration threshold

**Note:** These features would differentiate us from US-focused competitors and establish a beachhead in the Canadian market before international expansion.

---

## Contact Information

**Product:** Cashcast  
**Website:** https://cashcast.money  
**Email:** support@cashcast.money  
**Repository:** https://github.com/omarqouqas/cashcast

---

## Changelog

### Version 6.26 (April 29, 2026)
- **Automated Payment Reminders:**
  - Automatic reminder emails based on invoice due dates
  - 4-stage reminder sequence: pre-due (3 days), due day, overdue (7 days), final (14 days)
  - Daily cron job at 9 AM UTC processes eligible invoices
  - Per-user toggle in Settings (Pro users only)
  - Per-invoice override option (null = inherit from user setting)
  - Uses existing professional templates (friendly/firm/final)
  - Unique index prevents duplicate reminders per stage
  - Coexists with manual reminder system
- **New Files:**
  - `lib/reminders/` - Reminder scheduling and sending logic
  - `app/api/cron/invoice-reminders/route.ts` - Daily cron endpoint
  - `lib/actions/update-auto-reminder-settings.ts` - Settings server action
  - `components/settings/auto-reminders-form.tsx` - Settings UI component
- **Database Migration:**
  - `user_settings.auto_reminders_enabled` - Global toggle
  - `invoices.auto_reminders_enabled` - Per-invoice override
  - `invoice_reminders.source` - Track manual vs auto
  - `invoice_reminders.reminder_stage` - Track which stage was sent
- **Modified Files:**
  - `vercel.json` - Added cron job at 9 AM UTC
  - `app/dashboard/settings/page.tsx` - Added AutoRemindersForm

### Version 6.24 (April 9, 2026)
- **Proactive AI Alerts:**
  - Rule-based alert engine surfacing actionable insights before problems occur
  - 4 alert types: cash crunch, bill collision, invoice risk, opportunity
  - Priority system: critical (can't dismiss), warning, info, opportunity
  - AlertBanner component with collapsible UI and dismiss functionality
  - Integrated into weekly email digest with color-coded styling
  - Replaced legacy dashboard warning banners with unified AlertBanner
  - Server-side generation during dashboard page load
- **New Files:**
  - `lib/alerts/` - Alert engine with modular rule system
  - `components/alerts/alert-banner.tsx` - Collapsible alert UI
- **Modified Files:**
  - `app/dashboard/page.tsx` - Generate and pass alerts to client
  - `components/dashboard/dashboard-content.tsx` - Display AlertBanner
  - `lib/email/generate-digest-data.ts` - Generate alerts for email
  - `components/emails/weekly-digest.tsx` - Render alerts in email
- **Bug Fixes:**
  - Fixed invoice count bug (dashboard showing 3 vs 11 actual overdue)
  - Fixed bill collision balance calculation (was double-counting)
  - Removed duplicate warning systems (unified under AlertBanner)

### Version 6.23 (April 6, 2026)
- **AI-Powered Weekly Digest Insights:**
  - Enhanced weekly email digest with 2-3 AI-generated personalized insights
  - Uses Claude to analyze user's financial data and provide actionable tips
  - Graceful fallback to rule-based insights if AI fails
  - Violet-themed "AI Insights" section in email template
- **New Files:**
  - `lib/email/generate-ai-insights.ts` - AI insight generator with fallback
- **Modified Files:**
  - `lib/email/generate-digest-data.ts` - Added aiInsights field
  - `components/emails/weekly-digest.tsx` - Added AI insights section

### Version 6.22 (April 6, 2026)
- **Ask Cashcast Suggested Questions:**
  - Added 4 clickable suggested questions in modal empty state
  - Questions auto-submit when clicked for instant results
  - Helps users discover what they can ask the AI
  - Questions: affordability, lowest balance, tax savings, income stability
- **File Modified:**
  - `components/ask/ask-modal.tsx` - Added suggested questions UI

### Version 6.21 (April 6, 2026)
- **Ask Cashcast FAB - App-Wide:**
  - Moved FAB from dashboard-only to authenticated app layout
  - Now visible on all /dashboard/* pages (Bills, Income, Invoices, Reports, Settings, Calendar, etc.)
  - Consistent AI access point across the entire authenticated experience
- **Files Modified:**
  - `app/dashboard/layout.tsx` - Added AskButton FAB
  - `components/dashboard/dashboard-content.tsx` - Removed duplicate FAB

### Version 6.20 (April 6, 2026)
- **Landing Page AI Feature Coverage:**
  - Hero: Added "AI-powered insights" badge and "Ask questions in plain English. AI answers instantly." tagline
  - How it Works: Step 3 mentions AI-powered confidence bands
  - Features: New "AI-Powered Features" section with 3 cards (Ask Cashcast, Know Your Risk, Auto-Categorize)
  - Pricing: Both tiers now list AI features (queries/day, categorizations/import)
  - FAQs: 5 new AI-related questions (Ask Cashcast, confidence bands, auto-categorization, data privacy)
- **Files Modified:**
  - `app/page.tsx` - Hero badges, How it Works, Features section with AI cards
  - `components/pricing/pricing-section.tsx` - AI features in tier lists
  - `components/landing/faq-section.tsx` - 5 new AI FAQs + updated Free vs Pro FAQ

### Version 6.19 (April 6, 2026)
- **Branding Refresh:**
  - New favicons (ico, 16x16, 32x32) and apple-touch-icon (180px)
  - New PWA icons (192x192, 512x512) with maskable purpose
  - SVG horizontal lockup replaces text logo in dashboard and landing headers
  - Light and dark background variants available
  - Updated SEO schema with new logo URL
  - Removed deprecated logo assets

### Version 6.18 (April 6, 2026)
- **Smart Categorization for Imports:**
  - Hybrid categorization: rule-based engine + Claude API fallback
  - Rule engine with ~50 merchant patterns (Subscriptions, Utilities, Insurance, Transportation, etc.)
  - AI fallback for unrecognized transactions (tier-based: Free 10, Pro 50)
  - Category column in transaction selector with confidence badges
  - User can override suggestions before import
- **New Files:**
  - `lib/categorization/types.ts` - Type definitions
  - `lib/categorization/rules.ts` - ~50 merchant patterns
  - `lib/categorization/rule-engine.ts` - Pattern matching logic
  - `lib/categorization/ai-categorize.ts` - Claude API integration
  - `lib/categorization/index.ts` - Exports and orchestration
  - `app/api/categorize/route.ts` - API endpoint with auth, validation, tier limits
- **Modified Files:**
  - `components/import/import-page-client.tsx` - Categorization integration
  - `components/import/transaction-selector.tsx` - Category column + badges
- **Bug Fixes:**
  - Rules now use proper category names (Transportation, Food & Dining) instead of hardcoded "Other"
  - AI categorization processes first N transactions when over limit (was skipping entirely)
  - API validates transaction structure to prevent malformed prompts

### Version 6.17 (April 6, 2026)
- **AI Natural Language Queries ("Ask Cashcast"):**
  - Chat modal for asking financial questions in plain English
  - Powered by Claude API (Sonnet for complex, Haiku for simple queries)
  - Real-time streaming responses via Server-Sent Events (SSE)
  - 6 tools exposed to Claude: affordability, payment date, tax reserve, income variability, hourly rate, forecast summary
  - Full user financial context passed to Claude (accounts, income, bills, settings)
  - Conversation history within session for follow-up questions
  - Tool execution indicator showing which calculation is running
  - Rate limiting: 5 queries/day free, unlimited for Pro/Premium/Lifetime
  - Upgrade prompt when limit reached with remaining queries counter
- **New Files:**
  - `lib/ai/client.ts` - Anthropic SDK client and model selection
  - `lib/ai/tools.ts` - Tool definitions (JSON schemas for Claude)
  - `lib/ai/execute-tool.ts` - Tool execution dispatcher
  - `lib/ai/system-prompt.ts` - System prompt builder with user context
  - `lib/ai/context.ts` - Fetch user financial data
  - `lib/ai/usage.ts` - Daily query tracking for rate limiting
  - `lib/ai/types.ts` - TypeScript types
  - `app/api/ai/chat/route.ts` - Streaming chat API endpoint
  - `components/ask/ask-button.tsx` - Trigger button (FAB, card, nav variants)
  - `components/ask/ask-modal.tsx` - Chat modal with streaming responses
  - `supabase/migrations/20260406000001_add_ai_query_usage.sql` - Usage tracking table
- **Modified Files:**
  - `components/dashboard/dashboard-content.tsx` - Added AskButton
  - `lib/stripe/feature-gate.ts` - Exported getUserTier for AI usage
  - `.env.example` - Added ANTHROPIC_API_KEY
- **Dependencies:**
  - Added `@anthropic-ai/sdk` for Claude API access

### Version 6.16 (April 4, 2026)
- **AI-Powered Probabilistic Forecasting (Monte Carlo Simulation):**
  - New Monte Carlo simulation engine running 500 iterations per forecast
  - Confidence bands (P10/P50/P90) displayed on forecast chart
  - Risk metrics component showing probability of overdraft, worst-case balance
  - Color-coded risk indicators (low/medium/high)
  - Variance configuration by frequency type (irregular income: 25% CV, monthly: 5% CV)
  - Timing variance for payment date uncertainty
  - Seeded PRNG (mulberry32) for reproducibility
  - Performance: ~9ms for 500 simulations × 60 days (target was <200ms)
- **New Files:**
  - `lib/calendar/monte-carlo/types.ts` - Type definitions
  - `lib/calendar/monte-carlo/variance-config.ts` - Variance parameters
  - `lib/calendar/monte-carlo/random.ts` - PRNG and distribution utilities
  - `lib/calendar/monte-carlo/simulation.ts` - Core Monte Carlo engine
  - `lib/calendar/monte-carlo/index.ts` - Public exports
  - `components/dashboard/risk-metrics.tsx` - Risk metrics display
- **Modified Files:**
  - `lib/calendar/types.ts` - Added monteCarlo field to CalendarData
  - `app/dashboard/page.tsx` - Integrated Monte Carlo after generateCalendar()
  - `components/charts/forecast-balance-chart.tsx` - Added confidence band Areas
  - `components/dashboard/dashboard-content.tsx` - Integrated RiskMetrics component
- **Bug Fix:** Fixed timing shift causing transactions to disappear instead of moving to target days

### Version 6.15 (February 11, 2026)
- **Landing Page Repositioning (Sacred Seven PM Framework Review):**
  - Conducted comprehensive product analysis using "Product Management's Sacred Seven" framework
  - Updated headline: "Forecast Your Cash Flow. Get Paid Faster." → "Stop guessing if you can afford it."
  - Updated subheadline to focus on outcome and trust signal ("no bank connection required")
  - Added social proof: "Join 50+ freelancers testing the beta"
  - Updated CTAs to be outcome-focused (e.g., "Know if you'll make rent — 90 days before it's due")
  - Updated meta title: "Cash Flow Calendar for Freelancers" → "Stop Guessing If You Can Afford It"
  - Updated meta descriptions and OpenGraph tags
- **New Documentation:**
  - `seven-sacred-PM-skills.md` - Complete Sacred Seven framework analysis with recommendations
  - `implementation-plan.md` - Phased action plan (P0-P3) with validation checkpoints
- **Strategic Insights:**
  - Identified product identity crisis (too many features diluting core value)
  - Identified pricing psychology mismatch (targeting anxious users with another subscription)
  - Identified build-to-validate ratio issue (58 days development, ~13 users)
  - Established validation checkpoint: 50 active users, 5 paying customers, 3 testimonials before new features
- **Files Modified:**
  - `app/page.tsx` - Landing page headline, subheadline, CTAs, meta tags, social proof

### Version 6.14 (February 8, 2026)
- **SEO Blog Content Expansion:**
  - 6 new SEO-optimized blog posts targeting key content gaps
  - **Credit Card Cash Flow Forecasting** - Utilization tracking & payment planning guide
  - **Debt Payoff: Snowball vs Avalanche** - Strategy comparison for irregular income
  - **Import Bank Transactions from Excel** - Step-by-step import guide with HowTo schema
  - **Why We Offer a $99 Lifetime Deal** - Subscription fatigue messaging, YNAB comparison
  - **Export Cash Flow Data for Tax Season** - 1099 contractor guide with HowTo schema
  - **How to Migrate from YNAB** - Complete migration walkthrough
  - Each post includes: OpenGraph image generation, JSON-LD schemas (Article, HowTo, FAQ), internal cross-linking
  - Blog count increased from 10 to 16 total posts
  - Updated `lib/blog/posts.ts` with metadata for all 6 new posts
  - Updated `docs/content-update-roadmap.md` marking all blog posts complete

### Version 6.13 (February 8, 2026)
- **Excel File Import Support:**
  - Added .xlsx and .xls file support to both generic and YNAB import pages
  - Uses existing `xlsx` package (already installed for exports)
  - Parses first sheet of Excel workbooks automatically
  - Handles Excel date serial numbers (converted to YYYY-MM-DD format)
  - Handles formatted numbers and currency values correctly
  - Detailed error messages for password-protected, corrupted, or unsupported files
- **New Files:**
  - `lib/import/parse-xlsx.ts` - Excel parsing utility with `parseExcel()`, `isExcelFile()`, `isSupportedSpreadsheet()`
- **Import Feature Bug Fixes:**
  - Added `generateId()` utility with `crypto.randomUUID()` fallback for older browsers
  - Fixed Excel error handling with specific messages for common issues
  - Fixed operator precedence bug in column-mapper.tsx (`hasDupes` logic)
  - Transaction selector now clears error messages when filters change
- **Additional Bug Fixes:**
  - Fixed compact currency formatting showing "$1K" instead of "$1.2K" for non-round thousands
  - Added validation to prevent zero/negative amounts in transfer create/update actions

### Version 6.12 (February 4, 2026)
- **Account Transfers Feature:**
  - New `/dashboard/transfers` page to manage all transfers
  - Transfer form with source/destination account selection
  - Support for recurring transfers (weekly, bi-weekly, semi-monthly, monthly, quarterly, annually)
  - One-time transfer support with pause/resume functionality
  - "Pay Credit Card" button on credit card account cards (pre-fills destination)
  - Transfers integrated into calendar cash flow forecast
  - Smart cash flow impact: only affects balance when crossing spendable/non-spendable boundary
  - Account balance display in transfer form dropdowns
  - Transfer occurrences calculated same as bills (handles all frequencies)
  - Database table: `transfers` with RLS policies
- **Credit Cards Dashboard Section:**
  - Dedicated Credit Cards section on dashboard (separate from Cash accounts)
  - Total debt display with overall utilization percentage
  - Per-card breakdown: balance, limit, utilization progress bar
  - Color-coded utilization warnings (green <30%, amber 30-50%, red >50%)
  - Quick "Pay" button on each card linking to transfer form (pre-filled with amount)
  - "Add Card" shortcut button for easy credit card creation
  - Next payment due date reminder
  - Accounts card renamed to "Cash" and excludes credit cards
- **Bug Fixes:**
  - Fixed transfer date timezone shift (Feb 4 showing as Feb 3) - use `formatDateOnly` instead of `formatDate`
  - Fixed transfers not appearing in calendar day detail modal - added Transfers section with ArrowRightLeft icon
  - Fixed transfers not counted in calendar day transaction count
  - Fixed pause button hover visibility - added `hover:bg-zinc-700` class
  - Fixed "View all credit cards" link to use valid "Manage accounts" route

### Version 6.11 (February 3, 2026)
- **Import Page UX Polish** (10 improvements):
  - Auto-detect date range from CSV data (no more empty results on initial load)
  - Show transaction count in import button ("Import 5 transactions" instead of "Select rows to import")
  - Remove premature "Invoice matching coming soon" banner (reduces UI clutter)
  - Prioritize Date, Description, Amount columns in preview table
  - Mask sensitive data (account numbers) in preview (shows last 4 digits only)
  - Move Select all/Deselect all buttons near transaction table (better proximity)
  - Display dates in unambiguous human-readable format ("Nov 29, 2025" instead of YYYY-MM-DD)
  - Hide YNAB import banner after CSV is uploaded
  - Improve font colors for better visibility (zinc-500 → zinc-400/zinc-300)
  - Improved color contrast throughout import components for accessibility
- **Import Recurring Entries Feature:**
  - Import wizard now offers 5 action options: Ignore, One-time income, Recurring income, One-time bill, Recurring bill
  - Frequency dropdown appears when recurring is selected (weekly, bi-weekly, semi-monthly, monthly, quarterly, annually)
  - Works in both generic CSV import and YNAB import
- **Income Frequency Expansion:**
  - Added quarterly and annually frequency options to income (previously bills-only)
  - Updated income forms, filters, cards, and calculations
  - Use cases: quarterly dividends, annual bonuses, tax refunds, seasonal income

### Version 6.10 (February 2, 2026)
- **YNAB CSV Import Feature:**
  - Dedicated YNAB import page at `/dashboard/import/ynab`
  - Auto-detects YNAB format (basic and register exports)
  - Handles Outflow/Inflow column structure automatically
  - Uses YNAB categories to suggest income vs bill classification
  - Link to YNAB import from generic import page
- **Bug Fixes (11 total):**
  - Fixed one-time bills/income not showing dates (only showed if future)
  - Fixed missing null check in income-card for `income.next_date`
  - Fixed UUID regeneration when existingTransactions loads (both import pages)
  - Fixed React setState inside setState callback in transaction-selector
  - Fixed file input not resetting (can't re-upload same file)
  - Fixed Date serialization bug in CalendarHybridView (desktop calendar crash)
  - Fixed UTC date parsing bugs in invoices.ts, send-reminder.ts, quotes.ts
  - Fixed unhandled promise and unmount issues in scenario-modal.tsx
  - Fixed missing useEffect dependency in filter-panel.tsx
  - Fixed redundant timeout logic in weekly-digest route.ts

### Version 6.9 (February 2, 2026)
- **Lifetime Pricing Adjustment:**
  - Reduced lifetime deal from $149 to $99 (competitive with Cash Flow Calendar's $72)
  - Updated savings text to "37% vs 2 years of Pro (yearly)" — honest comparison
  - Updated all UI components, pricing pages, and documentation
- **Pro→Lifetime Refund Fix:**
  - Fixed prorated refund logic — now refunds to customer's payment method (not just Stripe credit)
  - Excludes lifetime purchase charge from refund search
  - Handles yearly Pro members with larger prorated amounts correctly
- **Checkout Success Messages:**
  - Added success banners on dashboard after checkout
  - Different styling for Pro (teal) vs Lifetime (amber) purchases
- **Competitor Migration Pages:**
  - New `/compare/ynab` page — Target YNAB users frustrated with $14.99/mo pricing
  - New `/compare/mint` page — Capture Mint refugees with migration guide
  - SEO-optimized with structured data and comparison tables

### Version 6.8 (January 29, 2026)
- **Lifetime Deal Feature:**
  - One-time $99 payment for permanent Pro access
  - New `createLifetimeCheckoutSession()` server action for Stripe one-time payment
  - Webhook handler for `checkout.session.completed` with lifetime purchase metadata
  - Automatic cancellation of existing Pro subscription with prorated refund
  - Promotional banner component (`LifetimeDealBanner`) with amber/gold styling
  - Banner dismissible with 7-day localStorage cooldown
  - Banner shows on Dashboard, Invoices, Quotes, and Settings pages
  - Hidden for lifetime/premium users, shown for free/pro users
  - `SubscriptionStatus` component updated with Sparkles icon for lifetime tier
  - Shows "Lifetime access — no renewal needed" instead of renewal date
  - "Manage" button hidden for lifetime users
  - Pricing comparison table updated on compare page
  - Feature gating: Lifetime tier has same limits as Pro
  - Bug fixes: Safari localStorage, race condition protection, operation ordering

### Version 6.7 (January 29, 2026)
- **Quotes Feature (Runway Collect):**
  - New `quotes` table with RLS policies
  - Auto-generated quote numbers (QTE-0001 format)
  - Quote statuses: draft, sent, viewed, accepted, rejected, expired
  - Per-document currency support (independent from user default)
  - Valid until date with preset options (14/30/60 days)
  - Email quotes with PDF attachment via Resend
  - Download quote PDFs
  - Timeline tracking: Created → Sent → Viewed → Accepted/Rejected
  - Convert accepted quotes to invoices (preserves client, amount, currency, description)
  - Multi-currency summary stats (Total Pending grouped by currency)
  - Expiring soon indicator (within 7 days of valid_until)
- **New Pages:**
  - `/dashboard/quotes` - Quote list with filters and summary stats
  - `/dashboard/quotes/new` - Create quote form
  - `/dashboard/quotes/[id]` - Quote detail with timeline and actions
  - `/dashboard/quotes/[id]/edit` - Edit quote form
- **New Components:**
  - 10 quote components: new-quote-form, edit-quote-form, quotes-content, quotes-filters, send-quote-button, download-quote-pdf-button, convert-to-invoice-button, delete-quote-button, delete-quote-icon-button, mark-quote-status-button
- **Server Actions:**
  - `lib/actions/quotes.ts` - CRUD operations, status updates, convert to invoice
  - `lib/actions/send-quote.ts` - Email quote via Resend
- **Email & PDF:**
  - `lib/email/templates/quote-email.tsx` - Quote email template
  - `lib/pdf/quote-template.tsx` - Quote PDF template
  - `app/api/quotes/[id]/pdf/route.ts` - PDF streaming endpoint
- **Bug Fixes:**
  - Fixed dark theme styling in quote components
  - Security: quote detail page uses `getQuote()` action for defense in depth
  - Updated upgrade prompt to mention both quotes and invoices
- **Navigation:**
  - Added "Quotes" link to sidebar navigation

### Version 6.6 (January 28, 2026)
- **User Currency Preference:**
  - All currency displays now respect `user_settings.currency` setting
  - Centralized `getCurrencySymbol(currency)` function in `lib/utils/format.ts`
  - Uses `Intl.NumberFormat` with `currencyDisplay: 'narrowSymbol'` for proper symbols
  - Dashboard, Calendar, Debt Payoff pages fetch and pass currency from user_settings
  - Bills/Income forms show dynamic currency symbol based on user preference
  - Charts (PayoffTimelineChart, ForecastBalanceChart) use user's currency
  - Safety buffer form uses CurrencyInput with comma formatting and dynamic symbol
  - Low balance alert form uses formatCurrency helper with currency prop
- **Code Quality Improvements:**
  - Removed 6 duplicate `getCurrencySymbol` implementations across codebase
  - Consolidated currency formatting to use centralized utility functions
- **Bug Fixes:**
  - Fixed Recharts SSR warning "width(-1) and height(-1) of chart should be greater than 0" with `minWidth={0}`
  - Fixed PayoffTimelineChart Y-axis showing hardcoded $ regardless of user's currency setting
  - Fixed safety buffer validation message with hardcoded $ symbol

### Version 6.5 (January 27, 2026)
- **Credit Card Cash Flow Forecasting Feature:**
  - Database migration adding CC-specific columns to accounts table:
    - `credit_limit` - Credit limit for utilization tracking
    - `apr` - Annual percentage rate for interest calculations
    - `minimum_payment_percent` - Minimum payment percentage (default 2%)
    - `statement_close_day` - Day of month statement closes (1-31)
    - `payment_due_day` - Day of month payment is due (1-31)
  - **Account forms updated** (new + edit) with conditional CC fields
  - **Utilization tracking** with color-coded badges:
    - Emerald (<30%): Excellent utilization
    - Amber (30-50%): Moderate, may impact credit score
    - Orange (50-70%): High utilization warning
    - Rose (>70%): Very high, likely impacting credit score
  - **Calendar integration** - CC payment due dates appear as recurring bill-like events
  - **Payment Scenario Simulator** modal:
    - Three payment options: minimum, statement balance, custom amount
    - Payoff timeline and total interest calculations
    - Cash outflow preview showing remaining balance
    - Interest savings comparison vs minimum payment
  - **Account card enhancements:**
    - CC balance displayed as debt (amber/rose color)
    - Utilization badge with percentage and status message
    - Credit limit display
    - Simulator button for cards with balance
  - **Debt Payoff Planner** (`/dashboard/debt-payoff`):
    - Compare Snowball vs Avalanche strategies for multiple credit cards
    - Extra monthly payment input to see accelerated payoff
    - Side-by-side comparison: debt-free date, total interest, total paid
    - Payoff order visualization with per-card payoff dates
    - Navigation from Accounts page when 2+ CC have balances
    - Empty state for no CC debt, simplified view for single card
  - **Credit Card filter** added to Accounts page filter dropdown
- **New files:**
  - `lib/types/credit-card.ts` - TypeScript types and calculation utilities
  - `lib/calendar/calculate-cc-payments.ts` - CC payment occurrence generator
  - `components/accounts/payment-simulator.tsx` - Payment scenario modal
  - `lib/debt-payoff/calculate-payoff.ts` - Snowball/Avalanche algorithms
  - `app/dashboard/debt-payoff/page.tsx` - Debt payoff planner page
  - `components/debt-payoff/debt-payoff-planner.tsx` - Planner UI component
- **Bug Fixes:**
  - Fixed invoice PDF route missing user_id filter (RLS bypass risk)
  - Fixed user menu dropdown cut off on calendar page (z-index stacking)
  - Added 'credit_card' to trackAccountCreated PostHog event type
  - Statement/Payment day dropdowns now allow 1-31 (was limited to 1-28)
  - Fixed date rollover for months with fewer days (e.g., day 31 in Feb → 28/29)
  - Fixed filter logic to properly match `credit_card` account type
- **Data Visualization Charts:**
  - New `components/charts/payoff-timeline-chart.tsx` - Debt payoff timeline visualization
    - Area chart showing total balance decreasing over time
    - Reference lines for card payoff milestones
    - Custom tooltip with month/balance/cards paid off
    - Legend showing when each card is paid off
  - New `components/charts/forecast-balance-chart.tsx` - Dashboard balance trend
    - Area chart showing projected balance over forecast period
    - Lowest balance point marker with reference dot
    - Safety buffer reference line
    - Color-coded for positive (teal) vs negative (rose) balances
  - Added `recharts` dependency for React charting
  - Created `docs/charts-roadmap.md` for implementation patterns
- **Chart Bug Fixes (11 total):**
  - Forecast Balance Chart: Fixed sampling skipping lowest day, duplicate last day, negative currency formatting, gradient ID collision, safety buffer line visibility, undefined array access
  - Payoff Timeline Chart: Fixed hardcoded currency, gradient ID collision, key collision, overlapping X-axis labels, negative currency formatting
- **Debt Payoff Planner Bug Fixes:**
  - Fixed 11 instances of hardcoded 'USD' currency (now uses currency prop)
  - Improved empty states: differentiate "no cards added" vs "all cards paid off"

### Version 6.4 (January 26, 2026)
- **Custom Bill Categories Feature:**
  - New `user_categories` database table with RLS policies
  - Category management UI in Settings page (add, edit, delete)
  - 13 color options and 24 icon options for categories
  - Dynamic category dropdowns in bill forms (new, edit, onboarding)
  - Inline category creation without leaving the form
  - Pending category pattern (defer DB creation until form submission)
  - Default categories seeded on first use (Rent/Mortgage, Utilities, Subscriptions, Insurance, Other)
  - Category filters updated to use user's custom categories
  - URL slug conversion for clean filter URLs (`?ex=rentmortgage`)
  - Orphaned category support (bills with deleted categories still display)
- **Bug Fixes (24 total):**
  - Case-insensitive category matching in filter logic
  - Case-insensitive category matching when renaming/deleting categories
  - Race condition prevention with upsert and `onConflict` handling
  - Double seeding prevention in category creation
  - ARIA accessibility labels for category dropdown
  - TypeScript type safety improvements throughout
  - Proper disabled states during form submission
  - Retry logic for category seeding in onboarding
- **New Files:**
  - `lib/categories/constants.ts` - Default categories and color/icon definitions
  - `lib/actions/manage-categories.ts` - Server actions for category CRUD
  - `components/settings/category-management-form.tsx` - Settings UI
  - `components/bills/category-select.tsx` - Dynamic category dropdown component

### Version 6.3 (January 26, 2026)
- **Reports & Export Feature:**
  - New Reports page at `/dashboard/reports`
  - Quick Reports: Monthly Summary, Category Spending (free), Cash Forecast, All Data (Pro)
  - Custom Export Builder modal with data selection, date range presets, format choice
  - Export formats: CSV (free), Excel (Pro), JSON (Pro), PDF (coming soon)
  - Export History section with status badges and re-download capability
  - Database table `exports` with RLS and 30-day retention
  - Feature gating: Free tier gets CSV + 5 history items, Pro gets all formats + unlimited history
  - Navigation: Added "Reports" link with FileBarChart icon
  - New files: `app/dashboard/reports/`, `components/reports/`, `lib/export/`, `app/api/exports/`
  - Dependencies: Added `xlsx` package for Excel generation

### Version 6.2 (January 26, 2026)
- Free Tier Forecast Extended to 90 Days:
  - Updated `lib/stripe/config.ts` from 60 to 90 days
  - Updated all user-facing copy across landing, pricing, FAQs, tools, OG images
  - Dashboard default filter now 90 days for free users
  - Added collapsible help section to CSV Import
  - Created Reports feature roadmap in `docs/user-feedback-jeremy.md`

### Version 6.1 (January 25, 2026)
- Semi-Monthly Frequency Bug Fixes:
  - Fixed semi-monthly income calculating as $0/mo on dashboard and income pages
  - Fixed semi-monthly transactions not appearing in calendar day modals
  - Added semi-monthly to all FrequencyType definitions:
    - `calendar-filters.tsx` - Critical fix for calendar modal filtering
    - `income-filters.tsx` - Income page frequency filter dropdown
    - `bills-filters.tsx` - Bills page frequency filter dropdown
  - Added semi-monthly case to all date calculation functions:
    - `getActualNextDate()` in income-card.tsx, income-content.tsx
    - `getActualNextDueDate()` in bill-card.tsx, bills-content.tsx
    - `getActualDueDate()` in dashboard/bills/page.tsx
  - Added semi-monthly to badge/icon display functions:
    - `getFrequencyBadge()` - indigo badge color for semi-monthly
    - `getIncomeTypeIcon()` - displays "2×/mo" indicator
  - Monthly calculation fix: `amount * 2` for semi-monthly frequency

### Version 6.0 (January 24, 2026)
- Dashboard Forecast Improvements:
  - Fixed hardcoded "60 days" label - now dynamically shows period based on filter
  - Added 90-day and 365-day ("12 Months") forecast filter options for Pro users
  - Pro users now default to 90-day forecast view
  - Added "/mo" suffix to Income/Bills metric cards for clarity
- Dashboard Layout Improvements:
  - Removed redundant "View Calendar" CTA, replaced with "Adjust Buffer" → Settings
  - Removed generic welcome heading
  - Reorganized sections for better information hierarchy
  - Mobile responsive text sizing with overflow prevention
- Mobile Navigation:
  - Added user avatar dropdown to mobile header (profile, billing, logout)
  - Changed mobile "Home" to Dashboard (was Calendar)
  - Replaced "Import" with "Calendar" in mobile bottom nav
- Calendar Mobile UX (Apple HIG compliance):
  - Removed "Tap for more" - all 4 stats now visible in 2x2 grid
  - Increased close button touch target to 44px minimum
  - Added `whitespace-nowrap` to currency displays
  - Increased mobile header card padding (p-3 → p-4)
  - Removed redundant "Specific Accounts" filter option

### Version 5.9 (January 23, 2026)
- SEO Content Expansion:
  - **4 New Blog Posts** with OpenGraph images:
    - Best Cash Flow Apps for Freelancers 2026 (comparison article)
    - How to Track Freelance Income and Expenses (HowTo schema)
    - Quarterly Tax Savings for 1099 Contractors (FAQ schema)
    - When to Raise Your Freelance Rates (tips with email templates)
  - **Glossary Page** (`/glossary`) with 30+ freelance finance terms
    - DefinedTermSet schema for AEO/AI search optimization
    - Alphabetical navigation with quick-jump links
    - Internal links to related blog posts and tools
  - Blog count: 16 total posts for organic SEO
- Core Web Vitals Fixes:
  - Added `font-display: swap` for faster text rendering
  - Added `loading="lazy"` to below-fold images
  - Added `aspect-ratio` classes to prevent CLS
  - Removed ~320KB of unused old hero images
- Blog Typography Improvements:
  - Increased paragraph spacing (`mb-4` → `mb-6`)
  - Custom prose styles in globals.css (line-height 1.8, better heading spacing)
  - Improved list, blockquote, and strong text styling for dark mode

### Version 5.8 (January 23, 2026)
- CurrencyInput Component:
  - Live comma formatting as you type (e.g., `12,430.97`)
  - `inputMode="decimal"` for mobile numeric keyboard
  - Applied to all amount fields across Bills, Income, Accounts, Invoices
- Form Consistency & Mobile UX:
  - Visible borders on select/dropdown fields
  - Standardized button labels to action verbs
  - 44px touch targets on all interactive elements
- SEO/AEO Audit:
  - Fixed canonical URL mismatch in sitemap
  - Added HowTo schema for landing page
  - Updated meta descriptions to "365 days"
  - New FAQ about Stripe payment links
- Landing Page Updates:
  - Social proof avatar stack below hero CTA
  - Emergency Fund Tracker in "More ways we help" section

### Version 5.7 (January 22, 2026)
- Invoice Branding Feature:
  - Logo upload to Supabase storage (JPG/PNG/WebP, max 512KB)
  - Business name field displayed on invoices instead of email
  - Live invoice preview in settings showing branding appearance
  - Drag-and-drop upload zone with visual feedback
  - Character count for business name (0/100)
  - Logo appears in PDF header next to "INVOICE" title
  - Business name shows in "From" section above email
  - Database migration for `business_name` and `logo_url` columns
  - Storage bucket with RLS policies for user folder isolation
  - Next.js image config updated for Supabase storage domains

### Version 5.6 (January 22, 2026)
- User Profile Dropdown Redesign:
  - New `UserAvatar` component showing initials from name or email
  - User identity section with email and plan badge (Free/Pro)
  - Menu items: Settings, Billing, Help & Support with icons
  - Billing opens Stripe portal (Pro) or pricing page (Free)
  - Separated Log out with subtle destructive hover styling
  - Mobile-friendly with 44px touch targets
- Invoices Upgrade Prompt Redesign:
  - Benefit-focused headline: "Get Paid Faster with Runway Collect"
  - 3 feature cards in responsive grid replacing bullet list
  - Social proof line and trust elements with lock icon
  - Gradient background with radial glow for visual depth
  - More prominent billing toggle and CTA with hover animation
- Bug Fixes:
  - Stripe customer ID dev/prod mismatch: Verify customer exists before using stored ID
  - Landing page mobile layout: Calendar day cards horizontally scrollable with snap

### Version 5.5 (January 21, 2026)
- Interactive Hero Dashboard for Landing Page:
  - New `HeroDashboard` React component replacing static mockup image
  - "Safe to Spend" hero card with gradient background and glow effect
  - Stats row showing Starting, Lowest, Income, Bills totals
  - Interactive SVG line chart with hover states
  - 7-day weekly calendar preview with transaction badges
  - Staggered entrance animations (0ms → 600ms delays)
  - Responsive layout for all screen sizes
- Calendar Page Visual Polish:
  - Safe to Spend card redesign with gradient/glow matching landing page
  - Stats row with color-coded amounts (amber for LOWEST, rose for BILLS)
  - Balance trend chart: increased height to 380px, compact $60K Y-axis labels
  - Quick Summary cards with color tints (emerald for income, orange for bills)
  - Balance status legend made collapsible
  - Day cards: dot notation for transaction count, collision badge moved to bottom-left
  - Filter bar made collapsible with active filter count badge
- Technical improvements:
  - Compact currency formatting ($60K format) for chart axes
  - Thousands separator for Safe to Spend card
  - Collapsible filter panel with state management

### Version 5.4 (January 20, 2026)
- Stripe Payment Links for Invoices (Pro Feature):
  - Stripe Connect integration for Pro users to receive payments directly
  - One-click "Pay Now" button in invoice emails and PDFs
  - Automatic invoice status update to "Paid" on successful payment
  - Payment success page with session verification
  - Database migration for `stripe_connect_accounts` table and invoice payment columns
  - Settings UI for connecting/disconnecting Stripe account
- Linear-style filter bar refinements:
  - Moved sort dropdown to right side with "Sort: Value" format
  - Result count shows "X of Y results" when filtering reduces results
  - Active filter pills row cleaned up (no duplicate result count)
  - Added `rightSection` prop to `FilterBarRow` component
  - Added `showLabelPrefix` prop to `FilterDropdownSingle` component
- Documentation updates:
  - Added Resend configuration to `.env.example` (RESEND_API_KEY, RESEND_FROM_EMAIL)
  - Created Apollo lead generation guide for outreach campaigns
- Bug fixes:
  - Fixed invoice-linked income status sync: Income page now shows "Paid" when invoice is paid via Stripe
  - Fixed calendar showing wrong status for invoice-linked income
  - Removed restriction on editing paid invoices
  - Fixed invoice payment status not updating on localhost
  - Improved Stripe Connect error messaging when Connect not enabled

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
  - Updated sitemap priorities and standardized sitemap URLs to `https://www.cashcast.money`
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
- Forecast generation now tier-based (Free: 90 days, Pro: 365 days)
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

**Document Version:** 6.26
**Last Updated:** April 29, 2026
**Status:** Live - Automated Payment Reminders
**Next Review:** May 2026
