---
name: design
description: Design pass for the Speedway 146 site (this repo). Use this for ANY design work here — /design, "design pass", "design review", "improve the site/UI", "this looks AI generated", adding or editing any section, CTA, or copy, and as a final check before shipping any user-visible change. In this repo, /design means improving the LIVE SITE's code, not producing a mockup canvas — only build a canvas if the user explicitly asks for mockups/artboards, and then use the unscoped design canvas skill for the drawing while still applying this skill's checks to the content.
---

# Speedway 146 design pass

A design pass here ends with shipped code, verified in production — not a
report, not a mockup. Work through all four checks below; each exists
because it caught (or failed to catch) a real defect on this site.

## 1. Copy integrity — the check that matters most

Every visible sentence must survive two questions:

- **Does everything it references exist?** Read the copy while looking at
  the rendered page it sits on. "Or skip the form" shipped on a page with
  no form; it read as generated filler and the client noticed. A CTA can
  only reference elements, pages, and actions that are actually there.
- **Is every number and fact traceable to a source of truth?** The sources
  are `src/lib/content/*.js` (hours, contact, specials, FAQs, bounce
  prices) and `src/lib/stripe-config.js` (every racing/party price). A
  "$59.99 family deal" shipped that existed nowhere in the price list —
  four races are $51.99. Sweep with `grep -rn '\$[0-9]' src/` and trace
  each figure to its source. Never invent a price, date, capacity, or
  policy: if the fact isn't in a source file, point to the phone number
  ((281) 722-4468) or omit the claim.

More real catches to pattern-match against: an age stat rendered as `5"`
(inch mark copy-pasted from neighboring height stats); hero copy said
"Six years" while the page's own timeline ran 2019–2026. Copy that
contradicts other copy on the same page is the same bug.

Known quirk, do not "fix" silently: the contact email is spelled
`speedsway146@gmail.com` (extra s) everywhere. It may be the real
mailbox — ask before changing it.

## 2. Slop and ornament sweep

The house style is racing signage: Bebas Neue + Inter, race red on
asphalt, tight radii (6/10/16px), one monoline icon set
(`src/components/common/Icon.jsx` — never emoji, never another library).
Within that style, decoration needs a job. Flags to remove:

- Ornament stacks on one element (accent bar + pulsing dot + icon +
  badge on a single phone chip — a real removal).
- Redundant icons in buttons: a label plus two icons wraps to two lines
  and says nothing twice. One icon max; add `whitespace-nowrap` to CTA
  labels and check them at 390px AND desktop column widths.
- Filler phrases that could describe any business. Copy here is specific:
  prices, hours, the room capacity, the phone number.

## 3. Verify the rendered page, not the JSX

Screenshots are the only proof. The build needs dummy env vars, and the
sandbox has Chromium pre-installed for playwright-core:

```bash
VITE_SUPABASE_URL=https://dummy.supabase.co VITE_SUPABASE_ANON_KEY=dummy-key npm run build
npm run preview -- --port 4173   # then screenshot via playwright-core, executablePath /opt/pw-browsers/chromium, args --no-proxy-server
```

Check at 1440px and 390px, and wait ~2s after scrolling (AOS animations
mid-flight look like layout bugs that aren't — measure settled geometry
before concluding overlap). Look specifically for:

- **Text over photos**: light text needs a scrim. The house recipe is the
  gallery figcaption's own gradient block
  (`pt-16 bg-gradient-to-t from-asphalt-950/95 via-asphalt-950/60 to-transparent`
  on the caption container), not a heavier full-image overlay.
- **Light text over the chalk divider wedge**: page heroes end in a white
  diagonal (`speedway-divider`); at phone heights it rises behind hero
  content and turns white text invisible. Give such text a dark pill.
- **Classes that silently compile to nothing**: theme colors must stay in
  the `withAlpha`/color-mix form in `tailwind.config.js`. Plain `var()`
  strings make Tailwind drop every `/opacity` utility with no error —
  this once erased every scrim on the site. After building, confirm with
  `grep 'color-mix' dist/assets/index-*.css` that opacity utilities exist.

## 4. Ship it and prove it

Merging to `develop` only makes a preview. The release flow is:

1. Branch → PR to `develop` → merge when the `check` run is green
   (squash, matching repo history).
2. Promote: PR `develop` → `main` (title "Promote develop to main: …"),
   merge-commit it. Only this makes the change live.
3. Verify production: fetch `https://baytowngokarts.com` (note the k;
   baytowngocarts.com redirects there), pull the hashed
   `/assets/index-*.js` and `.css`, and grep for the new copy/classes —
   and for the absence of what was removed.

A design pass isn't done until step 3 confirms the live bundle changed.
