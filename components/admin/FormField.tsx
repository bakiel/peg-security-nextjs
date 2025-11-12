import React, { forwardRef } from 'react'

export interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  required?: boolean
  helperText?: string
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, required, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="block mb-2">
          <span className="text-sm font-sans font-semibold text-onyx">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
        </label>
        <input
          ref={ref}
          className={`w-full px-4 py-2.5 border rounded-lg font-sans transition-all ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
              : 'border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/20'
          } disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
          {...props}
        />
        {helperText && !error && (
          <p className="mt-1 text-xs text-grey-medium font-sans">{helperText}</p>
        )}
        {error && (
          <p className="mt-1 text-xs text-red-500 font-sans font-semibold">{error}</p>
        )}
      </div>
    )
  }
)

FormField.displayName = 'FormField'

export interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  required?: boolean
  helperText?: string
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, error, required, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="block mb-2">
          <span className="text-sm font-sans font-semibold text-onyx">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
        </label>
        <textarea
          ref={ref}
          className={`w-full px-4 py-2.5 border rounded-lg font-sans transition-all min-h-[120px] ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
              : 'border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/20'
          } disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
          {...props}
        />
        {helperText && !error && (
          <p className="mt-1 text-xs text-grey-medium font-sans">{helperText}</p>
        )}
        {error && (
          <p className="mt-1 text-xs text-red-500 font-sans font-semibold">{error}</p>
        )}
      </div>
    )
  }
)

TextareaField.displayName = 'TextareaField'

export interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  required?: boolean
  helperText?: string
  options: Array<{ value: string; label: string }>
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, required, helperText, options, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="block mb-2">
          <span className="text-sm font-sans font-semibold text-onyx">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
        </label>
        <select
          ref={ref}
          className={`w-full px-4 py-2.5 border rounded-lg font-sans transition-all ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
              : 'border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/20'
          } disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {helperText && !error && (
          <p className="mt-1 text-xs text-grey-medium font-sans">{helperText}</p>
        )}
        {error && (
          <p className="mt-1 text-xs text-red-500 font-sans font-semibold">{error}</p>
        )}
      </div>
    )
  }
)

SelectField.displayName = 'SelectField'
