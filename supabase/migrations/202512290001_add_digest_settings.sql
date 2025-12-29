-- Add email digest columns to user_settings
ALTER TABLE user_settings 
ADD COLUMN IF NOT EXISTS email_digest_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS email_digest_day INTEGER DEFAULT 1, -- 0=Sunday, 1=Monday, etc.
ADD COLUMN IF NOT EXISTS email_digest_time TIME DEFAULT '08:00:00',
ADD COLUMN IF NOT EXISTS last_digest_sent_at TIMESTAMPTZ;


