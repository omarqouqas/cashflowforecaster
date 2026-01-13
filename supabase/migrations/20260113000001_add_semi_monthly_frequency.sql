-- Add semi-monthly frequency to income and bills tables
-- Migration: 20260113000001_add_semi_monthly_frequency.sql

-- ============================================
-- UPDATE INCOME TABLE CONSTRAINT
-- ============================================

-- Drop the existing frequency constraint on income table
ALTER TABLE public.income DROP CONSTRAINT IF EXISTS valid_frequency;

-- Recreate with semi-monthly included
ALTER TABLE public.income ADD CONSTRAINT valid_frequency 
  CHECK (frequency IN ('one-time', 'weekly', 'biweekly', 'semi-monthly', 'monthly', 'irregular'));

-- ============================================
-- UPDATE BILLS TABLE CONSTRAINT (if exists)
-- ============================================

-- Drop the existing frequency constraint on bills table
ALTER TABLE public.bills DROP CONSTRAINT IF EXISTS valid_frequency;
ALTER TABLE public.bills DROP CONSTRAINT IF EXISTS bills_valid_frequency;

-- Recreate with semi-monthly included
ALTER TABLE public.bills ADD CONSTRAINT valid_frequency 
  CHECK (frequency IN ('one-time', 'weekly', 'biweekly', 'semi-monthly', 'monthly', 'quarterly', 'annually'));

-- Add comment for documentation
COMMENT ON CONSTRAINT valid_frequency ON public.income IS 'Valid frequency values for income sources including semi-monthly';
COMMENT ON CONSTRAINT valid_frequency ON public.bills IS 'Valid frequency values for bills including semi-monthly';
