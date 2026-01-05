import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { validateLength, sanitizeString } from '@/lib/validation'
import { processImageFromBase64 } from '@/lib/image-processing'

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/gallery
 * Fetch all gallery images from Supabase
 *
 * Query Parameters:
 * - status: Filter by status (Active, Hidden)
 * - category: Filter by category
 *
 * Security:
 * - Protected by middleware.ts (requires admin authentication)
 *
 * Response:
 * {
 *   success: true,
 *   data: GalleryImage[]
 * }
 */

export interface GalleryImage {
  id: string
  title: string
  description: string
  category: string
  image_url: string
  image_public_id: string
  thumbnail_url: string
  status: 'Active' | 'Hidden'
  display_order: number
  created_at: string
  updated_at: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const statusFilter = searchParams.get('status')
    const categoryFilter = searchParams.get('category')

    // Build Supabase query
    let query = db
      .from('gallery')
      .select('*')

    // Apply filters
    if (statusFilter && ['Active', 'Hidden'].includes(statusFilter)) {
      query = query.eq('status', statusFilter)
    }

    if (categoryFilter) {
      query = query.eq('category', categoryFilter)
    }

    // Apply sorting
    query = query
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    const { data: images, error } = await query

    if (error) {
      throw error
    }

    console.log(`[ADMIN GALLERY] Fetched ${images?.length || 0} gallery images`)

    return NextResponse.json(
      {
        success: true,
        data: images || []
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[ADMIN GALLERY ERROR]', error)

    return NextResponse.json(
      {
        error: 'Failed to fetch gallery images',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/gallery
 * Upload a new image to gallery
 *
 * Security:
 * - Protected by middleware.ts (requires admin authentication)
 * - Input validation and sanitization
 * - Cloudinary image upload with size/format validation
 *
 * Body:
 * {
 *   image: string (base64 or file data)
 *   title: string
 *   description: string
 *   category: string
 *   status: 'Active' | 'Hidden'
 *   displayOrder?: number
 * }
 */

interface CreateGalleryBody {
  image: string
  title: string
  description: string
  category: string
  status: 'Active' | 'Hidden'
  displayOrder?: number
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateGalleryBody = await request.json()
    const { image, title, description, category, status, displayOrder } = body

    // Validation
    const validationErrors: string[] = []

    // Validate title
    const titleResult = validateLength(title, 3, 100, 'Title')
    if (!titleResult.valid) {
      validationErrors.push(titleResult.error!)
    }

    // Validate description
    const descriptionResult = validateLength(description, 10, 500, 'Description')
    if (!descriptionResult.valid) {
      validationErrors.push(descriptionResult.error!)
    }

    // Validate category
    const validCategories = [
      'Armed Response',
      'CCTV Installation',
      'Access Control',
      'Security Guard',
      'Event Security',
      'VIP Protection',
      'Projects',
      'Team',
      'Other'
    ]
    if (!category || !validCategories.includes(category)) {
      validationErrors.push(`Category must be one of: ${validCategories.join(', ')}`)
    }

    // Validate status
    if (status && !['Active', 'Hidden'].includes(status)) {
      validationErrors.push('Status must be Active or Hidden')
    }

    // Validate image
    if (!image || typeof image !== 'string') {
      validationErrors.push('Image data is required')
    }

    // Return validation errors if any
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationErrors
        },
        { status: 400 }
      )
    }

    // Process image: Convert to JPEG, crop to 1:1, resize to 1000x1000
    console.log('[ADMIN GALLERY] Processing image (JPEG, 1:1 crop, 1000x1000)...')

    const processed = await processImageFromBase64(image, {
      maxSize: 1000,
      quality: 85,
      aspectRatio: '1:1',
      format: 'jpeg'
    })

    console.log(`[ADMIN GALLERY] Image processed: ${processed.width}x${processed.height}, ${processed.size} bytes`)

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(7)
    const fileName = `${timestamp}-${randomString}.jpg`

    // Upload to Supabase Storage
    console.log('[ADMIN GALLERY] Uploading to Supabase Storage...')
    const { data: uploadData, error: uploadError } = await db.storage
      .from('gallery')
      .upload(fileName, processed.buffer, {
        contentType: 'image/jpeg',
        upsert: false
      })

    if (uploadError) {
      throw new Error(`Storage upload failed: ${uploadError.message}`)
    }

    console.log('[ADMIN GALLERY] Upload successful:', uploadData.path)

    // Get public URL
    const { data: urlData } = db.storage
      .from('gallery')
      .getPublicUrl(uploadData.path)

    const imageUrl = urlData.publicUrl
    const thumbnailUrl = imageUrl // For now, use same URL for thumbnail

    // Prepare data for Supabase
    const galleryRecord = {
      title: sanitizeString(titleResult.value!),
      description: sanitizeString(descriptionResult.value!),
      category: category,
      image_url: imageUrl,
      image_public_id: uploadData.path,
      thumbnail_url: thumbnailUrl,
      status: status || 'Active',
      display_order: displayOrder || 0
    }

    // Create record in Supabase
    const { data: createdImage, error } = await db
      .from('gallery')
      .insert([galleryRecord])
      .select()
      .single()

    if (error) {
      throw error
    }

    console.log('[ADMIN GALLERY] Created new gallery image:', createdImage.id)

    return NextResponse.json(
      {
        success: true,
        data: createdImage,
        message: 'Image uploaded successfully'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[ADMIN GALLERY CREATE ERROR]', error)

    // Check for storage upload errors
    if (error instanceof Error && error.message.includes('Storage')) {
      return NextResponse.json(
        {
          error: 'Failed to upload image',
          details: 'Image upload to storage failed. Please try again.'
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        error: 'Failed to create gallery image',
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
      Allow: 'GET, POST, OPTIONS'
    }
  })
}
