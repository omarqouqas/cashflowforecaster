# Cashcast - Development Progress

**Last Updated:** May 14, 2026 (Day 81)

**Repository:** https://github.com/omarqouqas/cashcast

**Live URL:** https://cashcast.money

---

## Quick Stats

- **Days in Development:** 81
- **Commits:** 420+
- **Database Tables:** 18
- **Test Coverage:** Manual testing (automated tests planned post-launch)

## Current Status Summary

**Overall Progress:** MVP Complete + Feature Gating + Analytics + Stripe Live + YNAB-Inspired Calendar + Comprehensive Filters + Low Balance Alerts + Simpler Onboarding + Emergency Fund Tracker + Stripe Payment Links + Landing Page Hero Dashboard + Calendar Visual Polish + User Profile Dropdown Redesign + Invoice Branding + Form UX Polish + SEO/AEO Audit + Content Expansion (26 Blog Posts + Glossary) + Dashboard/Calendar Mobile UX Polish + Semi-Monthly Frequency Bug Fixes + Reports & Export Feature + Custom Bill Categories + Credit Card Cash Flow Forecasting + Debt Payoff Planner + User Settings Currency Support + Quotes Feature + Lifetime Deal + Pricing Updates + Comparison Pages + YNAB Import + Import Recurring Entries + Quarterly/Annually Income Frequencies + Excel Import + 6 SEO Blog Posts + Landing Page Repositioning (Sacred Seven PM Review) + Gemini Market Research Integration (Docs + Marketing Content) + Gemini Pivot Analysis & Roadmap + Tax Reserve Calculator Tool + Float Comparison Page + Pulse Comparison Page + Landing Page Niche Messaging + AI-Powered Probabilistic Forecasting (Monte Carlo) + Simplified Navigation + AI Natural Language Queries ("Ask Cashcast") + Smart Categorization for Imports + Branding Refresh + Proactive AI Alerts + Income Pattern Forecasting + AI Recurring Pattern Detection for PDF Import + Automated Payment Reminders + Time Tracking + Invoicing + Referral Program + SMS/Push Low Balance Alerts + PocketSmith Comparison Page + Competitive Analysis Update + CurrencyInput Bug Fix + Desktop Sidebar Navigation + Tabbed Settings Interface + Full-Width Layout + Theme Toggle + **Dark Mode Only (Light Mode Disabled) + Combined Settings Forms + Calendar Redesign (Left Border Status) + Per-Income Tax Withholding**

**Current Focus:**

- **User acquisition via Twitter, Indie Hackers, Facebook Groups** (Reddit account unavailable)
- Direct outreach to freelancers on Twitter (5 DMs/day)
- Validate product-market fit before building new features
- Target: 50 active users, 5 paying customers, 3 testimonials

---

## Recent Development (Days 60-81)

### Day 81: SEO Content Expansion for Freelance Rate Keywords (May 14, 2026)

**SEO Analysis & Content Creation** - Analyzed Google Search Console data showing 743 impressions but 0 clicks for `/tools/freelance-rate-calculator` (avg position 68.7). Created comprehensive content to improve rankings.

**New Blog Posts Created (10 total):**

| Page | Target Keywords | Word Count |
|------|-----------------|------------|
| `/blog/how-to-calculate-freelance-rate` | "freelance rate calculator", "calculate freelance rate", "freelance pricing formula" | ~2,500 words |
| `/blog/ux-designer-hourly-rate` | "ux designer hourly rate", "freelance ux designer rates" | ~2,000 words |
| `/blog/web-developer-hourly-rate` | "web developer hourly rate", "freelance developer rates" | ~2,000 words |
| `/blog/graphic-designer-hourly-rate` | "graphic designer hourly rate", "logo design pricing" | ~2,000 words |
| `/blog/software-engineer-hourly-rate` | "software engineer hourly rate", "freelance developer rates" | ~2,000 words |
| `/blog/ml-consultant-hourly-rate` | "ml consultant hourly rate", "ai consultant rates" | ~2,000 words |
| `/blog/copywriter-hourly-rate` | "copywriter hourly rate", "freelance copywriter rates", "content writer rates" | ~2,000 words |
| `/blog/data-analyst-hourly-rate` | "data analyst hourly rate", "sql analyst rates", "tableau consultant rates" | ~2,000 words |
| `/blog/video-editor-hourly-rate` | "video editor hourly rate", "youtube editor rates", "motion graphics rates" | ~2,000 words |
| `/blog/photographer-hourly-rate` | "photographer hourly rate", "wedding photographer rates", "commercial photography rates" | ~2,000 words |

**SEO Elements per Page:**
- FAQ schemas (5 questions each)
- HowTo schema on rate calculation guide
- Article schema with speakable markup
- Rate tables by experience, specialization, location
- Project pricing guides
- CTAs linking to rate calculator tool

**Internal Linking Strategy:**
- Added cross-links between all 10 rate guide posts
- Each guide links to 4-6 related rate guides in Related Resources section
- Strengthens topical authority for freelance rate keywords

**Files Created:**
- `app/blog/how-to-calculate-freelance-rate/page.tsx`
- `app/blog/ux-designer-hourly-rate/page.tsx`
- `app/blog/web-developer-hourly-rate/page.tsx`
- `app/blog/graphic-designer-hourly-rate/page.tsx`
- `app/blog/software-engineer-hourly-rate/page.tsx`
- `app/blog/ml-consultant-hourly-rate/page.tsx`
- `app/blog/copywriter-hourly-rate/page.tsx`
- `app/blog/data-analyst-hourly-rate/page.tsx`
- `app/blog/video-editor-hourly-rate/page.tsx`
- `app/blog/photographer-hourly-rate/page.tsx`

**Files Modified:**
- `lib/blog/posts.ts` - Added 10 new blog post entries
- `app/sitemap.ts` - Increased rate calculator priority (0.6 → 0.9)
- All rate guide pages updated with internal cross-links

**Core Web Vitals & Schema Audit:**
- Images already optimized with Next.js Image (lazy loading, WebP, responsive sizes)
- HowTo schema already on 7 how-to blog posts
- FAQ schema on all 6 tool pages

**Expected Impact:**
- 10 entry points for "freelance rate" related keywords
- Build topical authority around freelance pricing
- Internal links to boost tool page rankings
- Target long-tail keywords for each profession

**Medium Priority SEO Fixes (same day):**
- Added canonical URLs to 7 pages missing them:
  - `/privacy`, `/terms`, `/glossary`
  - 4 blog posts: import-bank-transactions-excel, lifetime-deal-no-subscription, export-cash-flow-data-tax-season, migrate-from-ynab
- Verified RSS feed already properly implemented
- Verified breadcrumbs already on all tool pages
- Auth pages (`/auth/login`, `/auth/signup`) correctly set to `noindex`
- Improved image alt text across 4 files (logo images, scenario screenshot)

---

### Day 79: Light Mode Disabled + Settings UX + Calendar Redesign + Per-Income Tax Toggle (May 12, 2026)

**Light Mode Temporarily Disabled** - User testing revealed light mode had poor contrast, inconsistent styling, and readability issues. Disabled until properly fixed.

**Changes:**
- Hid Light and System options from theme settings (dark mode only)
- ThemeProvider now forces dark mode regardless of stored preference
- Simplified ThemeForm to show "Dark mode enabled" indicator only

**Combined Safety Buffer + Low Balance Alert Settings** - Per user feedback, these related settings were in different tabs (Preferences vs Notifications). Now combined into single form.

**New Component:** `SafetyBufferAlertForm`
- Safety buffer amount input with threshold preview
- Low balance alert toggle
- Single save action for both settings
- Removed separate LowBalanceAlertForm from Notifications tab

**Calendar Redesign (Option 1 Implemented)** - Reduced visual clutter per Karim Mousa feedback. Selected Option 1 (left border status indicator) over Option 4 (minimal two-line cards).

**Changes:**
- Removed background color variations (now neutral zinc-800 for all cards)
- Left border (4px) indicates status: green/yellow/orange/red
- Transaction details shown only on active days
- Clean, consistent styling reduces cognitive load
- Removed demo page after decision

**Per-Income Tax Withholding Toggle** - Instead of slowing onboarding with tax questions, added per-income source toggle.

**Changes:**
- New `taxes_withheld` column in income table
- "Taxes already withheld" toggle in new/edit income forms
- W-2/salary income: User checks toggle (taxes already deducted by employer)
- Freelance/contractor income: Leave unchecked
- Safe to Spend calculation reserves estimated tax for pre-tax income
- Tax amount = pre-tax income in next 14 days × user's tax rate from Settings

**Database Migration:**
- `20260512000001_add_income_taxes_withheld.sql` - Adds `taxes_withheld` boolean column

**Files Created:**
- `components/settings/safety-buffer-alert-form.tsx` - Combined settings form
- `supabase/migrations/20260512000001_add_income_taxes_withheld.sql` - Tax toggle migration

**Files Modified:**
- `components/settings/theme-form.tsx` - Simplified to dark-only indicator
- `components/theme/theme-provider.tsx` - Force dark mode
- `components/settings/settings-content.tsx` - Use combined form, remove LowBalanceAlertForm
- `components/calendar/day-card.tsx` - Option 1 redesign (left border status)
- `app/dashboard/income/new/page.tsx` - Added taxes_withheld toggle
- `app/dashboard/income/[id]/edit/page.tsx` - Added taxes_withheld toggle
- `app/dashboard/page.tsx` - Pass taxRate to generateCalendar
- `lib/calendar/generate.ts` - Accept taxRate param, reserve tax in Safe to Spend
- `lib/calendar/calculate-income.ts` - Include taxes_withheld in occurrences
- `lib/calendar/types.ts` - Added taxes_withheld to Transaction interface
- `types/supabase.ts` - Added taxes_withheld to income types

**Files Removed:**
- `app/dashboard/calendar-demo/page.tsx` - Demo no longer needed

**Feedback Doc Updated:**
- All 7 items from Karim Mousa feedback now marked as **DONE**

---

### Day 78: User Feedback Review & Implementation - Karim Mousa (May 11, 2026)

**Codebase audit against user feedback** - Reviewed all feedback items from Karim Mousa's user testing session and implemented fixes.

**Feedback Status Summary:**

| Item | Initial Status | Final Status |
|------|----------------|--------------|
| AI Chat Pro-only | Resolved | **Confirmed** - Lock icon + upgrade prompt for free users |
| Navigation simplification | In progress | **Resolved** - Sidebar with sections, lock icons, upgrade CTA |
| Dashboard via logo click | In progress | **Resolved** - Logo links to `/dashboard` |
| Settings organization | Not implemented | **Implemented** - Tabs + combined Safety Buffer/Alert form (Day 79) |
| Emergency fund exclusion | Not implemented | **Implemented** - Full exclusion from spendable balance + UI improvements |
| Calendar flip cards | Not implemented | **Demo created** - `/dashboard/calendar-demo` with 2 options, pending decision |
| "When can I afford it?" | Not implemented | **Implemented** - Context-aware messaging + first affordable date |
| Tax in onboarding | Not implemented | **Not implemented** - No income type (salary vs contractor) question |

**Emergency Fund Feature - Full Implementation:**
- Emergency fund account excluded from `startingBalance` in calendar generation
- "Safe to Spend" tooltip updated to mention emergency fund exclusion (desktop + mobile)
- Quick "Set as Emergency Fund" button shows on all non-credit-card accounts (not just savings)
- Edit Account page now has toggle to add/remove emergency fund designation
- Settings page shows read-only emergency fund account with link to Accounts page
- Server-side validation prevents credit cards from being set as emergency fund

**"Can I Afford It?" Improvements:**
- Context-aware messaging (different text for already-negative vs would-go-negative)
- "When can I afford it?" shows first affordable date with income context (e.g., "after Salary on Jun 19")
- Server action finds the income that makes the date affordable and returns reason
- Impact preview only shows expense dates (not empty/unchanged days)
- Fixed messaging when lowest balance date is before expense date (shows expense impact instead)
- Amount input now uses CurrencyInput with comma formatting (e.g., "5,100" instead of "5100")
- Fixed sampling bug that skipped days 14-29 when checking future dates
- Fixed saved scenarios showing wrong recurring status (used form state instead of saved data)

**Emergency Fund Bug Fixes:**
- Fixed: Changing account type from credit card required saving before setting emergency fund
- Fixed: Changing emergency fund account to credit card now auto-clears emergency fund designation
- Added extra safety check in onChange handler to prevent server validation errors

**Files Created:**
- None

**Files Modified:**
- `components/calendar/sticky-header.tsx` - Added emergency fund note to Safe to Spend tooltips
- `components/accounts/account-card.tsx` - Show button on all non-credit-card accounts
- `components/settings/emergency-fund-form.tsx` - Made account dropdown read-only
- `app/dashboard/accounts/[id]/edit/page.tsx` - Added emergency fund toggle, save-first requirement for type changes, auto-clear on CC conversion
- `lib/actions/update-emergency-fund.ts` - Added clearEmergencyFund, credit card validation
- `components/scenarios/scenario-result.tsx` - Context-aware messaging, relevant date display when lowest is before expense
- `components/scenarios/scenario-modal.tsx` - Fixed saved scenarios recurring display, CurrencyInput for amount field
- `lib/actions/scenarios.ts` - Fixed sampling logic, added nextAffordableReason with income context
- `docs/feedback-karim-mousa.md` - Updated all status fields
- `docs/product-brief.md` - Updated sections 7 and 15 with new features

---

### Day 77: Desktop Sidebar Navigation + Tabbed Settings + Layout Improvements (May 10, 2026)

**Major UX Overhaul: Sidebar Navigation** - Replaced the horizontal top navigation with a collapsible left sidebar on desktop to better expose Pro features and improve navigation discoverability.

**Tabbed Settings Interface** - Reorganized the Settings page from a long scrolling list into a clean tabbed interface.

| Tab | Contents |
|-----|----------|
| **Profile** | Email, Member Since, Password |
| **Preferences** | Theme toggle (Light/Dark/System), Currency, Timezone, Safety Buffer, Categories |
| **Notifications** | Email Digest, Low Balance Alert, Notification Channels, Auto Reminders (Pro) |
| **Invoicing** | Stripe Connect (Pro), Invoice Branding, Tax Settings, Emergency Fund |
| **Billing** | Subscription Status, Danger Zone |

**Theme Toggle** - Added Light/Dark/System theme support infrastructure with:
- `ThemeProvider` context with localStorage persistence
- Class-based dark mode in Tailwind config
- Theme toggle buttons in Preferences tab

**Full-Width Dashboard Layout** - Changed from centered content (`max-w-6xl mx-auto`) to full-width layout based on user testing. Content now fills available space instead of floating in the center.

**Sidebar Optimizations** - Fixed scrollbar overflow on laptop screens:
- Hidden scrollbar visually (CSS `scrollbar-hide`)
- Reduced nav item padding (`py-2.5` → `py-2`)
- Removed duplicate Settings link (already in user dropdown)
- Merged PRO section into TOOLS for Pro users (no separate section needed)
- All Pro features now show lock icons for free users within TOOLS section

**Bug Fixes:**
- Fixed Feedback FAB overlapping sidebar (now positioned dynamically based on sidebar width)
- Fixed sidebar nav items not clickable when expanded (tooltip wrapper issue)

**Files Created:**
```
components/settings/settings-tabs.tsx      # Tab navigation with URL state
components/settings/settings-content.tsx   # Tab content wrapper
components/settings/theme-form.tsx         # Light/Dark/System toggle
components/theme/theme-provider.tsx        # Theme context + localStorage
```

**Files Modified:**
- `app/dashboard/layout.tsx` - Added ThemeProvider
- `app/dashboard/settings/page.tsx` - Uses new tabbed layout
- `components/dashboard/sidebar/sidebar.tsx` - Optimized nav structure
- `components/dashboard/sidebar/sidebar-nav-item.tsx` - Reduced padding, fixed click
- `components/dashboard/sidebar/sidebar-content-wrapper.tsx` - Full-width layout
- `components/feedback/feedback-button.tsx` - Dynamic positioning for sidebar
- `tailwind.config.ts` - Added `darkMode: 'class'`

---

**Previous Day 77 Updates:**

**User Value:**
- All 14 navigation items visible at once (no more "More" dropdown hiding 7 items)
- Pro features clearly visible with lock icons for free users
- Collapsible sidebar (icons-only mode) for more content space
- Persistent "Upgrade to Pro" CTA for free users
- Mobile experience unchanged (bottom nav + top user dropdown)

**Sidebar Structure:**
```
CASHCAST (logo + collapse toggle)

Dashboard
Calendar

── MONEY ──
Accounts
Income
Bills
Transfers

── TOOLS ──
Invoices (PRO badge)
Time Tracking (PRO badge)
Import

── PRO ── (for free users)
Insights (locked)
Debt Payoff (locked)
Quotes (locked)
Reports (locked)
Ask AI (locked)

[Afford it?] button
[Upgrade to Pro] CTA
Settings
User Profile
```

**Technical Implementation:**

| Component | Purpose |
|-----------|---------|
| `SidebarProvider` | React Context for collapse state + localStorage persistence |
| `Sidebar` | Main sidebar with nav items, sections, user profile |
| `SidebarNavItem` | Individual nav link with Pro badges/lock icons |
| `SidebarSection` | Section headers (MONEY, TOOLS, PRO) |
| `SidebarUpgrade` | Upgrade CTA for free users |
| `SidebarUser` | User profile dropdown at bottom |
| `SidebarTooltip` | Hover tooltips for collapsed mode |
| `SidebarContentWrapper` | Responsive content wrapper that adjusts margin |
| `SidebarTopBar` | Timer widget bar for Pro users |
| `MobileNav` | Extracted mobile navigation (unchanged) |

**Files Created (10 new files):**
```
components/dashboard/sidebar/
├── index.ts                    # Barrel export
├── sidebar-context.tsx         # Collapse state + localStorage
├── sidebar-tooltip.tsx         # Hover tooltips
├── sidebar-nav-item.tsx        # Nav link with Pro badges/locks
├── sidebar-section.tsx         # Section headers
├── sidebar-upgrade.tsx         # Upgrade CTA
├── sidebar-user.tsx            # User profile dropdown
├── sidebar-content-wrapper.tsx # Responsive content wrapper
└── sidebar.tsx                 # Main sidebar component

components/dashboard/mobile-nav.tsx  # Extracted mobile navigation
```

**Files Modified:**
- `app/dashboard/layout.tsx` - Uses new sidebar + mobile nav components
- `lib/posthog/events.ts` - Added 'sidebar' as upgrade click location

**Files Removed:**
- `components/dashboard/nav.tsx` - Replaced by sidebar + mobile-nav

**Key Features:**
- **Collapsible**: Toggle to icons-only mode, persists in localStorage
- **Pro feature visibility**: Free users see locked features with lock icons
- **Upgrade CTA**: Persistent button in sidebar for free users
- **"Afford it?"**: Now a dedicated button in sidebar
- **Responsive top bar**: Timer widget adjusts when sidebar collapses
- **Mobile unchanged**: Bottom nav + top user dropdown remain the same

**Dimensions:**
- Expanded: 240px (`w-60`)
- Collapsed: 64px (`w-16`)
- Transition: 200ms smooth animation

**Why Sidebar Over Top Nav:**
- Sacred Seven PM review identified feature overload and identity crisis
- 14 nav items couldn't fit in horizontal nav (7 hidden in "More" dropdown)
- Pro features were buried and not driving upgrades
- Sidebar allows visual grouping and Pro feature prominence

---

### Day 76: PocketSmith Comparison Page + Competitive Analysis Update + CurrencyInput Bug Fix (May 8, 2026)

**Bug Fix: CurrencyInput "Cannot Delete First Digit"** - Fixed a critical UX bug where users couldn't delete the first/last digit in currency input fields across all edit forms.

**Problem:**
- In edit forms (Edit Bill, Edit Income, Edit Account, Edit Transfer, etc.), users could delete trailing digits but not the first digit
- Example: If value was "100", user could delete to "10" then "1", but couldn't clear the "1"
- Root cause: The `useEffect` that synced display value from parent's `value` prop was overwriting user input while editing

**Solution:**
- Added `isFocused` state to track when user is actively editing
- Modified `useEffect` to skip syncing from parent when input is focused
- Added `onFocus`/`onBlur` handlers to toggle focus state
- Properly destructured handlers from props to preserve any existing callbacks

**Files Modified:**
- `components/ui/currency-input.tsx` - Added focus tracking to prevent prop sync during editing

**Forms Fixed (20+ files):**
- Edit Bill, Edit Income, Edit Account, Edit Transfer
- New Bill, New Income, New Account, New Transfer
- Edit/New Invoice, Edit/New Quote
- Safety Buffer form, Payment Simulator, Debt Payoff Planner
- Onboarding forms, and all other CurrencyInput usages

---

**Major Update: Competitive Positioning Overhaul** - Added PocketSmith comparison page and updated all competitive analysis docs to reflect that forward-looking forecasting is no longer a unique differentiator.

**Context:**
- PocketSmith (founded 2008) offers calendar-based forecasting up to 30 years, with 12,000+ bank connections
- Quicken Simplifi entered at $5.99/mo with 12-month forecasting (April 2026)
- "Forward-looking" is now commoditized — must differentiate on freelancer-specific features

**PocketSmith Comparison Page:**

New page at `/compare/pocketsmith` targeting freelancers evaluating PocketSmith alternatives.

**Key Differentiators vs PocketSmith:**

| Feature | Cashcast | PocketSmith |
|---------|----------|-------------|
| Price (entry) | $7.99/mo (20% cheaper) | $9.95/mo |
| Built for freelancers | ✅ Core focus | ❌ Generic budgeting |
| Invoicing → forecast sync | ✅ Runway Collect | ❌ No |
| Tax bucketing (US + CA) | ✅ GST/HST, CPP, quarterly | ❌ No |
| "Safe to Spend" metric | ✅ Core feature | ❌ No |
| Setup time | 5 minutes | 30+ minutes (steep curve) |
| Lifetime deal | $99 one-time | ❌ Not available |

**SEO:**
- Target keywords: `pocketsmith alternative`, `pocketsmith for freelancers`, `cheaper than pocketsmith`, `pocketsmith vs cashcast`, `pocketsmith canadian tax`
- FAQ schema with 5 questions
- Dynamic OG image (1200×630, two-column comparison layout)

**Files Created:**
```
app/compare/pocketsmith/
├── page.tsx                    # Full comparison page
└── opengraph-image.tsx         # Dynamic OG image
```

**Files Modified:**
- `components/landing/footer.tsx` - Added "vs PocketSmith" link to Compare section
- `app/compare/page.tsx` - Added PocketSmith card to compare index
- `app/sitemap.ts` - Added `/compare/pocketsmith` URL

**Competitive Analysis Updates:**

Updated all strategy docs to reflect that "forward-looking" is no longer a unique wedge.

**docs/competitors.md changes:**
- Added PocketSmith and Quicken Simplifi to main competitors table
- Added detailed profiles for both competitors
- Updated feature comparison matrix (now includes PocketSmith, Simplifi)
- Rewrote "Our Positioning" section — removed "forward-looking" as primary differentiator
- Added "Recent Market Shifts (Q1-Q2 2026)" section documenting competitive changes
- Updated decision log with May 2026 entries

**docs/product-brief.md changes:**
- Updated competitive comparison table (added PocketSmith, Simplifi columns)
- Rewrote "Why We Win" section — lead with freelancer-specific features
- Added "Recent Market Shifts" section
- Added "Competitive Response Priorities" to Future Roadmap

**New Positioning Strategy:**

**OLD:** "Forward-looking instead of backward-looking"
**NEW:** "Cash flow forecasting built for freelancers — with invoicing and tax tooling that general budgeting apps lack"

**What's Still Unique:**
1. Invoice-to-forecast sync (no competitor at <$15/mo)
2. Country-specific tax bucketing (US + Canada)
3. Freelancer-first irregular income handling
4. "Safe to Spend" after tax reserves

**What's No Longer Unique:**
- Forward-looking forecasting (PocketSmith, Simplifi, CFF all have it)
- Calendar view (PocketSmith has this too)
- Scenario planning (PocketSmith has what-if)

**Suggested Commits:**
- `feat: add PocketSmith comparison page with OG image`
- `docs: update competitive analysis with PocketSmith and Quicken Simplifi`

---

### Day 75: SMS/Push Low Balance Alerts (May 4-5, 2026)

**Major Feature: Multi-Channel Notifications** - Added SMS and Web Push notification channels for critical alerts. Users can now receive low balance warnings via SMS (Twilio) and browser push notifications in addition to email.

**User Value:**
- Receive immediate SMS alerts for cash crunch warnings (Pro feature, critical alerts only)
- Enable browser push notifications for all alert types (free for all users)
- Phone number verification via 6-digit SMS code
- Control notification preferences in Settings

**Architecture:**

| Channel | Provider | Cost | Use Case | Tier |
|---------|----------|------|----------|------|
| Email | Resend | ~$0.001/msg | All notifications (default) | All |
| SMS | Twilio | ~$0.0075/msg | Critical alerts only (cash crunch) | **Pro only** |
| Push | Web Push API | Free | All alert types | All |

**May 5 Update: SMS is now Pro-only** - Due to per-message costs (~$0.0075/SMS), SMS alerts are restricted to Pro, Premium, and Lifetime subscribers. Free users see an "Upgrade to Pro" prompt. Push notifications remain free for all users.

**Notification Flow:**
```
Low Balance Detected (cron job)
    ↓
Check user notification settings
    ↓
Send Email (existing, always enabled)
    ↓
If Pro subscriber + SMS enabled + phone verified + critical alert:
    → Send SMS via Twilio
    ↓
If Push enabled + subscribed:
    → Send Push notification (all users)
```

**Database Migration (`20260504000003_add_notification_channels.sql`):**
```sql
-- SMS settings
sms_alerts_enabled BOOLEAN DEFAULT false,
phone_number VARCHAR(20),
phone_verified BOOLEAN DEFAULT false,
phone_verification_code VARCHAR(6),
phone_verification_expires_at TIMESTAMPTZ,

-- Push settings
push_alerts_enabled BOOLEAN DEFAULT false,
push_subscription JSONB
```

**Files Created (16 new files):**
```
lib/sms/
├── types.ts              # SMS result types
├── twilio.ts             # Twilio client setup
├── send-sms.ts           # SMS sending + phone validation
├── verify-phone.ts       # 6-digit code verification flow
└── index.ts              # Exports

lib/push/
├── types.ts              # Push subscription types
├── vapid.ts              # VAPID key configuration
├── send-push.ts          # Send push notifications
├── subscribe.ts          # Subscription management
└── index.ts              # Exports

lib/notifications/
├── types.ts              # Notification channel types
├── router.ts             # Unified notification router
└── index.ts              # Exports

app/api/sms/
├── send-verification/route.ts   # Send verification code
└── verify/route.ts              # Verify code

app/api/push/
└── subscribe/route.ts           # Manage push subscriptions

public/sw.js                     # Service worker for push
components/settings/notification-channels-form.tsx
supabase/migrations/20260504000003_add_notification_channels.sql
```

**Files Modified:**
- `app/dashboard/settings/page.tsx` - Added NotificationChannelsForm
- `lib/email/send-low-balance-alert.ts` - Added SMS/Push sending after email
- `docs/feature-ideas/prioritized-features-roadmap.md` - Updated statuses

**Dependencies Added:**
```json
"twilio": "^5.x",
"web-push": "^3.x",
"@types/web-push": "^3.x"
```

**Environment Variables Required:**
```
TWILIO_ACCOUNT_SID=xxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE_NUMBER=+1234567890
NEXT_PUBLIC_VAPID_PUBLIC_KEY=xxx
VAPID_PRIVATE_KEY=xxx
VAPID_SUBJECT=mailto:support@cashcast.io
```

**Roadmap Updates:**
- AI Recurring Detection (PDF) marked as ✅ DONE (was already implemented)
- SMS/Push Low Balance Alerts marked as 🚧 In Progress

---

### Day 74: Referral Program Bug Fixes (May 4, 2026)

**Critical Bug Fixes** - Fixed 4 bugs preventing the referral program from working correctly in production.

**Bugs Fixed:**

| Bug | Problem | Fix |
|-----|---------|-----|
| sessionStorage persistence | Email verification opens in new tab, sessionStorage is per-tab | Changed to localStorage |
| UNIQUE constraint violation | Claiming tried to INSERT a new row with same referral_code | Changed to UPDATE existing row |
| Anonymous code validation | RLS policies required auth for SELECT, blocking `/r/[code]` | Added public SELECT policy |
| Missing UPDATE policy | UPDATE operations were blocked by RLS | Added UPDATE policy for claiming |

**Database Migrations Added:**
```
20260504000001_referral_update_policy.sql   # UPDATE policy for claiming
20260504000002_referral_public_select.sql   # Public SELECT for validation
```

**Files Modified:**
- `app/auth/signup/page.tsx` - sessionStorage → localStorage
- `app/auth/oauth-success/page.tsx` - sessionStorage → localStorage
- `lib/actions/referrals.ts` - INSERT → UPDATE for claiming
- `components/dashboard/dashboard-content.tsx` - Fallback claim on dashboard visit

**Testing Verified:**
- [x] Anonymous user can click referral link and see signup banner
- [x] Email verification flow preserves referral code
- [x] Referral code successfully claimed (status = 'signed_up')
- [x] referee_id correctly set in database

**Documentation Updated:**
- `docs/REFERRAL-PROGRAM.md` - Complete rewrite with bug fixes
- `docs/feature-ideas/referral-program.md` - Added bug fixes section

**Commits:**
- `863e62a` fix: referral code claim now works for email signup
- `d94ddc4` fix: add fallback referral claim on dashboard visit
- `9ce2a3a` fix: use UPDATE instead of INSERT for referral claiming
- `954a6a9` fix: rename duplicate updateError variable to claimError
- `43d8c9d` fix: allow anonymous users to validate referral codes
- `780dd97` docs: update referral program documentation with bug fixes

---

### Day 73: Referral Program Implementation (May 3, 2026)

**Major Feature: Referral Program** - Complete referral system where users can invite friends and earn rewards when those friends become paying customers.

**User Value:**
- Share unique referral link with friends
- Friends get 30-day Pro trial when signing up
- Earn 1 month free Pro when friends subscribe
- Track referral stats on dashboard (signed up, subscribed, rewards)

**Rewards Structure:**

| Party | Reward | Trigger |
|-------|--------|---------|
| Referrer | 1 month free Pro | Referee subscribes to Pro |
| Referee | 30-day Pro trial | Signs up via referral link |

**Referral Flow:**
```
User shares link: cashcast.io/r/ABC123XY
    ↓
Friend clicks link → redirects to /auth/signup?ref=ABC123XY
    ↓
Friend sees banner: "Get 30 days of Pro free"
    ↓
Friend signs up (email or Google OAuth)
    ↓
Referral code claimed and stored
    ↓
When friend subscribes → 30-day trial applied automatically
    ↓
Stripe webhook triggers → referrer rewarded
```

**Reward Logic (Webhook):**
- **Lifetime users**: Marked as rewarded (already have max benefits)
- **Pro subscribers**: Add 1-month Stripe credit to balance
- **Free users**: Grant 30-day Pro access directly in database

**Database Migration (`20260503000001_add_referrals.sql`):**
```sql
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  referral_code VARCHAR(8) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'signed_up', 'converted', 'rewarded')),
  reward_given BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  signed_up_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ,
  rewarded_at TIMESTAMPTZ
);

-- Add referred_by_code to user_settings
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS referred_by_code VARCHAR(8);
```

**Files Created:**
```
supabase/migrations/20260503000001_add_referrals.sql
lib/referrals/
├── types.ts              # TypeScript types (ReferralStats, ReferralCodeResult)
├── generate-code.ts      # 8-char code generation (no confusing chars)
└── index.ts              # Exports
lib/actions/referrals.ts  # Server actions (getOrCreateReferralCode, getReferralStats, validateReferralCode, claimReferralCode)
app/api/referrals/claim/route.ts    # POST endpoint for claiming codes
app/r/[code]/page.tsx               # Referral landing page with SEO metadata
components/dashboard/referral-widget.tsx  # Dashboard widget with copy button, stats
```

**Files Modified:**
- `app/auth/signup/page.tsx` - Read `?ref=` param, show referral banner, store code
- `app/auth/oauth-success/page.tsx` - Claim referral code after auth
- `lib/actions/stripe.ts` - Apply 30-day trial for referred users at checkout
- `app/api/webhooks/stripe/route.ts` - Handle referral conversion, reward referrer
- `components/dashboard/dashboard-content.tsx` - Display referral widget
- `app/dashboard/page.tsx` - Fetch referral stats

**Dashboard Widget Features:**
- Unique referral link with copy button
- Stats: Signed up, Subscribed, Rewards earned
- Pending rewards banner when friends have converted
- Expandable "How it works" section

**Edge Cases Handled:**
| Scenario | Handling |
|----------|----------|
| Self-referral | Blocked in claim API |
| Reuse code | Each user can only use one code ever |
| Invalid code | Graceful redirect to signup without code |
| OAuth flow | Code stored in sessionStorage, claimed after OAuth |
| Referrer on free tier | Grant 30-day Pro directly in database |

**Commits:**
- `8f9684d` feat: implement referral program with rewards system
- `943c9a4` chore: regenerate Supabase types and remove type assertions

---

### Day 72: Currency Bug Fixes & UX Improvements (May 1, 2026)

**Bug Fixes: Currency Symbol Support** - Fixed hardcoded $ symbols across 12 components to properly use user's currency preference.

**Components Fixed:**
| Component | Fix |
|-----------|-----|
| `debt-payoff-planner.tsx` | Added `getCurrencySymbol(currency)` |
| `variability-calculator-form.tsx` | Added currency prop |
| `calculator-form.tsx` | Added currency prop (4 occurrences) |
| `tax-calculator-form.tsx` | Added currency prop (2 occurrences) |
| `payment-predictor-form.tsx` | Added currency prop |
| `rate-calculator-form.tsx` | Added currency prop (2 occurrences) |
| `scenario-modal.tsx` | Used existing currency state |
| `tax-settings-form.tsx` | Added currency prop |
| `transaction-selector.tsx` | Added currency param to formatCurrency |
| `recurring-patterns-card.tsx` | Added currency param to formatCurrency |

**UX Improvements:**
- Improved onboarding form layout for laptop screens (2-column layout)
- Added "Add Income" and "Add Expense" buttons to calendar day modal
- Pre-fill date when adding income/expense from calendar

**Code Quality:**
- Removed debug console.log from email-verification-banner.tsx

**Commits:**
- `fix: use proper currency symbols throughout the app`
- `fix: add currency support to tools and import components`
- `chore: remove debug console.log from email verification banner`
- `feat: improve onboarding UX and add calendar expense shortcut`
- `feat: add income button to calendar day modal`

---

### Day 70: Time Tracking + Invoicing & Automated Payment Reminders (April 29, 2026)

**Major Feature: Time Tracking + Invoicing** - Complete time tracking system with persistent timer, manual entry, and seamless invoice integration.

**User Value:**
- Track billable hours with one-click timer in header
- Manual time entry for retroactive logging
- Filter entries by client, date range, invoiced status
- Create itemized invoices directly from time entries
- See uninvoiced time on dashboard for quick action
- Professional PDF invoices with line items table

**Timer Widget:**
- Persistent timer in dashboard header
- Start/Stop/Reset controls
- Project name input
- localStorage persistence across navigation
- Auto-saves entry when stopped

**Time Entries Page (`/dashboard/time`):**
| Component | Purpose |
|-----------|---------|
| Timer display | Current running timer status |
| Manual entry form | Add entries with project, client, duration, rate |
| Filters | Search, client dropdown, date range, invoiced status |
| Entry list | Grouped by date with selection for invoicing |
| Bulk actions | Create invoice from selected entries |

**Invoice Line Items:**
- New `invoice_items` table for itemized billing
- Line items editor in invoice creation form
- Simple/Itemized toggle for invoice type
- Auto-calculate line totals and invoice total
- PDF template updated with line items table

**Time → Invoice Flow:**
1. Select uninvoiced time entries (checkboxes)
2. Click "Create Invoice" button
3. Entries grouped by project + hourly rate
4. Pre-filled invoice form with line items
5. Create invoice → entries marked as invoiced

**Dashboard Widget:**
- Uninvoiced Time widget shows:
  - Total hours pending
  - Total amount pending
  - Entry count
  - Quick link to time page

**Database Migration (`20260429000001_add_time_tracking.sql`):**
```sql
-- time_entries table
CREATE TABLE time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_name VARCHAR(100) NOT NULL,
  client_name VARCHAR(100),
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  duration_minutes INTEGER,
  hourly_rate DECIMAL(10, 2) NOT NULL DEFAULT 0,
  is_billable BOOLEAN DEFAULT true,
  is_invoiced BOOLEAN DEFAULT false,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- invoice_items table (for line items)
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description VARCHAR(500) NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  time_entry_id UUID REFERENCES time_entries(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- user_time_settings table
CREATE TABLE user_time_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  default_hourly_rate DECIMAL(10, 2) DEFAULT 0,
  round_to_minutes INTEGER DEFAULT 1,
  default_billable BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Files Created:**
```
app/dashboard/time/
├── page.tsx                    # Time entries page (server)
├── time-page-client.tsx        # Client component wrapper
└── settings/
    └── page.tsx                # Time settings page

components/time/
├── timer-widget.tsx            # Header timer widget
├── timer-context.tsx           # Timer state provider
├── time-entry-list.tsx         # Entries list with selection
├── time-entry-row.tsx          # Single entry row with edit/delete
├── time-entry-form.tsx         # Manual entry form
├── time-filters.tsx            # Filter controls
└── time-settings-form.tsx      # Settings form

components/invoices/
└── invoice-line-items.tsx      # Line items editor (NEW)

components/dashboard/
└── uninvoiced-time-widget.tsx  # Dashboard widget

lib/time/
└── format-duration.ts          # Duration helpers (2h 15m)

lib/actions/
├── time-entries.ts             # Time CRUD + getUninvoicedSummary
└── time-settings.ts            # Settings CRUD
```

**Files Modified:**
- `app/dashboard/page.tsx` - Added uninvoicedTime data fetch
- `components/dashboard/dashboard-content.tsx` - Added UninvoicedTimeWidget
- `components/dashboard/nav.tsx` - Added Time to More dropdown + mobile menu
- `components/invoices/new-invoice-form.tsx` - Added line items support
- `lib/actions/invoices.ts` - Added createInvoiceWithLineItems
- `lib/pdf/invoice-template.tsx` - Added line items table rendering
- `app/api/invoices/[id]/pdf/route.ts` - Fetch and pass line items
- `app/dashboard/invoices/new/page.tsx` - Pre-fill from time entries

**Feature Gating:**
- Free tier: No access (upgrade prompt)
- Pro/Premium/Lifetime: Full access

---

**Major Feature: Automated Payment Reminders** - Automatically send payment reminder emails based on invoice due dates, reducing manual follow-up work.

**User Value:**
- Automated reminder sequence eliminates manual follow-up
- Reduces late payments with proactive client communication
- Configurable per-user and per-invoice settings
- Uses existing professional email templates

**Reminder Schedule:**
| Stage | Timing | Reminder Type |
|-------|--------|---------------|
| `pre_due_3` | 3 days before due | Friendly |
| `due_day` | On due date | Friendly |
| `overdue_7` | 7 days overdue | Firm |
| `overdue_14` | 14 days overdue | Final |

**Technical Implementation:**

New reminder engine in `lib/reminders/`:
- `types.ts` - Types, constants, and reminder stage definitions
- `scheduler.ts` - Determines which reminders are due for each invoice
- `sender.ts` - Sends auto-reminder emails using existing templates
- `index.ts` - Re-exports

New cron endpoint:
- `app/api/cron/invoice-reminders/route.ts` - Daily cron job (9 AM UTC)
- Bearer token auth via `CRON_SECRET`
- Processes users with `auto_reminders_enabled = true`
- Concurrent processing (5 users at a time)
- Unique index prevents duplicate reminders per stage

**Database Migration (`20260428000001_add_auto_reminders.sql`):**
```sql
-- User settings
ALTER TABLE user_settings ADD COLUMN auto_reminders_enabled BOOLEAN DEFAULT true;

-- Per-invoice override
ALTER TABLE invoices ADD COLUMN auto_reminders_enabled BOOLEAN DEFAULT NULL;

-- Reminder tracking
ALTER TABLE invoice_reminders ADD COLUMN source VARCHAR(10) DEFAULT 'manual';
ALTER TABLE invoice_reminders ADD COLUMN reminder_stage VARCHAR(20);

-- Prevent duplicate auto-reminders
CREATE UNIQUE INDEX idx_invoice_reminders_unique_auto_stage
ON invoice_reminders(invoice_id, reminder_stage) WHERE source = 'auto';
```

**Settings UI:**
- New `AutoRemindersForm` component in Settings page (Pro users only)
- Toggle to enable/disable automated reminders globally
- Shows reminder schedule with color-coded stages
- Server action: `lib/actions/update-auto-reminder-settings.ts`

**Files Created:**
- `supabase/migrations/20260428000001_add_auto_reminders.sql`
- `lib/reminders/types.ts`
- `lib/reminders/scheduler.ts`
- `lib/reminders/sender.ts`
- `lib/reminders/index.ts`
- `app/api/cron/invoice-reminders/route.ts`
- `lib/actions/update-auto-reminder-settings.ts`
- `components/settings/auto-reminders-form.tsx`

**Files Modified:**
- `vercel.json` - Added invoice-reminders cron at 9 AM UTC
- `app/dashboard/settings/page.tsx` - Added AutoRemindersForm for Pro users

---

### Day 69: AI Recurring Pattern Detection for PDF Import (April 24, 2026)

**Major Feature: AI Recurring Pattern Detection** - Automatically detect and suggest recurring patterns from imported bank statement transactions.

**User Value:**
- Automatically identifies subscriptions, bills, and recurring income from bank statement imports
- Pre-selects high-confidence patterns for one-click recurring setup
- Normalizes merchant names (40+ known merchants: Netflix, Spotify, AWS, etc.)
- Shows frequency detection (weekly to annually) with confidence scores
- Streamlines import workflow by suggesting recurring entries

**Detection Algorithm:**
- Groups transactions by similar description and amount (within 10% variance)
- Analyzes date intervals to detect frequency patterns
- Calculates confidence scores based on occurrences, amount consistency, interval regularity
- Suggests most common day of month for recurring entry scheduling

**Frequency Detection Thresholds:**
| Interval (days) | Detected Frequency |
|-----------------|-------------------|
| 5-9 | Weekly |
| 10-18 | Bi-weekly |
| ~15-20 | Semi-monthly |
| 25-35 | Monthly |
| 80-100 | Quarterly |
| 350-380 | Annually |

**UI Integration:**
- New `RecurringPatternsCard` component in PDF import flow
- Collapsible card showing detected patterns with:
  - Normalized merchant name
  - Amount and detected frequency
  - Occurrence count
  - Confidence badge (percentage)
  - Checkbox selection with pre-selected high-confidence (≥60%) patterns
- "Apply X Patterns" button to bulk-apply recurring settings
- Select all/none controls

**Technical Implementation:**

New detection engine in `lib/import/`:
- `recurring-detector.ts` - Core pattern detection with:
  - `normalizeDescription()` - Strips bank prefixes, normalizes 40+ merchants
  - `areSimilarDescriptions()` - Fuzzy matching with Jaccard similarity
  - `areSimilarAmounts()` - Amount comparison with 10% tolerance
  - `detectFrequency()` - Interval analysis with standard deviation check
  - `detectRecurringPatterns()` - Main algorithm returning sorted patterns
  - `createPatternSuggestions()` - Transaction-level pattern lookup

New UI components:
- `components/import/recurring-patterns-card.tsx` - Pattern selection UI
  - `PatternRow` - Individual pattern display with checkbox
  - `ConfidenceBadge` - Color-coded confidence indicator

**Integration with Existing Import:**
- Added to `pdf-import-page-client.tsx`:
  - `detectedPatterns` state for storing detected patterns
  - `appliedPatternIds` state for tracking applied patterns
  - `useEffect` to detect patterns when transactions change
  - `handleApplyPatterns()` handler to apply selected patterns
  - `RecurringPatternsCard` rendered in UI
- Modified `transaction-selector.tsx`:
  - Extended `NormalizedTransaction` type with `suggestedRecurring`
  - Added `appliedPatternIds` prop
  - `useEffect` to auto-apply frequency and action based on patterns

**Confidence Score Calculation:**
| Factor | Weight |
|--------|--------|
| Occurrences (≥6) | +0.4 |
| Low amount variance (<1%) | +0.3 |
| Consistent intervals (>90%) | +0.3 |

**Merchant Normalization Examples:**
- `NETFLIX.COM/BILL` → "Netflix"
- `SPOTIFY USA PREMIUM` → "Spotify"
- `AMAZON PRIME*1234` → "Amazon"
- `GOOGLE *YOUTUBE` → "Google Services"
- `ADOBE CREATIVE CLOUD` → "Adobe"

**Files Created:**
- `lib/import/recurring-detector.ts` - Core detection algorithm
- `components/import/recurring-patterns-card.tsx` - UI component

**Files Modified:**
- `components/import/pdf-import-page-client.tsx` - Integration with import flow
- `components/import/transaction-selector.tsx` - Pattern application to transactions

---

### Day 68: Income Pattern Forecasting (April 10, 2026)

**Major Feature: Income Pattern Forecasting** - AI-powered income pattern analysis for smarter probabilistic forecasts.

**User Value:**
- See 90-day income forecasts with confidence ranges (P10/P50/P90)
- Understand income patterns by client/source
- Detect seasonality and trends automatically
- Data quality indicator shows forecast reliability

**Dashboard Integration:**
- New Income Insights card with data quality badge
- 90-day forecast headline with range
- Monthly breakdown for next 3 months
- Trend indicator (growing/stable/declining)
- Link to full insights page

**Full Insights Page (`/dashboard/insights`):**
- Data quality explanation with features enabled at each level
- Overview stats grid (forecast, trend, sources, history)
- 90-day forecast chart with P10/P50/P90 confidence bands
- Seasonality section for quarterly patterns (6+ months data required)
- Income source breakdown with per-client metrics
- Debug section showing forecast calculation transparency

**Technical Implementation:**

New analysis engine in `lib/forecasting/`:
- `types.ts` - Core type definitions
- `source-grouping.ts` - Group income by client/source
- `metrics-calculator.ts` - Per-source statistics (CV, timing, frequency)
- `trend-analyzer.ts` - Linear regression trend detection
- `seasonality-detector.ts` - Quarterly pattern analysis
- `forecast-generator.ts` - Monte Carlo P10/P50/P90 forecasts
- `server.ts` - Main entry point

New UI components:
- `components/dashboard/income-insights-card.tsx` - Dashboard summary
- `components/insights/insights-content.tsx` - Full page content
- `components/insights/source-breakdown.tsx` - Per-client display
- `components/insights/seasonality-section.tsx` - Quarterly patterns
- `components/insights/forecast-chart.tsx` - Recharts P10/P50/P90 chart

**Data Quality Levels:**
| Months | Quality | Features |
|--------|---------|----------|
| < 3 | Basic | Default estimates |
| 3-6 | Moderate | Pattern detection |
| 6-12 | Good | Seasonality + trends |
| 12+ | Excellent | Full analysis |

**Navigation:**
- Added Insights link to More dropdown (first item)

---

### Day 67: Risk Filter for Invoices (April 10, 2026)

**Enhancement: Risk Filter** - Filter invoices by payment risk level in the invoices list.

**User Value:**
- Filter to see only high-risk invoices that need attention
- Focus on critical invoices first
- URL-persisted filters for bookmarking filtered views

**Implementation:**
- Added Risk to "+ Add filter" dropdown menu
- Multi-select dropdown with all 4 risk levels
- Color-coded icons matching risk badges (emerald/amber/orange/rose)
- Filter pills show active risk filters
- URL persistence (`?risk=high,critical`)

**Modified Files:**
- `components/invoices/invoices-filters.tsx` - Added riskLevels to filters, UI dropdown, URL persistence
- `components/invoices/invoices-content.tsx` - Updated filterInvoices to filter by risk level

**Bug Fixes:**
- Fixed division by zero in `scoreInvoiceAmount` when client has no invoice amount history
- Fixed null check for `invoice.due_date` to prevent parsing errors
- Fixed URL parsing of invalid risk levels (e.g., `?risk=` or `?risk=invalid`) to fall back to default

---

### Day 66: Proactive AI Alerts + Client Payment Risk Scoring (April 9, 2026)

**Major Feature: Proactive AI Alerts** - Rule-based alert engine that surfaces actionable insights before problems occur.

**User Value:**
- Get warned about cash crunches before they happen
- See bill collision alerts (3+ bills in 2-day window)
- Surface overdue and at-risk invoices automatically
- Spot opportunity windows when surplus is sustained

**Alert Types:**

| Type | Trigger | Priority |
|------|---------|----------|
| Cash Crunch | Balance < safety buffer within 14 days | Critical/Warning |
| Bill Collision | 3+ bills within 2-day window | Warning/Info |
| Invoice Risk | Overdue or due within 3 days | Critical/Warning |
| Opportunity | 7+ days with 2x safety buffer surplus | Opportunity |

**Technical Implementation:**
- Modular rule engine with pluggable alert rules
- Server-side generation during dashboard page load
- Integrated into weekly email digest with color-coded styling
- Replaced legacy warning banners with unified AlertBanner system
- Priority-based sorting (critical → warning → info → opportunity)
- Max 5 alerts to avoid overwhelming users

**New Files:**
- `lib/alerts/types.ts` - Alert type definitions
- `lib/alerts/rules/cash-crunch.ts` - Low balance detection
- `lib/alerts/rules/bill-collision.ts` - Bill clustering detection
- `lib/alerts/rules/invoice-risk.ts` - Overdue/at-risk invoices
- `lib/alerts/rules/opportunity.ts` - Surplus window detection
- `lib/alerts/engine.ts` - Alert rule orchestrator
- `components/alerts/alert-banner.tsx` - Collapsible alert UI

**Modified Files:**
- `app/dashboard/page.tsx` - Generate and pass alerts to client
- `components/dashboard/dashboard-content.tsx` - Display AlertBanner, removed legacy banners
- `lib/email/types.ts` - Added DigestAlert type
- `lib/email/generate-digest-data.ts` - Generate alerts for email digest
- `components/emails/weekly-digest.tsx` - Render proactive alerts in email

**Bug Fixes:**
- Fixed invoice count bug (dashboard showed 3 vs actual 11 overdue)
- Fixed bill collision balance calculation (was double-counting)
- Removed duplicate warning banners (AlertBanner replaces legacy)

**Major Feature: Client Payment Risk Scoring** - Predicts invoice payment timing based on client payment history.

**User Value:**
- See which clients are likely to pay late
- Get predicted payment dates based on historical patterns
- Risk badges on invoice list for quick visibility
- Better cash flow forecast accuracy

**Risk Level Thresholds:**

| Level | Score | Color | Expected Delay |
|-------|-------|-------|----------------|
| Low | 0-25 | Emerald | On time or early |
| Medium | 26-50 | Amber | 1-7 days late |
| High | 51-75 | Orange | 8-14 days late |
| Critical | 76-100 | Rose | 15+ days late |

**Risk Factor Weights:**
- Historical lateness: 40%
- Payment trend: 20%
- Invoice amount vs typical: 15%
- Payment rate: 15%
- Days since last payment: 10%

**New Files:**
- `lib/invoices/payment-risk/types.ts` - Type definitions and thresholds
- `lib/invoices/payment-risk/history.ts` - Client payment history aggregation
- `lib/invoices/payment-risk/scorer.ts` - Risk calculation engine
- `lib/invoices/payment-risk/index.ts` - Public exports

**Modified Files:**
- `components/invoices/invoices-content.tsx` - Added Risk column with badges

---

### Day 63: Smart Categorization for Imports (April 6, 2026)

**Major Feature: Smart Categorization** - Auto-categorize imported bank transactions using a hybrid rule-based + AI approach.

**User Value:**
- Netflix, Spotify automatically categorized as "Subscriptions"
- Comcast, T-Mobile automatically categorized as "Utilities"
- GEICO, State Farm automatically categorized as "Insurance"
- Unknown merchants categorized by AI with confidence indicators
- Users can override any suggestion before importing

**Technical Implementation:**

| Component | Description |
|-----------|-------------|
| **Rule Engine** | ~50 merchant patterns, priority-based matching |
| **AI Fallback** | Claude Sonnet for unrecognized transactions |
| **Tier Limits** | Free: 10, Pro/Premium/Lifetime: 50 AI categorizations |
| **Confidence Badges** | Auto (rule), Likely (AI medium), Guess (AI low) |

**Category Patterns:**

| Category | Example Merchants |
|----------|-------------------|
| Subscriptions | Netflix, Spotify, Adobe, Disney+, HBO Max |
| Utilities | Comcast, T-Mobile, Verizon, PG&E, Duke Energy |
| Insurance | GEICO, State Farm, Blue Cross, Aetna |
| Rent/Mortgage | Rocket Mortgage, Greystar, Zillow Rent |
| Transportation | Uber, Lyft, Shell, Exxon, EZPASS |

**New Files:**
- `lib/categorization/types.ts` - Type definitions (CategorySuggestion, CategorizationRule, etc.)
- `lib/categorization/rules.ts` - ~50 merchant patterns organized by category
- `lib/categorization/rule-engine.ts` - Pattern matching with priority ordering
- `lib/categorization/ai-categorize.ts` - Claude API integration with batch processing
- `lib/categorization/index.ts` - Exports and orchestration (categorizeTransactions, mergeSuggestions)
- `app/api/categorize/route.ts` - API endpoint with auth, validation, tier limits

**Modified Files:**
- `components/import/import-page-client.tsx` - Added categorization useEffect, AI loading state
- `components/import/transaction-selector.tsx` - Added Category column with confidence badges

**Bug Fixes (during implementation):**
- Rules now use proper category names instead of hardcoded "Other"
- AI categorization processes first N transactions when over limit (was skipping entirely)
- API validates transaction structure to prevent malformed prompts

---

### Day 63: Branding Refresh (April 6, 2026)

**Updated all branding assets** with new Cashcast visual identity.

**New Assets:**
- `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png` - Browser favicons
- `apple-touch-icon.png` - iOS home screen icon (180px)
- `icon-192x192.png`, `icon-512x512.png` - PWA icons
- `cashcast-lockup.svg` - Horizontal logo for dark backgrounds
- `cashcast-lockup-light-bg.svg` - Horizontal logo for light backgrounds

**Updated Files:**
- `app/layout.tsx` - New favicon and apple-touch-icon meta tags
- `app/dashboard/layout.tsx` - SVG lockup replaces text logo
- `components/landing/landing-header.tsx` - SVG lockup replaces icon + text
- `components/seo/schemas.tsx` - Updated organization logo URL
- `public/manifest.json` - PWA icons (192x192, 512x512) with maskable purpose

**Removed:**
- `public/Old-logo.png`
- `public/cashcast-lockup-dark.png`
- `public/cashcast-logo-horizontal.svg`
- `public/icon-512x512-optimized.png`

---

### Day 63: Landing Page AI Feature Coverage (April 6, 2026)

**Updated landing page to showcase all three AI features:** Monte Carlo forecasting, Ask Cashcast, and Smart Categorization.

**Hero Section:**
- Added "AI-powered insights" badge with violet styling
- Added new tagline: "Ask questions in plain English. AI answers instantly."

**How it Works Section:**
- Step 3 updated: "AI-powered confidence bands showing your risk of running low"
- Updated HowTo schema for SEO consistency

**Features Section:**
- New "AI-Powered Features" row with violet color scheme
- **Ask Cashcast** card: Natural language queries, 5 free/day, unlimited Pro
- **Know Your Risk** card: Monte Carlo P10/P50/P90 bands, overdraft probability
- **Auto-Categorize Imports** card: 50+ patterns, AI fallback, confidence badges

**Pricing Section:**
- Free tier: Added AI risk analysis, 5 AI queries/day, 10 auto-categorizations/import
- Pro tier: Added unlimited AI queries, 50 auto-categorizations/import

**FAQ Section (5 new items):**
- "What is Ask Cashcast?"
- "What can I ask Cashcast?"
- "What are confidence bands?"
- "How does auto-categorization work?"
- "Is my financial data used to train AI?"
- Updated "Free vs Pro" FAQ with AI feature differences

**Files Modified:**
- `app/page.tsx` - Hero, How it Works, Features sections
- `components/pricing/pricing-section.tsx` - Tier feature lists
- `components/landing/faq-section.tsx` - 5 new AI FAQs

---

### Day 63: AI-Powered Weekly Digest Insights (April 6, 2026)

**Enhanced weekly email digest with AI-generated personalized insights** using Claude.

**What's New:**
- 2-3 personalized insights per email based on user's financial data
- Insights are actionable and encouraging (not alarmist)
- Graceful fallback to rule-based insights if AI fails
- Violet-themed "AI Insights" section in email

**Example Insights:**
- "Great week ahead! You're projected to be $450 in the green."
- "Your Netflix and Spotify both hit on Tuesday—consider spacing them out."
- "With no bills due, this is a perfect week to boost your emergency fund."

**Technical Implementation:**
- Uses Claude Sonnet for insight generation
- Falls back to rule-based defaults on error
- Non-blocking: digest still sends even if AI fails

**New Files:**
- `lib/email/generate-ai-insights.ts` - AI insight generator with fallback

**Modified Files:**
- `lib/email/generate-digest-data.ts` - Added aiInsights field and generation
- `components/emails/weekly-digest.tsx` - Added AI insights section to template

---

### Day 63: Ask Cashcast Suggested Questions (April 6, 2026)

**Added clickable suggested questions to Ask Cashcast modal** - Helps users discover what they can ask.

**Suggested Questions:**
- "Can I afford a $500 purchase next week?"
- "When will my balance be lowest?"
- "How much should I save for taxes?"
- "How stable is my income?"

**UX:**
- Displayed in empty state (before any messages)
- Clicking a question auto-submits it instantly
- Disabled when rate limit reached (remaining === 0)
- Rounded pill buttons with violet hover state

**File Modified:**
- `components/ask/ask-modal.tsx` - Added suggested questions UI and handler

---

### Day 63: Ask Cashcast FAB - App-Wide (April 6, 2026)

**Moved Ask Cashcast FAB to authenticated app layout** so it appears on all dashboard pages, not just the main dashboard.

**Change:**
- FAB now visible on: Dashboard, Bills, Income, Invoices, Reports, Settings, Calendar, etc.
- Removed duplicate FAB from dashboard-content.tsx
- Consistent AI access point across the entire authenticated experience

**Files Modified:**
- `app/dashboard/layout.tsx` - Added AskButton FAB
- `components/dashboard/dashboard-content.tsx` - Removed duplicate FAB

**Layout:**
```
┌─────────────────────────────┐
│         Page Content        │
│ [Feedback]        [Ask AI]  │  ← FABs (z-40)
├─────────────────────────────┤
│  Home Accounts ... Settings │  ← Mobile nav (z-50)
└─────────────────────────────┘
```

---

### Day 63: Earlier Updates (April 6, 2026)
- `public/logo.png` - Old square logo
- `public/Old-logo.png`, `public/cashcast-lockup-dark.png` - Deprecated assets

---

### Day 62: AI Natural Language Queries (April 6, 2026)

**Major Feature: "Ask Cashcast"** - Added a chat-style interface where users can ask financial questions in plain English, powered by Claude with real-time access to their financial data through tool calling.

**User Value:**
- Ask questions like "Can I afford a $2000 laptop next Friday?"
- Get personalized answers based on actual account balances and upcoming transactions
- Follow-up questions within the same conversation
- No need to navigate to specific tools - just ask

**Technical Implementation:**

| Component | Description |
|-----------|-------------|
| **LLM Provider** | Anthropic Claude (Sonnet for complex, Haiku for simple) |
| **Streaming** | Server-Sent Events (SSE) for real-time responses |
| **Tools** | 6 financial tools exposed via Claude function calling |
| **Rate Limiting** | 5 queries/day free, unlimited Pro |

**Tools Exposed to Claude:**

| Tool | Use Case |
|------|----------|
| `calculate_affordability` | "Can I afford X?" |
| `calculate_payment_date` | "When will client pay?" |
| `calculate_tax_reserve` | "How much for taxes?" |
| `calculate_income_variability` | "How stable is my income?" |
| `calculate_hourly_rate` | "What should I charge?" |
| `get_forecast_summary` | "When is my lowest balance?" |

**New Files:**
- `lib/ai/client.ts` - Anthropic SDK client, model selection logic
- `lib/ai/tools.ts` - Tool definitions with JSON schemas for Claude
- `lib/ai/execute-tool.ts` - Tool execution dispatcher routing to calculation functions
- `lib/ai/system-prompt.ts` - System prompt builder with user financial context
- `lib/ai/context.ts` - Fetch user accounts, income, bills, settings from Supabase
- `lib/ai/usage.ts` - Query usage tracking (checkQueryUsage, incrementQueryUsage)
- `lib/ai/types.ts` - TypeScript types (StreamEvent, UserFinancialData, etc.)
- `app/api/ai/chat/route.ts` - Streaming API endpoint with tool use loop
- `components/ask/ask-button.tsx` - Trigger button (FAB, card, nav, mobile-nav variants)
- `components/ask/ask-modal.tsx` - Chat modal with streaming responses
- `components/ask/index.ts` - Exports
- `supabase/migrations/20260406000001_add_ai_query_usage.sql` - Usage tracking table + RLS + increment function

**Modified Files:**
- `components/dashboard/dashboard-content.tsx` - Integrated AskButton as card
- `lib/stripe/feature-gate.ts` - Exported getUserTier for AI usage tracking
- `.env.example` - Added ANTHROPIC_API_KEY configuration

**Database Changes:**
- New `ai_query_usage` table for daily query tracking
- `increment_ai_query_usage` PostgreSQL function for atomic upsert
- RLS policies for secure user-only access

**UI Features:**
- Violet-themed button (distinct from teal Scenario button)
- Chat modal with message history
- Tool execution indicator (shows which tool is running)
- Streaming text responses
- Remaining queries indicator for free users
- Upgrade prompt when limit reached

**Bug Fixes During Implementation:**
- Fixed conversation history not being sent to API (follow-up questions now work)
- Fixed TypeScript errors with Supabase types using type assertions
- Fixed useEffect return path in ask-modal.tsx

**Dependencies Added:**
- `@anthropic-ai/sdk` - Anthropic Claude API client

**Commits:**
- AI chat API route with streaming and tool calling
- Ask button and modal components
- Database migration for usage tracking
- Conversation history support
- Dashboard integration

---

### Day 61: AI-Powered Probabilistic Forecasting (April 4, 2026)

**Major Feature: Monte Carlo Simulation** - Added probabilistic forecasting to give users confidence intervals and risk metrics for their cash flow projections.

**User Value:**
- See P10/P50/P90 confidence bands on the forecast chart
- Know the probability of overdrafting (e.g., "15% chance of dropping below $0")
- Understand worst-case balance scenarios
- Make better financial decisions with uncertainty quantified

**Technical Implementation:**

| Component | Description |
|-----------|-------------|
| **Simulation Count** | 500 iterations per forecast |
| **Performance** | ~9ms compute time (target was <200ms) |
| **RNG** | Seeded mulberry32 PRNG for reproducibility |
| **Distribution** | Box-Muller transform for normal sampling |

**Variance Configuration by Frequency:**

| Frequency | Amount CV | Timing Variance |
|-----------|-----------|-----------------|
| Weekly | 2% | ±0 days |
| Bi-weekly | 3% | ±1 day |
| Semi-monthly | 3% | ±1 day |
| Monthly | 5% | ±2 days |
| Quarterly | 10% | ±5 days |
| Annually | 15% | ±7 days |
| Irregular | 25% | ±10 days |
| One-time | 10% | ±3 days |

**New Files:**
- `lib/calendar/monte-carlo/types.ts` - Type definitions (ProbabilisticDay, RiskMetrics, MonteCarloResult, MonteCarloConfig)
- `lib/calendar/monte-carlo/variance-config.ts` - Variance parameters by frequency type
- `lib/calendar/monte-carlo/random.ts` - Seeded PRNG, Box-Muller transform, amount/timing variance utilities
- `lib/calendar/monte-carlo/simulation.ts` - Core Monte Carlo engine with 500 simulations
- `lib/calendar/monte-carlo/index.ts` - Public exports
- `components/dashboard/risk-metrics.tsx` - Risk metrics display component

**Modified Files:**
- `lib/calendar/types.ts` - Added `monteCarlo?: MonteCarloResult` to CalendarData interface
- `app/dashboard/page.tsx` - Integrated Monte Carlo call after generateCalendar()
- `components/charts/forecast-balance-chart.tsx` - Added confidence band Areas for P10/P90 visualization
- `components/dashboard/dashboard-content.tsx` - Integrated RiskMetrics component, passes probabilisticDays to chart

**Risk Metrics Displayed:**
- "X% chance of overdraft" - Probability of balance going below zero
- "X% chance below safety buffer" - Probability of dipping below user's buffer
- "Worst case balance: $X" - P10 lowest balance across simulation period
- Color-coded risk indicators (emerald/amber/rose for low/medium/high risk)

**Confidence Bands on Chart:**
- Shaded area between P10 (pessimistic) and P90 (optimistic)
- Semi-transparent teal fill with gradient
- Deterministic forecast (P50) shown as main line

**Bug Fix During Implementation:**
- Fixed timing shift bug where transactions were disappearing instead of moving to target days
- Solution: Pre-compute all transactions with original day indices, then properly shift to target days in each simulation

**Unit Tests Verified:**
- P50 ≈ deterministic forecast (within tolerance)
- Percentile ordering: P10 < P50 < P90
- Risk metrics correctly detect overdraft scenarios
- Performance target met (<200ms)

**Commits:**
- Monte Carlo simulation engine and integration
- Risk metrics component
- Confidence band visualization
- Timing shift bug fix

**UX Improvement: Simplified Navigation**

Reduced desktop nav from 10 items to 5 main items + "More" dropdown for better laptop screen compatibility:

| Main Nav (5 items) | "More" Dropdown (5 items) |
|-------------------|---------------------------|
| Calendar (NEW) | Transfers |
| Accounts | Debt Payoff |
| Income | Quotes |
| Bills | Import |
| Invoices | Reports |

- Prevents horizontal overflow on smaller laptop screens
- Groups secondary features logically
- Maintains quick access to core workflow (Accounts → Income → Bills → Invoices)
- Added global `overflow-x: hidden` to prevent white panel artifacts

---

### Day 60: Gemini Pivot Analysis & Roadmap (March 7, 2026)

**Strategic Analysis** - Consolidated Gemini Deep Research recommendations against current product state to identify actual gaps vs already-implemented features.

**Key Finding:** Many Gemini "recommendations" describe features already implemented:

| Gemini Suggestion | Current State |
|-------------------|---------------|
| "Show Safe to Spend above the fold" | Hero dashboard with Safe to Spend focal point |
| "What-If Engine" scenario modeling | "Can I Afford It?" scenario tester |
| "Milestone & Quote-to-Invoice tracking" | Quotes feature with invoice conversion |
| "Traffic light color logic" | emerald/amber/rose balance status |
| "Low Balance Alerts" | Daily cron with 7-day warning emails |
| "Tax Deadline Alerts" | Tax Savings Tracker with quarterly countdown |
| "ADHD-friendly progressive disclosure" | Collapsible sections, essential stats visible |

**Implication:** Product is feature-complete for core value prop. Bottleneck is awareness/positioning, not functionality.

**New Actionable Recommendations Identified:**

| Priority | Item | Type |
|----------|------|------|
| P0 | Specific metric testimonials | Marketing |
| P0 | Founder video (60-sec raw) | Marketing |
| P0 | Niche messaging (knowledge workers) | Marketing |
| P1 | Tax Reserve Calculator tool | Lead gen |
| P1 | Float/Pulse comparison pages | SEO |
| P1 | Tax Vault in Safe to Spend | Feature |
| P2 | Onboarding templates | Feature |
| P3 | AI payment prediction | Feature |

**Rejected Gemini Suggestion:**
- Headline "Stop Guessing if You Can Cover Rent: 365-Day Liquidity Planning for B2B Contractors"
- Reason: Too long (15 words vs current 6), jargon-heavy, less emotionally resonant
- Verdict: Keep current headline

**New Document Created:**
- `docs/gemini-market-research-app-pivot.md` - Complete pivot analysis with:
  - Features already implemented (no changes needed)
  - Partially implemented features (gaps identified)
  - New actionable recommendations
  - Implementation roadmap (Phase 0-5)
  - Updated priority matrix

**Strategic Direction:**
1. **This week:** Collect metric testimonials, record founder video
2. **Next 2 weeks:** Tax calculator tool, comparison pages, messaging updates
3. **Month 2:** Tax Vault integration, onboarding templates
4. **Future:** AI predictions, Canadian market based on traction

**Commits:**
- `ed6f12f` docs: add Gemini market research app pivot recommendations

---

**Tax Reserve Calculator Tool** - New free lead-gen tool at `/tools/tax-reserve-calculator` for freelancers to calculate how much to set aside for taxes.

**Features:**

| Country | Tax Types Calculated |
|---------|---------------------|
| **US** | Self-employment tax (15.3%), Federal income tax (2025 brackets), State tax estimate (~5%) |
| **Canada** | CPP contributions (both portions), Federal income tax, Provincial tax (all 13 provinces), GST/HST reserve |

**Key Outputs:**
- **Safe to Spend** - Amount available after setting aside tax reserve
- **Monthly Reserve** - How much to set aside each month
- **Quarterly Payment** - Estimated installment amount
- **Tax Breakdown** - Detailed breakdown by tax type
- **Alerts** - GST/HST $30K threshold warning, quarterly payment reminders

**Canadian-Specific Features:**
- All 13 provinces/territories with correct HST rates
- GST/HST threshold alert at $30K gross revenue
- CPP self-employed calculation (both employer + employee portions)
- Canadian quarterly due dates (Mar 15, Jun 15, Sep 15, Dec 15)

**New Files:**
- `lib/tools/calculate-tax-reserve.ts` - Tax calculation logic (US + Canada)
- `components/tools/tax-calculator-form.tsx` - Form with country/province selection
- `components/tools/tax-calculator-result.tsx` - Result display with breakdown
- `components/tools/tax-calculator.tsx` - Main wrapper component
- `app/tools/tax-reserve-calculator/page.tsx` - Page with SEO metadata and FAQs
- `app/tools/tax-reserve-calculator/opengraph-image.tsx` - Dynamic OG image

**Modified Files:**
- `components/tools/tools-index-client.tsx` - Added to tools grid
- `components/landing/footer.tsx` - Added to Free Tools section

**SEO:**
- Keywords: freelance tax calculator, self-employed tax calculator, HST calculator Canada, quarterly tax calculator
- FAQ schema with 4 questions
- WebApplication schema

**Commits:**
- `9d5cec5` feat: add Tax Reserve Calculator tool
- `225ca71` feat: add Tax Calculator to footer Free Tools section

---

**Float Comparison Page** - New SEO comparison page at `/compare/float` targeting freelancers looking for Float alternatives.

**Key Differentiators vs Float:**

| Feature | Cashcast | Float |
|---------|---------------------|-------|
| Price | $7.99/mo (87% cheaper) | $59-199/mo |
| Requires accounting software | No (standalone) | Yes (Xero/QuickBooks) |
| Target user | Freelancers | Growing SMBs |
| Built-in invoicing | Yes (Runway Collect) | No |
| "Safe to Spend" metric | Core feature | Not available |
| Setup time | 5 minutes | 30+ minutes |

**Page Sections:**
- Price comparison cards (Float vs CFF vs Savings)
- "Who each tool is for" side-by-side comparison
- 22-feature comparison table
- "Why freelancers choose us over Float" benefits grid
- FAQ section (5 questions with structured data)
- Links to other comparisons (YNAB, Mint, All Apps)
- Related guides (Cash Flow Forecasting, Tax Calculator)

**SEO:**
- Keywords: float alternative, float cash flow alternative, cheaper than float, float for freelancers
- FAQ schema for rich snippets
- Canonical URL: `/compare/float`

**Files Created:**
- `app/compare/float/page.tsx` - Full comparison page

**Files Modified:**
- `components/landing/footer.tsx` - Added "vs Float" to Compare section

**Commits:**
- `fca9460` feat: add Float comparison page

---

**Pulse Comparison Page** - New SEO comparison page at `/compare/pulse` targeting freelancers looking for Pulse alternatives.

**Key Differentiators vs Pulse:**

| Feature | Cashcast | Pulse |
|---------|---------------------|-------|
| Price | $7.99/mo (73% cheaper) | $29-89/mo |
| Data entry | Guided forms | Spreadsheet-style |
| Built-in invoicing | Yes (Runway Collect) | No |
| "Safe to Spend" metric | Core feature | Not available |
| Tax tracking | Yes + free calculator | No |
| Target user | Solo freelancers | Small agencies |

**Page Sections:**
- Price comparison cards (Pulse vs CFF vs Savings)
- Key differences (4 cards: Guided vs Spreadsheet, Invoicing, Safe to Spend, Tax tracking)
- 21-feature comparison table
- FAQ section (4 questions with structured data)
- Links to other comparisons (Float, YNAB, All Apps)
- Related guides (What is Safe to Spend, Tax Calculator)

**SEO:**
- Keywords: pulse alternative, pulse app alternative, cheaper than pulse, pulseapp alternative
- FAQ schema for rich snippets
- Canonical URL: `/compare/pulse`

**Files Created:**
- `app/compare/pulse/page.tsx` - Full comparison page

**Files Modified:**
- `components/landing/footer.tsx` - Added "vs Pulse" to Compare section

**Commits:**
- `66978fa` feat: add Pulse comparison page

---

**Landing Page Niche Messaging** - Updated landing page to target specific high-value knowledge professionals based on Gemini Market Research pivot recommendations.

**Hero Badge Update:**
- Changed from "Built for freelancers with irregular income" → "Built for designers, developers & consultants"
- More specific targeting for knowledge worker niche

**"Who It's For" Section Updates:**

| Before | After |
|--------|-------|
| Graphic Designers | UX Designers |
| Freelance Writers | AI & ML Consultants |
| Marketing Consultants | Marketing Strategists |
| Web Developers | Web Developers (kept) |

**Pricing Comparison Callout:**
- New section before pricing with teal highlight styling
- Links to Float comparison (87% cheaper)
- Links to Pulse comparison (73% cheaper)
- Links to all comparisons page

**Meta Keywords Added (15 new):**

Profession-specific:
- `ux designer finances`, `ux designer budget app`
- `web developer cash flow`, `developer freelance budget`
- `ai consultant finances`, `ml consultant cash flow`
- `marketing consultant budget`, `consultant cash flow forecast`
- `designer invoice tracking`, `developer project payments`

Comparison terms:
- `float app alternative`, `pulse app alternative`
- `cheaper than float`, `float alternative freelancer`
- `pulse alternative freelancer`

**Files Modified:**
- `app/page.tsx` - Hero badge, Who It's For section, pricing callout, keywords

**Commits:**
- `4460e41` feat: update landing page messaging for niche targeting

---

*For detailed entries from Days 40-59, see [archive/development-progress-days-40-59.md](archive/development-progress-days-40-59.md).*

---

## Earlier Development Summary (Days 1-59)

### Days 40-59 Summary (January-March 2026)

| Day | Feature |
|-----|---------|
| 59 | Gemini Market Research Integration |
| 58 | Landing Page Repositioning + PM Strategy Review |
| 57 | Excel Import Support + 6 SEO Blog Posts |
| 56 | Bug Fixes & Type Safety (12 fixes) |
| 55 | Import Recurring Entries + Income Frequency Expansion |
| 54 | Pricing Updates ($99 Lifetime) + Competitor Migration Pages |
| 53 | Lifetime Deal Feature |
| 52 | Quotes Feature |
| 51 | User Settings Currency Support |
| 50 | Credit Card Cash Flow Forecasting + Debt Payoff Planner |
| 49 | Custom Bill Categories |
| 48 | Reports & Export Feature |
| 47 | Semi-Monthly Frequency Bug Fixes |
| 46 | Dashboard & Calendar Mobile UX Polish |
| 45 | Form UX Polish + SEO/AEO Audit + Content Expansion |
| 44 | User Profile Dropdown + Invoice Branding |
| 43 | Landing Page Hero Dashboard + Calendar Visual Polish |
| 42 | Stripe Payment Links for Invoices |
| 41 | Simpler Onboarding + Emergency Fund Tracker |
| 40 | Low Balance Alerts + Safe to Spend Marketing |

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

- Domains: cashcast.io, .app (DNS via Namecheap → Vercel)
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
| AI Queries (Ask Cashcast) | 5/day | Unlimited | Unlimited |
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
| Probabilistic Forecasting | Monte Carlo simulation with P10/P50/P90 confidence bands |
| Natural Language Queries | "Ask Cashcast" chat with Claude-powered tool calling |
| Time Tracking + Invoicing | Timer widget, manual entry, invoice line items, time → invoice flow |
| Referral Program | Invite friends, 30-day trial for referee, 1-month Pro for referrer |

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
- **AI-powered probabilistic forecasting** with Monte Carlo simulation (P10/P50/P90 confidence bands)
- Risk metrics showing probability of overdraft and worst-case scenarios
- **AI Natural Language Queries** - "Ask Cashcast" chat modal powered by Claude
- Tool calling with 6 financial tools (affordability, payment date, tax reserve, etc.)
- Real-time streaming responses with conversation history
- Rate limiting (5/day free, unlimited Pro)
- **Time Tracking + Invoicing** - Complete freelancer workflow
- Persistent timer widget in dashboard header
- Manual time entry with project, client, duration, rate
- Filter entries by client, date range, invoiced status
- Create itemized invoices from selected time entries
- Uninvoiced Time widget on dashboard
- Time settings for default hourly rate and rounding
- **Currency support across all tools** - getCurrencySymbol() used consistently
- Onboarding form optimized for laptop screens (2-column layout)
- Calendar day modal with quick Add Income/Expense buttons
- **Referral Program** - Complete viral growth loop
- Unique 8-char referral codes per user
- Dashboard widget with copy button and stats
- 30-day Pro trial for referred signups
- 1-month Pro credit when referral converts
- Handles OAuth flow via sessionStorage
- **Calendar redesign** - Left border status indicator, neutral background, reduced visual clutter
- **Per-income tax withholding** - Toggle for W-2 vs contractor income, Safe to Spend reserves taxes for pre-tax income
- **All Karim Mousa feedback items implemented** - Calendar, Settings, Emergency Fund, AI Chat, Navigation, Scenarios, Tax

## What's Next

1. **Reddit launch** - Post to target subreddits
2. **Monitor analytics** - NPS responses, conversion funnel, alert effectiveness
3. **User feedback iteration** - Based on real usage
4. **Sentry error monitoring** - Catch production errors

---

**Status:** **FULLY LAUNCH-READY** - Live payments, feature gating, analytics all working in production!

**This is a living document. Update after each development session.**
