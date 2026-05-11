-- Migration: Allow public SELECT on unclaimed referral codes
-- Date: 2026-05-04
--
-- Bug: Anonymous users clicking referral links couldn't validate codes
-- because RLS policies only allowed authenticated users to SELECT.
-- This caused /r/[code] to redirect without the ?ref= parameter.

-- Allow anyone to view unclaimed referral codes (needed for validation)
DROP POLICY IF EXISTS "Anyone can view unclaimed referral codes" ON referrals;
CREATE POLICY "Anyone can view unclaimed referral codes" ON referrals
  FOR SELECT
  USING (referee_id IS NULL);
