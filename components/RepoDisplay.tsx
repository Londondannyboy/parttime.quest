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

  // Experience management state
  const [showAddExperience, setShowAddExperience] = useState(false)
  const [addingExperience, setAddingExperience] = useState(false)
  const [editingExperienceId, setEditingExperienceId] = useState<number | null>(null)
  const [removingExperienceId, setRemovingExperienceId] = useState<number | null>(null)
  const [newExperience, setNewExperience] = useState({
    companyName: '',
    roleTitle: '',
    roleType: 'full-time',
    startYear: '',
    endYear: '',
    isCurrent: false,
    industry: '',
  })

  // Role type options
  const ROLE_TYPES = ['full-time', 'part-time', 'consulting', 'contract', 'interim']
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i)

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

  // Experience handlers
  const handleAddExperience = async () => {
    if (!newExperience.companyName.trim() || !newExperience.roleTitle.trim()) return

    setAddingExperience(true)
    try {
      const res = await fetch('/api/repo/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          companyName: newExperience.companyName.trim(),
          roleTitle: newExperience.roleTitle.trim(),
          roleType: newExperience.roleType,
          startYear: newExperience.startYear ? parseInt(newExperience.startYear) : null,
          endYear: newExperience.isCurrent ? null : (newExperience.endYear ? parseInt(newExperience.endYear) : null),
          isCurrent: newExperience.isCurrent,
          industry: newExperience.industry || null,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setRepo(prev => prev ? {
          ...prev,
          experiences: [...prev.experiences, data.experience],
          stats: {
            ...prev.stats,
            totalExperiences: prev.stats.totalExperiences + 1,
          },
        } : null)

        // Reset form
        setNewExperience({
          companyName: '',
          roleTitle: '',
          roleType: 'full-time',
          startYear: '',
          endYear: '',
          isCurrent: false,
          industry: '',
        })
        setShowAddExperience(false)
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to add experience')
      }
    } catch (error) {
      console.error('Error adding experience:', error)
      alert('Failed to add experience')
    }
    setAddingExperience(false)
  }

  const handleRemoveExperience = async (expId: number) => {
    setRemovingExperienceId(expId)
    try {
      const res = await fetch('/api/repo/experiences', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, experienceId: expId }),
      })

      if (res.ok) {
        setRepo(prev => prev ? {
          ...prev,
          experiences: prev.experiences.filter(e => e.id !== expId),
          stats: {
            ...prev.stats,
            totalExperiences: Math.max(0, prev.stats.totalExperiences - 1),
          },
        } : null)
      }
    } catch (error) {
      console.error('Error removing experience:', error)
    }
    setRemovingExperienceId(null)
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
        <p className="text-gray-600">Unable to load your Repo</p>
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
        <div className="flex justify-between mt-3 text-sm text-gray-600">
          <span>{repo.stats.confirmedSkills} skills</span>
          <span>{repo.stats.totalExperiences} roles</span>
          <span>{repo.qualifications.length} qualifications</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { key: 'skills', label: 'Skills' },
          { key: 'experience', label: 'Experience' },
          { key: 'preferences', label: 'Looking For' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as 'skills' | 'experience' | 'preferences')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Skills Tab */}
      {activeTab === 'skills' && (
        <div className="space-y-6">
          {/* Add Skill Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddSkill(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Skill
            </button>
          </div>

          {/* Add Skill Modal */}
          {showAddSkill && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Skill</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name *</label>
                    <input
                      type="text"
                      value={newSkill.name}
                      onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Python, Leadership, Financial Modeling"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={newSkill.category}
                      onChange={(e) => setNewSkill(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      {SKILL_CATEGORIES.map(cat => (
                        <option key={cat} value={cat} className="capitalize">{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Years Experience</label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={newSkill.yearsExperience}
                        onChange={(e) => setNewSkill(prev => ({ ...prev, yearsExperience: e.target.value }))}
                        placeholder="e.g., 5"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Proficiency</label>
                      <select
                        value={newSkill.proficiency}
                        onChange={(e) => setNewSkill(prev => ({ ...prev, proficiency: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        {PROFICIENCY_LEVELS.map(level => (
                          <option key={level} value={level} className="capitalize">{level}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowAddSkill(false)
                      setNewSkill({ name: '', category: 'technical', yearsExperience: '', proficiency: 'advanced' })
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddSkill}
                    disabled={addingSkill || !newSkill.name.trim()}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingSkill ? 'Adding...' : 'Add Skill'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {Object.entries(skillsByCategory).length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <p className="text-gray-600 font-medium">No skills confirmed yet</p>
              <p className="text-gray-600 text-sm mt-1">
                Click "Add Skill" above or talk to Quest to build your profile
              </p>
            </div>
          ) : (
            Object.entries(skillsByCategory).map(([category, skills]) => (
              <div key={category}>
                <h4 className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-3 capitalize">
                  {category} Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="group px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg flex items-center gap-2 hover:bg-purple-100 transition-colors"
                    >
                      <span className="font-medium text-purple-800">{skill.skill_name}</span>
                      {skill.years_experience && (
                        <span className="text-purple-500 text-sm">
                          {skill.years_experience}y
                        </span>
                      )}
                      {skill.proficiency_level && (
                        <span className="text-purple-400 text-xs capitalize">
                          • {skill.proficiency_level}
                        </span>
                      )}
                      {/* Remove button */}
                      <button
                        onClick={() => handleRemoveSkill(skill.id)}
                        disabled={removingSkillId === skill.id}
                        className="ml-1 opacity-0 group-hover:opacity-100 p-1 text-purple-400 hover:text-red-500 transition-all disabled:opacity-50"
                        title="Remove skill"
                      >
                        {removingSkillId === skill.id ? (
                          <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </button>
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
          {/* Add Experience Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddExperience(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Experience
            </button>
          </div>

          {/* Add Experience Modal */}
          {showAddExperience && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Experience</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      value={newExperience.roleTitle}
                      onChange={(e) => setNewExperience(prev => ({ ...prev, roleTitle: e.target.value }))}
                      placeholder="e.g., Part-Time CFO, VP Product"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
                    <input
                      type="text"
                      value={newExperience.companyName}
                      onChange={(e) => setNewExperience(prev => ({ ...prev, companyName: e.target.value }))}
                      placeholder="e.g., Acme Corp"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                      <select
                        value={newExperience.roleType}
                        onChange={(e) => setNewExperience(prev => ({ ...prev, roleType: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        {ROLE_TYPES.map(type => (
                          <option key={type} value={type} className="capitalize">{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                      <input
                        type="text"
                        value={newExperience.industry}
                        onChange={(e) => setNewExperience(prev => ({ ...prev, industry: e.target.value }))}
                        placeholder="e.g., Technology"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Year</label>
                      <select
                        value={newExperience.startYear}
                        onChange={(e) => setNewExperience(prev => ({ ...prev, startYear: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="">Select year</option>
                        {years.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Year</label>
                      <select
                        value={newExperience.isCurrent ? '' : newExperience.endYear}
                        onChange={(e) => setNewExperience(prev => ({ ...prev, endYear: e.target.value }))}
                        disabled={newExperience.isCurrent}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100"
                      >
                        <option value="">Select year</option>
                        {years.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isCurrent"
                      checked={newExperience.isCurrent}
                      onChange={(e) => setNewExperience(prev => ({ ...prev, isCurrent: e.target.checked, endYear: '' }))}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="isCurrent" className="text-sm text-gray-700">I currently work here</label>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowAddExperience(false)
                      setNewExperience({
                        companyName: '',
                        roleTitle: '',
                        roleType: 'full-time',
                        startYear: '',
                        endYear: '',
                        isCurrent: false,
                        industry: '',
                      })
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddExperience}
                    disabled={addingExperience || !newExperience.companyName.trim() || !newExperience.roleTitle.trim()}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingExperience ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {repo.experiences.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏢</span>
              </div>
              <p className="text-gray-600 font-medium">No experience added yet</p>
              <p className="text-gray-600 text-sm mt-1">
                Click "Add Experience" to start building your work history
              </p>
            </div>
          ) : (
            repo.experiences.map((exp) => (
              <div
                key={exp.id}
                className="group bg-white rounded-xl p-5 border border-gray-200 hover:border-purple-200 transition-colors"
              >
                <div className="flex gap-4">
                  {/* Company Logo Placeholder */}
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {exp.logo_url ? (
                      <img src={exp.logo_url} alt="" className="w-8 h-8 object-contain" />
                    ) : (
                      <span className="text-gray-600 font-bold text-lg">
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
                      <div className="flex items-center gap-2">
                        {exp.role_type && (
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            exp.role_type === 'part-time' ? 'bg-purple-100 text-purple-700' :
                            exp.role_type === 'consulting' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {exp.role_type}
                          </span>
                        )}
                        {/* Delete button */}
                        <button
                          onClick={() => handleRemoveExperience(exp.id)}
                          disabled={removingExperienceId === exp.id}
                          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all disabled:opacity-50"
                          title="Remove experience"
                        >
                          {removingExperienceId === exp.id ? (
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
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
              <p className="text-gray-600 text-sm mt-1">
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
