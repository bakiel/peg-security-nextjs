'use client'

import React from 'react'
import { motion, MotionProps } from 'framer-motion'
import { useInView } from '@/lib/hooks/useInView'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { fadeInUp } from '@/lib/animations/variants'

interface AnimatedSectionProps extends Omit<MotionProps, 'ref'> {
  children: React.ReactNode
  className?: string
  delay?: number
  threshold?: number
}

export default function AnimatedSection({
  children,
  className,
  delay = 0,
  threshold = 0.1,
  ...motionProps
}: AnimatedSectionProps) {
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold, triggerOnce: true })
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeInUp}
      transition={{ delay }}
      className={className}
      {...motionProps}
    >
      {children}
    </motion.div>
  )
}
