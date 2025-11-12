'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  loading?: boolean
  fullWidth?: boolean
  children: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'right',
      loading = false,
      disabled = false,
      fullWidth = false,
      children,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion()

    const baseStyles = `
      inline-flex items-center justify-center gap-2
      rounded-button font-semibold uppercase tracking-nav
      transition-all duration-300 ease-peg
      focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-onyx
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
      relative overflow-hidden
    `

    const variants = {
      primary: `
        bg-gradient-to-r from-gold to-gold-dark text-onyx
        shadow-gold hover:shadow-gold-hover
        hover:-translate-y-0.5 hover:scale-105
      `,
      secondary: `
        bg-transparent text-white border-2 border-gold/50
        hover:bg-gold/10 hover:border-gold hover:-translate-y-0.5
      `,
      outline: `
        bg-transparent text-white border-2 border-gold
        hover:bg-gold/20 hover:border-gold hover:-translate-y-0.5 hover:scale-105
        shadow-sm
      `,
      ghost: `
        bg-transparent text-white
        hover:bg-white/5
      `,
      danger: `
        bg-gradient-to-r from-red-600 to-red-700 text-white
        shadow-sm hover:shadow-md
        hover:-translate-y-0.5
      `,
    }

    const sizes = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-6 py-3 text-sm',
      lg: 'px-8 py-4 text-base',
    }

    const MotionButton = motion.button

    if (prefersReducedMotion) {
      return (
        <button
          ref={ref}
          className={cn(
            baseStyles,
            variants[variant],
            sizes[size],
            fullWidth && 'w-full',
            className
          )}
          disabled={disabled || loading}
          {...props}
        >
          {loading && <Loader2 className="animate-spin" size={16} />}
          {!loading && icon && iconPosition === 'left' && icon}
          {children}
          {!loading && icon && iconPosition === 'right' && icon}
        </button>
      )
    }

    return (
      <MotionButton
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {loading && <Loader2 className="animate-spin" size={16} />}
        {!loading && icon && iconPosition === 'left' && icon}
        {children}
        {!loading && icon && iconPosition === 'right' && icon}
      </MotionButton>
    )
  }
)

Button.displayName = 'Button'

export default Button
