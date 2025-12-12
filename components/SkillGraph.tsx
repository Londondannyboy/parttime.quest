'use client'

import { useEffect, useState, useRef } from 'react'

interface SkillNode {
  id: number
  name: string
  category: string
  level: number
  parentId: number | null
  userHas?: boolean
}

interface SkillEdge {
  source: number
  target: number
  type: 'parent' | 'related'
}

interface SkillGraphData {
  nodes: SkillNode[]
  edges: SkillEdge[]
  categories: string[]
  userSkillIds: number[]
}

interface PositionedNode extends SkillNode {
  x: number
  y: number
}

const CATEGORY_COLORS: Record<string, string> = {
  business: '#8B5CF6',    // purple
  technical: '#3B82F6',   // blue
  leadership: '#10B981',  // green
  domain: '#F59E0B',      // amber
  soft: '#EC4899',        // pink
  other: '#6B7280'        // gray
}

export function SkillGraph({ userId }: { userId?: string }) {
  const [data, setData] = useState<SkillGraphData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedNode, setSelectedNode] = useState<PositionedNode | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    async function fetchGraph() {
      try {
        const url = userId
          ? `/api/skills/graph?userId=${userId}`
          : '/api/skills/graph'
        const response = await fetch(url)
        if (response.ok) {
          const graphData = await response.json()
          setData(graphData)
        }
      } catch (error) {
        console.error('Failed to load skill graph:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchGraph()
  }, [userId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    )
  }

  if (!data || data.nodes.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No skills data available yet
      </div>
    )
  }

  // Calculate positions using a radial layout
  const positionedNodes = calculatePositions(data.nodes)

  return (
    <div className="relative">
      {/* Legend */}
      <div className="absolute top-2 left-2 bg-white/90 rounded-lg p-3 shadow-sm border text-xs">
        <div className="font-medium mb-2">Skill Categories</div>
        {data.categories.map(cat => (
          <div key={cat} className="flex items-center gap-2 mb-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: CATEGORY_COLORS[cat] || CATEGORY_COLORS.other }}
            />
            <span className="capitalize">{cat}</span>
          </div>
        ))}
      </div>

      {/* SVG Graph */}
      <svg
        ref={svgRef}
        viewBox="0 0 600 400"
        className="w-full h-[400px] bg-gray-50 rounded-xl"
      >
        {/* Edges */}
        {data.edges.map((edge, i) => {
          const source = positionedNodes.find(n => n.id === edge.source)
          const target = positionedNodes.find(n => n.id === edge.target)
          if (!source || !target) return null

          return (
            <line
              key={`edge-${i}`}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke={edge.type === 'parent' ? '#CBD5E1' : '#E2E8F0'}
              strokeWidth={edge.type === 'parent' ? 2 : 1}
              strokeDasharray={edge.type === 'related' ? '4,4' : undefined}
            />
          )
        })}

        {/* Nodes */}
        {positionedNodes.map(node => {
          const color = CATEGORY_COLORS[node.category] || CATEGORY_COLORS.other
          const isUserSkill = data.userSkillIds.includes(node.id)
          const radius = node.level === 1 ? 24 : 16

          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              className="cursor-pointer"
              onClick={() => setSelectedNode(selectedNode?.id === node.id ? null : node)}
            >
              {/* Outer ring for user skills */}
              {isUserSkill && (
                <circle
                  r={radius + 4}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth={3}
                />
              )}

              {/* Node circle */}
              <circle
                r={radius}
                fill={color}
                opacity={selectedNode && selectedNode.id !== node.id ? 0.4 : 1}
                className="transition-opacity"
              />

              {/* Label */}
              <text
                y={radius + 14}
                textAnchor="middle"
                className="text-xs fill-gray-700 font-medium"
                style={{ fontSize: node.level === 1 ? 11 : 9 }}
              >
                {node.name.length > 12 ? node.name.slice(0, 10) + '...' : node.name}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Selected Node Details */}
      {selectedNode && (
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg border p-4 max-w-xs">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: CATEGORY_COLORS[selectedNode.category] }}
            />
            <span className="font-semibold">{selectedNode.name}</span>
          </div>
          <div className="text-sm text-gray-600">
            <p>Category: <span className="capitalize">{selectedNode.category}</span></p>
            <p>Level: {selectedNode.level === 1 ? 'Core Skill' : 'Specialization'}</p>
            {data.userSkillIds.includes(selectedNode.id) && (
              <p className="text-green-600 mt-1">You have this skill</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Simple radial layout calculation
function calculatePositions(nodes: SkillNode[]): PositionedNode[] {
  const centerX = 300
  const centerY = 200

  const level1Nodes = nodes.filter(n => n.level === 1)
  const level2Nodes = nodes.filter(n => n.level === 2)

  const positioned: PositionedNode[] = []

  // Position level 1 nodes in a circle
  const level1Radius = 100
  level1Nodes.forEach((node, i) => {
    const angle = (2 * Math.PI * i) / level1Nodes.length - Math.PI / 2
    positioned.push({
      ...node,
      x: centerX + level1Radius * Math.cos(angle),
      y: centerY + level1Radius * Math.sin(angle)
    })
  })

  // Position level 2 nodes around their parents
  const level2Radius = 160
  const childrenByParent = new Map<number, SkillNode[]>()

  level2Nodes.forEach(node => {
    if (node.parentId) {
      const existing = childrenByParent.get(node.parentId) || []
      existing.push(node)
      childrenByParent.set(node.parentId, existing)
    }
  })

  positioned.forEach(parent => {
    const children = childrenByParent.get(parent.id) || []
    if (children.length === 0) return

    // Calculate the angle range for this parent's children
    const parentIndex = level1Nodes.findIndex(n => n.id === parent.id)
    const baseAngle = (2 * Math.PI * parentIndex) / level1Nodes.length - Math.PI / 2
    const spreadAngle = Math.PI / (level1Nodes.length + 1)

    children.forEach((child, i) => {
      const childAngle = baseAngle - spreadAngle / 2 + (spreadAngle * (i + 1)) / (children.length + 1)
      positioned.push({
        ...child,
        x: centerX + level2Radius * Math.cos(childAngle),
        y: centerY + level2Radius * Math.sin(childAngle)
      })
    })
  })

  // Add any orphan level 2 nodes
  level2Nodes.forEach(node => {
    if (!positioned.find(p => p.id === node.id)) {
      positioned.push({
        ...node,
        x: centerX + Math.random() * 100 - 50,
        y: centerY + Math.random() * 100 - 50
      })
    }
  })

  return positioned
}

export default SkillGraph
