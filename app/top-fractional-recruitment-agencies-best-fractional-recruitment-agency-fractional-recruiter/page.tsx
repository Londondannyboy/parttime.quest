import { Metadata } from 'next'
import Link from 'next/link'
import { SavingsCalculator } from '@/components/SavingsCalculator'
import { getAgencies, Agency } from '@/lib/agencies'

export const metadata: Metadata = {
  title: 'Best Fractional Recruitment Agency UK | Top Fractional Recruiters 2025',
  description: 'Find the best fractional recruitment agency in the UK. Compare top fractional recruiters for CFO, CTO, CMO hiring. Save 40-60% vs full-time executive hires.',
  keywords: 'best fractional recruitment agency, fractional recruiters, top fractional recruitment agencies, fractional recruitment agency uk, fractional executive recruitment, fractional cfo recruitment',
  openGraph: {
    title: 'Best Fractional Recruitment Agency UK | Top Fractional Recruiters 2025',
    description: 'Find the best fractional recruitment agency in the UK. Compare top fractional recruiters and save 40-60% vs full-time hires.',
    type: 'website',
    url: 'https://fractional.quest/top-fractional-recruitment-agencies-best-fractional-recruitment-agency-fractional-recruiter',
  },
}

export const revalidate = 3600 // Revalidate every hour

export default async function TopFractionalRecruitmentAgenciesPage() {
  const agencies = await getAgencies()
  const featuredAgency = agencies.find(a => a.payload?.featured)
  const otherAgencies = agencies.filter(a => !a.payload?.featured)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Best Fractional Recruitment Agency UK
            </h1>
            <p className="text-xl md:text-2xl text-purple-200 mb-8">
              Find the <strong className="text-white">best fractional recruiters</strong> and <strong className="text-white">top fractional recruitment agencies</strong> to hire fractional executives for your business
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="bg-purple-700/50 text-purple-200 px-4 py-2 rounded-full">Fractional CFO Recruitment</span>
              <span className="bg-purple-700/50 text-purple-200 px-4 py-2 rounded-full">Fractional CTO Agencies</span>
              <span className="bg-purple-700/50 text-purple-200 px-4 py-2 rounded-full">Fractional CMO Recruiters</span>
              <span className="bg-purple-700/50 text-purple-200 px-4 py-2 rounded-full">Fractional COO Search</span>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SavingsCalculator />
        </div>
      </section>

      {/* What is Fractional Recruitment Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            What Makes the Best Fractional Recruitment Agency?
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-xl leading-relaxed mb-6">
              The <strong>best fractional recruitment agency</strong> specialises in connecting businesses with experienced executives who work on a part-time, ongoing basis. Unlike traditional recruitment agencies that place full-time employees, top <strong>fractional recruiters</strong> understand the unique requirements of part-time executive engagements.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              The <strong>best fractional recruitment agencies</strong> in the UK maintain networks of verified fractional CFOs, CTOs, CMOs, COOs, and other C-suite professionals. They understand that fractional hiring requires different assessment criteria: candidates must excel at rapid onboarding, managing multiple clients, and delivering impact in limited time.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Working with the <strong>best fractional recruitment agency</strong> typically costs between 10-30% of the first year's engagement value—significantly less than traditional executive search fees, which can exceed 30% of annual salary.
            </p>
          </div>
        </div>
      </section>

      {/* Why Use a Fractional Recruitment Agency */}
      <section className="py-16 bg-purple-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Why Use the Best Fractional Recruiters?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Pre-Vetted Talent',
                description: 'The best fractional recruiters maintain networks of verified executives with proven track records in part-time leadership roles.',
                icon: '✓'
              },
              {
                title: 'Faster Placement',
                description: 'Average time to placement is 2-4 weeks vs 3-6 months for traditional executive search.',
                icon: '⚡'
              },
              {
                title: 'Lower Risk',
                description: 'Fractional arrangements allow evaluation before deeper commitment. Top agencies offer replacement guarantees.',
                icon: '🛡️'
              },
              {
                title: 'Cost Savings',
                description: 'Save 40-60% compared to full-time executive hires while accessing equivalent expertise.',
                icon: '💰'
              },
              {
                title: 'Specialist Knowledge',
                description: 'The best fractional recruitment agencies understand the unique requirements of part-time executive engagements.',
                icon: '🎯'
              },
              {
                title: 'Quality Matching',
                description: 'Top fractional recruiters match executives based on industry, stage, culture fit, and specific business challenges.',
                icon: '🤝'
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Agency - Fractional.Quest */}
      {featuredAgency && (
        <FeaturedAgencySection agency={featuredAgency} />
      )}

      {/* Other Agencies List */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
            Other Top Fractional Recruiters UK
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            We've compiled a list of other reputable <strong>fractional recruiters</strong> and <strong>fractional recruitment agencies</strong> operating in the UK market.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {otherAgencies.map((agency) => (
              <AgencyCard key={agency.id} agency={agency} />
            ))}
          </div>
        </div>
      </section>

      {/* How Our Fractional Recruitment Agency Works */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
            How the Best Fractional Recruitment Agency Works
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Simple, transparent <strong>fractional recruitment</strong> with fees between 10-15% depending on the role
          </p>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Brief Us',
                description: 'Tell us about your business, challenges, and the fractional executive role you need to fill.'
              },
              {
                step: '2',
                title: 'We Match',
                description: 'We search our network of 500+ verified fractional executives and shortlist 3-5 candidates.'
              },
              {
                step: '3',
                title: 'You Interview',
                description: 'Meet shortlisted candidates directly. We facilitate introductions and provide background information.'
              },
              {
                step: '4',
                title: 'Engage & Pay',
                description: 'Agree terms directly with your chosen executive. Pay our 10-15% fee only on successful engagement.'
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-purple-700 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-purple-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Our Fractional Recruitment Fees
            </h3>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="text-3xl font-bold text-purple-700 mb-2">10%</div>
                <div className="text-gray-900 font-semibold mb-1">Standard Roles</div>
                <div className="text-sm text-gray-600">Fractional FD, HR Director, Marketing Director</div>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-sm border-2 border-purple-700">
                <div className="text-3xl font-bold text-purple-700 mb-2">12.5%</div>
                <div className="text-gray-900 font-semibold mb-1">C-Suite Roles</div>
                <div className="text-sm text-gray-600">Fractional CFO, CMO, CTO, COO</div>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="text-3xl font-bold text-purple-700 mb-2">15%</div>
                <div className="text-gray-900 font-semibold mb-1">Executive Search</div>
                <div className="text-sm text-gray-600">CEO, specialist or hard-to-fill roles</div>
              </div>
            </div>
            <p className="text-center text-gray-600 mt-6">
              All fees calculated on first 12 months' engagement value. No upfront costs. 90-day replacement guarantee.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Best Fractional Recruitment Agency FAQs
          </h2>

          <div className="space-y-6">
            {[
              {
                q: 'What is the best fractional recruitment agency?',
                a: 'The best fractional recruitment agency specialises in placing executives who work on a part-time, ongoing basis with multiple companies. Fractional.Quest is rated the #1 fractional recruitment agency in the UK, with transparent 10-15% fees, a network of 500+ verified executives, and average placement times of 2-3 weeks.'
              },
              {
                q: 'How much do the best fractional recruiters charge?',
                a: 'Top fractional recruitment agency fees typically range from 10-30% of the first year\'s engagement value. At Fractional.Quest, our fees are 10-15% depending on the role, significantly lower than traditional executive search firms which often charge 25-33% of annual salary.'
              },
              {
                q: 'How long does fractional recruitment take with the best agencies?',
                a: 'Working with the best fractional recruitment agency, you can typically expect to meet shortlisted candidates within 1-2 weeks and make a placement within 2-4 weeks. This is much faster than traditional executive search which can take 3-6 months.'
              },
              {
                q: 'What roles do top fractional recruiters fill?',
                a: 'The best fractional recruitment agencies place part-time executives across all C-suite and senior leadership roles: CFO, CTO, CMO, COO, CHRO, CISO, CPO, as well as director-level positions like Finance Director, HR Director, and Marketing Director.'
              },
              {
                q: 'Are fractional recruiters different from interim recruiters?',
                a: 'Yes. Interim recruiters place full-time executives for temporary periods (usually 3-12 months). The best fractional recruiters place part-time executives for ongoing engagements, typically 1-3 days per week on an indefinite basis.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900" id="contact">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Work with the Best Fractional Recruiters?
          </h2>
          <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
            Join hundreds of UK businesses who've found fractional CFOs, CTOs, CMOs and more through the <strong className="text-white">best fractional recruitment agency</strong> in the UK.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-900 font-bold rounded-xl hover:bg-purple-100 transition-all shadow-lg"
            >
              Contact Our Fractional Recruiters
            </Link>
            <Link
              href="/fractionaljobsuk"
              className="inline-flex items-center justify-center px-8 py-4 bg-purple-700 text-white font-bold rounded-xl hover:bg-purple-600 transition-all border border-purple-500"
            >
              Browse Fractional Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* SEO Content Footer */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-sm max-w-none text-gray-600">
            <h3 className="text-lg font-semibold text-gray-900">About the Best Fractional Recruitment Agencies in the UK</h3>
            <p>
              The UK fractional recruitment market has grown significantly as more businesses recognise the value of part-time executive leadership. The <strong>best fractional recruitment agencies</strong> like Fractional.Quest have emerged to serve this growing demand, connecting companies with experienced <strong>fractional executives</strong> who can deliver strategic leadership without the cost of full-time hires.
            </p>
            <p>
              Whether you're searching for <strong>fractional CFO recruitment</strong>, <strong>fractional CTO agencies</strong>, or <strong>fractional CMO recruiters</strong>, working with the <strong>best fractional recruitment agency</strong> ensures you access pre-vetted candidates who understand the unique demands of part-time executive work.
            </p>
            <p>
              <Link href="/top-fractional-recruitment-agencies-best-fractional-recruitment-agency-fractional-recruiter" className="text-purple-700 hover:underline">Best fractional recruitment agency</Link> | <Link href="/fractional-cfo-jobs-uk" className="text-purple-700 hover:underline">Fractional CFO Jobs</Link> | <Link href="/fractional-cto-jobs-uk" className="text-purple-700 hover:underline">Fractional CTO Jobs</Link> | <Link href="/fractional-cmo-jobs-uk" className="text-purple-700 hover:underline">Fractional CMO Jobs</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

function FeaturedAgencySection({ agency }: { agency: Agency }) {
  const highlights = agency.payload?.highlights || []
  const fee = agency.payload?.fee || '10-15%'

  return (
    <section className="py-16 md:py-20" id="fractional-quest">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="bg-purple-100 text-purple-800 px-4 py-1 rounded-full text-sm font-semibold mb-4 inline-block">
            Recommended
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            #1 Best Fractional Recruitment Agency UK
          </h2>
        </div>

        <div className="bg-gradient-to-br from-purple-700 to-purple-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">{agency.name}</h3>
              <p className="text-xl text-purple-200 mb-6">{agency.description}</p>

              {highlights.length > 0 && (
                <div className="space-y-3 mb-8">
                  {highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-purple-100">{highlight}</span>
                    </div>
                  ))}
                </div>
              )}

              {agency.specializations && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {agency.specializations.map((specialty, index) => (
                    <span key={index} className="bg-white/20 px-3 py-1 rounded-full text-sm">
                      Fractional {specialty}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-6 text-purple-200">
                <div>
                  <span className="block text-sm">Placement Fee</span>
                  <span className="text-2xl font-bold text-white">{fee}</span>
                </div>
                <div>
                  <span className="block text-sm">Location</span>
                  <span className="text-lg font-semibold text-white">{agency.headquarters}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 text-gray-900">
              <h4 className="text-2xl font-bold mb-6 text-center">Get Started Today</h4>
              <form className="space-y-4" action="/contact" method="GET">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Email</label>
                  <input
                    type="email"
                    name="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="john@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role Needed</label>
                  <select
                    name="role"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="cfo">Fractional CFO</option>
                    <option value="cto">Fractional CTO</option>
                    <option value="cmo">Fractional CMO</option>
                    <option value="coo">Fractional COO</option>
                    <option value="chro">Fractional CHRO</option>
                    <option value="other">Other Role</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-purple-700 text-white py-4 rounded-lg font-bold hover:bg-purple-800 transition-colors"
                >
                  Find Fractional Executives
                </button>
              </form>
              <p className="text-xs text-gray-500 text-center mt-4">
                No upfront fees. Pay only on successful placement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function AgencyCard({ agency }: { agency: Agency }) {
  const fee = agency.payload?.fee || 'Contact'
  const website = agency.payload?.website

  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          {agency.name}
        </h3>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Fee: {fee}
        </span>
      </div>
      <p className="text-gray-600 mb-4">{agency.description}</p>
      {agency.specializations && (
        <div className="flex flex-wrap gap-2 mb-4">
          {agency.specializations.slice(0, 4).map((specialty, i) => (
            <span key={i} className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-medium">
              {specialty}
            </span>
          ))}
        </div>
      )}
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>{agency.headquarters}</span>
        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 font-medium hover:underline"
          >
            Visit Website →
          </a>
        )}
      </div>
    </div>
  )
}
