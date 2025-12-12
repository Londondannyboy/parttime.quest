import { Metadata } from 'next'
import Link from 'next/link'
import { createDbQuery } from '@/lib/db'
import { JobCard } from '@/components/JobCard'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Fractional Jobs Birmingham - Executive Roles in the West Midlands',
  description: 'Find fractional executive jobs in Birmingham. CFO, CMO, CTO roles across the West Midlands. £650-£1,100 daily rates. Growing fractional market.',
  openGraph: {
    title: 'Fractional Jobs Birmingham - Executive Roles in the West Midlands',
    description: 'Find fractional executive jobs in Birmingham and the West Midlands region.',
    type: 'website',
  },
}

const birminghamAreas = [
  { name: 'Birmingham City Centre', description: 'Professional services & finance', rateRange: '£700-£1,100/day' },
  { name: 'Jewellery Quarter', description: 'Creative & tech startups', rateRange: '£650-£1,000/day' },
  { name: 'Digbeth', description: 'Digital & creative industries', rateRange: '£600-£950/day' },
  { name: 'Edgbaston', description: 'Healthcare & professional', rateRange: '£650-£1,050/day' },
  { name: 'Solihull', description: 'Corporate & manufacturing', rateRange: '£700-£1,100/day' },
  { name: 'Coventry', description: 'Automotive & engineering', rateRange: '£650-£1,000/day' },
]

const birminghamIndustries = [
  { name: 'FinTech', icon: '💳', growth: '+12% YoY' },
  { name: 'Manufacturing', icon: '🏭', growth: '+8% YoY' },
  { name: 'Healthcare', icon: '🏥', growth: '+15% YoY' },
  { name: 'Automotive', icon: '🚗', growth: '+10% YoY' },
  { name: 'Professional Services', icon: '💼', growth: '+14% YoY' },
  { name: 'Logistics', icon: '📦', growth: '+11% YoY' },
]

const relatedSearches = [
  'Fractional CFO Jobs Birmingham', 'Fractional CMO Jobs Birmingham', 'Fractional CTO Jobs West Midlands',
  'Part-Time CFO Birmingham', 'Interim Executive Birmingham', 'Portfolio Career Birmingham',
  'Fractional Jobs Solihull', 'Fractional Jobs Coventry', 'Fractional Executive Salary Birmingham'
]

async function getBirminghamStats() {
  try {
    const sql = createDbQuery()
    const [total, avgRateResult] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM jobs WHERE is_active = true AND (location ILIKE '%birmingham%' OR location ILIKE '%west midlands%')`,
      sql`SELECT AVG(CAST(REGEXP_REPLACE(compensation, '[^0-9]', '', 'g') AS INTEGER)) as avg FROM jobs WHERE is_active = true AND (location ILIKE '%birmingham%' OR location ILIKE '%west midlands%') AND compensation IS NOT NULL AND compensation ~ '^[£$]?[0-9]+'`
    ])
    return {
      total: parseInt((total[0] as any)?.count || '0'),
      avgDayRate: Math.round(parseFloat((avgRateResult[0] as any)?.avg || '850'))
    }
  } catch (error) {
    return { total: 25, avgDayRate: 850 }
  }
}

async function getBirminghamJobs() {
  try {
    const sql = createDbQuery()
    const jobs = await sql`
      SELECT id, slug, title, company_name, location, is_remote, workplace_type,
        compensation, role_category, skills_required, posted_date
      FROM jobs
      WHERE is_active = true AND (location ILIKE '%birmingham%' OR location ILIKE '%west midlands%')
      ORDER BY posted_date DESC NULLS LAST
      LIMIT 6
    `
    return jobs
  } catch (error) {
    return []
  }
}

export default async function BirminghamPage() {
  const [stats, jobs] = await Promise.all([getBirminghamStats(), getBirminghamJobs()])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="birminghamGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#birminghamGrid)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Link href="/" className="inline-flex items-center text-purple-200 hover:text-white mb-6 transition-colors">
            ← Back to Home
          </Link>
          <div className="inline-block mb-6">
            <span className="bg-purple-700/50 backdrop-blur text-white px-5 py-2.5 rounded-full text-sm font-medium border border-purple-500/30">
              {stats.total}+ Jobs in Birmingham
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
            Fractional Jobs Birmingham</h1>
          <img src="/logo.svg" alt="Fractional Jobs Birmingham - Executive roles in the Midlands" className="hidden" width={1} height={1} />
          
          <p className="max-w-2xl text-xl text-purple-100 mb-10 leading-relaxed">
            {stats.total}+ fractional executive opportunities across Birmingham and the West Midlands. £650-£1,100 daily rates. The UK's second city for fractional careers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/fractional-jobs?location=Birmingham"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-lg bg-white text-purple-900 hover:bg-purple-50 transition-all duration-200"
            >
              Browse Birmingham Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-black text-purple-700">15%</div>
              <div className="text-gray-600 font-medium">of UK fractional roles</div>
            </div>
            <div>
              <div className="text-4xl font-black text-purple-700">£{stats.avgDayRate}</div>
              <div className="text-gray-600 font-medium">average day rate</div>
            </div>
            <div>
              <div className="text-4xl font-black text-purple-700">2nd</div>
              <div className="text-gray-600 font-medium">largest UK market</div>
            </div>
            <div>
              <div className="text-4xl font-black text-purple-700">+18%</div>
              <div className="text-gray-600 font-medium">YoY market growth</div>
            </div>
          </div>
        </div>
      </section>

      {/* Areas */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Jobs by Birmingham Area</h2>
            <p className="text-xl text-gray-600">Find fractional roles across the West Midlands</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {birminghamAreas.map((area) => (
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Birmingham Industries</h2>
            <p className="text-xl text-gray-600">Key sectors hiring fractional executives</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {birminghamIndustries.map((industry) => (
              <div key={industry.name} className="bg-gray-50 rounded-xl p-6 text-center">
                <span className="text-4xl mb-3 block">{industry.icon}</span>
                <h3 className="font-bold text-gray-900 mb-1">{industry.name}</h3>
                <p className="text-purple-700 text-sm font-semibold">{industry.growth}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Birmingham */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Birmingham?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🚄</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Central Location</h3>
              <p className="text-gray-600">
                1hr 20min to London, excellent transport links. Work with London clients while based in Birmingham.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lower Cost of Living</h3>
              <p className="text-gray-600">
                Competitive day rates with significantly lower living costs than London. Better work-life balance.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">📈</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Growing Market</h3>
              <p className="text-gray-600">
                18% YoY growth in fractional roles. HS2 and city regeneration driving demand for senior talent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      {(jobs as any[]).length > 0 && (
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Featured Birmingham Jobs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {(jobs as any[]).map((job: any) => (
                <Link key={job.id} href={`/fractional-job/${job.slug}`}>
                  <JobCard
                    title={job.title}
                    company={job.company_name}
                    location={job.location || 'Birmingham'}
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
                href="/fractional-jobs?location=Birmingham"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-purple-700 text-white hover:bg-purple-800 transition-all"
              >
                View All Birmingham Jobs →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Birmingham FAQs</h2>
          <div className="space-y-6">
            <details className="group bg-white rounded-xl p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                How much do fractional executives earn in Birmingham?
                <span className="text-purple-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Birmingham fractional executives typically earn £650-£1,100 per day. While slightly lower than London rates, the lower cost of living means comparable or better purchasing power.
              </p>
            </details>
            <details className="group bg-white rounded-xl p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                What industries hire fractional executives in Birmingham?
                <span className="text-purple-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Manufacturing, automotive, professional services, and FinTech lead fractional hiring in Birmingham. The city's industrial heritage combined with growing tech sector creates diverse opportunities.
              </p>
            </details>
            <details className="group bg-white rounded-xl p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                Can I work remotely from Birmingham for London clients?
                <span className="text-purple-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Yes, many Birmingham-based fractional executives work with London clients. The 1hr 20min train journey makes hybrid arrangements practical, while remote work is increasingly common.
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
            Ready to Work in Birmingham?
          </h2>
          <p className="text-xl text-purple-100 mb-10">
            {stats.total}+ fractional opportunities in the UK's second city
          </p>
          <Link
            href="/fractional-jobs?location=Birmingham"
            className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-lg bg-white text-purple-900 hover:bg-purple-50 transition-all"
          >
            Browse Birmingham Jobs →
          </Link>
        </div>
      </section>
    </div>
  )
}
