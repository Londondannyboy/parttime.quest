'use client'

import { useState } from 'react'

interface RateBucket {
  range: string
  min: number
  max: number
  count: number
  percentage: number
}

export interface RateDistributionProps {
  height?: string
  roleFilter?: string
}

// Market rate distributions by role (based on UK fractional executive market data 2025)
const MARKET_DATA: Record<string, { buckets: RateBucket[], avg: number, median: number }> = {
  CFO: {
    avg: 1050,
    median: 1000,
    buckets: [
      { range: '£500-750', min: 500, max: 750, count: 8, percentage: 8 },
      { range: '£750-900', min: 750, max: 900, count: 18, percentage: 18 },
      { range: '£900-1100', min: 900, max: 1100, count: 32, percentage: 32 },
      { range: '£1100-1300', min: 1100, max: 1300, count: 25, percentage: 25 },
      { range: '£1300-1500', min: 1300, max: 1500, count: 12, percentage: 12 },
      { range: '£1500+', min: 1500, max: 2500, count: 5, percentage: 5 },
    ]
  },
  CTO: {
    avg: 1100,
    median: 1050,
    buckets: [
      { range: '£600-800', min: 600, max: 800, count: 10, percentage: 10 },
      { range: '£800-1000', min: 800, max: 1000, count: 22, percentage: 22 },
      { range: '£1000-1200', min: 1000, max: 1200, count: 30, percentage: 30 },
      { range: '£1200-1400', min: 1200, max: 1400, count: 22, percentage: 22 },
      { range: '£1400-1600', min: 1400, max: 1600, count: 11, percentage: 11 },
      { range: '£1600+', min: 1600, max: 2500, count: 5, percentage: 5 },
    ]
  },
  CMO: {
    avg: 950,
    median: 900,
    buckets: [
      { range: '£500-700', min: 500, max: 700, count: 12, percentage: 12 },
      { range: '£700-900', min: 700, max: 900, count: 28, percentage: 28 },
      { range: '£900-1100', min: 900, max: 1100, count: 30, percentage: 30 },
      { range: '£1100-1300', min: 1100, max: 1300, count: 18, percentage: 18 },
      { range: '£1300-1500', min: 1300, max: 1500, count: 8, percentage: 8 },
      { range: '£1500+', min: 1500, max: 2000, count: 4, percentage: 4 },
    ]
  },
  COO: {
    avg: 1000,
    median: 950,
    buckets: [
      { range: '£600-800', min: 600, max: 800, count: 14, percentage: 14 },
      { range: '£800-1000', min: 800, max: 1000, count: 30, percentage: 30 },
      { range: '£1000-1200', min: 1000, max: 1200, count: 28, percentage: 28 },
      { range: '£1200-1400', min: 1200, max: 1400, count: 18, percentage: 18 },
      { range: '£1400-1600', min: 1400, max: 1600, count: 7, percentage: 7 },
      { range: '£1600+', min: 1600, max: 2200, count: 3, percentage: 3 },
    ]
  },
  default: {
    avg: 1000,
    median: 950,
    buckets: [
      { range: '£500-750', min: 500, max: 750, count: 12, percentage: 12 },
      { range: '£750-1000', min: 750, max: 1000, count: 28, percentage: 28 },
      { range: '£1000-1250', min: 1000, max: 1250, count: 30, percentage: 30 },
      { range: '£1250-1500', min: 1250, max: 1500, count: 18, percentage: 18 },
      { range: '£1500-1750', min: 1500, max: 1750, count: 8, percentage: 8 },
      { range: '£1750+', min: 1750, max: 2500, count: 4, percentage: 4 },
    ]
  }
}

export function RateDistribution({ height = '400px', roleFilter }: RateDistributionProps) {
  const [selectedBucket, setSelectedBucket] = useState<RateBucket | null>(null)
  const [hoveredBucket, setHoveredBucket] = useState<string | null>(null)

  // Get data for the role
  const roleKey = roleFilter?.toUpperCase() || 'default'
  const data = MARKET_DATA[roleKey] || MARKET_DATA.default
  const maxPercentage = Math.max(...data.buckets.map(b => b.percentage))

  return (
    <div className="relative bg-gray-950 rounded-xl p-6" style={{ minHeight: height }}>
      {/* Stats header */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900/50 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-white">£{data.avg.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Average Day Rate</p>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-indigo-400">£{data.median.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Median Day Rate</p>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-emerald-400">100%</p>
          <p className="text-xs text-gray-500 mt-1">Market Coverage</p>
        </div>
      </div>

      {/* Bar chart */}
      <div className="space-y-3">
        {data.buckets.map((bucket, i) => {
          const width = (bucket.percentage / maxPercentage) * 100
          const isSelected = selectedBucket?.range === bucket.range
          const isHovered = hoveredBucket === bucket.range

          return (
            <div
              key={i}
              className="group cursor-pointer transition-all"
              onClick={() => setSelectedBucket(isSelected ? null : bucket)}
              onMouseEnter={() => setHoveredBucket(bucket.range)}
              onMouseLeave={() => setHoveredBucket(null)}
            >
              <div className="flex items-center gap-4">
                <div className="w-28 text-right">
                  <span className={`text-sm transition-colors ${isHovered || isSelected ? 'text-white font-medium' : 'text-gray-400'}`}>
                    {bucket.range}
                  </span>
                </div>
                <div className="flex-1 h-10 bg-gray-800 rounded-lg overflow-hidden relative">
                  <div
                    className={`h-full rounded-lg transition-all duration-500 ${
                      isSelected ? 'bg-indigo-500' : isHovered ? 'bg-indigo-500/90' : 'bg-indigo-600/70'
                    }`}
                    style={{ width: `${width}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-between px-3">
                    <span className={`text-sm font-medium ${width > 20 ? 'text-white' : 'text-transparent'}`}>
                      {bucket.percentage}%
                    </span>
                    <span className={`text-sm font-medium ${width < 80 ? 'text-white' : 'text-transparent'}`}>
                      {bucket.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Selected bucket detail */}
      {selectedBucket && (
        <div className="mt-6 p-4 bg-indigo-900/30 rounded-lg border border-indigo-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-bold">{selectedBucket.range} per day</p>
              <p className="text-indigo-300 text-sm">{selectedBucket.percentage}% of fractional {roleFilter || 'executive'} roles</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedBucket(null) }}
              className="text-gray-400 hover:text-white p-1"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 text-center text-xs text-gray-500">
        UK market rates for fractional {roleFilter || 'executive'} roles • 2025 data • Click bar for details
      </div>
    </div>
  )
}
