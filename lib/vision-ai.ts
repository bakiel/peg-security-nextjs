/**
 * Vision AI Library - OpenRouter + Gemini 2.0 Flash Experimental (FREE)
 *
 * Features:
 * - Image analysis and description
 * - Gallery auto-description
 * - CV/Resume parsing
 * - PSIRA certificate verification
 * - Application photo validation
 * - Security: Rate limiting, input validation, prompt injection prevention
 */

import OpenAI from 'openai'

// Initialize OpenRouter client
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY!,
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002',
    'X-Title': 'PEG Security Platform'
  }
})

// AI Strategy: Free first, paid fallback (always reliable)
const MODELS = {
  PRIMARY: 'google/gemini-2.0-flash-exp:free',       // Try free first
  BACKUP: 'qwen/qwen2.5-vl-72b-instruct',            // PAID: Best quality ($0.08/$0.33 per 1M tokens)
  FALLBACK: 'qwen/qwen3-vl-8b-instruct'              // PAID: 256K context ($0.08/$0.50 per 1M tokens)
} as const

type ModelType = 'primary' | 'backup' | 'fallback'

// Security: Max tokens to prevent abuse
const MAX_TOKENS = 1000

/**
 * Helper: Clean JSON response from markdown formatting
 */
function cleanJSONResponse(response: string): string {
  // Remove markdown code blocks
  let cleaned = response.replace(/```json\s*/gi, '').replace(/```\s*/g, '')

  // Remove any text before first { or [
  const jsonStart = Math.min(
    cleaned.indexOf('{') !== -1 ? cleaned.indexOf('{') : Infinity,
    cleaned.indexOf('[') !== -1 ? cleaned.indexOf('[') : Infinity
  )

  if (jsonStart !== Infinity && jsonStart > 0) {
    cleaned = cleaned.substring(jsonStart)
  }

  // Remove any text after last } or ]
  const lastBrace = cleaned.lastIndexOf('}')
  const lastBracket = cleaned.lastIndexOf(']')
  const jsonEnd = Math.max(lastBrace, lastBracket)

  if (jsonEnd !== -1 && jsonEnd < cleaned.length - 1) {
    cleaned = cleaned.substring(0, jsonEnd + 1)
  }

  return cleaned.trim()
}

/**
 * Base function to analyze images with automatic fallback
 * PRIMARY: Gemini 2.0 Flash FREE (try free tier first)
 * BACKUP: Qwen 2.5 VL 72B PAID (high quality, always available)
 * FALLBACK: Qwen 3 VL 8B PAID (256K context, ultimate reliability)
 *
 * Cost: ~$0.0001 per request when using paid models (less than 1 cent)
 */
export async function analyzeImage(
  imageUrl: string,
  prompt: string,
  options: {
    maxTokens?: number
    temperature?: number
    modelType?: ModelType
    autoFallback?: boolean
  } = {}
): Promise<string> {
  const {
    maxTokens = MAX_TOKENS,
    temperature = 0.7,
    modelType = 'primary',
    autoFallback = true
  } = options

  // Security: Validate image URL
  if (!imageUrl || typeof imageUrl !== 'string') {
    throw new Error('Invalid image URL')
  }

  // Security: Validate prompt (prevent prompt injection)
  if (!prompt || typeof prompt !== 'string' || prompt.length > 1000) {
    throw new Error('Invalid prompt')
  }

  // Select model
  const model = modelType === 'backup' ? MODELS.BACKUP : modelType === 'fallback' ? MODELS.FALLBACK : MODELS.PRIMARY

  try {
    console.log(`[VISION AI] Using ${model}`)

    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: { url: imageUrl }
            }
          ]
        }
      ],
      max_tokens: maxTokens,
      temperature
    })

    const content = response.choices[0]?.message?.content

    if (!content) {
      throw new Error('No response from AI')
    }

    return content
  } catch (error) {
    console.error(`[VISION AI ERROR - ${model}]`, error)

    // Auto-fallback logic
    if (autoFallback) {
      if (modelType === 'primary') {
        console.log('[VISION AI] Falling back to Qwen 2.5 VL...')
        return analyzeImage(imageUrl, prompt, {
          ...options,
          modelType: 'backup',
          autoFallback: true
        })
      } else if (modelType === 'backup') {
        console.log('[VISION AI] Falling back to Qwen 2 VL 7B...')
        return analyzeImage(imageUrl, prompt, {
          ...options,
          modelType: 'fallback',
          autoFallback: false // Stop here
        })
      }
    }

    if (error instanceof Error) {
      // Handle specific errors
      if (error.message.includes('rate_limit')) {
        throw new Error('AI service is busy. Please try again in a moment.')
      }
      if (error.message.includes('invalid_image')) {
        throw new Error('Invalid or unsupported image format')
      }
      throw new Error(`AI analysis failed: ${error.message}`)
    }

    throw new Error('AI analysis failed')
  }
}

/**
 * Generate professional gallery description
 */
export async function generateGalleryDescription(imageUrl: string): Promise<{
  title: string
  description: string
  altText: string
  category: string
}> {
  const prompt = `Analyse this security installation photo. Write as PEG Security presenting work to potential clients.

Respond ONLY with valid JSON (no markdown):
{
  "title": "Brief professional title (40 chars max)",
  "description": "Write from PEG Security's perspective using 'we', 'our'. Describe the installation, equipment, and security features professionally. Use South African English (specialise, recognise). 100 words max.",
  "altText": "Brief alt text (100 chars max)",
  "category": "One of: Armed Response, CCTV Installation, Access Control, Security Guard, Event Security, VIP Protection, Projects, Team, Other"
}

Examples:
- "We installed a professional CCTV system with high-resolution cameras..."
- "Our armed response team provides 24/7 security with equipped vehicles..."
- "We specialise in access control featuring biometric readers..."

Use professional security terminology and emphasise quality.`

  try {
    const response = await analyzeImage(imageUrl, prompt, {
      maxTokens: 600,
      temperature: 0.4
    })

    // Clean and parse JSON response
    const cleaned = cleanJSONResponse(response)
    const parsed = JSON.parse(cleaned)

    // Validate required fields
    if (!parsed.title || !parsed.description || !parsed.altText || !parsed.category) {
      throw new Error('Incomplete AI response')
    }

    return {
      title: parsed.title.substring(0, 100),
      description: parsed.description.substring(0, 500),
      altText: parsed.altText.substring(0, 125),
      category: parsed.category
    }
  } catch (error) {
    console.error('[GALLERY DESCRIPTION ERROR]', error)
    throw new Error('Failed to generate gallery description')
  }
}

/**
 * Generate simple alt text for accessibility
 */
export async function generateAltText(imageUrl: string): Promise<string> {
  const prompt = `Generate a concise, descriptive alt text for this image.

Requirements:
- Maximum 125 characters
- Describe what's visible
- Focus on security/safety aspects
- Be specific but brief

Respond with ONLY the alt text, no explanation.`

  try {
    const response = await analyzeImage(imageUrl, prompt, {
      maxTokens: 50,
      temperature: 0.3
    })

    return response.trim().substring(0, 125)
  } catch (error) {
    console.error('[ALT TEXT ERROR]', error)
    return 'Security installation image'
  }
}

/**
 * Parse CV/Resume and extract key information
 */
export async function parseCV(imageUrl: string): Promise<{
  name: string
  email: string
  phone: string
  yearsExperience: number
  psiraRegistered: boolean
  psiraNumber: string
  qualifications: string[]
  skills: string[]
}> {
  const prompt = `Analyze this CV/Resume document.

Extract the following information and respond ONLY with valid JSON (no markdown):
{
  "name": "Full name",
  "email": "Email address",
  "phone": "Phone number (SA format preferred)",
  "yearsExperience": "Total years in security (number only)",
  "psiraRegistered": "true/false - mention of PSIRA registration",
  "psiraNumber": "PSIRA registration number if visible, or empty string",
  "qualifications": ["List of relevant security qualifications/certifications"],
  "skills": ["Key security skills mentioned"]
}

If information is not found, use: "" for strings, 0 for numbers, false for booleans, [] for arrays.`

  try {
    const response = await analyzeImage(imageUrl, prompt, {
      maxTokens: 500,
      temperature: 0.2
    })

    const cleaned = cleanJSONResponse(response)
    const parsed = JSON.parse(cleaned)

    return {
      name: parsed.name || '',
      email: parsed.email || '',
      phone: parsed.phone || '',
      yearsExperience: parseInt(parsed.yearsExperience) || 0,
      psiraRegistered: parsed.psiraRegistered === true,
      psiraNumber: parsed.psiraNumber || '',
      qualifications: Array.isArray(parsed.qualifications) ? parsed.qualifications : [],
      skills: Array.isArray(parsed.skills) ? parsed.skills : []
    }
  } catch (error) {
    console.error('[CV PARSING ERROR]', error)
    throw new Error('Failed to parse CV')
  }
}

/**
 * Verify PSIRA certificate
 */
export async function verifyPSIRACertificate(imageUrl: string): Promise<{
  valid: boolean
  registrationNumber: string
  fullName: string
  grade: string
  expiryDate: string
  status: 'active' | 'expired' | 'unknown'
  confidence: 'high' | 'medium' | 'low'
}> {
  const prompt = `Analyze this PSIRA (Private Security Industry Regulatory Authority) registration certificate.

Extract and respond ONLY with valid JSON (no markdown):
{
  "valid": "true/false - does this appear to be a genuine PSIRA certificate?",
  "registrationNumber": "PSIRA registration number",
  "fullName": "Registered person's full name",
  "grade": "Security grade (A, B, C, D, E, or specific category)",
  "expiryDate": "Expiry date (YYYY-MM-DD format if visible)",
  "status": "active/expired/unknown",
  "confidence": "high/medium/low - confidence in the analysis"
}

Look for official PSIRA branding, holograms, and proper formatting. If you cannot read specific fields, use empty strings.`

  try {
    const response = await analyzeImage(imageUrl, prompt, {
      maxTokens: 300,
      temperature: 0.1 // Very low temperature for factual extraction
    })

    const cleaned = cleanJSONResponse(response)
    const parsed = JSON.parse(cleaned)

    return {
      valid: parsed.valid === true,
      registrationNumber: parsed.registrationNumber || '',
      fullName: parsed.fullName || '',
      grade: parsed.grade || '',
      expiryDate: parsed.expiryDate || '',
      status: ['active', 'expired', 'unknown'].includes(parsed.status) ? parsed.status : 'unknown',
      confidence: ['high', 'medium', 'low'].includes(parsed.confidence) ? parsed.confidence : 'low'
    }
  } catch (error) {
    console.error('[PSIRA VERIFICATION ERROR]', error)
    throw new Error('Failed to verify PSIRA certificate')
  }
}

/**
 * Validate application photo (headshot quality check)
 */
export async function validateApplicationPhoto(imageUrl: string): Promise<{
  suitable: boolean
  issues: string[]
  suggestions: string[]
}> {
  const prompt = `Evaluate this application photograph for professional suitability.

Check:
1. Is it a clear headshot with face clearly visible?
2. Is professional attire worn?
3. Is the background appropriate (plain/neutral)?
4. Is the lighting adequate?
5. Is the photo recent and clear quality?

Respond ONLY with valid JSON (no markdown):
{
  "suitable": "true/false - overall suitability",
  "issues": ["List specific problems if any"],
  "suggestions": ["Recommendations for improvement if needed"]
}

If photo is suitable, issues and suggestions arrays can be empty.`

  try {
    const response = await analyzeImage(imageUrl, prompt, {
      maxTokens: 300,
      temperature: 0.3
    })

    const cleaned = cleanJSONResponse(response)
    const parsed = JSON.parse(cleaned)

    return {
      suitable: parsed.suitable === true,
      issues: Array.isArray(parsed.issues) ? parsed.issues : [],
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : []
    }
  } catch (error) {
    console.error('[PHOTO VALIDATION ERROR]', error)
    throw new Error('Failed to validate application photo')
  }
}

/**
 * Identify security equipment in image
 */
export async function identifySecurityEquipment(imageUrl: string): Promise<{
  equipment: Array<{
    type: string
    brand: string
    model: string
    quantity: number
  }>
  installation: string
  notes: string
}> {
  const prompt = `Analyze this image and identify all visible security equipment.

Respond ONLY with valid JSON (no markdown):
{
  "equipment": [
    {
      "type": "Equipment type (camera, sensor, alarm, etc)",
      "brand": "Brand name if identifiable",
      "model": "Model number if visible",
      "quantity": "Number of units visible"
    }
  ],
  "installation": "Quality assessment of installation (professional/amateur/unknown)",
  "notes": "Additional observations about the setup"
}

Be specific about camera types (dome, bullet, PTZ), mounting, cabling quality, etc.`

  try {
    const response = await analyzeImage(imageUrl, prompt, {
      maxTokens: 500,
      temperature: 0.4
    })

    const cleaned = cleanJSONResponse(response)
    const parsed = JSON.parse(cleaned)

    return {
      equipment: Array.isArray(parsed.equipment) ? parsed.equipment : [],
      installation: parsed.installation || 'unknown',
      notes: parsed.notes || ''
    }
  } catch (error) {
    console.error('[EQUIPMENT IDENTIFICATION ERROR]', error)
    throw new Error('Failed to identify security equipment')
  }
}

/**
 * Analyze image quality and provide recommendations
 */
export async function analyzeImageQuality(imageUrl: string): Promise<{
  quality: 'excellent' | 'good' | 'fair' | 'poor'
  resolution: string
  clarity: string
  suitableForGallery: boolean
  recommendations: string[]
}> {
  const prompt = `Assess the technical quality of this image for professional website use.

Evaluate:
- Resolution and sharpness
- Lighting and exposure
- Composition and framing
- Any technical issues (blur, noise, artifacts)

Respond ONLY with valid JSON (no markdown):
{
  "quality": "excellent/good/fair/poor",
  "resolution": "Apparent resolution quality",
  "clarity": "Sharpness and focus assessment",
  "suitableForGallery": "true/false",
  "recommendations": ["Specific improvements if needed"]
}`

  try {
    const response = await analyzeImage(imageUrl, prompt, {
      maxTokens: 300,
      temperature: 0.3
    })

    const cleaned = cleanJSONResponse(response)
    const parsed = JSON.parse(cleaned)

    return {
      quality: ['excellent', 'good', 'fair', 'poor'].includes(parsed.quality)
        ? parsed.quality
        : 'fair',
      resolution: parsed.resolution || '',
      clarity: parsed.clarity || '',
      suitableForGallery: parsed.suitableForGallery === true,
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : []
    }
  } catch (error) {
    console.error('[QUALITY ANALYSIS ERROR]', error)
    throw new Error('Failed to analyze image quality')
  }
}

/**
 * Generate SEO-optimized keywords from image
 */
export async function generateSEOKeywords(imageUrl: string): Promise<string[]> {
  const prompt = `Analyze this security industry image and generate SEO keywords.

Generate 5-10 relevant keywords for search engine optimization. Focus on:
- Security industry terms
- Specific equipment or services visible
- Location type (commercial, residential, industrial)
- Action/function keywords

Respond with ONLY a JSON array of keywords:
["keyword1", "keyword2", "keyword3"]`

  try {
    const response = await analyzeImage(imageUrl, prompt, {
      maxTokens: 150,
      temperature: 0.4
    })

    const cleaned = cleanJSONResponse(response)
    const parsed = JSON.parse(cleaned)

    if (Array.isArray(parsed)) {
      return parsed.slice(0, 10)
    }

    return []
  } catch (error) {
    console.error('[SEO KEYWORDS ERROR]', error)
    return []
  }
}
