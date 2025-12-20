-- Ensure every authenticated Supabase user also has a row in public.users.
-- Many tables in this app (accounts, bills, income, user_settings, etc.) FK to public.users(id).
-- Without this, inserts that set user_id = auth.uid() can fail with:
--   insert or update on table "accounts" violates foreign key constraint "accounts_user_id_fkey"

-- 1) Create/replace trigger function to upsert into public.users on auth.users insert.
-- Use SECURITY DEFINER so it can write even if public.users has RLS enabled.
create or replace function public.handle_auth_user_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, created_at, updated_at)
  values (new.id, new.email, now(), now())
  on conflict (id) do update
    set email = excluded.email,
        updated_at = now();

  return new;
end;
$$;

-- 2) Attach trigger (idempotent).
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_auth_user_created();

-- 3) Backfill existing auth users that might be missing a public.users row.
insert into public.users (id, email, created_at, updated_at)
select au.id, au.email, now(), now()
from auth.users au
left join public.users pu on pu.id = au.id
where pu.id is null
on conflict (id) do nothing;


