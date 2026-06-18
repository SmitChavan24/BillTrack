-- Migration 004: Public "pay me" profile pages (the viral loop).
-- Each user can claim a handle and get a public page at /u/<handle> that anyone
-- can open to pay them via UPI — and that prominently invites the payer to
-- create their own free BillTrack page. Run in the Supabase SQL editor.

-- 1. Handle (public username). Nullable until the user claims one.
alter table profiles add column if not exists handle text;

-- 2. Case-insensitive uniqueness — "Sharma" and "sharma" can't both exist.
--    Partial index so the many profiles without a handle (null) are all allowed.
create unique index if not exists profiles_handle_key
  on profiles (lower(handle))
  where handle is not null;

-- 3. Public read of the *minimal* fields needed to render a pay page, keyed by
--    handle. Security definer so anon can read past RLS — but it only ever
--    returns these four non-sensitive columns, never the whole profile row.
create or replace function public.get_public_profile(p_handle text)
returns table (
  handle text,
  full_name text,
  upi_id text,
  primary_persona text
)
language sql
security definer
set search_path = public
as $$
  select p.handle, p.full_name, p.upi_id, p.primary_persona::text
  from profiles p
  where lower(p.handle) = lower(p_handle)
    and p.handle is not null
  limit 1;
$$;

grant execute on function public.get_public_profile(text) to anon, authenticated;
