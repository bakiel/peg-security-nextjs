import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { sanitizeObject } from '@/lib/sanitize'

/**
 * GET /api/admin/services
 * Fetch all services from Supabase (any status)
 *
 * Query Parameters:
 * - status: Filter by status (Active, Draft, Archived)
 * - category: Filter by category
 *
 * Security:
 * - Protected by middleware.ts (requires admin authentication)
 * - Uses service role key to bypass RLS
 *
 * Response:
 * {
 *   success: true,
 *   data: Service[]
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const statusFilter = searchParams.get('status')
    const categoryFilter = searchParams.get('category')

    // Create admin Supabase client (bypasses RLS)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Build query
    let query = supabase
      .from('services')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: true })

    // Apply status filter if provided
    if (statusFilter && ['Active', 'Draft', 'Archived'].includes(statusFilter)) {
      query = query.eq('status', statusFilter)
    }

    // Apply category filter if provided
    if (categoryFilter) {
      query = query.eq('category', categoryFilter)
    }

    const { data: services, error } = await query

    if (error) {
      console.error('[ADMIN SERVICES ERROR]', error)
      return NextResponse.json(
        {
          error: 'Failed to fetch services',
          details: error.message
        },
        { status: 400 }
      )
    }

    console.log(`[ADMIN SERVICES] Fetched ${services?.length || 0} services`)

    return NextResponse.json(
      {
        success: true,
        data: services || []
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[ADMIN SERVICES ERROR]', error)

    return NextResponse.json(
      {
        error: 'Failed to fetch services',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/services
 * Create a new service
 *
 * Security:
 * - Protected by middleware.ts (requires admin authentication)
 * - Input validation with Zod
 *
 * Body:
 * {
 *   title: string
 *   short_description: string
 *   full_description: string
 *   icon_name: string
 *   category: string
 *   features: string[]
 *   pricing_model: string
 *   pricing_details?: string
 *   image_url?: string
 *   image_public_id?: string
 *   display_order?: number
 *   status?: 'Active' | 'Draft' | 'Archived'
 * }
 */

const serviceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  short_description: z.string().min(20, 'Short description must be at least 20 characters').max(200),
  full_description: z.string().min(100, 'Full description must be at least 100 characters').max(5000),
  icon_name: z.string().min(1, 'Icon name is required'),
  category: z.enum(['Physical Security', 'Electronic Security', 'Specialised Services', 'Consulting', 'Other']),
  features: z.array(z.string()).min(1, 'At least one feature is required'),
  pricing_model: z.enum(['Fixed Price', 'Hourly Rate', 'Monthly Retainer', 'Custom Quote', 'Contact Us']),
  pricing_details: z.string().max(500).optional().nullable(),
  image_url: z.string().url('Image URL must be a valid URL').optional().nullable(),
  image_public_id: z.string().optional().nullable(),
  display_order: z.number().int().min(0).optional(),
  status: z.enum(['Active', 'Draft', 'Archived']).optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Sanitize all string inputs to prevent XSS
    const sanitizedBody = sanitizeObject(body)

    // Validate input
    const validation = serviceSchema.safeParse(sanitizedBody)

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

    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Create admin Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Check if slug already exists
    const { data: existingService } = await supabase
      .from('services')
      .select('id')
      .eq('slug', slug)
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

    // Prepare record
    const serviceRecord = {
      title: data.title,
      slug,
      short_description: data.short_description,
      full_description: data.full_description,
      icon_name: data.icon_name,
      category: data.category,
      features: data.features,
      pricing_model: data.pricing_model,
      pricing_details: data.pricing_details || null,
      image_url: data.image_url || null,
      image_public_id: data.image_public_id || null,
      display_order: data.display_order || 0,
      status: data.status || 'Draft'
    }

    // Insert into database
    const { data: createdService, error } = await supabase
      .from('services')
      .insert(serviceRecord)
      .select()
      .single()

    if (error) {
      console.error('[ADMIN SERVICES CREATE ERROR]', error)
      return NextResponse.json(
        {
          error: 'Failed to create service',
          details: error.message
        },
        { status: 400 }
      )
    }

    console.log('[ADMIN SERVICES] Created new service:', createdService.id, data.title)

    return NextResponse.json(
      {
        success: true,
        data: createdService,
        message: 'Service created successfully'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[ADMIN SERVICES CREATE ERROR]', error)

    return NextResponse.json(
      {
        error: 'Failed to create service',
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
      'Allow': 'GET, POST, OPTIONS'
    }
  })
}
