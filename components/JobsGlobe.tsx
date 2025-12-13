'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

interface JobLocation {
  city: string
  country: string
  lat: number
  lng: number
  jobCount: number
  jobs: Array<{ title: string; company: string; slug: string }>
}

export interface JobsGlobeProps {
  height?: string
  focusCity?: 'london' | 'manchester' | 'birmingham' | 'edinburgh' | 'dublin' | 'uk'
}

// UK and major European cities with coordinates
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  'london': { lat: 51.5074, lng: -0.1278 },
  'manchester': { lat: 53.4808, lng: -2.2426 },
  'birmingham': { lat: 52.4862, lng: -1.8904 },
  'leeds': { lat: 53.8008, lng: -1.5491 },
  'glasgow': { lat: 55.8642, lng: -4.2518 },
  'edinburgh': { lat: 55.9533, lng: -3.1883 },
  'bristol': { lat: 51.4545, lng: -2.5879 },
  'liverpool': { lat: 53.4084, lng: -2.9916 },
  'newcastle': { lat: 54.9783, lng: -1.6178 },
  'sheffield': { lat: 53.3811, lng: -1.4701 },
  'cambridge': { lat: 52.2053, lng: 0.1218 },
  'oxford': { lat: 51.7520, lng: -1.2577 },
  'reading': { lat: 51.4543, lng: -0.9781 },
  'cardiff': { lat: 51.4816, lng: -3.1791 },
  'belfast': { lat: 54.5973, lng: -5.9301 },
  'dublin': { lat: 53.3498, lng: -6.2603 },
  'paris': { lat: 48.8566, lng: 2.3522 },
  'amsterdam': { lat: 52.3676, lng: 4.9041 },
  'berlin': { lat: 52.5200, lng: 13.4050 },
  'remote': { lat: 51.5074, lng: -0.1278 }, // Default to London for remote
  'uk': { lat: 53.0, lng: -1.5 }, // Center of UK
  'united kingdom': { lat: 53.0, lng: -1.5 },
}

function getCityCoords(location: string): { lat: number; lng: number } | null {
  const loc = location.toLowerCase()

  // Check for exact match
  for (const [city, coords] of Object.entries(CITY_COORDS)) {
    if (loc.includes(city)) {
      return coords
    }
  }

  // Default to London for UK jobs
  if (loc.includes('uk') || loc.includes('united kingdom') || loc.includes('england')) {
    return CITY_COORDS['london']
  }

  return null
}

export function JobsGlobe({ height = '600px', focusCity = 'london' }: JobsGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const globeRef = useRef<any>(null)
  const [locations, setLocations] = useState<JobLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState<JobLocation | null>(null)

  // Fetch and process job data
  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch('/api/graph/jobs?limit=100')
        if (!response.ok) throw new Error('Failed to fetch')

        const data = await response.json()
        const jobs = data.graph?.nodes?.filter((n: any) => n.type === 'job') || []

        // Group jobs by location
        const locationMap = new Map<string, JobLocation>()

        for (const job of jobs) {
          const location = job.data?.location || 'London, UK'
          const coords = getCityCoords(location)

          if (coords) {
            const key = `${coords.lat},${coords.lng}`
            if (!locationMap.has(key)) {
              // Extract city name
              const cityName = location.split(',')[0].trim()
              locationMap.set(key, {
                city: cityName,
                country: 'UK',
                lat: coords.lat,
                lng: coords.lng,
                jobCount: 0,
                jobs: []
              })
            }

            const loc = locationMap.get(key)!
            loc.jobCount++
            if (loc.jobs.length < 5) {
              loc.jobs.push({
                title: job.label || job.data?.title || 'Job',
                company: job.data?.company || 'Company',
                slug: job.data?.slug || ''
              })
            }
          }
        }

        setLocations(Array.from(locationMap.values()))
        setLoading(false)
      } catch (err) {
        console.error('Error fetching jobs for globe:', err)
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  // Initialize globe
  useEffect(() => {
    if (loading || !containerRef.current || locations.length === 0) return

    // Dynamically import globe.gl (client-side only)
    import('globe.gl').then((GlobeModule) => {
      const Globe = GlobeModule.default

      if (globeRef.current) {
        // Clean up existing globe
        containerRef.current?.querySelector('canvas')?.remove()
      }

      // @ts-ignore - globe.gl uses factory function pattern
      const globe = Globe()(containerRef.current!)
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
        .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
        .pointsData(locations)
        .pointLat((d: any) => d.lat)
        .pointLng((d: any) => d.lng)
        .pointAltitude((d: any) => Math.min(0.1 + d.jobCount * 0.02, 0.5))
        .pointRadius((d: any) => Math.min(0.5 + d.jobCount * 0.1, 2))
        .pointColor(() => '#6366f1')
        .pointLabel((d: any) => `
          <div style="background: rgba(0,0,0,0.8); padding: 12px; border-radius: 8px; color: white; font-family: system-ui;">
            <div style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">${d.city}</div>
            <div style="color: #a5b4fc;">${d.jobCount} job${d.jobCount > 1 ? 's' : ''}</div>
          </div>
        `)
        .onPointClick((point: any) => {
          setSelectedLocation(point)
        })
        .width(containerRef.current!.offsetWidth)
        .height(parseInt(height))

      // Auto-rotate (slower for better viewing)
      globe.controls().autoRotate = true
      globe.controls().autoRotateSpeed = 0.3

      // Focus on specified city
      const focusCoords = CITY_COORDS[focusCity] || CITY_COORDS['london']
      const altitude = focusCity === 'uk' ? 1.8 : 1.2 // Closer zoom for cities
      globe.pointOfView({ lat: focusCoords.lat, lng: focusCoords.lng, altitude }, 1500)

      globeRef.current = globe
    })

    return () => {
      if (globeRef.current) {
        globeRef.current = null
      }
    }
  }, [loading, locations, height])

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (globeRef.current && containerRef.current) {
        globeRef.current.width(containerRef.current.offsetWidth)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="relative" style={{ height }}>
      <div
        ref={containerRef}
        className="w-full h-full rounded-xl overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #0f0f1a 100%)' }}
      />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-indigo-300 text-sm">Loading globe...</p>
          </div>
        </div>
      )}

      {/* Selected location panel */}
      {selectedLocation && (
        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-xl p-4 max-w-xs border border-indigo-500/30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold">{selectedLocation.city}</h3>
            <button
              onClick={() => setSelectedLocation(null)}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-indigo-400 text-sm mb-3">{selectedLocation.jobCount} jobs available</p>
          <div className="space-y-2">
            {selectedLocation.jobs.map((job, i) => (
              <a
                key={i}
                href={`/fractional-job/${job.slug}`}
                className="block p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <p className="text-white text-sm font-medium truncate">{job.title}</p>
                <p className="text-gray-400 text-xs truncate">{job.company}</p>
              </a>
            ))}
          </div>
          {selectedLocation.jobCount > 5 && (
            <a
              href={`/fractional-jobs?location=${encodeURIComponent(selectedLocation.city)}`}
              className="block mt-3 text-center text-indigo-400 text-sm hover:text-indigo-300"
            >
              View all {selectedLocation.jobCount} jobs →
            </a>
          )}
        </div>
      )}

      {/* Legend */}
      {!loading && (
        <div className="absolute bottom-4 left-4 bg-black/60 px-4 py-3 rounded-lg text-sm">
          <p className="text-white font-medium mb-2">Job Locations</p>
          <p className="text-gray-400 text-xs">Click a point to see jobs</p>
          <p className="text-gray-400 text-xs">Drag to rotate • Scroll to zoom</p>
        </div>
      )}
    </div>
  )
}
