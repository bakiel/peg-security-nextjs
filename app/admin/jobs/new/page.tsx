'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import JobForm, { JobFormData } from '@/components/admin/JobForm'
import { Plus, ArrowLeft } from 'lucide-react'

export default function NewJobPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: JobFormData) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/admin/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.details || result.error || 'Failed to create job')
      }

      // Success - redirect to jobs list
      alert('Job created successfully!')
      router.push('/admin/jobs')
    } catch (err) {
      console.error('Error creating job:', err)
      setError(err instanceof Error ? err.message : 'Failed to create job')
      alert(`Failed to create job: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#D0B96D] to-[#C0A95D] rounded-xl flex items-center justify-center">
                <Plus className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Create New Job</h1>
                <p className="text-gray-600 mt-1">Add a new job listing to your careers page</p>
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
          onSubmit={handleSubmit}
          submitLabel="Create Job"
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
