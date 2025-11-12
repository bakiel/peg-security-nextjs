/**
 * TypeScript Type Definitions
 *
 * This module provides type definitions for the entire application
 * Includes types for:
 * - Database records (Airtable)
 * - API requests and responses
 * - Forms and validations
 * - Authentication and sessions
 * - Email templates
 *
 * Type safety: Ensures consistency across the codebase
 */

// ============================================================================
// CONTACT FORM TYPES
// ============================================================================

export interface ContactFormData {
  name: string
  email: string
  phone: string
  serviceType: ServiceType
  message: string
  preferredContact: PreferredContactMethod
}

export interface ContactSubmission extends ContactFormData {
  id?: string
  submittedAt?: string
  status?: 'new' | 'contacted' | 'resolved'
  notes?: string
}

export type ServiceType =
  | 'armed-response'
  | 'security-guards'
  | 'access-control'
  | 'cctv-surveillance'
  | 'alarm-systems'
  | 'event-security'
  | 'risk-assessment'
  | 'security-consulting'
  | 'other'

export type PreferredContactMethod = 'email' | 'phone' | 'whatsapp'

// ============================================================================
// JOB/CAREERS TYPES
// ============================================================================

export interface JobListing {
  id: string
  title: string
  slug: string
  category: JobCategory
  location: string
  employmentType: EmploymentType
  psiraRequired: boolean
  description: string
  responsibilities: string[]
  requirements: string[]
  benefits: string[]
  status: JobStatus
  createdAt?: string
  updatedAt?: string
  applicationCount?: number
}

export type JobCategory = 'operations' | 'management' | 'admin' | 'technical' | 'training'

export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'temporary'

export type JobStatus = 'open' | 'closed' | 'draft'

// ============================================================================
// JOB APPLICATION TYPES
// ============================================================================

export interface JobApplication {
  id?: string
  jobId: string
  jobTitle: string
  applicantName: string
  applicantEmail: string
  applicantPhone: string
  cvUrl?: string
  cvPublicId?: string
  coverLetter?: string
  psiraRegistered?: boolean
  psiraNumber?: string
  yearsExperience?: number
  availableStartDate?: string
  status: ApplicationStatus
  submittedAt?: string
  reviewedAt?: string
  reviewedBy?: string
  notes?: string
}

export type ApplicationStatus =
  | 'new'
  | 'reviewing'
  | 'shortlisted'
  | 'interview-scheduled'
  | 'rejected'
  | 'hired'

// ============================================================================
// GALLERY TYPES
// ============================================================================

export interface GalleryItem {
  id: string
  title: string
  description: string
  category: GalleryCategory
  imageUrl: string
  imagePublicId: string
  thumbnailUrl?: string
  aspectRatio: AspectRatio
  featured: boolean
  order: number
  createdAt?: string
  updatedAt?: string
}

export type GalleryCategory =
  | 'training'
  | 'operations'
  | 'team'
  | 'events'
  | 'equipment'
  | 'facilities'
  | 'awards'

export type AspectRatio = 'square' | 'landscape' | 'portrait'

// ============================================================================
// AUTHENTICATION TYPES
// ============================================================================

export interface SessionData {
  userId: string
  username: string
  isAdmin: boolean
  createdAt: number
  expiresAt: number
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResponse {
  success: boolean
  session?: SessionData
  error?: string
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ErrorResponse {
  error: string
  status: number
  details?: any
}

// ============================================================================
// AIRTABLE TYPES
// ============================================================================

export interface AirtableRecord<T> {
  id: string
  fields: T
  createdTime?: string
}

export interface AirtableJobFields {
  'Job ID': number
  Title: string
  Slug: string
  Category: JobCategory
  Location: string
  'Employment Type': EmploymentType
  'PSIRA Required': boolean
  Description: string
  Responsibilities: string
  Requirements: string
  Benefits: string
  Status: JobStatus
  'Created At': string
  'Updated At': string
  'Application Count': number
}

export interface AirtableApplicationFields {
  'Application ID': number
  'Job ID': string
  'Job Title': string
  'Applicant Name': string
  'Applicant Email': string
  'Applicant Phone': string
  'CV URL': string
  'CV Public ID': string
  'Cover Letter': string
  'PSIRA Registered': boolean
  'PSIRA Number': string
  'Years Experience': number
  'Available Start Date': string
  Status: ApplicationStatus
  'Submitted At': string
  'Reviewed At': string
  'Reviewed By': string
  Notes: string
}

export interface AirtableGalleryFields {
  'Gallery ID': number
  Title: string
  Description: string
  Category: GalleryCategory
  'Image URL': string
  'Image Public ID': string
  'Thumbnail URL': string
  'Aspect Ratio': AspectRatio
  Featured: boolean
  Order: number
  'Created At': string
  'Updated At': string
}

export interface AirtableContactFields {
  'Contact ID': number
  Name: string
  Email: string
  Phone: string
  'Service Type': ServiceType
  Message: string
  'Preferred Contact': PreferredContactMethod
  Status: 'new' | 'contacted' | 'resolved'
  'Submitted At': string
  Notes: string
}

// ============================================================================
// EMAIL TYPES
// ============================================================================

export interface EmailTemplate {
  to: string | string[]
  from: string
  replyTo?: string
  subject: string
  html: string
  text?: string
}

export interface ContactEmailData {
  to: string
  name: string
  serviceType: string
}

export interface ApplicationEmailData {
  to: string
  name: string
  jobTitle: string
}

export interface AdminNotificationData {
  name: string
  email: string
  phone: string
  serviceType?: string
  message?: string
  preferredContact?: string
  jobTitle?: string
  cvUrl?: string
  coverLetter?: string
}

// ============================================================================
// CLOUDINARY TYPES
// ============================================================================

export interface CloudinaryUploadResult {
  url: string
  secureUrl: string
  publicId: string
  width: number
  height: number
}

export interface CloudinaryTransformation {
  width?: number
  height?: number
  crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb'
  quality?: number | 'auto'
  format?: 'auto' | 'webp' | 'jpg' | 'png'
  gravity?: string
}

// ============================================================================
// RATE LIMITING TYPES
// ============================================================================

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
  message?: string
}

export type RateLimitType =
  | 'contactForm'
  | 'jobApplication'
  | 'adminLogin'
  | 'fileUpload'
  | 'emailSend'
  | 'generalApi'

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface ValidationResult {
  valid: boolean
  error?: string
  value?: any
}

export interface FieldValidation {
  field: string
  rules: ValidationRule[]
}

export interface ValidationRule {
  type: 'required' | 'email' | 'phone' | 'length' | 'pattern' | 'custom'
  params?: any
  message?: string
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface FormState<T> {
  data: T
  errors: Record<keyof T, string>
  isSubmitting: boolean
  isSubmitted: boolean
}

export interface FormFieldProps {
  name: string
  label: string
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'file'
  placeholder?: string
  required?: boolean
  options?: Array<{ value: string; label: string }>
  validation?: ValidationRule[]
}

// ============================================================================
// ADMIN DASHBOARD TYPES
// ============================================================================

export interface DashboardStats {
  totalJobs: number
  activeJobs: number
  totalApplications: number
  newApplications: number
  totalContacts: number
  newContacts: number
  totalGalleryImages: number
}

export interface AdminAction {
  id: string
  userId: string
  username: string
  action: string
  entityType: 'job' | 'application' | 'gallery' | 'contact'
  entityId: string
  timestamp: string
  details?: Record<string, any>
}

// ============================================================================
// QUERY TYPES
// ============================================================================

export interface QueryParams {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
  filter?: Record<string, any>
  search?: string
}

export interface FilterOptions {
  status?: string[]
  category?: string[]
  dateFrom?: string
  dateTo?: string
}

// ============================================================================
// FILE UPLOAD TYPES
// ============================================================================

export interface FileUploadResult {
  success: boolean
  url?: string
  publicId?: string
  error?: string
}

export interface FileValidation {
  maxSize: number // in bytes
  allowedTypes: string[]
  allowedExtensions: string[]
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type Nullable<T> = T | null

export type Optional<T> = T | undefined

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

export type OmitFields<T, K extends keyof T> = Omit<T, K>

// ============================================================================
// CONSTANTS
// ============================================================================

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  'armed-response': 'Armed Response',
  'security-guards': 'Security Guards',
  'access-control': 'Access Control',
  'cctv-surveillance': 'CCTV Surveillance',
  'alarm-systems': 'Alarm Systems',
  'event-security': 'Event Security',
  'risk-assessment': 'Risk Assessment',
  'security-consulting': 'Security Consulting',
  'other': 'Other'
}

export const JOB_CATEGORY_LABELS: Record<JobCategory, string> = {
  operations: 'Operations',
  management: 'Management',
  admin: 'Administration',
  technical: 'Technical',
  training: 'Training'
}

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  contract: 'Contract',
  temporary: 'Temporary'
}

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  new: 'New',
  reviewing: 'Reviewing',
  shortlisted: 'Shortlisted',
  'interview-scheduled': 'Interview Scheduled',
  rejected: 'Rejected',
  hired: 'Hired'
}

export const GALLERY_CATEGORY_LABELS: Record<GalleryCategory, string> = {
  training: 'Training',
  operations: 'Operations',
  team: 'Team',
  events: 'Events',
  equipment: 'Equipment',
  facilities: 'Facilities',
  awards: 'Awards & Recognition'
}
