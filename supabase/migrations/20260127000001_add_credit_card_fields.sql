-- Migration: Add Credit Card Fields to Accounts
-- Enables credit card cash flow forecasting with APR, limits, and payment scheduling

-- Add credit card specific columns to accounts table
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS credit_limit DECIMAL(12,2);
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS apr DECIMAL(5,2);
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS minimum_payment_percent DECIMAL(4,2) DEFAULT 2.0;
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS statement_close_day INTEGER CHECK (statement_close_day >= 1 AND statement_close_day <= 28);
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS payment_due_day INTEGER CHECK (payment_due_day >= 1 AND payment_due_day <= 28);

-- Add comment for documentation
COMMENT ON COLUMN accounts.credit_limit IS 'Credit limit for credit card accounts';
COMMENT ON COLUMN accounts.apr IS 'Annual Percentage Rate for credit card accounts';
COMMENT ON COLUMN accounts.minimum_payment_percent IS 'Minimum payment as percentage of balance (default 2%)';
COMMENT ON COLUMN accounts.statement_close_day IS 'Day of month when statement closes (1-28)';
COMMENT ON COLUMN accounts.payment_due_day IS 'Day of month when payment is due (1-28)';

-- Create index for credit card accounts for efficient queries
CREATE INDEX IF NOT EXISTS idx_accounts_credit_card
ON accounts(user_id, account_type)
WHERE account_type = 'credit_card';
