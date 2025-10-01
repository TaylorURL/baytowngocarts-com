# Project Transfer Notes

## Overview
This is the complete Speedway 146 website project, ready for transfer and independent deployment.

## What's Included

### Core Application
- Complete React + TypeScript application
- All source code in `src/` directory
- Public assets and images in `public/` directory
- Database migrations in `supabase/migrations/`

### Configuration Files
- `package.json` - Dependencies and scripts
- `vite.config.ts` - Build configuration
- `tailwind.config.js` - Styling configuration
- `tsconfig.json` - TypeScript configuration
- `.gitignore` - Git ignore rules

### Documentation
- `README.md` - Complete project documentation
- `DEPLOYMENT.md` - Deployment instructions
- This transfer notes file

## Required Setup

### 1. Environment Variables
Create a `.env` file with:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

### 2. Supabase Database
- Create a Supabase project
- Run the migration file: `supabase/migrations/20250821050354_withered_temple.sql`
- Configure authentication settings
- Set up Row Level Security policies

### 3. Dependencies Installation
```bash
npm install
```

### 4. Development Server
```bash
npm run dev
```

## Key Features

### Business Features
- Go-kart racing information and pricing
- Bounce house rentals
- Event and party booking
- Contact forms
- FAQ section
- Business hours and location info

### Technical Features
- Responsive design (mobile-first)
- User authentication via Supabase
- Database integration
- Payment system ready (Stripe configured)
- SEO optimized
- Performance optimized
- Accessibility compliant

## Current Deployment
- Live at: https://speedway146.com
- Hosted on Netlify (custom domain configured)

## Business Information
- **Business**: Speedway 146
- **Location**: 6750 N Highway 146, Baytown, TX 77523
- **Phone**: (346) 932-1266
- **Email**: speedsway146@gmail.com

## Important Files

### Core Components
- `src/App.tsx` - Main application component
- `src/pages/` - All page components
- `src/components/` - Reusable UI components
- `src/utils/constants.ts` - Business data and configuration

### Configuration
- `src/stripe-config.ts` - Payment product configuration
- `src/lib/supabase.ts` - Database client setup
- `src/hooks/useAuth.ts` - Authentication logic

### Assets
- `public/images/` - All website images
- `public/images/*.pdf` - Waiver forms for download

## Next Steps for New Owner

1. **Set up development environment**
   - Install Node.js 18+
   - Clone/copy project files
   - Install dependencies
   - Configure environment variables

2. **Set up Supabase**
   - Create new Supabase project
   - Run database migrations
   - Configure authentication
   - Update environment variables

3. **Test locally**
   - Run development server
   - Test all functionality
   - Verify database connections

4. **Deploy to production**
   - Choose hosting platform (Netlify, Vercel, etc.)
   - Configure build settings
   - Set up custom domain if needed
   - Configure environment variables

5. **Optional enhancements**
   - Set up analytics
   - Configure error monitoring
   - Set up automated backups
   - Implement full Stripe checkout (currently phone-based)

## Support
The codebase is well-documented and follows React best practices. All components are modular and easy to modify. The project structure is standard and should be familiar to any React developer.

## License
This is proprietary software for Speedway 146. Transfer includes all rights to use and modify the codebase.