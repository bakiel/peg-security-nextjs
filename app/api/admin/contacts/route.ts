import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/contacts
 * Fetch all contact form submissions from Supabase
 *
 * Query Parameters:
 * - status: Filter by status (New, Read, Responded)
 *
 * Security:
 * - Protected by middleware.ts (requires admin authentication)
 * - Uses service role key for full access (bypasses RLS)
 *
 * Response:
 * {
 *   success: true,
 *   data: ContactSubmission[]
 * }
 */

export interface ContactSubmission {
  id: string
  name: string
  email: string
  phone: string
  service_type: string
  message: string
  preferred_contact: string
  status: 'New' | 'Read' | 'Responded'
  submitted_at: string
  notes?: string
  created_at: string
  updated_at: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const statusFilter = searchParams.get('status')

    // Build query
    let query = db
      .from('contacts')
      .select('*')
      .order('submitted_at', { ascending: false })

    // Apply status filter if provided
    if (statusFilter && ['New', 'Read', 'Responded'].includes(statusFilter)) {
      query = query.eq('status', statusFilter)
    }

    const { data: contacts, error } = await query

    if (error) {
      console.error('[ADMIN CONTACTS ERROR]', error)
      return NextResponse.json(
        {
          error: 'Failed to fetch contact submissions',
          details: error.message
        },
        { status: 500 }
      )
    }

    // Transform field names from snake_case to Capital Case with spaces (for frontend compatibility)
    const transformedContacts = contacts?.map(contact => ({
      id: contact.id,
      'Name': contact.name,
      'Email': contact.email,
      'Phone': contact.phone,
      'Service Type': contact.service_type,
      'Message': contact.message,
      'Preferred Contact': contact.preferred_contact,
      'Status': contact.status,
      'Submitted At': contact.submitted_at,
      'Notes': contact.notes
    })) || []

    console.log(`[ADMIN CONTACTS] Fetched ${transformedContacts.length} contact submissions`)

    return NextResponse.json(
      {
        success: true,
        data: transformedContacts
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[ADMIN CONTACTS ERROR]', error)

    return NextResponse.json(
      {
        error: 'Failed to fetch contact submissions',
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
