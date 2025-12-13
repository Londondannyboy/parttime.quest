'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useUser } from '@stackframe/stack'
import { VoiceProvider, useVoice } from '@humeai/voice-react'
import Link from 'next/link'
import { UserGraph } from '@/components/UserGraph'

const CONFIG_ID = 'd57ceb71-4cf5-47e9-87cd-6052445a031c'

// Store chat_group_id per user for resume functionality
function getChatGroupId(userId: string): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(`hume_chat_group_${userId}`)
}

function setChatGroupId(userId: string, chatGroupId: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem(`hume_chat_group_${userId}`, chatGroupId)
}

function VoiceInterface({ token, profile, userId, previousContext }: { token: string; profile: any; userId?: string; previousContext?: string }) {
  const {
    connect,
    disconnect,
    status,
    messages,
    isPlaying,
    error: voiceError,
    isError,
    isAudioError,
    isMicrophoneError,
    readyState
  } = useVoice()

  // Track previous connection state to detect disconnections
  const wasConnectedRef = useRef(false)

  // Debug: Log all status changes with timestamp
  useEffect(() => {
    const time = new Date().toLocaleTimeString()
    console.log(`=== HUME STATUS [${time}] ===`, status.value, `readyState: ${readyState}`)

    if (status.value === 'disconnected') {
      console.warn('⚠️ DISCONNECTED - Check if this was unexpected')
    }
    if (status.value === 'error') {
      console.error('❌ HUME ERROR STATE')
    }

    // Track connection state for save-on-disconnect
    if (status.value === 'connected') {
      wasConnectedRef.current = true
    }
  }, [status.value, readyState])

  // Save conversation to Supermemory when session ends
  useEffect(() => {
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

  // Log error states
  useEffect(() => {
    if (isError || isAudioError || isMicrophoneError || voiceError) {
      console.error('=== HUME ERROR ===', JSON.stringify({
        isError,
        isAudioError,
        isMicrophoneError,
        voiceErrorMessage: voiceError?.message || String(voiceError),
        voiceErrorType: (voiceError as any)?.type
      }, null, 2))
    }
  }, [isError, isAudioError, isMicrophoneError, voiceError])

  useEffect(() => {
    console.log('=== HUME MESSAGES ===', messages.length, 'total')
    messages.slice(-3).forEach((m: any, i: number) => {
      console.log(`  [${m.type}]`, m.message?.content?.substring(0, 50) || m)
    })
  }, [messages])

  useEffect(() => {
    console.log('=== HUME isPlaying ===', isPlaying)
  }, [isPlaying])

  const handleConnect = useCallback(async () => {
    // Pass user_id and profile data to Hume
    // user_id is critical for the Hume tool to query our database
    const vars = {
      user_id: userId || '',  // CRITICAL: Hume tools use this to identify the user
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      is_authenticated: userId ? 'true' : 'false',
      current_country: profile?.current_country || 'United Kingdom',
      interests: Array.isArray(profile?.interests) ? profile.interests.join(', ') : (profile?.interests || ''),
      timeline: profile?.timeline || '',
      budget: profile?.budget_monthly ? `£${profile.budget_monthly}/day` : (profile?.budget || ''),
      email: profile?.email || '',
      previous_context: previousContext || ''  // From Supermemory
    }

    // Check for existing chat to resume
    const existingChatGroupId = userId ? getChatGroupId(userId) : null

    console.log('[Hume] Connecting with user_id and profile:', JSON.stringify(vars, null, 2))
    if (existingChatGroupId) {
      console.log('[Hume] Resuming chat group:', existingChatGroupId)
    }

    try {
      await connect({
        auth: { type: 'accessToken', value: token },
        configId: CONFIG_ID,
        resumedChatGroupId: existingChatGroupId || undefined,  // Resume previous chat if available
        sessionSettings: {
          type: 'session_settings' as const,
          variables: vars
        }
      })
    } catch (e: any) {
      console.error('Connection error:', e)
    }
  }, [connect, token, profile, userId, previousContext])

  const isConnected = status.value === 'connected'
  const isConnecting = status.value === 'connecting'

  // Combine message segments into complete messages
  const combinedMessages: { type: string; content: string }[] = []
  let currentAssistant = ''

  messages.forEach((m: any) => {
    if (m.type === 'user_message' && m.message?.content) {
      // If we have accumulated assistant text, save it first
      if (currentAssistant) {
        combinedMessages.push({ type: 'assistant_message', content: currentAssistant })
        currentAssistant = ''
      }
      combinedMessages.push({ type: 'user_message', content: m.message.content })
    } else if (m.type === 'assistant_message' && m.message?.content) {
      // Accumulate assistant message segments
      currentAssistant += m.message.content + ' '
    }
  })

  // Don't forget the last assistant message
  if (currentAssistant) {
    combinedMessages.push({ type: 'assistant_message', content: currentAssistant.trim() })
  }

  const recentMessages = combinedMessages.slice(-4)

  return (
    <div className="flex flex-col items-center">
      {/* Voice Button */}
      <div className="relative mb-8">
        {/* Pulse rings when connected */}
        {isConnected && (
          <>
            <div className="absolute inset-0 w-32 h-32 rounded-full bg-purple-400 animate-ping opacity-20" />
            <div className="absolute inset-0 w-32 h-32 rounded-full bg-purple-500 animate-pulse opacity-30" />
          </>
        )}

        <button
          onClick={isConnected ? disconnect : handleConnect}
          disabled={isConnecting}
          className={`relative w-32 h-32 rounded-full text-white font-bold text-lg shadow-xl transition-all duration-300 ${
            isConnected
              ? 'bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
              : isConnecting
              ? 'bg-gray-400 cursor-wait'
              : 'bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 hover:scale-105'
          }`}
        >
          {isConnected ? (
            <div className="flex flex-col items-center">
              <svg className="w-10 h-10 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
              <span className="text-sm">Stop</span>
            </div>
          ) : isConnecting ? (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-1" />
              <span className="text-sm">Connecting</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <svg className="w-10 h-10 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <span className="text-sm">Speak</span>
            </div>
          )}
        </button>
      </div>

      {/* Status text */}
      <p className="text-lg text-gray-600 mb-8">
        {isConnected
          ? isPlaying
            ? '🔊 Assistant is speaking...'
            : '🎤 Listening... speak naturally'
          : isConnecting
          ? 'Connecting to voice...'
          : 'Tap to start a conversation'}
      </p>

      {/* Debug info */}
      {isConnected && (
        <div className="text-xs text-gray-400 mb-4 font-mono">
          Status: {status.value} | Playing: {isPlaying ? 'YES' : 'NO'} | Messages: {messages.length} | WS: {readyState}
        </div>
      )}

      {/* Error display */}
      {(isError || isAudioError || isMicrophoneError) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-sm">
          <p className="font-medium text-red-800 mb-1">Connection Issue:</p>
          {isError && <p className="text-red-600">• General error</p>}
          {isAudioError && <p className="text-red-600">• Audio playback error</p>}
          {isMicrophoneError && <p className="text-red-600">• Microphone error</p>}
          {voiceError && <p className="text-red-600">• {String(voiceError)}</p>}
        </div>
      )}

      {/* Conversation */}
      {recentMessages.length > 0 && (
        <div className="w-full max-w-lg space-y-3 mb-8">
          {recentMessages.map((m, i) => (
            <div
              key={i}
              className={`p-4 rounded-2xl ${
                m.type === 'user_message'
                  ? 'bg-purple-100 text-purple-900 ml-8'
                  : 'bg-gray-100 text-gray-800 mr-8'
              }`}
            >
              <p className="text-sm font-medium mb-1 opacity-60">
                {m.type === 'user_message' ? 'You' : 'Assistant'}
              </p>
              <p>{m.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function VoicePage() {
  const user = useUser()
  const [token, setToken] = useState<string | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [previousContext, setPreviousContext] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  // Fetch token
  useEffect(() => {
    fetch('/api/hume-token')
      .then(r => r.json())
      .then(d => d.accessToken ? setToken(d.accessToken) : setError('No token'))
      .catch(e => setError(e.message))
  }, [])

  // Fetch profile if logged in
  useEffect(() => {
    if (!user) return
    fetch('/api/user-profile')
      .then(r => r.ok ? r.json() : null)
      .then(setProfile)
      .catch(console.error)
  }, [user])

  // Fetch Supermemory context for long-term memory
  useEffect(() => {
    if (!user?.id) return
    fetch('/api/supermemory-context', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, query: 'career preferences and background' })
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.context) {
          console.log('[Supermemory] Got previous context:', data.context.substring(0, 100))
          setPreviousContext(data.context)
        }
      })
      .catch(console.error)
  }, [user?.id])

  // Handle chat_group_id from Hume for resume functionality
  const handleHumeMessage = useCallback((msg: any) => {
    // Log specific message types that might indicate issues
    if (msg.type === 'error' || msg.type === 'chat_metadata') {
      console.log('=== HUME onMessage ===', msg.type, JSON.stringify(msg, null, 2))
    }
    // Save chat_group_id for resume functionality
    if (msg.type === 'chat_metadata' && msg.chatGroupId && user?.id) {
      console.log('[Hume] Saving chat_group_id for resume:', msg.chatGroupId)
      setChatGroupId(user.id, msg.chatGroupId)
    }
  }, [user?.id])

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Voice Assistant</h1>
              <p className="text-gray-600 mt-1">
                {profile?.first_name
                  ? `Welcome back, ${profile.first_name}`
                  : 'Talk to discover your perfect role'}
              </p>
            </div>
            <Link
              href="/profile"
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors"
            >
              View Profile →
            </Link>
          </div>
        </div>
      </div>

      {/* Voice Interface */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          {error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-red-600">{error}</p>
            </div>
          ) : !token ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4" />
              <p className="text-gray-600">Initializing voice...</p>
            </div>
          ) : (
            <VoiceProvider
              onClose={(event) => {
                console.warn('=== HUME onClose ===', JSON.stringify({
                  code: event?.code,
                  reason: event?.reason,
                  wasClean: event?.wasClean
                }, null, 2))
              }}
              onError={(error) => {
                console.error('=== HUME onError ===', JSON.stringify({
                  message: error?.message || String(error),
                  type: (error as any)?.type
                }, null, 2))
              }}
              onMessage={handleHumeMessage}
            >
              <VoiceInterface token={token} profile={profile} userId={user?.id} previousContext={previousContext} />
            </VoiceProvider>
          )}
        </div>

        {/* ZEP Knowledge Graph */}
        {user && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Your Knowledge Graph</h2>
                <p className="text-sm text-gray-600">Skills, experience, and connections from ZEP</p>
              </div>
            </div>
            <UserGraph userId={user.id} />
          </div>
        )}

        {/* Not logged in state */}
        {!user && (
          <div className="bg-gradient-to-r from-purple-50 to-amber-50 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Sign in to see your graph</h3>
            <p className="text-gray-600 mb-4">
              Your conversations build a personalized knowledge graph of your skills and preferences.
            </p>
            <Link
              href="/handler/sign-in"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-700 text-white rounded-lg font-semibold hover:bg-purple-800 transition-colors"
            >
              Sign In
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
