-- Migration 002: Admin panel + user feedback
-- Run this in the Supabase SQL editor on the existing database.

-- ---------------------------------------------------------------------------
-- 1. Admin flag on profiles
-- ---------------------------------------------------------------------------
alter table profiles add column if not exists is_admin boolean default false;

-- ---------------------------------------------------------------------------
-- 2. Helper: is the CURRENT user an admin?
--    security definer so the lookup itself isn't blocked by RLS, which also
--    avoids the infinite-recursion trap of referencing profiles inside a
--    profiles policy.
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce((select is_admin from profiles where id = auth.uid()), false);
$$;

grant execute on function public.is_admin() to authenticated;

-- ---------------------------------------------------------------------------
-- 3. Feedback table — one row per message a user sends in-app.
-- ---------------------------------------------------------------------------
create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  message text not null,
  admin_reply text,
  status text default 'open' check (status in ('open','replied')),
  created_at timestamptz default now(),
  replied_at timestamptz
);

create index if not exists feedback_user_id_idx on feedback (user_id);

alter table feedback enable row level security;

-- Users may READ and INSERT their own feedback only. There is deliberately no
-- UPDATE policy for users, so they can never write the admin_reply field — that
-- path goes exclusively through admin_reply_feedback() below.
drop policy if exists "own feedback read" on feedback;
create policy "own feedback read" on feedback for select
  using (auth.uid() = user_id);

drop policy if exists "own feedback insert" on feedback;
create policy "own feedback insert" on feedback for insert
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 4. Admin: list every app user with aggregated bill stats + auth info.
-- ---------------------------------------------------------------------------
create or replace function public.admin_users()
returns table (
  id uuid,
  full_name text,
  email text,
  upi_id text,
  plan text,
  primary_persona text,
  personas text[],
  is_admin boolean,
  created_at timestamptz,
  last_sign_in_at timestamptz,
  bill_count bigint,
  total_amount numeric,
  paid_count bigint,
  pending_count bigint,
  last_bill_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;

  return query
  select
    p.id,
    p.full_name,
    u.email::text,
    p.upi_id,
    p.plan,
    p.primary_persona,
    p.personas,
    p.is_admin,
    p.created_at,
    u.last_sign_in_at,
    count(b.id) as bill_count,
    coalesce(sum(b.amount), 0) as total_amount,
    count(b.id) filter (where b.status = 'paid') as paid_count,
    count(b.id) filter (where b.status <> 'paid') as pending_count,
    max(b.created_at) as last_bill_at
  from profiles p
  left join auth.users u on u.id = p.id
  left join bills b on b.user_id = p.id
  group by p.id, u.email, u.last_sign_in_at
  order by p.created_at desc;
end;
$$;

grant execute on function public.admin_users() to authenticated;

-- ---------------------------------------------------------------------------
-- 5. Admin: every bill across all users, with owner identity.
-- ---------------------------------------------------------------------------
create or replace function public.admin_bills()
returns table (
  id uuid,
  owner_name text,
  owner_email text,
  payer_name text,
  payer_phone text,
  description text,
  amount numeric,
  due_date date,
  category text,
  status text,
  repeat_interval text,
  reminder_sent_at timestamptz,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;

  return query
  select
    b.id,
    p.full_name as owner_name,
    u.email::text as owner_email,
    b.payer_name,
    b.payer_phone,
    b.description,
    b.amount,
    b.due_date,
    b.category,
    b.status,
    b.repeat_interval,
    b.reminder_sent_at,
    b.created_at
  from bills b
  join profiles p on p.id = b.user_id
  left join auth.users u on u.id = b.user_id
  order by b.created_at desc;
end;
$$;

grant execute on function public.admin_bills() to authenticated;

-- ---------------------------------------------------------------------------
-- 6. Admin: all feedback with the submitter's identity.
-- ---------------------------------------------------------------------------
create or replace function public.admin_feedback()
returns table (
  id uuid,
  user_id uuid,
  user_name text,
  user_email text,
  message text,
  admin_reply text,
  status text,
  created_at timestamptz,
  replied_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;

  return query
  select
    f.id, f.user_id, p.full_name as user_name, u.email::text as user_email,
    f.message, f.admin_reply, f.status, f.created_at, f.replied_at
  from feedback f
  left join profiles p on p.id = f.user_id
  left join auth.users u on u.id = f.user_id
  order by f.created_at desc;
end;
$$;

grant execute on function public.admin_feedback() to authenticated;

-- ---------------------------------------------------------------------------
-- 7. Admin: reply to a feedback item.
-- ---------------------------------------------------------------------------
create or replace function public.admin_reply_feedback(p_id uuid, p_reply text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;

  update feedback
  set admin_reply = p_reply,
      status = 'replied',
      replied_at = now()
  where id = p_id;
end;
$$;

grant execute on function public.admin_reply_feedback(uuid, text) to authenticated;
