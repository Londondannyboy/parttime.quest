import { NextResponse } from 'next/server'
import { getSupermemoryClient, storeConversationMemory, getConversationContext } from '@/lib/supermemory'

/**
 * Test endpoint for Supermemory integration
 * GET /api/supermemory-test - Check if configured
 * POST /api/supermemory-test - Test storing and retrieving a memory
 */

export async function GET() {
  const hasApiKey = !!process.env.SUPERMEMORY_API_KEY
  const client = getSupermemoryClient()

  return NextResponse.json({
    configured: hasApiKey,
    clientCreated: !!client,
    apiKeyPreview: hasApiKey ? process.env.SUPERMEMORY_API_KEY?.substring(0, 8) + '...' : null
  })
}

export async function POST(request: Request) {
  try {
    const { userId, action } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    const client = getSupermemoryClient()
    if (!client) {
      return NextResponse.json({
        error: 'Supermemory not configured',
        hint: 'Set SUPERMEMORY_API_KEY environment variable'
      }, { status: 500 })
    }

    if (action === 'test-store') {
      // Store a test memory
      const testContent = `Test memory from Part-Time Quest at ${new Date().toISOString()}`
      console.log('[Supermemory Test] Storing test memory for user:', userId)

      await storeConversationMemory(userId, testContent)

      return NextResponse.json({
        success: true,
        action: 'stored',
        content: testContent
      })
    }

    if (action === 'test-search') {
      // Search memories
      console.log('[Supermemory Test] Searching memories for user:', userId)

      const context = await getConversationContext(userId, 'test')

      return NextResponse.json({
        success: true,
        action: 'searched',
        context: context || 'No memories found'
      })
    }

    if (action === 'get-all') {
      // Get all memories for user
      console.log('[Supermemory Test] Getting all memories for user:', userId)

      const memories = await client.getMemories(userId, 10)

      return NextResponse.json({
        success: true,
        action: 'get-all',
        count: memories.length,
        memories: memories.map(m => ({
          id: m.id,
          preview: m.content.substring(0, 100),
          createdAt: m.createdAt
        }))
      })
    }

    return NextResponse.json({ error: 'Invalid action. Use: test-store, test-search, get-all' }, { status: 400 })

  } catch (error) {
    console.error('[Supermemory Test] Error:', error)
    return NextResponse.json({
      error: 'Test failed',
      details: String(error)
    }, { status: 500 })
  }
}
