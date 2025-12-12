'use client'

import { useUser } from '@stackframe/stack'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface UserProfile {
  id: string
  neon_auth_id: string
  email: string | null
  first_name: string | null
  last_name: string | null
  current_country: string | null
  destination_countries: string[] | null
  budget_monthly: number | null
  timeline: string | null
  interests: string[] | null
}

interface UserSkill {
  id: string
  skill_name: string
  skill_level: string | null
  years_experience: number | null
}

interface UserExperience {
  id: string
  company_name: string
  role_title: string | null
  start_date: string | null
  end_date: string | null
}

interface UserQualification {
  id: string
  qualification_name: string
  institution: string | null
  year_obtained: number | null
}

interface FullProfile {
  profile: UserProfile | null
  skills: UserSkill[]
  experiences: UserExperience[]
  qualifications: UserQualification[]
}

export default function ProfilePage() {
  const user = useUser({ or: 'redirect' })
  const [data, setData] = useState<FullProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    first_name: '',
    current_country: '',
  })

  useEffect(() => {
    async function fetchAllData() {
      try {
        const response = await fetch('/api/user-full-profile')
        if (response.ok) {
          const result = await response.json()
          setData(result)
          setFormData({
            first_name: result.profile?.first_name || '',
            current_country: result.profile?.current_country || '',
          })
        } else {
          setError('Failed to load profile')
        }
      } catch (e) {
        setError('Error loading profile')
      } finally {
        setLoading(false)
      }
    }
    fetchAllData()
  }, [])

  const handleSave = async () => {
    try {
      const response = await fetch('/api/user-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (response.ok) {
        const updated = await response.json()
        setData(prev => prev ? { ...prev, profile: updated } : null)
        setEditing(false)
      }
    } catch (e) {
      console.error('Save error:', e)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Your Profile</h1>
          <div className="w-24" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-500 mt-4">Loading profile...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stack Auth Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Stack Auth Account</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">User ID:</span>
                  <p className="font-mono text-gray-900 break-all">{user.id}</p>
                </div>
                <div>
                  <span className="text-gray-500">Display Name:</span>
                  <p className="text-gray-900">{user.displayName || 'Not set'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Email:</span>
                  <p className="text-gray-900">{user.primaryEmail || 'Not set'}</p>
                </div>
              </div>
            </div>

            {/* Database Profile */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Database Profile (users table)</h2>
                <button
                  onClick={() => setEditing(!editing)}
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  {editing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {data?.profile ? (
                <div className="space-y-4">
                  {editing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">First Name</label>
                        <input
                          type="text"
                          value={formData.first_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Current Country</label>
                        <input
                          type="text"
                          value={formData.current_country}
                          onChange={(e) => setFormData(prev => ({ ...prev, current_country: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">DB ID:</span>
                        <p className="font-mono text-gray-900 break-all">{data.profile.id}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Neon Auth ID:</span>
                        <p className="font-mono text-gray-900 break-all">{data.profile.neon_auth_id}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">First Name:</span>
                        <p className={`${data.profile.first_name ? 'text-gray-900' : 'text-red-500'}`}>
                          {data.profile.first_name || 'NOT SET'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <p className="text-gray-900">{data.profile.email || 'Not set'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Current Country:</span>
                        <p className="text-gray-900">{data.profile.current_country || 'Not set'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Destination Countries:</span>
                        <p className="text-gray-900">{data.profile.destination_countries?.join(', ') || 'Not set'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Budget Monthly:</span>
                        <p className="text-gray-900">{data.profile.budget_monthly ? `$${data.profile.budget_monthly}` : 'Not set'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Timeline:</span>
                        <p className="text-gray-900">{data.profile.timeline || 'Not set'}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500">Interests:</span>
                        <p className="text-gray-900">{data.profile.interests?.join(', ') || 'Not set'}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-red-500">No profile found in database!</p>
              )}
            </div>

            {/* Skills */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills ({data?.skills?.length || 0})</h2>
              {data?.skills && data.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                    >
                      {skill.skill_name}
                      {skill.years_experience && <span className="text-purple-500 ml-1">({skill.years_experience}y)</span>}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No skills extracted yet. Talk to Quest to add skills.</p>
              )}
            </div>

            {/* Experiences */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Experiences ({data?.experiences?.length || 0})</h2>
              {data?.experiences && data.experiences.length > 0 ? (
                <div className="space-y-3">
                  {data.experiences.map((exp) => (
                    <div key={exp.id} className="border-l-2 border-purple-300 pl-4">
                      <p className="font-medium text-gray-900">{exp.role_title || 'Role'}</p>
                      <p className="text-gray-600">{exp.company_name}</p>
                      {(exp.start_date || exp.end_date) && (
                        <p className="text-gray-500 text-sm">
                          {exp.start_date} - {exp.end_date || 'Present'}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No experiences extracted yet. Talk to Quest to add experiences.</p>
              )}
            </div>

            {/* Qualifications */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Qualifications ({data?.qualifications?.length || 0})</h2>
              {data?.qualifications && data.qualifications.length > 0 ? (
                <div className="space-y-3">
                  {data.qualifications.map((qual) => (
                    <div key={qual.id} className="border-l-2 border-green-300 pl-4">
                      <p className="font-medium text-gray-900">{qual.qualification_name}</p>
                      {qual.institution && <p className="text-gray-600">{qual.institution}</p>}
                      {qual.year_obtained && <p className="text-gray-500 text-sm">{qual.year_obtained}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No qualifications extracted yet. Talk to Quest to add qualifications.</p>
              )}
            </div>

            {/* Debug JSON */}
            <details className="bg-gray-900 rounded-xl p-4 text-green-400 font-mono text-xs">
              <summary className="cursor-pointer text-yellow-400">Raw JSON Data</summary>
              <pre className="mt-4 overflow-auto max-h-96">
                {JSON.stringify(data, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </main>
    </div>
  )
}
