import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export interface JobSearchResult {
  id: string
  slug?: string
  title: string
  company: string
  company_name?: string
  location: string
  isRemote: boolean
  is_remote?: boolean
  isFractional: boolean
  is_fractional?: boolean
  workplace_type?: string
  salaryRange?: string
  compensation?: string
  postedDate?: string
  posted_date?: string
  url: string
  snippet?: string
  roleCategory?: string
  role_category?: string
  skills_required?: string[]
}

export interface JobSearchResponse {
  jobs: JobSearchResult[]
  total: number
  query: {
    roleType?: string
    location?: string
    remote?: boolean
    fractional?: boolean
  }
  summary: string
}

// GET /api/jobs/search - Search jobs with filters
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams

  // Support both naming conventions for filters
  const roleType = params.get('role') || params.get('roleType') || ''
  const location = params.get('location') || ''
  const remoteParam = params.get('remote') || ''
  const fractionalOnly = params.get('fractional') !== 'false'
  const query = params.get('q') || ''

  // Pagination parameters
  const page = parseInt(params.get('page') || '1')
  const limit = Math.min(parseInt(params.get('limit') || '20'), 50) // Cap at 50
  const offset = (page - 1) * limit

  try {
    // Build WHERE conditions dynamically
    let whereConditions = ['is_active = true']

    // Role/Department filter - use role_category if it looks like a department name
    const departments = ['Engineering', 'Marketing', 'Finance', 'Operations', 'Sales', 'HR', 'Product', 'Design', 'Data', 'Legal', 'Customer Success', 'Other']
    if (roleType) {
      if (departments.includes(roleType)) {
        // Exact match on role_category for department filtering
        whereConditions.push(`role_category = '${roleType}'`)
      } else {
        // Pattern match on title for role type filtering
        whereConditions.push(`LOWER(title) LIKE LOWER('%${roleType}%')`)
      }
    }

    // Location filter
    if (location) {
      whereConditions.push(`LOWER(COALESCE(location, '')) LIKE LOWER('%${location}%')`)
    }

    // Remote/work type filter
    if (remoteParam === 'remote' || remoteParam === 'true') {
      whereConditions.push(`(is_remote = true OR workplace_type = 'Remote')`)
    } else if (remoteParam === 'hybrid') {
      whereConditions.push(`workplace_type = 'Hybrid'`)
    } else if (remoteParam === 'onsite') {
      whereConditions.push(`(is_remote = false AND workplace_type IS DISTINCT FROM 'Remote' AND workplace_type IS DISTINCT FROM 'Hybrid')`)
    }

    // Fractional filter
    if (fractionalOnly) {
      whereConditions.push(`(is_fractional = true OR LOWER(title) LIKE '%fractional%')`)
    }

    // Query/search filter
    if (query) {
      whereConditions.push(`(LOWER(title) LIKE LOWER('%${query}%') OR LOWER(company_name) LIKE LOWER('%${query}%'))`)
    }

    const whereClause = whereConditions.join(' AND ')

    // Get total count first
    const countResult = await sql`
      SELECT COUNT(*) as count
      FROM jobs
      WHERE ${sql.unsafe(whereClause)}
    `
    const total = parseInt((countResult[0] as any)?.count || '0')

    // Get paginated jobs
    const jobs = await sql`
      SELECT
        id, slug, title, company_name, location, is_remote, is_fractional,
        workplace_type, salary_min, salary_max, salary_currency, compensation,
        posted_date, url, description_snippet, role_category, skills_required
      FROM jobs
      WHERE ${sql.unsafe(whereClause)}
      ORDER BY posted_date DESC NULLS LAST
      LIMIT ${limit} OFFSET ${offset}
    `

    // Format results - return both formats for compatibility
    const formattedJobs: JobSearchResult[] = jobs.map((job: any) => ({
      id: job.id,
      slug: job.slug,
      title: job.title,
      company: job.company_name,
      company_name: job.company_name,
      location: job.location || 'Location not specified',
      isRemote: job.is_remote || job.workplace_type === 'Remote' || false,
      is_remote: job.is_remote || false,
      isFractional: job.is_fractional || false,
      is_fractional: job.is_fractional || false,
      workplace_type: job.workplace_type,
      salaryRange: formatSalaryRange(job.salary_min, job.salary_max, job.salary_currency),
      compensation: job.compensation,
      postedDate: job.posted_date ? new Date(job.posted_date).toLocaleDateString('en-GB') : undefined,
      posted_date: job.posted_date,
      url: job.url,
      snippet: job.description_snippet?.slice(0, 200),
      roleCategory: job.role_category,
      role_category: job.role_category,
      skills_required: job.skills_required || []
    }))

    // Voice-friendly summary
    const summary = generateVoiceSummary(formattedJobs, { roleType, location, remote: remoteParam === 'remote' || remoteParam === 'true', fractional: fractionalOnly })

    return NextResponse.json({
      jobs: formattedJobs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      query: { roleType: roleType || undefined, location: location || undefined, remote: remoteParam === 'remote' || remoteParam === 'true', fractional: fractionalOnly },
      summary
    })
  } catch (error) {
    console.error('Jobs search error:', error)
    return NextResponse.json(
      { error: 'Search failed', details: String(error) },
      { status: 500 }
    )
  }
}

function formatSalaryRange(min?: number, max?: number, currency?: string): string | undefined {
  if (!min && !max) return undefined
  const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'
  if (min && max) return `${symbol}${(min/1000).toFixed(0)}k-${(max/1000).toFixed(0)}k`
  if (min) return `From ${symbol}${(min/1000).toFixed(0)}k`
  if (max) return `Up to ${symbol}${(max/1000).toFixed(0)}k`
  return undefined
}

function generateVoiceSummary(
  jobs: JobSearchResult[],
  filters: { roleType?: string; location?: string; remote?: boolean; fractional?: boolean }
): string {
  if (jobs.length === 0) {
    const roleText = filters.roleType ? `${filters.roleType} ` : ''
    const locationText = filters.location ? ` in ${filters.location}` : ''
    return `I couldn't find any ${roleText}roles${locationText} right now. Try broadening your search or check back soon.`
  }

  const fractionalCount = jobs.filter(j => j.isFractional).length
  const remoteCount = jobs.filter(j => j.isRemote).length

  let summary = `I found ${jobs.length} role${jobs.length > 1 ? 's' : ''}`
  if (filters.roleType) summary += ` matching ${filters.roleType}`
  if (filters.location) summary += ` in ${filters.location}`
  summary += '.'

  if (fractionalCount > 0) {
    summary += ` ${fractionalCount} ${fractionalCount > 1 ? 'are' : 'is'} fractional.`
  }
  if (remoteCount > 0 && !filters.remote) {
    summary += ` ${remoteCount} offer remote work.`
  }

  if (jobs.length > 0) {
    const top = jobs[0]
    summary += ` The top result is a ${top.title} at ${top.company}.`
  }

  return summary
}
