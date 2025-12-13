import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export function Input({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-900 mb-2">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-4 py-2.5 border rounded-lg font-medium
          bg-white text-gray-900 placeholder-gray-500
          border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-200
          transition-colors duration-200
          disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-gray-600">{helperText}</p>}
    </div>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export function Textarea({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-gray-900 mb-2">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`
          w-full px-4 py-2.5 border rounded-lg font-medium
          bg-white text-gray-900 placeholder-gray-500
          border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-200
          transition-colors duration-200 resize-none
          disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-gray-600">{helperText}</p>}
    </div>
  )
}
