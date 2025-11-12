'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import JobForm, { JobFormData } from '@/components/admin/JobForm'
import { Edit, ArrowLeft, AlertCircle } from 'lucide-react'

interface JobListing {
  id: string
  Title: string
  Category: string
  Location: string
  'Employment Type': string
  'PSIRA Required': boolean
  Description: string
  Responsibilities: string
  Requirements: string
  Benefits: string
  Status: 'Draft' | 'Open' | 'Closed'
}

export default function EditJobPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [job, setJob] = useState<JobListing | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch job data
  useEffect(() => {
    fetchJob()
  }, [params.id])

  const fetchJob = async () => {
    try {
      setIsFetching(true)
      setError(null)

      const response = await fetch('/api/admin/jobs')

      if (!response.ok) {
        throw new Error('Failed to fetch job')
      }

      const data = await response.json()
      const foundJob = data.data.find((j: JobListing) => j.id === params.id)

      if (!foundJob) {
        throw new Error('Job not found')
      }

      setJob(foundJob)
    } catch (err) {
      console.error('Error fetching job:', err)
      setError(err instanceof Error ? err.message : 'Failed to load job')
    } finally {
      setIsFetching(false)
    }
  }

  const handleSubmit = async (data: JobFormData) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/admin/jobs/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.details || result.error || 'Failed to update job')
      }

      // Success - redirect to jobs list
      alert('Job updated successfully!')
      router.push('/admin/jobs')
    } catch (err) {
      console.error('Error updating job:', err)
      setError(err instanceof Error ? err.message : 'Failed to update job')
      alert(`Failed to update job: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Loading state
  if (isFetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#D0B96D] mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
            <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Job</h3>
            <p className="text-red-700 mb-4">{error || 'Job not found'}</p>
            <button
              onClick={() => router.push('/admin/jobs')}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Back to Jobs
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Convert job data to form data
  const initialData: JobFormData = {
    title: job.Title,
    category: job.Category,
    location: job.Location,
    employmentType: job['Employment Type'],
    psiraRequired: job['PSIRA Required'],
    description: job.Description,
    responsibilities: job.Responsibilities.split('\n').filter(r => r.trim().length > 0),
    requirements: job.Requirements.split('\n').filter(r => r.trim().length > 0),
    benefits: job.Benefits.split('\n').filter(b => b.trim().length > 0),
    status: job.Status === 'Closed' ? 'Draft' : job.Status
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#D0B96D] to-[#C0A95D] rounded-xl flex items-center justify-center">
                <Edit className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Job</h1>
                <p className="text-gray-600 mt-1">{job.Title}</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/admin/jobs')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Jobs
            </button>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        <JobForm
          initialData={initialData}
          onSubmit={handleSubmit}
          submitLabel="Update Job"
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
