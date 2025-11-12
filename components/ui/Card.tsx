'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass'
  hover?: boolean
  interactive?: boolean
  children: React.ReactNode
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      hover = false,
      interactive = false,
      children,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion()

    const baseStyles = 'rounded-card p-6 transition-all duration-300'

    const variants = {
      default: 'bg-onyx/50 border border-gold/10',
      elevated: 'bg-onyx shadow-lg',
      outlined: 'bg-transparent border-2 border-gold/20',
      glass: 'bg-white/5 backdrop-blur-lg border border-white/10',
    }

    const hoverStyles = hover
      ? 'hover:-translate-y-1 hover:shadow-xl hover:border-gold/30'
      : ''

    const interactiveStyles = interactive
      ? 'cursor-pointer hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl hover:border-gold/30'
      : ''

    const MotionDiv = motion.div

    if (prefersReducedMotion || (!hover && !interactive)) {
      return (
        <div
          ref={ref}
          className={cn(
            baseStyles,
            variants[variant],
            hoverStyles,
            interactiveStyles,
            className
          )}
          {...props}
        >
          {children}
        </div>
      )
    }

    return (
      <MotionDiv
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          className
        )}
        whileHover={{
          y: hover || interactive ? -4 : 0,
          scale: interactive ? 1.02 : 1,
          transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
        }}
        {...props}
      >
        {children}
      </MotionDiv>
    )
  }
)

Card.displayName = 'Card'

export default Card
