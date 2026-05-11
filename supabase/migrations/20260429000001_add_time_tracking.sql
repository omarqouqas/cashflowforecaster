-- Migration: Add time tracking and invoice line items
-- Enables time tracking with timer, manual entry, and invoice integration

-- ============================================
-- 1. Create time_entries table
-- ============================================
CREATE TABLE IF NOT EXISTS time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_name VARCHAR(100) NOT NULL,
  client_name VARCHAR(100),
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  duration_minutes INTEGER,
  hourly_rate DECIMAL(10, 2) NOT NULL DEFAULT 0,
  is_billable BOOLEAN DEFAULT true,
  is_invoiced BOOLEAN DEFAULT false,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE time_entries IS 'Time tracking entries for freelance work';
COMMENT ON COLUMN time_entries.duration_minutes IS 'Calculated duration in minutes (end_time - start_time)';
COMMENT ON COLUMN time_entries.is_invoiced IS 'Whether this entry has been included in an invoice';

-- Indexes for time_entries
CREATE INDEX IF NOT EXISTS idx_time_entries_user_id ON time_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_invoice_id ON time_entries(invoice_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_uninvoiced ON time_entries(user_id, is_invoiced) WHERE is_invoiced = false;
CREATE INDEX IF NOT EXISTS idx_time_entries_client ON time_entries(user_id, client_name);
CREATE INDEX IF NOT EXISTS idx_time_entries_start_time ON time_entries(user_id, start_time DESC);

-- RLS for time_entries
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own time entries" ON time_entries;
CREATE POLICY "Users can view own time entries"
  ON time_entries FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own time entries" ON time_entries;
CREATE POLICY "Users can insert own time entries"
  ON time_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own time entries" ON time_entries;
CREATE POLICY "Users can update own time entries"
  ON time_entries FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own time entries" ON time_entries;
CREATE POLICY "Users can delete own time entries"
  ON time_entries FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 2. Create invoice_items table (line items)
-- ============================================
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description VARCHAR(500) NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  time_entry_id UUID REFERENCES time_entries(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE invoice_items IS 'Line items for invoices (hours, services, products)';
COMMENT ON COLUMN invoice_items.quantity IS 'Quantity (e.g., hours worked)';
COMMENT ON COLUMN invoice_items.unit_price IS 'Price per unit (e.g., hourly rate)';
COMMENT ON COLUMN invoice_items.amount IS 'Line total (quantity × unit_price)';
COMMENT ON COLUMN invoice_items.time_entry_id IS 'Optional link to time entry that generated this line item';

-- Indexes for invoice_items
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_time_entry ON invoice_items(time_entry_id);

-- RLS for invoice_items (inherits from invoice ownership)
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own invoice items" ON invoice_items;
CREATE POLICY "Users can view own invoice items"
  ON invoice_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_items.invoice_id
      AND invoices.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert own invoice items" ON invoice_items;
CREATE POLICY "Users can insert own invoice items"
  ON invoice_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_items.invoice_id
      AND invoices.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update own invoice items" ON invoice_items;
CREATE POLICY "Users can update own invoice items"
  ON invoice_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_items.invoice_id
      AND invoices.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete own invoice items" ON invoice_items;
CREATE POLICY "Users can delete own invoice items"
  ON invoice_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_items.invoice_id
      AND invoices.user_id = auth.uid()
    )
  );

-- ============================================
-- 3. Create user_time_settings table
-- ============================================
CREATE TABLE IF NOT EXISTS user_time_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  default_hourly_rate DECIMAL(10, 2) DEFAULT 0,
  round_to_minutes INTEGER DEFAULT 1,
  default_billable BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE user_time_settings IS 'User preferences for time tracking';
COMMENT ON COLUMN user_time_settings.round_to_minutes IS 'Round time entries to nearest X minutes (1, 5, 15, 30)';
COMMENT ON COLUMN user_time_settings.default_billable IS 'Default billable status for new time entries';

-- Check constraint for valid rounding values
ALTER TABLE user_time_settings
DROP CONSTRAINT IF EXISTS user_time_settings_round_check;
ALTER TABLE user_time_settings
ADD CONSTRAINT user_time_settings_round_check CHECK (round_to_minutes IN (1, 5, 15, 30));

-- RLS for user_time_settings
ALTER TABLE user_time_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own time settings" ON user_time_settings;
CREATE POLICY "Users can view own time settings"
  ON user_time_settings FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own time settings" ON user_time_settings;
CREATE POLICY "Users can insert own time settings"
  ON user_time_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own time settings" ON user_time_settings;
CREATE POLICY "Users can update own time settings"
  ON user_time_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- 4. Add has_line_items to invoices table
-- ============================================
ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS has_line_items BOOLEAN DEFAULT false;

COMMENT ON COLUMN invoices.has_line_items IS 'Whether invoice uses line items (true) or single amount (false)';
