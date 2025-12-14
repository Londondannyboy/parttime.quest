import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Part-Time Quest - UK Part-Time Executive Jobs Platform'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          backgroundImage: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 50%, #1a1a1a 100%)',
        }}
      >
        {/* Grid pattern overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Content container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
            textAlign: 'center',
          }}
        >
          {/* Main title */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: 24,
              letterSpacing: '-2px',
            }}
          >
            Part-Time Quest
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 36,
              color: '#a1a1aa',
              marginBottom: 48,
            }}
          >
            UK&apos;s #1 Part-Time Executive Platform
          </div>

          {/* Stats row */}
          <div
            style={{
              display: 'flex',
              gap: 32,
              marginBottom: 48,
            }}
          >
            {['CFO', 'CTO', 'CMO', 'COO'].map((role) => (
              <div
                key={role}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 24px',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <span style={{ color: '#ffffff', fontSize: 24, fontWeight: 600 }}>
                  Part-Time {role}
                </span>
              </div>
            ))}
          </div>

          {/* URL */}
          <div
            style={{
              fontSize: 24,
              color: '#71717a',
            }}
          >
            parttime.quest
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
