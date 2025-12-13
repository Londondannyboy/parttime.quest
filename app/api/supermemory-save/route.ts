import { NextResponse } from 'next/server'
import { storeConversationMemory } from '@/lib/supermemory'

/**
 * Save conversation transcript to Supermemory
 * POST /api/supermemory-save
 * Body: { userId: string, transcript: string, metadata?: object }
 */
export async function POST(request: Request) {
  try {
    const { userId, transcript, metadata } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    if (!transcript || transcript.trim().length < 20) {
      // Don't save very short or empty conversations
      return NextResponse.json({ saved: false, reason: 'Transcript too short' })
    }

    console.log('[Supermemory Save] Saving conversation for user:', userId)
    console.log('[Supermemory Save] Transcript length:', transcript.length)

    // Extract skills, preferences from the conversation
    // This is a simple extraction - could be enhanced with Pydantic AI later
    const extractedData: {
      skills?: string[]
      companies?: string[]
      preferences?: string[]
    } = {}

    // Simple keyword extraction for now
    const lowerTranscript = transcript.toLowerCase()

    // Look for role mentions
    const roles = ['cfo', 'cmo', 'cto', 'coo', 'chro', 'cpo', 'vp', 'director', 'head of']
    const foundRoles = roles.filter(r => lowerTranscript.includes(r))
    if (foundRoles.length > 0) {
      extractedData.preferences = foundRoles
    }

    // Look for industry mentions
    const industries = ['fintech', 'healthtech', 'edtech', 'saas', 'b2b', 'b2c', 'ecommerce', 'retail', 'manufacturing']
    const foundIndustries = industries.filter(i => lowerTranscript.includes(i))
    if (foundIndustries.length > 0) {
      extractedData.skills = foundIndustries // Using skills field for industries
    }

    await storeConversationMemory(userId, transcript, extractedData)

    return NextResponse.json({
      saved: true,
      transcriptLength: transcript.length,
      extracted: extractedData
    })

  } catch (error) {
    console.error('[Supermemory Save] Error:', error)
    return NextResponse.json({
      saved: false,
      error: String(error)
    }, { status: 500 })
  }
}
