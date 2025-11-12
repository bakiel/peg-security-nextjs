# PEG Security Website - Complete Backend Audit & Requirements

**Date**: November 11, 2025
**Project**: PEG Security Next.js Website
**Purpose**: Complete audit of all features requiring backend/database functionality

---

## 🎯 EXECUTIVE SUMMARY

This document provides a comprehensive audit of the PEG Security website, identifying every feature that requires backend functionality, database integration, or admin capabilities. The goal is to enable a complete autonomous build with all requirements clearly documented.

### Current State
- ✅ **Frontend**: Fully built and responsive
- ⚠️ **Forms**: Exist but only log to console
- ⚠️ **Dynamic Content**: Hardcoded in files (needs database)
- ❌ **Admin Panel**: Does not exist
- ❌ **Backend APIs**: Do not exist
- ❌ **Database**: Not connected

### Target State
- ✅ All forms submit to database
- ✅ All content manageable via admin panel
- ✅ Emails sent automatically on form submissions
- ✅ Gallery images uploadable and editable
- ✅ Job listings manageable by HR
- ✅ Applications reviewable with communication tools

---

## 📊 COMPLETE FEATURES AUDIT

### 1. CONTACT FORM (HIGH PRIORITY)
**Location**: `/app/contact/page.tsx` (Lines 145-161)
**Current State**: Form exists, validates, but only logs to console
**Backend Needed**: ✅ YES

**Form Fields**:
- Name (required, min 2 chars)
- Email (required, validated)
- Phone (required, 10 digits South African format)
- Service Type (dropdown: Armed Response, Manned Security, etc.)
- Message (required, min 10 chars)
- Preferred Contact (radio: email/phone/whatsapp)

**Required Backend Functionality**:
1. ✅ API endpoint: `POST /api/contact/submit`
2. ✅ Store submission in Airtable "Contact_Submissions" table
3. ✅ Send confirmation email to customer
4. ✅ Send notification email to Trudie (`trudie@pegsecurity.co.za`)
5. ✅ Input sanitization and validation (server-side)
6. ✅ Rate limiting (max 5 submissions per hour per IP)
7. ✅ Spam protection (honeypot field)

**Database Schema Required**:
```
Airtable Table: Contact_Submissions
├── Submission ID (Auto number)
├── Name (Single line text)
├── Email (Email)
├── Phone (Phone number)
├── Service Type (Single select)
├── Message (Long text)
├── Preferred Contact (Single select: Email | Phone | WhatsApp)
├── Submitted Date (Created time)
├── Status (Single select: New | Contacted | Resolved | Spam)
├── Notes (Long text - for admin)
├── IP Address (Single line text - for spam prevention)
└── User Agent (Single line text - for analytics)
```

**Email Templates Needed**:
1. Customer confirmation email
2. Admin notification email

---

### 2. CAREERS / JOB LISTINGS (HIGH PRIORITY)
**Location**: `/app/careers/page.tsx`
**Current State**: 6 hardcoded jobs in JavaScript array (Lines 47-264)
**Backend Needed**: ✅ YES

**Current Jobs (Hardcoded)**:
1. Security Officer
2. Armed Response Officer
3. Security Control Room Operator
4. Security Supervisor
5. Security Training Officer
6. Cybersecurity Analyst

**Required Backend Functionality**:

#### A. Public-Facing (Careers Page)
1. ✅ API endpoint: `GET /api/careers` - Fetch all open jobs
2. ✅ API endpoint: `GET /api/careers/[id]` - Fetch single job details
3. ✅ Job listing display with filtering (category, location, type)
4. ✅ Job search functionality
5. ✅ Application form per job
6. ✅ API endpoint: `POST /api/careers/[id]/apply` - Submit application

#### B. Admin Panel (Job Management)
1. ✅ View all jobs (published, draft, closed)
2. ✅ Create new job posting
3. ✅ Edit existing job
4. ✅ Delete job
5. ✅ Change job status (Open → Closed → Draft)
6. ✅ Duplicate job for similar positions

**Database Schema Required**:
```
Airtable Table: Jobs
├── Job ID (Auto number)
├── Title (Single line text)
├── Slug (Formula: LOWER(SUBSTITUTE({Title}, " ", "-")))
├── Category (Single select: Operations | Management | Technology | Administration)
├── Location (Single line text)
├── Employment Type (Single select: Full-time | Part-time | Contract)
├── PSIRA Required (Checkbox)
├── Description (Long text)
├── Responsibilities (Long text - bullet points)
├── Requirements (Long text - bullet points)
├── Benefits (Long text - bullet points)
├── Salary Range (Single line text - optional)
├── Posted Date (Date)
├── Application Deadline (Date - optional)
├── Status (Single select: Open | Closed | Draft)
├── Featured (Checkbox - display on homepage)
├── Display Order (Number - for manual sorting)
└── Created By (Single line text - admin username)

Airtable Table: Applications
├── Application ID (Auto number)
├── Job (Link to Jobs table)
├── Applicant Name (Single line text)
├── Email (Email)
├── Phone (Phone number)
├── CV/Resume (Attachment)
├── Cover Letter (Long text)
├── Why Interested (Long text)
├── Years Experience (Number)
├── PSIRA Registered (Checkbox)
├── PSIRA Number (Single line text - if applicable)
├── Driver's License (Single select: None | Code 08 | Code 10 | Code 14)
├── Own Transport (Checkbox)
├── Available Start Date (Date)
├── Salary Expectation (Single line text)
├── Applied Date (Created time)
├── Status (Single select: New | Reviewing | Shortlisted | Interview Scheduled | Rejected | Hired)
├── Admin Notes (Long text - internal only)
├── Rating (Single select: 1 Star | 2 Stars | 3 Stars | 4 Stars | 5 Stars)
├── Interview Date (Date)
├── Reviewed By (Single line text - admin username)
└── Last Updated (Last modified time)
```

**Application Form Fields** (Must Be Built):
- Full Name
- Email
- Phone
- CV Upload (PDF/DOCX, max 5MB)
- Cover Letter (textarea)
- Why are you interested? (textarea)
- Years of security experience
- PSIRA registered? (yes/no)
- PSIRA number (if yes)
- Driver's license type
- Own transport? (yes/no)
- Available start date
- Salary expectation

**Email Templates Needed**:
1. Application received confirmation (to applicant)
2. Application notification (to Trudie/Vusi)
3. Application status update (under review)
4. Interview invitation
5. Application shortlisted
6. Application rejected (polite)
7. Position filled notification

---

### 3. GALLERY (HIGH PRIORITY)
**Location**: `/app/gallery/page.tsx`
**Current State**: 25 hardcoded gallery items in JavaScript array (Lines 23-304)
**Backend Needed**: ✅ YES

**Current Categories**:
- All
- Operations
- Training
- Technology
- Events
- Community

**Required Backend Functionality**:

#### A. Public-Facing (Gallery Page)
1. ✅ API endpoint: `GET /api/gallery` - Fetch all published images
2. ✅ Filter by category
3. ✅ Search by title/description
4. ✅ Lightbox modal for full-size view
5. ✅ Image lazy loading and optimization

#### B. Admin Panel (Gallery Management)
1. ✅ Upload new images (Cloudinary integration)
2. ✅ Add metadata (title, description, category, alt text)
3. ✅ Edit existing gallery items
4. ✅ Delete images
5. ✅ Reorder images (drag & drop or manual order)
6. ✅ Bulk operations (delete multiple, change category)
7. ✅ Mark as featured (for homepage)
8. ✅ Change status (Published | Draft | Archived)

**Database Schema Required**:
```
Airtable Table: Gallery
├── Gallery ID (Auto number)
├── Title (Single line text)
├── Description (Long text)
├── Category (Single select: Operations | Training | Technology | Events | Community)
├── Tags (Multiple select: Armed Response | Manned Security | PSIRA | SAIDSA | Team | etc.)
├── Cloudinary URL (URL field)
├── Cloudinary Public ID (Single line text - for transformations)
├── Alt Text (Single line text - required for accessibility/SEO)
├── Aspect Ratio (Single select: Landscape | Portrait | Square)
├── Display Order (Number - for manual sorting)
├── Featured (Checkbox - show on homepage)
├── Status (Single select: Published | Draft | Archived)
├── Date Added (Created time)
├── Last Modified (Last modified time)
├── Uploaded By (Single line text - admin username)
└── Views (Number - optional analytics)
```

**Cloudinary Configuration**:
- ✅ Already configured (credentials in .env.local)
- Cloud name: `dofl7l1cs`
- Upload preset: Create "peg-security-gallery"
- Folder structure: `/peg-securite/gallery/{category}/`
- Max file size: 10MB
- Allowed formats: JPG, PNG, WebP
- Auto-optimization: quality and format

**Image Upload Workflow**:
1. Admin uploads image to Cloudinary (via upload widget)
2. Cloudinary returns URL and Public ID
3. Admin adds metadata in form (title, description, category, etc.)
4. Form submits to API: `POST /api/admin/gallery`
5. Record created in Airtable with Cloudinary URL
6. Image appears on gallery page (if status = Published)

---

### 4. ADMIN AUTHENTICATION (CRITICAL)
**Location**: Does not exist yet
**Current State**: No admin panel or authentication
**Backend Needed**: ✅ YES

**Required Functionality**:
1. ✅ Login page: `/admin/login`
2. ✅ Password authentication (simple, single admin password)
3. ✅ Session management (cookies)
4. ✅ Protected routes (middleware)
5. ✅ Logout functionality
6. ✅ Remember me (optional)
7. ✅ Password reset (future enhancement)

**Security Requirements**:
- ✅ Password stored as environment variable (not in code)
- ✅ Sessions expire after 24 hours of inactivity
- ✅ HTTPS only in production
- ✅ CSRF protection on all admin forms
- ✅ Rate limiting on login attempts (max 5 per 15 minutes)
- ✅ IP logging for security audit
- ✅ Auto-logout on browser close (optional)

**Admin Routes to Protect**:
```
/admin/*              → All admin routes
/api/admin/*          → All admin API endpoints
/api/contact/all      → View all contact submissions (admin only)
/api/careers/admin/*  → Job management endpoints
/api/gallery/admin/*  → Gallery management endpoints
```

**Authentication Flow**:
1. User visits `/admin`
2. Redirected to `/admin/login` if not authenticated
3. Enter admin password
4. Server validates password
5. Create session cookie
6. Redirect to `/admin/dashboard`
7. All subsequent admin requests include session cookie
8. Middleware checks session before allowing access

---

### 5. ADMIN DASHBOARD (HIGH PRIORITY)
**Location**: Does not exist yet (`/admin/page.tsx` to be built)
**Backend Needed**: ✅ YES

**Required Widgets/Metrics**:
1. ✅ Total contact submissions (last 7/30/90 days)
2. ✅ New applications count
3. ✅ Open job positions count
4. ✅ Total gallery images
5. ✅ Recent activity log (last 10 actions)
6. ✅ Quick actions:
   - Create new job
   - Upload gallery image
   - View new applications
   - View contact submissions
7. ✅ Application status pie chart:
   - New
   - Reviewing
   - Shortlisted
   - Rejected
   - Hired
8. ✅ Top 5 jobs by applications
9. ✅ Recent contact submissions (last 5)
10. ✅ System status indicators:
    - Airtable connection
    - Cloudinary connection
    - Email service connection

**API Endpoints Needed**:
```
GET /api/admin/dashboard/stats    → All dashboard metrics
GET /api/admin/dashboard/activity → Recent activity log
```

---

### 6. EMAIL NOTIFICATIONS (HIGH PRIORITY)
**Service**: Resend
**API Key**: Already configured ✅
**From Email**: `onboarding@resend.dev` (temp), eventually `noreply@pegsecurity.co.za`

**Email Templates to Build**:

#### A. Contact Form Emails
1. **Customer Confirmation**:
   - Subject: "Thank you for contacting PEG Security"
   - Body: Acknowledgment, what to expect next, contact info
   - Reply-to: trudie@pegsecurity.co.za

2. **Admin Notification**:
   - Subject: "New Contact Form Submission - [Name]"
   - Body: All form details, link to admin panel
   - To: trudie@pegsecurity.co.za

#### B. Job Application Emails
1. **Application Received** (to applicant):
   - Subject: "Application Received - [Job Title] at PEG Security"
   - Body: Thank you, review timeline, what's next

2. **Admin Notification** (to HR):
   - Subject: "New Job Application - [Job Title] - [Applicant Name]"
   - Body: Applicant details, CV download link, link to admin review

3. **Application Under Review**:
   - Subject: "Your Application is Under Review"
   - Body: Status update, estimated timeline

4. **Interview Invitation**:
   - Subject: "Interview Invitation - [Job Title] at PEG Security"
   - Body: Interview details (date, time, location), what to bring

5. **Application Shortlisted**:
   - Subject: "You've Been Shortlisted - [Job Title]"
   - Body: Congratulations, next steps

6. **Application Rejected** (polite):
   - Subject: "Update on Your Application - [Job Title]"
   - Body: Thank you for interest, position filled, keep in touch

7. **Position Filled**:
   - Subject: "[Job Title] Position - Update"
   - Body: Position filled, encourage future applications

**Email Service Configuration**:
```typescript
// lib/resend.ts
import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

export const emailConfig = {
  from: process.env.RESEND_FROM_EMAIL,
  replyTo: 'trudie@pegsecurity.co.za',
  defaultSubject: 'PEG Security - [Topic]'
}
```

**Email Rate Limits**:
- Free tier: 100 emails/day
- Production: Verify domain for unlimited
- Implement queue system if needed
- Log all email attempts

---

### 7. WHATSAPP INTEGRATION (MEDIUM PRIORITY)
**Approach**: Click-to-WhatsApp links (no API needed initially)
**Cost**: Free
**Setup**: Already planned ✅

**Required Functionality**:
1. ✅ Generate WhatsApp link with pre-filled message
2. ✅ Templates for different scenarios:
   - Application follow-up
   - Interview scheduling
   - Status update
   - General inquiry
3. ✅ Admin can click button to open WhatsApp with message template

**WhatsApp Link Format**:
```
https://wa.me/27794139180?text=Hi%20[Name],%20regarding%20your%20application...
```

**Implementation** (`lib/whatsapp.ts`):
```typescript
export function generateWhatsAppLink(
  phone: string,
  template: 'application' | 'interview' | 'followup' | 'general',
  data: { name: string; jobTitle?: string; message?: string }
): string {
  const messages = {
    application: `Hi ${data.name}, this is PEG Security HR. Thank you for applying for ${data.jobTitle}. We'd like to discuss your application. When would be a good time to chat?`,
    interview: `Hi ${data.name}, we'd like to invite you for an interview for the ${data.jobTitle} position. Are you available this week?`,
    followup: `Hi ${data.name}, just following up on your ${data.jobTitle} application. ${data.message || 'Please let us know if you have any questions.'}`,
    general: `Hi ${data.name}, ${data.message || 'this is PEG Security. How can we assist you?'}`
  }

  const message = encodeURIComponent(messages[template])
  const cleanPhone = phone.replace(/[^0-9]/g, '')

  return `https://wa.me/${cleanPhone}?text=${message}`
}
```

**Admin UI Integration**:
- Button next to each application: "💬 WhatsApp Applicant"
- Dropdown to select template
- Opens WhatsApp with pre-filled message
- Admin can edit before sending

---

### 8. FILE UPLOADS (HIGH PRIORITY)
**Use Case**: CV/Resume uploads for job applications
**Storage**: Airtable attachments (not Cloudinary)
**Max Size**: 5MB
**Allowed Formats**: PDF, DOCX, DOC

**Required Functionality**:
1. ✅ File upload component in application form
2. ✅ Client-side validation:
   - File type (PDF/DOCX/DOC only)
   - File size (max 5MB)
   - Filename sanitization
3. ✅ Server-side validation (same checks)
4. ✅ Upload to Airtable as attachment
5. ✅ Download link in admin panel
6. ✅ Virus scanning (optional, future enhancement)

**Security Measures**:
- ✅ Validate file MIME type (not just extension)
- ✅ Scan file content for malicious code
- ✅ Rename files to prevent path traversal
- ✅ Store in isolated directory/attachment field
- ✅ Serve files with Content-Disposition: attachment
- ✅ Rate limit uploads (max 3 per hour per IP)

**File Upload Flow**:
1. User selects CV file in application form
2. Client validates file (type, size)
3. File uploaded as part of form submission
4. Server validates again
5. File attached to Airtable record
6. Airtable generates download URL
7. Admin can download CV from admin panel

---

### 9. SEARCH & FILTERING (MEDIUM PRIORITY)
**Use Cases**:
- Search jobs by title/keyword
- Filter jobs by category, location, type
- Search gallery by title/description
- Filter gallery by category/tags
- Search applications by name/email

**Required Functionality**:

#### A. Jobs Search/Filter
1. ✅ Text search (title, description, requirements)
2. ✅ Filter by category (Operations, Management, etc.)
3. ✅ Filter by location
4. ✅ Filter by employment type (Full-time, Part-time, Contract)
5. ✅ Filter by PSIRA required (yes/no)
6. ✅ Sort by: Date posted, Title, Location

#### B. Gallery Search/Filter
1. ✅ Text search (title, description)
2. ✅ Filter by category
3. ✅ Filter by tags
4. ✅ Sort by: Date added, Title, Most viewed

#### C. Admin - Applications Search/Filter
1. ✅ Search by applicant name/email
2. ✅ Filter by job
3. ✅ Filter by status
4. ✅ Filter by date range
5. ✅ Sort by: Application date, Name, Status

**Implementation**:
- Client-side filtering for small datasets (< 100 items)
- Server-side filtering for large datasets
- Debounced search input (500ms delay)
- URL parameters for shareable filtered views
- "Clear filters" button

---

### 10. DATA EXPORT (LOW PRIORITY, FUTURE)
**Admin Capability**: Export data to CSV/Excel

**Exportable Data**:
1. ✅ All contact submissions
2. ✅ All applications (with filtering)
3. ✅ All jobs (current and archived)
4. ✅ Gallery metadata

**Implementation** (Future):
```typescript
// api/admin/export/[type]/route.ts
GET /api/admin/export/contacts?format=csv
GET /api/admin/export/applications?job=123&format=xlsx
```

---

### 11. ANALYTICS (LOW PRIORITY, FUTURE)
**Optional Enhancement**: Track user behavior

**Metrics to Track**:
- Page views per page
- Most viewed jobs
- Most viewed gallery images
- Form abandonment rate
- Application completion rate
- Time spent on site
- User device/browser stats

**Implementation** (Future):
- Google Analytics 4
- or Vercel Analytics
- or Custom tracking in Airtable

---

### 12. SECURITY REQUIREMENTS (CRITICAL)

#### A. Input Validation
- ✅ All form inputs validated client-side AND server-side
- ✅ Email format validation
- ✅ Phone number format validation (South African: 10 digits)
- ✅ Text length limits enforced
- ✅ No HTML/script tags in user input
- ✅ File upload type/size validation

#### B. SQL Injection Prevention
- ✅ Not applicable (using Airtable, not SQL)
- ✅ But still sanitize all inputs
- ✅ Validate Airtable record IDs

#### C. XSS Prevention
- ✅ Sanitize all user-generated content
- ✅ Escape HTML in outputs
- ✅ Use React's built-in XSS protection
- ✅ Content Security Policy headers

#### D. CSRF Protection
- ✅ CSRF tokens on all admin forms
- ✅ SameSite cookies
- ✅ Verify referer header

#### E. Rate Limiting
- ✅ Contact form: 5 submissions/hour per IP
- ✅ Job applications: 3 submissions/hour per IP
- ✅ Login attempts: 5 attempts/15 minutes per IP
- ✅ Email sends: 10 emails/minute admin-wide
- ✅ File uploads: 3 uploads/hour per IP

#### F. Authentication Security
- ✅ Admin password in environment variable
- ✅ Sessions expire after 24 hours
- ✅ HTTPS only in production
- ✅ Secure cookie flags (HttpOnly, Secure, SameSite)
- ✅ IP logging for security audit

#### G. API Security
- ✅ Admin API routes require authentication
- ✅ Public API routes have rate limiting
- ✅ Input validation on all endpoints
- ✅ Error messages don't leak sensitive info
- ✅ CORS configuration (restrictive)

#### H. Environment Security
- ✅ All secrets in .env.local (never committed)
- ✅ .env.local in .gitignore
- ✅ .env.example for team (no real values)
- ✅ API keys rotated regularly
- ✅ Cloudinary API secret regenerated after exposure

#### I. Logging & Monitoring
- ✅ Log all admin actions (who, what, when)
- ✅ Log all failed login attempts
- ✅ Log all API errors
- ✅ Monitor for unusual activity
- ✅ Alert on multiple failed logins

---

### 13. PERFORMANCE REQUIREMENTS

#### A. Page Load Times
- ✅ Homepage: < 2 seconds
- ✅ Other pages: < 3 seconds
- ✅ Gallery: < 3 seconds (with lazy loading)
- ✅ Admin panel: < 2 seconds

#### B. Image Optimization
- ✅ Cloudinary auto-optimization (format, quality)
- ✅ Next.js Image component for all images
- ✅ Lazy loading for gallery
- ✅ Blur placeholders (LQIP)
- ✅ Responsive srcset

#### C. Caching Strategy
- ✅ ISR (Incremental Static Regeneration) for:
  - Job listings: revalidate every 15 minutes (900 seconds)
  - Gallery: revalidate every 30 minutes (1800 seconds)
- ✅ Static generation for:
  - Homepage
  - About page
  - Services page
  - FAQ page
- ✅ Client-side caching:
  - API responses cached for 5 minutes
  - Browser cache for static assets

#### D. Database Query Optimization
- ✅ Airtable: Use formulas for computed fields
- ✅ Airtable: Use views for filtered queries
- ✅ Airtable: Limit fields returned (only what's needed)
- ✅ Pagination for large datasets (50 items/page)

#### E. Bundle Size Optimization
- ✅ Code splitting (Next.js automatic)
- ✅ Dynamic imports for large components
- ✅ Tree shaking
- ✅ Remove unused dependencies
- ✅ Minimize third-party scripts

---

### 14. ACCESSIBILITY REQUIREMENTS

#### A. Images
- ✅ Alt text required for all images
- ✅ Alt text validated (not empty, descriptive)
- ✅ Decorative images have empty alt=""

#### B. Forms
- ✅ Label for every input field
- ✅ Error messages associated with fields (aria-describedby)
- ✅ Required fields marked (asterisk + aria-required)
- ✅ Keyboard navigation (Tab order)
- ✅ Focus indicators visible

#### C. Colors
- ✅ Sufficient color contrast (WCAG AA)
- ✅ Text readable on backgrounds
- ✅ Don't rely solely on color for meaning

#### D. Navigation
- ✅ Keyboard accessible
- ✅ Screen reader friendly
- ✅ Skip to content link
- ✅ Logical heading hierarchy

#### E. ARIA
- ✅ Proper roles (button, nav, main, etc.)
- ✅ Aria-labels for icon buttons
- ✅ Aria-live for dynamic content updates
- ✅ Aria-expanded for dropdowns

---

### 15. SEO REQUIREMENTS

#### A. Meta Tags
- ✅ Title tag (unique per page)
- ✅ Meta description (unique per page)
- ✅ Open Graph tags (for social sharing)
- ✅ Twitter Card tags

#### B. Structured Data
- ✅ Organization schema (JSON-LD)
- ✅ JobPosting schema for job listings
- ✅ ImageObject schema for gallery
- ✅ ContactPage schema for contact page
- ✅ Breadcrumbs schema

#### C. Sitemap
- ✅ XML sitemap generated
- ✅ Includes all public pages
- ✅ Dynamic job/gallery pages included
- ✅ Submitted to Google Search Console

#### D. Robots.txt
- ✅ Allow all public pages
- ✅ Disallow /admin/*
- ✅ Disallow /api/*
- ✅ Sitemap URL included

#### E. Image SEO
- ✅ Descriptive filenames
- ✅ Alt text for all images
- ✅ Image sitemap
- ✅ Responsive images

---

## 📁 COMPLETE FILE STRUCTURE (TO BE BUILT)

```
peg-security-nextjs/
├── app/
│   ├── admin/
│   │   ├── layout.tsx              ← Admin layout (nav, auth check)
│   │   ├── page.tsx                ← Dashboard
│   │   ├── login/
│   │   │   └── page.tsx            ← Login page
│   │   ├── jobs/
│   │   │   ├── page.tsx            ← List all jobs
│   │   │   ├── new/
│   │   │   │   └── page.tsx        ← Create job form
│   │   │   └── [id]/
│   │   │       ├── page.tsx        ← Edit job
│   │   │       └── applications/
│   │   │           └── page.tsx    ← Applications for this job
│   │   ├── applications/
│   │   │   ├── page.tsx            ← List all applications
│   │   │   └── [id]/
│   │   │       └── page.tsx        ← Application detail + actions
│   │   ├── gallery/
│   │   │   ├── page.tsx            ← Manage gallery
│   │   │   ├── new/
│   │   │   │   └── page.tsx        ← Upload image
│   │   │   └── [id]/
│   │   │       └── page.tsx        ← Edit gallery item
│   │   └── contacts/
│   │       ├── page.tsx            ← List submissions
│   │       └── [id]/
│   │           └── page.tsx        ← Submission detail
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.ts        ← Login API
│   │   │   └── logout/
│   │   │       └── route.ts        ← Logout API
│   │   ├── contact/
│   │   │   ├── submit/
│   │   │   │   └── route.ts        ← Submit contact form
│   │   │   └── all/
│   │   │       └── route.ts        ← Get all submissions (admin)
│   │   ├── careers/
│   │   │   ├── route.ts            ← GET all open jobs
│   │   │   ├── [id]/
│   │   │   │   ├── route.ts        ← GET single job
│   │   │   │   └── apply/
│   │   │   │       └── route.ts    ← POST application
│   │   │   └── admin/
│   │   │       ├── route.ts        ← CRUD jobs (admin)
│   │   │       └── [id]/
│   │   │           └── route.ts    ← Update/delete job
│   │   ├── gallery/
│   │   │   ├── route.ts            ← GET all published images
│   │   │   └── admin/
│   │   │       ├── route.ts        ← CRUD gallery (admin)
│   │   │       └── [id]/
│   │   │           └── route.ts    ← Update/delete image
│   │   ├── applications/
│   │   │   └── admin/
│   │   │       ├── route.ts        ← GET all applications
│   │   │       └── [id]/
│   │   │           ├── route.ts    ← Update application
│   │   │           └── email/
│   │   │               └── route.ts ← Send email to applicant
│   │   └── admin/
│   │       └── dashboard/
│   │           ├── stats/
│   │           │   └── route.ts    ← Dashboard metrics
│   │           └── activity/
│   │               └── route.ts    ← Recent activity log
│   ├── careers/
│   │   └── [slug]/
│   │       └── page.tsx            ← Individual job page
│   └── (existing pages...)
├── lib/
│   ├── airtable.ts                 ← Airtable client + interfaces
│   ├── cloudinary.ts               ← Cloudinary utilities
│   ├── resend.ts                   ← Email client + templates
│   ├── whatsapp.ts                 ← WhatsApp link generator
│   ├── auth.ts                     ← Admin auth utilities
│   ├── validation.ts               ← Input validation functions
│   └── rate-limit.ts               ← Rate limiting utilities
├── components/
│   ├── admin/
│   │   ├── AdminNav.tsx            ← Admin navigation
│   │   ├── DashboardWidget.tsx     ← Dashboard metric widgets
│   │   ├── JobForm.tsx             ← Create/edit job form
│   │   ├── ApplicationTable.tsx    ← Applications data table
│   │   ├── ApplicationDetail.tsx   ← Single application view
│   │   ├── GalleryUpload.tsx       ← Cloudinary upload widget
│   │   ├── GalleryGrid.tsx         ← Admin gallery grid
│   │   ├── ContactSubmissions.tsx  ← Contact form submissions table
│   │   ├── EmailModal.tsx          ← Send email modal
│   │   ├── WhatsAppButton.tsx      ← WhatsApp link button
│   │   └── ConfirmDialog.tsx       ← Delete confirmation dialog
│   ├── careers/
│   │   ├── JobCard.tsx             ← Job listing card
│   │   ├── JobList.tsx             ← Jobs list with filters
│   │   ├── JobDetail.tsx           ← Single job detail
│   │   ├── ApplicationForm.tsx     ← Job application form
│   │   └── FileUpload.tsx          ← CV upload component
│   ├── gallery/
│   │   ├── GalleryGrid.tsx         ← Public gallery grid
│   │   ├── GalleryFilters.tsx      ← Category/tag filters
│   │   └── Lightbox.tsx            ← Full-size image modal
│   └── (existing components...)
├── middleware.ts                   ← Auth middleware (protect /admin/*)
├── types/
│   ├── airtable.ts                 ← Airtable TypeScript interfaces
│   ├── forms.ts                    ← Form data interfaces
│   └── api.ts                      ← API response interfaces
├── docs/
│   ├── COMPLETE_BACKEND_AUDIT.md   ← This file
│   ├── BACKEND_BUILD_PLAN.md       ← Existing build plan
│   ├── airtable-integration.md     ← Airtable setup guide
│   ├── cloudinary-config.md        ← Cloudinary setup guide
│   ├── admin-backend.md            ← Admin system docs
│   ├── careers-feature.md          ← Careers system docs
│   ├── gallery-system.md           ← Gallery system docs
│   ├── email-templates.md          ← Email template specs
│   ├── security-rules.md           ← Security requirements (TO CREATE)
│   └── api-documentation.md        ← API endpoints reference (TO CREATE)
└── .env.local
    ├── CLOUDINARY_*                ← ✅ Configured
    ├── AIRTABLE_*                  ← ✅ Configured
    ├── RESEND_*                    ← ✅ Configured
    ├── ADMIN_PASSWORD              ← ✅ Set
    └── NEXT_PUBLIC_SITE_URL        ← ✅ Set
```

---

## 🔧 TECHNOLOGY STACK (CONFIRMED)

### Frontend
- ✅ Next.js 14 (App Router)
- ✅ React 18
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Framer Motion (animations)
- ✅ Lucide React (icons)

### Backend Services
- ✅ Airtable (database) - Credentials: ✓
- ✅ Cloudinary (images) - Credentials: ✓
- ✅ Resend (email) - Credentials: ✓
- ✅ WhatsApp (click-to-link) - No API needed

### Authentication
- ✅ Custom session-based auth
- ✅ Cookie-based sessions
- ✅ Middleware for route protection

### Deployment
- ✅ Vercel (recommended)
- ✅ Or Netlify
- ✅ Environment variables configured in platform

---

## 📋 IMPLEMENTATION PRIORITIES

### PHASE 1: Foundation (Week 1)
**Priority**: CRITICAL
**Estimated Time**: 8-12 hours

1. ✅ Install all packages (airtable, resend, next-cloudinary)
2. ✅ Create lib utilities:
   - airtable.ts
   - cloudinary.ts
   - resend.ts
   - auth.ts
   - validation.ts
3. ✅ Set up Airtable tables (Contact_Submissions, Jobs, Applications, Gallery)
4. ✅ Create TypeScript interfaces for all data types
5. ✅ Build admin authentication (login page + middleware)
6. ✅ Test Airtable connection
7. ✅ Test Cloudinary connection
8. ✅ Test Resend connection

### PHASE 2: Contact Form (Week 1)
**Priority**: HIGH
**Estimated Time**: 4-6 hours

1. ✅ API: POST /api/contact/submit
2. ✅ Store in Airtable
3. ✅ Send confirmation email to customer
4. ✅ Send notification email to admin
5. ✅ Update frontend form to call API
6. ✅ Add loading states and success message
7. ✅ Test end-to-end

### PHASE 3: Jobs Backend (Week 2)
**Priority**: HIGH
**Estimated Time**: 8-10 hours

1. ✅ Migrate hardcoded jobs to Airtable
2. ✅ API: GET /api/careers (fetch jobs)
3. ✅ API: GET /api/careers/[slug] (single job)
4. ✅ Update careers page to fetch from API
5. ✅ Build application form component
6. ✅ API: POST /api/careers/[id]/apply
7. ✅ Handle CV upload to Airtable
8. ✅ Send application confirmation email
9. ✅ Send admin notification email
10. ✅ Test end-to-end

### PHASE 4: Admin - Jobs Management (Week 2)
**Priority**: HIGH
**Estimated Time**: 10-12 hours

1. ✅ Admin dashboard page
2. ✅ Admin jobs list page
3. ✅ Create job form (admin/jobs/new)
4. ✅ Edit job form (admin/jobs/[id])
5. ✅ API: POST /api/admin/jobs (create)
6. ✅ API: PUT /api/admin/jobs/[id] (update)
7. ✅ API: DELETE /api/admin/jobs/[id] (delete)
8. ✅ Job status toggle
9. ✅ Test CRUD operations

### PHASE 5: Admin - Applications Management (Week 3)
**Priority**: HIGH
**Estimated Time**: 10-12 hours

1. ✅ Admin applications list page
2. ✅ Filters (by job, status, date)
3. ✅ Application detail page
4. ✅ CV download functionality
5. ✅ Status update dropdown
6. ✅ Admin notes textarea
7. ✅ API: GET /api/admin/applications
8. ✅ API: PUT /api/admin/applications/[id]
9. ✅ Email sending interface
10. ✅ WhatsApp link button
11. ✅ Test end-to-end

### PHASE 6: Gallery Backend (Week 3)
**Priority**: HIGH
**Estimated Time**: 8-10 hours

1. ✅ Migrate hardcoded gallery to Airtable
2. ✅ API: GET /api/gallery (fetch images)
3. ✅ Update gallery page to fetch from API
4. ✅ Admin gallery list page
5. ✅ Upload interface (Cloudinary widget)
6. ✅ Metadata form (title, description, category, alt)
7. ✅ API: POST /api/admin/gallery (create)
8. ✅ API: PUT /api/admin/gallery/[id] (update)
9. ✅ API: DELETE /api/admin/gallery/[id] (delete)
10. ✅ Test upload and display

### PHASE 7: Security Hardening (Week 4)
**Priority**: CRITICAL
**Estimated Time**: 6-8 hours

1. ✅ Input validation on all forms
2. ✅ Rate limiting on all endpoints
3. ✅ CSRF protection
4. ✅ XSS prevention
5. ✅ File upload validation
6. ✅ Admin action logging
7. ✅ Security audit checklist
8. ✅ Penetration testing

### PHASE 8: Testing & QA (Week 4)
**Priority**: HIGH
**Estimated Time**: 8-10 hours

1. ✅ Test all forms
2. ✅ Test all admin functions
3. ✅ Test email sending
4. ✅ Test file uploads
5. ✅ Test authentication
6. ✅ Test on mobile devices
7. ✅ Test with slow connections
8. ✅ Test edge cases
9. ✅ Fix bugs
10. ✅ Final QA pass

### PHASE 9: Documentation (Week 4)
**Priority**: MEDIUM
**Estimated Time**: 4-6 hours

1. ✅ Admin user guide
2. ✅ API documentation
3. ✅ Troubleshooting guide
4. ✅ Deployment guide
5. ✅ Handover documentation

### PHASE 10: Deployment (Week 4)
**Priority**: HIGH
**Estimated Time**: 2-4 hours

1. ✅ Environment variables in Vercel
2. ✅ Deploy to production
3. ✅ Test production deployment
4. ✅ Monitor for errors
5. ✅ Verify all functionality
6. ✅ Go live!

---

## ✅ PRE-BUILD CHECKLIST

### Environment Variables (Credentials)
- [x] **Cloudinary**: Cloud name, API key, API secret ✅
- [x] **Airtable**: Access token, Base ID, 3 Table IDs ✅
- [x] **Resend**: API key ✅
- [x] **Admin**: Password set ✅
- [x] **Site URL**: Configured ✅

### Airtable Setup
- [ ] Create base: "PEG Security"
- [ ] Create table: "Contact_Submissions" (with fields listed above)
- [ ] Create table: "Jobs" (with fields listed above)
- [ ] Create table: "Applications" (with fields listed above)
- [ ] Create table: "Gallery" (with fields listed above)
- [ ] Test Airtable API connection

### Cloudinary Setup
- [x] Account created ✅
- [ ] Upload preset created: "peg-security-gallery"
- [ ] Folder structure created (will auto-create on first upload)
- [ ] Test upload functionality

### Resend Setup
- [x] Account created ✅
- [x] API key generated ✅
- [ ] Domain verified (or using test email for now)
- [ ] Test email sending

### Development Environment
- [x] Node.js installed
- [x] Next.js project running ✅
- [x] All dependencies installed
- [x] .env.local configured ✅
- [ ] .env.example created
- [ ] .gitignore includes .env.local

---

## 🚨 CRITICAL SECURITY RULES

These rules MUST be followed in the autonomous build:

1. ✅ **NEVER** commit secrets to git
2. ✅ **ALWAYS** validate input server-side (never trust client)
3. ✅ **ALWAYS** sanitize user input before storage/display
4. ✅ **ALWAYS** use HTTPS in production
5. ✅ **ALWAYS** rate limit API endpoints
6. ✅ **ALWAYS** require authentication for admin routes
7. ✅ **ALWAYS** validate file uploads (type, size, content)
8. ✅ **ALWAYS** use environment variables for secrets
9. ✅ **ALWAYS** log admin actions
10. ✅ **NEVER** expose Airtable/API credentials to client
11. ✅ **ALWAYS** use CSRF tokens on admin forms
12. ✅ **ALWAYS** expire sessions after inactivity
13. ✅ **ALWAYS** use prepared statements (N/A for Airtable, but sanitize IDs)
14. ✅ **ALWAYS** escape HTML in user-generated content
15. ✅ **ALWAYS** test security before deployment

---

## 📊 SUCCESS METRICS

### Functionality
- [ ] ✅ Contact form submits to Airtable
- [ ] ✅ Confirmation emails sent
- [ ] ✅ Jobs fetched from Airtable
- [ ] ✅ Job applications submit with CV
- [ ] ✅ Applications appear in admin panel
- [ ] ✅ Admin can manage jobs (CRUD)
- [ ] ✅ Admin can manage applications (view, update status, email)
- [ ] ✅ Gallery images fetched from Airtable
- [ ] ✅ Admin can upload images to Cloudinary
- [ ] ✅ Admin can manage gallery (CRUD)
- [ ] ✅ Authentication works
- [ ] ✅ All admin routes protected

### Performance
- [ ] ✅ Homepage loads in < 2 seconds
- [ ] ✅ Lighthouse score 90+
- [ ] ✅ All images optimized
- [ ] ✅ Mobile responsive

### Security
- [ ] ✅ All admin routes require auth
- [ ] ✅ Rate limiting active
- [ ] ✅ Input validation working
- [ ] ✅ No secrets in client code
- [ ] ✅ CSRF protection active
- [ ] ✅ Security audit passed

### User Experience
- [ ] ✅ Forms easy to use
- [ ] ✅ Clear error messages
- [ ] ✅ Success confirmations
- [ ] ✅ Loading states
- [ ] ✅ Admin panel intuitive
- [ ] ✅ Mobile friendly

---

## 🎯 AUTONOMOUS BUILD READINESS

### ✅ READY TO BUILD
- [x] Complete requirements documented
- [x] All credentials provided
- [x] Technology stack confirmed
- [x] File structure planned
- [x] Security rules defined
- [x] Database schemas designed
- [x] API endpoints specified
- [x] Email templates planned
- [x] Implementation priorities set
- [x] Success metrics defined

### ⏳ WAITING FOR
- [ ] Airtable tables created (can be created during build)
- [ ] Cloudinary upload preset (can be created during build)
- [ ] Resend domain verification (using test email for now)

### 🚀 NEXT STEP
**Launch autonomous build using specialized agents according to `/docs/BACKEND_BUILD_PLAN.md`**

---

## 📞 CONTACT FOR BUILD

**Build Owner**: Bakiel
**Email**: trudie@pegsecurity.co.za, vusi@asginc.co.za
**Website**: pegsecurity.co.za

---

## 📝 DOCUMENT HISTORY

- **Created**: November 11, 2025
- **Last Updated**: November 11, 2025
- **Version**: 1.0
- **Status**: Complete - Ready for Autonomous Build

---

## ✅ FINAL APPROVAL

This audit is COMPLETE and APPROVED for autonomous build execution.

All requirements are documented.
All credentials are configured.
All security rules are defined.
All agents can now proceed with implementation.

**BUILD STATUS**: 🚀 READY TO LAUNCH
