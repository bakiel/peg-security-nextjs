import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * DEBUG ROUTE - Check gallery database and storage
 */
export async function GET() {
  try {
    // 1. Check database
    const { data: dbImages, error: dbError } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false })

    if (dbError) {
      throw dbError
    }

    // 2. Check storage bucket
    const { data: bucketFiles, error: bucketError } = await supabase.storage
      .from('gallery')
      .list()

    // 3. Check storage bucket config
    const { data: buckets } = await supabase.storage.listBuckets()
    const galleryBucket = buckets?.find(b => b.name === 'gallery')

    return NextResponse.json({
      success: true,
      database: {
        totalImages: dbImages?.length || 0,
        images: dbImages || []
      },
      storage: {
        bucketExists: !!galleryBucket,
        bucketPublic: galleryBucket?.public || false,
        totalFiles: bucketFiles?.length || 0,
        files: bucketFiles || [],
        error: bucketError?.message || null
      }
    })
  } catch (error) {
    console.error('[DEBUG GALLERY ERROR]', error)
    return NextResponse.json(
      {
        error: 'Debug check failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
