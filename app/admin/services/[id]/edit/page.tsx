'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Button from '@/components/admin/Button'
import { FormField, TextareaField, SelectField } from '@/components/admin/FormField'
import FileUpload from '@/components/admin/FileUpload'
import FeaturesInput from '@/components/admin/FeaturesInput'

const serviceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  short_description: z.string().min(20, 'Short description must be at least 20 characters').max(200),
  full_description: z.string().min(100, 'Full description must be at least 100 characters').max(5000),
  icon_name: z.string().min(1, 'Icon name is required'),
  category: z.enum(['Physical Security', 'Electronic Security', 'Specialised Services', 'Consulting', 'Other']),
  features: z.array(z.string()).min(1, 'At least one feature is required'),
  pricing_model: z.enum(['Fixed Price', 'Hourly Rate', 'Monthly Retainer', 'Custom Quote', 'Contact Us']),
  pricing_details: z.string().max(500).optional().or(z.literal('')),
  display_order: z.coerce.number().int().min(0).optional(),
  status: z.enum(['Active', 'Draft', 'Archived'])
})

type ServiceFormData = z.infer<typeof serviceSchema>

interface Service {
  id: string
  title: string
  slug: string
  short_description: string
  full_description: string
  icon_name: string
  category: string
  features: string[]
  pricing_model: string
  pricing_details: string | null
  image_url: string | null
  image_public_id: string | null
  status: 'Active' | 'Draft' | 'Archived'
  display_order: number
}

export default function EditServicePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [service, setService] = useState<Service | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema)
  })

  useEffect(() => {
    fetchService()
  }, [params.id])

  const fetchService = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/services/${params.id}`)
      const result = await response.json()

      if (result.success) {
        setService(result.data)
        reset({
          title: result.data.title,
          short_description: result.data.short_description,
          full_description: result.data.full_description,
          icon_name: result.data.icon_name,
          category: result.data.category,
          features: result.data.features || [],
          pricing_model: result.data.pricing_model,
          pricing_details: result.data.pricing_details || '',
          display_order: result.data.display_order,
          status: result.data.status
        })
      } else {
        console.error('Failed to fetch service:', result.error)
        alert('Failed to load service')
        router.push('/admin/services')
      }
    } catch (error) {
      console.error('Error fetching service:', error)
      alert('Failed to load service')
      router.push('/admin/services')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: ServiceFormData) => {
    try {
      setSubmitting(true)

      let imageUrl = service?.image_url
      let imagePublicId = service?.image_public_id

      // Upload new image if selected
      if (imageFile) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', imageFile)
        uploadFormData.append('bucket', 'services')

        const uploadResponse = await fetch('/api/admin/upload', {
          method: 'POST',
          body: uploadFormData
        })

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image')
        }

        const uploadResult = await uploadResponse.json()
        imageUrl = uploadResult.url
        imagePublicId = uploadResult.path
      }

      // Update service
      const serviceData = {
        title: data.title,
        short_description: data.short_description,
        full_description: data.full_description,
        icon_name: data.icon_name,
        category: data.category,
        features: data.features,
        pricing_model: data.pricing_model,
        pricing_details: data.pricing_details || null,
        image_url: imageUrl,
        image_public_id: imagePublicId,
        display_order: data.display_order || 0,
        status: data.status
      }

      const response = await fetch(`/api/admin/services/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.details || 'Failed to update service')
      }

      router.push('/admin/services')
    } catch (error) {
      console.error('Error updating service:', error)
      alert(error instanceof Error ? error.message : 'Failed to update service')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#D0B96D] border-t-transparent mb-4" />
          <p className="text-gray-600 font-sans">Loading service...</p>
        </div>
      </div>
    )
  }

  if (!service) {
    return null
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/services"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 font-sans font-semibold"
        >
          <ArrowLeft size={20} />
          Back to Services
        </Link>
        <h1 className="text-3xl font-sans font-bold text-gray-900 mb-2">Edit Service</h1>
        <p className="text-gray-600 font-sans">Update {service.title}</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Current Image */}
          {service.image_url && (
            <div>
              <label className="block mb-2">
                <span className="text-sm font-sans font-semibold text-gray-900">Current Image</span>
              </label>
              <div className="mb-4">
                <img
                  src={service.image_url}
                  alt={service.title}
                  className="max-w-md rounded-lg shadow-md"
                />
              </div>
            </div>
          )}

          {/* Image Upload */}
          <FileUpload
            label={service.image_url ? 'Replace Image' : 'Add Image'}
            accept="image/*"
            onFileSelect={(files) => setImageFile(files[0])}
            helperText="Upload a new image to replace the current one (max 5MB)"
          />

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Title"
              required
              error={errors.title?.message}
              {...register('title')}
            />

            <FormField
              label="Icon Name"
              required
              error={errors.icon_name?.message}
              helperText="Font Awesome icon name (e.g., shield, lock, camera)"
              {...register('icon_name')}
            />
          </div>

          {/* Short Description */}
          <FormField
            label="Short Description"
            required
            error={errors.short_description?.message}
            helperText="Brief summary (20-200 characters) for cards and previews"
            maxLength={200}
            {...register('short_description')}
          />

          {/* Full Description */}
          <TextareaField
            label="Full Description"
            required
            error={errors.full_description?.message}
            helperText="Comprehensive service description (100-5000 characters)"
            {...register('full_description')}
          />

          {/* Category & Pricing Model */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField
              label="Category"
              required
              error={errors.category?.message}
              options={[
                { value: 'Physical Security', label: 'Physical Security' },
                { value: 'Electronic Security', label: 'Electronic Security' },
                { value: 'Specialised Services', label: 'Specialised Services' },
                { value: 'Consulting', label: 'Consulting' },
                { value: 'Other', label: 'Other' }
              ]}
              {...register('category')}
            />

            <SelectField
              label="Pricing Model"
              required
              error={errors.pricing_model?.message}
              options={[
                { value: 'Fixed Price', label: 'Fixed Price' },
                { value: 'Hourly Rate', label: 'Hourly Rate' },
                { value: 'Monthly Retainer', label: 'Monthly Retainer' },
                { value: 'Custom Quote', label: 'Custom Quote' },
                { value: 'Contact Us', label: 'Contact Us' }
              ]}
              {...register('pricing_model')}
            />
          </div>

          {/* Pricing Details */}
          <TextareaField
            label="Pricing Details"
            error={errors.pricing_details?.message}
            helperText="Optional additional pricing information (max 500 characters)"
            {...register('pricing_details')}
          />

          {/* Features */}
          <Controller
            name="features"
            control={control}
            render={({ field }) => (
              <FeaturesInput
                label="Features"
                required
                value={field.value}
                onChange={field.onChange}
                error={errors.features?.message}
                helperText="Add key features or benefits of this service"
              />
            )}
          />

          {/* Display Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Display Order"
              type="number"
              min={0}
              error={errors.display_order?.message}
              helperText="Lower numbers appear first (0 is first)"
              {...register('display_order')}
            />

            <SelectField
              label="Status"
              required
              error={errors.status?.message}
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Draft', label: 'Draft' },
                { value: 'Archived', label: 'Archived' }
              ]}
              {...register('status')}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
            <Link href="/admin/services">
              <Button type="button" variant="ghost" size="lg">
                Cancel
              </Button>
            </Link>
            <Button type="submit" variant="primary" size="lg" isLoading={submitting}>
              Update Service
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
