'use client'

import { useMemo, useState } from 'react'
import { KnowledgeGraph } from './KnowledgeGraph'

interface GraphNode {
  id: string
  type: 'user' | 'skill' | 'job' | 'company' | 'preference' | 'fact'
  label: string
  data?: Record<string, unknown>
}

interface GraphEdge {
  source: string
  target: string
  type: string
  weight?: number
  label?: string
}

// Typical skills for each role - based on UK market data
const ROLE_SKILLS: Record<string, { core: string[]; technical: string[]; soft: string[] }> = {
  cmo: {
    core: ['Marketing Strategy', 'Brand Development', 'Demand Generation', 'Growth Marketing', 'Marketing Operations'],
    technical: ['Performance Marketing', 'Marketing Automation', 'Analytics & Attribution', 'SEO/SEM', 'Content Strategy'],
    soft: ['Leadership', 'Stakeholder Management', 'Budget Management', 'Team Building', 'Board Communication'],
  },
  cfo: {
    core: ['Financial Planning & Analysis', 'Cash Flow Management', 'Fundraising', 'Financial Reporting', 'Treasury'],
    technical: ['M&A Due Diligence', 'ERP Systems', 'Financial Modelling', 'Tax Strategy', 'Audit & Compliance'],
    soft: ['Board Communication', 'Investor Relations', 'Risk Management', 'Strategic Planning', 'Team Leadership'],
  },
  cto: {
    core: ['Technical Strategy', 'Architecture Design', 'Engineering Leadership', 'Product Development', 'DevOps'],
    technical: ['Cloud Infrastructure', 'Security & Compliance', 'API Design', 'Data Architecture', 'AI/ML'],
    soft: ['Technical Hiring', 'Vendor Management', 'Stakeholder Communication', 'Agile/Scrum', 'Mentorship'],
  },
  coo: {
    core: ['Operations Strategy', 'Process Optimisation', 'Scaling Operations', 'Supply Chain', 'Project Management'],
    technical: ['ERP Implementation', 'Workflow Automation', 'Quality Management', 'Vendor Management', 'Analytics'],
    soft: ['Cross-functional Leadership', 'Change Management', 'Team Building', 'Crisis Management', 'Communication'],
  },
  ciso: {
    core: ['Security Strategy', 'Risk Assessment', 'Compliance (SOC2, ISO)', 'Incident Response', 'Security Architecture'],
    technical: ['Penetration Testing', 'Identity Management', 'Cloud Security', 'SIEM/SOAR', 'Network Security'],
    soft: ['Executive Communication', 'Vendor Assessment', 'Policy Development', 'Training Programs', 'Crisis Management'],
  },
  chro: {
    core: ['People Strategy', 'Talent Acquisition', 'Organisational Design', 'Culture Development', 'Employee Experience'],
    technical: ['HRIS Systems', 'Compensation & Benefits', 'Performance Management', 'Learning & Development', 'HR Analytics'],
    soft: ['Change Management', 'Executive Coaching', 'Conflict Resolution', 'Communication', 'Employment Law'],
  },
  cpo: {
    core: ['Product Strategy', 'Product-Market Fit', 'Roadmap Planning', 'User Research', 'Product Analytics'],
    technical: ['A/B Testing', 'Agile/Scrum', 'Product Discovery', 'Prioritisation Frameworks', 'Competitive Analysis'],
    soft: ['Stakeholder Management', 'Cross-functional Leadership', 'Customer Empathy', 'Data-Driven Decisions', 'Storytelling'],
  },
}

const ROLE_LABELS: Record<string, string> = {
  cmo: 'CMO',
  cfo: 'CFO',
  cto: 'CTO',
  coo: 'COO',
  ciso: 'CISO',
  chro: 'CHRO',
  cpo: 'CPO',
}

interface RoleSkillsGraphProps {
  role: keyof typeof ROLE_SKILLS
  width?: number
  height?: number
  showLegend?: boolean
  className?: string
}

export function RoleSkillsGraph({
  role,
  width = 700,
  height = 400,
  showLegend = true,
  className = ''
}: RoleSkillsGraphProps) {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  const skills = ROLE_SKILLS[role] || ROLE_SKILLS.cmo
  const roleLabel = ROLE_LABELS[role] || 'CMO'

  const graphData = useMemo(() => {
    const nodes: GraphNode[] = []
    const edges: GraphEdge[] = []

    // Central role node
    nodes.push({
      id: `role-${role}`,
      type: 'job',
      label: `Part-Time ${roleLabel}`,
      data: { central: true },
    })

    // Add core skills (closest to center)
    skills.core.forEach((skill, idx) => {
      const skillId = `core-${idx}`
      nodes.push({
        id: skillId,
        type: 'skill',
        label: skill,
        data: { category: 'core' },
      })
      edges.push({
        source: `role-${role}`,
        target: skillId,
        type: 'requires',
        label: 'core',
        weight: 3,
      })
    })

    // Add technical skills
    skills.technical.forEach((skill, idx) => {
      const skillId = `tech-${idx}`
      nodes.push({
        id: skillId,
        type: 'fact',
        label: skill,
        data: { category: 'technical' },
      })
      edges.push({
        source: `role-${role}`,
        target: skillId,
        type: 'uses',
        label: 'technical',
        weight: 2,
      })
    })

    // Add soft skills
    skills.soft.forEach((skill, idx) => {
      const skillId = `soft-${idx}`
      nodes.push({
        id: skillId,
        type: 'preference',
        label: skill,
        data: { category: 'soft' },
      })
      edges.push({
        source: `role-${role}`,
        target: skillId,
        type: 'demonstrates',
        label: 'soft',
        weight: 1,
      })
    })

    return { nodes, edges }
  }, [role, roleLabel, skills])

  return (
    <div className={`bg-gradient-to-br from-gray-50 to-white border border-gray-200 overflow-hidden ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 block mb-1">Skills Graph</span>
            <h3 className="text-xl font-black text-gray-900">
              Typical {roleLabel} Skills & Competencies
            </h3>
          </div>
          {showLegend && (
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-gray-600">Core Skills</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                <span className="text-gray-600">Technical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pink-500" />
                <span className="text-gray-600">Soft Skills</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        <KnowledgeGraph
          data={graphData}
          width={width}
          height={height}
          onNodeClick={(node) => setHoveredSkill(node.label)}
        />
      </div>

      {/* Skills List Below */}
      <div className="p-6 bg-gray-50 border-t border-gray-200">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-blue-600 mb-3">Core Skills</h4>
            <ul className="space-y-2">
              {skills.core.map((skill, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  {skill}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-600 mb-3">Technical Skills</h4>
            <ul className="space-y-2">
              {skills.technical.map((skill, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                  {skill}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-pink-600 mb-3">Soft Skills</h4>
            <ul className="space-y-2">
              {skills.soft.map((skill, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export { ROLE_SKILLS, ROLE_LABELS }
