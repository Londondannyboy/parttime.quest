import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createDbQuery } from '@/lib/db'
import { JobCard } from '@/components/JobCard'
import { CompanyLogoLarge } from '@/components/CompanyLogo'

export const revalidate = 3600 // Revalidate every hour

interface CompanyPageProps {
  params: Promise<{ domain: string }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CompanyPageProps): Promise<Metadata> {
  const { domain } = await params
  const sql = createDbQuery()

  const [company] = await sql`
    SELECT DISTINCT company_name
    FROM jobs
    WHERE company_domain = ${domain} AND is_active = true
    LIMIT 1
  `

  if (!company) {
    return { title: 'Company Not Found' }
  }

  return {
    title: `${company.company_name} Jobs | Fractional.Quest`,
    description: `Browse fractional and part-time jobs at ${company.company_name}. Find executive roles, day rates, and flexible opportunities.`,
    openGraph: {
      title: `${company.company_name} - Fractional Jobs`,
      description: `Browse fractional and part-time jobs at ${company.company_name}`,
      type: 'website',
    },
  }
}

async function getCompanyData(domain: string) {
  const sql = createDbQuery()

  // Get all jobs for this company
  const jobs = await sql`
    SELECT
      id, slug, title, company_name, location, city, is_remote,
      workplace_type, compensation, role_category, seniority_level,
      skills_required, posted_date, description_snippet, company_domain
    FROM jobs
    WHERE company_domain = ${domain} AND is_active = true
    ORDER BY posted_date DESC NULLS LAST
  `

  if (jobs.length === 0) {
    return null
  }

  // Get company stats
  const companyName = jobs[0].company_name
  const roleCategories = [...new Set(jobs.map((j: any) => j.role_category).filter(Boolean))]
  const locations = [...new Set(jobs.map((j: any) => j.city || j.location).filter(Boolean))]

  return {
    name: companyName,
    domain,
    jobs,
    stats: {
      totalJobs: jobs.length,
      roleCategories,
      locations,
    }
  }
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { domain } = await params
  const company = await getCompanyData(domain)

  if (!company) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Company Header */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
          <Link
            href="/fractional-jobs"
            className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors text-sm"
          >
            <span className="mr-2">&larr;</span> Back to Jobs
          </Link>

          <div className="flex items-center gap-6">
            {/* Company Logo */}
            <CompanyLogoLarge
              companyDomain={domain}
              companyName={company.name}
            />

            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{company.name}</h1>
              <p className="text-white/70 text-lg">
                {company.stats.totalJobs} open {company.stats.totalJobs === 1 ? 'position' : 'positions'}
              </p>
              {company.domain && (
                <a
                  href={`https://${company.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-purple-300 hover:text-purple-200 mt-2 text-sm"
                >
                  {company.domain}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold">{company.stats.totalJobs}</div>
              <div className="text-white/60 text-sm">Open Roles</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold">{company.stats.roleCategories.length}</div>
              <div className="text-white/60 text-sm">Departments</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold">{company.stats.locations.length}</div>
              <div className="text-white/60 text-sm">Locations</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold flex items-center gap-1">
                <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-white/60 text-sm">Verified Company</div>
            </div>
          </div>
        </div>
      </section>

      {/* Department Tags */}
      {company.stats.roleCategories.length > 0 && (
        <section className="border-b border-gray-200 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 py-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-500 mr-2">Hiring in:</span>
              {company.stats.roleCategories.map((category: string) => (
                <span
                  key={category}
                  className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Jobs List */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Open Positions at {company.name}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {company.jobs.map((job: any) => {
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
                    companyDomain={job.company_domain}
                  />
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Interested in {company.name}?
          </h2>
          <p className="text-gray-600 mb-8">
            Set up job alerts to get notified when new positions open up.
          </p>
          <Link
            href="/handler/sign-up"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-lg bg-purple-700 text-white hover:bg-purple-800 transition-all"
          >
            Create Job Alert
          </Link>
        </div>
      </section>
    </div>
  )
}
