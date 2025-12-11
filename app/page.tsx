import Link from "next/link";
import { createDbQuery } from "@/lib/db";
import { FractionalCalculator } from "@/components/FractionalCalculator";
import { JobCard } from "@/components/JobCard";

// Revalidate homepage every hour
export const revalidate = 3600

interface HomepageSection {
  section_type: string
  section_order: number
  title: string
  subtitle: string
  content: any
}

interface RoleItem {
  icon: string
  name: string
  count: number
  description: string
}

interface BenefitItem {
  icon: string
  title: string
  description: string
}

interface HowItWorksStep {
  step: string
  title: string
  description: string
}

interface Testimonial {
  name: string
  role: string
  quote: string
  companies: string
}

interface Agency {
  name: string
  specialty: string
}

async function getHomepageContent(): Promise<HomepageSection[]> {
  try {
    const sql = createDbQuery()
    const sections = await sql`
      SELECT section_type, section_order, title, subtitle, content
      FROM homepage_content
      WHERE site = 'fractional' AND is_active = true
      ORDER BY section_order ASC
    `
    return sections as HomepageSection[]
  } catch (error) {
    console.error('Error fetching homepage content:', error)
    return []
  }
}

async function getJobStats() {
  try {
    const sql = createDbQuery()
    const result = await sql`
      SELECT COUNT(*) as total FROM jobs WHERE is_active = true
    `
    return parseInt((result[0] as any)?.total || '0')
  } catch (error) {
    return 500 // Fallback
  }
}

async function getFeaturedJobs() {
  try {
    const sql = createDbQuery()
    const jobs = await sql`
      SELECT
        id,
        slug,
        title,
        company_name,
        location,
        is_remote,
        workplace_type,
        compensation,
        role_category,
        skills_required,
        posted_date,
        description_snippet
      FROM jobs
      WHERE is_active = true
      ORDER BY posted_date DESC NULLS LAST
      LIMIT 6
    `
    return jobs
  } catch (error) {
    console.error('Error fetching featured jobs:', error)
    return []
  }
}

async function getDetailedStats() {
  try {
    const sql = createDbQuery()
    const [londonJobs, remoteJobs, avgRateResult] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM jobs WHERE is_active = true AND location ILIKE '%london%'`,
      sql`SELECT COUNT(*) as count FROM jobs WHERE is_active = true AND (is_remote = true OR workplace_type = 'Remote')`,
      sql`SELECT AVG(CAST(REGEXP_REPLACE(compensation, '[^0-9]', '', 'g') AS INTEGER)) as avg FROM jobs WHERE is_active = true AND compensation IS NOT NULL AND compensation ~ '^[£$]?[0-9]+'`
    ])
    return {
      londonJobs: parseInt((londonJobs[0] as any)?.count || '0'),
      remoteJobs: parseInt((remoteJobs[0] as any)?.count || '0'),
      avgDayRate: Math.round(parseFloat((avgRateResult[0] as any)?.avg || '850'))
    }
  } catch (error) {
    return { londonJobs: 85, remoteJobs: 60, avgDayRate: 950 }
  }
}

async function getLatestArticles() {
  try {
    const sql = createDbQuery()
    const articles = await sql`
      SELECT slug, title, description, published_date
      FROM articles
      WHERE status = 'published' AND app = 'fractional'
      ORDER BY published_date DESC
      LIMIT 3
    `
    return articles
  } catch (error) {
    return []
  }
}

export default async function Home() {
  const [sections, totalJobs, featuredJobs, detailedStats, latestArticles] = await Promise.all([
    getHomepageContent(),
    getJobStats(),
    getFeaturedJobs(),
    getDetailedStats(),
    getLatestArticles()
  ])

  // Extract sections by type
  const rolesSection = sections.find(s => s.section_type === 'roles')
  const benefitsSection = sections.find(s => s.section_type === 'benefits')
  const howItWorksSection = sections.find(s => s.section_type === 'how_it_works')
  const testimonialsSection = sections.find(s => s.section_type === 'testimonials')
  const agenciesSection = sections.find(s => s.section_type === 'agencies')

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="heroGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#heroGrid)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col items-center text-center">
            <div className="inline-block mb-6">
              <span className="bg-purple-700/50 backdrop-blur text-white px-5 py-2.5 rounded-full text-sm font-medium border border-purple-500/30">
                🚀 The UK's #1 Fractional Executive Platform
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
              Fractional <span className="text-purple-300">Executives</span>
              <br />& Specialized Talent
            </h1>

            <p className="max-w-2xl text-xl text-purple-100 mb-10 leading-relaxed">
              Connect with experienced fractional CFOs, CMOs, CTOs, and specialized experts.
              Build your dream team without long-term commitments.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/fractional-jobs"
                className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-lg bg-white text-purple-900 hover:bg-purple-50 transition-all duration-200 min-h-14"
              >
                Browse {totalJobs}+ Jobs →
              </Link>
              <Link
                href="/contact/companies"
                className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-lg border-2 border-white text-white hover:bg-white/10 transition-all duration-200 min-h-14"
              >
                Post a Position
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-purple-200 text-sm">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Updated every 15 minutes
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified executives
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                UK-focused roles
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-black text-purple-700">{totalJobs}+</div>
              <div className="text-gray-600 font-medium">Fractional Jobs UK</div>
            </div>
            <div>
              <div className="text-4xl font-black text-purple-700">{detailedStats.londonJobs}+</div>
              <div className="text-gray-600 font-medium">London Opportunities</div>
            </div>
            <div>
              <div className="text-4xl font-black text-purple-700">£{detailedStats.avgDayRate}</div>
              <div className="text-gray-600 font-medium">Average Day Rate</div>
            </div>
            <div>
              <div className="text-4xl font-black text-purple-700">{detailedStats.remoteJobs}+</div>
              <div className="text-gray-600 font-medium">Remote Positions</div>
            </div>
          </div>
        </div>
      </section>

      {/* What Are Fractional Jobs? - SEO Content */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">What Are Fractional Jobs?</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Fractional jobs are part-time executive roles where experienced professionals work with companies for a fraction of the week. Instead of one full-time position, you work 1-3 days per week with multiple companies, delivering strategic impact while maintaining flexibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">⏰</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Part-Time Leadership</h3>
              <p className="text-gray-600">
                Work 1-3 days per week per client. Maintain flexibility while delivering strategic impact. Fractional executives typically work with 2-4 companies simultaneously.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🏢</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Portfolio Career</h3>
              <p className="text-gray-600">
                Build a diverse portfolio working with multiple companies. Diversify your income streams and gain experience across different industries, stages, and challenges.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">💼</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Executive Expertise</h3>
              <p className="text-gray-600">
                Companies get senior CFO, CMO, CTO, COO, and HR expertise without the cost of a full-time executive hire. Perfect for startups, scale-ups, and SMEs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section - From Neon */}
      {rolesSection && (
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{rolesSection.title}</h2>
              <p className="text-xl text-gray-600">{rolesSection.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(rolesSection.content as RoleItem[]).map((role, i) => (
                <Link
                  key={i}
                  href={`/fractional-jobs?role=${encodeURIComponent(role.name.replace('Fractional ', '').split(' ')[0])}`}
                  className="group"
                >
                  <div className="p-6 bg-gray-50 rounded-xl hover:bg-purple-50 hover:shadow-lg transition-all duration-200 border border-transparent hover:border-purple-200">
                    <div className="flex items-start gap-4">
                      <span className="text-4xl">{role.icon}</span>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors mb-1">
                          {role.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">{role.description}</p>
                        <span className="inline-flex items-center gap-1 text-purple-700 font-semibold text-sm">
                          {role.count} jobs available
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits Section - From Neon */}
      {benefitsSection && (
        <section className="py-20 md:py-28 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{benefitsSection.title}</h2>
              <p className="text-xl text-gray-600">{benefitsSection.subtitle}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {(benefitsSection.content as BenefitItem[]).map((benefit, i) => (
                <div key={i} className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-4xl mb-4 block">{benefit.icon}</span>
                  <h3 className="font-bold text-gray-900 mb-1">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How It Works Section - From Neon */}
      {howItWorksSection && (
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{howItWorksSection.title}</h2>
              <p className="text-xl text-gray-600">{howItWorksSection.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {(howItWorksSection.content as HowItWorksStep[]).map((step, i) => (
                <div key={i} className="relative">
                  {i < (howItWorksSection.content as HowItWorksStep[]).length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-purple-200 -translate-x-1/2" />
                  )}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-700 rounded-full text-2xl font-bold mb-4">
                      {step.step}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section - From Neon */}
      {testimonialsSection && (
        <section className="py-20 md:py-28 bg-purple-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">{testimonialsSection.title}</h2>
              <p className="text-xl text-purple-200">{testimonialsSection.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(testimonialsSection.content as Testimonial[]).map((testimonial, i) => (
                <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-8 border border-white/20">
                  <p className="text-white text-lg mb-6 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-white">{testimonial.name}</p>
                      <p className="text-purple-200 text-sm">{testimonial.role}</p>
                      <p className="text-purple-300 text-xs">{testimonial.companies}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Partner Agencies Section - From Neon */}
      {agenciesSection && (
        <section className="py-20 md:py-28 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{agenciesSection.title}</h2>
              <p className="text-xl text-gray-600">{agenciesSection.subtitle}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {(agenciesSection.content as Agency[]).map((agency, i) => (
                <div key={i} className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-purple-700">{agency.name.charAt(0)}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{agency.name}</h3>
                  <p className="text-sm text-gray-600">{agency.specialty}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Calculator Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Calculate Your Earning Potential</h2>
            <p className="text-xl text-purple-200">See how much you could earn as a fractional executive</p>
          </div>
          <FractionalCalculator />
        </div>
      </section>

      {/* Featured Jobs Section */}
      {featuredJobs.length > 0 && (
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest Fractional Opportunities</h2>
              <p className="text-xl text-gray-600">Fresh roles added every 15 minutes</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {(featuredJobs as any[]).map((job: any) => {
                const postedDate = job.posted_date ? new Date(job.posted_date) : null
                const postedDaysAgo = postedDate
                  ? Math.floor((Date.now() - postedDate.getTime()) / (1000 * 60 * 60 * 24))
                  : undefined

                return (
                  <Link key={job.id} href={`/fractional-job/${job.slug}`}>
                    <JobCard
                      title={job.title}
                      company={job.company_name}
                      location={job.location || 'Location TBD'}
                      isRemote={job.is_remote || job.workplace_type === 'Remote'}
                      compensation={job.compensation}
                      roleCategory={job.role_category}
                      skills={job.skills_required || []}
                      postedDaysAgo={postedDaysAgo}
                    />
                  </Link>
                )
              })}
            </div>
            <div className="text-center">
              <Link
                href="/fractional-jobs"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-purple-700 text-white hover:bg-purple-800 transition-all duration-200"
              >
                View All {totalJobs}+ Jobs →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Latest Articles Section */}
      {(latestArticles as any[]).length > 0 && (
        <section className="py-20 md:py-28 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest Fractional Career Guides</h2>
                <p className="text-xl text-gray-600">Expert insights on building a successful fractional career</p>
              </div>
              <Link
                href="/fractional-jobs-articles"
                className="hidden md:inline-flex items-center text-purple-700 font-semibold hover:text-purple-900 transition-colors"
              >
                View all articles →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(latestArticles as any[]).map((article: any) => (
                <Link key={article.slug} href={`/${article.slug}`} className="group">
                  <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200">
                    <div className="h-48 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                      <span className="text-6xl">📚</span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors mb-3 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{article.description}</p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center md:hidden">
              <Link
                href="/fractional-jobs-articles"
                className="inline-flex items-center text-purple-700 font-semibold hover:text-purple-900 transition-colors"
              >
                View all articles →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section - SEO Rich */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about fractional executive careers in the UK</p>
          </div>

          <div className="space-y-6">
            <details className="group bg-gray-50 rounded-xl p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                What is a fractional job?
                <span className="text-purple-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                A fractional job is a part-time executive role where you work 1-3 days per week providing strategic leadership without full-time commitment. Fractional executives typically work with 2-4 companies simultaneously, offering their expertise as a Fractional CFO, CMO, CTO, COO, or HR Director. This model allows companies to access senior talent at a fraction of the cost of a full-time hire.
              </p>
            </details>

            <details className="group bg-gray-50 rounded-xl p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                How much do fractional executives earn in the UK?
                <span className="text-purple-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Fractional executives in the UK typically earn £600-£1,500 per day depending on seniority and expertise. Many fractional executives earn £150,000-£300,000+ annually by working with 2-4 clients. Fractional CFOs and CTOs often command the highest rates, while the average day rate across all fractional roles is approximately £{detailedStats.avgDayRate}.
              </p>
            </details>

            <details className="group bg-gray-50 rounded-xl p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                Do I need to be based in London for fractional work?
                <span className="text-purple-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                No, while London has the most fractional opportunities ({detailedStats.londonJobs}+ roles currently), many fractional positions are remote or hybrid. Birmingham, Manchester, Edinburgh, and Bristol all have growing fractional markets. Currently, we have {detailedStats.remoteJobs}+ remote fractional positions available across the UK.
              </p>
            </details>

            <details className="group bg-gray-50 rounded-xl p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                How many clients should a fractional executive work with?
                <span className="text-purple-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Most fractional executives work with 2-4 clients simultaneously to diversify income while maintaining quality delivery to each client. Working with fewer clients allows deeper engagement, while more clients provide income security. The ideal number depends on the complexity of each role and your personal working style.
              </p>
            </details>

            <details className="group bg-gray-50 rounded-xl p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                What's the difference between fractional and interim roles?
                <span className="text-purple-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Interim roles are typically full-time positions for a fixed period (3-12 months) to cover gaps or manage transitions. Fractional roles are ongoing part-time positions where you work 1-3 days per week indefinitely. Fractional work offers more flexibility and the ability to work with multiple clients, while interim work provides deeper immersion in a single company.
              </p>
            </details>

            <details className="group bg-gray-50 rounded-xl p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                What experience do I need for fractional executive roles?
                <span className="text-purple-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Most fractional executive positions require 10-20+ years of experience with a proven track record in senior leadership roles. Companies hiring fractional executives want someone who can hit the ground running and deliver strategic impact quickly. Experience in startups, scale-ups, or PE-backed companies is particularly valuable.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Internal Links Section - SEO */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular Fractional Executive Resources</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* By Role */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Fractional Jobs by Role</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/fractional-cfo-jobs-uk" className="hover:text-purple-700 transition-colors">Fractional CFO Jobs UK</Link></li>
                <li><Link href="/fractional-cmo-jobs-uk" className="hover:text-purple-700 transition-colors">Fractional CMO Jobs UK</Link></li>
                <li><Link href="/fractional-cto-jobs-uk" className="hover:text-purple-700 transition-colors">Fractional CTO Jobs UK</Link></li>
                <li><Link href="/fractional-coo-jobs-uk" className="hover:text-purple-700 transition-colors">Fractional COO Jobs UK</Link></li>
                <li><Link href="/fractional-hr-jobs-uk" className="hover:text-purple-700 transition-colors">Fractional HR Jobs UK</Link></li>
              </ul>
            </div>

            {/* By Location */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Fractional Jobs by Location</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/fractional-jobs-london" className="hover:text-purple-700 transition-colors">Fractional Jobs London</Link></li>
                <li><Link href="/fractional-jobs-manchester" className="hover:text-purple-700 transition-colors">Fractional Jobs Manchester</Link></li>
                <li><Link href="/fractional-jobs-birmingham" className="hover:text-purple-700 transition-colors">Fractional Jobs Birmingham</Link></li>
                <li><Link href="/fractional-jobs-edinburgh" className="hover:text-purple-700 transition-colors">Fractional Jobs Edinburgh</Link></li>
                <li><Link href="/remote-fractional-jobs" className="hover:text-purple-700 transition-colors">Remote Fractional Jobs</Link></li>
              </ul>
            </div>

            {/* Guides */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Fractional Executive Guides</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/how-to-become-a-fractional-executive" className="hover:text-purple-700 transition-colors">How to Become a Fractional Executive</Link></li>
                <li><Link href="/fractional-executive-salary-uk" className="hover:text-purple-700 transition-colors">Fractional Executive Salary UK</Link></li>
                <li><Link href="/what-is-fractional-work" className="hover:text-purple-700 transition-colors">What is Fractional Work?</Link></li>
                <li><Link href="/fractional-vs-interim" className="hover:text-purple-700 transition-colors">Fractional vs Interim Roles</Link></li>
                <li><Link href="/fractional-jobs-articles" className="hover:text-purple-700 transition-colors">All Fractional Career Guides</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Fractional Career?
          </h2>
          <p className="text-xl text-purple-100 mb-10">
            Browse {totalJobs}+ fractional executive opportunities across the UK today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/fractional-jobs"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-lg bg-white text-purple-900 hover:bg-purple-50 transition-all duration-200"
            >
              Find Your Perfect Role →
            </Link>
            <Link
              href="/fractional-jobs-articles"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-lg border-2 border-white text-white hover:bg-white hover:text-purple-900 transition-all duration-200"
            >
              Read Career Guides
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
