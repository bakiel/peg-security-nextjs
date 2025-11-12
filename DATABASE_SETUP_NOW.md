# Quick Database Setup (5 minutes)

## Step 1: Execute Schema
1. Go to: https://supabase.com/dashboard/project/ujiaeiqslzwmpvkyixdp/sql/new
2. Copy entire contents of `/supabase/schema.sql`
3. Paste into SQL Editor
4. Click **Run** button
5. Wait for "Success" message

## Step 2: Create Storage Buckets
Go to: https://supabase.com/dashboard/project/ujiaeiqslzwmpvkyixdp/storage/buckets

Create 4 buckets:

### Bucket 1: cvs (Private)
- Name: `cvs`
- Public: **OFF** ❌
- Click Create

### Bucket 2: gallery (Public)
- Name: `gallery`
- Public: **ON** ✅
- Click Create

### Bucket 3: team (Public)
- Name: `team`
- Public: **ON** ✅
- Click Create

### Bucket 4: services (Public)
- Name: `services`
- Public: **ON** ✅
- Click Create

## Step 3: Create Admin User
1. Go to: https://supabase.com/dashboard/project/ujiaeiqslzwmpvkyixdp/auth/users
2. Click **Add User** → **Create new user**
3. Enter:
   - Email: `admin@pegsecurity.co.za`
   - Password: (choose a strong password)
   - Auto Confirm: **ON** ✅
4. Click **Create User**

## Step 4: Verify Setup
Back in SQL Editor, run:
```sql
SELECT COUNT(*) FROM contacts;
SELECT COUNT(*) FROM jobs;
SELECT COUNT(*) FROM applications;
SELECT COUNT(*) FROM gallery;
SELECT COUNT(*) FROM team_members;
SELECT COUNT(*) FROM services;
```

You should see sample data counts (1-3 rows each).

## ✅ Done!
Once completed, the backend code generation will continue automatically.

The app will be ready at: `http://localhost:3000`
Admin dashboard at: `http://localhost:3000/admin`
