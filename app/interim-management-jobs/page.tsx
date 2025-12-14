import { Metadata } from 'next'
import Link from 'next/link'
import { createDbQuery } from '@/lib/db'
import { JobsGraph3D } from '@/components/JobsGraph3D'
import { EmbeddedJobBoard } from '@/components/EmbeddedJobBoard'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Interim Management Jobs UK 2025 | Interim Manager Roles',
  description: 'Find interim management jobs UK. Interim manager positions across all functions and industries. £500-1,200/day rates. What does interim manager mean? Complete guide.',
  keywords: 'interim management jobs, interim manager jobs, jobs interim management, interim management jobs uk, interim manager meaning, interim manager',
  openGraph: {
    title: 'Interim Management Jobs UK 2025 | Interim Manager Roles',
    description: 'Find interim management jobs UK. Interim manager positions with competitive day rates.',
    type: 'website',
  },
}

const managementRoles = [
  { name: 'Interim General Manager', description: 'Business unit leadership', rateRange: '£700-1,000/day', demand: 'Very High' },
  { name: 'Interim Operations Manager', description: 'Operational excellence', rateRange: '£500-750/day', demand: 'Very High' },
  { name: 'Interim Programme Manager', description: 'Complex programme delivery', rateRange: '£600-850/day', demand: 'High' },
  { name: 'Interim Change Manager', description: 'Transformation leadership', rateRange: '£550-800/day', demand: 'High' },
  { name: 'Interim Divisional Manager', description: 'Division/department leadership', rateRange: '£600-900/day', demand: 'High' },
  { name: 'Interim Site Manager', description: 'Manufacturing/operations site', rateRange: '£450-700/day', demand: 'Medium' },
]

const managementSectors = [
  { name: 'Manufacturing', icon: '🏭', description: 'Production & operations' },
  { name: 'Retail', icon: '🛒', description: 'Store & regional management' },
  { name: 'Healthcare', icon: '🏥', description: 'NHS & private health' },
  { name: 'Financial Services', icon: '🏦', description: 'Banking & insurance' },
  { name: 'Technology', icon: '💻', description: 'Tech companies' },
  { name: 'Public Sector', icon: '🏛️', description: 'Government & councils' },
]

const managementSkills = [
  'People Management', 'P&L Responsibility', 'Change Management', 'Stakeholder Management',
  'Project Delivery', 'Process Improvement', 'Budget Management', 'Strategic Planning',
  'Risk Management', 'Team Development'
]

async function getManagementStats() {
  try {
    const sql = createDbQuery()
    const [total] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM jobs WHERE is_active = true AND is_fractional = true`
    ])
    return { total: parseInt((total[0] as any)?.count || '0') }
  } catch (error) {
    return { total: 150 }
  }
}

export default async function InterimManagementJobsPage() {
  const stats = await getManagementStats()

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

                  <span className="inline-block bg-cyan-500/20 backdrop-blur text-cyan-200 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-6">
                    {stats.total > 0 ? `${stats.total}+` : '150+'} Management Roles
                  </span>

                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[0.95] tracking-tight">
                    Interim<br />
                    <span className="text-cyan-300">Management</span> Jobs
                  </h1>

                  <p className="text-lg text-white/70 mb-8 leading-relaxed max-w-lg">
                    Find interim management jobs across the UK. General Manager, Operations Manager, and programme leadership positions.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="/part-time-jobs"
                      className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-lg bg-cyan-500 text-white hover:bg-cyan-400 transition-all duration-200"
                    >
                      Browse Management Jobs →
                    </Link>
                    <Link
                      href="#what-is"
                      className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-lg bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
                    >
                      What is Interim Management?
                    </Link>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-auto">
                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-cyan-400 font-mono">{stats.total > 0 ? `${stats.total}+` : '150+'}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Roles</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-white font-mono">£500-1.2k</div>
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

      {/* What is Interim Management */}
      <section id="what-is" className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-gray-400 mb-4 block">Interim Manager Meaning</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              What does interim<br />manager mean?
            </h2>
          </div>
          <div className="prose prose-xl prose-gray max-w-none">
            <p className="text-xl text-gray-600 leading-relaxed text-center">
              An <strong>interim manager</strong> is an experienced professional hired on a temporary basis to fill a management gap, lead a project, or drive a specific business outcome. Unlike consultants who advise, interim managers take executive responsibility and accountability for results.
            </p>
            <p className="text-xl text-gray-600 leading-relaxed text-center mt-6">
              <strong>Interim management</strong> has grown significantly in the UK, with organisations using interim managers for turnarounds, transformations, gap-filling during recruitment, and specialist projects. The typical interim assignment lasts 6-12 months.
            </p>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Interim Manager Roles</h2>
            <p className="text-xl text-gray-500">Common interim management positions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {managementRoles.map((role, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{role.name}</h3>
                <p className="text-gray-600 mb-4">{role.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-cyan-600 font-semibold">{role.rateRange}</span>
                  <span className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-xs font-medium">{role.demand}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Sectors Hiring Interim Managers</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {managementSectors.map((sector, i) => (
              <div key={i} className="text-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <span className="text-4xl mb-3 block">{sector.icon}</span>
                <h3 className="font-bold text-gray-900 mb-1">{sector.name}</h3>
                <p className="text-xs text-gray-500">{sector.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Board */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest Interim Management Jobs UK</h2>
          </div>
          <EmbeddedJobBoard
            title="Interim Management Jobs"
            jobsPerPage={9}
            showAllJobsLink={true}
            allJobsLinkText="View All Management Jobs"
          />
        </div>
      </section>

      {/* Skills */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Interim Manager Skills</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {managementSkills.map((skill, i) => (
              <span key={i} className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm font-medium hover:bg-cyan-100 transition-colors">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Interim Management FAQ</h2>
          </div>

          <div className="space-y-6">
            <details className="group bg-white rounded-xl p-6 cursor-pointer border border-gray-200">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                How much do interim managers earn UK?
                <span className="text-gray-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Interim manager day rates in the UK typically range from £500-1,200 depending on seniority and specialism. General Managers earn £700-1,000/day, Operations Managers £500-750/day, and senior specialists can command more. London rates are typically 15-20% higher.
              </p>
            </details>

            <details className="group bg-white rounded-xl p-6 cursor-pointer border border-gray-200">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                What is the difference between interim and permanent management?
                <span className="text-gray-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Interim managers are hired on fixed-term contracts (typically 3-12 months) to deliver specific outcomes or fill gaps. They charge day rates and don't receive benefits. Permanent managers have ongoing employment with benefits, pension, and job security. Interim offers higher rates but less stability.
              </p>
            </details>

            <details className="group bg-white rounded-xl p-6 cursor-pointer border border-gray-200">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                How do I become an interim manager?
                <span className="text-gray-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Most interim managers transition after 15-20 years in permanent roles with demonstrable senior management experience. Build a strong track record, develop a clear proposition (what you do and for whom), register with interim agencies, build your LinkedIn presence, and network actively. Consider IIM membership for credibility.
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
            <Link href="/interim-jobs" className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm hover:bg-cyan-100 transition-colors">All Interim Jobs →</Link>
            <Link href="/interim-executive-jobs" className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm hover:bg-cyan-100 transition-colors">Interim Executive Jobs →</Link>
            <Link href="/interim-director-jobs" className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm hover:bg-cyan-100 transition-colors">Interim Director Jobs →</Link>
            <Link href="/interim-project-manager-jobs" className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm hover:bg-cyan-100 transition-colors">Interim Project Manager Jobs →</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Find Interim Management Jobs</h2>
          <p className="text-xl text-gray-400 mb-10">Browse interim manager opportunities across the UK</p>
          <Link
            href="/part-time-jobs"
            className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-lg bg-cyan-500 text-white hover:bg-cyan-400 transition-all duration-200"
          >
            Browse All Jobs →
          </Link>
        </div>
      </section>
    </div>
  )
}
