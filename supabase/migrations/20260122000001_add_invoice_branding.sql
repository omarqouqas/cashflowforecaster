-- Add invoice branding columns to user_settings
ALTER TABLE user_settings
ADD COLUMN IF NOT EXISTS business_name TEXT;

ALTER TABLE user_settings
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Add comments for documentation
COMMENT ON COLUMN user_settings.business_name IS 'Business name to display on invoices instead of email';
COMMENT ON COLUMN user_settings.logo_url IS 'URL to logo image stored in Supabase storage for invoice branding';

-- Create storage bucket for logos if it doesn't exist
-- Note: This needs to be run in Supabase dashboard or via supabase CLI
-- INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true) ON CONFLICT DO NOTHING;

-- Storage policies will need to be set up in Supabase dashboard:
-- 1. Allow authenticated users to upload to their own folder: logos/{user_id}/*
-- 2. Allow public read access for logo display on invoices
