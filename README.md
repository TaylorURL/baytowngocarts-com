<p align="center">
  <img src="public/images/logo.webp" width="160" alt="Speedway 146" />
</p>

<h1 align="center">Speedway 146</h1>

<p align="center">Website for Speedway 146, a go-kart track in Baytown, Texas.</p>
<p align="center"><a href="https://baytowngokarts.com">baytowngokarts.com</a></p>

<p align="center">
  <img src="https://img.shields.io/badge/version-2026.44.1-e11d2a?style=for-the-badge" alt="Version 2026.44.1" />
</p>

Speedway 146 is an outdoor go-kart track on TX-146 in Baytown, with bounce houses and party rooms. The site lets families buy race tickets and book birthday parties online through Stripe instead of calling. Staff use the same site to see orders, revenue and traffic.

The repo is named `baytowngocarts-com`, but the live domain is spelled baytowngokarts.com.

## What's on the site

- Race ticket bundles, party packages and party add-ons, all in one cart that checks out through Stripe.
- An events page for birthdays and corporate outings.
- Customer accounts with past orders and receipts.
- Reminder emails for abandoned carts and come-back offers for past customers, each with a one-click unsubscribe.
- A staff panel for orders and revenue, and a traffic page that counts the site's own visits.
- A FAQ on height limits, what to wear and how a heat runs, plus an about page and a contact page with hours and directions.

## Running it locally

```bash
npm install
cp .env.example .env
npm run dev        # Vite dev server
npm run build      # builds the site and prerenders every public page
```

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env` to your Supabase project. The checkout and email functions in `supabase/functions` read their Stripe and Resend keys from the Supabase project, not from `.env`.

## Built with

React 18, React Router, Vite, Tailwind CSS, Zustand, Supabase, Stripe Checkout and Resend. Hosted on Vercel.

## License

Proprietary. Copyright (c) 2026 TaylorURL LLC, all rights reserved. See [LICENSE.md](LICENSE.md).

Built and maintained by [TaylorURL](https://www.taylorurl.com).
