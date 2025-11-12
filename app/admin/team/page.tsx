'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react'
import Button from '@/components/admin/Button'
import { StatusBadge } from '@/components/admin/Badge'
import { ConfirmDialog } from '@/components/admin/Modal'

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
  created_at: string
  updated_at: string
}

export default function TeamManagementPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Inactive'>('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/team')
      const result = await response.json()

      if (result.success) {
        setTeamMembers(result.data)
      } else {
        console.error('Failed to fetch team members:', result.error)
      }
    } catch (error) {
      console.error('Error fetching team members:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      setDeleting(true)
      const response = await fetch(`/api/admin/team/${deleteId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setTeamMembers(teamMembers.filter(member => member.id !== deleteId))
        setDeleteId(null)
      } else {
        console.error('Failed to delete team member')
      }
    } catch (error) {
      console.error('Error deleting team member:', error)
    } finally {
      setDeleting(false)
    }
  }

  const filteredMembers = teamMembers.filter(member => {
    if (statusFilter === 'all') return true
    return member.status === statusFilter
  })

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-sans font-bold text-onyx mb-2">Team Management</h1>
          <p className="text-grey-medium font-sans">Manage your team members and their profiles</p>
        </div>
        <Link href="/admin/team/new">
          <Button variant="primary" size="lg">
            <Plus size={20} />
            Add Team Member
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-centre gap-4">
          <label className="text-sm font-sans font-semibold text-onyx">Filter by Status:</label>
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg font-sans font-semibold text-sm transition-all ${
                statusFilter === 'all'
                  ? 'bg-gold text-white shadow-gold'
                  : 'bg-offwhite text-grey-medium hover:bg-gray-200'
              }`}
            >
              All ({teamMembers.length})
            </button>
            <button
              onClick={() => setStatusFilter('Active')}
              className={`px-4 py-2 rounded-lg font-sans font-semibold text-sm transition-all ${
                statusFilter === 'Active'
                  ? 'bg-gold text-white shadow-gold'
                  : 'bg-offwhite text-grey-medium hover:bg-gray-200'
              }`}
            >
              Active ({teamMembers.filter(m => m.status === 'Active').length})
            </button>
            <button
              onClick={() => setStatusFilter('Inactive')}
              className={`px-4 py-2 rounded-lg font-sans font-semibold text-sm transition-all ${
                statusFilter === 'Inactive'
                  ? 'bg-gold text-white shadow-gold'
                  : 'bg-offwhite text-grey-medium hover:bg-gray-200'
              }`}
            >
              Inactive ({teamMembers.filter(m => m.status === 'Inactive').length})
            </button>
          </div>
        </div>
      </div>

      {/* Team Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="w-full h-48 bg-gray-200 rounded-lg mb-4" />
              <div className="h-6 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-centre">
          <p className="text-grey-medium font-sans text-lg">No team members found</p>
          <Link href="/admin/team/new">
            <Button variant="primary" size="md" className="mt-4">
              <Plus size={18} />
              Add Your First Team Member
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map(member => (
            <div
              key={member.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
            >
              {/* Photo */}
              <div className="relative h-64 overflow-hidden bg-gray-100">
                <img
                  src={member.photo_url}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <StatusBadge status={member.status} />
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-xl font-sans font-bold text-onyx mb-1">{member.name}</h3>
                <p className="text-gold font-sans font-semibold mb-3">{member.position}</p>
                <p className="text-sm text-grey-medium font-sans line-clamp-2 mb-4">{member.bio}</p>

                {/* Contact Info */}
                {(member.email || member.phone) && (
                  <div className="space-y-1 mb-4 pb-4 border-b border-gray-100">
                    {member.email && (
                      <p className="text-xs text-grey-medium font-sans truncate">{member.email}</p>
                    )}
                    {member.phone && (
                      <p className="text-xs text-grey-medium font-sans">{member.phone}</p>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Link href={`/admin/team/${member.id}/edit`} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full">
                      <Edit size={16} />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeleteId(member.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Team Member"
        message="Are you sure you want to delete this team member? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleting}
      />
    </div>
  )
}
