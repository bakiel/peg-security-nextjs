import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sanitizeString } from '@/lib/validation'

// Admin route - use service role key to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * PATCH /api/admin/contacts/[id]
 * Update contact submission status and notes
 *
 * Security:
 * - Protected by middleware.ts (requires admin authentication)
 * - Input validation and sanitization
 * - Record ID validation
 *
 * Body:
 * {
 *   status?: 'New' | 'Read' | 'Responded'
 *   notes?: string
 * }
 *
 * Response:
 * {
 *   success: true,
 *   data: UpdatedContactSubmission
 * }
 */

interface UpdateContactBody {
  status?: 'New' | 'Read' | 'Responded'
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
    const body: UpdateContactBody = await request.json()
    const { status, notes } = body

    // Validate status if provided
    if (status && !['New', 'Read', 'Responded'].includes(status)) {
      return NextResponse.json(
        {
          error: 'Invalid status value',
          details: 'Status must be one of: New, Read, Responded'
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
    const { data: updatedRecord, error } = await supabase
      .from('contacts')
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
          error: 'Contact submission not found',
          details: 'The specified record does not exist'
        },
        { status: 404 }
      )
    }

    console.log(`[ADMIN CONTACTS] Updated contact ${id}:`, updateFields)

    return NextResponse.json(
      {
        success: true,
        data: updatedRecord
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[ADMIN CONTACTS UPDATE ERROR]', error)

    return NextResponse.json(
      {
        error: 'Failed to update contact submission',
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
