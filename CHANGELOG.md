# Changelog

All notable changes to this project will be documented in this file.

## [2.3] - 2026-03-15

- Removed the Inter font entirely, making Bebas Neue the primary body font instead of just using it for headings
- Removed the separate heading font-family rule for h1/h2/h3 since Bebas Neue is now the global body font
- Removed the "Speedway 146" text labels from the header logo (both desktop and mobile nav) and the footer, leaving just the logo image

## [2.2] - 2026-03-15

- Added Inter font family alongside Bebas Neue for improved typography options
- Updated theme color from #0a1929 to #0b1a2e across the site
- Refactored Header component by extracting traffic light styles, dropdown hover handlers, and repeated class strings into shared constants
- Refactored Footer component by extracting quick links into a data-driven array and consolidating repeated social link class strings
- Extracted repeated input class string in ContactForm into a shared constant
- Updated Button component with enhanced hover effects including shadow, lift translate, and adjusted background color shades
- Added gradient background to the Footer (from navy-800 to navy-900) and increased vertical padding
- Replaced hardcoded header background color with a CSS variable reference
- Renamed DashboardPage import to PurchasesPage in App.jsx for clarity
- Removed unnecessary empty conditional class string from nav link styling in Header
- Added JSDoc comments across all components, hooks, pages, sections, and library files
- Added Inter font-family as the default body font in Theme.css and updated CSS custom properties
- Refactored LocationsSection with extracted constants for location data, info items, and shared styles
- Refactored CartPage by extracting repeated styling into shared class constants
- Refactored PricingPage by extracting card styling and section layout into shared constants
- Refactored TrafficPage by consolidating repeated stat card and chart styling into constants
- Refactored PurchasesPage by extracting status badge color mapping into a helper
- Simplified NotFoundPage with cleaner layout and updated styling
- Updated SuccessPage with refined spacing and visual adjustments
- Updated StaffPanelPage with minor style refinements
- Updated LoginPage and SignupPage with consistent styling tweaks
- Added CSS custom properties for racing-stripe gradients, shadow utilities, and glow effects in Theme.css
- Added shadow-red and shadow-navy box-shadow utilities in Tailwind config
- Updated base styles in index.css with new font stack and refined global defaults
- Replaced hardcoded Supabase URL in supabase.js with an environment variable reference
- Added useTraffic hook enhancements with additional tracking capabilities

## [2.1] - 2026-03-15

- Add SEO meta tags including Open Graph, Twitter card, keywords, canonical URL, and theme color
- Add robots.txt to block crawlers from internal pages and sitemap.xml for public pages
- Add a custom 404 Not Found page with links back to home and pricing
- Close the user menu and mobile nav when clicking outside or navigating to a new page
- Redesign the cart page layout for better mobile responsiveness, moving the delete button to the top-right corner
- Fix typo in Footer logo className from "h9" to "h-9"
- Fix typo in Footer email from "speedsway146" to "speedway146"
- Make the copyright year dynamic instead of hardcoded
- Replace dead anchor links for Privacy Policy and Terms of Service with React Router links to /faq
- Fix GallerySection filename typo (was "GallarySection")
- Remove unused ProductsSection component, ChatWidget, and Stripe checkout library
- Update environment type declarations to reflect actual env vars used (Supabase and Stripe keys instead of OpenAI)
- Optimize cart checkout to calculate fees once instead of calling calculateFees() three times

## [2.0] - 2026-03-15

- Add staff access to the purchase details page so staff can view any order without the user_id filter
- Wait for staff loading state before fetching purchase details to avoid race conditions
- Route staff users back to the staff panel instead of the dashboard on navigation and errors
- Update the back button label to show "Back to Staff Panel" for staff users

## [1.9] - 2026-03-15

- Make staff panel stats cards and order table fully responsive for mobile screens
- Add mobile card layout for orders with expandable details showing customer email, itemized breakdown, and total
- Extract reusable StatusBadge component for order status display
- Add click-to-expand interaction on order rows in both desktop and mobile views
- Adjust stat card grid from single-column to two-column on small screens

## [1.8] - 2026-03-15

- Replaced turl-release with nit as the release tooling
- Removed turl-release dev dependency and its lock file entry
- Removed the turl.json config file from public directory
- Cleaned up stale package-lock copy file

## [1.7] - 2026-03-02

- Enhanced the SectionHeading component with a new badge feature, allowing for customizable badges with variant styles (red and navy), and added subtle animation with data-aos for better visual appeal.
- Centralized contact information by integrating a constants file in the ActionSection, dynamically pulling the phone number from CONTACT_INFO instead of hardcoding it.
- Restructured the AttractionsSection to use a SectionHeading component for consistent heading styling and introduced a badge for visual hierarchy.
- Improved the FeatureSection by adopting the updated SectionHeading component for better title and subtitle presentation.
- Simplified the GallarySection by removing redundant code or elements, focusing on core gallery functionality for cleaner presentation.
- Updated the HeroSection with refined styling or content adjustments for improved user engagement on the landing page.
- Enhanced the TestimonialSection with consistent heading styles using the SectionHeading component and minor layout tweaks for better readability.
- Introduced a new useImageSlideshow hook to manage image slideshow functionality, likely supporting dynamic image transitions in gallery or hero sections.
- Added a constants.js file to store reusable data like contact information and possibly other static content for easier maintenance across the application.
- Made minor structural adjustments in HomePage.jsx to integrate the updated components and ensure cohesive rendering of all sections.

## [1.6] - 2026-02-25

- Updated the turl-release dependency to version 3.9.0 with a new commit reference.
- Removed the direct GitHub reference for turl-release from the package.json dependencies.

## [1.5] - 2026-02-25

- Updated the capacity of the private party room in `src/pages/EventsPage.jsx` from 30 to 45 guests in the birthday event features.
- Removed the entire "Party Packages" section from `src/pages/EventsPage.jsx`, including the display of Basic, Premium, and Ultimate party packages along with their pricing and features.
- Removed the "Private Party Room" section content from `src/pages/EventsPage.jsx`, which detailed the party room's capacity, setup, and decorations.
- Removed the import of the `Star` icon from `src/pages/EventsPage.jsx` as it is no longer used after the removal of the packages section.

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
