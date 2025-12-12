/**
 * Zep Integration for Knowledge Graph Memory
 *
 * Provides temporal knowledge graph for:
 * - User profiles and their relationships to skills/jobs
 * - Jobs and their relationships to skills/companies
 * - Semantic search and fact extraction
 */

import { ZepClient } from '@getzep/zep-cloud'

// Types we define ourselves since SDK exports vary
interface Session {
  sessionId: string
  metadata?: Record<string, unknown>
}

interface Memory {
  messages?: Message[]
  summary?: string
  facts?: string[]
}

interface Message {
  roleType: 'user' | 'assistant' | 'system'
  content: string
  metadata?: Record<string, unknown>
}

interface MemorySearchResult {
  message?: Message
  summary?: string
  score?: number
}

// Graph node types
export interface GraphNode {
  id: string
  type: 'user' | 'skill' | 'job' | 'company' | 'preference'
  label: string
  data?: Record<string, unknown>
}

export interface GraphEdge {
  source: string
  target: string
  type: string
  weight?: number
  label?: string
}

export interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

// Singleton Zep client
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let zepClient: any = null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getZepClient(): any {
  const apiKey = process.env.ZEP_API_KEY

  if (!apiKey) {
    console.warn('ZEP_API_KEY not configured')
    return null
  }

  if (!zepClient) {
    zepClient = new ZepClient({ apiKey })
  }

  return zepClient
}

/**
 * Create or get a session for a user
 */
export async function getOrCreateSession(
  userId: string,
  metadata?: Record<string, unknown>
): Promise<Session | null> {
  const client = getZepClient()
  if (!client) return null

  try {
    // Try to get existing session
    const session = await client.memory.getSession(userId)
    return session
  } catch {
    // Create new session if not exists
    try {
      const session = await client.memory.addSession({
        sessionId: userId,
        metadata: {
          ...metadata,
          source: 'fractional-quest',
          createdAt: new Date().toISOString(),
        },
      })
      return session
    } catch (error) {
      console.error('Error creating Zep session:', error)
      return null
    }
  }
}

/**
 * Add memory to a user's session
 */
export async function addMemory(
  userId: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<void> {
  const client = getZepClient()
  if (!client) return

  try {
    await getOrCreateSession(userId)

    const zepMessages: Message[] = messages.map(m => ({
      roleType: m.role === 'user' ? 'user' : 'assistant',
      content: m.content,
    }))

    await client.memory.add(userId, { messages: zepMessages })
  } catch (error) {
    console.error('Error adding memory to Zep:', error)
  }
}

/**
 * Search memories for relevant context
 */
export async function searchMemory(
  userId: string,
  query: string,
  limit = 5
): Promise<MemorySearchResult[]> {
  const client = getZepClient()
  if (!client) return []

  try {
    const results = await client.memory.searchSessions({
      text: query,
      userId,
      limit,
    })
    return results || []
  } catch (error) {
    console.error('Error searching Zep memory:', error)
    return []
  }
}

/**
 * Get user's memory/facts
 */
export async function getUserMemory(userId: string): Promise<Memory | null> {
  const client = getZepClient()
  if (!client) return null

  try {
    const memory = await client.memory.get(userId)
    return memory
  } catch (error) {
    console.error('Error getting user memory:', error)
    return null
  }
}

/**
 * Build a user graph showing their relationships to skills and jobs
 * This creates a visual representation of what we know about the user
 */
export async function buildUserGraph(
  userId: string,
  userSkills: Array<{ id: string; name: string; category: string; confidence: number }>,
  userCompanies: Array<{ id: string; name: string; role?: string }>,
  userPreferences: Array<{ type: string; value: string }>,
  matchedJobs?: Array<{ id: string; title: string; company: string; matchScore: number }>
): Promise<GraphData> {
  const nodes: GraphNode[] = []
  const edges: GraphEdge[] = []

  // Add user as central node
  const userNode: GraphNode = {
    id: `user-${userId}`,
    type: 'user',
    label: 'You',
    data: { central: true },
  }
  nodes.push(userNode)

  // Add skills as nodes
  userSkills.forEach(skill => {
    const skillNode: GraphNode = {
      id: `skill-${skill.id}`,
      type: 'skill',
      label: skill.name,
      data: { category: skill.category, confidence: skill.confidence },
    }
    nodes.push(skillNode)

    // Connect user to skill
    edges.push({
      source: userNode.id,
      target: skillNode.id,
      type: 'has_skill',
      weight: skill.confidence,
      label: `${Math.round(skill.confidence * 100)}%`,
    })
  })

  // Add companies as nodes
  userCompanies.forEach(company => {
    const companyNode: GraphNode = {
      id: `company-${company.id}`,
      type: 'company',
      label: company.name,
      data: { role: company.role },
    }
    nodes.push(companyNode)

    // Connect user to company
    edges.push({
      source: userNode.id,
      target: companyNode.id,
      type: 'worked_at',
      label: company.role,
    })
  })

  // Add preferences as nodes
  userPreferences.forEach((pref, i) => {
    const prefNode: GraphNode = {
      id: `pref-${i}`,
      type: 'preference',
      label: pref.value,
      data: { type: pref.type },
    }
    nodes.push(prefNode)

    // Connect user to preference
    edges.push({
      source: userNode.id,
      target: prefNode.id,
      type: 'prefers',
      label: pref.type,
    })
  })

  // Add matched jobs if provided
  if (matchedJobs) {
    matchedJobs.forEach(job => {
      const jobNode: GraphNode = {
        id: `job-${job.id}`,
        type: 'job',
        label: job.title,
        data: { company: job.company, matchScore: job.matchScore },
      }
      nodes.push(jobNode)

      // Connect user to job via match
      edges.push({
        source: userNode.id,
        target: jobNode.id,
        type: 'matches',
        weight: job.matchScore,
        label: `${Math.round(job.matchScore * 100)}% match`,
      })
    })
  }

  return { nodes, edges }
}

/**
 * Build a jobs graph showing relationships between jobs, skills, and companies
 */
export async function buildJobsGraph(
  jobs: Array<{
    id: string
    title: string
    company: string
    skills: string[]
    location: string
  }>,
  limit = 20
): Promise<GraphData> {
  const nodes: GraphNode[] = []
  const edges: GraphEdge[] = []
  const skillsMap = new Map<string, string>() // skill name -> node id
  const companiesMap = new Map<string, string>() // company name -> node id

  // Process jobs (limited)
  const processedJobs = jobs.slice(0, limit)

  processedJobs.forEach(job => {
    // Add job node
    const jobNode: GraphNode = {
      id: `job-${job.id}`,
      type: 'job',
      label: job.title,
      data: { company: job.company, location: job.location },
    }
    nodes.push(jobNode)

    // Add or reference company node
    if (!companiesMap.has(job.company)) {
      const companyId = `company-${job.company.toLowerCase().replace(/\s+/g, '-')}`
      companiesMap.set(job.company, companyId)
      nodes.push({
        id: companyId,
        type: 'company',
        label: job.company,
      })
    }

    // Connect job to company
    edges.push({
      source: `job-${job.id}`,
      target: companiesMap.get(job.company)!,
      type: 'at_company',
    })

    // Add or reference skill nodes
    job.skills.forEach(skillName => {
      if (!skillsMap.has(skillName)) {
        const skillId = `skill-${skillName.toLowerCase().replace(/\s+/g, '-')}`
        skillsMap.set(skillName, skillId)
        nodes.push({
          id: skillId,
          type: 'skill',
          label: skillName,
        })
      }

      // Connect job to skill
      edges.push({
        source: `job-${job.id}`,
        target: skillsMap.get(skillName)!,
        type: 'requires_skill',
      })
    })
  })

  return { nodes, edges }
}

/**
 * Store facts extracted from conversation
 */
export async function storeFacts(
  userId: string,
  facts: Array<{ key: string; value: string; confidence: number }>
): Promise<void> {
  const client = getZepClient()
  if (!client) return

  try {
    // Store facts as conversation that Zep will process
    const factMessages: Message[] = facts.map(fact => ({
      roleType: 'user',
      content: `Fact: ${fact.key} = ${fact.value} (confidence: ${Math.round(fact.confidence * 100)}%)`,
    }))

    await client.memory.add(userId, { messages: factMessages })
  } catch (error) {
    console.error('Error storing facts in Zep:', error)
  }
}
