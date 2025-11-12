'use client'

import React, { useCallback, useState } from 'react'
import { Upload, X, FileIcon, ImageIcon } from 'lucide-react'

export interface FileUploadProps {
  label: string
  accept?: string
  multiple?: boolean
  maxSize?: number // in MB
  onFileSelect: (files: File[]) => void
  error?: string
  required?: boolean
  helperText?: string
  currentFile?: string // URL of existing file
  onRemove?: () => void
}

export default function FileUpload({
  label,
  accept = 'image/*',
  multiple = false,
  maxSize = 5,
  onFileSelect,
  error,
  required,
  helperText,
  currentFile,
  onRemove
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentFile || null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const validateAndProcessFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)
    const validFiles: File[] = []
    let errorMsg = ''

    for (const file of fileArray) {
      // Check file size
      const fileSizeMB = file.size / (1024 * 1024)
      if (fileSizeMB > maxSize) {
        errorMsg = `File ${file.name} exceeds ${maxSize}MB limit`
        continue
      }

      // Check file type
      if (accept && !file.type.match(accept.replace('*', '.*'))) {
        errorMsg = `File ${file.name} is not an accepted format`
        continue
      }

      validFiles.push(file)
    }

    if (validFiles.length > 0) {
      onFileSelect(validFiles)

      // Create preview for images
      if (validFiles[0].type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(validFiles[0])
      }
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    validateAndProcessFiles(e.dataTransfer.files)
  }, [onFileSelect, accept, maxSize])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    validateAndProcessFiles(e.target.files)
  }

  const handleRemoveFile = () => {
    setPreview(null)
    if (onRemove) {
      onRemove()
    }
  }

  const isImage = accept.includes('image')

  return (
    <div className="w-full">
      <label className="block mb-2">
        <span className="text-sm font-sans font-semibold text-onyx">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </span>
      </label>

      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all ${
          dragActive
            ? 'border-gold bg-gold/5'
            : error
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300 hover:border-gold'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {preview ? (
          <div className="relative">
            {isImage ? (
              <img
                src={preview}
                alt="Preview"
                className="max-h-64 mx-auto rounded-lg"
              />
            ) : (
              <div className="flex items-center justify-center gap-3 p-4 bg-offwhite rounded-lg">
                <FileIcon size={32} className="text-grey-medium" />
                <span className="font-sans text-sm text-grey-medium">File selected</span>
              </div>
            )}
            <button
              type="button"
              onClick={handleRemoveFile}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colours"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="text-centre">
            <div className="flex justify-center mb-3">
              {isImage ? (
                <ImageIcon size={48} className="text-grey-light" />
              ) : (
                <Upload size={48} className="text-grey-light" />
              )}
            </div>
            <p className="text-sm font-sans font-semibold text-onyx mb-1">
              Drop {multiple ? 'files' : 'file'} here or click to browse
            </p>
            <p className="text-xs text-grey-medium font-sans">
              {accept && `Accepted: ${accept}`}
              {maxSize && ` • Max size: ${maxSize}MB`}
            </p>
          </div>
        )}
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
