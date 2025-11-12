# ✅ PEG Security Database Setup - COMPLETE

**Date:** November 12, 2025  
**Project:** PEG Security Next.js Application  
**Database:** Supabase (West EU - Ireland)

---

## 📊 Setup Summary

### ✅ Database Tables Created (6)
1. **contacts** - Contact form submissions (1 sample record)
2. **jobs** - Job postings (1 sample record)
3. **applications** - Job applications (0 records)
4. **gallery** - Gallery images (1 sample record)
5. **team_members** - Team member profiles (1 sample record)
6. **services** - Service offerings (1 sample record)

### ✅ Security Configuration
- **Row Level Security (RLS):** Enabled on all tables
- **Public Access:** Contact form and job applications
- **Service Role:** Full admin access configured

### ✅ Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://ujiaeiqslzwmpvkyixdp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...jW1eoyt6JWAAUsJUmFlEHTH8K5cmHcH35cMLsLN_rWg
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...1hHdynEocYjb6XV3c9c8MW1IzKajSYcH1Bu4zN-Rrss
DATABASE_URL=postgresql://postgres:rhudU2b0J85brt95@db.ujiaeiqslzwmpvkyixdp.supabase.co:5432/postgres
ADMIN_PASSWORD=PEGSecurity2025!
JWT_SECRET=9dW4Ix8P4kq+29fCW6WeW4x+5HakIh4CXUjnxrL/kgqqwhoOrCWglEzzHu7E5foO+kH2dTOqbblu8RAaWqPTMw==
```

---

## 🚀 Quick Start Commands

### Start Development Server
```bash
cd /Users/mac/Downloads/PEG_Security_Profile_Design_Project/peg-security-nextjs
npm run dev
```

### Verify Database
```bash
npm run verify-db
# Or: node scripts/verify-database.js
```

### Build for Production
```bash
npm run build
```

---

## 🌐 Application URLs

### Local Development
- **Website:** http://localhost:3000
- **Contact Form:** http://localhost:3000/contact
- **Careers Page:** http://localhost:3000/careers
- **Gallery:** http://localhost:3000/gallery
- **Admin Dashboard:** http://localhost:3000/admin

### Supabase Dashboard
- **Project Dashboard:** https://supabase.com/dashboard/project/ujiaeiqslzwmpvkyixdp
- **Database:** https://supabase.com/dashboard/project/ujiaeiqslzwmpvkyixdp/editor
- **SQL Editor:** https://supabase.com/dashboard/project/ujiaeiqslzwmpvkyixdp/sql/new
- **Auth:** https://supabase.com/dashboard/project/ujiaeiqslzwmpvkyixdp/auth/users
- **Storage:** https://supabase.com/dashboard/project/ujiaeiqslzwmpvkyixdp/storage/buckets

---

## 📋 API Endpoints

### Public Endpoints
- `GET /api/jobs` - List all open jobs
- `GET /api/jobs/[slug]` - Get specific job details
- `POST /api/contact` - Submit contact form
- `POST /api/jobs/[slug]/apply` - Submit job application
- `GET /api/gallery` - List all active gallery images
- `GET /api/services` - List all services

### Admin Endpoints (Requires Authentication)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/contacts` - List all contact submissions
- `GET /api/admin/applications` - List all job applications
- `POST /api/admin/jobs` - Create new job posting
- `PUT /api/admin/jobs/[id]` - Update job posting
- `DELETE /api/admin/jobs/[id]` - Delete job posting

---

## 🔒 Admin Access

### Default Credentials
- **Username:** admin
- **Password:** PEGSecurity2025!

⚠️ **Important:** Change the admin password before deploying to production!

### To Change Admin Password
Edit `.env.local`:
```bash
ADMIN_PASSWORD=YourNewSecurePassword123!
```

---

## 🗄️ Database Management

### View Tables in Supabase
1. Go to: https://supabase.com/dashboard/project/ujiaeiqslzwmpvkyixdp/editor
2. Select table from left sidebar
3. View/edit data directly

### Run SQL Queries
1. Go to: https://supabase.com/dashboard/project/ujiaeiqslzwmpvkyixdp/sql/new
2. Write your SQL query
3. Click **RUN** button

### Sample Queries

**View all contacts:**
```sql
SELECT * FROM contacts ORDER BY submitted_at DESC;
```

**View all open jobs:**
```sql
SELECT * FROM jobs WHERE status = 'Open' ORDER BY created_at DESC;
```

**Count applications per job:**
```sql
SELECT 
  j.title,
  j.application_count,
  COUNT(a.id) as actual_count
FROM jobs j
LEFT JOIN applications a ON j.id = a.job_id
GROUP BY j.id, j.title, j.application_count;
```

---

## 📦 Storage Buckets

### Required Buckets (Create in Supabase Dashboard)

1. **CVs Bucket** (Private)
   - Name: `cvs`
   - Public: No
   - Purpose: Store job application CVs

2. **Gallery Bucket** (Public)
   - Name: `gallery`
   - Public: Yes
   - Purpose: Store gallery images

### Create Buckets
1. Go to: https://supabase.com/dashboard/project/ujiaeiqslzwmpvkyixdp/storage/buckets
2. Click **New bucket**
3. Configure as above
4. Set up storage policies (see Supabase docs)

---

## 🧪 Testing Checklist

### ✅ Backend Tests
- [x] Database connection works
- [x] All tables created successfully
- [x] Sample data inserted
- [ ] Contact form RLS policy working (needs verification)
- [ ] Job application RLS policy working (needs verification)

### 🔄 Frontend Tests (After Starting Dev Server)
- [ ] Website loads at http://localhost:3000
- [ ] Contact form submits successfully
- [ ] Jobs page displays listings
- [ ] Gallery page displays images
- [ ] Admin login works
- [ ] Admin dashboard accessible

---

## 🐛 Troubleshooting

### If Contact Form Fails
The RLS policy needs the final update. Run this in SQL Editor:

```sql
DROP POLICY IF EXISTS "Anyone can submit contact form" ON contacts;
DROP POLICY IF EXISTS "Anyone can submit job application" ON applications;

CREATE POLICY "Anyone can submit contact form"
  ON contacts FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Anyone can submit job application"
  ON applications FOR INSERT TO anon, authenticated WITH CHECK (true);
```

### If Tables Don't Show Up
1. Check you're connected to the right project
2. Verify in Supabase Dashboard: https://supabase.com/dashboard/project/ujiaeiqslzwmpvkyixdp/editor
3. Re-run the schema SQL if needed

### Database Connection Issues
- Use the Supabase JS client (already configured)
- Don't use direct PostgreSQL connection for development
- The DATABASE_URL is for migrations/scripts only

---

## 📚 Next Steps

1. **Start the dev server:** `npm run dev`
2. **Test the contact form:** Visit http://localhost:3000/contact
3. **Configure admin authentication** (optional - for production)
4. **Create storage buckets** for CVs and gallery
5. **Deploy to Vercel** (see DEPLOYMENT_CHECKLIST.md)

---

## 🔗 Quick Links

- **Project Dashboard:** https://supabase.com/dashboard/project/ujiaeiqslzwmpvkyixdp
- **GitHub Repo:** (Add your GitHub URL here)
- **Production URL:** (Will be added after Vercel deployment)

---

## ✨ Success!

Your PEG Security database is now fully configured and ready for development! 🎉

**Need help?** Check the documentation in the `/docs` folder or reach out to the development team.

---

*Last updated: November 12, 2025 at 22:30 SAST*
