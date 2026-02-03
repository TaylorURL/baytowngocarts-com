# Changelog

All notable changes to this project will be documented in this file.

## [1.4] - 2026-02-03

- Updated version in `public/turl.json` from "1.2" to "1.3".
- Added support for party packages in `src/pages/PricingPage.jsx` with new `STRIPE_PARTY_PACKAGES` import and related cart functionality.
- Introduced a tabbed interface in `src/pages/PricingPage.jsx` for switching between "Individual Racing", "Party Packages", and "Bounce House" pricing options.
- Added new icons (`Castle`, `Crown`, `Flag`, `Star`) in `src/pages/PricingPage.jsx` for enhanced UI elements.
- Updated cart total calculation in `src/pages/PricingPage.jsx` to include party package costs.
- Enhanced UI styling in `src/pages/PricingPage.jsx` with a gradient overlay and adjusted opacity for background images in the pricing section.
- Added a list of features for party packages in `src/pages/PricingPage.jsx` to display package details.

## [1.2] - 2026-02-02

- Removed an empty line or stray content from `CHANGELOG.md`.

## [1.1] - 2026-02-02

- Updated ESLint configuration in `eslint.config.js` to use double quotes for string literals.
- Reformatted `index.html` with proper indentation and spacing for better readability.
- Simplified `jsconfig.json` by reformatting array entries to single lines for `lib`, `include`, `exclude`, and `paths`.
- Updated `package-lock copy.json` to use single-line arrays for `cpu` and `os` fields in various `@esbuild` dependencies.
