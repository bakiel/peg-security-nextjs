import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import {
  analyzeImage,
  generateGalleryDescription,
  generateAltText,
  parseCV,
  verifyPSIRACertificate,
  validateApplicationPhoto,
  identifySecurityEquipment,
  analyzeImageQuality,
  generateSEOKeywords
} from '@/lib/vision-ai'

/**
 * POST /api/vision/analyze
 * Analyze images with AI (Gemini 2.0 Flash Experimental)
 *
 * Security:
 * - Rate limiting (10 per minute per IP)
 * - Input validation
 * - OpenRouter API key required
 *
 * Body:
 * {
 *   imageUrl: string (required)
 *   action: 'gallery' | 'altText' | 'cv' | 'psira' | 'photo' | 'equipment' | 'quality' | 'seo' | 'custom'
 *   prompt?: string (for custom action)
 * }
 */

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - 10 requests per minute
    const rateLimitResult = await rateLimit(request, 'visionAI')

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: rateLimitResult.message || 'Too many requests',
          retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000)
        },
        { status: 429 }
      )
    }

    // Check API key exists
    if (!process.env.OPENROUTER_API_KEY) {
      console.error('[VISION API] OpenRouter API key not configured')
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { imageUrl, action, prompt } = body

    // Validation
    if (!imageUrl || typeof imageUrl !== 'string') {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      )
    }

    if (!action || typeof action !== 'string') {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      )
    }

    // Security: Validate URL format
    try {
      new URL(imageUrl)
    } catch {
      return NextResponse.json(
        { error: 'Invalid image URL format' },
        { status: 400 }
      )
    }

    console.log(`[VISION API] Analyzing image with action: ${action}`)

    // Execute requested action
    let result

    switch (action) {
      case 'gallery':
        result = await generateGalleryDescription(imageUrl)
        break

      case 'altText':
        result = { altText: await generateAltText(imageUrl) }
        break

      case 'cv':
        result = await parseCV(imageUrl)
        break

      case 'psira':
        result = await verifyPSIRACertificate(imageUrl)
        break

      case 'photo':
        result = await validateApplicationPhoto(imageUrl)
        break

      case 'equipment':
        result = await identifySecurityEquipment(imageUrl)
        break

      case 'quality':
        result = await analyzeImageQuality(imageUrl)
        break

      case 'seo':
        result = { keywords: await generateSEOKeywords(imageUrl) }
        break

      case 'custom':
        if (!prompt || typeof prompt !== 'string') {
          return NextResponse.json(
            { error: 'Prompt is required for custom action' },
            { status: 400 }
          )
        }
        result = { analysis: await analyzeImage(imageUrl, prompt) }
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported: gallery, altText, cv, psira, photo, equipment, quality, seo, custom' },
          { status: 400 }
        )
    }

    console.log(`[VISION API] Successfully analyzed image (action: ${action})`)

    return NextResponse.json(
      {
        success: true,
        action,
        result
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[VISION API ERROR]', error)

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes('rate_limit')) {
        return NextResponse.json(
          { error: 'AI service is busy. Please try again in a moment.' },
          { status: 503 }
        )
      }

      if (error.message.includes('invalid_image')) {
        return NextResponse.json(
          { error: 'Invalid or unsupported image format' },
          { status: 400 }
        )
      }

      return NextResponse.json(
        {
          error: 'AI analysis failed',
          details: error.message
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
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
      Allow: 'POST, OPTIONS'
    }
  })
}
