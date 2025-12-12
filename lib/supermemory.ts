/**
 * Supermemory Integration for Conversational Context
 *
 * Provides persistent memory for conversations with Quest voice agent.
 * Memories are stored per user and can be searched semantically.
 */

const SUPERMEMORY_API_URL = 'https://api.supermemory.ai/v1'

interface Memory {
  id: string
  content: string
  metadata?: Record<string, unknown>
  createdAt: string
}

interface AddMemoryResponse {
  id: string
  success: boolean
}

interface SearchResult {
  id: string
  content: string
  score: number
  metadata?: Record<string, unknown>
}

class SupermemoryClient {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  /**
   * Add a memory for a user
   */
  async addMemory(
    userId: string,
    content: string,
    metadata?: Record<string, unknown>
  ): Promise<AddMemoryResponse> {
    const response = await fetch(`${SUPERMEMORY_API_URL}/memories`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        userId,
        metadata: {
          ...metadata,
          source: 'fractional-quest',
          timestamp: new Date().toISOString(),
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Supermemory add error:', error)
      throw new Error(`Failed to add memory: ${error}`)
    }

    return response.json()
  }

  /**
   * Search memories for a user
   */
  async searchMemories(
    userId: string,
    query: string,
    limit = 10
  ): Promise<SearchResult[]> {
    const response = await fetch(`${SUPERMEMORY_API_URL}/memories/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        userId,
        limit,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Supermemory search error:', error)
      throw new Error(`Failed to search memories: ${error}`)
    }

    const data = await response.json()
    return data.results || []
  }

  /**
   * Get all memories for a user
   */
  async getMemories(userId: string, limit = 50): Promise<Memory[]> {
    const response = await fetch(
      `${SUPERMEMORY_API_URL}/memories?userId=${encodeURIComponent(userId)}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('Supermemory get error:', error)
      throw new Error(`Failed to get memories: ${error}`)
    }

    const data = await response.json()
    return data.memories || []
  }

  /**
   * Delete a memory
   */
  async deleteMemory(memoryId: string): Promise<void> {
    const response = await fetch(`${SUPERMEMORY_API_URL}/memories/${memoryId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Supermemory delete error:', error)
      throw new Error(`Failed to delete memory: ${error}`)
    }
  }
}

// Singleton instance
let supermemoryClient: SupermemoryClient | null = null

export function getSupermemoryClient(): SupermemoryClient | null {
  const apiKey = process.env.SUPERMEMORY_API_KEY

  if (!apiKey) {
    console.warn('SUPERMEMORY_API_KEY not configured')
    return null
  }

  if (!supermemoryClient) {
    supermemoryClient = new SupermemoryClient(apiKey)
  }

  return supermemoryClient
}

/**
 * Store conversation context for a user
 */
export async function storeConversationMemory(
  userId: string,
  transcript: string,
  extractedData?: {
    skills?: string[]
    companies?: string[]
    preferences?: string[]
  }
): Promise<void> {
  const client = getSupermemoryClient()
  if (!client) return

  try {
    // Store the conversation transcript
    await client.addMemory(userId, transcript, {
      type: 'conversation',
      extractedData,
    })

    // Also store individual extracted items as separate memories for better retrieval
    if (extractedData?.skills?.length) {
      await client.addMemory(
        userId,
        `Skills mentioned: ${extractedData.skills.join(', ')}`,
        { type: 'skills' }
      )
    }

    if (extractedData?.companies?.length) {
      await client.addMemory(
        userId,
        `Companies mentioned: ${extractedData.companies.join(', ')}`,
        { type: 'companies' }
      )
    }

    if (extractedData?.preferences?.length) {
      await client.addMemory(
        userId,
        `Preferences: ${extractedData.preferences.join(', ')}`,
        { type: 'preferences' }
      )
    }
  } catch (error) {
    console.error('Error storing conversation memory:', error)
  }
}

/**
 * Get relevant context for a conversation
 */
export async function getConversationContext(
  userId: string,
  currentQuery: string
): Promise<string> {
  const client = getSupermemoryClient()
  if (!client) return ''

  try {
    const memories = await client.searchMemories(userId, currentQuery, 5)

    if (memories.length === 0) return ''

    const context = memories
      .map(m => m.content)
      .join('\n\n')

    return `Previous context:\n${context}`
  } catch (error) {
    console.error('Error getting conversation context:', error)
    return ''
  }
}

export { SupermemoryClient }
