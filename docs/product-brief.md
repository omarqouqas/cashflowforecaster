# Cash Flow Forecaster - Complete Product Brief

**Version:** 2.1  
**Last Updated:** December 2024  
**Status:** Active Development (Phase 4 - Calendar UI)  
**Product URL:** https://cashflowforecaster.io (launching soon)  
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

### Phase 1: Foundation ✅ COMPLETE (Days 1-3)
- Next.js 14 project with TypeScript
- Supabase backend integration
- Database schema (9 tables)
- Row Level Security configured
- Domains secured and DNS configured
- Git repository and version control

### Phase 2: Authentication ✅ COMPLETE (Days 4-5)
- Signup/login pages
- Protected routes
- User profile management
- Password reset flow
- Email verification handling
- Settings page

### Phase 3: Core Data Models ✅ COMPLETE (Days 6-8)
- Account management (full CRUD)
- Income sources management (full CRUD)
- Bills management (full CRUD)
- Dashboard with live summaries
- Reusable components (toggle buttons, form components)

### Phase 4: Calendar Feature 🚧 IN PROGRESS (Days 9-15)
- ✅ Calendar generation algorithm (Days 9-10) - COMPLETE
- ⏳ Calendar UI components (Days 11-13) - PENDING
- ⏳ Polish & testing (Days 14-15) - PENDING

### Timeline to MVP: 6-8 weeks

**Target Launch:** February 2025

---

## Product Features

### Core Features (MVP)

1. **Daily Liquidity Calendar**
   - 60-day forward projection
   - Color-coded balance indicators
   - Daily transaction list
   - Mobile-responsive design

2. **Account Management**
   - Multiple bank accounts
   - Starting balance tracking
   - Account aggregation

3. **Income Sources**
   - Recurring income (weekly, bi-weekly, monthly)
   - One-time income
   - Start/end date support

4. **Bill Management**
   - Recurring bills (rent, utilities, subscriptions)
   - Due date tracking
   - Category organization
   - Frequency support (monthly, quarterly, yearly)

5. **Scenario Testing**
   - "Can I afford it?" calculator
   - Test hypothetical expenses
   - See impact on future balance
   - Save scenarios for reference

### Premium Features (Post-MVP)

6. **Email Parser**
   - Forward bills to bills@cashflowforecaster.io
   - Automatic bill extraction
   - One-click bill creation
   - Manual review/approval

7. **Bank Sync (Premium)**
   - Plaid integration
   - Automatic transaction import
   - Real-time balance updates
   - Multi-account support

8. **Notifications**
   - Low balance alerts
   - Bill due reminders
   - Weekly check-ins
   - SMS alerts (Premium)

9. **Couples Mode (Premium)**
   - Shared accounts
   - Partner visibility
   - Joint planning

---

## Business Model

### Pricing Strategy

**Target Conversion Rate:** 10-15% (free to paid)

**Revenue Goal:** $1,000 MRR by Month 6

### Pricing (Updated)

**Free Tier:**
- Manual entry only
- Up to 10 bills/income sources
- 60-day calendar forecast
- Basic color coding
- Email support (48hr response)

**Price:** $0/forever  
**Target:** 80% of users

**Pro Tier:**
- Everything in Free
- Email parser (bills@cashflowforecaster.io)
- Unlimited bills & income
- 90-day calendar forecast
- Scenario testing
- Weekly check-ins
- Priority support (24hr)

**Price:** $8/month or $80/year  
**Margin:** 92% ($7.35 profit per user)

**Premium Tier:**
- Everything in Pro
- Bank sync via Plaid
- SMS alerts
- Couples mode
- 12 months history
- Multi-account support

**Price:** $15/month or $150/year  
**Margin:** 88% ($13.15 profit per user)

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

## Mobile Strategy

### Phase 1: PWA First (Current)

**Why PWA First:**
- Faster to market (no app store approval)
- Lower costs (no $99/year Apple fee)
- Better economics (no 30% Apple tax)
- Instant updates (no review process)
- Works everywhere (iOS, Android, Desktop)

**PWA Capabilities:**
- Install to home screen
- Offline functionality
- Push notifications (Android)
- Native-like experience
- Responsive design

### Phase 2: Native Apps (Month 4+, If Needed)

**When to Build Native:**
- 100+ active users requesting it
- $1,000+ MRR (can afford costs)
- Users reporting PWA limitations
- Need iOS push notifications

**Technology:** Expo (React Native)

**Timeline:** 3-4 weeks

**Code Reuse:** 60-70% from web app

**Backend:** No changes needed (Supabase works identically)

**Cost Impact:**
- Apple Developer: $99/year
- Google Play: $25 one-time
- No recurring costs (same backend)

---

## Competitive Analysis

### Direct Competitors

**Monarch Money**
- Price: $15/month
- Focus: Wealth optimization ($100k+ earners)
- Strength: Bank sync, investment tracking
- Weakness: Complex UI, expensive
- **Our Advantage:** Simpler, cheaper, calendar view

**YNAB (You Need A Budget)**
- Price: $15/month
- Focus: Zero-based budgeting
- Strength: Strong community, education
- Weakness: Steep learning curve, past-focused
- **Our Advantage:** Forward-looking, easier to use

**Mint (Discontinued)**
- Price: Free (was)
- Focus: Expense tracking
- Strength: Free, bank sync
- Weakness: No longer available, cluttered
- **Our Advantage:** Active product, focused feature set

### Indirect Competitors

**Spreadsheets (Excel, Google Sheets)**
- Price: Free-$10/month
- Strength: Flexible, familiar
- Weakness: Manual, error-prone, no automation
- **Our Advantage:** Automated, mobile-friendly, email parser

**Banking Apps**
- Price: Free
- Strength: Real-time data, trusted
- Weakness: No forward projection, limited planning
- **Our Advantage:** 60-day forecast, scenario testing

### Competitive Positioning (Updated December 2024)

**Our Status:** Pre-launch (MVP in development)

**Competitive Advantage:**
- **Focus:** Survival tool (not wealth optimization)
- **UI:** Calendar metaphor (more intuitive than graphs)
- **Innovation:** Email parser (no competitor has this)
- **Price:** $8/month (vs Monarch's $15)
- **Audience:** $30-60k income (underserved market)

**Market Gap Confirmed:**
- Monarch/YNAB target $100k+ earners
- We target struggling freelancers ($30-60k)
- No direct competitor in this segment
- Calendar view is unique differentiator

---

## Financial Projections

### Current Monthly Costs (Development)

- Domains: $5/month (amortized)
- Supabase: $0 (free tier)
- Vercel: $0 (free tier)
- Development tools: $0

**Total:** ~$5/month

### Projected Costs (After Launch)

**At 100 users (10 paying):**
- Domains: $5/month
- Supabase: $0 (free tier sufficient)
- Vercel: $0 (free tier sufficient)
- OpenAI (email parsing): $5/month

**Total:** ~$10/month  
**Revenue:** $80/month (10 × $8)  
**Profit:** $70/month

**At 1,000 users (100 paying):**
- Domains: $5/month
- Supabase: $25/month (Pro tier)
- Vercel: $20/month (Pro tier)
- OpenAI: $50/month
- PostHog: $20/month

**Total:** ~$120/month  
**Revenue:** $800/month  
**Profit:** $680/month

**At 5,000 users (500 paying):**
- Domains: $5/month
- Supabase: $125/month (Team tier)
- Vercel: $100/month (Pro tier)
- OpenAI: $200/month
- PostHog: $50/month
- Plaid: $200/month (bank sync)

**Total:** ~$680/month  
**Revenue:** $4,000/month  
**Profit:** $3,320/month

### Unit Economics

**Customer Acquisition Cost (CAC):** $5-10 (organic + Reddit)
**Lifetime Value (LTV):** $96 (12 months × $8)
**LTV:CAC Ratio:** 10:1 to 19:1 (healthy)

**Payback Period:** < 1 month

---

## Go-to-Market Strategy

### Launch Strategy

**Phase 1: Beta Launch (Week 9)**
- Deploy to production
- Reddit launch (r/freelance, r/povertyfinance, r/smallbusiness)
- Invite 100 beta users
- Collect feedback
- Fix critical bugs

**Phase 2: Product Hunt (Week 10-11)**
- Prepare launch materials
- Build email list
- Launch on Product Hunt
- Target: Top 5 product of the day
- Goal: 500 signups

**Phase 3: Content Marketing (Month 3-6)**
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

### Launch Timeline (Updated)

**Week 1-2:** Foundation ✅ COMPLETE
- Project setup
- Database schema
- Basic infrastructure

**Week 3:** Authentication (Current)
- Signup/login
- Password reset
- Protected routes

**Week 4-5:** Core Features
- Account management
- Income/bills CRUD
- User settings

**Week 6-7:** Calendar Feature
- Generation algorithm
- UI components
- Testing

**Week 8:** Polish & Launch Prep
- Bug fixes
- Performance optimization
- Landing page polish
- Analytics setup

**Week 9:** Beta Launch
- Deploy to production
- Reddit launch (r/freelance, r/povertyfinance)
- Invite 100 beta users
- Collect feedback

**Week 10-12:** Iterate & Scale
- Fix issues from beta
- Implement email parser
- Product Hunt launch
- Paid tier launch

**Target Public Launch:** February 2025

---

## Technical Implementation

### Architecture Decisions

- **Frontend:** Next.js 14 (App Router, Server Components)
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Deployment:** Vercel (optimized for Next.js)
- **Version Control:** Git + GitHub
- **DNS:** Namecheap → Vercel

### Database Schema (Implemented)

9 tables created and tested:

1. **accounts** - User bank accounts
2. **income** - Income sources
3. **bills** - Recurring expenses
4. **user_settings** - User preferences
5. **scenarios** - What-if calculations
6. **parsed_emails** - Email parser results
7. **weekly_checkins** - Burn rate tracking
8. **notifications** - User notifications
9. **users** - Extended user profiles

### Security (Implemented)

- Row Level Security enabled on all tables
- Users can only access their own data
- Supabase Auth handles authentication
- Environment variables for secrets
- TypeScript for type safety

### Key Technologies

- **Next.js 14:** React framework with App Router
- **TypeScript:** Type-safe development
- **Supabase:** Backend-as-a-Service (PostgreSQL, Auth, Storage)
- **Tailwind CSS:** Utility-first styling
- **Vercel:** Hosting and deployment
- **Plaid:** Bank account integration (Premium feature)

---

## User Experience

### User Journey

1. **Discovery:** User finds Cash Flow Forecaster via Reddit, Product Hunt, or search
2. **Signup:** Quick email/password signup (30 seconds)
3. **Onboarding:** Guided setup (5 minutes)
   - Add bank account(s)
   - Add income sources
   - Add recurring bills
4. **First View:** See 60-day calendar immediately
5. **Daily Use:** Check calendar before making purchases
6. **Upgrade:** User hits 10-bill limit → upgrade to Pro

### Key User Flows

**Flow 1: Initial Setup**
1. Sign up → 2. Add account → 3. Add income → 4. Add bills → 5. View calendar

**Flow 2: Daily Check**
1. Open app → 2. View calendar → 3. Check balance for today/tomorrow → 4. Make decision

**Flow 3: Add New Bill**
1. Click "Add Bill" → 2. Enter details → 3. Save → 4. Calendar updates automatically

**Flow 4: Scenario Test**
1. Click "Can I afford it?" → 2. Enter expense amount/date → 3. See result → 4. Save or dismiss

**Flow 5: Email Parser (Pro)**
1. Forward bill email → 2. Receive notification → 3. Review parsed data → 4. Approve/create bill

### Design Principles

- **Simplicity:** Calendar is the hero, everything else is secondary
- **Speed:** Calendar loads in < 500ms
- **Clarity:** Color coding makes low-balance days obvious
- **Mobile-First:** Works perfectly on phone (primary use case)
- **Trust:** Transparent calculations, no hidden fees

---

## Success Metrics

### Key Performance Indicators (KPIs)

**User Metrics:**
- Monthly Active Users (MAU)
- Daily Active Users (DAU)
- User retention (Day 7, Day 30)
- Time to first calendar view
- Bills/income sources per user

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
- Email parser usage (Pro users)
- Feature adoption rates
- Error rates

### Target Metrics (Month 6)

- **Users:** 1,000 total, 100 paying
- **MRR:** $800
- **Retention:** 40% Day 7, 20% Day 30
- **Conversion:** 10% free-to-paid
- **CAC:** < $10
- **Churn:** < 5%/month

---

## Risk Assessment

### Technical Risks

**Risk:** Calendar algorithm bugs (incorrect projections)
- **Mitigation:** Extensive testing, beta user feedback, manual verification

**Risk:** Supabase scaling issues
- **Mitigation:** Monitor usage, upgrade tier as needed, consider alternatives

**Risk:** Email parser accuracy
- **Mitigation:** Manual review step, user feedback loop, improve AI model

### Business Risks

**Risk:** Low conversion rate (< 5%)
- **Mitigation:** A/B test pricing, improve onboarding, add more free value

**Risk:** High churn rate (> 10%)
- **Mitigation:** Weekly check-ins, email reminders, improve product value

**Risk:** Competitor launches similar product
- **Mitigation:** Move fast, build moat (email parser), focus on community

### Market Risks

**Risk:** Target market too small
- **Mitigation:** Expand to small businesses, add B2B features

**Risk:** Users don't understand value
- **Mitigation:** Better onboarding, tutorials, case studies

---

## Future Roadmap

### Phase 2 Features (Months 4-6)

- Multi-currency support
- Budget categories
- Spending insights/analytics
- Export to CSV/PDF
- Email notifications
- Mobile app (if needed)

### Phase 3 Features (Months 7-12)

- Bank account integration (Plaid) - Premium
- Automatic transaction import
- AI-powered bill categorization
- Predictive analytics
- Team/collaboration features
- API for integrations

### Long-Term Vision (Year 2+)

- B2B version (small businesses)
- White-label solution
- International expansion
- Partnerships with freelancer platforms
- Financial education content

---

## Appendix

### Market Research

**Target Audience:** 57 million freelancers in the US
- 36% report cash flow as #1 challenge
- Average income: $30-60k/year
- Tech-savvy, price-sensitive
- Active on Reddit, Twitter, Product Hunt

**Competitive Landscape:**
- No direct competitor in $30-60k income segment
- Calendar view is unique differentiator
- Email parser is innovative feature
- Price point ($8) is competitive

### Key Assumptions

1. 10-15% free-to-paid conversion rate
2. $5-10 customer acquisition cost
3. 5% monthly churn rate
4. 12-month average customer lifetime
5. 80% of users stay on free tier
6. Email parser drives Pro upgrades

### Contact Information

**Product:** Cash Flow Forecaster  
**Website:** https://cashflowforecaster.io  
**Email:** support@cashflowforecaster.io  
**Repository:** https://github.com/omarqouqas/cashflowforecaster

---

**Document Version:** 2.1  
**Last Updated:** December 2024  
**Status:** Active Development (Phase 2)  
**Next Review:** January 2025

