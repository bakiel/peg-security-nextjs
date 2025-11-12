import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { validateLength, sanitizeString } from '@/lib/validation'

export const dynamic = 'force-dynamic'

/**
 * PATCH /api/admin/jobs/[id]
 * Update an existing job listing
 *
 * Security:
 * - Protected by middleware.ts (requires admin authentication)
 * - Input validation and sanitization
 * - Record ID validation
 *
 * Body (all fields optional):
 * {
 *   title?: string
 *   category?: string
 *   location?: string
 *   employmentType?: string
 *   psiraRequired?: boolean
 *   description?: string
 *   responsibilities?: string[]
 *   requirements?: string[]
 *   benefits?: string[]
 *   status?: 'Draft' | 'Open' | 'Closed'
 * }
 */

interface UpdateJobBody {
  title?: string
  category?: string
  location?: string
  employmentType?: string
  psiraRequired?: boolean
  description?: string
  responsibilities?: string[]
  requirements?: string[]
  benefits?: string[]
  status?: 'Draft' | 'Open' | 'Closed'
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
    const body: UpdateJobBody = await request.json()
    const {
      title,
      category,
      location,
      employmentType,
      psiraRequired,
      description,
      responsibilities,
      requirements,
      benefits,
      status
    } = body

    // Validation
    const validationErrors: string[] = []
    const updateFields: Record<string, any> = {}

    // Validate and add title if provided
    if (title !== undefined) {
      const titleResult = validateLength(title, 5, 100, 'Title')
      if (!titleResult.valid) {
        validationErrors.push(titleResult.error!)
      } else {
        updateFields.title = sanitizeString(titleResult.value!)
        // Update slug
        updateFields.slug = titleResult.value!
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
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
        'Technical Support',
        'Administration'
      ]
      if (!validCategories.includes(category)) {
        validationErrors.push(`Category must be one of: ${validCategories.join(', ')}`)
      } else {
        updateFields.category = category
      }
    }

    // Validate and add location if provided
    if (location !== undefined) {
      const locationResult = validateLength(location, 3, 100, 'Location')
      if (!locationResult.valid) {
        validationErrors.push(locationResult.error!)
      } else {
        updateFields.location = sanitizeString(locationResult.value!)
      }
    }

    // Validate and add employment type if provided
    if (employmentType !== undefined) {
      const validEmploymentTypes = ['Full-time', 'Part-time', 'Contract']
      if (!validEmploymentTypes.includes(employmentType)) {
        validationErrors.push(`Employment type must be one of: ${validEmploymentTypes.join(', ')}`)
      } else {
        updateFields.employment_type = employmentType
      }
    }

    // Add PSIRA required if provided
    if (psiraRequired !== undefined) {
      updateFields.psira_required = psiraRequired
    }

    // Validate and add description if provided
    if (description !== undefined) {
      const descriptionResult = validateLength(description, 50, 5000, 'Description')
      if (!descriptionResult.valid) {
        validationErrors.push(descriptionResult.error!)
      } else {
        updateFields.description = sanitizeString(descriptionResult.value!)
      }
    }

    // Validate and add responsibilities if provided
    if (responsibilities !== undefined) {
      if (!Array.isArray(responsibilities) || responsibilities.length < 3) {
        validationErrors.push('At least 3 responsibilities are required')
      } else {
        let hasError = false
        responsibilities.forEach((resp, index) => {
          if (!resp || resp.trim().length < 10) {
            validationErrors.push(`Responsibility ${index + 1} must be at least 10 characters`)
            hasError = true
          }
        })
        if (!hasError) {
          updateFields.responsibilities = responsibilities.map(r => sanitizeString(r)).join('\n')
        }
      }
    }

    // Validate and add requirements if provided
    if (requirements !== undefined) {
      if (!Array.isArray(requirements) || requirements.length < 3) {
        validationErrors.push('At least 3 requirements are required')
      } else {
        let hasError = false
        requirements.forEach((req, index) => {
          if (!req || req.trim().length < 10) {
            validationErrors.push(`Requirement ${index + 1} must be at least 10 characters`)
            hasError = true
          }
        })
        if (!hasError) {
          updateFields.requirements = requirements.map(r => sanitizeString(r)).join('\n')
        }
      }
    }

    // Validate and add benefits if provided
    if (benefits !== undefined) {
      if (!Array.isArray(benefits) || benefits.length < 2) {
        validationErrors.push('At least 2 benefits are required')
      } else {
        let hasError = false
        benefits.forEach((benefit, index) => {
          if (!benefit || benefit.trim().length < 10) {
            validationErrors.push(`Benefit ${index + 1} must be at least 10 characters`)
            hasError = true
          }
        })
        if (!hasError) {
          updateFields.benefits = benefits.map(b => sanitizeString(b)).join('\n')
        }
      }
    }

    // Validate and add status if provided
    if (status !== undefined) {
      const validStatuses = ['Draft', 'Open', 'Closed']
      if (!validStatuses.includes(status)) {
        validationErrors.push(`Status must be one of: ${validStatuses.join(', ')}`)
      } else {
        updateFields.status = status
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
    const { data: updatedRecord, error } = await supabaseAdmin
      .from('jobs')
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
          error: 'Job listing not found',
          details: 'The specified record does not exist'
        },
        { status: 404 }
      )
    }

    console.log(`[ADMIN JOBS] Updated job ${id}:`, Object.keys(updateFields))

    return NextResponse.json(
      {
        success: true,
        data: updatedRecord,
        message: 'Job listing updated successfully'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[ADMIN JOBS UPDATE ERROR]', error)

    return NextResponse.json(
      {
        error: 'Failed to update job listing',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/jobs/[id]
 * Delete a job listing
 *
 * Security:
 * - Protected by middleware.ts (requires admin authentication)
 * - Record ID validation
 *
 * Response:
 * {
 *   success: true,
 *   message: 'Job listing deleted successfully'
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

    // Delete record from Supabase
    const { error } = await supabaseAdmin
      .from('jobs')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }

    console.log(`[ADMIN JOBS] Deleted job ${id}`)

    return NextResponse.json(
      {
        success: true,
        message: 'Job listing deleted successfully'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[ADMIN JOBS DELETE ERROR]', error)

    return NextResponse.json(
      {
        error: 'Failed to delete job listing',
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
