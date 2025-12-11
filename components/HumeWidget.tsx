'use client'

import { useState, useCallback, useEffect } from 'react'
import { VoiceProvider, useVoice } from '@humeai/voice-react'
import Link from 'next/link'

const MAX_FREE_USES = 3
const STORAGE_KEY = 'fractional_hume_uses'

function getUsageCount(): number {
  if (typeof window === 'undefined') return 0
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? parseInt(stored, 10) : 0
}

function incrementUsage(): number {
  const current = getUsageCount()
  const newCount = current + 1
  localStorage.setItem(STORAGE_KEY, newCount.toString())
  return newCount
}

function VoiceInterface({ accessToken, onUse }: { accessToken: string; onUse: () => void }) {
  const { connect, disconnect, status, messages, sendSessionSettings } = useVoice()
  const [isConnecting, setIsConnecting] = useState(false)
  const [hasConnectedOnce, setHasConnectedOnce] = useState(false)

  const handleConnect = useCallback(async () => {
    setIsConnecting(true)
    try {
      await connect({
        auth: { type: 'accessToken', value: accessToken },
      })
      sendSessionSettings({
        systemPrompt: `You are a friendly assistant for Fractional.Quest, a UK platform for fractional executive jobs.
        Help users find fractional jobs (CFO, CMO, CTO, COO, HR Director), answer questions about fractional work,
        day rates (typically £800-1500/day), and the UK market. Be concise and helpful.
        If they want to browse jobs, direct them to /fractional-jobs. For articles, /fractional-jobs-articles.`
      })
      if (!hasConnectedOnce) {
        onUse()
        setHasConnectedOnce(true)
      }
    } catch (error) {
      console.error('Failed to connect:', error)
    }
    setIsConnecting(false)
  }, [connect, accessToken, sendSessionSettings, onUse, hasConnectedOnce])

  const handleDisconnect = useCallback(() => {
    disconnect()
  }, [disconnect])

  const isConnected = status.value === 'connected'

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Voice Button */}
      <button
        onClick={isConnected ? handleDisconnect : handleConnect}
        disabled={isConnecting}
        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
          isConnected
            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
            : isConnecting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-white hover:bg-purple-50 border-2 border-purple-200'
        }`}
      >
        {isConnecting ? (
          <div className="w-6 h-6 border-3 border-purple-700 border-t-transparent rounded-full animate-spin" />
        ) : isConnected ? (
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
          </svg>
        ) : (
          <svg className="w-8 h-8 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
      </button>

      {/* Status */}
      <p className={`text-sm font-medium ${isConnected ? 'text-white' : 'text-purple-200'}`}>
        {isConnecting ? 'Connecting...' : isConnected ? 'Listening... tap to stop' : 'Tap to talk'}
      </p>

      {/* Last message */}
      {messages.length > 0 && (
        <div className="max-w-md bg-white/10 backdrop-blur rounded-lg px-4 py-2 text-white text-sm">
          {(() => {
            const lastMsg = messages[messages.length - 1] as { message?: { content?: string } } | undefined
            const content = lastMsg?.message?.content || ''
            return (
              <>
                {content.slice(0, 150)}
                {content.length > 150 && '...'}
              </>
            )
          })()}
        </div>
      )}
    </div>
  )
}

function UsageLimitReached() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
        <svg className="w-10 h-10 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <div>
        <p className="text-white font-medium mb-1">Free trial ended</p>
        <p className="text-purple-200 text-sm mb-4">Sign in for unlimited access</p>
        <Link
          href="/handler/sign-in"
          className="inline-flex items-center px-6 py-2 bg-white text-purple-900 rounded-lg font-medium hover:bg-purple-50 transition-colors"
        >
          Sign In Free
        </Link>
      </div>
    </div>
  )
}

export function HumeWidget({ variant = 'hero' }: { variant?: 'hero' | 'floating' }) {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [usageCount, setUsageCount] = useState(0)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setUsageCount(getUsageCount())
  }, [])

  useEffect(() => {
    if (!isClient) return

    async function getAccessToken() {
      try {
        const response = await fetch('/api/hume-token')
        if (!response.ok) throw new Error('Failed to get token')
        const data = await response.json()
        setAccessToken(data.accessToken)
      } catch (err) {
        setError('Voice service unavailable')
        console.error('Hume token error:', err)
      }
    }

    if (usageCount < MAX_FREE_USES) {
      getAccessToken()
    }
  }, [isClient, usageCount])

  const handleUse = () => {
    const newCount = incrementUsage()
    setUsageCount(newCount)
  }

  if (!isClient) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-white/10 animate-pulse" />
        <p className="text-purple-200 text-sm">Loading...</p>
      </div>
    )
  }

  // Check if user has exceeded free uses
  if (usageCount >= MAX_FREE_USES) {
    return <UsageLimitReached />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </div>
        <p className="text-purple-200 text-sm">Voice assistant unavailable</p>
        <Link href="/chat" className="text-white underline text-sm">Try text chat instead →</Link>
      </div>
    )
  }

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-purple-300 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-purple-200 text-sm">Initializing voice...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <VoiceProvider>
        <VoiceInterface accessToken={accessToken} onUse={handleUse} />
      </VoiceProvider>
      <p className="text-purple-300 text-xs mt-3">
        {MAX_FREE_USES - usageCount} free {MAX_FREE_USES - usageCount === 1 ? 'use' : 'uses'} remaining
      </p>
    </div>
  )
}
