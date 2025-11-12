# Deployment Checklist - Team & Services APIs

## Prerequisites

- [x] Next.js 14 with App Router installed
- [x] Supabase project created
- [x] Supabase JS client installed (`@supabase/supabase-js`)
- [x] Zod installed for validation

## Database Setup

### 1. Run SQL Schema
Execute the schema in Supabase SQL Editor:
```bash
File: /supabase/schema.sql
```

This creates:
- `team_members` table with indexes and triggers
- `services` table with indexes and triggers
- RLS policies for public/admin access
- Sample data (optional)

### 2. Create Storage Buckets

In Supabase Dashboard > Storage, create these buckets:

| Bucket Name | Public | Purpose |
|-------------|--------|---------|
| `cvs` | No | Job application CVs |
| `gallery` | Yes | Gallery images |
| `team` | Yes | Team member photos |
| `services` | Yes | Service images |

### 3. Configure Storage Policies

For each public bucket (gallery, team, services):

**Read Policy:**
```sql
-- Allow public read access
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'team');
```

**Admin Write Policy:**
```sql
-- Allow authenticated users to upload
CREATE POLICY "Admin can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'team' AND auth.role() = 'service_role');
```

Repeat for `gallery` and `services` buckets.

For CVs bucket (private):
```sql
-- Only service role can read
CREATE POLICY "Service role only"
ON storage.objects FOR SELECT
USING (bucket_id = 'cvs' AND auth.role() = 'service_role');
```

## Environment Configuration

### 1. Get Supabase Credentials

From Supabase Dashboard > Settings > API:
- Project URL
- Anon/Public Key
- Service Role Key (Secret!)

### 2. Update .env.local

```bash
# Copy from .env.local.supabase template
cp .env.local.supabase .env.local

# Edit .env.local with your actual keys:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Keep existing vars
ADMIN_PASSWORD=PEGSecurity2025!
JWT_SECRET=TdW78I69KUOVc0jswMBLl5frmP45MZnHfPZ83W5NI9U=
```

### 3. Verify Supabase Client

Check `/lib/supabase.ts` is configured correctly:
- [x] Imports `createClient` from `@supabase/supabase-js`
- [x] Exports `supabaseAdmin` (service role)
- [x] Exports `supabaseClient` (anon key)

## API Testing

### 1. Test Public Endpoints (No Auth)

```bash
# Team Members
curl http://localhost:3000/api/team

# Services
curl http://localhost:3000/api/services
curl http://localhost:3000/api/services/armed-response-services
```

Expected: `200 OK` with data array (may be empty)

### 2. Test Admin Authentication

First, login to get token:
```bash
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"PEGSecurity2025!"}'
```

Save the returned token.

### 3. Test Admin Endpoints (With Auth)

```bash
# Get all team members
curl http://localhost:3000/api/admin/team \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Create team member
curl -X POST http://localhost:3000/api/admin/team \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "position": "Test Position",
    "bio": "This is a test bio that needs to be at least 50 characters long to pass validation.",
    "photo_url": "https://via.placeholder.com/400",
    "photo_public_id": "test/user-123"
  }'

# Get all services
curl http://localhost:3000/api/admin/services \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Create service
curl -X POST http://localhost:3000/api/admin/services \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Service",
    "short_description": "A test service description",
    "full_description": "This is a longer description that needs to be at least 100 characters long to pass the validation requirements set in the schema.",
    "icon_name": "shield",
    "category": "Physical Security",
    "features": ["Feature 1", "Feature 2"],
    "pricing_model": "Contact Us"
  }'
```

### 4. Test File Upload

```bash
# Upload image
curl -X POST http://localhost:3000/api/admin/upload \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "file=@/path/to/image.jpg" \
  -F "bucket=team"
```

Expected response:
```json
{
  "success": true,
  "data": {
    "url": "https://...",
    "path": "...",
    "bucket": "team"
  }
}
```

## Middleware Verification

Ensure `/middleware.ts` protects admin routes:

```typescript
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'
  ]
}
```

Test unauthorized access:
```bash
# Should return 401 Unauthorized
curl http://localhost:3000/api/admin/team
```

## Production Deployment

### Vercel Environment Variables

In Vercel Dashboard > Settings > Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ADMIN_PASSWORD
JWT_SECRET
RESEND_API_KEY
RESEND_FROM_EMAIL
NEXT_PUBLIC_SITE_URL
```

### Supabase Production Settings

1. **Enable RLS on all tables** (should be done via schema)
2. **Verify Storage Policies** are active
3. **Check Database Connection Pooler** is enabled
4. **Enable SSL** for database connections

### Security Checklist

- [ ] RLS enabled on all tables
- [ ] Storage policies configured
- [ ] Service role key never exposed to client
- [ ] Admin password strong and secure
- [ ] JWT secret is random and secure
- [ ] CORS configured if needed
- [ ] Rate limiting considered
- [ ] Error messages don't leak sensitive info

## Monitoring

### Supabase Dashboard
- Monitor API requests
- Check storage usage
- Review database performance
- Check for failed queries

### Next.js
- Check console logs for errors
- Monitor API response times
- Review authentication failures

## Common Issues & Solutions

### Issue: RLS blocks admin operations
**Solution:** Ensure using service role key for admin routes, not anon key

### Issue: Storage upload fails
**Solution:** Check bucket exists and policies allow uploads

### Issue: CORS errors
**Solution:** Add CORS headers in API routes if calling from external domain

### Issue: UUID validation fails
**Solution:** Ensure IDs are valid UUID v4 format

### Issue: Slug conflicts
**Solution:** API auto-generates slugs, but check for existing services with similar titles

### Issue: File size exceeded
**Solution:** Client-side validation before upload, respect limits (5-10MB)

## Next Development Steps

1. Build admin dashboard UI for managing team/services
2. Create public pages to display team members
3. Create public pages to display services
4. Add image optimization/resizing
5. Implement drag-and-drop for display_order
6. Add search/filtering to admin views
7. Implement bulk operations
8. Add audit logging

## Support Files

- `/API_IMPLEMENTATION_SUMMARY.md` - Detailed API documentation
- `/API_USAGE_GUIDE.md` - Usage examples and code snippets
- `/supabase/schema.sql` - Complete database schema
- `/lib/supabase.ts` - Supabase client configuration

## Rollback Plan

If issues occur:

1. Revert to previous Airtable implementation
2. Keep both systems running in parallel
3. Migrate data gradually
4. Update environment variables to switch backends

---

**Status:** Ready for testing  
**Last Updated:** 2025-11-11  
**API Version:** 1.0
