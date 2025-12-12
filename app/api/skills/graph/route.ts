import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export interface SkillNode {
  id: number
  name: string
  category: string
  level: number
  parentId: number | null
  userCount?: number
}

export interface SkillEdge {
  source: number
  target: number
  type: 'parent' | 'related'
}

export interface SkillGraphData {
  nodes: SkillNode[]
  edges: SkillEdge[]
  categories: string[]
}

// GET /api/skills/graph - Get skill graph data for visualization
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId')

  try {
    // Get all skills
    const skills = await sql`
      SELECT
        s.id,
        s.name,
        s.category,
        s.depth_level as level,
        s.parent_skill_id as parent_id
      FROM skills s
      ORDER BY s.depth_level, s.category, s.name
    `

    // Get skill relationships
    const relationships = await sql`
      SELECT
        skill_id_1 as source,
        skill_id_2 as target,
        relationship_type as type
      FROM skill_relationships
    `

    // If userId provided, get their skills to highlight
    let userSkillIds: number[] = []
    if (userId) {
      const userSkills = await sql`
        SELECT skill_id FROM user_skills WHERE user_id = ${userId}
      `
      userSkillIds = userSkills.map(s => s.skill_id)
    }

    // Build nodes
    const nodes: SkillNode[] = skills.map(s => ({
      id: s.id,
      name: s.name,
      category: s.category || 'other',
      level: s.level || 1,
      parentId: s.parent_id,
      userHas: userSkillIds.includes(s.id)
    }))

    // Build edges from parent relationships
    const edges: SkillEdge[] = []

    // Parent-child edges
    nodes.forEach(node => {
      if (node.parentId) {
        edges.push({
          source: node.parentId,
          target: node.id,
          type: 'parent'
        })
      }
    })

    // Related skill edges
    relationships.forEach(r => {
      edges.push({
        source: r.source,
        target: r.target,
        type: 'related'
      })
    })

    // Get unique categories
    const categories = [...new Set(nodes.map(n => n.category))]

    return NextResponse.json({
      nodes,
      edges,
      categories,
      userSkillIds
    } as SkillGraphData & { userSkillIds: number[] })
  } catch (error) {
    console.error('Skill graph error:', error)
    return NextResponse.json(
      { error: 'Failed to load skill graph', details: String(error) },
      { status: 500 }
    )
  }
}
