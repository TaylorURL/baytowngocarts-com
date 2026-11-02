-- Order confirmations, which the site never sent.
--
-- The success page tells a buyer to check their email for a confirmation, and
-- nothing wrote one. The email-sweep function now sends one for every new
-- order, whichever of the two writers put it in purchases, and logs it in
-- email_log like the other kinds so it goes out once.

alter table public.email_log drop constraint if exists email_log_kind_check;
alter table public.email_log add constraint email_log_kind_check check (kind in (
  'checkout_reminder', 'checkout_offer', 'first_race', 'come_back', 'come_back_offer',
  'order_confirmation'
));

/*
 * Orders due a confirmation: placed in the last day and not confirmed yet.
 *
 * The day is what stops the first sweep after this ships from confirming
 * every order the site ever took. It also leaves an order recovered from
 * months back alone; p_purchase_id names one order and answers for it at any
 * age, so a late confirmation is always somebody's decision.
 *
 * Unsubscribing leaves nobody out. That is a choice about marketing, and this
 * is a receipt for money already paid. p_user_id narrows the answer to one
 * account, as it does for email_candidates(), so the sweep can be tested
 * against real rows without mailing a customer.
 */
create or replace function public.order_confirmations_due(
  p_limit integer default 40,
  p_user_id uuid default null,
  p_purchase_id uuid default null
)
returns table (
  purchase_id uuid,
  user_id uuid,
  email text,
  order_number text,
  items jsonb,
  total_amount integer,
  placed_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select pu.id, pu.user_id, coalesce(nullif(pu.customer_email, ''), u.email),
         pu.order_number, pu.items, pu.total_amount, pu.created_at
  from public.purchases pu
  left join auth.users u on u.id = pu.user_id
  where (
      (p_purchase_id is null and pu.created_at > now() - interval '1 day')
      or pu.id = p_purchase_id
    )
    and (p_user_id is null or pu.user_id = p_user_id)
    and coalesce(nullif(pu.customer_email, ''), u.email, '') <> ''
    and not exists (
      select 1 from public.email_log l
      where l.kind = 'order_confirmation'
        and l.ref = pu.id::text
        and (l.status <> 'failed' or l.attempts >= 3)
    )
  order by pu.created_at
  limit greatest(p_limit, 0);
$$;

revoke execute on function public.order_confirmations_due(integer, uuid, uuid) from public, anon, authenticated;
grant execute on function public.order_confirmations_due(integer, uuid, uuid) to service_role;
