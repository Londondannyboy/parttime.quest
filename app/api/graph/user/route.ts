import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { buildUserGraph, GraphData } from '@/lib/zep-client'

const sql = neon(process.env.DATABASE_URL!)

// GET /api/graph/user - Get user's knowledge graph
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId')

  if (!userId) {
    return NextResponse.json(
      { error: 'userId required' },
      { status: 400 }
    )
  }

  try {
    // Fetch user's confirmed skills
    const skills = await sql`
      SELECT
        s.id,
        s.name,
        s.category,
        us.confidence
      FROM user_skills us
      JOIN skills s ON us.skill_id = s.id
      WHERE us.user_id = ${userId}
      ORDER BY us.confidence DESC
      LIMIT 20
    `

    // Fetch user's companies from extraction_pending (confirmed items)
    const companies = await sql`
      SELECT DISTINCT
        id::text,
        (extracted_data->>'name') as name,
        (extracted_data->>'role') as role
      FROM extraction_pending
      WHERE user_id = ${userId}
        AND item_type = 'company'
        AND status = 'confirmed'
      LIMIT 10
    `

    // Fetch user's preferences
    const preferences = await sql`
      SELECT
        preference_type as type,
        preference_value as value
      FROM user_preferences
      WHERE user_id = ${userId}
      LIMIT 10
    `

    // Fetch matched jobs (if any job matching exists)
    const matchedJobs = await sql`
      SELECT
        j.id,
        j.title,
        j.company_name as company,
        0.85 as match_score
      FROM jobs j
      WHERE j.is_active = true AND j.is_fractional = true
      ORDER BY j.posted_date DESC NULLS LAST
      LIMIT 5
    `

    // Build the graph
    const graph: GraphData = await buildUserGraph(
      userId,
      skills.map(s => ({
        id: String(s.id),
        name: s.name,
        category: s.category || 'other',
        confidence: Number(s.confidence) || 0.8,
      })),
      companies.map(c => ({
        id: c.id,
        name: c.name,
        role: c.role,
      })),
      preferences.map(p => ({
        type: p.type,
        value: p.value,
      })),
      matchedJobs.map(j => ({
        id: String(j.id),
        title: j.title,
        company: j.company,
        matchScore: Number(j.match_score),
      }))
    )

    return NextResponse.json({
      graph,
      stats: {
        skillCount: skills.length,
        companyCount: companies.length,
        preferenceCount: preferences.length,
        matchedJobCount: matchedJobs.length,
      },
    })
  } catch (error) {
    console.error('User graph error:', error)
    return NextResponse.json(
      { error: 'Failed to build user graph', details: String(error) },
      { status: 500 }
    )
  }
}
