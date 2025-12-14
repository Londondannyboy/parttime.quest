import { Metadata } from 'next'
import Link from 'next/link'
import { createDbQuery } from '@/lib/db'
import { JobsGraph3D } from '@/components/JobsGraph3D'
import { EmbeddedJobBoard } from '@/components/EmbeddedJobBoard'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Interim Headteacher Jobs UK 2025 | School Leadership Roles',
  description: 'Find interim headteacher jobs UK. Interim head teacher, acting head, and school leadership positions. Primary and secondary school opportunities nationwide.',
  keywords: 'interim headteacher jobs, interim head teacher jobs, acting headteacher jobs, interim school leadership',
  openGraph: {
    title: 'Interim Headteacher Jobs UK 2025 | School Leadership Roles',
    description: 'Find interim headteacher jobs UK. School leadership interim positions.',
    type: 'website',
  },
}

const headteacherRoles = [
  { name: 'Interim Headteacher (Primary)', description: 'Primary school leadership', rateRange: '£400-600/day', demand: 'Very High' },
  { name: 'Interim Headteacher (Secondary)', description: 'Secondary school leadership', rateRange: '£500-700/day', demand: 'High' },
  { name: 'Interim Executive Headteacher', description: 'Multi-academy leadership', rateRange: '£600-850/day', demand: 'High' },
  { name: 'Interim Deputy Headteacher', description: 'Senior school leadership', rateRange: '£350-500/day', demand: 'Very High' },
  { name: 'Interim Head of School', description: 'Academy school leadership', rateRange: '£450-600/day', demand: 'High' },
  { name: 'Interim Principal', description: 'College/academy principal', rateRange: '£550-750/day', demand: 'Medium' },
]

const educationSectors = [
  { name: 'Primary Schools', icon: '🏫', description: 'Ages 4-11' },
  { name: 'Secondary Schools', icon: '📚', description: 'Ages 11-18' },
  { name: 'Academies', icon: '🎓', description: 'Academy trusts' },
  { name: 'Special Schools', icon: '💙', description: 'SEND provision' },
  { name: 'PRU/AP', icon: '🤝', description: 'Alternative provision' },
  { name: 'Further Education', icon: '🏛️', description: 'Colleges' },
]

const headteacherSkills = [
  'School Leadership', 'Ofsted Readiness', 'Safeguarding', 'Curriculum Development',
  'Staff Development', 'Budget Management', 'Parent Engagement', 'SEND', 'School Improvement'
]

async function getHeadteacherStats() {
  try {
    const sql = createDbQuery()
    const [total] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM jobs WHERE is_active = true AND (title ILIKE '%head%' OR title ILIKE '%principal%' OR title ILIKE '%education%')`
    ])
    return { total: parseInt((total[0] as any)?.count || '0') }
  } catch (error) {
    return { total: 15 }
  }
}

export default async function InterimHeadteacherJobsPage() {
  const stats = await getHeadteacherStats()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <JobsGraph3D limit={30} height="100%" isHero={true} showOverlay={true} />
        </div>

        <div className="relative z-10 w-full pb-16 md:pb-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-2xl">
              <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/10">
                <Link href="/interim-jobs" className="inline-flex items-center text-white/70 hover:text-white mb-6 text-sm">
                  <span className="mr-2">←</span> All Interim Jobs
                </Link>

                <span className="inline-block bg-green-500/20 text-green-200 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-6">
                  {stats.total > 0 ? `${stats.total}+` : '15+'} Education Roles
                </span>

                <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-[0.95]">
                  Interim<br />
                  <span className="text-green-300">Headteacher</span> Jobs
                </h1>

                <p className="text-lg text-white/70 mb-8 max-w-lg">
                  Find interim headteacher jobs across the UK. Primary, secondary, and academy leadership positions with competitive rates.
                </p>

                <Link href="/part-time-jobs" className="inline-flex px-8 py-4 text-base font-semibold rounded-lg bg-green-500 text-white hover:bg-green-400">
                  Browse Headteacher Jobs →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">High demand for interim headteachers</h2>
          <p className="text-xl text-gray-600">
            <strong>Interim headteacher jobs</strong> are essential for schools during leadership transitions, long-term absences, or challenging periods requiring experienced leadership. Schools increasingly use interim heads to maintain stability and drive improvement while permanent recruitment takes place.
          </p>
        </div>
      </section>

      {/* Roles */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Interim Headteacher Roles & Rates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {headteacherRoles.map((role, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{role.name}</h3>
                <p className="text-gray-600 mb-4">{role.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-green-600 font-semibold">{role.rateRange}</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">{role.demand}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Education Sectors</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {educationSectors.map((sector, i) => (
              <div key={i} className="text-center p-6 bg-gray-50 rounded-xl">
                <span className="text-4xl mb-3 block">{sector.icon}</span>
                <h3 className="font-bold text-gray-900 mb-1">{sector.name}</h3>
                <p className="text-xs text-gray-500">{sector.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Board */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Latest Education Leadership Jobs</h2>
          <EmbeddedJobBoard title="Interim Headteacher Jobs" jobsPerPage={6} showAllJobsLink={true} allJobsLinkText="View All Education Jobs" />
        </div>
      </section>

      {/* Skills */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">Interim Headteacher Skills</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {headteacherSkills.map((skill, i) => (
              <span key={i} className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm font-medium hover:bg-green-100 transition-colors">{skill}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Interim Headteacher FAQ</h2>
          <div className="space-y-6">
            <details className="group bg-white rounded-xl p-6 cursor-pointer border">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                How much do interim headteachers earn?
                <span className="text-gray-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Interim headteacher day rates typically range from £400-700 depending on school type and size. Primary interim heads earn £400-600/day, secondary heads £500-700/day, and executive headteachers leading multiple schools can earn £600-850/day.
              </p>
            </details>

            <details className="group bg-white rounded-xl p-6 cursor-pointer border">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                What qualifications do interim headteachers need?
                <span className="text-gray-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Interim headteachers need QTS (Qualified Teacher Status), NPQH (National Professional Qualification for Headship) is highly valued, and substantial experience in senior school leadership. Experience of Ofsted preparation and school improvement is essential.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="py-16 bg-white border-t">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Related Pages</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/interim-jobs" className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm hover:bg-green-100">All Interim Jobs →</Link>
            <Link href="/interim-nhs-jobs" className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm hover:bg-green-100">Interim NHS Jobs →</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Find Interim Headteacher Jobs</h2>
          <Link href="/part-time-jobs" className="inline-flex px-10 py-5 text-lg font-semibold rounded-lg bg-green-500 text-white hover:bg-green-400">
            Browse All Education Jobs →
          </Link>
        </div>
      </section>
    </div>
  )
}
