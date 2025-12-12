'use client'

import { useState, useEffect, useCallback } from 'react'
import { UserGraph } from './UserGraph'

interface Skill {
  id: number
  skill_name: string
  skill_category: string
  proficiency_level: string | null
  years_experience: number | null
  context: string | null
  confirmed: boolean
  confidence: number
}

// Skill categories for the dropdown
const SKILL_CATEGORIES = [
  'technical',
  'leadership',
  'strategy',
  'business',
  'domain',
  'communication',
  'other',
]

// Common proficiency levels
const PROFICIENCY_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert']

interface Experience {
  id: number
  company_name: string
  company_name_raw: string
  role_title: string | null
  role_type: string | null
  start_year: number | null
  end_year: number | null
  is_current: boolean
  achievements: string[] | null
  industry: string | null
  logo_url: string | null
  confirmed: boolean
}

interface Qualification {
  id: number
  qualification_type: string
  name: string
  institution: string | null
  year_obtained: number | null
  confirmed: boolean
}

interface Preferences {
  role_types: string[] | null
  preferred_locations: string[] | null
  remote_preference: string | null
  availability_days_per_week: number | null
  day_rate_min: number | null
  day_rate_max: number | null
  industries_preferred: string[] | null
  company_stages: string[] | null
}

interface RepoData {
  skills: Skill[]
  experiences: Experience[]
  qualifications: Qualification[]
  preferences: Preferences | null
  stats: {
    totalSkills: number
    confirmedSkills: number
    totalExperiences: number
    pendingCount: number
    completeness: number
  }
}

interface RepoDisplayProps {
  userId: string
  refreshTrigger?: number
}

export function RepoDisplay({ userId, refreshTrigger }: RepoDisplayProps) {
  const [repo, setRepo] = useState<RepoData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'skills' | 'experience' | 'preferences'>('skills')

  // Skill management state
  const [showAddSkill, setShowAddSkill] = useState(false)
  const [addingSkill, setAddingSkill] = useState(false)
  const [removingSkillId, setRemovingSkillId] = useState<number | null>(null)
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'technical',
    yearsExperience: '',
    proficiency: 'advanced',
  })

  const fetchRepo = useCallback(async () => {
    try {
      const res = await fetch(`/api/repo?userId=${userId}`)
      if (res.ok) {
        const data = await res.json()
        setRepo(data)
      }
    } catch (error) {
      console.error('Error fetching repo:', error)
    }
    setLoading(false)
  }, [userId])

  useEffect(() => {
    fetchRepo()
  }, [fetchRepo, refreshTrigger])

  const handleAddSkill = async () => {
    if (!newSkill.name.trim()) return

    setAddingSkill(true)
    try {
      const res = await fetch('/api/repo/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          skillName: newSkill.name.trim(),
          category: newSkill.category,
          yearsExperience: newSkill.yearsExperience ? parseInt(newSkill.yearsExperience) : null,
          proficiency: newSkill.proficiency,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        // Add the new skill to the repo state
        setRepo(prev => prev ? {
          ...prev,
          skills: [...prev.skills, data.skill],
          stats: {
            ...prev.stats,
            totalSkills: prev.stats.totalSkills + 1,
            confirmedSkills: prev.stats.confirmedSkills + 1,
          },
        } : null)

        // Reset form
        setNewSkill({ name: '', category: 'technical', yearsExperience: '', proficiency: 'advanced' })
        setShowAddSkill(false)
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to add skill')
      }
    } catch (error) {
      console.error('Error adding skill:', error)
      alert('Failed to add skill')
    }
    setAddingSkill(false)
  }

  const handleRemoveSkill = async (skillId: number) => {
    setRemovingSkillId(skillId)
    try {
      const res = await fetch('/api/repo/skills', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, userSkillId: skillId }),
      })

      if (res.ok) {
        // Remove skill from repo state
        setRepo(prev => prev ? {
          ...prev,
          skills: prev.skills.filter(s => s.id !== skillId),
          stats: {
            ...prev.stats,
            totalSkills: prev.stats.totalSkills - 1,
            confirmedSkills: Math.max(0, prev.stats.confirmedSkills - 1),
          },
        } : null)
      }
    } catch (error) {
      console.error('Error removing skill:', error)
    }
    setRemovingSkillId(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!repo) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Unable to load your Repo</p>
      </div>
    )
  }

  const confirmedSkills = repo.skills.filter(s => s.confirmed)
  const skillsByCategory = confirmedSkills.reduce((acc, skill) => {
    const cat = skill.skill_category || 'other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  return (
    <div className="space-y-6">
      {/* Completeness Bar */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Repo Completeness</h3>
          <span className="text-2xl font-bold text-purple-600">{repo.stats.completeness}%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500"
            style={{ width: `${repo.stats.completeness}%` }}
          />
        </div>
        <div className="flex justify-between mt-3 text-sm text-gray-500">
          <span>{repo.stats.confirmedSkills} skills</span>
          <span>{repo.stats.totalExperiences} roles</span>
          <span>{repo.qualifications.length} qualifications</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {(['skills', 'experience', 'preferences'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Skills Tab */}
      {activeTab === 'skills' && (
        <div className="space-y-6">
          {Object.entries(skillsByCategory).length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <p className="text-gray-600 font-medium">No skills confirmed yet</p>
              <p className="text-gray-400 text-sm mt-1">
                Talk to Quest about your experience to build your skill profile
              </p>
            </div>
          ) : (
            Object.entries(skillsByCategory).map(([category, skills]) => (
              <div key={category}>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3 capitalize">
                  {category} Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg"
                    >
                      <span className="font-medium text-purple-800">{skill.skill_name}</span>
                      {skill.years_experience && (
                        <span className="text-purple-500 text-sm ml-2">
                          {skill.years_experience}y
                        </span>
                      )}
                      {skill.proficiency_level && (
                        <span className="text-purple-400 text-xs ml-1 capitalize">
                          • {skill.proficiency_level}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}

          {/* User Knowledge Graph */}
          <UserGraph userId={userId} refreshTrigger={refreshTrigger} />
        </div>
      )}

      {/* Experience Tab */}
      {activeTab === 'experience' && (
        <div className="space-y-4">
          {repo.experiences.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏢</span>
              </div>
              <p className="text-gray-600 font-medium">No experience added yet</p>
              <p className="text-gray-400 text-sm mt-1">
                Tell Quest about your career history
              </p>
            </div>
          ) : (
            repo.experiences.map((exp) => (
              <div
                key={exp.id}
                className="bg-white rounded-xl p-5 border border-gray-200 hover:border-purple-200 transition-colors"
              >
                <div className="flex gap-4">
                  {/* Company Logo Placeholder */}
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {exp.logo_url ? (
                      <img src={exp.logo_url} alt="" className="w-8 h-8 object-contain" />
                    ) : (
                      <span className="text-gray-400 font-bold text-lg">
                        {exp.company_name?.charAt(0) || '?'}
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {exp.role_title || 'Role'}
                        </h4>
                        <p className="text-gray-600">{exp.company_name || exp.company_name_raw}</p>
                      </div>
                      {exp.role_type && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          exp.role_type === 'fractional' ? 'bg-purple-100 text-purple-700' :
                          exp.role_type === 'consulting' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {exp.role_type}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                      {exp.start_year && (
                        <span>
                          {exp.start_year} - {exp.is_current ? 'Present' : exp.end_year || '?'}
                        </span>
                      )}
                      {exp.industry && (
                        <>
                          <span>•</span>
                          <span>{exp.industry}</span>
                        </>
                      )}
                    </div>

                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {exp.achievements.slice(0, 3).map((achievement, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">✓</span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="space-y-4">
          {!repo.preferences ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚙️</span>
              </div>
              <p className="text-gray-600 font-medium">No preferences set</p>
              <p className="text-gray-400 text-sm mt-1">
                Tell Quest what you're looking for
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {/* Role Types */}
              {repo.preferences.role_types && repo.preferences.role_types.length > 0 && (
                <PreferenceCard
                  title="Interested Roles"
                  icon="👔"
                  items={repo.preferences.role_types}
                />
              )}

              {/* Locations */}
              {repo.preferences.preferred_locations && repo.preferences.preferred_locations.length > 0 && (
                <PreferenceCard
                  title="Preferred Locations"
                  icon="📍"
                  items={repo.preferences.preferred_locations}
                />
              )}

              {/* Availability */}
              {repo.preferences.availability_days_per_week && (
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span>⏰</span>
                    <span className="font-medium text-gray-700">Availability</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">
                    {repo.preferences.availability_days_per_week} days/week
                  </p>
                </div>
              )}

              {/* Day Rate */}
              {(repo.preferences.day_rate_min || repo.preferences.day_rate_max) && (
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span>💷</span>
                    <span className="font-medium text-gray-700">Day Rate</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">
                    £{repo.preferences.day_rate_min || '?'} - £{repo.preferences.day_rate_max || '?'}
                  </p>
                </div>
              )}

              {/* Industries */}
              {repo.preferences.industries_preferred && repo.preferences.industries_preferred.length > 0 && (
                <PreferenceCard
                  title="Preferred Industries"
                  icon="🏭"
                  items={repo.preferences.industries_preferred}
                />
              )}

              {/* Company Stages */}
              {repo.preferences.company_stages && repo.preferences.company_stages.length > 0 && (
                <PreferenceCard
                  title="Company Stages"
                  icon="📈"
                  items={repo.preferences.company_stages}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function PreferenceCard({ title, icon, items }: { title: string; icon: string; items: string[] }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <span>{icon}</span>
        <span className="font-medium text-gray-700">{title}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span
            key={i}
            className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
