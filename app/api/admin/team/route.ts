import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { sanitizeObject } from '@/lib/sanitize'
import { validateCsrf } from '@/lib/csrf'

/**
 * GET /api/admin/team
 * Fetch all team members from Supabase (any status)
 *
 * Query Parameters:
 * - status: Filter by status (Active, Inactive)
 *
 * Security:
 * - Protected by middleware.ts (requires admin authentication)
 * - Uses service role key to bypass RLS
 *
 * Response:
 * {
 *   success: true,
 *   data: TeamMember[]
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const statusFilter = searchParams.get('status')

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
      .from('team_members')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: true })

    // Apply status filter if provided
    if (statusFilter && ['Active', 'Inactive'].includes(statusFilter)) {
      query = query.eq('status', statusFilter)
    }

    const { data: teamMembers, error } = await query

    if (error) {
      console.error('[ADMIN TEAM ERROR]', error)
      return NextResponse.json(
        {
          error: 'Failed to fetch team members',
          details: error.message
        },
        { status: 400 }
      )
    }

    console.log(`[ADMIN TEAM] Fetched ${teamMembers?.length || 0} team members`)

    return NextResponse.json(
      {
        success: true,
        data: teamMembers || []
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[ADMIN TEAM ERROR]', error)

    return NextResponse.json(
      {
        error: 'Failed to fetch team members',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/team
 * Create a new team member
 *
 * Security:
 * - Protected by middleware.ts (requires admin authentication)
 * - Input validation with Zod
 *
 * Body:
 * {
 *   name: string
 *   position: string
 *   bio: string
 *   photo_url: string
 *   photo_public_id: string
 *   email?: string
 *   phone?: string
 *   linkedin_url?: string
 *   display_order?: number
 *   status?: 'Active' | 'Inactive'
 * }
 */

const teamMemberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  position: z.string().min(2, 'Position must be at least 2 characters').max(100),
  bio: z.string().min(50, 'Bio must be at least 50 characters').max(1000),
  photo_url: z.string().url('Photo URL must be a valid URL'),
  photo_public_id: z.string().min(1, 'Photo public ID is required'),
  email: z.string().email('Invalid email address').optional().nullable(),
  phone: z.string().min(10, 'Phone must be at least 10 characters').max(20).optional().nullable(),
  linkedin_url: z.string().url('LinkedIn URL must be a valid URL').optional().nullable(),
  display_order: z.number().int().min(0).optional(),
  status: z.enum(['Active', 'Inactive']).optional()
})

export async function POST(request: NextRequest) {
  try {
    // Validate CSRF token
    const csrfError = validateCsrf(request)
    if (csrfError) {
      return csrfError
    }

    const body = await request.json()

    // Sanitize all string inputs to prevent XSS
    const sanitizedBody = sanitizeObject(body)

    // Validate input
    const validation = teamMemberSchema.safeParse(sanitizedBody)

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

    // Prepare record
    const teamMemberRecord = {
      name: data.name,
      position: data.position,
      bio: data.bio,
      photo_url: data.photo_url,
      photo_public_id: data.photo_public_id,
      email: data.email || null,
      phone: data.phone || null,
      linkedin_url: data.linkedin_url || null,
      display_order: data.display_order || 0,
      status: data.status || 'Active'
    }

    // Insert into database
    const { data: createdTeamMember, error } = await supabase
      .from('team_members')
      .insert(teamMemberRecord)
      .select()
      .single()

    if (error) {
      console.error('[ADMIN TEAM CREATE ERROR]', error)
      return NextResponse.json(
        {
          error: 'Failed to create team member',
          details: error.message
        },
        { status: 400 }
      )
    }

    console.log('[ADMIN TEAM] Created new team member:', createdTeamMember.id, data.name)

    return NextResponse.json(
      {
        success: true,
        data: createdTeamMember,
        message: 'Team member created successfully'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[ADMIN TEAM CREATE ERROR]', error)

    return NextResponse.json(
      {
        error: 'Failed to create team member',
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
