import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { requireAuth } from './lib/auth'

/**
 * Middleware for route protection and session management
 *
 * Protected routes:
 * - /admin/* (except /admin/login)
 * - /api/admin/* (except /api/admin/auth/login)
 *
 * Security features:
 * - Session validation
 * - Automatic redirects for unauthenticated users
 * - Session refresh for active users
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for public assets and API routes that don't need auth
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/favicon.ico') ||
    pathname === '/api/admin/auth/login' ||
    pathname === '/api/admin/auth/logout'
  ) {
    return NextResponse.next()
  }

  // Protect all /admin routes except login
  if (pathname.startsWith('/admin')) {
    // Allow access to login page
    if (pathname === '/admin/login') {
      // If already authenticated, redirect to dashboard
      const session = await requireAuth(request)
      if (session) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      }
      return NextResponse.next()
    }

    // Check authentication for all other admin routes
    const session = await requireAuth(request)

    if (!session) {
      // Redirect to login if not authenticated
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Allow authenticated users to proceed
    return NextResponse.next()
  }

  // Protect all /api/admin routes except auth endpoints
  if (pathname.startsWith('/api/admin')) {
    const session = await requireAuth(request)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      )
    }

    // Allow authenticated users to proceed
    return NextResponse.next()
  }

  // Allow all other routes
  return NextResponse.next()
}

/**
 * Configure which routes this middleware runs on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
