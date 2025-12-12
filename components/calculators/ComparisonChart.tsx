'use client'

import { useMemo } from 'react'

interface ComparisonItem {
  label: string
  value: number
  color?: 'purple' | 'amber' | 'gray' | 'green' | 'red'
  details?: { label: string; value: string }[]
}

interface ComparisonChartProps {
  items: ComparisonItem[]
  title?: string
  formatValue?: (value: number) => string
  showDifference?: boolean
  differenceLabel?: string
}

export function ComparisonChart({
  items,
  title,
  formatValue = (v) => `£${v.toLocaleString()}`,
  showDifference = true,
  differenceLabel = 'You Save'
}: ComparisonChartProps) {
  const maxValue = useMemo(() => Math.max(...items.map(i => i.value)), [items])

  const colorClasses = {
    purple: 'bg-purple-600',
    amber: 'bg-amber-500',
    gray: 'bg-gray-400',
    green: 'bg-emerald-500',
    red: 'bg-red-500'
  }

  const difference = useMemo(() => {
    if (items.length >= 2) {
      return items[0].value - items[1].value
    }
    return 0
  }, [items])

  const percentageSaved = useMemo(() => {
    if (items.length >= 2 && items[0].value > 0) {
      return Math.round((difference / items[0].value) * 100)
    }
    return 0
  }, [items, difference])

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
      {title && (
        <h3 className="text-lg font-bold text-gray-900 mb-6">{title}</h3>
      )}

      <div className="space-y-6">
        {items.map((item, i) => (
          <div key={i}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-700">{item.label}</span>
              <span className="font-data font-bold text-lg text-gray-900">
                {formatValue(item.value)}
              </span>
            </div>

            {/* Bar */}
            <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
              <div
                className={`h-full ${colorClasses[item.color || 'purple']} rounded-lg transition-all duration-500 ease-out`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>

            {/* Details breakdown */}
            {item.details && (
              <div className="mt-3 pl-4 border-l-2 border-gray-200 space-y-1">
                {item.details.map((detail, j) => (
                  <div key={j} className="flex justify-between text-sm">
                    <span className="text-gray-500">{detail.label}</span>
                    <span className="text-gray-700">{detail.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Savings callout */}
      {showDifference && difference > 0 && (
        <div className="mt-8 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-700">{differenceLabel}</p>
              <p className="text-3xl font-data font-bold text-emerald-800">
                {formatValue(difference)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-data font-bold text-emerald-600">
                {percentageSaved}%
              </p>
              <p className="text-sm text-emerald-600">less than full-time</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
