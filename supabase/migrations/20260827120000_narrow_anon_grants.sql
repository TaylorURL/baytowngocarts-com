-- Leaves the anonymous role holding only the one privilege the site uses it for.
--
-- Supabase grants anon every privilege on a new table, so row-level security is
-- the only thing standing between the key that ships in the page and the rows.
-- That holds today, and it is one `alter table ... disable row level security`
-- away from not holding: purchases carries payment records and staff carries
-- who can read them.
--
-- What the browser actually does as anon is write one page-view row. Everything
-- else runs after sign-in, as `authenticated`, which these statements do not
-- touch: purchases is read on the purchase page and the staff panel, staff by
-- the admin hook, and site_traffic is read on the traffic page behind an
-- isStaff guard.

revoke all on public.purchases from anon;
revoke all on public.staff from anon;
revoke all on public.site_traffic from anon;

-- The page-view counter. Insert only: a visitor adds a row and, holding no
-- select privilege and no select policy, cannot read the table back.
grant insert on public.site_traffic to anon;
