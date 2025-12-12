import { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { createDbQuery } from '@/lib/db'
import { JobCard } from '@/components/JobCard'
import { JobFilters } from '@/components/JobFilters'
import { JobsGraph } from '@/components/JobsGraph'

// Revalidate every 15 minutes for jobs
export const revalidate = 900

export const metadata: Metadata = {
  title: 'Fractional Jobs UK 2025 - Browse Executive & Part-Time C-Suite Roles',
  description: 'Browse 500+ fractional jobs in the UK. Find fractional CFO, CMO, CTO roles paying £600-£1,500/day. Part-time executive positions updated daily.',
  keywords: 'fractional jobs, fractional jobs uk, fractional executive jobs, part time executive jobs, fractional cfo jobs, fractional cmo jobs',
  openGraph: {
    title: 'Fractional Jobs UK - Browse Executive & Part-Time C-Suite Roles',
    description: 'Browse 500+ fractional jobs in the UK. Find fractional CFO, CMO, CTO roles paying £600-£1,500/day.',
    type: 'website',
  },
}

interface JobsPageProps {
  searchParams: {
    page?: string
    role?: string
    remote?: string
    location?: string
    industry?: string
  }
}

interface FilterOption {
  value: string
  label: string
}

// Fetch filter options from database
async function getFilterOptions(sql: any) {
  // Get role categories
  const roleResults = await sql`
    SELECT DISTINCT role_category
    FROM jobs
    WHERE is_active = true AND role_category IS NOT NULL
    ORDER BY role_category
  `
  const roleOptions: FilterOption[] = [
    { value: '', label: 'All Roles' },
    ...roleResults.map((r: any) => ({
      value: r.role_category,
      label: r.role_category === 'CFO' ? 'CFO - Finance' :
             r.role_category === 'CMO' ? 'CMO - Marketing' :
             r.role_category === 'CTO' ? 'CTO - Technology' :
             r.role_category === 'COO' ? 'COO - Operations' :
             r.role_category === 'HR' ? 'HR Director' :
             r.role_category === 'Sales' ? 'Sales Director' :
             r.role_category
    }))
  ]

  // Get workplace types
  const workTypeResults = await sql`
    SELECT DISTINCT workplace_type
    FROM jobs
    WHERE is_active = true AND workplace_type IS NOT NULL
    ORDER BY workplace_type
  `
  const workTypeOptions: FilterOption[] = [
    { value: '', label: 'All Work Types' },
    ...workTypeResults.map((w: any) => ({
      value: w.workplace_type.toLowerCase(),
      label: w.workplace_type
    }))
  ]

  // Get unique locations (simplified - extract city/region)
  const locationResults = await sql`
    SELECT location, COUNT(*) as count
    FROM jobs
    WHERE is_active = true AND location IS NOT NULL
    GROUP BY location
    ORDER BY count DESC
    LIMIT 15
  `

  // Static list of UK locations - comprehensive coverage
  const ukLocations = [
    'London', 'Manchester', 'Birmingham', 'Leeds', 'Bristol',
    'Edinburgh', 'Glasgow', 'Liverpool', 'Newcastle', 'Sheffield',
    'Nottingham', 'Cardiff', 'Belfast', 'Cambridge', 'Oxford',
    'Reading', 'Brighton', 'Southampton', 'Leicester', 'Coventry',
    'Remote'
  ]

  const locationOptions: FilterOption[] = [
    { value: '', label: 'All Locations' },
    ...ukLocations.map(loc => ({ value: loc, label: loc }))
  ]

  // Static list of industries
  const industries = [
    'Technology', 'FinTech', 'SaaS', 'Healthcare', 'E-commerce',
    'Professional Services', 'Financial Services', 'Manufacturing',
    'Retail', 'Media & Entertainment', 'Real Estate', 'Education',
    'Energy', 'Startups', 'Private Equity'
  ]

  const industryOptions: FilterOption[] = [
    { value: '', label: 'All Industries' },
    ...industries.map(ind => ({ value: ind, label: ind }))
  ]

  return { roleOptions, workTypeOptions, locationOptions, industryOptions }
}

function JobFiltersWrapper({
  currentRole,
  currentRemote,
  currentLocation,
  currentIndustry,
  totalJobs,
  roleOptions,
  locationOptions,
  workTypeOptions,
  industryOptions
}: {
  currentRole: string
  currentRemote: string
  currentLocation: string
  currentIndustry: string
  totalJobs: number
  roleOptions: FilterOption[]
  locationOptions: FilterOption[]
  workTypeOptions: FilterOption[]
  industryOptions: FilterOption[]
}) {
  return (
    <Suspense fallback={<div className="h-24 bg-gray-100 rounded-xl animate-pulse" />}>
      <JobFilters
        currentRole={currentRole}
        currentRemote={currentRemote}
        currentLocation={currentLocation}
        currentIndustry={currentIndustry}
        totalJobs={totalJobs}
        roleOptions={roleOptions}
        locationOptions={locationOptions}
        workTypeOptions={workTypeOptions}
        industryOptions={industryOptions}
      />
    </Suspense>
  )
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const limit = 20
  const page = parseInt(searchParams.page || '1')
  const offset = (page - 1) * limit

  // Get filter values
  const roleFilter = searchParams.role || ''
  const remoteFilter = searchParams.remote || ''
  const locationFilter = searchParams.location || ''
  const industryFilter = searchParams.industry || ''

  try {
    const sql = createDbQuery()

    // Get filter options from database
    const { roleOptions, workTypeOptions, locationOptions, industryOptions } = await getFilterOptions(sql)

    // Build dynamic WHERE clause
    let whereConditions = ['is_active = true']

    if (roleFilter) {
      whereConditions.push(`role_category = '${roleFilter}'`)
    }

    if (remoteFilter === 'remote') {
      whereConditions.push(`(is_remote = true OR workplace_type = 'Remote')`)
    } else if (remoteFilter === 'hybrid') {
      whereConditions.push(`workplace_type = 'Hybrid'`)
    } else if (remoteFilter === 'onsite') {
      whereConditions.push(`(is_remote = false AND workplace_type IS DISTINCT FROM 'Remote' AND workplace_type IS DISTINCT FROM 'Hybrid')`)
    }

    if (locationFilter) {
      whereConditions.push(`location ILIKE '%${locationFilter}%'`)
    }

    if (industryFilter) {
      // Match industry in company description, title, or skills
      whereConditions.push(`(
        description ILIKE '%${industryFilter}%' OR
        title ILIKE '%${industryFilter}%' OR
        company_name ILIKE '%${industryFilter}%'
      )`)
    }

    const whereClause = whereConditions.join(' AND ')

    // Fetch jobs from database
    const jobs = await sql`
      SELECT
        id,
        slug,
        title,
        company_name,
        location,
        is_remote,
        workplace_type,
        compensation,
        role_category,
        skills_required,
        posted_date,
        description_snippet
      FROM jobs
      WHERE ${sql.unsafe(whereClause)}
      ORDER BY posted_date DESC NULLS LAST
      LIMIT ${limit} OFFSET ${offset}
    `

    // Get total count for pagination
    const countResult = await sql`
      SELECT COUNT(*) as count
      FROM jobs
      WHERE ${sql.unsafe(whereClause)}
    `

    const total = parseInt((countResult[0] as any)?.count || '0')
    const totalPages = Math.ceil(total / limit)

    // Build pagination URL with filters
    const buildPageUrl = (pageNum: number) => {
      const params = new URLSearchParams()
      params.set('page', pageNum.toString())
      if (roleFilter) params.set('role', roleFilter)
      if (remoteFilter) params.set('remote', remoteFilter)
      if (locationFilter) params.set('location', locationFilter)
      if (industryFilter) params.set('industry', industryFilter)
      return `/fractional-jobs?${params.toString()}`
    }

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 py-16 relative overflow-hidden">
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <Link href="/" className="inline-flex items-center text-purple-200 hover:text-white mb-4 transition-colors">
              ← Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Fractional Jobs UK
            </h1>
            {/* SEO image with keyword alt text */}
            <img
              src="/logo.svg"
              alt="Fractional Jobs UK - Browse executive and part-time C-suite positions"
              className="hidden"
              width={1}
              height={1}
            />
            <p className="text-xl text-purple-100 mb-2">
              Browse {total}+ fractional executive jobs across the UK
            </p>
            <p className="text-purple-200">
              CFO, CMO, CTO & specialist roles • £600-£1,500/day • Updated every 15 minutes
            </p>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-6 -mt-8 relative z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <JobFiltersWrapper
              currentRole={roleFilter}
              currentRemote={remoteFilter}
              currentLocation={locationFilter}
              currentIndustry={industryFilter}
              totalJobs={total}
              roleOptions={roleOptions}
              locationOptions={locationOptions}
              workTypeOptions={workTypeOptions}
              industryOptions={industryOptions}
            />
          </div>
        </section>

        {/* Jobs List */}
        <section className="py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {jobs.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No jobs match your filters</h2>
                <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
                <Link href="/fractional-jobs">
                  <button className="px-6 py-2.5 bg-purple-700 text-white rounded-lg hover:bg-purple-800 font-semibold transition-colors">
                    Clear All Filters
                  </button>
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 mb-12">
                  {jobs.map((job: any) => {
                    const postedDate = job.posted_date ? new Date(job.posted_date) : null
                    const postedDaysAgo = postedDate
                      ? Math.floor((Date.now() - postedDate.getTime()) / (1000 * 60 * 60 * 24))
                      : undefined

                    return (
                      <Link key={job.id} href={`/fractional-job/${job.slug}`}>
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
                  <div className="flex justify-center items-center gap-2">
                    {page > 1 && (
                      <Link href={buildPageUrl(page - 1)}>
                        <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 font-medium transition-colors">
                          ← Previous
                        </button>
                      </Link>
                    )}

                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                        const pageNum = Math.max(1, page - 2) + i
                        if (pageNum > totalPages) return null

                        return (
                          <Link key={pageNum} href={buildPageUrl(pageNum)}>
                            <button
                              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                pageNum === page
                                  ? 'bg-purple-700 text-white'
                                  : 'bg-white border border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          </Link>
                        )
                      })}
                    </div>

                    {page < totalPages && (
                      <Link href={buildPageUrl(page + 1)}>
                        <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 font-medium transition-colors">
                          Next →
                        </button>
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Jobs Knowledge Graph Section */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Jobs Knowledge Graph</h2>
              <p className="text-gray-600">
                Visualize relationships between jobs, skills, and companies
              </p>
            </div>
            <Suspense fallback={
              <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-center h-[450px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
              </div>
            }>
              <JobsGraph roleFilter={roleFilter} limit={15} />
            </Suspense>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="py-16 bg-white border-t">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Browse Fractional Jobs by Role
            </h2>
            <p className="text-gray-700 mb-8">
              Fractional jobs offer experienced executives the opportunity to work with multiple companies on a part-time basis.
              Whether you're seeking fractional CFO jobs, fractional CMO positions, or other C-suite roles, our job board
              features hundreds of opportunities across the UK. Day rates typically range from £600-£1,500 depending on
              seniority and specialisation.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              <Link href="/part-time-cfo" className="p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
                <h3 className="font-bold text-gray-900 mb-1">Part-Time CFO Jobs</h3>
                <p className="text-gray-600 text-sm">Finance leadership roles</p>
              </Link>
              <Link href="/part-time-cmo" className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <h3 className="font-bold text-gray-900 mb-1">Part-Time CMO Jobs</h3>
                <p className="text-gray-600 text-sm">Marketing leadership roles</p>
              </Link>
              <Link href="/fractional-cfo-salary" className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <h3 className="font-bold text-gray-900 mb-1">CFO Salary Guide</h3>
                <p className="text-gray-600 text-sm">Day rates & earnings</p>
              </Link>
              <Link href="/fractional-cmo-salary" className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <h3 className="font-bold text-gray-900 mb-1">CMO Salary Guide</h3>
                <p className="text-gray-600 text-sm">Day rates & earnings</p>
              </Link>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Fractional Jobs by Location
            </h2>
            <p className="text-gray-700 mb-6">
              Find fractional executive jobs across the UK's major business hubs. London dominates the fractional job market
              with 60% of all roles, but Manchester, Birmingham, Edinburgh and Bristol all have growing fractional communities.
            </p>
            <div className="flex flex-wrap gap-3 mb-12">
              <Link href="/fractional-jobs-london" className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full hover:bg-purple-200 font-medium">
                Fractional Jobs London
              </Link>
              <Link href="/fractional-jobs-manchester" className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full hover:bg-purple-200 font-medium">
                Fractional Jobs Manchester
              </Link>
              <Link href="/fractional-jobs-birmingham" className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full hover:bg-purple-200 font-medium">
                Fractional Jobs Birmingham
              </Link>
              <Link href="/fractional-jobs-edinburgh" className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full hover:bg-purple-200 font-medium">
                Fractional Jobs Edinburgh
              </Link>
              <Link href="/fractional-jobs-bristol" className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full hover:bg-purple-200 font-medium">
                Fractional Jobs Bristol
              </Link>
              <Link href="/fractional-jobs-leeds" className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full hover:bg-purple-200 font-medium">
                Fractional Jobs Leeds
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-50 border-t">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Can't find the right fractional job?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Get notified when new fractional positions match your profile
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <button className="px-8 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 font-semibold transition-colors">
                  Create Job Alert
                </button>
              </Link>
              <Link href="/fractional-jobs-articles">
                <button className="px-8 py-3 border border-purple-700 text-purple-700 rounded-lg hover:bg-purple-50 font-semibold transition-colors">
                  Read Career Guides
                </button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    )
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-12 rounded-xl shadow-sm">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Jobs</h1>
          <p className="text-gray-600 mb-6">There was an error loading jobs. Please try again later.</p>
          <Link href="/">
            <button className="px-6 py-2.5 bg-purple-700 text-white rounded-lg hover:bg-purple-800 font-semibold transition-colors">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    )
  }
}
