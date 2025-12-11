import { Metadata } from 'next'
import Link from 'next/link'
import { SavingsCalculator } from '@/components/SavingsCalculator'

export const metadata: Metadata = {
  title: 'Top Fractional Recruitment Agencies UK | Best Fractional Recruiters 2025',
  description: 'Compare the best fractional recruitment agencies in the UK. Find fractional executives, fractional recruiters, and fractional talent. Save 40-60% vs full-time hires.',
  keywords: 'fractional recruitment agencies, fractional recruiters, fractional recruitment agency, top fractional recruitment agencies, best fractional recruiters uk, fractional executive recruitment',
  openGraph: {
    title: 'Top Fractional Recruitment Agencies UK | Best Fractional Recruiters 2025',
    description: 'Compare the best fractional recruitment agencies in the UK. Find fractional executives and save 40-60% vs full-time hires.',
    type: 'website',
    url: 'https://fractional.quest/agencies',
  },
}

// Agency data - Fractional.quest first, then others
const agencies = [
  {
    name: 'Fractional.Quest',
    slug: 'fractional-quest',
    description: 'The UK\'s dedicated marketplace for fractional executives and specialist talent. Direct connections with verified fractional CFOs, CTOs, CMOs, and COOs.',
    specialties: ['CFO', 'CTO', 'CMO', 'COO', 'CHRO', 'CISO'],
    location: 'London, UK-wide',
    fee: '10-15%',
    featured: true,
    website: null, // Internal
    highlights: [
      'Direct access to 500+ verified fractional executives',
      'Transparent 10-15% placement fees',
      'No upfront costs - pay only on successful placement',
      'Average time to placement: 2-3 weeks',
      'Specialised in tech, finance, and growth-stage companies'
    ]
  },
  {
    name: 'The Fractional Company',
    slug: 'the-fractional-company',
    description: 'Specialising in fractional C-suite placements for SMEs and mid-market companies across the UK.',
    specialties: ['CFO', 'COO', 'CMO'],
    location: 'London',
    fee: '20-25%',
    featured: false,
    website: 'https://thefractionalcompany.co.uk',
    highlights: []
  },
  {
    name: 'Portfolio Executives',
    slug: 'portfolio-executives',
    description: 'Executive search firm with a dedicated fractional and interim practice serving PE-backed and venture-backed companies.',
    specialties: ['CFO', 'CEO', 'COO', 'NED'],
    location: 'London, Manchester',
    fee: '25-30%',
    featured: false,
    website: 'https://portfolioexecutives.co.uk',
    highlights: []
  },
  {
    name: 'Leathwaite',
    slug: 'leathwaite',
    description: 'Global executive search firm offering fractional and interim CFO placements for large enterprises.',
    specialties: ['CFO', 'Finance Director'],
    location: 'London, Global',
    fee: '30%+',
    featured: false,
    website: 'https://leathwaite.com',
    highlights: []
  },
  {
    name: 'FD Capital',
    slug: 'fd-capital',
    description: 'Specialist fractional Finance Director and CFO recruitment agency for growing businesses.',
    specialties: ['CFO', 'FD', 'Finance Director'],
    location: 'London, Remote',
    fee: '20-25%',
    featured: false,
    website: 'https://fd-capital.co.uk',
    highlights: []
  },
  {
    name: 'Exec Capital',
    slug: 'exec-capital',
    description: 'Fractional and interim executive recruitment focusing on technology and digital businesses.',
    specialties: ['CTO', 'CPO', 'CMO'],
    location: 'London',
    fee: '22-28%',
    featured: false,
    website: 'https://execcapital.co.uk',
    highlights: []
  },
  {
    name: 'GrowCFO',
    slug: 'growcfo',
    description: 'Community and placement service for fractional and part-time CFOs, particularly for startups and scale-ups.',
    specialties: ['CFO', 'FD'],
    location: 'UK-wide, Remote',
    fee: '15-20%',
    featured: false,
    website: 'https://growcfo.net',
    highlights: []
  },
  {
    name: 'The CFO Centre',
    slug: 'the-cfo-centre',
    description: 'Global network of part-time CFOs and FDs with offices across the UK.',
    specialties: ['CFO', 'FD'],
    location: 'UK-wide, Global',
    fee: 'Varies',
    featured: false,
    website: 'https://cfocentre.com',
    highlights: []
  }
]

export default function AgenciesPage() {
  const featuredAgency = agencies.find(a => a.featured)
  const otherAgencies = agencies.filter(a => !a.featured)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Top Fractional Recruitment Agencies UK
            </h1>
            <p className="text-xl md:text-2xl text-purple-200 mb-8">
              Find the best <strong className="text-white">fractional recruiters</strong> and <strong className="text-white">fractional recruitment agencies</strong> to hire fractional executives for your business
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
            What Are Fractional Recruitment Agencies?
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-xl leading-relaxed mb-6">
              <strong>Fractional recruitment agencies</strong> specialise in connecting businesses with experienced executives who work on a part-time, ongoing basis. Unlike traditional recruitment agencies that place full-time employees, <strong>fractional recruiters</strong> understand the unique requirements of part-time executive engagements.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              The best <strong>fractional recruitment agencies</strong> in the UK maintain networks of verified fractional CFOs, CTOs, CMOs, COOs, and other C-suite professionals. They understand that fractional hiring requires different assessment criteria: candidates must excel at rapid onboarding, managing multiple clients, and delivering impact in limited time.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Working with a specialist <strong>fractional recruitment agency</strong> typically costs between 10-30% of the first year's engagement value—significantly less than traditional executive search fees, which can exceed 30% of annual salary.
            </p>
          </div>
        </div>
      </section>

      {/* Why Use a Fractional Recruitment Agency */}
      <section className="py-16 bg-purple-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Why Use a Fractional Recruitment Agency?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Pre-Vetted Talent',
                description: 'Fractional recruiters maintain networks of verified executives with proven track records in part-time leadership roles.',
                icon: '✓'
              },
              {
                title: 'Faster Placement',
                description: 'Average time to placement is 2-4 weeks vs 3-6 months for traditional executive search.',
                icon: '⚡'
              },
              {
                title: 'Lower Risk',
                description: 'Fractional arrangements allow evaluation before deeper commitment. Many agencies offer replacement guarantees.',
                icon: '🛡️'
              },
              {
                title: 'Cost Savings',
                description: 'Save 40-60% compared to full-time executive hires while accessing equivalent expertise.',
                icon: '💰'
              },
              {
                title: 'Specialist Knowledge',
                description: 'Fractional recruitment agencies understand the unique requirements of part-time executive engagements.',
                icon: '🎯'
              },
              {
                title: 'Quality Matching',
                description: 'Agencies match executives based on industry, stage, culture fit, and specific business challenges.',
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
        <section className="py-16 md:py-20" id="fractional-quest">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="bg-purple-100 text-purple-800 px-4 py-1 rounded-full text-sm font-semibold mb-4 inline-block">
                Recommended
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                #1 Fractional Recruitment Agency UK
              </h2>
            </div>

            <div className="bg-gradient-to-br from-purple-700 to-purple-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-4">{featuredAgency.name}</h3>
                  <p className="text-xl text-purple-200 mb-6">{featuredAgency.description}</p>

                  <div className="space-y-3 mb-8">
                    {featuredAgency.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-purple-100">{highlight}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {featuredAgency.specialties.map((specialty, index) => (
                      <span key={index} className="bg-white/20 px-3 py-1 rounded-full text-sm">
                        Fractional {specialty}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-6 text-purple-200">
                    <div>
                      <span className="block text-sm">Placement Fee</span>
                      <span className="text-2xl font-bold text-white">{featuredAgency.fee}</span>
                    </div>
                    <div>
                      <span className="block text-sm">Location</span>
                      <span className="text-lg font-semibold text-white">{featuredAgency.location}</span>
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
      )}

      {/* Other Agencies List */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
            Other Fractional Recruitment Agencies UK
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            We've compiled a list of other reputable <strong>fractional recruiters</strong> and <strong>fractional recruitment agencies</strong> operating in the UK market.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {otherAgencies.map((agency, index) => (
              <Link
                key={index}
                href={`/agencies/${agency.slug}`}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-gray-100 hover:border-purple-200 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                    {agency.name}
                  </h3>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    Fee: {agency.fee}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{agency.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {agency.specialties.slice(0, 4).map((specialty, i) => (
                    <span key={i} className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-medium">
                      {specialty}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{agency.location}</span>
                  <span className="text-purple-600 font-medium group-hover:underline">
                    View Profile →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How Our Fractional Recruitment Agency Works */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
            How Our Fractional Recruitment Agency Works
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
            Fractional Recruitment Agency FAQs
          </h2>

          <div className="space-y-6">
            {[
              {
                q: 'What is a fractional recruitment agency?',
                a: 'A fractional recruitment agency specialises in placing executives who work on a part-time, ongoing basis with multiple companies. Unlike traditional recruiters, fractional recruitment agencies understand the unique requirements of part-time executive engagements and maintain networks of professionals experienced in fractional work.'
              },
              {
                q: 'How much do fractional recruiters charge?',
                a: 'Fractional recruitment agency fees typically range from 10-30% of the first year\'s engagement value. At Fractional.Quest, our fees are 10-15% depending on the role, significantly lower than traditional executive search firms which often charge 25-33% of annual salary.'
              },
              {
                q: 'How long does fractional recruitment take?',
                a: 'Working with a specialist fractional recruitment agency, you can typically expect to meet shortlisted candidates within 1-2 weeks and make a placement within 2-4 weeks. This is much faster than traditional executive search which can take 3-6 months.'
              },
              {
                q: 'What roles do fractional recruitment agencies fill?',
                a: 'Fractional recruitment agencies place part-time executives across all C-suite and senior leadership roles: CFO, CTO, CMO, COO, CHRO, CISO, CPO, as well as director-level positions like Finance Director, HR Director, and Marketing Director.'
              },
              {
                q: 'Are fractional recruiters different from interim recruiters?',
                a: 'Yes. Interim recruiters place full-time executives for temporary periods (usually 3-12 months). Fractional recruiters place part-time executives for ongoing engagements, typically 1-3 days per week on an indefinite basis.'
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
            Ready to Hire a Fractional Executive?
          </h2>
          <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
            Join hundreds of UK businesses who've found fractional CFOs, CTOs, CMOs and more through our <strong className="text-white">fractional recruitment agency</strong>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-900 font-bold rounded-xl hover:bg-purple-100 transition-all shadow-lg"
            >
              Contact Our Fractional Recruiters
            </Link>
            <Link
              href="/fractional-jobs"
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
            <h3 className="text-lg font-semibold text-gray-900">About Fractional Recruitment Agencies in the UK</h3>
            <p>
              The UK fractional recruitment market has grown significantly as more businesses recognise the value of part-time executive leadership. <strong>Fractional recruitment agencies</strong> like Fractional.Quest have emerged to serve this growing demand, connecting companies with experienced <strong>fractional executives</strong> who can deliver strategic leadership without the cost of full-time hires.
            </p>
            <p>
              Whether you're searching for <strong>fractional CFO recruitment</strong>, <strong>fractional CTO agencies</strong>, or <strong>fractional CMO recruiters</strong>, working with a specialist <strong>fractional recruitment agency</strong> ensures you access pre-vetted candidates who understand the unique demands of part-time executive work.
            </p>
            <p>
              <Link href="/agencies" className="text-purple-700 hover:underline">Fractional recruitment agencies</Link> | <Link href="/fractional-cfo-jobs-uk" className="text-purple-700 hover:underline">Fractional CFO Jobs</Link> | <Link href="/fractional-cto-jobs-uk" className="text-purple-700 hover:underline">Fractional CTO Jobs</Link> | <Link href="/fractional-cmo-jobs-uk" className="text-purple-700 hover:underline">Fractional CMO Jobs</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
