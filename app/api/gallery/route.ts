import { NextRequest, NextResponse } from 'next/server'
import { supabaseClient } from '@/lib/supabase'
import { GalleryItem } from '@/lib/types'

export const dynamic = 'force-dynamic'

/**
 * GET /api/gallery
 * Public endpoint to fetch active gallery images from Supabase
 *
 * Query params:
 * - category: Filter by category
 *
 * Response:
 * - Returns array of active gallery images only
 * - Sorted by display order and creation date
 * - Cached with Next.js ISR (revalidate every 5 minutes)
 *
 * Security:
 * - Only returns images with status='Active' (Hidden images are excluded)
 * - Public endpoint, no authentication required
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    // Build Supabase query - ONLY return Active images for public API
    let query = supabaseClient
      .from('gallery')
      .select('*')
      .eq('status', 'Active')

    if (category) {
      query = query.eq('category', category)
    }

    // Apply sorting
    query = query
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    const { data: records, error } = await query

    if (error) {
      throw error
    }

    // Transform to frontend format
    const galleryItems: GalleryItem[] = (records || []).map((record: any) => ({
      id: record.id,
      title: record.title || '',
      description: record.description || '',
      category: record.category || 'operations',
      imageUrl: record.image_url || '',
      imagePublicId: record.image_public_id || '',
      thumbnailUrl: record.thumbnail_url || '',
      aspectRatio: record.aspect_ratio || 'landscape',
      featured: record.featured || false,
      order: record.display_order || 999,
      createdAt: record.created_at,
      updatedAt: record.updated_at
    }))

    console.log(`[PUBLIC GALLERY API] Returning ${galleryItems.length} active gallery images`)

    return NextResponse.json(
      {
        success: true,
        data: galleryItems,
        count: galleryItems.length
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
        }
      }
    )
  } catch (error) {
    console.error('[PUBLIC GALLERY API ERROR]', error)

    return NextResponse.json(
      {
        error: 'Failed to fetch gallery items'
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
      'Allow': 'GET, OPTIONS'
    }
  })
}

// Enable ISR (Incremental Static Regeneration)
export const revalidate = 300 // Revalidate every 5 minutes
