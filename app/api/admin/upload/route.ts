import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { fileTypeFromBuffer } from 'file-type'
import { writeFile, unlink, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

/**
 * POST /api/admin/upload
 * Handle file uploads to VPS filesystem
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

// Upload directory configuration
const UPLOAD_BASE_DIR = process.env.UPLOAD_DIR || '/opt/peg-security/uploads'
const UPLOAD_BASE_URL = process.env.NEXT_PUBLIC_UPLOAD_URL || 'https://pegsecurity.co.za/uploads'

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

    // Ensure upload directory exists
    const uploadDir = path.join(UPLOAD_BASE_DIR, bucket)
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Full file path on filesystem
    const fullPath = path.join(uploadDir, fileName)

    // Write file to disk
    try {
      await writeFile(fullPath, buffer)
    } catch (writeError) {
      console.error('[ADMIN UPLOAD ERROR]', writeError)
      return NextResponse.json(
        {
          error: 'Failed to upload file',
          details: writeError instanceof Error ? writeError.message : 'Unknown error'
        },
        { status: 500 }
      )
    }

    // Generate public URL
    const publicUrl = `${UPLOAD_BASE_URL}/${bucket}/${fileName}`

    console.log('[ADMIN UPLOAD] File uploaded:', bucket, fileName)

    return NextResponse.json(
      {
        success: true,
        data: {
          url: publicUrl,
          path: fileName,
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
 * Remove file from VPS filesystem
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

    const { bucket, path: filePath } = validation.data

    // Construct full file path
    const fullPath = path.join(UPLOAD_BASE_DIR, bucket, filePath)

    // Delete file from filesystem
    try {
      await unlink(fullPath)
    } catch (deleteError) {
      console.error('[ADMIN UPLOAD DELETE ERROR]', deleteError)
      return NextResponse.json(
        {
          error: 'Failed to delete file',
          details: deleteError instanceof Error ? deleteError.message : 'File not found'
        },
        { status: 400 }
      )
    }

    console.log('[ADMIN UPLOAD] File deleted:', bucket, filePath)

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
