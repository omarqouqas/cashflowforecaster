# Cash Flow Forecaster - Strategic Considerations

**Created:** January 27, 2026
**Status:** Living Document

---

## 1. B2C vs B2B?

### Current Model: B2C

The app is built for individual freelancers with irregular income ($45-90k/year). This is the right focus for now.

### B2B Opportunities (Future)

| Segment | Use Case | Effort | Revenue Potential |
|---------|----------|--------|-------------------|
| Freelancer platforms (Upwork, Fiverr, Toptal) | White-label cash flow tool for their users | High | Very High |
| Accounting firms | Offer to clients with irregular income | Medium | Medium |
| Coworking spaces | Perk for members | Low | Low |
| Freelancer unions/associations | Member benefit | Low | Low |

### Recommendation

**Stay B2C for now.** Product-market fit exists with freelancers. B2B requires:
- Enterprise sales motion
- Contracts and SLAs
- Different support expectations
- Longer sales cycles

**Revisit B2B once reaching $10k MRR** with a stable product and proven retention.

---

## 2. AI Integration Opportunities

### High-Value AI Features

| Feature | Description | Value | Effort |
|---------|-------------|-------|--------|
| **Smart bill categorization** | Auto-categorize imported transactions using LLM | High | Low |
| **Cash flow insights** | "You typically run low mid-month. Consider moving your rent due date." | High | Medium |
| **Invoice payment prediction** | ML model predicting when clients actually pay based on history | High | Medium |
| **Natural language queries** | "Can I afford a $2k laptop next month?" | Medium | Medium |
| **Anomaly detection** | "Your electric bill is 40% higher than usual" | Medium | Low |
| **Smart forecasting** | Adjust predictions based on seasonal patterns in user's income | High | High |

### Quick Win: Smart Categorization

Start with AI-powered transaction categorization:
- Use Claude or GPT API
- Low implementation effort
- High perceived value for users
- Reduces manual data entry friction

### Implementation Approach

```
Phase 1: Smart Categorization (Week 1-2)
- Integrate Claude API for transaction categorization
- Train on common freelancer expense patterns
- Show confidence scores, allow user corrections

Phase 2: Cash Flow Insights (Week 3-4)
- Analyze user's historical patterns
- Generate personalized recommendations
- Weekly AI-powered summary in email digest

Phase 3: Payment Prediction (Month 2)
- Track actual vs expected payment dates per client
- Build prediction model for late payments
- Factor predictions into cash flow forecast
```

---

## 3. Apple App Store Launch (from Windows)

### Current State

The app is a **Progressive Web App (PWA)** that already works on iOS via Safari's "Add to Home Screen" feature.

### Native App Options

| Approach | Complexity | Cost | Notes |
|----------|------------|------|-------|
| **PWA (Current)** | ✅ Done | $0 | Works now, limited push notifications on iOS |
| **Capacitor/Ionic** | Medium | $99/yr Apple Developer | Wrap Next.js in native shell |
| **React Native rebuild** | High | $99/yr + months of work | Rewrite mobile UI |
| **Flutter rebuild** | Very High | $99/yr + months of work | Complete rewrite |

### The Windows Problem

iOS apps **MUST** be built on macOS with Xcode. You cannot submit to App Store without access to a Mac.

### Solutions for Windows Users

| Solution | Cost | Pros | Cons |
|----------|------|------|------|
| **Mac in Cloud** (MacStadium, AWS EC2 Mac) | $50-100/mo | No hardware needed | Ongoing cost |
| **GitHub Actions** with macOS runners | Free tier available | Automated builds | Learning curve |
| **Used Mac Mini (M1)** | $300-400 one-time | Full control, one-time cost | Hardware to maintain |
| **Expo EAS Build** (if React Native) | Free tier available | Cloud builds | Only for React Native |

### Recommendation

**Stick with PWA unless:**
1. Users specifically request a native app
2. You need reliable push notifications on iOS
3. You want App Store discoverability for marketing

**If native app becomes necessary:**
1. Buy a used Mac Mini M1 ($300-400)
2. Use Capacitor to wrap the existing Next.js app
3. Minimal code changes required

---

## 4. Competitive Differentiation

### Current Advantages

Features that set Cash Flow Forecaster apart from competitors:

| Feature | Us | Monarch | YNAB | Copilot |
|---------|-----|---------|------|---------|
| Forward-looking calendar (90-365 days) | ✅ | ❌ | ❌ | ❌ |
| "Can I Afford It?" scenarios | ✅ | ❌ | ❌ | ❌ |
| CC Payment Simulator | ✅ | ❌ | ❌ | ❌ |
| Debt Payoff Planner | ✅ | ❌ | ❌ | ❌ |
| Invoice-to-forecast sync | ✅ | ❌ | ❌ | ❌ |
| Credit utilization warnings | ✅ | ❌ | ❌ | ❌ |
| Built for irregular income | ✅ | ❌ | ❌ | ❌ |
| Price | $7.99/mo or $149 lifetime | $14.99/mo | $14.99/mo | $9.99/mo |

### Core Differentiator

**Forward-looking vs backward-looking:** YNAB and Mint track where money went; we show where it will be. This is the fundamental difference that resonates with freelancers.

### Potential New Differentiators

| Feature | Impact | Effort | Description |
|---------|--------|--------|-------------|
| **Client payment scoring** | Very High | Medium | Track which clients pay late, predict cash flow risk per client |
| **Invoice financing integration** | Very High | High | Partner with Fundbox/BlueVine for instant invoice advances |
| **Tax withholding automation** | High | Medium | Auto-calculate quarterly estimates, show "true" spendable after taxes |
| **Gig platform integrations** | High | High | Pull earnings from Uber/DoorDash/Upwork APIs automatically |
| **Cashflow coaching** | Medium | Medium | AI-powered weekly tips based on user's patterns |
| **Bill negotiation recommendations** | Medium | Low | "Your internet bill is 20% above average for your area" |

### Biggest Opportunity: Client Payment Intelligence

Freelancers' #1 pain point is **late-paying clients**. No competitor addresses this.

**Proposed Feature: Client Payment Tracker**
- Track actual payment date vs invoice due date per client
- Calculate average days late per client
- Show "Client A pays 12 days late on average"
- Factor late payment patterns into cash flow forecasts
- Alert: "Based on history, this invoice will likely be paid Feb 15, not Feb 1"

This would be a **killer feature** that directly addresses the core anxiety of freelancers.

---

## 5. Strategic Priorities

### Short-term (Next 30 days)
1. Reddit launch for user acquisition
2. Monitor conversion funnel in PostHog
3. Collect user feedback on existing features
4. Build YNAB/Mint CSV importers (capture migration opportunity)
5. Create competitor migration landing pages

### Medium-term (60-90 days)
1. Add AI-powered transaction categorization
2. Build client payment tracking feature
3. Consider Sentry for error monitoring
4. Spending analytics/trends charts

### Long-term (6+ months)
1. Evaluate B2B partnership opportunities
2. Consider native iOS app if user demand exists
3. Explore gig platform integrations
4. Potential invoice financing partnerships
5. Bank sync: Flinks integration for Canada (2026, aligned with CDBA Phase 1)
6. Bank sync: Plaid integration for US (when Section 1033 regulatory clarity improves)

---

## 6. Competitor Migration Strategy

### Strategic Opportunity

Attracting users from competitor apps (YNAB, Monarch, Mint, Neontra) represents a high-value acquisition channel:

1. **Pre-qualified users** — Already paying for financial tools, understand the value
2. **Mint exodus** — Mint shutting down creates urgent migration wave
3. **YNAB price complaints** — $14.99/mo is a common pain point on Reddit
4. **Feature gaps** — Competitors don't serve irregular income well

### Current Competitive Landscape

| Competitor | Their Weakness | Our Opportunity |
|------------|----------------|-----------------|
| **YNAB** | $14.99/mo, backward-looking, poor irregular income support | 47% cheaper, forward-looking, freelancer-focused |
| **Monarch** | $14.99/mo, no forecasting, no invoicing | Cheaper, forward-looking, built-in invoicing |
| **Mint** | Shutting down | Capture refugees with free tier |
| **Neontra** | General audience, no invoicing, no calendar view | Freelancer focus, invoice-to-forecast, daily balance calendar |
| **Copilot** | Apple-only, no forecasting | Cross-platform, forward-looking |

### Infrastructure Gaps to Address

| Need | Current State | Priority | Notes |
|------|---------------|----------|-------|
| **Competitor CSV importers** | Generic CSV only | High | YNAB/Mint formats are documented |
| **Bank sync (Plaid)** | Not implemented | Medium | Table stakes for many users, but expensive |
| **AI auto-categorization** | Manual only | High | Reduces friction significantly |
| **Native mobile app** | PWA only | Medium | Expected by switchers |
| **Public API** | None | Low | Power user feature |

### Migration Implementation Roadmap

**Phase 1: Quick Wins (Immediate)**
- Build YNAB CSV importer (their export format is documented)
- Build Mint CSV importer (capture exodus urgently)
- Create migration landing pages with step-by-step guides
- Offer "migration concierge" service for Pro signups
- 30-day Pro trial for users from paid competitors

**Phase 2: Reduce Friction (Near-term)**
- AI-powered transaction categorization (Claude/GPT API)
- Spending trends/analytics charts (aligns with chart roadmap)
- Budget tracking overlay (optional feature for YNAB converts)

**Phase 3: Infrastructure Investment (Long-term)**
- Plaid integration for bank sync
- Native mobile apps (or significantly improved PWA)
- Public API for integrations

### Best Migration Targets (Prioritized)

1. **Mint refugees** — Mint is dead, urgent opportunity
2. **YNAB users frustrated with pricing** — $14.99/mo is steep
3. **Freelancers using generic tools** — Our niche focus is compelling
4. **Neontra/Monarch users wanting better forecasting** — They have basic forecasting but not calendar-based

### Support Requirements for Migrants

| Need | Recommendation |
|------|----------------|
| **Migration guides** | Step-by-step docs for each competitor export/import |
| **Concierge import** | Do the migration for Pro users (white-glove onboarding) |
| **Comparison pages** | Expand `/compare` with honest feature matrices |
| **Community** | Discord/forum for switchers to ask questions |
| **Data portability** | "Your data is yours" messaging builds trust |

See `docs/competitors.md` for detailed competitor profiles and analysis.

---

## 7. Data Visualization / Charts

### Current State ✅ IMPLEMENTED

The app now has **three charts** built with Recharts:

1. **Balance Trend Chart** (Cash Flow Calendar page) - Custom SVG implementation
2. **Forecast Balance Chart** (Dashboard) - Recharts area chart showing projected balance
3. **Payoff Timeline Chart** (Debt Payoff Planner) - Recharts area chart with milestones

### Implemented Charts

| Location | Chart Type | Status | Notes |
|----------|------------|--------|-------|
| **Dashboard Home** | Forecast balance trend | ✅ Done | Area chart with lowest point marker, safety buffer line |
| **Debt Payoff Planner** | Payoff timeline | ✅ Done | Area chart with card payoff milestone reference lines |
| **Cash Flow Calendar** | Balance trend | ✅ Done | Custom SVG chart (pre-existing) |

### Future Chart Opportunities

| Location | Chart Type | Purpose | Priority | Effort |
|----------|------------|---------|----------|--------|
| **Debt Payoff Planner** | Stacked bar (balance by card) | Show which cards get paid when | Medium | Medium |
| **Accounts Page** | Pie/donut chart | Account balance distribution | Medium | Low |
| **CC Payment Simulator** | Balance over time | Show balance projection with different payment amounts | Medium | Medium |
| **Bills Page** | Category spending bar chart | Monthly expenses by category | Medium | Low |
| **Dashboard Home** | Income vs Expenses | Monthly comparison | Medium | Medium |
| **Reports Page** | Multiple charts | Comprehensive financial reports | Low | High |

### Library in Use

**Recharts** is now installed and in use:
- Most popular React charting library
- Great TypeScript support
- Works well with Tailwind CSS
- Lightweight and performant
- Easy to customize colors to match dark theme

### Code Structure (Current)

```
components/
  charts/
    forecast-balance-chart.tsx   ✅ Done
    payoff-timeline-chart.tsx    ✅ Done
```

### Design Patterns Established

- Use `useId()` hook for unique gradient IDs (prevents conflicts with multiple charts)
- Proper negative currency formatting: `-$500` not `$-500`
- Always include critical data points in sampling (e.g., lowest balance day)
- Check Y-axis domain before rendering reference lines
- Use cardId (not cardName) for React keys to prevent collisions
- Currency passed as prop, not hardcoded
- Dark theme colors: zinc-900 backgrounds, zinc-700 grid lines
- Color scheme: Teal for positive, Rose for negative, Amber for warnings/debt

See `docs/charts-roadmap.md` for detailed implementation patterns and future plans.

---

## 8. Bank Sync Implementation Strategy

### Executive Summary

**Recommendation: Start with Canada via Flinks, expand to US later.**

Canada offers a clearer regulatory path, better provider support, and lower implementation risk compared to the uncertain US market.

### US vs Canada Comparison

| Factor | Canada | US | Winner |
|--------|--------|-----|--------|
| **Regulatory clarity** | Clear framework (CDBA launching 2026) | Uncertain (Section 1033 being contested) | 🇨🇦 Canada |
| **Provider landscape** | Flinks dominates, purpose-built for Canadian banks | Fragmented, banks charging for API access | 🇨🇦 Canada |
| **Bank cooperation** | National Bank of Canada backs Flinks | Banks actively fighting regulations | 🇨🇦 Canada |
| **Timeline certainty** | Phase 1 (read access) confirmed for 2026 | Compliance dates stayed, rule may be withdrawn | 🇨🇦 Canada |
| **Market size** | Smaller | Larger | 🇺🇸 US |

### Regulatory & Compliance Requirements

#### Canada

**Current State:**
- Consumer-Driven Banking Act (CDBA) passed in 2024
- Bank of Canada designated as regulator
- Phase 1 (read access): **2026**
- Phase 2 (write access): **mid-2027**

**Requirements for Fintechs:**
| Requirement | Details |
|-------------|---------|
| **Accreditation** | Apply with Bank of Canada, demonstrate compliance |
| **Annual fee** | Required, listed in public registry |
| **Consumer consent** | Express consent with clear communication |
| **Data deletion** | Must support consent withdrawal and deletion requests |
| **Screen scraping** | Will be prohibited once framework is live |
| **Privacy policy** | PIPEDA-compliant |
| **Security safeguards** | Documentation required for accreditation |

#### United States

**Current State:**
- CFPB Section 1033 "Open Banking" rule set for January 2025
- Rule is **being contested in court** - CFPB moved to withdraw it (May 2025)
- JPMorgan now charging Plaid for API access (September 2025)
- No standardized pricing or access requirements

**Requirements for Fintechs:**
| Requirement | Details |
|-------------|---------|
| **GLBA compliance** | Gramm-Leach-Bliley Act data security |
| **State privacy laws** | CCPA, CPRA (California), VCDPA (Virginia), CPA (Colorado) |
| **BSA/AML/KYC** | If handling transactions |
| **Data-sharing agreements** | Required with aggregators |
| **Privacy policy** | Disclose use of third-party aggregators |
| **Terms of service** | Update required |

### Provider Options

#### For Canada: Flinks (Recommended)

| Aspect | Details |
|--------|---------|
| **Coverage** | 15,000+ institutions (all major Canadian banks) |
| **Backing** | Majority owned by National Bank of Canada |
| **Ease of use score** | 9.1/10 (vs Plaid's 8.5) |
| **Support quality** | 8.5/10 (vs Plaid's 7.4) |
| **Open Banking readiness** | Collaborated with National Bank on Open Banking Environment (OBE) |
| **Integration time** | ~2-4 weeks |

#### For US: Plaid

| Aspect | Details |
|--------|---------|
| **Coverage** | 12,000+ US institutions |
| **Market position** | Industry leader |
| **Integration time** | 2-4 weeks |
| **Complication** | Banks starting to charge for API access |

#### Alternatives

| Provider | Best For | Notes |
|----------|----------|-------|
| **MX** | Data enhancement | Superior categorization, 13K+ institutions |
| **Yodlee** | Enterprise/global | 19K+ institutions, higher cost |
| **Finicity** | Verification | Owned by Mastercard |

### Cost Analysis

#### Plaid Pricing (US)

| Tier | Per-Connection Cost | Monthly Minimum |
|------|---------------------|-----------------|
| 0-1,000 connections | $1.50-$2.00/link | None (pay-as-you-go) |
| 1,000-10,000 | $1.00-$1.50/link | ~$500 |
| 10,000-50,000 | $0.60-$1.00/link | ~$3,000 |
| 50,000+ | $0.30-$0.60/link | Negotiated |

#### Estimated Costs by Stage

| Stage | Users | Plaid (US) | Yodlee (US) |
|-------|-------|------------|-------------|
| Early | 1K | ~$500/mo | $5K+/mo minimum |
| Growth | 5K | $2.5K-$5K/mo | $8K-$15K/mo |
| Scale | 50K+ | Negotiated | Negotiated |

**Annual costs at 5K users:** $30K-$65K (Plaid) vs $100K-$200K (Yodlee)

**Negotiation tip:** Mentioning alternatives (MX, Finicity) can reduce Plaid quotes by 20-30%.

### Implementation Roadmap

#### Phase 1: Canada Launch (Recommended First)

1. **Integrate Flinks API**
   - Contact Flinks for pricing and onboarding
   - Implement OAuth-based bank connection flow
   - Build account selection UI
   - Handle token refresh and connection maintenance

2. **Implement Consent Flow**
   - Explicit opt-in with clear explanation
   - Consent withdrawal support
   - Data deletion capability
   - Audit logging

3. **Update Legal Documents**
   - Privacy policy (PIPEDA compliance)
   - Terms of service update
   - Data processing documentation

4. **Feature Integration**
   - Sync account balances to existing accounts
   - Import transactions for categorization
   - Real-time balance updates in forecast

5. **Pricing Tier**
   - Add as Pro feature initially
   - Evaluate standalone pricing later

#### Phase 2: US Expansion (When Regulatory Clarity Improves)

1. **Add Plaid integration**
   - Parallel to Flinks, same UI patterns
   - Handle US-specific requirements (tokenized account numbers at Chase, PNC, US Bank)

2. **State-specific compliance**
   - CCPA consent flows for California users
   - State-by-state privacy requirement mapping

3. **Monitor Section 1033**
   - Track court case outcomes
   - Adjust strategy based on final rule status

### Compliance Checklist

| Requirement | Canada | US | Status |
|-------------|--------|-----|--------|
| Privacy policy update | ✅ Required (PIPEDA) | ✅ Required (CCPA, etc.) | ⬜ TODO |
| Consent mechanism | ✅ Express consent | ✅ Required | ⬜ TODO |
| Data deletion support | ✅ Required by CDBA | ✅ Required by CCPA | ⬜ TODO |
| Security safeguards | ✅ Accreditation requirement | ✅ GLBA compliance | ⬜ TODO |
| Aggregator disclosure | ✅ Required | ✅ Required | ⬜ TODO |
| SOC2 certification | Recommended | Recommended | ⬜ Consider |
| Terms of service update | ✅ Required | ✅ Required | ⬜ TODO |

### Why Canada First?

1. **Clearer regulatory path** — CDBA is law, timeline is set
2. **Better provider support** — Flinks purpose-built for Canadian banks, higher satisfaction scores
3. **Lower risk** — US regulatory landscape is in chaos
4. **Test market** — Validate bank sync demand with Canadian users first
5. **Easier expansion** — Flinks also covers US institutions if needed

### Resources

**Canada:**
- [CDBA Framework (Budget 2025)](https://www.canada.ca/en/department-finance/programs/financial-sector-policy/open-banking-implementation/budget-2025-canadas-framework-for-consumer-driven-banking.html)
- [Flinks Open Banking](https://www.flinks.com/blog/open-banking-canada-2026-launch-fintech-institutions)
- [McMillan: Canada Open Banking Updates](https://mcmillan.ca/insights/publications/canadas-open-banking-framework-key-updates-from-budget-2025/)

**United States:**
- [CFPB Section 1033](https://www.congress.gov/crs-product/IF13117)
- [Plaid Documentation](https://plaid.com/docs/institutions/)
- [US Fintech Regulations 2025](https://iclg.com/practice-areas/fintech-laws-and-regulations/usa)

**Providers:**
- [Flinks vs Plaid Comparison](https://snaptrade.com/blogs/flinks-plaid-snaptrade)
- [Plaid Pricing Analysis](https://www.getmonetizely.com/articles/plaid-vs-yodlee-how-much-will-financial-data-apis-cost-your-fintech-in-2025)

---

## 9. Landing Page Trust & Conversion Optimization

### Context

Analysis of Flow by Acertine (flow.acertine.com) revealed trust-building elements that improve conversion. With only 13 early users currently, focus is on collecting testimonials first, then adding social proof.

### Current State (January 2026)

| Element | Flow (Acertine) | Us | Status |
|---------|-----------------|-----|--------|
| Social proof stats | "£395K+ processed" | None | ⬜ Need real data first |
| User testimonials | 5-star reviews section | None | ⬜ Need to collect |
| Quantified value props | "Save 90% of your time" | Partial | ⬜ Can improve |
| Trust badges | HMRC, ICO, GDPR | None | N/A (not UK-focused) |
| Lifetime deal option | Yes (VIP tier) | Yes ($149) | ✅ Implemented |
| Quotes feature | Yes | Yes | ✅ Implemented |

### Action Plan

#### Phase 1: Collect Testimonials (Immediate)

**Goal:** Email 13 existing users to collect testimonials.

**Email Template:** See `docs/email-templates/testimonial-request.md`

**What to ask for:**
- Permission to use their feedback publicly
- Their name/business (or anonymous option)
- What problem the app solved for them
- Star rating (1-5)
- Optional: photo/avatar

**Target:** Get 3-5 usable testimonials.

#### Phase 2: Add Testimonials to Landing Page

Once collected, add testimonials section to landing page:
- Below "Four pillars" section or above pricing
- Show name, business type (e.g., "Freelance Designer")
- Star rating
- Short quote (1-2 sentences max)

#### Phase 3: Quantified Value Props

Update landing page copy with specific claims:
- "See 365 days ahead in under 3 minutes"
- "Average setup time: 3 minutes"
- "Spot low balance days before they happen"

#### Phase 4: Social Proof Stats (When Data Exists)

Once meaningful usage exists, add stats like:
- "X days of cash flow projected"
- "Y invoices sent"
- "Z quotes converted to invoices"

Query examples:
```sql
-- Total projected days
SELECT SUM(365) FROM subscriptions WHERE tier = 'pro'
UNION
SELECT SUM(90) FROM subscriptions WHERE tier = 'free';

-- Total invoices sent
SELECT COUNT(*) FROM invoices WHERE status != 'draft';

-- Total quotes converted
SELECT COUNT(*) FROM quotes WHERE converted_invoice_id IS NOT NULL;
```

#### Phase 5: Lifetime Deal Option ✅ IMPLEMENTED

One-time "Lifetime" tier is now live:
- **Price:** $149 one-time payment
- **Access:** Permanent Pro features, no renewals
- **Appeals to:** Budget-conscious freelancers who prefer upfront payment

**Implementation Details:**
- Stripe one-time payment via `createLifetimeCheckoutSession()` action
- Webhook handler for `checkout.session.completed` with `type: 'lifetime_purchase'`
- Automatic cancellation of existing Pro subscription with prorated refund
- Database tier set to 'lifetime' with 100-year expiration
- Promotional banner on Dashboard, Invoices, Quotes, Settings pages
- Banner dismissible with 7-day localStorage cooldown
- Subscription status shows Sparkles icon and "Lifetime access — no renewal needed"

**Business rationale:**
- Break-even vs $7.99/mo: ~19 months
- Generates upfront cash for business
- Reduces churn (lifetime users are locked in)
- Competitive with Flow ($200-300) and other lifetime deals in market

### Priority Order

1. **Testimonials** — High impact, just need to email users
2. **Quantified value props** — Copy changes only
3. **Social proof stats** — Need more users first
4. ~~**Lifetime deal**~~ — ✅ Implemented

---

## 10. Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| Jan 2026 | Stay B2C focused | Product-market fit with freelancers, B2B requires different go-to-market |
| Jan 2026 | PWA over native app | Already works on iOS, native adds complexity without clear user demand |
| Jan 2026 | AI categorization as first AI feature | Low effort, high value, reduces friction |
| Jan 2026 | Client payment tracking as next big feature | Addresses core freelancer pain point, unique differentiator |
| Jan 2026 | Recharts for data visualization | Popular, TypeScript support, Tailwind-compatible, lightweight |
| Jan 2026 | Debt payoff timeline chart as first new chart | High value, enhances newly built feature |
| Jan 2026 | Implemented forecast balance chart + payoff timeline chart | First 2 Recharts components complete with 11 bug fixes |
| Jan 2026 | Established chart design patterns | useId() for gradients, proper currency formatting, sampling guarantees |
| Jan 2026 | Prioritize competitor migration strategy | Mint exodus + YNAB price complaints create acquisition opportunity |
| Jan 2026 | Added Neontra to competitive analysis | Moderate competitor with SOC2, bank sync, native apps; we differentiate on freelancer focus |
| Jan 2026 | Bank sync: Start with Canada via Flinks | Clearer regulatory path (CDBA), better provider support, lower risk than uncertain US market |
| Jan 2026 | Delay US bank sync until regulatory clarity | Section 1033 being contested, JPMorgan charging for API access, wait for stability |
| Jan 2026 | Implemented Quotes feature | Learned from Flow/Acertine competitor analysis; quotes → invoice workflow |
| Jan 2026 | Prioritize testimonial collection | Only 13 users, need social proof before adding stats to landing page |
| Jan 2026 | Implemented lifetime deal at $149 | Competitive with Flow ($200-300), generates upfront cash, reduces churn |

---

**Document Version:** 1.5
**Last Updated:** January 29, 2026
**Next Review:** February 2026
