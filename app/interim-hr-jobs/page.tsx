import { Metadata } from 'next'
import Link from 'next/link'
import { createDbQuery } from '@/lib/db'
import { JobsGraph3D } from '@/components/JobsGraph3D'
import { EmbeddedJobBoard } from '@/components/EmbeddedJobBoard'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Interim HR Jobs UK 2025 | HR Director, Manager & CHRO Roles',
  description: 'Find interim HR jobs UK. Interim HR Director, HR Manager, Head of HR, and CHRO positions. Interim human resources jobs London and nationwide. £600-1,000/day rates.',
  keywords: 'interim hr jobs, hr interim jobs, interim hr manager jobs, interim human resources jobs, interim hr director jobs, interim head of hr jobs, hr director interim jobs, interim hr jobs london',
  openGraph: {
    title: 'Interim HR Jobs UK 2025 | HR Director, Manager & CHRO Roles',
    description: 'Find interim HR jobs UK. HR Director, Manager, and CHRO interim positions with competitive day rates.',
    type: 'website',
  },
}

const hrRoles = [
  { name: 'Interim HR Director', description: 'Strategic HR leadership & transformation', rateRange: '£700-1,000/day', demand: 'Very High' },
  { name: 'Interim Head of HR', description: 'Departmental HR leadership', rateRange: '£600-850/day', demand: 'Very High' },
  { name: 'Interim HR Manager', description: 'HR operations & team management', rateRange: '£450-650/day', demand: 'High' },
  { name: 'Interim HR Business Partner', description: 'Strategic business alignment', rateRange: '£500-700/day', demand: 'High' },
  { name: 'Interim CHRO', description: 'C-suite HR executive leadership', rateRange: '£900-1,400/day', demand: 'Medium' },
  { name: 'Interim People Director', description: 'Modern HR leadership role', rateRange: '£700-950/day', demand: 'Growing' },
]

const hrSpecialisations = [
  { name: 'HR Transformation', icon: '🔄', description: 'Change management & restructuring' },
  { name: 'M&A Integration', icon: '🤝', description: 'Mergers & acquisitions HR' },
  { name: 'TUPE Transfers', icon: '📋', description: 'Transfer of undertakings' },
  { name: 'Employee Relations', icon: '⚖️', description: 'ER case management & policy' },
  { name: 'Talent Management', icon: '🌟', description: 'Recruitment & retention strategy' },
  { name: 'HR Systems', icon: '💻', description: 'HRIS implementation & change' },
]

const hrSkills = [
  'Employment Law', 'TUPE', 'Change Management', 'Employee Relations',
  'Talent Acquisition', 'HRIS Systems', 'Performance Management',
  'Compensation & Benefits', 'Organisational Design', 'People Strategy'
]

async function getHRStats() {
  try {
    const sql = createDbQuery()
    const [total] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM jobs WHERE is_active = true AND (role_category ILIKE '%HR%' OR role_category ILIKE '%human%' OR title ILIKE '%HR%' OR title ILIKE '%human resource%' OR title ILIKE '%people%')`
    ])
    return {
      total: parseInt((total[0] as any)?.count || '0'),
    }
  } catch (error) {
    return { total: 35 }
  }
}

export default async function InterimHRJobsPage() {
  const stats = await getHRStats()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <JobsGraph3D categoryFilter="HR" limit={30} height="100%" isHero={true} showOverlay={true} />
        </div>

        <div className="relative z-10 w-full pb-16 md:pb-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row justify-between items-end gap-8">
              <div className="max-w-2xl">
                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/10">
                  <Link href="/interim-jobs" className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors text-sm tracking-wide">
                    <span className="mr-2">←</span> All Interim Jobs
                  </Link>

                  <span className="inline-block bg-purple-500/20 backdrop-blur text-purple-200 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-6">
                    {stats.total > 0 ? `${stats.total}+` : '35+'} HR Roles
                  </span>

                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[0.95] tracking-tight">
                    Interim<br />
                    <span className="text-purple-300">HR Jobs</span> UK
                  </h1>

                  <p className="text-lg text-white/70 mb-8 leading-relaxed max-w-lg">
                    Find interim HR jobs across the UK. HR Director, HR Manager, Head of HR, and CHRO positions with competitive day rates.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="/part-time-jobs?role=CHRO"
                      className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-lg bg-purple-500 text-white hover:bg-purple-400 transition-all duration-200"
                    >
                      Browse HR Jobs →
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
                      <div className="text-3xl md:text-4xl font-bold text-purple-400 font-mono">{stats.total > 0 ? `${stats.total}+` : '35+'}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">HR Roles</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-white font-mono">£600-1k</div>
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
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-gray-400 mb-4 block">Interim HR Jobs UK</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              Why interim HR roles<br />are in high demand
            </h2>
          </div>
          <div className="prose prose-xl prose-gray max-w-none">
            <p className="text-xl text-gray-600 leading-relaxed text-center">
              <strong>Interim HR jobs</strong> are among the most sought-after interim positions in the UK market. Organisations need experienced HR professionals to lead transformations, manage restructures, oversee TUPE transfers, and fill critical leadership gaps during recruitment for permanent roles.
            </p>
            <p className="text-xl text-gray-600 leading-relaxed text-center mt-6">
              The demand for <strong>interim HR directors</strong> and <strong>interim HR managers</strong> has grown significantly as businesses face complex people challenges including hybrid working policies, employee engagement, and talent retention in competitive markets.
            </p>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-gray-400 mb-4 block">By Role</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Interim HR Roles & Day Rates</h2>
            <p className="text-xl text-gray-500">Current interim human resources positions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hrRoles.map((role, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{role.name}</h3>
                <p className="text-gray-600 mb-4">{role.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-purple-600 font-semibold">{role.rateRange}</span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
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
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Interim HR Specialisations</h2>
            <p className="text-xl text-gray-500">Areas where interim HR professionals are most needed</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {hrSpecialisations.map((spec, i) => (
              <div key={i} className="text-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <span className="text-4xl mb-3 block">{spec.icon}</span>
                <h3 className="font-bold text-gray-900 mb-1">{spec.name}</h3>
                <p className="text-xs text-gray-500">{spec.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* London Section */}
      <section className="py-20 md:py-28 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-medium uppercase tracking-[0.3em] text-gray-400 mb-4 block">Location Focus</span>
              <h2 className="text-4xl font-bold mb-6">Interim HR Jobs London</h2>
              <p className="text-lg text-gray-300 mb-6">
                London offers the highest concentration of interim HR opportunities in the UK, with premium day rates and access to major corporate headquarters, professional services firms, and fast-growing tech companies.
              </p>
              <ul className="space-y-3 text-gray-300 mb-8">
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  15-20% rate premium vs regional roles
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Strong demand in financial services
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Growing tech sector HR needs
                </li>
              </ul>
              <Link
                href="/part-time-jobs-london"
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                View London HR Jobs →
              </Link>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20">
              <h3 className="text-lg font-bold mb-6">London Interim HR Day Rates</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-gray-300">Interim HR Director</span>
                  <span className="font-bold text-purple-400">£800-1,100/day</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-gray-300">Interim Head of HR</span>
                  <span className="font-bold text-purple-400">£700-950/day</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-gray-300">Interim HR Manager</span>
                  <span className="font-bold text-purple-400">£550-750/day</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-300">Interim HRBP</span>
                  <span className="font-bold text-purple-400">£600-800/day</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Board */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest Interim HR Jobs</h2>
            <p className="text-xl text-gray-500">Browse current HR opportunities</p>
          </div>
          <EmbeddedJobBoard
            defaultDepartment="HR"
            title="Interim HR Jobs"
            jobsPerPage={6}
            showAllJobsLink={true}
            allJobsLinkText="View All HR Jobs"
          />
        </div>
      </section>

      {/* Skills */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">In-Demand HR Skills</h2>
            <p className="text-xl text-gray-500">Key skills for interim HR professionals</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {hrSkills.map((skill, i) => (
              <span key={i} className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm font-medium hover:bg-purple-100 transition-colors">
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Interim HR Jobs FAQ</h2>
          </div>

          <div className="space-y-6">
            <details className="group bg-white rounded-xl p-6 cursor-pointer border border-gray-200">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                What is an interim HR manager?
                <span className="text-gray-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                An interim HR manager is an experienced HR professional hired on a temporary basis (typically 3-12 months) to fill a leadership gap, lead a specific project, or manage a transition period. They bring immediate expertise without the long-term commitment of a permanent hire.
              </p>
            </details>

            <details className="group bg-white rounded-xl p-6 cursor-pointer border border-gray-200">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                How much do interim HR directors earn UK?
                <span className="text-gray-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Interim HR Director day rates in the UK typically range from £700-1,000 per day, with London rates at the higher end (£800-1,100/day). This equates to annual earnings of £140,000-£200,000 based on typical utilisation rates. CHROs command even higher rates of £900-1,400/day.
              </p>
            </details>

            <details className="group bg-white rounded-xl p-6 cursor-pointer border border-gray-200">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                What experience do I need for interim HR roles?
                <span className="text-gray-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Most interim HR roles require 10+ years of HR experience with at least 3-5 years at a senior level. Key requirements include experience managing teams, handling complex ER cases, leading change programmes, and demonstrable impact in previous roles. CIPD qualifications are often preferred but not always essential.
              </p>
            </details>

            <details className="group bg-white rounded-xl p-6 cursor-pointer border border-gray-200">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                How do I find interim HR jobs?
                <span className="text-gray-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Find interim HR jobs through specialist interim recruitment agencies, executive search firms, LinkedIn, and job boards like this one. Building a strong network is crucial as many interim roles are filled through referrals. Register with multiple HR-specialist agencies and keep your LinkedIn profile updated with interim availability.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Related Interim Jobs</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/interim-jobs" className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm hover:bg-purple-100 transition-colors">All Interim Jobs →</Link>
            <Link href="/interim-finance-jobs" className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm hover:bg-purple-100 transition-colors">Interim Finance Jobs →</Link>
            <Link href="/interim-executive-jobs" className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm hover:bg-purple-100 transition-colors">Interim Executive Jobs →</Link>
            <Link href="/part-time-chro" className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm hover:bg-purple-100 transition-colors">Part-Time CHRO →</Link>
            <Link href="/part-time-chro-salary" className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm hover:bg-purple-100 transition-colors">CHRO Salary Guide →</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Find Interim HR Jobs Today
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Browse interim HR opportunities across the UK
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/part-time-jobs?role=CHRO"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-lg bg-purple-500 text-white hover:bg-purple-400 transition-all duration-200"
            >
              Browse HR Jobs →
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
