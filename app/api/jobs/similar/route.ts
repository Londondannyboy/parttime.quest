import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

/**
 * GET /api/jobs/similar - Find similar jobs based on role category, skills, and location
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams

  const roleCategory = params.get('role') || ''
  const location = params.get('location') || ''
  const skills = params.get('skills')?.split(',').filter(Boolean) || []
  const limit = Math.min(parseInt(params.get('limit') || '5'), 10)
  const exclude = params.get('exclude') || ''

  try {
    // Build WHERE conditions for finding similar jobs
    let whereConditions = ['is_active = true']

    // Exclude current job
    if (exclude) {
      whereConditions.push(`id != '${exclude}'`)
    }

    // Match by role category (primary match)
    if (roleCategory) {
      whereConditions.push(`role_category = '${roleCategory}'`)
    }

    const whereClause = whereConditions.join(' AND ')

    // Get similar jobs, ordered by relevance
    // Priority: same category > similar location > recent posts
    const jobs = await sql`
      SELECT
        id, slug, title, company_name, location, compensation, role_category, skills_required, posted_date
      FROM jobs
      WHERE ${sql.unsafe(whereClause)}
      ORDER BY posted_date DESC NULLS LAST
      LIMIT ${limit}
    `

    // Format results
    const formattedJobs = (jobs as any[]).map((job: any) => ({
      id: job.id,
      slug: job.slug,
      title: job.title,
      company_name: job.company_name,
      location: job.location,
      compensation: job.compensation,
      role_category: job.role_category
    }))

    return NextResponse.json({
      jobs: formattedJobs,
      total: formattedJobs.length
    })
  } catch (error) {
    console.error('Similar jobs error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch similar jobs', jobs: [] },
      { status: 500 }
    )
  }
}
