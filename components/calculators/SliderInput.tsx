'use client'

import { useId, useCallback, useMemo } from 'react'

interface SliderInputProps {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  prefix?: string
  suffix?: string
  formatValue?: (value: number) => string
  helpText?: string
}

export function SliderInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix = '',
  suffix = '',
  formatValue,
  helpText
}: SliderInputProps) {
  const id = useId()

  // Calculate percentage for slider fill
  const percentage = useMemo(() => {
    return ((value - min) / (max - min)) * 100
  }, [value, min, max])

  // Format the displayed value
  const displayValue = useMemo(() => {
    if (formatValue) return formatValue(value)
    return `${prefix}${value.toLocaleString()}${suffix}`
  }, [value, prefix, suffix, formatValue])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value))
  }, [onChange])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <span className="text-lg font-bold text-gray-900 font-data animate-count">
          {displayValue}
        </span>
      </div>

      <div className="relative">
        <input
          type="range"
          id={id}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="slider-premium w-full h-2 cursor-pointer"
          style={{
            '--value': `${percentage}%`,
            background: `linear-gradient(to right, #111827 0%, #111827 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
          } as React.CSSProperties}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-600">
        <span>{prefix}{min.toLocaleString()}{suffix}</span>
        <span>{prefix}{max.toLocaleString()}{suffix}</span>
      </div>

      {helpText && (
        <p className="text-xs text-gray-600 mt-1">{helpText}</p>
      )}
    </div>
  )
}
