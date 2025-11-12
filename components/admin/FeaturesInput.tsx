'use client'

import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'
import Button from './Button'

export interface FeaturesInputProps {
  label: string
  value: string[]
  onChange: (features: string[]) => void
  error?: string
  required?: boolean
  helperText?: string
}

export default function FeaturesInput({
  label,
  value,
  onChange,
  error,
  required,
  helperText
}: FeaturesInputProps) {
  const [inputValue, setInputValue] = useState('')

  const handleAdd = () => {
    const trimmed = inputValue.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
      setInputValue('')
    }
  }

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div className="w-full">
      <label className="block mb-2">
        <span className="text-sm font-sans font-semibold text-onyx">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </span>
      </label>

      {/* Feature List */}
      {value.length > 0 && (
        <div className="space-y-2 mb-3">
          {value.map((feature, index) => (
            <div
              key={index}
              className="flex items-centre gap-2 bg-offwhite border border-gray-200 rounded-lg px-4 py-2"
            >
              <span className="flex-1 text-sm font-sans text-onyx">{feature}</span>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="text-red-500 hover:text-red-700 transition-colours"
                aria-label="Remove feature"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter a feature and click Add"
          className={`flex-1 px-4 py-2.5 border rounded-lg font-sans transition-all ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
              : 'border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/20'
          }`}
        />
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={handleAdd}
          disabled={!inputValue.trim()}
        >
          <Plus size={18} />
          Add
        </Button>
      </div>

      {helperText && !error && (
        <p className="mt-1 text-xs text-grey-medium font-sans">{helperText}</p>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-500 font-sans font-semibold">{error}</p>
      )}
    </div>
  )
}
