import { Metadata } from 'next'
import Link from 'next/link'
import { createDbQuery } from '@/lib/db'
import { JobCard } from '@/components/JobCard'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Fractional Finance Jobs UK - CFO, FD, Finance Director Roles',
  description: 'Find fractional finance jobs in the UK. Fractional CFO, Finance Director, FD roles. £800-£1,400 daily rates. PE-backed, startups, and SMEs.',
  openGraph: {
    title: 'Fractional Finance Jobs UK - CFO, FD, Finance Director Roles',
    description: 'Find fractional finance leadership roles across the UK.',
    type: 'website',
  },
}

const financeRoles = [
  { name: 'Fractional CFO', description: 'Strategic finance leadership', rateRange: '£900-£1,400/day', demand: 'Very High' },
  { name: 'Fractional Finance Director', description: 'Financial operations & reporting', rateRange: '£750-£1,100/day', demand: 'High' },
  { name: 'Fractional FP&A Director', description: 'Financial planning & analysis', rateRange: '£700-£1,000/day', demand: 'High' },
  { name: 'Fractional Controller', description: 'Accounting & controls', rateRange: '£600-£900/day', demand: 'Medium' },
  { name: 'Fractional Treasury Director', description: 'Cash & risk management', rateRange: '£800-£1,200/day', demand: 'Growing' },
  { name: 'Fractional M&A Director', description: 'Deals & transactions', rateRange: '£1,000-£1,500/day', demand: 'High' },
]

const financeSectors = [
  { name: 'PE-Backed', icon: '📈', growth: '+30% YoY', description: 'Private equity portfolio' },
  { name: 'Scale-ups', icon: '🚀', growth: '+25% YoY', description: 'Series A-C companies' },
  { name: 'SMEs', icon: '🏢', growth: '+15% YoY', description: 'Established SMEs' },
  { name: 'FinTech', icon: '💳', growth: '+28% YoY', description: 'Financial technology' },
  { name: 'E-commerce', icon: '🛒', growth: '+20% YoY', description: 'Online retail' },
  { name: 'SaaS', icon: '☁️', growth: '+22% YoY', description: 'Software companies' },
]

const financeSkills = [
  'Fundraising & Investor Relations', 'Board Reporting', 'Financial Modelling',
  'M&A & Due Diligence', 'Cash Flow Management', 'ERP Implementation',
  'PE/VC Reporting', 'IPO Preparation', 'International Finance'
]

const relatedSearches = [
  'Fractional CFO Jobs UK', 'Fractional Finance Director', 'Part-Time CFO London',
  'Fractional FD Jobs', 'PE Backed Fractional CFO', 'Startup CFO Jobs',
  'Fractional CFO Day Rate', 'Fractional Finance Jobs Remote', 'SaaS Fractional CFO'
]

async function getFinanceStats() {
  try {
    const sql = createDbQuery()
    const [total, avgRateResult] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM jobs WHERE is_active = true AND (role_category ILIKE '%CFO%' OR role_category ILIKE '%finance%' OR title ILIKE '%CFO%' OR title ILIKE '%finance%')`,
      sql`SELECT AVG(CAST(REGEXP_REPLACE(compensation, '[^0-9]', '', 'g') AS INTEGER)) as avg FROM jobs WHERE is_active = true AND (role_category ILIKE '%CFO%' OR role_category ILIKE '%finance%') AND compensation IS NOT NULL AND compensation ~ '^[£$]?[0-9]+'`
    ])
    return {
      total: parseInt((total[0] as any)?.count || '0'),
      avgDayRate: Math.round(parseFloat((avgRateResult[0] as any)?.avg || '950'))
    }
  } catch (error) {
    return { total: 60, avgDayRate: 950 }
  }
}

async function getFinanceJobs() {
  try {
    const sql = createDbQuery()
    const jobs = await sql`
      SELECT id, slug, title, company_name, location, is_remote, workplace_type,
        compensation, role_category, skills_required, posted_date
      FROM jobs
      WHERE is_active = true AND (role_category ILIKE '%CFO%' OR role_category ILIKE '%finance%' OR title ILIKE '%CFO%' OR title ILIKE '%finance%')
      ORDER BY posted_date DESC NULLS LAST
      LIMIT 6
    `
    return jobs
  } catch (error) {
    return []
  }
}

export default async function FinanceJobsPage() {
  const [stats, jobs] = await Promise.all([getFinanceStats(), getFinanceJobs()])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="financeGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#financeGrid)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Link href="/" className="inline-flex items-center text-green-200 hover:text-white mb-6 transition-colors">
            ← Back to Home
          </Link>
          <div className="inline-block mb-6">
            <span className="bg-green-700/50 backdrop-blur text-white px-5 py-2.5 rounded-full text-sm font-medium border border-green-500/30">
              💰 {stats.total}+ Finance Leadership Roles
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
            Fractional <span className="text-green-300">Finance</span> Jobs UK
          </h1>
          <p className="max-w-2xl text-xl text-green-100 mb-10 leading-relaxed">
            {stats.total}+ fractional finance leadership roles. Fractional CFO, Finance Director, FD positions. £800-£1,400 daily rates across PE-backed companies, startups, and SMEs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/fractional-jobs?role=CFO"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-lg bg-white text-green-900 hover:bg-green-50 transition-all duration-200"
            >
              Browse Finance Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-black text-green-700">35%</div>
              <div className="text-gray-600 font-medium">of all fractional roles</div>
            </div>
            <div>
              <div className="text-4xl font-black text-green-700">£{stats.avgDayRate}</div>
              <div className="text-gray-600 font-medium">average day rate</div>
            </div>
            <div>
              <div className="text-4xl font-black text-green-700">+25%</div>
              <div className="text-gray-600 font-medium">YoY demand growth</div>
            </div>
            <div>
              <div className="text-4xl font-black text-green-700">45%</div>
              <div className="text-gray-600 font-medium">PE-backed companies</div>
            </div>
          </div>
        </div>
      </section>

      {/* Finance Roles */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Fractional Finance Roles</h2>
            <p className="text-xl text-gray-600">Finance leadership positions available</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {financeRoles.map((role) => (
              <div key={role.name} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{role.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{role.description}</p>
                <p className="text-green-700 font-semibold mb-1">{role.rateRange}</p>
                <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Demand: {role.demand}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Sectors Hiring Finance Leaders</h2>
            <p className="text-xl text-gray-600">Company types with highest demand</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {financeSectors.map((sector) => (
              <div key={sector.name} className="bg-gray-50 rounded-xl p-6 text-center hover:bg-green-50 transition-colors">
                <span className="text-4xl mb-3 block">{sector.icon}</span>
                <h3 className="font-bold text-gray-900 mb-1">{sector.name}</h3>
                <p className="text-green-700 text-sm font-semibold mb-1">{sector.growth}</p>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">In-Demand Finance Skills</h2>
            <p className="text-xl text-gray-600">Skills that command premium rates</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {financeSkills.map((skill) => (
              <span key={skill} className="px-4 py-2 bg-white rounded-full text-gray-700 border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Why Finance */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Fractional CFO?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">📈</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">PE/VC Demand</h3>
              <p className="text-gray-600">
                45% of fractional CFO roles are with PE-backed companies. Investors demand senior finance expertise their portfolio companies can't afford full-time.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">💼</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Highest Demand</h3>
              <p className="text-gray-600">
                CFO/Finance Director is the most common fractional role, accounting for 35% of all positions. Every growing company needs financial leadership.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Clear Value</h3>
              <p className="text-gray-600">
                Fractional CFOs deliver measurable ROI - improved cash flow, successful fundraises, and exit readiness. Value is easy to demonstrate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs */}
      {(jobs as any[]).length > 0 && (
        <section className="py-20 md:py-28 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Featured Finance Jobs</h2>
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
                href="/fractional-jobs?role=CFO"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-green-700 text-white hover:bg-green-800 transition-all"
              >
                View All Finance Jobs →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Finance Fractional FAQs</h2>
          <div className="space-y-6">
            <details className="group bg-gray-50 rounded-xl p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                How much do Fractional CFOs earn in the UK?
                <span className="text-green-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Fractional CFOs in the UK typically earn £900-£1,400 per day. Those with PE/VC experience, M&A expertise, or fundraising track records command the highest rates. Working 3 days per week across 2-3 clients, annual earnings of £180,000-£280,000 are common.
              </p>
            </details>
            <details className="group bg-gray-50 rounded-xl p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                What experience do I need for fractional CFO roles?
                <span className="text-green-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Most fractional CFO roles require qualified accountant status (ACA, ACCA, CIMA) plus 15+ years of experience with at least 5 years as CFO/FD. PE-backed company experience, fundraising, and M&A exposure are highly valued.
              </p>
            </details>
            <details className="group bg-gray-50 rounded-xl p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                What's the difference between fractional CFO and Finance Director?
                <span className="text-green-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Fractional CFOs typically focus on strategy, board-level work, fundraising, and M&A. Finance Directors handle day-to-day operations, reporting, and team management. Rates reflect this - CFOs earn £900-£1,400/day vs £750-£1,100/day for FDs.
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
                className="px-4 py-2 bg-white rounded-full text-gray-700 hover:bg-green-100 hover:text-green-700 transition-colors text-sm border border-gray-200"
              >
                {search}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready for Fractional Finance Leadership?
          </h2>
          <p className="text-xl text-green-100 mb-10">
            {stats.total}+ CFO, Finance Director, and FD opportunities
          </p>
          <Link
            href="/fractional-jobs?role=CFO"
            className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-lg bg-white text-green-900 hover:bg-green-50 transition-all"
          >
            Browse Finance Jobs →
          </Link>
        </div>
      </section>
    </div>
  )
}
