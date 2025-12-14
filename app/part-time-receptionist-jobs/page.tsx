import { Metadata } from 'next'
import Link from 'next/link'
import { createDbQuery } from '@/lib/db'
import { JobsGraph3D } from '@/components/JobsGraph3D'
import { EmbeddedJobBoard } from '@/components/EmbeddedJobBoard'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Part-Time Receptionist Jobs UK | Front Desk & Admin Roles',
  description: 'Find part-time receptionist jobs near you. Front desk, office reception, medical receptionist roles. Flexible hours, competitive pay. Browse part-time receptionist jobs UK.',
  keywords: 'part time receptionist jobs, part time receptionist jobs near me, front desk jobs part time, medical receptionist part time, office receptionist jobs',
  openGraph: {
    title: 'Part-Time Receptionist Jobs UK | Front Desk & Admin Roles',
    description: 'Find part-time receptionist jobs near you. Front desk, office reception, medical receptionist roles.',
    type: 'website',
  },
}

const receptionistRoles = [
  { name: 'Part-Time Office Receptionist', description: 'Front desk & visitor management', rateRange: '£11-15/hour', demand: 'Very High' },
  { name: 'Part-Time Medical Receptionist', description: 'GP surgery & clinic reception', rateRange: '£12-16/hour', demand: 'Very High' },
  { name: 'Part-Time Legal Receptionist', description: 'Law firm front of house', rateRange: '£13-18/hour', demand: 'High' },
  { name: 'Part-Time Hotel Receptionist', description: 'Guest services & check-in', rateRange: '£11-14/hour', demand: 'High' },
  { name: 'Part-Time Dental Receptionist', description: 'Dental practice reception', rateRange: '£12-15/hour', demand: 'High' },
  { name: 'Part-Time Corporate Receptionist', description: 'Corporate office front desk', rateRange: '£14-20/hour', demand: 'Growing' },
]

const receptionistSectors = [
  { name: 'Healthcare', icon: '🏥', growth: '+18% YoY', description: 'GP surgeries & clinics' },
  { name: 'Corporate', icon: '🏢', growth: '+12% YoY', description: 'Office buildings' },
  { name: 'Legal', icon: '⚖️', growth: '+10% YoY', description: 'Law firms' },
  { name: 'Hospitality', icon: '🏨', growth: '+15% YoY', description: 'Hotels & venues' },
  { name: 'Dental', icon: '🦷', growth: '+14% YoY', description: 'Dental practices' },
  { name: 'Education', icon: '🎓', growth: '+8% YoY', description: 'Schools & colleges' },
]

const receptionistSkills = [
  'Customer Service', 'Telephone Handling', 'Diary Management',
  'Microsoft Office', 'Data Entry', 'Multi-tasking',
  'Visitor Management', 'Booking Systems', 'Professional Presentation'
]

const relatedSearches = [
  'Part-Time Receptionist Jobs Near Me', 'Medical Receptionist Part-Time', 'Front Desk Jobs Part-Time',
  'Part-Time Receptionist Jobs London', 'Weekend Receptionist Jobs', 'Dental Receptionist Part-Time',
  'Part-Time Office Receptionist', 'Legal Receptionist Jobs', 'Hotel Receptionist Part-Time'
]

async function getReceptionistStats() {
  try {
    const sql = createDbQuery()
    const [total] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM jobs WHERE is_active = true AND (title ILIKE '%receptionist%' OR title ILIKE '%front desk%' OR title ILIKE '%front of house%')`
    ])
    return {
      total: parseInt((total[0] as any)?.count || '0'),
      avgHourlyRate: 13
    }
  } catch (error) {
    return { total: 20, avgHourlyRate: 13 }
  }
}

export default async function ReceptionistJobsPage() {
  const stats = await getReceptionistStats()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <JobsGraph3D categoryFilter="Operations" limit={30} height="100%" isHero={true} showOverlay={true} />
        </div>

        <div className="relative z-10 w-full pb-16 md:pb-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row justify-between items-end gap-8">
              <div className="max-w-2xl">
                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/10">
                  <Link href="/" className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors text-sm tracking-wide">
                    <span className="mr-2">←</span> Back to Home
                  </Link>

                  <span className="inline-block bg-teal-500/20 backdrop-blur text-teal-200 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-6">
                    {stats.total > 0 ? `${stats.total}+` : 'Browse'} Receptionist Roles
                  </span>

                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[0.95] tracking-tight">
                    Part-Time<br />
                    <span className="text-teal-300">Receptionist</span> Jobs
                  </h1>

                  <p className="text-lg text-white/70 mb-8 leading-relaxed max-w-lg">
                    Part-time receptionist jobs near you. Medical, office, legal, and hotel reception roles with flexible hours across the UK.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="/part-time-jobs?q=receptionist"
                      className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-lg bg-teal-500 text-white hover:bg-teal-400 transition-all duration-200"
                    >
                      Browse Receptionist Jobs →
                    </Link>
                    <Link
                      href="#roles"
                      className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-lg bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
                    >
                      View Roles
                    </Link>
                  </div>
                </div>
              </div>

              {/* Stats panel */}
              <div className="w-full lg:w-auto">
                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-teal-400 font-mono">{stats.total > 0 ? `${stats.total}+` : '20+'}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Receptionist Jobs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-white font-mono">£{stats.avgHourlyRate}/hr</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Avg Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-white font-mono">UK Wide</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Locations</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-white font-mono">Flexible</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Hours</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-gray-400 mb-4 block">Part-Time Receptionist Jobs UK</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              Find part-time receptionist jobs<br />near you
            </h2>
          </div>
          <div className="prose prose-xl prose-gray max-w-none">
            <p className="text-xl text-gray-600 leading-relaxed text-center">
              Part-time receptionist jobs offer excellent flexibility for those seeking work that fits around other commitments. From medical surgeries to corporate offices, receptionists are essential across every sector. Part-time hours typically range from 15-25 hours per week, with many positions offering morning, afternoon, or weekend shifts.
            </p>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-gray-400 mb-4 block">By Role</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Part-Time Receptionist Roles</h2>
            <p className="text-xl text-gray-500">Popular part-time receptionist positions across the UK</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {receptionistRoles.map((role, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{role.name}</h3>
                <p className="text-gray-600 mb-4">{role.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-teal-600 font-semibold">{role.rateRange}</span>
                  <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-xs font-medium">
                    {role.demand} Demand
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-gray-400 mb-4 block">By Sector</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Sectors Hiring Receptionists</h2>
            <p className="text-xl text-gray-500">Part-time opportunities across industries</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {receptionistSectors.map((sector, i) => (
              <div key={i} className="text-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <span className="text-4xl mb-3 block">{sector.icon}</span>
                <h3 className="font-bold text-gray-900 mb-1">{sector.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{sector.description}</p>
                <span className="text-teal-600 text-xs font-medium">{sector.growth}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Part-Time Receptionist */}
      <section className="py-20 md:py-28 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Why Choose Part-Time Reception Work?</h2>
            <p className="text-xl text-gray-400">Benefits of flexible receptionist careers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8">
              <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">⏰</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Flexible Shifts</h3>
              <p className="text-gray-600">
                Morning, afternoon, or weekend shifts available. Many employers offer set schedules that work around childcare, studies, or other commitments.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8">
              <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">📍</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Local Opportunities</h3>
              <p className="text-gray-600">
                Every town has GP surgeries, offices, hotels, and businesses that need receptionists. Find part-time receptionist jobs near you easily.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8">
              <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Transferable Skills</h3>
              <p className="text-gray-600">
                Reception work builds valuable skills: customer service, administration, IT systems, and communication. Great stepping stone to office management roles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Job Board */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest Part-Time Receptionist Jobs</h2>
            <p className="text-xl text-gray-500">Browse current receptionist opportunities</p>
          </div>
          <EmbeddedJobBoard
            defaultDepartment="Operations"
            title="Part-Time Receptionist Jobs"
            jobsPerPage={6}
            showAllJobsLink={true}
            allJobsLinkText="View All Receptionist Jobs"
          />
        </div>
      </section>

      {/* Skills */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">In-Demand Receptionist Skills</h2>
            <p className="text-xl text-gray-500">Skills employers look for in part-time receptionists</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {receptionistSkills.map((skill, i) => (
              <span key={i} className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm font-medium hover:bg-teal-100 transition-colors">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Part-Time Receptionist Jobs FAQ</h2>
          </div>

          <div className="space-y-6">
            <details className="group bg-white rounded-xl p-6 cursor-pointer border border-gray-200">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                How much do part-time receptionists earn UK?
                <span className="text-gray-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Part-time receptionist pay ranges from £11-20 per hour depending on sector and location. Medical receptionists earn £12-16/hour, legal receptionists £13-18/hour, and corporate receptionists up to £20/hour. London rates are typically 15-20% higher than national averages.
              </p>
            </details>

            <details className="group bg-white rounded-xl p-6 cursor-pointer border border-gray-200">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                What qualifications do I need to be a receptionist?
                <span className="text-gray-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Most part-time receptionist jobs require no formal qualifications. Good communication skills, a professional manner, and basic IT skills are essential. Some sectors like medical or legal may prefer relevant experience or training. GCSEs in English and Maths are helpful but not always required.
              </p>
            </details>

            <details className="group bg-white rounded-xl p-6 cursor-pointer border border-gray-200">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                How many hours is part-time receptionist work?
                <span className="text-gray-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Part-time receptionist hours typically range from 15-25 hours per week. Common patterns include morning shifts (8am-1pm), afternoon shifts (1pm-6pm), or 2-3 full days per week. Many employers offer set schedules for consistency.
              </p>
            </details>

            <details className="group bg-white rounded-xl p-6 cursor-pointer border border-gray-200">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                Are there part-time receptionist jobs near me?
                <span className="text-gray-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Yes, receptionist jobs exist in every UK town. GP surgeries, dental practices, offices, hotels, gyms, and businesses of all sizes hire receptionists. Use the location filter on our job board to find opportunities in your area. Healthcare settings particularly have high demand.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Related Searches */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Related Searches</h3>
          <div className="flex flex-wrap gap-3">
            {relatedSearches.map((search, i) => (
              <Link
                key={i}
                href={`/part-time-jobs?q=${encodeURIComponent(search)}`}
                className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm hover:bg-teal-100 hover:text-teal-800 transition-colors"
              >
                {search}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Find Part-Time Receptionist Jobs Today
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Browse part-time receptionist opportunities across the UK
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/part-time-jobs?q=receptionist"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-lg bg-teal-500 text-white hover:bg-teal-400 transition-all duration-200"
            >
              Browse Receptionist Jobs →
            </Link>
            <Link
              href="/handler/sign-up"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-lg border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-all duration-200"
            >
              Create Job Alert
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
