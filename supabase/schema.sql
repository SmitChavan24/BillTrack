-- BillTrack schema. Run this in the Supabase SQL editor.

-- Profiles: one row per user, created on signup.
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  upi_id text,
  personas text[] default '{}',          -- e.g. ['landlord','freelancer']
  primary_persona text,
  plan text default 'free' check (plan in ('free','paid')),
  created_at timestamptz default now()
);

-- Bills: owned by a user, categorised by persona.
create table if not exists bills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  payer_name text not null,
  payer_phone text not null,             -- country code, e.g. 919876543210
  description text not null,
  amount numeric not null,
  due_date date not null,
  category text not null check (category in
    ('landlord','pg_owner','wholesaler','retailer',
     'contractor','freelancer','tutor','service_pro')),
  status text default 'pending' check (status in ('pending','paid','overdue')),
  repeat_interval text default 'none' check (repeat_interval in
    ('none','weekly','monthly','quarterly','yearly')),
  parent_bill_id uuid references bills(id) on delete set null,
  reminder_sent_at timestamptz,
  payment_claimed_at timestamptz,       -- set when payer taps "I've paid"
  created_at timestamptz default now()
);

create index if not exists bills_user_id_idx on bills (user_id);

-- Row level security: users only ever touch their own rows.
alter table profiles enable row level security;
alter table bills enable row level security;

drop policy if exists "own profile" on profiles;
create policy "own profile" on profiles for all
  using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "own bills" on bills;
create policy "own bills" on bills for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Auto-create a profile row when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Public payment view: exposes ONLY the safe fields needed to render a
-- payment page, for anyone holding the bill's (random UUID) link. RLS stays
-- strict; this security-definer function is the single controlled gateway.
drop function if exists public.get_payment(uuid);
create function public.get_payment(p_bill_id uuid)
returns table (
  payer_name text,
  description text,
  amount numeric,
  due_date date,
  status text,
  payee_name text,
  upi_id text,
  payment_claimed_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select b.payer_name, b.description, b.amount, b.due_date, b.status,
         coalesce(p.full_name, 'Payee') as payee_name, p.upi_id,
         b.payment_claimed_at
  from bills b
  join profiles p on p.id = b.user_id
  where b.id = p_bill_id;
$$;

grant execute on function public.get_payment(uuid) to anon, authenticated;

-- Public, controlled write: a payer (anon) reports they've paid a bill.
create or replace function public.claim_payment(p_bill_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update bills
  set payment_claimed_at = now()
  where id = p_bill_id
    and status <> 'paid'
    and payment_claimed_at is null;
$$;

grant execute on function public.claim_payment(uuid) to anon, authenticated;

-- ===========================================================================
-- Admin panel + in-app feedback (see migrations/002_admin_and_feedback.sql).
-- ===========================================================================

alter table profiles add column if not exists is_admin boolean default false;

-- Is the current user an admin? security-definer to dodge RLS recursion.
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

-- In-app feedback: one row per user message, with a single admin reply.
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

drop policy if exists "own feedback read" on feedback;
create policy "own feedback read" on feedback for select
  using (auth.uid() = user_id);

drop policy if exists "own feedback insert" on feedback;
create policy "own feedback insert" on feedback for insert
  with check (auth.uid() = user_id);

-- Admin read functions (all guarded by is_admin()).
create or replace function public.admin_users()
returns table (
  id uuid, full_name text, email text, upi_id text, plan text,
  primary_persona text, personas text[], is_admin boolean,
  created_at timestamptz, last_sign_in_at timestamptz,
  bill_count bigint, total_amount numeric, paid_count bigint,
  pending_count bigint, last_bill_at timestamptz
)
language plpgsql security definer set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  return query
  select p.id, p.full_name, u.email::text, p.upi_id, p.plan,
         p.primary_persona, p.personas, p.is_admin, p.created_at,
         u.last_sign_in_at,
         count(b.id), coalesce(sum(b.amount), 0),
         count(b.id) filter (where b.status = 'paid'),
         count(b.id) filter (where b.status <> 'paid'),
         max(b.created_at)
  from profiles p
  left join auth.users u on u.id = p.id
  left join bills b on b.user_id = p.id
  group by p.id, u.email, u.last_sign_in_at
  order by p.created_at desc;
end;
$$;

grant execute on function public.admin_users() to authenticated;

create or replace function public.admin_bills()
returns table (
  id uuid, owner_name text, owner_email text, payer_name text,
  payer_phone text, description text, amount numeric, due_date date,
  category text, status text, repeat_interval text,
  reminder_sent_at timestamptz, created_at timestamptz
)
language plpgsql security definer set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  return query
  select b.id, p.full_name, u.email::text, b.payer_name, b.payer_phone,
         b.description, b.amount, b.due_date, b.category, b.status,
         b.repeat_interval, b.reminder_sent_at, b.created_at
  from bills b
  join profiles p on p.id = b.user_id
  left join auth.users u on u.id = b.user_id
  order by b.created_at desc;
end;
$$;

grant execute on function public.admin_bills() to authenticated;

create or replace function public.admin_feedback()
returns table (
  id uuid, user_id uuid, user_name text, user_email text, message text,
  admin_reply text, status text, created_at timestamptz, replied_at timestamptz
)
language plpgsql security definer set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  return query
  select f.id, f.user_id, p.full_name, u.email::text, f.message,
         f.admin_reply, f.status, f.created_at, f.replied_at
  from feedback f
  left join profiles p on p.id = f.user_id
  left join auth.users u on u.id = f.user_id
  order by f.created_at desc;
end;
$$;

grant execute on function public.admin_feedback() to authenticated;

create or replace function public.admin_reply_feedback(p_id uuid, p_reply text)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  update feedback
  set admin_reply = p_reply, status = 'replied', replied_at = now()
  where id = p_id;
end;
$$;

grant execute on function public.admin_reply_feedback(uuid, text) to authenticated;
