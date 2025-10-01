export interface PricingItem {
  title: string;
  price: string;
  description?: string;
  items: string[];
  isPopular?: boolean;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Testimonial {
  id: number;
  name: string;
  content: string;
  rating: number;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}