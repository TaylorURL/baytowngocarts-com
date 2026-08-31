create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id),
  order_number text not null unique,
  items jsonb not null,
  total_amount integer not null,
  total_quantity integer not null,
  stripe_payment_intent_id text,
  stripe_session_id text unique,
  customer_email text,
  status text default 'completed',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.staff (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.site_traffic (
  id uuid primary key default gen_random_uuid(),
  "timestamp" timestamptz default now(),
  created_at timestamptz default now(),
  page_path text not null,
  user_agent text,
  referrer text,
  screen_width integer,
  screen_height integer,
  city text,
  region text,
  country text,
  country_code text,
  latitude numeric,
  longitude numeric
);

create index if not exists idx_purchases_created_at on public.purchases using btree (created_at desc);
create index if not exists idx_purchases_order_number on public.purchases using btree (order_number);
create index if not exists idx_purchases_user_id on public.purchases using btree (user_id);
create unique index if not exists purchases_stripe_session_id_unique on public.purchases using btree (stripe_session_id);
create index if not exists idx_staff_user_id on public.staff using btree (user_id);
create index if not exists idx_site_traffic_city on public.site_traffic using btree (city);
create index if not exists idx_site_traffic_country on public.site_traffic using btree (country);
create index if not exists idx_site_traffic_page_path on public.site_traffic using btree (page_path);
create index if not exists idx_site_traffic_timestamp on public.site_traffic using btree ("timestamp" desc);

alter table public.purchases enable row level security;
alter table public.staff enable row level security;
alter table public.site_traffic enable row level security;

drop policy if exists "Service role can manage all purchases" on public.purchases;
create policy "Service role can manage all purchases" on public.purchases
  as permissive for all to service_role using (true) with check (true);

drop policy if exists "Staff can view all purchases" on public.purchases;
create policy "Staff can view all purchases" on public.purchases
  as permissive for select to authenticated
  using (exists (select 1 from public.staff where staff.user_id = auth.uid()));

drop policy if exists "Users can insert own purchases" on public.purchases;
create policy "Users can insert own purchases" on public.purchases
  as permissive for insert to public with check (auth.uid() = user_id);

drop policy if exists "Users can insert their own purchases" on public.purchases;
create policy "Users can insert their own purchases" on public.purchases
  as permissive for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Users can view own purchases" on public.purchases;
create policy "Users can view own purchases" on public.purchases
  as permissive for select to public using (auth.uid() = user_id);

drop policy if exists "Users can view their own purchases" on public.purchases;
create policy "Users can view their own purchases" on public.purchases
  as permissive for select to authenticated using (auth.uid() = user_id);

drop policy if exists "Service role can manage staff" on public.staff;
create policy "Service role can manage staff" on public.staff
  as permissive for all to public using (auth.role() = 'service_role');

drop policy if exists "Users can view their own staff status" on public.staff;
create policy "Users can view their own staff status" on public.staff
  as permissive for select to public using (auth.uid() = user_id);

drop policy if exists "Allow anonymous inserts" on public.site_traffic;
create policy "Allow anonymous inserts" on public.site_traffic
  as permissive for insert to public with check (true);

drop policy if exists "Staff can view traffic" on public.site_traffic;
create policy "Staff can view traffic" on public.site_traffic
  as permissive for select to public
  using (exists (select 1 from public.staff where staff.user_id = auth.uid()));
