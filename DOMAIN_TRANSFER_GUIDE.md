# Domain Transfer Guide: speedway146.com to GoDaddy

## Current Transfer Status
You're seeing: **Transfer Domain speedway146.com +$21.99/yr $11.99**

## Step-by-Step Transfer Process

### 1. At Your Current Registrar (Before GoDaddy Transfer)

#### A. Unlock the Domain
- Log into your current domain registrar (likely Netlify or whoever registered it)
- Find domain settings/management
- Look for "Domain Lock", "Registrar Lock", "Transfer Lock", or "Lock Status"
- **DISABLE/UNLOCK** the domain

#### B. Get Authorization Code (EPP Code)
- In the same domain management area
- Look for "Authorization Code", "EPP Code", "Transfer Code", or "Auth Code"
- **Copy this code** - you'll need it for GoDaddy

#### C. Verify Contact Information
- Ensure the domain owner email is accessible
- Update if necessary (some registrars require 60-day wait after contact changes)

### 2. At GoDaddy (Complete the Transfer)

#### A. Initiate Transfer
- Continue with the GoDaddy transfer process
- Enter the **Authorization Code** when prompted
- Pay the transfer fee ($11.99 as shown)

#### B. Confirm Transfer Email
- Check the domain owner email for transfer confirmation
- **Approve the transfer** (usually within 5 days)

### 3. DNS Configuration After Transfer

⚠️ **CRITICAL**: After domain transfer, you need to configure DNS to point to your website.

#### Option A: Keep Current Hosting (Recommended)
If keeping the site on Netlify/current host:

**DNS Records to Set at GoDaddy:**
```
Type: CNAME
Name: www
Value: capable-sfogliatella-97e394.netlify.app

Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: @
Value: capable-sfogliatella-97e394.netlify.app
```

#### Option B: Move to GoDaddy Hosting
If moving hosting to GoDaddy:
1. Set up hosting account at GoDaddy
2. Upload your built website files (`dist` folder contents)
3. Configure DNS to point to GoDaddy servers

### 4. Website Deployment Options

#### Current Setup
- Repository: https://github.com/reverseflash3029/speedway-146
- Built with: React + Vite
- Current hosting: Netlify

#### Deployment Options After Transfer

**Option 1: Keep Netlify Hosting (Easiest)**
- Domain transfers to GoDaddy (for management)
- Website stays on Netlify (for hosting)
- Update DNS at GoDaddy to point to Netlify

**Option 2: Move to GoDaddy Hosting**
- Transfer domain AND hosting to GoDaddy
- Upload built files to GoDaddy hosting
- Configure GoDaddy hosting environment

**Option 3: Use GitHub Pages**
- Free hosting option
- Automatic deployment from your GitHub repo
- Configure DNS to point to GitHub Pages

### 5. Pre-Transfer Checklist

- [ ] Domain is unlocked at current registrar
- [ ] Authorization code obtained
- [ ] Contact email is accessible
- [ ] Website backup created
- [ ] DNS records documented
- [ ] Hosting plan decided (keep current vs. move)

### 6. Post-Transfer Checklist

- [ ] Domain transfer completed at GoDaddy
- [ ] DNS records configured correctly
- [ ] Website loads at speedway146.com
- [ ] All pages and functionality work
- [ ] SSL certificate is active
- [ ] Email (if any) still works

### 7. Timeline Expectations

- **Domain Transfer**: 5-7 days typically
- **DNS Propagation**: 24-48 hours after DNS changes
- **Total Downtime**: Should be minimal if DNS is configured correctly

### 8. Troubleshooting

#### If Website Goes Down After Transfer:
1. Check DNS settings at GoDaddy
2. Verify hosting is still active
3. Check for SSL certificate issues
4. Contact GoDaddy support if needed

#### Common Issues:
- **DNS not configured**: Website won't load
- **SSL certificate**: May need to be reissued
- **Email disruption**: If using domain email, reconfigure

### 9. Important Notes

- **Keep current hosting active** during transfer process
- **Don't change hosting** until domain transfer is complete
- **Test thoroughly** after DNS changes
- **Have backups** of all website files and data

### 10. Emergency Contacts

- **GoDaddy Support**: Available 24/7
- **Current Hosting Support**: Keep contact info handy
- **Domain Transfer Support**: Usually available during business hours

## Recommended Approach

1. **Complete domain transfer to GoDaddy first**
2. **Keep website on current hosting initially**
3. **Configure DNS at GoDaddy to point to current hosting**
4. **Test everything works**
5. **Then decide if you want to move hosting later**

This approach minimizes downtime and reduces complexity.

---

**Need Help?** 
- GoDaddy has 24/7 support for domain transfers
- Your GitHub repository is ready for deployment anywhere
- All website files are properly configured for independent hosting