begin;

-- Needed for gen_random_uuid()
create extension if not exists "pgcrypto";

-- Invoice reminder tracking fields
alter table public.invoices
  add column if not exists reminder_count integer not null default 0,
  add column if not exists last_reminder_at timestamptz null;

-- Track sent invoice reminders
create table if not exists public.invoice_reminders (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  reminder_type text not null,
  sent_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint invoice_reminders_reminder_type_check
    check (reminder_type in ('friendly', 'firm', 'final'))
);

create index if not exists invoice_reminders_invoice_id_idx
  on public.invoice_reminders(invoice_id);

create index if not exists invoice_reminders_user_id_idx
  on public.invoice_reminders(user_id);

alter table public.invoice_reminders enable row level security;

-- RLS: Users can only see reminders for invoices they own.
drop policy if exists "invoice_reminders_select_own" on public.invoice_reminders;
create policy "invoice_reminders_select_own"
on public.invoice_reminders
for select
to authenticated
using (
  exists (
    select 1
    from public.invoices i
    where i.id = invoice_reminders.invoice_id
      and i.user_id = auth.uid()
  )
);

-- RLS: Users can only create reminders for invoices they own.
drop policy if exists "invoice_reminders_insert_own" on public.invoice_reminders;
create policy "invoice_reminders_insert_own"
on public.invoice_reminders
for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.invoices i
    where i.id = invoice_reminders.invoice_id
      and i.user_id = auth.uid()
  )
);

-- Keep summary fields in sync on insert.
create or replace function public.invoice_reminders_after_insert()
returns trigger
language plpgsql
as $$
begin
  update public.invoices
  set reminder_count = coalesce(reminder_count, 0) + 1,
      last_reminder_at = greatest(coalesce(last_reminder_at, 'epoch'::timestamptz), new.sent_at)
  where id = new.invoice_id;

  return new;
end;
$$;

drop trigger if exists invoice_reminders_after_insert on public.invoice_reminders;
create trigger invoice_reminders_after_insert
after insert on public.invoice_reminders
for each row
execute function public.invoice_reminders_after_insert();

commit;


