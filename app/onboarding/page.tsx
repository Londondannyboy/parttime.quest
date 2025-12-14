'use client'

import { useUser } from '@stackframe/stack'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { KnowledgeGraph } from '@/components/KnowledgeGraph'

interface GraphData {
  nodes: Array<{
    id: string
    type: 'user' | 'skill' | 'job' | 'company' | 'preference' | 'fact'
    label: string
    data?: Record<string, unknown>
  }>
  edges: Array<{
    source: string
    target: string
    type: string
    weight?: number
    label?: string
  }>
}

const COMMON_SKILLS = [
  'Leadership', 'Strategy', 'Finance', 'Operations', 'Product',
  'Engineering', 'Marketing', 'Sales', 'HR', 'Data',
  'M&A', 'Fundraising', 'Board Experience', 'Turnaround'
]

const ROLE_OPTIONS = [
  'Part-Time CFO',
  'Part-Time CMO',
  'Part-Time CTO',
  'Part-Time COO',
  'Part-Time CHRO',
  'Part-Time CPO',
  'Board Advisor',
  'Consultant',
]

const TIMELINE_OPTIONS = [
  'Immediately',
  'Within 1 month',
  'Within 3 months',
  'Just exploring',
]

const BUDGET_OPTIONS = [
  '£500-750/day',
  '£750-1000/day',
  '£1000-1500/day',
  '£1500+/day',
]

export default function OnboardingPage() {
  const user = useUser({ or: 'redirect' })
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [graphData, setGraphData] = useState<GraphData | null>(null)

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    current_country: 'United Kingdom',
    skills: [] as string[],
    experiences: [{ company: '', role: '' }] as Array<{company: string, role: string}>,
    interests: [] as string[],
    budget: '',
    timeline: '',
  })

  // Pre-fill name from Stack Auth
  useEffect(() => {
    if (user?.displayName && !formData.first_name) {
      const [first, ...rest] = user.displayName.split(' ')
      setFormData(prev => ({
        ...prev,
        first_name: first || '',
        last_name: rest.join(' ') || ''
      }))
    }
  }, [user?.displayName])

  // Build live preview graph
  useEffect(() => {
    const nodes: GraphData['nodes'] = [
      { id: 'user-you', type: 'user', label: formData.first_name || 'You' }
    ]
    const edges: GraphData['edges'] = []

    // Add skills
    formData.skills.forEach((skill, i) => {
      const id = `skill-${i}`
      nodes.push({ id, type: 'skill', label: skill })
      edges.push({ source: 'user-you', target: id, type: 'has_skill' })
    })

    // Add companies
    formData.experiences.filter(e => e.company).forEach((exp, i) => {
      const id = `company-${i}`
      nodes.push({ id, type: 'company', label: exp.company, data: { role: exp.role } })
      edges.push({ source: 'user-you', target: id, type: 'worked_at', label: exp.role })
    })

    // Add role preferences
    formData.interests.forEach((role, i) => {
      const id = `pref-role-${i}`
      nodes.push({ id, type: 'preference', label: role.replace('Part-Time ', '') })
      edges.push({ source: 'user-you', target: id, type: 'seeks' })
    })

    // Add budget preference
    if (formData.budget) {
      nodes.push({ id: 'pref-budget', type: 'preference', label: formData.budget })
      edges.push({ source: 'user-you', target: 'pref-budget', type: 'expects' })
    }

    setGraphData({ nodes, edges })
  }, [formData])

  if (!user) return null

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experiences: [...prev.experiences, { company: '', role: '' }]
    }))
  }

  const updateExperience = (index: number, field: 'company' | 'role', value: string) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      )
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Save profile to Neon
      await fetch('/api/user-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          current_country: formData.current_country,
          interests: formData.interests.join(', '),
          budget: formData.budget,
          timeline: formData.timeline,
        }),
      })

      // Save skills, experiences, and sync to ZEP
      await fetch('/api/onboarding-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          skills: formData.skills,
          experiences: formData.experiences.filter(e => e.company),
          preferences: {
            roleTypes: formData.interests,
            dayRate: formData.budget,
            timeline: formData.timeline,
          }
        }),
      })

      // Go to repo page to see the graph and talk to Repo
      router.push('/repo')
    } catch (error) {
      console.error('Error saving profile:', error)
      setIsSubmitting(false)
    }
  }

  const canProceed = () => {
    if (step === 1) return formData.first_name.trim().length > 0 && formData.skills.length > 0
    if (step === 2) return true // Experience is optional
    if (step === 3) return formData.interests.length > 0
    return true
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Build Your Repo</h1>
          <p className="text-gray-600 mt-2">
            Tell us about yourself to get personalized job matches
          </p>
        </div>

        {/* Progress */}
        <div className="max-w-lg mx-auto mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Step {step} of 3</span>
            <Link href="/repo" className="text-sm text-purple-600 hover:text-purple-700">
              Skip for now
            </Link>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-600 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            {/* Step 1: Name & Skills */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">About You</h2>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        value={formData.first_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="John"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        value={formData.last_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Smith"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Key Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_SKILLS.map(skill => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleSkillToggle(skill)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          formData.skills.includes(skill)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Select skills that represent your expertise</p>
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={!canProceed()}
                  className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Step 2: Experience */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">Your Experience</h2>
                  <p className="text-gray-600 text-sm mb-4">Add key companies you've worked with</p>
                </div>

                <div className="space-y-3">
                  {formData.experiences.map((exp, i) => (
                    <div key={i} className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(i, 'company', e.target.value)}
                        placeholder="Company name"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => updateExperience(i, 'role', e.target.value)}
                        placeholder="Your role"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addExperience}
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  + Add another company
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Preferences */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">Your Preferences</h2>
                  <p className="text-gray-600 text-sm mb-4">What roles are you looking for?</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role Types</label>
                  <div className="flex flex-wrap gap-2">
                    {ROLE_OPTIONS.map(role => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleInterestToggle(role)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          formData.interests.includes(role)
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Day Rate</label>
                  <div className="grid grid-cols-2 gap-2">
                    {BUDGET_OPTIONS.map(option => (
                      <button
                        key={option}
                        onClick={() => setFormData(prev => ({ ...prev, budget: option }))}
                        className={`p-2 rounded-lg border-2 text-sm font-medium transition-all ${
                          formData.budget === option
                            ? 'border-amber-500 bg-amber-50 text-amber-700'
                            : 'border-gray-200 hover:border-amber-300'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timeline</label>
                  <div className="grid grid-cols-2 gap-2">
                    {TIMELINE_OPTIONS.map(option => (
                      <button
                        key={option}
                        onClick={() => setFormData(prev => ({ ...prev, timeline: option }))}
                        className={`p-2 rounded-lg border-2 text-sm font-medium transition-all ${
                          formData.timeline === option
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!canProceed() || isSubmitting}
                    className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? 'Building your Repo...' : 'Complete Setup'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Live Graph Preview */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🧠</span>
              <h2 className="text-xl font-semibold text-gray-900">Your Knowledge Graph</h2>
              {graphData && graphData.nodes.length > 1 && (
                <span className="text-xs text-gray-500 ml-auto animate-pulse">
                  Live preview
                </span>
              )}
            </div>

            {graphData && graphData.nodes.length > 1 ? (
              <KnowledgeGraph
                data={graphData}
                width={450}
                height={380}
              />
            ) : (
              <div className="h-[380px] flex items-center justify-center text-gray-500 bg-gray-50 rounded-xl">
                <div className="text-center">
                  <span className="text-5xl mb-3 block">🧩</span>
                  <p className="font-medium">Add your details to see your graph</p>
                  <p className="text-sm mt-1">Watch it grow as you fill in the form</p>
                </div>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-4 text-center">
              Talk to Repo after setup to expand your graph with more details
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
