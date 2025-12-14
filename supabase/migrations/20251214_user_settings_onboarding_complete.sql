-- Add onboarding completion flag for the guided wizard
-- This avoids writing to public.users (often RLS-protected)

alter table public.user_settings
add column if not exists onboarding_complete boolean not null default false;
