# SEO, AEO & Landing Page Conversion Audit

**Date:** January 23, 2026
**Scope:** Analysis of recent code changes (last 7 days) and landing page optimization

---

## SEO & AEO Analysis

### Current SEO Setup (Good Foundation)

**Strengths:**
- Proper meta tags with title, description, keywords on `app/page.tsx`
- Canonical URL set (`https://cashflowforecaster.io`)
- OpenGraph and Twitter cards configured
- JSON-LD structured data (SoftwareApplication schema)
- FAQPage schema in FAQ section
- Sitemap with proper priorities
- robots.ts blocking dashboard/api routes appropriately

### Issues to Address

| Issue | Location | Recommendation |
|-------|----------|----------------|
| **Inconsistent meta description** | `layout.tsx` says "60 days" but `page.tsx` says "365 days" | Update `layout.tsx` to match "365 days" |
| **Canonical URL mismatch** | `robots.ts` uses non-www, `sitemap.ts` uses www | Standardize to one (recommend non-www: `cashflowforecaster.io`) |
| **Missing OG image** | `page.tsx` has no `images` in OpenGraph | Add OG image for better social sharing |
| **FAQ content outdated** | First FAQ answer mentions "next 60 days" | Update to clarify Pro gets 365 days |
| **New features not in keywords** | Invoice branding, payment links, low balance alerts | Add keywords like "invoice payment links", "stripe invoicing freelancers" |

### AEO (Answer Engine Optimization)

**Strengths:**
- FAQPage schema properly implemented
- Questions are phrased naturally (voice-search friendly)
- Clear, concise answers

**Gaps for AI Search Engines:**
1. **Missing "How-To" content** - No HowTo schema for the "How it Works" section
2. **No comparison schema** - The `/compare` pages could benefit from structured comparison data
3. **Missing "What is" definitions** - Add definitions for terms like "Safe to Spend", "Runway Collect"

---

## Landing Page Conversion Analysis

### Hero Section
**Rating: Strong**

- Clear headline addressing pain point ("Stop Guessing If You Can Cover Rent")
- Value props highlighted (Safe to Spend, 365 days)
- Social proof present (47% freelancer stat)
- CTA is clear with friction reducers ("No credit card", "Free forever")

**Suggestions:**
- Consider adding a small testimonial or user count near CTA

### How It Works Section
**Rating: Good**

- 4-step flow is clear and scannable
- No changes needed

### Features Section (Four Pillars)
**Rating: Strong**

**Recent features NOT reflected on landing page:**

| New Feature (Last 7 Days) | Currently on Landing Page? |
|---------------------------|---------------------------|
| Invoice branding (logo, business name) | **No** - could mention in "Get Paid Faster" |
| Stripe payment links | **Partially** - mentions "one-click payments" but not "payment links" |
| Low balance alerts | **Yes** - mentioned |
| Emergency fund tracker | **No** - this could be a selling point |

### Who Is This For Section
**Rating: Good**

- Clear personas (designers, writers, consultants, devs)
- Good exclusion ("Not built for: Businesses with full-time bookkeepers")
- No changes needed

### Pricing Section
**Rating: Strong**

- Clear Free vs Pro differentiation
- Billing toggle with yearly discount
- Trust elements (cancel anytime, money-back guarantee)

**Minor suggestion:** Pro features list could mention "Invoice branding with custom logo"

### FAQ Section
**Rating: Strong**

- 9 well-written questions
- Schema markup present

**Updates needed:**
- First FAQ answer says "next 60 days" - should clarify Pro gets 365 days
- No FAQ about "payment links" or "Stripe Connect" (new Pro features)

---

## Recommended Changes

### High Priority (SEO/AEO) - COMPLETED Jan 23, 2026

- [x] Fix canonical URL mismatch between `sitemap.ts` (uses www) and `robots.ts` (uses non-www)
  - File: `app/sitemap.ts` - changed to `https://cashflowforecaster.io`
- [x] Update `layout.tsx` description from "60 days" to "365 days"
  - File: `app/layout.tsx` - updated meta description and OG/Twitter descriptions
- [x] Add OG image to `page.tsx` OpenGraph config
  - File: `app/page.tsx` - added `hero-dashboard.png` to OpenGraph and Twitter cards

### Medium Priority (Landing Page Content) - COMPLETED Jan 23, 2026

- [x] Add "Invoice branding with custom logo" to the "Get Paid Faster" feature list
  - File: `app/page.tsx` - added "Custom branding with your logo and business name"
- [x] Update FAQ answer about "60 days" to clarify Pro gets 365 days
  - File: `components/landing/faq-section.tsx` - updated first and third FAQ answers
- [x] Add a new FAQ about Stripe payment links for invoices
  - File: `components/landing/faq-section.tsx` - added "How do clients pay my invoices?" FAQ

### Low Priority (Nice to Have) - COMPLETED Jan 23, 2026

- [x] Add HowTo schema to "How it Works" section for AEO
  - File: `app/page.tsx` - added HowTo JSON-LD schema with 4 steps
- [x] Add keywords for new features (payment links, invoice branding) to meta keywords
  - File: `app/page.tsx` - added 5 new keywords (invoice payment links, stripe invoicing, branding, emergency fund)
- [x] Add emergency fund tracker to features section
  - File: `app/page.tsx` - added as third card in "More ways we help" with progress bar mockup
- [x] Add social proof near hero CTA
  - File: `app/page.tsx` - added avatar stack with "Trusted by designers, writers & developers"

---

## Files Referenced

- `app/page.tsx` - Main landing page
- `app/layout.tsx` - Root layout with default meta
- `app/sitemap.ts` - Sitemap configuration
- `app/robots.ts` - Robots configuration
- `components/landing/faq-section.tsx` - FAQ content and schema
- `components/pricing/pricing-section.tsx` - Pricing tier configuration

---

## Recent Commits Reviewed (Last 7 Days)

Key feature additions that may need landing page reflection:
- Invoice branding with logo upload and business name
- Stripe payment links for invoices (Pro feature)
- Low balance alerts
- Emergency fund tracker
- Simplified 2-step onboarding
- Interactive hero dashboard on landing page