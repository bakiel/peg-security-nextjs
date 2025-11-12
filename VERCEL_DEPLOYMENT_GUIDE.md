# Vercel Deployment Guide - PEG Security

## ✅ Pre-Deployment Checklist

- ✅ Code committed to git
- ✅ Environment variables documented below
- ✅ Database seeded with data
- ✅ Vercel CLI installed

## 🔐 Required Environment Variables

Copy these to your Vercel project settings after deployment:

### Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
```

### Authentication
```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<your-secure-admin-password>
JWT_SECRET=<generate-a-random-secret>
```

### AI Services (Optional - for gallery descriptions)
```
OPENROUTER_API_KEY=<your-openrouter-api-key>
```

### Image Storage (Optional - using Supabase Storage instead)
```
CLOUDINARY_CLOUD_NAME=<optional>
CLOUDINARY_API_KEY=<optional>
CLOUDINARY_API_SECRET=<optional>
```

### Email (Optional - for contact forms)
```
RESEND_API_KEY=<optional>
```

## 🚀 Deployment Steps

### Option 1: Deploy with Vercel CLI (Recommended)

1. **Login to Vercel:**
   ```bash
   vercel login
   ```

2. **Deploy to production:**
   ```bash
   vercel --prod
   ```

3. **Add environment variables:**
   - Go to your Vercel dashboard
   - Navigate to your project settings
   - Add all environment variables listed above

4. **Redeploy:**
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. **Push to GitHub:**
   ```bash
   # Create a new repository on GitHub first, then:
   git remote add origin https://github.com/YOUR_USERNAME/peg-security.git
   git push -u origin main
   ```

2. **Import to Vercel:**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Add environment variables during setup
   - Deploy

## 🔧 Post-Deployment Configuration

### 1. Database Seeding (Production)
After deployment, seed your production database:

```bash
# Using your .env.local credentials
node scripts/reset-and-seed.js
```

### 2. Admin Access
Navigate to `https://your-domain.vercel.app/admin` and login with:
- Username: admin
- Password: (the one you set in ADMIN_PASSWORD)

### 3. Upload Gallery Images
1. Go to `/admin/gallery`
2. Upload your 12 security images
3. Use AI descriptions to generate professional captions

## 📊 What's Deployed

Your PEG Security website includes:

### Public Pages:
- ✅ Homepage with hero carousel and services overview
- ✅ Services page with full service details
- ✅ About/Team page with staff profiles
- ✅ Careers page with job listings
- ✅ Gallery page with project images
- ✅ Contact page with enquiry form

### Admin Dashboard:
- ✅ Dashboard with statistics
- ✅ Services management (CRUD)
- ✅ Team management (CRUD)
- ✅ Jobs management (CRUD)
- ✅ Applications review
- ✅ Contact messages management
- ✅ Gallery management with AI descriptions

### Features:
- ✅ Fully responsive design
- ✅ Smooth animations and transitions
- ✅ AI-powered image descriptions (South African English)
- ✅ Database-driven content
- ✅ Secure admin authentication
- ✅ Image upload and processing

## 🐛 Troubleshooting

### Build Fails
- Check that all environment variables are set
- Verify Supabase connection strings are correct

### Gallery Not Working
- Ensure OPENROUTER_API_KEY is set (optional feature)
- Or remove AI functionality if not needed

### Admin Can't Login
- Verify ADMIN_USERNAME and ADMIN_PASSWORD are set
- Check JWT_SECRET is configured

### Database Queries Failing
- Confirm SUPABASE_SERVICE_ROLE_KEY is set
- Verify database tables are created (run schema.sql)

## 📝 Important Notes

1. **Security**: Never commit `.env.local` to git (already in .gitignore)
2. **Database**: Production database should be separate from development
3. **Images**: Gallery images are stored in Supabase Storage
4. **Performance**: Static pages are cached by Vercel CDN
5. **Admin**: Change default admin credentials after first deployment

## 🎉 Success!

Once deployed, your site will be live at:
- **Production URL**: https://your-project.vercel.app
- **Admin Dashboard**: https://your-project.vercel.app/admin

Vercel will automatically:
- ✅ Build and optimize your Next.js app
- ✅ Deploy to global CDN
- ✅ Enable automatic HTTPS
- ✅ Set up continuous deployment from git

---

**Need help?** Contact support or check Vercel documentation at https://vercel.com/docs
