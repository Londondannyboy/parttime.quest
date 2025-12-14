'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { JobCard } from './JobCard'

interface Job {
  id: string
  slug: string
  title: string
  company_name: string
  location: string
  is_remote: boolean
  workplace_type?: string
  compensation?: string
  role_category?: string
  skills_required?: string[]
  posted_date?: string
}

interface FilterOption {
  value: string
  label: string
}

interface EmbeddedJobBoardProps {
  defaultDepartment?: string
  defaultLocation?: string
  defaultWorkType?: string
  pageSlug?: string // e.g., 'part-time-cmo-jobs-uk' - used to build proper URLs. Optional, defaults to 'part-time-jobs'
  jobsPerPage?: number
  showAllJobsLink?: boolean
  allJobsLinkText?: string
  title?: string
}

// Department categories matching database ENUM
const DEPARTMENT_OPTIONS: FilterOption[] = [
  { value: '', label: 'All Departments' },
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Operations', label: 'Operations' },
  { value: 'Sales', label: 'Sales' },
  { value: 'HR', label: 'HR' },
  { value: 'Product', label: 'Product' },
  { value: 'Design', label: 'Design' },
  { value: 'Data', label: 'Data' },
  { value: 'Legal', label: 'Legal' },
  { value: 'Customer Success', label: 'Customer Success' },
  { value: 'Other', label: 'Other' },
]

const LOCATION_OPTIONS: FilterOption[] = [
  { value: '', label: 'All Locations' },
  { value: 'London', label: 'London' },
  { value: 'Manchester', label: 'Manchester' },
  { value: 'Birmingham', label: 'Birmingham' },
  { value: 'Leeds', label: 'Leeds' },
  { value: 'Bristol', label: 'Bristol' },
  { value: 'Edinburgh', label: 'Edinburgh' },
  { value: 'Glasgow', label: 'Glasgow' },
  { value: 'Liverpool', label: 'Liverpool' },
  { value: 'Newcastle', label: 'Newcastle' },
  { value: 'Remote', label: 'Remote' },
]

const WORK_TYPE_OPTIONS: FilterOption[] = [
  { value: '', label: 'All Work Types' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'On-site' },
]

export function EmbeddedJobBoard({
  defaultDepartment = '',
  defaultLocation = '',
  defaultWorkType = '',
  pageSlug,
  jobsPerPage = 10,
  showAllJobsLink = true,
  allJobsLinkText = 'View All Jobs',
  title = 'Latest Jobs',
}: EmbeddedJobBoardProps) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [totalJobs, setTotalJobs] = useState(0)
  const [loading, setLoading] = useState(true)
  const [department, setDepartment] = useState(defaultDepartment)
  const [location, setLocation] = useState(defaultLocation)
  const [workType, setWorkType] = useState(defaultWorkType)
  const [page, setPage] = useState(1)

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (department) params.set('role', department)
      if (location) params.set('location', location)
      if (workType) params.set('remote', workType)
      params.set('page', page.toString())
      params.set('limit', jobsPerPage.toString())

      const response = await fetch(`/api/jobs/search?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setJobs(data.jobs || [])
        setTotalJobs(data.total || 0)
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }, [department, location, workType, page, jobsPerPage])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1)
  }, [department, location, workType])

  const totalPages = Math.ceil(totalJobs / jobsPerPage)
  const activeFilters = [department, location, workType].filter(Boolean).length

  // Build URL for "View All Jobs" link with current filters
  const buildAllJobsUrl = () => {
    const params = new URLSearchParams()
    if (department) params.set('role', department)
    if (location) params.set('location', location)
    if (workType) params.set('remote', workType)
    return `/part-time-jobs${params.toString() ? `?${params.toString()}` : ''}`
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-purple-700">{totalJobs}</span>
            <span className="text-gray-600">jobs found</span>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Department Filter */}
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            >
              {DEPARTMENT_OPTIONS.map((option) => (
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
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            >
              {LOCATION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Work Type Filter */}
          <div>
            <label htmlFor="workType" className="block text-sm font-medium text-gray-700 mb-1">
              Work Type
            </label>
            <select
              id="workType"
              value={workType}
              onChange={(e) => setWorkType(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            >
              {WORK_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filter Tags */}
        {activeFilters > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-600">Active filters:</span>
            {department && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                {DEPARTMENT_OPTIONS.find(d => d.value === department)?.label}
                <button
                  onClick={() => setDepartment('')}
                  className="hover:text-purple-900"
                  aria-label="Remove department filter"
                >
                  ×
                </button>
              </span>
            )}
            {location && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {LOCATION_OPTIONS.find(l => l.value === location)?.label}
                <button
                  onClick={() => setLocation('')}
                  className="hover:text-blue-900"
                  aria-label="Remove location filter"
                >
                  ×
                </button>
              </span>
            )}
            {workType && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full">
                {WORK_TYPE_OPTIONS.find(w => w.value === workType)?.label}
                <button
                  onClick={() => setWorkType('')}
                  className="hover:text-emerald-900"
                  aria-label="Remove work type filter"
                >
                  ×
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setDepartment(defaultDepartment)
                setLocation(defaultLocation)
                setWorkType(defaultWorkType)
              }}
              className="text-sm text-purple-700 hover:text-purple-900 font-medium"
            >
              Reset to default
            </button>
          </div>
        )}
      </div>

      {/* Jobs List */}
      <div className="p-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs match your filters</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
            <button
              onClick={() => {
                setDepartment('')
                setLocation('')
                setWorkType('')
              }}
              className="px-6 py-2.5 bg-purple-700 text-white rounded-lg hover:bg-purple-800 font-semibold transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {jobs.map((job) => {
                const postedDate = job.posted_date ? new Date(job.posted_date) : null
                const postedDaysAgo = postedDate
                  ? Math.floor((Date.now() - postedDate.getTime()) / (1000 * 60 * 60 * 24))
                  : undefined

                return (
                  <Link key={job.id} href={`/part-time-job/${job.slug}`}>
                    <JobCard
                      title={job.title}
                      company={job.company_name}
                      location={job.location || 'Location TBD'}
                      isRemote={job.is_remote || job.workplace_type === 'Remote'}
                      compensation={job.compensation}
                      roleCategory={job.role_category}
                      skills={job.skills_required || []}
                      postedDaysAgo={postedDaysAgo}
                    />
                  </Link>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-4 border-t border-gray-200">
                {page > 1 && (
                  <button
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    ← Previous
                  </button>
                )}

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    const pageNum = Math.max(1, page - 2) + i
                    if (pageNum > totalPages) return null

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          pageNum === page
                            ? 'bg-purple-700 text-white'
                            : 'bg-white border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                {page < totalPages && (
                  <button
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    Next →
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer with link to all jobs */}
      {showAllJobsLink && (
        <div className="bg-gray-50 border-t border-gray-200 p-6 text-center">
          <Link
            href={buildAllJobsUrl()}
            className="inline-flex items-center gap-2 px-8 py-3 bg-purple-700 text-white rounded-lg font-semibold hover:bg-purple-800 transition-colors"
          >
            {allJobsLinkText}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  )
}
