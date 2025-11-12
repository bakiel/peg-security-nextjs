# Placeholder Data Setup Instructions

## ⚠️ Airtable Token Permission Issue

The seeding script failed because the Airtable Personal Access Token (PAT) doesn't have **write permissions** to create records.

**Error received:**
```
AirtableError {
  error: 'NOT_AUTHORIZED',
  message: 'You are not authorized to perform this operation',
  statusCode: 403
}
```

---

## 🔧 Two Options to Add Placeholder Data

### **Option 1: Update Airtable Token Permissions** (Recommended)

1. Go to [Airtable Account](https://airtable.com/account)
2. Navigate to **Personal access tokens**
3. Find your token: `patScbZafXDSAxEDY...`
4. Click **Edit** and ensure these permissions are enabled:
   - ✅ `data.records:read` (already enabled)
   - ✅ `data.records:write` (**ADD THIS**)
   - ✅ `schema.bases:read` (if needed)

5. Update token scopes to include:
   - Base: `appW3IAbtkgC0ycP2` (PEG Security Base)
   - Tables: All 4 tables (Contacts, Jobs, Applications, Gallery)

6. Save changes and rerun the seeding script:
   ```bash
   node scripts/seed-placeholder-data.js
   ```

---

### **Option 2: Manually Add Records in Airtable** (Temporary Solution)

Use the Airtable web interface or admin system to add sample data:

#### **A. Using Airtable Web Interface**

1. Open [your Airtable base](https://airtable.com/appW3IAbtkgC0ycP2)

2. **Contacts Table** (`tbl7NKGLK6y2WA4Rc`)
   - Add 3-5 contact submissions with:
     - Name, Email, Phone
     - Service Type (Armed Response, CCTV, etc.)
     - Message
     - Status: New, Read, or Responded
     - Submitted At: Recent timestamps

3. **Jobs Table** (`tbltyoykvBzaAPucU`)
   - Add 2-3 job listings with:
     - Title, Category, Location
     - Employment Type (Full-time/Part-time)
     - PSIRA Required (checkbox)
     - Description, Responsibilities, Requirements, Benefits
     - Status: Open (or Draft)
     - Created At, Updated At

4. **Applications Table** (`tblQ6S0JP91coAj2H`)
   - Add 3-5 applications with:
     - Job ID (link to Jobs table)
     - Job Title
     - Applicant Name, Email, Phone
     - CV URL (use placeholder: `https://res.cloudinary.com/demo/raw/upload/sample.pdf`)
     - Cover Letter
     - PSIRA Registered (checkbox)
     - Years Experience
     - Status: New, Reviewing, Interviewed, etc.

5. **Gallery Table** (`tbl97PGfdvGSDk4Ti`)
   - Add 3-5 gallery images with:
     - Title, Description
     - Category (Armed Response, CCTV Installation, etc.)
     - Image URL (use Unsplash placeholders):
       - `https://images.unsplash.com/photo-1574077479297-f4b0b493dc2a?w=1920&q=80`
       - `https://images.unsplash.com/photo-1558002038-1055907df827?w=1920&q=80`
     - Thumbnail URL (same as Image URL with `w=400&h=300`)
     - Status: Active
     - Display Order: 1, 2, 3...

---

#### **B. Using the Admin System UI** (Better!)

1. **Login to Admin Panel:**
   ```
   http://localhost:3000/admin/login
   Username: admin
   Password: PEGSecurity2025!
   ```

2. **Create Jobs:**
   - Go to `/admin/jobs`
   - Click "Create Job"
   - Fill in the form and set Status to "Open"
   - Create 2-3 job listings

3. **Upload Gallery Images:**
   - Go to `/admin/gallery`
   - Click "Upload Image"
   - Use free stock images from [Unsplash](https://unsplash.com/s/photos/security)
   - Add 3-5 images with different categories

4. **Simulate Contact Submissions:**
   - Go to the public contact form: `http://localhost:3000/contact`
   - Submit 2-3 test contact forms
   - They will appear in `/admin/messages`

5. **Simulate Job Applications:**
   - Go to the public careers page: `http://localhost:3000/careers`
   - Click "Apply" on a job
   - Submit 2-3 test applications with dummy CVs
   - They will appear in `/admin/applications`

---

## 📊 Sample Data Reference

The seeding script (`scripts/seed-placeholder-data.js`) contains realistic sample data you can manually copy:

- **5 contact submissions** (various service types and statuses)
- **4 job listings** (Armed Response, Security Guard, CCTV Technician, Control Room)
- **5 job applications** (linked to the jobs above)
- **6 gallery images** (using Unsplash placeholder URLs)

Review the script file for exact field values to manually enter.

---

## ✅ Testing After Adding Data

1. **Restart the dev server** if needed:
   ```bash
   cd /Users/mac/Downloads/PEG_Security_Profile_Design_Project/peg-security-nextjs
   npm run dev
   ```

2. **Login to admin panel:**
   ```
   http://localhost:3000/admin/login
   ```

3. **Verify Dashboard Stats:**
   - Should show counts for pending applications, unread messages, active jobs, gallery images
   - Recent activity should display latest submissions

4. **Check Each Admin Page:**
   - `/admin/messages` - Should list contact submissions
   - `/admin/applications` - Should list job applications with CV links
   - `/admin/jobs` - Should list all jobs (Open, Draft, Closed)
   - `/admin/gallery` - Should show image grid

5. **Test Public APIs:**
   - `http://localhost:3000/api/jobs` - Returns only Open jobs
   - `http://localhost:3000/api/gallery` - Returns only Active images

---

## 🔐 Security Note

The Airtable token in `.env.local` should have **READ and WRITE** permissions for testing, but in production:
- Use environment-specific tokens
- Limit permissions to only what's needed
- Never commit `.env.local` to git (already in .gitignore)

---

## 🚀 Next Steps

Once you have placeholder data:
1. Test all admin CRUD operations
2. Verify dashboard displays real stats
3. Test search and filtering in DataTables
4. Check status update workflows
5. Test public APIs return correct data
6. Proceed with deployment checklist (see `DEPLOYMENT_CHECKLIST.md`)

---

**Current Server Status:**
- ✅ Development server running on `http://localhost:3000`
- ✅ Bug fixes applied (Airtable query handling)
- ⏳ Waiting for placeholder data to be added
- 📝 Admin credentials: `admin` / `PEGSecurity2025!`
