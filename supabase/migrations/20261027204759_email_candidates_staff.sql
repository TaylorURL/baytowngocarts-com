-- Leaves staff accounts out of every email, and lets the sweep be tested
-- against one named account.
--
-- The first version sent cart reminders to anybody, staff included, so a test
-- checkout by the track's own people would have been reminded like a
-- customer's. The function gains a third argument, so the two-argument one is
-- dropped rather than left beside it.

drop function if exists public.email_candidates(text, integer);

/*
 * Who is due which email right now. The sweep sends exactly what this returns,
 * so this is the whole of the rules:
 *
 *   checkout_reminder  the buyer's latest checkout expired unpaid in the last
 *                      two days and nothing has been bought since.
 *   checkout_offer     a day after that reminder, still nothing bought: a
 *                      one-time code, at most one code per buyer per 90 days.
 *   first_race         signed up two or more days ago and never bought online.
 *   come_back          last online order was 45 or more days ago.
 *   come_back_offer    last order 90 or more days ago and the come_back email
 *                      for that order went out at least 14 days ago.
 *
 * Everybody who unsubscribed is left out of all five, and so is every staff
 * account: a test checkout by the track's own people is not a customer
 * walking away. The three come-back kinds also leave out anybody who started a
 * checkout in the last three days and anybody emailed in the last seven.
 *
 * p_user_id narrows the answer to one account and lets a staff account
 * through, which is how the sweep is tested end to end against real rows
 * without mailing a customer.
 */
create or replace function public.email_candidates(
  p_kind text,
  p_limit integer default 50,
  p_user_id uuid default null
)
returns table (
  user_id uuid,
  email text,
  ref text,
  attempt_id uuid,
  items jsonb,
  unsubscribe_token uuid
)
language sql
stable
security definer
set search_path = ''
as $$
  with recipients as (
    select u.id, u.email, u.created_at, p.unsubscribe_token
    from auth.users u
    join public.email_preferences p on p.user_id = u.id
    where p.unsubscribed_at is null
      and u.email is not null
      and u.email <> ''
      and (p_user_id is null or u.id = p_user_id)
  ),
  latest_attempt as (
    select distinct on (a.user_id) a.*
    from public.checkout_attempts a
    order by a.user_id, a.created_at desc
  ),
  last_purchase as (
    select distinct on (pu.user_id) pu.user_id, pu.id, pu.created_at
    from public.purchases pu
    order by pu.user_id, pu.created_at desc
  ),
  candidates as (
    select r.id as user_id, r.email, a.id::text as ref, a.id as attempt_id,
           a.items, r.unsubscribe_token, a.closed_at as due_at
    from latest_attempt a
    join recipients r on r.id = a.user_id
    where p_kind = 'checkout_reminder'
      and a.status = 'expired'
      and a.reminder_sent_at is null
      and a.closed_at > now() - interval '2 days'
      and not exists (
        select 1 from public.purchases pu
        where pu.user_id = a.user_id and pu.created_at > a.created_at
      )

    union all

    select r.id, r.email, a.id::text, a.id, a.items, r.unsubscribe_token,
           a.reminder_sent_at
    from latest_attempt a
    join recipients r on r.id = a.user_id
    where p_kind = 'checkout_offer'
      and a.status = 'expired'
      and a.reminder_sent_at <= now() - interval '23 hours'
      and a.reminder_sent_at > now() - interval '4 days'
      and a.offer_sent_at is null
      and a.promo_code_id is null
      and not exists (
        select 1 from public.purchases pu
        where pu.user_id = a.user_id and pu.created_at > a.created_at
      )
      and not exists (
        select 1 from public.promo_codes c
        where c.user_id = a.user_id and c.created_at > now() - interval '90 days'
      )

    union all

    select r.id, r.email, r.id::text, null::uuid, null::jsonb, r.unsubscribe_token,
           r.created_at
    from recipients r
    where p_kind = 'first_race'
      and r.created_at <= now() - interval '2 days'
      and not exists (select 1 from public.purchases pu where pu.user_id = r.id)

    union all

    select r.id, r.email, r.id::text || ':' || lp.id::text, null::uuid, null::jsonb,
           r.unsubscribe_token, lp.created_at
    from recipients r
    join last_purchase lp on lp.user_id = r.id
    where p_kind = 'come_back'
      and lp.created_at <= now() - interval '45 days'

    union all

    select r.id, r.email, r.id::text || ':' || lp.id::text, null::uuid, null::jsonb,
           r.unsubscribe_token, lp.created_at
    from recipients r
    join last_purchase lp on lp.user_id = r.id
    where p_kind = 'come_back_offer'
      and lp.created_at <= now() - interval '90 days'
      and exists (
        select 1 from public.email_log l
        where l.kind = 'come_back'
          and l.ref = r.id::text || ':' || lp.id::text
          and l.status = 'sent'
          and l.sent_at <= now() - interval '14 days'
      )
      and not exists (
        select 1 from public.promo_codes c
        where c.user_id = r.id and c.created_at > now() - interval '90 days'
      )
  )
  select c.user_id, c.email, c.ref, c.attempt_id, c.items, c.unsubscribe_token
  from candidates c
  where not exists (
      select 1 from public.email_log l
      where l.kind = p_kind
        and l.ref = c.ref
        and (l.status <> 'failed' or l.attempts >= 3)
    )
    and (
      p_user_id is not null
      or not exists (select 1 from public.staff s where s.user_id = c.user_id)
    )
    and (
      p_kind in ('checkout_reminder', 'checkout_offer')
      or (
        not exists (
          select 1 from public.checkout_attempts a
          where a.user_id = c.user_id and a.created_at > now() - interval '3 days'
        )
        and not exists (
          select 1 from public.email_log l
          where l.user_id = c.user_id
            and l.status <> 'failed'
            and l.created_at > now() - interval '7 days'
        )
      )
    )
  order by c.due_at
  limit greatest(p_limit, 0);
$$;

revoke execute on function public.email_candidates(text, integer, uuid) from public, anon, authenticated;
grant execute on function public.email_candidates(text, integer, uuid) to service_role;
