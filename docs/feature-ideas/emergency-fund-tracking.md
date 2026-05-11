# Emergency Fund Tracking Feature Spec

**Status:** Draft - For Discussion
**Date:** May 11, 2026
**Origin:** User feedback from Karim Mousa

---

## Problem Statement

Currently, CashCast treats all money in an account as available to spend. Users with emergency funds have no way to:
1. Exclude emergency savings from their "Safe to Spend" calculation
2. Automatically allocate a portion of income to emergency savings
3. Track progress toward an emergency fund goal

This leads to an inflated sense of available money and doesn't support healthy financial habits.

---

## Proposed Solution

### Option A: New Account Type - "Emergency Fund"

Add a new account type specifically for emergency funds that is excluded from spending calculations.

**Pros:**
- Simple mental model - it's just another account
- Works with existing account infrastructure
- Clear separation in UI

**Cons:**
- Requires users to manually transfer money
- Some users may have emergency fund within their main savings account

### Option B: "Reserve" Flag on Any Account

Allow any account to be marked as a "reserve" account (emergency fund, tax savings, etc.)

**Pros:**
- Flexible - works with existing account structures
- User can have multiple reserve purposes
- Doesn't require new account creation

**Cons:**
- More complex UI
- May confuse users about what counts as "spendable"

### Option C: Virtual "Buckets" Within Accounts (Recommended)

Allow users to create virtual allocations within any account, similar to YNAB envelopes.

**Pros:**
- Most flexible approach
- Matches how many people actually manage money (one account, mental buckets)
- Can support multiple goals (emergency fund, vacation, taxes)

**Cons:**
- More complex to implement
- Requires education for users

---

## Recommended Implementation: Hybrid Approach

Combine the best of all options:

### 1. Emergency Fund Account Type
- New account type: `emergency_fund`
- Excluded from "Spendable Balance" and "Safe to Spend" calculations
- Shows in dedicated "Savings" section on Accounts page
- Optional goal amount with progress tracker

### 2. Auto-Contribution Rules
Allow users to set up automatic allocations from income:

```
Rule: "Emergency Fund Contribution"
- Trigger: When income is received
- Amount: 10% of income OR $200 fixed
- From: Primary Checking
- To: Emergency Fund
- Shows on calendar as scheduled transfer
```

### 3. Emergency Fund Tracker Widget
Dashboard widget showing:
- Current balance
- Goal amount (optional)
- Progress percentage
- "Months of expenses covered" (based on average monthly bills)

---

## Database Schema Changes

### New Account Type
```sql
-- Add to account_type enum
ALTER TYPE account_type ADD VALUE 'emergency_fund';
```

### Auto-Contribution Rules Table
```sql
CREATE TABLE auto_contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,

  -- Trigger
  trigger_type TEXT NOT NULL, -- 'income_received', 'weekly', 'monthly'
  trigger_income_id UUID REFERENCES income(id), -- specific income or NULL for any

  -- Amount
  amount_type TEXT NOT NULL, -- 'percentage' or 'fixed'
  amount_value DECIMAL(12,2) NOT NULL, -- 10 for 10%, or 200 for $200

  -- Destination
  to_account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,

  -- Status
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Emergency Fund Goals Table
```sql
CREATE TABLE emergency_fund_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,

  goal_type TEXT NOT NULL, -- 'fixed_amount' or 'months_of_expenses'
  goal_value DECIMAL(12,2) NOT NULL, -- $5000 or 6 (months)

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, account_id)
);
```

---

## UI/UX Design

### Accounts Page Changes

```
┌─────────────────────────────────────────────────┐
│ SPENDING ACCOUNTS                               │
├─────────────────────────────────────────────────┤
│ 💳 Main Checking              $2,500.00         │
│ 💳 Secondary Checking           $800.00         │
│                                                 │
│ Total Spendable:              $3,300.00         │
├─────────────────────────────────────────────────┤
│ SAVINGS & RESERVES                              │
├─────────────────────────────────────────────────┤
│ 🛡️ Emergency Fund             $4,200.00         │
│    Goal: $6,000 (70% complete)                  │
│    ████████████████░░░░░░░                      │
│    ≈ 3.2 months of expenses                     │
│                                                 │
│ 🏖️ Vacation Fund                $850.00         │
│    Goal: $2,000 (42% complete)                  │
└─────────────────────────────────────────────────┘
```

### Auto-Contribution Setup

```
┌─────────────────────────────────────────────────┐
│ SET UP AUTO-CONTRIBUTION                        │
├─────────────────────────────────────────────────┤
│                                                 │
│ Name: Emergency Fund Contribution               │
│                                                 │
│ When I receive:  [Any Income ▼]                 │
│                                                 │
│ Automatically save:                             │
│   ○ Fixed amount    ● Percentage                │
│   [    10    ] %                                │
│                                                 │
│ To account: [Emergency Fund ▼]                  │
│                                                 │
│ ─────────────────────────────────────────────── │
│ Preview: ~$300/month based on your income       │
│                                                 │
│              [Cancel]  [Save Rule]              │
└─────────────────────────────────────────────────┘
```

### Dashboard Widget

```
┌─────────────────────────────────────────────────┐
│ 🛡️ EMERGENCY FUND                               │
├─────────────────────────────────────────────────┤
│                                                 │
│ $4,200                                          │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━░░░░░░░░░░ 70%    │
│ Goal: $6,000                                    │
│                                                 │
│ ≈ 3.2 months of expenses covered                │
│                                                 │
│ +$300 scheduled this month                      │
│                                                 │
│              [Add Contribution]                 │
└─────────────────────────────────────────────────┘
```

---

## Calendar Integration

Auto-contributions appear on the calendar as transfers:

- Show on income days (if triggered by income)
- Color-coded as transfers (teal/cyan)
- Tooltip shows: "Auto-contribution to Emergency Fund: $300"
- Affects balance calculations (money moves from checking to emergency fund)

---

## Safe to Spend Calculation Changes

Current formula:
```
Safe to Spend = Lowest Balance (14 days) - Safety Buffer
```

New formula:
```
Spendable Balance = Sum of all non-reserve accounts
Safe to Spend = Lowest Spendable Balance (14 days) - Safety Buffer
```

Emergency fund and other reserve accounts are completely excluded from:
- Total Balance display (show separately)
- Safe to Spend calculation
- Low balance warnings (unless they want alerts for the emergency fund itself)

---

## Implementation Phases

### Phase 1: Emergency Fund Account Type (MVP)
- Add `emergency_fund` account type
- Exclude from spendable calculations
- Show in separate "Reserves" section
- Basic goal tracking (fixed amount)

### Phase 2: Auto-Contributions
- Auto-contribution rules table
- UI to create/manage rules
- Calendar integration for scheduled contributions
- Process contributions on income receipt

### Phase 3: Enhanced Tracking
- "Months of expenses covered" calculation
- Dashboard widget
- Progress notifications ("You've reached 3 months of expenses!")
- Multiple reserve account types (tax savings, vacation, etc.)

---

## Questions for Discussion

1. **Should we support multiple reserve types or start with just Emergency Fund?**
   - Tax savings account
   - Vacation fund
   - Down payment savings

2. **Auto-contribution trigger options:**
   - On any income received
   - On specific income source only
   - Weekly/monthly on fixed date
   - Manual only

3. **Goal types:**
   - Fixed amount ($5,000)
   - Months of expenses (3-6 months)
   - Both?

4. **Should auto-contributions be a Pro feature?**
   - Free: Manual emergency fund tracking
   - Pro: Auto-contributions + advanced goals

5. **How should we handle existing users?**
   - Prompt to set up emergency fund during onboarding
   - Suggest converting existing savings account
   - Optional migration wizard

---

## Success Metrics

- % of users who create an emergency fund account
- Average emergency fund goal completion rate
- User retention correlation with emergency fund usage
- Reduction in support tickets about "inflated safe to spend"

---

## References

- Original feedback: `docs/feedback-karim-mousa.md`
- Similar features: YNAB envelopes, Ally Bank buckets, Qapital goals
