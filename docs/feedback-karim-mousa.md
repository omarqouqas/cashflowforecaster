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

**Status:** Not implemented - requires design consideration

---

## Settings Page

### Issue: Organization
- App-specific settings and profile-specific feature toggles are mixed together
- Too many separate save actions

### Suggested Improvements
1. Separate app settings from profile/feature toggles
2. Combine "minimum balance" with "low limit warning toggle" under one feature to streamline saving

**Status:** Not implemented

---

## Emergency Fund Feature

### Issue: Account Treatment
- Currently treats any money in the account as the emergency fund
- Should be a separate reserve that's "not available to spend"
- Emergency fund should be excluded from spendable balance calculations

**Status:** Not implemented - feature enhancement needed

---

## AI Chat Feature

### Issue: Configuration Error
- User encountered "AI not configured" error when using chat feature

**Status:** Bug - needs investigation

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

**Status:** Partially addressed - sidebar navigation implementation in progress

---

## "Can I Afford It?" Page

### Issue: Information Display
- The way information is presented is confusing

### Suggested Improvement
- Add a "When can I afford it?" option/view

**Status:** Not implemented

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
| Settings | Mixed settings types, too many saves | Separate app/profile settings, combine related toggles | Not implemented |
| Emergency Fund | Treats all account money as emergency fund | Make it a separate reserve excluded from spending | Not implemented |
| AI Chat | "AI not configured" error | Debug configuration | Bug |
| Navigation | Too many items, paid tools hidden | Simplify menu, highlight premium features | In progress |
| Dashboard | Needs own menu item | Access via logo click | In progress |
| Can I Afford It? | Confusing display | Add "When can I afford it?" | Not implemented |
| Tax Calculation | Taxes in available to spend | Exclude taxes based on income type | Not implemented |

---

## Screenshot Reference

User provided screenshot showing calendar view with red/orange color scheme issue - tiles showing balance amounts with colored backgrounds and indicator dots that are hard to distinguish.

---

## Priority Recommendations

1. **High:** Fix AI chat configuration issue (bug)
2. **High:** Simplify navigation and highlight premium features (in progress)
3. **Medium:** Redesign calendar tiles to reduce visual clutter
4. **Medium:** Reorganize settings page
5. **Low:** Add "When can I afford it?" feature
6. **Low:** Implement proper emergency fund handling
7. **Low:** Tax calculation in onboarding
