-- Migration: Add Transfers Table
-- Enables account-to-account transfers for cash flow forecasting
-- Key use case: Credit card payments from bank accounts

-- Create transfers table
CREATE TABLE IF NOT EXISTS transfers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  from_account_id UUID REFERENCES accounts(id) ON DELETE CASCADE NOT NULL,
  to_account_id UUID REFERENCES accounts(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  description TEXT,
  transfer_date DATE NOT NULL,
  frequency TEXT NOT NULL DEFAULT 'one-time' CHECK (frequency IN ('one-time', 'weekly', 'biweekly', 'semi-monthly', 'monthly', 'quarterly', 'annually')),
  recurrence_day INTEGER CHECK (recurrence_day >= 1 AND recurrence_day <= 31),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add constraint to prevent transferring to same account
ALTER TABLE transfers ADD CONSTRAINT transfers_different_accounts CHECK (from_account_id != to_account_id);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_transfers_user_id ON transfers(user_id);
CREATE INDEX IF NOT EXISTS idx_transfers_from_account ON transfers(from_account_id);
CREATE INDEX IF NOT EXISTS idx_transfers_to_account ON transfers(to_account_id);
CREATE INDEX IF NOT EXISTS idx_transfers_date ON transfers(transfer_date);
CREATE INDEX IF NOT EXISTS idx_transfers_active ON transfers(user_id, is_active) WHERE is_active = true;

-- Enable Row Level Security
ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own transfers"
  ON transfers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transfers"
  ON transfers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transfers"
  ON transfers FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transfers"
  ON transfers FOR DELETE
  USING (auth.uid() = user_id);

-- Add comments for documentation
COMMENT ON TABLE transfers IS 'Account-to-account transfers for cash flow forecasting';
COMMENT ON COLUMN transfers.from_account_id IS 'Source account (balance decreases)';
COMMENT ON COLUMN transfers.to_account_id IS 'Destination account (balance increases/debt decreases for CC)';
COMMENT ON COLUMN transfers.amount IS 'Transfer amount (always positive)';
COMMENT ON COLUMN transfers.frequency IS 'Recurrence frequency (one-time, weekly, biweekly, semi-monthly, monthly, quarterly, annually)';
COMMENT ON COLUMN transfers.recurrence_day IS 'Day of month for recurring transfers (1-31)';
