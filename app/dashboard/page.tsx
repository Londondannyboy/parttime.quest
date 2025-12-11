'use client'

import { useUser } from '@stackframe/stack'
import Link from 'next/link'
import { useState } from 'react'
import { HumeWidget } from '@/components/HumeWidget'

export default function DashboardPage() {
  const user = useUser({ or: 'redirect' })
  const [activeTab, setActiveTab] = useState('overview')

  if (!user) return null

  const firstName = user.displayName?.split(' ')[0] || 'there'

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <div>
              <span className="text-white font-bold">Fractional</span>
              <span className="text-purple-400">.Quest</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <NavItem
            icon={<HomeIcon />}
            label="Overview"
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
          />
          <NavItem
            icon={<BriefcaseIcon />}
            label="Jobs"
            href="/fractionaljobsuk"
          />
          <NavItem
            icon={<ChatIcon />}
            label="AI Assistant"
            active={activeTab === 'assistant'}
            onClick={() => setActiveTab('assistant')}
          />
          <NavItem
            icon={<ArticleIcon />}
            label="Articles"
            href="/fractional-jobs-articles"
          />
          <NavItem
            icon={<BookmarkIcon />}
            label="Saved Jobs"
            active={activeTab === 'saved'}
            onClick={() => setActiveTab('saved')}
            badge="Coming Soon"
          />
          <NavItem
            icon={<BellIcon />}
            label="Alerts"
            active={activeTab === 'alerts'}
            onClick={() => setActiveTab('alerts')}
            badge="Coming Soon"
          />
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-semibold">
                {user.displayName?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {user.displayName || 'User'}
              </p>
              <p className="text-gray-400 text-xs truncate">{user.primaryEmail}</p>
            </div>
            <Link href="/handler/account-settings" className="text-gray-400 hover:text-white">
              <SettingsIcon />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {activeTab === 'overview' && <OverviewTab firstName={firstName} />}
        {activeTab === 'assistant' && <AssistantTab />}
        {activeTab === 'saved' && <ComingSoonTab title="Saved Jobs" />}
        {activeTab === 'alerts' && <ComingSoonTab title="Job Alerts" />}
      </main>
    </div>
  )
}

function OverviewTab({ firstName }: { firstName: string }) {
  return (
    <div className="p-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {firstName}
        </h1>
        <p className="text-gray-400">
          Here's what's happening with your fractional career journey
        </p>
      </div>

      {/* Trinity Section - 3 Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<BriefcaseIcon />}
          label="Active Jobs"
          value="500+"
          change="+12 this week"
          color="purple"
        />
        <StatCard
          icon={<LocationIcon />}
          label="London Roles"
          value="85+"
          change="Top market"
          color="pink"
        />
        <StatCard
          icon={<CurrencyIcon />}
          label="Avg Day Rate"
          value="£950"
          change="UK market"
          color="blue"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickAction
            href="/fractionaljobsuk"
            icon={<SearchIcon />}
            title="Browse Jobs"
            description="Find your next role"
          />
          <QuickAction
            href="/chat"
            icon={<ChatIcon />}
            title="AI Chat"
            description="Get career advice"
          />
          <QuickAction
            href="/voice"
            icon={<MicIcon />}
            title="Voice Assistant"
            description="Talk to our AI"
          />
          <QuickAction
            href="/fractional-jobs-articles"
            icon={<ArticleIcon />}
            title="Read Articles"
            description="Industry insights"
          />
        </div>
      </div>

      {/* Featured Roles */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Popular Roles</h2>
          <Link href="/fractionaljobsuk" className="text-purple-400 hover:text-purple-300 text-sm">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RoleCard title="Fractional CFO" count="120+ jobs" rate="£900-1,500/day" href="/fractional-cfo-jobs-uk" />
          <RoleCard title="Fractional CMO" count="85+ jobs" rate="£850-1,400/day" href="/fractional-cmo-jobs-uk" />
          <RoleCard title="Fractional CTO" count="95+ jobs" rate="£950-1,600/day" href="/fractional-cto-jobs-uk" />
          <RoleCard title="Fractional COO" count="70+ jobs" rate="£900-1,400/day" href="/fractional-coo-jobs-uk" />
        </div>
      </div>

      {/* Latest Articles */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Latest Insights</h2>
          <Link href="/fractional-jobs-articles" className="text-purple-400 hover:text-purple-300 text-sm">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ArticleCard
            title="How to Become a Fractional Executive"
            description="Your complete guide to transitioning to fractional work"
            href="/how-to-become-a-fractional-executive"
          />
          <ArticleCard
            title="Fractional Jobs London"
            description="The UK's hottest market for fractional talent"
            href="/fractional-jobs-london"
          />
          <ArticleCard
            title="Day Rate Guide 2025"
            description="What fractional executives earn in the UK"
            href="/fractional-jobs-salary-guide"
          />
        </div>
      </div>
    </div>
  )
}

function AssistantTab() {
  return (
    <div className="p-8 h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">AI Assistant</h1>
        <p className="text-gray-400">
          Talk to our AI about fractional jobs, day rates, and career advice
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center bg-gray-900/50 rounded-2xl border border-gray-800 p-8">
        <HumeWidget variant="hero" />
        <div className="mt-8 text-center max-w-md">
          <p className="text-gray-400 text-sm mb-4">
            As a signed-in user, you have unlimited access to our AI assistant.
            Ask about jobs, day rates, or career transitions.
          </p>
          <Link href="/chat" className="text-purple-400 hover:text-purple-300 text-sm">
            Prefer text? Try our chat →
          </Link>
        </div>
      </div>
    </div>
  )
}

function ComingSoonTab({ title }: { title: string }) {
  return (
    <div className="p-8 h-full flex flex-col items-center justify-center">
      <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      <p className="text-gray-400 text-center max-w-md mb-6">
        This feature is coming soon. We're building tools to help you track and manage your fractional career.
      </p>
      <Link
        href="/fractionaljobsuk"
        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors"
      >
        Browse Jobs Instead
      </Link>
    </div>
  )
}

// Component helpers
function NavItem({ icon, label, active, onClick, href, badge }: {
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick?: () => void
  href?: string
  badge?: string
}) {
  const className = `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
    active
      ? 'bg-purple-600/20 text-purple-400'
      : 'text-gray-400 hover:text-white hover:bg-gray-800'
  }`

  const content = (
    <>
      {icon}
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </>
  )

  if (href) {
    return <Link href={href} className={className}>{content}</Link>
  }

  return <button onClick={onClick} className={`w-full ${className}`}>{content}</button>
}

function StatCard({ icon, label, value, change, color }: {
  icon: React.ReactNode
  label: string
  value: string
  change: string
  color: 'purple' | 'pink' | 'blue'
}) {
  const colors = {
    purple: 'from-purple-500 to-purple-600',
    pink: 'from-pink-500 to-pink-600',
    blue: 'from-blue-500 to-blue-600',
  }

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center mb-4`}>
        <span className="text-white">{icon}</span>
      </div>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-green-400 text-sm">{change}</p>
    </div>
  )
}

function QuickAction({ href, icon, title, description }: {
  href: string
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <Link
      href={href}
      className="bg-gray-900 rounded-xl border border-gray-800 p-4 hover:border-purple-500/50 hover:bg-gray-800/50 transition-all group"
    >
      <div className="w-10 h-10 rounded-lg bg-gray-800 group-hover:bg-purple-600/20 flex items-center justify-center mb-3 transition-colors">
        <span className="text-gray-400 group-hover:text-purple-400">{icon}</span>
      </div>
      <h3 className="text-white font-medium mb-1">{title}</h3>
      <p className="text-gray-500 text-sm">{description}</p>
    </Link>
  )
}

function RoleCard({ title, count, rate, href }: {
  title: string
  count: string
  rate: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="bg-gray-900 rounded-xl border border-gray-800 p-4 hover:border-purple-500/50 transition-all flex items-center justify-between"
    >
      <div>
        <h3 className="text-white font-medium">{title}</h3>
        <p className="text-gray-500 text-sm">{count}</p>
      </div>
      <div className="text-right">
        <p className="text-purple-400 font-medium">{rate}</p>
      </div>
    </Link>
  )
}

function ArticleCard({ title, description, href }: {
  title: string
  description: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="bg-gray-900 rounded-xl border border-gray-800 p-4 hover:border-purple-500/50 transition-all"
    >
      <h3 className="text-white font-medium mb-2 line-clamp-2">{title}</h3>
      <p className="text-gray-500 text-sm line-clamp-2">{description}</p>
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

function BookmarkIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
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

function MicIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  )
}
