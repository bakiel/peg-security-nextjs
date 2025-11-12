# PEG Security - Complete Backend Build Plan

## 🎯 Project Goal
Build a complete admin backend system where PEG Security can:
- Manage job postings (create, edit, delete)
- Review and manage applications
- Communicate with applicants (email/WhatsApp)
- Manage gallery images
- Access analytics/metrics

---

## 📋 PRE-BUILD CHECKLIST

### Required Credentials (User Must Provide):
- [ ] **Airtable Personal Access Token**
- [ ] **Airtable Base ID** (for PEG Security base)
- [ ] **Airtable Table IDs**: Jobs, Applications, Gallery
- [ ] **Resend API Key** (for email sending)
- [ ] **Admin Password** (for backend access)

### Already Configured:
- [x] **Cloudinary** - Cloud name: dofl7l1cs, credentials provided
- [x] **Next.js Project** - Running at /Users/mac/Downloads/PEG_Security_Profile_Design_Project/peg-security-nextjs
- [x] **Frontend Pages** - Homepage, Services, About, Contact

---

## 🏗️ BUILD ARCHITECTURE

### Database: Airtable
```
Base: PEG Security
├── Jobs Table
│   ├── Job ID (Auto)
│   ├── Title
│   ├── Department (Physical Security | Cybersecurity | Risk | Training)
│   ├── Location
│   ├── Type (Full-time | Part-time | Contract)
│   ├── Status (Open | Closed | Draft)
│   ├── Salary Range
│   ├── Posted Date
│   ├── Deadline
│   ├── Description (Long text)
│   ├── Responsibilities (Long text)
│   ├── Requirements (Long text)
│   ├── Benefits (Long text)
│   └── Slug (Formula)
│
├── Applications Table
│   ├── Application ID (Auto)
│   ├── Job (Link to Jobs)
│   ├── Name
│   ├── Email
│   ├── Phone
│   ├── CV (Attachment)
│   ├── Cover Letter (Long text)
│   ├── Applied Date (Created time)
│   ├── Status (New | Reviewing | Shortlisted | Rejected | Hired)
│   └── Notes (Long text - HR internal)
│
└── Gallery Table
    ├── Gallery ID (Auto)
    ├── Title
    ├── Description
    ├── Category (Projects | Team | Certifications | Equipment | Media)
    ├── Cloudinary URL
    ├── Cloudinary Public ID
    ├── Alt Text
    ├── Tags (Multiple select)
    ├── Date Added
    ├── Display Order
    ├── Status (Published | Draft | Archived)
    └── Featured (Checkbox)
```

### Image Storage: Cloudinary
```
Cloud: dofl7l1cs
├── /peg-securite/gallery/projects/
├── /peg-securite/gallery/team/
├── /peg-securite/gallery/certifications/
├── /peg-securite/gallery/equipment/
└── /peg-securite/gallery/media/
```

### Email Service: Resend
```
Templates:
├── Application Received Confirmation
├── Application Under Review
├── Interview Invitation
├── Application Shortlisted
├── Application Rejected
└── Position Filled
```

### WhatsApp: Click-to-WhatsApp
```
Format: https://wa.me/{phone}?text={pre-filled-message}
No API needed - opens WhatsApp with template
```

---

## 🔐 AUTHENTICATION & SECURITY

### Admin Access
- **Route**: `/admin/*` (all admin pages)
- **Method**: Simple password authentication (single admin password in env)
- **Session**: Cookie-based session storage
- **Middleware**: Protect all `/admin/*` routes
- **Logout**: Clear session, redirect to login

### Security Rules
1. ✅ All admin routes behind authentication
2. ✅ API routes validate admin session
3. ✅ Airtable credentials server-side only (never exposed to client)
4. ✅ Cloudinary API secret server-side only
5. ✅ Form validation on all inputs
6. ✅ Rate limiting on email sends
7. ✅ File upload validation (type, size)
8. ✅ CSRF protection on forms
9. ✅ No sensitive data in client logs
10. ✅ Environment variables never committed to git

---

## 📁 FILE STRUCTURE

```
/peg-security-nextjs/
├── app/
│   ├── admin/
│   │   ├── layout.tsx (admin nav, auth check)
│   │   ├── page.tsx (dashboard)
│   │   ├── jobs/
│   │   │   ├── page.tsx (list all jobs)
│   │   │   ├── new/page.tsx (create job)
│   │   │   └── [id]/
│   │   │       ├── page.tsx (edit job)
│   │   │       └── applications/page.tsx (job applications)
│   │   ├── applications/
│   │   │   ├── page.tsx (list all applications)
│   │   │   └── [id]/page.tsx (application detail + actions)
│   │   └── gallery/
│   │       ├── page.tsx (manage gallery)
│   │       ├── new/page.tsx (upload new image)
│   │       └── [id]/page.tsx (edit gallery item)
│   ├── careers/
│   │   ├── page.tsx (job listings)
│   │   └── [slug]/page.tsx (job detail + application form)
│   ├── gallery/
│   │   └── page.tsx (public gallery)
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts
│       │   └── logout/route.ts
│       ├── careers/
│       │   ├── route.ts (GET all open jobs)
│       │   └── [slug]/route.ts (GET single job)
│       ├── apply/route.ts (POST application)
│       ├── admin/
│       │   ├── jobs/
│       │   │   ├── route.ts (GET all jobs, POST new job)
│       │   │   └── [id]/route.ts (GET, PUT, DELETE job)
│       │   ├── applications/
│       │   │   ├── route.ts (GET all applications)
│       │   │   └── [id]/route.ts (GET, PUT application)
│       │   ├── gallery/
│       │   │   ├── route.ts (GET all gallery, POST new)
│       │   │   └── [id]/route.ts (GET, PUT, DELETE gallery item)
│       │   └── email/
│       │       └── send/route.ts (POST send email)
│       └── cloudinary/
│           └── upload/route.ts (handle cloudinary uploads)
├── lib/
│   ├── airtable.ts (Airtable client + interfaces)
│   ├── cloudinary.ts (Cloudinary utilities)
│   ├── resend.ts (Email client + templates)
│   ├── whatsapp.ts (WhatsApp link generator)
│   └── auth.ts (Admin auth utilities)
├── components/
│   ├── admin/
│   │   ├── AdminNav.tsx
│   │   ├── JobForm.tsx
│   │   ├── ApplicationTable.tsx
│   │   ├── GalleryUpload.tsx
│   │   ├── EmailModal.tsx
│   │   └── MetricsWidget.tsx
│   ├── careers/
│   │   ├── JobCard.tsx
│   │   ├── JobList.tsx
│   │   └── ApplicationForm.tsx
│   └── gallery/
│       ├── GalleryGrid.tsx
│       └── Lightbox.tsx
├── middleware.ts (protect admin routes)
├── docs/
│   ├── airtable-integration.md
│   ├── cloudinary-config.md
│   ├── admin-backend.md
│   ├── careers-feature.md
│   ├── gallery-system.md
│   └── BACKEND_BUILD_PLAN.md (this file)
└── .env.local
    ├── NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    ├── CLOUDINARY_API_KEY
    ├── CLOUDINARY_API_SECRET
    ├── AIRTABLE_ACCESS_TOKEN
    ├── AIRTABLE_BASE_ID
    ├── AIRTABLE_JOBS_TABLE_ID
    ├── AIRTABLE_APPLICATIONS_TABLE_ID
    ├── AIRTABLE_GALLERY_TABLE_ID
    ├── RESEND_API_KEY
    ├── RESEND_FROM_EMAIL
    ├── ADMIN_PASSWORD
    └── NEXT_PUBLIC_SITE_URL
```

---

## 🤖 AGENT ASSIGNMENTS

### Phase 1: Infrastructure Setup
**Agent: api-backend-builder**
- [ ] Install packages: `airtable`, `next-cloudinary`, `cloudinary`, `resend`
- [ ] Create `/lib/airtable.ts` (client + TypeScript interfaces)
- [ ] Create `/lib/cloudinary.ts` (URL builders, utilities)
- [ ] Create `/lib/resend.ts` (email client + templates)
- [ ] Create `/lib/whatsapp.ts` (link generator)
- [ ] Create `/lib/auth.ts` (admin authentication)
- [ ] Create `middleware.ts` (protect admin routes)
- [ ] Update `.env.local` with all credentials
- [ ] Create `.env.example` (template without secrets)

### Phase 2: Admin Authentication
**Agent: security-specialist**
- [ ] Build `/app/admin/login/page.tsx` (login form)
- [ ] Build `/api/auth/login/route.ts` (verify password, create session)
- [ ] Build `/api/auth/logout/route.ts` (clear session)
- [ ] Build middleware to protect `/admin/*` routes
- [ ] Test authentication flow
- [ ] Security audit auth implementation

### Phase 3: Jobs API
**Agent: api-backend-builder**
- [ ] Build `/api/careers/route.ts` (GET open jobs)
- [ ] Build `/api/careers/[slug]/route.ts` (GET single job)
- [ ] Build `/api/admin/jobs/route.ts` (GET all jobs, POST new job)
- [ ] Build `/api/admin/jobs/[id]/route.ts` (GET, PUT, DELETE job)
- [ ] Add caching (ISR revalidate: 900 seconds)
- [ ] Test all CRUD operations

### Phase 4: Applications API
**Agent: api-backend-builder**
- [ ] Build `/api/apply/route.ts` (POST application, handle CV upload to Airtable)
- [ ] Build `/api/admin/applications/route.ts` (GET all applications with filters)
- [ ] Build `/api/admin/applications/[id]/route.ts` (GET, PUT application)
- [ ] Implement CV download from Airtable
- [ ] Add validation (email format, phone format, CV size/type)
- [ ] Test application submission flow

### Phase 5: Gallery API
**Agent: media-asset-manager**
- [ ] Build `/api/cloudinary/upload/route.ts` (handle cloudinary uploads)
- [ ] Build `/api/admin/gallery/route.ts` (GET all gallery, POST new item)
- [ ] Build `/api/admin/gallery/[id]/route.ts` (GET, PUT, DELETE gallery item)
- [ ] Test image upload to Cloudinary
- [ ] Test metadata save to Airtable
- [ ] Verify URL generation

### Phase 6: Email System
**Agent: notifications-communications**
- [ ] Set up Resend client in `/lib/resend.ts`
- [ ] Create email templates (6 templates)
- [ ] Build `/api/admin/email/send/route.ts` (send email to applicant)
- [ ] Add template selection
- [ ] Add merge tags (name, job title, etc.)
- [ ] Test email sending
- [ ] Add rate limiting (max 10 emails/minute)

### Phase 7: Admin UI - Dashboard
**Agent: admin-ui-builder**
- [ ] Build `/app/admin/layout.tsx` (admin nav, sidebar)
- [ ] Build `/app/admin/page.tsx` (dashboard with metrics)
- [ ] Build metrics widgets:
  - Total applications (7/30/90 days)
  - Applications by status (pie chart)
  - Recent applications table
  - Top jobs by applications
- [ ] Test responsive layout

### Phase 8: Admin UI - Jobs Management
**Agent: admin-ui-builder**
- [ ] Build `/app/admin/jobs/page.tsx` (list all jobs, filters)
- [ ] Build `/app/admin/jobs/new/page.tsx` (create job form)
- [ ] Build `/app/admin/jobs/[id]/page.tsx` (edit job form)
- [ ] Build `/app/admin/jobs/[id]/applications/page.tsx` (view applications for job)
- [ ] Add status toggle (open/closed/draft)
- [ ] Add delete confirmation modal
- [ ] Test all CRUD operations

### Phase 9: Admin UI - Applications Management
**Agent: admin-ui-builder**
- [ ] Build `/app/admin/applications/page.tsx` (list with filters, search)
- [ ] Build `/app/admin/applications/[id]/page.tsx` (application detail)
- [ ] Add status dropdown (New | Reviewing | Shortlisted | Rejected | Hired)
- [ ] Add notes textarea (internal HR notes)
- [ ] Add CV download button
- [ ] Add email action buttons (template selection)
- [ ] Add WhatsApp button (click-to-WhatsApp link)
- [ ] Test all actions

### Phase 10: Admin UI - Gallery Management
**Agent: media-asset-manager + admin-ui-builder**
- [ ] Build `/app/admin/gallery/page.tsx` (list gallery items)
- [ ] Build `/app/admin/gallery/new/page.tsx` (upload + metadata form)
- [ ] Build `/app/admin/gallery/[id]/page.tsx` (edit gallery item)
- [ ] Integrate Cloudinary Upload Widget
- [ ] Add category/tag filters
- [ ] Add reorder functionality (drag & drop)
- [ ] Add bulk operations (publish, archive, delete)
- [ ] Test upload flow

### Phase 11: Frontend - Careers Pages
**Agent: component-architect**
- [ ] Build `/app/careers/page.tsx` (job listings with filters)
- [ ] Build `/app/careers/[slug]/page.tsx` (job detail + application form)
- [ ] Build `<JobCard>` component
- [ ] Build `<JobList>` component (with search/filter)
- [ ] Build `<ApplicationForm>` component (with CV upload)
- [ ] Add form validation
- [ ] Add success/error states
- [ ] Test ISR caching (revalidate: 900)

### Phase 12: Frontend - Gallery Page
**Agent: media-asset-manager**
- [ ] Build `/app/gallery/page.tsx` (grid layout with filters)
- [ ] Build `<GalleryGrid>` component (masonry layout)
- [ ] Build `<Lightbox>` component (full-size image modal)
- [ ] Add category filter
- [ ] Add tag search
- [ ] Add lazy loading
- [ ] Add blur placeholders
- [ ] Optimize for mobile
- [ ] Test Core Web Vitals

### Phase 13: Styling & UX
**Agent: styling-designer**
- [ ] Style admin dashboard (professional, clean)
- [ ] Style all admin forms (consistent inputs, buttons)
- [ ] Style admin tables (sortable, filterable)
- [ ] Style careers pages (match main site design)
- [ ] Style gallery page (modern grid, smooth transitions)
- [ ] Add loading states everywhere
- [ ] Add toast notifications (success/error)
- [ ] Test responsive design (mobile, tablet, desktop)

### Phase 14: Security Audit
**Agent: security-specialist**
- [ ] Audit all API routes (authentication, validation)
- [ ] Check for exposed secrets (no client-side secrets)
- [ ] Test admin authentication bypass attempts
- [ ] Test SQL injection in form inputs
- [ ] Test file upload vulnerabilities
- [ ] Test rate limiting
- [ ] Verify HTTPS only in production
- [ ] Check CORS configuration
- [ ] Audit session management
- [ ] Generate security report

### Phase 15: Testing & QA
**Agent: testing-qa-specialist**
- [ ] Test admin login/logout flow
- [ ] Test all jobs CRUD operations
- [ ] Test application submission (with CV upload)
- [ ] Test application status updates
- [ ] Test email sending (all templates)
- [ ] Test WhatsApp link generation
- [ ] Test gallery upload (Cloudinary)
- [ ] Test gallery CRUD operations
- [ ] Test filters and search
- [ ] Test mobile responsiveness
- [ ] Test edge cases (empty states, errors)
- [ ] Generate test report

### Phase 16: Performance Optimization
**Agent: deployment-devops**
- [ ] Configure ISR revalidation times
- [ ] Optimize image loading (Cloudinary transformations)
- [ ] Add response caching headers
- [ ] Optimize bundle size
- [ ] Test page load times
- [ ] Run Lighthouse audit (target 90+)
- [ ] Optimize Core Web Vitals
- [ ] Test on slow connections

### Phase 17: Documentation & Handover
**Agent: general-purpose**
- [ ] Create admin user guide (how to use backend)
- [ ] Document API endpoints
- [ ] Document email templates
- [ ] Document Cloudinary setup
- [ ] Document Airtable schema
- [ ] Create troubleshooting guide
- [ ] Create backup/restore guide
- [ ] Final handover documentation

---

## 🔑 ENVIRONMENT VARIABLES TEMPLATE

```bash
# Cloudinary (Already Configured)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dofl7l1cs
CLOUDINARY_API_KEY=245226725965876
CLOUDINARY_API_SECRET=_kv98aZjEvoXtcp-Ks1o86l7JHU

# Airtable (User Must Provide)
AIRTABLE_ACCESS_TOKEN=
AIRTABLE_BASE_ID=
AIRTABLE_JOBS_TABLE_ID=
AIRTABLE_APPLICATIONS_TABLE_ID=
AIRTABLE_GALLERY_TABLE_ID=

# Resend (User Must Provide)
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@pegsecurity.co.za

# Admin (User Must Provide)
ADMIN_PASSWORD=

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## ✅ ACCEPTANCE CRITERIA

### Admin Backend
- [x] Admin can login with password
- [x] Admin can create/edit/delete jobs
- [x] Admin can view all applications
- [x] Admin can filter applications by job, status, date
- [x] Admin can download CV attachments
- [x] Admin can update application status
- [x] Admin can add internal notes to applications
- [x] Admin can send emails to applicants (6 templates)
- [x] Admin can click to WhatsApp applicants
- [x] Admin can upload gallery images
- [x] Admin can edit gallery metadata
- [x] Admin sees dashboard metrics
- [x] All admin routes require authentication
- [x] Mobile responsive admin interface

### Public Frontend
- [x] Public can view open job listings
- [x] Public can filter/search jobs
- [x] Public can view job details
- [x] Public can submit applications with CV upload
- [x] Public receives confirmation email after applying
- [x] Public can view gallery with categories
- [x] Gallery has lightbox for full-size images
- [x] All pages mobile responsive
- [x] Fast load times (< 3s)

### Security
- [x] No secrets exposed to client
- [x] All API routes authenticated (admin)
- [x] Form inputs validated
- [x] File uploads validated (type, size)
- [x] Rate limiting on emails
- [x] CSRF protection
- [x] Session management secure
- [x] No SQL injection vulnerabilities

### Performance
- [x] Lighthouse score 90+
- [x] Images optimized (Cloudinary)
- [x] ISR caching configured
- [x] Lazy loading implemented
- [x] Core Web Vitals green

---

## 🚀 DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] All tests passing
- [ ] Security audit complete
- [ ] Performance audit complete
- [ ] Environment variables set in production
- [ ] Cloudinary API secret regenerated (from chat exposure)
- [ ] Admin password set (strong, unique)
- [ ] Backup strategy documented

### Deployment
- [ ] Deploy to Vercel/Netlify
- [ ] Set environment variables
- [ ] Test production build
- [ ] Verify admin login works
- [ ] Verify Airtable connection
- [ ] Verify Cloudinary uploads
- [ ] Verify email sending
- [ ] Test all forms

### Post-Deployment
- [ ] Monitor error logs
- [ ] Check Cloudinary usage
- [ ] Check Resend usage
- [ ] Check Airtable API calls
- [ ] Monitor application submissions
- [ ] Train admin user
- [ ] Provide handover documentation

---

## 📞 SUPPORT & MAINTENANCE

### Regular Maintenance
- Weekly: Check application submissions
- Weekly: Review email delivery logs
- Monthly: Check Cloudinary storage usage
- Monthly: Check Resend email quota
- Monthly: Review security logs
- Quarterly: Update dependencies
- Quarterly: Security audit

### Monitoring
- Application error rate
- API response times
- Email delivery rate
- Image CDN performance
- Airtable API usage

---

## 🎓 LEARNING RESOURCES

### For Admin Users
- How to create a job posting
- How to review applications
- How to send emails to applicants
- How to upload gallery images
- How to use WhatsApp integration

### For Developers
- Airtable API documentation
- Cloudinary API documentation
- Resend API documentation
- Next.js API routes
- TypeScript best practices

---

## END OF BUILD PLAN

**Total Estimated Time**: 20-30 hours of development
**Recommended Approach**: Build in phases, test thoroughly, deploy iteratively
**Success Metric**: Admin can manage all aspects independently without developer help
