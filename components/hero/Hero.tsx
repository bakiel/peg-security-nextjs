'use client'

import React, { useState } from 'react'
import HeroCarousel from './HeroCarousel'
import ParticleOverlay from './ParticleOverlay'
import CinematicVignette from './CinematicVignette'
import HeroContent from './HeroContent'
import VideoModal from './VideoModal'

const Hero: React.FC = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  return (
    <section className="relative h-screen min-h-[800px] overflow-hidden">
      {/* Carousel with Ken Burns effect */}
      <HeroCarousel />

      {/* Floating particles */}
      <ParticleOverlay />

      {/* Breathing vignette */}
      <CinematicVignette />

      {/* Hero content */}
      <HeroContent onVideoClick={() => setIsVideoOpen(true)} />

      {/* Video modal */}
      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
      />
    </section>
  )
}

export default Hero
