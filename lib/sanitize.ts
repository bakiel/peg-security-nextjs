/**
 * Input Sanitization Utilities
 *
 * Provides XSS protection by sanitizing user inputs
 * Uses DOMPurify to remove malicious HTML/JavaScript
 */

import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitize a single string input
 * Removes all HTML tags and scripts
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return input
  }

  // Remove all HTML tags and scripts
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [], // No attributes allowed
    KEEP_CONTENT: true // Keep text content
  })
}

/**
 * Sanitize HTML content while allowing safe tags
 * Use this for rich text fields like descriptions
 */
export function sanitizeHtml(input: string): string {
  if (!input || typeof input !== 'string') {
    return input
  }

  // Allow only safe HTML tags
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  })
}

/**
 * Sanitize an entire object recursively
 * Handles strings, arrays, and nested objects
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  if (!obj || typeof obj !== 'object') {
    return obj
  }

  const sanitized: any = {}

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      sanitized[key] = value
    } else if (typeof value === 'string') {
      // Sanitize string values
      sanitized[key] = sanitizeInput(value)
    } else if (Array.isArray(value)) {
      // Sanitize array items
      sanitized[key] = value.map(item =>
        typeof item === 'string' ? sanitizeInput(item) :
        typeof item === 'object' ? sanitizeObject(item) :
        item
      )
    } else if (typeof value === 'object') {
      // Recursively sanitize nested objects
      sanitized[key] = sanitizeObject(value)
    } else {
      // Keep other types as-is (numbers, booleans, etc.)
      sanitized[key] = value
    }
  }

  return sanitized as T
}

/**
 * Escape special characters for SQL/database queries
 * Prevents SQL injection in raw queries
 */
export function escapeSql(input: string): string {
  if (!input || typeof input !== 'string') {
    return input
  }

  return input
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\x00/g, '\\0')
    .replace(/\x1a/g, '\\Z')
}

/**
 * Escape special characters for Airtable formulas
 * Prevents formula injection attacks
 */
export function escapeAirtableFormula(value: string): string {
  if (!value || typeof value !== 'string') {
    return `''`
  }

  // Escape backslashes first, then single quotes
  const escaped = value
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")

  return `'${escaped}'`
}

/**
 * Validate and sanitize file names
 * Removes path traversal attempts and special characters
 */
export function sanitizeFilename(filename: string): string {
  if (!filename || typeof filename !== 'string') {
    return 'file'
  }

  return filename
    .replace(/\.\./g, '') // Remove path traversal
    .replace(/[\/\\]/g, '') // Remove slashes
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace special chars
    .substring(0, 255) // Limit length
}

/**
 * Validate and sanitize URLs
 * Ensures URLs are safe and use allowed protocols
 */
export function sanitizeUrl(url: string): string | null {
  if (!url || typeof url !== 'string') {
    return null
  }

  try {
    const parsed = new URL(url)

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null
    }

    return parsed.href
  } catch {
    return null
  }
}

/**
 * Sanitize email addresses
 * Basic validation and normalization
 */
export function sanitizeEmail(email: string): string | null {
  if (!email || typeof email !== 'string') {
    return null
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const normalized = email.trim().toLowerCase()

  if (!emailRegex.test(normalized)) {
    return null
  }

  return normalized
}

/**
 * Sanitize phone numbers
 * Removes non-numeric characters except + and -
 */
export function sanitizePhone(phone: string): string {
  if (!phone || typeof phone !== 'string') {
    return ''
  }

  return phone.replace(/[^\d+\-\s()]/g, '').trim()
}
