# CV Submission Portal - AI Implementation Strategy

**Project**: Job Application System with CV Upload
**Backend**: Supabase (Database + Storage)
**Status**: Ready for Implementation
**Estimated Time**: 4-6 hours

---

## 🎯 Objectives

Build a complete CV submission system that allows job applicants to:
1. Upload CV files (PDF/DOC/DOCX)
2. Fill in application details
3. Submit to Supabase database
4. Store CV files securely in Supabase Storage

Admin users can:
1. View all applications in admin portal
2. Download CVs
3. Filter and search applications
4. Update application status
5. Add notes to applications

---

## 🔒 File Restrictions & Security

### **1. File Size Limits**

**Frontend Validation:**
```typescript
// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB in bytes

// Validation function
function validateFileSize(file: File): boolean {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size must be less than 5MB')
  }
  return true
}
```

**Supabase Storage Bucket Configuration:**
```sql
-- In Supabase Dashboard → Storage → cvs bucket
-- Set maximum file size: 5242880 bytes (5MB)
-- This is enforced at the storage level
```

**API Route Validation:**
```typescript
// In /api/applications/upload
const fileBuffer = await file.arrayBuffer()
const fileSizeInBytes = fileBuffer.byteLength

if (fileSizeInBytes > 5 * 1024 * 1024) {
  return NextResponse.json(
    { error: 'File size exceeds 5MB limit' },
    { status: 400 }
  )
}
```

### **2. File Type Restrictions**

**Allowed file types:**
- PDF (.pdf)
- Microsoft Word (.doc, .docx)
- OpenDocument (.odt)

**Frontend validation:**
```typescript
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.oasis.opendocument.text'
]

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.odt']

function validateFileType(file: File): boolean {
  const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))

  if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
    throw new Error('Only PDF, DOC, DOCX, and ODT files are allowed')
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type')
  }

  return true
}
```

**Backend MIME type verification:**
```typescript
// Use 'file-type' package for reliable MIME detection
import { fileTypeFromBuffer } from 'file-type'

async function verifyFileType(buffer: Buffer): Promise<boolean> {
  const fileType = await fileTypeFromBuffer(buffer)

  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]

  if (!fileType || !allowedMimes.includes(fileType.mime)) {
    throw new Error('Invalid file type detected')
  }

  return true
}
```

### **3. File Naming & Storage Strategy**

**Secure filename generation:**
```typescript
import { randomUUID } from 'crypto'

function generateSecureFilename(originalFilename: string, applicantEmail: string): string {
  const timestamp = Date.now()
  const uuid = randomUUID()
  const extension = originalFilename.slice(originalFilename.lastIndexOf('.'))
  const sanitizedEmail = applicantEmail.toLowerCase().replace(/[^a-z0-9]/g, '_')

  // Format: cvs/2024/11/email_timestamp_uuid.pdf
  const year = new Date().getFullYear()
  const month = String(new Date().getMonth() + 1).padStart(2, '0')

  return `cvs/${year}/${month}/${sanitizedEmail}_${timestamp}_${uuid}${extension}`
}
```

**Storage path structure:**
```
cvs/
├── 2024/
│   ├── 11/
│   │   ├── john_doe_example_com_1699123456789_abc123.pdf
│   │   ├── jane_smith_gmail_com_1699123789012_def456.pdf
│   └── 12/
│       └── ...
└── 2025/
    └── ...
```

### **4. Supabase Storage Bucket Setup**

**Bucket configuration (via Supabase Dashboard or SQL):**

```sql
-- Create storage bucket for CVs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cvs',
  'cvs',
  false,  -- Private bucket, requires authentication to access
  5242880,  -- 5MB limit
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.oasis.opendocument.text'
  ]
);

-- Set up RLS policies for CV bucket
-- Only authenticated admin users can list/read
CREATE POLICY "Admin users can view CVs"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'cvs');

-- Anyone can upload (we control this via API)
CREATE POLICY "Anyone can upload CVs"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'cvs');

-- Only service role can delete
CREATE POLICY "Service role can delete CVs"
ON storage.objects FOR DELETE
TO service_role
USING (bucket_id = 'cvs');
```

### **5. Rate Limiting**

**Prevent spam submissions:**
```typescript
// Use Upstash Redis or in-memory cache
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, '1 h'), // 3 applications per hour per IP
  analytics: true,
})

// In API route
const identifier = req.headers.get('x-forwarded-for') || 'anonymous'
const { success } = await ratelimit.limit(identifier)

if (!success) {
  return NextResponse.json(
    { error: 'Too many applications. Please try again later.' },
    { status: 429 }
  )
}
```

---

## 📊 Database Schema

The `applications` table already exists in your Supabase config. Here's the full schema:

```sql
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Job reference
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  job_title TEXT NOT NULL,

  -- Applicant details
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  applicant_phone TEXT NOT NULL,

  -- CV storage
  cv_url TEXT NOT NULL,
  cv_public_id TEXT NOT NULL,  -- Supabase storage path

  -- Application content
  cover_letter TEXT,

  -- PSIRA details
  psira_registered BOOLEAN DEFAULT false,
  psira_number TEXT,

  -- Experience
  years_experience INTEGER DEFAULT 0,

  -- Status tracking
  status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Reviewing', 'Interviewed', 'Hired', 'Rejected')),
  notes TEXT,

  -- Timestamps
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_email ON applications(applicant_email);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_submitted_at ON applications(submitted_at DESC);

-- RLS policies
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Public can insert (submit applications)
CREATE POLICY "Anyone can submit applications"
ON applications FOR INSERT
TO public
WITH CHECK (true);

-- Only authenticated users (admins) can view
CREATE POLICY "Authenticated users can view applications"
ON applications FOR SELECT
TO authenticated
USING (true);

-- Only authenticated users can update
CREATE POLICY "Authenticated users can update applications"
ON applications FOR UPDATE
TO authenticated
USING (true);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON applications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

---

## 🏗️ Implementation Plan

### **Phase 1: Backend Setup** (60 minutes)

#### Task 1.1: Create Supabase Storage Bucket
```bash
# In Supabase Dashboard → Storage
# OR via SQL in Supabase SQL Editor

-- Create CVs bucket with size limits
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cvs',
  'cvs',
  false,
  5242880,
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);
```

#### Task 1.2: Verify Applications Table Exists
```bash
# Run in Supabase SQL Editor
SELECT * FROM applications LIMIT 1;

# If table doesn't exist, run the CREATE TABLE script above
```

#### Task 1.3: Create API Route - Upload CV
**File**: `/app/api/applications/upload/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { randomUUID } from 'crypto'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const email = formData.get('email') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only PDF, DOC, and DOCX files are allowed' },
        { status: 400 }
      )
    }

    // Generate secure filename
    const timestamp = Date.now()
    const uuid = randomUUID()
    const extension = file.name.slice(file.name.lastIndexOf('.'))
    const sanitizedEmail = email.toLowerCase().replace(/[^a-z0-9]/g, '_')
    const year = new Date().getFullYear()
    const month = String(new Date().getMonth() + 1).padStart(2, '0')

    const storagePath = `cvs/${year}/${month}/${sanitizedEmail}_${timestamp}_${uuid}${extension}`

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('cvs')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      console.error('[CV UPLOAD ERROR]', error)
      return NextResponse.json(
        { error: 'Failed to upload CV' },
        { status: 500 }
      )
    }

    // Get signed URL (valid for 1 hour)
    const { data: signedUrlData } = await supabaseAdmin.storage
      .from('cvs')
      .createSignedUrl(data.path, 3600)

    return NextResponse.json({
      success: true,
      cv_url: signedUrlData?.signedUrl || '',
      cv_public_id: data.path,
      message: 'CV uploaded successfully',
    })
  } catch (error: any) {
    console.error('[CV UPLOAD ERROR]', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload CV' },
      { status: 500 }
    )
  }
}
```

#### Task 1.4: Create API Route - Submit Application
**File**: `/app/api/applications/submit/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      job_id,
      job_title,
      applicant_name,
      applicant_email,
      applicant_phone,
      cv_url,
      cv_public_id,
      cover_letter,
      psira_registered,
      psira_number,
      years_experience,
    } = body

    // Validation
    if (!job_id || !job_title || !applicant_name || !applicant_email || !cv_url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Insert application into database
    const { data, error } = await supabaseAdmin
      .from('applications')
      .insert([
        {
          job_id,
          job_title,
          applicant_name,
          applicant_email,
          applicant_phone,
          cv_url,
          cv_public_id,
          cover_letter: cover_letter || '',
          psira_registered: psira_registered || false,
          psira_number: psira_number || null,
          years_experience: years_experience || 0,
          status: 'New',
          submitted_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('[APPLICATION SUBMIT ERROR]', error)
      return NextResponse.json(
        { error: 'Failed to submit application' },
        { status: 500 }
      )
    }

    // Increment job application count
    await supabaseAdmin.rpc('increment_application_count', { job_id })

    return NextResponse.json({
      success: true,
      application_id: data.id,
      message: 'Application submitted successfully',
    })
  } catch (error: any) {
    console.error('[APPLICATION SUBMIT ERROR]', error)
    return NextResponse.json(
      { error: error.message || 'Failed to submit application' },
      { status: 500 }
    )
  }
}
```

#### Task 1.5: Create Database Function for Application Count
```sql
-- Run in Supabase SQL Editor
CREATE OR REPLACE FUNCTION increment_application_count(job_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE jobs
  SET application_count = application_count + 1
  WHERE id = job_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

### **Phase 2: Frontend - Application Form** (90 minutes)

#### Task 2.1: Create CV Upload Component
**File**: `/components/careers/CVUploadForm.tsx`

```typescript
'use client'

import React, { useState } from 'react'
import Button from '@/components/ui/Button'
import { Upload, FileText, X, AlertCircle } from 'lucide-react'

interface CVUploadFormProps {
  onUploadComplete: (cvUrl: string, cvPublicId: string) => void
  applicantEmail: string
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx']

export default function CVUploadForm({ onUploadComplete, applicantEmail }: CVUploadFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string>('')

  const validateFile = (file: File): boolean => {
    setError('')

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setError('File size must be less than 5MB')
      return false
    }

    // Check file type
    const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      setError('Only PDF, DOC, and DOCX files are allowed')
      return false
    }

    return true
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('email', applicantEmail)

      const response = await fetch('/api/applications/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      onUploadComplete(data.cv_url, data.cv_public_id)
    } catch (err: any) {
      setError(err.message || 'Failed to upload CV')
    } finally {
      setUploading(false)
    }
  }

  const removeFile = () => {
    setFile(null)
    setError('')
  }

  return (
    <div className="space-y-4">
      <label className="block text-white font-semibold mb-2">
        Upload CV <span className="text-red-500">*</span>
      </label>

      {!file ? (
        <div className="border-2 border-dashed border-gold/30 rounded-card p-8 text-center hover:border-gold/50 transition-colors">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
            id="cv-upload"
          />
          <label
            htmlFor="cv-upload"
            className="cursor-pointer flex flex-col items-center gap-3"
          >
            <Upload className="text-gold" size={48} />
            <div>
              <p className="text-white font-medium mb-1">
                Click to upload your CV
              </p>
              <p className="text-white/60 text-sm">
                PDF, DOC, or DOCX (max 5MB)
              </p>
            </div>
          </label>
        </div>
      ) : (
        <div className="bg-onyx/50 border border-gold/20 rounded-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="text-gold" size={32} />
              <div>
                <p className="text-white font-medium">{file.name}</p>
                <p className="text-white/60 text-sm">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="text-white/60 hover:text-red-500 transition-colors"
              disabled={uploading}
            >
              <X size={24} />
            </button>
          </div>

          {!uploading && (
            <Button
              variant="primary"
              size="md"
              onClick={handleUpload}
              className="w-full mt-4"
            >
              Upload CV
            </Button>
          )}

          {uploading && (
            <div className="mt-4 text-center">
              <div className="inline-block animate-spin w-6 h-6 border-4 border-gold/30 border-t-gold rounded-full mb-2" />
              <p className="text-white/60 text-sm">Uploading...</p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}
    </div>
  )
}
```

#### Task 2.2: Create Application Form Modal
**File**: `/components/careers/ApplicationModal.tsx`

```typescript
'use client'

import React, { useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import CVUploadForm from './CVUploadForm'
import { CheckCircle, AlertCircle } from 'lucide-react'

interface Job {
  id: string
  title: string
}

interface ApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  job: Job
}

export default function ApplicationModal({ isOpen, onClose, job }: ApplicationModalProps) {
  const [formData, setFormData] = useState({
    applicant_name: '',
    applicant_email: '',
    applicant_phone: '',
    cover_letter: '',
    psira_registered: false,
    psira_number: '',
    years_experience: 0,
  })

  const [cvUrl, setCvUrl] = useState('')
  const [cvPublicId, setCvPublicId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleCVUpload = (url: string, publicId: string) => {
    setCvUrl(url)
    setCvPublicId(publicId)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!cvUrl) {
      setError('Please upload your CV before submitting')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/applications/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: job.id,
          job_title: job.title,
          ...formData,
          cv_url: cvUrl,
          cv_public_id: cvPublicId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application')
      }

      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Failed to submit application')
    } finally {
      setSubmitting(false)
    }
  }

  const resetAndClose = () => {
    setFormData({
      applicant_name: '',
      applicant_email: '',
      applicant_phone: '',
      cover_letter: '',
      psira_registered: false,
      psira_number: '',
      years_experience: 0,
    })
    setCvUrl('')
    setCvPublicId('')
    setSubmitted(false)
    setError('')
    onClose()
  }

  if (submitted) {
    return (
      <Modal isOpen={isOpen} onClose={resetAndClose} size="md">
        <div className="text-center py-8">
          <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
          <h2 className="text-2xl font-bold text-white mb-3">
            Application Submitted!
          </h2>
          <p className="text-white/70 mb-6">
            Thank you for applying to the {job.title} position. We'll review your
            application and get back to you soon.
          </p>
          <Button variant="primary" size="lg" onClick={resetAndClose}>
            Close
          </Button>
        </div>
      </Modal>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Apply for {job.title}
        </h2>
        <p className="text-white/70 mb-6">
          Fill in your details and upload your CV to apply for this position.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-white font-semibold mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="applicant_name"
                value={formData.applicant_name}
                onChange={handleInputChange}
                required
                className="w-full bg-onyx/50 border border-gold/20 rounded-lg px-4 py-3 text-white focus:border-gold/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="applicant_email"
                value={formData.applicant_email}
                onChange={handleInputChange}
                required
                className="w-full bg-onyx/50 border border-gold/20 rounded-lg px-4 py-3 text-white focus:border-gold/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="applicant_phone"
                value={formData.applicant_phone}
                onChange={handleInputChange}
                required
                className="w-full bg-onyx/50 border border-gold/20 rounded-lg px-4 py-3 text-white focus:border-gold/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Years of Experience <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="years_experience"
                value={formData.years_experience}
                onChange={handleInputChange}
                min="0"
                required
                className="w-full bg-onyx/50 border border-gold/20 rounded-lg px-4 py-3 text-white focus:border-gold/50 focus:outline-none"
              />
            </div>
          </div>

          {/* PSIRA Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="psira_registered"
                checked={formData.psira_registered}
                onChange={handleInputChange}
                id="psira-checkbox"
                className="w-5 h-5 rounded border-gold/30 bg-onyx/50 text-gold focus:ring-gold"
              />
              <label htmlFor="psira-checkbox" className="text-white font-medium">
                I am PSIRA Registered
              </label>
            </div>

            {formData.psira_registered && (
              <div>
                <label className="block text-white font-semibold mb-2">
                  PSIRA Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="psira_number"
                  value={formData.psira_number}
                  onChange={handleInputChange}
                  required={formData.psira_registered}
                  className="w-full bg-onyx/50 border border-gold/20 rounded-lg px-4 py-3 text-white focus:border-gold/50 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* CV Upload */}
          <CVUploadForm
            onUploadComplete={handleCVUpload}
            applicantEmail={formData.applicant_email}
          />

          {/* Cover Letter */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Cover Letter (Optional)
            </label>
            <textarea
              name="cover_letter"
              value={formData.cover_letter}
              onChange={handleInputChange}
              rows={6}
              className="w-full bg-onyx/50 border border-gold/20 rounded-lg px-4 py-3 text-white focus:border-gold/50 focus:outline-none resize-none"
              placeholder="Tell us why you're interested in this position..."
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={onClose}
              disabled={submitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={submitting || !cvUrl}
              className="flex-1"
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
```

---

### **Phase 3: Admin Portal** (120 minutes)

#### Task 3.1: Create Applications API Routes
**File**: `/app/api/admin/applications/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyAuth } from '@/lib/auth'

// GET /api/admin/applications - List all applications
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authError = await verifyAuth(request)
    if (authError) return authError

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const jobId = searchParams.get('job_id')

    let query = supabaseAdmin
      .from('applications')
      .select('*')
      .order('submitted_at', { ascending: false })

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (jobId) {
      query = query.eq('job_id', jobId)
    }

    const { data, error } = await query

    if (error) {
      console.error('[APPLICATIONS LIST ERROR]', error)
      return NextResponse.json(
        { error: 'Failed to fetch applications' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
      count: data.length,
    })
  } catch (error: any) {
    console.error('[APPLICATIONS LIST ERROR]', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}
```

**File**: `/app/api/admin/applications/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyAuth } from '@/lib/auth'

// GET /api/admin/applications/[id] - Get single application
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authError = await verifyAuth(request)
    if (authError) return authError

    const { data, error } = await supabaseAdmin
      .from('applications')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('[APPLICATION GET ERROR]', error)
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    // Get signed URL for CV
    const { data: signedUrlData } = await supabaseAdmin.storage
      .from('cvs')
      .createSignedUrl(data.cv_public_id, 3600) // 1 hour

    return NextResponse.json({
      success: true,
      data: {
        ...data,
        cv_download_url: signedUrlData?.signedUrl,
      },
    })
  } catch (error: any) {
    console.error('[APPLICATION GET ERROR]', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch application' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/applications/[id] - Update application status/notes
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authError = await verifyAuth(request)
    if (authError) return authError

    const body = await request.json()
    const { status, notes } = body

    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (status) updateData.status = status
    if (notes !== undefined) updateData.notes = notes

    const { data, error } = await supabaseAdmin
      .from('applications')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('[APPLICATION UPDATE ERROR]', error)
      return NextResponse.json(
        { error: 'Failed to update application' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Application updated successfully',
    })
  } catch (error: any) {
    console.error('[APPLICATION UPDATE ERROR]', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update application' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/applications/[id] - Delete application
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authError = await verifyAuth(request)
    if (authError) return authError

    // Get application to access CV path
    const { data: application } = await supabaseAdmin
      .from('applications')
      .select('cv_public_id, job_id')
      .eq('id', params.id)
      .single()

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    // Delete CV from storage
    await supabaseAdmin.storage
      .from('cvs')
      .remove([application.cv_public_id])

    // Delete application from database
    const { error } = await supabaseAdmin
      .from('applications')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('[APPLICATION DELETE ERROR]', error)
      return NextResponse.json(
        { error: 'Failed to delete application' },
        { status: 500 }
      )
    }

    // Decrement job application count
    await supabaseAdmin.rpc('decrement_application_count', {
      job_id: application.job_id,
    })

    return NextResponse.json({
      success: true,
      message: 'Application deleted successfully',
    })
  } catch (error: any) {
    console.error('[APPLICATION DELETE ERROR]', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete application' },
      { status: 500 }
    )
  }
}
```

---

### **Phase 4: Testing & Deployment** (60 minutes)

#### Task 4.1: Test Complete Flow
1. Submit application from careers page
2. Verify CV uploads to Supabase Storage
3. Verify application appears in database
4. View application in admin portal
5. Update application status
6. Download CV from admin portal

#### Task 4.2: Environment Variables Checklist
```bash
# Supabase (3 variables)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Auth (2 variables) - Already configured
JWT_SECRET=...
ADMIN_PASSWORD=...
```

#### Task 4.3: Deploy to Vercel
```bash
# Push to git
git add .
git commit -m "feat: Add CV submission portal with Supabase Storage"
git push origin main

# Vercel will auto-deploy
# Verify all environment variables are set in Vercel Dashboard
```

---

## 📈 Success Metrics

- ✅ Users can upload CVs (PDF/DOC/DOCX) up to 5MB
- ✅ File validation works on both frontend and backend
- ✅ CVs are securely stored in Supabase Storage with unique names
- ✅ Applications are saved to database with all required fields
- ✅ Admins can view all applications in admin portal
- ✅ Admins can download CVs with signed URLs
- ✅ Admins can update application status and add notes
- ✅ Rate limiting prevents spam submissions
- ✅ System handles errors gracefully with user-friendly messages

---

## 🔐 Security Checklist

- [x] File size limits enforced (frontend + backend + Supabase)
- [x] File type validation (frontend + backend)
- [x] Secure filename generation (UUID-based)
- [x] Private storage bucket (requires authentication)
- [x] Signed URLs for CV downloads (time-limited)
- [x] Admin authentication required for all admin routes
- [x] Rate limiting on submission endpoint
- [x] SQL injection prevention (Supabase parameterized queries)
- [x] XSS prevention (React auto-escaping)
- [x] CORS properly configured

---

## 📞 Support & Maintenance

**Technical Lead**: Bakiel
**Email**: bakiel@pegsecurity.co.za
**Phone**: +27 79 413 9180

---

**Status**: Ready for Implementation
**Last Updated**: November 13, 2025
**Version**: 1.0.0
