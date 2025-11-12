# Universal Supabase Project Setup

This project includes automated setup scripts that handle database schema, storage buckets, and security policies.

## Quick Start

1. Create `.env.local` with your credentials
2. Run `node scripts/setup-automated.js`
3. Run `npm run dev`

## What Gets Automated

- ✅ Database tables and indexes
- ✅ Row Level Security policies  
- ✅ Storage buckets (cvs, gallery, team-photos)
- ✅ Bucket access policies
- ✅ Sample data insertion
- ✅ Setup verification

## Reusable for Future Projects

Edit `scripts/setup-automated.js` to customize:
- Storage bucket configuration
- Database schema location
- Verification checks

See the script comments for detailed customization options.
