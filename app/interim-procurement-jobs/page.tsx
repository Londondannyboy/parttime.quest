import { Metadata } from 'next'
import Link from 'next/link'
import { createDbQuery } from '@/lib/db'
import { JobsGraph3D } from '@/components/JobsGraph3D'
import { EmbeddedJobBoard } from '@/components/EmbeddedJobBoard'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Interim Procurement Jobs UK 2025 | Procurement Director & Manager Roles',
  description: 'Find interim procurement jobs UK. Procurement Director, CPO, Category Manager, and Supply Chain leadership positions. £600-1,200/day rates. London and nationwide.',
  keywords: 'procurement interim jobs, interim procurement jobs, interim procurement director, interim cpo jobs, supply chain interim jobs',
  openGraph: {
    title: 'Interim Procurement Jobs UK 2025 | Procurement Director & Manager Roles',
    description: 'Find interim procurement jobs UK. Procurement Director and CPO interim positions.',
    type: 'website',
  },
}

const procurementRoles = [
  { name: 'Interim CPO', description: 'Chief Procurement Officer leadership', rateRange: '£900-1,200/day', demand: 'High' },
  { name: 'Interim Procurement Director', description: 'Strategic procurement leadership', rateRange: '£700-950/day', demand: 'Very High' },
  { name: 'Interim Head of Procurement', description: 'Department leadership', rateRange: '£600-800/day', demand: 'High' },
  { name: 'Interim Category Manager', description: 'Category strategy & sourcing', rateRange: '£450-650/day', demand: 'Very High' },
  { name: 'Interim Supply Chain Director', description: 'End-to-end supply chain', rateRange: '£750-1,000/day', demand: 'High' },
  { name: 'Interim Contracts Manager', description: 'Contract negotiation & management', rateRange: '£400-600/day', demand: 'Medium' },
]

const procurementSpecialisations = [
  { name: 'Direct Procurement', icon: '🏭', description: 'Manufacturing & production' },
  { name: 'Indirect Procurement', icon: '🏢', description: 'Services & facilities' },
  { name: 'IT Procurement', icon: '💻', description: 'Technology sourcing' },
  { name: 'Construction', icon: '🏗️', description: 'Capital projects' },
  { name: 'Public Sector', icon: '🏛️', description: 'Government & NHS' },
  { name: 'Transformation', icon: '🔄', description: 'Process improvement' },
]

const procurementSkills = [
  'Strategic Sourcing', 'Contract Negotiation', 'Supplier Management', 'Category Management',
  'Cost Reduction', 'P2P Systems', 'SAP/Oracle', 'Stakeholder Management',
  'Risk Management', 'ESG/Sustainability', 'CIPS Qualified'
]

async function getProcurementStats() {
  try {
    const sql = createDbQuery()
    const [total] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM jobs WHERE is_active = true AND (title ILIKE '%procurement%' OR title ILIKE '%supply chain%' OR title ILIKE '%sourcing%')`
    ])
    return { total: parseInt((total[0] as any)?.count || '0') }
  } catch (error) {
    return { total: 20 }
  }
}

export default async function InterimProcurementJobsPage() {
  const stats = await getProcurementStats()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <JobsGraph3D categoryFilter="Operations" limit={30} height="100%" isHero={true} showOverlay={true} />
        </div>

        <div className="relative z-10 w-full pb-16 md:pb-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row justify-between items-end gap-8">
              <div className="max-w-2xl">
                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/10">
                  <Link href="/interim-jobs" className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors text-sm tracking-wide">
                    <span className="mr-2">←</span> All Interim Jobs
                  </Link>

                  <span className="inline-block bg-orange-500/20 backdrop-blur text-orange-200 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-6">
                    {stats.total > 0 ? `${stats.total}+` : '20+'} Procurement Roles
                  </span>

                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[0.95] tracking-tight">
                    Interim<br />
                    <span className="text-orange-300">Procurement</span> Jobs
                  </h1>

                  <p className="text-lg text-white/70 mb-8 leading-relaxed max-w-lg">
                    Find interim procurement jobs across the UK. CPO, Procurement Director, and Category Manager positions with competitive day rates.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="/part-time-jobs?role=COO"
                      className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-lg bg-orange-500 text-white hover:bg-orange-400 transition-all duration-200"
                    >
                      Browse Procurement Jobs →
                    </Link>
                    <Link
                      href="#roles"
                      className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-lg bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
                    >
                      View Roles
                    </Link>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-auto">
                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-orange-400 font-mono">{stats.total > 0 ? `${stats.total}+` : '20+'}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Roles</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-white font-mono">£600-1.2k</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Day Rates</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-white font-mono">3-12mo</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Duration</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-white font-mono">UK Wide</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Locations</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-gray-400 mb-4 block">Interim Procurement Jobs UK</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              High demand for interim<br />procurement professionals
            </h2>
          </div>
          <div className="prose prose-xl prose-gray max-w-none">
            <p className="text-xl text-gray-600 leading-relaxed text-center">
              <strong>Interim procurement jobs</strong> are among the highest-demand interim roles in the UK market. Organisations need experienced procurement leaders to drive cost savings, manage supplier risks, and lead transformation programmes. The post-pandemic focus on supply chain resilience has further increased demand.
            </p>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Interim Procurement Roles</h2>
            <p className="text-xl text-gray-500">Current day rates and positions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {procurementRoles.map((role, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{role.name}</h3>
                <p className="text-gray-600 mb-4">{role.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-orange-600 font-semibold">{role.rateRange}</span>
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium">{role.demand}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialisations */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Procurement Specialisations</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {procurementSpecialisations.map((spec, i) => (
              <div key={i} className="text-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <span className="text-4xl mb-3 block">{spec.icon}</span>
                <h3 className="font-bold text-gray-900 mb-1">{spec.name}</h3>
                <p className="text-xs text-gray-500">{spec.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Board */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest Interim Procurement Jobs</h2>
          </div>
          <EmbeddedJobBoard
            defaultDepartment="Operations"
            title="Interim Procurement Jobs"
            jobsPerPage={6}
            showAllJobsLink={true}
            allJobsLinkText="View All Jobs"
          />
        </div>
      </section>

      {/* Skills */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">In-Demand Procurement Skills</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {procurementSkills.map((skill, i) => (
              <span key={i} className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm font-medium hover:bg-orange-100 transition-colors">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Related Pages</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/interim-jobs" className="px-4 py-2 bg-white rounded-full text-gray-700 text-sm border hover:bg-orange-50 transition-colors">All Interim Jobs →</Link>
            <Link href="/interim-finance-jobs" className="px-4 py-2 bg-white rounded-full text-gray-700 text-sm border hover:bg-orange-50 transition-colors">Interim Finance Jobs →</Link>
            <Link href="/part-time-coo" className="px-4 py-2 bg-white rounded-full text-gray-700 text-sm border hover:bg-orange-50 transition-colors">Part-Time COO →</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Find Interim Procurement Jobs</h2>
          <p className="text-xl text-gray-400 mb-10">Browse procurement opportunities across the UK</p>
          <Link
            href="/part-time-jobs"
            className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-lg bg-orange-500 text-white hover:bg-orange-400 transition-all duration-200"
          >
            Browse All Jobs →
          </Link>
        </div>
      </section>
    </div>
  )
}
