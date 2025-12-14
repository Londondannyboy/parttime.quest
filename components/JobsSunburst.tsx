'use client'

import { useEffect, useRef, useState } from 'react'

interface SunburstNode {
  name: string
  value?: number
  children?: SunburstNode[]
  color?: string
  url?: string
}

export interface JobsSunburstProps {
  height?: string
}

const ROLE_COLORS: Record<string, string> = {
  'CFO': '#3b82f6',
  'CTO': '#10b981',
  'CMO': '#f59e0b',
  'COO': '#8b5cf6',
  'CHRO': '#ec4899',
  'CPO': '#06b6d4',
  'Other': '#6366f1',
}

export function JobsSunburst({ height = '600px' }: JobsSunburstProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<any>(null)
  const [data, setData] = useState<SunburstNode | null>(null)
  const [loading, setLoading] = useState(true)
  const [breadcrumb, setBreadcrumb] = useState<string[]>(['Part-Time Jobs'])

  // Fetch and process job data
  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch('/api/graph/jobs?limit=200')
        if (!response.ok) throw new Error('Failed to fetch')

        const result = await response.json()
        const graphData = result.graph || result
        const jobs = graphData.nodes?.filter((n: any) => n.type === 'job') || []
        const skills = graphData.nodes?.filter((n: any) => n.type === 'skill') || []
        const edges = graphData.edges || []

        // Build skill lookup from edges
        const jobSkills = new Map<string, string[]>()
        for (const edge of edges) {
          if (edge.type === 'requires_skill' || edge.label === 'requires') {
            const jobId = edge.source
            const skillId = edge.target
            const skill = skills.find((s: any) => s.id === skillId)
            if (skill) {
              if (!jobSkills.has(jobId)) jobSkills.set(jobId, [])
              jobSkills.get(jobId)!.push(skill.label)
            }
          }
        }

        // Group jobs by role category
        const roleGroups = new Map<string, Map<string, SunburstNode[]>>()

        for (const job of jobs) {
          const roleCategory = job.data?.role_category || 'Other'
          const company = job.data?.company || 'Unknown'

          // Determine which C-suite role this belongs to
          let role = 'Other'
          const title = (job.label || '').toLowerCase()
          if (title.includes('cfo') || title.includes('finance') || roleCategory.toLowerCase().includes('finance')) {
            role = 'CFO'
          } else if (title.includes('cto') || title.includes('tech') || roleCategory.toLowerCase().includes('tech')) {
            role = 'CTO'
          } else if (title.includes('cmo') || title.includes('market') || roleCategory.toLowerCase().includes('market')) {
            role = 'CMO'
          } else if (title.includes('coo') || title.includes('operat') || roleCategory.toLowerCase().includes('operat')) {
            role = 'COO'
          } else if (title.includes('chro') || title.includes('hr') || title.includes('people')) {
            role = 'CHRO'
          } else if (title.includes('cpo') || title.includes('product')) {
            role = 'CPO'
          }

          if (!roleGroups.has(role)) {
            roleGroups.set(role, new Map())
          }

          const companyMap = roleGroups.get(role)!
          if (!companyMap.has(company)) {
            companyMap.set(company, [])
          }

          // Add job as leaf node
          const jobSkillsList = jobSkills.get(job.id) || []
          companyMap.get(company)!.push({
            name: job.label || 'Job',
            value: 1,
            url: job.data?.slug ? `/part-time-job/${job.data.slug}` : undefined,
            children: jobSkillsList.length > 0 ? jobSkillsList.map(s => ({ name: s, value: 1 })) : undefined
          })
        }

        // Build hierarchical structure
        const rootChildren: SunburstNode[] = []

        for (const [role, companyMap] of roleGroups) {
          const companyChildren: SunburstNode[] = []

          for (const [company, companyJobs] of companyMap) {
            if (companyJobs.length > 0) {
              companyChildren.push({
                name: company,
                children: companyJobs,
                color: ROLE_COLORS[role]
              })
            }
          }

          if (companyChildren.length > 0) {
            rootChildren.push({
              name: role,
              children: companyChildren,
              color: ROLE_COLORS[role]
            })
          }
        }

        setData({
          name: 'Part-Time Jobs',
          children: rootChildren
        })
        setLoading(false)
      } catch (err) {
        console.error('Error fetching jobs for sunburst:', err)
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  // Initialize sunburst chart
  useEffect(() => {
    if (loading || !containerRef.current || !data) return

    import('sunburst-chart').then((SunburstModule) => {
      const Sunburst = SunburstModule.default

      if (chartRef.current) {
        containerRef.current?.querySelector('svg')?.remove()
      }

      // @ts-ignore - sunburst-chart uses factory function pattern
      const chart = Sunburst()
        .data(data)
        .width(containerRef.current!.offsetWidth)
        .height(parseInt(height))
        .color((d: any) => d.color || '#6366f1')
        .strokeColor(() => '#1a1a2e')
        .label((d: any) => d.name)
        .labelOrientation('angular')
        .tooltipContent((d: any) => {
          if (d.url) {
            return `<div style="background: rgba(0,0,0,0.9); padding: 8px 12px; border-radius: 6px;">
              <div style="color: white; font-weight: 600;">${d.name}</div>
              <div style="color: #a5b4fc; font-size: 12px;">Click to view job</div>
            </div>`
          }
          const count = d.children?.length || d.value || 0
          return `<div style="background: rgba(0,0,0,0.9); padding: 8px 12px; border-radius: 6px;">
            <div style="color: white; font-weight: 600;">${d.name}</div>
            <div style="color: #a5b4fc; font-size: 12px;">${count} ${d.children ? 'items' : 'job(s)'}</div>
          </div>`
        })
        .onClick((d: any) => {
          if (d?.url) {
            window.location.href = d.url
          } else if (d) {
            // Update breadcrumb
            const path = []
            let node = d
            while (node) {
              path.unshift(node.name)
              node = node.parent
            }
            setBreadcrumb(path)
            chart.focusOnNode(d)
          }
        })
        .transitionDuration(500)

      chart(containerRef.current)
      chartRef.current = chart
    })

    return () => {
      chartRef.current = null
    }
  }, [loading, data, height])

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && containerRef.current) {
        chartRef.current.width(containerRef.current.offsetWidth)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleReset = () => {
    if (chartRef.current) {
      chartRef.current.focusOnNode(null)
      setBreadcrumb(['Part-Time Jobs'])
    }
  }

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
            <p className="text-indigo-300 text-sm">Loading sunburst...</p>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      {!loading && (
        <div className="absolute top-4 left-4 bg-black/60 px-4 py-2 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            {breadcrumb.map((item, i) => (
              <span key={i} className="flex items-center">
                {i > 0 && <span className="text-gray-500 mx-2">›</span>}
                <span className={i === breadcrumb.length - 1 ? 'text-white font-medium' : 'text-gray-400'}>
                  {item}
                </span>
              </span>
            ))}
          </div>
          {breadcrumb.length > 1 && (
            <button
              onClick={handleReset}
              className="text-indigo-400 text-xs mt-1 hover:text-indigo-300"
            >
              ← Reset view
            </button>
          )}
        </div>
      )}

      {/* Legend */}
      {!loading && (
        <div className="absolute bottom-4 right-4 bg-black/60 px-4 py-3 rounded-lg">
          <p className="text-white text-xs font-medium mb-2">Role Categories</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {Object.entries(ROLE_COLORS).slice(0, 6).map(([role, color]) => (
              <div key={role} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-gray-300 text-xs">{role}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      {!loading && (
        <div className="absolute bottom-4 left-4 bg-black/60 px-4 py-2 rounded-lg text-xs text-gray-400">
          Click to drill down • Click center to go back
        </div>
      )}
    </div>
  )
}
