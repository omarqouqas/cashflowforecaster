-- This migration makes invoice_number user-editable by ensuring DB-side automation
-- only fills invoice_number when it is NULL.
--
-- NOTE: If your project already has a different trigger/function for invoice_number,
-- update the DROP/CREATE names below to match (or adjust your existing function body
-- to guard with `IF NEW.invoice_number IS NULL THEN ... END IF;`).

begin;

-- Create/replace a helper function that only sets invoice_number if the app didn't.
create or replace function public.set_invoice_number_if_null()
returns trigger
language plpgsql
as $$
declare
  last_num int;
begin
  -- Only auto-generate when invoice_number is not provided.
  if new.invoice_number is null then
    -- Find last numeric suffix for this user_id and increment.
    -- Expected pattern: INV-0001 (but we handle non-matching formats by falling back to 0).
    select coalesce(
      nullif(regexp_replace(i.invoice_number, '.*?(\\d+)\\s*$', '\\1'), i.invoice_number)::int,
      0
    )
    into last_num
    from public.invoices i
    where i.user_id = new.user_id
    order by i.created_at desc
    limit 1;

    new.invoice_number := 'INV-' || lpad((coalesce(last_num, 0) + 1)::text, 4, '0');
  end if;

  return new;
end;
$$;

-- Install a trigger that runs before insert.
drop trigger if exists invoices_set_invoice_number on public.invoices;
create trigger invoices_set_invoice_number
before insert on public.invoices
for each row
execute function public.set_invoice_number_if_null();

commit;


