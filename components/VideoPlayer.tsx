'use client'

import { useState } from 'react'

interface VideoPlayerProps {
  playbackId?: string
  thumbnailUrl?: string
  title?: string
  duration?: number
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
}

export function VideoPlayer({
  playbackId,
  thumbnailUrl,
  title = 'Video',
  duration,
  autoPlay = false,
  muted = true,
  loop = false,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay)

  // If no playback ID, show placeholder
  if (!playbackId) {
    return (
      <div className="w-full bg-gray-900 rounded-lg overflow-hidden relative group">
        <div className="relative w-full h-0 pb-[56.25%]">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-xl font-bold mb-2">{title}</h3>
              <p className="text-sm text-purple-100">Video Coming Soon</p>
              {duration && <p className="text-xs text-purple-200 mt-2">{duration} min</p>}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-black rounded-lg overflow-hidden shadow-lg">
      <div className="relative w-full h-0 pb-[56.25%]">
        {/* Mux Video Embed */}
        <iframe
          src={`https://image.mux.com/${playbackId}/animated.gif`}
          className="absolute inset-0 w-full h-full"
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />

        {/* Fallback for actual Mux player */}
        {isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center text-white shadow-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="p-4 bg-gray-900 text-white">
        <h4 className="font-semibold mb-1">{title}</h4>
        {duration && <p className="text-sm text-gray-400">{duration} minute video</p>}
      </div>
    </div>
  )
}

export function HeroVideo({ playbackId }: { playbackId?: string }) {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {playbackId ? (
        <div className="relative w-full h-full">
          {/* Mux Video Background */}
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={`https://stream.mux.com/${playbackId}.m3u8`} type="application/x-mpegURL" />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="text-8xl mb-4">🚀</div>
            <h2 className="text-4xl font-black mb-4">Fractional Executives</h2>
            <p className="text-xl text-purple-100">Video Hero Coming Soon</p>
          </div>
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
    </div>
  )
}
