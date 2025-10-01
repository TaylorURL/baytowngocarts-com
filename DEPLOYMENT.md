# Deployment Guide

This document provides instructions for deploying the Speedway 146 website to various hosting platforms.

## Prerequisites

- Node.js 18+
- Project built successfully (`npm run build`)
- Environment variables configured

## Deployment Options

### 1. Netlify

#### Option A: Drag and Drop
1. Run `npm run build`
2. Go to [Netlify](https://netlify.com)
3. Drag the `dist` folder to the deploy area

#### Option B: Git Integration
1. Connect your Git repository to Netlify
2. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Add environment variables in Netlify dashboard

### 2. Vercel

#### Option A: Vercel CLI
```bash
npm install -g vercel
vercel --prod
```

#### Option B: Git Integration
1. Connect repository to Vercel
2. Configure build settings:
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`

### 3. GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to package.json scripts:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Deploy:
```bash
npm run deploy
```

### 4. Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Initialize Firebase:
```bash
firebase init hosting
```

3. Configure `firebase.json`:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

4. Deploy:
```bash
npm run build
firebase deploy
```

## Environment Variables

Make sure to set these environment variables in your hosting platform:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

## Build Configuration

The project uses Vite for building. Key configuration:

- **Entry point**: `index.html`
- **Output directory**: `dist`
- **Build command**: `npm run build`
- **Dev server**: `npm run dev`

## Custom Domain Setup

### Netlify
1. Go to Site settings > Domain management
2. Add custom domain
3. Configure DNS records as instructed

### Vercel
1. Go to Project settings > Domains
2. Add domain and configure DNS

## SSL/HTTPS

Most modern hosting platforms provide automatic SSL certificates. Ensure HTTPS is enabled for:
- Security
- SEO benefits
- Modern web standards compliance

## Performance Optimization

The build includes:
- Code splitting
- Asset optimization
- Minification
- Tree shaking

## Monitoring

Consider setting up:
- Google Analytics
- Error tracking (Sentry)
- Performance monitoring
- Uptime monitoring

## Troubleshooting

### Common Issues

1. **404 on page refresh**: Configure server to serve `index.html` for all routes
2. **Environment variables not working**: Ensure they're prefixed with `VITE_`
3. **Build fails**: Check Node.js version compatibility
4. **Images not loading**: Verify image paths are correct in production

### Support

For deployment issues, check:
1. Build logs
2. Console errors
3. Network tab in browser dev tools
4. Hosting platform documentation