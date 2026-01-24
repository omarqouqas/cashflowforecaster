# Pay Yourself a Salary Feature - Implementation Plan

## Overview

Enable freelancers to set up recurring salary transfers from their business account to their personal account. This is a **Pro-only** feature addressing business/personal separation.

**Problem it solves:** Freelancers have irregular income but need predictable personal spending. This feature lets them formally separate business income from their personal "paycheck" by scheduling recurring transfers.

---

## UI Location

**New dedicated page:** `/dashboard/salary`

- Follows existing pattern (Income, Bills, Invoices all have dedicated pages)
- Add "Salary" link to navigation after "Bills"
- Free users see the link but get an upgrade prompt when clicking

---

## Database Changes

### 1. New Table: `salary_transfers`

**Migration:** `supabase/migrations/[timestamp]_add_salary_transfers.sql`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users |
| name | VARCHAR(100) | Default "My Salary" |
| amount | DECIMAL(12,2) | Transfer amount |
| frequency | VARCHAR(20) | weekly, biweekly, semi-monthly, monthly |
| next_transfer_date | DATE | Next scheduled transfer |
| from_account_id | UUID | Business account (source) |
| to_account_id | UUID | Personal account (destination) |
| is_active | BOOLEAN | Default true |
| created_at, updated_at | TIMESTAMPTZ | Timestamps |

**Constraint:** `from_account_id != to_account_id`

```sql
CREATE TABLE salary_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL DEFAULT 'My Salary',
  amount DECIMAL(12, 2) NOT NULL,
  frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('weekly', 'biweekly', 'semi-monthly', 'monthly')),
  next_transfer_date DATE NOT NULL,
  from_account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  to_account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT different_accounts CHECK (from_account_id != to_account_id)
);

-- RLS policies
ALTER TABLE salary_transfers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own salary transfers"
  ON salary_transfers FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own salary transfers"
  ON salary_transfers FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own salary transfers"
  ON salary_transfers FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own salary transfers"
  ON salary_transfers FOR DELETE USING (auth.uid() = user_id);
```

### 2. Extend Accounts Table

**Migration:** `supabase/migrations/[timestamp]_add_account_purpose.sql`

Add column to distinguish business vs personal accounts:

```sql
ALTER TABLE accounts
ADD COLUMN IF NOT EXISTS account_purpose VARCHAR(20) DEFAULT 'general'
CHECK (account_purpose IN ('business', 'personal', 'general'));
```

---

## File Structure

```
app/dashboard/salary/
  page.tsx                    # List page (server component)
  new/page.tsx                # Create form (client component)
  [id]/edit/page.tsx          # Edit form (client component)

components/salary/
  salary-content.tsx          # List with cards
  salary-card.tsx             # Individual transfer card
  delete-salary-button.tsx    # Delete with confirmation

lib/calendar/
  calculate-salary.ts         # Calculate transfer occurrences
```

---

## Calendar Integration

### How Salary Transfers Appear on the Calendar

Each salary transfer generates **two transactions** per occurrence:

1. **Outflow** (appears as a bill) from `from_account_id` (business account)
2. **Inflow** (appears as income) to `to_account_id` (personal account)

This accurately reflects that money is moving between accounts, not entering or leaving the user's overall finances.

### New File: `lib/calendar/calculate-salary.ts`

```typescript
interface SalaryRecord {
  id: string;
  name: string;
  amount: number;
  frequency: 'weekly' | 'biweekly' | 'semi-monthly' | 'monthly';
  next_transfer_date: string;
  from_account_id: string;
  to_account_id: string;
  is_active: boolean;
}

export function calculateSalaryOccurrences(
  salary: SalaryRecord,
  startDate: Date,
  endDate: Date
): { outflows: Transaction[]; inflows: Transaction[] } {
  // Returns paired transactions for calendar
}
```

### Modify: `lib/calendar/generate.ts`

1. Fetch `salary_transfers` for user
2. Call `calculateSalaryOccurrences()` for each active transfer
3. Add outflows to bill occurrences
4. Add inflows to income occurrences

### Modify: `lib/calendar/types.ts`

Add to Transaction interface:

```typescript
transfer_id?: string;
transfer_type?: 'outflow' | 'inflow';
```

---

## Pro Feature Gating

### `lib/stripe/config.ts`

Add to tier limits:

```typescript
limits: {
  // existing limits...
  salaryEnabled: boolean;
}
```

- Free tier: `salaryEnabled: false`
- Pro/Premium: `salaryEnabled: true`

### `lib/stripe/feature-gate.ts`

Add function:

```typescript
export async function canUseSalary(userId: string): Promise<FeatureGateResult> {
  const tier = await getUserTier(userId);
  const limits = PRICING_TIERS[tier].limits;

  if (!limits.salaryEnabled) {
    return { allowed: false, reason: 'feature_disabled', tier };
  }

  return { allowed: true, tier };
}
```

### `components/subscription/upgrade-prompt.tsx`

Add 'salary' feature copy:

```typescript
salary: {
  title: "Pay Yourself a Salary is a Pro feature",
  description: "Set up recurring salary transfers from your business account to your personal account for cleaner finances.",
},
```

---

## Form Fields

### Salary Transfer Form

| Field | Type | Validation |
|-------|------|------------|
| Name | text | Required, max 100 chars, default "My Salary" |
| Amount | number | Required, must be positive |
| Frequency | select | weekly, biweekly, semi-monthly, monthly |
| Next Transfer Date | date picker | Required |
| From Account | select | Required, labeled "Business Account" |
| To Account | select | Required, must be different from source |
| Is Active | checkbox | Default true |

### Validation Schema (Zod)

```typescript
const salarySchema = z.object({
  name: z.string().min(1).max(100).default('My Salary'),
  amount: z.coerce.number().positive('Amount must be positive'),
  frequency: z.enum(['weekly', 'biweekly', 'semi-monthly', 'monthly']),
  next_transfer_date: z.string().min(1, 'Transfer date is required'),
  from_account_id: z.string().uuid('Please select a business account'),
  to_account_id: z.string().uuid('Please select a personal account'),
  is_active: z.boolean().default(true),
}).refine(data => data.from_account_id !== data.to_account_id, {
  message: 'Source and destination accounts must be different',
  path: ['to_account_id'],
});
```

---

## Implementation Sequence

### Phase 1: Database (2 migrations)
1. Create `salary_transfers` table with RLS policies
2. Add `account_purpose` column to accounts table

### Phase 2: Calendar Logic (3 files)
3. Create `lib/calendar/calculate-salary.ts`
4. Update `lib/calendar/types.ts` - add transfer fields
5. Update `lib/calendar/generate.ts` - integrate salary transfers

### Phase 3: Feature Gating (3 files)
6. Update `lib/stripe/config.ts` - add salaryEnabled
7. Update `lib/stripe/feature-gate.ts` - add canUseSalary
8. Update `components/subscription/upgrade-prompt.tsx` - add copy

### Phase 4: Account Updates (2 files)
9. Update `app/dashboard/accounts/new/page.tsx` - add purpose field
10. Update `app/dashboard/accounts/[id]/edit/page.tsx` - add purpose field

### Phase 5: Salary Pages (6 files)
11. Create `app/dashboard/salary/page.tsx` - list page
12. Create `app/dashboard/salary/new/page.tsx` - create form
13. Create `app/dashboard/salary/[id]/edit/page.tsx` - edit form
14. Create `components/salary/salary-content.tsx` - list component
15. Create `components/salary/salary-card.tsx` - card component
16. Create `components/salary/delete-salary-button.tsx` - delete button

### Phase 6: Navigation (1 file)
17. Update `components/dashboard/nav.tsx` - add Salary link

**Total: ~17 files to create/modify**

---

## Critical Files to Reference (Patterns)

| File | What to Copy |
|------|--------------|
| `lib/calendar/calculate-bills.ts` | Occurrence calculation logic |
| `lib/calendar/generate.ts` | Where to integrate salary transfers |
| `lib/stripe/config.ts` | Tier limits structure |
| `app/dashboard/income/new/page.tsx` | Form structure, validation, gating |
| `app/dashboard/bills/page.tsx` | List page pattern |
| `components/dashboard/nav.tsx` | Navigation structure |

---

## Verification Checklist

- [ ] Migrations run successfully
- [ ] Free users see upgrade prompt on `/dashboard/salary`
- [ ] Pro users can create salary transfers
- [ ] Salary appears on calendar as both income (personal) and bill (business)
- [ ] Account purpose field works in account forms
- [ ] Different frequencies calculate correctly
- [ ] Editing and deleting salary transfers works
- [ ] Navigation shows Salary link on desktop and mobile

---

## Future Enhancements (Not in MVP)

- Multiple salary transfers (different amounts to different accounts)
- Recommended salary calculator based on income history
- Auto-adjustment when income drops below threshold
- Integration with tax tracking (salary as business expense)
