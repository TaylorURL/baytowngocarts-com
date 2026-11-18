-- The sign-up offer: a visitor gives the site an email address and is mailed a
-- one-time 10% code for it by the email-offer function.
--
-- Somebody signing up this way usually has no account, and everything the
-- marketing mail ran on until now was keyed on one: email_preferences is a row
-- per account, and a promo code belonged to the account it was mailed to. So
-- the address itself becomes something a contact and a code can belong to.
--
--   email_subscribers     one row per mailbox that signed up, with its own
--                         unsubscribe token. An address that already has an
--                         account is linked to it, and starts unsubscribed if
--                         that account is.
--   promo_codes           gains `email` and a third reason. A sign-up code for
--                         an address with no account yet has no user_id; the
--                         first account with that address to bring the code to
--                         its cart claims it (claim_offer_code), and from then
--                         on create-checkout prices it like any other code.
--                         Every existing code keeps its user_id, and every
--                         check that compares one still refuses a code that
--                         has none.
--   email_offer_requests  sign-ups per network, hashed, kept for one day,
--                         which is what the rate limit counts.
--
-- email_log takes the new kind, and its unique (kind, ref), with the mailbox
-- as the ref, is what holds every address to one code ever.
--
-- Nothing here is readable by the browser. The function reads and writes all
-- of it with the service role; the one thing a signed-in buyer can do is claim
-- a code they already hold that was mailed to their own address.

alter table public.promo_codes add column if not exists email text;
alter table public.promo_codes alter column user_id drop not null;

alter table public.promo_codes drop constraint if exists promo_codes_reason_check;
alter table public.promo_codes add constraint promo_codes_reason_check
  check (reason in ('checkout_offer', 'come_back_offer', 'site_offer'));

alter table public.promo_codes drop constraint if exists promo_codes_owner_check;
alter table public.promo_codes add constraint promo_codes_owner_check
  check (user_id is not null or email is not null);

alter table public.promo_codes drop constraint if exists promo_codes_email_check;
alter table public.promo_codes add constraint promo_codes_email_check
  check (email is null or email = lower(email));

create index if not exists idx_promo_codes_unclaimed_email
  on public.promo_codes using btree (email) where user_id is null;

alter table public.email_log drop constraint if exists email_log_kind_check;
alter table public.email_log add constraint email_log_kind_check check (kind in (
  'checkout_reminder', 'checkout_offer', 'first_race', 'come_back', 'come_back_offer',
  'order_confirmation', 'site_offer'
));

create table if not exists public.email_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null check (email = lower(email) and char_length(email) <= 254),
  -- The inbox the address delivers to: the +tag dropped, and Gmail's dots.
  -- Two spellings of one inbox are one subscriber and one code.
  email_key text not null unique,
  user_id uuid references auth.users (id) on delete set null,
  source text not null default 'site_offer' check (source in ('site_offer')),
  -- The page the form was sent from.
  source_path text,
  unsubscribe_token uuid not null unique default gen_random_uuid(),
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_email_subscribers_email
  on public.email_subscribers using btree (email);
create index if not exists idx_email_subscribers_user
  on public.email_subscribers using btree (user_id) where user_id is not null;

create table if not exists public.email_offer_requests (
  id bigint generated always as identity primary key,
  -- An HMAC of the network the request came from, never the address itself.
  ip_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_email_offer_requests_ip_created
  on public.email_offer_requests using btree (ip_hash, created_at desc);
create index if not exists idx_email_offer_requests_created
  on public.email_offer_requests using btree (created_at);

alter table public.email_subscribers enable row level security;
alter table public.email_offer_requests enable row level security;

revoke all on public.email_subscribers from anon, authenticated;
revoke all on public.email_offer_requests from anon, authenticated;

/*
 * Counts one sign-up against the network it came from and the site as a
 * whole, and says where both stand. Rows older than a day are cleared on the
 * way in, so the table only ever holds the day the limits look at.
 */
create or replace function public.email_offer_allowance(p_ip_hash text)
returns table (network_hour integer, network_day integer, site_hour integer)
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from public.email_offer_requests r
  where r.created_at < now() - interval '1 day';

  insert into public.email_offer_requests (ip_hash) values (p_ip_hash);

  return query
    select
      (count(*) filter (
        where r.ip_hash = p_ip_hash and r.created_at > now() - interval '1 hour'
      ))::integer,
      (count(*) filter (where r.ip_hash = p_ip_hash))::integer,
      (count(*) filter (where r.created_at > now() - interval '1 hour'))::integer
    from public.email_offer_requests r;
end;
$$;

revoke execute on function public.email_offer_allowance(text) from public, anon, authenticated;
grant execute on function public.email_offer_allowance(text) to service_role;

/*
 * Records the address as a marketing contact and returns what the email needs.
 *
 * An address that already has an account is linked to it, and a new row for
 * an account that unsubscribed starts unsubscribed: a sign-up asks for its
 * code, and is sent it, but it does not undo an earlier unsubscribe. A mailbox
 * that already signed up keeps its row as it was, unsubscribe included.
 */
create or replace function public.email_offer_contact(
  p_email text,
  p_email_key text,
  p_source_path text default null
)
returns table (account_id uuid, token uuid, unsubscribed boolean)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid;
  v_unsubscribed_at timestamptz;
begin
  select u.id, p.unsubscribed_at
    into v_user, v_unsubscribed_at
  from auth.users u
  left join public.email_preferences p on p.user_id = u.id
  where u.email = p_email
  order by u.created_at
  limit 1;

  insert into public.email_subscribers as s
    (email, email_key, user_id, source_path, unsubscribed_at)
  values
    (p_email, p_email_key, v_user, left(p_source_path, 200), v_unsubscribed_at)
  on conflict (email_key) do update
    set user_id = coalesce(s.user_id, excluded.user_id),
        updated_at = now();

  return query
    select coalesce(s.user_id, v_user), s.unsubscribe_token, s.unsubscribed_at is not null
    from public.email_subscribers s
    where s.email_key = p_email_key;
end;
$$;

revoke execute on function public.email_offer_contact(text, text, text) from public, anon, authenticated;
grant execute on function public.email_offer_contact(text, text, text) to service_role;

/*
 * Hands a sign-up code to the signed-in account whose address it was mailed
 * to, the first time that account's cart is given the code.
 *
 * Knowing the code is not enough, and neither is the address: it takes both,
 * so a code forwarded to a friend is still refused, as every other code is.
 * Once claimed it belongs to the account like any other, so the cart's own
 * read and create-checkout's own check see it with nothing else changed. The
 * subscriber row for that address is linked to the account on the way.
 */
create or replace function public.claim_offer_code(p_code text)
returns table (percent_off integer, expires_at timestamptz, redeemed_at timestamptz)
language sql
volatile
security definer
set search_path = ''
as $$
  with claimed as (
    update public.promo_codes c
       set user_id = auth.uid()
     where c.code = upper(btrim(p_code))
       and c.user_id is null
       and c.reason = 'site_offer'
       and auth.uid() is not null
       and c.email = lower(nullif(auth.jwt() ->> 'email', ''))
    returning c.percent_off, c.expires_at, c.redeemed_at, c.email
  ),
  linked as (
    update public.email_subscribers s
       set user_id = auth.uid(), updated_at = now()
     where s.user_id is null
       and s.email in (select claimed.email from claimed)
    returning s.id
  )
  select claimed.percent_off, claimed.expires_at, claimed.redeemed_at from claimed;
$$;

revoke execute on function public.claim_offer_code(text) from public, anon;
grant execute on function public.claim_offer_code(text) to authenticated;
