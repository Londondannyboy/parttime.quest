'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface SimilarJob {
  id: string
  slug: string
  title: string
  company_name: string
  location?: string
  compensation?: string
  matchScore?: number
}

interface SimilarJobsProps {
  currentJobId: string
  roleCategory?: string
  skills?: string[]
  location?: string
  limit?: number
  className?: string
}

export function SimilarJobs({
  currentJobId,
  roleCategory,
  skills = [],
  location,
  limit = 4,
  className = ''
}: SimilarJobsProps) {
  const [jobs, setJobs] = useState<SimilarJob[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSimilarJobs() {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (roleCategory) params.set('role', roleCategory)
        if (location) params.set('location', location.split(',')[0].trim()) // First part of location
        params.set('limit', (limit + 1).toString()) // Fetch one extra to exclude current
        params.set('exclude', currentJobId)

        const response = await fetch(`/api/jobs/similar?${params.toString()}`)
        if (response.ok) {
          const data = await response.json()
          // Filter out current job and limit results
          const filtered = (data.jobs || [])
            .filter((j: SimilarJob) => j.id !== currentJobId)
            .slice(0, limit)
          setJobs(filtered)
        }
      } catch (error) {
        console.error('Error fetching similar jobs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSimilarJobs()
  }, [currentJobId, roleCategory, skills, location, limit])

  if (loading) {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (jobs.length === 0) {
    return null
  }

  return (
    <div className={className}>
      <div className="space-y-3">
        {jobs.map((job) => (
          <Link
            key={job.id}
            href={`/fractional-job/${job.slug}`}
            className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
          >
            <h4 className="font-medium text-gray-900 group-hover:text-amber-600 transition-colors text-sm line-clamp-2">
              {job.title}
            </h4>
            <p className="text-xs text-gray-500 mt-1">{job.company_name}</p>
            {job.compensation && (
              <p className="text-xs font-medium text-amber-600 mt-1">{job.compensation}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
