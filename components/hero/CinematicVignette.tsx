'use client'

import React from 'react'
import { motion } from 'framer-motion'

const CinematicVignette: React.FC = () => {
  return (
    <motion.div
      className="absolute inset-0 z-10 pointer-events-none"
      animate={{
        opacity: [0.6, 0.7, 0.6],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        background: 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0, 0, 0, 0.6) 100%)',
      }}
    />
  )
}

export default CinematicVignette
