/**
 * Authentication and Session Management
 *
 * This module provides JWT-based authentication for admin access
 * Includes:
 * - Password verification
 * - JWT token generation and validation
 * - Secure session management with HttpOnly cookies
 * - Session expiration handling
 *
 * Security: Uses jose library for secure JWT operations
 */

import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// Validate required environment variables
if (!process.env.ADMIN_PASSWORD) {
  throw new Error('Missing required environment variable: ADMIN_PASSWORD')
}

if (!process.env.JWT_SECRET) {
  throw new Error('Missing required environment variable: JWT_SECRET')
}

// JWT configuration
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

const SESSION_COOKIE_NAME = 'peg_admin_session'
const CSRF_COOKIE_NAME = 'peg_csrf_token'

// Session duration: 8 hours
const SESSION_DURATION = 8 * 60 * 60 * 1000 // 8 hours in milliseconds

// Admin credentials (in production, this should be from a database with hashed passwords)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: process.env.ADMIN_PASSWORD
}

export interface SessionData {
  userId: string
  username: string
  isAdmin: boolean
  createdAt: number
  expiresAt: number
}

/**
 * Verify admin login credentials
 */
export function verifyCredentials(username: string, password: string): boolean {
  // Simple comparison for now
  // In production, use bcrypt.compare() with hashed passwords
  return (
    username === ADMIN_CREDENTIALS.username &&
    password === ADMIN_CREDENTIALS.password
  )
}

/**
 * Generate JWT token with session data
 */
export async function generateSessionToken(
  userId: string,
  username: string
): Promise<string> {
  const now = Date.now()
  const expiresAt = now + SESSION_DURATION

  const token = await new SignJWT({
    userId,
    username,
    isAdmin: true,
    createdAt: now,
    expiresAt
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAt / 1000))
    .sign(JWT_SECRET)

  return token
}

/**
 * Verify and decode JWT token
 */
export async function verifySessionToken(
  token: string
): Promise<SessionData | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)

    // Check if session is expired
    const now = Date.now()
    if (payload.expiresAt && typeof payload.expiresAt === 'number' && payload.expiresAt < now) {
      return null
    }

    return {
      userId: payload.userId as string,
      username: payload.username as string,
      isAdmin: payload.isAdmin as boolean,
      createdAt: payload.createdAt as number,
      expiresAt: payload.expiresAt as number
    }
  } catch (error) {
    console.error('[AUTH ERROR] Token verification failed:', error)
    return null
  }
}

/**
 * Create session cookie
 */
export async function createSession(
  response: NextResponse,
  userId: string,
  username: string
): Promise<NextResponse> {
  const token = await generateSessionToken(userId, username)

  // Set HttpOnly, Secure, SameSite cookie
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000, // Convert to seconds
    path: '/'
  })

  // Generate and set CSRF token
  const csrfToken = generateCsrfToken()
  response.cookies.set({
    name: CSRF_COOKIE_NAME,
    value: csrfToken,
    httpOnly: false, // Need to be readable by client for form submissions
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000,
    path: '/'
  })

  return response
}

/**
 * Get session from request
 */
export async function getSession(
  request: NextRequest
): Promise<SessionData | null> {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  return await verifySessionToken(token)
}

/**
 * Get session from server component (using cookies())
 */
export async function getServerSession(): Promise<SessionData | null> {
  const cookieStore = cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  return await verifySessionToken(token)
}

/**
 * Delete session (logout)
 */
export function deleteSession(response: NextResponse): NextResponse {
  response.cookies.delete(SESSION_COOKIE_NAME)
  response.cookies.delete(CSRF_COOKIE_NAME)
  return response
}

/**
 * Require authentication middleware
 * Returns session data if authenticated, null otherwise
 */
export async function requireAuth(
  request: NextRequest
): Promise<SessionData | null> {
  const session = await getSession(request)

  if (!session) {
    return null
  }

  // Check if session is still valid
  const now = Date.now()
  if (session.expiresAt < now) {
    return null
  }

  return session
}

/**
 * Generate CSRF token
 */
export function generateCsrfToken(): string {
  // Generate random token
  const randomBytes = crypto.getRandomValues(new Uint8Array(32))
  return Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Verify CSRF token
 */
export function verifyCsrfToken(
  request: NextRequest,
  submittedToken: string
): boolean {
  const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value

  if (!cookieToken || !submittedToken) {
    return false
  }

  return cookieToken === submittedToken
}

/**
 * Check if user is authenticated (for client components)
 * This is a helper that can be called from API routes
 */
export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const session = await getSession(request)
  return session !== null && session.isAdmin === true
}

/**
 * Get CSRF token for client-side use
 */
export function getCsrfToken(request: NextRequest): string | undefined {
  return request.cookies.get(CSRF_COOKIE_NAME)?.value
}

/**
 * Refresh session (extend expiration)
 */
export async function refreshSession(
  request: NextRequest,
  response: NextResponse
): Promise<NextResponse> {
  const session = await getSession(request)

  if (!session) {
    return response
  }

  // Generate new token with extended expiration
  const newToken = await generateSessionToken(session.userId, session.username)

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: newToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000,
    path: '/'
  })

  return response
}

/**
 * Log admin action (for audit trail)
 */
export function logAdminAction(
  session: SessionData,
  action: string,
  details: Record<string, any> = {}
) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    userId: session.userId,
    username: session.username,
    action,
    details
  }

  // Log to console (in production, send to logging service or Airtable)
  console.log('[ADMIN ACTION]', JSON.stringify(logEntry))

  // TODO: Store in Airtable audit log table
}

/**
 * Password strength validation
 * (For future use when allowing password changes)
 */
export function validatePasswordStrength(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 12) {
    errors.push('Password must be at least 12 characters')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Hash password using bcrypt
 * (For future use when storing hashed passwords)
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

/**
 * Verify password against bcrypt hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

/**
 * Generate secure random password
 * (For future use in password reset flows)
 */
export function generateSecurePassword(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  const randomBytes = crypto.getRandomValues(new Uint8Array(length))
  return Array.from(randomBytes, byte => chars[byte % chars.length]).join('')
}

export { SESSION_COOKIE_NAME, CSRF_COOKIE_NAME }
