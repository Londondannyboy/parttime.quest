'use client'

import { useState, useRef, useEffect } from 'react'
import { useUser } from '@stackframe/stack'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

const MAX_FREE_MESSAGES = 3
const STORAGE_KEY = 'parttime_chat_uses'

function getChatUsageCount(): number {
  if (typeof window === 'undefined') return 0
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? parseInt(stored, 10) : 0
}

function incrementChatUsage(): number {
  const current = getChatUsageCount()
  const newCount = current + 1
  localStorage.setItem(STORAGE_KEY, newCount.toString())
  return newCount
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  sources?: { title: string; slug: string }[]
}

export default function ChatPage() {
  const user = useUser()
  const isAuthenticated = !!user
  const firstName = user?.displayName?.split(' ')[0]

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: firstName
        ? `Hi ${firstName}! I'm your Part-Time Quest assistant. I can help you find information about part-time jobs, answer questions about our articles, and provide guidance on part-time executive careers. What would you like to know?`
        : "Hi! I'm your Part-Time Quest assistant. I can help you find information about part-time jobs, answer questions about our articles, and provide guidance on part-time executive careers. What would you like to know?",
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [usageCount, setUsageCount] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsClient(true)
    setUsageCount(getChatUsageCount())
  }, [])

  // Update greeting when user state changes
  useEffect(() => {
    if (firstName && messages.length === 1 && messages[0].role === 'assistant') {
      setMessages([{
        role: 'assistant',
        content: `Hi ${firstName}! I'm your Part-Time Quest assistant. I can help you find information about part-time jobs, answer questions about our articles, and provide guidance on part-time executive careers. What would you like to know?`,
      }])
    }
  }, [firstName, messages.length])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Check usage limit (only for unauthenticated users)
    if (!isAuthenticated && usageCount >= MAX_FREE_MESSAGES) {
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: input.trim() },
        {
          role: 'assistant',
          content: "You've reached your free message limit. Sign in for unlimited access to our chat assistant!",
        },
      ])
      setInput('')
      return
    }

    const userMessage = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    // Only increment usage for unauthenticated users
    if (!isAuthenticated) {
      const newCount = incrementChatUsage()
      setUsageCount(newCount)
    }

    try {
      // Call our chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      })

      if (!response.ok) {
        throw new Error('Chat request failed')
      }

      const data = await response.json()
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.response,
          sources: data.sources,
        },
      ])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm sorry, I encountered an error. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const remainingUses = Math.max(0, MAX_FREE_MESSAGES - usageCount)

  const suggestedQuestions = [
    "What is a part-time executive?",
    "Show me articles about CFO jobs",
    "What are typical day rates for part-time work?",
    "How do I transition to part-time consulting?",
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-purple-700 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-2">Chat with Our Assistant</h1>
          <p className="text-purple-100">
            Ask questions about part-time jobs, get career advice, or explore our articles
          </p>
        </div>
      </div>

      {/* Sign In Banner - Only show for unauthenticated users */}
      {!isAuthenticated && (
        <div className="bg-yellow-50 border-b border-yellow-200 py-3">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-yellow-800 text-sm">
              <Link href="/handler/sign-in" className="font-medium underline hover:text-yellow-900">
                Sign in
              </Link>{' '}
              to save your chat history and get unlimited messages.
            </p>
          </div>
        </div>
      )}

      {/* Chat Container */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-purple-700 text-white'
                    : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
                }`}
              >
                {message.role === 'assistant' ? (
                  <div className="prose prose-sm max-w-none prose-purple">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p>{message.content}</p>
                )}

                {/* Source Articles */}
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-600 font-medium mb-2">Related Articles:</p>
                    <div className="space-y-1">
                      {message.sources.map((source, idx) => (
                        <Link
                          key={idx}
                          href={`/${source.slug}`}
                          className="block text-sm text-purple-600 hover:text-purple-800 hover:underline"
                        >
                          {source.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-700 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-700 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-700 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length <= 1 && (
          <div className="mb-4">
            <p className="text-xs text-gray-600 font-medium mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInput(question)}
                  className="text-sm bg-white border border-gray-200 rounded-full px-4 py-2 text-gray-600 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about part-time jobs, articles, or career advice..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-purple-700 text-white rounded-xl font-medium hover:bg-purple-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>

        {/* Usage Counter & Footer */}
        <div className="text-center mt-4 space-y-2">
          {isClient && !isAuthenticated && remainingUses > 0 && (
            <p className="text-xs text-purple-600 font-medium">
              {remainingUses} free {remainingUses === 1 ? 'message' : 'messages'} remaining
            </p>
          )}
          {isClient && !isAuthenticated && remainingUses === 0 && (
            <p className="text-xs text-orange-600 font-medium">
              Free trial ended.{' '}
              <Link href="/handler/sign-in" className="underline hover:text-orange-800">
                Sign in
              </Link>{' '}
              for unlimited access.
            </p>
          )}
          {isAuthenticated && (
            <p className="text-xs text-green-600 font-medium">
              Unlimited messages
            </p>
          )}
          <p className="text-xs text-gray-600">
            Powered by AI. For job listings, visit our{' '}
            <Link href="/fractionaljobsuk" className="text-purple-600 hover:underline">
              jobs page
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
