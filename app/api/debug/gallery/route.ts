import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { readdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

const UPLOAD_BASE_DIR = process.env.UPLOAD_DIR || '/opt/peg-security/uploads'

/**
 * DEBUG ROUTE - Check gallery database and filesystem storage
 */
export async function GET() {
  try {
    // 1. Check database
    const { data: dbImages, error: dbError } = await db
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false })
      .execute()

    if (dbError) {
      throw dbError
    }

    // 2. Check filesystem storage
    const galleryDir = path.join(UPLOAD_BASE_DIR, 'gallery')
    let filesystemFiles: string[] = []
    let filesystemError: string | null = null

    try {
      if (existsSync(galleryDir)) {
        filesystemFiles = await readdir(galleryDir)
      } else {
        filesystemError = 'Gallery directory does not exist'
      }
    } catch (error) {
      filesystemError = error instanceof Error ? error.message : 'Unknown error'
    }

    return NextResponse.json({
      success: true,
      database: {
        totalImages: dbImages?.length || 0,
        images: dbImages || []
      },
      filesystem: {
        directoryExists: existsSync(galleryDir),
        directoryPath: galleryDir,
        totalFiles: filesystemFiles.length,
        files: filesystemFiles,
        error: filesystemError
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
