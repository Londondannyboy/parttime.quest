import Link from "next/link";
import { Metadata } from "next";
import { createDbQuery } from "@/lib/db";
import { FractionalCalculator } from "@/components/FractionalCalculator";
import { JobCard } from "@/components/JobCard";
import { AuthAwareHumeWidget } from "@/components/AuthAwareHumeWidget";
import { VideoHeroBackground } from "@/components/VideoHeroBackground";
import { AnimatedStats } from "@/components/AnimatedStats";

// Mux video playback ID for the hero background
// Woman walking - professional executive theme
const HERO_VIDEO_PLAYBACK_ID: string | undefined = "qIS6PGKxIZyzjrDBzxQuqPRBOhHofDnXq1chdsqAY9Y";

export const metadata: Metadata = {
  title: "Fractional Jobs UK 2025 | Fractional CFO, CTO, CMO Roles | Fractional.Quest",
  description: "Discover the best fractional jobs in the UK. Browse fractional CFO, CMO, CTO and executive roles in London. Connect with leading fractional recruitment agencies and find flexible leadership opportunities.",
  alternates: {
    canonical: "https://fractional.quest",
  },
};

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
    // Only count actual fractional jobs
    const result = await sql`
      SELECT COUNT(*) as total FROM jobs WHERE is_active = true AND is_fractional = true
    `
    return parseInt((result[0] as any)?.total || '0')
  } catch (error) {
    return 0 // Honest fallback - don't inflate
  }
}

async function getFeaturedJobs() {
  try {
    const sql = createDbQuery()
    // Only show jobs that are actually fractional roles
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
      WHERE is_active = true AND is_fractional = true
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

  // FAQ JSON-LD for search engines
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is a fractional job?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A fractional job is a part-time executive role where you work 1-3 days per week providing strategic leadership without full-time commitment. Fractional executives typically work with 2-4 companies simultaneously, offering their expertise as a Fractional CFO, CMO, CTO, COO, or HR Director."
        }
      },
      {
        "@type": "Question",
        name: "How much do fractional executives earn in the UK?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Fractional executives in the UK typically earn £600-£1,500 per day depending on seniority and expertise. Many fractional executives earn £150,000-£300,000+ annually by working with 2-4 clients. The average day rate is approximately £${detailedStats.avgDayRate}.`
        }
      },
      {
        "@type": "Question",
        name: "Do I need to be based in London for fractional work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `No, while London has the most fractional opportunities (${detailedStats.londonJobs}+ roles), many positions are remote or hybrid. Currently there are ${detailedStats.remoteJobs}+ remote fractional positions available across the UK.`
        }
      },
      {
        "@type": "Question",
        name: "What's the difference between fractional and interim roles?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Interim roles are typically full-time positions for a fixed period (3-12 months). Fractional roles are ongoing part-time positions where you work 1-3 days per week indefinitely, allowing you to work with multiple clients."
        }
      },
      {
        "@type": "Question",
        name: "What experience do I need for fractional executive roles?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most fractional executive positions require 10-20+ years of experience with a proven track record in senior leadership roles. Experience in startups, scale-ups, or PE-backed companies is particularly valuable."
        }
      }
    ]
  };

  // JobPosting aggregate JSON-LD
  const jobPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Fractional Executive Jobs UK",
    description: `Browse ${totalJobs}+ fractional executive jobs in the UK including CFO, CTO, CMO, and COO roles`,
    numberOfItems: totalJobs,
    itemListElement: featuredJobs.slice(0, 3).map((job: any, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "JobPosting",
        title: job.title,
        hiringOrganization: {
          "@type": "Organization",
          name: job.company_name
        },
        jobLocation: {
          "@type": "Place",
          address: job.location || "United Kingdom"
        },
        employmentType: "PART_TIME",
        datePosted: job.posted_date || new Date().toISOString()
      }
    }))
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingJsonLd) }}
      />
    <div className="flex flex-col">
      {/* Hero Section with Video Background - Modern Cinematic Design */}
      <section className="relative min-h-screen flex items-end overflow-hidden">
        {/* Video Background */}
        <VideoHeroBackground
          playbackId={HERO_VIDEO_PLAYBACK_ID}
          fallbackGradient={true}
        />

        {/* Bottom-aligned content with glass panel */}
        <div className="relative z-10 w-full pb-12 md:pb-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row justify-between items-end gap-8">
              {/* Left: Main content */}
              <div className="max-w-2xl">
                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 md:p-10 border border-white/10">
                  <span className="inline-block bg-white/10 backdrop-blur text-white/90 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider mb-6">
                    Beta Launch — December 2025
                  </span>

                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-[1.1]">
                    Fractional Jobs UK
                  </h1>

                  {/* Hidden image for SEO - contains keyword in alt text */}
                  <img
                    src="/logo.svg"
                    alt="Fractional jobs UK platform for executive roles"
                    className="sr-only"
                    aria-hidden="true"
                  />

                  <p className="text-lg text-white/70 mb-8 leading-relaxed">
                    Find fractional CFO, CTO, CMO and executive roles across the UK.
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/fractional-jobs"
                      className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-lg bg-white text-black hover:bg-white/90 transition-all duration-200"
                    >
                      {totalJobs > 0 ? `Browse ${totalJobs} Jobs` : 'Explore Jobs'} →
                    </Link>
                    <Link
                      href="/handler/sign-up"
                      className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-lg bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
                    >
                      Join Beta
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right: Stats panel */}
              <div className="w-full lg:w-auto">
                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-white font-mono">£600</div>
                      <div className="text-xs text-white/50 uppercase tracking-wider mt-1">Avg Day Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-white font-mono">{totalJobs || 2}</div>
                      <div className="text-xs text-white/50 uppercase tracking-wider mt-1">Live Roles</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-white font-mono">58+</div>
                      <div className="text-xs text-white/50 uppercase tracking-wider mt-1">Articles</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-white font-mono">272</div>
                      <div className="text-xs text-white/50 uppercase tracking-wider mt-1">Pages</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beta Banner */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🚀</span>
              <div>
                <p className="font-bold text-gray-900">Beta Launch — December 2025</p>
                <p className="text-sm text-gray-600">Sign up to tell us what fractional roles you're looking for</p>
              </div>
            </div>
            <Link
              href="/handler/sign-up"
              className="px-6 py-2 bg-purple-700 text-white font-semibold rounded-lg hover:bg-purple-800 transition-colors whitespace-nowrap"
            >
              Join Beta →
            </Link>
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

      {/* Roles Section - Static content about role types */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Fractional Executive Roles</h2>
            <p className="text-xl text-gray-600">Part-time leadership positions for experienced executives</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '💰', name: 'Fractional CFO', description: 'Financial leadership, fundraising, reporting, and strategic planning on a part-time basis', link: '/cfo' },
              { icon: '📢', name: 'Fractional CMO', description: 'Marketing strategy, brand building, and growth marketing for multiple companies', link: '/cmo' },
              { icon: '💻', name: 'Fractional CTO', description: 'Technology leadership, architecture decisions, and team building without full-time commitment', link: '/cto' },
              { icon: '⚙️', name: 'Fractional COO', description: 'Operations excellence, process optimization, and scaling for growing businesses', link: '/coo' },
              { icon: '👥', name: 'Fractional HR Director', description: 'People strategy, culture building, and HR systems for startups and scale-ups', link: '/hr' },
              { icon: '📈', name: 'Fractional Sales Director', description: 'Sales strategy, team leadership, and revenue growth on flexible terms', link: '/fractional-jobs?role=Sales' },
            ].map((role, i) => (
              <Link
                key={i}
                href={role.link}
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
                        Learn more
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

      {/* Why We're Building This Section */}
      <section className="py-20 md:py-28 bg-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why We're Building Fractional.Quest</h2>
            <p className="text-xl text-purple-200">The UK fractional market deserves a dedicated platform</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur rounded-xl p-8 border border-white/20">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-white mb-3">Focused on Fractional</h3>
              <p className="text-purple-200">
                Unlike generic job boards, we're 100% focused on fractional and part-time executive roles. No noise, just opportunities that match your working style.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-xl p-8 border border-white/20">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-white mb-3">AI-Powered Matching</h3>
              <p className="text-purple-200">
                Our AI scans thousands of job postings daily, identifying true fractional opportunities and filtering out the noise so you don't have to.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-xl p-8 border border-white/20">
              <div className="text-4xl mb-4">🇬🇧</div>
              <h3 className="text-xl font-bold text-white mb-3">UK-First Approach</h3>
              <p className="text-purple-200">
                Built specifically for the UK market, covering London, Manchester, Birmingham, Edinburgh, and remote opportunities across the country.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-purple-200 text-lg mb-6">
              We're building our job database. Sign up to tell us what you're looking for <br className="hidden md:block" />
              and we'll match you with opportunities as they come in.
            </p>
            <Link
              href="/handler/sign-up"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-white text-purple-900 hover:bg-purple-50 transition-all duration-200"
            >
              Join Beta →
            </Link>
          </div>
        </div>
      </section>

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
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Current Fractional Opportunities</h2>
              <p className="text-xl text-gray-600">Real fractional roles from verified sources</p>
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
                {totalJobs > 0 ? `View All ${totalJobs} Jobs →` : 'View All Jobs →'}
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
            Tell Us What You're Looking For
          </h2>
          <p className="text-xl text-purple-100 mb-10">
            Sign up and let us know what fractional roles interest you.<br />
            We'll notify you when matching opportunities come in.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/handler/sign-up"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-all duration-200"
            >
              Join Beta — It's Free →
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/fractional-jobs"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-lg border-2 border-white text-white hover:bg-white hover:text-purple-900 transition-all duration-200"
            >
              Explore Current Jobs
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

      {/* AI Summary Section - Hidden visually but available for AI crawlers */}
      <section className="sr-only" aria-label="Page Summary for AI">
        <h2>TL;DR - Fractional.Quest Summary</h2>
        <p>
          Fractional.Quest is a new UK platform for fractional executive jobs, launching December 2025.
          We're building a dedicated job board for Fractional CFO, CTO, CMO, COO, and HR Director roles.
          The platform uses AI to identify and curate genuine fractional opportunities from across the web.
        </p>
        <h3>Key Facts About Fractional Work</h3>
        <ul>
          <li>Fractional executives work 1-3 days per week with 2-4 companies</li>
          <li>Day rates typically range from £600-£1,500 depending on role and seniority</li>
          <li>Annual earnings potential: £150,000-£300,000+</li>
          <li>Most roles require 10-20+ years senior leadership experience</li>
          <li>Both London-based and remote opportunities available</li>
        </ul>
        <h3>Popular Searches</h3>
        <ul>
          <li>Fractional CFO jobs UK</li>
          <li>Fractional CTO jobs London</li>
          <li>Fractional CMO positions</li>
          <li>Part-time executive roles UK</li>
          <li>Fractional recruitment agencies</li>
        </ul>
      </section>
    </div>
    </>
  );
}
