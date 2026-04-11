/** Background images for the home page hero slideshow. */
export const HERO_BACKGROUND_IMAGES = [
  "/images/14.JPEG",
  "/images/15.JPEG",
  "/images/16.JPEG",
  "/images/17.JPEG",
  "/images/18.JPEG",
];
export const HERO_STATS = [
  { value: "12+", label: "MPH Top Speed" },
  { value: "1200+", label: "Race Hours" },
  {
    value: "5000+",
    label: "Happy Racers",
    className: "md:col-span-1 col-span-2",
  },
];
export const GALLERY_IMAGES = [
  {
    src: "/images/14.JPEG",
    alt: "Go-kart racing action",
    title: "High-Speed Racing",
  },
  {
    src: "/images/15.JPEG",
    alt: "Kids enjoying the track",
    title: "Kids Racing",
  },
  {
    src: "/images/16.JPEG",
    alt: "Birthday party celebration",
    title: "Birthday Parties",
  },
  {
    src: "/images/18.JPEG",
    alt: "Family fun at Speedway 146",
    title: "Family Fun",
  },
  { src: "/images/19.JPEG", alt: "Racing excitement", title: "Racing Thrills" },
  { src: "/images/20.JPEG", alt: "Party celebrations", title: "Party Time" },
  {
    src: "/images/21.JPEG",
    alt: "Speedway 146 facilities",
    title: "Our Facilities",
  },
  { src: "/images/22.JPEG", alt: "Racing action", title: "Racing Action" },
];
export const SLIDESHOW_INTERVAL_MS = 2000;
export const GALLERY_IMAGES_PER_SLIDE = 4;
/** Primary navigation links used in the header/footer. */
export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
];
/** Weekly business hours displayed on the Contact and other pages. */
export const BUSINESS_HOURS = [
  { day: "Thursday", hours: "5:00 PM – 10:30 PM" },
  { day: "Friday", hours: "5:00 PM – 10:30 PM" },
  { day: "Saturday", hours: "10:30 AM – 10:30 PM" },
  { day: "Sunday", hours: "10:30 AM – 10:30 PM" },
  { day: "Monday", hours: "Closed" },
  { day: "Tuesday", hours: "Closed" },
  { day: "Wednesday", hours: "Closed" },
];
export const CONTACT_INFO = {
  phone: "(346) 932-1266",
  email: "speedsway146@gmail.com",
  address: "6750 N TX-146, Baytown, TX 77523",
};
export const BOUNCE_PRICING = [
  {
    title: "Weekday Unlimited",
    price: "$10",
    description: "Thursday & Friday",
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
/** Frequently asked questions displayed on the FAQ page, each tagged with a category. */
export const FAQS = [
  {
    question: "What are your hours of operation?",
    answer:
      "We are open Thursday 5:00 PM – 10:30 PM (Leagues begin at 7:30 PM — launching Q1 2026), Friday 5:00 PM – 10:30 PM, and Saturday & Sunday 10:30 AM – 10:30 PM.",
    category: "Racing",
  },
  {
    question: "Where are you located?",
    answer: "Speedway 146 is located at 6750 N TX-146, Baytown, TX 77523.",
    category: "Racing",
  },
  {
    question: "Do I need to make a reservation?",
    answer:
      "No reservation is needed. Walk-ins are welcome—you may purchase race tickets and wristbands at our Ticket House. However, we strongly recommend checking our social media or Google listing before visiting in case a private party or event is in progress.",
    category: "Racing",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept cash, all major credit cards, and digital payments (depending on availability). A 4% service fee applies to card transactions. Paying with cash saves you 4%. All transactions are plus tax.",
    category: "Pricing",
  },
  {
    question: "Is there a minimum age to drive a kart?",
    answer:
      "There is no age requirement, but we suggest a minimum age of 5 if riding alone. There are height requirements: Adult Karts require 53 inches or taller, Kiddie Karts require 40 inches or taller. For Double-Seater Karts, the driver must be 53 inches or taller and the passenger must be 33 inches or taller.",
    category: "Racing",
  },
  {
    question: "Do you have double-seater karts?",
    answer:
      'Yes. We currently have one double-seater kart available. Driver must be 53"+ and passenger must be 33"+.',
    category: "Racing",
  },
  {
    question: "Do kids and adults race together?",
    answer:
      "No. For safety reasons, kids race with kids and adults race with adults.",
    category: "Racing",
  },
  {
    question: "Are helmets required?",
    answer:
      "Helmets are optional, but available for use. You are welcome to bring your own helmet.",
    category: "Racing",
  },
  {
    question: "What should I wear to race?",
    answer:
      "Closed-toe shoes are highly recommended. Avoid loose clothing. Long hair must be tied back (hair ties available upon request). This is an outdoor track — expect dust and dirt; please dress accordingly.",
    category: "Racing",
  },
  {
    question: "Is racing safe for beginners?",
    answer:
      "Yes. Our trained team provides a full safety briefing before every ride. We also have karts geared at different speeds to accommodate all experience levels.",
    category: "Racing",
  },
  {
    question: "Can pregnant women or people with medical conditions race?",
    answer:
      "No. Pregnant women and anyone with a medical condition cannot participate. It is your responsibility to inform our staff of any restrictions or concerns.",
    category: "Policies",
  },
  {
    question: "Do you offer family deals or bundle packages?",
    answer:
      "Yes! We offer a variety of packages designed for families and groups. Visit our pricing tab for full details.",
    category: "Pricing",
  },
  {
    question: "Do you offer discounts for large groups?",
    answer: "Yes. Groups of 15 or more receive 10% savings on race sales only.",
    category: "Pricing",
  },
  {
    question: "Is tax included in your prices?",
    answer: "No, all prices are before tax. Tax will be added at checkout.",
    category: "Pricing",
  },
  {
    question: "Do you offer unlimited riding passes?",
    answer:
      "Yes. We offer 2.5 hours of unlimited riding. Time begins once the wristband is issued.",
    category: "Pricing",
  },
  {
    question: "Do you offer gift vouchers?",
    answer:
      "Yes! You can purchase gift vouchers at the track for an unforgettable experience.",
    category: "Pricing",
  },
  {
    question: "How do I book a private event or party?",
    answer:
      "To book any private event—including birthdays, family outings, corporate events, or team-building—please call (346) 932-1266.",
    category: "Events",
  },
  {
    question: "Is a deposit required for events?",
    answer:
      "Yes. A 20% deposit of the total balance is required to reserve your date and time.",
    category: "Events",
  },
  {
    question: "Can we bring outside food or drinks?",
    answer:
      "For public events, no outside food or drinks are permitted. For private events, policies vary — please call to inquire.",
    category: "Policies",
  },
  {
    question: "Do you offer catering?",
    answer:
      "Yes! We offer onsite catering packages for a convenient, fully handled experience. Call us for menu options and pricing.",
    category: "Events",
  },
  {
    question: "How early can we arrive to decorate?",
    answer: "You may arrive 30 minutes early to decorate the party room.",
    category: "Events",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "A 7-business-day notice is required to receive a deposit refund. All events must also be reconfirmed 24 hours prior.",
    category: "Events",
  },
  {
    question: "Do you offer off-site bounce house rentals?",
    answer:
      "Yes. We offer off-site bounce house rentals and setup. Please see our Bounce House page for available units and pricing.",
    category: "Events",
  },
  {
    question: "What safety rules do riders need to follow?",
    answer:
      "All safety rules are clearly posted before entering the track. Failure to follow the rules may result in temporary removal, suspension, or permanent ban (if endangering others). Our professional team ensures every rider is briefed before participating.",
    category: "Policies",
  },
  {
    question: "Do you run karts in the rain?",
    answer:
      "In light rain, we continue operations. In heavy rain, karting is temporarily paused for safety.",
    category: "Policies",
  },
  {
    question: "Do you offer refunds for weather interruptions?",
    answer:
      "No refunds are issued for weather-related interruptions. Unlimited passes cannot be used on a different day.",
    category: "Policies",
  },
  {
    question: "Can race tickets be used on another day?",
    answer:
      "Yes — regular race tickets can be rolled over into another day if they are used within 7 days and you speak with our front desk before leaving.",
    category: "Policies",
  },
  {
    question: "Can unlimited wristbands be used another day?",
    answer:
      "No. Unlimited riding passes cannot roll over. If you leave the premises, your time continues running.",
    category: "Policies",
  },
  {
    question: "Do riders need to sign a waiver?",
    answer:
      "Yes. All riders must sign a waiver before entering the premises. Anyone under 18 must have a parent or legal guardian sign for them.",
    category: "Policies",
  },
  {
    question: "Are pets allowed?",
    answer:
      "Yes — as long as your pet remains leashed and you clean up after them.",
    category: "Policies",
  },
  {
    question: "What happens if a kart breaks down during a race?",
    answer:
      "We will safely bring you into the pit, assign you a new kart immediately (if available), and guarantee you receive your full 5 minutes of track time. If no replacement kart is available, you will be placed into the next race to complete your time.",
    category: "Racing",
  },
  {
    question: "How do I know if the track is closed for a private event?",
    answer:
      "Always check our social media, Google listing, or call ahead before driving down to ensure no private event is blocking public hours.",
    category: "Policies",
  },
];
export const TESTIMONIALS = [
  {
    name: "Jessica M.",
    rating: 5,
    text: "We brought our 8 year old here for the first time last weekend and he hasn't stopped talking about it! The staff helped him feel comfortable on the track and the bounce houses kept his little sister entertained. Will definitely be back.",
    location: "Baytown, TX",
  },
  {
    name: "Carlos R.",
    rating: 5,
    text: "Been coming here with my buddies for years now. The karts are fast and well-maintained. Gets pretty competitive out there lol. Great way to blow off steam after work on Fridays.",
    location: "Houston, TX",
  },
  {
    name: "Amanda K.",
    rating: 4,
    text: "My daughter had her 10th birthday party here and it was honestly so much easier than I expected. They handled everything and the kids had an absolute blast. Only wish the party room was a bit bigger but we made it work!",
    location: "La Porte, TX",
  },
  {
    name: "David L.",
    rating: 5,
    text: "Took my wife here for date night since we both love racing. She beat me twice and won't let me forget it haha. Track is fun with good variety, staff is cool, and the atmosphere is awesome. Highly recommend!",
    location: "Pasadena, TX",
  },
  {
    name: "Michelle T.",
    rating: 5,
    text: "Clean facility, friendly staff, and my kids are obsessed with the bounce houses. We come almost every other weekend now. It's become our go-to spot when the kids need to burn off energy. Great prices too.",
    location: "Deer Park, TX",
  },
  {
    name: "Brandon S.",
    rating: 4,
    text: "Pretty solid place for go-karts. Been to a few different tracks around Houston and this one's up there. Track layout is nice and the karts have decent speed. Can get crowded on weekends but that's expected.",
    location: "Webster, TX",
  },
];
