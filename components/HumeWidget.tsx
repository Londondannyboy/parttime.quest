'use client'

import { useState, useCallback, useEffect } from 'react'
import { VoiceProvider, useVoice } from '@humeai/voice-react'
import Link from 'next/link'

const MAX_FREE_USES = 3
const STORAGE_KEY = 'fractional_hume_uses'
const HUME_CONFIG_ID = 'd57ceb71-4cf5-47e9-87cd-6052445a031c'

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

interface VoiceInterfaceProps {
  accessToken: string
  onUse: () => void
  darkMode?: boolean
}

function VoiceInterface({ accessToken, onUse, darkMode = true }: VoiceInterfaceProps) {
  const { connect, disconnect, status, messages } = useVoice()
  const [isConnecting, setIsConnecting] = useState(false)
  const [hasConnectedOnce, setHasConnectedOnce] = useState(false)

  const handleConnect = useCallback(async () => {
    setIsConnecting(true)
    try {
      // Connect with config ID - variables are passed via the config's system prompt
      await connect({
        auth: { type: 'accessToken', value: accessToken },
        configId: HUME_CONFIG_ID,
      })

      if (!hasConnectedOnce) {
        onUse()
        setHasConnectedOnce(true)
      }
    } catch (error) {
      console.error('Failed to connect:', error)
    }
    setIsConnecting(false)
  }, [connect, accessToken, onUse, hasConnectedOnce])

  const handleDisconnect = useCallback(() => {
    disconnect()
  }, [disconnect])

  const isConnected = status.value === 'connected'

  // Dynamic text colors based on background
  const textMuted = darkMode ? 'text-purple-200' : 'text-gray-500'
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900'

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
      <p className={`text-sm font-medium ${isConnected ? textPrimary : textMuted}`}>
        {isConnecting ? 'Connecting...' : isConnected ? 'Listening... tap to stop' : 'Tap to talk'}
      </p>

      {/* Last message */}
      {messages.length > 0 && (
        <div className={`max-w-md rounded-lg px-4 py-2 text-sm ${darkMode ? 'bg-white/10 backdrop-blur text-white' : 'bg-gray-100 text-gray-700'}`}>
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

function UsageLimitReached({ darkMode = true }: { darkMode?: boolean }) {
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900'
  const textMuted = darkMode ? 'text-purple-200' : 'text-gray-500'
  const iconBg = darkMode ? 'bg-white/10' : 'bg-gray-100'

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className={`w-20 h-20 rounded-full ${iconBg} flex items-center justify-center`}>
        <svg className={`w-10 h-10 ${textMuted}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <div>
        <p className={`${textPrimary} font-medium mb-1`}>Free trial ended</p>
        <p className={`${textMuted} text-sm mb-4`}>Sign in for unlimited access</p>
        <Link
          href="/handler/sign-in"
          className="inline-flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
        >
          Sign In Free
        </Link>
      </div>
    </div>
  )
}

export interface HumeWidgetProps {
  variant?: 'hero' | 'floating'
  userName?: string
  isAuthenticated?: boolean
  darkMode?: boolean
}

export function HumeWidget({ variant = 'hero', userName, isAuthenticated = false, darkMode = true }: HumeWidgetProps) {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [usageCount, setUsageCount] = useState(0)
  const [isClient, setIsClient] = useState(false)

  const textMuted = darkMode ? 'text-purple-200' : 'text-gray-500'
  const iconBg = darkMode ? 'bg-white/10' : 'bg-gray-100'

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

    // Authenticated users get unlimited access
    if (isAuthenticated || usageCount < MAX_FREE_USES) {
      getAccessToken()
    }
  }, [isClient, usageCount, isAuthenticated])

  const handleUse = () => {
    // Don't count uses for authenticated users
    if (isAuthenticated) return
    const newCount = incrementUsage()
    setUsageCount(newCount)
  }

  if (!isClient) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className={`w-20 h-20 rounded-full ${iconBg} animate-pulse`} />
        <p className={`${textMuted} text-sm`}>Loading...</p>
      </div>
    )
  }

  // Check if user has exceeded free uses (only for unauthenticated users)
  if (!isAuthenticated && usageCount >= MAX_FREE_USES) {
    return <UsageLimitReached darkMode={darkMode} />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className={`w-20 h-20 rounded-full ${iconBg} flex items-center justify-center`}>
          <svg className={`w-8 h-8 ${textMuted}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </div>
        <p className={`${textMuted} text-sm`}>Voice assistant unavailable</p>
        <Link href="/chat" className={`${darkMode ? 'text-white' : 'text-purple-600'} underline text-sm`}>Try text chat instead →</Link>
      </div>
    )
  }

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className={`w-20 h-20 rounded-full ${iconBg} flex items-center justify-center`}>
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className={`${textMuted} text-sm`}>Initializing voice...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <VoiceProvider>
        <VoiceInterface
          accessToken={accessToken}
          onUse={handleUse}
          darkMode={darkMode}
        />
      </VoiceProvider>
      {!isAuthenticated && (
        <p className={`${textMuted} text-xs mt-3`}>
          {MAX_FREE_USES - usageCount} free {MAX_FREE_USES - usageCount === 1 ? 'use' : 'uses'} remaining
        </p>
      )}
    </div>
  )
}
