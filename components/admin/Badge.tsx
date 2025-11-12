import React from 'react'

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

export interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-amber-100 text-amber-800 border-amber-200',
  danger: 'bg-red-100 text-red-800 border-red-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200',
  neutral: 'bg-grey-light/20 text-grey-medium border-grey-light'
}

export default function Badge({ variant = 'neutral', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-sans font-semibold border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

// Status-specific badge components for convenience
export function StatusBadge({ status }: { status: string }) {
  const getVariant = (status: string): BadgeVariant => {
    const statusLower = status.toLowerCase()
    if (['active', 'open', 'hired', 'completed'].includes(statusLower)) return 'success'
    if (['new', 'reviewing', 'pending'].includes(statusLower)) return 'warning'
    if (['closed', 'rejected', 'archived'].includes(statusLower)) return 'danger'
    if (['draft', 'hidden'].includes(statusLower)) return 'info'
    return 'neutral'
  }

  return <Badge variant={getVariant(status)}>{status}</Badge>
}
