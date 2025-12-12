# Cash Flow Forecaster - Development Progress

**Last Updated:** December 11, 2024

**Repository:** https://github.com/omarqouqas/cashflowforecaster

**Live URL:** https://cashflowforecaster.io (coming soon)

---

## Quick Stats

- **Days in Development:** 15
- **Commits:** [Check git log]
- **Files Created:** [Check git ls-files | wc -l]
- **Lines of Code:** Estimate ~6,000-7,000
- **Database Tables:** 9
- **Test Coverage:** Manual testing (automated tests coming later)

## Current Status Summary

**Overall Progress:** ~85% of MVP complete

**Completed Phases:**
- ✅ Phase 1: Foundation (Days 1-3) - COMPLETE
- ✅ Phase 2: Authentication (Days 4-5) - COMPLETE
- ✅ Phase 3: Core Data Models (Days 6-8) - COMPLETE
- ✅ Phase 4: Calendar Feature (Days 9-15) - COMPLETE
  - ✅ Algorithm & Logic (Days 9-10) - COMPLETE
  - ✅ UI Components (Days 11-13) - COMPLETE
  - ✅ Polish & Testing (Days 14-15) - COMPLETE

**Next Steps:**
1. Settings page enhancements (user-configurable thresholds)
2. Scenarios / "Can I Afford It?" feature
3. Final polish and launch prep
4. Vercel deployment

---

## Development Phases

### ✅ Phase 1: Foundation (Days 1-3) - COMPLETE

#### Day 1: Project Setup

**Date:** [Date]

**Time Invested:** ~3-4 hours

**Completed:**

- [x] Next.js 14 project initialization
- [x] TypeScript configuration (strict mode)
- [x] Tailwind CSS setup
- [x] ESLint + Prettier configuration
- [x] Reusable Button component
- [x] Landing page with hero section
- [x] Environment variables structure
- [x] README documentation
- [x] Git repository initialized

**Key Files Created:**

- `app/layout.tsx` - Root layout with metadata
- `app/page.tsx` - Landing page
- `components/ui/button.tsx` - Reusable button
- `lib/utils.ts` - Utility functions
- `.env.example` - Environment template

**Learnings:**

- Next.js 14 App Router structure
- Tailwind CSS configuration
- TypeScript strict mode setup

---

#### Day 2: Supabase Integration

**Date:** [Date]

**Time Invested:** ~4-5 hours

**Completed:**

- [x] Supabase packages installed
- [x] Three Supabase clients created (browser, server, route handler)
- [x] Environment variables configured
- [x] Authentication helper functions
- [x] Placeholder TypeScript types
- [x] Connection test page
- [x] Supabase utilities (error handling)
- [x] README updated with Supabase setup

**Key Files Created:**

- `lib/supabase/client.ts` - Browser client
- `lib/supabase/server.ts` - Server client
- `lib/supabase/route-handler.ts` - API route client
- `lib/supabase/utils.ts` - Utilities
- `lib/auth/session.ts` - Auth helpers
- `types/supabase.ts` - Database types
- `app/test-supabase/page.tsx` - Connection test

**Learnings:**

- Supabase client configurations for different contexts
- Next.js 14 cookie handling
- TypeScript type definitions for database

---

#### Day 3: Database Schema

**Date:** [Date]

**Time Invested:** ~3-4 hours

**Completed:**

- [x] 9 database tables created in Supabase
- [x] Row Level Security enabled
- [x] TypeScript types generated from live database
- [x] Database test page created
- [x] All tables verified accessible
- [x] Documentation updated
- [x] Supabase CLI authenticated
- [x] Git repository pushed to GitHub

**Tables Created:**

1. accounts - User bank accounts
2. income - Income sources
3. bills - Recurring expenses
4. user_settings - User preferences
5. scenarios - What-if calculations
6. parsed_emails - Email parser results
7. weekly_checkins - Burn rate tracking
8. notifications - User notifications
9. users - Extended profiles

**Key Files Created/Updated:**

- `types/supabase.ts` - Generated from live database
- `app/test-database/page.tsx` - Database test page
- `docs/database-schema.md` - Schema documentation

**Learnings:**

- Supabase CLI type generation
- Row Level Security configuration
- Database testing strategies

---

### ✅ Phase 2: Authentication (Days 4-5) - COMPLETE

#### Day 4: Signup & Login ✅ COMPLETE

**Date:** December 2, 2024

**Time Invested:** 3-4 hours

**Completed:**

- [x] Signup page with validation
- [x] Login page with error handling
- [x] Form validation with Zod
- [x] Supabase Auth integration
- [x] Error handling and UX
- [x] Success redirects
- [x] Protected dashboard
- [x] Logout functionality
- [x] Reusable form components

**Key Files Created:**

- `app/auth/signup/page.tsx` - Signup form
- `app/auth/login/page.tsx` - Login form
- `app/auth/callback/route.ts` - Email confirmation handler
- `app/auth/logout/route.ts` - Logout handler
- `app/dashboard/page.tsx` - Protected dashboard
- `components/ui/input.tsx` - Form input component
- `components/ui/label.tsx` - Form label component
- `components/ui/form-error.tsx` - Error display component

**Key Files Updated:**

- `app/page.tsx` - Added auth links

**Learnings:**

- react-hook-form + Zod validation pattern
- Supabase Auth client-side usage
- Server Component auth with requireAuth helper
- Form error handling and user feedback
- Protected route implementation

**Testing:**

- Manual testing of signup flow
- Manual testing of login flow
- Protected route verification (redirect when not authenticated)
- Logout functionality verified
- Form validation tested (empty fields, password mismatch, etc.)

---

#### Day 5: Enhanced Auth Flow ✅ COMPLETE

**Date:** December 2, 2024

**Time Invested:** 2-3 hours

**Completed:**

- [x] Password reset page
- [x] Email verification reminders
- [x] Protected routes middleware
- [x] User profile creation on signup
- [x] Dashboard with user info
- [x] User menu component
- [x] Settings page
- [x] Enhanced auth flow

**Key Files Created:**

- `app/auth/reset-password/page.tsx` - Password reset form
- `app/settings/page.tsx` - User settings page
- `middleware.ts` - Route protection middleware
- `lib/auth/create-profile.ts` - Profile creation helper
- `components/user-menu.tsx` - User menu dropdown

**Key Files Updated:**

- `app/dashboard/page.tsx` - Enhanced with user info
- `app/auth/signup/page.tsx` - Profile creation on signup

**Learnings:**

- Next.js middleware for route protection
- Supabase Auth password reset flow
- Email verification handling
- User profile management
- Settings page patterns

**Testing:**

- Password reset flow tested
- Email verification tested
- Protected routes verified
- User menu functionality tested
- Settings page tested

---

### ✅ Phase 3: Core Data Models (Days 6-8) - COMPLETE

#### Day 6: Account Management ✅ COMPLETE

**Date:** December 6, 2024

**Time Invested:** 2-3 hours

**Completed:**

- [x] Account list page with grid layout
- [x] Add new account form with validation
- [x] Edit account functionality
- [x] Delete account with confirmation
- [x] Account summary on dashboard
- [x] Navigation component for dashboard sections
- [x] Empty states and success messages
- [x] Currency formatting utilities
- [x] Consistent card heights fix

**Key Files Created:**

- `app/dashboard/accounts/page.tsx` - Account list (Server Component)
- `app/dashboard/accounts/new/page.tsx` - Add account form (Client Component)
- `app/dashboard/accounts/[id]/edit/page.tsx` - Edit account form (Client Component)
- `components/accounts/delete-account-button.tsx` - Delete with confirmation
- `components/dashboard/nav.tsx` - Dashboard navigation
- `app/dashboard/layout.tsx` - Shared dashboard layout
- `lib/utils/format.ts` - Currency formatting utilities

**Key Files Updated:**

- `app/dashboard/page.tsx` - Added account summary with live data

**Database Operations:**

- Full CRUD on accounts table (Create, Read, Update, Delete)
- Row Level Security working correctly
- User can only access their own accounts
- TypeScript types from Supabase schema

**UI/UX Improvements:**

- Professional grid layout for account cards
- Account type badges (checking/savings)
- Large, formatted currency displays
- Empty state for new users
- Success notifications after actions
- Two-step delete confirmation
- Responsive design (mobile-first)
- Consistent card heights across dashboard
- Active navigation highlighting

**Learnings:**

- Server Components for data fetching (accounts list)
- Client Components for forms and interactions
- Next.js dynamic routes: [id]/edit pattern
- Form pre-filling with existing data
- Optimistic UI updates with router.refresh()
- Confirmation patterns for destructive actions
- Mixing Server and Client Components effectively

**Testing:**

- Manual testing of all CRUD operations
- Created 3 test accounts
- Verified edit and delete functionality
- Confirmed RLS is working (users only see their accounts)
- Tested empty states
- Verified success messages display correctly
- Responsive design tested on mobile viewport

---

#### Day 7: Income Sources Management ✅ COMPLETE

**Date:** December 7, 2024

**Time Invested:** 2-3 hours

**Completed:**

- [x] Income list page with monthly summary
- [x] Add new income form with validation
- [x] Edit income functionality
- [x] Delete income with confirmation
- [x] Income summary on dashboard (live data)
- [x] Monthly income calculation algorithm
- [x] Frequency options (weekly, biweekly, monthly, one-time, irregular)
- [x] Link income to accounts (optional)
- [x] Active/inactive status toggle
- [x] Empty states and success messages
- [x] Date display fix (timezone issue resolved)
- [x] Page refresh fix after edits

**Key Files Created:**

- `app/dashboard/income/page.tsx` - Income list with summary (Server Component)
- `app/dashboard/income/new/page.tsx` - Add income form (Client Component)
- `app/dashboard/income/[id]/edit/page.tsx` - Edit income form (Client Component)
- `components/income/delete-income-button.tsx` - Delete with confirmation
- `lib/utils/format.ts` - Updated with formatDateOnly() function

**Key Files Updated:**

- `app/dashboard/page.tsx` - Added income summary with live data and calculation

**Database Operations:**

- Full CRUD on income table (Create, Read, Update, Delete)
- Row Level Security working correctly
- User can only access their own income sources
- TypeScript types from Supabase schema

**Income Calculation Algorithm:**

Converts all frequencies to monthly equivalent:

- **Weekly:** amount × 52 ÷ 12 = monthly
- **Biweekly:** amount × 26 ÷ 12 = monthly
- **Monthly:** amount × 1 = monthly
- **One-time:** excluded from monthly total
- **Irregular:** excluded from monthly total

Example calculation verified:

- Weekly $500 → $2,166.67/month
- Biweekly $2,000 → $4,333.33/month
- Monthly $1,200 → $1,200/month
- **Total: $7,700/month** ✓ Accurate

**UI/UX Improvements:**

- Professional card layout with green theme (income)
- Summary card showing estimated monthly income
- Frequency badges (weekly, biweekly, monthly, etc.)
- Active/Inactive status badges with visual dimming
- Large formatted currency displays
- Next payment date display
- Empty state for new users
- Success notifications after actions
- Responsive design (mobile-first)
- Account linking dropdown with user's accounts

**Bug Fixes:**

- **Date display issue:** Dates showing one day behind
  - Cause: UTC midnight converted to local timezone
  - Solution: Created formatDateOnly() function for date-only fields
  - Result: Dates now display exactly as entered

- **Page not refreshing after edit:** Updates didn't appear until manual refresh
  - Cause: Next.js Server Component caching
  - Solution: Added router.refresh() before redirect
  - Result: Changes appear immediately after save

**Testing:**

- Comprehensive testing completed (12 test scenarios)
- Created 5 test income sources with different frequencies
- Verified monthly calculation accuracy
- Tested all CRUD operations
- Validated form validation
- Confirmed active/inactive toggle
- Verified dashboard integration
- Tested mobile responsiveness
- Confirmed success messages
- Validated edge cases (large amounts, many sources)

**Learnings:**

- Frequency-to-monthly conversion algorithms
- Next.js caching behavior with Server Components
- Date handling with timezones (UTC vs local)
- router.refresh() for cache invalidation
- Conditional calculations (exclude one-time and irregular)
- Badge design patterns for status display
- Formula testing and verification importance

**Technical Decisions:**

- Keep accurate monthly calculation (26 biweekly periods, not 24)
- Add explanation for biweekly calculation to avoid user confusion
- Separate badges for frequency and active status
- Visual dimming for inactive income sources
- Optional account linking (not required)
- formatDateOnly() for date-only fields vs formatDate() for timestamps

---

#### Day 8: Bills Management ✅ COMPLETE

**Date:** December 7, 2024

**Time Invested:** 2-3 hours

**Completed:**

- [x] Bills list page with monthly summary
- [x] Add bill form with validation
- [x] Edit bill functionality
- [x] Delete bill with confirmation
- [x] Monthly bill calculation (monthly/quarterly/annually/one-time)
- [x] 5 categories with badges (rent, utilities, subscriptions, insurance, other)
- [x] Active/inactive toggle component (reusable)
- [x] Bills summary on dashboard (live data)
- [x] Dashboard integration
- [x] Works on both bills AND income pages
- [x] Applied learnings from Days 6-7 (router.refresh, formatDateOnly)

**Key Files Created:**

- `app/dashboard/bills/page.tsx` - Bills list with summary (Server Component)
- `app/dashboard/bills/new/page.tsx` - Add bill form (Client Component)
- `app/dashboard/bills/[id]/edit/page.tsx` - Edit bill form (Client Component)
- `components/bills/delete-bill-button.tsx` - Delete with confirmation
- `components/ui/active-toggle-button.tsx` - Reusable toggle component (bonus!)

**Key Files Updated:**

- `app/dashboard/page.tsx` - Added bills summary with live data and calculation
- `app/dashboard/income/page.tsx` - Integrated reusable toggle component

**Database Operations:**

- Full CRUD on bills table (Create, Read, Update, Delete)
- Row Level Security working correctly
- User can only access their own bills
- TypeScript types from Supabase schema

**Bill Calculation Algorithm:**

Converts all frequencies to monthly equivalent:

- **Monthly:** amount × 1 = monthly
- **Quarterly:** amount ÷ 3 = monthly
- **Annually:** amount ÷ 12 = monthly
- **One-time:** excluded from monthly total

**UI/UX Improvements:**

- Professional card layout with red/pink theme (expenses)
- Summary card showing estimated monthly bills
- Category badges (rent, utilities, subscriptions, insurance, other)
- Active/Inactive status with one-click toggle (was 5 steps)
- Large formatted currency displays
- Due date display with formatDateOnly()
- Empty state for new users
- Success notifications after actions
- Two-step delete confirmation
- Responsive design (mobile-first)
- Automatic calculation updates on toggle

**Key Features:**

- **Reusable Toggle Component:** One-click active/inactive status toggle
  - Works on both bills and income pages
  - Reduces user steps from 5 (edit → change status → save → redirect → refresh) to 1 (click toggle)
  - Automatically updates calculations
  - Optimistic UI updates with router.refresh()
- **Form Validation:** Zod schema validation throughout
- **Type Safety:** Full TypeScript type safety across all components
- **Consistent Patterns:** Follows established patterns from Days 6-7

**Testing:**

- Comprehensive testing completed
- Tested all CRUD operations
- Verified monthly calculation accuracy
- Validated form validation
- Confirmed active/inactive toggle on bills page
- Confirmed active/inactive toggle on income page
- Verified dashboard integration
- Tested mobile responsiveness
- Confirmed success messages
- Validated edge cases (large amounts, many bills)

**Learnings:**

- Reusable component patterns (toggle button works across models)
- Frequency-to-monthly conversion for bills (different from income)
- One-click status updates vs full edit form
- Component reusability accelerates development
- router.refresh() critical for optimistic UI updates
- formatDateOnly() prevents timezone issues

**Technical Decisions:**

- Created reusable ActiveToggleButton component (DRY principle)
- Red/pink theme for expenses (vs green for income)
- Categories for better organization
- One-click toggle significantly improves UX (5 steps → 1 click)
- Exclude one-time bills from monthly calculation
- Apply router.refresh() proactively (learned from Day 7)

---

### ✅ Phase 4: Calendar Feature (Days 9-15) - COMPLETE

#### Days 9-10: Calendar Algorithm ✅ COMPLETE

**Date:** December 8, 2024

**Time Invested:** 4-6 hours

**Completed:**

- [x] Calendar generation algorithm (60-day projection)
- [x] Income occurrence calculator (all frequencies)
- [x] Bill occurrence calculator (all frequencies)
- [x] Balance projection with running totals
- [x] Status color coding (green/yellow/orange/red)
- [x] Month-end date handling (Jan 31 → Feb 28/29)
- [x] Comprehensive test page with 11 validation checks
- [x] Debug helper with formatted terminal output
- [x] All core tests passing (11/11)

**Key Files Created:**

- `lib/calendar/types.ts` - TypeScript interfaces (CalendarDay, Transaction, CalendarData)
- `lib/calendar/utils.ts` - Date helpers and status color calculator
- `lib/calendar/calculate-income.ts` - Income occurrence calculator
- `lib/calendar/calculate-bills.ts` - Bill occurrence calculator
- `lib/calendar/generate.ts` - ⭐ Main calendar generation algorithm
- `lib/calendar/debug.ts` - Development debug helper
- `app/dashboard/calendar/test/page.tsx` - Comprehensive test suite

**Algorithm Implementation:**

**Balance Projection Formula:**
```typescript
balance[n] = balance[n-1] + income[n] - bills[n]
```

**Frequency Support:**
- Weekly: Every 7 days from start date
- Biweekly: Every 14 days from start date
- Monthly: Same day each month (with month-end handling)
- Quarterly: Every 3 months
- Annually: Once per year
- One-time: Single occurrence

**Month-End Logic:**
```typescript
const lastDayOfMonth = new Date(year, month + 1, 0).getDate()
const dayToUse = Math.min(targetDay, lastDayOfMonth)
```
This ensures Jan 31 bills appear on Feb 28/29 correctly.

**Status Color Thresholds:**
- Green: Balance ≥ safety buffer + cushion (safe)
- Yellow: Balance ≥ safety buffer (caution)
- Orange: Balance ≥ $0 (low)
- Red: Balance < $0 (overdraft)

**Testing Results:**

✅ **All 11 Core Tests Passing:**

1. ✓ Starting balance is $5,500: PASS
2. ✓ Balance never goes below $0: PASS
3. ✓ No duplicate transactions: PASS
4. ✓ Weekly income ($500) appears regularly: PASS
5. ✓ Biweekly income ($2,000) appears regularly: PASS
6. ✓ Monthly income ($1,000) appears on 1st: PASS
7. ✓ Monthly bills (rent, utilities, car) appear on 1st: PASS
8. ✓ Quarterly bill (insurance) appears: PASS
9. ✓ Annual bill (subscription) appears correctly: PASS
10. ✓ Status colors change appropriately: PASS
11. ✓ Lowest balance detected correctly: PASS

**Verification:**
- Total income occurrences: 14 ✓
- Total bill occurrences: 8 ✓
- Balance range: $5,361 - $14,861 ✓
- All 4 status colors working ✓
- Calculation speed: <50ms ✓

---

#### Days 11-13: Calendar UI ✅ COMPLETE

**Date:** December 11, 2024

**Time Invested:** 6-8 hours

**Completed:**

- [x] Main calendar page (`/dashboard/calendar`)
- [x] Vertical timeline view (60-day projection)
- [x] TimelineRow component with status indicators, balance, transaction summary
- [x] Click-to-expand DayDetail panel with full transaction list
- [x] StickyCalendarHeader with 4-card summary (Starting, Lowest, Income, Bills)
- [x] Safety buffer display
- [x] Integration with real user data (accounts, income, bills)
- [x] Mobile-responsive design (tested on iPhone 14 Pro Max)
- [x] Color-coded status system (green/yellow/orange/red)

**Key Files Created:**

- `app/dashboard/calendar/page.tsx` - Main calendar page (Server Component)
- `components/calendar/calendar-container.tsx` - Interactive container (Client Component)
- `components/calendar/timeline.tsx` - TimelineRow component
- `components/calendar/day-detail.tsx` - Expandable day details
- `components/calendar/sticky-header.tsx` - Summary header with 4 cards

**Architecture:**

- Server Component (page.tsx) handles data fetching from Supabase
- Client Component (CalendarContainer) handles interactivity (click to expand)
- Clean separation of concerns between data and UI

**UI/UX Features:**

- Vertical timeline (better for mobile than grid)
- Status bar on left edge of each row (green/yellow/orange/red)
- Click any row to expand and see transaction details
- Sticky header with key metrics always visible
- Transaction dots showing income (green) and bills (red)
- "Today" highlighted in teal
- Smooth scroll to expanded day

---

#### Days 14-15: Calendar Polish ✅ COMPLETE

**Date:** December 11, 2024

**Time Invested:** 3-4 hours

**Completed:**

- [x] "Safe to Spend" calculation and display
  - Shows how much user can spend without going below safety buffer
  - Formula: lowestBalanceIn14Days - safetyBuffer
  - Handles edge cases (negative values capped to $0)
  - Prominent hero metric at top of calendar
- [x] Info tooltip explaining the Safe to Spend calculation
  - Reusable Tooltip component created
  - Shows breakdown: lowest balance, safety buffer, result
  - Works on hover (desktop) and tap (mobile)
- [x] Low Balance Warning banner
  - Prominent alert when danger days are upcoming
  - Differentiates between overdraft (red) and low balance (amber)
  - Shows days until danger, count of low-balance days
  - "This is today!" / "Tomorrow!" messaging for urgency
- [x] Fixed "0 days away" → "This is today!" messaging
- [x] Mobile responsive design verified (iPhone 14 Pro Max)

**Key Files Created:**

- `components/ui/tooltip.tsx` - Reusable tooltip with hover/tap support
- `components/calendar/low-balance-warning.tsx` - Warning banner component

**Key Files Updated:**

- `components/calendar/sticky-header.tsx` - Added Safe to Spend hero metric with tooltip
- `components/calendar/calendar-container.tsx` - Added warning banner integration
- `app/dashboard/calendar/page.tsx` - Added new calculations (safeToSpend, lowestIn14Days)

**Safe to Spend Calculation:**

```typescript
// How much can you spend today without ever going below your safety buffer?
const lowestIn14Days = Math.min(...calendarData.days.slice(0, 14).map(d => d.balance))
const safeToSpend = Math.max(0, lowestIn14Days - safetyBuffer)
```

**Example scenarios:**
- Balance $2,500,000, Lowest $2,500,000, Buffer $500 → Safe to spend: $2,499,500 ✓
- Balance $711.93, Lowest $711.93, Buffer $500 → Safe to spend: $211.93 ✓
- Balance $300, Lowest $300, Buffer $500 → Safe to spend: $0 ✓

**Low Balance Warning Logic:**

- Shows when any day has 'red' (overdraft) or 'orange' (below buffer) status
- Only shows for danger within next 14 days to avoid alert fatigue
- Differentiates messaging:
  - Overdraft: "Your balance will go negative on [date]"
  - Low balance: "Your balance will drop to [amount] on [date]"
- Urgency indicators: "This is today!", "Tomorrow!", "Only X days away"

**Technical Decisions:**

- Safe to Spend uses 14-day lookahead (not full 60 days) for relevance
- Tooltip shows calculation breakdown for user transparency
- Warning only shows for upcoming danger (not far-future issues)
- Reusable Tooltip component can be used elsewhere in app

---

## Infrastructure Setup

### ✅ Completed

- [x] **Domains Secured:** cashflowforecaster.io, .app
- [x] **DNS Configured:** Namecheap → Vercel
- [x] **Git Repository:** Initialized and connected
- [x] **GitHub Remote:** https://github.com/omarqouqas/cashflowforecaster
- [x] **Supabase Project:** Created and configured
- [x] **Database Schema:** 9 tables with RLS
- [x] **TypeScript Types:** Generated from database
- [x] **Environment Variables:** Configured locally

### 🚧 Pending

- [ ] **Vercel Deployment:** Will deploy after MVP
- [ ] **Custom Domain:** Will connect after deployment
- [ ] **SSL Certificate:** Auto via Vercel
- [ ] **Email Service:** Resend (for email parser)
- [ ] **Analytics:** PostHog (for tracking)
- [ ] **Error Monitoring:** Sentry (for debugging)

---

## Design System

### Adopted: Minimalist Utility (Linear/Notion style)

**Date Adopted:** December 11, 2024

**Design Principles:**

- Clean, tool-like aesthetic ("get in and get out")
- Zinc color palette for neutrals
- Teal accent color (not indigo - more unique)
- Minimal shadows (prefer borders)
- Mobile-first responsive design
- 44px minimum touch targets

**Color Palette:**

- Background: `bg-white`, `bg-zinc-50` (subtle)
- Text: `text-zinc-900` (primary), `text-zinc-500` (secondary)
- Borders: `border-zinc-200`
- Accent: `teal-600` for primary actions
- Status colors:
  - Safe (green): `bg-emerald-500`, `text-emerald-600`
  - Caution (yellow): `bg-amber-400`, `text-amber-600`
  - Low (orange): `bg-orange-500`, `text-orange-600`
  - Danger (red): `bg-rose-500`, `text-rose-600`

**Typography:**

- Font: Inter (via Next.js)
- Financial data: `tabular-nums` for alignment
- Headers: `font-semibold`
- Labels: `text-xs uppercase tracking-wide`

**Components Created:**

- Tooltip (`/components/ui/tooltip.tsx`)
- Various calendar components following design system

---

## Technical Debt & Future Improvements

### Known Issues

- None currently blocking

### Future Enhancements

- [ ] Add automated testing (Vitest + Playwright)
- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Add API rate limiting
- [ ] Implement caching strategy
- [ ] Add database migrations system
- [ ] Create development/staging environments
- [ ] Add performance monitoring
- [ ] Implement feature flags

### Mobile Strategy

- [x] Phase 1: PWA (current) - MVP complete
- [ ] Phase 2: Evaluate traction (Month 3-4)
- [ ] Phase 3: Build React Native (if needed)
- [ ] Phase 4: Submit to app stores

---

## Key Decisions Log

### December 2, 2024

**Decision:** Use PWA instead of React Native initially

**Reasoning:**

- Faster to market (no app store approval)
- Lower costs (no $99/year Apple fee)
- Better economics (no 30% Apple tax)
- Can always build native later with 60-70% code reuse

**Decision:** Use Supabase instead of custom backend

**Reasoning:**

- Faster development (auth, database, storage built-in)
- Lower costs (generous free tier)
- Scales to 10k+ users easily
- Can migrate later if needed

**Decision:** Email parser instead of Plaid for MVP

**Reasoning:**

- Much lower cost ($0.01/email vs $0.50/user/month)
- Simpler implementation
- Good middle ground between manual and auto
- Can add Plaid in Premium tier later

---

### December 6, 2024

**Decision:** Use Server Components for list pages, Client Components for forms

**Reasoning:**

- Server Components fetch data server-side (faster initial load)
- Client Components handle user interactions (forms, delete confirmations)
- Better separation of concerns
- Improved performance (less JavaScript sent to browser)
- Follows Next.js 14 App Router best practices

**Decision:** Two-step confirmation for delete actions

**Reasoning:**

- Prevents accidental deletions
- Simple UX (no modal needed)
- Inline confirmation is more intuitive

---

### December 7, 2024

**Decision:** Create reusable ActiveToggleButton component

**Reasoning:**

- Active/inactive status toggle was 5 steps
- Same pattern needed on both bills and income pages
- One-click toggle significantly improves UX

**Decision:** Use accurate biweekly calculation (26 periods, not 24)

**Reasoning:**

- Mathematically correct (52 weeks ÷ 2 = 26 payments per year)
- Better for long-term cash flow planning

**Decision:** Create formatDateOnly() for date-only fields

**Reasoning:**

- Date-only fields were showing one day behind due to UTC conversion
- Separate function prevents timezone confusion

---

### December 11, 2024

**Decision:** Adopt Minimalist Utility design system

**Reasoning:**

- Target users are stressed about money - need clarity, not flash
- Calendar is the hero - minimal UI lets data shine
- Ages well (no trendy neon colors)
- Faster to build and maintain

**Decision:** Use vertical timeline instead of calendar grid

**Reasoning:**

- Better for mobile (primary use case)
- More natural for daily view
- Easier to show transaction details
- Click-to-expand pattern works well

**Decision:** Safe to Spend uses 14-day lookahead

**Reasoning:**

- 60-day lookahead would show artificially low numbers
- 14 days is actionable planning horizon
- Matches typical pay cycle

**Decision:** Add tooltip explaining Safe to Spend calculation

**Reasoning:**

- Users need to understand this key metric
- Transparency builds trust
- Reduces confusion when amount is $0

---

## Metrics to Track (Post-Launch)

### User Metrics

- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Monthly Active Users (MAU)
- Retention rates (D1, D7, D30)

### Business Metrics

- Free → Pro conversion rate (target: 4%)
- Free → Premium conversion rate (target: 1%)
- Monthly Recurring Revenue (MRR)
- Churn rate (target: <8%)

### Technical Metrics

- Page load time (target: <2s)
- API response time (target: <500ms)
- Error rate (target: <1%)
- Uptime (target: >99.5%)

---

## Resources & Links

**Primary:**

- Production: https://cashflowforecaster.io (coming soon)
- Repository: https://github.com/omarqouqas/cashflowforecaster
- Supabase: https://supabase.com/dashboard/project/pyekssfaqarrpjtblnlx

**Documentation:**

- Product Brief: `/docs/product-brief.md`
- Technical Requirements: `/docs/technical-requirements.md`
- Database Schema: `/docs/database-schema.md`

**Tools:**

- Cursor AI (primary development)
- GitHub (version control)
- Supabase (backend)
- Vercel (deployment)
- Namecheap (domains)

---

## Notes & Observations

### Development Velocity

**Days 1-3:** Foundation (10-12 hours total)
- Average: 3-4 hours per day

**Days 4-5:** Authentication (5-7 hours total)
- Average: 2.5-3.5 hours per day

**Days 6-8:** Core Data Models (6-9 hours total)
- Average: 2-3 hours per day
- Pattern reuse accelerating development

**Days 9-10:** Calendar Algorithm (4-6 hours total)
- Comprehensive test suite created

**Days 11-13:** Calendar UI (6-8 hours total)
- Component architecture established

**Days 14-15:** Calendar Polish (3-4 hours total)
- Safe to Spend and warnings added

**Cumulative:** ~40-50 hours over 15 days

**Average:** ~2.7-3.3 hours per day

**Status:** Phase 4 complete! Ready for final MVP features.

### What's Working Well

- Cursor AI for rapid development
- Supabase for quick backend setup
- TypeScript for catching errors early
- Git for version control and safety
- Pattern reuse accelerating development
- Reusable components (toggle, tooltip) improve velocity
- Comprehensive testing finding issues early
- Documentation maintaining momentum
- Consistent 2-3 hour daily sessions sustainable
- Design system creating visual consistency

### Challenges Encountered & Resolved

- Supabase CLI authentication → browser login
- Next.js 14 cookie handling → proper client types
- Git authentication → Personal Access Token
- Date timezone issues → formatDateOnly()
- Page caching after edits → router.refresh()
- Calendar click not working → Server/Client component separation
- Safe to Spend formula → corrected to use lowestIn14Days

### Lessons Learned

- Always verify .env.local is in .gitignore
- Test Supabase connection before building features
- Generate types from live database (don't maintain manually)
- Commit frequently (after each completed feature)
- Server Components for data, Client Components for interactivity
- router.refresh() critical for cache invalidation
- Design system speeds up development significantly
- Tooltips help users understand complex calculations

---

## Remaining MVP Tasks

### High Priority (Before Launch)

- [ ] Settings page: user-configurable safety buffer
- [ ] Scenarios / "Can I Afford It?" feature (optional for MVP)
- [ ] Final polish and bug fixes
- [ ] Vercel deployment
- [ ] Custom domain connection

### Nice to Have (Post-MVP)

- [ ] Email parser for bill detection
- [ ] Chevron icons for expand affordance
- [ ] Loading skeletons
- [ ] Error boundaries
- [ ] Automated testing

---

**This is a living document. Update after each development session.**