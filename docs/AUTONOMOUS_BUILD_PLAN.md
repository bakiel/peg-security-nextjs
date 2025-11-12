# PEG Security - AUTONOMOUS BUILD EXECUTION PLAN

**Status**: 🚀 READY FOR AUTONOMOUS BUILD
**Date**: November 11, 2025
**Build Type**: Complete Backend + Admin System

---

## 📚 REQUIRED READING (In Order)

All agents MUST read these documents before starting:

1. **`/docs/COMPLETE_BACKEND_AUDIT.md`** - Complete feature requirements
2. **`/docs/SECURITY_RULES.md`** - NON-NEGOTIABLE security requirements
3. **`/docs/BACKEND_BUILD_PLAN.md`** - Original build specifications
4. **`/docs/CREDENTIALS_NEEDED.md`** - Credentials checklist

---

## ✅ PRE-BUILD VERIFICATION

### Environment Variables (ALL CONFIGURED ✓)
```bash
✅ NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dofl7l1cs
✅ CLOUDINARY_API_KEY=[configured]
✅ CLOUDINARY_API_SECRET=[configured]
✅ AIRTABLE_ACCESS_TOKEN=[configured]
✅ AIRTABLE_BASE_ID=appW3IAbtkgC0ycP2
✅ AIRTABLE_JOBS_TABLE_ID=tbltyoykvBzaAPucU
✅ AIRTABLE_APPLICATIONS_TABLE_ID=tblQ6S0JP91coAj2H
✅ AIRTABLE_GALLERY_TABLE_ID=tbl97PGfdvGSDk4Ti
✅ RESEND_API_KEY=[configured]
✅ RESEND_FROM_EMAIL=onboarding@resend.dev
✅ ADMIN_PASSWORD=PEGSecurity2025!
✅ NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Project State
- ✅ Next.js project running
- ✅ Frontend pages complete
- ✅ Contact form exists (needs backend)
- ✅ Careers page exists (hardcoded, needs database)
- ✅ Gallery page exists (hardcoded, needs database)
- ✅ All credentials configured

---

## 🎯 BUILD PHASES

### PHASE 1: FOUNDATION (8-12 hours)
**Agent**: `api-backend-builder`
**Priority**: CRITICAL

#### Tasks:
1. **Install Packages**
   ```bash
   npm install airtable resend next-cloudinary cloudinary jose lru-cache
   npm install --save-dev @types/node
   ```

2. **Create `/lib/airtable.ts`**
   - Airtable client initialization
   - TypeScript interfaces for all tables:
     - Contact_Submissions
     - Jobs
     - Applications
     - Gallery
   - Helper functions for CRUD operations
   - Reference: `/docs/COMPLETE_BACKEND_AUDIT.md` (Database Schemas section)

3. **Create `/lib/cloudinary.ts`**
   - Cloudinary configuration (server-side only)
   - URL builder function
   - Blur placeholder generator
   - Responsive srcset generator
   - Reference: `/docs/cloudinary-config.md`

4. **Create `/lib/resend.ts`**
   - Resend client initialization
   - Email template functions
   - Email sending wrapper with error handling
   - Reference: `/docs/COMPLETE_BACKEND_AUDIT.md` (Email Templates section)

5. **Create `/lib/whatsapp.ts`**
   - WhatsApp link generator
   - Template message functions
   - Reference: `/docs/COMPLETE_BACKEND_AUDIT.md` (WhatsApp section)

6. **Create `/lib/auth.ts`**
   - Session creation/verification
   - Password hashing (if needed)
   - Session cookie helpers
   - Reference: `/docs/SECURITY_RULES.md` (Authentication section)

7. **Create `/lib/validation.ts`**
   - Input validation functions
   - Email validation
   - Phone validation (South African format)
   - File validation
   - Sanitization functions
   - Reference: `/docs/SECURITY_RULES.md` (Input Validation section)

8. **Create `/lib/rate-limit.ts`**
   - Rate limiting implementation
   - IP-based throttling
   - Reference: `/docs/SECURITY_RULES.md` (Rate Limiting section)

9. **Create `/types/airtable.ts`**
   - All TypeScript interfaces
   - Consistent across project

10. **Test all utilities**
    - Test Airtable connection
    - Test Cloudinary connection
    - Test Resend connection

**Completion Criteria**:
- ✅ All packages installed
- ✅ All lib files created and working
- ✅ All connections tested
- ✅ TypeScript compiles without errors

---

### PHASE 2: ADMIN AUTHENTICATION (4-6 hours)
**Agent**: `security-specialist`
**Priority**: CRITICAL

#### Tasks:
1. **Create `/app/admin/login/page.tsx`**
   - Login form (password only)
   - Form validation
   - Error states
   - Loading states

2. **Create `/app/api/auth/login/route.ts`**
   - POST endpoint
   - Verify password against `ADMIN_PASSWORD` env var
   - Create session cookie (HttpOnly, Secure, SameSite)
   - Rate limiting (5 attempts per 15 minutes)
   - Log login attempts
   - Reference: `/docs/SECURITY_RULES.md` (Authentication section)

3. **Create `/app/api/auth/logout/route.ts`**
   - POST endpoint
   - Clear session cookie
   - Log logout

4. **Create `/middleware.ts`**
   - Protect all `/admin/*` and `/api/admin/*` routes
   - Check session validity
   - Redirect to login if no session
   - Reference: `/docs/SECURITY_RULES.md` (Authentication section)

5. **Test authentication flow**
   - Login with correct password
   - Login with wrong password (rate limiting)
   - Access admin route without login (redirect)
   - Access admin route with login (allowed)
   - Logout

**Completion Criteria**:
- ✅ Login page works
- ✅ Session creation works
- ✅ Middleware protects routes
- ✅ Rate limiting prevents brute force
- ✅ Logout works

---

### PHASE 3: CONTACT FORM BACKEND (4-6 hours)
**Agent**: `api-backend-builder`
**Priority**: HIGH

#### Tasks:
1. **Create Airtable table: `Contact_Submissions`**
   - Fields from `/docs/COMPLETE_BACKEND_AUDIT.md` section 1
   - Test manual record creation

2. **Create `/app/api/contact/submit/route.ts`**
   - POST endpoint (public)
   - Rate limiting (5 per hour per IP)
   - Input validation (all fields)
   - Sanitize inputs
   - Store in Airtable
   - Send confirmation email to customer
   - Send notification email to admin
   - Return success response
   - Reference: `/docs/SECURITY_RULES.md`

3. **Update `/app/contact/page.tsx`**
   - Change `handleSubmit` to call API
   - Handle loading state
   - Handle success response
   - Handle error response
   - Keep existing validation

4. **Test end-to-end**
   - Submit form
   - Verify Airtable record created
   - Verify confirmation email received
   - Verify admin notification received
   - Test rate limiting

**Completion Criteria**:
- ✅ Form submits to API
- ✅ Data stored in Airtable
- ✅ Emails sent
- ✅ Error handling works
- ✅ Rate limiting works

---

### PHASE 4: JOBS BACKEND (8-10 hours)
**Agent**: `api-backend-builder`
**Priority**: HIGH

#### Tasks:
1. **Create Airtable table: `Jobs`**
   - Fields from `/docs/COMPLETE_BACKEND_AUDIT.md` section 2
   - Migrate 6 hardcoded jobs to Airtable
   - Test queries

2. **Create `/app/api/careers/route.ts`**
   - GET endpoint (public)
   - Fetch all jobs where Status = "Open"
   - Sort by Posted Date DESC
   - Return JSON
   - ISR: revalidate every 900 seconds (15 min)

3. **Create `/app/api/careers/[slug]/route.ts`**
   - GET endpoint (public)
   - Fetch single job by slug
   - Return 404 if not found
   - ISR: revalidate every 900 seconds

4. **Update `/app/careers/page.tsx`**
   - Remove hardcoded `jobListings` array
   - Fetch from API on load
   - Keep existing UI and filtering
   - Handle loading state
   - Handle empty state

5. **Create `/app/careers/[slug]/page.tsx`** (NEW)
   - Individual job detail page
   - Fetch job from API
   - Display all job information
   - Include application form (next phase)
   - Generate static params for all jobs

6. **Test jobs display**
   - Jobs appear on careers page
   - Filtering works
   - Search works
   - Individual job pages work

**Completion Criteria**:
- ✅ Jobs stored in Airtable
- ✅ API endpoints work
- ✅ Careers page fetches from API
- ✅ Individual job pages work
- ✅ ISR revalidation configured

---

### PHASE 5: JOB APPLICATIONS (8-10 hours)
**Agent**: `api-backend-builder`
**Priority**: HIGH

#### Tasks:
1. **Create Airtable table: `Applications`**
   - Fields from `/docs/COMPLETE_BACKEND_AUDIT.md` section 2
   - Link to Jobs table
   - Test record creation with attachment

2. **Create `/components/careers/ApplicationForm.tsx`**
   - All form fields from audit document
   - File upload for CV (PDF/DOCX, max 5MB)
   - Client-side validation
   - Loading states
   - Success/error states
   - Reference: `/docs/COMPLETE_BACKEND_AUDIT.md` section 2

3. **Create `/app/api/careers/[id]/apply/route.ts`**
   - POST endpoint (public)
   - Rate limiting (3 per hour per IP)
   - Validate all inputs (server-side)
   - Validate CV file (type, size, content)
   - Upload CV to Airtable as attachment
   - Store application in Airtable
   - Link to job
   - Send confirmation email to applicant
   - Send notification email to admin
   - Reference: `/docs/SECURITY_RULES.md` (File Upload section)

4. **Add ApplicationForm to job detail page**
   - Below job description
   - Passes job ID to form

5. **Test application submission**
   - Fill form and submit
   - Verify Airtable record created
   - Verify CV attached
   - Verify emails sent
   - Test file validation (wrong type, too large)
   - Test rate limiting

**Completion Criteria**:
- ✅ Application form works
- ✅ CV uploads to Airtable
- ✅ Application stored correctly
- ✅ Emails sent
- ✅ File validation works
- ✅ Rate limiting works

---

### PHASE 6: ADMIN DASHBOARD (6-8 hours)
**Agent**: `admin-ui-builder`
**Priority**: HIGH

#### Tasks:
1. **Create `/app/admin/layout.tsx`**
   - Admin navigation sidebar
   - Links to: Dashboard, Jobs, Applications, Gallery, Contacts
   - Current page indicator
   - Logout button
   - Responsive (collapsible on mobile)

2. **Create `/app/admin/page.tsx`** (Dashboard)
   - Metrics widgets:
     - Total contact submissions (7/30/90 days)
     - New applications count
     - Open jobs count
     - Gallery images count
   - Recent activity (last 10 actions)
   - Quick action buttons
   - Application status pie chart
   - Top 5 jobs by applications

3. **Create `/app/api/admin/dashboard/stats/route.ts`**
   - GET endpoint (admin only)
   - Fetch all dashboard metrics from Airtable
   - Return JSON

4. **Style admin interface**
   - Clean, professional design
   - Consistent with brand colors
   - Responsive layout

**Completion Criteria**:
- ✅ Dashboard displays
- ✅ Metrics load correctly
- ✅ Navigation works
- ✅ Responsive on tablet/desktop

---

### PHASE 7: ADMIN - JOB MANAGEMENT (10-12 hours)
**Agent**: `admin-ui-builder`
**Priority**: HIGH

#### Tasks:
1. **Create `/app/admin/jobs/page.tsx`**
   - List all jobs (table view)
   - Columns: Title, Category, Location, Type, Status, Applications, Actions
   - Filters: Status, Category
   - Sort: Date, Title
   - Actions: Edit, View Applications, Delete
   - "Create Job" button

2. **Create `/app/admin/jobs/new/page.tsx`**
   - Job creation form
   - All fields from audit document
   - Rich text editor for descriptions/requirements/benefits
   - Validation
   - Preview mode
   - Save as Draft or Publish

3. **Create `/app/admin/jobs/[id]/page.tsx`**
   - Job edit form (same as create)
   - Pre-filled with existing data
   - Delete button (with confirmation)
   - Status toggle
   - View applications button

4. **Create `/app/api/admin/jobs/route.ts`**
   - GET: Fetch all jobs (admin only)
   - POST: Create new job (admin only)

5. **Create `/app/api/admin/jobs/[id]/route.ts`**
   - GET: Fetch single job (admin only)
   - PUT: Update job (admin only)
   - DELETE: Delete job (admin only)

6. **Test CRUD operations**
   - Create job
   - Edit job
   - Change status
   - Delete job
   - View list

**Completion Criteria**:
- ✅ Job list displays
- ✅ Create job works
- ✅ Edit job works
- ✅ Delete job works (with confirmation)
- ✅ Status toggle works

---

### PHASE 8: ADMIN - APPLICATIONS MANAGEMENT (10-12 hours)
**Agent**: `admin-ui-builder`
**Priority**: HIGH

#### Tasks:
1. **Create `/app/admin/applications/page.tsx`**
   - List all applications (table view)
   - Columns: Name, Job, Applied Date, Status, Actions
   - Filters: Job, Status, Date Range
   - Search by name/email
   - Sort: Date, Name, Status
   - Actions: View Details
   - Status badge colors

2. **Create `/app/admin/applications/[id]/page.tsx`**
   - Full application details
   - All form fields displayed
   - CV download button
   - Status dropdown (update)
   - Admin notes textarea
   - Email applicant button (dropdown: templates)
   - WhatsApp button
   - Application history/timeline

3. **Create `/components/admin/EmailModal.tsx`**
   - Modal with email template selection
   - Templates: Under Review, Interview, Shortlisted, Rejected
   - Pre-filled with applicant data
   - Editable message
   - Send button

4. **Create `/app/api/admin/applications/route.ts`**
   - GET: Fetch all applications (admin only)
   - Supports filtering, search, pagination

5. **Create `/app/api/admin/applications/[id]/route.ts`**
   - GET: Fetch single application (admin only)
   - PUT: Update application (status, notes) (admin only)

6. **Create `/app/api/admin/applications/[id]/email/route.ts`**
   - POST: Send email to applicant (admin only)
   - Template parameter
   - Uses Resend
   - Logs email sent

7. **Test application management**
   - View applications
   - Filter and search
   - Update status
   - Add notes
   - Send email
   - Download CV
   - Use WhatsApp button

**Completion Criteria**:
- ✅ Application list works
- ✅ Filters/search work
- ✅ Application detail displays
- ✅ Status update works
- ✅ Notes save
- ✅ Email sending works
- ✅ CV download works
- ✅ WhatsApp link works

---

### PHASE 9: GALLERY BACKEND (8-10 hours)
**Agent**: `media-asset-manager`
**Priority**: HIGH

#### Tasks:
1. **Create Airtable table: `Gallery`**
   - Fields from `/docs/COMPLETE_BACKEND_AUDIT.md` section 3
   - Test record creation

2. **Migrate hardcoded gallery to Airtable**
   - Upload all 25 images to Cloudinary
   - Create Airtable records with URLs
   - Test queries

3. **Create `/app/api/gallery/route.ts`**
   - GET endpoint (public)
   - Fetch all images where Status = "Published"
   - Sort by Display Order
   - Return JSON
   - ISR: revalidate every 1800 seconds (30 min)

4. **Update `/app/gallery/page.tsx`**
   - Remove hardcoded `galleryItems` array
   - Fetch from API
   - Keep existing UI, filters, lightbox
   - Handle loading state
   - Handle empty state

5. **Test gallery display**
   - Images load from Cloudinary
   - Filters work
   - Lightbox works
   - Images optimized

**Completion Criteria**:
- ✅ Gallery items in Airtable
- ✅ API endpoint works
- ✅ Gallery page fetches from API
- ✅ All existing features work

---

### PHASE 10: ADMIN - GALLERY MANAGEMENT (8-10 hours)
**Agent**: `media-asset-manager` + `admin-ui-builder`
**Priority**: HIGH

#### Tasks:
1. **Create `/app/admin/gallery/page.tsx`**
   - Grid view of all gallery items
   - Thumbnail, Title, Category, Status, Actions
   - Filters: Category, Status
   - Sort: Order, Date, Title
   - Actions: Edit, Delete
   - "Upload Image" button
   - Drag & drop reordering (optional)

2. **Create `/app/admin/gallery/new/page.tsx`**
   - Cloudinary upload widget integration
   - Metadata form:
     - Title (required)
     - Description (required)
     - Category (required)
     - Tags
     - Alt Text (required)
     - Featured checkbox
     - Status (Draft/Published)
     - Display Order
   - Image preview
   - Save button

3. **Create `/app/admin/gallery/[id]/page.tsx`**
   - Edit form (same as create)
   - Pre-filled with existing data
   - Image preview
   - Delete button (with confirmation)
   - Replace image button

4. **Create `/app/api/admin/gallery/route.ts`**
   - GET: Fetch all gallery items (admin only)
   - POST: Create new gallery item (admin only)

5. **Create `/app/api/admin/gallery/[id]/route.ts`**
   - GET: Fetch single item (admin only)
   - PUT: Update item (admin only)
   - DELETE: Delete item (admin only)

6. **Test gallery management**
   - Upload image to Cloudinary
   - Save metadata
   - Image appears on gallery page
   - Edit metadata
   - Delete image
   - Reorder images

**Completion Criteria**:
- ✅ Gallery list works
- ✅ Upload to Cloudinary works
- ✅ Metadata saves to Airtable
- ✅ Edit works
- ✅ Delete works
- ✅ Images display on public gallery

---

### PHASE 11: ADMIN - CONTACT SUBMISSIONS (4-6 hours)
**Agent**: `admin-ui-builder`
**Priority**: MEDIUM

#### Tasks:
1. **Create `/app/admin/contacts/page.tsx`**
   - List all contact submissions
   - Columns: Name, Email, Service Type, Date, Status, Actions
   - Filters: Status, Service Type, Date Range
   - Sort: Date, Name
   - Actions: View Details, Mark Resolved

2. **Create `/app/admin/contacts/[id]/page.tsx`**
   - Full submission details
   - Status dropdown
   - Admin notes textarea
   - Email button
   - WhatsApp button

3. **Create `/app/api/admin/contacts/route.ts`**
   - GET: Fetch all submissions (admin only)

4. **Create `/app/api/admin/contacts/[id]/route.ts`**
   - GET: Fetch single submission (admin only)
   - PUT: Update submission (status, notes) (admin only)

**Completion Criteria**:
- ✅ Contact submissions list displays
- ✅ Details page works
- ✅ Status update works
- ✅ Notes save

---

### PHASE 12: SECURITY HARDENING (6-8 hours)
**Agent**: `security-specialist`
**Priority**: CRITICAL

#### Tasks:
1. **Audit all API routes**
   - Verify authentication required for admin routes
   - Verify input validation on all endpoints
   - Verify rate limiting configured
   - Verify error handling doesn't leak info

2. **Security headers**
   - Configure in `next.config.js`
   - Reference: `/docs/SECURITY_RULES.md` (Security Headers section)

3. **CSRF protection**
   - Implement CSRF tokens on admin forms
   - Reference: `/docs/SECURITY_RULES.md` (CSRF section)

4. **Admin action logging**
   - Log all create/update/delete actions
   - Log login attempts
   - Reference: `/docs/SECURITY_RULES.md` (Logging section)

5. **File upload security**
   - Verify MIME type validation
   - Verify size limits
   - Verify malicious content check
   - Reference: `/docs/SECURITY_RULES.md` (File Upload section)

6. **Penetration testing**
   - Test SQL injection (N/A for Airtable, but test ID validation)
   - Test XSS attacks
   - Test CSRF attacks
   - Test rate limit bypass
   - Test authentication bypass
   - Test file upload exploits

7. **Security audit checklist**
   - Complete checklist from `/docs/SECURITY_RULES.md`

**Completion Criteria**:
- ✅ All API routes secured
- ✅ Security headers configured
- ✅ CSRF protection active
- ✅ Logging implemented
- ✅ Penetration tests passed
- ✅ Security checklist complete

---

### PHASE 13: TESTING & QA (8-10 hours)
**Agent**: `testing-qa-specialist`
**Priority**: HIGH

#### Tasks:
1. **Functional testing**
   - Test all user flows:
     - Contact form submission
     - Job browsing
     - Job application
     - Admin login
     - Job management (CRUD)
     - Application management
     - Gallery management
     - Contact submissions management
   - Test all filters and search
   - Test all emails
   - Test all WhatsApp links

2. **Error handling testing**
   - Test with invalid inputs
   - Test with missing fields
   - Test with oversized files
   - Test with wrong file types
   - Test with expired sessions
   - Test with network errors

3. **Cross-browser testing**
   - Chrome
   - Firefox
   - Safari
   - Edge

4. **Responsive testing**
   - Mobile (320px, 375px, 414px)
   - Tablet (768px, 1024px)
   - Desktop (1280px, 1920px)

5. **Performance testing**
   - Page load times
   - Image loading
   - API response times
   - Lighthouse audit (target 90+)

6. **Accessibility testing**
   - Keyboard navigation
   - Screen reader testing
   - Color contrast
   - ARIA labels

7. **Bug fixing**
   - Fix all issues found
   - Retest fixes

**Completion Criteria**:
- ✅ All functional tests pass
- ✅ All error cases handled
- ✅ Works in all browsers
- ✅ Fully responsive
- ✅ Lighthouse score 90+
- ✅ Accessibility tests pass
- ✅ No critical bugs remain

---

### PHASE 14: DOCUMENTATION (4-6 hours)
**Agent**: `general-purpose`
**Priority**: MEDIUM

#### Tasks:
1. **Admin User Guide** (`/docs/ADMIN_USER_GUIDE.md`)
   - How to log in
   - How to create/edit jobs
   - How to review applications
   - How to send emails
   - How to manage gallery
   - How to view contact submissions
   - Screenshots

2. **API Documentation** (`/docs/API_DOCUMENTATION.md`)
   - All endpoints
   - Request/response formats
   - Authentication requirements
   - Error codes

3. **Troubleshooting Guide** (`/docs/TROUBLESHOOTING.md`)
   - Common issues and solutions
   - How to check logs
   - How to verify connections

4. **Deployment Guide** (`/docs/DEPLOYMENT_GUIDE.md`)
   - Environment variables
   - Vercel deployment steps
   - Post-deployment checklist

**Completion Criteria**:
- ✅ All documentation complete
- ✅ Clear and comprehensive
- ✅ Screenshots included
- ✅ Easy to follow

---

### PHASE 15: DEPLOYMENT (2-4 hours)
**Agent**: `deployment-devops`
**Priority**: HIGH

#### Tasks:
1. **Pre-deployment**
   - Final build test (`npm run build`)
   - Security audit
   - Performance check
   - Backup current .env.local

2. **Vercel deployment**
   - Connect GitHub repo
   - Configure environment variables
   - Set up custom domain (if ready)
   - Configure ISR revalidation

3. **Post-deployment testing**
   - Test all functionality in production
   - Verify environment variables work
   - Test email sending
   - Test file uploads
   - Test authentication
   - Monitor error logs

4. **Go live**
   - Update DNS (if custom domain)
   - Monitor for 24 hours
   - Fix any issues immediately

**Completion Criteria**:
- ✅ Deployed to production
- ✅ All functionality works
- ✅ No errors in logs
- ✅ Performance acceptable
- ✅ Monitoring active

---

## 📊 PROGRESS TRACKING

### Overall Progress
- [ ] Phase 1: Foundation (0%)
- [ ] Phase 2: Admin Authentication (0%)
- [ ] Phase 3: Contact Form Backend (0%)
- [ ] Phase 4: Jobs Backend (0%)
- [ ] Phase 5: Job Applications (0%)
- [ ] Phase 6: Admin Dashboard (0%)
- [ ] Phase 7: Admin - Job Management (0%)
- [ ] Phase 8: Admin - Applications Management (0%)
- [ ] Phase 9: Gallery Backend (0%)
- [ ] Phase 10: Admin - Gallery Management (0%)
- [ ] Phase 11: Admin - Contact Submissions (0%)
- [ ] Phase 12: Security Hardening (0%)
- [ ] Phase 13: Testing & QA (0%)
- [ ] Phase 14: Documentation (0%)
- [ ] Phase 15: Deployment (0%)

### Estimated Timeline
- **Total Estimated Hours**: 100-130 hours
- **With 2-3 agents working in parallel**: 2-3 weeks
- **Target Completion**: December 1, 2025

---

## 🚀 EXECUTION COMMANDS

### Start Autonomous Build

**Option 1: Sequential Build (Safest)**
```
Execute phases 1-15 in order, one agent at a time.
Each phase must complete before next begins.
```

**Option 2: Parallel Build (Faster)**
```
Phase 1: 1 agent (Foundation - must complete first)
Phases 2-3: 2 agents in parallel
Phases 4-5: 2 agents in parallel
Phases 6-8: 2 agents in parallel
Phases 9-11: 2 agents in parallel
Phase 12: 1 agent (Security - must complete)
Phase 13: 1 agent (Testing - must complete)
Phases 14-15: 1 agent
```

### Agent Assignments (Parallel Build)
```
Agent 1: api-backend-builder
- Phase 1 (solo)
- Phase 3 (parallel with Agent 2)
- Phase 4 (parallel with Agent 2)

Agent 2: security-specialist
- Phase 2 (parallel with Agent 1 Phase 3)
- Phase 5 (parallel with Agent 1 Phase 4)
- Phase 12 (solo)

Agent 3: admin-ui-builder
- Phase 6 (after Phase 1)
- Phase 7 (after Phase 4)
- Phase 8 (after Phase 5)
- Phase 11 (after Phase 3)

Agent 4: media-asset-manager
- Phase 9 (after Phase 1)
- Phase 10 (after Phase 9)

Agent 5: testing-qa-specialist
- Phase 13 (after Phase 12)

Agent 6: deployment-devops
- Phase 15 (after Phase 13)

Agent 7: general-purpose
- Phase 14 (parallel with Phase 15)
```

---

## ✅ COMPLETION CRITERIA

### Feature Completeness
- [ ] ✅ Contact form submits to database
- [ ] ✅ Jobs fetched from database
- [ ] ✅ Applications submit with CV
- [ ] ✅ Gallery fetched from database
- [ ] ✅ Admin can log in
- [ ] ✅ Admin can manage jobs
- [ ] ✅ Admin can manage applications
- [ ] ✅ Admin can manage gallery
- [ ] ✅ Admin can view contact submissions
- [ ] ✅ Emails send correctly
- [ ] ✅ WhatsApp links work

### Security
- [ ] ✅ All admin routes protected
- [ ] ✅ All inputs validated
- [ ] ✅ Rate limiting active
- [ ] ✅ CSRF protection active
- [ ] ✅ File uploads secured
- [ ] ✅ Sessions expire properly
- [ ] ✅ Logs capture admin actions
- [ ] ✅ Security audit passed

### Performance
- [ ] ✅ Homepage < 2s load time
- [ ] ✅ Lighthouse score 90+
- [ ] ✅ Images optimized
- [ ] ✅ ISR configured

### Quality
- [ ] ✅ All tests pass
- [ ] ✅ No critical bugs
- [ ] ✅ Responsive on all devices
- [ ] ✅ Accessible (WCAG AA)
- [ ] ✅ Documentation complete

---

## 🎓 AGENT GUIDELINES

### Before Starting
1. ✅ Read ALL referenced documentation
2. ✅ Understand security requirements
3. ✅ Verify credentials configured
4. ✅ Plan before coding

### During Development
1. ✅ Follow security rules strictly
2. ✅ Write TypeScript (no `any` types)
3. ✅ Validate all inputs
4. ✅ Handle all errors
5. ✅ Test as you build
6. ✅ Comment complex logic
7. ✅ Use consistent code style

### After Completion
1. ✅ Test your work thoroughly
2. ✅ Update progress tracking
3. ✅ Document any issues
4. ✅ Hand off to next agent

---

## 🚨 CRITICAL REMINDERS

1. **NEVER** commit secrets to git
2. **ALWAYS** follow `/docs/SECURITY_RULES.md`
3. **ALWAYS** validate input server-side
4. **ALWAYS** test before marking complete
5. **NEVER** skip security measures "for speed"
6. **ALWAYS** use TypeScript properly
7. **ALWAYS** handle errors gracefully
8. **NEVER** expose internal details in errors
9. **ALWAYS** rate limit public endpoints
10. **ALWAYS** require auth for admin endpoints

---

## 📞 SUPPORT & ESCALATION

### If Stuck
1. Review relevant documentation
2. Check error logs
3. Test individual components
4. Ask for clarification if needed

### If Blocked
1. Document the blocker
2. Note what was tried
3. Suggest alternatives
4. Escalate to build owner

### Build Owner
**Name**: Bakiel
**Email**: bakiel@pegsecurity.co.za
**Phone**: +27 79 413 9180

---

## 🎯 FINAL CHECKLIST

Before marking build as COMPLETE:

- [ ] All features working
- [ ] All security rules followed
- [ ] All tests passing
- [ ] Documentation complete
- [ ] Deployed to production
- [ ] Monitoring active
- [ ] Build owner notified
- [ ] Handover complete

---

## ✅ BUILD STATUS

**Current Status**: 🟡 READY TO START
**Next Action**: Begin Phase 1 - Foundation
**Estimated Start**: Immediate
**Estimated Completion**: December 1, 2025

---

**THIS BUILD PLAN IS COMPLETE AND READY FOR AUTONOMOUS EXECUTION**

🚀 **AGENTS: YOU MAY PROCEED**
