'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { HERO_SLIDES } from '@/lib/constants'

const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsPlaying(false)
    setTimeout(() => setIsPlaying(true), 5000)
  }

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(nextSlide, 7000) // 7s per slide for more drama
    return () => clearInterval(interval)
  }, [isPlaying, nextSlide])

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence mode="wait">
        {HERO_SLIDES.map((slide, index) => (
          index === currentSlide && (
            <motion.div
              key={slide.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0"
            >
              <motion.div
                animate={{
                  scale: [1, 1.15],
                  x: [0, 20],
                  y: [0, -10],
                }}
                transition={{
                  duration: 8,
                  ease: 'easeInOut',
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
                className="w-full h-full"
              >
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  className="object-cover object-top"
                  quality={90}
                />
              </motion.div>
            </motion.div>
          )
        ))}
      </AnimatePresence>

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: 'linear-gradient(180deg, rgba(26, 26, 26, 0.7) 0%, rgba(26, 26, 26, 0.4) 50%, rgba(26, 26, 26, 0.9) 100%)'
        }}
      />

      {/* Carousel Indicators */}
      <div className="absolute bottom-8 right-8 z-20 flex gap-3">
        {HERO_SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => goToSlide(index)}
            className={cn(
              'w-3 h-3 rounded-full transition-all duration-300',
              'hover:scale-125',
              index === currentSlide
                ? 'bg-gold shadow-glow w-8'
                : 'bg-white/30 hover:bg-white/50'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroCarousel
