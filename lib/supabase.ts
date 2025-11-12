/**
 * Supabase Client Configuration
 * Replaces Airtable for database and Cloudinary for storage
 */

import { createClient } from '@supabase/supabase-js'

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseServiceKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
}

/**
 * Server-side Supabase client with service role key
 * Use this in API routes for admin operations
 * Has full access, bypasses RLS policies
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

/**
 * Client-side Supabase client with anon key
 * Use this in client components
 * Respects RLS policies
 */
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

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
