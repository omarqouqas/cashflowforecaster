# Feedback from Karim Mousa

**Date:** May 11, 2026
**Context:** User testing feedback on CashCast UI/UX and feature suggestions

---

## Calendar View

### Issue: Visual Clutter
- Tiles have background colors AND dots in the top-right corner
- The color scheme makes it difficult to distinguish between red tiles and yellow/orange dots
- Too much visual information competing for attention

### Suggested Improvement
> "Maybe have the tile showing only the money available to spend, once the user hovers over the tile or presses on the tile, it flips and shows the details of money in/out"

**Status:** Not implemented - `day-card.tsx` still uses background colors + status dots. No flip-card functionality exists.

---

## Settings Page

### Issue: Organization
- App-specific settings and profile-specific feature toggles are mixed together
- Too many separate save actions

### Suggested Improvements
1. Separate app settings from profile/feature toggles
2. Combine "minimum balance" with "low limit warning toggle" under one feature to streamline saving

**Status:** Implemented - Settings uses tabbed interface. Safety Buffer and Low Balance Alert are now combined into a single `SafetyBufferAlertForm` component in the Preferences tab with a single save action.

---

## Emergency Fund Feature

### Issue: Account Treatment
- Currently treats any money in the account as the emergency fund
- Should be a separate reserve that's "not available to spend"
- Emergency fund should be excluded from spendable balance calculations

**Status:** Implemented - Emergency fund account is now:
- Excluded from spendable balance in calendar calculations
- Excluded from "Available to Spend" dashboard metrics
- Quick "Set as Emergency Fund" button on all non-credit-card account cards
- Shield badge shows on designated emergency fund account
- Toggle in Edit Account page to add/remove emergency fund designation
- "Safe to Spend" tooltip mentions emergency fund exclusion
- Settings page shows read-only designation with link to Accounts page

---

## AI Chat Feature

### Issue: Configuration Error
- User encountered "AI not configured" error when using chat feature

### Resolution
- AI Chat is now a Pro-only feature
- Free users see a lock icon and upgrade prompt when clicking Ask AI
- Pricing page updated to reflect AI is Pro-only

**Status:** Resolved - AI Chat restricted to Pro users only

---

## Navigation / Menu

### Issues
1. Too many menu items causing confusion
2. Paid tools not visible enough to encourage premium signups
3. Dashboard requires its own menu item instead of being accessible by clicking on "CashCast" logo

### Suggested Improvements
- Reduce number of menu items
- Make paid tools more prominent/visible
- Dashboard accessible by clicking on CashCast logo (remove separate menu item)

**Status:** Resolved - Sidebar navigation implemented with clear sections (Main, Money, Tools), collapsible functionality, Pro features have lock icons, upgrade CTA for free users. Dashboard accessible via logo click AND first menu item.

---

## "Can I Afford It?" Page

### Issue: Information Display
- The way information is presented is confusing
- Impact preview shows repetitive days with no changes
- Messaging says "would cause issues" even when user is already negative

### Suggested Improvement
- Add a "When can I afford it?" option/view
- Context-aware messaging based on current financial state
- Show only meaningful impact data

**Status:** Implemented - Scenario tool now has:
- Context-aware messaging (different text for already-negative vs would-go-negative)
- "When can I afford it?" shows first affordable date with income context (e.g., "after Salary on Jun 19")
- Impact preview only shows expense dates (not empty/unchanged days)
- Fixed messaging when lowest balance date is before expense date (shows expense impact instead)
- Amount input uses comma formatting for thousands (e.g., "5,100" instead of "5100")

---

## Tax Calculation (Onboarding)

### Issue: Tax Component in Available to Spend
- For users with salary or contractor income, taxes should be handled differently
- Tax component should be removed from "available to spend" calculation

### Suggested Flow
- During onboarding, determine if income is salary or contractor
- Automatically account for tax obligations in spendable balance

**Status:** Not implemented - requires onboarding flow changes

---

## Summary Table

| Area | Issue | Suggested Fix | Status |
|------|-------|---------------|--------|
| Calendar | Visual clutter, hard to distinguish colors | Show only balance, flip card for details on hover | Not implemented |
| Settings | Mixed settings types, too many saves | Separate app/profile settings, combine related toggles | Implemented (Safety Buffer + Low Balance Alert combined) |
| Emergency Fund | Treats all account money as emergency fund | Make it a separate reserve excluded from spending | Implemented (excluded from spendable, quick set/edit, tooltip updated) |
| AI Chat | "AI not configured" error | Made Pro-only feature | Resolved |
| Navigation | Too many items, paid tools hidden | Simplify menu, highlight premium features | Resolved |
| Dashboard | Needs own menu item | Access via logo click | Resolved |
| Can I Afford It? | Confusing display | Add "When can I afford it?" | Implemented (with income context, comma formatting) |
| Tax Calculation | Taxes in available to spend | Exclude taxes based on income type | Not implemented |

---

## Screenshot Reference

User provided screenshot showing calendar view with red/orange color scheme issue - tiles showing balance amounts with colored backgrounds and indicator dots that are hard to distinguish.

---

## Priority Recommendations

1. ~~**High:** Fix AI chat configuration issue (bug)~~ **DONE** - Made Pro-only
2. ~~**High:** Simplify navigation and highlight premium features~~ **DONE** - Sidebar with sections, lock icons, upgrade CTA
3. ~~**High:** Emergency fund exclusion from spendable balance~~ **DONE** - Full implementation with quick action button
4. **Medium:** Redesign calendar tiles to reduce visual clutter (flip cards)
5. ~~**Medium:** Combine safety buffer + low balance alert settings (currently in different tabs)~~ **DONE** - Combined into single form
6. ~~**Medium:** Add "When can I afford it?" feature~~ **DONE** - Context-aware messaging + first affordable date
7. **Low:** Tax calculation in onboarding (income type detection)
