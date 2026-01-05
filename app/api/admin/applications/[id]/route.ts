import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sanitizeString } from '@/lib/validation'

// Force dynamic rendering (don't pre-render at build time)
export const dynamic = 'force-dynamic'

/**
 * PATCH /api/admin/applications/[id]
 * Update job application status and notes
 *
 * Security:
 * - Protected by middleware.ts (requires admin authentication)
 * - Input validation and sanitization
 * - Record ID validation
 *
 * Body:
 * {
 *   status?: 'New' | 'Reviewing' | 'Interviewed' | 'Hired' | 'Rejected'
 *   notes?: string
 * }
 *
 * Response:
 * {
 *   success: true,
 *   data: UpdatedJobApplication
 * }
 */

interface UpdateApplicationBody {
  status?: 'New' | 'Reviewing' | 'Interviewed' | 'Hired' | 'Rejected'
  notes?: string
}

export async function PATCH(
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

    // Parse request body
    const body: UpdateApplicationBody = await request.json()
    const { status, notes } = body

    // Validate status if provided
    const validStatuses = ['New', 'Reviewing', 'Interviewed', 'Hired', 'Rejected']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: 'Invalid status value',
          details: `Status must be one of: ${validStatuses.join(', ')}`
        },
        { status: 400 }
      )
    }

    // Build update fields
    const updateFields: Record<string, any> = {}

    if (status) {
      updateFields.status = status
    }

    if (notes !== undefined) {
      // Sanitize notes to prevent XSS
      updateFields.notes = sanitizeString(notes)
    }

    // Check if there are fields to update
    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        {
          error: 'No fields to update',
          details: 'Provide at least one field: status or notes'
        },
        { status: 400 }
      )
    }

    // Update record in Supabase
    const { data: updatedRecord, error } = await supabaseAdmin
      .from('applications')
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
          error: 'Job application not found',
          details: 'The specified record does not exist'
        },
        { status: 404 }
      )
    }

    console.log(`[ADMIN APPLICATIONS] Updated application ${id}:`, updateFields)

    return NextResponse.json(
      {
        success: true,
        data: updatedRecord
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[ADMIN APPLICATIONS UPDATE ERROR]', error)

    return NextResponse.json(
      {
        error: 'Failed to update job application',
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
      Allow: 'PATCH, OPTIONS'
    }
  })
}
