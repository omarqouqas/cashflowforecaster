# Cash Flow Forecaster - Development Progress

**Last Updated:** February 11, 2026 (Day 58)

**Repository:** https://github.com/omarqouqas/cashflowforecaster

**Live URL:** https://cashflowforecaster.io

---

## Quick Stats

- **Days in Development:** 58
- **Commits:** 406+
- **Database Tables:** 15
- **Test Coverage:** Manual testing (automated tests planned post-launch)

## Current Status Summary

**Overall Progress:** MVP Complete + Feature Gating + Analytics + Stripe Live + YNAB-Inspired Calendar + Comprehensive Filters + Low Balance Alerts + Simpler Onboarding + Emergency Fund Tracker + Stripe Payment Links + Landing Page Hero Dashboard + Calendar Visual Polish + User Profile Dropdown Redesign + Invoice Branding + Form UX Polish + SEO/AEO Audit + Content Expansion (16 Blog Posts + Glossary) + Dashboard/Calendar Mobile UX Polish + Semi-Monthly Frequency Bug Fixes + Reports & Export Feature + Custom Bill Categories + Credit Card Cash Flow Forecasting + Debt Payoff Planner + User Settings Currency Support + Quotes Feature + Lifetime Deal + Pricing Updates + Comparison Pages + YNAB Import + Import Recurring Entries + Quarterly/Annually Income Frequencies + Excel Import + 6 SEO Blog Posts + **Landing Page Repositioning (Sacred Seven PM Review)**

**Current Focus:**

- **User acquisition via Twitter, Indie Hackers, Facebook Groups** (Reddit account unavailable)
- Direct outreach to freelancers on Twitter (5 DMs/day)
- Validate product-market fit before building new features
- Target: 50 active users, 5 paying customers, 3 testimonials

---

## Recent Development (Days 40-58)

### Day 58: Landing Page Repositioning + PM Strategy Review (February 11, 2026)

**Strategic Product Review** - Conducted comprehensive product analysis using "Product Management's Sacred Seven" framework (Product Design, Economics, Psychology, UX, Data Science, Law & Policy, Marketing & Growth).

**Key Findings:**
- Product identity crisis: Too many features (forecasting + invoicing + debt payoff + tax tracking = 5+ products in one)
- Pricing psychology mismatch: $7.99/mo may be underpriced for value delivered
- Build-to-validate ratio inverted: 58 days development, only ~13 users
- Domain/brand: "cashflowforecaster.io" is generic and hard to remember
- No social proof: Zero testimonials, no user counts displayed

**Landing Page Repositioning:**

| Element | Before | After |
|---------|--------|-------|
| Headline | "Forecast Your Cash Flow. Get Paid Faster." | "Stop guessing if you can afford it." |
| Subheadline | Long paragraph about invoicing features | "See your real bank balance 90 days out — no bank connection required." |
| Social Proof | None | "Join 50+ freelancers testing the beta" |
| CTA #1 | "Ready to forecast your cash flow..." | "Know if you'll make rent — 90 days before it's due" |
| CTA #2 | "Ready to forecast and get paid..." | "Stop the 'can I afford this?' anxiety" |
| Meta Title | "Cash Flow Calendar for Freelancers" | "Stop Guessing If You Can Afford It" |

**New Documentation:**
- `seven-sacred-PM-skills.md` - Complete Sacred Seven framework analysis
- `implementation-plan.md` - Phased action plan (P0-P3) with validation checkpoints

**Files Modified:**
- `app/page.tsx` - Landing page headline, subheadline, CTAs, meta tags, social proof

**Commits:**
- Landing page repositioning based on Sacred Seven PM framework

**Next Actions (P0 - This Week):**
1. Post Twitter thread (drafted)
2. Create Facebook account (personal, real name)
3. Join 2-3 freelancer Facebook groups
4. Post on indiehackers.com
5. DM 5 freelancers/day on Twitter

---

### Day 57: Excel Import Support, Bug Fixes & SEO Blog Posts (February 8, 2026)

**Evening Update: 6 SEO-Optimized Blog Posts** - Created comprehensive blog content targeting key SEO opportunities identified in content gap analysis.

**New Blog Posts:**
1. **Credit Card Cash Flow Forecasting** (`/blog/credit-card-cash-flow-forecasting`)
   - 7 min read, guides category
   - Covers utilization tracking, payment planning, forecasting strategies
   - Keywords: credit card utilization forecasting, credit card payment planning

2. **Debt Payoff: Snowball vs Avalanche** (`/blog/debt-payoff-snowball-vs-avalanche`)
   - 8 min read, guides category
   - Compares methods with examples for irregular income
   - Keywords: debt payoff calculator freelancer, snowball vs avalanche

3. **Import Bank Transactions from Excel** (`/blog/import-bank-transactions-excel`)
   - 5 min read, guides category
   - Step-by-step guide with HowTo schema
   - Keywords: Excel import budgeting tool, bank statement import

4. **Why We Offer a $99 Lifetime Deal** (`/blog/lifetime-deal-no-subscription`)
   - 4 min read, news category
   - Addresses subscription fatigue, YNAB comparison
   - Keywords: YNAB alternative lifetime deal, no subscription budget app

5. **Export Cash Flow Data for Tax Season** (`/blog/export-cash-flow-data-tax-season`)
   - 6 min read, guides category
   - 1099 contractor guide with HowTo schema
   - Keywords: cash flow reports for taxes, 1099 tax records

6. **How to Migrate from YNAB** (`/blog/migrate-from-ynab`)
   - 6 min read, guides category
   - Complete migration walkthrough with HowTo schema
   - Keywords: YNAB to cash flow forecaster, migrate from YNAB

**Each Blog Post Includes:**
- Full article with comprehensive content (300-500+ lines)
- OpenGraph image generation via next/og
- JSON-LD structured data (Article, HowTo, FAQ schemas)
- Internal cross-linking to related pages and features
- CTAs linking to signup, pricing, and relevant features

**New Files:**
- `app/blog/credit-card-cash-flow-forecasting/page.tsx` + `opengraph-image.tsx`
- `app/blog/debt-payoff-snowball-vs-avalanche/page.tsx` + `opengraph-image.tsx`
- `app/blog/import-bank-transactions-excel/page.tsx` + `opengraph-image.tsx`
- `app/blog/lifetime-deal-no-subscription/page.tsx` + `opengraph-image.tsx`
- `app/blog/export-cash-flow-data-tax-season/page.tsx` + `opengraph-image.tsx`
- `app/blog/migrate-from-ynab/page.tsx` + `opengraph-image.tsx`

**Modified Files:**
- `lib/blog/posts.ts` - Added 6 new blog post metadata entries
- `docs/content-update-roadmap.md` - Marked all blog posts as complete

**Commits:**
- `46da3db` feat: add 6 SEO-optimized blog posts

---

**Excel File Import Feature** - Users can now import transactions from Excel files (.xlsx, .xls) in addition to CSV.

**New Feature:**
- Added Excel file support to both generic import and YNAB import pages
- Uses existing `xlsx` package (already installed for exports)
- Parses first sheet of Excel workbooks
- Handles Excel date serial numbers (converted to YYYY-MM-DD format)
- Handles formatted numbers and currency values
- Detailed error messages for password-protected, corrupted, or unsupported files

**Import Feature Bug Fixes (4 fixes):**
1. **Browser compatibility** - Added `generateId()` utility function with `crypto.randomUUID()` fallback for older browsers
2. **Excel error handling** - Added try-catch with specific error messages for common Excel parsing issues
3. **Operator precedence** - Fixed `hasDupes` logic in column-mapper.tsx (confusing `&&`/`||` precedence)
4. **Stale error clearing** - Transaction selector now clears error messages when filters change

**Additional Bug Fixes (2 fixes):**
5. **Compact currency formatting** - Fixed ternary bug showing "$1K" instead of "$1.2K" for non-round thousands
6. **Transfer amount validation** - Added validation to prevent zero/negative amounts in create/update transfer actions

**New Files:**
- `lib/import/parse-xlsx.ts` - Excel parsing utility with `parseExcel()`, `isExcelFile()`, `isSupportedSpreadsheet()`

**Modified Files:**
- `lib/utils.ts` - Added `generateId()` with crypto.randomUUID fallback
- `lib/utils/format.ts` - Fixed compact currency formatting ternary bug
- `lib/actions/transfers.ts` - Added amount > 0 validation
- `components/import/csv-upload.tsx` - Accept .xlsx/.xls files
- `components/import/ynab-csv-upload.tsx` - Accept .xlsx/.xls files
- `components/import/column-mapper.tsx` - Fixed hasDupes operator precedence
- `components/import/transaction-selector.tsx` - Clear errors on filter change
- `components/import/import-page-client.tsx` - Use generateId(), handle Excel files
- `components/import/ynab-import-page-client.tsx` - Use generateId(), handle Excel files
- `lib/import/parse-ynab-csv.ts` - Added `parseYnabData()` for pre-parsed data

**Commits:**
- `87a38e4` feat: add Excel file import support (.xlsx, .xls)
- `058bf84` fix: import feature bug fixes
- `06b7967` fix: compact currency formatting and transfer validation

---

### Day 56: Bug Fixes & Type Safety Improvements (February 4-5, 2026)

**Evening Update: Credit Card & Transfer Bug Fixes** - Fixed 4 additional bugs in credit cards and transfers features.

**Credit Card & Transfer Bug Fixes:**

1. **Missing `minimum_payment_percent` field** - Database had the field but UI forms were missing it. Added to both new and edit account forms with 2% default. Used by payment simulator and debt payoff calculator.

2. **Orphaned transfers on account deletion** - Deleting a bank account left associated transfers orphaned (or caused FK constraint failures). Now deletes transfers that reference the account before deleting the account itself.

3. **Timezone-aware date handling** - Transfer form and export modal used `toISOString()` which converts to UTC, showing yesterday's date for users in western timezones. Changed to local date formatting.

4. **Negative balance (credit) handling** - Credit cards with negative balances (overpayments) were treated as $0 owed. Now properly shows as green "credit" with 0% utilization.

**Files Modified (Evening):**
- `app/dashboard/accounts/new/page.tsx` - Added minimum_payment_percent field
- `app/dashboard/accounts/[id]/edit/page.tsx` - Added minimum_payment_percent field
- `components/accounts/delete-account-button.tsx` - Delete associated transfers
- `app/dashboard/transfers/new/page.tsx` - Local timezone date handling
- `components/reports/export-builder-modal.tsx` - Local timezone date handling
- `components/dashboard/credit-cards-section.tsx` - Negative balance handling

**Commit:** `f19e4ff` fix: credit card and transfer bug fixes

---

**Morning Session: Comprehensive Bug Fix Session** - Fixed 8 bugs across calendar, accounts, transfers, and onboarding.

**Critical Bug Fixes:**

1. **CC payment not showing in calendar modal** - CC payments had `frequency: 'once'` but calendar filters expected `'one-time'`. Fixed mismatch in `calculate-cc-payments.ts`.

2. **is_active null handling** - Bills and transfers with `is_active=null` were incorrectly treated as inactive due to truthy check. Changed to explicit `=== false` check to match `generate.ts` behavior.

3. **Onboarding bill due date clamp** - Was clamping days to 1-28, breaking bills due on 29th-31st. Now properly handles month-end edge cases.

**Medium Priority Fixes:**

4. **Dynamic currency symbols** - Account new/edit forms were showing hardcoded `$`. Now use `getCurrencySymbol(currency)` for proper symbol based on selected currency.

5. **Broken CC link in dashboard** - Credit cards section linked to `/dashboard/accounts/[id]` (404). Fixed to `/dashboard/accounts/[id]/edit`.

6. **Unknown transfer frequency warning** - Added `console.warn()` for unknown frequencies in `calculateTransferOccurrences` to help debug issues.

**Code Quality Improvements:**

7. **Array index as React key** - Fixed in 5 locations:
   - `day-detail-modal.tsx`: income, bills, transfers → use `transaction.id`/`transfer.id`
   - `pricing-section.tsx`: features → use feature text
   - `faq-section.tsx`: faqs → use `faq.question`

8. **Type safety improvements** - Removed `as any` casts across codebase:
   - `calendar/page.tsx`: Proper typing for Supabase data and transfers
   - `account-card.tsx`: Use `account.credit_limit` directly (already in type)
   - `calendar-container.tsx`: Added `SerializedDate` type for date normalization
   - `invoices.ts`: Replace non-null assertion with optional chaining
   - `exports/route.ts`: Added `ForecastExportData` type, use separate variable

**Files Modified:**
- `lib/calendar/calculate-cc-payments.ts` - Frequency fix
- `lib/calendar/calculate-bills.ts` - is_active null handling
- `lib/calendar/calculate-transfers.ts` - is_active null handling + unknown frequency warning
- `components/dashboard/credit-cards-section.tsx` - Fixed link
- `app/dashboard/accounts/new/page.tsx` - Dynamic currency symbol
- `app/dashboard/accounts/[id]/edit/page.tsx` - Dynamic currency symbol
- `components/onboarding/step-bills.tsx` - Day clamp fix
- `components/calendar/day-detail-modal.tsx` - React keys
- `components/landing/pricing-section.tsx` - React keys
- `components/landing/faq-section.tsx` - React keys
- `app/dashboard/calendar/page.tsx` - Type safety
- `components/accounts/account-card.tsx` - Type safety
- `components/calendar/calendar-container.tsx` - Type safety
- `lib/actions/invoices.ts` - Type safety
- `app/api/exports/generate/route.ts` - Type safety

**Commits:**
- `619704d` fix: improve type safety across codebase
- `fb2f0de` fix: onboarding bill due date now supports days 29-31
- `1270d9f` fix: minor code quality improvements
- `fbb0009` fix: is_active null handling in bills and transfers calculation
- `c7b2cea` fix: CC payment not showing in calendar day modal
- `6a32740` fix: dynamic currency symbols in account forms and CC dashboard link

---

### Day 55: Import Recurring Entries + Income Frequency Expansion + Import Page UX Polish (February 3, 2026)

**Evening Update: Import Page UX Polish** - World-class UX improvements to the import workflow.

**Import Page UX Improvements (10 fixes):**
1. **Auto-detect date range** - Date filter now auto-detects earliest date from CSV data (no more 0 of 100 results)
2. **Transaction count in button** - Changed "Select rows to import" → "Import 5 transactions" with live count
3. **Removed premature banner** - Removed "Invoice matching coming soon" banner (cluttered UI)
4. **Column prioritization** - Preview table now shows Date, Description, Amount columns first
5. **Sensitive data masking** - Account numbers masked in preview (shows last 4 digits only)
6. **Select buttons repositioned** - Moved Select all/Deselect all buttons near transaction table (was above filters)
7. **Unambiguous date format** - Changed YYYY-MM-DD → "Nov 29, 2025" format in review table
8. **YNAB banner hidden after upload** - YNAB import banner hides once CSV is loaded
9. **Font color visibility** - Upgraded zinc-500 → zinc-400/zinc-300 throughout for better readability
10. **Improved color contrast** - All descriptive text and labels now meet accessibility standards

**Files Modified (Import UX):**
- `components/import/transaction-selector.tsx` - Date auto-detect, button text, removed banner, select buttons, date format, colors
- `components/import/import-page-client.tsx` - YNAB banner hide, column prioritization, account masking, colors
- `components/import/csv-upload.tsx` - Font color improvements
- `components/import/column-mapper.tsx` - Font color improvements

---

**User Feedback Session** - Jeremy (CPA CA CMA MBA, 20+ years CFO experience) provided strategic feedback on product direction and feature requests.

**Strategic Direction Decided:**
- **Cash Flow First, Light Invoicing** - Core value prop is cash flow forecasting, not invoicing
- Invoicing features serve AR tracking for cash flow, not as standalone invoicing solution
- Future cleanup: Consider renaming "Invoices" → "Expected Income" or "Receivables"

**New Feature: Import → Recurring Entries**
- Import wizard now offers 5 options: Ignore, One-time income, Recurring income, One-time bill, Recurring bill
- When recurring is selected, frequency dropdown appears (weekly, bi-weekly, semi-monthly, monthly, quarterly, annually)
- Works in both generic CSV import and YNAB import
- Default frequency is monthly if not specified

**Income Frequency Expansion:**
- Added quarterly and annually frequency options to income (previously bills-only)
- Use cases: quarterly dividends, annual bonuses, tax refunds, seasonal income
- Updated income new/edit forms with new frequency options
- Updated zod schemas to validate new frequencies
- Updated income-card.tsx with next date calculations and frequency badges (orange for quarterly, rose for annually)
- Updated income-filters.tsx with new frequency filter options
- Updated income-content.tsx with next date calculations
- Updated income page with monthly income calculations (quarterly = amount/3, annually = amount/12)

**Files Modified (Import Feature):**
- `components/import/transaction-selector.tsx` - New action types, FrequencySelect component
- `components/import/import-page-client.tsx` - Handle recurring entries in import
- `components/import/ynab-import-page-client.tsx` - Handle recurring entries in YNAB import

**Files Modified (Income Frequencies):**
- `app/dashboard/income/new/page.tsx` - Added quarterly/annually options + zod schema
- `app/dashboard/income/[id]/edit/page.tsx` - Added quarterly/annually options + zod schema
- `components/income/income-card.tsx` - Next date calc, icon, badge for quarterly/annually
- `components/income/income-filters.tsx` - Added quarterly/annually to FrequencyType and filter options
- `components/income/income-content.tsx` - Next date calculations for quarterly/annually
- `app/dashboard/income/page.tsx` - Monthly income calculations + next date calculations
- `lib/calendar/calculate-income.ts` - Added quarterly/annually cases to calendar generation (bug fix)

**Documentation Updated:**
- `docs/user-feedback-jeremy.md` - Added Feb 2026 feedback, strategic direction, implementation status

---

### Day 54: Pricing Updates & Comparison Pages (February 2, 2026)

**Lifetime Pricing Adjustment:**
- Reduced lifetime deal from $149 to $99 (closer to Cash Flow Calendar's $72)
- Updated savings text to "37% vs 2 years of Pro (yearly)" — honest comparison vs yearly pricing
- Updated all UI components, docs, and comparison pages

**Pro→Lifetime Refund Fix:**
- Fixed prorated refund logic for Pro users upgrading to lifetime
- Previously: Stripe credit balance was created but NOT refunded to payment method
- Now: Automatically refunds prorated amount to customer's original charge
- Excludes lifetime purchase charge from refund search
- Handles yearly Pro members with larger prorated amounts
- Fallback for partial refunds if needed

**Checkout Success Messages:**
- Added success banners on dashboard after checkout completion
- Pro: "🎉 Welcome to Pro! Your subscription is now active." (teal styling)
- Lifetime: "✨ Welcome to Lifetime! You now have permanent Pro access with no recurring fees." (amber styling)

**Competitor Migration Pages:**
- Created `/compare/ynab` — Target frustrated YNAB users ($14.99/mo → $7.99/mo, 47% savings)
- Created `/compare/mint` — Capture Mint refugees with migration guide
- SEO-optimized with structured data, FAQs, and comparison tables

**Modified Files:**
- `lib/stripe/config.ts` — Updated lifetime amount to 9900 cents
- `components/subscription/lifetime-deal-banner.tsx` — $149 → $99
- `components/pricing/pricing-section.tsx` — $149 → $99, savings 48% → 37%
- `app/api/webhooks/stripe/route.ts` — Fixed prorated refund logic
- `app/dashboard/page.tsx` — Pass checkout params to content
- `components/dashboard/dashboard-content.tsx` — Show checkout success messages

**New Files:**
- `app/compare/ynab/page.tsx` — YNAB comparison page
- `app/compare/mint/page.tsx` — Mint migration page

**Bug Fixes (11 total):**

*YNAB Import & Date Display (5 bugs):*
- Fixed one-time bills/income not showing dates (only showed if future)
- Fixed missing null check in income-card for `income.next_date`
- Fixed UUID regeneration when existingTransactions loads (both import pages)
- Fixed React setState inside setState callback in transaction-selector
- Fixed file input not resetting (can't re-upload same file)

*Calendar & Date Handling (3 bugs):*
- Fixed Date serialization bug in CalendarHybridView (desktop calendar crash)
- Added `toDate()`, `normalizeDay()` functions to normalize server-serialized dates
- Prevents `.getTime()` crash on string dates from server components

*Server Actions & Async (3 bugs):*
- Fixed UTC date parsing bugs in invoices.ts, send-reminder.ts, quotes.ts
- Fixed unhandled promise and unmount issues in scenario-modal.tsx
- Fixed missing useEffect dependency in filter-panel.tsx
- Fixed redundant timeout logic in weekly-digest route.ts

**Modified Files (Bug Fixes):**
- `components/bills/bill-card.tsx` — Date display for one-time bills
- `components/income/income-card.tsx` — Date display + null check
- `components/import/ynab-import-page-client.tsx` — UUID stability
- `components/import/import-page-client.tsx` — UUID stability
- `components/import/transaction-selector.tsx` — React state fix
- `components/import/ynab-csv-upload.tsx` — File input reset
- `components/import/csv-upload.tsx` — File input reset
- `components/calendar/calendar-hybrid-view.tsx` — Date normalization
- `components/filters/filter-panel.tsx` — useEffect dependency
- `components/scenarios/scenario-modal.tsx` — Async/unmount handling
- `lib/actions/invoices.ts` — Local date parsing
- `lib/actions/send-reminder.ts` — Local date parsing
- `lib/actions/quotes.ts` — Local date parsing
- `app/api/cron/weekly-digest/route.ts` — Timeout simplification

**Additional Bug Fixes (7 more):**

*UTC Date Parsing (5 bugs):*
- Fixed `filter-date-range.tsx` — Parse date parts manually, use local noon instead of UTC midnight
- Fixed `dashboard-content.tsx` — Invoice due date parsing for overdue status
- Fixed `calculate-payment-date.ts` — `dateOnlyToLocalDate()` now uses local noon
- Fixed `calculate-affordability.ts` — `dateOnlyToLocalDate()` now uses local noon
- Fixed `invoices/[id]/page.tsx` — `isOverdue()` function uses local noon for due date

*Error Handling & Logic (2 bugs):*
- Fixed `invoices/[id]/send/route.ts` — Returns warning if DB update fails after email sent
- Fixed `dashboard/page.tsx` — `is_active` check consistency (changed `b.is_active` to `b.is_active !== false`)

**SEO Updates (YNAB Import):**
- Updated YNAB comparison page FAQ (was "coming soon", now describes actual importer)
- Added YNAB data migration row to comparison table
- Added YNAB/Mint migration keywords to landing page meta
- Added FAQ about importing from YNAB/Mint to landing page
- Updated CSV Import feature card to highlight YNAB support

---

### Day 53: Lifetime Deal Feature (January 29, 2026)

**New Feature: Lifetime Deal** - One-time $99 payment for permanent Pro access. Appeals to budget-conscious freelancers who prefer upfront payment over subscriptions.

**Stripe Integration:**
- New `createLifetimeCheckoutSession()` server action for one-time payment checkout
- Webhook handler for `checkout.session.completed` with `type: 'lifetime_purchase'` metadata
- Automatic cancellation of existing Pro subscription with prorated refund
- Database update with `tier: 'lifetime'` and 100-year expiration date

**Promotional Banner:**
- New `LifetimeDealBanner` component with amber/gold styling
- Dismissible with 7-day localStorage cooldown
- Direct checkout button ("Get Lifetime — $99")
- Shows for free/pro users only (hidden for lifetime/premium)
- Added to Dashboard, Invoices, Quotes, and Settings pages

**UI Updates:**
- `SubscriptionStatus` component updated with Sparkles icon for lifetime tier
- Shows "Lifetime access — no renewal needed" instead of renewal date
- "Manage" button hidden for lifetime users (no subscription to manage)
- Pricing page comparison table updated with lifetime option

**Webhook Safety:**
- Operation order: Update database FIRST, then cancel Stripe subscription
- Race condition protection: `handleSubscriptionCanceled` skips downgrade if tier is 'lifetime'
- Error handling for subscription cancellation failures (logs warning, doesn't fail)

**Feature Gating:**
- Lifetime tier has same limits as Pro (all features unlocked)
- `TIER_RANK['lifetime'] = 2` (same as premium) for access checks
- Export features properly include lifetime in `isPro` checks
- `canUseInvoicing()` correctly grants access to lifetime users

**Bug Fixes:**
- Fixed Safari private mode localStorage error with try-catch
- Fixed invalid date parsing from corrupted localStorage
- Fixed potential double-billing for Pro users upgrading to lifetime

**New Files:**
- `components/subscription/lifetime-deal-banner.tsx` - Promotional banner component

**Modified Files:**
- `lib/actions/stripe.ts` - Added `createLifetimeCheckoutSession()` action
- `app/api/webhooks/stripe/route.ts` - Added lifetime purchase handler with safety fixes
- `components/subscription/subscription-status.tsx` - Lifetime tier UI updates
- `components/reports/export-builder-modal.tsx` - Added lifetime to isPro check
- `components/reports/reports-page-content.tsx` - Added lifetime to isPro check
- `app/dashboard/page.tsx` - Added LifetimeDealBanner
- `app/dashboard/invoices/page.tsx` - Added LifetimeDealBanner
- `app/dashboard/quotes/page.tsx` - Added LifetimeDealBanner
- `app/dashboard/settings/page.tsx` - Added LifetimeDealBanner
- `app/compare/cash-flow-calendar-apps/page.tsx` - Updated pricing comparison

---

### Day 52: Quotes Feature (January 29, 2026)

**New Feature: Quotes** - Freelancers can now create professional quotes, send them to clients, and convert accepted quotes to invoices. Part of the Pro-tier Runway Collect feature.

**Database:**
- New `quotes` table with fields: id, user_id, quote_number, client_name, client_email, amount, currency, valid_until, description, status, sent_at, viewed_at, accepted_at, rejected_at, converted_invoice_id, created_at, updated_at
- Quote numbering format: QTE-0001 (auto-incremented per user)
- Statuses: draft, sent, viewed, accepted, rejected, expired

**New Pages:**
- `/dashboard/quotes` - Quote list with summary stats (Total Pending by currency, Awaiting Response, Accepted, Expiring Soon)
- `/dashboard/quotes/new` - Create quote form with currency selector and valid_until presets (14/30/60 days)
- `/dashboard/quotes/[id]` - Quote detail page with timeline, status actions, and convert-to-invoice button
- `/dashboard/quotes/[id]/edit` - Edit form (draft/sent quotes only)

**New Components:**
- `components/quotes/new-quote-form.tsx` - Quote creation with currency selector
- `components/quotes/edit-quote-form.tsx` - Quote editing
- `components/quotes/quotes-content.tsx` - Filterable quote list
- `components/quotes/quotes-filters.tsx` - Status, amount, and search filters
- `components/quotes/send-quote-button.tsx` - Send/resend quote via email
- `components/quotes/download-quote-pdf-button.tsx` - Download quote PDF
- `components/quotes/convert-to-invoice-button.tsx` - Convert accepted quote to invoice
- `components/quotes/delete-quote-button.tsx` - Delete draft quotes
- `components/quotes/delete-quote-icon-button.tsx` - Icon version for list view
- `components/quotes/mark-quote-status-button.tsx` - Accept/Reject buttons

**Server Actions (`lib/actions/quotes.ts`):**
- `getQuotes()` - List user's quotes
- `getQuote(id)` - Get single quote with user_id verification
- `createQuote(input)` - Create quote with auto-generated number
- `updateQuote(id, input)` - Update quote (draft/sent only)
- `deleteQuote(id)` - Delete quote (draft only)
- `updateQuoteStatus(id, status)` - Change status with timestamp
- `convertQuoteToInvoice(quoteId)` - Create invoice from accepted quote
- `getQuoteSummary()` - Stats with per-currency totals

**Email & PDF:**
- `lib/email/templates/quote-email.tsx` - Quote email template
- `lib/pdf/quote-template.tsx` - Quote PDF template (QUOTE header, Valid Until instead of Due Date)
- `app/api/quotes/[id]/pdf/route.ts` - PDF streaming endpoint
- `lib/actions/send-quote.ts` - Send quote via Resend with PDF attachment

**Key Features:**
- Per-document currency (quotes have their own currency, separate from user default)
- Multi-currency support in summary stats (displays totals per currency)
- Quote-to-invoice conversion preserves client, amount, currency, and description
- Timeline tracking: Created → Sent → Viewed → Accepted/Rejected
- Expiration tracking with "Expiring Soon" indicator (within 7 days)
- Pro tier gating via `canUseInvoicing()`

**Bug Fixes:**
- Fixed dark theme styling in quote components (was using light theme colors)
- Fixed security: quote detail page now uses `getQuote(id)` action for defense in depth
- Updated upgrade prompt to mention both quotes and invoices

**Navigation:**
- Added "Quotes" link to sidebar navigation (after Invoices)

---

### Day 51: User Settings Currency Support (January 28, 2026)

**Centralized Currency Preference** - All currency displays now respect the user's currency setting from `user_settings.currency`.

**Centralized getCurrencySymbol Function:**
- Added `getCurrencySymbol(currency: string)` to `lib/utils/format.ts`
- Uses `Intl.NumberFormat` with `currencyDisplay: 'narrowSymbol'` for proper symbols
- Falls back to currency code if symbol extraction fails
- Removed 6 duplicate implementations from across the codebase

**Files Updated to Use User Currency:**
- Dashboard page (`app/dashboard/page.tsx`) - fetches and passes currency
- Calendar page (`app/dashboard/calendar/page.tsx`) - fetches and passes currency
- Debt Payoff page (`app/dashboard/debt-payoff/page.tsx`) - fetches and passes currency
- Bills new/edit pages - dynamic currency symbol in amount input
- Income new/edit pages - dynamic currency symbol in amount input
- Settings page - passes currency to LowBalanceAlertForm

**Chart Currency Fixes:**
- `PayoffTimelineChart` Y-axis now uses dynamic currency symbol (was hardcoded $)
- `ForecastBalanceChart` uses passed currency prop
- Both charts: Added `minWidth={0}` to ResponsiveContainer to fix SSR warning

**Safety Buffer Form Improvements:**
- Now uses `CurrencyInput` component with comma formatting
- Fetches currency from `user_settings` for dynamic symbol
- Updated validation message from "at least $50" to "at least 50" (no hardcoded currency)
- Threshold preview uses `formatCurrency(value, currency)` for proper formatting

**Low Balance Alert Form:**
- Added `currency` prop (defaults to 'USD')
- Uses `formatCurrency` helper instead of inline `Intl.NumberFormat`

**Duplicate Code Removed (6 files):**
- `components/charts/payoff-timeline-chart.tsx`
- `components/charts/forecast-balance-chart.tsx`
- `components/calendar/sticky-header.tsx`
- `components/income/income-filters.tsx`
- `app/dashboard/income/new/page.tsx`
- `app/dashboard/income/[id]/edit/page.tsx`

**Bug Fixes:**
- Fixed Recharts SSR warning "width(-1) and height(-1) of chart should be greater than 0"
- Fixed hardcoded $ in safety buffer validation message
- Fixed chart Y-axis showing $ regardless of user's currency setting

---

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

| Feature | Free | Pro | Lifetime |
|---------|------|-----|----------|
| Bills | 10 | Unlimited | Unlimited |
| Income Sources | 10 | Unlimited | Unlimited |
| Forecast Days | 90 | 365 | 365 |
| Invoicing | No | Yes | Yes |
| Stripe Payment Links | No | Yes | Yes |
| CSV Export | Yes | Yes | Yes |
| Excel/JSON Export | No | Yes | Yes |
| Export History | 5 items | Unlimited | Unlimited |
| Price | $0 | $7.99/mo | $99 one-time |

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
| User Currency Preference | All currency displays respect user_settings.currency |

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
- Centralized currency preference from user_settings (no hardcoded $ symbols)
- Quotes feature with quote-to-invoice conversion workflow
- Lifetime deal option ($99) for upfront payment preference

## What's Next

1. **Reddit launch** - Post to target subreddits
2. **Monitor analytics** - NPS responses, conversion funnel, alert effectiveness
3. **User feedback iteration** - Based on real usage
4. **Sentry error monitoring** - Catch production errors

---

**Status:** **FULLY LAUNCH-READY** - Live payments, feature gating, analytics all working in production!

**This is a living document. Update after each development session.**
