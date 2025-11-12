/**
 * Supabase Client Configuration
 * Replaces Airtable for database and Cloudinary for storage
 */

import { createClient } from '@supabase/supabase-js'

// Lazy initialization to avoid build-time errors
let _supabaseAdmin: ReturnType<typeof createClient> | null = null
let _supabaseClient: ReturnType<typeof createClient> | null = null

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
  }
  return url
}

function getSupabaseServiceKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
  }
  return key
}

function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
  }
  return key
}

/**
 * Server-side Supabase client with service role key
 * Use this in API routes for admin operations
 * Has full access, bypasses RLS policies
 */
export const supabaseAdmin = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    if (!_supabaseAdmin) {
      _supabaseAdmin = createClient(getSupabaseUrl(), getSupabaseServiceKey(), {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      })
    }
    return (_supabaseAdmin as any)[prop]
  }
})

/**
 * Client-side Supabase client with anon key
 * Use this in client components
 * Respects RLS policies
 */
export const supabaseClient = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    if (!_supabaseClient) {
      _supabaseClient = createClient(getSupabaseUrl(), getSupabaseAnonKey())
    }
    return (_supabaseClient as any)[prop]
  }
})

/**
 * Database Types
 */

export interface Contact {
  id: string
  name: string
  email: string
  phone: string
  service_type: string
  message: string
  preferred_contact: 'Email' | 'Phone'
  status: 'New' | 'Read' | 'Responded'
  notes?: string
  submitted_at: string
  created_at: string
  updated_at: string
}

export interface Job {
  id: string
  title: string
  slug: string
  category: string
  location: string
  employment_type: 'Full-time' | 'Part-time' | 'Contract' | 'Temporary'
  psira_required: boolean
  description: string
  responsibilities: string
  requirements: string
  benefits?: string
  status: 'Draft' | 'Open' | 'Closed'
  application_count: number
  created_at: string
  updated_at: string
}

export interface Application {
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
  notes?: string
  submitted_at: string
  created_at: string
  updated_at: string
}

export interface GalleryImage {
  id: string
  title: string
  description: string
  category: string
  image_url: string
  image_public_id: string
  thumbnail_url: string
  status: 'Active' | 'Hidden'
  display_order: number
  created_at: string
  updated_at: string
}

/**
 * Helper function to upload file to Supabase Storage
 * Replaces Cloudinary uploadImage function
 */
export async function uploadToSupabase(
  bucket: string,
  path: string,
  file: File | Buffer,
  contentType?: string
): Promise<{ url: string; path: string }> {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, file, {
      contentType,
      upsert: false
    })

  if (error) {
    console.error('[SUPABASE STORAGE ERROR]', error)
    throw new Error(`Failed to upload file: ${error.message}`)
  }

  // Get public URL
  const { data: urlData } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(data.path)

  return {
    url: urlData.publicUrl,
    path: data.path
  }
}

/**
 * Helper function to delete file from Supabase Storage
 * Replaces Cloudinary deleteImage function
 */
export async function deleteFromSupabase(
  bucket: string,
  path: string
): Promise<void> {
  const { error } = await supabaseAdmin.storage.from(bucket).remove([path])

  if (error) {
    console.error('[SUPABASE STORAGE DELETE ERROR]', error)
    throw new Error(`Failed to delete file: ${error.message}`)
  }
}

/**
 * Helper to generate thumbnail URL from storage URL
 */
export function getThumbnailUrl(imageUrl: string, width = 400, height = 300): string {
  // Supabase Image Transformation (if enabled in project)
  // return `${imageUrl}?width=${width}&height=${height}&resize=cover`

  // For now, return same URL (can add transformation later)
  return imageUrl
}

/**
 * Helper to convert base64 to Buffer for upload
 */
export function base64ToBuffer(base64String: string): Buffer {
  // Remove data URL prefix if present
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '')
  return Buffer.from(base64Data, 'base64')
}
