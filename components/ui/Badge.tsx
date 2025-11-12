'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  pulse?: boolean
  children: React.ReactNode
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      icon,
      pulse = false,
      children,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion()

    const baseStyles = `
      inline-flex items-center gap-2 rounded-full
      font-semibold whitespace-nowrap
      transition-all duration-300
    `

    const variants = {
      default: 'bg-gold/20 text-gold border border-gold/30 hover:bg-gold/30 hover:border-gold/50',
      success: 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 hover:border-green-500/50',
      warning: 'bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:bg-orange-500/30 hover:border-orange-500/50',
      danger: 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 hover:border-red-500/50',
      info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 hover:border-blue-500/50',
    }

    const sizes = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
      lg: 'px-4 py-2 text-base',
    }

    const pulseAnimation = pulse && !prefersReducedMotion ? {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ease: 'easeInOut' as any,
      },
    } : {}

    const MotionDiv = motion.div

    if (prefersReducedMotion) {
      return (
        <div
          ref={ref}
          className={cn(
            baseStyles,
            variants[variant],
            sizes[size],
            className
          )}
          {...props}
        >
          {pulse && (
            <span className={cn(
              'w-2 h-2 rounded-full',
              variant === 'default' ? 'bg-gold' :
              variant === 'success' ? 'bg-green-400' :
              variant === 'warning' ? 'bg-orange-400' :
              variant === 'danger' ? 'bg-red-400' : 'bg-blue-400'
            )} />
          )}
          {icon && <span>{icon}</span>}
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
          sizes[size],
          className
        )}
        animate={pulseAnimation}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {pulse && (
          <motion.span
            className={cn(
              'w-2 h-2 rounded-full',
              variant === 'default' ? 'bg-gold' :
              variant === 'success' ? 'bg-green-400' :
              variant === 'warning' ? 'bg-orange-400' :
              variant === 'danger' ? 'bg-red-400' : 'bg-blue-400'
            )}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.7, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
        {icon && <span>{icon}</span>}
        {children}
      </MotionDiv>
    )
  }
)

Badge.displayName = 'Badge'

export default Badge
