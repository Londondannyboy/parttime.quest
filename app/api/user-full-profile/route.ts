import { NextResponse } from 'next/server'
import { stackServerApp } from '@/stack/server'
import { createDbQuery } from '@/lib/db'

export async function GET() {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sql = createDbQuery()

    // Fetch profile from users table
    const profileResults = await sql`
      SELECT
        id,
        neon_auth_id,
        email,
        first_name,
        last_name,
        current_country,
        destination_countries,
        budget_monthly,
        timeline,
        relocation_motivation as interests
      FROM users
      WHERE neon_auth_id = ${user.id}
      LIMIT 1
    `

    const profile = profileResults[0] || null

    // If we have a profile, fetch related data
    let skills: any[] = []
    let experiences: any[] = []
    let qualifications: any[] = []

    if (profile) {
      // Fetch skills
      const skillResults = await sql`
        SELECT id, skill_name, skill_level, years_experience
        FROM user_skills
        WHERE user_id = ${profile.id}
        ORDER BY years_experience DESC NULLS LAST
      `
      skills = skillResults

      // Fetch experiences
      const expResults = await sql`
        SELECT id, company_name, role_title, start_date, end_date
        FROM user_experiences
        WHERE user_id = ${profile.id}
        ORDER BY end_date DESC NULLS FIRST
      `
      experiences = expResults

      // Fetch qualifications
      const qualResults = await sql`
        SELECT id, qualification_name, institution, year_obtained
        FROM user_qualifications
        WHERE user_id = ${profile.id}
        ORDER BY year_obtained DESC NULLS LAST
      `
      qualifications = qualResults
    }

    return NextResponse.json({
      profile,
      skills,
      experiences,
      qualifications
    })
  } catch (error) {
    console.error('Error fetching full profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
