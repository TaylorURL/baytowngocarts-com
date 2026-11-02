-- Settles checkouts and confirms orders every thirty seconds.
--
-- The success page has checkout-complete save the order and send its
-- confirmation the moment the buyer lands back. This catches the buyer who
-- never does: email-sweep, asked for the order kind alone, looks every open
-- checkout up on Stripe, saves the order a paid one is missing and confirms
-- it, and sends nothing else. The fifteen-minute job still sends the rest.
--
-- It posts with the same x-sweep-secret the fifteen-minute job reads from the
-- vault. Overlapping runs are safe: orders are keyed on the session and every
-- email is claimed in email_log before it is sent.

select cron.unschedule('email-sweep-orders')
where exists (select 1 from cron.job where jobname = 'email-sweep-orders');

select cron.schedule(
  'email-sweep-orders',
  '30 seconds',
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
    body := '{"kinds": ["order_confirmation"]}'::jsonb,
    timeout_milliseconds := 25000
  );
  $$
);
