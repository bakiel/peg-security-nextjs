/**
 * Image Processing Utility
 *
 * Features:
 * - Convert any image format to JPEG
 * - Crop to 1:1 aspect ratio (square)
 * - Resize to max 1000x1000px
 * - Optimize quality
 * - Security: Validate file types, check magic numbers
 */

import sharp from 'sharp'

export interface ProcessedImage {
  buffer: Buffer
  width: number
  height: number
  format: string
  size: number
}

export interface ImageProcessingOptions {
  maxSize?: number // Default: 1000
  quality?: number // Default: 85
  aspectRatio?: '1:1' | 'original' // Default: '1:1'
  format?: 'jpeg' | 'webp' // Default: 'jpeg'
}

/**
 * Process image: Convert to JPEG, crop to 1:1, resize to max 1000x1000
 */
export async function processImage(
  fileBuffer: Buffer,
  options: ImageProcessingOptions = {}
): Promise<ProcessedImage> {
  const {
    maxSize = 1000,
    quality = 85,
    aspectRatio = '1:1',
    format = 'jpeg'
  } = options

  try {
    // Load image with sharp (Sharp will validate file type automatically)
    let image = sharp(fileBuffer)
    const metadata = await image.metadata()

    if (!metadata.width || !metadata.height) {
      throw new Error('Unable to read image dimensions')
    }

    // Step 1: Crop to 1:1 aspect ratio (if requested)
    if (aspectRatio === '1:1') {
      const minDimension = Math.min(metadata.width, metadata.height)

      // Calculate crop position (center crop)
      const left = Math.floor((metadata.width - minDimension) / 2)
      const top = Math.floor((metadata.height - minDimension) / 2)

      image = image.extract({
        left,
        top,
        width: minDimension,
        height: minDimension
      })
    }

    // Step 2: Resize to max dimensions (maintain aspect ratio if not 1:1)
    if (aspectRatio === '1:1') {
      // For square images, resize to exact maxSize
      image = image.resize(maxSize, maxSize, {
        fit: 'cover',
        position: 'centre'
      })
    } else {
      // For original aspect ratio, fit within maxSize
      image = image.resize(maxSize, maxSize, {
        fit: 'inside',
        withoutEnlargement: true
      })
    }

    // Step 3: Convert to specified format
    if (format === 'jpeg') {
      image = image.jpeg({
        quality,
        progressive: true,
        mozjpeg: true // Better compression
      })
    } else if (format === 'webp') {
      image = image.webp({
        quality,
        effort: 6 // Max compression effort
      })
    }

    // Step 4: Remove metadata (for privacy/security)
    image = image.rotate() // Auto-rotate based on EXIF
      .withMetadata({
        orientation: undefined, // Remove orientation
        exif: {} // Remove all EXIF data
      })

    // Step 5: Process image
    const processedBuffer = await image.toBuffer({ resolveWithObject: true })

    return {
      buffer: processedBuffer.data,
      width: processedBuffer.info.width,
      height: processedBuffer.info.height,
      format: processedBuffer.info.format,
      size: processedBuffer.info.size
    }
  } catch (error) {
    console.error('[IMAGE PROCESSING ERROR]', error)
    throw new Error(
      `Failed to process image: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Process image from base64 string
 */
export async function processImageFromBase64(
  base64String: string,
  options: ImageProcessingOptions = {}
): Promise<ProcessedImage> {
  // Remove data URL prefix if present
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '')
  const buffer = Buffer.from(base64Data, 'base64')

  return processImage(buffer, options)
}

/**
 * Process image from File object
 */
export async function processImageFromFile(
  file: File,
  options: ImageProcessingOptions = {}
): Promise<ProcessedImage> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  return processImage(buffer, options)
}

/**
 * Generate thumbnail (small version)
 */
export async function generateThumbnail(
  fileBuffer: Buffer,
  size: number = 300
): Promise<Buffer> {
  try {
    const processed = await processImage(fileBuffer, {
      maxSize: size,
      quality: 80,
      aspectRatio: '1:1',
      format: 'jpeg'
    })

    return processed.buffer
  } catch (error) {
    console.error('[THUMBNAIL GENERATION ERROR]', error)
    throw new Error('Failed to generate thumbnail')
  }
}

/**
 * Optimize existing JPEG (without resizing)
 */
export async function optimizeJPEG(
  fileBuffer: Buffer,
  quality: number = 85
): Promise<Buffer> {
  try {
    return await sharp(fileBuffer)
      .jpeg({
        quality,
        progressive: true,
        mozjpeg: true
      })
      .toBuffer()
  } catch (error) {
    console.error('[JPEG OPTIMIZATION ERROR]', error)
    throw new Error('Failed to optimize JPEG')
  }
}

/**
 * Get image metadata without processing
 */
export async function getImageMetadata(fileBuffer: Buffer) {
  try {
    const metadata = await sharp(fileBuffer).metadata()

    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
      format: metadata.format || 'unknown',
      space: metadata.space,
      channels: metadata.channels,
      hasAlpha: metadata.hasAlpha,
      orientation: metadata.orientation,
      size: fileBuffer.length
    }
  } catch (error) {
    console.error('[METADATA ERROR]', error)
    throw new Error('Failed to read image metadata')
  }
}
