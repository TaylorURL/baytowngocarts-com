import { PARTY_PROMO } from "./party.js";
import { UNLIMITED_WRISTBAND_SPECIAL } from "./specials.js";

/*
 * The bar's destinations.
 *
 * A destination with a `panel` opens a disclosure holding the sections
 * underneath it, so the tabbed and sectioned pages can be reached directly
 * rather than only through the page they live on. Each panel names the one
 * thing it wants clicked in `feature`; the rows beside it are the plain list
 * of where else that destination goes.
 */
export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Pricing",
    href: "/pricing",
    panel: {
      summary: "Wristbands, party packages and bounce house rates.",
      links: [
        {
          label: "Individual Racing",
          href: "/pricing?tab=individual",
          description: "Single heats and multi-race wristbands.",
        },
        {
          label: "Party Packages",
          href: "/pricing?tab=parties",
          description: "Private room, wristbands, staff-run heats.",
        },
        {
          label: "Bounce House",
          href: "/pricing?tab=bounce",
          description: "Weekday and weekend bounce rates.",
        },
      ],
      feature: {
        eyebrow: UNLIMITED_WRISTBAND_SPECIAL.eyebrow,
        title: UNLIMITED_WRISTBAND_SPECIAL.title,
        figure: UNLIMITED_WRISTBAND_SPECIAL.price,
        note: UNLIMITED_WRISTBAND_SPECIAL.perPerson,
        href: "/pricing?tab=individual",
        cta: "See the Rates",
      },
    },
  },
  {
    label: "Events",
    href: "/events",
    panel: {
      summary: "Book the track for a group.",
      links: [
        {
          label: "Birthday Parties",
          href: "/faq?search=party",
          description: "Room for 60, twenty wristbands included.",
        },
        {
          label: "Corporate Outings",
          href: "/contact",
          description: "Private heats, bracket or open format.",
        },
        {
          label: "Unlimited Wristband",
          href: "/events",
          description: "Two and a half hours, one flat price.",
        },
      ],
      feature: {
        eyebrow: PARTY_PROMO.eyebrow,
        title: PARTY_PROMO.title,
        figure: "60",
        note: "guests in the private room",
        href: PARTY_PROMO.faqLink,
        cta: PARTY_PROMO.faqCta,
      },
    },
  },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
];
