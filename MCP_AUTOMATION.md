# 🤖 MCP-Powered Automation Setup

**Automatic Supabase Configuration via MCP Tools**

This guide shows you how to use MCP (Model Context Protocol) and automation scripts to set up your entire Supabase backend without manual clicking.

---

## 🎯 What Can Be Automated

### ✅ Fully Automated (Via Scripts)
- ✅ Storage bucket creation
- ✅ Bucket configuration (public/private, size limits, MIME types)
- ✅ SQL policy generation
- ✅ Database verification
- ✅ Storage testing

### ⚠️ Partially Automated (SQL Copy/Paste Required)
- ⚠️ RLS (Row Level Security) policies
- ⚠️ Storage policies
- ⚠️ Database triggers and functions

### ❌ Manual Only (For Now)
- ❌ Authentication providers (Google, GitHub, etc.)
- ❌ Custom domains
- ❌ Email templates
- ❌ Project settings

---

## 🚀 Quick Start

### 1. **Complete Automated Setup**

Run this single command to set up everything:

```bash
npm run setup:complete
```

**What it does:**
- ✅ Creates all storage buckets (cvs, gallery, team-photos)
- ✅ Configures bucket settings (public/private, size limits)
- ✅ Generates all RLS policies SQL
- ✅ Saves SQL to `supabase/policies-complete.sql`
- ✅ Verifies setup completion

**Output:**
```
🚀 PEG Security - Complete Supabase Setup

═══════════════════════════════════════════════
1️⃣  CREATING STORAGE BUCKETS
═══════════════════════════════════════════════

📦 CVs
   ID: cvs
   Public: No
   Size Limit: 5.0MB
   ✅ Created successfully!

📦 Gallery
   ID: gallery
   Public: Yes
   Size Limit: 10.0MB
   ✅ Created successfully!

📊 Total buckets in project: 3
   ✅ Created: 3
   ⏭️  Skipped: 0
   ❌ Failed: 0

═══════════════════════════════════════════════
2️⃣  GENERATING RLS POLICIES
═══════════════════════════════════════════════

📝 SQL saved to: supabase/policies-complete.sql

🎯 Next Steps:
   1. Run the policies SQL in Supabase SQL Editor
   2. Copy contents from: supabase/policies-complete.sql
   3. Click RUN in SQL Editor
```

---

### 2. **Run the Generated SQL**

After setup completes:

1. **Open SQL Editor:**
   ```
   https://supabase.com/dashboard/project/ujiaeiqslzwmpvkyixdp/sql/new
   ```

2. **Copy SQL file:**
   ```bash
   cat supabase/policies-complete.sql | pbcopy
   ```

3. **Paste in SQL Editor** and click **RUN**

---

### 3. **Verify Everything Works**

```bash
# Verify database tables
npm run verify:db

# Test storage buckets
npm run test:storage
```

---

## 📚 Individual Commands

### Database Setup
```bash
# Set up database schema only
npm run setup:db
```

### Storage Setup
```bash
# Create storage buckets only
npm run setup:storage
```

### Verification
```bash
# Verify database is working
npm run verify:db

# Test storage buckets
npm run test:storage
```

---

## 🛠️ Script Details

### 1. `setup-complete.js` - Complete Setup
**Location:** `scripts/setup-complete.js`

**Creates:**
- 3 storage buckets (cvs, gallery, team-photos)
- All RLS policies for tables
- All storage policies for buckets

**Output Files:**
- `supabase/policies-complete.sql` - All policies in one file

**Usage:**
```bash
node scripts/setup-complete.js
# or
npm run setup:complete
```

---

### 2. `setup-storage.js` - Storage Only
**Location:** `scripts/setup-storage.js`

**Creates:**
- Storage buckets with configuration
- Generates storage policies SQL

**Usage:**
```bash
node scripts/setup-storage.js
# or
npm run setup:storage
```

---

### 3. `verify-database.js` - Database Verification
**Location:** `scripts/verify-database.js`

**Checks:**
- All tables exist
- Record counts
- Public access (contact form test)
- RLS policies

**Usage:**
```bash
node scripts/verify-database.js
# or
npm run verify:db
```

---

### 4. `test-storage.js` - Storage Testing
**Location:** `scripts/test-storage.js`

**Tests:**
- List all buckets
- Verify expected buckets exist
- Test file upload/download
- Generate public URLs

**Usage:**
```bash
node scripts/test-storage.js
# or
npm run test:storage
```

---

## 🔧 Using MCP Tools Directly

Once Claude Desktop is restarted with the new MCP configuration, you can use MCP tools directly in chat:

### Example 1: Create Storage Bucket
```
Hey Claude, using the peg-security-alexander-zuev MCP tool, 
create a new storage bucket called "documents" with these settings:
- Public: false
- Size limit: 20MB
- Allowed types: PDF, Word docs
```

### Example 2: Query Database
```
Using peg-security-alexander-zuev MCP, 
show me all contacts submitted in the last 24 hours
```

### Example 3: Check Storage
```
Using the MCP tools, list all storage buckets 
and tell me how many files are in each
```

---

## 📋 Storage Bucket Configuration

### Buckets Created by `setup-complete.js`:

#### 1. **CVs Bucket**
```javascript
{
  id: 'cvs',
  public: false,           // Private - only admin can view
  fileSizeLimit: 5MB,      // 5 megabytes max
  allowedMimeTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
}
```

**Purpose:** Store job application CVs securely

**Policies:**
- ✅ Anyone can upload
- ✅ Only service role can view/delete

---

#### 2. **Gallery Bucket**
```javascript
{
  id: 'gallery',
  public: true,            // Public - anyone can view
  fileSizeLimit: 10MB,     // 10 megabytes max
  allowedMimeTypes: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif'
  ]
}
```

**Purpose:** Service showcase images

**Policies:**
- ✅ Anyone can view
- ✅ Only service role can upload/update/delete

---

#### 3. **Team Photos Bucket**
```javascript
{
  id: 'team-photos',
  public: true,            // Public - anyone can view
  fileSizeLimit: 5MB,      // 5 megabytes max
  allowedMimeTypes: [
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
}
```

**Purpose:** Team member profile photos

**Policies:**
- ✅ Anyone can view
- ✅ Only service role can manage

---

## 🔒 RLS Policies Generated

### Table Policies

**Contacts:**
- Public can submit forms
- Service role has full access

**Jobs:**
- Public can view open jobs
- Service role has full access

**Applications:**
- Public can submit applications
- Service role has full access

**Gallery:**
- Public can view active items
- Service role has full access

### Storage Policies

**All buckets:**
- Public can perform allowed actions (view/upload based on bucket config)
- Service role has full management access

---

## 🎯 Typical Workflow

### First Time Setup:
```bash
# 1. Run complete setup
npm run setup:complete

# 2. Apply generated SQL in Supabase dashboard
# (Copy from supabase/policies-complete.sql)

# 3. Verify everything works
npm run verify:db
npm run test:storage

# 4. Start development
npm run dev
```

### After Changes:
```bash
# If you modify buckets or policies, re-run:
npm run setup:complete

# Then apply the new SQL
# Then verify
npm run verify:db
```

---

## 🐛 Troubleshooting

### Storage Bucket Creation Fails

**Error:** "Bucket already exists"
**Solution:** This is normal on re-runs. The script will skip existing buckets.

**Error:** "Unauthorized"
**Solution:** Check your `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`

---

### Policies Not Working

**Error:** "new row violates row-level security policy"
**Solution:** 
1. Check you ran the policies SQL in Supabase
2. Verify the SQL executed without errors
3. Try the policy again - it may need anon/authenticated roles

---

### MCP Tools Not Working

**Error:** "Tool not found"
**Solution:**
1. Restart Claude Desktop completely
2. Check MCP config at: `~/Library/Application Support/Claude/claude_desktop_config.json`
3. Verify entries for `peg-security-alexander-zuev` and `peg-security-postgres`

---

## 📚 Learn More

### Supabase Documentation
- **Storage:** https://supabase.com/docs/guides/storage
- **RLS:** https://supabase.com/docs/guides/auth/row-level-security
- **Policies:** https://supabase.com/docs/guides/auth/row-level-security#policies

### MCP Documentation
- **Getting Started:** https://github.com/anthropics/mcp
- **Supabase MCP:** https://github.com/alexander-zuev/supabase-mcp

---

## ✨ Benefits of MCP Automation

### Before MCP:
```
1. Open Supabase dashboard
2. Navigate to Storage
3. Click "New Bucket"
4. Fill in name, settings
5. Click "Create"
6. Repeat 3x for each bucket
7. Navigate to Policies
8. Write SQL manually
9. Test each policy
10. Debug errors
11. Repeat...
```

**Time: 30-60 minutes** ⏰

### With MCP:
```bash
npm run setup:complete
# Copy SQL
# Paste in editor
# Click RUN
```

**Time: 2 minutes** ⚡

### That's a **93% time savings!** 🎉

---

## 🎊 Summary

You now have:

✅ Automated storage bucket creation  
✅ Automated RLS policy generation  
✅ Automated verification scripts  
✅ MCP tool integration  
✅ One-command setup  
✅ Reproducible configuration  

**Next time you need to set up a Supabase project, just run:**

```bash
npm run setup:complete
```

**And you're done!** 🚀

---

*Last updated: November 12, 2025*  
*Project: PEG Security*  
*Status: Fully Automated* ✅
