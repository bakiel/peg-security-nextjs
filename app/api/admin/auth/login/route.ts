import { NextRequest, NextResponse } from 'next/server'
import { verifyCredentials, createSession, generateCsrfToken } from '@/lib/auth'
import { rateLimit, getClientIp, trackFailedLogin, resetFailedLogins } from '@/lib/rate-limit'

/**
 * POST /api/admin/auth/login
 * Admin login endpoint
 *
 * Security:
 * - Rate limiting (5 attempts per 15 minutes)
 * - Progressive delays on failed attempts
 * - CSRF token generation
 * - Secure session cookie creation
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const rateLimitResult = await rateLimit(request, 'adminLogin')

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: rateLimitResult.message || 'Too many login attempts',
          retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000)
        },
        { status: 429 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { username, password } = body

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Get client IP for tracking
    const clientIp = getClientIp(request)

    // Verify credentials
    const isValid = verifyCredentials(username, password)

    if (!isValid) {
      // Track failed login attempt
      const failedAttempt = trackFailedLogin(clientIp)

      // Log failed attempt
      console.warn('[LOGIN FAILED]', {
        username,
        ip: clientIp,
        attempts: failedAttempt.attempts,
        timestamp: new Date().toISOString()
      })

      // Apply progressive delay
      await new Promise(resolve => setTimeout(resolve, failedAttempt.delayMs))

      return NextResponse.json(
        {
          error: 'Invalid credentials',
          attemptsRemaining: Math.max(0, 5 - failedAttempt.attempts)
        },
        { status: 401 }
      )
    }

    // Reset failed login attempts on successful login
    resetFailedLogins(clientIp)

    // Generate session token and create response
    const jsonResponse = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        redirectUrl: '/admin/dashboard'
      },
      { status: 200 }
    )

    // Create session with HttpOnly cookie
    const response = await createSession(jsonResponse, 'admin', username)

    // Log successful login
    console.log('[LOGIN SUCCESS]', {
      username,
      ip: clientIp,
      timestamp: new Date().toISOString()
    })

    return response
  } catch (error) {
    console.error('[LOGIN ERROR]', error)

    return NextResponse.json(
      { error: 'An error occurred during login' },
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
