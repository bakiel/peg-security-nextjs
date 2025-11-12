# 🚀 PEG SECURITY - QUICK REFERENCE

## Your Website
**http://localhost:3001**

## Admin Login
- URL: http://localhost:3001/admin
- User: `admin`
- Pass: `PEGSecurity2025!`

## One SQL Fix Needed
Run this in Supabase SQL Editor to enable contact forms:
https://supabase.com/dashboard/project/ujiaeiqslzwmpvkyixdp/sql/new

```sql
DROP POLICY IF EXISTS "Anyone can submit contact form" ON contacts;
DROP POLICY IF EXISTS "Anyone can submit job application" ON applications;

CREATE POLICY "Anyone can submit contact form"
  ON contacts FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Anyone can submit job application"
  ON applications FOR INSERT TO anon, authenticated WITH CHECK (true);
```

## Start/Stop Server
```bash
cd /Users/mac/Downloads/PEG_Security_Profile_Design_Project/peg-security-nextjs
npm run dev          # Start
Ctrl+C               # Stop
```

## Database
- Dashboard: https://supabase.com/dashboard/project/ujiaeiqslzwmpvkyixdp
- 6 tables created ✅
- Sample data loaded ✅

## Status: ✅ READY TO USE!
