# PEG Security - Autonomous Build Plan

**Project**: Complete Full-Stack Integration
**Status**: Ready for Autonomous Execution
**Total Tasks**: 30
**Estimated Completion**: 7-11 hours

---

## 🎯 Build Objectives

Transform the current frontend + backend foundation into a **fully functional, production-ready admin system** with complete data flow from frontend → API → Airtable → Admin Dashboard.

---

## 📋 Build Phases

### **Phase 1: Admin Backend APIs (Tasks 1-17)**
Build all admin CRUD API routes with proper authentication, validation, and Airtable integration.

**Dependencies**:
- ✅ `/lib/airtable.ts` exists
- ✅ `/lib/auth.ts` exists
- ✅ `/middleware.ts` protects admin routes

**Deliverables**:
- Contact submissions management APIs
- Job applications management APIs
- Jobs CRUD APIs
- Gallery CRUD APIs

---

### **Phase 2: Admin UI Pages (Tasks 3-4, 6-7, 11-13, 17)**
Build admin interface pages for managing all data with tables, forms, and actions.

**Dependencies**:
- Phase 1 APIs must be completed first
- ✅ Admin dashboard exists at `/admin/dashboard`

**Deliverables**:
- `/admin/messages` - Contact submissions table
- `/admin/applications` - Job applications with CV viewing
- `/admin/jobs` - Jobs list with actions
- `/admin/jobs/new` - Create job form
- `/admin/jobs/[id]/edit` - Edit job form
- `/admin/gallery` - Gallery management with uploads

---

### **Phase 3: Frontend Integration (Tasks 18-20)**
Connect public-facing pages to backend APIs for dynamic data.

**Dependencies**:
- Phase 1 APIs must be completed
- ✅ Frontend pages exist

**Deliverables**:
- Careers page fetches real jobs
- Gallery page fetches real images
- Dashboard shows real stats

---

### **Phase 4: Polish & UX (Tasks 21-23)**
Add loading states, error handling, and success feedback.

**Dependencies**:
- Phases 1-3 must be completed

**Deliverables**:
- Loading skeletons on all pages
- Error toast notifications
- Success confirmations
- Empty states with CTAs

---

### **Phase 5: End-to-End Testing (Tasks 24-27)**
Test complete user flows from frontend to backend to admin.

**Dependencies**:
- All previous phases completed

**Test Scenarios**:
1. User submits contact form → Admin sees in messages → Admin responds
2. User applies for job with CV → Admin views application → Admin updates status
3. Admin creates job → Job appears on careers page → User can apply
4. Admin uploads gallery image → Image appears on gallery page

---

### **Phase 6: Deployment (Tasks 28-30)**
Deploy to Vercel production and verify everything works live.

**Dependencies**:
- All phases completed and tested locally

**Tasks**:
- Create Airtable tables with correct schemas
- Verify all environment variables in Vercel
- Deploy and test on live URL

---

## 🔑 Critical Success Factors

### **1. Airtable Table Structure**
Must create these tables in Airtable before deployment:

**Contacts Table:**
```
Fields:
- Name (Single line text)
- Email (Email)
- Phone (Phone number)
- Service Type (Single select: Armed Response, CCTV, Access Control, etc.)
- Message (Long text)
- Status (Single select: New, Read, Responded)
- Submitted At (Date)
- Notes (Long text)
```

**Applications Table:**
```
Fields:
- Job ID (Single line text)
- Job Title (Single line text)
- Applicant Name (Single line text)
- Applicant Email (Email)
- Applicant Phone (Phone number)
- CV URL (URL)
- CV Public ID (Single line text)
- Cover Letter (Long text)
- PSIRA Registered (Checkbox)
- PSIRA Number (Single line text)
- Years Experience (Number)
- Status (Single select: New, Reviewing, Interviewed, Hired, Rejected)
- Submitted At (Date)
- Notes (Long text)
```

**Jobs Table:**
```
Fields:
- Title (Single line text)
- Slug (Single line text)
- Category (Single select: Armed Response, CCTV Installation, etc.)
- Location (Single line text)
- Employment Type (Single select: Full-time, Part-time, Contract)
- PSIRA Required (Checkbox)
- Description (Long text)
- Responsibilities (Long text) - Newline separated
- Requirements (Long text) - Newline separated
- Benefits (Long text) - Newline separated
- Status (Single select: Draft, Open, Closed)
- Created At (Date)
- Updated At (Date)
- Application Count (Number)
```

**Gallery Table:**
```
Fields:
- Title (Single line text)
- Image URL (URL)
- Public ID (Single line text)
- Category (Single select: Armed Response, CCTV, Access Control, etc.)
- Caption (Long text)
- Featured (Checkbox)
- Order (Number)
- Created At (Date)
```

### **2. Environment Variables**
All 15 variables must be set in Vercel:

```bash
# Cloudinary (4)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dofl7l1cs
CLOUDINARY_API_KEY=245226725965876
CLOUDINARY_API_SECRET=_kv98aZjEvoXtcp-Ks1o86l7JHU
CLOUDINARY_URL=cloudinary://...

# Airtable (5)
AIRTABLE_ACCESS_TOKEN=patScbZafXDSAxEDY...
AIRTABLE_BASE_ID=appW3IAbtkgC0ycP2
AIRTABLE_JOBS_TABLE_ID=tbltyoykvBzaAPucU
AIRTABLE_APPLICATIONS_TABLE_ID=tblQ6S0JP91coAj2H
AIRTABLE_GALLERY_TABLE_ID=tbl97PGfdvGSDk4Ti

# Resend (2)
RESEND_API_KEY=re_eMcppYog_...
RESEND_FROM_EMAIL=onboarding@resend.dev

# Auth (2)
ADMIN_PASSWORD=PEGSecurity2025!
JWT_SECRET=TdW78I69KUOVc0jswMBLl5frmP45MZnHfPZ83W5NI9U=

# App Config (2)
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://peg-security-nextjs.vercel.app
```

### **3. Code Quality Standards**
- All API routes must have authentication checks
- All inputs must be validated and sanitized
- All errors must be caught and logged
- All operations must have loading states
- All forms must have validation
- All CRUD operations must have confirmations

### **4. UI/UX Standards**
- Loading states on all async operations
- Error messages in red toasts
- Success messages in green toasts
- Empty states with helpful CTAs
- Mobile-responsive on all pages
- Consistent PEG Security branding (#D0B96D gold, #292B2B dark)

---

## 🚀 Execution Strategy

### **For Autonomous Agent:**

1. **Start with Task 1** and work sequentially
2. **Mark task as in_progress** before starting
3. **Complete the task** fully before moving to next
4. **Mark task as completed** when done
5. **Test the feature** after completing related tasks
6. **Update DEPLOYMENT_STATUS.md** at each milestone

### **Build Order:**
```
Tasks 1-2   → Contact APIs (30 min)
Task 3      → DataTable component (45 min)
Task 4      → Messages page (45 min)
Tasks 5-7   → Applications APIs + page (90 min)
Tasks 8-13  → Jobs CRUD APIs + pages (3 hours)
Tasks 14-17 → Gallery APIs + page (90 min)
Tasks 18-20 → Frontend integration (90 min)
Tasks 21-23 → Polish & UX (60 min)
Tasks 24-27 → Testing (60 min)
Tasks 28-30 → Deployment (30 min)
```

---

## 📊 Progress Tracking

**Completed**: 0/30 tasks (0%)
**Current Phase**: Phase 1 - Admin Backend APIs
**Next Task**: Task 1 - Create GET /api/admin/contacts route

---

## 🎓 Learning Outcomes

After completing this build, the system will have:
- ✅ Complete admin CRUD for all data entities
- ✅ Real-time data sync between frontend and Airtable
- ✅ Secure authentication and authorization
- ✅ File uploads to Cloudinary
- ✅ Email notifications via Resend
- ✅ Professional admin dashboard
- ✅ Production-ready deployment on Vercel

---

## 📞 Support

**Technical Lead**: Bakiel
**Email**: bakiel@pegsecurity.co.za
**Phone**: +27 79 413 9180

---

**Status**: Ready for execution
**Last Updated**: November 11, 2025
**Build Version**: v1.0.0
