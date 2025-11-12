# Database Setup Instructions

## Issue

The database credentials in `.env.local` appear to be outdated or incorrect. The pooler connection is failing with "Tenant or user not found" error.

## Solution: Manual Schema Execution

Since automated execution is failing, please follow these steps to set up the database:

### Step 1: Access Supabase SQL Editor

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: **PEG Security** (Project ID: `ujiaeiqslzwmpvkyixdp`)
3. Navigate to **SQL Editor** in the left sidebar

### Step 2: Execute the Schema

1. Click **New Query** or **+** to create a new SQL query
2. Copy the entire contents of `/supabase/schema.sql`
3. Paste it into the SQL Editor
4. Click **Run** or press `Ctrl/Cmd + Enter`

### Step 3: Verify Tables Were Created

After running the schema, verify the tables by running this query:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

Expected tables:
- `applications`
- `contacts`
- `gallery`
- `jobs`
- `services`
- `team_members`

### Step 4: Update Database Credentials (Optional)

If you need the correct connection string for local development:

1. In Supabase Dashboard, go to **Settings** > **Database**
2. Scroll down to **Connection String**
3. Copy the **Connection Pooling** or **Direct Connection** string
4. Update `DATABASE_URL` in `.env.local`

### What the Schema Creates

1. **6 Tables**:
   - `contacts` - Contact form submissions
   - `jobs` - Job postings
   - `applications` - Job applications with CV storage references
   - `gallery` - Gallery images
   - `team_members` - Team member profiles
   - `services` - Service offerings

2. **Indexes** for performance on commonly queried fields

3. **Triggers**:
   - Auto-update `updated_at` timestamps
   - Auto-increment job application counts

4. **Row Level Security (RLS) Policies**:
   - Public read access for active jobs and gallery
   - Public insert for contacts and applications
   - Service role full access to all tables

5. **Sample Data** for testing (optional)

## Alternative: Use Supabase CLI (If credentials are fixed)

If you get the correct database password:

```bash
# Set the password
export PGPASSWORD="your_correct_password"

# Execute schema
psql "postgresql://postgres.ujiaeiqslzwmpvkyixdp:$PGPASSWORD@aws-0-eu-west-1.pooler.supabase.com:5432/postgres" -f supabase/schema.sql
```

Or use the Supabase CLI:

```bash
supabase db push --db-url "postgresql://postgres.ujiaeiqslzwmpvkyixdp:PASSWORD@aws-0-eu-west-1.pooler.supabase.com:5432/postgres" < supabase/schema.sql
```

## Next Steps

Once the database is set up:

1. Test the API routes:
   - `GET /api/jobs` - Should return empty array or sample job
   - `GET /api/gallery` - Should return empty array or sample image
   - `GET /api/services` - Should return empty array or sample service

2. Start adding real data through the admin interface or API

3. Configure Storage Buckets (if not already done):
   - In Supabase Dashboard > Storage
   - Create `cvs` bucket (private) for job application CVs
   - Create `gallery` bucket (public) for gallery images
   - Create `team` bucket (public) for team member photos
   - Create `services` bucket (public) for service images
