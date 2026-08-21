# CLAUDE.md

Speedway 146 — go-kart track in Baytown, TX. Vite + React SPA with Tailwind,
Supabase (data + edge functions), and Stripe Checkout. Hosted on Vercel.

## Deployment — merging to main does NOT make the site live

- Production is the Vercel project `speedway-146` (team `taylor-url`), serving
  baytowngokarts.com (canonical) and baytowngocarts.com (301 → gokarts).
- The GitHub → Vercel push webhook has been broken since 2026-07-11: pushes and
  merges to `main` do not create deployments. Never tell the owner the site is
  "live" or "updated" after a merge without confirming a new production
  deployment actually exists.
- To check what production is serving, compare
  https://baytowngokarts.com/release.json against `public/release.json` on
  `main` — the `version` fields must match.
- The Vercel MCP tool `create_git_project` (repo `TaylorURL/baytowngocarts-com`,
  projectName `speedway-146`) builds current `main` but only as a *preview*
  deployment (aliased at speedway-146-git-main-taylor-url.vercel.app). Getting
  it onto the production domains requires "Promote to Production" in the Vercel
  dashboard, which only the owner can click. This stays true until the Vercel
  GitHub App installation on the TaylorURL org is repaired; once auto-deploy
  works again, this section can be trimmed to "verify the deployment".

## Content conventions

- Contact details (phone, email, address, socials, hours) live in
  `src/lib/content/business.js` — every page renders `CONTACT_INFO` from there.
  But some FAQ answers in `src/lib/content/faqs.js` hardcode contact details,
  so grep the whole repo (all number formats, `tel:` links included) whenever
  contact info changes.
- Current public phone number: (281) 722-4468 (changed 2026-08-21, PR #99).

## Release convention

A release bump touches four files: `package.json`, `package-lock.json`
(regenerate with `npm install --package-lock-only`, don't hand-edit), the
README version badge, and `public/release.json`.

## Workflow

- CI (`.github/workflows/ci.yml`) runs lint, test, and build on pushes and PRs
  to `develop` and `main`. Run `npm run build` locally before pushing.
- Work lands on `main` via PRs; version-bump PRs follow the release convention
  above.
