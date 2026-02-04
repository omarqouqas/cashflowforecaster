-- Migration: Add quarterly and annually frequencies to income table
-- This updates the check constraint to allow quarterly and annually frequencies

-- Drop the existing constraint
ALTER TABLE income DROP CONSTRAINT IF EXISTS valid_frequency;

-- Add the updated constraint with quarterly and annually
ALTER TABLE income ADD CONSTRAINT valid_frequency
  CHECK (frequency IN ('one-time', 'weekly', 'biweekly', 'semi-monthly', 'monthly', 'quarterly', 'annually', 'irregular'));
