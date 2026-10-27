-- The tables the cart reminders and the come-back emails run on.
--
-- A checkout that reaches Stripe is recorded in checkout_attempts by
-- create-checkout, closed by stripe-webhook when it is paid, and closed as
-- expired by the email-sweep function once Stripe says so. The sweep reads
-- email_candidates() every fifteen minutes and sends what it returns.
--
-- Nothing here is readable by the browser except a signed-in buyer's own promo
-- codes, which the cart page looks up to show the discount before checkout.
-- create-checkout prices the code again with the service role either way.

create table if not exists public.promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[A-Z0-9-]{6,32}$'),
  user_id uuid not null references auth.users (id) on delete cascade,
  percent_off integer not null check (percent_off between 1 and 50),
  reason text not null check (reason in ('checkout_offer', 'come_back_offer')),
  expires_at timestamptz not null,
  redeemed_at timestamptz,
  redeemed_session_id text,
  created_at timestamptz not null default now()
);

create index if not exists idx_promo_codes_user_created
  on public.promo_codes using btree (user_id, created_at desc);

create table if not exists public.checkout_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  email text not null,
  stripe_session_id text not null unique,
  -- [{ id, quantity }], the product ids the cart page can rebuild a cart from.
  items jsonb not null,
  promo_code_id uuid references public.promo_codes (id) on delete set null,
  status text not null default 'open'
    check (status in ('open', 'completed', 'expired', 'void')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  closed_at timestamptz,
  reminder_sent_at timestamptz,
  offer_sent_at timestamptz
);

create index if not exists idx_checkout_attempts_status_expires
  on public.checkout_attempts using btree (status, expires_at);
create index if not exists idx_checkout_attempts_user_created
  on public.checkout_attempts using btree (user_id, created_at desc);

create table if not exists public.email_preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  unsubscribe_token uuid not null unique default gen_random_uuid(),
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- One row per email the sweep means to send, written before the send. The
-- unique (kind, ref) is what stops a second sweep, or a retry, from sending the
-- same email twice.
create table if not exists public.email_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  email text not null,
  kind text not null check (kind in (
    'checkout_reminder', 'checkout_offer', 'first_race', 'come_back', 'come_back_offer'
  )),
  ref text not null,
  status text not null default 'claimed' check (status in ('claimed', 'sent', 'failed')),
  attempts integer not null default 1,
  promo_code_id uuid references public.promo_codes (id) on delete set null,
  provider_id text,
  error text,
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  unique (kind, ref)
);

create index if not exists idx_email_log_user_created
  on public.email_log using btree (user_id, created_at desc);

alter table public.promo_codes enable row level security;
alter table public.checkout_attempts enable row level security;
alter table public.email_preferences enable row level security;
alter table public.email_log enable row level security;

revoke all on public.promo_codes from anon, authenticated;
revoke all on public.checkout_attempts from anon, authenticated;
revoke all on public.email_preferences from anon, authenticated;
revoke all on public.email_log from anon, authenticated;

grant select on public.promo_codes to authenticated;

drop policy if exists "Users can view their own promo codes" on public.promo_codes;
create policy "Users can view their own promo codes" on public.promo_codes
  as permissive for select to authenticated using (auth.uid() = user_id);

-- Every account gets a preferences row, so every email can carry an
-- unsubscribe link. The signup page asks, and a box left unticked arrives here
-- as marketing_opt_in = false in the user's metadata.
create or replace function public.create_email_preferences()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.email_preferences (user_id, unsubscribed_at)
  values (
    new.id,
    case when new.raw_user_meta_data ->> 'marketing_opt_in' = 'false' then now() end
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

revoke execute on function public.create_email_preferences() from public, anon, authenticated;

drop trigger if exists on_auth_user_created_email_preferences on auth.users;
create trigger on_auth_user_created_email_preferences
  after insert on auth.users
  for each row execute function public.create_email_preferences();

insert into public.email_preferences (user_id)
select id from auth.users
on conflict (user_id) do nothing;

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
 * Everybody who unsubscribed is left out of all five. The three come-back kinds
 * also leave out staff accounts, anybody who started a checkout in the last
 * three days, and anybody emailed in the last seven.
 */
create or replace function public.email_candidates(p_kind text, p_limit integer default 50)
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
      p_kind in ('checkout_reminder', 'checkout_offer')
      or (
        not exists (select 1 from public.staff s where s.user_id = c.user_id)
        and not exists (
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

revoke execute on function public.email_candidates(text, integer) from public, anon, authenticated;
grant execute on function public.email_candidates(text, integer) to service_role;
