'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Job {
  id: string
  title: string
  company: string
  location: string
  isRemote: boolean
  isFractional: boolean
  salaryRange?: string
  postedDate?: string
  url: string
  snippet?: string
  roleCategory?: string
}

interface JobSearchResponse {
  jobs: Job[]
  total: number
  summary: string
}

interface JobsPanelProps {
  searchQuery?: string
  roleFilter?: string
  locationFilter?: string
  onJobSelect?: (job: Job) => void
}

export function JobsPanel({ searchQuery, roleFilter, locationFilter, onJobSelect }: JobsPanelProps) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'all' | 'cfo' | 'cmo' | 'cto' | 'coo'>('all')

  useEffect(() => {
    fetchJobs()
  }, [searchQuery, roleFilter, locationFilter, activeTab])

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()

      // Use tab as role filter if no specific role
      const role = roleFilter || (activeTab !== 'all' ? activeTab : '')
      if (role) params.set('role', role)
      if (locationFilter) params.set('location', locationFilter)
      if (searchQuery) params.set('q', searchQuery)
      params.set('fractional', 'true')

      const response = await fetch(`/api/jobs/search?${params.toString()}`)
      if (response.ok) {
        const data: JobSearchResponse = await response.json()
        setJobs(data.jobs)
        setSummary(data.summary)
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    }
    setLoading(false)
  }

  return (
    <div className="bg-white h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Fractional Jobs</h2>
        <p className="text-sm text-gray-500 mt-1">
          {jobs.length > 0 ? `${jobs.length} roles available` : 'Browse opportunities'}
        </p>
      </div>

      {/* Role Filter Tabs */}
      <div className="px-4 py-2 border-b border-gray-100 flex gap-1 overflow-x-auto">
        {(['all', 'cfo', 'cmo', 'cto', 'coo'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors whitespace-nowrap ${
              activeTab === tab
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab === 'all' ? 'All Roles' : tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Voice Summary */}
      {summary && (
        <div className="px-4 py-3 bg-purple-50 border-b border-purple-100">
          <p className="text-sm text-purple-700">{summary}</p>
        </div>
      )}

      {/* Jobs List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-500">Finding jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">
              No jobs found matching your criteria.<br />
              Try a different filter.
            </p>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onClick={() => onJobSelect?.(job)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <Link
          href="/fractional-jobs"
          className="block w-full text-center py-2 px-4 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
        >
          View All Jobs →
        </Link>
      </div>
    </div>
  )
}

function JobCard({ job, onClick }: { job: Job; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 text-sm truncate">
            {job.title}
          </h3>
          <p className="text-xs text-gray-600 truncate">
            {job.company}
          </p>
        </div>
        {job.isFractional && (
          <span className="flex-shrink-0 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
            Fractional
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {job.location}
        </span>
        {job.isRemote && (
          <span className="text-green-600">Remote</span>
        )}
      </div>

      {job.salaryRange && (
        <div className="mt-2">
          <span className="text-xs font-medium text-purple-600">
            {job.salaryRange}
          </span>
        </div>
      )}

      {job.snippet && (
        <p className="mt-2 text-xs text-gray-500 line-clamp-2">
          {job.snippet}
        </p>
      )}
    </div>
  )
}

export default JobsPanel
