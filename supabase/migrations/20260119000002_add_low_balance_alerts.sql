-- Add low balance alert settings to user_settings
ALTER TABLE user_settings
ADD COLUMN IF NOT EXISTS low_balance_alert_enabled BOOLEAN DEFAULT true;

ALTER TABLE user_settings
ADD COLUMN IF NOT EXISTS last_low_balance_alert_at TIMESTAMPTZ;

COMMENT ON COLUMN user_settings.low_balance_alert_enabled IS 'Whether to send email alerts when balance projected to drop below safety buffer';
COMMENT ON COLUMN user_settings.last_low_balance_alert_at IS 'When the last low balance alert was sent (for cooldown)';
