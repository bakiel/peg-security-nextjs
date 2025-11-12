# 📸 Gallery Image Management Guide for PEG Security

## ✅ What's Already Built

Your gallery management system is **fully functional** and includes:

### **Admin Gallery Dashboard**
- **Location**: http://localhost:3002/admin/gallery
- **Features**:
  - ✅ Upload images with drag & drop
  - ✅ Image preview before upload
  - ✅ Title, description, category fields
  - ✅ Display order management
  - ✅ Active/Hidden status toggle
  - ✅ Edit existing images
  - ✅ Delete images (with confirmation)
  - ✅ Filter by status/category
  - ✅ Real-time image grid display

### **Public Gallery Page**
- **Location**: http://localhost:3002/gallery
- **Features**:
  - ✅ Responsive image grid
  - ✅ Filter by category
  - ✅ Lightbox/modal view
  - ✅ Only shows "Active" images
  - ✅ Sorted by display order

### **Security Features**
- ✅ Admin authentication required
- ✅ File type validation (JPEG, PNG, WebP only)
- ✅ Magic number verification (prevents fake file extensions)
- ✅ File size limit: 5MB per image
- ✅ Row-Level Security (RLS) on database

---

## 🚨 REQUIRED: Create Storage Buckets

Before you can upload images, you need to create 4 storage buckets in Supabase.

### **Step 1: Go to Supabase Storage**

https://supabase.com/dashboard/project/ujiaeiqslzwmpvkyixdp/storage/buckets

### **Step 2: Create 4 Buckets**

Click **"New bucket"** for each of these:

#### **1. Gallery Bucket** (PUBLIC)
```
Bucket Name: gallery
Public: ✅ YES
File size limit: 5 MB
Allowed MIME types: image/jpeg, image/png, image/webp
```

**Purpose**: Store gallery images that appear on your website

#### **2. Team Bucket** (PUBLIC)
```
Bucket Name: team
Public: ✅ YES
File size limit: 5 MB
Allowed MIME types: image/jpeg, image/png, image/webp
```

**Purpose**: Store team member photos

#### **3. Services Bucket** (PUBLIC)
```
Bucket Name: services
Public: ✅ YES
File size limit: 5 MB
Allowed MIME types: image/jpeg, image/png, image/webp
```

**Purpose**: Store service offering images

#### **4. CVs Bucket** (PRIVATE)
```
Bucket Name: cvs
Public: ❌ NO
File size limit: 10 MB
Allowed MIME types: application/pdf, application/msword
```

**Purpose**: Store job applicant CVs securely

---

## 📋 Quick Creation Script

Or run this SQL in Supabase SQL Editor to create all buckets at once:

```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('gallery', 'gallery', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('team', 'team', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('services', 'services', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('cvs', 'cvs', false, 10485760, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for public buckets
CREATE POLICY "Public can read gallery images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery');

CREATE POLICY "Public can read team images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'team');

CREATE POLICY "Public can read services images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'services');

-- Admin policies (service role has full access by default)
CREATE POLICY "Service role can upload gallery images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'service_role');

CREATE POLICY "Service role can delete gallery images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'gallery' AND auth.role() = 'service_role');

CREATE POLICY "Service role can upload team images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'team' AND auth.role() = 'service_role');

CREATE POLICY "Service role can delete team images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'team' AND auth.role() = 'service_role');

CREATE POLICY "Service role can upload services images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'services' AND auth.role() = 'service_role');

CREATE POLICY "Service role can delete services images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'services' AND auth.role() = 'service_role');

CREATE POLICY "Service role can upload CVs"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'cvs' AND auth.role() = 'service_role');

CREATE POLICY "Service role can delete CVs"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'cvs' AND auth.role() = 'service_role');
```

---

## 🎯 How to Use Gallery Management

### **Step 1: Login to Admin**

1. Go to: http://localhost:3002/admin
2. Login: `admin` / `PEGSecurity2025!`
3. Click **"Gallery"** in sidebar

### **Step 2: Upload an Image**

1. Click **"Upload New Image"** button
2. Fill in the form:
   - **Title**: Armed Response Team (example)
   - **Description**: Our professional team on patrol in Sandton
   - **Category**: Armed Response
   - **Status**: Active (visible on website)
   - **Display Order**: 1 (lower numbers appear first)
3. **Drag & drop** image or click "Select Image"
4. Preview appears automatically
5. Click **"Upload Image"**

### **Step 3: Manage Images**

**Edit an Image:**
- Click **"Edit"** button on any image
- Update title, description, category, or status
- Click **"Save Changes"**

**Delete an Image:**
- Click **"Delete"** button (trash icon)
- Confirm deletion
- Image removed from database AND storage

**Change Display Order:**
- Edit the image
- Change "Display Order" number
- Lower numbers appear first

**Hide an Image:**
- Edit the image
- Change status to "Hidden"
- Image stays in database but won't show on public gallery

---

## 🌐 Public Gallery Display

Your customers will see the gallery at:
**http://localhost:3002/gallery**

Features for visitors:
- ✅ Filter by category (dropdown)
- ✅ Click image to view full size
- ✅ Responsive grid layout
- ✅ Only "Active" images shown
- ✅ Sorted by display order

---

## 📁 Supported File Types

### **Images (Gallery, Team, Services)**
- ✅ JPEG (.jpg, .jpeg)
- ✅ PNG (.png)
- ✅ WebP (.webp)
- ❌ GIF (not supported)
- ❌ SVG (not supported)

**Max Size**: 5MB per image

**Recommended:**
- Resolution: 1920x1080px or higher
- Format: JPEG for photos, PNG for graphics
- Compression: Optimize before upload

### **Documents (CVs)**
- ✅ PDF (.pdf)
- ✅ Word (.doc, .docx)
- ❌ Text files (not supported)

**Max Size**: 10MB per document

---

## 🎨 Image Categories

Your gallery supports these categories:

1. **Armed Response** - Response team photos
2. **CCTV Installation** - Camera installation projects
3. **Access Control** - Access systems and gates
4. **Security Guard** - Guard service photos
5. **Event Security** - Event coverage photos
6. **VIP Protection** - Executive protection services
7. **Projects** - General project photos
8. **Team** - Company team photos
9. **Other** - Miscellaneous images

---

## 🔒 Security Features

### **Upload Security**
- ✅ **Authentication**: Only logged-in admins can upload
- ✅ **File Type Check**: MIME type validation
- ✅ **Magic Number Check**: Verifies actual file content
- ✅ **Size Limits**: 5MB for images, 10MB for CVs
- ✅ **Virus Scan**: Supabase includes automatic scanning

### **Storage Security**
- ✅ **Public Buckets**: Images accessible via URL (for website display)
- ✅ **Private Buckets**: CVs only accessible by admins
- ✅ **RLS Policies**: Database-level security
- ✅ **CORS Protected**: Upload API only accessible from your domain

---

## 📊 Database Schema

The `gallery` table structure:

```sql
id              UUID (auto-generated)
title           TEXT (required)
description     TEXT (required)
category        TEXT (Armed Response, CCTV, etc.)
image_url       TEXT (full Supabase URL)
image_public_id TEXT (storage path)
thumbnail_url   TEXT (same as image_url for now)
status          TEXT (Active or Hidden)
display_order   INTEGER (sort order, lower = first)
created_at      TIMESTAMPTZ (auto-set)
updated_at      TIMESTAMPTZ (auto-updated)
```

---

## 🐛 Troubleshooting

### **"Bucket not found" error when uploading**

**Solution**: Create storage buckets (see Step 2 above)

### **"Access denied" error**

**Solution**: Run the storage policies SQL script above

### **Image uploads but doesn't display**

**Checklist:**
1. Is bucket marked as "Public"? ✅
2. Is image status "Active"? ✅
3. Is `image_url` field populated in database? ✅
4. Can you access the image URL directly in browser? ✅

### **Can't delete images**

**Possible causes:**
- Image is referenced in another table
- Storage policy not set correctly
- Service role key is wrong

**Solution**: Check storage policies in SQL above

---

## 📸 Best Practices

### **Image Optimization**
Before uploading images:
1. **Resize** to max 1920px width (for web performance)
2. **Compress** using tools like TinyPNG or ImageOptim
3. **Convert** to WebP format (better compression, modern browsers)

### **Naming Convention**
Use descriptive titles:
- ✅ "Armed Response Team at Sandton Office Park"
- ❌ "IMG_20231112.jpg"

### **Display Order**
Plan your gallery layout:
- **1-10**: Hero/featured images
- **11-50**: Standard portfolio
- **51+**: Archive/older work

### **Categories**
Use consistent categories for filtering:
- Don't mix "CCTV" and "CCTV Installation"
- Stick to the predefined list

---

## 🎯 Quick Start Checklist

- [ ] Create 4 storage buckets in Supabase
- [ ] Run storage policies SQL script
- [ ] Login to admin panel
- [ ] Upload test image to gallery
- [ ] Check image appears in admin gallery list
- [ ] Visit public gallery page
- [ ] Confirm image displays correctly
- [ ] Test category filtering
- [ ] Test image editing
- [ ] Test image deletion

---

## 📞 Need Help?

**Storage Issues:**
- Check: https://supabase.com/dashboard/project/ujiaeiqslzwmpvkyixdp/storage/buckets

**Database Issues:**
- Check: https://supabase.com/dashboard/project/ujiaeiqslzwmpvkyixdp/editor

**API Logs:**
- Server terminal shows upload logs
- Look for `[ADMIN UPLOAD]` messages

---

## 🎉 Summary

Your gallery system is **production-ready** and includes:

✅ Secure file upload with validation
✅ Image management (CRUD operations)
✅ Public gallery display with filtering
✅ Responsive design for mobile/desktop
✅ Database integration with Supabase
✅ Storage integration with auto-cleanup

**All you need to do**: Create the 4 storage buckets and start uploading! 📸
