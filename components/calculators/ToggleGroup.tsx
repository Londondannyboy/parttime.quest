'use client'

import { useId } from 'react'

interface ToggleOption<T> {
  value: T
  label: string
  description?: string
}

interface ToggleGroupProps<T> {
  label: string
  options: ToggleOption<T>[]
  value: T
  onChange: (value: T) => void
  variant?: 'default' | 'pills' | 'buttons'
  helpText?: string
}

export function ToggleGroup<T extends string | number>({
  label,
  options,
  value,
  onChange,
  variant = 'default',
  helpText
}: ToggleGroupProps<T>) {
  const id = useId()

  if (variant === 'pills') {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => onChange(option.value)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all
                ${value === option.value
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
        {helpText && <p className="text-xs text-gray-600">{helpText}</p>}
      </div>
    )
  }

  if (variant === 'buttons') {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {options.map((option) => (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => onChange(option.value)}
              className={`
                px-3 py-3 rounded-lg text-sm font-semibold transition-all border-2
                ${value === option.value
                  ? 'bg-gray-900 text-white border-gray-900 shadow-lg'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
        {helpText && <p className="text-xs text-gray-600 mt-2">{helpText}</p>}
      </div>
    )
  }

  // Default variant - toggle group
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-gray-700">{label}</legend>
      <div className="toggle-group bg-gray-100 p-1 rounded-xl inline-flex">
        {options.map((option) => (
          <button
            key={String(option.value)}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${value === option.value
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-700'
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
      {helpText && <p className="text-xs text-gray-600 mt-2">{helpText}</p>}
    </fieldset>
  )
}
