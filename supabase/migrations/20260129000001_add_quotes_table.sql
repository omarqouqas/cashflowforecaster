-- ============================================
-- Quotes table for Runway Collect
-- Allows users to create quotes that can be converted to invoices
-- ============================================

-- Create quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Quote identification
  quote_number TEXT NOT NULL,

  -- Client information
  client_name TEXT NOT NULL,
  client_email TEXT,

  -- Quote details
  amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  valid_until DATE NOT NULL,
  description TEXT,

  -- Status tracking: draft -> sent -> viewed -> accepted/rejected/expired
  status TEXT NOT NULL DEFAULT 'draft',

  -- Timestamps for timeline
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,

  -- Link to converted invoice (if accepted and converted)
  converted_invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,

  -- Standard timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT quotes_valid_status CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired')),
  CONSTRAINT quotes_positive_amount CHECK (amount >= 0),
  UNIQUE(user_id, quote_number)
);

-- Enable Row Level Security
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view own quotes" ON quotes;
CREATE POLICY "Users can view own quotes"
  ON quotes FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own quotes" ON quotes;
CREATE POLICY "Users can insert own quotes"
  ON quotes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own quotes" ON quotes;
CREATE POLICY "Users can update own quotes"
  ON quotes FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own quotes" ON quotes;
CREATE POLICY "Users can delete own quotes"
  ON quotes FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_quotes_user_id ON quotes(user_id);
CREATE INDEX IF NOT EXISTS idx_quotes_user_created ON quotes(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_valid_until ON quotes(valid_until) WHERE status NOT IN ('accepted', 'rejected', 'expired');

-- Add comment for documentation
COMMENT ON TABLE quotes IS 'Quotes that can be sent to clients and converted to invoices upon acceptance';

-- ============================================
-- Add currency column to invoices table
-- Allows per-invoice currency (defaults to USD)
-- ============================================

ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'USD';

-- Create index for currency if needed for reporting
CREATE INDEX IF NOT EXISTS idx_invoices_currency ON invoices(currency);
