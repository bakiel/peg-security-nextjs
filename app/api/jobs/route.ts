import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * GET /api/jobs
 * Public endpoint to fetch open job listings from Supabase
 *
 * Query params:
 * - category: Filter by category
 *
 * Response:
 * - Returns array of open job listings only
 * - Cached with Next.js ISR (revalidate every 5 minutes)
 *
 * Security:
 * - Only returns jobs with status='Open' (Draft and Closed are hidden)
 * - Public endpoint, no authentication required
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    // Build query - ONLY return Open jobs for public API
    let query = supabaseClient
      .from('jobs')
      .select('*')
      .eq('status', 'Open')
      .order('created_at', { ascending: false })

    // Apply category filter if provided
    if (category) {
      query = query.eq('category', category)
    }

    const { data: jobs, error } = await query

    if (error) {
      console.error('[PUBLIC JOBS API ERROR]', error)
      return NextResponse.json(
        { error: 'Failed to fetch jobs' },
        { status: 500 }
      )
    }

    console.log(`[PUBLIC JOBS API] Returning ${jobs?.length || 0} open job listings`)

    return NextResponse.json(
      {
        success: true,
        data: jobs || [],
        count: jobs?.length || 0
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
        }
      }
    )
  } catch (error) {
    console.error('[PUBLIC JOBS API ERROR]', error)

    return NextResponse.json(
      {
        error: 'Failed to fetch jobs'
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
      'Allow': 'GET, OPTIONS'
    }
  })
}

// Enable ISR (Incremental Static Regeneration)
export const revalidate = 300 // Revalidate every 5 minutes
