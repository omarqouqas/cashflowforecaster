-- Add emergency fund tracking columns to user_settings
ALTER TABLE user_settings
ADD COLUMN IF NOT EXISTS emergency_fund_enabled BOOLEAN DEFAULT false;

ALTER TABLE user_settings
ADD COLUMN IF NOT EXISTS emergency_fund_goal_months INTEGER DEFAULT 3;

ALTER TABLE user_settings
ADD COLUMN IF NOT EXISTS emergency_fund_account_id UUID REFERENCES accounts(id) ON DELETE SET NULL;

-- Add comments for documentation
COMMENT ON COLUMN user_settings.emergency_fund_enabled IS 'Whether emergency fund tracking is enabled for this user';
COMMENT ON COLUMN user_settings.emergency_fund_goal_months IS 'Target months of expenses to save (typically 3, 6, or 12)';
COMMENT ON COLUMN user_settings.emergency_fund_account_id IS 'Optional: specific savings account designated for emergency fund. If null, uses total balance across all accounts.';
