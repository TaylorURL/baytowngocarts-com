# Changelog

All notable changes to this project will be documented in this file.

## [3.1.9] - 2026-04-03

- Speedway 146 Release v3.1.9

## [3.1.9] - 2026-04-03

- Speedway 146 Release v3.1.9

## [3.1.8] - 2026-04-03

- `package.json`
- `package-lock.json`
- `public/nit.json`
- `src/components/forms/ContactForm.jsx`

## [3.1.7] - 2026-04-03

- Speedway 146 Release v3.1.7

## [3.1.7] - 2026-04-02

- Speedway 146 Release v3.1.7

## [3.1.5] - 2026-04-02

- Speedway 146 Release v3.1.5

## [3.1.4] - 2026-04-02

- Speedway 146 Release v3.1.4

## [3.1.3] - 2026-04-02

- Speedway 146 Release v3.1.3

## [3.1.2] - 2026-04-01

All notable changes to this project will be documented in this file.

## [3.1.6] - 2026-04-03

- Speedway 146 Release v3.1.6

## [3.1.5] - 2026-04-02

- Speedway 146 Release v3.1.5

## [3.1.4] - 2026-04-02

- Speedway 146 Release v3.1.4

## [3.1.3] - 2026-04-02

- Speedway 146 Release v3.1.3

## [3.1.2] - 2026-04-01

- Speedway 146 Release v3.1.2

## [3.1.2] - 2026-04-01

- Speedway 146 Release v3.1.2

## [3.1.1] - 2026-04-01

- Speedway 146 Release v3.1.1

## [3.1] - 2026-04-01

- Reformatted JSON error response objects across the create-checkout and stripe-webhook edge functions for consistent multi-line style

## [3.0] - 2026-04-01

- Reformatted error response objects in the create-checkout edge function for improved readability — headers and status are now on separate lines across all four validation error responses

## [2.9] - 2026-03-15

- Redesigned the Staff Panel hero section with a taller layout, vertical centering, and a crosshatch pattern overlay
- Replaced the gradient overlay with increased background image opacity for better visual impact
- Swapped the Shield icon header for an "ADMIN" badge pill with a split-color "Staff Panel" heading
- Added fade-up animation to the hero content area
- Enlarged heading and subtitle text with improved responsive sizing and spacing

## [2.8] - 2026-03-15

- Fixed sticky section positioning on FAQ page by using precise pixel values (top-[58px] and lg:top-[112px]) instead of Tailwind spacing classes

## [2.7] - 2026-03-15

- Redesigned the Pricing page hero section with vertically centered content and a taller minimum height
- Increased background image opacity and removed the gradient overlay for a bolder look
- Added a diagonal crosshatch pattern overlay to the hero background
- Added a "PRICING" badge above the heading and highlighted "Packages" in red
- Bumped up heading and subtitle font sizes for larger screens
- Added a fade-up animation to the hero content
- Added an angled bottom edge transition from the hero into the next section

## [2.6] - 2026-03-15

- Redesigned the site header with a two-bar layout: a silver top bar for logo, contact info, and auth, and a dark navy bottom bar for navigation links
- Added contact info (phone number, address, hours) to the desktop header using new Clock, MapPin, and Phone icons
- Replaced the old traffic light grid with a new TrafficLights component featuring glow effects and a more polished appearance, positioned on both sides of the nav bar
- Moved navigation items to a module-level constant and restyled nav links with uppercase tracking, white-on-dark text, and an animated red underline indicator
- Redesigned the user dropdown menu with a "Signed in as" header section and cleaner layout
- Added a ChevronDown icon to the user menu button that rotates when the menu is open
- Simplified the mobile menu drawer with a dark-themed header, updated styling, and added traffic lights decoration
- Replaced inline hover style handlers throughout with Tailwind utility classes for cleaner hover/focus states
- Updated the mobile overlay to include a backdrop blur effect
- Changed the displayed user identifier from full email to just the username portion before the @ symbol
- Updated the FAQ page title from "Frequently Asked Questions" to "FAQ"

## [2.5] - 2026-03-15

- Added Privacy Policy page with full policy content at /privacy
- Added Terms of Service page with full terms content at /terms
- Added routes for the new privacy and terms pages in App.jsx
- Moved footer copyright, legal links, and website credit from a centered bottom section into the left column with a more compact layout
- Fixed Privacy Policy and Terms of Service links to point to their actual pages instead of /faq

## [2.4] - 2026-03-15

- Redesigned the entire site from a dark navy theme to a light gray/white color scheme
- Updated the Header with a light gradient background, lighter border styling, and revised hover states for navigation links
- Converted the Footer from a dark navy gradient to a light gray gradient with updated text and icon colors
- Changed the mobile menu sidebar to use the new light theme with matching border and background colors
- Updated the mobile menu overlay from 60% to 40% opacity
- Replaced navy-based button secondary variant with gray-700 styling
- Updated SectionHeading component to use gray-800 text and gray-700 badge background instead of navy
- Changed the ActionSection background from a red gradient to a dark slate gradient
- Updated the theme-color meta tag from dark navy (#0b1a2e) to light gray (#e8ecf1)
- Adjusted dropdown menu styling in the Header to use white backgrounds and gray text instead of navy
- Updated cart and user menu button styles from navy backgrounds to semi-transparent white
- Changed icon colors throughout the Header from red-500 to gray-500
- Updated Footer link hover colors from red-400 to red-600 and text colors from gray-300 to gray-600
- Changed the Footer attribution text from "Design by" to "Website by"
- Added new Tailwind config extensions for the light theme
- Updated Theme.css with revised CSS custom properties to support the new light color palette
- Refreshed styling across all page components (About, Cart, Contact, Events, FAQ, Pricing, Purchases, PurchaseDetails, StaffPanel, Success, Traffic) to align with the new light theme
- Updated section components (Attractions, Feature, Gallery, Locations, Question, Testimonial) with matching light-theme color adjustments
- Removed backdrop-blur effect from the Header traffic light container
- Softened the logo drop-shadow from a red glow to a subtle dark shadow

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
