'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Suspense } from 'react'

// Dynamically import all visualization components (client-side only)
const JobsGlobe = dynamic(() => import('@/components/JobsGlobe').then(m => m.JobsGlobe), {
  ssr: false,
  loading: () => <LoadingPlaceholder text="Loading Globe..." />
})

const JobsSunburst = dynamic(() => import('@/components/JobsSunburst').then(m => m.JobsSunburst), {
  ssr: false,
  loading: () => <LoadingPlaceholder text="Loading Sunburst..." />
})

const JobsCalendarHeatmap = dynamic(() => import('@/components/JobsCalendarHeatmap').then(m => m.JobsCalendarHeatmap), {
  ssr: false,
  loading: () => <LoadingPlaceholder text="Loading Calendar..." />
})

const RateDistribution = dynamic(() => import('@/components/RateDistribution').then(m => m.RateDistribution), {
  ssr: false,
  loading: () => <LoadingPlaceholder text="Loading Rates..." />
})

const SkillsRadar = dynamic(() => import('@/components/SkillsRadar').then(m => m.SkillsRadar), {
  ssr: false,
  loading: () => <LoadingPlaceholder text="Loading Skills..." />
})

const JobsGraph3D = dynamic(() => import('@/components/JobsGraph3D').then(m => m.JobsGraph3D), {
  ssr: false,
  loading: () => <LoadingPlaceholder text="Loading 3D Graph..." />
})

function LoadingPlaceholder({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center h-96 bg-gray-950 rounded-xl">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-indigo-300 text-sm">{text}</p>
      </div>
    </div>
  )
}

export default function VisualizationsPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-black/50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Link href="/" className="text-gray-400 hover:text-white text-sm mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-black text-white">Visualization Gallery</h1>
          <p className="text-gray-400 mt-2">Interactive data visualizations for fractional jobs</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        {/* 1. Globe */}
        <section>
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400 mb-2 block">Geographic</span>
            <h2 className="text-3xl font-black text-white">Jobs Globe</h2>
            <p className="text-gray-400 mt-2">3D globe showing job locations across the UK and Europe</p>
          </div>
          <Suspense fallback={<LoadingPlaceholder text="Loading Globe..." />}>
            <JobsGlobe height="600px" />
          </Suspense>
        </section>

        {/* 2. Sunburst */}
        <section>
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400 mb-2 block">Hierarchical</span>
            <h2 className="text-3xl font-black text-white">Role Explorer Sunburst</h2>
            <p className="text-gray-400 mt-2">Drill down through roles, companies, and jobs</p>
          </div>
          <Suspense fallback={<LoadingPlaceholder text="Loading Sunburst..." />}>
            <JobsSunburst height="600px" />
          </Suspense>
        </section>

        {/* 3. 3D Force Graph (existing) */}
        <section>
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-2 block">Network</span>
            <h2 className="text-3xl font-black text-white">Jobs Knowledge Graph</h2>
            <p className="text-gray-400 mt-2">3D force-directed graph of jobs, skills, and companies</p>
          </div>
          <Suspense fallback={<LoadingPlaceholder text="Loading 3D Graph..." />}>
            <JobsGraph3D limit={30} height="600px" />
          </Suspense>
        </section>

        {/* 4. Skills Radar */}
        <section>
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-2 block">Comparison</span>
            <h2 className="text-3xl font-black text-white">Skills Radar</h2>
            <p className="text-gray-400 mt-2">Compare skill requirements across different C-suite roles</p>
          </div>
          <Suspense fallback={<LoadingPlaceholder text="Loading Skills..." />}>
            <SkillsRadar height="550px" />
          </Suspense>
        </section>

        {/* 5. Rate Distribution */}
        <section>
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-2 block">Salary</span>
            <h2 className="text-3xl font-black text-white">Day Rate Distribution</h2>
            <p className="text-gray-400 mt-2">Distribution of day rates across fractional jobs</p>
          </div>
          <Suspense fallback={<LoadingPlaceholder text="Loading Rates..." />}>
            <RateDistribution height="450px" />
          </Suspense>
        </section>

        {/* 6. Calendar Heatmap */}
        <section>
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400 mb-2 block">Temporal</span>
            <h2 className="text-3xl font-black text-white">Job Posting Activity</h2>
            <p className="text-gray-400 mt-2">Calendar heatmap showing when jobs are posted</p>
          </div>
          <Suspense fallback={<LoadingPlaceholder text="Loading Calendar..." />}>
            <JobsCalendarHeatmap height="300px" />
          </Suspense>
        </section>

        {/* Summary */}
        <section className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">About These Visualizations</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h3 className="font-semibold text-white mb-2">Technologies Used</h3>
              <ul className="space-y-1 text-sm">
                <li>• <span className="text-indigo-400">globe.gl</span> - 3D globe visualization</li>
                <li>• <span className="text-indigo-400">sunburst-chart</span> - Hierarchical sunburst</li>
                <li>• <span className="text-indigo-400">react-force-graph-3d</span> - 3D network graph</li>
                <li>• <span className="text-indigo-400">Canvas API</span> - Radar chart</li>
                <li>• <span className="text-indigo-400">Custom SVG</span> - Calendar heatmap</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Data Sources</h3>
              <ul className="space-y-1 text-sm">
                <li>• Live job data from the database</li>
                <li>• Skills extracted from job descriptions</li>
                <li>• Compensation data parsed from listings</li>
                <li>• Location data geocoded for globe</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
