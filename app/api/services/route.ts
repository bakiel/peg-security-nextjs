import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * GET /api/services
 * Public endpoint to fetch active services from Supabase
 *
 * Query params:
 * - category: Filter by category (e.g., "Physical Security", "Electronic Security")
 *
 * Response:
 * - Returns array of active services only (status='Active')
 * - Ordered by display_order
 * - Cached with Next.js ISR (revalidate every 5 minutes)
 *
 * Security:
 * - Only returns Active services (Draft and Archived are hidden)
 * - Public endpoint, no authentication required
 * - Uses RLS policies for access control
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    // Build query - RLS policy ensures only Active are returned
    let query = supabaseClient
      .from('services')
      .select(`
        id,
        title,
        slug,
        short_description,
        full_description,
        icon_name,
        category,
        features,
        pricing_model,
        pricing_details,
        image_url,
        display_order
      `)
      .eq('status', 'Active')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: true })

    // Apply category filter if provided
    if (category) {
      query = query.eq('category', category)
    }

    const { data: services, error } = await query

    if (error) {
      console.error('[PUBLIC SERVICES API ERROR]', error)
      return NextResponse.json(
        { error: 'Failed to fetch services' },
        { status: 400 }
      )
    }

    console.log(`[PUBLIC SERVICES API] Returning ${services?.length || 0} active services`)

    return NextResponse.json(
      {
        success: true,
        data: services || [],
        count: services?.length || 0
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
        }
      }
    )
  } catch (error) {
    console.error('[PUBLIC SERVICES API ERROR]', error)

    return NextResponse.json(
      { error: 'Failed to fetch services' },
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
      'Allow': 'GET, OPTIONS'
    }
  })
}

// Enable ISR (Incremental Static Regeneration)
export const revalidate = 300 // Revalidate every 5 minutes
