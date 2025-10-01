# Speedway 146 Website

A modern React website for Speedway 146 - Baytown's premier go-kart racing and family entertainment destination.

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Authentication**: Supabase
- **Database**: Supabase (PostgreSQL)
- **Animations**: AOS (Animate On Scroll) + Framer Motion
- **Icons**: Lucide React
- **Deployment**: Static hosting compatible

## Features

- Responsive design optimized for all devices
- Go-kart racing booking system
- Bounce house rentals
- Event and party planning
- Contact forms and inquiries
- User authentication
- Payment integration ready (Stripe)
- SEO optimized

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd speedway146-website
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

4. Start the development server
```bash
npm run dev
```

5. Build for production
```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Generic components (Button, etc.)
│   ├── home/           # Homepage specific components
│   ├── contact/        # Contact page components
│   ├── pricing/        # Pricing page components
│   ├── auth/           # Authentication components
│   └── chat/           # Chat widget
├── pages/              # Page components
├── layouts/            # Layout components
├── hooks/              # Custom React hooks
├── lib/                # External service configurations
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and constants
└── stripe-config.ts    # Stripe product configuration

public/
├── images/             # Static images and assets
└── index.html          # HTML template

supabase/
└── migrations/         # Database migration files
```

## Key Components

### Pages
- **HomePage**: Hero section, features, testimonials
- **AboutPage**: Company information and values
- **PricingPage**: Go-kart and bounce house pricing
- **EventsPage**: Party and event information
- **ContactPage**: Contact form and location details
- **FAQPage**: Frequently asked questions

### Features
- **Authentication**: User signup/login with Supabase
- **Responsive Design**: Mobile-first approach
- **SEO Optimized**: Meta tags and structured data
- **Performance**: Optimized images and lazy loading
- **Accessibility**: WCAG compliant components

## Configuration

### Supabase Setup
1. Create a Supabase project
2. Run the migration files in `supabase/migrations/`
3. Configure Row Level Security policies
4. Update environment variables

### Stripe Integration
- Products are configured in `src/stripe-config.ts`
- Payment processing handled via phone booking system
- Ready for full Stripe Checkout integration

## Deployment

The project is configured for static hosting and can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- Any static hosting provider

Build command: `npm run build`
Output directory: `dist`

## Environment Variables

Required environment variables:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_OPENAI_API_KEY`: OpenAI API key for chat functionality

## Business Information

**Speedway 146**
- Address: 6750 N Highway 146, Baytown, TX 77523
- Phone: (346) 932-1266
- Email: speedsway146@gmail.com

**Hours:**
- Thursday-Friday: 5:00 PM – 10:30 PM
- Saturday-Sunday: 10:30 AM – 10:30 PM
- Monday-Wednesday: Closed

## License

This project is proprietary software for Speedway 146.

## Support

For technical support or questions about the codebase, please contact the development team.