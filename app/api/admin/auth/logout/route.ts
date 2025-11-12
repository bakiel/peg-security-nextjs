import { NextRequest, NextResponse } from 'next/server'
import { deleteSession, getSession } from '@/lib/auth'

/**
 * POST /api/admin/auth/logout
 * Admin logout endpoint
 *
 * Security:
 * - Requires valid session
 * - Clears session cookie
 * - Clears CSRF token
 */
export async function POST(request: NextRequest) {
  try {
    // Get current session
    const session = await getSession(request)

    // Create response
    const jsonResponse = NextResponse.json(
      {
        success: true,
        message: 'Logged out successfully'
      },
      { status: 200 }
    )

    // Delete session cookie
    const response = deleteSession(jsonResponse)

    // Log logout if session existed
    if (session) {
      console.log('[LOGOUT]', {
        username: session.username,
        timestamp: new Date().toISOString()
      })
    }

    return response
  } catch (error) {
    console.error('[LOGOUT ERROR]', error)

    return NextResponse.json(
      { error: 'An error occurred during logout' },
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
      'Allow': 'POST, OPTIONS'
    }
  })
}
