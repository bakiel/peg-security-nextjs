'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DataTable, { Column } from '@/components/admin/DataTable'
import {
  Briefcase,
  Mail,
  Phone,
  Clock,
  X,
  FileText,
  AlertCircle,
  Eye,
  Download,
  CheckCircle,
  Shield
} from 'lucide-react'

interface JobApplication {
  id: string
  'Job ID': string
  'Job Title': string
  'Applicant Name': string
  'Applicant Email': string
  'Applicant Phone': string
  'CV URL': string
  'CV Public ID': string
  'Cover Letter': string
  'PSIRA Registered': boolean
  'PSIRA Number'?: string
  'Years Experience': number
  Status: 'New' | 'Reviewing' | 'Interviewed' | 'Hired' | 'Rejected'
  'Submitted At': string
  Notes?: string
}

export default function ApplicationsPage() {
  const router = useRouter()
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [updating, setUpdating] = useState(false)

  // Fetch applications from API
  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/admin/applications')

      if (!response.ok) {
        throw new Error('Failed to fetch applications')
      }

      const data = await response.json()
      setApplications(data.data || [])
    } catch (err) {
      console.error('Error fetching applications:', err)
      setError(err instanceof Error ? err.message : 'Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  const updateApplicationStatus = async (id: string, status: string, notes?: string) => {
    try {
      setUpdating(true)

      const response = await fetch(`/api/admin/applications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, notes })
      })

      if (!response.ok) {
        throw new Error('Failed to update application')
      }

      // Refresh applications list
      await fetchApplications()

      // Close modal
      setIsModalOpen(false)
      setSelectedApplication(null)
    } catch (err) {
      console.error('Error updating application:', err)
      alert('Failed to update application. Please try again.')
    } finally {
      setUpdating(false)
    }
  }

  const openModal = (application: JobApplication) => {
    setSelectedApplication(application)
    setIsModalOpen(true)

    // Auto-mark as Reviewing if it's New
    if (application.Status === 'New') {
      updateApplicationStatus(application.id, 'Reviewing')
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      New: 'bg-blue-100 text-blue-800',
      Reviewing: 'bg-yellow-100 text-yellow-800',
      Interviewed: 'bg-purple-100 text-purple-800',
      Hired: 'bg-green-100 text-green-800',
      Rejected: 'bg-red-100 text-red-800'
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles]}`}>
        {status}
      </span>
    )
  }

  const columns: Column<JobApplication>[] = [
    {
      key: 'Applicant Name',
      label: 'Applicant',
      sortable: true,
      width: 'w-48'
    },
    {
      key: 'Job Title',
      label: 'Position',
      sortable: true,
      width: 'w-64',
      render: (app) => (
        <span className="font-medium text-gray-900">{app['Job Title']}</span>
      )
    },
    {
      key: 'Years Experience',
      label: 'Experience',
      sortable: true,
      width: 'w-32',
      render: (app) => `${app['Years Experience']} years`
    },
    {
      key: 'PSIRA Registered',
      label: 'PSIRA',
      width: 'w-24',
      render: (app) => app['PSIRA Registered'] ? (
        <Shield className="text-green-600" size={20} />
      ) : (
        <span className="text-gray-400 text-xs">No</span>
      )
    },
    {
      key: 'Status',
      label: 'Status',
      sortable: true,
      width: 'w-36',
      render: (app) => getStatusBadge(app.Status)
    },
    {
      key: 'Submitted At',
      label: 'Submitted',
      sortable: true,
      width: 'w-40',
      render: (app) => new Date(app['Submitted At']).toLocaleDateString()
    }
  ]

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
            <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Applications</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={fetchApplications}
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
                <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
                <p className="text-gray-600 mt-1">Review and manage candidate applications</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DataTable
          data={applications}
          columns={columns}
          searchKeys={['Applicant Name', 'Applicant Email', 'Job Title']}
          filterOptions={[
            {
              key: 'Status',
              label: 'Filter by Status',
              options: [
                { value: 'New', label: 'New' },
                { value: 'Reviewing', label: 'Reviewing' },
                { value: 'Interviewed', label: 'Interviewed' },
                { value: 'Hired', label: 'Hired' },
                { value: 'Rejected', label: 'Rejected' }
              ]
            }
          ]}
          onRowClick={openModal}
          actions={(app) => (
            <button
              onClick={(e) => {
                e.stopPropagation()
                openModal(app)
              }}
              className="p-2 text-[#D0B96D] hover:bg-[#D0B96D] hover:text-white rounded-lg transition-colors"
            >
              <Eye size={18} />
            </button>
          )}
          emptyMessage="No job applications found"
          loading={loading}
          pageSize={15}
        />
      </div>

      {/* Details Modal */}
      {isModalOpen && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[#292B2B] to-[#1a1b1b] px-6 py-4 flex items-center justify-between border-b-4 border-[#D0B96D]">
              <h2 className="text-xl font-bold text-white">Application Details</h2>
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setSelectedApplication(null)
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="text-white" size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Status & Submitted Date */}
              <div className="flex items-center justify-between">
                {getStatusBadge(selectedApplication.Status)}
                <span className="text-sm text-gray-500">
                  <Clock className="inline mr-1" size={14} />
                  {new Date(selectedApplication['Submitted At']).toLocaleString()}
                </span>
              </div>

              {/* Job Info */}
              <div className="bg-gradient-to-r from-[#D0B96D]/10 to-[#C0A95D]/10 rounded-lg p-4 border-l-4 border-[#D0B96D]">
                <h3 className="font-bold text-gray-900 text-lg">{selectedApplication['Job Title']}</h3>
                <p className="text-sm text-gray-600 mt-1">Job ID: {selectedApplication['Job ID']}</p>
              </div>

              {/* Applicant Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                  <p className="text-gray-900">{selectedApplication['Applicant Name']}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Years of Experience</label>
                  <p className="text-gray-900">{selectedApplication['Years Experience']} years</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <a
                    href={`mailto:${selectedApplication['Applicant Email']}`}
                    className="text-[#D0B96D] hover:underline flex items-center gap-2"
                  >
                    <Mail size={16} />
                    {selectedApplication['Applicant Email']}
                  </a>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                  <a
                    href={`tel:${selectedApplication['Applicant Phone']}`}
                    className="text-[#D0B96D] hover:underline flex items-center gap-2"
                  >
                    <Phone size={16} />
                    {selectedApplication['Applicant Phone']}
                  </a>
                </div>
              </div>

              {/* PSIRA Registration */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className={selectedApplication['PSIRA Registered'] ? 'text-green-600' : 'text-gray-400'} size={20} />
                  <h4 className="font-semibold text-gray-900">PSIRA Registration</h4>
                </div>
                {selectedApplication['PSIRA Registered'] ? (
                  <div>
                    <p className="text-green-700 font-medium">✓ Registered</p>
                    {selectedApplication['PSIRA Number'] && (
                      <p className="text-sm text-gray-700 mt-1">
                        Number: <span className="font-mono">{selectedApplication['PSIRA Number']}</span>
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600">Not registered</p>
                )}
              </div>

              {/* CV Download */}
              {selectedApplication['CV URL'] && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Curriculum Vitae</label>
                  <a
                    href={selectedApplication['CV URL']}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                  >
                    <FileText className="text-[#D0B96D]" size={24} />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Download CV</p>
                      <p className="text-xs text-gray-500">{selectedApplication['CV Public ID']}</p>
                    </div>
                    <Download className="text-gray-400" size={20} />
                  </a>
                </div>
              )}

              {/* Cover Letter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Letter</label>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-h-64 overflow-y-auto">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedApplication['Cover Letter']}</p>
                </div>
              </div>

              {/* Admin Notes */}
              {selectedApplication.Notes && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Notes</label>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedApplication.Notes}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => updateApplicationStatus(selectedApplication.id, 'Reviewing')}
                  disabled={selectedApplication.Status === 'Reviewing' || updating}
                  className="px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm transition-colors"
                >
                  Review
                </button>
                <button
                  onClick={() => updateApplicationStatus(selectedApplication.id, 'Interviewed')}
                  disabled={updating}
                  className="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm transition-colors"
                >
                  Interview
                </button>
                <button
                  onClick={() => {
                    const notes = prompt('Add notes about hiring this candidate:')
                    if (notes !== null) {
                      updateApplicationStatus(selectedApplication.id, 'Hired', notes)
                    }
                  }}
                  disabled={updating}
                  className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm transition-colors"
                >
                  <CheckCircle className="inline mr-1" size={16} />
                  Hire
                </button>
                <button
                  onClick={() => {
                    const notes = prompt('Reason for rejection (optional):')
                    if (notes !== null) {
                      updateApplicationStatus(selectedApplication.id, 'Rejected', notes || 'Not a suitable candidate')
                    }
                  }}
                  disabled={updating}
                  className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
