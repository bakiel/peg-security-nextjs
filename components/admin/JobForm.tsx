'use client'

import { useState, useEffect } from 'react'
import { Plus, X, AlertCircle, Shield } from 'lucide-react'

export interface JobFormData {
  title: string
  category: string
  location: string
  employmentType: string
  psiraRequired: boolean
  description: string
  responsibilities: string[]
  requirements: string[]
  benefits: string[]
  status: 'Draft' | 'Open'
}

interface JobFormProps {
  initialData?: Partial<JobFormData>
  onSubmit: (data: JobFormData) => Promise<void>
  submitLabel?: string
  isLoading?: boolean
}

const CATEGORIES = [
  'Armed Response',
  'CCTV Installation',
  'Access Control',
  'Security Guard',
  'Event Security',
  'VIP Protection',
  'Technical Support',
  'Administration'
]

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract']

export default function JobForm({
  initialData,
  onSubmit,
  submitLabel = 'Create Job',
  isLoading = false
}: JobFormProps) {
  const [formData, setFormData] = useState<JobFormData>({
    title: initialData?.title || '',
    category: initialData?.category || '',
    location: initialData?.location || '',
    employmentType: initialData?.employmentType || '',
    psiraRequired: initialData?.psiraRequired || false,
    description: initialData?.description || '',
    responsibilities: initialData?.responsibilities || ['', '', ''],
    requirements: initialData?.requirements || ['', '', ''],
    benefits: initialData?.benefits || ['', ''],
    status: initialData?.status || 'Draft'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validate title
    if (!formData.title || formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters'
    }

    // Validate category
    if (!formData.category) {
      newErrors.category = 'Please select a category'
    }

    // Validate location
    if (!formData.location || formData.location.trim().length < 3) {
      newErrors.location = 'Location must be at least 3 characters'
    }

    // Validate employment type
    if (!formData.employmentType) {
      newErrors.employmentType = 'Please select an employment type'
    }

    // Validate description
    if (!formData.description || formData.description.trim().length < 50) {
      newErrors.description = 'Description must be at least 50 characters'
    }

    // Validate responsibilities
    const validResponsibilities = formData.responsibilities.filter(r => r.trim().length >= 10)
    if (validResponsibilities.length < 3) {
      newErrors.responsibilities = 'At least 3 responsibilities required (10+ characters each)'
    }

    // Validate requirements
    const validRequirements = formData.requirements.filter(r => r.trim().length >= 10)
    if (validRequirements.length < 3) {
      newErrors.requirements = 'At least 3 requirements required (10+ characters each)'
    }

    // Validate benefits
    const validBenefits = formData.benefits.filter(b => b.trim().length >= 10)
    if (validBenefits.length < 2) {
      newErrors.benefits = 'At least 2 benefits required (10+ characters each)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Filter out empty items
    const cleanedData: JobFormData = {
      ...formData,
      responsibilities: formData.responsibilities.filter(r => r.trim().length > 0),
      requirements: formData.requirements.filter(r => r.trim().length > 0),
      benefits: formData.benefits.filter(b => b.trim().length > 0)
    }

    await onSubmit(cleanedData)
  }

  const addListItem = (field: 'responsibilities' | 'requirements' | 'benefits') => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    })
  }

  const removeListItem = (field: 'responsibilities' | 'requirements' | 'benefits', index: number) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index)
    })
  }

  const updateListItem = (
    field: 'responsibilities' | 'requirements' | 'benefits',
    index: number,
    value: string
  ) => {
    const newItems = [...formData[field]]
    newItems[index] = value
    setFormData({
      ...formData,
      [field]: newItems
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Job Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D0B96D] focus:border-transparent outline-none"
              placeholder="e.g., Security Guard - Night Shift"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.title}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D0B96D] focus:border-transparent outline-none"
            >
              <option value="">Select Category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.category}
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D0B96D] focus:border-transparent outline-none"
              placeholder="e.g., Johannesburg, Gauteng"
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.location}
              </p>
            )}
          </div>

          {/* Employment Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Employment Type *
            </label>
            <select
              value={formData.employmentType}
              onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D0B96D] focus:border-transparent outline-none"
            >
              <option value="">Select Type</option>
              {EMPLOYMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.employmentType && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.employmentType}
              </p>
            )}
          </div>

          {/* PSIRA Required */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.psiraRequired}
                onChange={(e) => setFormData({ ...formData, psiraRequired: e.target.checked })}
                className="w-5 h-5 text-[#D0B96D] border-gray-300 rounded focus:ring-[#D0B96D]"
              />
              <div className="flex items-center gap-2">
                <Shield className="text-[#D0B96D]" size={20} />
                <span className="text-sm font-semibold text-gray-700">PSIRA Registration Required</span>
              </div>
            </label>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Job Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D0B96D] focus:border-transparent outline-none resize-none"
            placeholder="Provide a detailed description of the role..."
          />
          <div className="flex items-center justify-between mt-1">
            {errors.description ? (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.description}
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                {formData.description.length} / 5000 characters
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Responsibilities */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Responsibilities</h2>
          <button
            type="button"
            onClick={() => addListItem('responsibilities')}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-[#D0B96D] text-white rounded-lg hover:bg-[#C0A95D] transition-colors"
          >
            <Plus size={16} />
            Add Item
          </button>
        </div>
        {errors.responsibilities && (
          <p className="mb-3 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.responsibilities}
          </p>
        )}
        <div className="space-y-3">
          {formData.responsibilities.map((resp, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={resp}
                onChange={(e) => updateListItem('responsibilities', index, e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D0B96D] focus:border-transparent outline-none"
                placeholder={`Responsibility ${index + 1}`}
              />
              {formData.responsibilities.length > 3 && (
                <button
                  type="button"
                  onClick={() => removeListItem('responsibilities', index)}
                  className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Requirements */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Requirements</h2>
          <button
            type="button"
            onClick={() => addListItem('requirements')}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-[#D0B96D] text-white rounded-lg hover:bg-[#C0A95D] transition-colors"
          >
            <Plus size={16} />
            Add Item
          </button>
        </div>
        {errors.requirements && (
          <p className="mb-3 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.requirements}
          </p>
        )}
        <div className="space-y-3">
          {formData.requirements.map((req, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={req}
                onChange={(e) => updateListItem('requirements', index, e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D0B96D] focus:border-transparent outline-none"
                placeholder={`Requirement ${index + 1}`}
              />
              {formData.requirements.length > 3 && (
                <button
                  type="button"
                  onClick={() => removeListItem('requirements', index)}
                  className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Benefits</h2>
          <button
            type="button"
            onClick={() => addListItem('benefits')}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-[#D0B96D] text-white rounded-lg hover:bg-[#C0A95D] transition-colors"
          >
            <Plus size={16} />
            Add Item
          </button>
        </div>
        {errors.benefits && (
          <p className="mb-3 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.benefits}
          </p>
        )}
        <div className="space-y-3">
          {formData.benefits.map((benefit, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={benefit}
                onChange={(e) => updateListItem('benefits', index, e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D0B96D] focus:border-transparent outline-none"
                placeholder={`Benefit ${index + 1}`}
              />
              {formData.benefits.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeListItem('benefits', index)}
                  className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Status & Submit */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Draft' | 'Open' })}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D0B96D] focus:border-transparent outline-none"
            >
              <option value="Draft">Draft (Not visible to public)</option>
              <option value="Open">Open (Accepting applications)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-gradient-to-r from-[#D0B96D] to-[#C0A95D] text-white rounded-lg hover:from-[#C0A95D] hover:to-[#B09850] font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : submitLabel}
          </button>
        </div>
      </div>
    </form>
  )
}
