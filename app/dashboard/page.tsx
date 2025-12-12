'use client'

import { useUser } from '@stackframe/stack'
import Link from 'next/link'
import { useState, useCallback, useRef, useEffect } from 'react'
import { HumeWidget, HumeMessage } from '@/components/HumeWidget'
import { ExtractionPanel } from '@/components/ExtractionPanel'
import { JobsPanel } from '@/components/JobsPanel'
import { RepoDisplay } from '@/components/RepoDisplay'
import { SkillGraph } from '@/components/SkillGraph'
import { ExtractionResult } from '@/lib/extraction-types'

export default function DashboardPage() {
  const user = useUser({ or: 'redirect' })
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeView, setActiveView] = useState<'home' | 'voice' | 'jobs' | 'articles'>('home')
  const [repoRefresh, setRepoRefresh] = useState(0)

  if (!user) return null

  const firstName = user.displayName?.split(' ')[0] || 'there'

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-sm`}>
        {/* Logo */}
        <div className="p-5 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            {sidebarOpen && (
              <div>
                <span className="text-gray-900 font-bold">Fractional</span>
                <span className="text-purple-600">.Quest</span>
              </div>
            )}
          </Link>
        </div>

        {/* Main CTA - Speak with Fractional */}
        <div className="p-4">
          <button
            onClick={() => setActiveView('voice')}
            className={`w-full py-4 px-5 rounded-xl font-semibold text-base transition-all flex items-center gap-3 ${
              activeView === 'voice'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
            }`}
          >
            <PhoneIcon />
            {sidebarOpen && <span>Speak with Fractional</span>}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          <SidebarItem
            icon={<HomeIcon />}
            label="Repo"
            active={activeView === 'home'}
            onClick={() => setActiveView('home')}
            collapsed={!sidebarOpen}
          />
          <SidebarItem
            icon={<BriefcaseIcon />}
            label="Jobs"
            active={activeView === 'jobs'}
            onClick={() => setActiveView('jobs')}
            collapsed={!sidebarOpen}
          />
          <SidebarItem
            icon={<ArticleIcon />}
            label="Articles"
            active={activeView === 'articles'}
            onClick={() => setActiveView('articles')}
            collapsed={!sidebarOpen}
          />
          <SidebarItem
            icon={<ChatIcon />}
            label="Chat"
            href="/chat"
            collapsed={!sidebarOpen}
          />
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-100">
          <div className={`flex items-center gap-3 p-3 rounded-xl bg-gray-50 ${sidebarOpen ? '' : 'justify-center'}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold">
                {user.displayName?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 text-sm font-medium truncate">
                  {user.displayName || 'User'}
                </p>
                <p className="text-gray-500 text-xs truncate">{user.primaryEmail}</p>
              </div>
            )}
            {sidebarOpen && (
              <Link href="/handler/account-settings" className="text-gray-400 hover:text-gray-600">
                <SettingsIcon />
              </Link>
            )}
          </div>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-4 border-t border-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
        >
          {sidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {activeView === 'home' && (
          <HomeView
            firstName={firstName}
            userId={user.id}
            onSpeakClick={() => setActiveView('voice')}
            refreshTrigger={repoRefresh}
          />
        )}
        {activeView === 'voice' && (
          <VoiceView
            userName={user.displayName || undefined}
            userId={user.id}
            onRepoUpdate={() => setRepoRefresh(r => r + 1)}
          />
        )}
        {activeView === 'jobs' && <JobsView />}
        {activeView === 'articles' && <ArticlesView />}
      </main>
    </div>
  )
}

function HomeView({ firstName, userId, onSpeakClick, refreshTrigger }: {
  firstName: string
  userId: string
  onSpeakClick: () => void
  refreshTrigger: number
}) {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {firstName}
        </h1>
        <p className="text-gray-600">
          Your professional Repo - build it by talking to Quest
        </p>
      </div>

      {/* Main CTA Card */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Build Your Repo</h2>
            <p className="text-purple-100 mb-4">
              Talk to Quest about your experience. We'll extract your skills, build your professional identity, and match you with perfect roles.
            </p>
            <button
              onClick={onSpeakClick}
              className="bg-white text-purple-700 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-colors inline-flex items-center gap-2"
            >
              <PhoneIcon />
              Speak with Quest
            </button>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
              <MicIcon className="w-16 h-16 text-white/80" />
            </div>
          </div>
        </div>
      </div>

      {/* Repo Display */}
      <RepoDisplay userId={userId} refreshTrigger={refreshTrigger} />
    </div>
  )
}

interface UserProfile {
  first_name: string | null
  current_country: string | null
  destination_countries: string[] | null
  budget: string | null
  timeline: string | null
  interests: string[] | null
}

function VoiceView({ userName, userId, onRepoUpdate }: {
  userName?: string
  userId: string
  onRepoUpdate: () => void
}) {
  const [isExtracting, setIsExtracting] = useState(false)
  const [liveExtraction, setLiveExtraction] = useState<ExtractionResult | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [rightPanelTab, setRightPanelTab] = useState<'extraction' | 'jobs'>('extraction')
  const extractionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastTranscriptRef = useRef<string>('')

  // Fetch user profile for Hume variables
  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch('/api/user-profile')
        if (response.ok) {
          const profile = await response.json()
          setUserProfile(profile)
          console.log('Profile loaded for Hume:', profile)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }
    fetchProfile()
  }, [])

  // Handle transcript from Hume - debounced extraction + UI triggers
  const handleTranscript = useCallback(async (transcript: string, allMessages: HumeMessage[]) => {
    // Check if assistant is talking about jobs - trigger UI switch
    const lastMessage = allMessages[allMessages.length - 1]
    if (lastMessage?.type === 'assistant_message') {
      const content = (lastMessage.message?.content || '').toLowerCase()
      // If Quest mentions jobs/roles/positions, switch to jobs tab
      if (
        content.includes('show you') ||
        content.includes('here are') ||
        content.includes('found') && (content.includes('job') || content.includes('role') || content.includes('position')) ||
        content.includes('let me display') ||
        content.includes('take a look at') && content.includes('job')
      ) {
        setRightPanelTab('jobs')
      }
    }

    // Skip if transcript hasn't changed significantly
    if (transcript === lastTranscriptRef.current) return
    lastTranscriptRef.current = transcript

    // Clear any pending extraction
    if (extractionTimeoutRef.current) {
      clearTimeout(extractionTimeoutRef.current)
    }

    // Debounce extraction - wait 2 seconds after last message
    extractionTimeoutRef.current = setTimeout(async () => {
      setIsExtracting(true)

      try {
        const response = await fetch('/api/extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transcript,
            userId,
            incremental: !!liveExtraction,
            existingData: liveExtraction
          })
        })

        if (response.ok) {
          const data = await response.json()
          if (data.extraction) {
            // Merge with existing extraction
            setLiveExtraction(prev => {
              if (!prev) return data.extraction
              return {
                skills: [...prev.skills, ...data.extraction.skills],
                companies: [...prev.companies, ...data.extraction.companies],
                qualifications: [...prev.qualifications, ...data.extraction.qualifications],
                preferences: [...prev.preferences, ...data.extraction.preferences],
                suggestedFollowUps: data.extraction.suggestedFollowUps || prev.suggestedFollowUps,
                narrative: data.extraction.narrative || prev.narrative
              }
            })
          }
        }
      } catch (error) {
        console.error('Extraction error:', error)
      } finally {
        setIsExtracting(false)
      }
    }, 2000) // 2 second debounce
  }, [userId, liveExtraction])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (extractionTimeoutRef.current) {
        clearTimeout(extractionTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="h-full flex">
      {/* Main Voice Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-xl w-full text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MicIcon className="w-10 h-10 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Build Your Repo
            </h1>
            <p className="text-gray-600 text-lg">
              Tell Quest about your experience. We'll extract skills, companies, and build your professional identity.
            </p>
          </div>

          {/* Hume Voice Widget with full profile */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-6">
            <HumeWidget
              variant="hero"
              userName={userProfile?.first_name || userName}
              isAuthenticated={true}
              darkMode={false}
              userProfile={userProfile}
              onTranscript={handleTranscript}
            />
          </div>

          <p className="text-gray-500 text-sm">
            Watch the panel on the right as we extract and confirm your professional data.
          </p>

          <div className="mt-6">
            <Link href="/chat" className="text-purple-600 hover:text-purple-700 font-medium">
              Prefer text? Try our chat →
            </Link>
          </div>
        </div>
      </div>

      {/* Right Panel with Tabs */}
      <div className="w-96 border-l border-gray-200 bg-white flex flex-col">
        {/* Panel Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setRightPanelTab('extraction')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              rightPanelTab === 'extraction'
                ? 'text-purple-700 border-b-2 border-purple-700 bg-purple-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Build Repo
          </button>
          <button
            onClick={() => setRightPanelTab('jobs')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              rightPanelTab === 'jobs'
                ? 'text-purple-700 border-b-2 border-purple-700 bg-purple-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Jobs
          </button>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-hidden">
          {rightPanelTab === 'extraction' ? (
            <ExtractionPanel
              userId={userId}
              liveExtraction={liveExtraction}
              isExtracting={isExtracting}
              onRefresh={onRepoUpdate}
            />
          ) : (
            <JobsPanel />
          )}
        </div>
      </div>
    </div>
  )
}

function JobsView() {
  const roles = [
    { title: 'Fractional CFO', count: '120+', href: '/fractional-cfo-jobs-uk', rate: '£900-1,500/day' },
    { title: 'Fractional CMO', count: '85+', href: '/fractional-cmo-jobs-uk', rate: '£850-1,400/day' },
    { title: 'Fractional CTO', count: '95+', href: '/fractional-cto-jobs-uk', rate: '£950-1,600/day' },
    { title: 'Fractional COO', count: '70+', href: '/fractional-coo-jobs-uk', rate: '£900-1,400/day' },
    { title: 'Fractional CHRO', count: '45+', href: '/fractional-chro-jobs-uk', rate: '£800-1,200/day' },
    { title: 'All Roles', count: '500+', href: '/fractionaljobsuk', rate: 'View all' },
  ]

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Jobs</h1>
        <p className="text-gray-600">Find your next fractional executive role</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role) => (
          <Link
            key={role.href}
            href={role.href}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:border-purple-300 hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                  {role.title}
                </h3>
                <p className="text-gray-500 text-sm mt-1">{role.count} jobs available</p>
              </div>
              <span className="text-purple-600 font-medium text-sm bg-purple-50 px-3 py-1 rounded-full">
                {role.rate}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function ArticlesView() {
  const articles = [
    { title: 'How to Become a Fractional Executive', href: '/how-to-become-a-fractional-executive', category: 'Guide' },
    { title: 'Fractional Jobs London', href: '/fractional-jobs-london', category: 'Market' },
    { title: 'Day Rate Guide 2025', href: '/fractional-jobs-salary-guide', category: 'Salary' },
    { title: 'Fractional Jobs Remote', href: '/fractional-jobs-remote', category: 'Remote' },
    { title: 'What is a Fractional Executive?', href: '/what-is-fractional-executive', category: 'Intro' },
    { title: 'All Articles', href: '/fractional-jobs-articles', category: 'View All' },
  ]

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Articles & Guides</h1>
        <p className="text-gray-600">Expert insights on fractional careers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map((article) => (
          <Link
            key={article.href}
            href={article.href}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:border-purple-300 hover:shadow-md transition-all group"
          >
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
              {article.category}
            </span>
            <h3 className="text-lg font-semibold text-gray-900 mt-3 group-hover:text-purple-700 transition-colors">
              {article.title}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  )
}

// Components
function SidebarItem({ icon, label, active, onClick, href, collapsed }: {
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick?: () => void
  href?: string
  collapsed?: boolean
}) {
  const className = `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
    active
      ? 'bg-purple-50 text-purple-700 font-medium'
      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
  } ${collapsed ? 'justify-center' : ''}`

  const content = (
    <>
      {icon}
      {!collapsed && <span>{label}</span>}
    </>
  )

  if (href) {
    return <Link href={href} className={className}>{content}</Link>
  }

  return <button onClick={onClick} className={`w-full ${className}`}>{content}</button>
}

function StatCard({ label, value, subtitle, icon }: {
  label: string
  value: string
  subtitle: string
  icon: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-gray-500 text-sm">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-gray-500 text-sm">{subtitle}</p>
    </div>
  )
}

function QuickLink({ href, title, description, icon }: {
  href: string
  title: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="bg-white rounded-xl border border-gray-200 p-5 hover:border-purple-300 hover:shadow-md transition-all group flex items-start gap-4"
    >
      <div className="w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-purple-50 text-gray-600 group-hover:text-purple-600 flex items-center justify-center transition-colors flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">{title}</h3>
        <p className="text-gray-500 text-sm mt-1">{description}</p>
      </div>
    </Link>
  )
}

// Icons
function HomeIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )
}

function BriefcaseIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  )
}

function ArticleIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function CurrencyIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

function MicIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  )
}

function ChevronLeftIcon() {
  return (
    <svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
    </svg>
  )
}
