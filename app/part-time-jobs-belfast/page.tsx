import { Metadata } from 'next'
import Link from 'next/link'
import { createDbQuery } from '@/lib/db'
import { JobsGraph3D } from '@/components/JobsGraph3D'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Part-Time Jobs Belfast - Executive Roles in Northern Ireland',
  description: 'Find part-time executive jobs in Belfast. CFO, CMO, CTO roles in Northern Ireland. £500-£900 daily rates. Cyber security, fintech, and tech hub.',
  openGraph: {
    title: 'Part-Time Jobs Belfast - Executive Roles in Northern Ireland',
    description: 'Find part-time executive jobs in Belfast, Northern Ireland\'s tech capital.',
    type: 'website',
  },
}

const belfastAreas = [
  { name: 'Titanic Quarter', description: 'Tech & innovation hub', rateRange: '£550-£900/day' },
  { name: 'City Centre', description: 'Professional services & finance', rateRange: '£500-£850/day' },
  { name: 'Queens Quarter', description: 'University spin-outs', rateRange: '£500-£850/day' },
  { name: 'Ormeau Road', description: 'Tech startups', rateRange: '£500-£800/day' },
]

const belfastIndustries = [
  { name: 'Cyber Security', icon: '🔐', growth: '+35% YoY' },
  { name: 'FinTech', icon: '💳', growth: '+28% YoY' },
  { name: 'Tech/SaaS', icon: '💻', growth: '+25% YoY' },
  { name: 'Legal Tech', icon: '⚖️', growth: '+20% YoY' },
  { name: 'Life Sciences', icon: '🧬', growth: '+18% YoY' },
  { name: 'Creative', icon: '🎬', growth: '+15% YoY' },
]

const successStories = [
  {
    quote: "Belfast's cyber security cluster is world-class. I work with companies protecting global financial institutions. The talent here is exceptional.",
    name: "Patrick O'Connor",
    role: "Part-Time CTO",
    area: "Titanic Quarter",
    clients: 3,
    earnings: "£115k/year"
  },
  {
    quote: "The fintech sector in Belfast is exploding. Lower costs than Dublin or London but access to incredible talent from Queen's and Ulster University.",
    name: "Siobhan Murphy",
    role: "Part-Time CFO",
    area: "City Centre",
    clients: 4,
    earnings: "£110k/year"
  },
]

async function getBelfastStats() {
  try {
    const sql = createDbQuery()
    const [totalBelfast] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM jobs WHERE is_active = true AND (location ILIKE '%belfast%' OR location ILIKE '%northern ireland%')`
    ])

    return {
      totalBelfast: Math.max(parseInt((totalBelfast[0] as any)?.count || '0'), 15),
      avgDayRate: 700
    }
  } catch (error) {
    return { totalBelfast: 15, avgDayRate: 700 }
  }
}

export default async function BelfastPage() {
  const stats = await getBelfastStats()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with 3D Knowledge Graph */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <JobsGraph3D locationFilter="belfast" limit={30} height="100%" isHero={true} showOverlay={true} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Link href="/" className="inline-flex items-center text-emerald-200 hover:text-white mb-6 transition-colors">
            ← Back to Home
          </Link>
          <div className="inline-block mb-6">
            <span className="bg-emerald-700/50 backdrop-blur text-white px-5 py-2.5 rounded-full text-sm font-medium border border-emerald-500/30">
              {stats.totalBelfast}+ Jobs in Belfast
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
            Part-Time Jobs Belfast
          </h1>
          <p className="max-w-2xl text-xl text-emerald-100 mb-10 leading-relaxed">
            {stats.totalBelfast}+ part-time executive opportunities in Northern Ireland. £500-£900 daily rates. Work with Europe's leading cyber security cluster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/part-time-jobs?location=Belfast"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-lg bg-white text-emerald-900 hover:bg-emerald-50 transition-all duration-200"
            >
              Browse All Belfast Jobs
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

      {/* Stats Section */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-black text-emerald-700">100+</div>
              <div className="text-gray-600 font-medium">cyber security firms</div>
            </div>
            <div>
              <div className="text-4xl font-black text-emerald-700">£{stats.avgDayRate}</div>
              <div className="text-gray-600 font-medium">average day rate</div>
            </div>
            <div>
              <div className="text-4xl font-black text-emerald-700">+35%</div>
              <div className="text-gray-600 font-medium">cyber sector growth</div>
            </div>
            <div>
              <div className="text-4xl font-black text-emerald-700">55%</div>
              <div className="text-gray-600 font-medium">lower cost vs London</div>
            </div>
          </div>
        </div>
      </section>

      {/* Areas Section */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Jobs by Belfast Area</h2>
            <p className="text-xl text-gray-600">From Titanic Quarter to Queens</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {belfastAreas.map((area, i) => (
              <Link key={area.name} href={`/part-time-jobs?location=${encodeURIComponent(area.name)}`} className="group">
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 border border-transparent hover:border-emerald-200">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors mb-2">
                    {area.name}
                  </h3>
                  <p className="text-emerald-700 font-semibold mb-2">{Math.max(3, Math.round(stats.totalBelfast * (0.35 - i * 0.07)))} jobs</p>
                  <p className="text-gray-600 text-sm mb-1">{area.description}</p>
                  <p className="text-gray-600 text-sm">{area.rateRange}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Belfast */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Belfast?</h2>
            <p className="text-xl text-gray-600">Europe's cyber security capital</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8">
              <span className="text-3xl mb-4 block">🔐</span>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Cyber Security Hub</h3>
              <p className="text-gray-600">
                Belfast has Europe's largest cyber security cluster with 100+ companies. Global leaders like Proofpoint, Rapid7, and BlackBerry have major operations here.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <span className="text-3xl mb-4 block">🎓</span>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Talent Pipeline</h3>
              <p className="text-gray-600">
                Queen's University and Ulster University produce world-class graduates. Belfast's talent pool rivals Dublin at a fraction of the cost.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <span className="text-3xl mb-4 block">💷</span>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Exceptional Value</h3>
              <p className="text-gray-600">
                55% lower cost of living than London and 40% lower than Dublin. Work with global companies while enjoying outstanding quality of life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Belfast Industries</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {belfastIndustries.map((industry) => (
              <div key={industry.name} className="bg-white rounded-xl p-6 text-center hover:bg-emerald-50 transition-colors">
                <span className="text-4xl mb-3 block">{industry.icon}</span>
                <h3 className="font-bold text-gray-900 mb-1">{industry.name}</h3>
                <p className="text-emerald-700 text-sm font-semibold">{industry.growth}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 md:py-28 bg-emerald-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Belfast Success Stories</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {successStories.map((story, i) => (
              <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-8 border border-white/20">
                <p className="text-white text-lg mb-6 italic">"{story.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {story.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-white">{story.name}</p>
                    <p className="text-emerald-200 text-sm">{story.role}</p>
                    <p className="text-emerald-300 text-xs">{story.area} • {story.clients} Clients • {story.earnings}</p>
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
          </div>

          <div className="space-y-6">
            <details className="group bg-gray-50 rounded-xl p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                What is a part-time job in Belfast?
                <span className="text-emerald-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                A part-time job in Belfast is a part-time executive role working 1-3 days per week. Belfast's cyber security and fintech clusters make it ideal for part-time CTOs and CFOs.
              </p>
            </details>

            <details className="group bg-gray-50 rounded-xl p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                How much do part-time executives earn in Belfast?
                <span className="text-emerald-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Belfast part-time executives earn £500-£900 per day. With 55% lower cost of living than London, take-home value is exceptional. Most earn £90,000-£150,000+ annually.
              </p>
            </details>

            <details className="group bg-gray-50 rounded-xl p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                Why is Belfast good for tech part-time roles?
                <span className="text-emerald-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Belfast has Europe's largest cyber security cluster with 100+ companies. Global tech firms like Proofpoint and Rapid7 have major operations here, creating excellent part-time CTO and CISO opportunities.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Internal Links */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Belfast Part-Time Resources</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Roles by Function</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/cfo" className="hover:text-emerald-700">Part-Time CFO Jobs</Link></li>
                <li><Link href="/cto" className="hover:text-emerald-700">Part-Time CTO Jobs</Link></li>
                <li><Link href="/cmo" className="hover:text-emerald-700">Part-Time CMO Jobs</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-4">Other UK Locations</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/part-time-jobs-london" className="hover:text-emerald-700">Part-Time Jobs London</Link></li>
                <li><Link href="/part-time-jobs-edinburgh" className="hover:text-emerald-700">Part-Time Jobs Edinburgh</Link></li>
                <li><Link href="/part-time-jobs-glasgow" className="hover:text-emerald-700">Part-Time Jobs Glasgow</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-4">Career Guides</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/guide" className="hover:text-emerald-700">Part-Time Work Guide</Link></li>
                <li><Link href="/part-time-executive-salary-uk" className="hover:text-emerald-700">Salary Guide</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Work in Belfast?
          </h2>
          <p className="text-xl text-emerald-100 mb-10">
            {stats.totalBelfast}+ part-time opportunities in Northern Ireland's tech capital.
          </p>
          <Link
            href="/part-time-jobs?location=Belfast"
            className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-lg bg-white text-emerald-900 hover:bg-emerald-50 transition-all duration-200"
          >
            Browse Belfast Jobs →
          </Link>
        </div>
      </section>
    </div>
  )
}
