-- Add tax settings to user_settings table
ALTER TABLE user_settings
ADD COLUMN IF NOT EXISTS tax_rate DECIMAL(5,2) DEFAULT 25.00 CHECK (tax_rate >= 0 AND tax_rate <= 100),
ADD COLUMN IF NOT EXISTS tax_tracking_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS tax_year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
ADD COLUMN IF NOT EXISTS estimated_tax_q1_paid DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS estimated_tax_q2_paid DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS estimated_tax_q3_paid DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS estimated_tax_q4_paid DECIMAL(10,2) DEFAULT 0;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_settings_tax_tracking ON user_settings(user_id, tax_tracking_enabled);

-- Add comment
COMMENT ON COLUMN user_settings.tax_rate IS 'Tax rate percentage for estimated tax calculations (e.g., 25.00 for 25%)';
COMMENT ON COLUMN user_settings.tax_tracking_enabled IS 'Whether to track and calculate tax savings';
COMMENT ON COLUMN user_settings.estimated_tax_q1_paid IS 'Amount paid for Q1 estimated taxes (Jan-Mar, due Apr 15)';
COMMENT ON COLUMN user_settings.estimated_tax_q2_paid IS 'Amount paid for Q2 estimated taxes (Apr-Jun, due Jun 15)';
COMMENT ON COLUMN user_settings.estimated_tax_q3_paid IS 'Amount paid for Q3 estimated taxes (Jul-Sep, due Sep 15)';
COMMENT ON COLUMN user_settings.estimated_tax_q4_paid IS 'Amount paid for Q4 estimated taxes (Oct-Dec, due Jan 15)';
