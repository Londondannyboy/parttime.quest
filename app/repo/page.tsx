'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useUser } from '@stackframe/stack'
import { VoiceProvider, useVoice } from '@humeai/voice-react'
import Link from 'next/link'
import RepoBuilder from '@/components/RepoBuilder'
import { KnowledgeGraph } from '@/components/KnowledgeGraph'

const CONFIG_ID = 'd57ceb71-4cf5-47e9-87cd-6052445a031c'

// Store chat_group_id per user for Hume resume functionality
function getChatGroupId(userId: string): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(`hume_chat_group_${userId}`)
}

function setChatGroupId(userId: string, chatGroupId: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem(`hume_chat_group_${userId}`, chatGroupId)
}

interface JobResult {
  title: string
  company: string
  location?: string
  slug?: string
}

interface PendingPreference {
  preference_type: string
  values: string[]
  user_id?: string
  raw_text?: string
}

interface ExtractedPreference {
  type: 'role' | 'industry' | 'location' | 'availability' | 'day_rate' | 'skill'
  values: string[]
  confidence: 'high' | 'medium' | 'low'
  raw_text: string
}

interface GraphData {
  nodes: Array<{
    id: string
    type: 'user' | 'skill' | 'job' | 'company' | 'preference' | 'fact'
    label: string
    data?: Record<string, unknown>
  }>
  edges: Array<{
    source: string
    target: string
    type: string
    weight?: number
    label?: string
  }>
}

function VoiceInterface({ token, userId, profile, memoryContext, graphData, onPreferenceAdded }: {
  token: string
  userId?: string
  profile?: any
  memoryContext?: string
  graphData?: GraphData
  onPreferenceAdded?: () => void
}) {
  const { connect, disconnect, status, messages, isPlaying } = useVoice()
  const [displayedJobs, setDisplayedJobs] = useState<JobResult[]>([])
  const [showJobsPanel, setShowJobsPanel] = useState(false)
  const [pendingPreference, setPendingPreference] = useState<PendingPreference | null>(null)
  const [preferenceOpacity, setPreferenceOpacity] = useState(1)
  const [savingPreference, setSavingPreference] = useState(false)

  // Track processed confirmations to avoid duplicates
  const processedConfirmations = useRef<Set<string>>(new Set())
  const lastExtractedText = useRef<string>('')
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const wasConnectedRef = useRef(false)

  // Save conversation to Supermemory when session ends
  useEffect(() => {
    // Track connection state
    if (status.value === 'connected') {
      wasConnectedRef.current = true
    }

    // Only save if we were connected and now disconnected
    if (status.value === 'disconnected' && wasConnectedRef.current && userId && messages.length > 0) {
      wasConnectedRef.current = false

      // Build transcript from messages
      const transcript = messages
        .filter((m: any) => m.type === 'user_message' || m.type === 'assistant_message')
        .map((m: any) => {
          const role = m.type === 'user_message' ? 'User' : 'Repo'
          return `${role}: ${m.message?.content || ''}`
        })
        .join('\n')

      if (transcript.length > 50) {
        console.log('[Supermemory] Saving conversation transcript, length:', transcript.length)

        fetch('/api/supermemory-save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, transcript })
        })
          .then(r => r.json())
          .then(data => {
            if (data.saved) {
              console.log('[Supermemory] Conversation saved successfully')
            } else {
              console.log('[Supermemory] Conversation not saved:', data.reason || data.error)
            }
          })
          .catch(err => console.error('[Supermemory] Save error:', err))
      }
    }
  }, [status.value, messages, userId])

  // Auto-fade and save unvalidated preference after timeout
  useEffect(() => {
    if (pendingPreference && !savingPreference) {
      // Clear any existing timeout
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current)
      }

      // Start fade after 5 seconds
      fadeTimeoutRef.current = setTimeout(() => {
        setPreferenceOpacity(0.5)
        // After another 3 seconds, save as unvalidated and hide
        setTimeout(() => {
          handleSavePreference(false) // false = unvalidated
        }, 3000)
      }, 5000)
    }

    return () => {
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current)
      }
    }
  }, [pendingPreference])

  // Save preference (validated or not) to Neon + ZEP
  const handleSavePreference = async (validated: boolean) => {
    if (!pendingPreference || savingPreference) return

    setSavingPreference(true)
    try {
      // Save to Neon database
      const response = await fetch('/api/save-repo-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          preference_type: pendingPreference.preference_type,
          values: pendingPreference.values,
          validated,
          raw_text: pendingPreference.raw_text
        })
      })

      if (response.ok) {
        console.log(`[Preference] Saved ${validated ? 'validated' : 'unvalidated'}:`, pendingPreference)

        // Also save to ZEP knowledge graph (fire and forget)
        fetch('/api/zep-context', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            preference: {
              type: pendingPreference.preference_type,
              values: pendingPreference.values,
              validated,
              raw_text: pendingPreference.raw_text
            }
          })
        })
          .then(r => r.json())
          .then(data => {
            if (data.saved) {
              console.log('[Preference] Saved to ZEP:', pendingPreference.preference_type)
              // Trigger graph refresh
              onPreferenceAdded?.()
            }
          })
          .catch(e => console.error('[Preference] ZEP save error:', e))
      }
    } catch (error) {
      console.error('[Preference] Save error:', error)
    } finally {
      setSavingPreference(false)
      setPendingPreference(null)
      setPreferenceOpacity(1)
    }
  }

  // Watch for voice confirmation ("yes", "correct", etc.)
  useEffect(() => {
    if (!pendingPreference) return

    const lastUserMsg = [...messages].reverse().find(
      (m: any) => m.type === 'user_message' && m.message?.content
    ) as any

    if (lastUserMsg?.message?.content) {
      const content = lastUserMsg.message.content.toLowerCase()
      const confirmPhrases = ['yes', 'yeah', 'correct', 'that\'s right', 'thats right', 'right', 'exactly', 'yep', 'sure']

      if (confirmPhrases.some(phrase => content.includes(phrase))) {
        console.log('[Preference] Voice confirmation detected!')
        handleSavePreference(true) // true = validated
      }
    }
  }, [messages, pendingPreference])

  // Extract preferences from user messages
  const extractPreferences = useCallback(async (userMessages: string[]) => {
    const transcript = userMessages.join('\n')

    // Don't re-extract the same text
    if (transcript === lastExtractedText.current) return
    lastExtractedText.current = transcript

    try {
      const response = await fetch('/api/extract-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript })
      })

      if (!response.ok) return

      const { preferences, should_confirm } = await response.json()

      if (should_confirm && preferences.length > 0) {
        // Find the highest confidence preference that hasn't been confirmed yet
        const highConfidence = preferences.find(
          (p: ExtractedPreference) =>
            p.confidence === 'high' &&
            !processedConfirmations.current.has(`${p.type}:${p.values.join(',')}`)
        )

        if (highConfidence) {
          const key = `${highConfidence.type}:${highConfidence.values.join(',')}`
          processedConfirmations.current.add(key)

          setPendingPreference({
            preference_type: highConfidence.type,
            values: highConfidence.values,
            user_id: userId,
            raw_text: highConfidence.raw_text
          })
          setPreferenceOpacity(1)
          console.log('[Preference] Showing confirmation for:', highConfidence)
        }
      }
    } catch (error) {
      console.error('[Preference] Extraction error:', error)
    }
  }, [userId])

  // Watch transcript for job-related content
  // Simple approach: just analyze the text content from UserMessage and AssistantMessage
  useEffect(() => {
    if (messages.length === 0) return

    // Get assistant messages (Repo's responses)
    const lastAssistantMsg = [...messages].reverse().find(
      (m: any) => m.type === 'assistant_message' && m.message?.content
    ) as any

    if (lastAssistantMsg?.message?.content) {
      const content = lastAssistantMsg.message.content.toLowerCase()

      // Detect when Repo mentions showing jobs
      const mentionsJobs = content.includes('job') || content.includes('role') ||
                          content.includes('position') || content.includes('opportunit')
      const soundsLikeResults = content.includes('found') || content.includes('show') ||
                               content.includes('screen') || content.includes('putting') ||
                               content.includes('here are') || content.includes('take a look')

      if (mentionsJobs && soundsLikeResults && !showJobsPanel) {
        console.log('[Repo] Mentioned jobs - showing panel')
        setShowJobsPanel(true)
        fetchRecentJobs()
      }
    }
  }, [messages, showJobsPanel])

  // Extract preferences from user messages (debounced)
  const extractionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    // Collect all user messages
    const userMessages = messages
      .filter((m: any) => m.type === 'user_message' && m.message?.content)
      .map((m: any) => m.message.content)

    if (userMessages.length === 0) return

    // Debounce extraction - wait for 2 seconds of no new messages
    if (extractionTimeoutRef.current) {
      clearTimeout(extractionTimeoutRef.current)
    }

    extractionTimeoutRef.current = setTimeout(() => {
      // Only extract if we have new messages since last extraction
      if (userMessages.length > 0) {
        extractPreferences(userMessages)
      }
    }, 2000)

    return () => {
      if (extractionTimeoutRef.current) {
        clearTimeout(extractionTimeoutRef.current)
      }
    }
  }, [messages, extractPreferences])

  const fetchRecentJobs = async () => {
    try {
      const response = await fetch('/api/jobs-recent')
      if (response.ok) {
        const jobs = await response.json()
        if (jobs.length > 0) {
          setDisplayedJobs(jobs)
          setShowJobsPanel(true)
        }
      }
    } catch (e) {
      console.error('Failed to fetch recent jobs:', e)
    }
  }

  const fetchJobsForDisplay = async (slugs: string[]) => {
    try {
      const response = await fetch('/api/jobs-by-slug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slugs: slugs.slice(0, 5) })
      })
      if (response.ok) {
        const jobs = await response.json()
        setDisplayedJobs(jobs)
      }
    } catch (e) {
      console.error('Failed to fetch jobs for display:', e)
    }
  }

  const handleConnect = useCallback(async () => {
    const vars = {
      user_id: userId || '',
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      is_authenticated: userId ? 'true' : 'false',
      current_country: profile?.current_country || '',
      interests: profile?.interests || '',
      timeline: profile?.timeline || '',
      budget: profile?.budget_monthly ? `£${profile.budget_monthly}/day` : '',
      // Memory context from Supermemory - previous conversations
      previous_context: memoryContext || '',
    }

    // Check for existing chat to resume
    const existingChatGroupId = userId ? getChatGroupId(userId) : null

    console.log('[Hume] Connecting with profile:', vars)
    if (existingChatGroupId) {
      console.log('[Hume] Resuming chat group:', existingChatGroupId)
    }
    if (memoryContext) {
      console.log('[Hume] Memory context:', memoryContext.substring(0, 200))
    }

    try {
      await connect({
        auth: { type: 'accessToken', value: token },
        configId: CONFIG_ID,
        resumedChatGroupId: existingChatGroupId || undefined,
        sessionSettings: {
          type: 'session_settings' as const,
          variables: vars
        }
      })
    } catch (e) {
      console.error('Connection error:', e)
    }
  }, [connect, token, userId, profile, memoryContext])

  const isConnected = status.value === 'connected'
  const isConnecting = status.value === 'connecting'

  // Debug: log all messages to understand structure
  useEffect(() => {
    if (messages.length > 0) {
      console.log('[Hume Messages]', messages.map((m: any) => ({
        type: m.type,
        content: m.message?.content?.slice(0, 50),
        role: m.message?.role
      })))
    }
  }, [messages])

  // Filter to user and assistant messages that have content
  const conversationMessages = messages.filter((m: any) => {
    if (m.type === 'assistant_message' && m.message?.content) return true
    if (m.type === 'user_message' && m.message?.content) return true
    return false
  })

  return (
    <div className="flex-1 flex flex-col">
      {/* Main Voice Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-purple-50 to-white">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {profile?.first_name ? `Hi ${profile.first_name}` : 'Your Repo'}
          </h1>
          <p className="text-gray-600">
            Talk to Repo about your experience, skills, and career goals
          </p>
        </div>

        {/* Mic Button */}
        <button
          onClick={isConnected ? disconnect : handleConnect}
          disabled={isConnecting}
          className={`w-32 h-32 rounded-full text-white font-bold text-lg shadow-xl transition-all ${
            isConnected
              ? 'bg-green-500 hover:bg-green-600 animate-pulse'
              : isConnecting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {isConnected ? (
            <span className="flex flex-col items-center">
              <MicIcon className="w-10 h-10 mb-1" />
              <span className="text-sm">Stop</span>
            </span>
          ) : isConnecting ? (
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto" />
          ) : (
            <span className="flex flex-col items-center">
              <MicIcon className="w-10 h-10 mb-1" />
              <span className="text-sm">Speak</span>
            </span>
          )}
        </button>

        <p className="mt-4 text-sm text-gray-500">
          {isConnected ? (isPlaying ? 'Repo is speaking...' : 'Listening...') : 'Tap to start'}
        </p>

        {/* Action buttons when connected */}
        {isConnected && (
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => {
                console.log('[Manual] Show jobs button clicked')
                fetchRecentJobs()
              }}
              className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full text-sm font-medium transition-colors"
            >
              Show Latest Jobs
            </button>
            <button
              onClick={disconnect}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm font-medium transition-colors"
            >
              Stop
            </button>
          </div>
        )}
      </div>

      {/* Repo Builder - extracts preferences from voice + text */}
      <div className="px-6 py-4">
        <RepoBuilder
          userId={userId}
          voiceTranscript={
            // Get the last few user messages as transcript
            messages
              .filter((m: any) => m.type === 'user_message' && m.message?.content)
              .slice(-5)
              .map((m: any) => m.message.content)
              .join(' ')
          }
          onPreferenceSaved={(pref, validated) => {
            console.log('[RepoBuilder] Saved:', pref, validated ? '(validated)' : '(soft)')
            // Trigger graph refresh after a short delay for ZEP to process
            setTimeout(() => onPreferenceAdded?.(), 500)
          }}
        />
      </div>

      {/* Live Knowledge Graph */}
      {graphData && graphData.nodes.length > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-lg">🧠</span>
                <h3 className="text-sm font-semibold text-gray-800">Your Knowledge Graph</h3>
                <span className="text-xs text-gray-500 ml-auto">
                  {graphData.nodes.length} nodes • {graphData.edges.length} connections
                </span>
              </div>
            </div>
            <div className="p-2">
              <KnowledgeGraph
                data={graphData}
                width={500}
                height={280}
              />
            </div>
          </div>
        </div>
      )}

      {/* Preference Confirmation Card - fades and auto-saves */}
      {pendingPreference && (
        <div
          className="border-t border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4 transition-opacity duration-500"
          style={{ opacity: preferenceOpacity }}
        >
          <div className="max-w-md mx-auto">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Adding to your Repo
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium capitalize">{pendingPreference.preference_type}:</span>{' '}
                  {pendingPreference.values.join(', ')}
                </p>
                {pendingPreference.raw_text && (
                  <p className="text-xs text-gray-400 mt-1 italic">
                    "{pendingPreference.raw_text}"
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-3 justify-end">
              <button
                onClick={() => handleSavePreference(true)}
                disabled={savingPreference}
                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-full transition-colors disabled:opacity-50"
              >
                {savingPreference ? 'Saving...' : 'Confirm'}
              </button>
              <button
                onClick={() => {
                  setPendingPreference(null)
                  setPreferenceOpacity(1)
                }}
                className="px-3 py-1.5 text-gray-500 hover:text-gray-700 text-xs font-medium"
              >
                Skip
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Say "yes" to confirm, or it will be added automatically
            </p>
          </div>
        </div>
      )}

      {/* Jobs Panel - appears when Repo finds jobs */}
      {showJobsPanel && displayedJobs.length > 0 && (
        <div className="border-t border-gray-200 bg-gradient-to-r from-purple-50 to-amber-50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">
              Jobs Repo Found For You
            </h3>
            <button
              onClick={() => setShowJobsPanel(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="grid gap-3">
            {displayedJobs.map((job, i) => (
              <Link
                key={i}
                href={`/job/${job.slug}`}
                className="block bg-white rounded-xl p-4 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                      {job.title}
                    </h4>
                    <p className="text-sm text-gray-600">{job.company}</p>
                    {job.location && (
                      <p className="text-xs text-gray-500 mt-1">{job.location}</p>
                    )}
                  </div>
                  <span className="text-purple-600 text-sm font-medium">View →</span>
                </div>
              </Link>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Click any job to see full details and apply
          </p>
        </div>
      )}

      {/* Conversation Panel */}
      {conversationMessages.length > 0 && (
        <div className="border-t border-gray-200 bg-white p-6 max-h-64 overflow-y-auto">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Transcript
          </h3>
          <div className="space-y-3">
            {conversationMessages.map((msg: any, i: number) => {
              const isUser = msg.type === 'user_message'
              const content = msg.message?.content || ''
              return (
                <div
                  key={i}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 ${
                      isUser
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <p className="text-sm">{content}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default function RepoPage() {
  const user = useUser({ or: 'redirect' })
  const [token, setToken] = useState<string | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [memoryContext, setMemoryContext] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showDebug, setShowDebug] = useState(false)
  const [zepContext, setZepContext] = useState<string>('')
  const [graphData, setGraphData] = useState<GraphData | null>(null)
  const [debugInfo, setDebugInfo] = useState<{
    supermemoryLoaded: boolean
    supermemoryLength: number
    zepLoaded: boolean
    zepLength: number
    humeResumeId: string | null
    profileLoaded: boolean
    extractionEndpoint: string | null
  }>({
    supermemoryLoaded: false,
    supermemoryLength: 0,
    zepLoaded: false,
    zepLength: 0,
    humeResumeId: null,
    profileLoaded: false,
    extractionEndpoint: null
  })

  // Fetch Hume token
  useEffect(() => {
    fetch('/api/hume-token')
      .then(r => r.json())
      .then(d => d.accessToken ? setToken(d.accessToken) : setError('No token'))
      .catch(e => setError(e.message))
  }, [])

  // Fetch profile from Neon
  useEffect(() => {
    if (!user) return
    fetch('/api/user-profile')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        console.log('[Profile from Neon]', data)
        setProfile(data)
        setDebugInfo(prev => ({ ...prev, profileLoaded: !!data }))
      })
      .catch(console.error)
  }, [user])

  // Fetch memory context from Supermemory
  useEffect(() => {
    if (!user) return
    fetch('/api/supermemory-context', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, query: 'career preferences skills experience' })
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.context) {
          console.log('[Supermemory] Context loaded:', data.context.substring(0, 100))
          setMemoryContext(prev => {
            // Combine with ZEP context if available
            const combined = [prev, data.context].filter(Boolean).join('\n\n')
            return combined
          })
          setDebugInfo(prev => ({
            ...prev,
            supermemoryLoaded: true,
            supermemoryLength: data.context.length
          }))
        }
      })
      .catch(e => console.error('[Supermemory] Error:', e))
  }, [user])

  // Fetch knowledge graph context from ZEP
  useEffect(() => {
    if (!user) return
    fetch(`/api/zep-context?userId=${user.id}&query=skills experience preferences`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.context) {
          console.log('[ZEP] Context loaded:', data.context.substring(0, 100))
          setZepContext(data.context)
          setMemoryContext(prev => {
            // Combine with Supermemory context
            const combined = [data.context, prev].filter(Boolean).join('\n\n')
            return combined
          })
          setDebugInfo(prev => ({
            ...prev,
            zepLoaded: true,
            zepLength: data.context.length
          }))
        } else if (data?.source === 'disabled') {
          console.log('[ZEP] Disabled - no API key configured')
        }
      })
      .catch(e => console.error('[ZEP] Error:', e))
  }, [user])

  // Fetch knowledge graph visualization data
  const fetchGraphData = useCallback(() => {
    if (!user) return
    fetch(`/api/graph/user?userId=${user.id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.graph) {
          console.log('[Graph] Loaded:', data.graph.nodes.length, 'nodes,', data.graph.edges.length, 'edges')
          setGraphData(data.graph)
        }
      })
      .catch(e => console.error('[Graph] Error:', e))
  }, [user])

  // Initial graph fetch
  useEffect(() => {
    fetchGraphData()
  }, [fetchGraphData])

  // Check for existing Hume chat to resume
  useEffect(() => {
    if (!user?.id) return
    const existingChatId = getChatGroupId(user.id)
    setDebugInfo(prev => ({ ...prev, humeResumeId: existingChatId }))
  }, [user?.id])

  // Test which extraction endpoint works
  useEffect(() => {
    fetch('/api/pydantic-extract', { method: 'GET' })
      .then(r => {
        if (r.ok) {
          setDebugInfo(prev => ({ ...prev, extractionEndpoint: 'Pydantic AI (Python)' }))
        } else {
          setDebugInfo(prev => ({ ...prev, extractionEndpoint: 'TypeScript (fallback)' }))
        }
      })
      .catch(() => {
        setDebugInfo(prev => ({ ...prev, extractionEndpoint: 'TypeScript (fallback)' }))
      })
  }, [])

  // Handle chat_group_id from Hume for resume functionality
  const handleHumeMessage = useCallback((msg: any) => {
    // Save chat_group_id for resume functionality
    if (msg.type === 'chat_metadata' && msg.chatGroupId && user?.id) {
      console.log('[Hume] Saving chat_group_id for resume:', msg.chatGroupId)
      setChatGroupId(user.id, msg.chatGroupId)
    }
  }, [user?.id])

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-sm`}>
        {/* Logo */}
        <div className="p-5 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            {sidebarOpen && (
              <div>
                <span className="text-gray-900 font-bold">Part-Time</span>
                <span className="text-purple-600">.Quest</span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavItem icon={<MicIcon />} label="Repo" href="/repo" active collapsed={!sidebarOpen} />
          <NavItem icon={<BriefcaseIcon />} label="Jobs" href="/fractionaljobsuk" collapsed={!sidebarOpen} />
          <NavItem icon={<ArticleIcon />} label="Articles" href="/fractional-jobs-articles" collapsed={!sidebarOpen} />
          <NavItem icon={<ChatIcon />} label="Chat" href="/chat" collapsed={!sidebarOpen} />
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-100">
          <div className={`flex items-center gap-3 p-3 rounded-xl bg-gray-50 ${sidebarOpen ? '' : 'justify-center'}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold">
                {profile?.first_name?.charAt(0) || user.displayName?.charAt(0) || 'U'}
              </span>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 text-sm font-medium truncate">
                  {profile?.first_name || user.displayName || 'User'}
                </p>
                <p className="text-gray-500 text-xs truncate">{user.primaryEmail}</p>
              </div>
            )}
          </div>
        </div>

        {/* Debug Panel Toggle */}
        {sidebarOpen && (
          <div className="px-3 py-2 border-t border-gray-100">
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Debug Panel
              <span className="ml-auto">{showDebug ? '▼' : '▶'}</span>
            </button>

            {showDebug && (
              <div className="mt-2 p-3 bg-gray-900 rounded-lg text-xs font-mono text-gray-300 space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${debugInfo.profileLoaded ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span>Profile: {debugInfo.profileLoaded ? 'Loaded' : 'Not loaded'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${debugInfo.zepLoaded ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <span>ZEP Graph: {debugInfo.zepLoaded ? `${debugInfo.zepLength} chars` : 'Empty'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${debugInfo.supermemoryLoaded ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <span>Supermemory: {debugInfo.supermemoryLoaded ? `${debugInfo.supermemoryLength} chars` : 'Empty'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${debugInfo.humeResumeId ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <span>Hume Resume: {debugInfo.humeResumeId ? 'Yes' : 'New session'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${debugInfo.extractionEndpoint?.includes('Pydantic') ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <span>Extraction: {debugInfo.extractionEndpoint || 'Checking...'}</span>
                </div>
                {zepContext && (
                  <div className="pt-2 border-t border-gray-700">
                    <p className="text-gray-400 mb-1">ZEP Context:</p>
                    <p className="text-gray-500 text-[10px] break-all">{zepContext.substring(0, 100)}...</p>
                  </div>
                )}
                {memoryContext && (
                  <div className="pt-2 border-t border-gray-700">
                    <p className="text-gray-400 mb-1">Combined Memory:</p>
                    <p className="text-gray-500 text-[10px] break-all">{memoryContext.substring(0, 150)}...</p>
                  </div>
                )}
                {debugInfo.humeResumeId && (
                  <div className="pt-2 border-t border-gray-700">
                    <p className="text-gray-400 mb-1">Chat ID:</p>
                    <p className="text-gray-500 text-[10px] break-all">{debugInfo.humeResumeId}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-4 border-t border-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
        >
          {sidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {error ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-500 text-2xl">!</span>
              </div>
              <p className="text-gray-600">Voice service unavailable</p>
              <p className="text-red-500 text-sm mt-2">{error}</p>
            </div>
          </div>
        ) : !token ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading voice assistant...</p>
            </div>
          </div>
        ) : (
          <VoiceProvider
            onError={(err) => console.error('[Hume Error]', err)}
            onClose={(e) => console.warn('[Hume Close]', e?.code, e?.reason)}
            onMessage={handleHumeMessage}
          >
            <VoiceInterface
              token={token}
              userId={user.id}
              profile={profile}
              memoryContext={memoryContext}
              graphData={graphData || undefined}
              onPreferenceAdded={fetchGraphData}
            />
          </VoiceProvider>
        )}
      </main>
    </div>
  )
}

// Components
function NavItem({ icon, label, href, active, collapsed }: {
  icon: React.ReactNode
  label: string
  href: string
  active?: boolean
  collapsed?: boolean
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        active
          ? 'bg-purple-50 text-purple-700 font-medium'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      } ${collapsed ? 'justify-center' : ''}`}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </Link>
  )
}

// Icons
function MicIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  )
}

function BriefcaseIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  )
}

function ArticleIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    </svg>
  )
}

function ChevronLeftIcon() {
  return (
    <svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
    </svg>
  )
}
