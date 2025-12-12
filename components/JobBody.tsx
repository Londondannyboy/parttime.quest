'use client'

import React from 'react'

interface JobBodyProps {
  content: string
  className?: string
}

/**
 * JobBody - Renders AI-written job descriptions with optimal readability
 *
 * Based on readability best practices:
 * - 2-3 sentences per paragraph max
 * - Clear visual spacing between paragraphs
 * - Sentences under 17 words for 75%+ comprehension
 */
export function JobBody({ content, className = '' }: JobBodyProps) {
  if (!content) return null

  // First, handle explicit paragraph breaks
  const explicitParagraphs = content
    .split(/\n\n+/)
    .map(p => p.replace(/\n/g, ' ').trim())
    .filter(p => p.length > 0)

  // Then split long paragraphs into 2-3 sentence chunks for readability
  const readableParagraphs: string[] = []

  for (const para of explicitParagraphs) {
    // Split on sentence endings followed by space and capital letter
    const sentences = para
      .split(/(?<=[.!?])\s+(?=[A-Z])/)
      .filter(s => s.trim().length > 0)

    // Group into chunks of 2-3 sentences
    for (let i = 0; i < sentences.length; i += 2) {
      const chunk = sentences.slice(i, i + 3).join(' ')
      if (chunk.trim()) {
        readableParagraphs.push(chunk.trim())
      }
    }
  }

  // If we couldn't parse sentences, just show the content
  if (readableParagraphs.length === 0) {
    readableParagraphs.push(content)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {readableParagraphs.map((para, idx) => (
        <p
          key={idx}
          className="text-lg text-gray-700 leading-8"
        >
          {para}
        </p>
      ))}
    </div>
  )
}
