import { Metadata } from 'next'
import Link from 'next/link'
import { createDbQuery } from '@/lib/db'
import { JobsGraph3D } from '@/components/JobsGraph3D'
import { EmbeddedJobBoard } from '@/components/EmbeddedJobBoard'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Part-Time Retail Jobs UK | Retail Manager & Director Roles',
  description: 'Find part-time retail jobs in the UK. Retail Director, Store Manager, Operations Manager roles. Flexible hours, competitive pay. Browse part-time retail jobs near you.',
  keywords: 'part time retail jobs, part time retail jobs near me, part-time retail manager, retail director jobs uk, flexible retail jobs',
  openGraph: {
    title: 'Part-Time Retail Jobs UK | Retail Manager & Director Roles',
    description: 'Find part-time retail jobs in the UK. Retail Director, Store Manager, Operations Manager roles.',
    type: 'website',
  },
}

const retailRoles = [
  { name: 'Part-Time Retail Director', description: 'Strategic retail leadership', rateRange: '£500-£900/day', demand: 'High' },
  { name: 'Part-Time Store Manager', description: 'Store operations management', rateRange: '£200-£400/day', demand: 'Very High' },
  { name: 'Part-Time Operations Manager', description: 'Multi-site operations', rateRange: '£350-£600/day', demand: 'High' },
  { name: 'Part-Time Merchandising Manager', description: 'Visual merchandising & buying', rateRange: '£300-£500/day', demand: 'Growing' },
  { name: 'Part-Time E-commerce Manager', description: 'Online retail strategy', rateRange: '£400-£700/day', demand: 'Very High' },
  { name: 'Part-Time Customer Experience Lead', description: 'CX strategy & improvement', rateRange: '£350-£550/day', demand: 'Growing' },
]

const retailSectors = [
  { name: 'Fashion & Apparel', icon: '👗', growth: '+15% YoY', description: 'Clothing & accessories' },
  { name: 'Food & Grocery', icon: '🛒', growth: '+12% YoY', description: 'Supermarkets & specialty food' },
  { name: 'E-commerce', icon: '📦', growth: '+25% YoY', description: 'Online retail platforms' },
  { name: 'Home & Garden', icon: '🏠', growth: '+18% YoY', description: 'Home improvement & decor' },
  { name: 'Health & Beauty', icon: '💄', growth: '+20% YoY', description: 'Cosmetics & wellness' },
  { name: 'Luxury Retail', icon: '💎', growth: '+10% YoY', description: 'Premium brands & boutiques' },
]

const retailSkills = [
  'Store Operations Management', 'P&L Responsibility', 'Team Leadership & Development',
  'Visual Merchandising', 'Inventory Management', 'Customer Experience Strategy',
  'E-commerce Operations', 'Omnichannel Retail', 'Retail Analytics'
]

const relatedSearches = [
  'Part-Time Retail Jobs Near Me', 'Part-Time Store Manager Jobs', 'Retail Director Jobs UK',
  'Part-Time Retail Jobs London', 'Weekend Retail Jobs', 'Flexible Retail Manager Jobs',
  'Part-Time E-commerce Jobs', 'Retail Operations Jobs', 'Part-Time Merchandising Jobs'
]

async function getRetailStats() {
  try {
    const sql = createDbQuery()
    const [total] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM jobs WHERE is_active = true AND (role_category ILIKE '%retail%' OR title ILIKE '%retail%' OR title ILIKE '%store manager%' OR title ILIKE '%merchandis%')`
    ])
    return {
      total: parseInt((total[0] as any)?.count || '0'),
      avgDayRate: 350
    }
  } catch (error) {
    return { total: 25, avgDayRate: 350 }
  }
}

export default async function RetailJobsPage() {
  const stats = await getRetailStats()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <JobsGraph3D categoryFilter="Retail" limit={30} height="100%" isHero={true} showOverlay={true} />
        </div>

        <div className="relative z-10 w-full pb-16 md:pb-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row justify-between items-end gap-8">
              <div className="max-w-2xl">
                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/10">
                  <Link href="/" className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors text-sm tracking-wide">
                    <span className="mr-2">←</span> Back to Home
                  </Link>

                  <span className="inline-block bg-pink-500/20 backdrop-blur text-pink-200 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-6">
                    {stats.total > 0 ? `${stats.total}+` : 'Browse'} Retail Roles
                  </span>

                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[0.95] tracking-tight">
                    Part-Time<br />
                    <span className="text-pink-300">Retail</span> Jobs UK
                  </h1>

                  <p className="text-lg text-white/70 mb-8 leading-relaxed max-w-lg">
                    Part-time retail jobs near you. Store Manager, Retail Director, Operations Manager positions with flexible hours across the UK.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="/part-time-jobs?industry=Retail"
                      className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-lg bg-pink-500 text-white hover:bg-pink-400 transition-all duration-200"
                    >
                      Browse Retail Jobs →
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
                      <div className="text-3xl md:text-4xl font-bold text-pink-400 font-mono">{stats.total > 0 ? `${stats.total}+` : '25+'}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Retail Jobs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-white font-mono">Flexible</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-white font-mono">UK Wide</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Locations</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-white font-mono">All Levels</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Experience</div>
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
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-gray-400 mb-4 block">Part-Time Retail Jobs UK</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              Find part-time retail jobs<br />near you
            </h2>
          </div>
          <div className="prose prose-xl prose-gray max-w-none">
            <p className="text-xl text-gray-600 leading-relaxed text-center">
              The UK retail sector offers excellent opportunities for part-time work. Whether you're looking for flexible hours to fit around other commitments, or seeking management experience without full-time demands, part-time retail jobs provide competitive pay and career progression.
            </p>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-gray-400 mb-4 block">By Role</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Part-Time Retail Roles</h2>
            <p className="text-xl text-gray-500">Popular part-time retail positions across the UK</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {retailRoles.map((role, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{role.name}</h3>
                <p className="text-gray-600 mb-4">{role.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-pink-600 font-semibold">{role.rateRange}</span>
                  <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-xs font-medium">
                    {role.demand} Demand
                  </span>
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
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-gray-400 mb-4 block">By Sector</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Retail Sectors Hiring</h2>
            <p className="text-xl text-gray-500">Part-time opportunities across retail industries</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {retailSectors.map((sector, i) => (
              <div key={i} className="text-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <span className="text-4xl mb-3 block">{sector.icon}</span>
                <h3 className="font-bold text-gray-900 mb-1">{sector.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{sector.description}</p>
                <span className="text-pink-600 text-xs font-medium">{sector.growth}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Part-Time Retail */}
      <section className="py-20 md:py-28 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Why Choose Part-Time Retail?</h2>
            <p className="text-xl text-gray-400">Benefits of flexible retail careers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8">
              <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">⏰</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Flexible Hours</h3>
              <p className="text-gray-600">
                Choose shifts that fit your lifestyle. Many part-time retail jobs offer weekend, evening, or weekday-only schedules.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8">
              <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">📍</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Local Opportunities</h3>
              <p className="text-gray-600">
                Find part-time retail jobs near you. High street, shopping centres, and local stores all hire part-time staff.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8">
              <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">📈</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Career Progression</h3>
              <p className="text-gray-600">
                Many retail managers started part-time. Build skills and experience that lead to senior management roles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Job Board */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest Part-Time Retail Jobs</h2>
            <p className="text-xl text-gray-500">Browse current retail opportunities</p>
          </div>
          <EmbeddedJobBoard
            defaultDepartment="Operations"
            title="Part-Time Retail Jobs"
            jobsPerPage={6}
            showAllJobsLink={true}
            allJobsLinkText="View All Retail Jobs"
          />
        </div>
      </section>

      {/* Skills */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">In-Demand Retail Skills</h2>
            <p className="text-xl text-gray-500">Skills employers look for in part-time retail candidates</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {retailSkills.map((skill, i) => (
              <span key={i} className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm font-medium hover:bg-pink-100 transition-colors">
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Part-Time Retail Jobs FAQ</h2>
          </div>

          <div className="space-y-6">
            <details className="group bg-white rounded-xl p-6 cursor-pointer border border-gray-200">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                What part-time retail jobs pay the best?
                <span className="text-gray-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Management roles typically pay the highest rates. Part-time Store Managers earn £12-18/hour, while Retail Directors and Operations Managers command £300-900/day. E-commerce and merchandising roles also offer premium rates due to specialist skills required.
              </p>
            </details>

            <details className="group bg-white rounded-xl p-6 cursor-pointer border border-gray-200">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                How many hours is part-time retail?
                <span className="text-gray-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Part-time retail jobs typically range from 8-30 hours per week. Many positions offer flexibility in scheduling, with options for weekday-only, weekend-only, or mixed shifts. Some senior roles may be 2-3 days per week.
              </p>
            </details>

            <details className="group bg-white rounded-xl p-6 cursor-pointer border border-gray-200">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                Can I find part-time retail jobs near me?
                <span className="text-gray-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Yes! Retail jobs are available in most UK towns and cities. High streets, shopping centres, retail parks, and local stores all hire part-time staff. Use location filters on our job board to find opportunities in your area.
              </p>
            </details>

            <details className="group bg-white rounded-xl p-6 cursor-pointer border border-gray-200">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                What experience do I need for part-time retail management?
                <span className="text-gray-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Entry-level retail positions often require no experience. For management roles, 2-5 years of retail experience is typical. Senior positions like Retail Director may require 10+ years including P&L responsibility and multi-site management.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Related Searches */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Related Searches</h3>
          <div className="flex flex-wrap gap-3">
            {relatedSearches.map((search, i) => (
              <Link
                key={i}
                href={`/part-time-jobs?q=${encodeURIComponent(search)}`}
                className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm hover:bg-pink-100 hover:text-pink-800 transition-colors"
              >
                {search}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Find Part-Time Retail Jobs Today
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Browse hundreds of part-time retail opportunities across the UK
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/part-time-jobs"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-lg bg-pink-500 text-white hover:bg-pink-400 transition-all duration-200"
            >
              Browse All Jobs →
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
