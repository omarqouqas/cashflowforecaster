# Cash Flow Forecaster - Development Progress

**Last Updated:** January 19, 2026

**Repository:** https://github.com/omarqouqas/cashflowforecaster

**Live URL:** https://cashflowforecaster.io

---

## Quick Stats

- **Days in Development:** 39
- **Commits:** 115+
- **Database Tables:** 14
- **Test Coverage:** Manual testing (automated tests planned post-launch)

## Current Status Summary

**Overall Progress:** MVP Complete + Feature Gating Complete + Analytics Complete + Stripe Live + YNAB-Inspired Calendar + Comprehensive Filters + Automated Welcome Email ✅ 🎉

**Completed Phases:**

- ✅ Phase 1: Foundation (Days 1-3) - COMPLETE
- ✅ Phase 2: Authentication (Days 4-5) - COMPLETE
- ✅ Phase 3: Core Data Models (Days 6-8) - COMPLETE
- ✅ Phase 4: Calendar Feature (Days 9-15) - COMPLETE
- ✅ Phase 5: Landing Page (Day 16) - COMPLETE
- ✅ Phase 6: Runway Collect - Invoicing (Day 17) - COMPLETE
- ✅ Phase 7: Deployment (Day 17) - COMPLETE
- ✅ Phase 8: Post-Launch Polish (Day 18) - COMPLETE
- ✅ Phase 9: Payment Reminders (Day 19) - COMPLETE
- ✅ Phase 10: Landing Page Polish + Google OAuth (Day 20) - COMPLETE
- ✅ Phase 11: Stripe Integration (Day 21) - COMPLETE
- ✅ Phase 12: Feature Gating + Analytics (Day 22) - COMPLETE
- ✅ Phase 13: Stripe Live Mode (Day 22) - COMPLETE
- ✅ Phase 14: Weekly Email Digest (Day 26) - COMPLETE
- ✅ Phase 15: User Feedback System (Day 33) - COMPLETE
- ✅ Phase 16: Tax Savings Tracker (Day 35) - COMPLETE
- ✅ Phase 17: YNAB-Inspired Calendar Redesign (Day 36) - COMPLETE
- ✅ Phase 18: Import Page UX Improvements (Day 37) - COMPLETE
- ✅ Phase 19: Comprehensive Filters (Day 38) - COMPLETE
- ✅ Phase 20: Automated Welcome Email + User Outreach (Day 39) - COMPLETE

**Current Focus:**

- Monitor welcome email delivery and open rates
- Track user re-engagement from outreach emails
- Filter adoption monitoring across all pages
- User acquisition
- Monitor NPS survey responses (PostHog)

---

## Day 39: Automated Welcome Email + User Outreach (January 19, 2026)

### Shipped (today)

#### Automated Welcome Email System ✅ 🎉

**Complete email onboarding automation** - New users now receive a branded welcome email immediately after signup, with duplicate prevention and PostHog tracking.

- [x] **Welcome Email Template** (`lib/email/templates/welcome-email.ts`)
  - Clean, branded HTML design matching existing email aesthetic
  - "Get started in 3 minutes" numbered steps section
  - CTA button linking to dashboard
  - Personal touch about being a solo founder
  - Mobile-responsive inline styles

- [x] **Welcome Email Sender** (`lib/email/send-welcome.ts`)
  - Fetches user data from Supabase auth
  - Checks if welcome email was already sent (prevents duplicates)
  - Extracts user name from metadata if available
  - Tracks `welcome_email_sent_at` in user_settings
  - Logs `welcome_email_sent` event to PostHog
  - Uses `info@cashflowforecaster.io` as reply-to

- [x] **Welcome Email API Route** (`app/api/email/welcome/route.ts`)
  - POST endpoint requiring authentication
  - Returns success status and whether email was already sent
  - Error handling with appropriate status codes

- [x] **Signup Flow Integration**
  - OAuth success page (`app/auth/oauth-success/page.tsx`) triggers welcome email
  - Email/password signup page (`app/auth/signup/page.tsx`) triggers welcome email
  - Fire-and-forget pattern (non-blocking)

- [x] **Database Migration** (`supabase/migrations/20260119000001_add_welcome_email_tracking.sql`)
  - Added `welcome_email_sent_at` column to `user_settings` table
  - Prevents duplicate welcome emails across sessions

#### User Outreach Campaign ✅

**Sent personalized re-engagement emails** to 6 inactive users via Resend.

- [x] **Outreach Script** (`scripts/send-outreach.mjs`)
  - Standalone Node.js script using Resend API
  - Personalized emails based on user segment:
    - Never Started (2 users): Encouragement to complete setup
    - Cooling Off (3 users): Feature updates and re-engagement
    - Inactive (1 user): Check-in with new feature highlights
  - HTML email generation with bullet points and P.S. styling
  - Rate limiting (1 second between emails)

- [x] **Admin Outreach API** (`app/api/admin/send-outreach/route.ts`)
  - Protected by `ADMIN_SECRET` Bearer token
  - Batch email sending with results tracking
  - Uses `info@cashflowforecaster.io` as reply-to

- [x] **Email Reply-to Standardization**
  - All outreach emails use `info@cashflowforecaster.io`
  - Removed personal email from codebase

### Files Created (Day 39)

**Created:**

```
lib/email/templates/welcome-email.ts
lib/email/send-welcome.ts
app/api/email/welcome/route.ts
app/api/admin/send-outreach/route.ts
scripts/send-outreach.mjs
scripts/send-outreach-emails.ts
supabase/migrations/20260119000001_add_welcome_email_tracking.sql
```

### Files Modified (Day 39)

**Modified:**

```
app/auth/oauth-success/page.tsx
app/auth/signup/page.tsx
```

**Deleted (old migrations already applied):**

```
supabase/migrations/202512290001_add_digest_settings.sql
supabase/migrations/202512300001_import_transactions_mvp.sql
supabase/migrations/202512300001_imported_transactions.sql
supabase/migrations/20260113000000_feedback.sql
supabase/migrations/20260113000001_add_semi_monthly_frequency.sql
supabase/migrations/20260113000002_add_tax_settings.sql
```

### Technical Implementation Details

**Welcome Email Flow:**

```
User Signs Up
     │
     ▼
┌─────────────────────────────────┐
│  OAuth Success / Signup Page    │
│  fires POST /api/email/welcome  │
└─────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────┐
│  sendWelcomeEmail(userId)       │
│  - Check if already sent        │
│  - Get user email from auth     │
│  - Build HTML template          │
│  - Send via Resend              │
│  - Update user_settings         │
│  - Track in PostHog             │
└─────────────────────────────────┘
```

**Duplicate Prevention:**

```typescript
// Check if welcome email was already sent
const { data: settings } = await supabase
  .from('user_settings')
  .select('welcome_email_sent_at')
  .eq('user_id', userId)
  .single();

if (settings?.welcome_email_sent_at) {
  return { success: true, alreadySent: true };
}
```

### Outreach Results

| Segment | Users | Emails Sent | Status |
|---------|-------|-------------|--------|
| Never Started | 2 | 2 | ✅ Delivered |
| Cooling Off | 3 | 3 | ✅ Delivered |
| Inactive | 1 | 1 | ✅ Delivered |
| **Total** | **6** | **6** | **100% success** |

### Impact

- **Onboarding:** Every new user now receives immediate welcome guidance
- **Re-engagement:** 6 inactive users received personalized outreach
- **Branding:** Consistent email styling across all transactional emails
- **Analytics:** Welcome email events tracked in PostHog for funnel analysis
- **Duplicate Prevention:** Users won't receive multiple welcome emails

### Next Steps for Email

- Monitor welcome email open rates in Resend dashboard
- Track re-engagement from outreach emails
- Consider sending welcome emails to existing 10 users who never received one
- A/B test welcome email subject lines

---

## Day 38: Comprehensive Filters for All Pages (January 18-19, 2026)

### Shipped (last 24 hours)

#### Comprehensive Filter System ✅ 🎉

**Major UX improvement** - Added powerful filtering capabilities to all list pages with URL persistence, instant client-side filtering, and consistent dark theme styling.

- [x] **Reusable Filter Component System** (`components/filters/`)
  - `FilterPanel` - Collapsible panel with active filter count badge
  - `FilterToggleGroup` - Multi-select toggle buttons with icons and colors
  - `FilterSegmentedControl` - Single-select segmented control
  - `FilterAmountRange` - Min/max amount inputs with validation
  - `FilterSearch` - Search input with instant filtering
  - `FilterDateRange` - Date range picker
  - `FilterSection` - Layout component for filter groupings

- [x] **Calendar Filters** (`components/calendar/calendar-filters.tsx`)
  - Transaction Type: Income / Bills (multi-select)
  - Balance Status: Positive / Danger Zone / Negative (multi-select)
  - Frequency: One-time / Weekly / Bi-weekly / Semi-monthly / Monthly / Quarterly / Yearly
  - Amount Range: Min/Max filter
  - Search: Filter by transaction name

- [x] **Dashboard Filters** (`components/dashboard/dashboard-filters.tsx`)
  - Forecast Horizon: 7 / 14 / 30 / 60 days (segmented control)
  - Account Selection: Multi-select by account
  - Account Type: Checking / Savings / Credit Card (multi-select)

- [x] **Bills Page Filters** (`components/bills/bills-filters.tsx`)
  - Status: Active / Inactive
  - Frequency: All frequency types
  - Category: Rent/Mortgage / Utilities / Subscriptions / Insurance / Other
  - Amount Range: Min/Max filter
  - Due Soon: Toggle for bills due in next 7 days
  - Search: Filter by bill name

- [x] **Income Page Filters** (`components/income/income-filters.tsx`)
  - Status: Active / Inactive
  - Frequency: All frequency types
  - Source Type: Salary / Freelance / Invoice / Other
  - Amount Range: Min/Max filter
  - Search: Filter by income name

- [x] **Invoices Page Filters** (`components/invoices/invoices-filters.tsx`)
  - Status: Draft / Sent / Viewed / Paid
  - Overdue: Toggle for overdue invoices
  - Due Date Range: Start/End date picker
  - Amount Range: Min/Max filter
  - Search: Filter by client name or invoice number

- [x] **Accounts Page Filters** (`components/accounts/accounts-filters.tsx`)
  - Account Type: Checking / Savings / Credit Card
  - Spendable Status: Spendable / Non-spendable
  - Search: Filter by account name

### Files Created (Day 38)

**Created:**

```
components/filters/index.ts
components/filters/filter-panel.tsx
components/filters/filter-toggle-group.tsx
components/filters/filter-segmented-control.tsx
components/filters/filter-amount-range.tsx
components/filters/filter-search.tsx
components/filters/filter-date-range.tsx
components/filters/filter-section.tsx
components/calendar/calendar-filters.tsx
components/dashboard/dashboard-filters.tsx
components/bills/bills-filters.tsx
components/bills/bills-content.tsx
components/income/income-filters.tsx
components/income/income-content.tsx
components/invoices/invoices-filters.tsx
components/invoices/invoices-content.tsx
components/accounts/accounts-filters.tsx
components/accounts/accounts-content.tsx
```

### Files Modified (Day 38)

**Modified:**

```
app/dashboard/calendar/page.tsx
app/dashboard/page.tsx
app/dashboard/bills/page.tsx
app/dashboard/income/page.tsx
app/dashboard/invoices/page.tsx
app/dashboard/accounts/page.tsx
```

### Technical Implementation Details

**URL Persistence Architecture:**

Each filter page has a custom hook (e.g., `useBillsFilters`, `useIncomeFilters`) that:
1. Reads filter state from URL search params on mount
2. Updates URL when filters change using `router.replace()`
3. Uses `useSearchParams()` for reactive URL updates
4. Supports deep linking and browser back/forward navigation

```typescript
// Example: useBillsFilters hook pattern
export function useBillsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse filters from URL
  const filtersFromUrl = useMemo((): BillsFilters => {
    const status = searchParams.get('status');
    const frequencies = searchParams.get('freq');
    // ... more params
    return { status, frequencies, /* ... */ };
  }, [searchParams]);

  // Update URL when filters change
  const setFilters = useCallback((newFilters: BillsFilters) => {
    const params = new URLSearchParams(searchParams.toString());
    // Update or delete params based on filter values
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname, searchParams]);

  return { filters, setFilters, resetFilters, isFiltered };
}
```

**Client Component Pattern:**

Created wrapper client components (e.g., `BillsContent`, `IncomeContent`) that:
1. Receive data from server components as props
2. Manage filter state with custom hooks
3. Apply client-side filtering with `useMemo`
4. Render filtered results with empty states

```typescript
// Example: BillsContent component pattern
export function BillsContent({ bills }: BillsContentProps) {
  const { filters, setFilters } = useBillsFilters();

  const filteredBills = useMemo(
    () => filterBills(bills, filters),
    [bills, filters]
  );

  return (
    <>
      <BillsFiltersPanel filters={filters} onChange={setFilters} />
      {filteredBills.length === 0 ? (
        <EmptyFilterState onClear={() => setFilters(defaultBillsFilters)} />
      ) : (
        <BillsList bills={filteredBills} />
      )}
    </>
  );
}
```

**Filter Panel Features:**

- **Collapsible:** Filters collapse by default when no active filters
- **Active Filter Count:** Badge shows number of active filters
- **Clear All:** One-click reset to default filters
- **Dark Theme:** Consistent zinc-900/800 backgrounds with teal-500 accents
- **Instant Feedback:** Filters apply immediately with no loading states

### TypeScript Fixes (Day 38)

1. **AccountType comparison error:**
   - Error: `Type 'AccountType' and '"credit"' have no overlap`
   - Fix: Use raw string comparison first, then normalize to typed value

2. **Set iteration error:**
   - Error: `Type 'Set<string>' can only be iterated through when using '--downlevelIteration' flag`
   - Fix: Changed `[...new Set()]` to `Array.from(new Set())`

3. **Stripe API version mismatch:**
   - Error: `Type '"2025-11-17.clover"' is not assignable to type '"2025-12-15.clover"'`
   - Fix: Updated apiVersion to match installed SDK

### Impact

- **Power User UX:** Filters enable quick data exploration without page reloads
- **URL Persistence:** Filters can be bookmarked and shared
- **Instant Feedback:** Client-side filtering feels fast and responsive
- **Consistent Design:** All filter panels follow the same visual pattern
- **Empty States:** Clear messaging when filters exclude all results
- **Discoverability:** Active filter count badge helps users understand current state

### Commits (Day 38)

1. `5d19795` - "feat: add comprehensive filters to all pages"
   - Reusable filter component system
   - Calendar, Dashboard, Bills, Income, Invoices, Accounts filters
   - URL persistence with custom hooks
   - Client component wrappers for filtered views

### Next Steps for Filters

- Monitor filter usage via PostHog (which filters are used most)
- Consider filter presets (e.g., "Show overdue invoices")
- Track empty state occurrences (filters too restrictive)
- A/B test filter panel position (above vs. inline)

---

## Day 37: Import Page UX Improvements (January 17-18, 2026)

### Shipped (last 24 hours)

#### YNAB-Inspired Import Page Redesign ✅ 🎉

**Complete overhaul** of the CSV import workflow with YNAB-inspired dark theme, improved UX patterns, and intelligent automation features. Transformed the import page from functional to polished and user-friendly.

- [x] **Dark Theme Consistency** (`import-page-client.tsx`, `csv-upload.tsx`, `column-mapper.tsx`, `transaction-selector.tsx`)
  - Applied zinc-900/800 backgrounds with zinc-100/300/400 text hierarchy
  - Updated all form inputs to dark theme (bg-zinc-800, border-zinc-700)
  - Enhanced table styling with proper contrast and hover states
  - Teal-500 accent colors for focus states and CTAs
  - Consistent with Bills, Income, and Calendar dark theme aesthetic

- [x] **Step Progress Indicator** (`step-indicator.tsx` - NEW)
  - Visual 3-step workflow indicator (Upload → Map Columns → Select & Import)
  - Circle indicators with check icons for completed steps
  - Ring effect on current step (ring-4 ring-teal-500/20)
  - Color-coded status: teal-500 for active/completed, zinc-800 for pending
  - Progress connector lines between steps
  - Helps users understand where they are in the import process

- [x] **Column Auto-Detection** (`import-page-client.tsx`)
  - Intelligent regex pattern matching for common CSV header names
  - Date patterns: "date", "posted date", "transaction date", "trans date", "posting date"
  - Description patterns: "description", "payee", "memo", "merchant", "name", "narrative"
  - Amount patterns: "amount", "total", "debit", "credit", "value", "sum"
  - Automatically pre-selects columns on CSV load
  - Reduces user friction by 10-15 seconds per import
  - Works with most bank CSV formats out of the box

- [x] **Duplicate Detection** (`import-page-client.tsx`)
  - Loads last 500 imported transactions on page mount for comparison
  - Checks for potential duplicates during CSV parsing:
    - Same transaction date (posted_at match)
    - Same description (case-insensitive, trimmed)
    - Same amount (within $0.01 tolerance for floating point differences)
  - Visual indicators in transaction table:
    - Amber background highlight (bg-amber-500/5)
    - "Possible duplicate" badge with amber styling
    - Duplicate count summary display
  - Helps users avoid double-importing the same transactions

- [x] **Enhanced Drag-and-Drop Upload** (`csv-upload.tsx`)
  - Large dashed border zone with visual feedback
  - Hover state transitions (border-zinc-700 → border-zinc-600)
  - Active drag state with teal highlight (border-teal-500, bg-teal-500/10)
  - Upload icon from lucide-react for visual clarity
  - "Drag and drop or click to browse" messaging
  - Enhanced error states with rose-500/10 background
  - File type validation with helpful error messages

- [x] **Improved Review Table** (`transaction-selector.tsx`)
  - Dark theme checkbox styling (border-zinc-600, checked:bg-teal-500)
  - Enhanced amount colors (emerald-400 for income, rose-400 for bills)
  - Better hover states on table rows
  - Duplicate warnings integrated into table layout
  - Search and filter functionality maintained
  - Select-all checkbox with proper dark theme styling

### Files Created (Day 37)

**Created:**

```
components/import/step-indicator.tsx
```

### Files Modified (Day 37)

**Modified:**

```
components/import/import-page-client.tsx
components/import/csv-upload.tsx
components/import/column-mapper.tsx
components/import/transaction-selector.tsx
```

### Technical Implementation Details

**Column Auto-Detection Function:**

```typescript
function autoDetectColumns(headers: string[]): ColumnMapping {
  const datePatterns = /^(date|posted.*date|transaction.*date|trans.*date|posting.*date)$/i;
  const descriptionPatterns = /^(description|payee|memo|merchant|name|narrative|details?)$/i;
  const amountPatterns = /^(amount|total|debit|credit|value|sum)$/i;

  let dateIndex: number | null = null;
  let descriptionIndex: number | null = null;
  let amountIndex: number | null = null;

  headers.forEach((header, idx) => {
    const trimmed = header.trim();
    if (dateIndex === null && datePatterns.test(trimmed)) {
      dateIndex = idx;
    }
    if (descriptionIndex === null && descriptionPatterns.test(trimmed)) {
      descriptionIndex = idx;
    }
    if (amountIndex === null && amountPatterns.test(trimmed)) {
      amountIndex = idx;
    }
  });

  return { dateIndex, descriptionIndex, amountIndex };
}
```

**Duplicate Detection Logic:**

```typescript
// Load existing transactions for comparison
useEffect(() => {
  const loadExisting = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('imported_transactions')
      .select('posted_at, description, amount')
      .eq('user_id', userId)
      .order('posted_at', { ascending: false })
      .limit(500);

    if (data) {
      setExistingTransactions(data);
    }
  };

  loadExisting();
}, [userId]);

// Check for duplicates during normalization
const isDuplicate = existingTransactions.some(
  (existing) =>
    existing.posted_at === normalized.transaction_date &&
    existing.description.toLowerCase().trim() === normalized.description.toLowerCase().trim() &&
    Math.abs(existing.amount - normalized.amount) < 0.01
);
```

**Step Indicator Integration:**

```tsx
<StepIndicator
  steps={[
    {
      number: 1,
      title: 'Upload CSV',
      status: !loaded ? 'current' : 'completed',
    },
    {
      number: 2,
      title: 'Map Columns',
      status: !loaded ? 'pending' : mappingReady ? 'completed' : 'current',
    },
    {
      number: 3,
      title: 'Select & Import',
      status: !loaded || !mappingReady ? 'pending' : 'current',
    },
  ]}
/>
```

### YNAB-Inspired Design Principles Applied

- **Calm and Clear:** Zinc color palette reduces visual stress
- **Progressive Disclosure:** Step indicator shows only relevant UI at each stage
- **Smart Defaults:** Auto-detection reduces cognitive load
- **Prevention over Correction:** Duplicate detection prevents mistakes before they happen
- **Visual Hierarchy:** Dark backgrounds with teal accents guide attention to key actions

### Impact

- **Reduced Friction:** Column auto-detection eliminates manual mapping for most bank CSVs
- **Error Prevention:** Duplicate detection prevents double-importing transactions
- **User Confidence:** Step indicator provides clear progress visibility
- **Visual Consistency:** Dark theme matches rest of application (Bills, Income, Calendar)
- **Drag-and-Drop UX:** Enhanced upload area feels modern and professional
- **Accessibility:** High contrast text/backgrounds ensure readability

### Commits (Day 37)

1. `89763c7` - "feat: improve Import page with YNAB-inspired UI/UX"
   - Dark theme application across all import components
   - Enhanced drag-and-drop upload area
   - Column auto-detection implementation
   - Duplicate detection logic

2. `b12bc6c` - "feat: add step progress indicator and duplicate detection to Import"
   - Created StepIndicator component
   - Integrated step indicator into import workflow
   - Added duplicate visual indicators to transaction table

### Next Steps for Import Feature

- Monitor import completion rates via PostHog
- Track column auto-detection accuracy (how often users override)
- Monitor duplicate detection false positive rate
- Consider adding import history view
- Explore CSV template downloads for guidance

---

## Day 36: YNAB-Inspired Calendar Redesign (January 14-16, 2026)

### Shipped (last 48 hours)

#### YNAB-Inspired Calendar UX Overhaul ✅ 🎉

**Major UI/UX redesign** inspired by YNAB's minimalist, calm, premium fintech aesthetic. Enhanced the calendar to feel more "app-like" and less "dashboard-like."

- [x] **Interactive Balance Trend Chart** (`balance-trend-chart-interactive.tsx`)
  - Custom SVG-based line chart with gradient area fill
  - Hover tooltips showing exact balance, date, and transactions
  - Click-to-jump navigation - click anywhere on the chart to scroll to and expand that day
  - Touch support for mobile devices
  - Visual markers: Today line, lowest balance point (pulsing red dot), safety buffer line, zero line
  - Net balance change indicator (trending up/down with color coding)
  - Key metrics display: starting balance, ending balance, lowest balance
  - Legend for visual reference
  - No external chart dependencies - pure React + SVG

- [x] **Enhanced Day Cards** (`day-card.tsx`)
  - Inline transaction display (top 2 transactions visible with icons and amounts)
  - Transaction count badge (e.g., "+3 more")
  - Enhanced hover effects (scale + shadow for premium feel)
  - Pulsing animation on status dots for danger/warning states
  - Improved visual hierarchy (larger balances, clearer status indicators)
  - Color-coded transaction icons (emerald for income, rose for bills)

- [x] **Hybrid Responsive Layout** (`calendar-hybrid-view.tsx`)
  - Desktop (≥ md): Grid layout with month grouping (CalendarView)
  - Mobile (< md): Timeline vertical scrolling layout (CalendarContainer)
  - Provides optimal experience for each screen size
  - Single component manages responsive switching

- [x] **Visual Polish & Animations**
  - Shimmer loading animations for calendar skeleton
  - Fade-in animations for day cards (staggered with delays)
  - Global CSS keyframe animations (`app/globals.css`)
  - Enhanced skeleton loader with gradient effects
  - Dark theme refinements (zinc color palette with teal-500 accents)

- [x] **Chart-to-Calendar Integration**
  - Click on chart → scrolls to day row → expands day detail after 300ms delay
  - Smooth scroll behavior with `scrollIntoView` API
  - Day refs managed in both calendar views for scroll targeting
  - Seamless desktop/mobile experience

### Files Created / Added (Day 36)

**Created:**

```
components/calendar/balance-trend-chart-interactive.tsx
components/calendar/calendar-hybrid-view.tsx
```

### Files Modified (Day 36)

**Modified:**

```
components/calendar/day-card.tsx
components/calendar/calendar-view.tsx
components/calendar/calendar-container.tsx
components/calendar/calendar-skeleton.tsx
app/globals.css
app/dashboard/calendar/page.tsx
```

**Deleted:**

```
components/calendar/balance-trend-chart.tsx (unused static version)
```

### TypeScript Build Errors Fixed (Day 36)

All Vercel deployment build errors resolved through 8 commits:

1. **Error:** Unused `currency` parameter in `balance-trend-chart-interactive.tsx`
   - **Fix:** Removed `currency` prop from interface and component
   - **Commit:** `1e64fd4` - "fix: remove unused currency parameter from interactive chart"

2. **Error:** Possibly undefined `endBalance` at line 89
   - **Fix:** Added nullish coalescing: `balances[balances.length - 1] ?? startingBalance`
   - **Commit:** `7bb112d` - "fix: handle undefined endBalance in interactive chart"

3. **Error:** Unused `y` variable in `handleChartInteraction`
   - **Fix:** Removed unused y coordinate calculation
   - **Commit:** `072c4b9` - "fix: remove unused y variable in chart interaction handler"

4. **Error:** Unused imports in `balance-trend-chart.tsx`
   - **Fix:** Deleted entire static chart component (no longer used)
   - **Commit:** `be56f1c` - "chore: remove unused static balance trend chart component"

5. **Error:** Missing `safeToSpend` and `collisions` props in `CalendarView`
   - **Fix:** Added missing props to CalendarView in calendar-hybrid-view.tsx
   - **Commit:** `74ba337` - "fix: add missing safeToSpend and collisions props to CalendarView"

6. **Error:** Unused `totalIncome` and `totalBills` variables in `day-card.tsx`
   - **Fix:** Removed unused variable declarations (only `totalTransactions` needed)
   - **Commit:** `56b118f` - "fix: remove unused totalIncome and totalBills variables"

7. **Error:** Possibly undefined `day.income[0]` and `day.bills[0]`
   - **Fix:** Added explicit null checks: `day.income.length > 0 && day.income[0] && (`
   - **Commit:** `c042456` - "fix: add null checks for day.income[0] and day.bills[0]"

8. **Error:** Possibly undefined `touch` object in `handleTouchMove`
   - **Fix:** Extracted to variable with null check: `const touch = e.touches[0]; if (touch) { ... }`
   - **Commit:** `0814f24` - "fix: handle possibly undefined touch in handleTouchMove"

### Technical Implementation Details

**Interactive Chart Architecture:**

- Pure React + SVG implementation (no chart libraries)
- Responsive SVG viewBox (percentage-based coordinates)
- Chart data memoized with `useMemo` for performance
- Mouse and touch event handlers with `useCallback`
- Cursor position tracking for tooltip placement
- Dynamic chart bounds calculation with 15% padding
- Gradient definitions for area fill
- Multiple reference lines (safety buffer, zero line, today marker)

**Responsive Layout Strategy:**

- Tailwind `md:` breakpoint for desktop/mobile split
- `hidden md:block` / `md:hidden` pattern for clean component switching
- Grid layout preserves month grouping on desktop
- Timeline layout optimized for vertical scrolling on mobile
- Both layouts share the same interactive chart component

**Animation System:**

- CSS keyframe animations defined in `app/globals.css`
- Shimmer effect for skeleton loader (translateX transform)
- Fade-in effect for day cards (opacity + translateY)
- Staggered animation delays for sequential reveal
- Pulsing animation for danger indicators (scale + opacity)

### Impact

- **Premium Feel:** Calendar now matches the polish of YNAB and other premium fintech apps
- **Engagement:** Interactive chart drives exploration and understanding of cash flow
- **Clarity:** Inline transaction display reduces need to click into day details
- **Mobile UX:** Optimized layouts for each device type
- **Performance:** No external chart dependencies reduces bundle size
- **Accessibility:** Hover and click interactions work on desktop and mobile

### Next Steps for Calendar Feature

- Monitor chart interaction analytics via PostHog
- A/B test chart placement (above vs. below warnings)
- Consider adding chart annotations for bills/income
- Explore mini-chart for dashboard widget

---

## Day 35: Tax Savings Tracker Feature (January 13, 2026)

### Shipped (today)

#### Tax Savings Tracker ✅ 🎉

**HUGE differentiator** - No other cash flow app has this feature! Addresses #1 freelancer pain point: tax anxiety.

- [x] **Database Schema**
  - Added tax settings columns to `user_settings` table:
    - `tax_rate` (DECIMAL, default 25.00%)
    - `tax_tracking_enabled` (BOOLEAN, default true)
    - `tax_year` (INTEGER)
    - `estimated_tax_q1_paid`, `q2`, `q3`, `q4` (DECIMAL)
  - Created migration: `20260113000002_add_tax_settings.sql`

- [x] **Tax Calculation Library** (`lib/tax/calculations.ts`)
  - Tax calculation utilities
  - Quarterly deadline tracking (Q1-Q4 with due dates)
  - Annual tax summary calculations
  - Helper functions: `getNextQuarterlyDeadline()`, `getCurrentQuarter()`, etc.

- [x] **Tax Settings Form** (`components/settings/tax-settings-form.tsx`)
  - Toggle to enable/disable tax tracking
  - Tax rate input (25-35% guidance)
  - Quarterly estimated tax payment tracking
  - Shows due dates for each quarter (April 15, June 15, Sept 15, Jan 15)
  - Client component with react state

- [x] **Server Action** (`lib/actions/update-tax-settings.ts`)
  - Handles tax settings updates
  - Input validation with Zod
  - Revalidates dashboard and settings pages

- [x] **Dashboard Widget** (`components/dashboard/tax-savings-widget.tsx`)
  - Shows total YTD income vs after-tax income
  - Visual progress bar for tax savings (color-coded: green/amber/rose)
  - Next quarterly deadline alert (when due in ≤30 days)
  - Enable/disable state with CTA to settings
  - Responsive design

- [x] **Settings Page Integration**
  - Added Tax Savings Tracker section
  - Fetches and displays tax settings
  - Clean UI with quarterly payment inputs

- [x] **Dashboard Integration**
  - Added quarterly income calculation logic
  - Integrated tax widget below invoice summary
  - Calculates YTD income from all income sources
  - Handles one-time and recurring income properly

- [x] **PostHog Analytics**
  - Event: `tax_tracking_toggled` (with `enabled` property)
  - Event: `tax_settings_updated` (with `tax_rate`, `enabled`, `has_quarterly_payments`)

**Impact:**
- Addresses #1 freelancer pain point (tax anxiety)
- Shows "after-tax safe to spend" amount
- Prevents April panic with quarterly tracking
- Sticky feature (users check regularly)
- Huge marketing differentiator

**Next Steps for Tax Feature:**
- Monitor adoption rate via PostHog
- Consider adding to onboarding flow
- Potential premium upsell: tax report exports, accountant integration

---

## Day 34: User Feedback System + Semi-Monthly Frequency + UI Polish (January 12, 2026)

### Shipped (today)

#### PostHog NPS Survey ✅

- [x] Enabled PostHog surveys in provider config (`disable_surveys: false`)
- [x] Added `created_at` property to PostHog user identification for date-based targeting
- [x] Configured NPS survey in PostHog dashboard:
  - Trigger: 7 days after signup (`created_at` property)
  - Questions: NPS score (0-10) + conditional follow-up based on score
  - Targeting: Dashboard pages only

#### In-App Feedback Widget ✅

- [x] Created `feedback` database table with RLS:
  - Columns: `user_id`, `user_email`, `type` (bug/suggestion/question/other), `message`, `page_url`, `user_agent`, `status`, `created_at`
  - RLS policy: users can insert their own feedback
- [x] Created Zod schema (`lib/validations/feedback.ts`)
- [x] Created Server Action (`lib/actions/feedback.ts`):
  - Validates input with Zod
  - Inserts to database
  - Sends email notification via Resend
  - Tracks event in PostHog
- [x] Created FeedbackModal component with react-hook-form + zod
- [x] Created FeedbackButton (floating button, bottom-left)
- [x] Added to dashboard layout
- [x] Styled with zinc-800 bg + teal-500 accent on hover

#### Semi-Monthly Frequency ✅

- [x] Added "semi-monthly" (twice a month) as a new frequency option
- [x] Updated income calculation logic (`lib/calendar/calculate-income.ts`)
  - Handles 1st/15th or 15th/30th patterns based on initial date
- [x] Updated bills calculation logic (`lib/calendar/calculate-bills.ts`)
- [x] Updated income forms (new + edit pages)
- [x] Updated bills forms (new + edit pages)
- [x] Updated onboarding income step
- [x] Created database migration to update check constraints
- [x] Updated TypeScript types in `lib/actions/onboarding.ts`

#### UI Polish ✅

- [x] Changed "Rent" category label to "Rent/Mortgage" in UI:
  - Bills list page
  - Bills forms (new + edit)
  - Onboarding bills step
- [x] Moved feedback button from bottom-right to bottom-left to avoid conflicts with:
  - PostHog NPS survey (bottom-right)
  - Calendar "Can I Afford It?" tab
  - Mobile navigation

### Files Changed / Added (today)

**Added:**

```
supabase/migrations/20260113000000_feedback.sql
supabase/migrations/20260113000001_add_semi_monthly_frequency.sql
lib/validations/feedback.ts
lib/actions/feedback.ts
components/feedback/feedback-modal.tsx
components/feedback/feedback-button.tsx
```

**Modified:**

```
lib/posthog/provider-optimized.tsx
components/analytics/identify-user.tsx
types/supabase.ts
lib/calendar/calculate-income.ts
lib/calendar/calculate-bills.ts
lib/actions/onboarding.ts
app/dashboard/income/new/page.tsx
app/dashboard/income/[id]/edit/page.tsx
app/dashboard/bills/new/page.tsx
app/dashboard/bills/[id]/edit/page.tsx
app/dashboard/bills/page.tsx
app/dashboard/layout.tsx
components/onboarding/step-income.tsx
components/onboarding/step-bills.tsx
```

---

## Day 33: Cash Flow Calendar SEO + Comparison Pages + UX Polish (January 12, 2026)

### Shipped (last 24 hours)

#### SEO: target "cash flow calendar" ✅

- [x] Updated global + homepage metadata to target cash flow calendar keywords (without keyword stuffing)
  - Updated titles/descriptions/keywords in:
    - `app/layout.tsx`
    - `app/page.tsx`
- [x] Updated landing page hero + feature copy to naturally include “cash flow calendar” (3 on-page mentions)

#### New SEO pages: Compare ✅

- [x] Added new comparison page:
  - `/compare/cash-flow-calendar-apps`
  - Includes comparison table, “Why Cash Flow Forecaster” section, FAQPage JSON-LD, internal links only
  - Mentions competitor “Cash Flow Calendar” by name only (no external links)
- [x] Added dynamic OG image for the comparison page:
  - `/compare/cash-flow-calendar-apps/opengraph-image`
- [x] Added `/compare` index page to avoid 404s and improve internal linking

#### Internal linking + discovery ✅

- [x] Added compare link in landing header nav (“Compare”)
- [x] Added footer “Compare” column linking to the comparison page
- [x] Updated sitemap to include `/compare` and `/compare/cash-flow-calendar-apps` with correct priorities
  - Standardized sitemap URLs to use `https://www.cashflowforecaster.io` via a `baseUrl` constant

#### UX polish: Safety buffer editable ✅

- [x] Made “Safety buffer” clickable (mobile-friendly) and linked to `/dashboard/settings`
  - Added padding + pencil icon to signal editability

#### Build fix ✅

- [x] Fixed Vercel build failure caused by a Unicode regex flag in the comparison page (removed regex usage)

### Files Changed / Added (today)

**Added:**

```
app/compare/page.tsx
app/compare/cash-flow-calendar-apps/page.tsx
app/compare/cash-flow-calendar-apps/opengraph-image.tsx
```

**Modified:**

```
app/layout.tsx
app/page.tsx
app/sitemap.ts
components/landing/footer.tsx
components/landing/landing-header.tsx
components/calendar/sticky-header.tsx
docs/development-progress.md
docs/product-brief.md
```

---

## Day 32: Free Tool #4 — Income Variability Calculator + Chart Fix + Email Results Template (January 10, 2026)

### Shipped (today)

#### New free tool: Income Variability Calculator ✅

- [x] Added a new free tool at `/tools/income-variability-calculator`
  - Inputs: 6–12 months income history (min 3), optional monthly expenses
  - Outputs: variability score (CV%), stability level (low/medium/high), stats breakdown, danger zone analysis, benchmark percentile, emergency fund target
  - Simple bar chart (no chart library): month bars + average line + optional expense threshold line
- [x] SEO + social sharing
  - Route metadata (title/description/keywords/canonical)
  - Dedicated dynamic OG image for the tool
- [x] PostHog tracking implemented for tool funnel
  - `tool_variability_calculator_viewed`
  - `tool_variability_calculator_form_interaction`
  - `tool_variability_calculator_month_added`
  - `tool_variability_calculator_calculated`
  - `tool_variability_calculator_email_sent`
  - `tool_variability_calculator_cta_clicked`

#### Bug fixes ✅

- [x] Fixed Income Variability calculator form runtime crash (Zod chaining issue)
  - Root cause: `.refine()` returns `ZodEffects`, so `.min()` must be chained before `.refine()`
- [x] Fixed bar chart not rendering (bars had 0px height)
  - Root cause: percentage heights require an explicit-height container
- [x] Fixed email capture subject/body for the new tool
  - Root cause: `/api/tools/email-results` fell back to “Can I Afford It?” template for unknown tool slugs
  - Added `income-variability-calculator` email branch (correct subject + content)

#### Navigation & discovery ✅

- [x] Added the new tool to:
  - `/tools` index
  - Landing footer “Free Tools”
  - Sitemap

### Files Changed / Added (today)

**Added:**

```
app/tools/income-variability-calculator/page.tsx
app/tools/income-variability-calculator/opengraph-image.tsx
components/tools/variability-calculator.tsx
components/tools/variability-calculator-form.tsx
components/tools/variability-calculator-result.tsx
components/tools/income-bar-chart.tsx
lib/tools/calculate-income-variability.ts
```

**Modified:**

```
app/sitemap.ts
components/tools/tools-index-client.tsx
components/landing/footer.tsx
app/api/tools/email-results/route.ts
```

---

## Day 27: CSV Import UX Fixes + List Refresh Bugs (January 1, 2026)

### Shipped (last 24 hours)

#### CSV import: review table usability ✅

- [x] Added a **date cutoff filter** before the review table (default: first day of current month)
  - Filters parsed transactions client-side before review
  - Shows: “Showing X of Y transactions (filtered by date)”
- [x] Added a **Select-all checkbox** in the table header (next to Date)
  - Checked = select all visible rows (respects filters + 1000-row cap)
  - Indeterminate = some selected
- [x] Reduced date confusion for international users
  - Keeps native date input (browser locale)
  - Shows one clear line: “Filtering from Dec 1, 2025” (month name format)
- [x] Default row selection: rows are **auto-checked** on initial load when action is Income/Bill

#### Deletion UX: prevent scroll-to-top ✅

- [x] Preserved scroll position after deleting items in:
  - Bills list
  - Income list

#### Edit UX: no hard refresh needed ✅

- [x] Fixed bills/income name updates so lists reflect changes immediately after save (no Ctrl+R)

### Files Changed (last 24 hours)

**Modified:**

```
components/import/transaction-selector.tsx
components/bills/delete-bill-button.tsx
components/income/delete-income-button.tsx
app/dashboard/bills/page.tsx
app/dashboard/income/page.tsx
app/dashboard/bills/[id]/edit/page.tsx
app/dashboard/income/[id]/edit/page.tsx
docs/development-progress.md
docs/product-brief.md
```

---

## Day 28: Pricing Simplification (Sunset Premium) + Forecast Length Fix + Landing CTA Polish (January 4, 2026)

### Shipped (last 24 hours)

#### Pricing: Sunset Premium, fold 365-day forecast into Pro ✅

- [x] **Removed Premium tier** from all user-facing pricing surfaces (landing + /pricing).
- [x] **Pro now includes 365-day forecasts (12 months ahead)** (previously marketed as Premium).
- [x] Kept `premium` tier **only for backwards compatibility** (legacy subscriptions / Stripe price IDs retained), but:
  - Premium is **not purchasable** via UI
  - Checkout blocks `premium` tier server-side

#### Forecast generation: marketing matches product ✅

- [x] Updated calendar generation to support **tier-based forecast length** (no longer hardcoded to 60 days):
  - Free: 60 days
  - Pro: 365 days
- [x] Applied the same forecast window across:
  - Dashboard forecast summaries
  - Calendar page projection
  - Scenario testing
  - Weekly digest generation

#### Landing page CTA + pricing UX polish ✅

- [x] Standardized logged-out CTA copy: **“Get Started Free”**.
- [x] Added Pro CTA helper text (logged out): **“Start free, upgrade anytime”**.
- [x] Fixed pricing card CTA alignment by anchoring CTA sections to the bottom of equal-height cards.

### Files Changed (Day 28)

**Modified:**

```
app/page.tsx
app/dashboard/page.tsx
app/dashboard/calendar/page.tsx
components/landing/landing-header.tsx
components/landing/pricing-section.tsx
components/landing/faq-section.tsx
components/pricing/pricing-section.tsx
components/pricing/pricing-card.tsx
components/subscription/upgrade-prompt.tsx
components/subscription/pro-feature-gate.tsx
app/terms/terms-page.tsx
lib/calendar/generate.ts
lib/actions/scenarios.ts
lib/actions/stripe.ts
lib/email/generate-digest-data.ts
lib/stripe/config.ts
lib/stripe/feature-gate.ts
lib/stripe/subscription.ts
docs/development-progress.md
docs/product-brief.md
```

---

## Day 29: Landing Page Revamp (Refined Value Prop) + Three-Pillar Structure + “Who It’s For” Nav (January 5, 2026)

### Shipped (today)

#### Landing page: refined positioning + structure ✅

- [x] Updated hero messaging for the core pain: **“Stop Guessing If You Can Cover Rent”**
  - Added badge: **“Built for freelancers with irregular income”**
  - Kept CTA: **“Get Started Free”**
- [x] Replaced the old feature grid with a **3‑pillar layout**:
  - **Know Your Number Today** (60‑day clarity + safe‑to‑spend framing)
  - **Get Paid Faster** (Runway Collect: invoicing + reminders + forecast sync)
  - **Never Get Blindsided** (weekly digest + bill collision warnings)
- [x] Added “Who It’s For” persona section + anchor navigation
  - Added header nav link: **Who It’s For** → `#who-its-for` (desktop + mobile)
  - Added ID to the section: `id="who-its-for"`
- [x] Added a prominent stat callout: **“Built for the 47% of freelancers who say income instability is their #1 financial worry.”**
- [x] Added a mid‑page CTA between “Who It’s For” and Pricing:
  - “Ready to stop guessing?” + **Get Started Free**
- [x] Updated FAQs where needed to stay consistent with the live offering (Free vs Pro, Who it’s for, Runway Collect copy)

### Files Changed (Day 29)

**Modified:**

```
app/page.tsx
components/landing/landing-header.tsx
components/landing/faq-section.tsx
docs/development-progress.md
docs/product-brief.md
```

---

## Day 30: Social Sharing (OG/Twitter) Fixes + Dynamic OG Images (January 8, 2026)

### Shipped (last 24 hours)

#### Tool OG image fix: `/tools/can-i-afford-it` ✅

- [x] Fixed the wrong OG image being used (was showing `/hero-dashboard.png`)
  - Removed `openGraph.images` + `twitter.images` overrides from the route metadata so Next can use `opengraph-image.tsx`
- [x] Stabilized the route OG image generator in dev
  - Fixed `@vercel/og` layout strictness error (multi-child `<div>` requires explicit `display`)

#### Landing page OG/Twitter metadata + dynamic images ✅

- [x] Added a dynamic OG image at the app root (`/opengraph-image`)
- [x] Added a matching dynamic Twitter image (`/twitter-image`)
- [x] Updated homepage social titles and canonical URL
- [x] Removed global static OG/Twitter image overrides that were forcing `/hero-dashboard.png`
- [x] Updated landing OG image copy to be more freelancer-focused

#### Windows dev stability (Next/OG) ✅

- [x] Resolved Windows-specific OG rendering errors caused by invalid `file:` URL font paths and unsupported font formats
  - Standardized OG image routes on **Edge runtime** for reliability on Windows paths with spaces

### Files Changed (Day 30)

**Modified:**

```
app/layout.tsx
app/page.tsx
app/opengraph-image.tsx
app/twitter-image.tsx
app/tools/can-i-afford-it/page.tsx
app/tools/can-i-afford-it/opengraph-image.tsx
docs/development-progress.md
docs/product-brief.md
```

---

## Day 31: Free Tool #3 — Invoice Payment Predictor + Email Results Fix (January 9, 2026)

### Shipped (today)

#### New free tool: Invoice Payment Date Predictor ✅

- [x] Added a new free tool at `/tools/invoice-payment-predictor`
  - Inputs: invoice date, payment terms (Net-7…Net-90, custom), weekend adjustment, client payment history
  - Outputs: expected payment date + day-of-week + days from today + breakdown
  - Bonus: add multiple invoices and view a sorted list + total amount (if provided)
- [x] SEO + social sharing
  - Route metadata (title/description/keywords/canonical)
  - Dedicated dynamic OG image for the tool
- [x] PostHog tracking implemented for core tool funnel
  - `tool_payment_predictor_viewed`
  - `tool_payment_predictor_form_interaction`
  - `tool_payment_predictor_calculated`
  - `tool_payment_predictor_invoice_added`
  - `tool_payment_predictor_email_sent`
  - `tool_payment_predictor_cta_clicked`

#### Email capture: correct subject + template per tool ✅

- [x] Fixed `/api/tools/email-results` fallback behavior causing the new tool’s email to use the “Can I Afford It?” subject/body
  - Added a dedicated `invoice-payment-predictor` email branch (correct subject + content)

#### Navigation & discovery ✅

- [x] Added the new tool to:
  - `/tools` index
  - Landing footer “Free Tools”
  - Sitemap

#### UI polish ✅

- [x] Aligned “Optional details” inputs (label height consistency) so the two fields line up cleanly.

### Files Changed / Added (today)

**Added:**

```
app/tools/invoice-payment-predictor/page.tsx
app/tools/invoice-payment-predictor/opengraph-image.tsx
components/tools/payment-predictor.tsx
components/tools/payment-predictor-form.tsx
components/tools/payment-predictor-result.tsx
lib/tools/calculate-payment-date.ts
```

**Modified:**

```
app/sitemap.ts
components/tools/tools-index-client.tsx
components/landing/footer.tsx
app/api/tools/email-results/route.ts
```

## Day 25: Dashboard Guidance Cards + Mobile Responsiveness (December 24, 2025)

### Features Completed (last 24 hours)

#### Dashboard: Daily Budget + Path Forward guidance ✅

- [x] Added a **Daily Budget** card (or **Daily Shortfall** when negative) to help users understand day-to-day spending runway until their next income.
  - Uses existing forecast data (accounts + income + bills) — no new API calls.
  - Negative budgets are reframed as a shortfall (e.g. “$235/day short”).
- [x] Added a supportive **“Your Path Forward”** card when the 60-day forecast goes negative:
  - Finds the first negative-balance day, calculates deficit and suggested actions.
  - Copy tweaks for edge cases (e.g. if only 1 day left: “Cut $X from spending tomorrow”).

#### Dashboard: Forecast-aware welcome messaging ✅

- [x] Replaced the static dashboard subtitle with dynamic messaging based on the 60-day forecast:
  - ✅ In the green (teal)
  - ⚠️ Low-balance days (amber)
  - ❗ Negative day/overdraft risk (rose)
- [x] Always shows a **“View full calendar →”** link under the subtitle.

#### Dashboard: Improved information hierarchy + reduced redundancy ✅

- [x] Removed the old “Low balance warning” card (redundant with the new subtitle + forecast card).
- [x] Reordered dashboard sections so the most actionable items appear first.
- [x] Made the **60‑Day Forecast** card more compact.

#### Mobile UX polish ✅

- [x] Improved dashboard mobile responsiveness:
  - Stats row is responsive (2x2 on mobile/tablet, 4 across on desktop).
  - Reduced mobile padding (px-4 feel on small screens).
  - Hides “No outstanding invoices” on mobile to reduce clutter.
  - Ensures “Your Path Forward” stays readable/visible on small screens.

#### Calendar: navigation consistency ✅

- [x] Added **“← Back to Dashboard”** breadcrumb at the top of the Calendar page, matching other dashboard sub-pages.

### Files Changed (last 24 hours)

**Modified:**

```
app/dashboard/page.tsx
app/dashboard/calendar/page.tsx
docs/development-progress.md
```

### Next Up

- [ ] Reddit launch: ship a short walkthrough post (focus on freelancer “daily budget” + runway)
- [ ] Monitor PostHog funnels for dashboard engagement (daily budget card click-through, scenario usage)
- [ ] Consider lightweight automated tests for forecast-derived cards (edge cases around dates/timezones)

---

## Day 26: Weekly Email Digest (December 29, 2025)

### Features Completed (today)

#### Weekly email digest (Resend) ✅

- [x] Added **weekly email digest preferences** to `user_settings`:
  - `email_digest_enabled` (default true)
  - `email_digest_day` (0=Sun … 6=Sat, default Monday)
  - `email_digest_time` (default 08:00)
  - `last_digest_sent_at` (anti-duplicate)
- [x] Implemented digest data generation using the existing **calendar projection + collision detection**:
  - Week-at-a-glance totals (income, bills, net)
  - Lowest balance and date
  - Alerts: low balance, overdraft risk, bill collisions
  - Upcoming bills (top 5 largest) + all income in the week
- [x] Built a responsive, inline-styled digest email template (600px max width, dark-friendly, mobile-friendly)
  - Conditional “Heads up” section
  - “No bills due” / “No income expected” empty states
- [x] Added hourly cron job (`/api/cron/weekly-digest`) to send digests based on **user timezone + preferred day/time**
  - Protected by `CRON_SECRET`
  - Concurrency-limited sending
- [x] Added signed unsubscribe + tracking endpoints:
  - `digest_opened` (tracking pixel)
  - `digest_clicked` (redirect link)
  - `digest_unsubscribed` (unsubscribe page)
  - `digest_sent` (server-side event on send)
- [x] Added Settings UI: “Email Preferences” card with toggle + day + time selectors

### Environment Variables Added

```bash
CRON_SECRET=your-secure-random-string
# Optional (recommended): used for signed email tokens; falls back to CRON_SECRET if unset
EMAIL_TOKEN_SECRET=your-secure-random-string
```

### Files Changed / Added (today)

**Added:**

```
supabase/migrations/202512290001_add_digest_settings.sql
lib/email/generate-digest-data.ts
lib/email/send-digest.ts
lib/email/digest-token.ts
lib/posthog/server.ts
lib/supabase/admin.ts
components/emails/weekly-digest.tsx
components/settings/email-digest-form.tsx
app/api/cron/weekly-digest/route.ts
app/api/cron/weekly-digest/send/route.ts
app/api/email/unsubscribe/route.ts
app/api/email/track/route.ts
app/api/email/click/route.ts
lib/actions/update-digest-settings.ts
vercel.json
```

**Modified:**

```
app/dashboard/settings/page.tsx
types/supabase.ts
```

### Next Up

- [ ] Verify deliverability + rendering across Gmail/Outlook/Apple Mail (mobile + desktop)
- [ ] Confirm Vercel Cron is enabled in production and cron auth header is set correctly
- [ ] Monitor digest funnel in PostHog (sent → opened → clicked → return visit)

## Day 23: Landing Page SEO + Legal Pages + FAQ Structured Data (December 22, 2025)

### Features Completed (last 24 hours)

#### FAQ Section + FAQPage Schema ✅

- [x] Added an FAQ accordion section on the landing page (`components/landing/faq-section.tsx`)
- [x] Added FAQPage JSON-LD structured data for rich results
- [x] Wired FAQ section into the home page (`app/page.tsx`)

#### Terms + Privacy Pages ✅

- [x] Added full Terms and Privacy page content components:
  - `app/terms/terms-page.tsx`
  - `app/privacy/privacy-page.tsx`
- [x] Added route wrappers:
  - `app/terms/page.tsx`
  - `app/privacy/page.tsx`
- [x] Linked Terms + Privacy from the landing page footer (`app/page.tsx`)

#### SEO Foundations ✅

- [x] Improved landing page SEO metadata (title/description/keywords + social metadata)
- [x] Added first-class Next.js metadata routes:
  - `app/sitemap.ts` (sitemap at `/sitemap.xml`)
  - `app/robots.ts` (robots at `/robots.txt`)

#### Performance + Quality Tweaks ✅

- [x] Added explicit `sizes` on the hero image (`app/page.tsx`) to improve responsive loading behavior.
- [x] Generated a Lighthouse report for follow-up iteration (`lighthouse-report.html`).
- [x] Added `@next/next/no-img-element` enforcement (`.eslintrc.json`).
- [x] Added an optional PostHog provider variant to defer initialization (`lib/posthog/provider-optimized.tsx`) (not yet wired; current provider is `app/providers/posthog-provider.tsx`).

### Files Changed (last 24 hours)

**Added:**

```
app/robots.ts
app/sitemap.ts
app/privacy/page.tsx
app/privacy/privacy-page.tsx
app/terms/page.tsx
app/terms/terms-page.tsx
components/landing/faq-section.tsx
lib/posthog/provider-optimized.tsx
lighthouse-report.html
```

**Modified:**

```
app/page.tsx
.eslintrc.json
docs/development-progress.md
```

### Next Up

- [ ] Decide whether to switch to the optimized PostHog provider (and verify event capture/pageview behavior)
- [ ] Use the Lighthouse report to prioritize 1-2 quick landing page wins (LCP/CLS/unused JS)
- [ ] Continue launch prep (Reddit post + early user feedback loop)

---

## Day 22: Feature Gating + PostHog Analytics + Stripe Live (December 21, 2025)

### Features Completed Today

#### PostHog Analytics Integration ✅

- [x] PostHog SDK installed and configured (`posthog-js@1.195.1`)
- [x] Provider component wrapping app layout
- [x] User identification on authentication
- [x] Core event tracking implemented:
  - `user_signed_up` - New user registration
  - `user_logged_in` - User authentication
  - `onboarding_started` / `onboarding_completed` - Wizard flow
  - `account_created` / `income_created` / `bill_created` - Data entry
  - `calendar_viewed` - Core feature usage
  - `scenario_tested` - "Can I Afford It?" usage
  - `invoice_created` / `invoice_sent` / `reminder_sent` - Runway Collect
  - `upgrade_prompt_shown` / `upgrade_initiated` - Conversion tracking
  - `subscription_created` / `subscription_cancelled` - Revenue events
- [x] Feature flags ready for A/B testing
- [x] Session recording enabled

#### Feature Gating System ✅

- [x] **Client-side hooks** (`lib/hooks/use-subscription.ts`):
  - `useSubscription()` - Get current tier and status
  - `useUsage()` - Get bills/income counts
  - `useSubscriptionWithUsage()` - Combined hook for forms
- [x] **Server-side utilities** (`lib/stripe/feature-gate.ts`):
  - `canAddBill()` / `canAddIncome()` - Limit checks
  - `canUseInvoicing()` / `canUseBankSync()` - Feature access
  - `getUserUsageStats()` - Current usage counts
- [x] **Upgrade prompt components** (`components/subscription/`):
  - `UpgradePrompt` - Modal with billing toggle and Stripe checkout
  - `UpgradeBanner` - Inline warning when approaching/at limits
  - `UsageIndicator` - Badge showing "3/10 bills"
  - `GatedAddButton` - Smart button that gates or navigates

#### Bills Page Gating ✅

- [x] Usage indicator badge in header ("3/10")
- [x] Upgrade banner when at limit (amber) or near limit (blue, 2 remaining)
- [x] GatedAddButton opens upgrade modal when at limit
- [x] Server-side validation in form submission
- [x] Auto-redirect from /bills/new if at limit

#### Income Page Gating ✅

- [x] Same pattern as bills page
- [x] Usage indicator, upgrade banner, gated button
- [x] Server-side validation in form submission
- [x] Auto-redirect from /income/new if at limit

#### Invoices Page Gating (Pro Feature) ✅

- [x] Full-page upgrade prompt for Free users
- [x] Server-side redirect on /invoices/new, /invoices/[id], /invoices/[id]/edit
- [x] Server actions gated (`createInvoice`, `updateInvoice`, `deleteInvoice`)
- [x] API routes gated (send email, PDF download)
- [x] `InvoicingUpgradePrompt` component with feature list

#### Stripe Live Mode ✅

- [x] Switched from test mode to live mode
- [x] Created live products and prices in Stripe Dashboard
- [x] Updated Vercel environment variables with live keys
- [x] Created live webhook endpoint (`www.cashflowforecaster.io/api/webhooks/stripe`)
- [x] Fixed webhook 307 redirect issue (www vs non-www)
- [x] Fixed cancellation detection bug (`cancel_at` vs `cancel_at_period_end`)
- [x] Tested full subscription lifecycle:
  - ✅ New subscription checkout
  - ✅ Payment processing
  - ✅ Webhook delivery (200 OK)
  - ✅ Database updates
  - ✅ Cancellation flow
  - ✅ Reactivation flow
- [x] Real payments processed and refunded successfully

### Webhook Bug Fix

**Issue:** Stripe Customer Portal uses `cancel_at` (timestamp) instead of `cancel_at_period_end` (boolean) when users cancel.

**Solution:** Added `isSubscriptionCanceling()` helper function that checks both:
```typescript
function isSubscriptionCanceling(subscription: any): boolean {
  if (subscription.cancel_at_period_end === true) {
    return true;
  }
  if (subscription.cancel_at !== null && subscription.cancel_at !== undefined) {
    return true;
  }
  return false;
}
```

### New Files Created

```
lib/hooks/use-subscription.ts              # Client-side subscription hooks
lib/stripe/feature-gate.ts                 # Server-side gating utilities
components/subscription/upgrade-prompt.tsx  # Modal + banner + indicator
components/subscription/gated-add-button.tsx # Smart gated navigation
components/invoices/invoicing-upgrade-prompt.tsx # Full-page Pro upsell
components/invoices/new-invoice-form.tsx   # Extracted client form
lib/posthog/provider.tsx                   # PostHog context provider
lib/posthog/client.ts                      # PostHog initialization
```

### Files Modified

```
app/layout.tsx                             # Added PostHogProvider
app/dashboard/bills/page.tsx               # Added usage indicator, banner, gated button
app/dashboard/bills/new/page.tsx           # Added limit check, upgrade modal
app/dashboard/income/page.tsx              # Added usage indicator, banner, gated button
app/dashboard/income/new/page.tsx          # Added limit check, upgrade modal
app/dashboard/invoices/page.tsx            # Added Pro gate, upgrade prompt
app/dashboard/invoices/new/page.tsx        # Converted to server component with gate
app/dashboard/invoices/[id]/page.tsx       # Added Pro gate redirect
app/dashboard/invoices/[id]/edit/page.tsx  # Added Pro gate redirect
lib/actions/invoices.ts                    # Added canUseInvoicing() checks
lib/actions/send-reminder.ts               # Added canUseInvoicing() check
app/api/invoices/[id]/send/route.ts        # Added 403 for Free users
app/api/invoices/[id]/pdf/route.ts         # Added 403 for Free users
app/api/webhooks/stripe/route.ts           # Fixed cancel_at detection
```

### Environment Variables Updated (Live Mode)

```bash
# Stripe (now live keys)
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx (live endpoint)
STRIPE_PRICE_PRO_MONTHLY=price_1SgrBzGdM5Eg7nghDemJuPNH
STRIPE_PRICE_PRO_YEARLY=price_1SgrBzGdM5Eg7nghf3mVp20I
STRIPE_PRICE_PREMIUM_MONTHLY=price_1SgrCAGdM5Eg7nghyhBz6FTD
STRIPE_PRICE_PREMIUM_YEARLY=price_1SgrCAGdM5Eg7nghKj8Pm1Im

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### Technical Implementation Details

#### Feature Gating Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      User Request                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Page Component                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Server: getUserUsageStats() / canUseInvoicing()         │   │
│  │ - Fetch subscription tier                               │   │
│  │ - Count current bills/income                            │   │
│  │ - Return limits and usage                               │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
            ┌─────────────────┴─────────────────┐
            ▼                                   ▼
┌───────────────────────┐           ┌───────────────────────┐
│   Has Access / Room   │           │  At Limit / No Access │
│                       │           │                       │
│ - Show normal UI      │           │ - Show upgrade banner │
│ - GatedAddButton      │           │ - GatedAddButton      │
│   navigates to form   │           │   opens modal         │
└───────────────────────┘           └───────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Form Submission                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Server Action: canAddBill() / canAddIncome()            │   │
│  │ - Double-check limits (belt and suspenders)             │   │
│  │ - Return error if at limit                              │   │
│  │ - Insert if allowed                                     │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

#### Tier Limits Configuration

| Feature | Free | Pro |
|---------|------|-----|
| Bills | 10 | Unlimited |
| Income Sources | 10 | Unlimited |
| Forecast Days | 60 | 365 |
| Invoicing | ❌ | ✅ |
| Bank Sync | ❌ | (planned) |
| SMS Alerts | ❌ | (planned) |

#### Subscription Lifecycle (Tested in Production)

| Action | Stripe Event | Webhook Handler | Database Update |
|--------|--------------|-----------------|-----------------|
| Subscribe | `checkout.session.completed` | `handleCheckoutCompleted` | tier: pro, status: active |
| Cancel | `customer.subscription.updated` | `handleSubscriptionChange` | cancel_at_period_end: true |
| Reactivate | `customer.subscription.updated` | `handleSubscriptionChange` | cancel_at_period_end: false |
| Period ends | `customer.subscription.deleted` | `handleSubscriptionCanceled` | tier: free, status: canceled |
| Payment fails | `invoice.payment_failed` | `handlePaymentFailed` | status: past_due |
| Payment succeeds | `invoice.payment_succeeded` | `handlePaymentSucceeded` | status: active |

---

## Day 21: Stripe Integration (December 19, 2025)

### Features Completed

#### Stripe Checkout Integration ✅

- [x] Stripe SDK installed and configured (`stripe@17`)
- [x] Created Stripe products and prices (Pro Monthly/Yearly, Premium Monthly/Yearly)
- [x] Checkout session creation with user metadata
- [x] Success/cancel redirect handling
- [x] Price ID configuration in environment variables

#### Webhook Handler ✅

- [x] Webhook endpoint at `/api/webhooks/stripe`
- [x] Signature verification with `STRIPE_WEBHOOK_SECRET`
- [x] Event handling for:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
- [x] Fixed 307 redirect issue with `skipTrailingSlashRedirect` in next.config
- [x] Fixed date extraction for Stripe API 2025-11-17.clover

#### Subscriptions Database ✅

- [x] New `subscriptions` table with RLS
- [x] Fields: user_id, stripe_customer_id, stripe_subscription_id, tier, status, price_id, interval, current_period_start, current_period_end, cancel_at_period_end
- [x] Single source of truth for all billing data

#### Customer Portal ✅

- [x] Stripe Customer Portal configured
- [x] "Manage" button in Settings page
- [x] Users can update payment method, view invoices, cancel subscription

#### Subscription Status Component ✅

- [x] `components/subscription/subscription-status.tsx` component
- [x] Shows tier badge (Free/Pro/Premium) with appropriate icon
- [x] Shows status (Active/Trial/Past Due/Canceled)
- [x] Shows renewal date
- [x] Warning banner for past_due status
- [x] Cancellation notice with end date when `cancel_at_period_end: true`

---

## Infrastructure Status

### ✅ Completed

- [x] **Domains Secured:** cashflowforecaster.io, .app
- [x] **DNS Configured:** Namecheap → Vercel
- [x] **Git Repository:** Connected to GitHub
- [x] **Supabase Project:** Created and configured
- [x] **Database Schema:** 12 tables with RLS
- [x] **TypeScript Types:** Generated from database
- [x] **Environment Variables:** Configured locally + Vercel
- [x] **Landing Page:** Complete with pricing, features, CTA
- [x] **Vercel Deployment:** Live and working
- [x] **Custom Domain:** cashflowforecaster.io connected
- [x] **SSL Certificate:** Auto via Vercel
- [x] **Runway Collect:** Invoicing + email + reminders complete
- [x] **Onboarding Wizard:** Complete
- [x] **Pricing Section:** Redesigned with tiers
- [x] **Calendar Polish:** Dark theme, today indicator, low balance warnings
- [x] **Toast Notifications:** react-hot-toast configured
- [x] **"Can I Afford It?" Scenarios:** Core differentiator feature
- [x] **Google OAuth:** Configured and working
- [x] **Stripe Integration:** Checkout, webhooks, portal, subscription management
- [x] **Stripe Live Mode:** Real payments processing
- [x] **PostHog Analytics:** User tracking, conversion funnel, feature usage
- [x] **Feature Gating:** Bills/income limits, invoicing Pro gate

### 📋 Next Up

- [ ] **Reddit Launch:** Post to r/freelance, r/smallbusiness
- [ ] **Error Monitoring:** Sentry integration
- [ ] **Bill Collision Warnings:** UX improvement for same-day bills

---

## Feature Gating - Complete Feature Set ✅

### Quantity Limits (Bills/Income)

| User Action | Free (at limit) | Free (under limit) | Pro/Premium |
|-------------|-----------------|-------------------|-------------|
| View list page | See "10/10" badge + amber banner | See "3/10" badge | No limits shown |
| Click Add button | Opens upgrade modal | Navigates to form | Navigates to form |
| Submit form | Error + upgrade modal | Success | Success |
| Direct URL to /new | Redirects to list | Shows form | Shows form |

### Feature Gates (Invoicing)

| User Action | Free | Pro/Premium |
|-------------|------|-------------|
| Visit /invoices | Full-page upgrade prompt | Normal invoice list |
| Visit /invoices/new | Redirect to /invoices | Normal form |
| API: create invoice | 403 Forbidden | Success |
| API: send invoice | 403 Forbidden | Success |
| API: download PDF | 403 Forbidden | Success |

---

## PostHog Analytics - Tracked Events ✅

### Authentication Events
- `user_signed_up` - email, method (email/google)
- `user_logged_in` - method

### Onboarding Events
- `onboarding_started`
- `onboarding_step_completed` - step (1-4)
- `onboarding_completed` - accounts_count, income_count, bills_count

### Core Feature Events
- `account_created` - type (checking/savings)
- `income_created` - frequency, amount_range
- `bill_created` - frequency, category
- `calendar_viewed` - days_shown
- `scenario_tested` - amount_range, result (affordable/not_affordable)

### Invoicing Events (Pro)
- `invoice_created` - amount_range
- `invoice_sent` - amount_range
- `reminder_sent` - reminder_type (friendly/firm/final)

### Feedback Events
- `feedback_submitted` - type (bug/suggestion/question/other), message_length

### Conversion Events
- `upgrade_prompt_shown` - trigger (bills_limit/income_limit/invoicing)
- `upgrade_initiated` - tier, interval (month/year)
- `subscription_created` - tier, interval, mrr
- `subscription_cancelled` - tier, reason

### Engagement Events
- `feature_used` - feature_name
- `page_viewed` - path (auto-captured)
- `session_started` (auto-captured)

### Survey Events (PostHog Surveys)
- NPS survey responses (7 days after signup)

---

## Feature Roadmap

### Completed ✅

| Feature | Status | Notes |
|---------|--------|-------|
| 60-day cash flow calendar | ✅ | Core feature |
| Accounts CRUD | ✅ | Multiple accounts supported |
| Income CRUD | ✅ | Recurring + one-time |
| Bills CRUD | ✅ | All frequencies supported |
| Runway Collect invoicing | ✅ | PDF generation |
| Invoice email sending | ✅ | Via Resend |
| Payment reminders | ✅ | 3 escalating templates |
| Onboarding wizard | ✅ | 4-step guided setup |
| Pricing section | ✅ | 3 tiers with toggle |
| Today indicator | ✅ | Auto-scroll + highlight |
| Low balance warnings | ✅ | Amber/rose styling |
| Toast notifications | ✅ | react-hot-toast |
| "Can I Afford It?" scenarios | ✅ | Core differentiator |
| Google OAuth | ✅ | One-click signup |
| Landing page polish | ✅ | Header, footer, how it works |
| Stripe payments | ✅ | Checkout, webhooks, portal |
| Subscription management | ✅ | Settings page integration |
| PostHog analytics | ✅ | Full event tracking |
| Feature gating | ✅ | Bills/income limits, invoicing gate |
| **Stripe live mode** | ✅ | **Real payments processing** |

### Upcoming 📋

| Feature | Priority | Est. Time |
|---------|----------|-----------|
| Reddit launch | HIGH | 2 hours |
| Bill collision warnings | MEDIUM | 2-3 hours |
| Sentry error monitoring | MEDIUM | 1-2 hours |
| Weekly check-in prompts | LOW | 3-4 hours |
| Email parser | LOW | 6-8 hours |
| Plaid bank sync | LOW | 8-10 hours |

---

## Development Velocity

| Phase | Days | Hours | Status |
|-------|------|-------|--------|
| Foundation | 1-3 | 10-12 | ✅ Complete |
| Authentication | 4-5 | 5-7 | ✅ Complete |
| Core Data Models | 6-8 | 6-9 | ✅ Complete |
| Calendar Algorithm | 9-10 | 4-6 | ✅ Complete |
| Calendar UI | 11-13 | 6-8 | ✅ Complete |
| Calendar Polish | 14-15 | 3-4 | ✅ Complete |
| Landing Page | 16 | 2-3 | ✅ Complete |
| Runway Collect P1 | 17 | 4-5 | ✅ Complete |
| Deployment | 17 | 2-3 | ✅ Complete |
| Post-Launch Polish | 18 | 5-6 | ✅ Complete |
| Payment Reminders | 19 | 3-4 | ✅ Complete |
| Landing + OAuth | 20 | 3-4 | ✅ Complete |
| Stripe Integration | 21 | 6-8 | ✅ Complete |
| Feature Gating + Analytics | 22 | 5-6 | ✅ Complete |
| **Stripe Live Mode** | **22** | **1-2** | ✅ **Complete** |

**Cumulative:** ~95-110 hours over 22 days

**Average:** ~4.5 hours per day

---

## Lessons Learned

### Day 22: Feature Gating + Analytics + Stripe Live

- **Belt-and-suspenders approach is essential** - Client-side checks for UX, server-side checks for security
- **Upgrade modals need billing toggle** - Users want to see yearly savings before committing
- **Usage indicators reduce frustration** - Showing "3/10" prevents surprise limit errors
- **PostHog events should be specific** - `bill_created` with frequency metadata is more useful than generic `item_created`
- **Feature gates differ by type** - Quantity limits (bills) vs binary access (invoicing) need different UX patterns
- **Stripe live vs test requires separate webhook endpoints** - Must update webhook URL when switching modes
- **www vs non-www matters for webhooks** - 307 redirects break webhook signature verification
- **Stripe uses `cancel_at` timestamp, not just `cancel_at_period_end` boolean** - Customer Portal cancellations set `cancel_at` instead

### Day 21: Stripe Integration

- **Webhook debugging is tricky** - 307 redirects, signature verification, and date extraction all required careful debugging
- **Stripe API versions matter** - The `2025-11-17.clover` API moved period dates inside `items.data[0]`
- **Single source of truth is essential** - Using `subscriptions` table exclusively prevents sync issues
- **Test with Stripe CLI locally** - `stripe listen --forward-to localhost:3000/api/webhooks/stripe` saves hours

### Day 20: Landing Page + Google OAuth

- **OAuth reduces friction significantly** - One-click Google signup removes the biggest barrier
- **Landing page storytelling matters** - "How It Works" + feature mockups help visitors understand value

---

## What's Working Well

- ✅ Complete MVP with all core features
- ✅ Runway Collect fully featured (create → send → remind)
- ✅ Onboarding wizard for new users
- ✅ Polished calendar with warnings
- ✅ Professional pricing section
- ✅ Toast notifications throughout
- ✅ Build and deployment stable
- ✅ Google OAuth for frictionless signup
- ✅ Landing page with clear value proposition
- ✅ Stripe payments fully integrated
- ✅ **Stripe live mode - real payments working**
- ✅ Subscription management in settings
- ✅ Customer portal for self-service
- ✅ PostHog tracking conversion funnel
- ✅ Feature gating enforcing tier limits
- ✅ Upgrade prompts driving conversions
- ✅ **Full subscription lifecycle tested (subscribe → cancel → reactivate)**
- ✅ **PostHog NPS survey (7 days after signup)**
- ✅ **In-app feedback widget**
- ✅ **Semi-monthly frequency support**

## What's Next

1. **Reddit launch** - Post to target subreddits
2. **Monitor NPS survey responses** - Watch for feedback patterns in PostHog
3. **User feedback** - Iterate based on real usage + in-app feedback
4. **Bill collision warnings** - Next UX improvement
5. **Sentry error monitoring** - Catch production errors

---

**Status:** 🚀 **FULLY LAUNCH-READY** - Live payments, feature gating, analytics all working in production!

**This is a living document. Update after each development session.**