# Cash Flow Forecaster - Complete Product Brief

**Version:** 4.0  
**Last Updated:** December 21, 2025  
**Status:** Live - Accepting Payments - Feature Complete  
**Product URL:** https://cashflowforecaster.io  
**Repository:** https://github.com/omarqouqas/cashflowforecaster

---

## Executive Summary

**Product Name:** Cash Flow Forecaster

**Domains:** 
- Primary: cashflowforecaster.io
- Redirect: cashflowforecaster.app

**One-Liner:** "See your bank balance 60 days into the future."

**Hook:** "Project your daily balance for the next 60 days."

Cash Flow Forecaster is a Progressive Web App that helps freelancers, gig workers, and anyone with irregular income see their bank balance 60 days into the future. Unlike traditional budgeting apps that focus on past spending, Cash Flow Forecaster uses a daily liquidity calendar to answer the critical question: "Can I afford this expense before my next paycheck arrives?"

### Problem Statement

Millions of freelancers and gig workers struggle with cash flow uncertainty. They don't know if they can afford an expense because they can't predict when money will arrive. Traditional budgeting apps (YNAB, Mint, Monarch) focus on tracking past spending, not projecting future liquidity. This leaves a critical gap for people who need forward-looking visibility.

### Solution

Cash Flow Forecaster projects bank balance 60 days into the future using a daily calendar interface. Users input:
- Current account balances
- Income sources (with frequency: weekly, bi-weekly, monthly)
- Recurring bills (with due dates)

The app calculates and displays a 60-day calendar showing projected daily balances, color-coded to highlight low-balance days. Users can test "Can I afford it?" scenarios before making purchases.

### Target Market

**Primary:** Freelancers and gig workers ($30-60k annual income)
- Graphic designers, writers, consultants
- Uber/Lyft drivers, delivery workers
- Part-time contractors

**Secondary:** Small business owners
- Solo entrepreneurs
- Side hustlers
- Anyone with irregular income

**Market Size:** 57 million freelancers in the US alone, with 36% reporting cash flow as their #1 challenge.

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

### Phase 6: Runway Collect ✅ COMPLETE (Days 17-19)
- Invoice generator with PDF export
- Email sending via Resend
- Payment reminder system (3 escalating templates)
- Auto-sync invoices with income forecasts

### Phase 7: Onboarding ✅ COMPLETE (Day 18)
- 4-step guided wizard
- Account, income, bills setup
- Pre-populated bill suggestions
- Auto-redirect for new users

### Phase 8: Stripe Integration ✅ COMPLETE (Day 21)
- Stripe Checkout for Pro/Premium tiers
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

1. **Daily Liquidity Calendar** ✅
   - 60/90/365-day forward projection (tier-based)
   - Color-coded balance indicators (green/amber/rose)
   - Daily transaction list with detail modals
   - Mobile-responsive dark theme design
   - Today indicator with auto-scroll
   - Overdraft warning banners

2. **Account Management** ✅
   - Multiple bank accounts
   - Starting balance tracking
   - Account aggregation

3. **Income Sources** ✅
   - Recurring income (weekly, bi-weekly, monthly, etc.)
   - One-time income
   - Start/end date support
   - **Gated:** 10 limit for Free tier

4. **Bill Management** ✅
   - Recurring bills (rent, utilities, subscriptions)
   - Due date tracking
   - Category organization
   - All frequencies supported (weekly through yearly)
   - **Gated:** 10 limit for Free tier

5. **Scenario Testing** ✅
   - "Can I afford it?" calculator
   - Test hypothetical expenses
   - See impact on future balance
   - Save scenarios for reference

6. **Runway Collect (Pro)** ✅
   - Create professional invoices
   - Generate & download PDFs
   - Email invoices directly
   - Payment reminder system (friendly/firm/final)
   - Auto-sync with cash flow forecasts
   - **Gated:** Pro+ only

7. **Onboarding Wizard** ✅
   - 4-step guided setup
   - Pre-populated suggestions
   - Immediate value demonstration

8. **Stripe Payments** ✅
   - Secure checkout via Stripe
   - Customer portal for subscription management
   - Automatic tier upgrades/downgrades

9. **Feature Gating** ✅
   - Usage indicators ("3/10 bills")
   - Upgrade banners (amber at limit, blue near limit)
   - Upgrade modals with billing toggle
   - Server-side validation

10. **Analytics (PostHog)** ✅
    - User behavior tracking
    - Conversion funnel analysis
    - Feature usage metrics
    - Session recording

### Premium Features (Post-MVP)

11. **Email Parser** (Planned)
    - Forward bills to bills@cashflowforecaster.io
    - Automatic bill extraction
    - One-click bill creation

12. **Bank Sync (Premium)** (Planned)
    - Plaid integration
    - Automatic transaction import
    - Real-time balance updates

13. **Notifications** (Planned)
    - Low balance alerts
    - Bill due reminders
    - SMS alerts (Premium)

14. **Couples Mode (Premium)** (Planned)
    - Shared accounts
    - Partner visibility
    - Joint planning

---

## Business Model

### Pricing Strategy

**Target Conversion Rate:** 10-15% (free to paid)

**Revenue Goal:** $1,000 MRR by Month 6

### Pricing Tiers (Live)

| Feature | Free | Pro ($7.99/mo) | Premium ($14.99/mo) |
|---------|------|----------------|---------------------|
| Bills | 10 | Unlimited | Unlimited |
| Income Sources | 10 | Unlimited | Unlimited |
| Forecast Days | 60 | 90 | 365 |
| Calendar View | ✅ | ✅ | ✅ |
| "Can I Afford It?" | ✅ | ✅ | ✅ |
| Onboarding Wizard | ✅ | ✅ | ✅ |
| Runway Collect | ❌ | ✅ | ✅ |
| PDF Invoices | ❌ | ✅ | ✅ |
| Payment Reminders | ❌ | ✅ | ✅ |
| Bank Sync | ❌ | ❌ | ✅ (coming soon) |
| SMS Alerts | ❌ | ❌ | ✅ (coming soon) |
| Couples Mode | ❌ | ❌ | ✅ (coming soon) |
| Support | 48hr email | 24hr priority | 24hr priority |

**Yearly Pricing:**
- Pro: $79/year (2 months free)
- Premium: $149/year (2 months free)

### Revenue Projections

**Month 1-2:** Beta (free users only)
- Goal: 100 beta users
- Revenue: $0
- Focus: Feedback and bug fixes

**Month 3:** Public Launch
- Goal: 500 users (50 paying)
- Revenue: $400/month
- Focus: Product Hunt launch

**Month 6:** Growth Phase
- Goal: 1,000 users (100 paying)
- Revenue: $800/month
- Focus: Content marketing, SEO

**Month 12:** Scale Phase
- Goal: 5,000 users (500 paying)
- Revenue: $4,000/month
- Focus: Paid ads, partnerships

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

### Database Schema (12 tables)

1. **accounts** - User bank accounts
2. **income** - Income sources
3. **bills** - Recurring expenses
4. **user_settings** - User preferences (timezone, safety buffer)
5. **scenarios** - "Can I afford it?" calculations
6. **invoices** - Runway Collect invoices
7. **invoice_reminders** - Payment reminder history
8. **parsed_emails** - Email parser results (future)
9. **weekly_checkins** - Burn rate tracking (future)
10. **notifications** - User notifications
11. **users** - Extended user profiles
12. **subscriptions** - Stripe subscription data

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

**Feature Adoption:**
- `scenario_tested` - Core differentiator usage
- `invoice_created` - Pro feature adoption
- `reminder_sent` - Pro feature depth

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

---

## Go-to-Market Strategy

### Launch Strategy

**Phase 1: Beta Launch (Current)**
- ✅ Deploy to production
- ✅ Stripe integration complete
- ✅ Feature gating complete
- ✅ Analytics tracking live
- 📋 Reddit launch (r/freelance, r/povertyfinance, r/smallbusiness)
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

**Target Subreddits:**
- r/freelance (1.2M members)
- r/povertyfinance (2.1M members)
- r/smallbusiness (1.5M members)
- r/Entrepreneur (2.2M members)
- r/sidehustle (500K members)

**Post Strategy:**
- Share personal story (struggling with cash flow)
- Show the problem being solved (overdraft screenshot)
- Offer free tier (no spam)
- Ask for feedback (genuine engagement)

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

### Target Metrics (Month 6)

- **Users:** 1,000 total, 100 paying
- **MRR:** $800
- **Retention:** 40% Day 7, 20% Day 30
- **Conversion:** 10% free-to-paid
- **CAC:** < $10
- **Churn:** < 5%/month

---

## Competitive Positioning

**Our Status:** Live, accepting payments, feature-gated, analytics-enabled

**Competitive Advantage:**

| Aspect | Cash Flow Forecaster | YNAB | Monarch Money |
|--------|---------------------|------|---------------|
| **Focus** | Future balance prediction | Past spending tracking | Wealth optimization |
| **UI** | Calendar (intuitive) | Category budgets | Dashboard/graphs |
| **Target** | $30-60k freelancers | $80k+ households | $100k+ households |
| **Price** | $7.99/mo | $14.99/mo | $14.99/mo |
| **Unique** | Runway Collect invoicing | Envelope budgeting | AI insights |

**Market Gap Confirmed:**
- No competitor focuses on forward-looking cash flow
- Calendar metaphor is unique and intuitive
- Invoice-to-forecast sync is unique differentiator
- Underserved market ($30-60k income)

---

## Future Roadmap

### Phase 2 Features (Months 2-4)

- [ ] Bill collision warnings
- [ ] Sentry error monitoring
- [ ] Multi-currency support
- [ ] Export to CSV/PDF
- [ ] Email notifications

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
- International expansion
- Partnerships with freelancer platforms

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

## Contact Information

**Product:** Cash Flow Forecaster  
**Website:** https://cashflowforecaster.io  
**Email:** support@cashflowforecaster.io  
**Repository:** https://github.com/omarqouqas/cashflowforecaster

---

**Document Version:** 4.0  
**Last Updated:** December 21, 2025  
**Status:** Live - Feature Complete - Ready for User Acquisition 🎉  
**Next Review:** January 2025