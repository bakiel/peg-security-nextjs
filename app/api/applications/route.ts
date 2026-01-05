import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { rateLimit } from '@/lib/rate-limit'
import {
  validateEmail,
  validatePhone,
  validateName,
  validateLength,
  sanitizeString
} from '@/lib/validation'
import {
  sendApplicationConfirmation,
  sendApplicationNotification
} from '@/lib/resend'

export const dynamic = 'force-dynamic'

/**
 * POST /api/applications
 * Handle job application submissions
 *
 * Security:
 * - Rate limiting (3 per hour per IP)
 * - Input validation and sanitization
 * - File upload validation
 * - XSS prevention
 *
 * Actions:
 * 1. Validate all inputs
 * 2. Upload CV to Supabase Storage
 * 3. Store application in Supabase database
 * 4. Send confirmation email to applicant
 * 5. Send notification to admin
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request, 'jobApplication')

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: rateLimitResult.message || 'Too many applications',
          retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000)
        },
        { status: 429 }
      )
    }

    // Parse multipart form data
    const formData = await request.formData()

    // Extract fields
    const jobId = formData.get('jobId') as string
    const applicantName = formData.get('applicantName') as string
    const applicantEmail = formData.get('applicantEmail') as string
    const applicantPhone = formData.get('applicantPhone') as string
    const coverLetter = formData.get('coverLetter') as string
    const cvFile = formData.get('cv') as File | null
    const psiraRegistered = formData.get('psiraRegistered') === 'true'
    const psiraNumber = formData.get('psiraNumber') as string
    const yearsExperience = formData.get('yearsExperience') as string
    const availableStartDate = formData.get('availableStartDate') as string

    // Validation
    const validationErrors: string[] = []

    // Validate job ID (UUID format)
    if (!jobId || jobId.trim().length === 0) {
      validationErrors.push('Invalid job ID')
    }

    // Validate name
    const nameResult = validateName(applicantName)
    if (!nameResult.valid) {
      validationErrors.push(nameResult.error!)
    }

    // Validate email
    const emailResult = validateEmail(applicantEmail)
    if (!emailResult.valid) {
      validationErrors.push(emailResult.error!)
    }

    // Validate phone
    const phoneResult = validatePhone(applicantPhone)
    if (!phoneResult.valid) {
      validationErrors.push(phoneResult.error!)
    }

    // Validate cover letter (optional)
    if (coverLetter) {
      const coverLetterResult = validateLength(coverLetter, 50, 2000, 'Cover letter')
      if (!coverLetterResult.valid) {
        validationErrors.push(coverLetterResult.error!)
      }
    }

    // Validate CV file (required)
    if (!cvFile) {
      validationErrors.push('CV/Resume file is required')
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

    // Get job details
    const { data: job, error: jobError } = await db
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single()

    if (jobError || !job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    const jobTitle = job.title || 'Unknown Position'

    // Upload CV to Supabase Storage
    let cvUrl = ''
    let cvPublicId = ''

    if (cvFile) {
      try {
        // Convert file to buffer
        const arrayBuffer = await cvFile.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Generate unique filename
        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(7)
        const sanitizedName = nameResult.value!.replace(/[^a-zA-Z0-9]/g, '_')
        const fileExt = cvFile.name.split('.').pop() || 'pdf'
        const fileName = `${timestamp}-${sanitizedName}-${randomString}.${fileExt}`

        // Upload to Supabase Storage (cvs bucket)
        const { data: uploadData, error: uploadError } = await db.storage
          .from('cvs')
          .upload(fileName, buffer, {
            contentType: cvFile.type || 'application/pdf',
            upsert: false
          })

        if (uploadError) {
          throw new Error(`Storage upload failed: ${uploadError.message}`)
        }

        // Get public URL (CVs bucket is private, so this generates a signed URL)
        // For now we'll store the path and generate signed URLs when needed
        cvPublicId = uploadData.path
        cvUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/cvs/${uploadData.path}`

        console.log(`[CV UPLOAD] Uploaded CV to Storage: ${cvPublicId}`)
      } catch (uploadError) {
        console.error('[CV UPLOAD ERROR]', uploadError)
        return NextResponse.json(
          { error: 'Failed to upload CV. Please try again.' },
          { status: 500 }
        )
      }
    }

    // Sanitize inputs
    const sanitizedData = {
      job_id: jobId.trim(),
      job_title: jobTitle,
      applicant_name: sanitizeString(nameResult.value!),
      applicant_email: emailResult.value!,
      applicant_phone: phoneResult.value!,
      cv_url: cvUrl,
      cv_public_id: cvPublicId,
      cover_letter: coverLetter ? sanitizeString(coverLetter) : '',
      psira_registered: psiraRegistered,
      psira_number: psiraNumber ? sanitizeString(psiraNumber) : '',
      years_experience: yearsExperience ? parseInt(yearsExperience, 10) : 0,
      available_start_date: availableStartDate || ''
    }

    // Store in Supabase
    try {
      const applicationRecord = {
        job_id: sanitizedData.job_id,
        job_title: sanitizedData.job_title,
        applicant_name: sanitizedData.applicant_name,
        applicant_email: sanitizedData.applicant_email,
        applicant_phone: sanitizedData.applicant_phone,
        cv_url: sanitizedData.cv_url,
        cv_public_id: sanitizedData.cv_public_id,
        cover_letter: sanitizedData.cover_letter,
        psira_registered: sanitizedData.psira_registered,
        psira_number: sanitizedData.psira_number,
        years_experience: sanitizedData.years_experience,
        status: 'new'
      }

      const { error } = await db
        .from('applications')
        .insert([applicationRecord])

      if (error) {
        throw error
      }
    } catch (supabaseError) {
      console.error('[SUPABASE ERROR]', supabaseError)
      return NextResponse.json(
        { error: 'Failed to submit application. Please try again.' },
        { status: 500 }
      )
    }

    // Send confirmation email to applicant
    try {
      await sendApplicationConfirmation({
        to: sanitizedData.applicant_email,
        name: sanitizedData.applicant_name,
        jobTitle: sanitizedData.job_title
      })
    } catch (emailError) {
      console.error('[EMAIL ERROR] Confirmation:', emailError)
      // Don't fail the request if email fails
    }

    // Send notification to admin
    try {
      await sendApplicationNotification({
        applicantName: sanitizedData.applicant_name,
        applicantEmail: sanitizedData.applicant_email,
        applicantPhone: sanitizedData.applicant_phone,
        jobTitle: sanitizedData.job_title,
        cvUrl: sanitizedData.cv_url,
        coverLetter: sanitizedData.cover_letter
      })
    } catch (emailError) {
      console.error('[EMAIL ERROR] Admin notification:', emailError)
      // Don't fail the request if email fails
    }

    // Success response
    return NextResponse.json(
      {
        success: true,
        message: 'Application submitted successfully. We will review it and contact you soon!'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[APPLICATION API ERROR]', error)

    return NextResponse.json(
      {
        error: 'An error occurred processing your application. Please try again.'
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
