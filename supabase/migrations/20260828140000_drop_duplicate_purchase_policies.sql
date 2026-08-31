-- Leaves one policy per intent on purchases instead of two.
--
-- purchases carries six policies and two of them are spelled twice. "Users can
-- view own purchases" and "Users can view their own purchases" have the same
-- qual, auth.uid() = user_id; "Users can insert own purchases" and "Users can
-- insert their own purchases" have the same with_check. The pairs differ only
-- in which role they name: the older spelling is granted to PUBLIC, the newer
-- to authenticated.
--
-- A duplicate permissive policy is not a doubled restriction. Postgres ORs the
-- permissive policies for a command, so the widest one decides, and the widest
-- here is the PUBLIC pair -- which is every role including anon, so the policy
-- that reads narrowest in its name is the one carrying the broadest grant.
-- 20260827120000_narrow_anon_grants.sql already revoked anon's table grants, so
-- nothing reaches these rows through it today. Removing the PUBLIC pair means
-- there is no second thing to keep in step the next time either is edited.
--
-- The authenticated pair is left in place and is what the purchase page has
-- been reading through all along, so no visitor sees a different page after
-- this.

drop policy if exists "Users can view own purchases" on public.purchases;
drop policy if exists "Users can insert own purchases" on public.purchases;
