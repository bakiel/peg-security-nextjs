# PEG Security - Deployment Guide

**Last Updated**: November 11, 2025
**Version**: 1.0
**Platform**: Vercel

---

## 📋 PRE-DEPLOYMENT CHECKLIST

Before deploying, ensure you have:

- ✅ All environment variables configured
- ✅ Airtable tables created with correct schemas
- ✅ Cloudinary account set up
- ✅ Resend API key obtained
- ✅ Admin password set
- ✅ All dependencies installed (`npm install`)
- ✅ Local build successful (`npm run build`)
- ✅ Security headers configured in `next.config.mjs`

---

## 🚀 VERCEL DEPLOYMENT STEPS

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Link Project (First Time Only)

```bash
vercel link
```

Follow the prompts to:
- Create a new project or link existing
- Choose your team/account
- Confirm project settings

### Step 4: Configure Environment Variables

You have two options:

#### Option A: Via Vercel CLI

```bash
# Add each variable one by one
vercel env add CLOUDINARY_API_KEY production
vercel env add CLOUDINARY_API_SECRET production
vercel env add AIRTABLE_ACCESS_TOKEN production
# ... continue for all variables
```

#### Option B: Via Vercel Dashboard

1. Go to your project in Vercel dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add all variables from `.env.local`:

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
CLOUDINARY_URL
AIRTABLE_ACCESS_TOKEN
AIRTABLE_BASE_ID
AIRTABLE_JOBS_TABLE_ID
AIRTABLE_APPLICATIONS_TABLE_ID
AIRTABLE_GALLERY_TABLE_ID
RESEND_API_KEY
RESEND_FROM_EMAIL
ADMIN_PASSWORD
JWT_SECRET
NEXT_PUBLIC_SITE_URL
NODE_ENV=production
```

### Step 5: Deploy to Production

```bash
# Deploy to production
vercel --prod
```

Or use the shorthand:

```bash
vercel --prod
```

### Step 6: Verify Deployment

After deployment, verify:

1. **Homepage** loads correctly
2. **Contact form** submits successfully
3. **Admin login** works at `/admin/login`
4. **Gallery** displays images from Airtable
5. **Careers page** shows jobs from Airtable
6. **Job applications** can be submitted with CV upload

---

## 🔧 POST-DEPLOYMENT CONFIGURATION

### Update Site URL

After first deployment, update the environment variable:

```bash
vercel env add NEXT_PUBLIC_SITE_URL production
# Enter: https://your-domain.vercel.app
```

Or in Vercel Dashboard:
- Go to Settings → Environment Variables
- Find `NEXT_PUBLIC_SITE_URL`
- Update to your production URL
- **Trigger a redeploy** for changes to take effect

### Configure Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project
2. Navigate to **Settings** → **Domains**
3. Add your custom domain (e.g., `pegsecurity.co.za`)
4. Follow DNS configuration instructions
5. Update `NEXT_PUBLIC_SITE_URL` to custom domain

### Set up Resend Domain (Recommended)

For production emails from your domain:

1. Go to [Resend Dashboard](https://resend.com/domains)
2. Click **Add Domain**
3. Enter `pegsecurity.co.za`
4. Add DNS records as instructed
5. Verify domain
6. Update environment variable:
   ```bash
   vercel env add RESEND_FROM_EMAIL production
   # Enter: noreply@pegsecurity.co.za
   ```
7. Redeploy

---

## 📊 AIRTABLE TABLE SCHEMAS

### 1. Jobs Table

Required fields:
- `Job ID` (Auto number)
- `Title` (Single line text)
- `Slug` (Formula: `LOWER(SUBSTITUTE(Title, " ", "-"))`)
- `Category` (Single select: operations, management, admin, technical, training)
- `Location` (Single line text)
- `Employment Type` (Single select: full-time, part-time, contract, temporary)
- `PSIRA Required` (Checkbox)
- `Description` (Long text)
- `Responsibilities` (Long text)
- `Requirements` (Long text)
- `Benefits` (Long text)
- `Status` (Single select: open, closed, draft)
- `Created At` (Created time)
- `Updated At` (Last modified time)
- `Application Count` (Number)

### 2. Applications Table

Required fields:
- `Application ID` (Auto number)
- `Job ID` (Single line text)
- `Job Title` (Single line text)
- `Applicant Name` (Single line text)
- `Applicant Email` (Email)
- `Applicant Phone` (Phone)
- `CV URL` (URL)
- `CV Public ID` (Single line text)
- `Cover Letter` (Long text)
- `PSIRA Registered` (Checkbox)
- `PSIRA Number` (Single line text)
- `Years Experience` (Number)
- `Available Start Date` (Date)
- `Status` (Single select: new, reviewing, shortlisted, interview-scheduled, rejected, hired)
- `Submitted At` (Date with time)
- `Reviewed At` (Date with time)
- `Reviewed By` (Single line text)
- `Notes` (Long text)

### 3. Gallery Table

Required fields:
- `Gallery ID` (Auto number)
- `Title` (Single line text)
- `Description` (Long text)
- `Category` (Single select: training, operations, team, events, equipment, facilities, awards)
- `Image URL` (URL)
- `Image Public ID` (Single line text)
- `Thumbnail URL` (URL)
- `Aspect Ratio` (Single select: square, landscape, portrait)
- `Featured` (Checkbox)
- `Order` (Number)
- `Created At` (Created time)
- `Updated At` (Last modified time)

### 4. Contacts Table (Optional)

Recommended fields:
- `Contact ID` (Auto number)
- `Name` (Single line text)
- `Email` (Email)
- `Phone` (Phone)
- `Service Type` (Single select)
- `Message` (Long text)
- `Preferred Contact` (Single select: email, phone, whatsapp)
- `Status` (Single select: new, contacted, resolved)
- `Submitted At` (Date with time)
- `Notes` (Long text)

---

## 🔒 SECURITY CONSIDERATIONS

### Production Security Checklist

- ✅ All secrets in environment variables (not in code)
- ✅ Strong admin password set
- ✅ JWT secret is random and unique
- ✅ HTTPS enforced (automatic on Vercel)
- ✅ Security headers configured
- ✅ Rate limiting active
- ✅ Input validation on all endpoints
- ✅ CSRF protection enabled
- ✅ XSS prevention implemented

### Rotate Secrets Regularly

Schedule to rotate every 90 days:
- Admin password
- JWT secret
- API keys (Cloudinary, Airtable, Resend)

---

## 🐛 TROUBLESHOOTING

### Build Fails

**Error: Missing environment variables**
```
Solution: Add all required env vars in Vercel dashboard
```

**Error: Module not found**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Runtime Errors

**Error: Airtable connection failed**
```
- Verify AIRTABLE_ACCESS_TOKEN is correct
- Check table IDs match your Airtable base
- Ensure Airtable API is accessible from Vercel
```

**Error: Cloudinary upload failed**
```
- Verify CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET
- Check cloud name is correct
- Ensure upload preset is configured
```

**Error: Email not sending**
```
- Verify RESEND_API_KEY is valid
- Check from email is verified
- Review Resend dashboard logs
```

### Performance Issues

**Slow API responses**
```
- Check Airtable rate limits
- Enable ISR caching (already configured)
- Review Next.js build optimization
```

---

## 📞 SUPPORT

**Technical Issues**: bakiel@pegsecurity.co.za
**Emergency**: +27 79 413 9180

**Vercel Support**: https://vercel.com/support
**Airtable Support**: https://support.airtable.com
**Cloudinary Support**: https://support.cloudinary.com

---

## 🔄 REDEPLOYMENT

### Trigger Redeploy

```bash
# Option 1: Git push
git add .
git commit -m "Update"
git push origin main

# Option 2: Vercel CLI
vercel --prod

# Option 3: Vercel Dashboard
# Click "Redeploy" button
```

### Rollback to Previous Version

In Vercel Dashboard:
1. Go to **Deployments**
2. Find previous successful deployment
3. Click "..." → **Promote to Production**

---

## ✅ DEPLOYMENT COMPLETE

Your PEG Security website is now live! 🎉

**Next Steps**:
1. Test all features thoroughly
2. Monitor error logs in Vercel
3. Set up analytics (optional)
4. Configure backup strategy
5. Schedule regular security audits

---

*Last Updated: November 11, 2025*
*Version: 1.0*
