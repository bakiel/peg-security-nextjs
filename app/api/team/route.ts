import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * GET /api/team
 * Public endpoint to fetch active team members from Supabase
 *
 * Response:
 * - Returns array of active team members only (status='Active')
 * - Ordered by display_order
 * - Cached with Next.js ISR (revalidate every 5 minutes)
 *
 * Security:
 * - Only returns Active team members (Inactive are hidden)
 * - Public endpoint, no authentication required
 * - Uses RLS policies for access control
 */
export async function GET(request: NextRequest) {
  try {
    // Create public Supabase client (respects RLS)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Query team members - RLS policy ensures only Active are returned
    const { data: teamMembers, error } = await supabase
      .from('team_members')
      .select('id, name, position, bio, photo_url, email, phone, linkedin_url, display_order')
      .eq('status', 'Active')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: true })

    if (error) {
      console.error('[PUBLIC TEAM API ERROR]', error)
      return NextResponse.json(
        { error: 'Failed to fetch team members' },
        { status: 400 }
      )
    }

    console.log(`[PUBLIC TEAM API] Returning ${teamMembers?.length || 0} active team members`)

    return NextResponse.json(
      {
        success: true,
        data: teamMembers || [],
        count: teamMembers?.length || 0
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
        }
      }
    )
  } catch (error) {
    console.error('[PUBLIC TEAM API ERROR]', error)

    return NextResponse.json(
      { error: 'Failed to fetch team members' },
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
