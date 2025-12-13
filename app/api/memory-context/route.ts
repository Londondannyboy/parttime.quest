import { NextResponse } from 'next/server'
import { stackServerApp } from '@/stack/server'
import { getConversationContext } from '@/lib/supermemory'

/**
 * Get memory context from Supermemory for the current user
 * Used to give Quest context from previous conversations
 */
export async function GET() {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ context: '' })
    }

    console.log('[Memory Context] Fetching for user:', user.id)

    // Get context relevant to fractional job discussions
    const context = await getConversationContext(
      user.id,
      'fractional jobs career skills experience preferences'
    )

    if (context) {
      console.log('[Memory Context] Found:', context.substring(0, 100))
    } else {
      console.log('[Memory Context] No previous context found')
    }

    return NextResponse.json({
      context: context || '',
      hasMemories: !!context
    })
  } catch (error) {
    console.error('[Memory Context] Error:', error)
    return NextResponse.json({ context: '', error: String(error) })
  }
}
