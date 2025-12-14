import { Metadata } from 'next'
import Link from 'next/link'
import { createDbQuery } from '@/lib/db'
import { JobsGraph3D } from '@/components/JobsGraph3D'
import { EmbeddedJobBoard } from '@/components/EmbeddedJobBoard'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Interim Director Jobs UK 2025 | Director-Level Leadership Roles',
  description: 'Find interim director jobs UK. Interim Director, Operations Director, Commercial Director positions. Interim director jobs London and UK wide. £700-1,200/day rates.',
  keywords: 'interim director jobs, interim operations director jobs, interim director jobs london, interim director jobs uk',
  openGraph: {
    title: 'Interim Director Jobs UK 2025 | Director-Level Leadership Roles',
    description: 'Find interim director jobs UK. Director-level interim positions with competitive rates.',
    type: 'website',
  },
}

const directorRoles = [
  { name: 'Interim Managing Director', description: 'Business unit leadership', rateRange: '£900-1,200/day', demand: 'High' },
  { name: 'Interim Operations Director', description: 'Operational excellence', rateRange: '£700-950/day', demand: 'Very High' },
  { name: 'Interim Commercial Director', description: 'Revenue & commercial strategy', rateRange: '£750-1,000/day', demand: 'High' },
  { name: 'Interim Sales Director', description: 'Sales leadership & growth', rateRange: '£700-950/day', demand: 'High' },
  { name: 'Interim Technical Director', description: 'Technical strategy & delivery', rateRange: '£750-1,000/day', demand: 'High' },
  { name: 'Interim Transformation Director', description: 'Change programme leadership', rateRange: '£800-1,100/day', demand: 'Very High' },
]

const directorFunctions = [
  { name: 'Operations', icon: '⚙️', description: 'Operational leadership' },
  { name: 'Commercial', icon: '📈', description: 'Revenue & growth' },
  { name: 'Technology', icon: '💻', description: 'IT & digital' },
  { name: 'Finance', icon: '💰', description: 'Financial leadership' },
  { name: 'HR/People', icon: '👥', description: 'Workforce strategy' },
  { name: 'Transformation', icon: '🔄', description: 'Change & programme' },
]

const directorSkills = [
  'Strategic Leadership', 'P&L Management', 'Board Reporting', 'Change Management',
  'Team Development', 'Stakeholder Management', 'Commercial Acumen', 'Governance'
]

async function getDirectorStats() {
  try {
    const sql = createDbQuery()
    const [total] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM jobs WHERE is_active = true AND title ILIKE '%director%'`
    ])
    return { total: parseInt((total[0] as any)?.count || '0') }
  } catch (error) {
    return { total: 60 }
  }
}

export default async function InterimDirectorJobsPage() {
  const stats = await getDirectorStats()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <JobsGraph3D limit={50} height="100%" isHero={true} showOverlay={true} />
        </div>

        <div className="relative z-10 w-full pb-16 md:pb-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-2xl">
              <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/10">
                <Link href="/interim-jobs" className="inline-flex items-center text-white/70 hover:text-white mb-6 text-sm">
                  <span className="mr-2">←</span> All Interim Jobs
                </Link>

                <span className="inline-block bg-violet-500/20 text-violet-200 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-6">
                  {stats.total > 0 ? `${stats.total}+` : '60+'} Director Roles
                </span>

                <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-[0.95]">
                  Interim<br />
                  <span className="text-violet-300">Director</span> Jobs UK
                </h1>

                <p className="text-lg text-white/70 mb-8 max-w-lg">
                  Find interim director jobs across the UK. Operations Director, Commercial Director, and leadership positions with premium day rates.
                </p>

                <Link href="/part-time-jobs" className="inline-flex px-8 py-4 text-base font-semibold rounded-lg bg-violet-500 text-white hover:bg-violet-400">
                  Browse Director Jobs →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Director-level interim leadership</h2>
          <p className="text-xl text-gray-600">
            <strong>Interim director jobs</strong> provide organisations with experienced leadership at director level during transitions, transformations, or when permanent recruitment is ongoing. Interim directors deliver immediate strategic impact and operational expertise.
          </p>
        </div>
      </section>

      {/* Roles */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Interim Director Roles & Rates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {directorRoles.map((role, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{role.name}</h3>
                <p className="text-gray-600 mb-4">{role.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-violet-600 font-semibold">{role.rateRange}</span>
                  <span className="bg-violet-100 text-violet-800 px-3 py-1 rounded-full text-xs font-medium">{role.demand}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Functions */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Director Functions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {directorFunctions.map((func, i) => (
              <div key={i} className="text-center p-6 bg-gray-50 rounded-xl">
                <span className="text-4xl mb-3 block">{func.icon}</span>
                <h3 className="font-bold text-gray-900 mb-1">{func.name}</h3>
                <p className="text-xs text-gray-500">{func.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* London */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Interim Director Jobs London</h2>
              <p className="text-lg text-gray-300 mb-6">
                London offers the highest concentration of interim director opportunities with premium rates. The capital's diverse economy means director roles across all sectors and functions.
              </p>
              <ul className="space-y-3 text-gray-300 mb-8">
                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-violet-500 rounded-full"></span>15-20% rate premium vs regional</li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-violet-500 rounded-full"></span>Highest volume of opportunities</li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-violet-500 rounded-full"></span>All sectors represented</li>
              </ul>
              <Link href="/part-time-jobs-london" className="inline-flex px-6 py-3 bg-violet-600 rounded-lg font-semibold hover:bg-violet-700">
                View London Director Jobs →
              </Link>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20">
              <h3 className="text-lg font-bold mb-6">London Director Day Rates</h3>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-gray-300">Managing Director</span>
                  <span className="font-bold text-violet-400">£1,000-1,400/day</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-gray-300">Operations Director</span>
                  <span className="font-bold text-violet-400">£800-1,100/day</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-300">Commercial Director</span>
                  <span className="font-bold text-violet-400">£850-1,150/day</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Board */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Latest Interim Director Jobs</h2>
          <EmbeddedJobBoard title="Interim Director Jobs" jobsPerPage={6} showAllJobsLink={true} allJobsLinkText="View All Director Jobs" />
        </div>
      </section>

      {/* Skills */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">Director Skills</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {directorSkills.map((skill, i) => (
              <span key={i} className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm font-medium hover:bg-violet-100 transition-colors">{skill}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="py-16 bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Related Pages</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/interim-jobs" className="px-4 py-2 bg-white rounded-full text-gray-700 text-sm border hover:bg-violet-50">All Interim Jobs →</Link>
            <Link href="/interim-executive-jobs" className="px-4 py-2 bg-white rounded-full text-gray-700 text-sm border hover:bg-violet-50">Interim Executive Jobs →</Link>
            <Link href="/interim-management-jobs" className="px-4 py-2 bg-white rounded-full text-gray-700 text-sm border hover:bg-violet-50">Interim Management Jobs →</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Find Interim Director Jobs</h2>
          <Link href="/part-time-jobs" className="inline-flex px-10 py-5 text-lg font-semibold rounded-lg bg-violet-500 text-white hover:bg-violet-400">
            Browse All Director Jobs →
          </Link>
        </div>
      </section>
    </div>
  )
}
