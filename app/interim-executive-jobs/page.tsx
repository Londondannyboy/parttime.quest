import { Metadata } from 'next'
import Link from 'next/link'
import { createDbQuery } from '@/lib/db'
import { JobsGraph3D } from '@/components/JobsGraph3D'
import { EmbeddedJobBoard } from '@/components/EmbeddedJobBoard'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Interim Executive Jobs UK 2025 | CEO, COO & C-Suite Roles',
  description: 'Find interim executive jobs UK. Interim CEO, COO, Chief Executive, and C-Suite positions. Executive interim management jobs with £800-2,000/day rates.',
  keywords: 'interim ceo jobs, interim chief operating officer jobs, interim chief executive jobs, interim executive jobs, executive interim jobs, interim executives jobs, interim executive management jobs, executive interim management jobs, interim executive jobs uk',
  openGraph: {
    title: 'Interim Executive Jobs UK 2025 | CEO, COO & C-Suite Roles',
    description: 'Find interim executive jobs UK. CEO, COO, and C-Suite interim positions.',
    type: 'website',
  },
}

const executiveRoles = [
  { name: 'Interim CEO', description: 'Chief Executive leadership', rateRange: '£1,200-2,000/day', demand: 'High' },
  { name: 'Interim COO', description: 'Chief Operating Officer', rateRange: '£900-1,400/day', demand: 'Very High' },
  { name: 'Interim CFO', description: 'Chief Financial Officer', rateRange: '£900-1,400/day', demand: 'Very High' },
  { name: 'Interim CTO', description: 'Chief Technology Officer', rateRange: '£900-1,400/day', demand: 'High' },
  { name: 'Interim CMO', description: 'Chief Marketing Officer', rateRange: '£800-1,200/day', demand: 'High' },
  { name: 'Interim CHRO', description: 'Chief HR Officer', rateRange: '£800-1,100/day', demand: 'High' },
]

const executiveSpecialisations = [
  { name: 'Turnaround', icon: '⚡', description: 'Business recovery & restructuring' },
  { name: 'Growth', icon: '📈', description: 'Scale-up & expansion' },
  { name: 'M&A Integration', icon: '🤝', description: 'Post-merger leadership' },
  { name: 'IPO Preparation', icon: '🔔', description: 'Public market readiness' },
  { name: 'Transformation', icon: '🔄', description: 'Digital & operational change' },
  { name: 'Succession', icon: '👔', description: 'Leadership transition' },
]

const executiveSkills = [
  'Board Leadership', 'P&L Management', 'Strategy Development', 'Stakeholder Management',
  'Change Management', 'M&A Experience', 'Fundraising', 'Crisis Management',
  'Governance', 'Team Building', 'Investor Relations'
]

async function getExecutiveStats() {
  try {
    const sql = createDbQuery()
    const [total] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM jobs WHERE is_active = true AND (title ILIKE '%CEO%' OR title ILIKE '%COO%' OR title ILIKE '%Chief%' OR title ILIKE '%executive%')`
    ])
    return { total: parseInt((total[0] as any)?.count || '0') }
  } catch (error) {
    return { total: 50 }
  }
}

export default async function InterimExecutiveJobsPage() {
  const stats = await getExecutiveStats()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <JobsGraph3D limit={50} height="100%" isHero={true} showOverlay={true} />
        </div>

        <div className="relative z-10 w-full pb-16 md:pb-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row justify-between items-end gap-8">
              <div className="max-w-2xl">
                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/10">
                  <Link href="/interim-jobs" className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors text-sm tracking-wide">
                    <span className="mr-2">←</span> All Interim Jobs
                  </Link>

                  <span className="inline-block bg-indigo-500/20 backdrop-blur text-indigo-200 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-6">
                    {stats.total > 0 ? `${stats.total}+` : '50+'} Executive Roles
                  </span>

                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[0.95] tracking-tight">
                    Interim<br />
                    <span className="text-indigo-300">Executive</span> Jobs
                  </h1>

                  <p className="text-lg text-white/70 mb-8 leading-relaxed max-w-lg">
                    Find interim CEO, COO, and C-Suite positions across the UK. Executive interim management roles with premium day rates.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="/part-time-jobs"
                      className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-lg bg-indigo-500 text-white hover:bg-indigo-400 transition-all duration-200"
                    >
                      Browse Executive Jobs →
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
                      <div className="text-3xl md:text-4xl font-bold text-indigo-400 font-mono">{stats.total > 0 ? `${stats.total}+` : '50+'}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">C-Suite Roles</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-white font-mono">£800-2k</div>
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
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-gray-400 mb-4 block">Interim Executive Jobs UK</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              C-Suite interim leadership<br />for critical moments
            </h2>
          </div>
          <div className="prose prose-xl prose-gray max-w-none">
            <p className="text-xl text-gray-600 leading-relaxed text-center">
              <strong>Interim executive jobs</strong> provide organisations with experienced C-suite leadership during critical transitions. Whether navigating a turnaround, preparing for IPO, integrating an acquisition, or bridging a succession gap, interim CEOs, COOs, and other executives deliver immediate strategic impact.
            </p>
            <p className="text-xl text-gray-600 leading-relaxed text-center mt-6">
              The UK <strong>executive interim</strong> market commands premium rates, with top interim CEOs earning £1,500-2,000+ per day. These roles require exceptional track records and the ability to deliver results quickly in complex environments.
            </p>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Interim Executive Roles & Rates</h2>
            <p className="text-xl text-gray-500">C-Suite interim positions and day rates</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {executiveRoles.map((role, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{role.name}</h3>
                <p className="text-gray-600 mb-4">{role.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-indigo-600 font-semibold">{role.rateRange}</span>
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-medium">{role.demand}</span>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Executive Interim Specialisations</h2>
            <p className="text-xl text-gray-500">Situations where interim executives add most value</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {executiveSpecialisations.map((spec, i) => (
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest Interim Executive Jobs</h2>
          </div>
          <EmbeddedJobBoard
            title="Interim Executive Jobs"
            jobsPerPage={6}
            showAllJobsLink={true}
            allJobsLinkText="View All Executive Jobs"
          />
        </div>
      </section>

      {/* Skills */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Executive Interim Skills</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {executiveSkills.map((skill, i) => (
              <span key={i} className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm font-medium hover:bg-indigo-100 transition-colors">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Interim Executive FAQ</h2>
          </div>

          <div className="space-y-6">
            <details className="group bg-white rounded-xl p-6 cursor-pointer border border-gray-200">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                How much do interim CEOs earn UK?
                <span className="text-gray-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Interim CEO day rates in the UK typically range from £1,200-2,000 per day, with highly experienced turnaround specialists commanding even higher rates. Based on 180-200 days per year utilisation, annual earnings range from £220,000-£400,000.
              </p>
            </details>

            <details className="group bg-white rounded-xl p-6 cursor-pointer border border-gray-200">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                What experience do interim executives need?
                <span className="text-gray-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Interim executives typically need 20+ years experience with significant time in C-suite or Board-level roles. A track record of delivering results in similar situations (turnarounds, integrations, scale-ups) is essential. Many have previously held permanent CEO/COO roles.
              </p>
            </details>

            <details className="group bg-white rounded-xl p-6 cursor-pointer border border-gray-200">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                When do companies hire interim executives?
                <span className="text-gray-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Companies hire interim executives during: sudden departures requiring immediate leadership, turnaround situations, post-merger integrations, IPO/sale preparation, major transformation programmes, or when permanent recruitment is ongoing. Speed to impact is the key driver.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Related Pages</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/interim-jobs" className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm hover:bg-indigo-100 transition-colors">All Interim Jobs →</Link>
            <Link href="/part-time-ceo" className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm hover:bg-indigo-100 transition-colors">Part-Time CEO →</Link>
            <Link href="/part-time-coo" className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm hover:bg-indigo-100 transition-colors">Part-Time COO →</Link>
            <Link href="/interim-director-jobs" className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm hover:bg-indigo-100 transition-colors">Interim Director Jobs →</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Find Interim Executive Jobs</h2>
          <p className="text-xl text-gray-400 mb-10">Browse C-Suite interim opportunities across the UK</p>
          <Link
            href="/part-time-jobs"
            className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-lg bg-indigo-500 text-white hover:bg-indigo-400 transition-all duration-200"
          >
            Browse All Executive Jobs →
          </Link>
        </div>
      </section>
    </div>
  )
}
