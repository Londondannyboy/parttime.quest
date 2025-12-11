import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// Agency data
const agencies: Record<string, {
  name: string
  description: string
  longDescription: string
  specialties: string[]
  location: string
  fee: string
  website: string | null
  founded?: string
  headquarters?: string
  pros: string[]
  cons: string[]
}> = {
  'the-fractional-company': {
    name: 'The Fractional Company',
    description: 'Specialising in fractional C-suite placements for SMEs and mid-market companies across the UK.',
    longDescription: `The Fractional Company is a UK-based fractional recruitment agency that focuses on placing part-time C-suite executives with small and medium-sized enterprises. They work primarily with companies in the £2M-£50M revenue range who need senior leadership but cannot justify full-time executive hires.

Their network includes fractional CFOs, COOs, and CMOs with experience across multiple industries including technology, professional services, and consumer goods. The Fractional Company emphasises cultural fit and long-term relationship building in their placements.`,
    specialties: ['CFO', 'COO', 'CMO'],
    location: 'London',
    fee: '20-25%',
    website: 'https://thefractionalcompany.co.uk',
    founded: '2019',
    headquarters: 'London, UK',
    pros: [
      'Strong focus on SME market',
      'Thorough cultural fit assessment',
      'Good network of experienced executives'
    ],
    cons: [
      'Higher fees than some alternatives',
      'Limited to certain C-suite roles',
      'Primarily London-focused'
    ]
  },
  'portfolio-executives': {
    name: 'Portfolio Executives',
    description: 'Executive search firm with a dedicated fractional and interim practice serving PE-backed and venture-backed companies.',
    longDescription: `Portfolio Executives is an established executive search firm that has developed a dedicated fractional and interim practice. They primarily serve private equity portfolio companies and venture-backed businesses that need experienced leadership during transitions or growth phases.

Their fractional executives typically have backgrounds in PE-backed environments and understand the specific demands of investor-backed businesses. Portfolio Executives offers both fractional (ongoing part-time) and interim (full-time temporary) placements.`,
    specialties: ['CFO', 'CEO', 'COO', 'NED'],
    location: 'London, Manchester',
    fee: '25-30%',
    website: 'https://portfolioexecutives.co.uk',
    founded: '2015',
    headquarters: 'London, UK',
    pros: [
      'Strong PE/VC network',
      'Experienced in investor-backed environments',
      'Can provide both fractional and interim'
    ],
    cons: [
      'Premium pricing',
      'May be over-qualified for smaller businesses',
      'Less suited to bootstrapped companies'
    ]
  },
  'leathwaite': {
    name: 'Leathwaite',
    description: 'Global executive search firm offering fractional and interim CFO placements for large enterprises.',
    longDescription: `Leathwaite is a global executive search firm headquartered in London with offices worldwide. While primarily known for permanent executive placements, they have developed a fractional and interim practice focused primarily on finance leadership roles.

Their fractional CFO practice serves larger enterprises and multinational companies that need senior finance leadership on a flexible basis. Leathwaite's global reach makes them suitable for companies with international operations requiring executives who can operate across multiple jurisdictions.`,
    specialties: ['CFO', 'Finance Director'],
    location: 'London, Global',
    fee: '30%+',
    website: 'https://leathwaite.com',
    founded: '1999',
    headquarters: 'London, UK (Global)',
    pros: [
      'Global reach and network',
      'Very senior executive pool',
      'Strong in multinational placements'
    ],
    cons: [
      'Premium enterprise pricing',
      'Limited to finance roles',
      'May be too large for SME needs'
    ]
  },
  'fd-capital': {
    name: 'FD Capital',
    description: 'Specialist fractional Finance Director and CFO recruitment agency for growing businesses.',
    longDescription: `FD Capital is a specialist recruitment agency focused exclusively on Finance Director and CFO placements, including fractional arrangements. They work with businesses across the UK, from startups to established mid-market companies.

Their network consists primarily of qualified accountants (ACA, ACCA, CIMA) with commercial finance experience. FD Capital offers both fractional (part-time ongoing) and interim (full-time temporary) finance leadership placements.`,
    specialties: ['CFO', 'FD', 'Finance Director'],
    location: 'London, Remote',
    fee: '20-25%',
    website: 'https://fd-capital.co.uk',
    founded: '2018',
    headquarters: 'London, UK',
    pros: [
      'Deep finance specialism',
      'Good network of qualified accountants',
      'Flexible remote options'
    ],
    cons: [
      'Limited to finance roles only',
      'Less suited for non-finance executive needs',
      'Variable candidate experience levels'
    ]
  },
  'exec-capital': {
    name: 'Exec Capital',
    description: 'Fractional and interim executive recruitment focusing on technology and digital businesses.',
    longDescription: `Exec Capital specialises in executive recruitment for technology and digital businesses, offering both fractional and interim placements. They focus on tech-savvy leaders who understand digital transformation and modern technology stacks.

Their network includes fractional CTOs, CPOs, and CMOs with backgrounds in SaaS, fintech, e-commerce, and digital agencies. Exec Capital is particularly strong in placing product and technology leadership.`,
    specialties: ['CTO', 'CPO', 'CMO'],
    location: 'London',
    fee: '22-28%',
    website: 'https://execcapital.co.uk',
    founded: '2017',
    headquarters: 'London, UK',
    pros: [
      'Strong tech industry focus',
      'Good product leadership network',
      'Understanding of digital businesses'
    ],
    cons: [
      'Less suited for traditional industries',
      'Limited finance leadership',
      'London-centric'
    ]
  },
  'growcfo': {
    name: 'GrowCFO',
    description: 'Community and placement service for fractional and part-time CFOs, particularly for startups and scale-ups.',
    longDescription: `GrowCFO operates as both a community platform and placement service for finance leaders. Their model combines networking, professional development, and recruitment services specifically for CFOs and Finance Directors.

They work primarily with startups and scale-ups, connecting them with CFOs who have experience in high-growth environments. GrowCFO's community model means their candidates are often actively engaged in professional development and peer learning.`,
    specialties: ['CFO', 'FD'],
    location: 'UK-wide, Remote',
    fee: '15-20%',
    website: 'https://growcfo.net',
    founded: '2020',
    headquarters: 'UK (Remote)',
    pros: [
      'Lower fees than traditional agencies',
      'Strong startup/scale-up focus',
      'Active community of engaged CFOs'
    ],
    cons: [
      'Limited to finance roles',
      'Newer entrant to market',
      'Less suited for enterprise needs'
    ]
  },
  'the-cfo-centre': {
    name: 'The CFO Centre',
    description: 'Global network of part-time CFOs and FDs with offices across the UK.',
    longDescription: `The CFO Centre is a global franchise network providing part-time CFO and Finance Director services. Rather than a traditional recruitment model, they employ CFOs directly who then work with multiple clients through the network.

Their model provides consistency and backup coverage, as clients work with The CFO Centre brand rather than individual freelancers. They have offices across the UK and internationally, serving businesses from startups to large enterprises.`,
    specialties: ['CFO', 'FD'],
    location: 'UK-wide, Global',
    fee: 'Varies (employed model)',
    website: 'https://cfocentre.com',
    founded: '2001',
    headquarters: 'UK (Global Franchise)',
    pros: [
      'Established global brand',
      'Backup coverage if CFO unavailable',
      'Consistent service delivery model'
    ],
    cons: [
      'Less flexibility than direct hire',
      'Premium pricing for the model',
      'Limited to finance roles'
    ]
  }
}

export async function generateStaticParams() {
  return Object.keys(agencies).map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const agency = agencies[slug]

  if (!agency) {
    return {
      title: 'Agency Not Found',
    }
  }

  return {
    title: `${agency.name} Review | Fractional Recruitment Agency UK`,
    description: `${agency.name} fractional recruitment agency review. ${agency.description} Compare fees, specialties, and find alternatives.`,
    openGraph: {
      title: `${agency.name} | Fractional Recruitment Agency Review`,
      description: agency.description,
      type: 'website',
    },
  }
}

export default async function AgencyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const agency = agencies[slug]

  if (!agency) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-purple-700">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/agencies" className="text-gray-500 hover:text-purple-700">Fractional Recruitment Agencies</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">{agency.name}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="bg-white py-12 border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {agency.name}
              </h1>
              <p className="text-xl text-gray-600 mb-4">{agency.description}</p>
              <div className="flex flex-wrap gap-2">
                {agency.specialties.map((specialty, index) => (
                  <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    Fractional {specialty}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {agency.website && (
                <a
                  href={agency.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Visit Website
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
              <Link
                href="/agencies#fractional-quest"
                className="inline-flex items-center justify-center px-6 py-3 bg-purple-700 text-white font-medium rounded-lg hover:bg-purple-800 transition-colors"
              >
                Compare with Fractional.Quest
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              {/* Overview */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
                <div className="prose prose-gray max-w-none">
                  {agency.longDescription.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-600 mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Pros & Cons */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-green-500">✓</span> Pros
                  </h3>
                  <ul className="space-y-3">
                    {agency.pros.map((pro, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-600">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-red-500">✗</span> Cons
                  </h3>
                  <ul className="space-y-3">
                    {agency.cons.map((con, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-600">
                        <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Facts */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Facts</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm text-gray-500">Placement Fee</dt>
                    <dd className="text-lg font-semibold text-gray-900">{agency.fee}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Location</dt>
                    <dd className="text-lg font-semibold text-gray-900">{agency.location}</dd>
                  </div>
                  {agency.founded && (
                    <div>
                      <dt className="text-sm text-gray-500">Founded</dt>
                      <dd className="text-lg font-semibold text-gray-900">{agency.founded}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm text-gray-500">Specialties</dt>
                    <dd className="text-gray-900">{agency.specialties.join(', ')}</dd>
                  </div>
                </dl>
              </div>

              {/* CTA Box */}
              <div className="bg-gradient-to-br from-purple-700 to-purple-900 rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-2">Looking for alternatives?</h3>
                <p className="text-purple-200 text-sm mb-4">
                  Fractional.Quest offers lower fees (10-15%) and a wider network of verified fractional executives.
                </p>
                <Link
                  href="/agencies#fractional-quest"
                  className="block w-full bg-white text-purple-900 text-center py-3 rounded-lg font-semibold hover:bg-purple-100 transition-colors"
                >
                  Compare Options
                </Link>
              </div>

              {/* Back Link */}
              <div className="text-center">
                <Link
                  href="/agencies"
                  className="text-purple-700 hover:text-purple-900 font-medium inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  View All Fractional Recruitment Agencies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Content */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Guides</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/what-is-fractional-executive" className="bg-gray-50 rounded-xl p-6 hover:bg-purple-50 transition-colors group">
              <h3 className="font-bold text-gray-900 group-hover:text-purple-700 mb-2">What Is a Fractional Executive?</h3>
              <p className="text-sm text-gray-600">Complete guide to understanding fractional leadership roles.</p>
            </Link>
            <Link href="/how-to-hire-a-fractional-executive" className="bg-gray-50 rounded-xl p-6 hover:bg-purple-50 transition-colors group">
              <h3 className="font-bold text-gray-900 group-hover:text-purple-700 mb-2">How to Hire a Fractional Executive</h3>
              <p className="text-sm text-gray-600">Step-by-step hiring guide for UK businesses.</p>
            </Link>
            <Link href="/fractional-executive-salary-guide-2025" className="bg-gray-50 rounded-xl p-6 hover:bg-purple-50 transition-colors group">
              <h3 className="font-bold text-gray-900 group-hover:text-purple-700 mb-2">Fractional Executive Salary Guide</h3>
              <p className="text-sm text-gray-600">2025 rates and compensation benchmarks.</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
