# PEG Security Backend & Admin UX - Technical Specification

**Project:** PEG Security Website Complete Backend Rebuild
**Tech Stack:** Next.js 14, TypeScript, Supabase, Tailwind CSS
**Design System:** See CLAUDE.md (Poppins, #D0B96D gold, #292B2B black, high contrast)
**Language:** South African English (colour, centre, organisation)

---

## PHASE 2: API Routes & Backend Logic

**Lead Agent:** api-backend-builder
**Supporting Agent:** security-specialist
**Estimated Time:** 4-6 hours

### 2.1 Update TypeScript Types

**File:** `/lib/types.ts`

Add types for new entities:

```typescript
// Team Member Types
export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  photo_url: string;
  photo_public_id: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  display_order: number;
  status: 'Active' | 'Inactive';
  created_at: string;
  updated_at: string;
}

// Service Types
export interface Service {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  icon_name: string;
  category: 'Physical Security' | 'Electronic Security' | 'Specialised Services' | 'Consulting' | 'Other';
  features: string[];
  pricing_model: 'Fixed Price' | 'Hourly Rate' | 'Monthly Retainer' | 'Custom Quote' | 'Contact Us';
  pricing_details?: string;
  image_url?: string;
  image_public_id?: string;
  display_order: number;
  status: 'Active' | 'Draft' | 'Archived';
  created_at: string;
  updated_at: string;
}
```

### 2.2 Update Supabase Client

**File:** `/lib/supabase.ts`

Add helper functions for new entities:

```typescript
// Team Members
export async function getActiveTeamMembers() {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('status', 'Active')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data as TeamMember[];
}

// Services
export async function getActiveServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('status', 'Active')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data as Service[];
}

// Storage helpers
export async function uploadToStorage(
  bucket: string,
  path: string,
  file: File
) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;
  return data;
}

export async function deleteFromStorage(
  bucket: string,
  path: string
) {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) throw error;
}

export function getPublicUrl(bucket: string, path: string) {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
}
```

### 2.3 API Routes to Build

#### Public Routes (Frontend-facing)

**File:** `/app/api/team/route.ts`
```typescript
// GET /api/team - List active team members
export async function GET(request: Request) {
  const members = await getActiveTeamMembers();
  return NextResponse.json(members);
}
```

**File:** `/app/api/services/route.ts`
```typescript
// GET /api/services - List active services
export async function GET(request: Request) {
  const services = await getActiveServices();
  return NextResponse.json(services);
}
```

**File:** `/app/api/services/[slug]/route.ts`
```typescript
// GET /api/services/[slug] - Get service by slug
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'Active')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}
```

#### Admin Routes (Protected)

**Folder Structure:**
```
/app/api/admin/
  ├── jobs/
  │   ├── route.ts (GET, POST)
  │   └── [id]/route.ts (GET, PATCH, DELETE)
  ├── applications/
  │   ├── route.ts (GET)
  │   └── [id]/route.ts (GET, PATCH, DELETE)
  ├── gallery/
  │   ├── route.ts (GET, POST)
  │   └── [id]/route.ts (GET, PATCH, DELETE)
  ├── team/
  │   ├── route.ts (GET, POST)
  │   └── [id]/route.ts (GET, PATCH, DELETE)
  ├── services/
  │   ├── route.ts (GET, POST)
  │   └── [id]/route.ts (GET, PATCH, DELETE)
  ├── contacts/
  │   ├── route.ts (GET)
  │   └── [id]/route.ts (GET, PATCH, DELETE)
  └── upload/
      └── route.ts (POST, DELETE)
```

**Authentication Middleware:** All admin routes should check for authenticated session

**Example Admin Route Pattern:**

```typescript
// /app/api/admin/team/route.ts
import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = createClient();

    // Verify admin authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all team members (admin can see all statuses)
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();

    // Verify admin authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate input (use Zod schema)
    // ... validation logic ...

    const { data, error } = await supabase
      .from('team_members')
      .insert(body)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### 2.4 File Upload Route

**File:** `/app/api/admin/upload/route.ts`

```typescript
import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = createClient();

    // Verify admin authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucket = formData.get('bucket') as string;
    const folder = formData.get('folder') as string || '';

    if (!file || !bucket) {
      return NextResponse.json({ error: 'Missing file or bucket' }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const ext = file.name.split('.').pop();
    const filename = `${folder}${timestamp}.${ext}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filename);

    return NextResponse.json({
      url: publicUrl,
      path: filename,
      bucket: bucket
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createClient();

    // Verify admin authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { bucket, path } = await request.json();

    if (!bucket || !path) {
      return NextResponse.json({ error: 'Missing bucket or path' }, { status: 400 });
    }

    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### 2.5 Validation Schemas

**File:** `/lib/validation.ts`

Add Zod schemas for new entities:

```typescript
import { z } from 'zod';

export const TeamMemberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  position: z.string().min(2, 'Position is required'),
  bio: z.string().min(20, 'Bio must be at least 20 characters'),
  photo_url: z.string().url('Invalid photo URL'),
  photo_public_id: z.string(),
  email: z.string().email('Invalid email').optional(),
  phone: z.string().optional(),
  linkedin_url: z.string().url('Invalid LinkedIn URL').optional(),
  display_order: z.number().int().min(0),
  status: z.enum(['Active', 'Inactive'])
});

export const ServiceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  short_description: z.string().min(20, 'Short description must be at least 20 characters'),
  full_description: z.string().min(50, 'Full description must be at least 50 characters'),
  icon_name: z.string(),
  category: z.enum(['Physical Security', 'Electronic Security', 'Specialised Services', 'Consulting', 'Other']),
  features: z.array(z.string()).min(1, 'At least one feature is required'),
  pricing_model: z.enum(['Fixed Price', 'Hourly Rate', 'Monthly Retainer', 'Custom Quote', 'Contact Us']),
  pricing_details: z.string().optional(),
  image_url: z.string().url('Invalid image URL').optional(),
  image_public_id: z.string().optional(),
  display_order: z.number().int().min(0),
  status: z.enum(['Active', 'Draft', 'Archived'])
});
```

---

## PHASE 3: Admin Authentication

**Lead Agent:** api-backend-builder
**Supporting Agent:** security-specialist
**Estimated Time:** 2-3 hours

### 3.1 Supabase Auth Setup

**Requirements:**
- Email/password authentication
- Session-based auth (not JWT in localStorage)
- Protected admin routes
- Auto-redirect if not authenticated

### 3.2 Auth Helper Functions

**File:** `/lib/auth-helpers.ts`

```typescript
import { createClient } from '@/lib/supabase';

export async function signIn(email: string, password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const supabase = createClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

export async function getCurrentUser() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}
```

### 3.3 Middleware for Protected Routes

**File:** `/middleware.ts` (update existing)

```typescript
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Check if route is admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            response.cookies.set(name, value, options);
          },
          remove(name: string, options: any) {
            response.cookies.set(name, '', options);
          },
        },
      }
    );

    const { data: { session } } = await supabase.auth.getSession();

    // Redirect to login if no session and not already on login page
    if (!session && request.nextUrl.pathname !== '/admin/login') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Redirect to dashboard if has session and on login page
    if (session && request.nextUrl.pathname === '/admin/login') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
```

### 3.4 Login Page

**File:** `/app/admin/login/page.tsx`

Requirements:
- Email/password form
- Error handling
- Loading states
- Redirect after successful login
- Follow PEG design system

---

## PHASE 4: Admin UI Foundation

**Lead Agent:** component-architect
**Supporting Agent:** styling-designer
**Estimated Time:** 4-6 hours

### 4.1 Admin Layout

**File:** `/app/admin/layout.tsx`

Requirements:
- Sidebar navigation
- Top header with user menu
- Responsive (collapse sidebar on mobile)
- Poppins typography
- Brand colours: #D0B96D gold, #292B2B black, #FFFFFF white

**Navigation Structure:**
```
Dashboard (home icon)
---
Jobs (briefcase icon)
Applications (file-text icon)
---
Gallery (image icon)
Team (users icon)
Services (package icon)
---
Contacts (mail icon)
---
Settings (settings icon)
Logout (log-out icon)
```

### 4.2 Common UI Components

**Component:** `/components/admin/DataTable.tsx`

Features:
- Generic reusable table
- Column sorting
- Search/filter
- Pagination
- Row actions (edit, delete)
- Responsive (cards on mobile)

**Component:** `/components/admin/FileUpload.tsx`

Features:
- Drag & drop zone
- File type validation
- File size validation
- Preview before upload
- Progress indicator
- Error handling

**Component:** `/components/admin/FormField.tsx`

Features:
- Label + input wrapper
- Error message display
- Helper text
- Different input types (text, textarea, select, file)
- Validation state styling

**Component:** `/components/admin/Modal.tsx`

Features:
- Backdrop overlay
- Close on ESC
- Confirm/cancel buttons
- Customizable content
- Accessible (focus trap)

**Component:** `/components/admin/Button.tsx`

Variants:
- Primary (gold background)
- Secondary (outline)
- Danger (red for delete)
- Sizes: sm, md, lg
- Loading state

**Component:** `/components/admin/StatsCard.tsx`

Features:
- Icon
- Label
- Value (large number)
- Change indicator (optional)
- Link to detail page

### 4.3 Design System Tokens

**Colours:**
```css
--gold: #D0B96D;
--onyx: #292B2B;
--white: #FFFFFF;
--off-white: #F8F9FA;
--grey-medium: #666666;
--grey-light: #999999;
--success: #10B981;
--warning: #F59E0B;
--danger: #EF4444;
```

**Typography:**
```css
font-family: 'Poppins', sans-serif;
font-weights: 300, 400, 600, 700, 800, 900
```

**Spacing:**
```css
base: 4px
xs: 8px (2 × base)
sm: 12px (3 × base)
md: 16px (4 × base)
lg: 24px (6 × base)
xl: 32px (8 × base)
2xl: 48px (12 × base)
```

---

## PHASE 5: Admin Feature Pages

**Lead Agent:** component-architect
**Supporting Agent:** api-backend-builder
**Estimated Time:** 8-12 hours

### 5.1 Dashboard Overview

**File:** `/app/admin/dashboard/page.tsx`

Features:
- 4 stat cards (Total Jobs, Applications, Inquiries, Gallery Items)
- Recent activity feed (last 10 items across all entities)
- Quick actions (Create Job, Upload Image, View Applications)

### 5.2 Job Management

**Files:**
- `/app/admin/jobs/page.tsx` - List jobs
- `/app/admin/jobs/new/page.tsx` - Create job
- `/app/admin/jobs/[id]/edit/page.tsx` - Edit job

Features:
- DataTable with columns: Title, Category, Location, Status, Application Count, Actions
- Filter by status (All, Draft, Open, Closed)
- Search by title/location
- Status badge colours (Draft: grey, Open: green, Closed: red)
- Delete confirmation modal

### 5.3 Application Management

**Files:**
- `/app/admin/applications/page.tsx` - List applications
- `/app/admin/applications/[id]/page.tsx` - View application details

Features:
- DataTable with columns: Applicant Name, Job Title, Status, PSIRA, Submitted, Actions
- Filter by status (All, New, Reviewing, Interviewed, Hired, Rejected)
- Search by applicant name/email
- View application modal with CV download
- Status change dropdown
- Notes textarea
- Email applicant button (opens mailto:)

### 5.4 Gallery Management

**Files:**
- `/app/admin/gallery/page.tsx` - List gallery
- `/app/admin/gallery/new/page.tsx` - Upload images

Features:
- Grid view of images (masonry layout)
- Filter by category
- Filter by status (All, Active, Hidden)
- Drag to reorder (update display_order)
- Bulk actions (Hide, Delete)
- Upload modal with drag & drop
- Image preview before upload

### 5.5 Team Management

**Files:**
- `/app/admin/team/page.tsx` - List team
- `/app/admin/team/new/page.tsx` - Add member
- `/app/admin/team/[id]/edit/page.tsx` - Edit member

Features:
- Card grid view (photo, name, position)
- Filter by status (All, Active, Inactive)
- Drag to reorder
- Form fields: Name, Position, Bio, Photo Upload, Email, Phone, LinkedIn
- Status toggle

### 5.6 Service Management

**Files:**
- `/app/admin/services/page.tsx` - List services
- `/app/admin/services/new/page.tsx` - Create service
- `/app/admin/services/[id]/edit/page.tsx` - Edit service

Features:
- Card grid view (icon, title, category, pricing)
- Filter by category
- Filter by status (All, Active, Draft, Archived)
- Drag to reorder
- Form fields: Title, Slug (auto-generate from title), Short/Full Description, Icon Picker, Category, Features (dynamic list), Pricing Model, Pricing Details, Image Upload
- Status selector

### 5.7 Contact Inquiries

**Files:**
- `/app/admin/contacts/page.tsx` - List inquiries
- `/app/admin/contacts/[id]/page.tsx` - View inquiry details

Features:
- DataTable with columns: Name, Email, Service Type, Status, Submitted, Actions
- Filter by status (All, New, Read, Responded)
- Filter by service type
- Search by name/email
- View inquiry modal with full message
- Status change dropdown
- Notes textarea
- Reply button (opens mailto:)

---

## PHASE 6: Quality Assurance

**Lead Agent:** testing-qa-specialist
**Supporting Agent:** bug-hunter-debugger
**Estimated Time:** 3-4 hours

### 6.1 Testing Checklist

**API Endpoint Testing:**
- [ ] All GET routes return correct data
- [ ] POST routes create records successfully
- [ ] PATCH routes update records correctly
- [ ] DELETE routes remove records and handle cascades
- [ ] Authentication checks work on all admin routes
- [ ] Error responses are consistent (JSON format)

**Form Validation Testing:**
- [ ] Required fields show error when empty
- [ ] Email validation works
- [ ] Phone validation works (South African format)
- [ ] URL validation works
- [ ] File type validation works
- [ ] File size validation works
- [ ] Slug generation works (lowercase, hyphens)

**File Upload Testing:**
- [ ] Drag & drop works
- [ ] Click to upload works
- [ ] File size limits enforced (5MB for CVs, 2MB for images)
- [ ] Only allowed file types accepted
- [ ] Upload progress shown
- [ ] Error handling works (network fail, invalid file, etc.)
- [ ] Files appear in Supabase Storage
- [ ] Public URLs generated correctly

**Authentication Testing:**
- [ ] Login with correct credentials works
- [ ] Login with incorrect credentials shows error
- [ ] Session persists on page refresh
- [ ] Logout works
- [ ] Protected routes redirect to login when not authenticated
- [ ] Login page redirects to dashboard when authenticated

**Responsive Testing:**
- [ ] Desktop layout looks correct (1920px, 1440px, 1024px)
- [ ] Tablet layout works (768px)
- [ ] Mobile layout works (375px, 414px)
- [ ] Sidebar collapses on mobile
- [ ] DataTables become cards on mobile
- [ ] Forms are usable on mobile

### 6.2 Bug Hunting

**Areas to Test:**
- Edge cases (empty states, long text, special characters)
- Race conditions (rapid clicking, simultaneous edits)
- Network failures (offline, slow connection)
- Browser compatibility (Chrome, Firefox, Safari, Edge)
- Performance (large datasets, many images)

---

## PHASE 7: Security Audit

**Lead Agent:** security-specialist
**Estimated Time:** 2-3 hours

### 7.1 Security Checklist

**RLS Policy Validation:**
- [ ] Public users cannot access admin data
- [ ] Public users can only see Active/Open records
- [ ] Service role has full access
- [ ] Policies match schema design

**Authentication Security:**
- [ ] Sessions expire correctly
- [ ] Session tokens are httpOnly
- [ ] CSRF protection enabled
- [ ] Rate limiting on login endpoint
- [ ] Strong password requirements

**Input Sanitization:**
- [ ] All user inputs validated with Zod
- [ ] SQL injection prevented (Supabase handles this)
- [ ] XSS prevention (React handles this)
- [ ] File upload validation (type, size, content)

**File Upload Security:**
- [ ] File type whitelist enforced
- [ ] File size limits enforced
- [ ] Uploaded files cannot execute code
- [ ] Private buckets truly private (CVs not accessible without auth)
- [ ] Public bucket files have correct MIME types

**Environment Variables:**
- [ ] Service role key never exposed to client
- [ ] Anon key only used where appropriate
- [ ] .env.local not committed to git
- [ ] Production env vars set in Vercel

**CORS Configuration:**
- [ ] Only allowed origins can access API
- [ ] Credentials handled correctly

---

## Delivery Checklist

Before marking project complete:

- [ ] All 6 database tables created with RLS policies
- [ ] All 4 storage buckets created with correct policies
- [ ] All API routes implemented and tested
- [ ] Admin authentication working
- [ ] Admin dashboard with stats
- [ ] Job management complete
- [ ] Application management complete
- [ ] Gallery management complete
- [ ] Team management complete
- [ ] Service management complete
- [ ] Contact inquiry management complete
- [ ] File upload working (all buckets)
- [ ] Design system applied (Poppins, brand colours, high contrast)
- [ ] South African English used throughout
- [ ] Responsive on all screen sizes
- [ ] All tests passing
- [ ] Security audit complete
- [ ] Documentation updated

---

## Estimated Timeline

| Phase | Hours | Cumulative |
|-------|-------|------------|
| Phase 1: Database Setup (User) | 0.5 | 0.5 |
| Phase 2: API Routes | 6 | 6.5 |
| Phase 3: Admin Auth | 3 | 9.5 |
| Phase 4: Admin UI Foundation | 6 | 15.5 |
| Phase 5: Feature Pages | 12 | 27.5 |
| Phase 6: QA & Testing | 4 | 31.5 |
| Phase 7: Security Audit | 3 | 34.5 |

**Total:** 34.5 hours (approximately 5-7 working days)

---

## Agent Coordination Notes

**api-backend-builder:**
- Focus on clean, maintainable code
- Follow existing patterns in codebase
- Use TypeScript strictly (no `any` types)
- Add JSDoc comments for complex functions

**component-architect:**
- Create reusable components
- Follow atomic design principles
- Ensure accessibility (ARIA labels, keyboard navigation)
- Keep components under 200 lines

**styling-designer:**
- Use Tailwind utility classes
- Follow PEG design system strictly
- Ensure high contrast ratios (WCAG AA)
- Test on different screen sizes

**security-specialist:**
- Review all authentication flows
- Validate RLS policies
- Check for common vulnerabilities (OWASP Top 10)
- Provide security recommendations

**testing-qa-specialist:**
- Write test cases before testing
- Document all bugs found
- Verify fixes
- Create regression test suite

**bug-hunter-debugger:**
- Test edge cases aggressively
- Try to break the system
- Check browser console for errors
- Monitor network tab for failed requests

---

## File Structure Overview

```
peg-security-nextjs/
├── app/
│   ├── admin/
│   │   ├── layout.tsx (Admin shell)
│   │   ├── login/page.tsx (Login form)
│   │   ├── dashboard/page.tsx (Overview)
│   │   ├── jobs/
│   │   │   ├── page.tsx (List)
│   │   │   ├── new/page.tsx (Create)
│   │   │   └── [id]/edit/page.tsx (Edit)
│   │   ├── applications/
│   │   │   ├── page.tsx (List)
│   │   │   └── [id]/page.tsx (Details)
│   │   ├── gallery/
│   │   │   ├── page.tsx (List)
│   │   │   └── new/page.tsx (Upload)
│   │   ├── team/
│   │   │   ├── page.tsx (List)
│   │   │   ├── new/page.tsx (Create)
│   │   │   └── [id]/edit/page.tsx (Edit)
│   │   ├── services/
│   │   │   ├── page.tsx (List)
│   │   │   ├── new/page.tsx (Create)
│   │   │   └── [id]/edit/page.tsx (Edit)
│   │   └── contacts/
│   │       ├── page.tsx (List)
│   │       └── [id]/page.tsx (Details)
│   └── api/
│       ├── team/route.ts (Public)
│       ├── services/
│       │   ├── route.ts (Public)
│       │   └── [slug]/route.ts (Public)
│       └── admin/ (All protected)
│           ├── jobs/
│           ├── applications/
│           ├── gallery/
│           ├── team/
│           ├── services/
│           ├── contacts/
│           └── upload/
├── components/admin/
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   ├── DataTable.tsx
│   ├── FileUpload.tsx
│   ├── FormField.tsx
│   ├── Modal.tsx
│   ├── Button.tsx
│   └── StatsCard.tsx
├── lib/
│   ├── supabase.ts (Updated)
│   ├── types.ts (Extended)
│   ├── validation.ts (Extended)
│   └── auth-helpers.ts (New)
└── supabase/
    └── schema.sql (Complete - 6 tables)
```

---

**Document Version:** 1.0
**Last Updated:** 2025-11-11
**Ready for Phase 2 Execution**
