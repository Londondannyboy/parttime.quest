import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

// GET /api/jobs/summary - Get a voice-friendly summary of available jobs
// This can be fetched periodically to update Hume's knowledge
export async function GET() {
  try {
    // Get counts by category
    const stats = await sql`
      SELECT
        COUNT(*) FILTER (WHERE is_active = true) as total_active,
        COUNT(*) FILTER (WHERE is_active = true AND is_fractional = true) as fractional_count,
        COUNT(*) FILTER (WHERE is_active = true AND is_remote = true) as remote_count,
        COUNT(*) FILTER (WHERE is_active = true AND LOWER(title) LIKE '%cfo%') as cfo_count,
        COUNT(*) FILTER (WHERE is_active = true AND LOWER(title) LIKE '%cmo%') as cmo_count,
        COUNT(*) FILTER (WHERE is_active = true AND LOWER(title) LIKE '%cto%') as cto_count,
        COUNT(*) FILTER (WHERE is_active = true AND LOWER(title) LIKE '%coo%') as coo_count,
        COUNT(*) FILTER (WHERE is_active = true AND LOWER(location) LIKE '%london%') as london_count,
        COUNT(*) FILTER (WHERE is_active = true AND LOWER(location) LIKE '%manchester%') as manchester_count
      FROM jobs
    `

    const s = stats[0] as Record<string, string>

    // Get some featured roles
    const featured = await sql`
      SELECT title, company_name, location
      FROM jobs
      WHERE is_active = true AND is_fractional = true
      ORDER BY posted_date DESC NULLS LAST
      LIMIT 5
    ` as Array<{ title: string; company_name: string; location: string }>

    // Build voice-friendly summary
    const voiceSummary = buildVoiceSummary(s, featured)

    return NextResponse.json({
      stats: {
        total: parseInt(s.total_active),
        fractional: parseInt(s.fractional_count),
        remote: parseInt(s.remote_count),
        byRole: {
          cfo: parseInt(s.cfo_count),
          cmo: parseInt(s.cmo_count),
          cto: parseInt(s.cto_count),
          coo: parseInt(s.coo_count)
        },
        byLocation: {
          london: parseInt(s.london_count),
          manchester: parseInt(s.manchester_count)
        }
      },
      featured: featured.map(j => ({
        title: j.title,
        company: j.company_name,
        location: j.location
      })),
      voiceSummary,
      updatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Jobs summary error:', error)
    return NextResponse.json(
      { error: 'Failed to get summary', details: String(error) },
      { status: 500 }
    )
  }
}

function buildVoiceSummary(stats: Record<string, string>, featured: Array<{ title: string; company_name: string; location: string }>): string {
  const total = parseInt(stats.total_active)
  const fractional = parseInt(stats.fractional_count)
  const remote = parseInt(stats.remote_count)

  if (total === 0) {
    return "We're currently building our job listings. Check back soon for new part-time executive opportunities."
  }

  let summary = `We currently have ${total} active role${total > 1 ? 's' : ''}`

  if (fractional > 0) {
    summary += `, including ${fractional} part-time position${fractional > 1 ? 's' : ''}`
  }

  summary += '.'

  // Role breakdown
  const cfo = parseInt(stats.cfo_count)
  const cmo = parseInt(stats.cmo_count)
  const cto = parseInt(stats.cto_count)
  const coo = parseInt(stats.coo_count)

  const roleCounts = []
  if (cfo > 0) roleCounts.push(`${cfo} CFO`)
  if (cto > 0) roleCounts.push(`${cto} CTO`)
  if (cmo > 0) roleCounts.push(`${cmo} CMO`)
  if (coo > 0) roleCounts.push(`${coo} COO`)

  if (roleCounts.length > 0) {
    summary += ` This includes ${roleCounts.join(', ')} role${roleCounts.length > 1 || parseInt(roleCounts[0]) > 1 ? 's' : ''}.`
  }

  // Location info
  const london = parseInt(stats.london_count)
  if (london > 0) {
    summary += ` ${london} are based in London.`
  }

  if (remote > 0) {
    summary += ` ${remote} offer remote work.`
  }

  // Featured role
  if (featured.length > 0) {
    const top = featured[0]
    summary += ` One of our latest listings is a ${top.title} at ${top.company_name}.`
  }

  return summary
}
