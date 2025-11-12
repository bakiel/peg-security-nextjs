import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { validateLength, sanitizeString } from '@/lib/validation'

// Admin route - use service role key to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * GET /api/admin/jobs
 * Fetch all job listings from Supabase
 *
 * Query Parameters:
 * - status: Filter by status (Draft, Open, Closed)
 *
 * Security:
 * - Protected by middleware.ts (requires admin authentication)
 *
 * Response:
 * {
 *   success: true,
 *   data: JobListing[]
 * }
 */

export interface JobListing {
  id: string
  title: string
  slug: string
  category: string
  location: string
  employment_type: string
  psira_required: boolean
  description: string
  responsibilities: string
  requirements: string
  benefits: string
  status: 'Draft' | 'Open' | 'Closed'
  created_at: string
  updated_at: string
  application_count?: number
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const statusFilter = searchParams.get('status')

    // Build Supabase query
    let query = supabase
      .from('jobs')
      .select('*')

    // Apply filter
    if (statusFilter && ['Draft', 'Open', 'Closed'].includes(statusFilter)) {
      query = query.eq('status', statusFilter)
    }

    // Apply sorting
    query = query.order('created_at', { ascending: false })

    const { data: jobs, error } = await query

    if (error) {
      throw error
    }

    // Transform field names from snake_case to Capital Case with spaces (for frontend compatibility)
    const transformedJobs = jobs?.map(job => ({
      id: job.id,
      'Title': job.title,
      'Slug': job.slug,
      'Category': job.category,
      'Location': job.location,
      'Employment Type': job.employment_type,
      'PSIRA Required': job.psira_required,
      'Description': job.description,
      'Responsibilities': job.responsibilities,
      'Requirements': job.requirements,
      'Benefits': job.benefits,
      'Status': job.status,
      'Created At': job.created_at,
      'Updated At': job.updated_at,
      'Application Count': job.application_count || 0
    })) || []

    console.log(`[ADMIN JOBS] Fetched ${transformedJobs.length} job listings`)

    return NextResponse.json(
      {
        success: true,
        data: transformedJobs
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[ADMIN JOBS ERROR]', error)

    return NextResponse.json(
      {
        error: 'Failed to fetch job listings',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/jobs
 * Create a new job listing
 *
 * Security:
 * - Protected by middleware.ts (requires admin authentication)
 * - Input validation and sanitization
 *
 * Body:
 * {
 *   title: string
 *   category: string
 *   location: string
 *   employmentType: string
 *   psiraRequired: boolean
 *   description: string
 *   responsibilities: string[]
 *   requirements: string[]
 *   benefits: string[]
 *   status: 'Draft' | 'Open'
 * }
 */

interface CreateJobBody {
  title: string
  category: string
  location: string
  employmentType: string
  psiraRequired: boolean
  description: string
  responsibilities: string[]
  requirements: string[]
  benefits: string[]
  status: 'Draft' | 'Open'
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateJobBody = await request.json()
    const {
      title,
      category,
      location,
      employmentType,
      psiraRequired,
      description,
      responsibilities,
      requirements,
      benefits,
      status
    } = body

    // Validation
    const validationErrors: string[] = []

    // Validate title
    const titleResult = validateLength(title, 5, 100, 'Title')
    if (!titleResult.valid) {
      validationErrors.push(titleResult.error!)
    }

    // Validate category
    const validCategories = [
      'Armed Response',
      'CCTV Installation',
      'Access Control',
      'Security Guard',
      'Event Security',
      'VIP Protection',
      'Technical Support',
      'Administration'
    ]
    if (!category || !validCategories.includes(category)) {
      validationErrors.push(`Category must be one of: ${validCategories.join(', ')}`)
    }

    // Validate location
    const locationResult = validateLength(location, 3, 100, 'Location')
    if (!locationResult.valid) {
      validationErrors.push(locationResult.error!)
    }

    // Validate employment type
    const validEmploymentTypes = ['Full-time', 'Part-time', 'Contract']
    if (!employmentType || !validEmploymentTypes.includes(employmentType)) {
      validationErrors.push(`Employment type must be one of: ${validEmploymentTypes.join(', ')}`)
    }

    // Validate description
    const descriptionResult = validateLength(description, 50, 5000, 'Description')
    if (!descriptionResult.valid) {
      validationErrors.push(descriptionResult.error!)
    }

    // Validate responsibilities (at least 3)
    if (!Array.isArray(responsibilities) || responsibilities.length < 3) {
      validationErrors.push('At least 3 responsibilities are required')
    } else {
      responsibilities.forEach((resp, index) => {
        if (!resp || resp.trim().length < 10) {
          validationErrors.push(`Responsibility ${index + 1} must be at least 10 characters`)
        }
      })
    }

    // Validate requirements (at least 3)
    if (!Array.isArray(requirements) || requirements.length < 3) {
      validationErrors.push('At least 3 requirements are required')
    } else {
      requirements.forEach((req, index) => {
        if (!req || req.trim().length < 10) {
          validationErrors.push(`Requirement ${index + 1} must be at least 10 characters`)
        }
      })
    }

    // Validate benefits (at least 2)
    if (!Array.isArray(benefits) || benefits.length < 2) {
      validationErrors.push('At least 2 benefits are required')
    } else {
      benefits.forEach((benefit, index) => {
        if (!benefit || benefit.trim().length < 10) {
          validationErrors.push(`Benefit ${index + 1} must be at least 10 characters`)
        }
      })
    }

    // Validate status
    if (status && !['Draft', 'Open'].includes(status)) {
      validationErrors.push('Status must be Draft or Open')
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

    // Generate slug from title
    const slug = titleResult.value!
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Sanitize and prepare data
    const jobRecord = {
      title: sanitizeString(titleResult.value!),
      slug: slug,
      category: category,
      location: sanitizeString(locationResult.value!),
      employment_type: employmentType,
      psira_required: psiraRequired || false,
      description: sanitizeString(descriptionResult.value!),
      responsibilities: responsibilities.map(r => sanitizeString(r)).join('\n'),
      requirements: requirements.map(r => sanitizeString(r)).join('\n'),
      benefits: benefits.map(b => sanitizeString(b)).join('\n'),
      status: status || 'Draft',
      application_count: 0
    }

    // Create record in Supabase
    const { data: createdJob, error } = await supabase
      .from('jobs')
      .insert([jobRecord])
      .select()
      .single()

    if (error) {
      throw error
    }

    console.log('[ADMIN JOBS] Created new job:', createdJob.id, jobRecord.title)

    return NextResponse.json(
      {
        success: true,
        data: createdJob,
        message: 'Job listing created successfully'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[ADMIN JOBS CREATE ERROR]', error)

    return NextResponse.json(
      {
        error: 'Failed to create job listing',
        details: error instanceof Error ? error.message : 'Unknown error'
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
      Allow: 'GET, POST, OPTIONS'
    }
  })
}
