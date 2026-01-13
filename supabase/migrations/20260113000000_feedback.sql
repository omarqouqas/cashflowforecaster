-- Create feedback table for in-app user feedback collection
-- Migration: 20260113000000_feedback.sql

create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  user_email text, -- Stored separately so we can follow up even if user is deleted
  type text not null check (type in ('bug', 'suggestion', 'question', 'other')),
  message text not null,
  page_url text, -- The page the user was on when submitting feedback
  user_agent text, -- Browser/device info for debugging
  status text not null default 'new' check (status in ('new', 'reviewed', 'resolved', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create index for querying feedback by status
create index feedback_status_idx on public.feedback(status);

-- Create index for querying feedback by user
create index feedback_user_id_idx on public.feedback(user_id);

-- Enable Row Level Security
alter table public.feedback enable row level security;

-- Policy: Authenticated users can insert their own feedback
create policy "Users can insert their own feedback"
  on public.feedback
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Policy: Users can view their own feedback (optional, for future "My Feedback" page)
create policy "Users can view their own feedback"
  on public.feedback
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Note: Admin access to all feedback should be done via service_role key or Supabase dashboard

-- Add comment for documentation
comment on table public.feedback is 'Stores user feedback submitted through the in-app feedback widget';
