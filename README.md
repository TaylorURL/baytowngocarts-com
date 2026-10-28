<img src="public/images/logo.webp" width="160" alt="Speedway 146" />

# Speedway 146

Website for Speedway 146, a go-kart track in Baytown, Texas.

[baytowngokarts.com](https://baytowngokarts.com)

<img src="https://img.shields.io/badge/version-2026.44.4-e11d2a?style=for-the-badge" alt="Version 2026.44.4" />

Race tickets, party packages and add-ons in one cart, paid through Stripe. Customers get accounts with their past orders, and staff get a panel for orders, revenue and traffic. React, prerendered per route, on Supabase.

The repo is `baytowngocarts-com`. The live domain is spelled baytowngokarts.com.

## Checkout

The browser never decides a price. `create-checkout` checks every line against its own price map and refuses an unknown product or a price that doesn't match. Promo codes are read and spent with the service role, so the browser can't mint one or mark one unused.

Stripe is the record of payment. `stripe-webhook` writes the order, clears the cart reminder and spends the code. If the insert hits a duplicate (`23505`), the success page got there first, and it answers 200 instead of making Stripe retry forever. Checkouts stay open an hour instead of Stripe's default day, so a reminder can still go out the same afternoon.

## Email

Every fifteen minutes `pg_cron` posts to `email-sweep`. It first settles expired checkouts by asking Stripe, so reminders don't depend on the webhook ever seeing `checkout.session.expired`. Then it sends whatever cart reminders, cart offers and come-back emails are due. Each send writes `email_log` first, and a unique `(kind, ref)` stops the next sweep from sending it twice. Failed sends get retried by later sweeps, three times at most.

Unsubscribing takes a per-account token from the one-click header or the `/unsubscribe` page. A `GET` only redirects. Mail scanners follow links, and unsubscribing on `GET` would unsubscribe people who never asked.

The domain's MX points at Resend, and `email-inbound` forwards everything to the track's Gmail with the sender on Reply-To. Mail from the domain's own addresses isn't forwarded, so nothing loops.

## Caching gotchas

`/assets` and `/images` are served immutable for a year, which makes failures sticky:

- A missing file under `/assets` goes to `api/asset-missing.js` instead of the 404 page. A cached 404 would break that file for a year.
- A photo that fails is requested once more under a new query string (`src/lib/photoRecovery.js`). The browser would otherwise replay the failure.
- A tab left open across a deploy asks for chunks that are gone. `src/lib/chunk-recovery.js` reloads once per tab, and the allowance is tied to the chunk that failed so another loader succeeding can't hand it back.

The first paint's CSS is inlined with Beasties, rules keyed on `data-` and `aria-` attributes included, since those states only show up after load. The Supabase SDK is imported on first use, so a visitor with no account and no cart never downloads it. Ambient motion waits until the page has fully arrived and gone idle, and the WebGL particles stay still on a software renderer. Traffic goes to the site's own `site_traffic` table, minus crawlers and PageSpeed runs.

```bash
npm install
cp .env.example .env
npm run dev
npm run build   # client build, SSR build, then prerender
```

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`. The functions in `supabase/functions` read their Stripe and Resend keys from the Supabase project.

React 18, React Router, Vite, Tailwind CSS, Zustand, Supabase, Stripe Checkout and Resend, on Vercel. Proprietary, see [LICENSE.md](LICENSE.md).

Built and maintained by [TaylorURL](https://www.taylorurl.com).
