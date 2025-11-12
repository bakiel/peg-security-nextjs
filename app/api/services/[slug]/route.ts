import { NextRequest, NextResponse } from 'next/server'
import { supabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

/**
 * GET /api/services/[slug]
 * Public endpoint to fetch a single service by slug
 *
 * Response:
 * - Returns full service details if status='Active'
 * - 404 if service not found or not Active
 * - Cached with Next.js ISR
 *
 * Security:
 * - Only returns Active services
 * - Public endpoint, no authentication required
 * - Uses RLS policies for access control
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    // Validate slug format
    if (!slug || slug.trim() === '') {
      return NextResponse.json(
        { error: 'Invalid service slug' },
        { status: 400 }
      )
    }

    // Query service by slug - RLS ensures only Active are accessible
    const { data: service, error } = await supabaseClient
      .from('services')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'Active')
      .single()

    if (error) {
      console.error('[PUBLIC SERVICES SLUG API ERROR]', error)

      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Service not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(
        { error: 'Failed to fetch service' },
        { status: 400 }
      )
    }

    console.log(`[PUBLIC SERVICES SLUG API] Returning service: ${service.title}`)

    return NextResponse.json(
      {
        success: true,
        data: service
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
        }
      }
    )
  } catch (error) {
    console.error('[PUBLIC SERVICES SLUG API ERROR]', error)

    return NextResponse.json(
      { error: 'Failed to fetch service' },
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
