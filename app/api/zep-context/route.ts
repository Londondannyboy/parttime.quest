import { NextRequest, NextResponse } from 'next/server'
import {
  getUserGraphNodes,
  getUserGraphEdges,
  searchUserGraph,
  getZepClient,
  addToUserGraph,
  ZepNode,
  ZepEdge,
} from '@/lib/zep-client'

/**
 * GET /api/zep-context - Get user's knowledge graph context for voice assistant
 *
 * Fetches user's skills, experiences, and preferences from ZEP and formats
 * them as context for the voice assistant.
 */
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId')
  const query = request.nextUrl.searchParams.get('query') || 'career skills experience preferences'

  if (!userId) {
    return NextResponse.json(
      { error: 'userId required' },
      { status: 400 }
    )
  }

  const zepClient = getZepClient()
  if (!zepClient) {
    return NextResponse.json({
      context: '',
      source: 'disabled',
      message: 'ZEP_API_KEY not configured'
    })
  }

  try {
    // Fetch both graph data and search results in parallel
    const [nodes, edges, searchResults] = await Promise.all([
      getUserGraphNodes(userId),
      getUserGraphEdges(userId),
      searchUserGraph(userId, query, { limit: 10 })
    ])

    // Build context from graph data
    const contextParts: string[] = []

    // Extract skills from nodes
    const skillNodes = nodes.filter(n =>
      n.labels?.some(l => l.toLowerCase().includes('skill'))
    )
    if (skillNodes.length > 0) {
      const skills = skillNodes.map(n => n.name).slice(0, 10)
      contextParts.push(`User skills: ${skills.join(', ')}`)
    }

    // Extract companies/experience from nodes
    const companyNodes = nodes.filter(n =>
      n.labels?.some(l =>
        l.toLowerCase().includes('company') ||
        l.toLowerCase().includes('organization')
      )
    )
    if (companyNodes.length > 0) {
      const companies = companyNodes.map(n => n.name).slice(0, 5)
      contextParts.push(`Past companies: ${companies.join(', ')}`)
    }

    // Extract preferences from nodes
    const prefNodes = nodes.filter(n =>
      n.labels?.some(l => l.toLowerCase().includes('preference'))
    )
    if (prefNodes.length > 0) {
      const prefs = prefNodes.map(n => n.name).slice(0, 5)
      contextParts.push(`Preferences: ${prefs.join(', ')}`)
    }

    // Extract facts/relationships from edges
    const relevantFacts = edges
      .filter(e => e.fact && e.fact.length > 10)
      .map(e => e.fact)
      .slice(0, 5)
    if (relevantFacts.length > 0) {
      contextParts.push(`Known facts: ${relevantFacts.join('; ')}`)
    }

    // Add search results context
    if (searchResults.nodes.length > 0) {
      const searchContext = searchResults.nodes
        .map(n => `${n.name}${n.summary ? `: ${n.summary}` : ''}`)
        .slice(0, 5)
        .join('; ')
      if (searchContext) {
        contextParts.push(`Relevant knowledge: ${searchContext}`)
      }
    }

    const context = contextParts.join('\n')

    return NextResponse.json({
      context,
      source: 'zep',
      stats: {
        nodeCount: nodes.length,
        edgeCount: edges.length,
        skillCount: skillNodes.length,
        companyCount: companyNodes.length,
        preferenceCount: prefNodes.length,
        searchResultCount: searchResults.nodes.length
      }
    })
  } catch (error) {
    console.error('ZEP context error:', error)
    return NextResponse.json({
      context: '',
      source: 'error',
      error: String(error)
    })
  }
}

/**
 * POST /api/zep-context - Add data to user's knowledge graph
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, preference } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'userId required' },
        { status: 400 }
      )
    }

    const zepClient = getZepClient()
    if (!zepClient) {
      return NextResponse.json({
        saved: false,
        reason: 'ZEP_API_KEY not configured'
      })
    }

    // If a preference is provided, add it to the graph
    if (preference) {
      const { type, values, validated, raw_text } = preference

      // Format data for ZEP graph
      const graphData = {
        type: `user_${type}`,
        values,
        validated,
        raw_text,
        timestamp: new Date().toISOString(),
        context: `User ${validated ? 'confirmed' : 'mentioned'} ${type}: ${values.join(', ')}`
      }

      // Use the helper function which handles user creation
      const result = await addToUserGraph(userId, graphData, 'json')

      if (result) {
        console.log(`[ZEP] Added ${type} preference for user ${userId}:`, values)
        return NextResponse.json({
          saved: true,
          type,
          values
        })
      } else {
        return NextResponse.json({
          saved: false,
          reason: 'Failed to add to ZEP graph'
        })
      }
    }

    return NextResponse.json({
      saved: false,
      reason: 'No preference provided'
    })
  } catch (error) {
    console.error('ZEP save error:', error)
    return NextResponse.json(
      { error: 'Failed to save to ZEP', details: String(error) },
      { status: 500 }
    )
  }
}
