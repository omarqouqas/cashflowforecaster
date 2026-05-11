-- Migration: Add referrals table for referral program
-- Date: 2026-05-03

-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  referral_code VARCHAR(8) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'signed_up', 'converted', 'rewarded')),
  reward_given BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  signed_up_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ,
  rewarded_at TIMESTAMPTZ
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referee_id ON referrals(referee_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);

-- Add referred_by_code column to user_settings to track which code a user signed up with
ALTER TABLE user_settings
ADD COLUMN IF NOT EXISTS referred_by_code VARCHAR(8);

-- Enable RLS
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Users can view their own referral records (where they are the referrer)
DROP POLICY IF EXISTS "Users can view own referrals as referrer" ON referrals;
CREATE POLICY "Users can view own referrals as referrer" ON referrals
  FOR SELECT USING (auth.uid() = referrer_id);

-- Users can view referrals where they are the referee (to see their referral status)
DROP POLICY IF EXISTS "Users can view referrals as referee" ON referrals;
CREATE POLICY "Users can view referrals as referee" ON referrals
  FOR SELECT USING (auth.uid() = referee_id);

-- Users can create their own referral code (insert with themselves as referrer)
DROP POLICY IF EXISTS "Users can create own referral code" ON referrals;
CREATE POLICY "Users can create own referral code" ON referrals
  FOR INSERT WITH CHECK (auth.uid() = referrer_id AND referee_id IS NULL);

-- Note: UPDATE and DELETE handled by service role in webhook/API routes
