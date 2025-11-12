'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Camera, ArrowRight } from 'lucide-react'
import Badge from '@/components/ui/Badge'

interface GalleryItem {
  id: string
  title: string
  description: string
  category: string
  imageUrl: string
  featured: boolean
}

export default function GalleryFeed() {
  const [images, setImages] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchGallery() {
      try {
        const response = await fetch('/api/gallery')
        const result = await response.json()

        if (result.success) {
          // Show max 8 images in the feed
          setImages(result.data.slice(0, 8))
        }
      } catch (error) {
        console.error('Failed to fetch gallery:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGallery()
  }, [])

  if (loading) {
    return (
      <section className="section-padding bg-onyx/20">
        <div className="container-peg">
          <div className="text-center">
            <div className="inline-block animate-spin w-8 h-8 border-4 border-gold/30 border-t-gold rounded-full" />
          </div>
        </div>
      </section>
    )
  }

  if (images.length === 0) {
    return null
  }

  return (
    <section className="section-padding bg-onyx/20">
      <div className="container-peg">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="default" size="md" className="mb-4">
            <Camera size={16} />
            Our Work
          </Badge>
          <h2 className="font-display text-4xl font-black text-white mb-4">
            Recent <span className="text-gold">Projects</span>
          </h2>
          <p className="text-white/70 text-lg">
            Professional security installations and operations across the Mpumalanga region
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {images.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square rounded-card overflow-hidden border border-gold/20 hover:border-gold/50 transition-all duration-300 bg-onyx/50"
            >
              {/* Image */}
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

              {/* Content */}
              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  {/* Category Badge */}
                  <div className="mb-2">
                    <span className="inline-block px-3 py-1 bg-gold/20 backdrop-blur-sm text-gold text-xs font-semibold rounded-full border border-gold/30">
                      {item.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">
                    {item.title}
                  </h3>

                  {/* Description - Hidden on mobile, shown on hover on desktop */}
                  <p className="text-white/70 text-xs line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link href="/gallery">
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#B89F5F] via-[#D0B96D] to-[#E5D17D] text-gray-900 rounded-button font-bold text-sm uppercase tracking-wide hover:from-[#A68F4F] hover:via-[#C0A95D] hover:to-[#D5C16D] transition-all shadow-lg hover:shadow-2xl hover:-translate-y-0.5">
              View Full Gallery
              <ArrowRight size={18} />
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
