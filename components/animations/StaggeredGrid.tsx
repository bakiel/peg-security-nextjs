'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from '@/lib/hooks/useInView'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { staggerContainer, staggerItem } from '@/lib/animations/variants'

interface StaggeredGridProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
  threshold?: number
}

export default function StaggeredGrid({
  children,
  className,
  staggerDelay = 0.1,
  threshold = 0.1,
}: StaggeredGridProps) {
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold, triggerOnce: true })
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  const childrenArray = React.Children.toArray(children)

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        ...staggerContainer,
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1,
          },
        },
      }}
      className={className}
    >
      {childrenArray.map((child, index) => (
        <motion.div key={index} variants={staggerItem}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}
