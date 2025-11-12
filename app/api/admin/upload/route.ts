import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { z } from 'zod'
import { fileTypeFromBuffer } from 'file-type'

export const dynamic = 'force-dynamic'

/**
 * POST /api/admin/upload
 * Handle file uploads to Supabase Storage
 *
 * Supported buckets:
 * - cvs: Job application CVs (private)
 * - gallery: Gallery images (public)
 * - team: Team member photos (public)
 * - services: Service images (public)
 *
 * Security:
 * - Protected by middleware.ts (requires admin authentication)
 * - File type validation
 * - File size limits
 *
 * Body (multipart/form-data):
 * - file: File to upload
 * - bucket: Storage bucket name
 * - path?: Optional custom path (otherwise auto-generated)
 *
 * Response:
 * {
 *   success: true,
 *   data: {
 *     url: string,
 *     path: string,
 *     bucket: string
 *   }
 * }
 */

// Allowed MIME types per bucket
const ALLOWED_MIME_TYPES: Record<string, string[]> = {
  cvs: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  gallery: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  team: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  services: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
}

// File size limits (in bytes)
const MAX_FILE_SIZE: Record<string, number> = {
  cvs: 10 * 1024 * 1024, // 10MB
  gallery: 5 * 1024 * 1024, // 5MB
  team: 5 * 1024 * 1024, // 5MB
  services: 5 * 1024 * 1024 // 5MB
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const bucket = formData.get('bucket') as string | null
    const customPath = formData.get('path') as string | null

    // Validate bucket
    if (!bucket || !['cvs', 'gallery', 'team', 'services'].includes(bucket)) {
      return NextResponse.json(
        {
          error: 'Invalid bucket',
          details: 'Bucket must be one of: cvs, gallery, team, services'
        },
        { status: 400 }
      )
    }

    // Validate file
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Check file type (MIME type - client-provided)
    if (!ALLOWED_MIME_TYPES[bucket].includes(file.type)) {
      return NextResponse.json(
        {
          error: 'Invalid file type',
          details: `Allowed types for ${bucket}: ${ALLOWED_MIME_TYPES[bucket].join(', ')}`
        },
        { status: 400 }
      )
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE[bucket]) {
      return NextResponse.json(
        {
          error: 'File too large',
          details: `Maximum file size for ${bucket}: ${MAX_FILE_SIZE[bucket] / 1024 / 1024}MB`
        },
        { status: 400 }
      )
    }

    // Convert file to buffer for magic number validation
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Verify file content using magic numbers (more secure than MIME type)
    const detectedType = await fileTypeFromBuffer(buffer)

    if (!detectedType) {
      return NextResponse.json(
        {
          error: 'Could not detect file type',
          details: 'File content validation failed'
        },
        { status: 400 }
      )
    }

    // Define allowed extensions per bucket
    const allowedExtensions: Record<string, string[]> = {
      cvs: ['pdf', 'doc', 'docx'],
      gallery: ['jpg', 'jpeg', 'png', 'webp'],
      team: ['jpg', 'jpeg', 'png', 'webp'],
      services: ['jpg', 'jpeg', 'png', 'webp']
    }

    // Verify detected type matches allowed types for bucket
    if (!allowedExtensions[bucket].includes(detectedType.ext)) {
      return NextResponse.json(
        {
          error: 'File content mismatch',
          details: `Expected ${file.type} but detected ${detectedType.mime}. File may be corrupted or incorrectly named.`
        },
        { status: 400 }
      )
    }

    // Generate file path
    const timestamp = Date.now()
    const fileExt = file.name.split('.').pop()
    const fileName = customPath || `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${fileName}`

    // Buffer already created above for magic number validation - reuse it

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error('[ADMIN UPLOAD ERROR]', uploadError)
      return NextResponse.json(
        {
          error: 'Failed to upload file',
          details: uploadError.message
        },
        { status: 400 }
      )
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(uploadData.path)

    console.log('[ADMIN UPLOAD] File uploaded:', bucket, uploadData.path)

    return NextResponse.json(
      {
        success: true,
        data: {
          url: urlData.publicUrl,
          path: uploadData.path,
          bucket: bucket
        },
        message: 'File uploaded successfully'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[ADMIN UPLOAD ERROR]', error)

    return NextResponse.json(
      {
        error: 'Failed to upload file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/upload
 * Remove file from Supabase Storage
 *
 * Security:
 * - Protected by middleware.ts (requires admin authentication)
 *
 * Body:
 * {
 *   bucket: string
 *   path: string
 * }
 *
 * Response:
 * {
 *   success: true,
 *   message: string
 * }
 */

const deleteFileSchema = z.object({
  bucket: z.enum(['cvs', 'gallery', 'team', 'services']),
  path: z.string().min(1, 'File path is required')
})

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validation = deleteFileSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        },
        { status: 400 }
      )
    }

    const { bucket, path } = validation.data

    // Delete file from storage
    const { error } = await supabaseAdmin.storage
      .from(bucket)
      .remove([path])

    if (error) {
      console.error('[ADMIN UPLOAD DELETE ERROR]', error)
      return NextResponse.json(
        {
          error: 'Failed to delete file',
          details: error.message
        },
        { status: 400 }
      )
    }

    console.log('[ADMIN UPLOAD] File deleted:', bucket, path)

    return NextResponse.json(
      {
        success: true,
        message: 'File deleted successfully'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[ADMIN UPLOAD DELETE ERROR]', error)

    return NextResponse.json(
      {
        error: 'Failed to delete file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * OPTIONS - Handle CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Allow': 'POST, DELETE, OPTIONS'
    }
  })
}
