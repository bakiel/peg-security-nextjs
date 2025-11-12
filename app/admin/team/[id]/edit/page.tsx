'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Button from '@/components/admin/Button'
import { FormField, TextareaField, SelectField } from '@/components/admin/FormField'
import FileUpload from '@/components/admin/FileUpload'

const teamMemberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  position: z.string().min(2, 'Position must be at least 2 characters').max(100),
  bio: z.string().min(50, 'Bio must be at least 50 characters').max(1000),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().min(10, 'Phone must be at least 10 characters').max(20).optional().or(z.literal('')),
  linkedin_url: z.string().url('LinkedIn URL must be a valid URL').optional().or(z.literal('')),
  display_order: z.coerce.number().int().min(0).optional(),
  status: z.enum(['Active', 'Inactive'])
})

type TeamMemberFormData = z.infer<typeof teamMemberSchema>

interface TeamMember {
  id: string
  name: string
  position: string
  bio: string
  photo_url: string
  photo_public_id: string
  email: string | null
  phone: string | null
  linkedin_url: string | null
  status: 'Active' | 'Inactive'
  display_order: number
}

export default function EditTeamMemberPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [teamMember, setTeamMember] = useState<TeamMember | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoError, setPhotoError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<TeamMemberFormData>({
    resolver: zodResolver(teamMemberSchema)
  })

  useEffect(() => {
    fetchTeamMember()
  }, [params.id])

  const fetchTeamMember = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/team/${params.id}`)
      const result = await response.json()

      if (result.success) {
        setTeamMember(result.data)
        reset({
          name: result.data.name,
          position: result.data.position,
          bio: result.data.bio,
          email: result.data.email || '',
          phone: result.data.phone || '',
          linkedin_url: result.data.linkedin_url || '',
          display_order: result.data.display_order,
          status: result.data.status
        })
      } else {
        console.error('Failed to fetch team member:', result.error)
        alert('Failed to load team member')
        router.push('/admin/team')
      }
    } catch (error) {
      console.error('Error fetching team member:', error)
      alert('Failed to load team member')
      router.push('/admin/team')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: TeamMemberFormData) => {
    try {
      setSubmitting(true)
      setPhotoError('')

      let photoUrl = teamMember?.photo_url
      let photoPublicId = teamMember?.photo_public_id

      // Upload new photo if selected
      if (photoFile) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', photoFile)
        uploadFormData.append('bucket', 'team')

        const uploadResponse = await fetch('/api/admin/upload', {
          method: 'POST',
          body: uploadFormData
        })

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload photo')
        }

        const uploadResult = await uploadResponse.json()
        photoUrl = uploadResult.url
        photoPublicId = uploadResult.path
      }

      // Update team member
      const teamMemberData = {
        name: data.name,
        position: data.position,
        bio: data.bio,
        photo_url: photoUrl,
        photo_public_id: photoPublicId,
        email: data.email || null,
        phone: data.phone || null,
        linkedin_url: data.linkedin_url || null,
        display_order: data.display_order || 0,
        status: data.status
      }

      const response = await fetch(`/api/admin/team/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamMemberData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.details || 'Failed to update team member')
      }

      router.push('/admin/team')
    } catch (error) {
      console.error('Error updating team member:', error)
      alert(error instanceof Error ? error.message : 'Failed to update team member')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#D0B96D] border-t-transparent mb-4" />
          <p className="text-gray-600 font-sans">Loading team member...</p>
        </div>
      </div>
    )
  }

  if (!teamMember) {
    return null
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/team"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 font-sans font-semibold"
        >
          <ArrowLeft size={20} />
          Back to Team
        </Link>
        <h1 className="text-3xl font-sans font-bold text-gray-900 mb-2">Edit Team Member</h1>
        <p className="text-gray-600 font-sans">Update {teamMember.name}'s profile</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Current Photo & Upload */}
          <div>
            <label className="block mb-2">
              <span className="text-sm font-sans font-semibold text-onyx">Current Photo</span>
            </label>
            <div className="mb-4">
              <img
                src={teamMember.photo_url}
                alt={teamMember.name}
                className="w-48 h-48 object-cover rounded-lg shadow-md"
              />
            </div>
            <FileUpload
              label="Replace Photo"
              accept="image/*"
              onFileSelect={(files) => {
                setPhotoFile(files[0])
                setPhotoError('')
              }}
              error={photoError}
              helperText="Upload a new photo to replace the current one (max 5MB)"
            />
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Name"
              required
              error={errors.name?.message}
              {...register('name')}
            />

            <FormField
              label="Position"
              required
              error={errors.position?.message}
              {...register('position')}
            />
          </div>

          {/* Bio */}
          <TextareaField
            label="Bio"
            required
            error={errors.bio?.message}
            helperText="Write a professional biography (50-1000 characters)"
            {...register('bio')}
          />

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Email"
              type="email"
              error={errors.email?.message}
              helperText="Optional contact email"
              {...register('email')}
            />

            <FormField
              label="Phone"
              type="tel"
              error={errors.phone?.message}
              helperText="Optional contact phone"
              {...register('phone')}
            />
          </div>

          {/* LinkedIn */}
          <FormField
            label="LinkedIn URL"
            type="url"
            error={errors.linkedin_url?.message}
            helperText="Optional LinkedIn profile link"
            {...register('linkedin_url')}
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
                { value: 'Inactive', label: 'Inactive' }
              ]}
              {...register('status')}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
            <Link href="/admin/team">
              <Button type="button" variant="ghost" size="lg">
                Cancel
              </Button>
            </Link>
            <Button type="submit" variant="primary" size="lg" isLoading={submitting}>
              Update Team Member
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
