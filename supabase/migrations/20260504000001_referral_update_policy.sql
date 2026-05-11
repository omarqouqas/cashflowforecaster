-- Migration: Add UPDATE policy for referral claiming
-- Date: 2026-05-04
--
-- The claim logic now uses UPDATE instead of INSERT to avoid
-- violating the UNIQUE constraint on referral_code.
-- This policy allows users to claim unclaimed referral codes.

-- Allow users to claim an unclaimed referral (update referee_id to themselves)
DROP POLICY IF EXISTS "Users can claim unclaimed referral" ON referrals;
CREATE POLICY "Users can claim unclaimed referral" ON referrals
  FOR UPDATE
  USING (referee_id IS NULL)
  WITH CHECK (auth.uid() = referee_id);
