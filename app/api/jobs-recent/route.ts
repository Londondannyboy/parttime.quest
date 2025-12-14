import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

/**
 * Get recent part-time jobs for display
 */
export async function GET() {
  try {
    const jobs = await sql`
      SELECT
        slug,
        title,
        company_name as company,
        location,
        is_remote,
        compensation
      FROM jobs
      WHERE is_active = true
        AND (is_fractional = true OR LOWER(title) LIKE '%part-time%')
      ORDER BY posted_date DESC NULLS LAST
      LIMIT 5
    `

    return NextResponse.json(jobs)
  } catch (error) {
    console.error('[jobs-recent] Error:', error)
    return NextResponse.json([], { status: 500 })
  }
}
