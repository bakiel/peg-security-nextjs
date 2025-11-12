/**
 * Rate Limiting Utilities
 *
 * This module provides rate limiting functionality to prevent abuse
 * Uses LRU cache for efficient memory management
 *
 * Rate limits:
 * - Contact form: 5 requests per hour per IP
 * - Job applications: 3 requests per hour per IP
 * - Admin login: 5 attempts per 15 minutes per IP
 * - File uploads: 10 uploads per hour per IP
 * - General API: 100 requests per 15 minutes per IP
 *
 * Security: Implements progressive delays and tracks patterns
 */

import { LRUCache } from 'lru-cache'
import { NextRequest } from 'next/server'

// Rate limit configurations
export const RATE_LIMITS = {
  // Contact form: 5 per hour
  CONTACT_FORM: {
    max: 5,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many contact form submissions. Please try again in 1 hour.'
  },
  // Job applications: 3 per hour
  JOB_APPLICATION: {
    max: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many job applications. Please try again in 1 hour.'
  },
  // Admin login: 5 attempts per 15 minutes
  ADMIN_LOGIN: {
    max: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many login attempts. Please try again in 15 minutes.'
  },
  // File uploads: 10 per hour
  FILE_UPLOAD: {
    max: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many file uploads. Please try again in 1 hour.'
  },
  // Email sends: 20 per hour
  EMAIL_SEND: {
    max: 20,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many emails sent. Please try again later.'
  },
  // General API: 100 per 15 minutes
  GENERAL_API: {
    max: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many requests. Please try again in 15 minutes.'
  }
}

// Create separate caches for different rate limit types
const caches = {
  contactForm: new LRUCache<string, number[]>({
    max: 500,
    ttl: RATE_LIMITS.CONTACT_FORM.windowMs
  }),
  jobApplication: new LRUCache<string, number[]>({
    max: 500,
    ttl: RATE_LIMITS.JOB_APPLICATION.windowMs
  }),
  adminLogin: new LRUCache<string, number[]>({
    max: 500,
    ttl: RATE_LIMITS.ADMIN_LOGIN.windowMs
  }),
  fileUpload: new LRUCache<string, number[]>({
    max: 500,
    ttl: RATE_LIMITS.FILE_UPLOAD.windowMs
  }),
  emailSend: new LRUCache<string, number[]>({
    max: 500,
    ttl: RATE_LIMITS.EMAIL_SEND.windowMs
  }),
  generalApi: new LRUCache<string, number[]>({
    max: 1000,
    ttl: RATE_LIMITS.GENERAL_API.windowMs
  })
}

export type RateLimitType = keyof typeof caches

/**
 * Get client IP address from request
 */
export function getClientIp(request: NextRequest): string {
  // Try various headers
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')

  // x-forwarded-for can contain multiple IPs, get the first one
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  if (realIp) {
    return realIp
  }

  if (cfConnectingIp) {
    return cfConnectingIp
  }

  // Fallback to a default (shouldn't happen in production)
  return 'unknown'
}

/**
 * Check if request exceeds rate limit
 */
export function checkRateLimit(
  identifier: string,
  type: RateLimitType
): {
  success: boolean
  limit: number
  remaining: number
  reset: number
  message?: string
} {
  const cache = caches[type]

  // Convert camelCase to SNAKE_CASE
  const configKey = type
    .replace(/([A-Z])/g, '_$1')
    .toUpperCase()
    .replace(/^_/, '') as keyof typeof RATE_LIMITS

  const config = RATE_LIMITS[configKey]

  if (!config) {
    console.error(`[RATE LIMIT ERROR] Invalid rate limit type: ${type}`)
    // Return a default permissive result to avoid breaking the app
    return {
      success: true,
      limit: 100,
      remaining: 100,
      reset: Date.now() + 60000
    }
  }

  const now = Date.now()
  const timestamps = cache.get(identifier) || []

  // Filter out expired timestamps
  const validTimestamps = timestamps.filter(
    timestamp => now - timestamp < config.windowMs
  )

  // Check if limit exceeded
  if (validTimestamps.length >= config.max) {
    const oldestTimestamp = Math.min(...validTimestamps)
    const resetTime = oldestTimestamp + config.windowMs

    return {
      success: false,
      limit: config.max,
      remaining: 0,
      reset: resetTime,
      message: config.message
    }
  }

  // Add current timestamp
  validTimestamps.push(now)
  cache.set(identifier, validTimestamps)

  return {
    success: true,
    limit: config.max,
    remaining: config.max - validTimestamps.length,
    reset: now + config.windowMs
  }
}

/**
 * Rate limit middleware wrapper for API routes
 */
export async function rateLimit(
  request: NextRequest,
  type: RateLimitType = 'generalApi'
): Promise<{
  success: boolean
  limit: number
  remaining: number
  reset: number
  message?: string
}> {
  const ip = getClientIp(request)
  const identifier = `${ip}:${type}`

  const result = checkRateLimit(identifier, type)

  // Log if rate limit exceeded
  if (!result.success) {
    console.warn('[RATE LIMIT EXCEEDED]', {
      ip,
      type,
      timestamp: new Date().toISOString()
    })
  }

  return result
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(result: {
  limit: number
  remaining: number
  reset: number
}): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.floor(result.reset / 1000).toString(),
    'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString()
  }
}

/**
 * Progressive delay based on number of failed attempts
 * Used for admin login to slow down brute force attacks
 */
export function getProgressiveDelay(attemptNumber: number): number {
  // Exponential backoff: 1s, 2s, 4s, 8s, 16s, ...
  const baseDelay = 1000 // 1 second
  const maxDelay = 60000 // 60 seconds

  const delay = Math.min(baseDelay * Math.pow(2, attemptNumber - 1), maxDelay)
  return delay
}

/**
 * Track failed login attempts with progressive delays
 */
const failedLoginAttempts = new LRUCache<string, number>({
  max: 500,
  ttl: 60 * 60 * 1000 // 1 hour
})

export function trackFailedLogin(ip: string): {
  attempts: number
  delayMs: number
  locked: boolean
} {
  const attempts = (failedLoginAttempts.get(ip) || 0) + 1
  failedLoginAttempts.set(ip, attempts)

  const delayMs = getProgressiveDelay(attempts)
  const locked = attempts >= RATE_LIMITS.ADMIN_LOGIN.max

  if (locked) {
    console.warn('[LOGIN LOCKED]', {
      ip,
      attempts,
      timestamp: new Date().toISOString()
    })
  }

  return {
    attempts,
    delayMs,
    locked
  }
}

/**
 * Reset failed login attempts (after successful login)
 */
export function resetFailedLogins(ip: string): void {
  failedLoginAttempts.delete(ip)
}

/**
 * Check if IP is currently locked out
 */
export function isIpLocked(ip: string): boolean {
  const attempts = failedLoginAttempts.get(ip) || 0
  return attempts >= RATE_LIMITS.ADMIN_LOGIN.max
}

/**
 * Get failed login attempts count
 */
export function getFailedLoginAttempts(ip: string): number {
  return failedLoginAttempts.get(ip) || 0
}

/**
 * Suspicious activity detection
 * Tracks patterns that might indicate attacks
 */
const suspiciousActivity = new LRUCache<string, {
  count: number
  patterns: string[]
  firstSeen: number
}>({
  max: 1000,
  ttl: 24 * 60 * 60 * 1000 // 24 hours
})

export function trackSuspiciousActivity(
  ip: string,
  pattern: string
): {
  suspicious: boolean
  count: number
  shouldBlock: boolean
} {
  const activity = suspiciousActivity.get(ip) || {
    count: 0,
    patterns: [],
    firstSeen: Date.now()
  }

  activity.count++
  activity.patterns.push(pattern)

  suspiciousActivity.set(ip, activity)

  const suspicious = activity.count > 10
  const shouldBlock = activity.count > 50

  if (shouldBlock) {
    console.error('[SUSPICIOUS ACTIVITY - BLOCKED]', {
      ip,
      count: activity.count,
      patterns: activity.patterns.slice(-10), // Last 10 patterns
      firstSeen: new Date(activity.firstSeen).toISOString()
    })
  } else if (suspicious) {
    console.warn('[SUSPICIOUS ACTIVITY]', {
      ip,
      count: activity.count,
      firstSeen: new Date(activity.firstSeen).toISOString()
    })
  }

  return {
    suspicious,
    count: activity.count,
    shouldBlock
  }
}

/**
 * Clear all rate limit data (admin utility)
 */
export function clearAllRateLimits(): void {
  Object.values(caches).forEach(cache => cache.clear())
  failedLoginAttempts.clear()
  suspiciousActivity.clear()
  console.log('[RATE LIMITS CLEARED]', {
    timestamp: new Date().toISOString()
  })
}

/**
 * Get rate limit statistics (admin utility)
 */
export function getRateLimitStats(): {
  caches: Record<string, { size: number; max: number }>
  failedLogins: number
  suspiciousIps: number
} {
  return {
    caches: Object.fromEntries(
      Object.entries(caches).map(([key, cache]) => [
        key,
        {
          size: cache.size,
          max: cache.max
        }
      ])
    ),
    failedLogins: failedLoginAttempts.size,
    suspiciousIps: suspiciousActivity.size
  }
}

export default rateLimit
