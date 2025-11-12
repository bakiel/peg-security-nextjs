import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { rateLimit } from '@/lib/rate-limit'
import {
  validateEmail,
  validatePhone,
  validateName,
  validateLength,
  validateServiceType,
  validatePreferredContact,
  sanitizeString
} from '@/lib/validation'
import {
  sendContactConfirmation,
  sendContactNotification
} from '@/lib/resend'

// Public route - use anon key to respect RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * POST /api/contact
 * Handle contact form submissions
 *
 * Security:
 * - Rate limiting (5 per hour per IP)
 * - Input validation and sanitization
 * - XSS prevention
 *
 * Actions:
 * 1. Validate all inputs
 * 2. Store in Supabase
 * 3. Send confirmation email to user
 * 4. Send notification to admin
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request, 'contactForm')

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: rateLimitResult.message || 'Too many submissions',
          retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000)
        },
        { status: 429 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { name, email, phone, serviceType, message, preferredContact } = body

    // Validation
    const validationErrors: string[] = []

    // Validate name
    const nameResult = validateName(name)
    if (!nameResult.valid) {
      validationErrors.push(nameResult.error!)
    }

    // Validate email
    const emailResult = validateEmail(email)
    if (!emailResult.valid) {
      validationErrors.push(emailResult.error!)
    }

    // Validate phone
    const phoneResult = validatePhone(phone)
    if (!phoneResult.valid) {
      validationErrors.push(phoneResult.error!)
    }

    // Validate service type
    const serviceTypeResult = validateServiceType(serviceType)
    if (!serviceTypeResult.valid) {
      validationErrors.push(serviceTypeResult.error!)
    }

    // Validate message
    const messageResult = validateLength(message, 10, 2000, 'Message')
    if (!messageResult.valid) {
      validationErrors.push(messageResult.error!)
    }

    // Validate preferred contact
    const contactResult = validatePreferredContact(preferredContact)
    if (!contactResult.valid) {
      validationErrors.push(contactResult.error!)
    }

    // Return validation errors if any
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationErrors
        },
        { status: 400 }
      )
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeString(nameResult.value!),
      email: emailResult.value!,
      phone: phoneResult.value!,
      service_type: serviceTypeResult.value!,
      message: sanitizeString(messageResult.value!),
      preferred_contact: contactResult.value!
    }

    // Store in Supabase
    try {
      const contactRecord = {
        name: sanitizedData.name,
        email: sanitizedData.email,
        phone: sanitizedData.phone,
        service_type: sanitizedData.service_type,
        message: sanitizedData.message,
        preferred_contact: sanitizedData.preferred_contact,
        status: 'New'
      }

      const { error } = await supabase
        .from('contacts')
        .insert([contactRecord])

      if (error) {
        throw error
      }

      console.log('[CONTACT FORM] Stored successfully:', contactRecord.name)
    } catch (supabaseError) {
      console.error('[SUPABASE ERROR]', supabaseError)
      // Continue even if Supabase fails - we still want to send emails
    }

    // Send confirmation email to user
    try {
      await sendContactConfirmation({
        to: sanitizedData.email,
        name: sanitizedData.name,
        serviceType: sanitizedData.service_type
      })
    } catch (emailError) {
      console.error('[EMAIL ERROR] Confirmation:', emailError)
      // Don't fail the request if email fails
    }

    // Send notification to admin
    try {
      await sendContactNotification({
        name: sanitizedData.name,
        email: sanitizedData.email,
        phone: sanitizedData.phone,
        serviceType: sanitizedData.service_type,
        message: sanitizedData.message,
        preferredContact: sanitizedData.preferred_contact
      })
    } catch (emailError) {
      console.error('[EMAIL ERROR] Admin notification:', emailError)
      // Don't fail the request if email fails
    }

    // Success response
    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for contacting us. We will be in touch soon!'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[CONTACT FORM ERROR]', error)

    return NextResponse.json(
      {
        error: 'An error occurred processing your submission. Please try again.'
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
      'Allow': 'POST, OPTIONS'
    }
  })
}
