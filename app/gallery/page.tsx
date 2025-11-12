'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import MobileMenu from '@/components/layout/MobileMenu'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import { Image as ImageIcon, Shield, Users, MonitorPlay, Calendar, Heart, ChevronLeft, ChevronRight } from 'lucide-react'

// Gallery item type definition
interface GalleryItem {
  id: number
  title: string
  category: 'all' | 'operations' | 'training' | 'technology' | 'events' | 'community'
  description: string
  image: string
  aspectRatio: 'landscape' | 'portrait' | 'square'
}

// Gallery data with 1:1 square placeholder images
const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: 'SAIDSA Accredited Team',
    category: 'training',
    description: 'Fully accredited security personnel with SAIDSA membership and certification',
    image: '/images/Armed_men_with_SAIDSA_logo_1-1.jpg',
    aspectRatio: 'square'
  },
  {
    id: 2,
    title: 'Armed Response Officer',
    category: 'operations',
    description: 'Professional armed security officer ready for rapid response deployment',
    image: '/images/Armed_security_guard_with_weapon.jpg',
    aspectRatio: 'square'
  },
  {
    id: 3,
    title: 'Tactical Security Personnel',
    category: 'operations',
    description: 'Elite armed security personnel in tactical gear for high-risk operations',
    image: '/images/Armed_security_personnel_in_black_gear.jpg',
    aspectRatio: 'square'
  },
  {
    id: 4,
    title: '24/7 Monitoring Services',
    category: 'technology',
    description: 'Advanced CCTV monitoring and surveillance control room operations',
    image: '/images/Monitoring_security_cameras.jpg',
    aspectRatio: 'square'
  },
  {
    id: 5,
    title: 'Professional Security Guard',
    category: 'operations',
    description: 'Uniformed security officer maintaining professional presence and vigilance',
    image: '/images/Security_guard_in_uniform.jpg',
    aspectRatio: 'square'
  },
  {
    id: 6,
    title: 'Communications Specialist',
    category: 'operations',
    description: 'Security personnel with two-way radio communications for coordinated response',
    image: '/images/Security_guard_with_walkie_talkie.jpg',
    aspectRatio: 'square'
  },
  {
    id: 7,
    title: 'Uniformed Security Team',
    category: 'operations',
    description: 'Professional security team in full uniform providing comprehensive protection',
    image: '/images/Security_personnel_in_uniform.jpg',
    aspectRatio: 'square'
  },
  {
    id: 8,
    title: 'United Security Force',
    category: 'operations',
    description: 'Coordinated security team standing together for community protection',
    image: '/images/Security_personnel_standing_together.jpg',
    aspectRatio: 'square'
  },
  {
    id: 9,
    title: 'Armed Security Specialists',
    category: 'operations',
    description: 'Professional armed security personnel providing elite protection services',
    image: '/images/Security_personnel_with_weapons_1-1.jpg',
    aspectRatio: 'square'
  },
  {
    id: 10,
    title: 'Three-Person Security Detail',
    category: 'operations',
    description: 'Coordinated three-person security team demonstrating tactical readiness',
    image: '/images/Three_armed_security_personnel_posing_1-1.jpg',
    aspectRatio: 'square'
  },
  {
    id: 11,
    title: 'Access Control Technology',
    category: 'technology',
    description: 'Modern touchscreen access control and security management systems',
    image: '/images/Touchscreen_passcode_entry_screen.jpg',
    aspectRatio: 'square'
  },
  {
    id: 12,
    title: 'Traffic Surveillance Systems',
    category: 'technology',
    description: 'Advanced traffic camera monitoring for comprehensive area surveillance',
    image: '/images/Traffic_camera_with_flashing_lights.jpg',
    aspectRatio: 'square'
  }
]

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
              <ImageIcon size={16} />
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

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <GalleryCard
                key={item.id}
                item={item}
                onClick={() => handleImageClick(item)}
              />
            ))}
          </div>

          {/* No Results Message */}
          {filteredItems.length === 0 && (
            <div className="text-center py-20">
              <ImageIcon size={64} className="text-gold/30 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No Items Found</h3>
              <p className="text-white/60">Try selecting a different category</p>
            </div>
          )}

          {/* Item Count */}
          <div className="text-center mt-12">
            <p className="text-white/60 text-sm uppercase tracking-nav">
              Showing {filteredItems.length} of {galleryItems.length} items
            </p>
          </div>
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
                  src={selectedImage.image}
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
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
              <div className="bg-onyx/80 backdrop-blur-sm border border-gold/30 rounded-full px-6 py-2">
                <p className="text-white text-sm font-semibold">
                  {filteredItems.findIndex(item => item.id === selectedImage.id) + 1} / {filteredItems.length}
                </p>
              </div>
            </div>
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
          src={item.image}
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
            <Badge variant="default" size="sm">
              {categories.find(cat => cat.id === item.category)?.label}
            </Badge>
          </div>
        </div>
      </div>

      {/* Bottom Info Bar - Always Visible */}
      <div className="p-4 border-t border-gold/10 bg-onyx/50">
        <h4 className="text-white font-semibold text-sm text-left truncate">
          {item.title}
        </h4>
      </div>
    </button>
  )
}
