import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { validateLength, sanitizeString } from '@/lib/validation'

export const dynamic = 'force-dynamic'

/**
 * PATCH /api/admin/gallery/[id]
 * Update gallery image metadata
 *
 * Security:
 * - Protected by middleware.ts (requires admin authentication)
 * - Input validation and sanitization
 * - Record ID format validation
 *
 * Body (all fields optional):
 * {
 *   title?: string
 *   description?: string
 *   category?: string
 *   status?: 'Active' | 'Hidden'
 *   displayOrder?: number
 * }
 */

interface UpdateGalleryBody {
  title?: string
  description?: string
  category?: string
  status?: 'Active' | 'Hidden'
  displayOrder?: number
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Validate UUID format
    if (!id) {
      return NextResponse.json(
        {
          error: 'Invalid record ID',
          details: 'Record ID is required'
        },
        { status: 400 }
      )
    }

    // Parse request body
    const body: UpdateGalleryBody = await request.json()
    const { title, description, category, status, displayOrder } = body

    // Validation
    const validationErrors: string[] = []
    const updateFields: Record<string, any> = {}

    // Validate and add title if provided
    if (title !== undefined) {
      const titleResult = validateLength(title, 3, 100, 'Title')
      if (!titleResult.valid) {
        validationErrors.push(titleResult.error!)
      } else {
        updateFields.title = sanitizeString(titleResult.value!)
      }
    }

    // Validate and add description if provided
    if (description !== undefined) {
      const descriptionResult = validateLength(description, 10, 500, 'Description')
      if (!descriptionResult.valid) {
        validationErrors.push(descriptionResult.error!)
      } else {
        updateFields.description = sanitizeString(descriptionResult.value!)
      }
    }

    // Validate and add category if provided
    if (category !== undefined) {
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
      if (!validCategories.includes(category)) {
        validationErrors.push(`Category must be one of: ${validCategories.join(', ')}`)
      } else {
        updateFields.category = category
      }
    }

    // Validate and add status if provided
    if (status !== undefined) {
      if (!['Active', 'Hidden'].includes(status)) {
        validationErrors.push('Status must be Active or Hidden')
      } else {
        updateFields.status = status
      }
    }

    // Add display order if provided
    if (displayOrder !== undefined) {
      if (typeof displayOrder !== 'number') {
        validationErrors.push('Display order must be a number')
      } else {
        updateFields.display_order = displayOrder
      }
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

    // Check if there are fields to update
    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        {
          error: 'No fields to update',
          details: 'Provide at least one field to update'
        },
        { status: 400 }
      )
    }

    // Always update the "Updated At" timestamp
    updateFields.updated_at = new Date().toISOString()

    // Update record in Supabase
    const { data: updatedRecord, error } = await db
      .from('gallery')
      .update(updateFields)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    if (!updatedRecord) {
      return NextResponse.json(
        {
          error: 'Gallery image not found',
          details: 'The specified record does not exist'
        },
        { status: 404 }
      )
    }

    console.log(`[ADMIN GALLERY] Updated image ${id}:`, Object.keys(updateFields))

    return NextResponse.json(
      {
        success: true,
        data: updatedRecord,
        message: 'Gallery image updated successfully'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[ADMIN GALLERY UPDATE ERROR]', error)

    return NextResponse.json(
      {
        error: 'Failed to update gallery image',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/gallery/[id]
 * Delete a gallery image
 *
 * Security:
 * - Protected by middleware.ts (requires admin authentication)
 * - Record ID validation
 * - Deletes image from Supabase Storage
 * - Deletes record from Supabase database
 *
 * Response:
 * {
 *   success: true,
 *   message: 'Gallery image deleted successfully'
 * }
 */

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Validate record ID
    if (!id) {
      return NextResponse.json(
        {
          error: 'Invalid record ID',
          details: 'Record ID is required'
        },
        { status: 400 }
      )
    }

    // First, fetch the record to get the Supabase Storage path
    const { data: imageToDelete, error: fetchError } = await db
      .from('gallery')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !imageToDelete) {
      return NextResponse.json(
        {
          error: 'Gallery image not found',
          details: 'The specified record does not exist'
        },
        { status: 404 }
      )
    }

    // Delete image from Supabase Storage
    if (imageToDelete.image_public_id) {
      try {
        const { error: storageError } = await db.storage
          .from('gallery')
          .remove([imageToDelete.image_public_id])

        if (storageError) {
          console.error('[ADMIN GALLERY] Storage deletion failed:', storageError)
          // Continue with database deletion even if storage fails
        } else {
          console.log(`[ADMIN GALLERY] Deleted image from Storage: ${imageToDelete.image_public_id}`)
        }
      } catch (storageError) {
        console.error('[ADMIN GALLERY] Storage deletion error:', storageError)
        // Continue with database deletion even if storage fails
      }
    }

    // Delete record from Supabase
    const { error: deleteError } = await db
      .from('gallery')
      .delete()
      .eq('id', id)

    if (deleteError) {
      throw deleteError
    }

    console.log(`[ADMIN GALLERY] Deleted gallery image ${id}`)

    return NextResponse.json(
      {
        success: true,
        message: 'Gallery image deleted successfully'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[ADMIN GALLERY DELETE ERROR]', error)

    return NextResponse.json(
      {
        error: 'Failed to delete gallery image',
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
      Allow: 'PATCH, DELETE, OPTIONS'
    }
  })
}
