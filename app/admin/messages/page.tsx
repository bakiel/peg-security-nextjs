'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DataTable, { Column } from '@/components/admin/DataTable'
import {
  MessageSquare,
  Mail,
  Phone,
  Clock,
  X,
  CheckCircle,
  AlertCircle,
  Eye
} from 'lucide-react'

interface ContactSubmission {
  id: string
  Name: string
  Email: string
  Phone: string
  'Service Type': string
  Message: string
  'Preferred Contact': string
  Status: 'New' | 'Read' | 'Responded'
  'Submitted At': string
  Notes?: string
}

export default function MessagesPage() {
  const router = useRouter()
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [updating, setUpdating] = useState(false)

  // Fetch contacts from API
  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/admin/contacts')

      if (!response.ok) {
        throw new Error('Failed to fetch contacts')
      }

      const data = await response.json()
      setContacts(data.data || [])
    } catch (err) {
      console.error('Error fetching contacts:', err)
      setError(err instanceof Error ? err.message : 'Failed to load contacts')
    } finally {
      setLoading(false)
    }
  }

  const updateContactStatus = async (id: string, status: string, notes?: string) => {
    try {
      setUpdating(true)

      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, notes })
      })

      if (!response.ok) {
        throw new Error('Failed to update contact')
      }

      // Refresh contacts list
      await fetchContacts()

      // Close modal
      setIsModalOpen(false)
      setSelectedContact(null)
    } catch (err) {
      console.error('Error updating contact:', err)
      alert('Failed to update contact. Please try again.')
    } finally {
      setUpdating(false)
    }
  }

  const openModal = (contact: ContactSubmission) => {
    setSelectedContact(contact)
    setIsModalOpen(true)

    // Auto-mark as Read if it's New
    if (contact.Status === 'New') {
      updateContactStatus(contact.id, 'Read')
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      New: 'bg-blue-100 text-blue-800',
      Read: 'bg-yellow-100 text-yellow-800',
      Responded: 'bg-green-100 text-green-800'
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles]}`}>
        {status}
      </span>
    )
  }

  const columns: Column<ContactSubmission>[] = [
    {
      key: 'Name',
      label: 'Name',
      sortable: true,
      width: 'w-48'
    },
    {
      key: 'Email',
      label: 'Email',
      sortable: true,
      width: 'w-64',
      render: (contact) => (
        <a
          href={`mailto:${contact.Email}`}
          className="text-[#D0B96D] hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {contact.Email}
        </a>
      )
    },
    {
      key: 'Service Type',
      label: 'Service',
      sortable: true,
      width: 'w-48'
    },
    {
      key: 'Status',
      label: 'Status',
      sortable: true,
      width: 'w-32',
      render: (contact) => getStatusBadge(contact.Status)
    },
    {
      key: 'Submitted At',
      label: 'Submitted',
      sortable: true,
      width: 'w-40',
      render: (contact) => new Date(contact['Submitted At']).toLocaleDateString()
    }
  ]

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
            <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Messages</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={fetchContacts}
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
                <MessageSquare className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
                <p className="text-gray-600 mt-1">Manage customer enquiries and submissions</p>
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
          data={contacts}
          columns={columns}
          searchKeys={['Name', 'Email', 'Phone']}
          filterOptions={[
            {
              key: 'Status',
              label: 'Filter by Status',
              options: [
                { value: 'New', label: 'New' },
                { value: 'Read', label: 'Read' },
                { value: 'Responded', label: 'Responded' }
              ]
            }
          ]}
          onRowClick={openModal}
          actions={(contact) => (
            <button
              onClick={(e) => {
                e.stopPropagation()
                openModal(contact)
              }}
              className="p-2 text-[#D0B96D] hover:bg-[#D0B96D] hover:text-white rounded-lg transition-colors"
            >
              <Eye size={18} />
            </button>
          )}
          emptyMessage="No contact submissions found"
          loading={loading}
          pageSize={15}
        />
      </div>

      {/* Details Modal */}
      {isModalOpen && selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[#292B2B] to-[#1a1b1b] px-6 py-4 flex items-center justify-between border-b-4 border-[#D0B96D]">
              <h2 className="text-xl font-bold text-white">Contact Details</h2>
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setSelectedContact(null)
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="text-white" size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                {getStatusBadge(selectedContact.Status)}
                <span className="text-sm text-gray-500">
                  <Clock className="inline mr-1" size={14} />
                  {new Date(selectedContact['Submitted At']).toLocaleString()}
                </span>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                  <p className="text-gray-900">{selectedContact.Name}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Service Type</label>
                  <p className="text-gray-900">{selectedContact['Service Type']}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <a
                    href={`mailto:${selectedContact.Email}`}
                    className="text-[#D0B96D] hover:underline flex items-center gap-2"
                  >
                    <Mail size={16} />
                    {selectedContact.Email}
                  </a>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                  <a
                    href={`tel:${selectedContact.Phone}`}
                    className="text-[#D0B96D] hover:underline flex items-center gap-2"
                  >
                    <Phone size={16} />
                    {selectedContact.Phone}
                  </a>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Preferred Contact</label>
                  <p className="text-gray-900">{selectedContact['Preferred Contact']}</p>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedContact.Message}</p>
                </div>
              </div>

              {/* Notes */}
              {selectedContact.Notes && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Notes</label>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedContact.Notes}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => updateContactStatus(selectedContact.id, 'Read')}
                  disabled={selectedContact.Status === 'Read' || updating}
                  className="flex-1 px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
                >
                  {selectedContact.Status === 'Read' ? '✓ Marked as Read' : 'Mark as Read'}
                </button>
                <button
                  onClick={() => {
                    const notes = prompt('Add notes about this contact:')
                    if (notes !== null) {
                      updateContactStatus(selectedContact.id, 'Responded', notes)
                    }
                  }}
                  disabled={updating}
                  className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
                >
                  <CheckCircle className="inline mr-2" size={18} />
                  Mark as Responded
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
