import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * GET /api/jobs/[slug]
 * Fetch a single job listing by slug from Supabase
 *
 * Response:
 * - Returns single job listing
 * - 404 if job not found
 * - Cached with Next.js ISR
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      )
    }

    // Query Supabase for job with matching slug (only Open jobs)
    const { data: job, error } = await db
      .from('jobs')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'Open')
      .single()

    if (error || !job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: job
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
        }
      }
    )
  } catch (error) {
    console.error('[JOB API ERROR]', error)

    return NextResponse.json(
      {
        error: 'Failed to fetch job'
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
export const revalidate = 3600 // Revalidate every hour
