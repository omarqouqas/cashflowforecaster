-- ============================================
-- Export history table for Reports feature
-- Tracks user exports with 30-day retention
-- ============================================

CREATE TABLE IF NOT EXISTS exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Export metadata
  name TEXT NOT NULL,
  report_type TEXT NOT NULL,
  format TEXT NOT NULL,

  -- Configuration stored as JSONB for flexibility
  config JSONB DEFAULT '{}',

  -- Export result
  file_url TEXT,
  file_size_bytes INTEGER,
  row_count INTEGER,

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),

  -- Constraints
  CONSTRAINT exports_valid_status CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  CONSTRAINT exports_valid_format CHECK (format IN ('csv', 'excel', 'pdf', 'json')),
  CONSTRAINT exports_valid_report_type CHECK (report_type IN ('monthly_summary', 'category_spending', 'cash_forecast', 'all_data', 'custom'))
);

-- Enable Row Level Security
ALTER TABLE exports ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own exports
DROP POLICY IF EXISTS "Users can view own exports" ON exports;
CREATE POLICY "Users can view own exports"
  ON exports FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own exports" ON exports;
CREATE POLICY "Users can insert own exports"
  ON exports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own exports" ON exports;
CREATE POLICY "Users can update own exports"
  ON exports FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own exports" ON exports;
CREATE POLICY "Users can delete own exports"
  ON exports FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_exports_user_id ON exports(user_id);
CREATE INDEX IF NOT EXISTS idx_exports_user_created ON exports(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_exports_status ON exports(status) WHERE status IN ('pending', 'processing');
CREATE INDEX IF NOT EXISTS idx_exports_expires_at ON exports(expires_at) WHERE expires_at IS NOT NULL;

-- Add comment for documentation
COMMENT ON TABLE exports IS 'Tracks user export history with 30-day retention for re-download capability';
