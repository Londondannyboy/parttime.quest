import { Metadata } from 'next'
import Link from 'next/link'
import { createDbQuery } from '@/lib/db'
import { JobsGraph3D } from '@/components/JobsGraph3D'
import { EmbeddedJobBoard } from '@/components/EmbeddedJobBoard'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Interim Jobs UK 2025 | Interim Management & Executive Roles',
  description: 'Find interim jobs UK. Interim management, executive, and director roles. Interim jobs London and nationwide. Contract leadership positions with competitive day rates.',
  keywords: 'interim jobs, interim job, interim jobs uk, interim jobs london, interim jobs near me, interim management jobs, interim manager jobs, interim meaning',
  openGraph: {
    title: 'Interim Jobs UK 2025 | Interim Management & Executive Roles',
    description: 'Find interim jobs UK. Interim management, executive, and director roles. Contract leadership positions.',
    type: 'website',
  },
}

const interimCategories = [
  { name: 'Interim HR Jobs', href: '/interim-hr-jobs', description: 'HR Directors, Managers & Business Partners', volume: '3,100+', icon: '👥' },
  { name: 'Interim Finance Jobs', href: '/interim-finance-jobs', description: 'CFOs, Finance Directors & Controllers', volume: '2,300+', icon: '💰' },
  { name: 'Interim NHS Jobs', href: '/interim-nhs-jobs', description: 'Healthcare management & leadership', volume: '1,900+', icon: '🏥' },
  { name: 'Interim Executive Jobs', href: '/interim-executive-jobs', description: 'CEO, COO & C-Suite roles', volume: '1,400+', icon: '👔' },
  { name: 'Interim Management Jobs', href: '/interim-management-jobs', description: 'General management positions', volume: '1,400+', icon: '📊' },
  { name: 'Interim Procurement Jobs', href: '/interim-procurement-jobs', description: 'Procurement & supply chain', volume: '1,300+', icon: '📦' },
  { name: 'Interim Marketing Jobs', href: '/interim-marketing-jobs', description: 'CMOs & Marketing Directors', volume: '430+', icon: '📣' },
  { name: 'Interim Project Manager Jobs', href: '/interim-project-manager-jobs', description: 'Project & programme management', volume: '420+', icon: '🎯' },
  { name: 'Interim Director Jobs', href: '/interim-director-jobs', description: 'Director-level leadership', volume: '360+', icon: '🏢' },
  { name: 'Interim Headteacher Jobs', href: '/interim-headteacher-jobs', description: 'Education leadership roles', volume: '320+', icon: '🎓' },
]

const interimBenefits = [
  { title: 'High Day Rates', description: 'Interim managers typically earn £500-£1,500/day, significantly more than permanent equivalents', icon: '💷' },
  { title: 'Flexibility', description: 'Choose assignments that fit your lifestyle. Work 3-12 month contracts with breaks between', icon: '⏰' },
  { title: 'Variety', description: 'Experience different industries, company cultures, and challenges. Build a diverse portfolio', icon: '🔄' },
  { title: 'Impact', description: 'Interim roles focus on delivery. Make a real difference in shorter timeframes', icon: '🎯' },
]

const interimFAQ = [
  {
    question: 'What does interim job mean?',
    answer: 'An interim job is a temporary leadership or management position, typically lasting 3-12 months. Interim managers are brought in to fill gaps during transitions, lead specific projects, or provide specialist expertise that organisations need on a short-term basis. Unlike permanent roles, interim positions have defined end dates and focus on immediate impact.'
  },
  {
    question: 'How much do interim managers earn UK?',
    answer: 'Interim manager day rates in the UK typically range from £500-£1,500 per day depending on seniority and specialism. Interim HR Directors earn £600-900/day, Interim CFOs £800-1,400/day, and Interim CEOs can command £1,000-2,000/day. London rates are typically 15-20% higher than regional positions.'
  },
  {
    question: 'What is the difference between interim and permanent jobs?',
    answer: 'Interim jobs are fixed-term contracts (usually 3-12 months) with higher day rates but no employment benefits like pension or holiday pay. Permanent jobs offer long-term security, benefits, and career progression within one organisation. Interim roles suit those who prefer variety and higher short-term earnings.'
  },
  {
    question: 'How do I find interim jobs UK?',
    answer: 'Find interim jobs through specialist interim recruitment agencies, executive search firms, and job boards like this one. Networking is crucial - many interim roles are filled through referrals. Build your LinkedIn presence, register with multiple agencies, and consider joining interim management associations.'
  },
  {
    question: 'Can an interim position become permanent?',
    answer: 'Yes, interim positions can become permanent, though this is not the norm. Around 15-20% of interim assignments convert to permanent roles. If you want to stay, express interest early. However, most interim managers prefer the flexibility and higher earnings of contract work.'
  },
]

async function getInterimStats() {
  try {
    const sql = createDbQuery()
    const [total] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM jobs WHERE is_active = true AND is_fractional = true`
    ])
    return {
      total: parseInt((total[0] as any)?.count || '0'),
    }
  } catch (error) {
    return { total: 150 }
  }
}

export default async function InterimJobsPage() {
  const stats = await getInterimStats()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <JobsGraph3D limit={50} height="100%" isHero={true} showOverlay={true} />
        </div>

        <div className="relative z-10 w-full pb-16 md:pb-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row justify-between items-end gap-8">
              <div className="max-w-2xl">
                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/10">
                  <Link href="/" className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors text-sm tracking-wide">
                    <span className="mr-2">←</span> Back to Home
                  </Link>

                  <span className="inline-block bg-blue-500/20 backdrop-blur text-blue-200 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-6">
                    {stats.total > 0 ? `${stats.total}+` : '150+'} Interim Roles
                  </span>

                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[0.95] tracking-tight">
                    Interim Jobs<br />
                    <span className="text-blue-300">UK 2025</span>
                  </h1>

                  <p className="text-lg text-white/70 mb-8 leading-relaxed max-w-lg">
                    Find interim management jobs across the UK. Executive, director, and specialist interim roles with competitive day rates. London and nationwide opportunities.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="/part-time-jobs"
                      className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-lg bg-blue-500 text-white hover:bg-blue-400 transition-all duration-200"
                    >
                      Browse Interim Jobs →
                    </Link>
                    <Link
                      href="#categories"
                      className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-lg bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
                    >
                      View Categories
                    </Link>
                  </div>
                </div>
              </div>

              {/* Stats panel */}
              <div className="w-full lg:w-auto">
                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-blue-400 font-mono">{stats.total > 0 ? `${stats.total}+` : '150+'}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Interim Roles</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-white font-mono">£500-1.5k</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Day Rates</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-white font-mono">3-12mo</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Typical Length</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-white font-mono">UK Wide</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Locations</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is an Interim Job */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-gray-400 mb-4 block">Interim Jobs Meaning</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              What is an interim job?
            </h2>
          </div>
          <div className="prose prose-xl prose-gray max-w-none">
            <p className="text-xl text-gray-600 leading-relaxed text-center">
              <strong>Interim jobs</strong> are temporary management and leadership positions where experienced professionals are hired on a fixed-term basis to fill critical gaps, lead transformation projects, or provide specialist expertise. Unlike permanent roles, interim positions typically last 3-12 months and focus on immediate impact and delivery.
            </p>
            <p className="text-xl text-gray-600 leading-relaxed text-center mt-6">
              The <strong>interim management</strong> market in the UK is worth over £2 billion annually, with demand growing across all sectors. Companies use interim managers during periods of change, growth, or when they need specific skills that don't exist in-house.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-gray-400 mb-4 block">By Category</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Interim Job Categories</h2>
            <p className="text-xl text-gray-500">Browse interim roles by function and sector</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interimCategories.map((category, i) => (
              <Link
                key={i}
                href={category.href}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{category.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{category.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                    <span className="text-blue-600 text-xs font-semibold uppercase tracking-wider">
                      {category.volume} monthly searches →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 md:py-28 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Why Choose Interim Work?</h2>
            <p className="text-xl text-gray-400">Benefits of interim management careers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {interimBenefits.map((benefit, i) => (
              <div key={i} className="bg-white rounded-2xl p-6">
                <span className="text-4xl mb-4 block">{benefit.icon}</span>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Board */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest Interim Jobs UK</h2>
            <p className="text-xl text-gray-500">Browse current interim opportunities</p>
          </div>
          <EmbeddedJobBoard
            title="Interim Jobs"
            jobsPerPage={9}
            showAllJobsLink={true}
            allJobsLinkText="View All Interim Jobs"
          />
        </div>
      </section>

      {/* Interim Jobs London */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-medium uppercase tracking-[0.3em] text-gray-400 mb-4 block">Location Focus</span>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Interim Jobs London</h2>
              <p className="text-lg text-gray-600 mb-6">
                London remains the hub for interim management opportunities in the UK. The capital offers the highest concentration of interim roles, particularly in financial services, technology, and professional services sectors.
              </p>
              <ul className="space-y-3 text-gray-600 mb-8">
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  15-20% higher day rates than regional roles
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Highest volume of interim opportunities
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Strong demand in City & Canary Wharf
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Growing tech interim market in Shoreditch
                </li>
              </ul>
              <Link
                href="/part-time-jobs-london"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                View London Interim Jobs →
              </Link>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-6">London Interim Day Rates</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-700">Interim CFO</span>
                  <span className="font-bold text-blue-600">£900-1,400/day</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-700">Interim HR Director</span>
                  <span className="font-bold text-blue-600">£700-1,000/day</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-700">Interim CEO</span>
                  <span className="font-bold text-blue-600">£1,200-2,000/day</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-700">Interim CMO</span>
                  <span className="font-bold text-blue-600">£800-1,200/day</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-700">Interim CTO</span>
                  <span className="font-bold text-blue-600">£900-1,400/day</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Interim Jobs FAQ</h2>
            <p className="text-xl text-gray-500">Common questions about interim work</p>
          </div>

          <div className="space-y-6">
            {interimFAQ.map((faq, i) => (
              <details key={i} className="group bg-gray-50 rounded-xl p-6 cursor-pointer border border-gray-200">
                <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                  {faq.question}
                  <span className="text-gray-700 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Browse Interim Jobs by Category</h3>
          <div className="flex flex-wrap gap-3">
            {interimCategories.map((cat, i) => (
              <Link
                key={i}
                href={cat.href}
                className="px-4 py-2 bg-white rounded-full text-gray-700 text-sm border border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-800 transition-colors"
              >
                {cat.name} →
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Find Your Next Interim Role
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Browse interim management opportunities across the UK
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/part-time-jobs"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-lg bg-blue-500 text-white hover:bg-blue-400 transition-all duration-200"
            >
              Browse All Interim Jobs →
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
