import { Metadata } from 'next'
import Link from 'next/link'
import { createDbQuery } from '@/lib/db'
import { JobsGraph3D } from '@/components/JobsGraph3D'
import { EmbeddedJobBoard } from '@/components/EmbeddedJobBoard'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Interim Finance Jobs UK 2025 | CFO, Finance Director & Controller Roles',
  description: 'Find interim finance jobs UK. Interim CFO, Finance Director, Financial Controller positions. Interim finance jobs London and Birmingham. £700-1,400/day rates.',
  keywords: 'interim finance jobs, finance interim jobs, interim jobs finance, interim cfo jobs, cfo interim jobs, interim finance director jobs, interim finance jobs london, interim finance jobs birmingham, interim accountant jobs',
  openGraph: {
    title: 'Interim Finance Jobs UK 2025 | CFO, Finance Director & Controller Roles',
    description: 'Find interim finance jobs UK. CFO, Finance Director, and Controller interim positions.',
    type: 'website',
  },
}

const financeRoles = [
  { name: 'Interim CFO', description: 'C-suite financial leadership', rateRange: '£900-1,400/day', demand: 'Very High' },
  { name: 'Interim Finance Director', description: 'Strategic finance leadership', rateRange: '£700-1,000/day', demand: 'Very High' },
  { name: 'Interim Financial Controller', description: 'Financial control & reporting', rateRange: '£550-800/day', demand: 'High' },
  { name: 'Interim FP&A Director', description: 'Financial planning & analysis', rateRange: '£600-850/day', demand: 'High' },
  { name: 'Interim Group Accountant', description: 'Group consolidation & reporting', rateRange: '£450-650/day', demand: 'Medium' },
  { name: 'Interim Treasury Manager', description: 'Cash & treasury management', rateRange: '£500-750/day', demand: 'Growing' },
]

const financeSpecialisations = [
  { name: 'IPO Preparation', icon: '📈', description: 'Stock market readiness' },
  { name: 'M&A Due Diligence', icon: '🔍', description: 'Transaction support' },
  { name: 'Finance Transformation', icon: '🔄', description: 'Process & systems change' },
  { name: 'Audit & Compliance', icon: '✅', description: 'Regulatory compliance' },
  { name: 'ERP Implementation', icon: '💻', description: 'Systems rollout' },
  { name: 'Turnaround', icon: '⚡', description: 'Business recovery' },
]

const financeSkills = [
  'Financial Reporting', 'IFRS/UK GAAP', 'Management Accounts', 'Budgeting & Forecasting',
  'Cash Flow Management', 'Audit Management', 'ERP Systems', 'Board Reporting',
  'Stakeholder Management', 'Team Leadership', 'M&A Experience', 'IPO Preparation'
]

async function getFinanceStats() {
  try {
    const sql = createDbQuery()
    const [total] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM jobs WHERE is_active = true AND (role_category ILIKE '%finance%' OR title ILIKE '%CFO%' OR title ILIKE '%finance%' OR title ILIKE '%financial%')`
    ])
    return {
      total: parseInt((total[0] as any)?.count || '0'),
    }
  } catch (error) {
    return { total: 45 }
  }
}

export default async function InterimFinanceJobsPage() {
  const stats = await getFinanceStats()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <JobsGraph3D categoryFilter="Finance" limit={30} height="100%" isHero={true} showOverlay={true} />
        </div>

        <div className="relative z-10 w-full pb-16 md:pb-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row justify-between items-end gap-8">
              <div className="max-w-2xl">
                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/10">
                  <Link href="/interim-jobs" className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors text-sm tracking-wide">
                    <span className="mr-2">←</span> All Interim Jobs
                  </Link>

                  <span className="inline-block bg-emerald-500/20 backdrop-blur text-emerald-200 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-6">
                    {stats.total > 0 ? `${stats.total}+` : '45+'} Finance Roles
                  </span>

                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[0.95] tracking-tight">
                    Interim<br />
                    <span className="text-emerald-300">Finance Jobs</span> UK
                  </h1>

                  <p className="text-lg text-white/70 mb-8 leading-relaxed max-w-lg">
                    Find interim finance jobs across the UK. CFO, Finance Director, and Financial Controller positions with competitive day rates.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="/part-time-jobs?role=CFO"
                      className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-lg bg-emerald-500 text-white hover:bg-emerald-400 transition-all duration-200"
                    >
                      Browse Finance Jobs →
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

              {/* Stats panel */}
              <div className="w-full lg:w-auto">
                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-emerald-400 font-mono">{stats.total > 0 ? `${stats.total}+` : '45+'}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Finance Roles</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-white font-mono">£700-1.4k</div>
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
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-gray-400 mb-4 block">Interim Finance Jobs UK</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              Why interim finance<br />professionals are essential
            </h2>
          </div>
          <div className="prose prose-xl prose-gray max-w-none">
            <p className="text-xl text-gray-600 leading-relaxed text-center">
              <strong>Interim finance jobs</strong> are critical for organisations navigating complex financial challenges. From IPO preparation and M&A transactions to finance transformation and turnaround situations, experienced interim CFOs and Finance Directors provide immediate impact without long-term commitment.
            </p>
            <p className="text-xl text-gray-600 leading-relaxed text-center mt-6">
              The UK <strong>interim CFO</strong> market is particularly strong, with demand driven by private equity portfolio companies, high-growth scale-ups, and organisations undergoing significant change or preparing for investment events.
            </p>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-gray-400 mb-4 block">By Role</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Interim Finance Roles & Day Rates</h2>
            <p className="text-xl text-gray-500">Current interim finance positions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {financeRoles.map((role, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{role.name}</h3>
                <p className="text-gray-600 mb-4">{role.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-emerald-600 font-semibold">{role.rateRange}</span>
                  <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-medium">
                    {role.demand} Demand
                  </span>
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
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-gray-400 mb-4 block">Specialisations</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Interim Finance Specialisations</h2>
            <p className="text-xl text-gray-500">Where interim finance professionals add most value</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {financeSpecialisations.map((spec, i) => (
              <div key={i} className="text-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <span className="text-4xl mb-3 block">{spec.icon}</span>
                <h3 className="font-bold text-gray-900 mb-1">{spec.name}</h3>
                <p className="text-xs text-gray-500">{spec.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 md:py-28 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Interim Finance Jobs by Location</h2>
            <p className="text-xl text-gray-400">Regional opportunities and day rates</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-4">Interim Finance Jobs London</h3>
              <p className="text-gray-300 text-sm mb-4">Highest concentration of roles, premium rates</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Interim CFO</span><span className="text-emerald-400">£1,000-1,400/day</span></div>
                <div className="flex justify-between"><span>Finance Director</span><span className="text-emerald-400">£800-1,100/day</span></div>
                <div className="flex justify-between"><span>FC</span><span className="text-emerald-400">£650-900/day</span></div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-4">Interim Finance Jobs Birmingham</h3>
              <p className="text-gray-300 text-sm mb-4">Strong Midlands hub, manufacturing focus</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Interim CFO</span><span className="text-emerald-400">£800-1,100/day</span></div>
                <div className="flex justify-between"><span>Finance Director</span><span className="text-emerald-400">£650-900/day</span></div>
                <div className="flex justify-between"><span>FC</span><span className="text-emerald-400">£500-700/day</span></div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-4">Interim Finance Jobs Manchester</h3>
              <p className="text-gray-300 text-sm mb-4">Growing tech scene, financial services</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Interim CFO</span><span className="text-emerald-400">£850-1,150/day</span></div>
                <div className="flex justify-between"><span>Finance Director</span><span className="text-emerald-400">£700-950/day</span></div>
                <div className="flex justify-between"><span>FC</span><span className="text-emerald-400">£550-750/day</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Board */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest Interim Finance Jobs</h2>
            <p className="text-xl text-gray-500">Browse current finance opportunities</p>
          </div>
          <EmbeddedJobBoard
            defaultDepartment="Finance"
            title="Interim Finance Jobs"
            jobsPerPage={6}
            showAllJobsLink={true}
            allJobsLinkText="View All Finance Jobs"
          />
        </div>
      </section>

      {/* Skills */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">In-Demand Finance Skills</h2>
            <p className="text-xl text-gray-500">Key skills for interim finance professionals</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {financeSkills.map((skill, i) => (
              <span key={i} className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm font-medium hover:bg-emerald-100 transition-colors">
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Interim Finance Jobs FAQ</h2>
          </div>

          <div className="space-y-6">
            <details className="group bg-white rounded-xl p-6 cursor-pointer border border-gray-200">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                How much do interim CFOs earn UK?
                <span className="text-gray-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Interim CFO day rates in the UK range from £900-1,400 per day, with London commanding the highest rates. Based on typical utilisation of 180-200 days per year, annual earnings range from £160,000-£280,000. Rates vary based on sector, company size, and complexity of the assignment.
              </p>
            </details>

            <details className="group bg-white rounded-xl p-6 cursor-pointer border border-gray-200">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                What qualifications do interim finance professionals need?
                <span className="text-gray-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Most interim finance roles require a professional qualification (ACA, ACCA, CIMA, or equivalent). For senior roles like CFO or Finance Director, 15+ years experience with significant time at board level is typical. Big 4 training is valued but not essential. Sector-specific experience often commands premium rates.
              </p>
            </details>

            <details className="group bg-white rounded-xl p-6 cursor-pointer border border-gray-200">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                What's the difference between interim and contract finance roles?
                <span className="text-gray-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Interim roles are typically senior (Director level+) with strategic responsibility, charged at day rates, and focused on leadership or transformation. Contract roles tend to be more operational, often charged hourly, and focus on delivery rather than strategy. Interim assignments are usually 3-12 months; contracts may extend longer.
              </p>
            </details>

            <details className="group bg-white rounded-xl p-6 cursor-pointer border border-gray-200">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                Are interim accountant jobs available?
                <span className="text-gray-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Yes, interim accountant roles exist for qualified professionals, typically as Financial Controller, Group Accountant, or Management Accountant positions. Day rates range from £350-600 depending on seniority. These roles often cover maternity leave, system implementations, or peak periods like year-end.
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
            <Link href="/interim-jobs" className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm hover:bg-emerald-100 transition-colors">All Interim Jobs →</Link>
            <Link href="/part-time-cfo" className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm hover:bg-emerald-100 transition-colors">Part-Time CFO Guide →</Link>
            <Link href="/part-time-cfo-salary" className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm hover:bg-emerald-100 transition-colors">CFO Salary Guide →</Link>
            <Link href="/interim-executive-jobs" className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm hover:bg-emerald-100 transition-colors">Interim Executive Jobs →</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Find Interim Finance Jobs Today
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Browse interim CFO and Finance Director opportunities across the UK
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/part-time-jobs?role=CFO"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-lg bg-emerald-500 text-white hover:bg-emerald-400 transition-all duration-200"
            >
              Browse Finance Jobs →
            </Link>
            <Link
              href="/handler/sign-up"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-lg border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-all duration-200"
            >
              Create Job Alert
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
