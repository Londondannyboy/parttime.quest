import { Metadata } from 'next'
import Link from 'next/link'
import { createDbQuery } from '@/lib/db'
import { JobsGraph3D } from '@/components/JobsGraph3D'
import { EmbeddedJobBoard } from '@/components/EmbeddedJobBoard'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Interim Care Home Manager Jobs UK 2025 | CQC Registered Manager Roles',
  description: 'Find interim care home manager jobs UK. Interim registered manager, care home manager, and care sector leadership positions. CQC registered opportunities nationwide.',
  keywords: 'interim care home manager jobs, interim registered manager jobs, care home interim manager, care sector interim jobs',
  openGraph: {
    title: 'Interim Care Home Manager Jobs UK 2025 | CQC Registered Manager Roles',
    description: 'Find interim care home manager jobs UK. Registered manager interim positions.',
    type: 'website',
  },
}

const careRoles = [
  { name: 'Interim Registered Manager', description: 'CQC registered care home manager', rateRange: '£300-450/day', demand: 'Very High' },
  { name: 'Interim Care Home Manager', description: 'Care home operational leadership', rateRange: '£280-400/day', demand: 'Very High' },
  { name: 'Interim Regional Manager', description: 'Multi-site care management', rateRange: '£400-550/day', demand: 'High' },
  { name: 'Interim Operations Director', description: 'Care group leadership', rateRange: '£500-700/day', demand: 'High' },
  { name: 'Interim Nursing Home Manager', description: 'Clinical care leadership', rateRange: '£350-500/day', demand: 'High' },
  { name: 'Interim Turnaround Manager', description: 'CQC improvement specialist', rateRange: '£400-550/day', demand: 'Very High' },
]

const careSectors = [
  { name: 'Elderly Care', icon: '👴', description: 'Residential & nursing' },
  { name: 'Dementia Care', icon: '💜', description: 'Specialist dementia' },
  { name: 'Learning Disabilities', icon: '🌟', description: 'LD services' },
  { name: 'Mental Health', icon: '🧠', description: 'MH residential' },
  { name: "Children's Care", icon: '👶', description: "Children's homes" },
  { name: 'Domiciliary', icon: '🏠', description: 'Home care' },
]

const careSkills = [
  'CQC Compliance', 'Safeguarding', 'Person-Centred Care', 'Medication Management',
  'Staff Development', 'Budget Management', 'Quality Assurance', 'Family Engagement', 'Risk Assessment'
]

async function getCareStats() {
  try {
    const sql = createDbQuery()
    const [total] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM jobs WHERE is_active = true AND (title ILIKE '%care%' OR title ILIKE '%nursing%')`
    ])
    return { total: parseInt((total[0] as any)?.count || '0') }
  } catch (error) {
    return { total: 10 }
  }
}

export default async function InterimCareHomeManagerJobsPage() {
  const stats = await getCareStats()

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

                <span className="inline-block bg-rose-500/20 text-rose-200 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-6">
                  {stats.total > 0 ? `${stats.total}+` : '10+'} Care Roles
                </span>

                <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-[0.95]">
                  Interim<br />
                  <span className="text-rose-300">Care Home Manager</span> Jobs
                </h1>

                <p className="text-lg text-white/70 mb-8 max-w-lg">
                  Find interim care home manager jobs across the UK. Registered manager, care home manager, and turnaround specialist positions.
                </p>

                <Link href="/part-time-jobs" className="inline-flex px-8 py-4 text-base font-semibold rounded-lg bg-rose-500 text-white hover:bg-rose-400">
                  Browse Care Jobs →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Critical demand for interim care home managers</h2>
          <p className="text-xl text-gray-600">
            <strong>Interim care home manager jobs</strong> are in extremely high demand as the care sector faces significant leadership challenges. With CQC requirements, staffing pressures, and quality standards, care providers increasingly rely on experienced interim managers to maintain compliance and drive improvement.
          </p>
        </div>
      </section>

      {/* Roles */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Interim Care Manager Roles & Rates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {careRoles.map((role, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{role.name}</h3>
                <p className="text-gray-600 mb-4">{role.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-rose-600 font-semibold">{role.rateRange}</span>
                  <span className="bg-rose-100 text-rose-800 px-3 py-1 rounded-full text-xs font-medium">{role.demand}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Care Sectors</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {careSectors.map((sector, i) => (
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
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Latest Care Sector Jobs</h2>
          <EmbeddedJobBoard title="Interim Care Manager Jobs" jobsPerPage={6} showAllJobsLink={true} allJobsLinkText="View All Care Jobs" />
        </div>
      </section>

      {/* Skills */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">Care Manager Skills</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {careSkills.map((skill, i) => (
              <span key={i} className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm font-medium hover:bg-rose-100 transition-colors">{skill}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Care Home Manager FAQ</h2>
          <div className="space-y-6">
            <details className="group bg-white rounded-xl p-6 cursor-pointer border">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                What qualifications do interim care home managers need?
                <span className="text-gray-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Interim care home managers must be CQC-registered or able to register. Typically Level 5 Diploma in Leadership for Health & Social Care is required, along with significant experience managing care homes. Nursing homes may require RGN qualification. Experience of CQC inspections and improvement is essential.
              </p>
            </details>

            <details className="group bg-white rounded-xl p-6 cursor-pointer border">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                How much do interim care home managers earn?
                <span className="text-gray-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Interim care home manager day rates typically range from £280-450 per day depending on home size and complexity. Turnaround specialists helping homes improve CQC ratings can earn £400-550/day. Regional managers overseeing multiple sites earn £400-550/day.
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
            <Link href="/interim-jobs" className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm hover:bg-rose-100">All Interim Jobs →</Link>
            <Link href="/interim-nhs-jobs" className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm hover:bg-rose-100">Interim NHS Jobs →</Link>
            <Link href="/interim-housing-jobs" className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm hover:bg-rose-100">Interim Housing Jobs →</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Find Care Home Manager Jobs</h2>
          <Link href="/part-time-jobs" className="inline-flex px-10 py-5 text-lg font-semibold rounded-lg bg-rose-500 text-white hover:bg-rose-400">
            Browse All Care Jobs →
          </Link>
        </div>
      </section>
    </div>
  )
}
