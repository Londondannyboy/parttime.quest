import { Metadata } from 'next'
import Link from 'next/link'
import { createDbQuery } from '@/lib/db'
import { Badge } from '@/components/Badge'
import { JobHeader } from '@/components/JobHeader'
import ReactMarkdown from 'react-markdown'

// Revalidate every hour for job details
export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  try {
    const sql = createDbQuery()
    const jobs = await sql`
      SELECT title, company_name
      FROM jobs
      WHERE slug = ${slug}
        AND is_active = true
      LIMIT 1
    `

    if (jobs.length === 0) {
      return { title: 'Job Not Found | Fractional.Quest' }
    }

    const job = jobs[0] as any
    return {
      title: `${job.title} at ${job.company_name} | Fractional.Quest`,
      description: `Fractional ${job.title} position at ${job.company_name}. Browse and apply on Fractional.Quest.`,
    }
  } catch {
    return { title: 'Job | Fractional.Quest' }
  }
}

export default async function JobDetailPage({ params }: PageProps) {
  const { slug } = await params
  try {
    const sql = createDbQuery()

    const jobs = await sql`
      SELECT
        id,
        title,
        company_name,
        location,
        is_remote,
        compensation,
        employment_type,
        seniority_level,
        description_snippet,
        full_description,
        skills_required,
        responsibilities,
        requirements,
        benefits,
        about_company,
        posted_date,
        url
      FROM jobs
      WHERE slug = ${slug}
        AND is_active = true
      LIMIT 1
    `

    if (jobs.length === 0) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Job Not Found</h1>
          <p className="text-gray-600 mb-8">Sorry, we couldn't find this job listing.</p>
          <Link href="/fractional-jobs">
            <button className="px-6 py-2.5 bg-purple-700 text-white rounded-lg hover:bg-purple-800">
              Back to Jobs
            </button>
          </Link>
        </div>
      )
    }

    const job = jobs[0] as any

    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <JobHeader
          title={job.title}
          company={job.company_name}
          location={job.location}
          isRemote={job.is_remote}
          compensation={job.compensation}
          seniority={job.seniority_level}
          employmentType={job.employment_type}
          postedDate={job.posted_date}
        />

        {/* Apply Button */}
        <div className="bg-purple-50 border-b border-purple-100 py-4">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 font-semibold transition-colors"
            >
              Apply Now →
            </a>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Description */}
          {job.full_description && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">About This Role</h2>
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-6 mb-3" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-4 mb-2" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-lg font-semibold mt-3 mb-2" {...props} />,
                    p: ({node, ...props}) => <p className="mb-3 leading-relaxed" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-inside mb-3 space-y-1" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-3 space-y-1" {...props} />,
                    li: ({node, ...props}) => <li className="ml-2" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                    em: ({node, ...props}) => <em className="italic" {...props} />,
                    code: ({node, ...props}) => <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono" {...props} />,
                  }}
                >
                  {job.full_description}
                </ReactMarkdown>
              </div>
            </section>
          )}

          {/* Responsibilities */}
          {job.responsibilities && Array.isArray(job.responsibilities) && job.responsibilities.length > 0 && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Responsibilities</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {job.responsibilities.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Requirements */}
          {job.requirements && Array.isArray(job.requirements) && job.requirements.length > 0 && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Requirements</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {job.requirements.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Skills */}
          {job.skills_required && Array.isArray(job.skills_required) && job.skills_required.length > 0 && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Skills Required</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills_required.map((skill: string) => (
                  <Badge key={skill} variant="gray">
                    {skill}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {/* Benefits */}
          {job.benefits && Array.isArray(job.benefits) && job.benefits.length > 0 && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Benefits</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {job.benefits.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {/* About Company */}
          {job.about_company && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">About {job.company_name}</h2>
              <p className="text-gray-700 leading-relaxed">{job.about_company}</p>
            </section>
          )}

          {/* CTA */}
          <div className="pt-8 border-t">
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 font-semibold mb-6"
            >
              Apply Now →
            </a>
            <Link href="/fractional-jobs">
              <button className="block px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold">
                ← Back to All Jobs
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching job:', error)
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Error Loading Job</h1>
        <p className="text-gray-600 mb-8">There was an error loading this job. Please try again later.</p>
        <Link href="/fractional-jobs">
          <button className="px-6 py-2.5 bg-purple-700 text-white rounded-lg hover:bg-purple-800">
            Back to Jobs
          </button>
        </Link>
      </div>
    )
  }
}
