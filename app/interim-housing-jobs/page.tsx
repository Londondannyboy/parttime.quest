import { Metadata } from 'next'
import Link from 'next/link'
import { createDbQuery } from '@/lib/db'
import { JobsGraph3D } from '@/components/JobsGraph3D'
import { EmbeddedJobBoard } from '@/components/EmbeddedJobBoard'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Interim Housing Jobs UK 2025 | Housing Director & Manager Roles',
  description: 'Find interim housing jobs UK. Interim Housing Director, Housing Manager, and social housing leadership positions. Housing associations and local authorities nationwide.',
  keywords: 'interim housing jobs, interim housing director, interim housing manager, social housing interim jobs',
  openGraph: {
    title: 'Interim Housing Jobs UK 2025 | Housing Director & Manager Roles',
    description: 'Find interim housing jobs UK. Housing Director and Manager interim positions.',
    type: 'website',
  },
}

const housingRoles = [
  { name: 'Interim Housing Director', description: 'Strategic housing leadership', rateRange: '£600-850/day', demand: 'High' },
  { name: 'Interim Director of Housing', description: 'Local authority housing', rateRange: '£550-750/day', demand: 'High' },
  { name: 'Interim Head of Housing', description: 'Department leadership', rateRange: '£500-700/day', demand: 'Very High' },
  { name: 'Interim Housing Manager', description: 'Operational management', rateRange: '£350-500/day', demand: 'Very High' },
  { name: 'Interim Asset Management Director', description: 'Property & maintenance', rateRange: '£550-750/day', demand: 'High' },
  { name: 'Interim Development Director', description: 'New build programmes', rateRange: '£600-800/day', demand: 'Medium' },
]

const housingSectors = [
  { name: 'Housing Associations', icon: '🏘️', description: 'Social landlords' },
  { name: 'Local Authorities', icon: '🏛️', description: 'Council housing' },
  { name: 'ALMOs', icon: '🏢', description: 'Arms-length management' },
  { name: 'Private Rental', icon: '🔑', description: 'PRS management' },
  { name: 'Supported Housing', icon: '🤝', description: 'Care & support' },
  { name: 'Development', icon: '🏗️', description: 'New build' },
]

const housingSkills = [
  'Social Housing Regulation', 'Tenant Engagement', 'Asset Management', 'Housing Law',
  'Rent Collection', 'Void Management', 'Safeguarding', 'Stock Investment', 'Building Safety'
]

async function getHousingStats() {
  try {
    const sql = createDbQuery()
    const [total] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM jobs WHERE is_active = true AND (title ILIKE '%housing%' OR title ILIKE '%property%')`
    ])
    return { total: parseInt((total[0] as any)?.count || '0') }
  } catch (error) {
    return { total: 10 }
  }
}

export default async function InterimHousingJobsPage() {
  const stats = await getHousingStats()

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

                <span className="inline-block bg-sky-500/20 text-sky-200 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-6">
                  {stats.total > 0 ? `${stats.total}+` : '10+'} Housing Roles
                </span>

                <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-[0.95]">
                  Interim<br />
                  <span className="text-sky-300">Housing</span> Jobs UK
                </h1>

                <p className="text-lg text-white/70 mb-8 max-w-lg">
                  Find interim housing jobs across the UK. Housing Director, Housing Manager, and social housing leadership positions.
                </p>

                <Link href="/part-time-jobs" className="inline-flex px-8 py-4 text-base font-semibold rounded-lg bg-sky-500 text-white hover:bg-sky-400">
                  Browse Housing Jobs →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Interim housing sector leadership</h2>
          <p className="text-xl text-gray-600">
            <strong>Interim housing jobs</strong> provide critical leadership for housing associations, local authorities, and private landlords during transitions, regulatory challenges, or transformation programmes. The housing sector increasingly relies on experienced interim professionals to drive improvement and compliance.
          </p>
        </div>
      </section>

      {/* Roles */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Interim Housing Roles & Rates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {housingRoles.map((role, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{role.name}</h3>
                <p className="text-gray-600 mb-4">{role.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-sky-600 font-semibold">{role.rateRange}</span>
                  <span className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-xs font-medium">{role.demand}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Housing Sectors</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {housingSectors.map((sector, i) => (
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
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Latest Interim Housing Jobs</h2>
          <EmbeddedJobBoard title="Interim Housing Jobs" jobsPerPage={6} showAllJobsLink={true} allJobsLinkText="View All Housing Jobs" />
        </div>
      </section>

      {/* Skills */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">Housing Sector Skills</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {housingSkills.map((skill, i) => (
              <span key={i} className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm font-medium hover:bg-sky-100 transition-colors">{skill}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="py-16 bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Related Pages</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/interim-jobs" className="px-4 py-2 bg-white rounded-full text-gray-700 text-sm border hover:bg-sky-50">All Interim Jobs →</Link>
            <Link href="/interim-director-jobs" className="px-4 py-2 bg-white rounded-full text-gray-700 text-sm border hover:bg-sky-50">Interim Director Jobs →</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Find Interim Housing Jobs</h2>
          <Link href="/part-time-jobs" className="inline-flex px-10 py-5 text-lg font-semibold rounded-lg bg-sky-500 text-white hover:bg-sky-400">
            Browse All Housing Jobs →
          </Link>
        </div>
      </section>
    </div>
  )
}
