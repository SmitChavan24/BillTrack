-- Migration 006: BillTrack Pro + locking down privileged profile fields.
-- Free users can have up to 10 active (unpaid) bills at a time; Pro removes the
-- limit. Pro is bought on pay.billtrack.me and switched on by an admin.
-- Run in the Supabase SQL editor.

-- ---------------------------------------------------------------------------
-- 1. Pro expiry. plan = 'paid' with a NULL expiry means Pro with no end date.
-- ---------------------------------------------------------------------------
alter table profiles add column if not exists plan_expires_at timestamptz;

-- ---------------------------------------------------------------------------
-- 2. SECURITY FIX: the "own profile" policy lets a user update every column of
--    their own row, including is_admin and plan. Block that for direct client
--    writes. Security-definer functions (signup trigger, admin RPCs) run as the
--    function owner, not as 'authenticated', so they are unaffected.
-- ---------------------------------------------------------------------------
create or replace function public.protect_profile_fields()
returns trigger
language plpgsql
as $$
begin
  if current_user not in ('authenticated', 'anon') then
    return new;
  end if;

  if tg_op = 'INSERT' then
    new.is_admin := false;
    new.plan := 'free';
    new.plan_expires_at := null;
  elsif new.is_admin is distinct from old.is_admin
     or new.plan is distinct from old.plan
     or new.plan_expires_at is distinct from old.plan_expires_at then
    raise exception 'Only an admin can change is_admin or the plan';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_fields on profiles;
create trigger protect_profile_fields
  before insert or update on profiles
  for each row execute function public.protect_profile_fields();

-- ---------------------------------------------------------------------------
-- 3. Is this user on an active Pro plan?
-- ---------------------------------------------------------------------------
create or replace function public.is_pro(p_user uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select plan = 'paid' and (plan_expires_at is null or plan_expires_at > now())
     from profiles where id = p_user),
    false);
$$;

grant execute on function public.is_pro(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- 4. Enforce the Free limit in the database, so it holds for every insert path
--    (new bill, renew bill, direct API calls). Existing bills are never touched.
--    The app looks for the FREE_LIMIT prefix to show an upgrade message.
-- ---------------------------------------------------------------------------
create or replace function public.enforce_free_bill_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  active_count int;
begin
  if new.status = 'paid' or public.is_pro(new.user_id) then
    return new;
  end if;

  select count(*) into active_count
  from bills
  where user_id = new.user_id and status <> 'paid';

  if active_count >= 10 then
    raise exception 'FREE_LIMIT: The Free plan allows 10 active bills. Mark a bill as paid or upgrade to Pro.';
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_free_bill_limit on bills;
create trigger enforce_free_bill_limit
  before insert on bills
  for each row execute function public.enforce_free_bill_limit();

-- ---------------------------------------------------------------------------
-- 5. Admin: switch a user to Pro for N months (extends an active Pro) or back
--    to Free.
-- ---------------------------------------------------------------------------
create or replace function public.admin_set_plan(p_user uuid, p_plan text, p_months int default 1)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;
  if p_plan not in ('free', 'paid') then
    raise exception 'invalid plan';
  end if;

  if p_plan = 'free' then
    update profiles set plan = 'free', plan_expires_at = null where id = p_user;
  else
    if p_months is null or p_months < 1 or p_months > 36 then
      raise exception 'months must be between 1 and 36';
    end if;
    update profiles
    set plan = 'paid',
        plan_expires_at = greatest(coalesce(plan_expires_at, now()), now())
                          + make_interval(months => p_months)
    where id = p_user;
  end if;
end;
$$;

grant execute on function public.admin_set_plan(uuid, text, int) to authenticated;

-- ---------------------------------------------------------------------------
-- 6. Admin user list now includes the Pro expiry. The return type changes, so
--    the function has to be dropped and recreated.
-- ---------------------------------------------------------------------------
drop function if exists public.admin_users();

create function public.admin_users()
returns table (
  id uuid,
  full_name text,
  email text,
  upi_id text,
  plan text,
  plan_expires_at timestamptz,
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
    p.plan_expires_at,
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
