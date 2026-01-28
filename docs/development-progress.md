# Cash Flow Forecaster - Development Progress

**Last Updated:** January 27, 2026 (Day 50)

**Repository:** https://github.com/omarqouqas/cashflowforecaster

**Live URL:** https://cashflowforecaster.io

---

## Quick Stats

- **Days in Development:** 50
- **Commits:** 165+
- **Database Tables:** 15
- **Test Coverage:** Manual testing (automated tests planned post-launch)

## Current Status Summary

**Overall Progress:** MVP Complete + Feature Gating + Analytics + Stripe Live + YNAB-Inspired Calendar + Comprehensive Filters + Low Balance Alerts + Simpler Onboarding + Emergency Fund Tracker + Stripe Payment Links + Landing Page Hero Dashboard + Calendar Visual Polish + User Profile Dropdown Redesign + Invoice Branding + Form UX Polish + SEO/AEO Audit + Content Expansion (10 Blog Posts + Glossary) + Dashboard/Calendar Mobile UX Polish + Semi-Monthly Frequency Bug Fixes + Reports & Export Feature + Custom Bill Categories + **Credit Card Cash Flow Forecasting + Debt Payoff Planner**

**Current Focus:**

- User acquisition via Apollo outreach campaign
- Monitor Stripe Connect adoption among Pro users
- Track invoice payment conversion rates
- Monitor NPS survey responses (PostHog)
- A/B test landing page hero conversion

---

## Recent Development (Days 40-50)

### Day 50: Credit Card Cash Flow Forecasting (January 27, 2026)

**Major Differentiating Feature** - Credit card accounts now integrate with cash flow forecasting, providing features competitors (Monarch, YNAB, Copilot) don't offer.

**Database Migration:**
- Added 5 new columns to `accounts` table: `credit_limit`, `apr`, `minimum_payment_percent`, `statement_close_day`, `payment_due_day`
- Indexed credit card accounts for efficient queries

**Account Form Updates:**
- Added "Credit Card" option to account type dropdown (new + edit pages)
- Conditional credit card fields shown when CC type selected:
  - Credit limit (for utilization tracking)
  - APR (for interest calculations)
  - Statement close day (1-31)
  - Payment due day (1-31)
- Context-sensitive labels and help text for CC balance

**Credit Utilization Tracking:**
- Utilization badge on credit card account cards
- Color-coded warnings: green (<30%), amber (30-50%), orange (50-75%), rose (>75%)
- Shows "X% used of $Y limit" on account cards
- Tooltip with utilization message

**Calendar Integration:**
- Credit card payments now appear in cash flow calendar
- Auto-generates monthly payment events on payment due day
- Shows with 💳 emoji prefix for visibility
- Payment amount equals current balance (simplified model)

**Payment Scenario Simulator:**
- New modal accessible via calculator button on CC account cards
- Three payment options:
  - Minimum payment (shows months to payoff + total interest)
  - Statement balance (no interest)
  - Custom amount (shows payoff timeline + interest)
- Cash flow impact summary (outflow, remaining balance)
- Interest savings comparison vs minimum payment
- Monthly interest projection if carrying balance

**New Files:**
- `supabase/migrations/20260127000001_add_credit_card_fields.sql` - Database migration
- `lib/types/credit-card.ts` - TypeScript types and utility functions
- `lib/calendar/calculate-cc-payments.ts` - CC payment occurrence generator
- `components/accounts/payment-simulator.tsx` - Payment scenario modal

**Modified Files:**
- `app/dashboard/accounts/new/page.tsx` - CC fields in create form
- `app/dashboard/accounts/[id]/edit/page.tsx` - CC fields in edit form
- `components/accounts/account-card.tsx` - Utilization badge + simulator button
- `lib/calendar/generate.ts` - Include CC payments in forecast
- `lib/calendar/utils.ts` - Added `addMonths` utility
- `lib/posthog/events.ts` - Added `credit_card` to tracking type

**Debt Payoff Planner:**
- New page at `/dashboard/debt-payoff` for users with 2+ credit cards with balance
- Compares Snowball (smallest balance first) vs Avalanche (highest APR first) strategies
- Extra monthly payment input to see accelerated payoff
- Side-by-side comparison showing debt-free date, total interest, and total paid
- Payoff order visualization showing each card's payoff date and interest
- Shows interest savings when Avalanche beats Snowball
- Empty state for users with no CC debt (celebration message)
- Single card state for users with only one CC (simplified view)
- Navigation button on Accounts page when 2+ CC have balance

**New Files (Debt Payoff Planner):**
- `lib/debt-payoff/calculate-payoff.ts` - Snowball/Avalanche calculation algorithms
- `app/dashboard/debt-payoff/page.tsx` - Server component fetching CC accounts
- `components/debt-payoff/debt-payoff-planner.tsx` - Client component with strategy comparison

**New Files (Charts):**
- `components/charts/payoff-timeline-chart.tsx` - Debt payoff timeline area chart
- `components/charts/forecast-balance-chart.tsx` - Dashboard forecast balance chart
- `docs/charts-roadmap.md` - Charts implementation roadmap and patterns

**Dependencies Added:**
- `recharts` - React charting library for data visualization

**Modified Files (Debt Payoff Planner):**
- `app/dashboard/accounts/page.tsx` - Added "Plan Your Debt Payoff" navigation card

**New Charts:**
- `components/charts/payoff-timeline-chart.tsx` - Debt payoff timeline visualization with Recharts
  - Area chart showing total balance decreasing over time
  - Reference lines for card payoff milestones
  - Custom tooltip with month/balance/cards paid off
  - Legend showing when each card is paid off
- `components/charts/forecast-balance-chart.tsx` - Dashboard balance trend visualization
  - Area chart showing projected balance over forecast period
  - Lowest balance point marker with reference dot
  - Safety buffer reference line
  - Custom tooltip with date/balance formatting
  - Color-coded for positive (teal) vs negative (rose) balances

**Chart Bug Fixes (11 total):**

*Forecast Balance Chart (6 bugs):*
- Fixed sampling that could skip actual lowest balance day
- Fixed duplicate last day when lowest day = last day
- Fixed negative currency formatting (`$-500` → `-$500`)
- Fixed gradient ID collision when multiple charts render (used `useId()`)
- Fixed safety buffer line rendering outside visible Y-axis range
- Fixed potential undefined array access with explicit checks

*Payoff Timeline Chart (5 bugs):*
- Fixed hardcoded 'USD' currency (now uses currency prop)
- Fixed gradient ID collision (used `useId()`)
- Fixed key collision using cardName (changed to cardId)
- Fixed overlapping X-axis tick labels at end of chart
- Fixed negative currency formatting in Y-axis

**Debt Payoff Planner Bug Fixes:**
- Fixed 11 instances of hardcoded 'USD' currency (now uses currency prop)
- Improved empty states: differentiate "no cards added" vs "all cards paid off"
  - No cards: Feature preview with CTA to add credit card
  - All paid: Celebration message with link to accounts

**Other Bug Fixes:**
- Statement/Payment day dropdowns now allow 1-31 (was 1-28)
- Calendar CC payment validation updated for days 29-31
- Fixed date rollover for months with fewer days (e.g., day 31 in Feb → 28/29)
- Added "Credit Card" to account type filter dropdown on Accounts page
- Fixed filter logic to properly match `credit_card` account type

**Competitive Advantage:**
| Feature | Monarch | YNAB | Copilot | Us |
|---------|---------|------|---------|-----|
| Track CC balance | ✅ | ✅ | ✅ | ✅ |
| Due date reminders | ✅ | ❌ | ❌ | ✅ |
| Spending → future cash impact | ❌ | ❌ | ❌ | ✅ |
| Payment scenario simulator | ❌ | ❌ | ❌ | ✅ |
| Interest cost calculator | ❌ | ❌ | ❌ | ✅ |
| Utilization warnings | ❌ | ❌ | ❌ | ✅ |
| Debt payoff planner | ❌ | ❌ | ❌ | ✅ |

---

### Day 49: Custom Bill Categories (January 26, 2026)

**Custom Categories Feature** - Users can now create, edit, and delete custom bill categories instead of being limited to 5 hardcoded options.

**New Database Table:**
- `user_categories` with RLS policies for secure access
- Fields: id, user_id, name, color, icon, sort_order, created_at
- Default categories seeded on first use (Rent/Mortgage, Utilities, Subscriptions, Insurance, Other)

**Category Management UI:**
- New section in Settings page for managing categories
- Add, edit, delete categories with custom colors and icons
- 13 color options (rose, amber, emerald, teal, cyan, blue, violet, etc.)
- 24 icon options (home, zap, repeat, shield, tag, car, heart, etc.)

**Dynamic Category Dropdowns:**
- Bill forms now use user's custom categories
- Inline category creation in bill forms (no need to go to Settings)
- Pending category pattern (defer DB creation until form submission)
- Orphaned category support (bills with deleted categories still display)

**Filter Updates:**
- Category filters on bills page use user's custom categories
- URL slug conversion for clean filter URLs (`?ex=rentmortgage`)
- Case-insensitive category matching throughout

**Bug Fixes (24 total):**
- Case-insensitive category matching in filter logic
- Case-insensitive category matching when renaming/deleting categories
- Orphaned category display in dropdowns (bills with deleted categories)
- Race condition prevention in category creation with upsert
- Double seeding prevention with `onConflict` handling
- ARIA accessibility labels for category dropdown (aria-haspopup, aria-expanded, role)
- TypeScript type safety improvements (Tables<'bills'> instead of any)
- Proper disabled states during form submission
- Retry logic for category seeding in onboarding
- Case-insensitive suggestion matching in onboarding

**New Files:**
- `lib/categories/constants.ts` - Default categories and color/icon definitions
- `lib/actions/manage-categories.ts` - Server actions for category CRUD
- `components/settings/category-management-form.tsx` - Settings UI
- `components/bills/category-select.tsx` - Dynamic category dropdown component
- `supabase/migrations/[timestamp]_add_custom_categories.sql` - Database migration

**Modified Files:**
- `app/dashboard/settings/page.tsx` - Added categories section
- `app/dashboard/bills/new/page.tsx` - Dynamic categories
- `app/dashboard/bills/[id]/edit/page.tsx` - Dynamic categories
- `app/dashboard/bills/page.tsx` - TypeScript type fixes
- `components/bills/bills-content.tsx` - Category filtering with constants
- `components/bills/bills-filters.tsx` - Dynamic category options
- `components/bills/bill-card.tsx` - Custom color/icon rendering
- `components/onboarding/step-bills.tsx` - Category seeding and selection

---

### Day 48: Reports & Export Feature + Free Tier Extended to 90 Days (January 26, 2026)

**Reports & Export Feature** - Major feature implementation allowing users to export their financial data.

**New Reports Page (`/dashboard/reports`):**
- Quick Reports: 4 one-click report cards (Monthly Summary, Category Spending, Cash Forecast, All Data)
- Custom Export Builder: Modal with data selection, date range presets, format choice, and export summary
- Export History: Recent exports with status, format badges, re-download capability
- Tier-gated features (Free: CSV + limited reports, Pro: Excel/JSON + all reports)

**Export Formats:**
- CSV: Free tier, opens in Excel/Sheets/Numbers
- Excel: Pro tier, multi-sheet workbooks with auto-sized columns
- JSON: Pro tier, structured data for developers
- PDF: Coming soon (shows friendly message)

**Technical Implementation:**
- Database: `exports` table with RLS, 30-day retention, status tracking
- Types: `lib/export/types.ts` with ExportFormat, ReportType, DataInclude, etc.
- Generators: `lib/export/generators/csv-generator.ts`, `excel-generator.ts`
- API: `/api/exports/generate` route handling all export generation
- Feature gates: `lib/stripe/feature-gate.ts` extended with export permissions
- Navigation: Added "Reports" link with FileBarChart icon

**New Files:**
- `app/dashboard/reports/page.tsx` - Server component
- `app/dashboard/reports/loading.tsx` - Loading skeleton
- `components/reports/reports-page-content.tsx` - Client component
- `components/reports/quick-reports-section.tsx` - Report cards
- `components/reports/export-builder-modal.tsx` - Custom export builder
- `components/reports/export-history-section.tsx` - History table
- `lib/export/types.ts` - TypeScript types and constants
- `lib/export/generators/csv-generator.ts` - CSV generation
- `lib/export/generators/excel-generator.ts` - Excel generation (xlsx)
- `supabase/migrations/20260126000001_add_exports_table.sql` - Database migration
- `app/api/exports/generate/route.ts` - Export API endpoint

**Free Tier Extended to 90 Days** - Based on beta tester feedback (Jeremy):
- Updated `lib/stripe/config.ts` - Free tier `forecastDays: 60` → `90`
- Updated all user-facing copy across 26 files (landing page, FAQs, pricing, tools, OG images, etc.)
- Dashboard default filter now 90 days for free users (was 60)
- Calendar summary/warnings now use dynamic "forecast period" instead of hardcoded "60 days"
- Added collapsible help section to CSV Import explaining expected format

**Bug Fixes:**
- Fixed Stripe API version mismatch (updated to '2025-12-15.clover')
- Fixed TypeScript errors with Map iteration using Array.from()
- Fixed undefined array access with explicit checks
- PDF export shows "coming soon" message instead of silently falling to CSV
- Export history shows "Expired" for completed exports without file_url

**Dependencies:**
- Added `xlsx` package for Excel export generation

**Documentation:**
- Created `docs/user-feedback-jeremy.md` with Reports feature roadmap

---

### Day 47: Semi-Monthly Frequency Bug Fixes (January 25, 2026)

**Critical Bug Fix** - Semi-monthly income/bills were showing $0 in monthly calculations and not appearing in calendar day modals.

**Root Cause:** The `semi-monthly` frequency was missing from multiple calculation functions and filter type definitions throughout the codebase. Income/bills with semi-monthly frequency fell through to `default` cases returning $0.

**Monthly Calculation Fixes** - Added `case 'semi-monthly': return amount * 2` to all calculation functions:

- `app/dashboard/page.tsx` - `calculateMonthlyIncome`, `calculateMonthlyBills`, `calculateQuarterlyIncome`
- `app/dashboard/income/page.tsx` - `calculateMonthlyIncome`
- `app/dashboard/bills/page.tsx` - `calculateMonthlyTotal`
- `app/dashboard/settings/page.tsx` - already had semi-monthly support

**Next Date Calculation Fixes** - Added semi-monthly case to `getActualNextDate` functions:

- `app/dashboard/income/page.tsx` - inline `getActualNextDate`
- `app/dashboard/bills/page.tsx` - `getActualDueDate`
- `components/income/income-card.tsx` - `getActualNextDate`
- `components/income/income-content.tsx` - `getActualNextDate`
- `components/bills/bill-card.tsx` - `getActualNextDueDate`
- `components/bills/bills-content.tsx` - `getActualNextDueDate`

**Filter & Type Definition Fixes** - Added `'semi-monthly'` to `FrequencyType` and `allFrequencies`:

- `components/income/income-filters.tsx` - Income page frequency filter
- `components/bills/bills-filters.tsx` - Bills page frequency filter
- `components/calendar/calendar-filters.tsx` - Calendar frequency filter (this was causing transactions to not show in day modal)

**Display Fixes** - Added semi-monthly badges and icons:

- `components/income/income-card.tsx` - `getIncomeTypeIcon`, `getFrequencyBadge` (indigo color)
- `components/bills/bill-card.tsx` - `getFrequencyBadge` (indigo color)

**Impact:** Users with semi-monthly income (e.g., $1,551 twice/month) now correctly see $3,102/mo in calculations, and transactions appear in calendar day modals when clicked.

**Files:** `app/dashboard/page.tsx`, `app/dashboard/income/page.tsx`, `app/dashboard/bills/page.tsx`, `components/income/income-card.tsx`, `components/income/income-content.tsx`, `components/income/income-filters.tsx`, `components/bills/bill-card.tsx`, `components/bills/bills-content.tsx`, `components/bills/bills-filters.tsx`, `components/calendar/calendar-filters.tsx`

---

### Day 46: Dashboard & Calendar Mobile UX Polish (January 24, 2026)

**Dashboard Forecast Fixes** - Dynamic forecast period labels and extended filter options.

- Fixed hardcoded "60 days" label - now dynamically shows period based on user's filter selection
- Added 90-day and 365-day ("12 Months") forecast filter options for Pro users
- Pro users now default to 90-day forecast view (was 60 days)
- Added "/mo" suffix to Income/Bills metric cards for clarity
- Added formatting helpers: `formatHorizonPeriod()` and `formatHorizonTitle()`

**Dashboard Layout Improvements** - Better information hierarchy and mobile optimization.

- Removed redundant "View Calendar" CTA under Daily Budget, replaced with "Adjust Buffer" → Settings
- Removed generic "Welcome to Cash Flow Forecaster!" heading
- Reorganized sections: Metric cards → Forecast → Invoices → Tax → Emergency Fund → Scenario Tester → Import
- Mobile responsive text sizing (text-xl sm:text-2xl md:text-3xl)
- Added min-w-0 and truncate for overflow prevention

**Mobile Navigation Improvements** - Better user experience on mobile devices.

- Added user avatar dropdown to mobile header (profile, billing, logout access)
- Changed mobile "Home" tab to link to Dashboard instead of Calendar
- Replaced "Import" with "Calendar" in mobile bottom nav for better discoverability

**Calendar Mobile UX Improvements** - Touch-friendly design following Apple HIG.

- Removed "Tap for more" expandable stats - now shows all 4 stats in 2x2 grid on mobile
- Increased close button touch target to 44px minimum (was ~28px)
- Added `whitespace-nowrap` to currency displays to prevent awkward line breaks
- Increased padding in mobile header cards (p-3 → p-4)
- Removed redundant "Specific Accounts" from Dashboard "Add filter" menu

**Files:** `components/calendar/sticky-header.tsx`, `components/calendar/day-detail.tsx`, `components/dashboard/dashboard-content.tsx`, `components/dashboard/dashboard-filters.tsx`, `components/dashboard/nav.tsx`, `app/dashboard/calendar/page.tsx`, `components/calendar/calendar-container.tsx`, `components/calendar/calendar-hybrid-view.tsx`, `components/calendar/calendar-view.tsx`

---

### Day 45: Form UX Polish + Currency Input + SEO/AEO Audit + Content Expansion (January 23, 2026)

**CurrencyInput Component** - Numbers now format with commas as you type for better readability.

- New reusable `CurrencyInput` component with live comma formatting (e.g., `12,430.97`)
- Uses `inputMode="decimal"` for optimal mobile numeric keyboard
- Supports negative values via `allowNegative` prop (for account balances)
- Returns raw numeric value to forms while displaying formatted text
- Applied to all amount fields: Bills, Income, Accounts, Invoices

**Form Consistency & Mobile UX** - All dashboard forms now have consistent styling.

- Select/dropdown fields: Added visible borders (`border border-zinc-700`), consistent background (`bg-zinc-800`)
- Chevron icons: Increased size (`w-5 h-5`) and visibility (`text-zinc-400`)
- Date inputs: Added `[color-scheme:dark]` for proper dark mode date picker
- Button labels: Standardized to action verbs ("Add Bill", "Add Income", "Create Account", "Create Invoice")
- Touch targets: All interactive elements have `min-h-[44px]` for mobile accessibility
- Cursor feedback: Added `cursor-pointer` to all clickable form elements

**SEO/AEO Improvements** - Comprehensive audit and updates for search optimization.

- Fixed canonical URL mismatch (sitemap.ts now uses non-www to match robots.ts)
- Updated meta descriptions from "60 days" to "365 days" across layout and page
- Added OG image (hero-dashboard.png) to homepage for social sharing
- Added HowTo JSON-LD schema for "How it Works" section (AEO optimization)
- Added 5 new keywords: invoice payment links, stripe invoicing, branding, emergency fund
- Added new FAQ: "How do clients pay my invoices?" covering Stripe payment links
- Updated existing FAQ answers to clarify Pro 365-day forecast

**Landing Page Updates** - New features and social proof.

- Added "Custom branding with your logo and business name" to Get Paid Faster section
- Added Emergency Fund Tracker card to "More ways we help" section (3-column grid)
- Added social proof avatar stack below hero CTA: "Trusted by designers, writers & developers"
- Updated pricing cards: Added "Low Balance Alerts" (Free), "Custom invoice branding" (Pro)

**Compare Page Updates** - New feature rows and keywords.

- Added 3 comparison rows: Invoice branding, Emergency fund tracker, Tax savings tracker
- Updated CTA to mention "60 days free, or 365-day with Pro"
- Added 4 new keywords for new features

**Core Web Vitals Fixes** - Performance optimizations for better page speed.

- Added `font-display: swap` for faster text rendering (prevents FOIT)
- Added `loading="lazy"` to all below-fold images on landing page
- Added `aspect-ratio` classes to prevent layout shift (CLS)
- Removed ~320KB of unused old hero images (`hero-dashboardOLD.png`, `hero-dashboardsecondOLD.png`)

**Content Expansion (SEO/AEO)** - 4 new blog posts + glossary page.

- **Blog: Best Cash Flow Apps for Freelancers 2026** - Comparison of 5 apps with pros/cons, pricing table
- **Blog: How to Track Freelance Income and Expenses** - Practical guide with HowTo schema
- **Blog: Quarterly Tax Savings for 1099 Contractors** - Tax guide with FAQ schema, due dates
- **Blog: When to Raise Your Freelance Rates** - Tips with email templates for rate increases
- **Glossary Page (`/glossary`)** - 30+ freelance finance terms with DefinedTermSet schema for AEO
- All new blog posts have dynamic OpenGraph images via `next/og`

**Blog Typography Improvements** - Better readability across all blog posts.

- Increased paragraph spacing from `mb-4` to `mb-6` for more breathing room
- Added custom prose typography styles in `globals.css`:
  - Paragraph line-height increased to 1.8
  - Heading spacing: h2 gets 2.5em top margin, h3 gets 2em
  - Improved list and blockquote spacing
  - Better strong/bold text visibility in dark mode

**Bug Fixes:**
- Fixed invoice amount field white background (was missing dark theme classes)
- Fixed unused `Calendar` import in quarterly tax blog post
- Fixed TypeScript errors in glossary page (term grouping)

**Files:** `app/page.tsx`, `app/layout.tsx`, `app/sitemap.ts`, `app/globals.css`, `lib/blog/posts.ts`, `app/glossary/page.tsx` (created), `app/blog/best-cash-flow-apps-freelancers-2026/` (created), `app/blog/how-to-track-freelance-income-expenses/` (created), `app/blog/quarterly-tax-savings-1099-contractors/` (created), `app/blog/when-to-raise-freelance-rates/` (created)

---

### Day 44: User Profile Dropdown + Invoice Branding + UX Polish (January 22, 2026)

**Invoice Branding Feature** - Users can customize invoices with logo and business name.

- Logo upload to Supabase storage (JPG/PNG/WebP, max 512KB)
- Business name field displayed on invoices instead of email
- Live invoice preview in settings showing exactly how branding appears
- Drag-and-drop upload zone with visual feedback
- Character count for business name (0/100)
- Logo appears in PDF header next to "INVOICE" title
- Business name shows in "From" section above email
- Database migration for `business_name` and `logo_url` columns
- Storage bucket with RLS policies for user folder isolation

**User Profile Dropdown Redesign** - Enhanced navigation with avatar and improved UX.

- UserAvatar component showing initials from name or email
- User identity section with email and plan badge (Free/Pro)
- Menu items: Settings, Billing, Help & Support with icons
- Billing opens Stripe portal (Pro) or pricing page (Free)
- Separated Log out with subtle destructive hover styling
- Mobile-friendly with 44px touch targets

**Invoices Upgrade Prompt Redesign** - Better conversion-focused design:

- Benefit-focused headline: "Get Paid Faster with Runway Collect"
- 3 feature cards in responsive grid replacing bullet list
- Social proof line and trust elements with lock icon
- Gradient background with radial glow for visual depth
- More prominent billing toggle and CTA button with hover animation

**Bug Fixes:**
- Stripe customer ID dev/prod mismatch: Verify customer exists before using stored ID, create new if not found
- Landing page mobile layout: Calendar day cards now horizontally scrollable with snap, stacked day labels

**Files:** `components/dashboard/nav.tsx`, `components/invoices/invoicing-upgrade-prompt.tsx`, `components/landing/hero-dashboard.tsx`, `lib/actions/stripe.ts`, `components/settings/invoice-branding-form.tsx`, `lib/actions/update-invoice-branding.ts`, `lib/pdf/invoice-template.tsx`

---

### Day 43: Landing Page Hero Dashboard + Calendar Visual Polish

**Interactive Hero Dashboard Component** - Replaced static mockup image with an interactive React component demonstrating product features before signup.

- HeroDashboard component with Safe to Spend card, stats row, SVG line chart, 7-day calendar preview
- Staggered entrance animations (0ms → 600ms delays)
- Dark theme consistent with YNAB-inspired aesthetic

**Calendar Page Visual Polish** - Applied matching polish to `/dashboard/calendar`:

- Safe to Spend card redesign with gradient background and glow effect
- Stats row with color-coded amounts (amber for LOWEST, rose for BILLS)
- Balance trend chart refinements (380px height, compact $60K format)
- Quick summary cards with colored tints (emerald for income, orange for bills)
- Collapsible balance status legend and filter bar

**Files:** `components/landing/hero-dashboard.tsx` (created), multiple calendar components modified

---

### Day 42: Stripe Payment Links for Invoices

**Major Pro feature** - Pro users can receive invoice payments directly via Stripe Connect.

- Stripe Connect library (`lib/stripe/connect.ts`) with account management and checkout sessions
- Database migration adding `stripe_connect_accounts` table and invoice payment columns
- Settings UI for Connect account status and onboarding
- Invoice send integration auto-generates payment links
- Payment success page verifies and updates invoice status
- Webhook handler for `checkout.session.completed`

**Bug Fixes:**
- Invoice-linked income status sync (webhook now updates both invoice and income status)
- Removed paid invoice edit restriction

**Files:** `lib/stripe/connect.ts`, `app/pay/success/page.tsx`, `components/settings/stripe-connect-section.tsx`, multiple modified files

---

### Day 41: Simpler Onboarding + Emergency Fund Tracker

**Simpler Onboarding (2-Step Flow)** - Reduced from 4 steps to 2 steps (~60 seconds completion time).

- Step 1: Quick Setup (balance + optional income)
- Step 2: Bills
- Direct redirect to `/dashboard/calendar` on completion

**Emergency Fund Tracker** - Dashboard widget and settings form for tracking savings goals.

- Database columns: `emergency_fund_enabled`, `emergency_fund_goal_months`, `emergency_fund_account_id`
- Dashboard widget shows progress bar, months covered, amount to go
- Settings form with goal months selector (3/6/12) and account picker
- Color-coded progress: rose (<50%), amber (50-75%), teal (75%+)

**Files:** `components/onboarding/step-quick-setup.tsx`, `components/dashboard/emergency-fund-widget.tsx`, `components/settings/emergency-fund-form.tsx`

---

### Day 40: Low Balance Alerts + Safe to Spend Marketing

**Proactive Low Balance Alerts** - Users receive email alerts when balance projected to drop below safety buffer within 7 days.

- Database columns: `low_balance_alert_enabled`, `last_low_balance_alert_at`
- Alert email template with urgent amber/red design
- Cron route running daily at 10 AM UTC via Vercel Cron
- 3-day cooldown between alerts to prevent fatigue
- Settings UI toggle

**Safe to Spend Marketing** - Highlighted as core feature on landing page:

- Updated hero subtitle with "safe to spend" highlight
- Pillar 1 rebranded to "Safe to Spend" with "Core Feature" badge
- Comparison page updated with new feature rows

---

## Earlier Development Summary (Days 1-39)

### Days 36-39: UI/UX Polish Phase

- **Day 39:** Automated welcome email system, user outreach campaign (6 inactive users)
- **Day 38:** Comprehensive filter system for all pages (Calendar, Dashboard, Bills, Income, Invoices, Accounts) with URL persistence
- **Day 37:** Import page YNAB-inspired redesign with step indicator, column auto-detection, duplicate detection
- **Day 36:** YNAB-inspired calendar redesign with interactive balance trend chart, enhanced day cards, hybrid responsive layout

### Days 33-35: Features & SEO

- **Day 35:** Tax Savings Tracker (YTD income, quarterly deadlines, dashboard widget)
- **Day 34:** PostHog NPS survey, in-app feedback widget, semi-monthly frequency support
- **Day 33:** SEO targeting "cash flow calendar", comparison page at `/compare/cash-flow-calendar-apps`

### Days 27-32: Tools & Polish

- **Day 32:** Income Variability Calculator free tool
- **Day 31:** Invoice Payment Date Predictor free tool
- **Day 30:** Social sharing OG/Twitter fixes, dynamic OG images
- **Day 29:** Landing page revamp with 3-pillar structure, "Who It's For" section
- **Day 28:** Pricing simplification (sunset Premium, Pro now includes 365-day forecasts)
- **Day 27:** CSV import UX fixes, list refresh bug fixes

### Day 26: Weekly Email Digest

- Weekly digest preferences in user_settings
- Digest data from calendar projection + collision detection
- Hourly cron job with timezone-aware sending
- Signed unsubscribe + tracking endpoints

### Days 23-25: SEO & Dashboard

- **Day 25:** Dashboard guidance cards (Daily Budget, Path Forward), mobile responsiveness
- **Day 23:** FAQ section with FAQPage schema, Terms/Privacy pages, sitemap/robots

### Day 22: Feature Gating + Analytics + Stripe Live

**PostHog Analytics:** User identification, core event tracking (signups, onboarding, feature usage, conversions), session recording

**Feature Gating System:**
- Client hooks: `useSubscription()`, `useUsage()`
- Server utilities: `canAddBill()`, `canAddIncome()`, `canUseInvoicing()`
- Upgrade prompts, usage indicators, gated buttons

**Stripe Live Mode:** Real payments processing, full subscription lifecycle tested

### Day 21: Stripe Integration

- Stripe Checkout with user metadata
- Webhook handler for subscription events
- Subscriptions database table with RLS
- Customer Portal integration

### Days 17-20: Launch Prep

- **Day 20:** Landing page polish, Google OAuth
- **Day 19:** Payment reminders (3 escalating templates)
- **Day 18:** Post-launch polish
- **Day 17:** Runway Collect invoicing (PDF generation, email sending), deployment to Vercel

### Days 9-16: Calendar & Landing

- **Days 14-15:** Calendar polish (dark theme, warnings, "Can I Afford It?" scenarios)
- **Days 11-13:** Calendar UI implementation
- **Days 9-10:** Calendar algorithm
- **Day 16:** Landing page

### Days 1-8: Foundation

- **Days 6-8:** Core data models (accounts, income, bills CRUD)
- **Days 4-5:** Authentication (Supabase Auth, email + Google OAuth)
- **Days 1-3:** Foundation (Next.js 15, Supabase, Tailwind, project structure)

---

## Infrastructure Status

### Completed

- Domains: cashflowforecaster.io, .app (DNS via Namecheap → Vercel)
- Database: Supabase with 15 tables, RLS, TypeScript types
- Hosting: Vercel with custom domain, SSL
- Payments: Stripe live mode (checkout, webhooks, portal)
- Analytics: PostHog (events, session recording, NPS surveys)
- Email: Resend (transactional, digest, alerts)

### Next Up

- Reddit launch
- Sentry error monitoring

---

## Tier Limits

| Feature | Free | Pro |
|---------|------|-----|
| Bills | 10 | Unlimited |
| Income Sources | 10 | Unlimited |
| Forecast Days | 90 | 365 |
| Invoicing | No | Yes |
| Stripe Payment Links | No | Yes |
| CSV Export | Yes | Yes |
| Excel/JSON Export | No | Yes |
| Export History | 5 items | Unlimited |

---

## PostHog Events Tracked

**Auth:** `user_signed_up`, `user_logged_in`
**Onboarding:** `onboarding_started`, `onboarding_step_completed`, `onboarding_completed`
**Core Features:** `account_created`, `income_created`, `bill_created`, `calendar_viewed`, `scenario_tested`
**Invoicing (Pro):** `invoice_created`, `invoice_sent`, `reminder_sent`
**Feedback:** `feedback_submitted`
**Conversion:** `upgrade_prompt_shown`, `upgrade_initiated`, `subscription_created`, `subscription_cancelled`
**Alerts:** `low_balance_alert_sent`, `welcome_email_sent`
**Tax:** `tax_tracking_toggled`, `tax_settings_updated`
**Emergency Fund:** `emergency_fund_settings_updated`
**Exports:** `export_generated`, `report_downloaded`

---

## Feature Roadmap

### Completed

| Feature | Notes |
|---------|-------|
| 90/365-day cash flow calendar | Core feature, tier-based |
| Accounts/Income/Bills CRUD | All frequencies supported |
| Runway Collect invoicing | PDF, email, reminders, Stripe payments |
| Onboarding wizard | 2-step guided setup |
| "Can I Afford It?" scenarios | Core differentiator |
| Google OAuth | One-click signup |
| Stripe payments | Checkout, webhooks, portal, Connect |
| PostHog analytics | Full event tracking |
| Feature gating | Tier limits enforced |
| Weekly email digest | Timezone-aware, collision warnings |
| Tax Savings Tracker | YTD income, quarterly deadlines |
| Emergency Fund Tracker | Progress bar, goal tracking |
| Low Balance Alerts | Proactive 7-day warnings |
| Comprehensive filters | URL-persisted, all pages |
| YNAB-inspired UI | Dark theme, interactive chart |
| Interactive landing hero | Demonstrates product pre-signup |
| User profile dropdown | Avatar, plan badge, quick actions |
| Invoice branding | Logo upload, business name on PDFs |
| Currency input formatting | Comma formatting as you type |
| Form UX consistency | Unified styling, mobile touch targets |
| Reports & Export | CSV/Excel/JSON export, quick reports, custom builder |
| Custom Bill Categories | User-defined categories with colors, icons, inline creation |
| Data Visualization Charts | Forecast balance chart, payoff timeline chart (Recharts) |

### Upcoming

| Feature | Priority |
|---------|----------|
| Reddit launch | HIGH |
| Sentry error monitoring | MEDIUM |
| Plaid bank sync | LOW |

---

## Development Velocity

**Cumulative:** ~98-115 hours over 44 days
**Average:** ~2.5 hours per day

---

## What's Working Well

- Complete MVP with all core features
- Simpler onboarding (2-step, ~60 seconds)
- YNAB-inspired calendar with interactive chart
- Bill collision warnings (calendar + email digest)
- Stripe live mode with Connect for invoice payments
- PostHog tracking conversion funnel
- Feature gating enforcing tier limits
- Emergency Fund + Tax Savings trackers
- Low balance email alerts
- Polished user profile dropdown with avatar
- Consistent form UX with comma-formatted currency inputs
- Mobile-optimized touch targets (44px minimum)
- Dashboard mobile layout with responsive text and no overflow
- Calendar mobile UX with always-visible stats (no "Tap for more")
- Mobile navigation with user avatar menu and Dashboard as Home
- Reports & Export with quick reports, custom builder, and export history
- Custom bill categories with colors, icons, and inline creation
- Data visualization with Recharts (payoff timeline, forecast balance charts)
- Improved empty states with context-aware messaging

## What's Next

1. **Reddit launch** - Post to target subreddits
2. **Monitor analytics** - NPS responses, conversion funnel, alert effectiveness
3. **User feedback iteration** - Based on real usage
4. **Sentry error monitoring** - Catch production errors

---

**Status:** **FULLY LAUNCH-READY** - Live payments, feature gating, analytics all working in production!

**This is a living document. Update after each development session.**
