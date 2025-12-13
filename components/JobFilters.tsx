'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

interface FilterOption {
  value: string
  label: string
}

interface JobFiltersProps {
  currentRole?: string
  currentLocation?: string
  currentIndustry?: string
  totalJobs: number
  roleOptions: FilterOption[]
  locationOptions: FilterOption[]
  industryOptions: FilterOption[]
}

export function JobFilters({
  currentRole = '',
  currentLocation = '',
  currentIndustry = '',
  totalJobs,
  roleOptions,
  locationOptions,
  industryOptions
}: JobFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      // Reset to page 1 when filtering
      params.delete('page')
      return params.toString()
    },
    [searchParams]
  )

  const handleFilterChange = (name: string, value: string) => {
    const queryString = createQueryString(name, value)
    router.push(`/fractional-jobs${queryString ? `?${queryString}` : ''}`)
  }

  const activeFilters = [currentRole, currentLocation, currentIndustry].filter(Boolean).length

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      {/* Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Role Filter */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <select
            id="role"
            value={currentRole}
            onChange={(e) => handleFilterChange('role', e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          >
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Industry Filter */}
        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
            Industry
          </label>
          <select
            id="industry"
            value={currentIndustry}
            onChange={(e) => handleFilterChange('industry', e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          >
            {industryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <select
            id="location"
            value={currentLocation}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          >
            {locationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count & Clear */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-purple-700">{totalJobs}</span>
          <span className="text-gray-600">jobs found</span>
        </div>
        {activeFilters > 0 && (
          <button
            onClick={() => router.push('/fractional-jobs')}
            className="px-4 py-2 text-sm font-medium text-purple-700 hover:text-purple-900 hover:bg-purple-50 rounded-lg transition-colors"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* Active Filter Tags */}
      {activeFilters > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-600">Active filters:</span>
          {currentRole && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
              {roleOptions.find(r => r.value === currentRole)?.label || currentRole}
              <button
                onClick={() => handleFilterChange('role', '')}
                className="hover:text-purple-900"
                aria-label={`Remove ${roleOptions.find(r => r.value === currentRole)?.label || currentRole} filter`}
              >
                &times;
              </button>
            </span>
          )}
          {currentIndustry && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
              {industryOptions.find(i => i.value === currentIndustry)?.label || currentIndustry}
              <button
                onClick={() => handleFilterChange('industry', '')}
                className="hover:text-orange-900"
                aria-label={`Remove ${industryOptions.find(i => i.value === currentIndustry)?.label || currentIndustry} filter`}
              >
                &times;
              </button>
            </span>
          )}
          {currentLocation && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              {locationOptions.find(l => l.value === currentLocation)?.label || currentLocation}
              <button
                onClick={() => handleFilterChange('location', '')}
                className="hover:text-blue-900"
                aria-label={`Remove ${locationOptions.find(l => l.value === currentLocation)?.label || currentLocation} filter`}
              >
                &times;
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}
