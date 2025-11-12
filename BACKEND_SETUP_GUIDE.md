# PEG Security Backend & Admin UX Setup Guide

## 🚀 Quick Start Summary

This guide will help you set up the complete backend infrastructure and admin dashboard for the PEG Security website.

**Time Required:** 30-45 minutes
**Difficulty:** Intermediate
**Prerequisites:** Supabase account with project `ujiaeiqslzwmpvkyixdp` created

---

## 📋 What You're Building

### Backend Infrastructure:
- **6 Database Tables:** contacts, jobs, applications, gallery, team_members, services
- **4 Storage Buckets:** cvs (private), gallery (public), team (public), services (public)
- **Row-Level Security:** Public read for published content, authenticated admin writes
- **10 API Routes:** Full CRUD operations for all entities
- **File Upload System:** Integrated with Supabase Storage

### Admin Dashboard:
- **Authentication:** Supabase Auth with protected routes
- **Dashboard:** Overview with statistics and recent activity
- **Job Management:** Create, edit, view applications
- **Application Review:** Review CVs, change status, add notes
- **Gallery Management:** Upload, organize, tag images
- **Team Management:** Add/edit team members with photos
- **Service Management:** Manage service catalogue
- **Contact Inquiries:** View and respond to inquiries
- **Design:** Following PEG brand guidelines (Poppins, #D0B96D gold, high contrast)

---

## STEP 1: Database Setup (10 minutes)

### 1.1 Get Your Anon Key

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/ujiaeiqslzwmpvkyixdp/settings/api)
2. Under "Project API keys", copy the **`anon`** / **`public`** key
3. Keep this handy for Step 1.3

### 1.2 Run Database Schema

1. Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/ujiaeiqslzwmpvkyixdp/sql/new)
2. Open `supabase/schema.sql` in your code editor
3. Copy the **entire file** contents
4. Paste into the Supabase SQL Editor
5. Click **"Run"**

**What this creates:**
- ✅ 6 tables: contacts, jobs, applications, gallery, team_members, services
- ✅ Automatic `updated_at` triggers
- ✅ Row Level Security (RLS) policies
- ✅ Indexes for performance
- ✅ Sample data for testing

### 1.3 Update Environment Variables

1. Rename `.env.local.supabase` to `.env.local`:
   ```bash
   cd /Users/mac/Downloads/PEG_Security_Profile_Design_Project/peg-security-nextjs
   mv .env.local.supabase .env.local
   ```

2. Open `.env.local` and replace `<YOUR_ANON_KEY_HERE>` with the anon key from Step 1.1

3. Verify your `.env.local` contains:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://ujiaeiqslzwmpvkyixdp.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_actual_anon_key>
   SUPABASE_SERVICE_ROLE_KEY=<already_set>
   ```

---

## STEP 2: Storage Buckets (5 minutes)

### Option A: Using Supabase Dashboard (Recommended)

1. Go to [Supabase Storage](https://supabase.com/dashboard/project/ujiaeiqslzwmpvkyixdp/storage/buckets)
2. Click **"New bucket"**

**Create these 4 buckets:**

| Bucket Name | Public | Purpose |
|------------|--------|---------|
| `cvs` | No (private) | Job application CVs |
| `gallery` | Yes (public) | Project photos |
| `team` | Yes (public) | Team member photos |
| `services` | Yes (public) | Service imagery |

For each bucket:
- Enter the name
- Set public/private as per table
- Click "Create bucket"

### Option B: Using SQL (Alternative)

Run this in the SQL Editor:

```sql
-- Create all 4 buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('cvs', 'cvs', false),
  ('gallery', 'gallery', true),
  ('team', 'team', true),
  ('services', 'services', true);
```

---

## STEP 3: Verify Setup (5 minutes)

### 3.1 Check Database Tables

1. Go to [Table Editor](https://supabase.com/dashboard/project/ujiaeiqslzwmpvkyixdp/editor)
2. Verify you see these 6 tables:
   - ✅ contacts (1 sample record)
   - ✅ jobs (1 sample record)
   - ✅ applications (0 records - linked to jobs)
   - ✅ gallery (1 sample record)
   - ✅ team_members (1 sample record)
   - ✅ services (1 sample record)

### 3.2 Check Storage Buckets

1. Go to [Storage](https://supabase.com/dashboard/project/ujiaeiqslzwmpvkyixdp/storage/buckets)
2. Verify you see these 4 buckets:
   - ✅ cvs (private)
   - ✅ gallery (public)
   - ✅ team (public)
   - ✅ services (public)

### 3.3 Restart Development Server

```bash
# Kill existing servers
pkill -f "next dev"

# Start fresh
cd /Users/mac/Downloads/PEG_Security_Profile_Design_Project/peg-security-nextjs
npm run dev
```

Visit: `http://localhost:3000` - Site should load without errors

---

## STEP 4: Database Schema Overview

### Table: `contacts`
**Purpose:** Contact form submissions
**Key Fields:** name, email, phone, service_type, message, status (New/Read/Responded)
**RLS:** Anyone can insert, Service role can view/update

### Table: `jobs`
**Purpose:** Job postings
**Key Fields:** title, slug, category, location, employment_type, psira_required, description, status (Draft/Open/Closed)
**RLS:** Public can view Open jobs, Service role has full access

### Table: `applications`
**Purpose:** Job applications
**Key Fields:** job_id (FK), applicant_name, email, phone, cv_url, cover_letter, psira_registered, status
**RLS:** Anyone can insert, Service role can view/update
**Note:** Automatically increments job.application_count on insert

### Table: `gallery`
**Purpose:** Project/team photos
**Key Fields:** title, description, category, image_url, thumbnail_url, status (Active/Hidden)
**RLS:** Public can view Active, Service role has full access

### Table: `team_members`
**Purpose:** Team/staff profiles
**Key Fields:** name, position, bio, photo_url, email, phone, display_order, status (Active/Inactive)
**RLS:** Public can view Active, Service role has full access

### Table: `services`
**Purpose:** Service catalogue
**Key Fields:** title, slug, short_description, full_description, category, features (JSONB), pricing_model, status
**RLS:** Public can view Active, Service role has full access

---

## STEP 5: Storage Buckets Overview

### Bucket: `cvs` (Private)
- **Purpose:** Store job application CVs securely
- **Access:** Only admins (via service role) can read/download
- **File Types:** PDF, DOC, DOCX
- **Max Size:** 5MB per file (configurable)

### Bucket: `gallery` (Public)
- **Purpose:** Project photos, security installations
- **Access:** Public read, admin write
- **File Types:** JPG, PNG, WEBP
- **Optimization:** Auto-generate thumbnails

### Bucket: `team` (Public)
- **Purpose:** Team member profile photos
- **Access:** Public read, admin write
- **File Types:** JPG, PNG
- **Recommendation:** Square aspect ratio (400x400px)

### Bucket: `services` (Public)
- **Purpose:** Service-related imagery
- **Access:** Public read, admin write
- **File Types:** JPG, PNG, WEBP, SVG
- **Recommendation:** 16:9 aspect ratio for consistency

---

## STEP 6: Security Overview

### Row-Level Security (RLS) Policies

**Public Users Can:**
- View jobs with status = 'Open'
- View gallery with status = 'Active'
- View team_members with status = 'Active'
- View services with status = 'Active'
- Submit contact forms
- Submit job applications

**Service Role (Admin) Can:**
- Full CRUD on all tables
- Access private storage buckets
- Update statuses

**What's Protected:**
- Draft jobs (not visible to public)
- Hidden gallery items
- Inactive team members
- CV files (private bucket)
- Contact inquiry notes
- Application notes

---

## STEP 7: API Routes Overview

Once the admin UI is built, these routes will be available:

### Contact Routes
- `POST /api/contact` - Submit contact form
- `GET /api/admin/contacts` - List all inquiries (admin)
- `PATCH /api/admin/contacts/[id]` - Update status/notes (admin)

### Job Routes
- `GET /api/jobs` - List open jobs (public)
- `GET /api/jobs/[slug]` - Get job details (public)
- `POST /api/admin/jobs` - Create job (admin)
- `PATCH /api/admin/jobs/[id]` - Update job (admin)
- `DELETE /api/admin/jobs/[id]` - Delete job (admin)

### Application Routes
- `POST /api/jobs/[slug]/apply` - Submit application (public)
- `GET /api/admin/applications` - List all applications (admin)
- `GET /api/admin/applications/[id]` - Get application details (admin)
- `PATCH /api/admin/applications/[id]` - Update status/notes (admin)

### Gallery Routes
- `GET /api/gallery` - List active gallery items (public)
- `POST /api/admin/gallery` - Upload image (admin)
- `PATCH /api/admin/gallery/[id]` - Update details (admin)
- `DELETE /api/admin/gallery/[id]` - Delete image (admin)

### Team Routes
- `GET /api/team` - List active team members (public)
- `POST /api/admin/team` - Add team member (admin)
- `PATCH /api/admin/team/[id]` - Update team member (admin)
- `DELETE /api/admin/team/[id]` - Delete team member (admin)

### Service Routes
- `GET /api/services` - List active services (public)
- `GET /api/services/[slug]` - Get service details (public)
- `POST /api/admin/services` - Create service (admin)
- `PATCH /api/admin/services/[id]` - Update service (admin)
- `DELETE /api/admin/services/[id]` - Delete service (admin)

### File Upload Routes
- `POST /api/admin/upload` - Upload file to any bucket (admin)
- `DELETE /api/admin/upload` - Delete file from bucket (admin)

---

## STEP 8: Admin Authentication

### Setting Up Admin Users

The admin system will use Supabase Auth. You'll need to create admin users:

1. Go to [Authentication](https://supabase.com/dashboard/project/ujiaeiqslzwmpvkyixdp/auth/users)
2. Click **"Add user"**
3. Choose **"Create new user"**
4. Enter:
   - Email: `admin@pegsecurity.co.za` (or your admin email)
   - Password: Use a strong password
   - Email Confirm: Toggle OFF (confirm manually)
5. Click **"Create user"**

**For additional admins:**
Repeat for each admin user:
- `trudie@pegsecurity.co.za`
- `vusi@asginc.co.za`

---

## STEP 9: Next Steps

Once you confirm Steps 1-3 are complete, I will:

### Phase 2: API Routes (api-backend-builder agent)
- Migrate all API routes to use Supabase
- Remove old Airtable/Cloudinary code
- Implement validation and error handling
- Add rate limiting

### Phase 3: Admin Authentication (api-backend-builder + security-specialist)
- Set up Supabase Auth integration
- Create protected route middleware
- Implement session management

### Phase 4: Admin UI Foundation (component-architect + styling-designer)
- Build admin layout components
- Create common UI components (DataTable, FileUpload, Modal, etc.)
- Apply PEG brand design system

### Phase 5: Admin Feature Pages (component-architect)
- Dashboard overview
- Job management
- Application review
- Gallery management
- Team management
- Service management
- Contact inquiries

### Phase 6: Quality Assurance (testing-qa-specialist + bug-hunter-debugger)
- API endpoint testing
- Form validation testing
- File upload testing
- Cross-browser testing

### Phase 7: Security Audit (security-specialist)
- RLS policy validation
- Authentication vulnerability scan
- Input sanitization check
- File upload security

---

## ⚠️ Important Notes

1. **Service Role Key is PRIVATE** - Never expose in client code
2. **Anon Key is PUBLIC** - Safe to use in client components
3. **RLS Policies protect data** - Public can only see published content
4. **Old Airtable data** - Will NOT be automatically migrated (fresh start)
5. **South African English** - Use "colour", "centre", "organisation"

---

## 🆘 Troubleshooting

### Can't find anon key?
- Go to: Settings → API → Project API keys → Copy "anon" key

### Schema SQL fails?
- Make sure you copied the ENTIRE `supabase/schema.sql` file
- Run it all at once, not line by line
- Check for error messages in the SQL Editor

### Storage bucket creation fails?
- Use the Dashboard method (Option A) instead of SQL
- Make sure bucket names are lowercase and no spaces

### Development server won't start?
- Check `.env.local` has all 3 Supabase variables
- Make sure anon key is set (not `<YOUR_ANON_KEY_HERE>`)
- Run `npm install` to ensure @supabase/supabase-js is installed

### Tables not showing sample data?
- Check if INSERT statements ran successfully
- You can add sample data manually via Table Editor

---

## ✅ Completion Checklist

Before proceeding to Phase 2, verify:

- [ ] Database schema executed successfully (6 tables created)
- [ ] All 4 storage buckets created (cvs, gallery, team, services)
- [ ] `.env.local` file updated with real anon key
- [ ] Development server starts without errors
- [ ] Can view sample data in Supabase Table Editor
- [ ] At least one admin user created in Supabase Auth

---

## 📊 Database Schema Diagram

```
contacts
├── id (UUID, PK)
├── name, email, phone
├── service_type (Armed Response, CCTV, etc.)
├── message, preferred_contact
├── status (New/Read/Responded)
└── notes, timestamps

jobs
├── id (UUID, PK)
├── title, slug (unique)
├── category, location, employment_type
├── psira_required (boolean)
├── description, responsibilities, requirements
├── status (Draft/Open/Closed)
├── application_count (auto-updated)
└── timestamps

applications
├── id (UUID, PK)
├── job_id (FK → jobs.id)
├── applicant_name, email, phone
├── cv_url, cv_public_id
├── cover_letter
├── psira_registered, psira_number, years_experience
├── status (New/Reviewing/Interviewed/Hired/Rejected)
└── notes, timestamps

gallery
├── id (UUID, PK)
├── title, description, category
├── image_url, image_public_id, thumbnail_url
├── status (Active/Hidden)
├── display_order
└── timestamps

team_members
├── id (UUID, PK)
├── name, position, bio
├── photo_url, photo_public_id
├── email, phone, linkedin_url
├── status (Active/Inactive)
├── display_order
└── timestamps

services
├── id (UUID, PK)
├── title, slug (unique)
├── short_description, full_description
├── icon_name, category
├── features (JSONB array)
├── pricing_model, pricing_details
├── image_url, image_public_id
├── status (Active/Draft/Archived)
├── display_order
└── timestamps
```

---

## 🎯 Ready to Proceed?

Once you've completed Steps 1-3 and verified everything with the checklist, confirm by saying:

**"Backend setup complete, proceed with API routes"**

I'll then coordinate the specialized agents to build:
1. API routes (api-backend-builder)
2. Admin authentication (api-backend-builder + security-specialist)
3. Admin UI (component-architect + styling-designer)
4. Testing & QA (testing-qa-specialist + bug-hunter-debugger)
5. Final security audit (security-specialist)

---

**Estimated total time:** 8-12 hours of development across all phases
