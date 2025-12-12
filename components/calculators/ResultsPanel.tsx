'use client'

import { useMemo } from 'react'

interface ResultItem {
  label: string
  value: string | number
  prefix?: string
  suffix?: string
  highlight?: boolean
  sublabel?: string
}

interface ResultsPanelProps {
  title?: string
  subtitle?: string
  results: ResultItem[]
  variant?: 'default' | 'compact' | 'horizontal'
  accentColor?: 'purple' | 'amber' | 'green'
}

export function ResultsPanel({
  title,
  subtitle,
  results,
  variant = 'default',
  accentColor = 'purple'
}: ResultsPanelProps) {
  const gradientClass = useMemo(() => {
    switch (accentColor) {
      case 'amber':
        return 'from-amber-600 to-amber-500'
      case 'green':
        return 'from-emerald-600 to-emerald-500'
      default:
        return 'from-purple-900 to-purple-700'
    }
  }, [accentColor])

  const formatValue = (item: ResultItem) => {
    const value = typeof item.value === 'number'
      ? item.value.toLocaleString()
      : item.value
    return `${item.prefix || ''}${value}${item.suffix || ''}`
  }

  if (variant === 'compact') {
    return (
      <div className={`bg-gradient-to-br ${gradientClass} rounded-xl p-4 text-white`}>
        {title && <h4 className="text-sm font-medium opacity-80 mb-2">{title}</h4>}
        <div className="space-y-2">
          {results.map((item, i) => (
            <div key={i} className="flex justify-between items-center">
              <span className="text-sm opacity-70">{item.label}</span>
              <span className={`font-data font-bold ${item.highlight ? 'text-xl' : 'text-base'}`}>
                {formatValue(item)}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (variant === 'horizontal') {
    return (
      <div className={`bg-gradient-to-r ${gradientClass} rounded-xl p-6 text-white`}>
        {(title || subtitle) && (
          <div className="mb-4">
            {title && <h3 className="text-lg font-bold">{title}</h3>}
            {subtitle && <p className="text-sm opacity-70">{subtitle}</p>}
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {results.map((item, i) => (
            <div key={i} className={item.highlight ? 'col-span-2' : ''}>
              <p className="result-label text-xs uppercase tracking-wide opacity-70 mb-1">
                {item.label}
              </p>
              <p className={`font-data font-bold ${item.highlight ? 'text-3xl' : 'text-xl'}`}>
                {formatValue(item)}
              </p>
              {item.sublabel && (
                <p className="text-xs opacity-60 mt-1">{item.sublabel}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Default variant - vertical stack
  return (
    <div className={`results-panel bg-gradient-to-br ${gradientClass} rounded-2xl p-6 md:p-8 text-white`}>
      {(title || subtitle) && (
        <div className="mb-6 pb-4 border-b border-white/20">
          {title && <h3 className="text-xl font-bold">{title}</h3>}
          {subtitle && <p className="text-sm opacity-70 mt-1">{subtitle}</p>}
        </div>
      )}

      <div className="space-y-6">
        {results.map((item, i) => (
          <div key={i} className={item.highlight ? 'py-4 border-y border-white/10' : ''}>
            <p className="result-label text-xs uppercase tracking-wide opacity-70 mb-2">
              {item.label}
            </p>
            <p className={`result-value font-data font-bold animate-count ${
              item.highlight ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'
            }`}>
              {formatValue(item)}
            </p>
            {item.sublabel && (
              <p className="text-sm opacity-60 mt-2">{item.sublabel}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
