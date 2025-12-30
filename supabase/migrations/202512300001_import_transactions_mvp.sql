-- CSV Import MVP
-- - Create imported_transactions table
-- - Add source_import_id to bills and income for traceability
-- - (Future) Allow linking an imported transaction to an invoice via invoice_id

-- Ensure UUID generator exists (Supabase typically has this already)
create extension if not exists "pgcrypto";

-- 1) Imported transactions (raw + normalized)
create table if not exists public.imported_transactions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references public.users(id) on delete cascade,

  -- Normalized fields used by the app
  posted_at date not null,
  description text not null,
  amount numeric not null,

  -- Raw import payload + mapping metadata for traceability/debugging
  raw jsonb not null,
  source_file_name text null,
  mapped_columns jsonb null,

  -- Future: invoice matching / marking invoice as paid
  invoice_id uuid null references public.invoices(id) on delete set null
);

create index if not exists imported_transactions_user_posted_at_idx
  on public.imported_transactions (user_id, posted_at desc);

-- 2) Traceability from created forecast items back to their source import
alter table public.bills
  add column if not exists source_import_id uuid;

alter table public.income
  add column if not exists source_import_id uuid;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'bills_source_import_id_fkey'
  ) then
    alter table public.bills
      add constraint bills_source_import_id_fkey
      foreign key (source_import_id)
      references public.imported_transactions(id)
      on delete set null;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'income_source_import_id_fkey'
  ) then
    alter table public.income
      add constraint income_source_import_id_fkey
      foreign key (source_import_id)
      references public.imported_transactions(id)
      on delete set null;
  end if;
end $$;

-- 3) RLS for imported_transactions (aligns with typical per-user tables)
alter table public.imported_transactions enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'imported_transactions'
      and policyname = 'Users can view their imported transactions'
  ) then
    create policy "Users can view their imported transactions"
      on public.imported_transactions
      for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'imported_transactions'
      and policyname = 'Users can insert their imported transactions'
  ) then
    create policy "Users can insert their imported transactions"
      on public.imported_transactions
      for insert
      with check (auth.uid() = user_id);
  end if;
end $$;


