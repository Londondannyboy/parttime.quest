import { Metadata } from 'next'
import Link from 'next/link'
import { createDbQuery } from '@/lib/db'
import { JobsGraph3D } from '@/components/JobsGraph3D'
import { EmbeddedJobBoard } from '@/components/EmbeddedJobBoard'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Interim Marketing Jobs UK 2025 | CMO, Marketing Director & Head Roles',
  description: 'Find interim marketing jobs UK. Interim CMO, Marketing Director, Head of Marketing positions. £600-1,200/day rates. London and nationwide opportunities.',
  keywords: 'interim communications jobs, interim marketing jobs, marketing interim jobs, interim head of marketing jobs, interim cmo jobs',
  openGraph: {
    title: 'Interim Marketing Jobs UK 2025 | CMO & Marketing Director Roles',
    description: 'Find interim marketing jobs UK. CMO and Marketing Director interim positions.',
    type: 'website',
  },
}

const marketingRoles = [
  { name: 'Interim CMO', description: 'C-suite marketing leadership', rateRange: '£900-1,200/day', demand: 'High' },
  { name: 'Interim Marketing Director', description: 'Strategic marketing leadership', rateRange: '£700-950/day', demand: 'Very High' },
  { name: 'Interim Head of Marketing', description: 'Department leadership', rateRange: '£600-800/day', demand: 'High' },
  { name: 'Interim Brand Director', description: 'Brand strategy & positioning', rateRange: '£650-850/day', demand: 'Medium' },
  { name: 'Interim Digital Marketing Director', description: 'Digital transformation', rateRange: '£700-900/day', demand: 'Very High' },
  { name: 'Interim Communications Director', description: 'Corporate comms & PR', rateRange: '£600-850/day', demand: 'High' },
]

const marketingSpecialisations = [
  { name: 'B2B Marketing', icon: '🏢', description: 'Enterprise & SaaS' },
  { name: 'Consumer/DTC', icon: '🛍️', description: 'Direct to consumer' },
  { name: 'Digital/Performance', icon: '📊', description: 'Paid media & growth' },
  { name: 'Brand Building', icon: '✨', description: 'Brand strategy' },
  { name: 'Product Marketing', icon: '🚀', description: 'GTM & launches' },
  { name: 'Communications', icon: '📣', description: 'PR & corporate comms' },
]

const marketingSkills = [
  'Brand Strategy', 'Digital Marketing', 'Performance Marketing', 'Content Strategy',
  'Marketing Automation', 'CRM', 'Analytics', 'Team Leadership', 'Budget Management', 'Agency Management'
]

async function getMarketingStats() {
  try {
    const sql = createDbQuery()
    const [total] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM jobs WHERE is_active = true AND (role_category ILIKE '%marketing%' OR title ILIKE '%CMO%' OR title ILIKE '%marketing%')`
    ])
    return { total: parseInt((total[0] as any)?.count || '0') }
  } catch (error) {
    return { total: 30 }
  }
}

export default async function InterimMarketingJobsPage() {
  const stats = await getMarketingStats()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <JobsGraph3D categoryFilter="Marketing" limit={30} height="100%" isHero={true} showOverlay={true} />
        </div>

        <div className="relative z-10 w-full pb-16 md:pb-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row justify-between items-end gap-8">
              <div className="max-w-2xl">
                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/10">
                  <Link href="/interim-jobs" className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors text-sm tracking-wide">
                    <span className="mr-2">←</span> All Interim Jobs
                  </Link>

                  <span className="inline-block bg-pink-500/20 backdrop-blur text-pink-200 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-6">
                    {stats.total > 0 ? `${stats.total}+` : '30+'} Marketing Roles
                  </span>

                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[0.95] tracking-tight">
                    Interim<br />
                    <span className="text-pink-300">Marketing</span> Jobs
                  </h1>

                  <p className="text-lg text-white/70 mb-8 leading-relaxed max-w-lg">
                    Find interim marketing and communications jobs across the UK. CMO, Marketing Director, and Head of Marketing positions.
                  </p>

                  <Link
                    href="/part-time-jobs?role=CMO"
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-lg bg-pink-500 text-white hover:bg-pink-400 transition-all duration-200"
                  >
                    Browse Marketing Jobs →
                  </Link>
                </div>
              </div>

              <div className="w-full lg:w-auto">
                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-pink-400 font-mono">{stats.total > 0 ? `${stats.total}+` : '30+'}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Roles</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white font-mono">£600-1.2k</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Day Rates</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white font-mono">3-12mo</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Duration</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white font-mono">UK Wide</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Locations</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Why interim marketing leaders are in demand</h2>
          <p className="text-xl text-gray-600">
            <strong>Interim marketing jobs</strong> are essential for companies needing experienced marketing leadership during transitions, launches, or transformations. Interim CMOs and Marketing Directors bring immediate strategic capability without the commitment of permanent hires.
          </p>
        </div>
      </section>

      {/* Roles */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Interim Marketing Roles & Rates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketingRoles.map((role, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{role.name}</h3>
                <p className="text-gray-600 mb-4">{role.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-pink-600 font-semibold">{role.rateRange}</span>
                  <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-xs font-medium">{role.demand}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialisations */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Marketing Specialisations</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {marketingSpecialisations.map((spec, i) => (
              <div key={i} className="text-center p-6 bg-gray-50 rounded-xl">
                <span className="text-4xl mb-3 block">{spec.icon}</span>
                <h3 className="font-bold text-gray-900 mb-1">{spec.name}</h3>
                <p className="text-xs text-gray-500">{spec.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Board */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Latest Interim Marketing Jobs</h2>
          <EmbeddedJobBoard defaultDepartment="Marketing" title="Interim Marketing Jobs" jobsPerPage={6} showAllJobsLink={true} allJobsLinkText="View All Marketing Jobs" />
        </div>
      </section>

      {/* Skills */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">In-Demand Marketing Skills</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {marketingSkills.map((skill, i) => (
              <span key={i} className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm font-medium hover:bg-pink-100 transition-colors">{skill}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="py-16 bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Related Pages</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/interim-jobs" className="px-4 py-2 bg-white rounded-full text-gray-700 text-sm border hover:bg-pink-50">All Interim Jobs →</Link>
            <Link href="/part-time-cmo" className="px-4 py-2 bg-white rounded-full text-gray-700 text-sm border hover:bg-pink-50">Part-Time CMO →</Link>
            <Link href="/part-time-cmo-salary" className="px-4 py-2 bg-white rounded-full text-gray-700 text-sm border hover:bg-pink-50">CMO Salary Guide →</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Find Interim Marketing Jobs</h2>
          <Link href="/part-time-jobs?role=CMO" className="inline-flex px-10 py-5 text-lg font-semibold rounded-lg bg-pink-500 text-white hover:bg-pink-400">
            Browse Marketing Jobs →
          </Link>
        </div>
      </section>
    </div>
  )
}
