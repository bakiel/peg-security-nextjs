# ⚠️ DATABASE SETUP REQUIRED

## Current Status

✅ **Server Running**: http://localhost:3000
✅ **All Airtable code removed**
✅ **All API routes migrated to Supabase**
✅ **Code compiling successfully**
❌ **Database tables not created yet**

---

## Quick Fix (2 minutes)

### Step 1: Open Supabase SQL Editor

Go to: https://supabase.com/dashboard/project/ujiaeiqslzwmpvkyixdp/sql/new

### Step 2: Copy and Execute Schema

1. Open this file on your computer:
   ```
   /Users/mac/Downloads/PEG_Security_Profile_Design_Project/peg-security-nextjs/supabase/schema.sql
   ```

2. Copy the **entire contents** (394 lines)

3. Paste into Supabase SQL Editor

4. Click **"Run"** button

### Step 3: Verify Tables Created

Run this query to verify:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

**Expected Result:** 6 tables
- applications
- contacts
- gallery
- jobs
- services
- team_members

---

## What Will Be Created

### Tables (6)
- **contacts** - Contact form submissions with service type and status tracking
- **jobs** - Job postings with categories, requirements, and application counts
- **applications** - Job applications linked to jobs table
- **gallery** - Image gallery with categories and display ordering
- **team_members** - Team profiles with photos and LinkedIn links
- **services** - Service offerings with JSONB features and pricing models

### Security Features
- **Row-Level Security (RLS)** enabled on all tables
- **Public read access** for items with status='Active' or status='Open'
- **Public insert access** for contact/application submissions
- **Service role full access** for admin operations (bypasses RLS)

### Performance Features
- **11 indexes** for fast queries on status, dates, slugs, display_order
- **6 triggers** for auto-updating timestamps
- **1 trigger** for auto-incrementing job application counts

### Sample Data
- 1 sample contact (Thabo Mbeki)
- 1 sample job (Armed Response Officer - Sandton)
- 1 sample gallery image (Armed Response Team)
- 1 sample team member (Vusi Nxumalo)
- 1 sample service (Armed Response Services)

---

## Alternative: Execute via Script

If you prefer automation:

1. **Get correct database password** from Supabase Dashboard:
   - Go to Settings > Database
   - Connection string section
   - Copy the password

2. **Update .env.local**:
   ```bash
   DATABASE_URL=postgresql://postgres.ujiaeiqslzwmpvkyixdp:YOUR_ACTUAL_PASSWORD@aws-0-eu-west-1.pooler.supabase.com:5432/postgres
   ```

3. **Install pg package** (if not already installed):
   ```bash
   npm install pg
   ```

4. **Run the setup script**:
   ```bash
   node scripts/execute-schema.js
   ```

---

## After Schema Execution

### Test the Application

1. **Visit**: http://localhost:3000
   - Homepage should load without errors

2. **Test public API**:
   ```bash
   curl http://localhost:3000/api/jobs
   ```
   Should return: `{"success":true,"data":[...],"count":1}`

3. **Visit admin**: http://localhost:3000/admin
   - Should redirect to login page
   - Login: admin / PEGSecurity2025!
   - Dashboard should show sample data

### Expected Results After Setup

- ✅ Public pages load
- ✅ `/api/jobs` returns sample job
- ✅ `/api/gallery` returns sample image
- ✅ Admin login works
- ✅ Admin dashboard shows sample data
- ✅ Can create new jobs, team members, services

---

## Troubleshooting

### "Table not found" errors?
- Execute the schema SQL in Supabase dashboard

### "Could not find the table in schema cache"?
- Wait 30 seconds after executing schema
- Refresh the page
- Check Supabase dashboard that tables exist

### Still getting errors?
- Check Supabase project is active
- Verify environment variables in `.env.local`
- Check Supabase API URL and keys are correct

---

## Summary

**Current State**: Application code is 100% ready. All API routes are migrated from Airtable to Supabase. The server is running and compiling without errors.

**What's Missing**: Database tables need to be created by executing the schema SQL.

**Time Required**: 2 minutes to copy/paste SQL in Supabase dashboard.

**Once Complete**: Full application will be functional with sample data loaded.
