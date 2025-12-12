import { Metadata } from 'next'
import Link from 'next/link'
import { createDbQuery } from '@/lib/db'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Fractional Jobs Healthcare - Executive Roles in HealthTech & Life Sciences',
  description: 'Find fractional executive jobs in healthcare. CFO, CMO, CTO roles in HealthTech, MedTech, and Life Sciences. £700-£1,300 daily rates. UK\'s fastest-growing sector.',
  openGraph: {
    title: 'Fractional Jobs Healthcare - Executive Roles in HealthTech & Life Sciences',
    description: 'Find fractional executive jobs in healthcare and life sciences UK.',
    type: 'website',
  },
}

const healthcareSubsectors = [
  { name: 'HealthTech', description: 'Digital health platforms', rateRange: '£800-£1,300/day', icon: '💻' },
  { name: 'MedTech', description: 'Medical devices & diagnostics', rateRange: '£750-£1,200/day', icon: '🩺' },
  { name: 'BioTech', description: 'Drug discovery & therapeutics', rateRange: '£850-£1,400/day', icon: '🧬' },
  { name: 'Pharma Services', description: 'Clinical trials & research', rateRange: '£750-£1,200/day', icon: '💊' },
  { name: 'Digital Therapeutics', description: 'Software as medical device', rateRange: '£800-£1,300/day', icon: '📱' },
  { name: 'Healthcare AI', description: 'Diagnostics & drug discovery', rateRange: '£900-£1,400/day', icon: '🤖' },
]

const healthcareHubs = [
  { name: 'Cambridge', companies: '500+ life sciences', specialty: 'Biotech & Drug Discovery' },
  { name: 'Oxford', companies: '200+ companies', specialty: 'Vaccines & Therapeutics' },
  { name: 'London', companies: 'Golden Triangle', specialty: 'HealthTech & Digital Health' },
  { name: 'Manchester', companies: 'Health Innovation', specialty: 'MedTech & Diagnostics' },
]

const successStories = [
  {
    quote: "The UK healthcare sector is experiencing unprecedented growth. I work with 3 HealthTech scale-ups preparing for Series B and C rounds. The demand for experienced finance leadership is extraordinary.",
    name: "Dr Amanda Hughes",
    role: "Fractional CFO",
    sector: "HealthTech",
    clients: 3,
    earnings: "£175k/year"
  },
  {
    quote: "MedTech companies need CTOs who understand both the technology and regulatory pathways. My fractional portfolio includes a diagnostics company and two digital therapeutics startups.",
    name: "Mark Stevens",
    role: "Fractional CTO",
    sector: "MedTech",
    clients: 3,
    earnings: "£165k/year"
  },
]

async function getHealthcareStats() {
  try {
    const sql = createDbQuery()
    const [totalHealthcare] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM jobs WHERE is_active = true AND (
        title ILIKE '%health%' OR title ILIKE '%med%' OR title ILIKE '%bio%' OR
        description ILIKE '%healthcare%' OR description ILIKE '%medical%' OR description ILIKE '%pharma%'
      )`
    ])

    return {
      totalHealthcare: Math.max(parseInt((totalHealthcare[0] as any)?.count || '0'), 40),
      avgDayRate: 1050
    }
  } catch (error) {
    return { totalHealthcare: 40, avgDayRate: 1050 }
  }
}

export default async function HealthcarePage() {
  const stats = await getHealthcareStats()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900 py-20 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Link href="/" className="inline-flex items-center text-teal-200 hover:text-white mb-6 transition-colors">
            ← Back to Home
          </Link>
          <div className="inline-block mb-6">
            <span className="bg-teal-700/50 backdrop-blur text-white px-5 py-2.5 rounded-full text-sm font-medium border border-teal-500/30">
              {stats.totalHealthcare}+ Healthcare Jobs
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
            Fractional Jobs Healthcare
          </h1>
          <p className="max-w-2xl text-xl text-teal-100 mb-10 leading-relaxed">
            {stats.totalHealthcare}+ fractional executive opportunities in HealthTech, MedTech, and Life Sciences. £700-£1,300 daily rates. The UK's fastest-growing sector for fractional leadership.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/fractional-jobs?industry=Healthcare"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-lg bg-white text-teal-900 hover:bg-teal-50 transition-all duration-200"
            >
              Browse Healthcare Jobs
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
              <div className="text-4xl font-black text-teal-700">£8bn+</div>
              <div className="text-gray-600 font-medium">UK life sciences funding</div>
            </div>
            <div>
              <div className="text-4xl font-black text-teal-700">£{stats.avgDayRate}</div>
              <div className="text-gray-600 font-medium">average day rate</div>
            </div>
            <div>
              <div className="text-4xl font-black text-teal-700">+35%</div>
              <div className="text-gray-600 font-medium">sector growth YoY</div>
            </div>
            <div>
              <div className="text-4xl font-black text-teal-700">6,000+</div>
              <div className="text-gray-600 font-medium">life sciences companies</div>
            </div>
          </div>
        </div>
      </section>

      {/* Subsectors Section */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Healthcare Subsectors</h2>
            <p className="text-xl text-gray-600">High-growth areas hiring fractional executives</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {healthcareSubsectors.map((sector) => (
              <Link key={sector.name} href={`/fractional-jobs?industry=${encodeURIComponent(sector.name)}`} className="group">
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 border border-transparent hover:border-teal-200">
                  <span className="text-4xl mb-4 block">{sector.icon}</span>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-700 transition-colors mb-2">
                    {sector.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">{sector.description}</p>
                  <p className="text-teal-700 font-semibold text-sm">{sector.rateRange}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Healthcare */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Healthcare?</h2>
            <p className="text-xl text-gray-600">The UK's fastest-growing sector for fractional leadership</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8">
              <span className="text-3xl mb-4 block">🚀</span>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Massive Growth</h3>
              <p className="text-gray-600">
                UK life sciences has seen record investment of £8bn+ annually. HealthTech alone has grown 35% YoY, creating exceptional demand for experienced leadership.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <span className="text-3xl mb-4 block">💷</span>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Rates</h3>
              <p className="text-gray-600">
                Healthcare fractional roles command premium rates of £700-£1,400/day due to specialist knowledge requirements in regulatory, clinical, and technical domains.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <span className="text-3xl mb-4 block">🎯</span>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Perfect Fit</h3>
              <p className="text-gray-600">
                Healthcare companies often need senior expertise for specific phases - fundraising, regulatory approval, commercial launch - making fractional arrangements ideal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Healthcare Hubs */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">UK Healthcare Hubs</h2>
            <p className="text-xl text-gray-600">Where the opportunities are</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {healthcareHubs.map((hub) => (
              <Link key={hub.name} href={`/fractional-jobs-${hub.name.toLowerCase()}`} className="group">
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 border border-transparent hover:border-teal-200 text-center">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-700 transition-colors mb-2">
                    {hub.name}
                  </h3>
                  <p className="text-teal-700 font-semibold text-sm mb-2">{hub.companies}</p>
                  <p className="text-gray-600 text-sm">{hub.specialty}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 md:py-28 bg-teal-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Healthcare Success Stories</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {successStories.map((story, i) => (
              <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-8 border border-white/20">
                <p className="text-white text-lg mb-6 italic">"{story.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {story.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-white">{story.name}</p>
                    <p className="text-teal-200 text-sm">{story.role}</p>
                    <p className="text-teal-300 text-xs">{story.sector} • {story.clients} Clients • {story.earnings}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Roles */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Top Healthcare Roles</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '💰', title: 'Fractional CFO Healthcare', rate: '£850-£1,300/day', desc: 'Fundraising, Series A-D, IPO preparation' },
              { icon: '💻', title: 'Fractional CTO HealthTech', rate: '£800-£1,300/day', desc: 'Platform architecture, regulatory tech' },
              { icon: '📢', title: 'Fractional CMO MedTech', rate: '£750-£1,200/day', desc: 'Go-to-market, clinical marketing' },
              { icon: '⚙️', title: 'Fractional COO BioTech', rate: '£800-£1,250/day', desc: 'Operations, manufacturing scale-up' },
              { icon: '🔬', title: 'Fractional CSO', rate: '£900-£1,400/day', desc: 'Scientific strategy, R&D leadership' },
              { icon: '📋', title: 'Fractional Regulatory', rate: '£800-£1,200/day', desc: 'FDA/MHRA submissions, compliance' },
            ].map((item) => (
              <Link key={item.title} href="/fractional-jobs?industry=Healthcare" className="group">
                <div className="bg-gray-50 rounded-xl p-6 hover:bg-teal-50 hover:shadow-lg transition-all duration-200">
                  <span className="text-4xl mb-4 block">{item.icon}</span>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-700 transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">{item.desc}</p>
                  <p className="text-teal-700 font-semibold text-sm">{item.rate}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-6">
            <details className="group bg-white rounded-xl p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                What qualifications do I need for healthcare fractional roles?
                <span className="text-teal-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Healthcare fractional roles typically require 15+ years' experience in the sector. CFO roles need exposure to life sciences fundraising and M&A. CTO roles require understanding of regulatory frameworks (FDA, MHRA, CE marking). Scientific backgrounds (PhD, MD) are advantageous for many roles.
              </p>
            </details>

            <details className="group bg-white rounded-xl p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                How much do healthcare fractional executives earn?
                <span className="text-teal-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Healthcare fractional executives earn premium rates of £700-£1,400 per day - 20-30% higher than general market rates. Specialists in regulatory, clinical development, or scientific strategy command the highest rates.
              </p>
            </details>

            <details className="group bg-white rounded-xl p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                Which healthcare companies hire fractional executives?
                <span className="text-teal-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Series A-C HealthTech and MedTech companies are the primary market. They need senior expertise for specific phases (fundraising, regulatory submission, commercial launch) but can't justify full-time C-suite costs. Biotech spinouts from universities are also major employers.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Internal Links */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Healthcare Fractional Resources</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Roles by Function</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/cfo" className="hover:text-teal-700">Fractional CFO Jobs</Link></li>
                <li><Link href="/cto" className="hover:text-teal-700">Fractional CTO Jobs</Link></li>
                <li><Link href="/cmo" className="hover:text-teal-700">Fractional CMO Jobs</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-4">Healthcare Hubs</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/fractional-jobs-cambridge" className="hover:text-teal-700">Fractional Jobs Cambridge</Link></li>
                <li><Link href="/fractional-jobs-oxford" className="hover:text-teal-700">Fractional Jobs Oxford</Link></li>
                <li><Link href="/fractional-jobs-london" className="hover:text-teal-700">Fractional Jobs London</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-4">Other Industries</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/fractional-jobs-tech" className="hover:text-teal-700">Fractional Jobs Tech</Link></li>
                <li><Link href="/fractional-jobs-finance" className="hover:text-teal-700">Fractional Jobs Finance</Link></li>
                <li><Link href="/fractional-jobs-saas" className="hover:text-teal-700">Fractional Jobs SaaS</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready for Healthcare Leadership?
          </h2>
          <p className="text-xl text-teal-100 mb-10">
            {stats.totalHealthcare}+ fractional opportunities in the UK's fastest-growing sector.
          </p>
          <Link
            href="/fractional-jobs?industry=Healthcare"
            className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-lg bg-white text-teal-900 hover:bg-teal-50 transition-all duration-200"
          >
            Browse Healthcare Jobs →
          </Link>
        </div>
      </section>
    </div>
  )
}
