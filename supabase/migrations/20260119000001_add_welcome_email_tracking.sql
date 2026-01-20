-- Add welcome email tracking to user_settings
ALTER TABLE user_settings
ADD COLUMN IF NOT EXISTS welcome_email_sent_at TIMESTAMPTZ;

COMMENT ON COLUMN user_settings.welcome_email_sent_at IS 'When the welcome email was sent to this user';
