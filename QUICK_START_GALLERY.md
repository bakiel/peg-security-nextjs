# 🚀 Quick Start: Gallery Image Management

## ⚡ 2-Minute Setup

Your gallery system is **already built and ready**. Just need to create storage buckets!

---

## 📋 Setup Steps (5 minutes total)

### **Step 1: Create Storage Buckets** (2 minutes)

1. **Open Supabase SQL Editor:**

   👉 https://supabase.com/dashboard/project/ujiaeiqslzwmpvkyixdp/sql/new

2. **Copy the SQL script:**

   Open this file on your computer:
   ```
   /Users/mac/Downloads/PEG_Security_Profile_Design_Project/peg-security-nextjs/scripts/setup-storage.sql
   ```

3. **Paste and Run:**
   - Copy entire contents
   - Paste into SQL Editor
   - Click **"Run"**
   - Wait for success message

**This creates:**
- ✅ Gallery bucket (for website images)
- ✅ Team bucket (for staff photos)
- ✅ Services bucket (for service images)
- ✅ CVs bucket (for job applications)

---

### **Step 2: Upload Your First Image** (3 minutes)

1. **Login to Admin:**

   👉 http://localhost:3002/admin

   - Username: `admin`
   - Password: `PEGSecurity2025!`

2. **Go to Gallery:**

   Click **"Gallery"** in the left sidebar

3. **Upload an Image:**

   - Click **"Upload New Image"** button
   - **Title**: "Armed Response Team"
   - **Description**: "Our professional team on patrol"
   - **Category**: Select "Armed Response"
   - **Status**: Active
   - **Display Order**: 1
   - **Drag & drop** an image or click "Select Image"
   - Click **"Upload Image"**

4. **View Your Gallery:**

   👉 http://localhost:3002/gallery

   Your image should now appear!

---

## 🎯 What You Can Do

### **Admin Features** (http://localhost:3002/admin/gallery)

| Feature | How To Use |
|---------|------------|
| **Upload Images** | Click "Upload New Image" button |
| **Edit Image Details** | Click "Edit" button on any image |
| **Delete Images** | Click trash icon → Confirm |
| **Change Display Order** | Edit image → Change "Display Order" number |
| **Hide Images** | Edit image → Set status to "Hidden" |
| **Filter Images** | Use Status/Category dropdowns |
| **Preview** | Images show in grid with thumbnails |

### **Public Gallery** (http://localhost:3002/gallery)

Your customers see:
- ✅ Filtered by category
- ✅ Responsive image grid
- ✅ Click to view full size
- ✅ Only "Active" images shown
- ✅ Professional lightbox display

---

## 📸 Supported Files

### **Images** (Gallery, Team, Services)
- ✅ JPEG (.jpg, .jpeg)
- ✅ PNG (.png)
- ✅ WebP (.webp)
- **Max Size**: 5MB per image

### **Documents** (CVs for job applications)
- ✅ PDF (.pdf)
- ✅ Word (.doc, .docx)
- **Max Size**: 10MB per file

---

## 🎨 Image Categories

Choose from:
- **Armed Response** - Response team photos
- **CCTV Installation** - Camera projects
- **Access Control** - Gate/access systems
- **Security Guard** - Guard services
- **Event Security** - Event coverage
- **VIP Protection** - Executive protection
- **Projects** - General projects
- **Team** - Company team photos
- **Other** - Miscellaneous

---

## 💡 Pro Tips

### **Before Uploading:**
1. **Resize** images to max 1920px width
2. **Compress** using TinyPNG.com
3. **Rename** files descriptively (not IMG_1234.jpg)

### **Display Order:**
- **1-10**: Featured/hero images (show first)
- **11-50**: Main portfolio
- **51+**: Archive/older work

### **Image Quality:**
- Use **JPEG** for photos
- Use **PNG** for graphics/logos
- Use **WebP** for best compression (modern browsers)

---

## 🐛 Troubleshooting

### "Bucket not found" when uploading
**Fix:** Run the `setup-storage.sql` script (Step 1 above)

### Image uploads but doesn't show
**Check:**
1. Is bucket marked "Public"? ✅
2. Is image status "Active"? ✅
3. Did you refresh the gallery page? ✅

### Can't delete images
**Fix:** Check you're logged in as admin

---

## 📊 Current Status

| Component | Status |
|-----------|--------|
| ✅ Gallery Admin UI | Ready |
| ✅ Public Gallery Page | Ready |
| ✅ Upload API | Ready |
| ✅ Database Tables | Created |
| ⏳ Storage Buckets | **Need to create** (Step 1) |
| ⏳ Sample Images | **Upload yours** (Step 2) |

---

## 🎉 You're Ready!

Once you complete Step 1 (create storage buckets), you can:

1. **Upload images** via admin panel
2. **Manage gallery** (edit, delete, reorder)
3. **Display on website** automatically
4. **Filter by category** on public gallery
5. **Professional presentation** with lightbox

---

## 📚 Need More Details?

Full documentation available in:
```
/Users/mac/Downloads/PEG_Security_Profile_Design_Project/peg-security-nextjs/GALLERY_SETUP_GUIDE.md
```

---

## 🔗 Quick Links

**Admin:**
- Dashboard: http://localhost:3002/admin
- Gallery Management: http://localhost:3002/admin/gallery
- Team Management: http://localhost:3002/admin/team
- Services Management: http://localhost:3002/admin/services

**Public:**
- Gallery: http://localhost:3002/gallery
- Contact: http://localhost:3002/contact
- Careers: http://localhost:3002/careers

**Supabase:**
- SQL Editor: https://supabase.com/dashboard/project/ujiaeiqslzwmpvkyixdp/sql/new
- Storage: https://supabase.com/dashboard/project/ujiaeiqslzwmpvkyixdp/storage/buckets
- Tables: https://supabase.com/dashboard/project/ujiaeiqslzwmpvkyixdp/editor

---

**⏱️ Time to Complete:** 5 minutes
**💰 Cost:** Free (Supabase free tier includes 1GB storage)
**🚀 Ready to Use:** Yes! Just create buckets and start uploading.
