import React from 'react'
import { Badge } from './Badge'

interface JobHeaderProps {
  title: string
  company: string
  location: string
  isRemote: boolean
  compensation?: string
  dayRate?: number
  currency?: string
  seniority?: string
  employmentType?: string
  roleCategory?: string
  postedDate?: string
  className?: string
}

export function JobHeader({
  title,
  company,
  location,
  isRemote,
  compensation,
  dayRate,
  currency = '£',
  seniority,
  employmentType,
  roleCategory,
  postedDate,
  className = '',
}: JobHeaderProps) {
  const displayedCompensation = compensation || (dayRate ? `${currency}${dayRate}/day` : 'TBD')

  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className={`bg-gradient-to-br from-purple-50 to-purple-100 border-b border-purple-200 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-6">
          <a href="/part-time-jobs" className="hover:text-purple-700">Jobs</a>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{title}</span>
        </div>

        {/* Main Title and Company */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3 leading-tight">
            {title}
          </h1>
          <p className="text-2xl text-gray-700 font-semibold">{company}</p>
        </div>

        {/* Key Information Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Location */}
          <div>
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
              📍 Location
            </div>
            <div className="text-lg font-semibold text-gray-900">{location}</div>
            {isRemote && <div className="text-sm text-emerald-700 font-medium">Remote Available</div>}
          </div>

          {/* Compensation */}
          <div>
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
              💼 Rate
            </div>
            <div className="text-lg font-semibold text-purple-700">{displayedCompensation}</div>
          </div>

          {/* Seniority */}
          {seniority && (
            <div>
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                📊 Level
              </div>
              <div className="text-lg font-semibold text-gray-900">{seniority}</div>
            </div>
          )}

          {/* Employment Type */}
          {employmentType && (
            <div>
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                🏢 Type
              </div>
              <div className="text-lg font-semibold text-gray-900">{employmentType}</div>
            </div>
          )}
        </div>

        {/* Badges and Posted Date */}
        <div className="flex flex-wrap items-center gap-3">
          {roleCategory && (
            <Badge variant="primary" size="md">
              {roleCategory}
            </Badge>
          )}
          {postedDate && (
            <span className="text-sm text-gray-600">
              Posted {formatDate(postedDate)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
