import { Metadata } from 'next'
import Link from 'next/link'
import { createDbQuery } from '@/lib/db'
import { JobsGraph3D } from '@/components/JobsGraph3D'
import { EmbeddedJobBoard } from '@/components/EmbeddedJobBoard'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Interim Project Manager Jobs UK 2025 | Project Director & PM Roles',
  description: 'Find interim project manager jobs UK. Interim Project Director, Programme Manager, Project Manager positions. £400-800/day rates. London and nationwide.',
  keywords: 'interim project manager jobs, interim project management jobs, interim project director jobs, project manager interim jobs',
  openGraph: {
    title: 'Interim Project Manager Jobs UK 2025 | Project & Programme Roles',
    description: 'Find interim project manager jobs UK. Project Director and PM interim positions.',
    type: 'website',
  },
}

const pmRoles = [
  { name: 'Interim Project Director', description: 'Strategic project leadership', rateRange: '£700-900/day', demand: 'High' },
  { name: 'Interim Programme Manager', description: 'Complex programme delivery', rateRange: '£600-850/day', demand: 'Very High' },
  { name: 'Interim Senior Project Manager', description: 'Major project delivery', rateRange: '£500-700/day', demand: 'Very High' },
  { name: 'Interim PMO Director', description: 'PMO leadership & governance', rateRange: '£650-850/day', demand: 'High' },
  { name: 'Interim Transformation PM', description: 'Change programme delivery', rateRange: '£550-750/day', demand: 'High' },
  { name: 'Interim IT Project Manager', description: 'Technology project delivery', rateRange: '£500-700/day', demand: 'Very High' },
]

const pmSectors = [
  { name: 'Technology', icon: '💻', description: 'IT & digital projects' },
  { name: 'Construction', icon: '🏗️', description: 'Infrastructure & build' },
  { name: 'Financial Services', icon: '🏦', description: 'Banking & insurance' },
  { name: 'Healthcare', icon: '🏥', description: 'NHS & pharma' },
  { name: 'Energy', icon: '⚡', description: 'Utilities & renewables' },
  { name: 'Public Sector', icon: '🏛️', description: 'Government programmes' },
]

const pmSkills = [
  'Prince2', 'Agile/Scrum', 'MSP', 'Stakeholder Management', 'Risk Management',
  'Budget Management', 'Resource Planning', 'Change Management', 'Governance'
]

async function getPMStats() {
  try {
    const sql = createDbQuery()
    const [total] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM jobs WHERE is_active = true AND (title ILIKE '%project%' OR title ILIKE '%programme%')`
    ])
    return { total: parseInt((total[0] as any)?.count || '0') }
  } catch (error) {
    return { total: 25 }
  }
}

export default async function InterimProjectManagerJobsPage() {
  const stats = await getPMStats()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <JobsGraph3D categoryFilter="Technology" limit={30} height="100%" isHero={true} showOverlay={true} />
        </div>

        <div className="relative z-10 w-full pb-16 md:pb-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-2xl">
              <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/10">
                <Link href="/interim-jobs" className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors text-sm">
                  <span className="mr-2">←</span> All Interim Jobs
                </Link>

                <span className="inline-block bg-amber-500/20 text-amber-200 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-6">
                  {stats.total > 0 ? `${stats.total}+` : '25+'} PM Roles
                </span>

                <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-[0.95]">
                  Interim<br />
                  <span className="text-amber-300">Project Manager</span> Jobs
                </h1>

                <p className="text-lg text-white/70 mb-8 max-w-lg">
                  Find interim project manager and programme manager jobs across the UK. Project Director and PM positions with competitive day rates.
                </p>

                <Link href="/part-time-jobs" className="inline-flex px-8 py-4 text-base font-semibold rounded-lg bg-amber-500 text-white hover:bg-amber-400">
                  Browse PM Jobs →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">High demand for interim project managers</h2>
          <p className="text-xl text-gray-600">
            <strong>Interim project manager jobs</strong> are consistently in high demand as organisations need experienced PMs for specific projects, transformations, and programme delivery. The UK interim PM market offers excellent day rates and variety of challenging assignments.
          </p>
        </div>
      </section>

      {/* Roles */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Interim PM Roles & Rates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pmRoles.map((role, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{role.name}</h3>
                <p className="text-gray-600 mb-4">{role.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-amber-600 font-semibold">{role.rateRange}</span>
                  <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium">{role.demand}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Sectors Hiring Interim PMs</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {pmSectors.map((sector, i) => (
              <div key={i} className="text-center p-6 bg-gray-50 rounded-xl">
                <span className="text-4xl mb-3 block">{sector.icon}</span>
                <h3 className="font-bold text-gray-900 mb-1">{sector.name}</h3>
                <p className="text-xs text-gray-500">{sector.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Board */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Latest Interim PM Jobs</h2>
          <EmbeddedJobBoard title="Interim Project Manager Jobs" jobsPerPage={6} showAllJobsLink={true} allJobsLinkText="View All PM Jobs" />
        </div>
      </section>

      {/* Skills */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">In-Demand PM Skills</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {pmSkills.map((skill, i) => (
              <span key={i} className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm font-medium hover:bg-amber-100 transition-colors">{skill}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="py-16 bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Related Pages</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/interim-jobs" className="px-4 py-2 bg-white rounded-full text-gray-700 text-sm border hover:bg-amber-50">All Interim Jobs →</Link>
            <Link href="/interim-management-jobs" className="px-4 py-2 bg-white rounded-full text-gray-700 text-sm border hover:bg-amber-50">Interim Management Jobs →</Link>
            <Link href="/part-time-cto" className="px-4 py-2 bg-white rounded-full text-gray-700 text-sm border hover:bg-amber-50">Part-Time CTO →</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Find Interim PM Jobs</h2>
          <Link href="/part-time-jobs" className="inline-flex px-10 py-5 text-lg font-semibold rounded-lg bg-amber-500 text-white hover:bg-amber-400">
            Browse All PM Jobs →
          </Link>
        </div>
      </section>
    </div>
  )
}
