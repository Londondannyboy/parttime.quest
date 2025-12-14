'use client'

import { useState, useCallback, useEffect } from 'react'
import { VoiceProvider, useVoice } from '@humeai/voice-react'
import Link from 'next/link'

function VoiceInterface({ accessToken }: { accessToken: string }) {
  const { connect, disconnect, status, messages, sendSessionSettings } = useVoice()
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = useCallback(async () => {
    setIsConnecting(true)
    try {
      await connect({
        auth: { type: 'accessToken', value: accessToken },
      })
      // Send session settings after connection
      sendSessionSettings({
        systemPrompt: `You are a helpful assistant for Part-Time Quest, a UK-based platform for part-time executive jobs.
        Help users find part-time jobs (CFO, CMO, CTO, COO, HR Director positions), answer questions about part-time work,
        day rates (typically £800-1500/day), and the UK market. Be conversational and helpful.
        You can discuss topics like: part-time vs full-time work, typical engagement lengths,
        industries hiring part-time executives, and how to transition to part-time work.`
      })
    } catch (error) {
      console.error('Failed to connect:', error)
    }
    setIsConnecting(false)
  }, [connect, accessToken, sendSessionSettings])

  const handleDisconnect = useCallback(() => {
    disconnect()
  }, [disconnect])

  const isConnected = status.value === 'connected'
  const isError = status.value === 'error'

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Voice Control Button */}
      <div className="relative">
        <button
          onClick={isConnected ? handleDisconnect : handleConnect}
          disabled={isConnecting}
          className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
            isConnected
              ? 'bg-red-500 hover:bg-red-600 animate-pulse'
              : isConnecting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-purple-700 hover:bg-purple-800'
          }`}
        >
          {isConnecting ? (
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
          ) : isConnected ? (
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
          ) : (
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
        </button>

        {/* Pulse Animation Ring */}
        {isConnected && (
          <div className="absolute inset-0 rounded-full bg-purple-500 opacity-30 animate-ping" />
        )}
      </div>

      {/* Status Text */}
      <div className="text-center">
        <p className={`text-lg font-medium ${isError ? 'text-red-600' : 'text-gray-700'}`}>
          {isConnecting
            ? 'Connecting...'
            : isConnected
            ? 'Listening... Click to stop'
            : isError
            ? 'Connection error. Try again.'
            : 'Click to start talking'}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          {isConnected ? 'Ask about part-time jobs, day rates, or career advice' : 'Voice-powered job search assistant'}
        </p>
      </div>

      {/* Conversation Display */}
      {messages.length > 0 && (
        <div className="w-full max-w-2xl bg-gray-50 rounded-xl p-6 max-h-96 overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">Conversation</h3>
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.type === 'user_message' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.type === 'user_message'
                      ? 'bg-purple-700 text-white'
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}
                >
                  <p className="text-sm">
                    {msg.type === 'user_message' && msg.message?.content}
                    {msg.type === 'assistant_message' && msg.message?.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Example Questions */}
      <div className="w-full max-w-2xl">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Try asking</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            "What is a part-time CFO?",
            "How much do part-time executives earn?",
            "What jobs are available in London?",
            "How do I transition to part-time work?",
          ].map((question, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-600"
            >
              "{question}"
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function VoicePage() {
  // Auth state is handled at layout level - no need to check here
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch access token from our API
    async function getAccessToken() {
      try {
        const response = await fetch('/api/hume-token')
        if (!response.ok) {
          throw new Error('Failed to get access token')
        }
        const data = await response.json()
        setAccessToken(data.accessToken)
      } catch (err) {
        setError('Voice service unavailable. Please try again later.')
        console.error('Error getting Hume token:', err)
      }
    }
    getAccessToken()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <div className="bg-purple-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Voice Assistant</h1>
          <p className="text-xl text-purple-100">
            Talk to our AI assistant about part-time jobs, day rates, and career opportunities
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Sign In Banner - Always shown, auth state checked via Navigation */}
        <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-yellow-800">
            <Link href="/handler/sign-in" className="font-medium underline hover:text-yellow-900">
              Sign in
            </Link>{' '}
            to save your conversation history and get personalized recommendations.
          </p>
        </div>

        {error ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : !accessToken ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-700 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Initializing voice assistant...</p>
          </div>
        ) : (
          <VoiceProvider>
            <VoiceInterface accessToken={accessToken} />
          </VoiceProvider>
        )}
      </div>

      {/* Info Section */}
      <div className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
                <span className="text-purple-700 font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Click to Start</h3>
              <p className="text-gray-600 text-sm">Press the microphone button to begin your conversation</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
                <span className="text-purple-700 font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Ask Questions</h3>
              <p className="text-gray-600 text-sm">Ask about jobs, day rates, locations, or career advice</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
                <span className="text-purple-700 font-bold">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Get Answers</h3>
              <p className="text-gray-600 text-sm">Receive personalized guidance from our AI assistant</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
