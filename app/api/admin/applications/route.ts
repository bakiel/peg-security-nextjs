import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/applications
 * Fetch all job applications from Supabase
 *
 * Query Parameters:
 * - status: Filter by status (New, Reviewing, Interviewed, Hired, Rejected)
 * - jobId: Filter by specific job ID
 *
 * Security:
 * - Protected by middleware.ts (requires admin authentication)
 * - Uses service role key for full access (bypasses RLS)
 *
 * Response:
 * {
 *   success: true,
 *   data: JobApplication[]
 * }
 */

export interface JobApplication {
  id: string
  job_id: string
  job_title: string
  applicant_name: string
  applicant_email: string
  applicant_phone: string
  cv_url: string
  cv_public_id: string
  cover_letter: string
  psira_registered: boolean
  psira_number?: string
  years_experience: number
  status: 'New' | 'Reviewing' | 'Interviewed' | 'Hired' | 'Rejected'
  submitted_at: string
  notes?: string
  created_at: string
  updated_at: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const statusFilter = searchParams.get('status')
    const jobIdFilter = searchParams.get('jobId')

    // Build query
    let query = supabaseAdmin
      .from('applications')
      .select('*')
      .order('submitted_at', { ascending: false })

    // Apply status filter if provided
    if (statusFilter && ['New', 'Reviewing', 'Interviewed', 'Hired', 'Rejected'].includes(statusFilter)) {
      query = query.eq('status', statusFilter)
    }

    // Apply job ID filter if provided
    if (jobIdFilter) {
      query = query.eq('job_id', jobIdFilter)
    }

    const { data: applications, error } = await query

    if (error) {
      console.error('[ADMIN APPLICATIONS ERROR]', error)
      return NextResponse.json(
        {
          error: 'Failed to fetch job applications',
          details: error.message
        },
        { status: 500 }
      )
    }

    // Transform field names from snake_case to Capital Case with spaces (for frontend compatibility)
    const transformedApplications = applications?.map(app => ({
      id: app.id,
      'Job ID': app.job_id,
      'Job Title': app.job_title,
      'Applicant Name': app.applicant_name,
      'Applicant Email': app.applicant_email,
      'Applicant Phone': app.applicant_phone,
      'CV URL': app.cv_url,
      'CV Public ID': app.cv_public_id,
      'Cover Letter': app.cover_letter,
      'PSIRA Registered': app.psira_registered,
      'PSIRA Number': app.psira_number,
      'Years Experience': app.years_experience,
      'Status': app.status,
      'Submitted At': app.submitted_at,
      'Notes': app.notes
    })) || []

    console.log(`[ADMIN APPLICATIONS] Fetched ${transformedApplications.length} job applications`)

    return NextResponse.json(
      {
        success: true,
        data: transformedApplications
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[ADMIN APPLICATIONS ERROR]', error)

    return NextResponse.json(
      {
        error: 'Failed to fetch job applications',
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
      Allow: 'GET, OPTIONS'
    }
  })
}
