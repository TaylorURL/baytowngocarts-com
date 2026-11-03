<img src="public/images/logo.webp" width="160" alt="Speedway 146" />

# Speedway 146

Website for Speedway 146, a go-kart track in Baytown, Texas.

[baytowngokarts.com](https://baytowngokarts.com)

<img src="https://img.shields.io/badge/version-2026.45.2-e11d2a?style=for-the-badge" alt="Version 2026.45.2" />

Race tickets, party packages and add-ons in one cart, paid through Stripe. Customers get accounts with their past orders, and staff get a panel for orders, revenue and traffic. React, prerendered per route, on Supabase.

The repo is `baytowngocarts-com`. The live domain is spelled baytowngokarts.com.

## Checkout

The browser never decides a price. `create-checkout` checks every line against its own price map and refuses an unknown product or a price that doesn't match. Promo codes are read and spent with the service role, so the browser can't mint one or mark one unused.

Stripe is the record of payment, but its notice never reaches this project: the `stripe-webhook` endpoint in Stripe listens to connected accounts, and these checkouts are the platform's. So the site asks Stripe itself, on two paths that share `_shared/checkout.ts`. The success page posts the session to `checkout-complete` the moment the buyer lands back, which checks with Stripe that it's paid, writes the order dated when they paid, spends the promo code and sends the confirmation. For a buyer who never lands back, `email-sweep` looks up every open checkout every thirty seconds and does the same. Both are keyed on the session, so an order is written and confirmed once whichever gets there first. If `checkout-complete` can't be reached, the page writes the order from the cart it kept, as it always did. Checkouts stay open an hour instead of Stripe's default day, so a reminder can still go out the same afternoon.

Sales from before checkouts were tracked are recovered by name: `email-sweep` with `{"recoverSessions": ["cs_live_…"], "dryRun": true}` shows the rows it would write, and the same call without `dryRun` writes them. It only takes paid sessions that returned to this site.

## Email

`pg_cron` posts to `email-sweep` on two clocks. Every thirty seconds it asks only for orders: it settles open checkouts with Stripe, saving any paid order the success page missed, and confirms new orders. Every fifteen minutes it does that and also sends whatever cart reminders, cart offers and come-back emails are due. Each send writes `email_log` first, and a unique `(kind, ref)` stops the next sweep from sending it twice. Failed sends get retried by later sweeps, three times at most.

Every order gets one confirmation, usually from `checkout-complete` within seconds of paying. The sweep confirms any order from the last day that hasn't had one, at any hour and whether or not the buyer unsubscribed, since it's a receipt rather than marketing. Confirmations stay off until the function's `ORDER_CONFIRMATIONS` secret is `on`. A test that names an account and an inbox (`onlyUserId` with `deliverTo`) runs either way, and so does `orderId`, which confirms one order at any age. `dryRun` reports what a sweep would save and send, and writes nothing.

Unsubscribing takes a per-account token from the one-click header or the `/unsubscribe` page. A `GET` only redirects. Mail scanners follow links, and unsubscribing on `GET` would unsubscribe people who never asked.

The domain's MX points at Resend, and `email-inbound` forwards everything to the track's Gmail with the sender on Reply-To. Mail from the domain's own addresses isn't forwarded, so nothing loops.

## Caching gotchas

`/assets` and `/images` are served immutable for a year, which makes failures sticky:

- A missing file under `/assets` goes to `api/asset-missing.js` instead of the 404 page. A cached 404 would break that file for a year.
- A photo that fails is requested once more under a new query string (`src/lib/photoRecovery.js`). The browser would otherwise replay the failure.
- A tab left open across a deploy asks for chunks that are gone. `src/lib/chunk-recovery.js` reloads once per tab, and the allowance is tied to the chunk that failed so another loader succeeding can't hand it back.
- A stylesheet that fails is asked for once more under a new query string, attached to the page the reader is already on. Most of those failures are a request that didn't finish, not a build that moved on. Only when the second ask fails too does the document reload, once per tab. A tab that already spent its reload gets a notice with a button instead, since that sheet is the whole design past the first screen.
- The Barlow weights the first screen doesn't set are attached after the page lands, marked optional (`src/lib/fonts.js`). A marked sheet gets the second ask and nothing else. Reloading a settled page over three font weights is worse than the 400 those lines fall back to.

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
