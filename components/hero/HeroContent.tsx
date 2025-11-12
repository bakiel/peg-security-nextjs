'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Shield, ArrowRight, Play } from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { STATS } from '@/lib/constants'

interface HeroContentProps {
  onVideoClick?: () => void
}

const HeroContent: React.FC<HeroContentProps> = ({ onVideoClick }) => {

  const titleVariants1 = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] as any, delay: 0 }
    }
  }

  const titleVariants2 = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] as any, delay: 0.2 }
    }
  }

  const titleVariants3 = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] as any, delay: 0.4 }
    }
  }

  const actionsVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] as any, delay: 1 }
    }
  }

  return (
    <div className="relative z-20 flex items-center min-h-[100vh] pt-hero-top pb-hero-bottom">
      <div className="container max-w-container mx-auto px-5">
        <div className="max-w-4xl">
          {/* PSIRA Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Badge variant="default" size="md" pulse>
              <Shield size={16} />
              PSIRA REGISTERED
            </Badge>
          </motion.div>

          {/* Hero Title */}
          <div className="mb-8">
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={titleVariants1}
              className="font-display font-black text-hero-title leading-hero text-white mb-2"
              style={{
                textShadow: '0 0 10px rgba(208, 185, 109, 0.5), 0 0 20px rgba(208, 185, 109, 0.4), 0 0 30px rgba(208, 185, 109, 0.3)'
              }}
            >
              PROTECTION
            </motion.h1>
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={titleVariants2}
              className="font-display font-black text-hero-title leading-hero text-gold mb-2 animate-glow"
            >
              EXCELLENCE
            </motion.h1>
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={titleVariants3}
              className="font-display font-black text-hero-title leading-hero text-white"
              style={{
                textShadow: '0 0 10px rgba(208, 185, 109, 0.5), 0 0 20px rgba(208, 185, 109, 0.4), 0 0 30px rgba(208, 185, 109, 0.3)'
              }}
            >
              ELITE SERVICE
            </motion.h1>
          </div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-8 mb-10"
          >
            {STATS.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-display font-black text-4xl md:text-5xl text-gold mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-white/70 uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={actionsVariants}
            className="flex flex-wrap gap-5"
          >
            <Button
              variant="primary"
              size="lg"
              icon={<ArrowRight size={20} />}
              iconPosition="right"
              onClick={() => window.location.href = '/contact'}
            >
              Get Protected Now
            </Button>

            <Button
              variant="secondary"
              size="lg"
              icon={<Play size={20} />}
              iconPosition="left"
              onClick={onVideoClick}
            >
              Watch Our Story
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default HeroContent
