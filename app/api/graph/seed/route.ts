import { NextRequest, NextResponse } from 'next/server'
import { getZepClient, ensureZepUser } from '@/lib/zep-client'

// POST /api/graph/seed - Seed a user's Zep graph with test data (for demo purposes)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, email, firstName, lastName } = body

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    const client = getZepClient()
    if (!client) {
      return NextResponse.json({ error: 'Zep not configured' }, { status: 500 })
    }

    // Create/ensure user
    await ensureZepUser(userId, { email, firstName, lastName })

    // Add professional profile with skills
    const skillsData = {
      type: 'professional_profile',
      person: `${firstName || ''} ${lastName || ''}`.trim() || userId,
      role: 'Part-Time Executive & Entrepreneur',
      skills: [
        { name: 'Product Strategy', category: 'leadership', years: 12, proficiency: 'expert' },
        { name: 'Go-to-Market', category: 'strategy', years: 10, proficiency: 'expert' },
        { name: 'Team Leadership', category: 'leadership', years: 15, proficiency: 'expert' },
        { name: 'AI/ML Product Development', category: 'technical', years: 5, proficiency: 'advanced' },
        { name: 'Startup Scaling', category: 'strategy', years: 8, proficiency: 'expert' },
        { name: 'Revenue Growth', category: 'business', years: 10, proficiency: 'expert' },
        { name: 'B2B SaaS', category: 'domain', years: 12, proficiency: 'expert' },
        { name: 'TypeScript', category: 'technical', years: 6, proficiency: 'advanced' },
        { name: 'Next.js', category: 'technical', years: 4, proficiency: 'advanced' },
        { name: 'Python', category: 'technical', years: 8, proficiency: 'advanced' },
      ],
      summary: 'Seasoned part-time executive with 15+ years of experience in product, strategy, and technology leadership.',
    }

    await client.graph.add({
      userId,
      type: 'json',
      data: JSON.stringify(skillsData),
    })

    // Add work experience
    const experienceData = {
      type: 'work_history',
      experiences: [
        { company: 'Quest Network', role: 'Founder & CEO', startYear: 2023, isCurrent: true, industry: 'Technology' },
        { company: 'Predeploy', role: 'Co-Founder', startYear: 2024, isCurrent: true, industry: 'AI/Dev Tools' },
        { company: 'Tech Startup (Series B)', role: 'Part-Time CPO', startYear: 2022, endYear: 2023, industry: 'FinTech' },
        { company: 'Enterprise SaaS', role: 'VP Product', startYear: 2019, endYear: 2022, industry: 'SaaS' },
      ],
      summary: 'Founded multiple companies and held senior product/exec roles at high-growth startups.',
    }

    await client.graph.add({
      userId,
      type: 'json',
      data: JSON.stringify(experienceData),
    })

    // Add preferences
    const preferencesData = {
      type: 'job_preferences',
      looking_for: ['Part-Time CPO', 'Part-Time CTO', 'Board Advisor'],
      industries: ['AI/ML', 'SaaS', 'FinTech', 'Climate Tech'],
      locations: ['London', 'Remote'],
      day_rate_range: '800-1500 GBP',
      availability: '2-3 days per week',
      summary: 'Open to part-time C-level roles in technology companies, particularly AI-first startups.',
    }

    await client.graph.add({
      userId,
      type: 'json',
      data: JSON.stringify(preferencesData),
    })

    return NextResponse.json({
      success: true,
      message: `Seeded Zep graph for user ${userId}`,
      added: {
        skills: skillsData.skills.length,
        experiences: experienceData.experiences.length,
        preferences: true,
      },
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: 'Failed to seed user graph', details: String(error) },
      { status: 500 }
    )
  }
}
