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

const LIVE_PRODUCTS = [
  {
    id: "prod_SuF7rI45RLsQlo",
    priceId: "price_1RyQdACMNAD5XWq4mCpKzdh1",
    name: "Adult Race",
    description: "5 minutes of racing",
    price: "$13.99",
    mode: "payment",
    features: [
      'For taller racers (53"+)',
      "High-performance go-karts",
      "Safety equipment included",
    ],
  },
  {
    id: "prod_SuF7XrzxLfJWw6",
    priceId: "price_1RyQddCMNAD5XWq4kJANI6Ix",
    name: "Kid Race",
    description: "5 minutes of racing",
    price: "$13.99",
    mode: "payment",
    features: [
      'For younger racers (40"+)',
      "Safe and fun for kids",
      "Same great experience",
    ],
  },
  {
    id: "prod_SuF8q9mSRcmCcU",
    priceId: "price_1RyQeHCMNAD5XWq4kSQyNRBm",
    name: "3-Race Combo",
    description: "Save $6.98",
    price: "$34.99",
    mode: "payment",
    features: [
      "3 Races (Adult or Kid)",
      "Same-day use only",
      "No refunds or credits",
    ],
    isPopular: false,
  },
  {
    id: "prod_family_deal",
    priceId: "price_family_deal",
    name: "Family Deal",
    description: "5 races - mix & match",
    price: "$59.99",
    mode: "payment",
    features: [
      "5 Total Races",
      "Mix Adult & Kid Races",
      "Perfect for families",
      "Great value savings",
    ],
    isPopular: true,
  },
  {
    id: "prod_SuF9rhy87orqYS",
    priceId: "price_1RyQemCMNAD5XWq4A8DpcSm9",
    name: "2.5 Hour Racing",
    description: "Unlimited races for 2.5 hours",
    price: "$44.99",
    mode: "payment",
    features: [
      "Unlimited races for 2.5 hours",
      "Adult or Kid karts",
      "Best value for racing enthusiasts",
    ],
  },
];

const DOUBLE_SEATER_PRODUCTS = [
  {
    id: "prod_double_ride_along",
    priceId: "price_double_ride_along",
    name: "Ride Along Rush",
    description: "1 Race - Double Seater",
    price: "$19.99",
    mode: "payment",
    features: [
      "1 Double Seater Race",
      'Driver 53"+ / Passenger 33"+',
      "Perfect for parent & child",
    ],
    isDoubleSeater: true,
  },
  {
    id: "prod_double_drift",
    priceId: "price_double_drift",
    name: "Double Drift",
    description: "2 Races - Double Seater",
    price: "$37.99",
    mode: "payment",
    features: [
      "2 Double Seater Races",
      'Driver 53"+ / Passenger 33"+',
      "Great for multiple laps",
    ],
    isDoubleSeater: true,
  },
  {
    id: "prod_track_titan",
    priceId: "price_track_titan",
    name: "Track Titan",
    description: "3 Races - Double Seater",
    price: "$39.99",
    mode: "payment",
    features: [
      "3 Double Seater Races",
      'Driver 53"+ / Passenger 33"+',
      "Best double seater value",
    ],
    isDoubleSeater: true,
    isPopular: true,
  },
];

const PARTY_PACKAGES = [
  {
    id: "prod_party_all_access",
    priceId: "price_party_all_access",
    name: "All-Access Family Race Party",
    description: "20 bracelets, 2hr racing, 3hr party room",
    price: "$699.00",
    mode: "payment",
    features: [
      "20 Racing Bracelets included",
      "2 hours of organized racing",
      "3 hours in private party room",
      "Room fits up to 45 guests",
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

export const STRIPE_PARTY_PACKAGES = PARTY_PACKAGES;

export const STRIPE_DOUBLE_SEATER_PRODUCTS = DOUBLE_SEATER_PRODUCTS;

export const STRIPE_PRODUCTS = ENABLE_TEST_PRODUCTS
  ? [...TEST_PRODUCTS, ...LIVE_PRODUCTS]
  : LIVE_PRODUCTS;
