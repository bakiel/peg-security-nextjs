'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

interface Particle {
  id: number
  size: number
  x: number
  duration: number
  delay: number
  opacity: number
}

const ParticleOverlay: React.FC = () => {
  const particles = useMemo(() => {
    const count = 75
    const particleArray: Particle[] = []

    for (let i = 0; i < count; i++) {
      particleArray.push({
        id: i,
        size: Math.random() * 4 + 2, // 2-6px
        x: Math.random() * 100, // 0-100%
        duration: Math.random() * 10 + 15, // 15-25s
        delay: Math.random() * 5, // 0-5s
        opacity: Math.random() * 0.3 + 0.1, // 0.1-0.4
      })
    }

    return particleArray
  }, [])

  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gold"
          style={{
            left: `${particle.x}%`,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size * 2}px rgba(208, 185, 109, ${particle.opacity})`
          }}
          animate={{
            y: ['100vh', '-10vh'],
            x: [0, Math.random() * 40 - 20], // Slight horizontal drift
          }}
          transition={{
            y: {
              duration: particle.duration,
              repeat: Infinity,
              ease: 'linear',
              delay: particle.delay,
            },
            x: {
              duration: particle.duration * 0.5,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }
          }}
        />
      ))}
    </div>
  )
}

export default ParticleOverlay
