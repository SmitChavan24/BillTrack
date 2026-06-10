-- Migration 003: "I've paid" button — let a payer report that they've paid.
-- No payment gateway involved; this just records the payer's self-report so the
-- owner sees a "Payment reported" flag and can confirm. Run in Supabase SQL editor.

-- 1. Timestamp set when a payer taps "I've paid" on the public pay page.
alter table bills add column if not exists payment_claimed_at timestamptz;

-- 2. Recreate get_payment to also expose payment_claimed_at (return signature
--    changes, so we drop + recreate rather than create-or-replace).
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

-- 3. Public, controlled write: a payer (anon) reports payment for one bill.
--    Only stamps the time; never changes amount/status, and is idempotent-ish
--    (won't overwrite if the owner already marked it paid).
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
