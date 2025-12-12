import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { getZepClient, ensureZepUser } from '@/lib/zep-client'

const sql = neon(process.env.DATABASE_URL!)

// POST /api/repo/skills - Add a skill to user's repo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, skillName, category, yearsExperience, proficiency } = body

    if (!userId || !skillName) {
      return NextResponse.json(
        { error: 'userId and skillName required' },
        { status: 400 }
      )
    }

    // First, find or create the skill in the skills table
    let skill = await sql`
      SELECT id, name, category FROM skills WHERE LOWER(name) = LOWER(${skillName}) LIMIT 1
    `

    let skillId: number
    if (skill.length === 0) {
      // Create new skill
      const newSkill = await sql`
        INSERT INTO skills (name, category)
        VALUES (${skillName}, ${category || 'general'})
        RETURNING id, name, category
      `
      skillId = newSkill[0].id
    } else {
      skillId = skill[0].id
    }

    // Check if user already has this skill
    const existing = await sql`
      SELECT id FROM user_skills WHERE user_id = ${userId} AND skill_id = ${skillId}
    `

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Skill already exists in your repo' },
        { status: 409 }
      )
    }

    // Add to user_skills
    const userSkill = await sql`
      INSERT INTO user_skills (user_id, skill_id, proficiency_level, years_experience, confirmed, confidence, source)
      VALUES (${userId}, ${skillId}, ${proficiency || null}, ${yearsExperience || null}, true, 1.0, 'manual')
      RETURNING id, skill_id, proficiency_level, years_experience, confirmed
    `

    // Sync to Zep
    const client = getZepClient()
    if (client) {
      try {
        await ensureZepUser(userId)
        await client.graph.add({
          userId,
          type: 'json',
          data: JSON.stringify({
            type: 'skill_added',
            skill_name: skillName,
            category: category || 'general',
            years_experience: yearsExperience,
            proficiency: proficiency,
            added_manually: true,
            timestamp: new Date().toISOString(),
          }),
        })
      } catch (zepError) {
        console.error('Zep sync error (non-fatal):', zepError)
      }
    }

    return NextResponse.json({
      success: true,
      skill: {
        id: userSkill[0].id,
        skill_id: skillId,
        skill_name: skillName,
        skill_category: category || 'general',
        proficiency_level: proficiency,
        years_experience: yearsExperience,
        confirmed: true,
        confidence: 1.0,
      },
    })
  } catch (error) {
    console.error('Add skill error:', error)
    return NextResponse.json(
      { error: 'Failed to add skill', details: String(error) },
      { status: 500 }
    )
  }
}

// DELETE /api/repo/skills - Remove a skill from user's repo
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, userSkillId } = body

    if (!userId || !userSkillId) {
      return NextResponse.json(
        { error: 'userId and userSkillId required' },
        { status: 400 }
      )
    }

    // Get skill info before deleting (for Zep)
    const skillInfo = await sql`
      SELECT us.id, s.name as skill_name
      FROM user_skills us
      LEFT JOIN skills s ON us.skill_id = s.id
      WHERE us.id = ${userSkillId} AND us.user_id = ${userId}
    `

    if (skillInfo.length === 0) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      )
    }

    // Delete from user_skills
    await sql`
      DELETE FROM user_skills WHERE id = ${userSkillId} AND user_id = ${userId}
    `

    // Note: We don't remove from Zep as the graph is append-only
    // The skill will remain in the user's knowledge history

    return NextResponse.json({
      success: true,
      removed: {
        id: userSkillId,
        skill_name: skillInfo[0].skill_name,
      },
    })
  } catch (error) {
    console.error('Delete skill error:', error)
    return NextResponse.json(
      { error: 'Failed to remove skill', details: String(error) },
      { status: 500 }
    )
  }
}
