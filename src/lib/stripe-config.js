/** When true, prepends test Stripe products to the product list for payment testing. */
export const ENABLE_TEST_PRODUCTS = false;

const TEST_PRODUCTS = [
  {
    id: "test_payment",
    priceId: "test_payment_price",
    name: "Test Payment",
    description: "Live payment testing",
    price: "$1.00",
    mode: "payment",
    features: [
      "Test live Stripe payments",
      "Verify integration works",
      "Disable boolean after testing.",
    ],
    isTest: true,
  },
];

/**
 * Single-kart ticket bundles. Each tier is one Stripe product.
 * Add a new row to extend — `buildKartTier` derives id/priceId/labels/per-race.
 */
const SINGLE_KART_TIERS = [
  { tickets: 1, price: "$13.99", perRace: "$13.99" },
  { tickets: 4, price: "$51.99", perRace: "$13.00" },
  { tickets: 8, price: "$87.99", perRace: "$11.00" },
  { tickets: 15, price: "$149.99", perRace: "$10.00", isPopular: true },
  { tickets: 25, price: "$224.99", perRace: "$9.00" },
  { tickets: 35, price: "$297.99", perRace: "$8.51" },
  { tickets: 50, price: "$399.99", perRace: "$8.00" },
];

/**
 * Double-seater ticket bundles. Driver 53"+ / passenger 33"+.
 * Tiers above 6 tickets were not confirmed by the source — add rows here as needed.
 */
const DOUBLE_SEATER_TIERS = [
  { tickets: 1, price: "$19.99", perRace: "$19.99" },
  { tickets: 2, price: "$37.99", perRace: "$19.00" },
  { tickets: 4, price: "$67.99", perRace: "$17.00", isPopular: true },
  { tickets: 6, price: "$89.99", perRace: "$15.00" },
];

const buildKartTier = ({ tickets, price, perRace, isPopular }, slugPrefix) => {
  const ticketLabel = tickets === 1 ? "Ticket" : "Tickets";
  const slug = `${slugPrefix}_${tickets}`;
  return {
    id: `prod_${slug}`,
    priceId: `price_${slug}`,
    name: `${tickets} ${ticketLabel}`,
    description:
      tickets === 1
        ? "Single 5-min race"
        : `${tickets} races · 5 min each`,
    price,
    perRace,
    tickets,
    mode: "payment",
    isPopular: Boolean(isPopular),
  };
};

const SINGLE_KART_FEATURES = [
  "Adult or Kid karts",
  "Same-day use",
  "Full 5-min heats — timer pauses on cautions",
];

const DOUBLE_SEATER_FEATURES = [
  'Driver 53"+ / Passenger 33"+',
  "One driver, one passenger",
  "Same-day use",
];

const LIVE_PRODUCTS = SINGLE_KART_TIERS.map((tier) => ({
  ...buildKartTier(tier, "single_kart"),
  features: SINGLE_KART_FEATURES,
}));

const DOUBLE_SEATER_PRODUCTS = DOUBLE_SEATER_TIERS.map((tier) => ({
  ...buildKartTier(tier, "double_seater"),
  features: DOUBLE_SEATER_FEATURES,
  isDoubleSeater: true,
}));

const PARTY_PACKAGES = [
  {
    id: "prod_party_all_access",
    priceId: "price_party_all_access",
    name: "All-Access Family Race Party",
    description: "20 wristbands, 2hr racing, 3hr party room (fits 60)",
    price: "$699.00",
    mode: "payment",
    features: [
      "20 Racing Wristbands included",
      "Extra wristbands available day-of",
      "2 hours of organized racing",
      "3 hours in private party room",
      "Room fits up to 60 guests",
      "Tables & chairs set up",
      "Staff manages everything",
    ],
    isPartyPackage: true,
    isPopular: true,
  },
  {
    id: "prod_party_bounce_upgrade",
    priceId: "price_party_bounce_upgrade",
    name: "Bounce House + Game Tables",
    description: "Party upgrade add-on",
    price: "$150.00",
    mode: "payment",
    features: [
      "Bounce house for kids",
      "Game tables included",
      "Extra fun between races",
    ],
    isPartyPackage: true,
    isUpgrade: true,
  },
  {
    id: "prod_party_race_together",
    priceId: "price_party_race_together",
    name: "Race Together Upgrade",
    description: "Your group races together",
    price: "$150.00",
    mode: "payment",
    features: [
      "Group races at same time",
      "Not split with public",
      "More fun together",
    ],
    isPartyPackage: true,
    isUpgrade: true,
  },
  {
    id: "prod_party_private_track",
    priceId: "price_party_private_track",
    name: "Private Track (2 Hours)",
    description: "Exclusive track access",
    price: "$700.00",
    mode: "payment",
    features: [
      "2 hours private track",
      "No public riders",
      "Exclusive experience",
    ],
    isPartyPackage: true,
    isUpgrade: true,
  },
];

/** Party package products (base packages and upgrade add-ons). */
export const STRIPE_PARTY_PACKAGES = PARTY_PACKAGES;
/** Double-seater go-kart ticket tiers. */
export const STRIPE_DOUBLE_SEATER_PRODUCTS = DOUBLE_SEATER_PRODUCTS;
/** Single-kart ticket tiers; includes test products when ENABLE_TEST_PRODUCTS is true. */
export const STRIPE_PRODUCTS = ENABLE_TEST_PRODUCTS
  ? [...TEST_PRODUCTS, ...LIVE_PRODUCTS]
  : LIVE_PRODUCTS;
