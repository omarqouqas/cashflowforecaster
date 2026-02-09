# User Feedback: Jeremy (Jan-Feb 2026)

## Summary
Jeremy tested the app and provided valuable feedback on missing/desired features. Jeremy is a CPA CA CMA MBA with 20+ years of CFO experience.

## Feedback Points

### 1. One Year View
**Feedback:** "I like to see a one year view of my cash plan, I think you go out 3 months"

**Current State:**
- Free tier: 90 days (updated from 60)
- Pro tier: 365 days

**Action:** Bumped free tier to 90 days (quarterly view). Full year stays as Pro feature.

**Status:** ✅ Implemented

---

### 2. Credit Cards
**Feedback:** "I don't see anywhere for credit cards to be setup"

**Clarification (Jan 2026):** "They can be a blind spot for cash - I think it would help to include CC transactions and balances and be able to forecast payments"

**Current State:**
- Credit cards can be added as account type
- No special functionality (APR, limits, minimum payments, payoff planning)

**Action:** Build **differentiated** credit card cash flow forecasting (not just tracking like competitors)

**Status:** ✅ Implemented (Day 50)

---

## Credit Card Cash Flow Forecasting - Feature Specification

### Core Value Proposition
> "See exactly how your credit card spending today affects your bank balance tomorrow"

### Competitive Analysis
| Feature | Monarch | YNAB | Copilot | **Us** |
|---------|---------|------|---------|--------|
| Track CC balance | ✅ | ✅ | ✅ | ✅ |
| Due date reminders | ✅ | ❌ | ❌ | ✅ |
| **Spending → future cash outflow** | ❌ | ❌ | ❌ | ✅ |
| **Payment scenario simulator** | ❌ | ❌ | ❌ | ✅ |
| **Interest cost calculator** | ❌ | ❌ | ❌ | ✅ |
| **Utilization warnings** | ❌ | ❌ | ❌ | ✅ |
| **Debt payoff planner** | ❌ | ❌ | ❌ | ✅ |

### Feature 1: CC Spending → Future Cash Outflow
**What it does:** When you add a credit card transaction, the app shows when that money actually leaves your bank account (on payment due date).

**User experience:**
- Add $500 CC purchase on Jan 15
- Calendar shows $500 cash outflow on Feb 5 (payment due date)
- Running balance forecast adjusts accordingly

**Implementation:**
- CC transactions tracked separately from direct expenses
- Auto-generate projected payment entry on due date
- Aggregate all CC spending between statement cycles

### Feature 2: Payment Scenario Simulator
**What it does:** "What if I pay minimum vs full balance vs custom amount?"

**User experience:**
```
Your CC Balance: $2,450
Minimum Due: $49 (2%)
Statement Balance: $2,450

Payment Options                Cash Impact
─────────────────────────────────────────
○ Minimum ($49)               -$49 on Feb 5
  → Remaining: $2,401 + $45 interest
  → Paid off: 14 months

○ Statement Balance ($2,450)  -$2,450 on Feb 5
  → No interest charged
  → ⚠️ Balance drops to $1,200

● Custom Amount: $800         -$800 on Feb 5
  → Remaining: $1,650 + $30 interest
  → Paid off: 3 months

[Preview Cash Flow] [Set Payment Amount]
```

### Feature 3: Interest Cost Calculator
**What it does:** Shows the real cost of carrying a balance over time.

**User experience:**
```
Balance: $2,450 at 24.99% APR

If you pay only minimum:
├── Total interest paid: $847
├── Time to pay off: 14 months
└── Total cost: $3,297

If you pay $200/month:
├── Total interest paid: $198
├── Time to pay off: 14 months
└── Total cost: $2,648

You save $649 by paying $200/month instead of minimum
```

### Feature 4: Credit Utilization Alerts
**What it does:** Warns when utilization exceeds thresholds that hurt credit scores.

**User experience:**
```
⚠️ Chase Sapphire at 67% utilization ($6,700 / $10,000)

Credit score impact: Utilization over 30% can lower your score

To get under 30%: Pay down $3,700
To get under 10%: Pay down $5,700
```

**Implementation:**
- Credit limit field on CC accounts
- Utilization badges (green <30%, yellow 30-50%, red >50%)
- "Pay down to X%" calculator

### Feature 5: Debt Payoff Planner
**What it does:** Snowball vs Avalanche payoff strategies with cash flow projections.

**User experience:**
```
Your Credit Cards:
├── Chase: $2,450 at 24.99% APR (min $49)
├── Amex: $1,200 at 18.99% APR (min $24)
└── Discover: $800 at 21.99% APR (min $16)

Total Debt: $4,450 | Monthly Minimum: $89
Extra monthly payment available: $200

Avalanche (Highest APR First)
Pay off order: Chase → Discover → Amex
Total interest: $412 | Debt free: November 2026

Snowball (Lowest Balance First)
Pay off order: Discover → Amex → Chase
Total interest: $487 | Debt free: December 2026

Avalanche saves you $75 and 1 month
```

### Database Schema Changes

```sql
-- Extend accounts table for credit cards
ALTER TABLE accounts ADD COLUMN credit_limit DECIMAL(12,2);
ALTER TABLE accounts ADD COLUMN apr DECIMAL(5,2);
ALTER TABLE accounts ADD COLUMN minimum_payment_percent DECIMAL(4,2) DEFAULT 2.0;
ALTER TABLE accounts ADD COLUMN statement_close_day INTEGER; -- 1-28
ALTER TABLE accounts ADD COLUMN payment_due_day INTEGER; -- 1-28

-- Track CC transactions separately for forecasting
CREATE TABLE credit_card_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  account_id UUID REFERENCES accounts NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  description TEXT,
  transaction_date DATE NOT NULL,
  statement_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Track payoff plans
CREATE TABLE payoff_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  strategy TEXT CHECK (strategy IN ('avalanche', 'snowball', 'custom')),
  extra_monthly_payment DECIMAL(12,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### UI Components Needed

| Component | Location | Purpose |
|-----------|----------|---------|
| CC Account Form | `/accounts/new` | Add credit limit, APR, statement dates |
| Payment Simulator | CC Account detail | "What if I pay X?" scenarios |
| Utilization Badge | Account cards | Visual warning on high utilization |
| Interest Calculator | CC Account detail | Cost of carrying balance |
| Payoff Planner | New page or Settings | Multi-card debt strategy |
| CC Forecast Events | Calendar | Show when CC payments hit cash |

### Calendar Integration

```
Feb 1  ─────────────────────────────────
       Statement closes: Chase ($2,450)

Feb 5  ─────────────────────────────────
       💳 Chase Payment Due: $2,450
           Paying: $800 (custom)
           → Balance after: $1,650
           → Interest this month: ~$34

Feb 15 ─────────────────────────────────
       Statement closes: Amex ($1,200)
```

### Implementation Order

1. [x] **Database + CC account fields** - Foundation ✅
2. [x] **CC account form updates** - UI for new fields ✅
3. [x] **Statement/payment date forecasting** - Core differentiator ✅
4. [x] **Payment scenario simulator** - High value, moderate effort ✅
5. [x] **Utilization warnings** - Low effort, high visibility ✅
6. [x] **Interest calculator** - Medium effort ✅ (integrated into Payment Simulator)
7. [x] **Debt payoff planner** - Snowball vs Avalanche comparison ✅

---

### 3. Spend Categories
**Feedback:** "Would it make sense to have spend categories?"

**Clarification (Jan 2026):** "All good here - just need to be able to report on them and also add custom ones"

**Current State:**
- Custom bill categories with user-defined names, colors, and icons
- Category management in Settings page
- Dynamic category dropdowns in bill forms with inline creation
- Category filters on bills page with URL persistence
- Category reporting in exports
- Case-insensitive category matching throughout

**Action:** Custom category support implemented with comprehensive bug fixes!

**Status:** ✅ Implemented (Day 48-49)

**Delivered Features (per Jeremy):**
- Custom user-defined categories with colors and icons
- Category reporting via Category Spending export
- Inline category creation in bill forms (no need to go to Settings)

**Technical Implementation:**
- New `user_categories` table with RLS
- Default categories seeded on first use (Rent/Mortgage, Utilities, Subscriptions, Insurance, Other)
- Category management UI in Settings (`category-management-form.tsx`)
- Dynamic category dropdowns in bill forms (new, edit, onboarding)
- Category filters updated to use user's custom categories
- Pending category pattern (defer DB creation until form submission)
- URL slug conversion for clean filter URLs (`?ex=rentmortgage`)

**Bug Fixes Applied (24 total):**
- Case-insensitive category matching in filter logic
- Case-insensitive category matching when renaming/deleting categories
- Orphaned category display in dropdowns (bills with deleted categories)
- Race condition prevention in category creation
- ARIA accessibility labels for category dropdown
- TypeScript type safety improvements
- Proper disabled states during form submission

**Nice-to-Have (Future):**
- Category assignment for income sources
- Auto-categorization for imported transactions

---

### 4. Bank Import Format
**Feedback:** "I didn't try the bank import so I am not clear on the format"

**Clarification (Jan 2026):** "I didnt try this so not sure of functionality"

**Current State:**
- Accepts CSV exports from most banks
- Auto-detects common column names (date, description, amount)
- Manual column mapping available
- Help section added to Import page

**Action:** Help section implemented. May need additional feedback once Jeremy tries the feature.

**Status:** ✅ Implemented (awaiting usage feedback)

---

### 5. Standard Reports
**Feedback:** "It would be useful to have some standard reports"

**Clarification (Jan 2026):** "I would look for data extraction into Excel (csv) but you could have a report that shows spend by category, cash projection etc"

**Current State:**
- New `/dashboard/reports` page with:
  - Quick Reports (Monthly Summary, Category Spending, Cash Forecast, All Data)
  - Custom Export Builder with data selection, date range, and format options
  - Export History with 30-day retention and re-download capability
  - CSV export for free users, Excel/PDF/JSON for Pro

**Action:** Reports feature implemented!

**Status:** ✅ Implemented

**Delivered Features:**
- CSV/Excel export (data extraction) - CSV free, Excel Pro
- Spend by category report - Monthly Summary and Category Spending reports
- Cash projection report - Cash Forecast report (Pro)

---

## Reports Feature Roadmap

### Phase 1: Core Reports (MVP) - ✅ COMPLETE
- [x] **CSV/Excel Export** ⭐ (Jeremy's top ask)
  - Raw data export for spreadsheet users
  - Bills, income, accounts, invoices export
  - CSV (free) + Excel (Pro) formats

- [x] **Spend by Category Report** ⭐ (Jeremy's request)
  - Category Spending quick report
  - Percentage breakdown in export

- [x] **Cash Projection Report** ⭐ (Jeremy's request)
  - Cash Forecast quick report (Pro)
  - Daily projected balances export

- [x] **Custom Export Builder**
  - Data selection (bills, income, accounts, invoices)
  - Date range presets
  - Format selection
  - Export summary/preview

- [x] **Export History**
  - 30-day retention
  - Re-download capability
  - Status badges

### Phase 2: Additional Reports
- [x] **Monthly Cash Flow Summary**
  - Monthly Summary quick report
  - Income vs expenses breakdown

- [ ] **PDF Export**
  - Coming soon (marked in UI)
  - Printable formatted report

### Phase 3: Advanced Reports
- [ ] **Tax Summary Report**
  - Quarterly income totals
  - Categorized business expenses
  - Estimated tax calculations

- [ ] **Forecast Accuracy**
  - Compare predictions vs actuals
  - Track variance over time
  - Improve forecasting confidence

- [ ] **Scenario Comparison**
  - Save and compare what-if scenarios
  - Side-by-side projections

### UI/UX Delivered
- ✅ New `/dashboard/reports` route
- ✅ Quick Reports section with 4 report cards
- ✅ Custom Export Builder modal
- ✅ Date range presets (This Month, Last Month, Last 30 Days, This Quarter, This Year)
- ✅ Export History with status tracking
- ✅ Tier gating (CSV free, Excel/JSON Pro)

### Technical Implementation
- ✅ `xlsx` package for Excel generation
- ✅ Data URL encoding for immediate downloads
- ✅ Database table with RLS for export history
- ✅ Feature gates in `lib/stripe/feature-gate.ts`

---

## Implementation Priority

1. ✅ **90-day forecast for free users** - Config change (done)
2. ✅ **Import help section** - UX improvement (done)
3. ✅ **Reports tab** - Major feature (done)
   - CSV export (Jeremy's top priority)
   - Spend by category report
   - Cash projection report
   - Custom Export Builder with filters
   - Export History with re-download
4. ✅ **Custom categories** - Custom bill categories with colors and icons (done)
5. ✅ **Credit card cash flow forecasting** - Differentiated feature (DONE - Day 50)
   - [x] CC account fields (credit limit, APR, statement/payment dates)
   - [x] CC spending → future cash outflow (calendar shows payment due dates)
   - [x] Payment scenario simulator (minimum, statement, custom amounts)
   - [x] Interest cost calculator (integrated into simulator)
   - [x] Utilization warnings (color-coded badges on account cards)
   - [x] Debt payoff planner (snowball/avalanche) - Implemented!

---

## February 2026 Feedback

### 6. Import → Recurring Forecast Entries
**Feedback:** "The import feature should allow the user to create a recurring forecast entry - currently only allows one time or ignore"

**Current State:**
- Import wizard now offers 5 options: Ignore, One-time income, Recurring income, One-time bill, Recurring bill
- When recurring is selected, frequency dropdown appears (weekly, bi-weekly, semi-monthly, monthly, quarterly, annually)
- Works in both generic CSV import and YNAB import

**Action:** Add "Create as recurring" option to import wizard

**Status:** ✅ Implemented

**Technical Implementation:**
- Updated `ImportAction` type to include `income-recurring` and `bill-recurring`
- Added `RecurringFrequency` type with all frequency options
- Added `FrequencySelect` component that appears when recurring action is selected
- Updated both `import-page-client.tsx` and `ynab-import-page-client.tsx` to handle recurring entries
- Bills get frequency options: weekly, biweekly, semi-monthly, monthly, quarterly, annually
- Income gets frequency options: weekly, biweekly, semi-monthly, monthly

---

### 7. Excel File Imports
**Feedback:** "Is it possible to allow excel file imports (maybe not that important)"

**Current State:**
- Full Excel import support (.xlsx and .xls files)
- Works in both generic import and YNAB import
- Uses first sheet of workbook

**Action:** Add .xlsx import support

**Status:** ✅ Implemented

**Technical Implementation:**
- Created `lib/import/parse-xlsx.ts` using existing `xlsx` package
- Updated `csv-upload.tsx` to accept .csv, .xlsx, and .xls files
- Updated `ynab-csv-upload.tsx` for Excel support
- Excel dates automatically converted to ISO format
- All existing column mapping and validation works with Excel files

---

### 8. Credit Cards on Dashboard
**Feedback:** "I couldn't easily identify how to add the credit card to the dashboard - I would want to see them all"

**Current State:**
- Dedicated Credit Cards section on dashboard
- Shows all credit cards with balances, limits, and utilization
- "Pay" button on each card links to transfer form
- "Add Card" button for easy credit card creation
- Next payment due reminder
- Accounts card now shows only "Cash" (checking/savings)

**Action:** Added dedicated Credit Cards section to dashboard

**Status:** ✅ Implemented (Day 55) + Bug Fixes (Day 56)

**Delivered Features:**
- Credit Cards section with total debt display
- Per-card breakdown: balance, limit, utilization bar
- Color-coded utilization warnings (green <30%, amber 30-50%, red >50%)
- Quick "Pay" button linking to transfer form (pre-filled)
- "Add Card" shortcut button
- Next payment due date display
- Accounts card renamed to "Cash" and excludes credit cards

**Bug Fixes (Day 56):**
- Fixed CC payment not showing in calendar day modal (frequency mismatch: 'once' vs 'one-time')
- Fixed broken link when clicking CC name (was 404, now goes to edit page)
- Fixed "Pay" button visibility when CC balance is zero (now hidden)
- Fixed dynamic currency symbol in account forms (was hardcoded $)
- Added missing `minimum_payment_percent` field to account forms (was in DB but not UI)
- Fixed negative balance (credit) handling - overpayments now show as green credit instead of $0

---

### 9. Account Transfers
**Feedback:** "I think I would want to be able to transfer between accounts - I actually use MS Money (which was sunset a long time ago) to do what your site is working towards - I setup all my accounts and forecast all my income/bills/transfers to forecast my cash balance in the next 12 months - I could also pick a date in the future (like retirement date)"

**Current State:**
- Full transfer functionality between accounts implemented
- Transfers appear in calendar forecast
- Pay Credit Card shortcut on account cards

**Analysis:** This is a significant feature for power users who want complete cash flow picture. MS Money comparison is telling - that was comprehensive personal finance software.

Key insights:
1. **Account transfers** - Moving money between checking/savings affects which account has cash
2. **12-month forecasting** - Already have 365 days in Pro tier ✅
3. **Future date targeting** - "What's my balance on retirement date?" scenario planning

**Action:** Implement account-to-account transfers

**Status:** ✅ Implemented (Day 55) + Bug Fixes (Day 56)

**Delivered Features:**
- New `/dashboard/transfers` page to manage all transfers
- Transfer form with source/destination account selection
- Support for recurring transfers (weekly, bi-weekly, semi-monthly, monthly, quarterly, annually)
- One-time transfer support
- "Pay Credit Card" button on credit card account cards (pre-fills destination)
- Transfers integrated into calendar cash flow forecast
- Smart cash flow impact: only affects balance when crossing spendable/non-spendable boundary
- Transfer occurrences calculated same as bills (handles all frequencies)
- **Edit transfers** - Added `/dashboard/transfers/[id]/edit` page for modifying existing transfers
- **Cancel button navigation** - Cancel returns to previous page (not always transfers list)

**Technical Implementation:**
- New `transfers` table with RLS
- `from_account_id` and `to_account_id` foreign keys to accounts
- Calendar generation updated to include transfers
- Transfer impact: from spendable to non-spendable = outflow, reverse = inflow

**Bug Fixes (Day 56):**
- Fixed `is_active=null` handling (transfers with null were hidden from calendar)
- Added warning for unknown transfer frequencies to aid debugging
- Fixed orphaned transfers when deleting bank account (now deletes associated transfers first)
- Fixed timezone-aware date handling in transfer form (was showing yesterday's date in western timezones)

---

### 10. Product Focus: Cash Flow vs Invoicing
**Feedback:** "I guess I am a little confused by the purpose of the tool - there is a space for invoices and quotes - are you looking to build this to be a quoting and invoicing tool or a cash flow tool - I would imagine that most would already have invoicing or accounting software of some sort... so either all in for accounting or focus on cash planning?"

**Analysis:** This is **critical strategic feedback** from an experienced CFO.

Jeremy's key points:
1. Most businesses already have invoicing/accounting software
2. Requiring data entry in two systems creates friction
3. The tool name is "Cash Flow Forecaster" - that's the core value prop
4. Cash flow forecasting is genuinely challenging for small clients

**Jeremy's suggested split:**
1. **Cash flow forecast** - revenue estimates, cost estimates, opening cash
2. **Quoting and invoicing** - delivery format, calculations

**Current State:**
- We have both invoicing AND cash flow features
- Invoice module tracks outstanding invoices for AR aging
- May be creating confusion about core purpose

**Strategic Options:**

**Option A: Pure Cash Flow Focus**
- Remove or minimize invoicing features
- Import invoice data from other systems (QuickBooks, FreshBooks, etc.)
- Focus 100% on forecasting accuracy and insights
- Clearer positioning, less feature bloat

**Option B: Full Small Business Suite**
- Expand invoicing to compete with FreshBooks/Wave
- Risk: competing with established players
- Benefit: one-stop shop for tiny businesses

**Option C: Cash Flow First, Light Invoicing**
- Keep invoicing as lightweight feature for tracking AR
- Don't try to compete on invoicing features
- Position invoices as "track what's owed to you" not "send professional invoices"
- Focus development on cash flow differentiation

**Recommendation:** Option C seems right. The invoicing exists to feed the cash flow forecast (AR aging), not to be a standalone feature. Should clarify this in marketing/UI.

**Status:** ✅ Strategic Direction Decided

### Strategic Direction: Cash Flow First, Light Invoicing

**Decision:** Focus on cash flow forecasting as the core value prop. Invoicing features serve the forecast (AR tracking), not as a standalone invoicing solution.

**Core Value Prop:**
> "Most small businesses know they have money problems 2 weeks too late. We show you 90 days (or 365) ahead."

**Reframe Invoicing As:**
- "Track what clients owe you" → feeds into → "Know when cash arrives"
- NOT "Professional invoicing solution to send to clients"

**Future Cleanup Tasks:**
- [ ] Consider renaming "Invoices" → "Expected Income" or "Receivables" in UI
- [ ] Simplify invoice creation (don't need fancy templates if users send from QuickBooks)
- [ ] Emphasize cash flow connection when viewing invoices
- [ ] Add "import invoice" option (just amount + due date, not full invoice creation)
- [ ] Update marketing to lead with cash flow, not invoicing

---

### 11. Target Market Clarity
**Feedback:** "Your target seems to be that small startup business... As businesses expand and get more sophisticated so does their accounting and forecasting."

**Analysis:** Jeremy correctly identifies the target market. This is helpful validation.

**Target User Profile:**
- Small business / startup / freelancer
- Revenue: $0 - ~$500K (before they hire a controller)
- Current tools: Spreadsheets, basic accounting software
- Pain: Cash flow surprises, not knowing if they can make payroll/rent
- NOT enterprise with sophisticated FP&A teams

**Action:** Ensure product decisions align with this target market

---

### 12. Bank Sync Not Required
**Feedback:** "Don't worry about the bank sync - importing is perfectly fine"

**Analysis:** Validates our current approach. Bank sync (Plaid) is expensive and complex. Import-based workflow is acceptable to power users like Jeremy.

**Action:** Continue with import-focused approach. Bank sync can be future nice-to-have.

**Status:** ✅ Validated (no change needed)

---

## Updated Priority List (Feb 2026)

### Completed
1. ✅ **Import → Recurring entries** - Implemented! (#6)
2. ✅ **Account transfers** - Key for complete cash picture (#9) - Implemented Day 55!
3. ✅ **CC dashboard visibility** - Dedicated Credit Cards section (#8) - Implemented Day 55!

### Strategic (Decision Made)
4. ✅ **Product focus clarification** - Cash flow vs invoicing (#10)
   - Decision: Cash Flow First, Light Invoicing
   - Future cleanup: Rename invoices, simplify creation, emphasize cash flow connection

### Lower Priority (Completed)
5. ✅ **Excel imports** - Nice to have (#7) - Implemented!

### Validated/No Change
6. ✅ Bank sync approach validated (#12)
7. ✅ Target market confirmed (#11)
