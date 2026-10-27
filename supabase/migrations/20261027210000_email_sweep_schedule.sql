-- Runs the email-sweep edge function every fifteen minutes.
--
-- The sweep sends whatever cart reminders, cart offers and come-back emails
-- email_candidates() says are due, inside its own sending hours, so the
-- schedule itself can be blind to the clock.
--
-- The x-sweep-secret it posts with is read from the database vault on every
-- run. It is written there once, outside any migration, as email_sweep_secret,
-- and the function holds the same value as EMAIL_SWEEP_SECRET. Rotating it is
-- vault.update_secret here and `supabase secrets set` there, in the same
-- breath.

create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;

select cron.unschedule('email-sweep')
where exists (select 1 from cron.job where jobname = 'email-sweep');

select cron.schedule(
  'email-sweep',
  '*/15 * * * *',
  $$
  select net.http_post(
    url := 'https://ggkqadmnvrjsewnazdxj.supabase.co/functions/v1/email-sweep',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-sweep-secret', (
        select decrypted_secret from vault.decrypted_secrets
        where name = 'email_sweep_secret'
      )
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 60000
  );
  $$
);
