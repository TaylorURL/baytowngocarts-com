<p align="center"><img src="public/logo.svg" alt="Speedway 146 Logo" width="140" /></p>

<h1 align="center">Speedway 146</h1>

<p align="center"><strong>Go-Kart Entertainment & E-Commerce Platform for Baytown, TX</strong></p>

<p align="center">
  <img src="https://img.shields.io/badge/version-3.1-blue?style=flat-square" alt="Version 3.1" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React 18" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite 5" />
  <img src="https://img.shields.io/badge/Zustand-5-433E38?style=flat-square" alt="Zustand 5" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Stripe-635BFF?style=flat-square&logo=stripe&logoColor=white" alt="Stripe" />
  <img src="https://img.shields.io/badge/Tailwind-3-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind 3" />
  <img src="https://img.shields.io/badge/Framer_Motion-FF0055?style=flat-square&logo=framer&logoColor=white" alt="Framer Motion" />
</p>

---

Speedway 146 is a full-featured marketing and e-commerce platform for an outdoor go-kart and entertainment venue in Baytown, Texas. The application handles the full customer journey — from discovering the venue and browsing the product catalog, through cart management and Stripe-powered checkout, to order confirmation and purchase history tracking. On the operational side, a staff admin panel surfaces real-time order data and revenue metrics, while a traffic analytics dashboard gives insight into how visitors arrive and move through the site.

The platform is built to handle the distinct needs of a physical venue that sells digital tickets and packages: variable pricing tiers, group discount logic, multi-item cart state, tax-inclusive server-side fee calculation, and order lifecycle management — all wired together in a single React application backed by Supabase and Stripe.

---

## Product Catalog & Pricing

The product catalog covers the full range of Speedway 146's offerings across five categories: individual races at $13.99, combo packages at $34.99, family deals at $59.99, unlimited passes at $44.99, and double-seater packages ranging from $19.99 to $39.99. Party packages start at $699 and are positioned as a premium event option. All product definitions and pricing live in a centralized `constants.js` file, keeping catalog updates isolated to a single source of truth.

Fee calculation is non-trivial and is handled entirely server-side inside a Supabase Deno edge function. Each order accumulates five fee components: a 4% transaction fee, a 1% platform fee, and 8.25% Texas state sales tax applied to the subtotal — with a 10% group discount automatically applied when a cart contains 15 or more racers. By anchoring this logic in an edge function rather than the client, the platform ensures that fee totals cannot be manipulated before reaching Stripe, and that a single authoritative computation path handles all order scenarios.

## Cart & Checkout Flow

Cart state is managed globally via Zustand 5, giving any component in the tree synchronous, reactive access to items, quantities, and totals without prop drilling or context complexity. The cart persists across navigation within a session, and the checkout page renders a live summary before handing off to Stripe Checkout.

The Stripe integration is configured in a dedicated `stripe-config.js` module that toggles between test and production keys via a single environment flag. When a customer initiates checkout, the application calls a Supabase Deno edge function that constructs the Stripe session server-side — applying fee components, attaching metadata, and returning a redirect URL. This keeps secret keys and business logic off the client entirely. A post-checkout success page confirms the order and triggers the order record creation in Supabase.

## Order Management & Staff Panel

Authenticated staff users access an administration panel purpose-built for order operations. The panel surfaces aggregate order statistics at the top — total revenue, today's revenue, and order count — followed by a searchable, filterable order table. Each row is expandable to reveal full order details: line items, fee breakdown, customer information, and current payment status. Staff can update payment status directly from this view, making it practical as a day-of operations tool at the venue.

Orders are stored in Supabase with Postgres RLS policies that restrict read and write access to authenticated staff accounts. Anonymous users have no visibility into order data, and the client-side routing enforces a role check before mounting any staff interface.

## Traffic Analytics Dashboard

A dedicated traffic dashboard gives staff visibility into how visitors interact with the site. The dashboard surfaces page views broken down by path, device type distribution, traffic source attribution, hourly activity patterns, and a visitor geolocation view — all filterable by time window. This data is collected passively via a `useTrafficLogger` hook that fires on every non-staff page mount, capturing the current path, user agent string, referrer, screen dimensions, and IP-based geolocation resolved through the ipapi.co API.

The logging hook is intentionally excluded from staff-facing routes to prevent internal navigation from polluting the traffic data. On the database side, Supabase RLS allows anonymous inserts into the traffic table — so no authentication is required to record a visit — but restricts all reads to staff accounts. The result is a low-friction passive collection system that requires no user action and imposes no performance overhead on the customer-facing experience.

## Animated Marketing Experience

The home page opens with a five-image hero slideshow that cycles through venue photography, followed by a features section, an eight-image gallery, customer testimonials, and a pricing overview — all animated with Framer Motion and AOS (Animate On Scroll). The testimonials section presents six reviews with attribution, and the FAQ section organizes 33 questions across categorized groups with smooth accordion expansion.

The entire visual system is built on CSS custom properties — `--color-navy`, `--color-red`, `--color-silver`, `--color-yellow`, `--color-green`, and a gray scale — defined globally and referenced throughout the Tailwind component classes. This makes palette-wide theming changes a single-file update rather than a codebase-wide search.

---

## Architecture

### Tech Stack

| Layer                | Technology                             |
| -------------------- | -------------------------------------- |
| UI Framework         | React 18                               |
| Build Tool           | Vite 5                                 |
| Global State         | Zustand 5                              |
| Styling              | Tailwind CSS 3 + CSS Custom Properties |
| Animation            | Framer Motion, AOS                     |
| Auth & Database      | Supabase (PostgreSQL + RLS)            |
| Serverless Functions | Supabase Deno Edge Functions           |
| Payments             | Stripe Checkout                        |
| Geolocation          | ipapi.co                               |
| Deployment           | Vercel                                 |

### Data Flow

```
Pages
  └── Custom Hooks
        ├── Zustand Store (cart state)
        └── Supabase Client
              └── Edge Functions
                    ├── Stripe (checkout session)
                    └── PostgreSQL
                          ├── orders (purchase records)
                          └── traffic_events (analytics)
```

---

## Project Stats

| Metric           | Value                                                    |
| ---------------- | -------------------------------------------------------- |
| Routes           | 17                                                       |
| Products         | 12+                                                      |
| FAQs             | 33 (categorized)                                         |
| Testimonials     | 6                                                        |
| Fee Components   | 5 (transaction, platform, tax, subtotal, group discount) |
| Edge Functions   | 2 (checkout, fee calculation)                            |
| Hero Slides      | 5                                                        |
| Gallery Images   | 8                                                        |
| Security Headers | 5                                                        |

---

<p align="center"><sub>Built by <strong>Trenton Taylor</strong></sub></p>
