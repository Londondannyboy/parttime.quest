'use client'

import { useEffect, useState, useRef } from 'react'

interface SkillData {
  skill: string
  [role: string]: number | string
}

export interface SkillsRadarProps {
  height?: string
  roles?: string[]
}

const ROLE_COLORS: Record<string, string> = {
  'CFO': '#3b82f6',
  'CTO': '#10b981',
  'CMO': '#f59e0b',
  'COO': '#8b5cf6',
}

const DEFAULT_ROLES = ['CFO', 'CTO', 'CMO', 'COO']

export function SkillsRadar({ height = '500px', roles = DEFAULT_ROLES }: SkillsRadarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [skillData, setSkillData] = useState<SkillData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch('/api/graph/jobs?limit=500')
        if (!response.ok) throw new Error('Failed to fetch')

        const result = await response.json()
        const graphData = result.graph || result
        const jobs = graphData.nodes?.filter((n: any) => n.type === 'job') || []
        const skills = graphData.nodes?.filter((n: any) => n.type === 'skill') || []
        const edges = graphData.edges || []

        // Count skills per role
        const roleSkillCounts: Record<string, Record<string, number>> = {}
        const roleTotals: Record<string, number> = {}

        for (const role of roles) {
          roleSkillCounts[role] = {}
          roleTotals[role] = 0
        }

        // Build job-to-skills mapping
        const jobSkillMap = new Map<string, string[]>()
        for (const edge of edges) {
          if (edge.type === 'requires_skill' || edge.label === 'requires') {
            const jobId = edge.source
            const skillId = edge.target
            const skill = skills.find((s: any) => s.id === skillId)
            if (skill) {
              if (!jobSkillMap.has(jobId)) jobSkillMap.set(jobId, [])
              jobSkillMap.get(jobId)!.push(skill.label)
            }
          }
        }

        // Count skills per role
        for (const job of jobs) {
          const title = (job.label || '').toLowerCase()
          const roleCategory = (job.data?.role_category || '').toLowerCase()

          // Determine role
          let role: string | null = null
          if (title.includes('cfo') || title.includes('finance') || roleCategory.includes('finance')) {
            role = 'CFO'
          } else if (title.includes('cto') || title.includes('tech') || roleCategory.includes('tech')) {
            role = 'CTO'
          } else if (title.includes('cmo') || title.includes('market') || roleCategory.includes('market')) {
            role = 'CMO'
          } else if (title.includes('coo') || title.includes('operat') || roleCategory.includes('operat')) {
            role = 'COO'
          }

          if (role && roles.includes(role)) {
            roleTotals[role]++
            const jobSkills = jobSkillMap.get(job.id) || []
            for (const skill of jobSkills) {
              roleSkillCounts[role][skill] = (roleSkillCounts[role][skill] || 0) + 1
            }
          }
        }

        // Find top skills across all roles
        const allSkills = new Set<string>()
        for (const role of roles) {
          Object.keys(roleSkillCounts[role]).forEach(s => allSkills.add(s))
        }

        // Sort skills by total frequency
        const skillTotals = Array.from(allSkills).map(skill => ({
          skill,
          total: roles.reduce((sum, role) => sum + (roleSkillCounts[role][skill] || 0), 0)
        }))
        skillTotals.sort((a, b) => b.total - a.total)

        // Take top 8 skills
        const topSkills = skillTotals.slice(0, 8).map(s => s.skill)

        // Build radar data (normalized to percentages)
        const radarData: SkillData[] = topSkills.map(skill => {
          const data: SkillData = { skill }
          for (const role of roles) {
            const count = roleSkillCounts[role][skill] || 0
            const total = roleTotals[role] || 1
            data[role] = Math.round((count / total) * 100)
          }
          return data
        })

        setSkillData(radarData)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching skills data:', err)
        setLoading(false)
      }
    }

    fetchJobs()
  }, [roles])

  // Draw radar chart
  useEffect(() => {
    if (loading || !canvasRef.current || skillData.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const radius = Math.min(centerX, centerY) - 60

    // Clear
    ctx.fillStyle = '#0f0f1a'
    ctx.fillRect(0, 0, rect.width, rect.height)

    const numSkills = skillData.length
    const angleStep = (Math.PI * 2) / numSkills

    // Draw grid circles
    ctx.strokeStyle = '#2a2a4a'
    ctx.lineWidth = 1
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, (radius * i) / 5, 0, Math.PI * 2)
      ctx.stroke()
    }

    // Draw spokes and labels
    ctx.fillStyle = '#6b7280'
    ctx.font = '12px system-ui'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    skillData.forEach((d, i) => {
      const angle = i * angleStep - Math.PI / 2
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius

      // Spoke
      ctx.strokeStyle = '#2a2a4a'
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.stroke()

      // Label
      const labelX = centerX + Math.cos(angle) * (radius + 30)
      const labelY = centerY + Math.sin(angle) * (radius + 30)
      ctx.fillStyle = hoveredSkill === d.skill ? '#ffffff' : '#9ca3af'
      ctx.fillText(d.skill, labelX, labelY)
    })

    // Draw data polygons for each role
    roles.forEach((role, roleIndex) => {
      if (selectedRole && selectedRole !== role) return

      const color = ROLE_COLORS[role] || '#6366f1'

      ctx.beginPath()
      skillData.forEach((d, i) => {
        const value = (d[role] as number) || 0
        const angle = i * angleStep - Math.PI / 2
        const r = (value / 100) * radius
        const x = centerX + Math.cos(angle) * r
        const y = centerY + Math.sin(angle) * r

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.closePath()

      // Fill
      ctx.fillStyle = color + '33'
      ctx.fill()

      // Stroke
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.stroke()

      // Points
      skillData.forEach((d, i) => {
        const value = (d[role] as number) || 0
        const angle = i * angleStep - Math.PI / 2
        const r = (value / 100) * radius
        const x = centerX + Math.cos(angle) * r
        const y = centerY + Math.sin(angle) * r

        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
      })
    })

    // Draw percentage labels
    ctx.fillStyle = '#4b5563'
    ctx.font = '10px system-ui'
    for (let i = 1; i <= 5; i++) {
      ctx.fillText(`${i * 20}%`, centerX + 5, centerY - (radius * i) / 5 + 3)
    }

  }, [loading, skillData, roles, selectedRole, hoveredSkill])

  return (
    <div className="relative bg-gray-950 rounded-xl p-6" style={{ minHeight: height }}>
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-indigo-300 text-sm">Loading skills...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Role selector */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <button
              onClick={() => setSelectedRole(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !selectedRole
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              All Roles
            </button>
            {roles.map(role => (
              <button
                key={role}
                onClick={() => setSelectedRole(selectedRole === role ? null : role)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2`}
                style={{
                  backgroundColor: selectedRole === role ? ROLE_COLORS[role] : '#1f2937',
                  color: selectedRole === role ? 'white' : '#9ca3af'
                }}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: ROLE_COLORS[role] }}
                />
                {role}
              </button>
            ))}
          </div>

          {/* Canvas */}
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              className="w-full max-w-lg"
              style={{ height: '400px' }}
            />
          </div>

          {/* Legend */}
          <div className="mt-4 text-center text-xs text-gray-500">
            Percentage of jobs in each role requiring each skill
          </div>
        </>
      )}
    </div>
  )
}
