import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/team/[id]
 * Fetch a single team member by ID
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
        { error: 'Invalid team member ID format' },
        { status: 400 }
      )
    }

    const { data: teamMember, error } = await db
      .from('team_members')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('[ADMIN TEAM GET ERROR]', error)

      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Team member not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(
        {
          error: 'Failed to fetch team member',
          details: error.message
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: teamMember
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[ADMIN TEAM GET ERROR]', error)

    return NextResponse.json(
      {
        error: 'Failed to fetch team member',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/team/[id]
 * Update a team member
 *
 * Security:
 * - Protected by middleware.ts (requires admin authentication)
 * - Input validation with Zod
 */

const updateTeamMemberSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  position: z.string().min(2).max(100).optional(),
  bio: z.string().min(50).max(1000).optional(),
  photo_url: z.string().url().optional(),
  photo_public_id: z.string().min(1).optional(),
  email: z.string().email().optional().nullable(),
  phone: z.string().min(10).max(20).optional().nullable(),
  linkedin_url: z.string().url().optional().nullable(),
  display_order: z.number().int().min(0).optional(),
  status: z.enum(['Active', 'Inactive']).optional()
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
        { error: 'Invalid team member ID format' },
        { status: 400 }
      )
    }

    const body = await request.json()

    // Validate input
    const validation = updateTeamMemberSchema.safeParse(body)

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

    // Update team member
    const { data: updatedTeamMember, error } = await db
      .from('team_members')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[ADMIN TEAM UPDATE ERROR]', error)

      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Team member not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(
        {
          error: 'Failed to update team member',
          details: error.message
        },
        { status: 400 }
      )
    }

    console.log('[ADMIN TEAM] Updated team member:', updatedTeamMember.id)

    return NextResponse.json(
      {
        success: true,
        data: updatedTeamMember,
        message: 'Team member updated successfully'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[ADMIN TEAM UPDATE ERROR]', error)

    return NextResponse.json(
      {
        error: 'Failed to update team member',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/team/[id]
 * Delete a team member
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
        { error: 'Invalid team member ID format' },
        { status: 400 }
      )
    }

    // Delete team member
    const { error } = await db
      .from('team_members')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[ADMIN TEAM DELETE ERROR]', error)

      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Team member not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(
        {
          error: 'Failed to delete team member',
          details: error.message
        },
        { status: 400 }
      )
    }

    console.log('[ADMIN TEAM] Deleted team member:', id)

    return NextResponse.json(
      {
        success: true,
        message: 'Team member deleted successfully'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[ADMIN TEAM DELETE ERROR]', error)

    return NextResponse.json(
      {
        error: 'Failed to delete team member',
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
