<img src="public/images/logo.webp" width="160" alt="Speedway 146" />

# Speedway 146

Website for Speedway 146, a go-kart track in Baytown, Texas.

[baytowngokarts.com](https://baytowngokarts.com)

<img src="https://img.shields.io/badge/version-2026.44.1-e11d2a?style=for-the-badge" alt="Version 2026.44.1" />

Race tickets, party packages and add-ons in one cart, paid through Stripe. Customer accounts with past orders. A staff panel for orders, revenue and traffic. React, prerendered per route, on Supabase.

The repo is `baytowngocarts-com`. The live domain is spelled baytowngokarts.com.

## How it's built

- **Prerendered.** `npm run build` does a client build, an SSR build, then `scripts/prerender.js` writes each public route to its own document. The browser attaches to what's already there. Account, cart and staff routes rewrite to one shell, `app.html`.
- **CSS for the first paint is inline.** Every route is rendered whole at build time, so the rules its markup needs are known. Beasties puts them in the head and loads the full sheet without blocking. Rules keyed on `data-` and `aria-` attributes ride along, because those states only exist after load.
- **Supabase loads on first use.** `src/lib/supabase.js` imports the SDK when something asks for a client. A visitor with no account and no cart never downloads it. The build also has no credentials, so connecting at import would fail it.
- **Prices live on the server.** `create-checkout` checks every line against its own price map. An unknown product or a price that doesn't match is refused. Promo codes are read and spent with the service role. The browser can't mint one or mark one unused.
- **Stripe is the record of payment.** `stripe-webhook` writes the order, clears the cart reminder and spends the code. A duplicate insert (`23505`) means the success page got there first, so it answers 200 instead of making Stripe retry forever.

<details>
<summary>Email</summary>

- Every fifteen minutes `pg_cron` posts to `email-sweep`. It first settles checkouts past expiry by asking Stripe, so reminders don't depend on the webhook seeing `checkout.session.expired`. Then it sends cart reminders, cart offers and come-back emails that are due.
- Each send writes `email_log` first. A unique `(kind, ref)` stops a second sweep sending it again. A failed send is retried by later sweeps, three times at most.
- Checkouts stay open an hour, not Stripe's default day, so a reminder can go out the same afternoon.
- `email-unsubscribe` takes a per-account token from the one-click header or the `/unsubscribe` page. A `GET` only redirects. Mail scanners follow links, and unsubscribing on `GET` would unsubscribe people who never asked.
- The domain's MX points at Resend. `email-inbound` forwards anything sent to the domain to the track's Gmail with the sender on Reply-To. Mail from the domain's own addresses isn't forwarded, so nothing loops.

</details>

<details>
<summary>Decisions and tradeoffs</summary>

- A tab left open across a deploy asks for chunks that are gone. `src/lib/chunk-recovery.js` reloads once per tab. The allowance is tied to the chunk that failed, so one loader succeeding can't hand it back to the one that didn't.
- A missing file under `/assets` goes to `api/asset-missing.js` instead of the 404 page. The `/assets` header rule marks everything immutable for a year, and a cached 404 would break that file for a year.
- A photo that fails is asked for once more under a new query string, because `/images` is cached immutable and the browser would replay the failure (`src/lib/photoRecovery.js`).
- Ambient motion waits for the page to finish arriving, then a quiet stretch, then idle (`src/lib/idle.js`). It never redraws the first screen under someone who just got it.
- The WebGL particles check for a software renderer and don't animate on one.
- Traffic is the site's own `site_traffic` table. Crawlers and PageSpeed runs aren't written.
- `middleware.js` checks a TaylorURL status endpoint and shows a holding page if the site is paused. Fails open. `api/version.js` returns the deployed commit, uncached.

</details>

<details>
<summary>Running it locally</summary>

```bash
npm install
cp .env.example .env
npm run dev        # Vite dev server
npm run build      # builds the site and prerenders every public page
```

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`. The functions in `supabase/functions` read their Stripe and Resend keys from the Supabase project, not from `.env`.

</details>

## Built with

React 18, React Router, Vite, Tailwind CSS, Zustand, Supabase, Stripe Checkout and Resend. Hosted on Vercel.

<details>
<summary>License</summary>

Proprietary. Copyright (c) 2026 TaylorURL LLC, all rights reserved. See [LICENSE.md](LICENSE.md).

</details>

Built and maintained by [TaylorURL](https://www.taylorurl.com).
