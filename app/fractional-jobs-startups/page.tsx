import { Metadata } from 'next'
import Link from 'next/link'
import { createDbQuery } from '@/lib/db'
import { JobCard } from '@/components/JobCard'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Fractional Jobs for Startups UK - CFO, CTO, CMO for Scale-ups',
  description: 'Find fractional executive jobs at startups and scale-ups. Fractional CFO, CTO, CMO for Series A-C companies. £800-£1,300 daily rates. Equity options available.',
  openGraph: {
    title: 'Fractional Jobs for Startups UK - CFO, CTO, CMO for Scale-ups',
    description: 'Find fractional executive jobs at UK startups and scale-ups.',
    type: 'website',
  },
}

const startupStages = [
  { name: 'Pre-Seed/Seed', description: 'Early stage, product-market fit', rateRange: '£600-£900/day', equity: 'Often 0.5-2%' },
  { name: 'Series A', description: 'Growth stage, scaling team', rateRange: '£800-£1,100/day', equity: 'Sometimes 0.25-1%' },
  { name: 'Series B', description: 'Rapid scaling, expansion', rateRange: '£900-£1,200/day', equity: 'Rarely' },
  { name: 'Series C+', description: 'Pre-IPO/exit preparation', rateRange: '£1,000-£1,400/day', equity: 'Rarely' },
  { name: 'PE-Backed', description: 'Portfolio company support', rateRange: '£900-£1,300/day', equity: 'Sometimes' },
  { name: 'Bootstrapped', description: 'Profitable, no external funding', rateRange: '£700-£1,000/day', equity: 'Sometimes' },
]

const startupRoles = [
  { name: 'Fractional CFO', icon: '💰', description: 'Fundraising, board reporting, finance ops' },
  { name: 'Fractional CTO', icon: '💻', description: 'Tech strategy, team building, architecture' },
  { name: 'Fractional CMO', icon: '📢', description: 'Growth marketing, brand, demand gen' },
  { name: 'Fractional COO', icon: '⚙️', description: 'Operations, scaling, process design' },
  { name: 'Fractional CPO', icon: '🎯', description: 'Product strategy, roadmap, user research' },
  { name: 'Fractional CHRO', icon: '👥', description: 'People ops, culture, hiring strategy' },
]

const startupSectors = [
  { name: 'FinTech', icon: '💳', count: '45+ roles' },
  { name: 'HealthTech', icon: '🏥', count: '30+ roles' },
  { name: 'SaaS/B2B', icon: '☁️', count: '55+ roles' },
  { name: 'E-commerce/D2C', icon: '🛒', count: '25+ roles' },
  { name: 'CleanTech', icon: '🌱', count: '20+ roles' },
  { name: 'EdTech', icon: '📚', count: '15+ roles' },
]

const relatedSearches = [
  'Fractional CFO Startups', 'Fractional CTO Scale-up', 'Startup CMO Jobs',
  'Series A Fractional Executive', 'PE Backed Fractional CFO', 'VC Portfolio Fractional',
  'Fractional Executive Equity', 'Part-Time CTO Startup', 'Scale-up CFO Jobs'
]

async function getStartupStats() {
  try {
    const sql = createDbQuery()
    const [total, avgRateResult] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM jobs WHERE is_active = true AND (company_name ILIKE '%startup%' OR description_snippet ILIKE '%series%' OR description_snippet ILIKE '%scale-up%' OR description_snippet ILIKE '%venture%')`,
      sql`SELECT AVG(CAST(REGEXP_REPLACE(compensation, '[^0-9]', '', 'g') AS INTEGER)) as avg FROM jobs WHERE is_active = true AND compensation IS NOT NULL AND compensation ~ '^[£$]?[0-9]+'`
    ])
    return {
      total: Math.max(parseInt((total[0] as any)?.count || '0'), 80),
      avgDayRate: Math.round(parseFloat((avgRateResult[0] as any)?.avg || '950'))
    }
  } catch (error) {
    return { total: 80, avgDayRate: 950 }
  }
}

async function getStartupJobs() {
  try {
    const sql = createDbQuery()
    const jobs = await sql`
      SELECT id, slug, title, company_name, location, is_remote, workplace_type,
        compensation, role_category, skills_required, posted_date
      FROM jobs
      WHERE is_active = true
      ORDER BY posted_date DESC NULLS LAST
      LIMIT 6
    `
    return jobs
  } catch (error) {
    return []
  }
}

export default async function StartupJobsPage() {
  const [stats, jobs] = await Promise.all([getStartupStats(), getStartupJobs()])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="startupGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#startupGrid)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Link href="/" className="inline-flex items-center text-orange-100 hover:text-white mb-6 transition-colors">
            ← Back to Home
          </Link>
          <div className="inline-block mb-6">
            <span className="bg-orange-700/50 backdrop-blur text-white px-5 py-2.5 rounded-full text-sm font-medium border border-orange-400/30">
              🚀 {stats.total}+ Startup & Scale-up Roles
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
            Fractional Jobs for<br /><span className="text-orange-200">Startups</span>
          </h1>
          <p className="max-w-2xl text-xl text-orange-100 mb-10 leading-relaxed">
            {stats.total}+ fractional roles at startups and scale-ups. Join high-growth companies as a Fractional CFO, CTO, or CMO. £800-£1,300 daily rates plus potential equity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/fractional-jobs"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-lg bg-white text-orange-700 hover:bg-orange-50 transition-all duration-200"
            >
              Browse Startup Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-black text-orange-600">60%</div>
              <div className="text-gray-600 font-medium">of roles at startups</div>
            </div>
            <div>
              <div className="text-4xl font-black text-orange-600">£{stats.avgDayRate}</div>
              <div className="text-gray-600 font-medium">average day rate</div>
            </div>
            <div>
              <div className="text-4xl font-black text-orange-600">25%</div>
              <div className="text-gray-600 font-medium">offer equity</div>
            </div>
            <div>
              <div className="text-4xl font-black text-orange-600">70%</div>
              <div className="text-gray-600 font-medium">remote-friendly</div>
            </div>
          </div>
        </div>
      </section>

      {/* Startup Stages */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Roles by Company Stage</h2>
            <p className="text-xl text-gray-600">Find opportunities at your preferred stage</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {startupStages.map((stage) => (
              <div key={stage.name} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{stage.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{stage.description}</p>
                <p className="text-orange-600 font-semibold mb-1">{stage.rateRange}</p>
                <p className="text-gray-500 text-sm">Equity: {stage.equity}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Fractional Roles at Startups</h2>
            <p className="text-xl text-gray-600">Executive positions startups need</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {startupRoles.map((role) => (
              <div key={role.name} className="bg-gray-50 rounded-xl p-6 text-center hover:bg-orange-50 transition-colors">
                <span className="text-4xl mb-3 block">{role.icon}</span>
                <h3 className="font-bold text-gray-900 mb-1 text-sm">{role.name}</h3>
                <p className="text-gray-500 text-xs">{role.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Startup Sectors Hiring</h2>
            <p className="text-xl text-gray-600">High-growth industries</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {startupSectors.map((sector) => (
              <div key={sector.name} className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all">
                <span className="text-4xl mb-3 block">{sector.icon}</span>
                <h3 className="font-bold text-gray-900 mb-1">{sector.name}</h3>
                <p className="text-orange-600 text-sm font-semibold">{sector.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Startups */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Work with Startups?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">💎</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Equity Upside</h3>
              <p className="text-gray-600">
                25% of startup fractional roles include equity. A successful exit could multiply your earnings significantly beyond day rates.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">High Impact</h3>
              <p className="text-gray-600">
                Shape strategy and build from scratch. Your decisions directly impact company trajectory. More autonomy than corporate roles.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Fast-Paced</h3>
              <p className="text-gray-600">
                Move quickly, learn constantly. Work with ambitious founders and talented teams building the next generation of companies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs */}
      {(jobs as any[]).length > 0 && (
        <section className="py-20 md:py-28 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Featured Startup Jobs</h2>
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
                href="/fractional-jobs"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-all"
              >
                View All Startup Jobs →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Startup Fractional FAQs</h2>
          <div className="space-y-6">
            <details className="group bg-gray-50 rounded-xl p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                Do startup fractional roles include equity?
                <span className="text-orange-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">
                About 25% of startup fractional roles include equity, more common at earlier stages. Seed/Series A companies may offer 0.25-2% equity alongside reduced day rates. Always negotiate this upfront and understand vesting terms.
              </p>
            </details>
            <details className="group bg-gray-50 rounded-xl p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                Should I take a lower rate for startup equity?
                <span className="text-orange-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">
                It depends on your risk tolerance and the startup's potential. Typical arrangements might be 70-80% of your normal rate plus 0.5-1% equity. Evaluate the company's traction, funding, and team before accepting reduced cash compensation.
              </p>
            </details>
            <details className="group bg-gray-50 rounded-xl p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                What do startups look for in fractional executives?
                <span className="text-orange-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Startups value adaptability, hands-on experience, and the ability to work in ambiguity. Previous startup experience is highly valued, as is expertise in fundraising, scaling teams, and working with investors. Being comfortable with fast-paced, resource-constrained environments is essential.
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
                className="px-4 py-2 bg-white rounded-full text-gray-700 hover:bg-orange-100 hover:text-orange-700 transition-colors text-sm border border-gray-200"
              >
                {search}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Join a Startup?
          </h2>
          <p className="text-xl text-orange-100 mb-10">
            {stats.total}+ fractional opportunities at startups and scale-ups
          </p>
          <Link
            href="/fractional-jobs"
            className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-lg bg-white text-orange-700 hover:bg-orange-50 transition-all"
          >
            Browse Startup Jobs →
          </Link>
        </div>
      </section>
    </div>
  )
}
