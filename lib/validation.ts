/**
 * Input Validation Utilities
 *
 * This module provides comprehensive input validation functions
 * Follows security best practices:
 * - Whitelist validation (allow known good)
 * - Server-side validation (never trust client)
 * - Sanitization to prevent XSS
 * - Type and format validation
 *
 * Security: All functions return validated/sanitized data
 */

// Email validation regex (RFC 5322 simplified)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

// South African phone number formats
// +27 followed by 9 digits, or 0 followed by 9 digits
const SA_PHONE_REGEX = /^(\+27|0)[0-9]{9}$/

// Airtable record ID format
const AIRTABLE_ID_REGEX = /^rec[a-zA-Z0-9]{14}$/

// URL validation regex
const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/

// Slug format (URL-friendly)
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export interface ValidationResult {
  valid: boolean
  error?: string
  value?: any
}

/**
 * Validate email address
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' }
  }

  const trimmedEmail = email.trim().toLowerCase()

  if (trimmedEmail.length === 0) {
    return { valid: false, error: 'Email is required' }
  }

  if (trimmedEmail.length > 255) {
    return { valid: false, error: 'Email is too long (max 255 characters)' }
  }

  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return { valid: false, error: 'Invalid email format' }
  }

  return { valid: true, value: trimmedEmail }
}

/**
 * Validate South African phone number
 */
export function validatePhone(phone: string): ValidationResult {
  if (!phone || typeof phone !== 'string') {
    return { valid: false, error: 'Phone number is required' }
  }

  // Remove spaces and common separators
  const cleanPhone = phone.trim().replace(/[\s\-\(\)]/g, '')

  if (!SA_PHONE_REGEX.test(cleanPhone)) {
    return {
      valid: false,
      error: 'Invalid phone number. Use format: +27XXXXXXXXX or 0XXXXXXXXX'
    }
  }

  // Normalize to +27 format
  const normalizedPhone = cleanPhone.startsWith('0')
    ? '+27' + cleanPhone.slice(1)
    : cleanPhone

  return { valid: true, value: normalizedPhone }
}

/**
 * Validate string length
 */
export function validateLength(
  value: string,
  min: number,
  max: number,
  fieldName: string = 'Field'
): ValidationResult {
  if (!value || typeof value !== 'string') {
    return { valid: false, error: `${fieldName} is required` }
  }

  const trimmedValue = value.trim()

  if (trimmedValue.length < min) {
    return {
      valid: false,
      error: `${fieldName} must be at least ${min} characters`
    }
  }

  if (trimmedValue.length > max) {
    return {
      valid: false,
      error: `${fieldName} must be at most ${max} characters`
    }
  }

  return { valid: true, value: trimmedValue }
}

/**
 * Validate name (letters, spaces, hyphens, apostrophes)
 */
export function validateName(name: string): ValidationResult {
  const lengthCheck = validateLength(name, 2, 100, 'Name')
  if (!lengthCheck.valid) {
    return lengthCheck
  }

  const trimmedName = name.trim()

  // Allow letters, spaces, hyphens, apostrophes, and common accented characters
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/

  if (!nameRegex.test(trimmedName)) {
    return {
      valid: false,
      error: 'Name can only contain letters, spaces, hyphens, and apostrophes'
    }
  }

  return { valid: true, value: trimmedName }
}

/**
 * Sanitize string input to prevent XSS
 * Removes HTML tags and dangerous characters
 */
export function sanitizeString(input: string): string {
  if (!input || typeof input !== 'string') {
    return ''
  }

  return input
    .trim()
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove event handlers
    .replace(/on\w+="[^"]*"/g, '')
    .replace(/on\w+='[^']*'/g, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Trim excessive whitespace
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Sanitize HTML (for rich text - very restrictive)
 * Only allows safe tags: p, br, strong, em, ul, ol, li
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') {
    return ''
  }

  // Allowed tags (very restrictive)
  const allowedTags = ['p', 'br', 'strong', 'b', 'em', 'i', 'ul', 'ol', 'li', 'a']

  // Remove all tags except allowed ones
  let sanitized = html

  // Remove script tags first
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

  // Remove style tags
  sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')

  // Remove event handlers
  sanitized = sanitized.replace(/on\w+="[^"]*"/g, '')

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '')

  return sanitized.trim()
}

/**
 * Validate Airtable record ID
 */
export function validateAirtableId(id: string): ValidationResult {
  if (!id || typeof id !== 'string') {
    return { valid: false, error: 'Record ID is required' }
  }

  if (!AIRTABLE_ID_REGEX.test(id)) {
    return {
      valid: false,
      error: 'Invalid record ID format'
    }
  }

  return { valid: true, value: id }
}

/**
 * Validate URL
 */
export function validateUrl(url: string): ValidationResult {
  if (!url || typeof url !== 'string') {
    return { valid: false, error: 'URL is required' }
  }

  const trimmedUrl = url.trim()

  if (!URL_REGEX.test(trimmedUrl)) {
    return { valid: false, error: 'Invalid URL format' }
  }

  return { valid: true, value: trimmedUrl }
}

/**
 * Validate slug (URL-friendly identifier)
 */
export function validateSlug(slug: string): ValidationResult {
  if (!slug || typeof slug !== 'string') {
    return { valid: false, error: 'Slug is required' }
  }

  const trimmedSlug = slug.trim().toLowerCase()

  if (!SLUG_REGEX.test(trimmedSlug)) {
    return {
      valid: false,
      error: 'Slug must contain only lowercase letters, numbers, and hyphens'
    }
  }

  if (trimmedSlug.length < 2 || trimmedSlug.length > 100) {
    return {
      valid: false,
      error: 'Slug must be between 2 and 100 characters'
    }
  }

  return { valid: true, value: trimmedSlug }
}

/**
 * Generate slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Validate service type (from predefined list)
 */
export function validateServiceType(serviceType: string): ValidationResult {
  const allowedTypes = [
    'armed-response',
    'security-guards',
    'access-control',
    'cctv-surveillance',
    'alarm-systems',
    'event-security',
    'risk-assessment',
    'security-consulting',
    'other'
  ]

  if (!serviceType || typeof serviceType !== 'string') {
    return { valid: false, error: 'Service type is required' }
  }

  const trimmedType = serviceType.trim().toLowerCase()

  if (!allowedTypes.includes(trimmedType)) {
    return {
      valid: false,
      error: 'Invalid service type'
    }
  }

  return { valid: true, value: trimmedType }
}

/**
 * Validate preferred contact method
 */
export function validatePreferredContact(method: string): ValidationResult {
  const allowedMethods = ['email', 'phone', 'whatsapp']

  if (!method || typeof method !== 'string') {
    return { valid: false, error: 'Preferred contact method is required' }
  }

  const trimmedMethod = method.trim().toLowerCase()

  if (!allowedMethods.includes(trimmedMethod)) {
    return {
      valid: false,
      error: 'Invalid contact method'
    }
  }

  return { valid: true, value: trimmedMethod }
}

/**
 * Validate job category
 */
export function validateJobCategory(category: string): ValidationResult {
  const allowedCategories = [
    'operations',
    'management',
    'admin',
    'technical',
    'training'
  ]

  if (!category || typeof category !== 'string') {
    return { valid: false, error: 'Job category is required' }
  }

  const trimmedCategory = category.trim().toLowerCase()

  if (!allowedCategories.includes(trimmedCategory)) {
    return {
      valid: false,
      error: 'Invalid job category'
    }
  }

  return { valid: true, value: trimmedCategory }
}

/**
 * Validate employment type
 */
export function validateEmploymentType(type: string): ValidationResult {
  const allowedTypes = ['full-time', 'part-time', 'contract', 'temporary']

  if (!type || typeof type !== 'string') {
    return { valid: false, error: 'Employment type is required' }
  }

  const trimmedType = type.trim().toLowerCase()

  if (!allowedTypes.includes(trimmedType)) {
    return {
      valid: false,
      error: 'Invalid employment type'
    }
  }

  return { valid: true, value: trimmedType }
}

/**
 * Validate gallery category
 */
export function validateGalleryCategory(category: string): ValidationResult {
  const allowedCategories = [
    'training',
    'operations',
    'team',
    'events',
    'equipment',
    'facilities',
    'awards'
  ]

  if (!category || typeof category !== 'string') {
    return { valid: false, error: 'Gallery category is required' }
  }

  const trimmedCategory = category.trim().toLowerCase()

  if (!allowedCategories.includes(trimmedCategory)) {
    return {
      valid: false,
      error: 'Invalid gallery category'
    }
  }

  return { valid: true, value: trimmedCategory }
}

/**
 * Validate aspect ratio
 */
export function validateAspectRatio(ratio: string): ValidationResult {
  const allowedRatios = ['square', 'landscape', 'portrait']

  if (!ratio || typeof ratio !== 'string') {
    return { valid: false, error: 'Aspect ratio is required' }
  }

  const trimmedRatio = ratio.trim().toLowerCase()

  if (!allowedRatios.includes(trimmedRatio)) {
    return {
      valid: false,
      error: 'Invalid aspect ratio'
    }
  }

  return { valid: true, value: trimmedRatio }
}

/**
 * Validate boolean value
 */
export function validateBoolean(value: any, fieldName: string = 'Field'): ValidationResult {
  if (typeof value !== 'boolean') {
    return {
      valid: false,
      error: `${fieldName} must be true or false`
    }
  }

  return { valid: true, value }
}

/**
 * Validate number in range
 */
export function validateNumberRange(
  value: any,
  min: number,
  max: number,
  fieldName: string = 'Value'
): ValidationResult {
  if (typeof value !== 'number' || isNaN(value)) {
    return {
      valid: false,
      error: `${fieldName} must be a number`
    }
  }

  if (value < min || value > max) {
    return {
      valid: false,
      error: `${fieldName} must be between ${min} and ${max}`
    }
  }

  return { valid: true, value }
}

/**
 * Validate required field
 */
export function validateRequired(value: any, fieldName: string = 'Field'): ValidationResult {
  if (value === null || value === undefined || value === '') {
    return {
      valid: false,
      error: `${fieldName} is required`
    }
  }

  if (typeof value === 'string' && value.trim().length === 0) {
    return {
      valid: false,
      error: `${fieldName} is required`
    }
  }

  return { valid: true, value }
}

/**
 * Batch validate multiple fields
 * Returns first error found or null if all valid
 */
export function validateFields(
  validations: Array<() => ValidationResult>
): ValidationResult {
  for (const validation of validations) {
    const result = validation()
    if (!result.valid) {
      return result
    }
  }

  return { valid: true }
}

/**
 * Create validation error response
 */
export function validationError(message: string, status: number = 400) {
  return {
    error: message,
    status
  }
}

export default {
  validateEmail,
  validatePhone,
  validateLength,
  validateName,
  sanitizeString,
  sanitizeHtml,
  validateAirtableId,
  validateUrl,
  validateSlug,
  generateSlug,
  validateServiceType,
  validatePreferredContact,
  validateJobCategory,
  validateEmploymentType,
  validateGalleryCategory,
  validateAspectRatio,
  validateBoolean,
  validateNumberRange,
  validateRequired,
  validateFields,
  validationError
}
