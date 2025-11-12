'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Image as ImageIcon,
  Upload,
  X,
  Edit,
  Trash2,
  AlertCircle,
  Eye,
  EyeOff,
  Plus,
  Sparkles
} from 'lucide-react'

interface GalleryImage {
  id: string
  title: string
  description: string
  category: string
  image_url: string
  image_public_id: string
  thumbnail_url: string
  status: 'Active' | 'Hidden'
  display_order: number
  created_at: string
  updated_at: string
}

export default function GalleryPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [generatingAI, setGeneratingAI] = useState(false)

  // Upload form state
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: 'Projects',
    status: 'Active' as 'Active' | 'Hidden',
    displayOrder: 0
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')

  const CATEGORIES = [
    'Armed Response',
    'CCTV Installation',
    'Access Control',
    'Security Guard',
    'Event Security',
    'VIP Protection',
    'Projects',
    'Team',
    'Other'
  ]

  // Fetch gallery images
  useEffect(() => {
    fetchImages()
  }, [statusFilter, categoryFilter])

  const fetchImages = async () => {
    try {
      setLoading(true)
      setError(null)

      let url = '/api/admin/gallery'
      const params = new URLSearchParams()
      if (statusFilter) params.append('status', statusFilter)
      if (categoryFilter) params.append('category', categoryFilter)
      if (params.toString()) url += `?${params.toString()}`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Failed to fetch images')
      }

      const data = await response.json()
      setImages(data.data || [])
    } catch (err) {
      console.error('Error fetching images:', err)
      setError(err instanceof Error ? err.message : 'Failed to load images')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }

    setSelectedFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile || !imagePreview) {
      alert('Please select an image')
      return
    }

    try {
      setUploading(true)

      const response = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image: imagePreview,
          title: uploadForm.title,
          description: uploadForm.description,
          category: uploadForm.category,
          status: uploadForm.status,
          displayOrder: uploadForm.displayOrder
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.details || result.error || 'Failed to upload image')
      }

      alert('Image uploaded successfully!')

      // Reset form
      setShowUploadForm(false)
      setUploadForm({
        title: '',
        description: '',
        category: 'Projects',
        status: 'Active',
        displayOrder: 0
      })
      setImagePreview(null)
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''

      // Refresh images
      await fetchImages()
    } catch (err) {
      console.error('Error uploading image:', err)
      alert(`Failed to upload: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (image: GalleryImage) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${image.title}"?\n\nThis will permanently delete the image from storage and cannot be undone.`
    )

    if (!confirmed) return

    try {
      setDeleting(image.id)

      const response = await fetch(`/api/admin/gallery/${image.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete image')
      }

      alert('Image deleted successfully!')
      await fetchImages()
    } catch (err) {
      console.error('Error deleting image:', err)
      alert('Failed to delete image. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  const toggleStatus = async (image: GalleryImage) => {
    try {
      const newStatus = image.status === 'Active' ? 'Hidden' : 'Active'

      const response = await fetch(`/api/admin/gallery/${image.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      await fetchImages()
    } catch (err) {
      console.error('Error updating status:', err)
      alert('Failed to update status. Please try again.')
    }
  }

  const generateAIDescription = async () => {
    if (!imagePreview) {
      alert('Please select an image first')
      return
    }

    try {
      setGeneratingAI(true)

      const response = await fetch('/api/vision/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          imageUrl: imagePreview,
          action: 'gallery'
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.details || result.error || 'Failed to generate description')
      }

      // Auto-fill form with AI-generated content
      setUploadForm({
        ...uploadForm,
        title: result.result.title || '',
        description: result.result.description || '',
        category: result.result.category || 'Projects'
      })

      alert('✨ AI description generated! Review and adjust if needed.')
    } catch (err) {
      console.error('Error generating AI description:', err)
      alert(`AI generation failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setGeneratingAI(false)
    }
  }

  if (error && !showUploadForm) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
            <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Gallery</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={fetchImages}
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
                <ImageIcon className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
                <p className="text-gray-600 mt-1">Upload and manage your image gallery</p>
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
                onClick={() => setShowUploadForm(!showUploadForm)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#D0B96D] to-[#C0A95D] text-white rounded-lg hover:from-[#C0A95D] hover:to-[#B09850] font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                {showUploadForm ? <X size={20} /> : <Plus size={20} />}
                {showUploadForm ? 'Cancel' : 'Upload Image'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Form */}
        {showUploadForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Upload New Image</h2>
            <form onSubmit={handleUpload} className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Image *
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#D0B96D] transition-colors"
                >
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-96 mx-auto rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setImagePreview(null)
                          setSelectedFile(null)
                          if (fileInputRef.current) fileInputRef.current.value = ''
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                      <p className="text-gray-600 font-medium mb-1">Click to upload image</p>
                      <p className="text-sm text-gray-500">PNG, JPG, WEBP up to 5MB</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* AI Generation Button */}
              {imagePreview && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={generateAIDescription}
                    disabled={generatingAI}
                    className="relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#B89F5F] via-[#D0B96D] to-[#E5D17D] text-gray-900 rounded-lg hover:from-[#A68F4F] hover:via-[#C0A95D] hover:to-[#D5C16D] font-semibold transition-all shadow-lg hover:shadow-2xl border-2 border-[#D0B96D]/30 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></span>
                    <Sparkles size={20} className={generatingAI ? 'animate-spin text-[#8B7355]' : 'text-[#8B7355]'} />
                    <span className="relative z-10">{generatingAI ? 'Analyzing with AI...' : '✨ Generate Description with AI'}</span>
                  </button>
                </div>
              )}

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D0B96D] focus:border-transparent outline-none text-gray-900 bg-white"
                    placeholder="e.g., Armed Response Vehicle Installation"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D0B96D] focus:border-transparent outline-none resize-none text-gray-900 bg-white"
                    placeholder="Brief description of the image..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D0B96D] focus:border-transparent outline-none text-gray-900 bg-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    value={uploadForm.status}
                    onChange={(e) => setUploadForm({ ...uploadForm, status: e.target.value as 'Active' | 'Hidden' })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D0B96D] focus:border-transparent outline-none text-gray-900 bg-white"
                  >
                    <option value="Active">Active (Visible on website)</option>
                    <option value="Hidden">Hidden (Not visible)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={uploadForm.displayOrder}
                    onChange={(e) => setUploadForm({ ...uploadForm, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D0B96D] focus:border-transparent outline-none text-gray-900 bg-white"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={uploading || !selectedFile}
                  className="px-8 py-3 bg-gradient-to-r from-[#D0B96D] to-[#C0A95D] text-white rounded-lg hover:from-[#C0A95D] hover:to-[#B09850] font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D0B96D] focus:border-transparent outline-none text-gray-900 bg-white"
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Hidden">Hidden</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Filter by Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D0B96D] focus:border-transparent outline-none text-gray-900 bg-white"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {(statusFilter || categoryFilter) && (
              <button
                onClick={() => {
                  setStatusFilter('')
                  setCategoryFilter('')
                }}
                className="mt-6 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                Clear Filters
              </button>
            )}

            <div className="ml-auto mt-6">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{images.length}</span> images
              </p>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#D0B96D] mb-4"></div>
            <p className="text-gray-600">Loading gallery...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <ImageIcon className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Images Yet</h3>
            <p className="text-gray-600 mb-6">Upload your first image to get started</p>
            <button
              onClick={() => setShowUploadForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-[#D0B96D] to-[#C0A95D] text-white rounded-lg hover:from-[#C0A95D] hover:to-[#B09850] font-semibold transition-all"
            >
              Upload Image
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((image) => (
              <div
                key={image.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <div className="relative aspect-video bg-gray-100">
                  <img
                    src={image.thumbnail_url || image.image_url}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                  {image.status === 'Hidden' && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded">
                      Hidden
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                    {image.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {image.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {image.category}
                  </p>
                </div>

                {/* Actions */}
                <div className="px-4 pb-4 flex items-center gap-2">
                  <button
                    onClick={() => toggleStatus(image)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition-colors"
                    title={image.status === 'Active' ? 'Hide' : 'Show'}
                  >
                    {image.status === 'Active' ? (
                      <>
                        <EyeOff size={16} />
                        Hide
                      </>
                    ) : (
                      <>
                        <Eye size={16} />
                        Show
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(image)}
                    disabled={deleting === image.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
