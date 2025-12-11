'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

const ROLE_CATEGORIES = [
  { value: '', label: 'All Roles' },
  { value: 'CFO', label: 'CFO - Finance' },
  { value: 'CMO', label: 'CMO - Marketing' },
  { value: 'CTO', label: 'CTO - Technology' },
  { value: 'COO', label: 'COO - Operations' },
  { value: 'HR', label: 'HR Director' },
  { value: 'Sales', label: 'Sales Director' },
  { value: 'Executive', label: 'Other Executive' },
]

const REMOTE_OPTIONS = [
  { value: '', label: 'All Work Types' },
  { value: 'remote', label: 'Remote Only' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'On-site' },
]

const LOCATION_OPTIONS = [
  { value: '', label: 'All Locations' },
  { value: 'London', label: 'London' },
  { value: 'Manchester', label: 'Manchester' },
  { value: 'Remote', label: 'UK Remote' },
]

interface JobFiltersProps {
  currentRole?: string
  currentRemote?: string
  currentLocation?: string
  totalJobs: number
}

export function JobFilters({
  currentRole = '',
  currentRemote = '',
  currentLocation = '',
  totalJobs
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

  const activeFilters = [currentRole, currentRemote, currentLocation].filter(Boolean).length

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Role Filter */}
        <div className="flex-1">
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Role Type
          </label>
          <select
            id="role"
            value={currentRole}
            onChange={(e) => handleFilterChange('role', e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          >
            {ROLE_CATEGORIES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Work Type Filter */}
        <div className="flex-1">
          <label htmlFor="workType" className="block text-sm font-medium text-gray-700 mb-1">
            Work Type
          </label>
          <select
            id="workType"
            value={currentRemote}
            onChange={(e) => handleFilterChange('remote', e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          >
            {REMOTE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div className="flex-1">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <select
            id="location"
            value={currentLocation}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          >
            {LOCATION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Results Count & Clear */}
        <div className="flex-shrink-0 flex items-end gap-3">
          <div className="text-center lg:text-left">
            <span className="block text-2xl font-bold text-purple-700">{totalJobs}</span>
            <span className="text-sm text-gray-500">jobs found</span>
          </div>
          {activeFilters > 0 && (
            <button
              onClick={() => router.push('/fractional-jobs')}
              className="px-4 py-2.5 text-sm font-medium text-purple-700 hover:text-purple-900 hover:bg-purple-50 rounded-lg transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Tags */}
      {activeFilters > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">Active filters:</span>
          {currentRole && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
              {ROLE_CATEGORIES.find(r => r.value === currentRole)?.label}
              <button
                onClick={() => handleFilterChange('role', '')}
                className="hover:text-purple-900"
              >
                ×
              </button>
            </span>
          )}
          {currentRemote && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full">
              {REMOTE_OPTIONS.find(r => r.value === currentRemote)?.label}
              <button
                onClick={() => handleFilterChange('remote', '')}
                className="hover:text-emerald-900"
              >
                ×
              </button>
            </span>
          )}
          {currentLocation && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              {currentLocation}
              <button
                onClick={() => handleFilterChange('location', '')}
                className="hover:text-blue-900"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}
