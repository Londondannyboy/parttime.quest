import { Metadata } from 'next'
import Link from 'next/link'
import { createDbQuery } from '@/lib/db'
import { JobsGraph3D } from '@/components/JobsGraph3D'
import { EmbeddedJobBoard } from '@/components/EmbeddedJobBoard'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Interim NHS Jobs UK 2025 | NHS Management & Leadership Roles',
  description: 'Find interim NHS jobs UK. NHS interim management, director, and leadership positions. Interim jobs in NHS trusts nationwide. Competitive day rates for healthcare leaders.',
  keywords: 'interim nhs jobs, nhs interim jobs, interim jobs nhs, nhs interim management jobs, nhs interim manager jobs, interim jobs in nhs',
  openGraph: {
    title: 'Interim NHS Jobs UK 2025 | NHS Management & Leadership Roles',
    description: 'Find interim NHS jobs UK. NHS interim management and leadership positions in trusts nationwide.',
    type: 'website',
  },
}

const nhsRoles = [
  { name: 'Interim NHS Director', description: 'Trust-level strategic leadership', rateRange: '£700-1,000/day', demand: 'Very High' },
  { name: 'Interim Chief Operating Officer', description: 'Operational leadership', rateRange: '£800-1,100/day', demand: 'High' },
  { name: 'Interim Director of Finance', description: 'NHS financial management', rateRange: '£750-950/day', demand: 'High' },
  { name: 'Interim HR Director NHS', description: 'Workforce & HR leadership', rateRange: '£650-850/day', demand: 'High' },
  { name: 'Interim Programme Director', description: 'Transformation programmes', rateRange: '£600-800/day', demand: 'Very High' },
  { name: 'Interim Divisional Manager', description: 'Clinical division management', rateRange: '£500-700/day', demand: 'Medium' },
]

const nhsSpecialisations = [
  { name: 'Digital Transformation', icon: '💻', description: 'NHS IT & digital programmes' },
  { name: 'Service Redesign', icon: '🔄', description: 'Pathway transformation' },
  { name: 'Financial Recovery', icon: '💰', description: 'Trust turnaround' },
  { name: 'Workforce Planning', icon: '👥', description: 'Staff strategy & retention' },
  { name: 'Merger Integration', icon: '🤝', description: 'Trust consolidation' },
  { name: 'Quality Improvement', icon: '⭐', description: 'CQC & clinical quality' },
]

const nhsSkills = [
  'NHS Operating Framework', 'Healthcare Commissioning', 'Clinical Governance',
  'CQC Standards', 'Healthcare Finance', 'Service Transformation',
  'Stakeholder Management', 'Board-level Reporting', 'Change Management'
]

async function getNHSStats() {
  try {
    const sql = createDbQuery()
    const [total] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM jobs WHERE is_active = true AND (title ILIKE '%NHS%' OR title ILIKE '%healthcare%' OR title ILIKE '%hospital%' OR description_snippet ILIKE '%NHS%')`
    ])
    return {
      total: parseInt((total[0] as any)?.count || '0'),
    }
  } catch (error) {
    return { total: 25 }
  }
}

export default async function InterimNHSJobsPage() {
  const stats = await getNHSStats()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <JobsGraph3D limit={30} height="100%" isHero={true} showOverlay={true} />
        </div>

        <div className="relative z-10 w-full pb-16 md:pb-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row justify-between items-end gap-8">
              <div className="max-w-2xl">
                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/10">
                  <Link href="/interim-jobs" className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors text-sm tracking-wide">
                    <span className="mr-2">←</span> All Interim Jobs
                  </Link>

                  <span className="inline-block bg-blue-500/20 backdrop-blur text-blue-200 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-6">
                    {stats.total > 0 ? `${stats.total}+` : '25+'} NHS Roles
                  </span>

                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[0.95] tracking-tight">
                    Interim<br />
                    <span className="text-blue-300">NHS Jobs</span> UK
                  </h1>

                  <p className="text-lg text-white/70 mb-8 leading-relaxed max-w-lg">
                    Find interim NHS management jobs across UK trusts. Director, COO, and programme leadership positions in healthcare.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="/part-time-jobs"
                      className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-lg bg-blue-500 text-white hover:bg-blue-400 transition-all duration-200"
                    >
                      Browse NHS Jobs →
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
                      <div className="text-3xl md:text-4xl font-bold text-blue-400 font-mono">{stats.total > 0 ? `${stats.total}+` : '25+'}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">NHS Roles</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-white font-mono">£600-1.1k</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Day Rates</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-white font-mono">3-12mo</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Duration</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-white font-mono">Nationwide</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Trusts</div>
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
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-gray-400 mb-4 block">Interim NHS Jobs UK</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              Why NHS trusts need<br />interim managers
            </h2>
          </div>
          <div className="prose prose-xl prose-gray max-w-none">
            <p className="text-xl text-gray-600 leading-relaxed text-center">
              <strong>Interim NHS jobs</strong> are essential for healthcare organisations facing leadership gaps, transformation programmes, or regulatory challenges. NHS trusts increasingly rely on experienced interim managers to lead digital transformations, financial recovery plans, and service redesign initiatives.
            </p>
            <p className="text-xl text-gray-600 leading-relaxed text-center mt-6">
              The NHS interim market offers competitive day rates and the opportunity to make a significant impact on patient care and healthcare delivery. <strong>NHS interim management jobs</strong> typically last 6-12 months and offer meaningful work improving healthcare services.
            </p>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-gray-400 mb-4 block">By Role</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">NHS Interim Roles & Day Rates</h2>
            <p className="text-xl text-gray-500">Current NHS interim management positions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nhsRoles.map((role, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{role.name}</h3>
                <p className="text-gray-600 mb-4">{role.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-blue-600 font-semibold">{role.rateRange}</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
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
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">NHS Interim Specialisations</h2>
            <p className="text-xl text-gray-500">Key areas where interim managers support trusts</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {nhsSpecialisations.map((spec, i) => (
              <div key={i} className="text-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <span className="text-4xl mb-3 block">{spec.icon}</span>
                <h3 className="font-bold text-gray-900 mb-1">{spec.name}</h3>
                <p className="text-xs text-gray-500">{spec.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why NHS Interim */}
      <section className="py-20 md:py-28 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose NHS Interim Work?</h2>
            <p className="text-xl text-gray-400">Benefits of interim roles in healthcare</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20">
              <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Meaningful Impact</h3>
              <p className="text-gray-300">
                Directly improve patient care and healthcare services. NHS interim roles offer the chance to make a real difference in communities.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20">
              <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">💷</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Competitive Rates</h3>
              <p className="text-gray-300">
                NHS interim day rates are competitive with the private sector, typically £600-1,100/day for senior management roles.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20">
              <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">📍</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Nationwide Opportunities</h3>
              <p className="text-gray-300">
                NHS trusts across England, Scotland, Wales, and Northern Ireland regularly need interim management support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Job Board */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest NHS Interim Jobs</h2>
            <p className="text-xl text-gray-500">Browse current healthcare opportunities</p>
          </div>
          <EmbeddedJobBoard
            title="NHS Interim Jobs"
            jobsPerPage={6}
            showAllJobsLink={true}
            allJobsLinkText="View All NHS Jobs"
          />
        </div>
      </section>

      {/* Skills */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">NHS Interim Skills</h2>
            <p className="text-xl text-gray-500">Key competencies for NHS management roles</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {nhsSkills.map((skill, i) => (
              <span key={i} className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm font-medium hover:bg-blue-100 transition-colors">
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">NHS Interim Jobs FAQ</h2>
          </div>

          <div className="space-y-6">
            <details className="group bg-white rounded-xl p-6 cursor-pointer border border-gray-200">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                How do I find interim jobs in NHS?
                <span className="text-gray-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Find NHS interim jobs through NHS Jobs (the official portal), specialist healthcare recruitment agencies, executive search firms, and job boards like this one. Many NHS interim roles are filled through agencies that hold framework agreements with trusts. Building relationships with healthcare-specialist recruiters is essential.
              </p>
            </details>

            <details className="group bg-white rounded-xl p-6 cursor-pointer border border-gray-200">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                What experience do NHS interim managers need?
                <span className="text-gray-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Most NHS interim management roles require significant NHS or healthcare experience - typically 10+ years with demonstrable senior leadership. Understanding of NHS governance, commissioning structures, CQC requirements, and clinical governance is essential. Private healthcare experience can be valuable but NHS-specific knowledge is usually required.
              </p>
            </details>

            <details className="group bg-white rounded-xl p-6 cursor-pointer border border-gray-200">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                How much do NHS interim managers earn?
                <span className="text-gray-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                NHS interim day rates typically range from £500-1,100 depending on seniority and specialism. Programme Directors earn £600-800/day, Directors of Finance £750-950/day, and Chief Operating Officers £800-1,100/day. Rates are subject to NHS agency spending caps in some trusts.
              </p>
            </details>

            <details className="group bg-white rounded-xl p-6 cursor-pointer border border-gray-200">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                Are NHS interim roles affected by IR35?
                <span className="text-gray-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Most NHS interim roles are caught by off-payroll working rules (IR35) as NHS trusts are public sector organisations. This means many interim managers work through umbrella companies or take PAYE positions via agencies. Some trusts may offer outside IR35 determinations for genuinely independent consultancy arrangements.
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
            <Link href="/interim-jobs" className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm hover:bg-blue-100 transition-colors">All Interim Jobs →</Link>
            <Link href="/interim-hr-jobs" className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm hover:bg-blue-100 transition-colors">Interim HR Jobs →</Link>
            <Link href="/interim-finance-jobs" className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm hover:bg-blue-100 transition-colors">Interim Finance Jobs →</Link>
            <Link href="/interim-executive-jobs" className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm hover:bg-blue-100 transition-colors">Interim Executive Jobs →</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Find NHS Interim Jobs Today
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Browse interim management opportunities across NHS trusts
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/part-time-jobs"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-lg bg-blue-500 text-white hover:bg-blue-400 transition-all duration-200"
            >
              Browse NHS Jobs →
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
