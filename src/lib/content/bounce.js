/*
 * Bounce house rates, priced by the kind of day rather than by the weekday.
 *
 * `novemberDescription` is the extra night `november.js` opens: the weekday
 * rate runs on the weekday evenings the gate is open, which is Friday alone
 * for most of the year and Thursday as well for that month.
 */
export const BOUNCE_PRICING = [
  {
    title: "Weekday Unlimited",
    price: "$10",
    description: "Friday",
    novemberDescription: "Thursday & Friday",
    items: [
      "Unlimited jumping all day",
      "Indoor climate-controlled",
      "Safe and supervised",
    ],
  },
  {
    title: "Weekend 30-Min",
    price: "$5",
    description: "Saturday & Sunday",
    items: [
      "30 minutes of jumping",
      "Perfect for quick fun",
      "No reservation needed",
    ],
  },
  {
    title: "Weekend All-Day",
    price: "$15",
    description: "Saturday & Sunday",
    items: [
      "Unlimited jumping all day",
      "Must exit every 15 minutes",
      "Re-enter by lining up again",
    ],
    isPopular: true,
  },
];
