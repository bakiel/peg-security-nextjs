'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DataTable, { Column } from '@/components/admin/DataTable'
import {
  Briefcase,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  MapPin,
  Clock,
  Users,
  Shield
} from 'lucide-react'

interface JobListing {
  id: string
  Title: string
  Slug: string
  Category: string
  Location: string
  'Employment Type': string
  'PSIRA Required': boolean
  Description: string
  Responsibilities: string
  Requirements: string
  Benefits: string
  Status: 'Draft' | 'Open' | 'Closed'
  'Created At': string
  'Updated At': string
  'Application Count'?: number
}

export default function JobsPage() {
  const router = useRouter()
  const [jobs, setJobs] = useState<JobListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  // Fetch jobs from API
  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/admin/jobs')

      if (!response.ok) {
        throw new Error('Failed to fetch jobs')
      }

      const data = await response.json()
      setJobs(data.data || [])
    } catch (err) {
      console.error('Error fetching jobs:', err)
      setError(err instanceof Error ? err.message : 'Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (job: JobListing) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the job "${job.Title}"?\n\nThis action cannot be undone.`
    )

    if (!confirmed) return

    try {
      setDeleting(job.id)

      const response = await fetch(`/api/admin/jobs/${job.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete job')
      }

      // Refresh jobs list
      await fetchJobs()
    } catch (err) {
      console.error('Error deleting job:', err)
      alert('Failed to delete job. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      Draft: 'bg-gray-100 text-gray-800',
      Open: 'bg-green-100 text-green-800',
      Closed: 'bg-red-100 text-red-800'
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles]}`}>
        {status}
      </span>
    )
  }

  const columns: Column<JobListing>[] = [
    {
      key: 'Title',
      label: 'Job Title',
      sortable: true,
      width: 'w-64',
      render: (job) => (
        <div>
          <p className="font-semibold text-gray-900">{job.Title}</p>
          <p className="text-xs text-gray-500">{job.Category}</p>
        </div>
      )
    },
    {
      key: 'Location',
      label: 'Location',
      sortable: true,
      width: 'w-40',
      render: (job) => (
        <span className="flex items-center gap-1 text-sm text-gray-600">
          <MapPin size={14} />
          {job.Location}
        </span>
      )
    },
    {
      key: 'Employment Type',
      label: 'Type',
      sortable: true,
      width: 'w-32'
    },
    {
      key: 'PSIRA Required',
      label: 'PSIRA',
      width: 'w-24',
      render: (job) => job['PSIRA Required'] ? (
        <Shield className="text-green-600" size={20} />
      ) : (
        <span className="text-gray-400 text-xs">No</span>
      )
    },
    {
      key: 'Application Count',
      label: 'Applications',
      sortable: true,
      width: 'w-32',
      render: (job) => (
        <span className="flex items-center gap-1 text-sm">
          <Users size={14} />
          {job['Application Count'] || 0}
        </span>
      )
    },
    {
      key: 'Status',
      label: 'Status',
      sortable: true,
      width: 'w-32',
      render: (job) => getStatusBadge(job.Status)
    },
    {
      key: 'Created At',
      label: 'Created',
      sortable: true,
      width: 'w-40',
      render: (job) => (
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <Clock size={12} />
          {new Date(job['Created At']).toLocaleDateString()}
        </span>
      )
    }
  ]

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
            <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Jobs</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={fetchJobs}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#D0B96D] to-[#C0A95D] rounded-xl flex items-center justify-center">
                <Briefcase className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Job Listings</h1>
                <p className="text-gray-600 mt-1">Create and manage career opportunities</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => router.push('/admin/jobs/new')}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#D0B96D] to-[#C0A95D] text-white rounded-lg hover:from-[#C0A95D] hover:to-[#B09850] font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                <Plus size={20} />
                Create Job
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DataTable
          data={jobs}
          columns={columns}
          searchKeys={['Title', 'Category', 'Location']}
          filterOptions={[
            {
              key: 'Status',
              label: 'Filter by Status',
              options: [
                { value: 'Draft', label: 'Draft' },
                { value: 'Open', label: 'Open' },
                { value: 'Closed', label: 'Closed' }
              ]
            },
            {
              key: 'Category',
              label: 'Filter by Category',
              options: [
                { value: 'Armed Response', label: 'Armed Response' },
                { value: 'CCTV Installation', label: 'CCTV Installation' },
                { value: 'Access Control', label: 'Access Control' },
                { value: 'Security Guard', label: 'Security Guard' },
                { value: 'Event Security', label: 'Event Security' },
                { value: 'VIP Protection', label: 'VIP Protection' },
                { value: 'Technical Support', label: 'Technical Support' },
                { value: 'Administration', label: 'Administration' }
              ]
            }
          ]}
          actions={(job) => (
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(`/admin/jobs/${job.id}/edit`)
                }}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit job"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(job)
                }}
                disabled={deleting === job.id}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete job"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
          emptyMessage="No job listings found. Create your first job to get started!"
          loading={loading}
          pageSize={15}
        />
      </div>
    </div>
  )
}
