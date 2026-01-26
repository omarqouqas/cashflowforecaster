# User Feedback: Jeremy (Jan 2026)

## Summary
Jeremy tested the app and provided valuable feedback on missing/desired features.

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

**Action:** Build credit card tracking feature focused on cash flow visibility

**Status:** 📋 Planned

**Required Features (per Jeremy):**
- Track CC transactions (spending that impacts cash later)
- Track CC balances
- Forecast CC payments (when cash actually leaves)

**Nice-to-Have:**
- Credit limit tracking
- APR/interest rate calculations
- Minimum payment reminders
- Debt payoff scenarios (snowball/avalanche)
- Credit utilization warnings

---

### 3. Spend Categories
**Feedback:** "Would it make sense to have spend categories?"

**Clarification (Jan 2026):** "All good here - just need to be able to report on them and also add custom ones"

**Current State:**
- Bills have 5 categories: rent, utilities, subscriptions, insurance, other
- Income has no categories
- Imported transactions have no categories

**Action:** Add custom category support and category reporting

**Status:** 📋 Planned

**Required Features (per Jeremy):**
- Custom user-defined categories
- Category reporting (covered in Reports feature)

**Nice-to-Have:**
- More granular default categories
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
4. 📋 **Custom categories** - Allow users to create custom spend categories
5. 📋 **Credit card cash flow** - Track CC transactions/balances, forecast payments
