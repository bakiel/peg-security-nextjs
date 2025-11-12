'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import Button from '@/components/admin/Button'
import { StatusBadge } from '@/components/admin/Badge'
import { ConfirmDialog } from '@/components/admin/Modal'
import DataTable from '@/components/admin/DataTable'

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
  created_at: string
  updated_at: string
}

export default function ServicesManagementPage() {
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Draft' | 'Archived'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const categories = ['Physical Security', 'Electronic Security', 'Specialised Services', 'Consulting', 'Other']

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/services')
      const result = await response.json()

      if (result.success) {
        setServices(result.data)
      } else {
        console.error('Failed to fetch services:', result.error)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      setDeleting(true)
      const response = await fetch(`/api/admin/services/${deleteId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setServices(services.filter(service => service.id !== deleteId))
        setDeleteId(null)
      } else {
        console.error('Failed to delete service')
      }
    } catch (error) {
      console.error('Error deleting service:', error)
    } finally {
      setDeleting(false)
    }
  }

  const filteredServices = services.filter(service => {
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter
    return matchesStatus && matchesCategory
  })

  const columns = [
    {
      key: 'title',
      header: 'Title',
      render: (service: Service) => (
        <div>
          <p className="font-sans font-semibold text-onyx">{service.title}</p>
          <p className="text-xs text-grey-medium font-sans">{service.slug}</p>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Category',
      render: (service: Service) => (
        <span className="text-sm font-sans text-grey-medium">{service.category}</span>
      )
    },
    {
      key: 'pricing_model',
      header: 'Pricing',
      render: (service: Service) => (
        <span className="text-sm font-sans text-grey-medium">{service.pricing_model}</span>
      )
    },
    {
      key: 'features',
      header: 'Features',
      render: (service: Service) => (
        <span className="text-sm font-sans text-grey-medium">{service.features.length} features</span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (service: Service) => <StatusBadge status={service.status} />
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (service: Service) => (
        <div className="flex items-centre gap-2">
          <Link href={`/admin/services/${service.id}/edit`}>
            <Button variant="secondary" size="sm">
              <Edit size={16} />
            </Button>
          </Link>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setDeleteId(service.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      )
    }
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-sans font-bold text-onyx mb-2">Services Management</h1>
          <p className="text-grey-medium font-sans">Manage your security services and offerings</p>
        </div>
        <Link href="/admin/services/new">
          <Button variant="primary" size="lg">
            <Plus size={20} />
            Add Service
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status Filter */}
          <div>
            <label className="text-sm font-sans font-semibold text-onyx mb-2 block">Status:</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-lg font-sans font-semibold text-sm transition-all ${
                  statusFilter === 'all'
                    ? 'bg-gold text-white shadow-gold'
                    : 'bg-offwhite text-grey-medium hover:bg-gray-200'
                }`}
              >
                All ({services.length})
              </button>
              <button
                onClick={() => setStatusFilter('Active')}
                className={`px-4 py-2 rounded-lg font-sans font-semibold text-sm transition-all ${
                  statusFilter === 'Active'
                    ? 'bg-gold text-white shadow-gold'
                    : 'bg-offwhite text-grey-medium hover:bg-gray-200'
                }`}
              >
                Active ({services.filter(s => s.status === 'Active').length})
              </button>
              <button
                onClick={() => setStatusFilter('Draft')}
                className={`px-4 py-2 rounded-lg font-sans font-semibold text-sm transition-all ${
                  statusFilter === 'Draft'
                    ? 'bg-gold text-white shadow-gold'
                    : 'bg-offwhite text-grey-medium hover:bg-gray-200'
                }`}
              >
                Draft ({services.filter(s => s.status === 'Draft').length})
              </button>
              <button
                onClick={() => setStatusFilter('Archived')}
                className={`px-4 py-2 rounded-lg font-sans font-semibold text-sm transition-all ${
                  statusFilter === 'Archived'
                    ? 'bg-gold text-white shadow-gold'
                    : 'bg-offwhite text-grey-medium hover:bg-gray-200'
                }`}
              >
                Archived ({services.filter(s => s.status === 'Archived').length})
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-sm font-sans font-semibold text-onyx mb-2 block">Category:</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-sans focus:border-gold focus:ring-2 focus:ring-gold/20 text-onyx bg-white"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Services Table */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-centre">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gold border-t-transparent mb-4" />
          <p className="text-grey-medium font-sans">Loading services...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-centre">
          <p className="text-grey-medium font-sans text-lg mb-4">No services found</p>
          <Link href="/admin/services/new">
            <Button variant="primary" size="md">
              <Plus size={18} />
              Add Your First Service
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <DataTable
            data={filteredServices}
            columns={columns}
            searchPlaceholder="Search services..."
          />
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Service"
        message="Are you sure you want to delete this service? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleting}
      />
    </div>
  )
}
