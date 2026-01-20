-- Stripe Connect accounts for invoice payment links
-- Allows Pro users to receive payments directly via Stripe

-- Table: stripe_connect_accounts
CREATE TABLE IF NOT EXISTS stripe_connect_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_account_id TEXT NOT NULL UNIQUE,
  account_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'active', 'restricted'
  charges_enabled BOOLEAN DEFAULT FALSE,
  payouts_enabled BOOLEAN DEFAULT FALSE,
  details_submitted BOOLEAN DEFAULT FALSE,
  onboarding_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE stripe_connect_accounts ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only view their own Connect account
DROP POLICY IF EXISTS "Users can view own connect account" ON stripe_connect_accounts;
CREATE POLICY "Users can view own connect account"
  ON stripe_connect_accounts FOR SELECT
  USING (auth.uid() = user_id);

-- Add payment-related columns to invoices table
ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS payment_link_url TEXT,
ADD COLUMN IF NOT EXISTS stripe_checkout_session_id TEXT,
ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'manual', -- 'manual' or 'stripe'
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_stripe_connect_user_id ON stripe_connect_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_checkout_session ON invoices(stripe_checkout_session_id) WHERE stripe_checkout_session_id IS NOT NULL;
