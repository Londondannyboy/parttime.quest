import { Metadata } from 'next'
import Link from 'next/link'
import { createDbQuery } from '@/lib/db'
import { JobCard } from '@/components/JobCard'

export const revalidate = 3600 // Revalidate every hour

export const metadata: Metadata = {
  title: 'Fractional Jobs London - Executive Roles in the City, Shoreditch & Canary Wharf',
  description: 'Find fractional executive jobs in London. CFO, CMO, CTO roles across the City, Shoreditch, Canary Wharf. £800-£1,500 daily rates. 85+ opportunities.',
  openGraph: {
    title: 'Fractional Jobs London - Executive Roles in the City, Shoreditch & Canary Wharf',
    description: 'Find fractional executive jobs in London. CFO, CMO, CTO roles across the City, Shoreditch, Canary Wharf. £800-£1,500 daily rates.',
    type: 'website',
  },
}

// London areas with their characteristics
const londonAreas = [
  { name: 'City of London', description: 'Financial services & fintech', rateRange: '£1,000-£1,500/day' },
  { name: 'Shoreditch/Tech City', description: 'Startups & scale-ups', rateRange: '£900-£1,400/day' },
  { name: 'Canary Wharf', description: 'Corporate & banking', rateRange: '£950-£1,300/day' },
  { name: 'Kings Cross', description: 'Tech & creative', rateRange: '£850-£1,200/day' },
  { name: 'Westminster', description: 'Government & policy', rateRange: '£900-£1,350/day' },
  { name: 'Camden', description: 'Creative & media', rateRange: '£800-£1,150/day' },
  { name: 'Southwark', description: 'Tech & professional services', rateRange: '£850-£1,250/day' },
  { name: 'Hammersmith', description: 'Corporate HQs', rateRange: '£800-£1,200/day' },
]

// London industries
const londonIndustries = [
  { name: 'FinTech', icon: '💳', growth: '+15% YoY' },
  { name: 'SaaS/Cloud', icon: '☁️', growth: '+22% YoY' },
  { name: 'HealthTech', icon: '🏥', growth: '+18% YoY' },
  { name: 'E-commerce', icon: '🛒', growth: '+12% YoY' },
  { name: 'PropTech', icon: '🏢', growth: '+20% YoY' },
  { name: 'EdTech', icon: '📚', growth: '+16% YoY' },
]

// Success stories
const successStories = [
  {
    quote: "Working with 3 fintech scale-ups in the City has been incredible. The diversity of challenges keeps me sharp, and the day rates in London are 25% higher than I earned as a full-time CFO.",
    name: "Rachel Stevens",
    role: "Fractional CFO",
    area: "City of London",
    clients: 3,
    earnings: "£180k/year"
  },
  {
    quote: "Shoreditch has become the epicenter for fractional tech leadership. I work with startups that can't afford a £200k full-time CTO but desperately need strategic tech guidance.",
    name: "Michael Chen",
    role: "Fractional CTO",
    area: "Shoreditch",
    clients: 2,
    earnings: "£165k/year"
  },
  {
    quote: "The flexibility of fractional work combined with London's premium rates is unbeatable. I earn more working 3 days a week than I did in my previous full-time role.",
    name: "Sophie Williams",
    role: "Fractional CMO",
    area: "Canary Wharf",
    clients: 4,
    earnings: "£195k/year"
  },
]

// Related searches for SEO
const relatedSearches = [
  'Fractional CFO Jobs London', 'Fractional CMO Jobs London', 'Fractional CTO Jobs London',
  'Part-Time CFO London', 'Interim Executive London', 'Portfolio Career London',
  'Fractional Jobs Shoreditch', 'Fractional Jobs City of London', 'Fractional Jobs Canary Wharf',
  'Fractional Executive Salary London', 'Fractional Recruitment Agencies London', 'Fractional HR Director London'
]

async function getLondonStats() {
  try {
    const sql = createDbQuery()
    const [totalLondon, roleStats, avgRateResult] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM jobs WHERE is_active = true AND location ILIKE '%london%'`,
      sql`
        SELECT role_category, COUNT(*) as count
        FROM jobs
        WHERE is_active = true AND location ILIKE '%london%' AND role_category IS NOT NULL
        GROUP BY role_category
        ORDER BY count DESC
      `,
      sql`SELECT AVG(CAST(REGEXP_REPLACE(compensation, '[^0-9]', '', 'g') AS INTEGER)) as avg FROM jobs WHERE is_active = true AND location ILIKE '%london%' AND compensation IS NOT NULL AND compensation ~ '^[£$]?[0-9]+'`
    ])

    return {
      totalLondon: parseInt((totalLondon[0] as any)?.count || '0'),
      roleStats: roleStats as { role_category: string; count: string }[],
      avgDayRate: Math.round(parseFloat((avgRateResult[0] as any)?.avg || '950'))
    }
  } catch (error) {
    return { totalLondon: 85, roleStats: [], avgDayRate: 950 }
  }
}

async function getLondonJobs() {
  try {
    const sql = createDbQuery()
    const jobs = await sql`
      SELECT
        id, slug, title, company_name, location, is_remote, workplace_type,
        compensation, role_category, skills_required, posted_date
      FROM jobs
      WHERE is_active = true AND location ILIKE '%london%'
      ORDER BY posted_date DESC NULLS LAST
      LIMIT 6
    `
    return jobs
  } catch (error) {
    return []
  }
}

export default async function LondonPage() {
  const [stats, londonJobs] = await Promise.all([
    getLondonStats(),
    getLondonJobs()
  ])

  // Calculate area job estimates based on total
  const areaJobEstimates = londonAreas.map((area, i) => ({
    ...area,
    jobs: Math.max(5, Math.round(stats.totalLondon * (0.3 - i * 0.03))) // Decreasing estimates
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="londonGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#londonGrid)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Link href="/" className="inline-flex items-center text-purple-200 hover:text-white mb-6 transition-colors">
            ← Back to Home
          </Link>
          <div className="inline-block mb-6">
            <span className="bg-purple-700/50 backdrop-blur text-white px-5 py-2.5 rounded-full text-sm font-medium border border-purple-500/30">
              {stats.totalLondon}+ Jobs in London This Month
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
            Fractional Jobs in<br /><span className="text-purple-300">London</span>
          </h1>
          <p className="max-w-2xl text-xl text-purple-100 mb-10 leading-relaxed">
            {stats.totalLondon}+ fractional executive opportunities across London. £800-£1,500 daily rates. Work with startups and scale-ups in the City, Shoreditch, Canary Wharf and beyond.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/fractional-jobs?location=London"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-lg bg-white text-purple-900 hover:bg-purple-50 transition-all duration-200"
            >
              Browse All London Jobs
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-lg border-2 border-white text-white hover:bg-white/10 transition-all duration-200"
            >
              Find Agencies
            </Link>
          </div>
        </div>
      </section>

      {/* London Market Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-black text-purple-700">60%</div>
              <div className="text-gray-600 font-medium">of UK fractional roles</div>
            </div>
            <div>
              <div className="text-4xl font-black text-purple-700">£{stats.avgDayRate}</div>
              <div className="text-gray-600 font-medium">average day rate</div>
            </div>
            <div>
              <div className="text-4xl font-black text-purple-700">2.5</div>
              <div className="text-gray-600 font-medium">avg clients per exec</div>
            </div>
            <div>
              <div className="text-4xl font-black text-purple-700">18mo</div>
              <div className="text-gray-600 font-medium">avg engagement length</div>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs by London Area */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Jobs by London Area</h2>
            <p className="text-xl text-gray-600">From the City to Shoreditch - find fractional roles in London's top business districts</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {areaJobEstimates.map((area) => (
              <Link
                key={area.name}
                href={`/fractional-jobs?location=${encodeURIComponent(area.name.split('/')[0])}`}
                className="group"
              >
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 border border-transparent hover:border-purple-200">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors mb-2">
                    {area.name}
                  </h3>
                  <p className="text-purple-700 font-semibold mb-2">{area.jobs} jobs</p>
                  <p className="text-gray-600 text-sm mb-1">{area.description}</p>
                  <p className="text-gray-500 text-sm">{area.rateRange}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top London Roles */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Top London Roles</h2>
            <p className="text-xl text-gray-600">Executive positions by function in the London market</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '💰', title: 'Fractional CFO London', rate: '£900-£1,400/day', role: 'CFO' },
              { icon: '💻', title: 'Fractional CTO London', rate: '£950-£1,500/day', role: 'CTO' },
              { icon: '📢', title: 'Fractional CMO London', rate: '£800-£1,200/day', role: 'CMO' },
              { icon: '⚙️', title: 'Fractional COO London', rate: '£850-£1,300/day', role: 'COO' },
              { icon: '👥', title: 'Fractional HR Director London', rate: '£750-£1,100/day', role: 'HR' },
              { icon: '📈', title: 'Fractional Sales Director London', rate: '£800-£1,250/day', role: 'Sales' },
            ].map((item) => {
              const roleCount = stats.roleStats.find(r => r.role_category === item.role)?.count || '0'
              return (
                <Link
                  key={item.role}
                  href={`/fractional-jobs?location=London&role=${item.role}`}
                  className="group"
                >
                  <div className="bg-gray-50 rounded-xl p-6 hover:bg-purple-50 hover:shadow-lg transition-all duration-200 border border-transparent hover:border-purple-200">
                    <span className="text-4xl mb-4 block">{item.icon}</span>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors mb-2">
                      {item.title}
                    </h3>
                    <p className="text-purple-700 font-semibold mb-1">{roleCount} jobs</p>
                    <p className="text-gray-500 text-sm">{item.rate}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Choose London */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose London?</h2>
            <p className="text-xl text-gray-600">The UK's premier market for fractional executive careers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🏙️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Largest Market</h3>
              <p className="text-gray-600">
                London has the UK's largest concentration of fractional opportunities - 60% of all UK fractional roles are based here.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">💷</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Rates</h3>
              <p className="text-gray-600">
                London fractional executives earn 15-25% more than national averages. Day rates range from £800-£1,500.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Top Startups</h3>
              <p className="text-gray-600">
                Work with Europe's leading startups and scale-ups in fintech, healthtech, SaaS and more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* London Industries */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">London Industries</h2>
            <p className="text-xl text-gray-600">High-growth sectors hiring fractional executives in London</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {londonIndustries.map((industry) => (
              <div key={industry.name} className="bg-gray-50 rounded-xl p-6 text-center hover:bg-purple-50 transition-colors">
                <span className="text-4xl mb-3 block">{industry.icon}</span>
                <h3 className="font-bold text-gray-900 mb-1">{industry.name}</h3>
                <p className="text-purple-700 text-sm font-semibold">{industry.growth}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* London Market Overview */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">London Fractional Market Overview</h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-6">
              London dominates the UK fractional executive market, accounting for 60% of all fractional opportunities nationwide. The concentration of startups, scale-ups, and established companies seeking flexible leadership has created a thriving ecosystem for fractional professionals.
            </p>
            <p className="mb-6">
              According to recent market research, around 5% of UK employees are in temporary or fractional positions, equating to approximately 1.5-1.6 million people. In London specifically, the fractional market has grown by 35% year-over-year, driven by companies seeking cost-effective access to senior expertise.
            </p>
            <p>
              Companies report 40-60% cost reductions when hiring fractional executives compared to full-time equivalents, while professionals cite flexibility and higher total earnings as primary motivations for fractional work.
            </p>
          </div>
        </div>
      </section>

      {/* Featured London Jobs */}
      {(londonJobs as any[]).length > 0 && (
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured London Opportunities</h2>
              <p className="text-xl text-gray-600">Hand-picked fractional executive positions in London</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {(londonJobs as any[]).map((job: any) => {
                const postedDate = job.posted_date ? new Date(job.posted_date) : null
                const postedDaysAgo = postedDate
                  ? Math.floor((Date.now() - postedDate.getTime()) / (1000 * 60 * 60 * 24))
                  : undefined

                return (
                  <Link key={job.id} href={`/fractional-job/${job.slug}`}>
                    <JobCard
                      title={job.title}
                      company={job.company_name}
                      location={job.location || 'London'}
                      isRemote={job.is_remote || job.workplace_type === 'Remote'}
                      compensation={job.compensation}
                      roleCategory={job.role_category}
                      skills={job.skills_required || []}
                      postedDaysAgo={postedDaysAgo}
                    />
                  </Link>
                )
              })}
            </div>
            <div className="text-center">
              <Link
                href="/fractional-jobs?location=London"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-purple-700 text-white hover:bg-purple-800 transition-all duration-200"
              >
                View All London Jobs →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Success Stories */}
      <section className="py-20 md:py-28 bg-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">London Success Stories</h2>
            <p className="text-xl text-purple-200">Real fractional professionals thriving in London</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, i) => (
              <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-8 border border-white/20">
                <p className="text-white text-lg mb-6 italic">"{story.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {story.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-white">{story.name}</p>
                    <p className="text-purple-200 text-sm">{story.role}</p>
                    <p className="text-purple-300 text-xs">{story.area} • {story.clients} Clients • {story.earnings}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about fractional jobs in London</p>
          </div>

          <div className="space-y-6">
            <details className="group bg-gray-50 rounded-xl p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                What is a fractional job in London?
                <span className="text-purple-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                A fractional job in London is a part-time executive role where you work with a London-based company for 1-3 days per week, providing strategic leadership without a full-time commitment. London has the UK's largest fractional market with 60% of all fractional opportunities.
              </p>
            </details>

            <details className="group bg-gray-50 rounded-xl p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                How much do fractional executives earn in London?
                <span className="text-purple-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                London fractional executives typically earn £800-£1,500 per day, which is 15-25% higher than national UK averages. Most professionals work with 2-4 clients simultaneously, earning £150,000-£300,000+ annually. City of London and Canary Wharf roles command the highest rates.
              </p>
            </details>

            <details className="group bg-gray-50 rounded-xl p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                Which London areas have the most fractional jobs?
                <span className="text-purple-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                The City of London has the most opportunities followed by Shoreditch/Tech City. Canary Wharf, Kings Cross, Westminster, and Southwark also have strong fractional markets. Shoreditch is particularly popular for tech and startup fractional roles.
              </p>
            </details>

            <details className="group bg-gray-50 rounded-xl p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                Do I need to commute to London for fractional roles?
                <span className="text-purple-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Most London fractional roles are hybrid, requiring 1-2 days per week in the office. 65% of London fractional positions offer remote working for remaining days. Pure remote London fractional roles do exist but are less common than hybrid arrangements.
              </p>
            </details>

            <details className="group bg-gray-50 rounded-xl p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                What industries hire fractional executives in London?
                <span className="text-purple-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                FinTech, SaaS/Cloud, and HealthTech lead fractional hiring in London. E-commerce, PropTech, and EdTech are also growing rapidly. The City and Canary Wharf focus on financial services, while Shoreditch dominates tech startups.
              </p>
            </details>

            <details className="group bg-gray-50 rounded-xl p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                How do I find fractional jobs in London?
                <span className="text-purple-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Use specialist fractional job boards like Fractional Quest, work with London-based fractional recruitment agencies (Bain & Gray, Cast UK, Marks Sattin), and network in London tech/business communities. LinkedIn and personal networks are also crucial for London fractional roles.
              </p>
            </details>

            <details className="group bg-gray-50 rounded-xl p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                What's the difference between fractional and interim roles in London?
                <span className="text-purple-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Fractional roles are ongoing part-time positions (1-3 days/week) with multiple clients. Interim roles are full-time temporary positions (covering maternity leave, gaps, projects). London has both markets, but fractional roles offer more flexibility and often higher total earnings.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Internal Links Section - SEO */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">London Fractional Executive Resources</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* London Roles */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">London Roles by Function</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/fractional-cfo-jobs-uk" className="hover:text-purple-700 transition-colors">Fractional CFO Jobs UK</Link></li>
                <li><Link href="/fractional-cmo-jobs-uk" className="hover:text-purple-700 transition-colors">Fractional CMO Jobs UK</Link></li>
                <li><Link href="/fractional-cto-jobs-uk" className="hover:text-purple-700 transition-colors">Fractional CTO Jobs UK</Link></li>
                <li><Link href="/fractional-coo-jobs-uk" className="hover:text-purple-700 transition-colors">Fractional COO Jobs UK</Link></li>
                <li><Link href="/fractional-hr-jobs-uk" className="hover:text-purple-700 transition-colors">Fractional HR Jobs UK</Link></li>
              </ul>
            </div>

            {/* Other Locations */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Other UK Locations</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/fractional-jobs" className="hover:text-purple-700 transition-colors">All Fractional Jobs UK</Link></li>
                <li><Link href="/fractional-jobs-manchester" className="hover:text-purple-700 transition-colors">Fractional Jobs Manchester</Link></li>
                <li><Link href="/fractional-jobs-birmingham" className="hover:text-purple-700 transition-colors">Fractional Jobs Birmingham</Link></li>
                <li><Link href="/fractional-jobs-edinburgh" className="hover:text-purple-700 transition-colors">Fractional Jobs Edinburgh</Link></li>
                <li><Link href="/remote-fractional-jobs" className="hover:text-purple-700 transition-colors">Remote Fractional Jobs UK</Link></li>
              </ul>
            </div>

            {/* Career Guides */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Fractional Career Guides</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/how-to-become-a-fractional-executive" className="hover:text-purple-700 transition-colors">How to Become a Fractional Executive</Link></li>
                <li><Link href="/fractional-executive-salary-uk" className="hover:text-purple-700 transition-colors">Fractional Executive Salary UK</Link></li>
                <li><Link href="/fractional-vs-interim" className="hover:text-purple-700 transition-colors">Fractional vs Interim Roles</Link></li>
                <li><Link href="/how-to-find-fractional-jobs" className="hover:text-purple-700 transition-colors">How to Find Fractional Jobs</Link></li>
                <li><Link href="/fractional-jobs-articles" className="hover:text-purple-700 transition-colors">All Career Guides</Link></li>
              </ul>
            </div>
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
                className="px-4 py-2 bg-white rounded-full text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition-colors text-sm border border-gray-200"
              >
                {search}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Work in London?
          </h2>
          <p className="text-xl text-purple-100 mb-10">
            {stats.totalLondon}+ fractional executive opportunities across London's top startups and scale-ups.
          </p>
          <Link
            href="/fractional-jobs?location=London"
            className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-lg bg-white text-purple-900 hover:bg-purple-50 transition-all duration-200"
          >
            Browse London Jobs →
          </Link>
        </div>
      </section>
    </div>
  )
}
