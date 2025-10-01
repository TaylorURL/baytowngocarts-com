import { FAQ, NavItem, PricingItem, SocialLink, Testimonial } from "../types";

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
];

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
  address: "6750 N Tx-146 Baytown, TX 77523",
};

export const BOUNCE_PRICING: PricingItem[] = [
  {
    title: "Weekday Unlimited",
    price: "$10",
    description: "Thursday & Friday",
    items: ["Unlimited jumping all day", "Indoor climate-controlled", "Safe and supervised"],
  },
  {
    title: "Weekend 30-Min",
    price: "$5",
    description: "Saturday & Sunday",
    items: ["30 minutes of jumping", "Perfect for quick fun", "No reservation needed"],
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

export const FAQS: FAQ[] = [
  {
    question: "What are the age and height requirements for go-karts?",
    answer: "For adult go-karts, drivers must be at least 14 years old and 58 inches tall. For kid go-karts, drivers must be 8-13 years old and at least 48 inches tall. Safety is our top priority!"
  },
  {
    question: "Can I bring my own food to Speedway 146?",
    answer: "Outside food and drinks are not permitted, but we offer a variety of delicious options at our snack bar, including Mexican cultural favorites and classic American snacks."
  },
  {
    question: "Do I need a reservation for go-kart racing?",
    answer: "No reservation is needed for go-kart racing or bounce house use during regular business hours. Just come in and purchase your tickets at the counter."
  },
  {
    question: "How does the Race Swap Option work?",
    answer: "If your group has no kids, you can swap 3 kid races for 2 adult races at no extra charge in any of our Family Deals."
  },
  {
    question: "What food combo options are available with Family Deals?",
    answer: "You can choose from Classic Nachos, Chili Cheese Nachos, Ham BLT Sandwich, or Turkey BLT Sandwich. Each combo includes a 12 fl oz drink."
  },
  {
    question: "Do you offer party room rentals?",
    answer: "Yes! Our private party room is available by phone reservation only. Please call (346) 932-1266 to inquire about availability and pricing."
  },
  {
    question: "What is your refund policy?",
    answer: "All unused races must be used the same day. No refunds, credits, or redemptions after leaving the premises."
  },
  {
    question: "Can I rent a bounce house for my home event?",
    answer: "Yes! We offer bounce house rentals for off-site events. Please use our online booking form on the Contact page to request information."
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Ashley Thompson",
    content: "My kids had a blast at Speedway 146! The go-karts were well-maintained and the staff was super attentive. We'll definitely be back for more family fun!",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Davis",
    content: "Great place for family outings! The Family Deal B was perfect for us - great value and the kids loved the bounce house. Clean facilities and friendly staff.",
    rating: 5
  },
  {
    id: 3,
    name: "Tuco Salamanca",
    content: "Celebrated my son's 10th birthday here and it was amazing! The party room was perfect and all the kids had a blast racing and jumping. Highly recommend!",
    rating: 5
  },
  {
    id: 4,
    name: "Mike Johnson",
    content: "Speedway 146 is our go-to weekend spot. The nachos are delicious and my daughter loves the go-karts. It's become our family tradition!",
    rating: 5
  },
  {
    id: 5,
    name: "Lauren Garcia",
    content: "Such a fun place for both kids and adults! The race track is well designed and the bounce house is always clean. Love the variety of food options too!",
    rating: 5
  },
  {
    id: 6,
    name: "Brandon Lee",
    content: "Best go-kart track in Baytown! The staff is incredibly friendly and professional. The family deals are a great value. Can't wait to come back!",
    rating: 5
  }
];

export const SOCIAL_LINKS: SocialLink[] = [
  { 
    platform: "Instagram", 
    url: "https://instagram.com/speedway146", 
    icon: "Instagram" 
  },
  { 
    platform: "Facebook", 
    url: "https://m.facebook.com/61575710985956/", 
    icon: "Facebook" 
  },
  { 
    platform: "TikTok", 
    url: "https://tiktok.com/@speedway146", 
    icon: "Video" 
  }
];