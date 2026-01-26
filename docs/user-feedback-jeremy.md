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

**Current State:**
- Credit cards can be added as account type
- No special functionality (APR, limits, minimum payments, payoff planning)

**Action:** Need clarification from Jeremy on use case. Asked follow-up question.

**Status:** ⏳ Awaiting clarification

**Potential Features:**
- Credit limit tracking
- APR/interest rate calculations
- Minimum payment reminders
- Debt payoff scenarios (snowball/avalanche)
- Credit utilization warnings

---

### 3. Spend Categories
**Feedback:** "Would it make sense to have spend categories?"

**Current State:**
- Bills have 5 categories: rent, utilities, subscriptions, insurance, other
- Income has no categories
- Imported transactions have no categories

**Action:** Asked Jeremy for clarification on needs (more granular vs custom categories)

**Status:** ⏳ Awaiting clarification

**Potential Improvements:**
- Custom user-defined categories
- More granular default categories
- Category assignment for income sources
- Auto-categorization for imported transactions

---

### 4. Bank Import Format
**Feedback:** "I didn't try the bank import so I am not clear on the format"

**Current State:**
- Accepts CSV exports from most US banks
- Auto-detects common column names (date, description, amount)
- Manual column mapping available
- No in-app documentation explaining this

**Action:** Add help section to Import page explaining the format

**Status:** ✅ Implemented

---

### 5. Standard Reports
**Feedback:** "It would be useful to have some standard reports"

**Current State:**
- Dashboard has calendar view, balance trends, safe-to-spend
- No dedicated reporting/export functionality

**Action:** Plan and build Reports feature (see roadmap below)

**Status:** 📋 Planned

---

## Reports Feature Roadmap

### Phase 1: Core Reports (MVP)
- [ ] **Monthly Cash Flow Summary**
  - Income vs expenses by month
  - Net cash flow calculation
  - Month-over-month comparison

- [ ] **Category Breakdown**
  - Pie/bar chart of spending by bill category
  - Percentage breakdown
  - Top spending categories

- [ ] **Forecast Summary**
  - Key dates (low balance days, large bills)
  - Projected end-of-period balance
  - Safe-to-spend summary

### Phase 2: Export & Sharing
- [ ] **PDF Export**
  - Printable monthly summary
  - Clean formatting for sharing/records

- [ ] **CSV Export**
  - Raw data export for spreadsheet users
  - Transaction history export

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

### UI/UX Considerations
- New `/dashboard/reports` route
- Tab-based navigation between report types
- Date range selector (this month, last month, quarter, year)
- Print-friendly styling
- Mobile-responsive charts

### Technical Considerations
- Use existing chart library (recharts)
- Server-side PDF generation (react-pdf or html-to-pdf)
- Consider caching for heavy calculations
- Pro tier: full report access; Free tier: limited reports or watermarked exports

---

## Implementation Priority

1. ✅ **90-day forecast for free users** - Config change (done)
2. ✅ **Import help section** - UX improvement (done)
3. 📋 **Reports tab** - Major feature (planned above)
4. ⏳ **Credit card improvements** - Awaiting requirements
5. ⏳ **Enhanced categories** - Awaiting requirements
