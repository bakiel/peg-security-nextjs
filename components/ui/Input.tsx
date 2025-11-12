import React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  isTextarea?: boolean
  rows?: number
}

const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (
    {
      className,
      label,
      error,
      icon,
      type = 'text',
      isTextarea = false,
      rows = 4,
      disabled = false,
      required = false,
      ...props
    },
    ref
  ) => {
    const baseInputStyles = `
      w-full px-4 py-3 bg-onyx/50 border rounded-lg
      text-white placeholder:text-grey-light
      transition-all duration-300
      focus:outline-none focus:ring-2
      disabled:opacity-50 disabled:cursor-not-allowed
    `

    const inputStateStyles = error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
      : 'border-gold/20 focus:border-gold focus:ring-gold/20'

    const iconStyles = icon ? 'pl-12' : ''

    return (
      <div className="w-full">
        {label && (
          <label className="block mb-2 text-sm font-medium text-white">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/60">
              {icon}
            </div>
          )}

          {isTextarea ? (
            <textarea
              ref={ref as React.Ref<HTMLTextAreaElement>}
              className={cn(
                baseInputStyles,
                inputStateStyles,
                iconStyles,
                'resize-vertical min-h-[100px]',
                className
              )}
              rows={rows}
              disabled={disabled}
              {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              type={type}
              className={cn(
                baseInputStyles,
                inputStateStyles,
                iconStyles,
                className
              )}
              disabled={disabled}
              {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            />
          )}
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
