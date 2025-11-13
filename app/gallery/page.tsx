'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import MobileMenu from '@/components/layout/MobileMenu'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import { Image as ImageIcon, Shield, Users, MonitorPlay, Calendar, Heart, ChevronLeft, ChevronRight, Camera } from 'lucide-react'

// Gallery item type definition (from API)
interface GalleryItem {
  id: string
  title: string
  category: string
  description: string
  imageUrl: string
  thumbnailUrl?: string
  aspectRatio: 'landscape' | 'portrait' | 'square'
  featured: boolean
}

// Category configuration
const categories = [
  { id: 'all', label: 'All Gallery', icon: <ImageIcon size={16} /> },
  { id: 'operations', label: 'Operations', icon: <Shield size={16} /> },
  { id: 'training', label: 'Training', icon: <Users size={16} /> },
  { id: 'technology', label: 'Technology', icon: <MonitorPlay size={16} /> },
  { id: 'events', label: 'Events', icon: <Calendar size={16} /> },
  { id: 'community', label: 'Community', icon: <Heart size={16} /> }
] as const

export default function GalleryPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch gallery items from API
  useEffect(() => {
    async function fetchGallery() {
      try {
        const response = await fetch('/api/gallery')
        const result = await response.json()

        if (result.success) {
          setGalleryItems(result.data)
        }
      } catch (error) {
        console.error('Failed to fetch gallery:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGallery()
  }, [])

  // Filter gallery items based on selected category
  const filteredItems = selectedCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory)

  // Handle image click to open lightbox
  const handleImageClick = (item: GalleryItem) => {
    setSelectedImage(item)
    setIsLightboxOpen(true)
  }

  // Navigate to next image in lightbox
  const handleNextImage = () => {
    if (!selectedImage) return
    const currentIndex = filteredItems.findIndex(item => item.id === selectedImage.id)
    const nextIndex = (currentIndex + 1) % filteredItems.length
    setSelectedImage(filteredItems[nextIndex])
  }

  // Navigate to previous image in lightbox
  const handlePreviousImage = () => {
    if (!selectedImage) return
    const currentIndex = filteredItems.findIndex(item => item.id === selectedImage.id)
    const previousIndex = currentIndex === 0 ? filteredItems.length - 1 : currentIndex - 1
    setSelectedImage(filteredItems[previousIndex])
  }

  // Close lightbox
  const handleCloseLightbox = () => {
    setIsLightboxOpen(false)
    setTimeout(() => setSelectedImage(null), 300)
  }

  return (
    <main className="min-h-screen bg-gradient-dark">
      {/* Navigation */}
      <Navigation onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Hero Section */}
      <section className="relative pt-hero-top pb-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/Security_camera_in_a_building.jpg"
            alt="Professional security surveillance technology"
            fill
            className="object-cover object-top"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-onyx/90 via-onyx/80 to-onyx/90" />
        </div>
        <div className="container-peg relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="default" size="md" className="mb-6">
              <Camera size={16} />
              Media Gallery
            </Badge>
            <h1 className="font-display text-hero-title font-black text-white leading-hero mb-6">
              Professional Excellence in{' '}
              <span className="text-gold">Action</span>
            </h1>
            <p className="text-lg text-white/80 leading-body max-w-3xl mx-auto">
              Explore our comprehensive gallery showcasing professional security operations, advanced technology deployments,
              training initiatives, and community engagement programmes across South Africa.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="section-padding bg-onyx/30">
        <div className="container-peg">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                  font-semibold text-sm uppercase tracking-nav
                  transition-all duration-300
                  ${selectedCategory === category.id
                    ? 'bg-gold text-onyx shadow-gold scale-105'
                    : 'bg-onyx/50 text-white border border-gold/30 hover:bg-gold/10 hover:border-gold/50'
                  }
                `}
              >
                {category.icon}
                {category.label}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin w-12 h-12 border-4 border-gold/30 border-t-gold rounded-full mb-4" />
              <p className="text-white/60">Loading gallery...</p>
            </div>
          )}

          {/* Gallery Grid */}
          {!loading && filteredItems.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <GalleryCard
                    key={item.id}
                    item={item}
                    onClick={() => handleImageClick(item)}
                  />
                ))}
              </div>

              {/* Item Count */}
              <div className="text-center mt-12">
                <p className="text-white/60 text-sm uppercase tracking-nav">
                  Showing {filteredItems.length} of {galleryItems.length} items
                </p>
              </div>
            </>
          )}

          {/* No Results Message */}
          {!loading && filteredItems.length === 0 && (
            <div className="text-center py-20">
              <ImageIcon size={64} className="text-gold/30 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No Items Found</h3>
              <p className="text-white/60">
                {galleryItems.length === 0
                  ? 'Gallery items will appear here once added'
                  : 'Try selecting a different category'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <Modal
        isOpen={isLightboxOpen}
        onClose={handleCloseLightbox}
        size="full"
        showCloseButton={true}
        closeOnOverlayClick={true}
        className="bg-black/95"
      >
        {selectedImage && (
          <div className="relative min-h-[80vh] flex items-center justify-center p-6">
            {/* Image Container */}
            <div className="relative max-w-6xl w-full">
              {/* Image Display */}
              <div className={`
                relative rounded-card overflow-hidden
                border-2 border-gold/30
                ${selectedImage.aspectRatio === 'portrait' ? 'aspect-[3/4]' :
                  selectedImage.aspectRatio === 'square' ? 'aspect-square' :
                  'aspect-video'}
              `}>
                <Image
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />

                {/* Image Info Overlay - Bottom */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-onyx via-onyx/95 to-transparent p-8">
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {selectedImage.title}
                  </h3>
                  <p className="text-white/80 text-base leading-relaxed mb-4">
                    {selectedImage.description}
                  </p>
                  <Badge variant="default" size="md">
                    {categories.find(cat => cat.id === selectedImage.category)?.icon}
                    {categories.find(cat => cat.id === selectedImage.category)?.label}
                  </Badge>
                </div>
              </div>

              {/* Navigation Arrows */}
              {filteredItems.length > 1 && (
                <>
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full
                      bg-onyx/80 border border-gold/30 text-gold
                      hover:bg-gold hover:text-onyx hover:scale-110
                      transition-all duration-300 backdrop-blur-sm"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full
                      bg-onyx/80 border border-gold/30 text-gold
                      hover:bg-gold hover:text-onyx hover:scale-110
                      transition-all duration-300 backdrop-blur-sm"
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            {/* Image Counter */}
            {filteredItems.length > 1 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <div className="bg-onyx/80 backdrop-blur-sm border border-gold/30 rounded-full px-6 py-2">
                  <p className="text-white text-sm font-semibold">
                    {filteredItems.findIndex(item => item.id === selectedImage.id) + 1} / {filteredItems.length}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Footer */}
      <Footer />
    </main>
  )
}

// Gallery Card Component
interface GalleryCardProps {
  item: GalleryItem
  onClick: () => void
}

function GalleryCard({ item, onClick }: GalleryCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-card
        bg-gradient-to-br from-onyx-light to-onyx
        border border-gold/20 hover:border-gold/50
        transition-all duration-300 hover:scale-105 hover:shadow-gold
        focus:outline-none focus:ring-2 focus:ring-gold/50"
    >
      {/* Aspect Ratio Container */}
      <div className={`
        relative
        ${item.aspectRatio === 'portrait' ? 'aspect-[3/4]' :
          item.aspectRatio === 'square' ? 'aspect-square' :
          'aspect-[4/3]'}
      `}>
        {/* Image */}
        <Image
          src={item.thumbnailUrl || item.imageUrl}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/50 to-transparent
          opacity-0 group-hover:opacity-100 transition-opacity duration-300
          flex items-end p-6"
        >
          <div className="w-full">
            <h3 className="text-white font-bold text-lg mb-2 text-left">
              {item.title}
            </h3>
            <p className="text-white/70 text-sm mb-3 text-left line-clamp-2">
              {item.description}
            </p>
            <Badge variant="default" size="sm">
              {categories.find(cat => cat.id === item.category)?.label || item.category}
            </Badge>
          </div>
        </div>
      </div>

      {/* Bottom Info Bar - Always Visible */}
      <div className="p-4 border-t border-gold/10 bg-onyx/50">
        <h4 className="text-white font-semibold text-sm text-left truncate">
          {item.title}
        </h4>
        <p className="text-white/50 text-xs text-left mt-1 capitalize">
          {item.category}
        </p>
      </div>
    </button>
  )
}
