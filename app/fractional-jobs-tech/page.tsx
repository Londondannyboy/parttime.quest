import { Metadata } from 'next'
import Link from 'next/link'
import { createDbQuery } from '@/lib/db'
import { JobCard } from '@/components/JobCard'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Fractional Tech Jobs UK - CTO, VP Engineering, Tech Director Roles',
  description: 'Find fractional tech jobs in the UK. Fractional CTO, VP Engineering, Tech Director roles. £900-£1,500 daily rates. SaaS, FinTech, HealthTech opportunities.',
  openGraph: {
    title: 'Fractional Tech Jobs UK - CTO, VP Engineering, Tech Director Roles',
    description: 'Find fractional technology leadership roles across the UK.',
    type: 'website',
  },
}

const techRoles = [
  { name: 'Fractional CTO', description: 'Strategic technology leadership', rateRange: '£1,000-£1,500/day', demand: 'Very High' },
  { name: 'Fractional VP Engineering', description: 'Engineering team leadership', rateRange: '£900-£1,300/day', demand: 'High' },
  { name: 'Fractional Tech Director', description: 'Technical strategy & delivery', rateRange: '£850-£1,200/day', demand: 'High' },
  { name: 'Fractional Head of Product', description: 'Product strategy & roadmap', rateRange: '£800-£1,200/day', demand: 'High' },
  { name: 'Fractional CISO', description: 'Security & compliance leadership', rateRange: '£950-£1,400/day', demand: 'Growing' },
  { name: 'Fractional Data Lead', description: 'Data strategy & analytics', rateRange: '£850-£1,250/day', demand: 'Growing' },
]

const techSectors = [
  { name: 'SaaS/Cloud', icon: '☁️', growth: '+28% YoY', description: 'B2B software companies' },
  { name: 'FinTech', icon: '💳', growth: '+22% YoY', description: 'Financial technology' },
  { name: 'HealthTech', icon: '🏥', growth: '+25% YoY', description: 'Healthcare technology' },
  { name: 'E-commerce', icon: '🛒', growth: '+18% YoY', description: 'Online retail & marketplaces' },
  { name: 'AI/ML', icon: '🤖', growth: '+35% YoY', description: 'Artificial intelligence' },
  { name: 'Cybersecurity', icon: '🔐', growth: '+30% YoY', description: 'Security solutions' },
]

const techSkills = [
  'Cloud Architecture (AWS/GCP/Azure)', 'DevOps & Platform Engineering', 'AI/ML Implementation',
  'Data Engineering', 'API & Integration Strategy', 'Security & Compliance',
  'Team Scaling & Hiring', 'Technical Due Diligence', 'Legacy Modernization'
]

const relatedSearches = [
  'Fractional CTO Jobs UK', 'Fractional VP Engineering', 'Part-Time CTO London',
  'Fractional Tech Director', 'Fractional CISO Jobs', 'Startup CTO Jobs',
  'SaaS Fractional CTO', 'FinTech Fractional CTO', 'Fractional Head of Engineering'
]

async function getTechStats() {
  try {
    const sql = createDbQuery()
    const [total, avgRateResult] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM jobs WHERE is_active = true AND (role_category ILIKE '%tech%' OR role_category ILIKE '%CTO%' OR role_category ILIKE '%engineering%' OR title ILIKE '%CTO%' OR title ILIKE '%tech%')`,
      sql`SELECT AVG(CAST(REGEXP_REPLACE(compensation, '[^0-9]', '', 'g') AS INTEGER)) as avg FROM jobs WHERE is_active = true AND (role_category ILIKE '%tech%' OR role_category ILIKE '%CTO%') AND compensation IS NOT NULL AND compensation ~ '^[£$]?[0-9]+'`
    ])
    return {
      total: parseInt((total[0] as any)?.count || '0'),
      avgDayRate: Math.round(parseFloat((avgRateResult[0] as any)?.avg || '1100'))
    }
  } catch (error) {
    return { total: 45, avgDayRate: 1100 }
  }
}

async function getTechJobs() {
  try {
    const sql = createDbQuery()
    const jobs = await sql`
      SELECT id, slug, title, company_name, location, is_remote, workplace_type,
        compensation, role_category, skills_required, posted_date
      FROM jobs
      WHERE is_active = true AND (role_category ILIKE '%tech%' OR role_category ILIKE '%CTO%' OR role_category ILIKE '%engineering%' OR title ILIKE '%CTO%' OR title ILIKE '%tech%')
      ORDER BY posted_date DESC NULLS LAST
      LIMIT 6
    `
    return jobs
  } catch (error) {
    return []
  }
}

export default async function TechJobsPage() {
  const [stats, jobs] = await Promise.all([getTechStats(), getTechJobs()])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="techGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#techGrid)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Link href="/" className="inline-flex items-center text-blue-200 hover:text-white mb-6 transition-colors">
            ← Back to Home
          </Link>
          <div className="inline-block mb-6">
            <span className="bg-blue-700/50 backdrop-blur text-white px-5 py-2.5 rounded-full text-sm font-medium border border-blue-500/30">
              💻 {stats.total}+ Tech Leadership Roles
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
            Fractional <span className="text-blue-300">Tech</span> Jobs UK
          </h1>
          <p className="max-w-2xl text-xl text-blue-100 mb-10 leading-relaxed">
            {stats.total}+ fractional technology leadership roles. Fractional CTO, VP Engineering, Tech Director positions. £900-£1,500 daily rates across SaaS, FinTech, and HealthTech.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/fractional-jobs?role=CTO"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-lg bg-white text-blue-900 hover:bg-blue-50 transition-all duration-200"
            >
              Browse Tech Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-black text-blue-700">25%</div>
              <div className="text-gray-600 font-medium">of all fractional roles</div>
            </div>
            <div>
              <div className="text-4xl font-black text-blue-700">£{stats.avgDayRate}</div>
              <div className="text-gray-600 font-medium">average day rate</div>
            </div>
            <div>
              <div className="text-4xl font-black text-blue-700">+28%</div>
              <div className="text-gray-600 font-medium">YoY demand growth</div>
            </div>
            <div>
              <div className="text-4xl font-black text-blue-700">65%</div>
              <div className="text-gray-600 font-medium">offer remote work</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Roles */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Fractional Tech Roles</h2>
            <p className="text-xl text-gray-600">Technology leadership positions available</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techRoles.map((role) => (
              <div key={role.name} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{role.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{role.description}</p>
                <p className="text-blue-700 font-semibold mb-1">{role.rateRange}</p>
                <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Demand: {role.demand}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Sectors */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Tech Sectors Hiring</h2>
            <p className="text-xl text-gray-600">Industries with highest demand for fractional tech leaders</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {techSectors.map((sector) => (
              <div key={sector.name} className="bg-gray-50 rounded-xl p-6 text-center hover:bg-blue-50 transition-colors">
                <span className="text-4xl mb-3 block">{sector.icon}</span>
                <h3 className="font-bold text-gray-900 mb-1">{sector.name}</h3>
                <p className="text-blue-700 text-sm font-semibold mb-1">{sector.growth}</p>
                <p className="text-gray-500 text-xs">{sector.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Skills */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">In-Demand Tech Skills</h2>
            <p className="text-xl text-gray-600">Skills that command premium fractional rates</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {techSkills.map((skill) => (
              <span key={skill} className="px-4 py-2 bg-white rounded-full text-gray-700 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Why Tech */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Fractional Tech Leadership?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Startup-Ready</h3>
              <p className="text-gray-600">
                Startups and scale-ups can't always afford a £200k+ full-time CTO. Fractional tech leaders provide senior expertise at a fraction of the cost.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Rates</h3>
              <p className="text-gray-600">
                Tech leadership commands the highest fractional rates. CTOs with cloud, AI, or security expertise can earn £1,200-£1,500/day.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🌍</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Remote-First</h3>
              <p className="text-gray-600">
                65% of fractional tech roles are fully remote or hybrid. Work with clients across the UK and Europe from anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs */}
      {(jobs as any[]).length > 0 && (
        <section className="py-20 md:py-28 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Featured Tech Jobs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {(jobs as any[]).map((job: any) => (
                <Link key={job.id} href={`/fractional-job/${job.slug}`}>
                  <JobCard
                    title={job.title}
                    company={job.company_name}
                    location={job.location || 'UK'}
                    isRemote={job.is_remote}
                    compensation={job.compensation}
                    roleCategory={job.role_category}
                    skills={job.skills_required || []}
                  />
                </Link>
              ))}
            </div>
            <div className="text-center">
              <Link
                href="/fractional-jobs?role=CTO"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition-all"
              >
                View All Tech Jobs →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Tech Fractional FAQs</h2>
          <div className="space-y-6">
            <details className="group bg-gray-50 rounded-xl p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                How much do Fractional CTOs earn in the UK?
                <span className="text-blue-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Fractional CTOs in the UK typically earn £1,000-£1,500 per day. Those with expertise in AI/ML, cloud architecture, or cybersecurity command the highest rates. Working 2-3 days per week across 2-3 clients, annual earnings of £200,000-£350,000 are achievable.
              </p>
            </details>
            <details className="group bg-gray-50 rounded-xl p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                What experience do I need for fractional tech roles?
                <span className="text-blue-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Most fractional tech leadership roles require 15+ years of experience with at least 5 years in senior positions (CTO, VP Engineering, Tech Director). Startup or scale-up experience is highly valued, as is experience with technical due diligence and team scaling.
              </p>
            </details>
            <details className="group bg-gray-50 rounded-xl p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                Are fractional tech roles mostly remote?
                <span className="text-blue-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Yes - approximately 65% of fractional tech roles offer remote or hybrid working. Tech leadership is well-suited to remote work, though most clients prefer some in-person time for team building and strategic sessions.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Related Searches */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Searches</h2>
          <div className="flex flex-wrap gap-3">
            {relatedSearches.map((search) => (
              <Link
                key={search}
                href={`/fractional-jobs?q=${encodeURIComponent(search)}`}
                className="px-4 py-2 bg-white rounded-full text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors text-sm border border-gray-200"
              >
                {search}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready for Fractional Tech Leadership?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            {stats.total}+ CTO, VP Engineering, and Tech Director opportunities
          </p>
          <Link
            href="/fractional-jobs?role=CTO"
            className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-lg bg-white text-blue-900 hover:bg-blue-50 transition-all"
          >
            Browse Tech Jobs →
          </Link>
        </div>
      </section>
    </div>
  )
}
