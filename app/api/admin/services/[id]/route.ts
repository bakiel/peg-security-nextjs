import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/services/[id]
 * Fetch a single service by ID
 *
 * Security:
 * - Protected by middleware.ts (requires admin authentication)
 * - Uses service role key to bypass RLS
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Validate UUID format
    if (!id || !id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      return NextResponse.json(
        { error: 'Invalid service ID format' },
        { status: 400 }
      )
    }

    const { data: service, error } = await supabaseAdmin
      .from('services')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('[ADMIN SERVICES GET ERROR]', error)

      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Service not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(
        {
          error: 'Failed to fetch service',
          details: error.message
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: service
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[ADMIN SERVICES GET ERROR]', error)

    return NextResponse.json(
      {
        error: 'Failed to fetch service',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/services/[id]
 * Update a service
 *
 * Security:
 * - Protected by middleware.ts (requires admin authentication)
 * - Input validation with Zod
 */

const updateServiceSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  short_description: z.string().min(20).max(200).optional(),
  full_description: z.string().min(100).max(5000).optional(),
  icon_name: z.string().min(1).optional(),
  category: z.enum(['Physical Security', 'Electronic Security', 'Specialised Services', 'Consulting', 'Other']).optional(),
  features: z.array(z.string()).min(1).optional(),
  pricing_model: z.enum(['Fixed Price', 'Hourly Rate', 'Monthly Retainer', 'Custom Quote', 'Contact Us']).optional(),
  pricing_details: z.string().max(500).optional().nullable(),
  image_url: z.string().url().optional().nullable(),
  image_public_id: z.string().optional().nullable(),
  display_order: z.number().int().min(0).optional(),
  status: z.enum(['Active', 'Draft', 'Archived']).optional()
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Validate UUID format
    if (!id || !id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      return NextResponse.json(
        { error: 'Invalid service ID format' },
        { status: 400 }
      )
    }

    const body = await request.json()

    // Validate input
    const validation = updateServiceSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        },
        { status: 400 }
      )
    }

    const data = validation.data

    // If title is being updated, regenerate slug
    let updateData: any = { ...data }

    if (data.title) {
      const newSlug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

      // Check if slug already exists (excluding current service)
      const { data: existingService } = await supabaseAdmin
        .from('services')
        .select('id')
        .eq('slug', newSlug)
        .neq('id', id)
        .single()

      if (existingService) {
        return NextResponse.json(
          {
            error: 'Validation failed',
            details: ['A service with a similar title already exists']
          },
          { status: 400 }
        )
      }

      updateData.slug = newSlug
    }

    // Update service
    const { data: updatedService, error } = await supabaseAdmin
      .from('services')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[ADMIN SERVICES UPDATE ERROR]', error)

      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Service not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(
        {
          error: 'Failed to update service',
          details: error.message
        },
        { status: 400 }
      )
    }

    console.log('[ADMIN SERVICES] Updated service:', updatedService.id)

    return NextResponse.json(
      {
        success: true,
        data: updatedService,
        message: 'Service updated successfully'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[ADMIN SERVICES UPDATE ERROR]', error)

    return NextResponse.json(
      {
        error: 'Failed to update service',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/services/[id]
 * Delete a service
 *
 * Security:
 * - Protected by middleware.ts (requires admin authentication)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Validate UUID format
    if (!id || !id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      return NextResponse.json(
        { error: 'Invalid service ID format' },
        { status: 400 }
      )
    }

    // Delete service
    const { error } = await supabaseAdmin
      .from('services')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[ADMIN SERVICES DELETE ERROR]', error)

      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Service not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(
        {
          error: 'Failed to delete service',
          details: error.message
        },
        { status: 400 }
      )
    }

    console.log('[ADMIN SERVICES] Deleted service:', id)

    return NextResponse.json(
      {
        success: true,
        message: 'Service deleted successfully'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[ADMIN SERVICES DELETE ERROR]', error)

    return NextResponse.json(
      {
        error: 'Failed to delete service',
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
      'Allow': 'GET, PUT, DELETE, OPTIONS'
    }
  })
}
