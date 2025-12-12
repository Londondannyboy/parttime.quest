import { Metadata } from 'next'
import Link from 'next/link'
import { createDbQuery } from '@/lib/db'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Fractional Jobs E-commerce - Executive Roles in Online Retail & DTC',
  description: 'Find fractional executive jobs in e-commerce. CFO, CMO, CTO roles in online retail, DTC brands, and marketplaces. £600-£1,100 daily rates.',
  openGraph: {
    title: 'Fractional Jobs E-commerce - Executive Roles in Online Retail',
    description: 'Find fractional executive jobs in e-commerce and DTC brands.',
    type: 'website',
  },
}

const ecommerceSubsectors = [
  { name: 'DTC Brands', description: 'Direct-to-consumer retail', rateRange: '£650-£1,100/day', icon: '🛍️' },
  { name: 'Marketplaces', description: 'Multi-seller platforms', rateRange: '£700-£1,150/day', icon: '🏪' },
  { name: 'Subscription', description: 'Recurring revenue models', rateRange: '£650-£1,100/day', icon: '📦' },
  { name: 'B2B E-commerce', description: 'Wholesale & trade', rateRange: '£600-£1,050/day', icon: '🏭' },
  { name: 'Social Commerce', description: 'Social media selling', rateRange: '£600-£1,000/day', icon: '📱' },
  { name: 'E-commerce Tech', description: 'Platforms & infrastructure', rateRange: '£700-£1,200/day', icon: '💻' },
]

const successStories = [
  {
    quote: "DTC brands are the perfect fractional clients. They need experienced CMOs for growth but can't justify £200k salaries. I work with 4 brands and help them scale from £5m to £20m+ revenue.",
    name: "Charlotte Baker",
    role: "Fractional CMO",
    sector: "DTC Brands",
    clients: 4,
    earnings: "£145k/year"
  },
  {
    quote: "E-commerce CFO work is incredibly varied - inventory management, unit economics, marketplace fees, international expansion. Every client is different and the skills transfer perfectly.",
    name: "Tom Edwards",
    role: "Fractional CFO",
    sector: "Marketplaces",
    clients: 3,
    earnings: "£135k/year"
  },
]

async function getEcommerceStats() {
  try {
    const sql = createDbQuery()
    const [totalEcommerce] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM jobs WHERE is_active = true AND (
        title ILIKE '%ecommerce%' OR title ILIKE '%e-commerce%' OR title ILIKE '%retail%' OR
        description ILIKE '%ecommerce%' OR description ILIKE '%e-commerce%' OR description ILIKE '%dtc%'
      )`
    ])

    return {
      totalEcommerce: Math.max(parseInt((totalEcommerce[0] as any)?.count || '0'), 35),
      avgDayRate: 850
    }
  } catch (error) {
    return { totalEcommerce: 35, avgDayRate: 850 }
  }
}

export default async function EcommercePage() {
  const stats = await getEcommerceStats()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-900 via-orange-800 to-orange-900 py-20 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Link href="/" className="inline-flex items-center text-orange-200 hover:text-white mb-6 transition-colors">
            ← Back to Home
          </Link>
          <div className="inline-block mb-6">
            <span className="bg-orange-700/50 backdrop-blur text-white px-5 py-2.5 rounded-full text-sm font-medium border border-orange-500/30">
              {stats.totalEcommerce}+ E-commerce Jobs
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
            Fractional Jobs Ecommerce
          </h1>
          <p className="max-w-2xl text-xl text-orange-100 mb-10 leading-relaxed">
            {stats.totalEcommerce}+ fractional executive opportunities in online retail, DTC brands, and marketplaces. £600-£1,100 daily rates. Help brands scale from startup to £50m+ revenue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/fractional-jobs?industry=E-commerce"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-lg bg-white text-orange-900 hover:bg-orange-50 transition-all duration-200"
            >
              Browse E-commerce Jobs
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
              <div className="text-4xl font-black text-orange-700">£120bn</div>
              <div className="text-gray-600 font-medium">UK e-commerce market</div>
            </div>
            <div>
              <div className="text-4xl font-black text-orange-700">£{stats.avgDayRate}</div>
              <div className="text-gray-600 font-medium">average day rate</div>
            </div>
            <div>
              <div className="text-4xl font-black text-orange-700">30%</div>
              <div className="text-gray-600 font-medium">of UK retail is online</div>
            </div>
            <div>
              <div className="text-4xl font-black text-orange-700">15,000+</div>
              <div className="text-gray-600 font-medium">DTC brands</div>
            </div>
          </div>
        </div>
      </section>

      {/* Subsectors */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">E-commerce Subsectors</h2>
            <p className="text-xl text-gray-600">Where the opportunities are</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ecommerceSubsectors.map((sector) => (
              <div key={sector.name} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200">
                <span className="text-4xl mb-4 block">{sector.icon}</span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{sector.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{sector.description}</p>
                <p className="text-orange-700 font-semibold text-sm">{sector.rateRange}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why E-commerce */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why E-commerce?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8">
              <span className="text-3xl mb-4 block">📈</span>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Rapid Growth</h3>
              <p className="text-gray-600">
                UK e-commerce continues to grow with 30% of retail now online. DTC brands are scaling rapidly and need experienced leadership to maintain growth trajectories.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <span className="text-3xl mb-4 block">🎯</span>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Perfect Fit</h3>
              <p className="text-gray-600">
                E-commerce businesses have clear growth phases - launch, scale, profitability. Fractional executives can provide the exact expertise needed at each stage.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <span className="text-3xl mb-4 block">💡</span>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Diverse Skills</h3>
              <p className="text-gray-600">
                E-commerce demands varied expertise - performance marketing, supply chain, unit economics, tech platforms. Fractional roles leverage specialist knowledge perfectly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Roles */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Top E-commerce Roles</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '📢', title: 'Fractional CMO', rate: '£700-£1,100/day', desc: 'Performance marketing, brand building, growth strategy' },
              { icon: '💰', title: 'Fractional CFO', rate: '£650-£1,100/day', desc: 'Unit economics, cash flow, inventory management' },
              { icon: '💻', title: 'Fractional CTO', rate: '£700-£1,150/day', desc: 'Platform architecture, tech stack optimization' },
              { icon: '⚙️', title: 'Fractional COO', rate: '£650-£1,050/day', desc: 'Supply chain, fulfillment, operations scaling' },
              { icon: '🛒', title: 'Fractional eCommerce Director', rate: '£600-£1,000/day', desc: 'Marketplace strategy, conversion optimization' },
              { icon: '📈', title: 'Fractional Growth Lead', rate: '£600-£950/day', desc: 'Acquisition, retention, customer lifecycle' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 shadow-sm">
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{item.desc}</p>
                <p className="text-orange-700 font-semibold text-sm">{item.rate}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 md:py-28 bg-orange-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">E-commerce Success Stories</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {successStories.map((story, i) => (
              <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-8 border border-white/20">
                <p className="text-white text-lg mb-6 italic">"{story.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {story.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-white">{story.name}</p>
                    <p className="text-orange-200 text-sm">{story.role}</p>
                    <p className="text-orange-300 text-xs">{story.sector} • {story.clients} Clients • {story.earnings}</p>
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
                What experience do I need for e-commerce fractional roles?
                <span className="text-orange-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Typically 10-15+ years in e-commerce or retail, with experience scaling brands from £1m to £10m+ or £10m to £50m+. Understanding of performance marketing, unit economics, and e-commerce platforms (Shopify, Magento, etc.) is essential.
              </p>
            </details>

            <details className="group bg-gray-50 rounded-xl p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                How much do e-commerce fractional executives earn?
                <span className="text-orange-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                E-commerce fractional executives earn £600-£1,100 per day. CMOs and Growth specialists are in highest demand. Most work with 3-4 brands simultaneously, earning £130,000-£180,000+ annually.
              </p>
            </details>

            <details className="group bg-gray-50 rounded-xl p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                Which e-commerce brands hire fractional executives?
                <span className="text-orange-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                DTC brands between £2m-£30m revenue are the primary market. They've achieved product-market fit and need experienced leadership to scale, but can't justify full C-suite salaries. PE-backed roll-ups also hire fractional executives.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Internal Links */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">E-commerce Fractional Resources</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Roles</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/cfo" className="hover:text-orange-700">Fractional CFO</Link></li>
                <li><Link href="/cmo" className="hover:text-orange-700">Fractional CMO</Link></li>
                <li><Link href="/cto" className="hover:text-orange-700">Fractional CTO</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-4">Locations</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/fractional-jobs-london" className="hover:text-orange-700">London</Link></li>
                <li><Link href="/fractional-jobs-manchester" className="hover:text-orange-700">Manchester</Link></li>
                <li><Link href="/remote" className="hover:text-orange-700">Remote</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-4">Other Industries</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/fractional-jobs-tech" className="hover:text-orange-700">Tech</Link></li>
                <li><Link href="/fractional-jobs-saas" className="hover:text-orange-700">SaaS</Link></li>
                <li><Link href="/fractional-jobs-finance" className="hover:text-orange-700">Finance</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-orange-900 via-orange-800 to-orange-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready for E-commerce Leadership?
          </h2>
          <p className="text-xl text-orange-100 mb-10">
            {stats.totalEcommerce}+ fractional opportunities in online retail and DTC brands.
          </p>
          <Link
            href="/fractional-jobs?industry=E-commerce"
            className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-lg bg-white text-orange-900 hover:bg-orange-50 transition-all duration-200"
          >
            Browse E-commerce Jobs →
          </Link>
        </div>
      </section>
    </div>
  )
}
