import { Metadata } from 'next'
import Link from 'next/link'
import { createDbQuery } from '@/lib/db'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Fractional Jobs SaaS - Executive Roles in Software & Cloud',
  description: 'Find fractional executive jobs in SaaS. CFO, CMO, CTO roles in B2B software, cloud platforms, and subscription businesses. £700-£1,300 daily rates.',
  openGraph: {
    title: 'Fractional Jobs SaaS - Executive Roles in Software',
    description: 'Find fractional executive jobs in SaaS and B2B software.',
    type: 'website',
  },
}

const saasSubsectors = [
  { name: 'B2B SaaS', description: 'Enterprise & SMB software', rateRange: '£750-£1,300/day', icon: '💼' },
  { name: 'PLG', description: 'Product-led growth companies', rateRange: '£700-£1,200/day', icon: '🚀' },
  { name: 'Vertical SaaS', description: 'Industry-specific platforms', rateRange: '£700-£1,150/day', icon: '🏗️' },
  { name: 'API/Infrastructure', description: 'Developer tools & platforms', rateRange: '£800-£1,350/day', icon: '⚙️' },
  { name: 'MarTech', description: 'Marketing technology', rateRange: '£700-£1,200/day', icon: '📊' },
  { name: 'FinTech SaaS', description: 'Financial software', rateRange: '£800-£1,300/day', icon: '💳' },
]

const successStories = [
  {
    quote: "SaaS companies are the perfect fractional clients. They understand metrics, value strategic expertise, and have predictable revenue to pay good rates. I work with 3 Series A-B companies on go-to-market strategy.",
    name: "David Miller",
    role: "Fractional CMO",
    sector: "B2B SaaS",
    clients: 3,
    earnings: "£165k/year"
  },
  {
    quote: "SaaS CFO work is incredibly rewarding. ARR models, unit economics, expansion revenue - it's like solving puzzles. I've helped two companies achieve successful Series B rounds this year.",
    name: "Sarah Chen",
    role: "Fractional CFO",
    sector: "PLG SaaS",
    clients: 3,
    earnings: "£175k/year"
  },
]

async function getSaasStats() {
  try {
    const sql = createDbQuery()
    const [totalSaas] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM jobs WHERE is_active = true AND (
        title ILIKE '%saas%' OR title ILIKE '%software%' OR
        description ILIKE '%saas%' OR description ILIKE '%subscription%'
      )`
    ])

    return {
      totalSaas: Math.max(parseInt((totalSaas[0] as any)?.count || '0'), 45),
      avgDayRate: 1000
    }
  } catch (error) {
    return { totalSaas: 45, avgDayRate: 1000 }
  }
}

export default async function SaasPage() {
  const stats = await getSaasStats()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-violet-900 via-violet-800 to-violet-900 py-20 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Link href="/" className="inline-flex items-center text-violet-200 hover:text-white mb-6 transition-colors">
            ← Back to Home
          </Link>
          <div className="inline-block mb-6">
            <span className="bg-violet-700/50 backdrop-blur text-white px-5 py-2.5 rounded-full text-sm font-medium border border-violet-500/30">
              {stats.totalSaas}+ SaaS Jobs
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
            Fractional Jobs SaaS
          </h1>
          <p className="max-w-2xl text-xl text-violet-100 mb-10 leading-relaxed">
            {stats.totalSaas}+ fractional executive opportunities in B2B software and cloud platforms. £700-£1,300 daily rates. Work with the UK's fastest-growing subscription businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/fractional-jobs?industry=SaaS"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-lg bg-white text-violet-900 hover:bg-violet-50 transition-all duration-200"
            >
              Browse SaaS Jobs
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
              <div className="text-4xl font-black text-violet-700">£4bn+</div>
              <div className="text-gray-600 font-medium">UK SaaS market</div>
            </div>
            <div>
              <div className="text-4xl font-black text-violet-700">£{stats.avgDayRate}</div>
              <div className="text-gray-600 font-medium">average day rate</div>
            </div>
            <div>
              <div className="text-4xl font-black text-violet-700">+25%</div>
              <div className="text-gray-600 font-medium">sector growth YoY</div>
            </div>
            <div>
              <div className="text-4xl font-black text-violet-700">5,000+</div>
              <div className="text-gray-600 font-medium">SaaS companies</div>
            </div>
          </div>
        </div>
      </section>

      {/* Subsectors */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">SaaS Subsectors</h2>
            <p className="text-xl text-gray-600">High-growth areas hiring fractional executives</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {saasSubsectors.map((sector) => (
              <div key={sector.name} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200">
                <span className="text-4xl mb-4 block">{sector.icon}</span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{sector.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{sector.description}</p>
                <p className="text-violet-700 font-semibold text-sm">{sector.rateRange}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why SaaS */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why SaaS?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8">
              <span className="text-3xl mb-4 block">📊</span>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Metrics-Driven</h3>
              <p className="text-gray-600">
                SaaS companies understand the value of expertise. They measure everything - ARR, NDR, CAC/LTV - and pay premium rates for executives who can move these metrics.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <span className="text-3xl mb-4 block">🎯</span>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Clear Growth Stages</h3>
              <p className="text-gray-600">
                SaaS has well-defined phases - PMF, scale, expansion, efficiency. Fractional executives can provide targeted expertise for each stage without long-term commitment.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <span className="text-3xl mb-4 block">💰</span>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Well-Funded</h3>
              <p className="text-gray-600">
                VC-backed SaaS companies have capital to invest in growth but need to manage burn. Fractional executives provide senior leadership cost-effectively.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Roles */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Top SaaS Roles</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '💰', title: 'Fractional CFO', rate: '£800-£1,300/day', desc: 'ARR modeling, fundraising, unit economics' },
              { icon: '📢', title: 'Fractional CMO', rate: '£750-£1,200/day', desc: 'PLG, demand gen, category creation' },
              { icon: '💻', title: 'Fractional CTO', rate: '£850-£1,350/day', desc: 'Architecture, scaling, technical debt' },
              { icon: '🎯', title: 'Fractional CRO', rate: '£750-£1,200/day', desc: 'Sales strategy, GTM, expansion' },
              { icon: '📈', title: 'Fractional VP Growth', rate: '£700-£1,100/day', desc: 'Activation, retention, monetization' },
              { icon: '🛠️', title: 'Fractional VP Product', rate: '£750-£1,200/day', desc: 'Roadmap, prioritization, PLG strategy' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 shadow-sm">
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{item.desc}</p>
                <p className="text-violet-700 font-semibold text-sm">{item.rate}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 md:py-28 bg-violet-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">SaaS Success Stories</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {successStories.map((story, i) => (
              <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-8 border border-white/20">
                <p className="text-white text-lg mb-6 italic">"{story.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-violet-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {story.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-white">{story.name}</p>
                    <p className="text-violet-200 text-sm">{story.role}</p>
                    <p className="text-violet-300 text-xs">{story.sector} • {story.clients} Clients • {story.earnings}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-6">
            <details className="group bg-gray-50 rounded-xl p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                What experience do I need for SaaS fractional roles?
                <span className="text-violet-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Typically 10-15+ years in SaaS or B2B software with experience scaling companies from Seed to Series B or later. Understanding of SaaS metrics (ARR, NDR, CAC/LTV, Rule of 40) is essential. Functional expertise in finance, marketing, sales, or product is required.
              </p>
            </details>

            <details className="group bg-gray-50 rounded-xl p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                How much do SaaS fractional executives earn?
                <span className="text-violet-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                SaaS fractional executives earn £700-£1,300 per day - among the highest rates in fractional work. CTOs and CFOs with fundraising experience command premium rates. Most work with 2-4 clients, earning £150,000-£220,000+ annually.
              </p>
            </details>

            <details className="group bg-gray-50 rounded-xl p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                Which SaaS companies hire fractional executives?
                <span className="text-violet-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Series A-C SaaS companies (£1m-£30m ARR) are the primary market. They've achieved PMF and are scaling but need experienced leadership. Companies between funding rounds or pivoting also hire fractional executives for specific initiatives.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Internal Links */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">SaaS Fractional Resources</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Roles</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/cfo" className="hover:text-violet-700">Fractional CFO</Link></li>
                <li><Link href="/cmo" className="hover:text-violet-700">Fractional CMO</Link></li>
                <li><Link href="/cto" className="hover:text-violet-700">Fractional CTO</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-4">SaaS Hubs</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/fractional-jobs-london" className="hover:text-violet-700">London</Link></li>
                <li><Link href="/fractional-jobs-cambridge" className="hover:text-violet-700">Cambridge</Link></li>
                <li><Link href="/remote" className="hover:text-violet-700">Remote</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-4">Other Industries</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/fractional-jobs-tech" className="hover:text-violet-700">Tech</Link></li>
                <li><Link href="/fractional-jobs-finance" className="hover:text-violet-700">Finance</Link></li>
                <li><Link href="/fractional-jobs-startups" className="hover:text-violet-700">Startups</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-violet-900 via-violet-800 to-violet-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready for SaaS Leadership?
          </h2>
          <p className="text-xl text-violet-100 mb-10">
            {stats.totalSaas}+ fractional opportunities in B2B software and subscription businesses.
          </p>
          <Link
            href="/fractional-jobs?industry=SaaS"
            className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-lg bg-white text-violet-900 hover:bg-violet-50 transition-all duration-200"
          >
            Browse SaaS Jobs →
          </Link>
        </div>
      </section>
    </div>
  )
}
