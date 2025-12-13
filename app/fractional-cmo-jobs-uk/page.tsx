import { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { createDbQuery } from '@/lib/db'
import { EmbeddedJobBoard } from '@/components/EmbeddedJobBoard'
import { FAQ, CMO_FAQS } from '@/components/FAQ'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Fractional CMO Jobs UK | Part-Time CMO Roles',
  description: 'Fractional CMO jobs UK - Find part-time Chief Marketing Officer positions paying £700-£1,400/day. Browse live CMO roles for experienced marketing leaders.',
  keywords: 'fractional cmo jobs uk, fractional cmo jobs, part time cmo jobs, fractional cmo uk, cmo jobs uk, part time chief marketing officer',
  openGraph: {
    title: 'Fractional CMO Jobs UK | Part-Time CMO Roles',
    description: 'Fractional CMO jobs UK - Find part-time CMO positions paying £700-£1,400/day.',
    images: ['/images/fractional-cmo-jobs-uk.jpg'],
  },
}

async function getCmoStats() {
  try {
    const sql = createDbQuery()
    const result = await sql`SELECT COUNT(*) as count FROM jobs WHERE is_active = true AND role_category = 'Marketing'`
    return parseInt((result[0] as any)?.count || '0')
  } catch {
    return 38
  }
}

export default async function FractionalCmoJobsUkPage() {
  const jobCount = await getCmoStats()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-900 to-purple-800 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/" className="text-purple-200 hover:text-white mb-6 inline-block">← Back to Home</Link>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">Fractional CMO Jobs UK</h1>
          <p className="text-xl text-purple-100 mb-8">
            Find <strong>fractional CMO jobs UK</strong> opportunities. Browse {jobCount}+ live part-time Chief Marketing Officer roles paying £700-£1,400 per day.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="#jobs" className="px-8 py-4 bg-white text-purple-900 rounded-lg font-semibold hover:bg-purple-50">
              Browse Marketing Jobs
            </Link>
            <Link href="/fractional-cmo-salary" className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10">
              CMO Salary Guide
            </Link>
          </div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-black text-purple-700">{jobCount}+</div>
              <div className="text-gray-600">Marketing Jobs</div>
            </div>
            <div>
              <div className="text-4xl font-black text-purple-700">£950</div>
              <div className="text-gray-600">Avg Day Rate</div>
            </div>
            <div>
              <div className="text-4xl font-black text-purple-700">2-3</div>
              <div className="text-gray-600">Days Per Week</div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Image */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <img
            src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Fractional CMO jobs UK - marketing executive leading strategy meeting with team"
            className="w-full h-64 object-cover rounded-xl shadow-lg"
          />
        </div>
      </section>

      {/* Main Content */}
      <article className="py-16">
        <div className="max-w-4xl mx-auto px-4 prose prose-lg prose-purple">
          <h2>What Are Fractional CMO Jobs?</h2>
          <p>
            <strong>Fractional CMO jobs</strong> are part-time Chief Marketing Officer positions where experienced marketing leaders provide strategic leadership to multiple companies simultaneously. Rather than committing full-time to one organisation, fractional CMOs typically work 1-3 days per week with each client, delivering senior marketing expertise at a fraction of the cost of a permanent hire.
          </p>
          <p>
            The UK market for <strong>fractional CMO jobs UK</strong> has grown significantly, with a 200% year-on-year increase in searches. This growth reflects how startups, scale-ups, and SMEs are accessing world-class marketing talent without the £120,000-£200,000 annual cost of a full-time Chief Marketing Officer.
          </p>

          <h2>Why Fractional CMO Jobs Are Growing in the UK</h2>
          <p>Several factors are driving the rapid growth of fractional CMO opportunities:</p>
          <ul>
            <li><strong>Cost efficiency:</strong> Companies access experienced CMO expertise for £1,500-£4,000 per week instead of £10,000+ monthly for a full-time hire</li>
            <li><strong>Breadth of experience:</strong> Fractional CMOs bring diverse perspectives from working across multiple brands and industries</li>
            <li><strong>Immediate impact:</strong> No lengthy onboarding—experienced CMOs start delivering strategy from week one</li>
            <li><strong>Scalability:</strong> Engagement can flex based on company needs—increase during product launches, reduce during steady-state</li>
            <li><strong>VC expectations:</strong> Investors increasingly expect professional marketing leadership post Series A</li>
          </ul>

          <h2>Types of Fractional CMO Jobs Available</h2>
          <p>The UK market offers diverse <strong>fractional CMO jobs</strong>:</p>
          <ul>
            <li><strong>B2B SaaS CMO:</strong> Demand generation, product marketing, and pipeline acceleration for software companies</li>
            <li><strong>DTC/E-commerce CMO:</strong> Customer acquisition, retention, and brand building for consumer brands</li>
            <li><strong>Startup CMO:</strong> Building marketing foundations for Series A-C companies establishing product-market fit</li>
            <li><strong>Brand Transformation CMO:</strong> Repositioning and rebranding established companies for new markets</li>
            <li><strong>Growth Marketing CMO:</strong> Performance-focused roles optimising CAC, LTV, and channel mix</li>
          </ul>

          <h2>Fractional CMO Jobs by Location</h2>
          <p>While London leads the market with approximately 55% of roles, opportunities exist nationwide:</p>
          <ul>
            <li><strong>London (Shoreditch/Tech City):</strong> Startup ecosystem hub—premium rates £900-£1,400/day</li>
            <li><strong>London (City/Canary Wharf):</strong> Financial services marketing—rates £850-£1,200/day</li>
            <li><strong>Manchester:</strong> Growing creative and tech scene—rates £700-£1,000/day</li>
            <li><strong>Bristol:</strong> Strong creative industry presence—rates £700-£1,000/day</li>
            <li><strong>Edinburgh:</strong> Financial services and tech—rates £700-£1,000/day</li>
            <li><strong>Remote UK:</strong> Increasingly common, especially post-pandemic—rates £650-£950/day</li>
          </ul>

          <h2>Fractional CMO Jobs by Industry</h2>
          <p>High-demand sectors include:</p>
          <ul>
            <li><strong>B2B SaaS:</strong> Highest demand—complex buying cycles need experienced CMOs (£1,000-£1,400/day)</li>
            <li><strong>DTC/E-commerce:</strong> Performance marketing and brand expertise in high demand (£900-£1,300/day)</li>
            <li><strong>FinTech:</strong> Regulated marketing requiring specialist knowledge (£900-£1,250/day)</li>
            <li><strong>HealthTech/MedTech:</strong> Compliance-aware marketing leadership (£850-£1,150/day)</li>
            <li><strong>Marketplaces:</strong> Two-sided marketplace growth expertise (£850-£1,200/day)</li>
            <li><strong>Professional Services:</strong> B2B marketing and thought leadership (£700-£1,000/day)</li>
          </ul>

          <h2>How to Find Fractional CMO Jobs UK</h2>
          <p>The best channels for finding opportunities include:</p>
          <ul>
            <li><strong>Specialist platforms:</strong> <Link href="/fractional-jobs">Fractional Quest</Link> curates verified CMO opportunities</li>
            <li><strong>LinkedIn positioning:</strong> Building thought leadership content establishes CMO credibility</li>
            <li><strong>VC networks:</strong> Relationships with investors who need CMOs for portfolio companies</li>
            <li><strong>Fractional communities:</strong> Groups connecting marketing leaders with opportunities</li>
            <li><strong>Agency networks:</strong> Marketing agencies often refer fractional CMOs to their clients</li>
          </ul>

          <h2>Requirements for Fractional CMO Jobs</h2>
          <p>Successful candidates typically have:</p>
          <ul>
            <li>12-15+ years of marketing experience with 5+ years in senior leadership</li>
            <li>Proven track record of pipeline/revenue growth</li>
            <li>Deep expertise in specific channels (performance, brand, PLG, ABM)</li>
            <li>Experience building and managing marketing teams</li>
            <li>Strong data literacy and marketing technology knowledge</li>
            <li>Board-level communication and stakeholder management skills</li>
          </ul>
        </div>
      </article>

      {/* Embedded Job Board */}
      <section id="jobs" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse Fractional CMO Jobs UK</h2>
            <p className="text-lg text-gray-600">Marketing jobs pre-selected. Change filters to explore other departments.</p>
          </div>
          <Suspense fallback={
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-48 bg-gray-200 rounded"></div>
                  <div className="h-48 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          }>
            <EmbeddedJobBoard
              defaultDepartment="Marketing"
              pageSlug="fractional-cmo-jobs-uk"
              jobsPerPage={10}
              title="Latest Marketing & CMO Jobs"
              allJobsLinkText="View All Marketing Jobs"
            />
          </Suspense>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <FAQ
            items={CMO_FAQS}
            title="Frequently Asked Questions About Fractional CMO Jobs UK"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-purple-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Next Fractional CMO Role?</h2>
          <p className="text-purple-100 mb-8">Create your profile to get matched with companies seeking fractional marketing leadership.</p>
          <div className="flex justify-center gap-4">
            <Link href="/handler/sign-up" className="px-8 py-4 bg-white text-purple-900 rounded-lg font-semibold hover:bg-purple-50">
              Create Profile
            </Link>
            <Link href="/fractional-cmo-salary" className="px-8 py-4 border-2 border-white rounded-lg font-semibold hover:bg-white/10">
              CMO Salary Guide
            </Link>
          </div>
        </div>
      </section>

      {/* Internal Links */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Related Pages</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/part-time-cmo" className="px-4 py-2 bg-white rounded-lg border hover:border-purple-300">Part-Time CMO Guide</Link>
            <Link href="/fractional-cmo-salary" className="px-4 py-2 bg-white rounded-lg border hover:border-purple-300">CMO Salary Guide</Link>
            <Link href="/fractional-jobs-london" className="px-4 py-2 bg-white rounded-lg border hover:border-purple-300">Jobs London</Link>
            <Link href="/fractional-cfo-jobs-uk" className="px-4 py-2 bg-white rounded-lg border hover:border-emerald-300">CFO Jobs UK</Link>
            <Link href="/fractional-cto-jobs-uk" className="px-4 py-2 bg-white rounded-lg border hover:border-blue-300">CTO Jobs UK</Link>
            <Link href="/fractional-coo-jobs-uk" className="px-4 py-2 bg-white rounded-lg border hover:border-orange-300">COO Jobs UK</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
