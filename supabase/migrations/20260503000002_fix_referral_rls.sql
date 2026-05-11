-- Migration: Fix referral RLS policy to allow referee insert
-- Date: 2026-05-03
--
-- Bug: The original policy only allowed inserts where auth.uid() = referrer_id AND referee_id IS NULL
-- This blocked referees from claiming referral codes because they insert with:
--   referrer_id = someone else
--   referee_id = themselves

-- Add policy to allow users to claim referrals (insert with themselves as referee)
DROP POLICY IF EXISTS "Users can claim referral as referee" ON referrals;
CREATE POLICY "Users can claim referral as referee" ON referrals
  FOR INSERT WITH CHECK (auth.uid() = referee_id);
