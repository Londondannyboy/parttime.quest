import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { buildJobsGraph, GraphData } from '@/lib/zep-client'

const sql = neon(process.env.DATABASE_URL!)

// GET /api/graph/jobs - Get jobs knowledge graph
export async function GET(request: NextRequest) {
  const roleFilter = request.nextUrl.searchParams.get('role')
  const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20')

  try {
    // Fetch jobs with their skills
    let jobs
    if (roleFilter) {
      jobs = await sql`
        SELECT
          id,
          title,
          company_name,
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
    } else {
      jobs = await sql`
        SELECT
          id,
          title,
          company_name,
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
        company: j.company_name || 'Unknown Company',
        skills: parseSkills(j.skills_required),
        location: j.location || 'UK',
      })),
      limit
    )

    // Calculate stats
    const skillCounts = new Map<string, number>()
    const companyCounts = new Map<string, number>()

    jobs.forEach(j => {
      // Count companies
      const company = j.company_name || 'Unknown'
      companyCounts.set(company, (companyCounts.get(company) || 0) + 1)

      // Count skills
      const skills = parseSkills(j.skills_required)
      skills.forEach(skill => {
        skillCounts.set(skill, (skillCounts.get(skill) || 0) + 1)
      })
    })

    // Top skills
    const topSkills = Array.from(skillCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([skill, count]) => ({ skill, count }))

    // Top companies
    const topCompanies = Array.from(companyCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([company, count]) => ({ company, count }))

    return NextResponse.json({
      graph,
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

// Parse skills from various formats
function parseSkills(skills: unknown): string[] {
  if (!skills) return []

  // If it's already an array
  if (Array.isArray(skills)) {
    return skills.filter(s => typeof s === 'string' && s.length > 0)
  }

  // If it's a string (comma-separated or JSON)
  if (typeof skills === 'string') {
    // Try JSON parse
    try {
      const parsed = JSON.parse(skills)
      if (Array.isArray(parsed)) {
        return parsed.filter(s => typeof s === 'string' && s.length > 0)
      }
    } catch {
      // Fall back to comma-separated
      return skills
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0)
    }
  }

  return []
}
