-- Migration: Fix Credit Card Day Constraints
-- Allow statement_close_day and payment_due_day to be 1-31 (not just 1-28)
-- The application code handles month-end edge cases (e.g., 31st in February becomes 28th/29th)

-- Drop the old constraints
ALTER TABLE accounts DROP CONSTRAINT IF EXISTS accounts_statement_close_day_check;
ALTER TABLE accounts DROP CONSTRAINT IF EXISTS accounts_payment_due_day_check;

-- Add new constraints allowing 1-31
ALTER TABLE accounts ADD CONSTRAINT accounts_statement_close_day_check
  CHECK (statement_close_day >= 1 AND statement_close_day <= 31);
ALTER TABLE accounts ADD CONSTRAINT accounts_payment_due_day_check
  CHECK (payment_due_day >= 1 AND payment_due_day <= 31);

-- Update comments
COMMENT ON COLUMN accounts.statement_close_day IS 'Day of month when statement closes (1-31)';
COMMENT ON COLUMN accounts.payment_due_day IS 'Day of month when payment is due (1-31)';
