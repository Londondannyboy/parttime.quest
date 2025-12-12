import { Metadata } from 'next'
import Link from 'next/link'
import { createDbQuery } from '@/lib/db'
import { JobCard } from '@/components/JobCard'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Fractional Jobs Manchester - Executive Roles in the North West',
  description: 'Find fractional executive jobs in Manchester. CFO, CMO, CTO roles across Greater Manchester. £700-£1,200 daily rates. Tech, media, and finance hub.',
  openGraph: {
    title: 'Fractional Jobs Manchester - Executive Roles in the North West',
    description: 'Find fractional executive jobs in Manchester and Greater Manchester.',
    type: 'website',
  },
}

const manchesterAreas = [
  { name: 'Manchester City Centre', description: 'Professional services & FinTech', rateRange: '£750-£1,200/day' },
  { name: 'MediaCityUK/Salford', description: 'Media & broadcasting', rateRange: '£700-£1,100/day' },
  { name: 'Spinningfields', description: 'Financial & legal services', rateRange: '£800-£1,200/day' },
  { name: 'Northern Quarter', description: 'Creative & digital', rateRange: '£650-£1,000/day' },
  { name: 'Airport City', description: 'Corporate & logistics', rateRange: '£700-£1,050/day' },
  { name: 'Liverpool', description: 'Maritime & creative', rateRange: '£650-£1,000/day' },
]

const manchesterIndustries = [
  { name: 'Tech/Digital', icon: '💻', growth: '+25% YoY' },
  { name: 'Media', icon: '📺', growth: '+18% YoY' },
  { name: 'FinTech', icon: '💳', growth: '+20% YoY' },
  { name: 'E-commerce', icon: '🛒', growth: '+22% YoY' },
  { name: 'Healthcare', icon: '🏥', growth: '+15% YoY' },
  { name: 'Manufacturing', icon: '🏭', growth: '+8% YoY' },
]

const relatedSearches = [
  'Fractional CFO Jobs Manchester', 'Fractional CTO Jobs Manchester', 'Fractional CMO Jobs North West',
  'Part-Time CFO Manchester', 'Interim Executive Manchester', 'Portfolio Career Manchester',
  'Fractional Jobs MediaCity', 'Fractional Jobs Liverpool', 'Fractional Executive Salary Manchester'
]

async function getManchesterStats() {
  try {
    const sql = createDbQuery()
    const [total, avgRateResult] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM jobs WHERE is_active = true AND (location ILIKE '%manchester%' OR location ILIKE '%north west%' OR location ILIKE '%liverpool%')`,
      sql`SELECT AVG(CAST(REGEXP_REPLACE(compensation, '[^0-9]', '', 'g') AS INTEGER)) as avg FROM jobs WHERE is_active = true AND (location ILIKE '%manchester%' OR location ILIKE '%north west%') AND compensation IS NOT NULL AND compensation ~ '^[£$]?[0-9]+'`
    ])
    return {
      total: parseInt((total[0] as any)?.count || '0'),
      avgDayRate: Math.round(parseFloat((avgRateResult[0] as any)?.avg || '900'))
    }
  } catch (error) {
    return { total: 30, avgDayRate: 900 }
  }
}

async function getManchesterJobs() {
  try {
    const sql = createDbQuery()
    const jobs = await sql`
      SELECT id, slug, title, company_name, location, is_remote, workplace_type,
        compensation, role_category, skills_required, posted_date
      FROM jobs
      WHERE is_active = true AND (location ILIKE '%manchester%' OR location ILIKE '%north west%' OR location ILIKE '%liverpool%')
      ORDER BY posted_date DESC NULLS LAST
      LIMIT 6
    `
    return jobs
  } catch (error) {
    return []
  }
}

export default async function ManchesterPage() {
  const [stats, jobs] = await Promise.all([getManchesterStats(), getManchesterJobs()])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="manchesterGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#manchesterGrid)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Link href="/" className="inline-flex items-center text-purple-200 hover:text-white mb-6 transition-colors">
            ← Back to Home
          </Link>
          <div className="inline-block mb-6">
            <span className="bg-purple-700/50 backdrop-blur text-white px-5 py-2.5 rounded-full text-sm font-medium border border-purple-500/30">
              {stats.total}+ Jobs in Manchester
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
            Fractional Jobs Manchester
          </h1>
          <img src="/logo.svg" alt="Fractional Jobs Manchester - Executive roles in the North West" className="hidden" width={1} height={1} />
          <p className="max-w-2xl text-xl text-purple-100 mb-10 leading-relaxed">
            {stats.total}+ fractional executive opportunities across Manchester and the North West. £700-£1,200 daily rates. The UK's fastest-growing tech hub outside London.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/fractional-jobs?location=Manchester"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-lg bg-white text-purple-900 hover:bg-purple-50 transition-all duration-200"
            >
              Browse Manchester Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-black text-purple-700">12%</div>
              <div className="text-gray-600 font-medium">of UK fractional roles</div>
            </div>
            <div>
              <div className="text-4xl font-black text-purple-700">£{stats.avgDayRate}</div>
              <div className="text-gray-600 font-medium">average day rate</div>
            </div>
            <div>
              <div className="text-4xl font-black text-purple-700">3rd</div>
              <div className="text-gray-600 font-medium">largest UK market</div>
            </div>
            <div>
              <div className="text-4xl font-black text-purple-700">+25%</div>
              <div className="text-gray-600 font-medium">YoY market growth</div>
            </div>
          </div>
        </div>
      </section>

      {/* Areas */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Fractional Jobs Manchester by Area</h2>
            <p className="text-xl text-gray-600">Find fractional roles from the City to MediaCity</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {manchesterAreas.map((area) => (
              <div key={area.name} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{area.name}</h3>
                <p className="text-gray-600 text-sm mb-1">{area.description}</p>
                <p className="text-purple-700 font-semibold">{area.rateRange}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Manchester Industries</h2>
            <p className="text-xl text-gray-600">Key sectors hiring fractional executives</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {manchesterIndustries.map((industry) => (
              <div key={industry.name} className="bg-gray-50 rounded-xl p-6 text-center">
                <span className="text-4xl mb-3 block">{industry.icon}</span>
                <h3 className="font-bold text-gray-900 mb-1">{industry.name}</h3>
                <p className="text-purple-700 text-sm font-semibold">{industry.growth}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Manchester */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Manchester?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Tech Powerhouse</h3>
              <p className="text-gray-600">
                Manchester has the UK's largest tech ecosystem outside London. 25% YoY growth in fractional tech roles.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">📺</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Media Capital</h3>
              <p className="text-gray-600">
                MediaCityUK hosts BBC, ITV, and dozens of production companies. Perfect for fractional CMOs in media.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🚄</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Connected City</h3>
              <p className="text-gray-600">
                2hr to London, excellent Northern connections. Work with clients across the UK from Manchester.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs */}
      {(jobs as any[]).length > 0 && (
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Featured Manchester Jobs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {(jobs as any[]).map((job: any) => (
                <Link key={job.id} href={`/fractional-job/${job.slug}`}>
                  <JobCard
                    title={job.title}
                    company={job.company_name}
                    location={job.location || 'Manchester'}
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
                href="/fractional-jobs?location=Manchester"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-purple-700 text-white hover:bg-purple-800 transition-all"
              >
                View All Manchester Jobs →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Manchester FAQs</h2>
          <div className="space-y-6">
            <details className="group bg-white rounded-xl p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                How much do fractional executives earn in Manchester?
                <span className="text-purple-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Manchester fractional executives typically earn £700-£1,200 per day. Tech and FinTech roles command the highest rates, often approaching London levels for specialist expertise.
              </p>
            </details>
            <details className="group bg-white rounded-xl p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                Is Manchester the best city outside London for fractional work?
                <span className="text-purple-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Manchester is arguably the UK's best city for fractional work outside London. It has the largest tech ecosystem, fastest market growth (+25% YoY), and excellent rates. The combination of lower living costs and strong rates makes it highly attractive.
              </p>
            </details>
            <details className="group bg-white rounded-xl p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                What about MediaCityUK for fractional roles?
                <span className="text-purple-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">
                MediaCityUK in Salford is excellent for fractional CMOs, digital leaders, and creative executives. The BBC, ITV, and numerous production companies create strong demand for part-time marketing and tech leadership.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Related Searches */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Searches</h2>
          <div className="flex flex-wrap gap-3">
            {relatedSearches.map((search) => (
              <Link
                key={search}
                href={`/fractional-jobs?q=${encodeURIComponent(search)}`}
                className="px-4 py-2 bg-gray-50 rounded-full text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition-colors text-sm"
              >
                {search}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Work in Manchester?
          </h2>
          <p className="text-xl text-purple-100 mb-10">
            {stats.total}+ fractional opportunities across Manchester, MediaCity, and Liverpool
          </p>
          <Link
            href="/fractional-jobs?location=Manchester"
            className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-lg bg-white text-purple-900 hover:bg-purple-50 transition-all"
          >
            Browse Manchester Jobs →
          </Link>
        </div>
      </section>
    </div>
  )
}
