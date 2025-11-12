/**
 * CSRF Protection Middleware
 *
 * Validates CSRF tokens on state-changing requests (POST, PUT, DELETE)
 * Integrates with existing CSRF functionality in /lib/auth.ts
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyCsrfToken } from './auth'

/**
 * Validate CSRF token for state-changing requests
 * Returns error response if validation fails, null if valid
 */
export function validateCsrf(request: NextRequest): NextResponse | null {
  // Only validate CSRF on state-changing methods
  const method = request.method
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    return null // No CSRF check needed for GET, HEAD, OPTIONS
  }

  // Get CSRF token from header
  const csrfToken = request.headers.get('X-CSRF-Token') || request.headers.get('x-csrf-token')

  // Verify CSRF token
  if (!csrfToken || !verifyCsrfToken(request, csrfToken)) {
    console.warn('[CSRF VALIDATION FAILED]', {
      method,
      path: request.nextUrl.pathname,
      hasToken: !!csrfToken,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json(
      {
        error: 'CSRF validation failed',
        message: 'Invalid or missing CSRF token. Please refresh the page and try again.'
      },
      { status: 403 }
    )
  }

  // CSRF token is valid
  return null
}

/**
 * Get CSRF token from cookie (client-side helper)
 * This function can be used in client components
 */
export function getCsrfTokenFromCookie(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  const match = document.cookie.match(/peg_csrf_token=([^;]+)/)
  return match ? match[1] : null
}

/**
 * Add CSRF token to fetch headers (client-side helper)
 */
export function addCsrfHeader(headers: HeadersInit = {}): HeadersInit {
  const csrfToken = getCsrfTokenFromCookie()

  if (csrfToken) {
    return {
      ...headers,
      'X-CSRF-Token': csrfToken
    }
  }

  return headers
}
