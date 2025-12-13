import { NextResponse } from 'next/server'
import { getConversationContext } from '@/lib/supermemory'

/**
 * Get Supermemory context for a user
 * POST /api/supermemory-context
 * Body: { userId: string, query: string }
 * Returns: { context: string }
 */
export async function POST(request: Request) {
  try {
    const { userId, query } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    // Get relevant context from Supermemory
    const context = await getConversationContext(userId, query || 'career preferences skills experience')

    return NextResponse.json({ context: context || '' })

  } catch (error) {
    console.error('[Supermemory Context] Error:', error)
    // Return empty context on error - don't block the voice flow
    return NextResponse.json({ context: '' })
  }
}
