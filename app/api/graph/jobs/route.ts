import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import {
  buildJobsGraph,
  searchJobsGraph,
  syncJobsToZep,
  syncJobToZep,
  getZepClient,
  GraphData,
} from '@/lib/zep-client'

const sql = neon(process.env.DATABASE_URL!)

// GET /api/graph/jobs - Get jobs knowledge graph
export async function GET(request: NextRequest) {
  const roleFilter = request.nextUrl.searchParams.get('role')
  const searchQuery = request.nextUrl.searchParams.get('q')
  const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20')
  const source = request.nextUrl.searchParams.get('source') || 'auto'

  try {
    // If there's a search query and Zep is available, search Zep graph
    const zepClient = getZepClient()

    if (zepClient && searchQuery && source !== 'local') {
      try {
        const zepResults = await searchJobsGraph(searchQuery, { limit })

        if (zepResults.nodes.length > 0 || zepResults.edges.length > 0) {
          // Build graph from Zep search results
          const nodes = zepResults.nodes.map((n, i) => ({
            id: `zep-${i}`,
            type: 'job' as const,
            label: n.name,
            data: { summary: n.summary, labels: n.labels },
          }))

          const edges = zepResults.edges.map((e, i) => ({
            source: `zep-${i}`,
            target: `zep-${(i + 1) % zepResults.nodes.length}`,
            type: 'related',
            label: e.fact?.substring(0, 40),
          }))

          return NextResponse.json({
            graph: { nodes, edges },
            source: 'zep',
            stats: {
              totalJobs: zepResults.nodes.length,
              factsFound: zepResults.edges.length,
            },
          })
        }
      } catch (zepError) {
        console.warn('Zep search failed, falling back to local:', zepError)
      }
    }

    // Fall back to local database
    let jobs
    if (roleFilter) {
      jobs = await sql`
        SELECT
          id,
          title,
          slug,
          company_name,
          company_domain,
          location,
          skills_required,
          role_category
        FROM jobs
        WHERE is_active = true
          AND is_fractional = true
          AND LOWER(title) LIKE LOWER(${`%${roleFilter}%`})
        ORDER BY posted_date DESC NULLS LAST
        LIMIT ${limit}
      `
    } else if (searchQuery) {
      jobs = await sql`
        SELECT
          id,
          title,
          slug,
          company_name,
          company_domain,
          location,
          skills_required,
          role_category
        FROM jobs
        WHERE is_active = true
          AND is_fractional = true
          AND (
            LOWER(title) LIKE LOWER(${`%${searchQuery}%`})
            OR LOWER(company_name) LIKE LOWER(${`%${searchQuery}%`})
            OR skills_required::text ILIKE ${`%${searchQuery}%`}
          )
        ORDER BY posted_date DESC NULLS LAST
        LIMIT ${limit}
      `
    } else {
      jobs = await sql`
        SELECT
          id,
          title,
          slug,
          company_name,
          company_domain,
          location,
          skills_required,
          role_category
        FROM jobs
        WHERE is_active = true AND is_fractional = true
        ORDER BY posted_date DESC NULLS LAST
        LIMIT ${limit}
      `
    }

    // Build the graph
    const graph: GraphData = await buildJobsGraph(
      jobs.map(j => ({
        id: String(j.id),
        title: j.title,
        slug: j.slug,
        company: j.company_name || 'Unknown Company',
        companyDomain: j.company_domain,
        skills: parseSkills(j.skills_required),
        location: j.location || 'UK',
      })),
      limit
    )

    // Calculate stats
    const skillCounts = new Map<string, number>()
    const companyCounts = new Map<string, number>()

    jobs.forEach(j => {
      const company = j.company_name || 'Unknown'
      companyCounts.set(company, (companyCounts.get(company) || 0) + 1)

      const skills = parseSkills(j.skills_required)
      skills.forEach(skill => {
        skillCounts.set(skill, (skillCounts.get(skill) || 0) + 1)
      })
    })

    const topSkills = Array.from(skillCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([skill, count]) => ({ skill, count }))

    const topCompanies = Array.from(companyCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([company, count]) => ({ company, count }))

    return NextResponse.json({
      graph,
      source: 'local',
      stats: {
        totalJobs: jobs.length,
        uniqueSkills: skillCounts.size,
        uniqueCompanies: companyCounts.size,
        topSkills,
        topCompanies,
      },
    })
  } catch (error) {
    console.error('Jobs graph error:', error)
    return NextResponse.json(
      { error: 'Failed to build jobs graph', details: String(error) },
      { status: 500 }
    )
  }
}

// POST /api/graph/jobs - Sync jobs to Zep graph
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action = 'sync-all', jobId, limit = 100 } = body

    // Authenticate (use a simple secret for now)
    const authHeader = request.headers.get('authorization')
    const expectedSecret = process.env.REVALIDATE_SECRET
    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (action === 'sync-one' && jobId) {
      // Sync a single job
      const jobs = await sql`
        SELECT
          id,
          title,
          company_name,
          location,
          skills_required,
          description,
          day_rate_min,
          day_rate_max,
          role_category
        FROM jobs
        WHERE id = ${jobId}
        LIMIT 1
      `

      if (jobs.length === 0) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 })
      }

      const job = jobs[0]
      const success = await syncJobToZep({
        id: String(job.id),
        title: job.title,
        company: job.company_name || 'Unknown',
        location: job.location || 'UK',
        skills: parseSkills(job.skills_required),
        description: job.description,
        dayRate: { min: job.day_rate_min, max: job.day_rate_max },
        roleCategory: job.role_category,
      })

      return NextResponse.json({
        success,
        jobId: job.id,
        message: success ? 'Job synced to Zep' : 'Failed to sync job',
      })
    }

    // Sync all jobs
    const jobs = await sql`
      SELECT
        id,
        title,
        company_name,
        location,
        skills_required,
        description,
        day_rate_min,
        day_rate_max,
        role_category
      FROM jobs
      WHERE is_active = true AND is_fractional = true
      ORDER BY posted_date DESC NULLS LAST
      LIMIT ${limit}
    `

    const results = await syncJobsToZep(
      jobs.map(job => ({
        id: String(job.id),
        title: job.title,
        company: job.company_name || 'Unknown',
        location: job.location || 'UK',
        skills: parseSkills(job.skills_required),
        description: job.description,
        dayRate: { min: job.day_rate_min, max: job.day_rate_max },
        roleCategory: job.role_category,
      }))
    )

    return NextResponse.json({
      success: true,
      totalJobs: jobs.length,
      synced: results.success,
      failed: results.failed,
      message: `Synced ${results.success}/${jobs.length} jobs to Zep`,
    })
  } catch (error) {
    console.error('Jobs sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync jobs', details: String(error) },
      { status: 500 }
    )
  }
}

// Parse skills from various formats
function parseSkills(skills: unknown): string[] {
  if (!skills) return []

  if (Array.isArray(skills)) {
    return skills.filter(s => typeof s === 'string' && s.length > 0)
  }

  if (typeof skills === 'string') {
    try {
      const parsed = JSON.parse(skills)
      if (Array.isArray(parsed)) {
        return parsed.filter(s => typeof s === 'string' && s.length > 0)
      }
    } catch {
      return skills
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0)
    }
  }

  return []
}
