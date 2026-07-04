<p align="center">
  <img src="public/images/logo.png" width="200" alt="Speedway 146" />
</p>

<h1 align="center">Speedway 146</h1>

<p align="center">
  <b>Go-kart racing and family entertainment in Baytown, TX — booked online.</b>
</p>
<p align="center">
  A React storefront where guests build a cart of races, packages, and parties<br />
  and check out through Stripe, with pricing enforced server-side on Supabase.
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-18-e11d2a?style=for-the-badge&logo=react&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-5-e11d2a?style=for-the-badge&logo=vite&logoColor=white" />
  <img alt="React Router" src="https://img.shields.io/badge/React_Router-6-e11d2a?style=for-the-badge&logo=reactrouter&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-3-e11d2a?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-e11d2a?style=for-the-badge&logo=supabase&logoColor=white" />
  <img alt="Stripe" src="https://img.shields.io/badge/Stripe-e11d2a?style=for-the-badge&logo=stripe&logoColor=white" />
  <img alt="Vercel" src="https://img.shields.io/badge/Vercel-deployed-e11d2a?style=for-the-badge&logo=vercel&logoColor=white" />
</p>

<br />

## Why Speedway 146

A go-kart venue needs guests to browse tickets, buy them, and show up — without the front desk fielding every booking by phone. Speedway 146 is the single-page storefront that handles it: an animated marketing site funnels visitors into a cart of races, packages, and parties, checkout runs through Stripe with prices re-verified on the server, and staff get an authenticated panel for orders and live traffic. The repository is named `baytowngocarts-com` for historical reasons — the live product is **Speedway 146**.

<table width="100%">
  <tr>
    <td width="33%" valign="top">
      <h3 align="center">Book &amp; pay online</h3>
      <p align="center">Browse single-kart bundles, double-seater packages, and party rentals, add them to a Zustand cart, and check out through hosted Stripe Checkout.</p>
    </td>
    <td width="33%" valign="top">
      <h3 align="center">Server-authoritative pricing</h3>
      <p align="center">A Supabase edge function re-prices every cart against a canonical map, applies Texas tax and the group discount, and builds the Stripe session — totals can't be tampered with client-side.</p>
    </td>
    <td width="33%" valign="top">
      <h3 align="center">Staff operations built in</h3>
      <p align="center">Authenticated panels for orders, revenue, and a live traffic dashboard, all reading straight from Supabase behind row-level security.</p>
    </td>
  </tr>
</table>

<br />

## Stack

| Layer     | Choice                                                          |
| :-------- | :------------------------------------------------------------- |
| Framework | React 18 + React Router 6                                      |
| Build     | Vite 5                                                         |
| Styling   | Tailwind CSS 3 + CSS custom properties (`styles/Theme.css`)    |
| Cart      | Zustand in-memory store (`useCart`)                            |
| Motion    | Framer Motion · AOS · react-intersection-observer             |
| Backend   | Supabase — Postgres + RLS, Deno edge functions                |
| Payments  | Stripe Checkout via Stripe Connect                            |
| Analytics | Supabase `site_traffic` log + embedded Sunday Analyzer beacon |
| Hosting   | Vercel (SPA rewrites + security headers in `vercel.json`)     |

## Getting started

```bash
npm install
npm run dev        # Vite dev server
npm run build      # production build to dist/
npm run preview    # preview the production build
npm run lint       # eslint
```

The Supabase client needs two environment variables:

| Variable                 | Purpose                                |
| :----------------------- | :------------------------------------- |
| `VITE_SUPABASE_URL`      | Supabase project URL                   |
| `VITE_SUPABASE_ANON_KEY` | Public anon key for the browser client |

## Tickets, packages & checkout

Products are defined in `src/lib/stripe-config.js`, generated from a few small tier tables:

- **Single-kart bundles** — 1 / 4 / 8 / 15 / 25 / 35 / 50 tickets, `$13.99` up to `$399.99`, with the per-race rate dropping as the bundle grows.
- **Double-seater bundles** — 1 / 2 / 4 / 6 tickets, `$19.99` to `$89.99` (driver 53"+, passenger 33"+).
- **Party packages** — the `$699` All-Access Family Race Party plus private-track and add-on upgrades.

The cart is a Zustand store (`useCart`) any component can read reactively; it survives client-side navigation. Checkout hands the cart to the `create-checkout` edge function, which validates each item against the server-side price map, computes fees, builds the hosted Stripe session, and returns its URL — secret keys and pricing logic never reach the browser.

| Fee component   | Rate                       |
| :-------------- | :------------------------- |
| Transaction fee | 4% + $0.30                 |
| Platform fee    | 1%                         |
| Texas sales tax | 8.25%                      |
| Group discount  | −10% at 15 or more tickets |

On a completed payment, Stripe calls the `stripe-webhook` edge function, which writes the order (numbered `SPW146-YYYY-NNNNNN`) into the Supabase `purchases` table with the service-role key.

## Routes

| Path                | Page              | Notes                                    |
| :------------------ | :---------------- | :--------------------------------------- |
| `/`                 | Home              | Animated marketing storefront            |
| `/pricing`          | Pricing           | Ticket, package, and party tiers         |
| `/cart`             | Cart              | Review, then hand off to Stripe Checkout |
| `/success`          | Success           | Post-payment confirmation                |
| `/dashboard`        | Purchases         | A customer's own order history           |
| `/staff`            | Staff panel       | Orders & revenue — staff only            |
| `/traffic`          | Traffic dashboard | Site analytics — staff only              |
| `/login`, `/signup` | Auth              | Supabase email auth                      |

Also `/about`, `/events`, `/contact`, `/faq`, `/privacy`, `/terms`, and a catch-all 404.

## How it works

- **Pricing is never trusted from the client.** The `create-checkout` edge function holds the canonical price map, rejects mismatched line items, and is the only place fees, tax, and the group discount are computed.
- **Orders arrive via webhook.** `stripe-webhook` is the source of truth for a completed purchase — it mints the `SPW146-…` order number and writes the row server-side, so a closed browser never loses a sale.
- **Staff access is gated in the data layer.** `useAdmin` checks the caller against a `staff` table, and Supabase row-level security backs the order and traffic reads behind `/staff` and `/traffic`.
- **Two analytics layers run in parallel.** The traffic-logging hook writes page views to `site_traffic` on every customer-facing mount (staff routes excluded), while the independent `sunday-analyzer` provider fires a cookieless pageview beacon to an external ingest endpoint.
- **Theming is a single-file edit.** The whole palette is driven by CSS custom properties in `src/styles/Theme.css`, so a rebrand is one file, not a component sweep.

## Project structure

```
src/
  components/   common UI, section blocks, forms
  pages/        routes — Home, Pricing, Cart, Success, StaffPanel, Traffic, …
  hooks/        useCart (Zustand), useAuth, useAdmin, useTraffic
  layouts/      MainLayout — header, footer, page-view logging
  lib/
    stripe-config.js   product tiers, packages, price ids
    pricing.js         price-string / cents helpers
    supabase.js        shared Supabase client
    content/           hero, gallery, faqs, testimonials, business info
    sunday-analyzer/   cookieless pageview beacon provider
  styles/       Theme.css — design tokens (CSS custom properties)
supabase/
  functions/    create-checkout, stripe-webhook (Deno edge functions)
  site-traffic-schema.sql
public/images/  venue photos, logo, waivers
```

## Deploy

Vercel builds with `npm run build` and serves `dist/` as an SPA — every path rewrites to `index.html`, hashed assets get a one-year immutable cache, and `vercel.json` sets the CSP, HSTS, and other security headers.

## License

Private project — all rights reserved. See [`LICENSE.md`](LICENSE.md). Made by [TaylorURL](https://taylorurl.com).

<br />

<p align="center">
  <sub>Baytown's karting storefront — book a race, price it on the server, hand off to Stripe.</sub>
</p>
