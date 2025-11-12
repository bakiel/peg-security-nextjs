# 🚀 Supabase Migration Guide

## Step 1: Get Your Anon Key

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/ujiaeiqslzwmpvkyixdp/settings/api)
2. Under "Project API keys", copy the **`anon`** / **`public`** key
3. Update `.env.local.supabase` file:
   ```bash
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<paste_your_anon_key_here>
   ```

---

## Step 2: Run Database Schema

1. Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/ujiaeiqslzwmpvkyixdp/sql/new)
2. Copy the entire contents of `supabase/schema.sql`
3. Paste into the SQL Editor
4. Click **"Run"**

This will create:
- ✅ 4 tables: `contacts`, `jobs`, `applications`, `gallery`
- ✅ Automatic `updated_at` triggers
- ✅ Row Level Security (RLS) policies
- ✅ Indexes for performance
- ✅ Sample data for testing

---

## Step 3: Set Up Storage Buckets

### Option A: Using Supabase Dashboard (Easiest)

1. Go to [Supabase Storage](https://supabase.com/dashboard/project/ujiaeiqslzwmpvkyixdp/storage/buckets)
2. Click **"New bucket"**
3. Create bucket #1:
   - Name: `cvs`
   - Public: **No** (private)
   - Click "Create bucket"
4. Create bucket #2:
   - Name: `gallery`
   - Public: **Yes** (public)
   - Click "Create bucket"

### Option B: Using SQL (Alternative)

Run this SQL in the SQL Editor:

```sql
-- Create CVs bucket (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('cvs', 'cvs', false);

-- Create Gallery bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true);
```

---

## Step 4: Update Environment Variables

1. Rename `.env.local.supabase` to `.env.local`:
   ```bash
   mv .env.local.supabase .env.local
   ```

2. Verify it contains:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://ujiaeiqslzwmpvkyixdp.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>
   SUPABASE_SERVICE_ROLE_KEY=<already_set>
   ```

---

## Step 5: Restart Development Server

```bash
# Kill existing servers
pkill -f "next dev"

# Start fresh
cd /Users/mac/Downloads/PEG_Security_Profile_Design_Project/peg-security-nextjs
npm run dev
```

---

## Step 6: Test the Migration

1. **Check Database Tables:**
   - Go to [Table Editor](https://supabase.com/dashboard/project/ujiaeiqslzwmpvkyixdp/editor)
   - You should see: `contacts`, `jobs`, `applications`, `gallery`
   - Each should have 1 sample record

2. **Check Storage Buckets:**
   - Go to [Storage](https://supabase.com/dashboard/project/ujiaeiqslzwmpvkyixdp/storage/buckets)
   - You should see: `cvs` (private), `gallery` (public)

3. **Test Admin Panel:**
   - Open: `http://localhost:3000/admin/login`
   - Login: `admin` / `PEGSecurity2025!`
   - Navigate to Messages, Applications, Jobs, Gallery
   - Verify sample data loads

---

## 🎯 What Changed

### Before (Airtable + Cloudinary):
```
lib/airtable.ts (100 lines)
lib/cloudinary.ts (50 lines)
AIRTABLE_ACCESS_TOKEN
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

### After (Supabase only):
```
lib/supabase.ts (new, cleaner)
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

---

## 🔧 Migration Status

- [x] Supabase client installed
- [x] Database schema created
- [x] Storage helper functions created
- [ ] **YOU DO:** Get anon key and update `.env.local`
- [ ] **YOU DO:** Run `schema.sql` in Supabase SQL Editor
- [ ] **YOU DO:** Create storage buckets
- [ ] **I DO:** Migrate API routes to use Supabase
- [ ] **I DO:** Test all endpoints

---

## ⚠️ Important Notes

1. **Service Role Key is PRIVATE** - Never expose in client code
2. **Anon Key is PUBLIC** - Safe to use in client components
3. **RLS Policies protect data** - Public can only see Open jobs and Active gallery
4. **Old Airtable data** - Will NOT be automatically migrated (fresh start)

---

## 🆘 Troubleshooting

**Can't find anon key?**
- Go to: Settings → API → Project API keys → Copy "anon" key

**Schema SQL fails?**
- Make sure you copied the ENTIRE `supabase/schema.sql` file
- Run it all at once, not line by line

**Storage bucket creation fails?**
- Use the Dashboard method (Option A) instead of SQL

**Development server won't start?**
- Check `.env.local` has all 3 Supabase variables
- Make sure anon key is set (not `<YOUR_ANON_KEY_HERE>`)

---

## ✅ Ready to Proceed?

Once you've completed Steps 1-3 above, let me know and I'll:
1. Migrate all 10 API routes to use Supabase
2. Remove old Airtable/Cloudinary code
3. Test everything works

Just say **"Steps 1-3 done"** when ready!
