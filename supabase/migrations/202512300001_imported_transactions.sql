-- ============================================================
-- Imported Transactions (CSV Import MVP) + Traceability Hooks
-- ============================================================

-- Ensure UUID generator exists (Supabase typically has this already)
create extension if not exists "pgcrypto";

-- 1) Store raw imported transactions (never deleted automatically)
create table if not exists public.imported_transactions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references public.users(id) on delete cascade,

  transaction_date date not null,
  description text not null,
  amount numeric not null,

  source_file_name text null,
  original_row_number integer null,
  raw_data jsonb not null
);

alter table public.imported_transactions enable row level security;

-- Basic RLS: user can CRUD only their own rows
do $$
begin
  -- SELECT
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'imported_transactions'
      and policyname = 'Users can read their imported transactions'
  ) then
    create policy "Users can read their imported transactions"
      on public.imported_transactions
      for select
      using (auth.uid() = user_id);
  end if;

  -- INSERT
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'imported_transactions'
      and policyname = 'Users can insert their imported transactions'
  ) then
    create policy "Users can insert their imported transactions"
      on public.imported_transactions
      for insert
      with check (auth.uid() = user_id);
  end if;

  -- UPDATE
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'imported_transactions'
      and policyname = 'Users can update their imported transactions'
  ) then
    create policy "Users can update their imported transactions"
      on public.imported_transactions
      for update
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;

  -- DELETE
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'imported_transactions'
      and policyname = 'Users can delete their imported transactions'
  ) then
    create policy "Users can delete their imported transactions"
      on public.imported_transactions
      for delete
      using (auth.uid() = user_id);
  end if;
end $$;

-- 2) Traceability: link created bills/income back to the import row
alter table public.bills
  add column if not exists source_import_id uuid null;

alter table public.income
  add column if not exists source_import_id uuid null;

do $$
begin
  -- FK: bills.source_import_id -> imported_transactions.id
  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_schema = 'public'
      and table_name = 'bills'
      and constraint_name = 'bills_source_import_id_fkey'
  ) then
    alter table public.bills
      add constraint bills_source_import_id_fkey
      foreign key (source_import_id)
      references public.imported_transactions(id)
      on delete set null;
  end if;

  -- FK: income.source_import_id -> imported_transactions.id
  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_schema = 'public'
      and table_name = 'income'
      and constraint_name = 'income_source_import_id_fkey'
  ) then
    alter table public.income
      add constraint income_source_import_id_fkey
      foreign key (source_import_id)
      references public.imported_transactions(id)
      on delete set null;
  end if;
end $$;

-- 3) Invoice matching (Phase 2+): store the import row that marked an invoice paid
-- This is not used by the MVP UI, but makes it easy to add later.
alter table public.invoices
  add column if not exists paid_source_import_id uuid null;

do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_schema = 'public'
      and table_name = 'invoices'
      and constraint_name = 'invoices_paid_source_import_id_fkey'
  ) then
    alter table public.invoices
      add constraint invoices_paid_source_import_id_fkey
      foreign key (paid_source_import_id)
      references public.imported_transactions(id)
      on delete set null;
  end if;
end $$;


