# PEG Security Backend & Admin UX - Orchestration Summary

**Date:** 2025-11-11
**Orchestrator:** Master Orchestrator Agent
**Project:** Complete Backend Rebuild & Admin Dashboard

---

## What Has Been Completed

### 1. Project Analysis ✅
- Reviewed existing Next.js 14 project structure
- Identified current state: Supabase partially integrated, Airtable/Cloudinary code still present
- Analyzed design system requirements (CLAUDE.md)
- Verified tech stack: Next.js 14, TypeScript, Supabase, Tailwind CSS

### 2. Database Schema Extension ✅
**File Modified:** `/supabase/schema.sql`

**Added Tables:**
- `team_members` - Staff profiles with photos, contact info, display ordering
- `services` - Service catalogue with features, pricing, categories

**Schema Features:**
- UUID primary keys
- Timestamp triggers (auto-update `updated_at`)
- Row-Level Security (RLS) policies
- Indexes for performance
- Sample data for testing
- JSONB field for service features

**Total Tables:** 6 (contacts, jobs, applications, gallery, team_members, services)

**Security Model:**
- Public can view Active/Open records only
- Public can insert contacts and applications
- Service role (admin) has full access
- Private CV storage bucket

### 3. Comprehensive Documentation ✅

**Created Documents:**

**BACKEND_SETUP_GUIDE.md** (User-facing)
- Step-by-step setup instructions
- Database schema execution
- Storage bucket creation
- Environment variable configuration
- Troubleshooting guide
- Verification checklist

**DEVELOPMENT_SPEC.md** (Developer-facing)
- Complete technical specification for all phases
- API route patterns and examples
- TypeScript type definitions
- Validation schemas
- Component specifications
- Design system tokens
- Testing checklists
- Security audit requirements
- File structure
- Timeline estimates

---

## Architecture Overview

### Database Layer (Supabase PostgreSQL)

```
6 Tables:
├── contacts (form submissions)
├── jobs (postings)
├── applications (job applications, FK to jobs)
├── gallery (project photos)
├── team_members (staff profiles)
└── services (service catalogue)

All tables have:
- RLS enabled
- Automatic updated_at triggers
- Performance indexes
- Sample data
```

### Storage Layer (Supabase Storage)

```
4 Buckets:
├── cvs (private) - Job application CVs
├── gallery (public) - Project photos
├── team (public) - Staff photos
└── services (public) - Service imagery
```

### API Layer (Next.js 14 App Router)

```
Public Routes:
├── GET /api/team
├── GET /api/services
└── GET /api/services/[slug]

Admin Routes (Protected):
├── /api/admin/jobs (CRUD)
├── /api/admin/applications (CRUD)
├── /api/admin/gallery (CRUD)
├── /api/admin/team (CRUD)
├── /api/admin/services (CRUD)
├── /api/admin/contacts (CRUD)
└── /api/admin/upload (POST, DELETE)
```

### Admin UI Layer (React/Next.js)

```
Admin Pages:
├── /admin/login (Auth)
├── /admin/dashboard (Overview + Stats)
├── /admin/jobs (List, Create, Edit)
├── /admin/applications (List, View Details)
├── /admin/gallery (Grid, Upload)
├── /admin/team (Cards, Create, Edit)
├── /admin/services (Cards, Create, Edit)
└── /admin/contacts (List, View Details)

Reusable Components:
├── DataTable (sortable, filterable, searchable)
├── FileUpload (drag & drop)
├── FormField (validation, error display)
├── Modal (confirm/cancel dialogs)
├── Button (primary/secondary/danger variants)
└── StatsCard (dashboard metrics)
```

---

## Design System Integration

Following CLAUDE.md project rules:

**Typography:**
- Primary: Poppins (weights: 300, 400, 600, 700, 800, 900)
- Secondary: Montserrat (headers only)

**Colour Palette:**
- Gold: #D0B96D (accents, CTAs)
- Onyx: #292B2B (text, dark backgrounds)
- White: #FFFFFF (backgrounds, light text)
- Off White: #F8F9FA (cards)
- Medium Grey: #666666 (secondary text)
- Light Grey: #999999 (borders, captions)

**Icons:**
- Font Awesome Pro Light only (never draw custom icons)

**Layout Principles:**
- Grid-based layouts
- High contrast (WCAG AA minimum)
- Responsive breakpoints
- Consistent spacing (4px base unit)

**Language:**
- South African English (colour, centre, organisation)
- Currency: Rand (R)
- Tax: VAT

---

## Execution Plan

### Phase 1: Database Setup (User Action Required)
**Status:** Ready for User
**Time:** 10-15 minutes

**User Tasks:**
1. Get Supabase anon key from dashboard
2. Run `supabase/schema.sql` in Supabase SQL Editor
3. Create 4 storage buckets (cvs, gallery, team, services)
4. Update `.env.local` with anon key
5. Restart development server

**Deliverable:** Fully configured Supabase backend

---

### Phase 2: API Routes & Backend Logic
**Status:** Awaiting Phase 1 Completion
**Lead Agent:** api-backend-builder
**Supporting Agent:** security-specialist
**Time:** 4-6 hours

**Tasks:**
1. Update TypeScript types for new entities
2. Extend Supabase client helpers
3. Build 10 API routes (public + admin)
4. Implement file upload route
5. Add Zod validation schemas
6. Test all endpoints

**Deliverable:** Complete API layer with authentication

---

### Phase 3: Admin Authentication
**Status:** Awaiting Phase 2 Completion
**Lead Agent:** api-backend-builder
**Supporting Agent:** security-specialist
**Time:** 2-3 hours

**Tasks:**
1. Set up Supabase Auth integration
2. Create auth helper functions
3. Update middleware for protected routes
4. Build login page
5. Test authentication flow
6. Security review

**Deliverable:** Secure admin authentication system

---

### Phase 4: Admin UI Foundation
**Status:** Awaiting Phase 3 Completion
**Lead Agent:** component-architect
**Supporting Agent:** styling-designer
**Time:** 4-6 hours

**Tasks:**
1. Build admin layout (sidebar + header)
2. Create reusable UI components (DataTable, FileUpload, etc.)
3. Apply PEG design system
4. Ensure responsive design
5. Add Font Awesome Pro Light icons

**Deliverable:** Admin UI shell with reusable components

---

### Phase 5: Admin Feature Pages
**Status:** Awaiting Phase 4 Completion
**Lead Agent:** component-architect
**Supporting Agent:** api-backend-builder
**Time:** 8-12 hours

**Tasks:**
1. Build dashboard overview
2. Implement job management pages
3. Implement application management
4. Implement gallery management
5. Implement team management
6. Implement service management
7. Implement contact inquiry management
8. Integrate all with API routes

**Deliverable:** Complete admin dashboard with all features

---

### Phase 6: Quality Assurance
**Status:** Awaiting Phase 5 Completion
**Lead Agent:** testing-qa-specialist
**Supporting Agent:** bug-hunter-debugger
**Time:** 3-4 hours

**Tasks:**
1. API endpoint testing
2. Form validation testing
3. File upload testing
4. Authentication testing
5. Responsive testing
6. Cross-browser testing
7. Edge case testing
8. Performance testing

**Deliverable:** Tested, bug-free system

---

### Phase 7: Security Audit
**Status:** Awaiting Phase 6 Completion
**Lead Agent:** security-specialist
**Time:** 2-3 hours

**Tasks:**
1. RLS policy validation
2. Authentication security review
3. Input sanitization check
4. File upload security audit
5. Environment variable protection
6. CORS configuration review

**Deliverable:** Security audit report + recommendations

---

## Total Estimated Timeline

| Phase | Agent(s) | Hours | Dependencies |
|-------|----------|-------|--------------|
| Phase 1 | User | 0.25 | None |
| Phase 2 | api-backend-builder + security-specialist | 6 | Phase 1 |
| Phase 3 | api-backend-builder + security-specialist | 3 | Phase 2 |
| Phase 4 | component-architect + styling-designer | 6 | Phase 3 |
| Phase 5 | component-architect + api-backend-builder | 12 | Phase 4 |
| Phase 6 | testing-qa-specialist + bug-hunter-debugger | 4 | Phase 5 |
| Phase 7 | security-specialist | 3 | Phase 6 |

**Total Development Time:** 34 hours (approximately 5-7 working days)

---

## Key Features Summary

### Backend Infrastructure
- ✅ 6 database tables with RLS
- ✅ 4 storage buckets
- ✅ Row-level security policies
- ✅ Automatic timestamp triggers
- ✅ Performance indexes
- ⏳ 10 API routes (to be built)
- ⏳ File upload system (to be built)

### Admin Dashboard
- ⏳ Authentication (Supabase Auth)
- ⏳ Dashboard with statistics
- ⏳ Job management (create, edit, view applications)
- ⏳ Application review (CV download, status updates, notes)
- ⏳ Gallery management (upload, organize, reorder)
- ⏳ Team management (add/edit members with photos)
- ⏳ Service management (create/edit service catalogue)
- ⏳ Contact inquiry management (view, respond, notes)
- ⏳ File upload interface (drag & drop)
- ⏳ Data tables (sorting, filtering, search)
- ⏳ Responsive design (desktop/tablet/mobile)
- ⏳ PEG brand design system applied

### Security Features
- ✅ Row-Level Security (RLS) on all tables
- ✅ Public read for active/open content only
- ✅ Private CV storage
- ⏳ Authenticated admin routes
- ⏳ Session-based authentication
- ⏳ Input validation (Zod schemas)
- ⏳ File upload validation
- ⏳ CSRF protection

---

## Files Created/Modified

### Created Files:
1. `/supabase/schema.sql` - Extended with team_members and services tables
2. `/BACKEND_SETUP_GUIDE.md` - User-facing setup instructions
3. `/DEVELOPMENT_SPEC.md` - Technical specification for developers
4. `/ORCHESTRATION_SUMMARY.md` - This file

### Files to be Modified (Phase 2+):
1. `/lib/types.ts` - Add TeamMember and Service types
2. `/lib/supabase.ts` - Add helper functions for new entities
3. `/lib/validation.ts` - Add Zod schemas for new entities
4. `/lib/auth-helpers.ts` - New file for auth functions
5. `/middleware.ts` - Update for admin route protection

### Files to be Created (Phase 2-5):
- API routes (10 files)
- Admin pages (15+ files)
- Admin components (7+ files)

---

## Next Steps for User

**Immediate Action Required:**

1. Open [BACKEND_SETUP_GUIDE.md](/Users/mac/Downloads/PEG_Security_Profile_Design_Project/peg-security-nextjs/BACKEND_SETUP_GUIDE.md)

2. Complete Steps 1-3:
   - Get Supabase anon key
   - Run schema.sql
   - Create storage buckets
   - Update .env.local

3. Verify setup with the checklist in the guide

4. Once complete, respond with:
   **"Backend setup complete, proceed with API routes"**

---

## Agent Handoff Protocol

When user confirms Phase 1 completion:

1. **api-backend-builder** takes lead
   - Reads DEVELOPMENT_SPEC.md Phase 2 section
   - Implements all API routes following patterns
   - security-specialist reviews auth implementation

2. **component-architect** takes lead (after Phase 3)
   - Reads DEVELOPMENT_SPEC.md Phase 4-5 sections
   - Builds UI components and pages
   - styling-designer ensures design system compliance

3. **testing-qa-specialist** takes lead (after Phase 5)
   - Executes testing checklist from DEVELOPMENT_SPEC.md
   - bug-hunter-debugger assists with edge cases

4. **security-specialist** performs final audit (after Phase 6)
   - Reviews security checklist from DEVELOPMENT_SPEC.md
   - Provides security recommendations

---

## Success Criteria

Project is complete when:

- [ ] All 6 database tables operational with RLS
- [ ] All 4 storage buckets configured
- [ ] All 10 API routes implemented and tested
- [ ] Admin authentication working (login, logout, session)
- [ ] Admin dashboard showing statistics
- [ ] All 6 entity management pages operational
- [ ] File upload working for all buckets
- [ ] Forms have validation and error handling
- [ ] Design system applied consistently
- [ ] Responsive on desktop, tablet, mobile
- [ ] All tests passing
- [ ] Security audit complete
- [ ] Documentation updated

---

## Contact & Support

**Project Location:**
`/Users/mac/Downloads/PEG_Security_Profile_Design_Project/peg-security-nextjs`

**Supabase Project:**
- Project Ref: `ujiaeiqslzwmpvkyixdp`
- Region: `eu-west-1`
- URL: `https://ujiaeiqslzwmpvkyixdp.supabase.co`

**Key Documentation:**
- User Guide: `BACKEND_SETUP_GUIDE.md`
- Developer Spec: `DEVELOPMENT_SPEC.md`
- Design Rules: `../CLAUDE.md`
- Migration Guide: `SUPABASE_MIGRATION_GUIDE.md` (older, superseded)

---

**Orchestration Status:** ✅ Planning Complete, Awaiting User Action
**Next Phase:** Phase 1 - User Database Setup
**Estimated Total Project Duration:** 5-7 working days
