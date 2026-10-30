/*
 * The questions the track gets asked, as a document rather than a list.
 *
 * Order is the order they are read in, so a section runs from the thing every
 * visitor needs to the thing one visitor in fifty needs. FAQ_SECTIONS is the
 * whole of the page's structure: the topic rail, the headings and the anchors
 * are all derived from it, so a section added here reaches all three.
 *
 * A question is grouped by what the reader is doing when they ask it, not by
 * which department owns the answer. Hours and directions are a trip being
 * planned; a waiver and a rollover are a rule being checked. That is why
 * "Can we bring outside food?" sits under Visiting and "Can tickets be used
 * another day?" does not.
 */

export const FAQ_SECTIONS = [
  {
    id: "visiting",
    label: "Visiting",
    heading: "Visiting",
    blurb: "Hours, directions, and what to bring.",
  },
  {
    id: "racing",
    label: "Racing",
    heading: "Racing",
    blurb: "How a heat runs, who can drive, and the safety briefing.",
  },
  {
    id: "pricing",
    label: "Pricing",
    heading: "Pricing",
    blurb: "Tickets, wristbands, discounts and tax.",
  },
  {
    id: "events",
    label: "Events",
    heading: "Parties and events",
    blurb: "Booking the party room, deposits, catering and cancellations.",
  },
  {
    id: "rules",
    label: "Rules",
    heading: "Rules and policies",
    blurb: "Waivers, restrictions, rollovers and refunds.",
  },
];

export const FAQS = [
  {
    section: "visiting",
    question: "What are your hours?",
    answer:
      "Friday through Sunday. Friday, 5:00 PM to 10:30 PM. Saturday and Sunday, 10:30 AM to 10:30 PM. Closed Monday through Thursday. For November only we also open Thursday, 5:00 PM to 10:30 PM. Holiday hours vary, so check our Google page for the current schedule.",
  },
  {
    section: "visiting",
    question: "Are you open on Thursdays?",
    answer:
      "In November only. For that month the gate opens Thursday through Sunday, and Thursday nights run 5:00 PM to 10:30 PM. The rest of the year we are open Friday through Sunday.",
  },
  {
    section: "visiting",
    question: "Where are you located?",
    answer: "6750 TX-146, Baytown, TX 77523.",
  },
  {
    section: "visiting",
    question: "Do I need a reservation?",
    answer:
      "No. Walk-ins are welcome, and you can buy race tickets and wristbands at the Ticket House.",
  },
  {
    section: "visiting",
    question: "How do I know the track is open to the public?",
    answer:
      "Check our social media or our Google listing before you drive out, or call ahead on (281) 722-4468. A private event can take the track out of public hours.",
  },
  {
    section: "visiting",
    question: "What payment methods do you take?",
    answer:
      "Cash, all major credit cards, and digital payments depending on availability. Card transactions carry a 4% service fee, so cash saves you 4%. Every price is before tax.",
  },
  {
    section: "visiting",
    question: "What should I wear?",
    answer:
      "We highly recommend closed-toe shoes. Avoid loose clothing. Long hair must be tied back, and we have hair ties if you need one. The track is outdoors, so expect dust and dirt.",
  },
  {
    section: "visiting",
    question: "Can we bring outside food or drinks?",
    answer:
      "Not during public hours. Policies vary for private events, so call (281) 722-4468 to ask about yours.",
  },
  {
    section: "visiting",
    question: "Do you run karts in the rain?",
    answer:
      "In light rain we keep running. In heavy rain we pause karting for safety.",
  },
  {
    section: "visiting",
    question: "Are pets allowed?",
    answer: "Yes, as long as your pet stays leashed and you clean up after it.",
  },

  {
    section: "racing",
    question: "How long is each race?",
    answer:
      "Five minutes, and one race ticket gets you one race. If a kart breaks down or there is a caution, the timer stops, so every racer gets the full five minutes of track time. A wristband is unlimited racing for 2.5 hours from the moment it is issued.",
  },
  {
    section: "racing",
    question: "Is there a minimum age to drive a kart?",
    answer:
      "There is no age requirement, but we suggest a minimum of five for anyone riding alone. The limit is height: 53 inches or taller for Adult Karts, 40 inches or taller for Kiddie Karts. On a Double-Seater the driver must be 53 inches or taller and the passenger 33 inches or taller.",
  },
  {
    section: "racing",
    question: "Do you have double-seater karts?",
    answer:
      'We have one double-seater kart. The driver must be 53" or taller and the passenger 33" or taller. There is no separate double-seater ticket: exchange two race tickets at the front desk for one double-seater heat.',
  },
  {
    section: "racing",
    question: "Do kids and adults race together?",
    answer: "No. Kids race with kids and adults race with adults.",
  },
  {
    section: "racing",
    question: "Are helmets required?",
    answer:
      "No, but we always recommend one. We do not provide helmets, so bring your own if you want to wear one. We provide safety glasses for every rider.",
  },
  {
    section: "racing",
    question: "What safety gear do you provide?",
    answer:
      "Safety glasses, for every rider. We do not provide helmets, so bring your own if you want one. We highly recommend closed-toe shoes, and long hair must be tied back.",
  },
  {
    section: "racing",
    question: "Is racing safe for beginners?",
    answer:
      "Yes. Our team gives a full safety briefing before every ride, and the karts are geared at different speeds for different experience levels.",
  },
  {
    section: "racing",
    question: "What happens if a kart breaks down mid-race?",
    answer:
      "The timer stops, so you keep your full five minutes. We bring you safely into the pit and either put you in another kart straight away, if one is free, or into the next race to finish your time.",
  },

  {
    section: "pricing",
    question: "Is tax included in your prices?",
    answer: "No. Every price is before tax, which is added at checkout.",
  },
  {
    section: "pricing",
    question: "Do you offer unlimited riding passes?",
    answer:
      "Yes, 2.5 hours of unlimited riding. The clock starts when the wristband is issued.",
  },
  {
    section: "pricing",
    question: "What is the Thursday Unlimited Racing Special?",
    answer:
      "Every Thursday, 2.5 hours of unlimited racing for $49.99 plus tax per person, from the moment your wristband is issued. Thursdays only.",
  },
  {
    section: "pricing",
    question: "What is the November $5 ride special?",
    answer:
      "Every Thursday and Friday in November, a go-kart ride is $5 plus tax, from 5:00 PM to 10:30 PM. November only, walk up and pay at the gate.",
  },
  {
    section: "pricing",
    question: "Do you offer family deals or bundle packages?",
    answer:
      "Yes. We run packages built for families and groups. The pricing page has the full list.",
  },
  {
    section: "pricing",
    question: "Do you offer discounts for large groups?",
    answer: "Yes. Groups of 15 or more save 10% on race sales.",
  },
  {
    section: "pricing",
    question: "Do you offer gift vouchers?",
    answer: "Yes. You can buy gift vouchers at the track.",
  },

  {
    section: "events",
    question: "How do I book a private event or party?",
    answer:
      "Call (281) 722-4468. That covers birthdays, family outings, corporate events and team-building.",
  },
  {
    section: "events",
    question: "How big is the party room, and what is included?",
    answer:
      "The private party room fits up to 60 people and includes 20 wristbands for racing. You can buy extra wristbands on the day.",
  },
  {
    section: "events",
    question: "Is a deposit required?",
    answer: "Yes. A 20% deposit of the total balance holds your date and time.",
  },
  {
    section: "events",
    question: "How early can we arrive to decorate?",
    answer: "Thirty minutes before your booking.",
  },
  {
    section: "events",
    question: "Do you offer catering?",
    answer:
      "Yes, onsite catering packages. Call (281) 722-4468 for menu options and pricing.",
  },
  {
    section: "events",
    question: "What is your cancellation policy?",
    answer:
      "To get a deposit refund, give us seven business days' notice. You also need to reconfirm your event 24 hours ahead.",
  },
  {
    section: "events",
    question: "Do you offer off-site bounce house rentals?",
    answer:
      "Yes, including setup. The Bounce House page has the available units and pricing.",
  },

  {
    section: "rules",
    question: "Do riders need to sign a waiver?",
    answer:
      "Yes, in person at the front desk before entering the track, so there is nothing to print or bring. Anyone under 18 needs a parent or legal guardian to sign for them.",
  },
  {
    section: "rules",
    question: "What safety rules do riders need to follow?",
    answer:
      "The rules are posted before the track entrance, and our team briefs every rider before they ride. Breaking them can mean temporary removal, suspension, or a permanent ban where other people are put at risk.",
  },
  {
    section: "rules",
    question: "Can pregnant women or people with medical conditions race?",
    answer:
      "No. It is your responsibility to tell our staff about any restriction or concern.",
  },
  {
    section: "rules",
    question: "Can race tickets be used on another day?",
    answer:
      "Yes, within seven days, as long as you speak to the front desk before you leave.",
  },
  {
    section: "rules",
    question: "Can unlimited wristbands be used another day?",
    answer:
      "No. Unlimited passes do not roll over, and the time keeps running if you leave the premises.",
  },
  {
    section: "rules",
    question: "Do you refund weather interruptions?",
    answer: "No. Unlimited passes also cannot be moved to a different day.",
  },
];
