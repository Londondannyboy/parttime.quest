import { Metadata } from 'next'
import Link from 'next/link'
import { createDbQuery } from '@/lib/db'
import { JobsGraph3D } from '@/components/JobsGraph3D'
import { EmbeddedJobBoard } from '@/components/EmbeddedJobBoard'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Part-Time Admin Jobs UK | Office & Administrative Roles',
  description: 'Find part-time admin jobs in the UK. Office Administrator, Executive Assistant, Office Manager roles. Flexible hours, competitive pay. Browse part-time admin jobs now.',
  keywords: 'part time admin jobs, part-time administrative jobs, office administrator jobs, part-time office manager, executive assistant jobs uk',
  openGraph: {
    title: 'Part-Time Admin Jobs UK | Office & Administrative Roles',
    description: 'Find part-time admin jobs in the UK. Office Administrator, Executive Assistant, Office Manager roles.',
    type: 'website',
  },
}

const adminRoles = [
  { name: 'Part-Time Office Manager', description: 'Office operations & team support', rateRange: '£150-£300/day', demand: 'Very High' },
  { name: 'Part-Time Executive Assistant', description: 'C-suite support & diary management', rateRange: '£200-£400/day', demand: 'High' },
  { name: 'Part-Time Office Administrator', description: 'General admin & coordination', rateRange: '£100-£180/day', demand: 'Very High' },
  { name: 'Part-Time PA', description: 'Personal assistant duties', rateRange: '£150-£350/day', demand: 'High' },
  { name: 'Part-Time HR Administrator', description: 'HR support & documentation', rateRange: '£120-£220/day', demand: 'Growing' },
  { name: 'Part-Time Finance Admin', description: 'Bookkeeping & accounts support', rateRange: '£130-£250/day', demand: 'High' },
]

const adminSectors = [
  { name: 'Professional Services', icon: '💼', growth: '+18% YoY', description: 'Law, accounting, consulting' },
  { name: 'Healthcare', icon: '🏥', growth: '+22% YoY', description: 'NHS & private healthcare' },
  { name: 'Education', icon: '🎓', growth: '+15% YoY', description: 'Schools & universities' },
  { name: 'Tech & Startups', icon: '💻', growth: '+25% YoY', description: 'Technology companies' },
  { name: 'Finance', icon: '🏦', growth: '+12% YoY', description: 'Banking & financial services' },
  { name: 'Non-Profit', icon: '❤️', growth: '+20% YoY', description: 'Charities & social enterprises' },
]

const adminSkills = [
  'Microsoft Office Suite', 'Calendar & Diary Management', 'Document Management',
  'Communication Skills', 'Data Entry & Database', 'Meeting Coordination',
  'Travel Arrangements', 'Budget Administration', 'CRM Systems'
]

const relatedSearches = [
  'Part-Time Admin Jobs Near Me', 'Part-Time Office Administrator', 'Part-Time Executive Assistant',
  'Part-Time Admin Jobs London', 'Part-Time Office Manager', 'Flexible Admin Jobs',
  'Part-Time PA Jobs', 'Part-Time Receptionist Admin', 'Work From Home Admin Jobs'
]

async function getAdminStats() {
  try {
    const sql = createDbQuery()
    const [total] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM jobs WHERE is_active = true AND (role_category ILIKE '%admin%' OR title ILIKE '%admin%' OR title ILIKE '%office manager%' OR title ILIKE '%executive assistant%' OR title ILIKE '%PA %')`
    ])
    return {
      total: parseInt((total[0] as any)?.count || '0'),
      avgDayRate: 180
    }
  } catch (error) {
    return { total: 30, avgDayRate: 180 }
  }
}

export default async function AdminJobsPage() {
  const stats = await getAdminStats()

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

                  <span className="inline-block bg-indigo-500/20 backdrop-blur text-indigo-200 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-6">
                    {stats.total > 0 ? `${stats.total}+` : 'Browse'} Admin Roles
                  </span>

                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[0.95] tracking-tight">
                    Part-Time<br />
                    <span className="text-indigo-300">Admin</span> Jobs UK
                  </h1>

                  <p className="text-lg text-white/70 mb-8 leading-relaxed max-w-lg">
                    Part-time admin jobs across the UK. Office Manager, Executive Assistant, Administrator positions with flexible hours.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="/part-time-jobs?role=Operations"
                      className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-lg bg-indigo-500 text-white hover:bg-indigo-400 transition-all duration-200"
                    >
                      Browse Admin Jobs →
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
                      <div className="text-3xl md:text-4xl font-bold text-indigo-400 font-mono">{stats.total > 0 ? `${stats.total}+` : '30+'}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Admin Jobs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-white font-mono">Flexible</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-white font-mono">UK Wide</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">& Remote</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-white font-mono">All Levels</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Experience</div>
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
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-gray-400 mb-4 block">Part-Time Admin Jobs UK</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              Find part-time admin jobs<br />that fit your life
            </h2>
          </div>
          <div className="prose prose-xl prose-gray max-w-none">
            <p className="text-xl text-gray-600 leading-relaxed text-center">
              Part-time admin jobs offer the perfect balance of professional work and flexibility. From Office Administrators to Executive Assistants, administrative roles are in high demand across every sector of the UK economy. Many positions offer hybrid or remote working options.
            </p>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-gray-400 mb-4 block">By Role</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Part-Time Admin Roles</h2>
            <p className="text-xl text-gray-500">Popular part-time administrative positions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminRoles.map((role, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{role.name}</h3>
                <p className="text-gray-600 mb-4">{role.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-indigo-600 font-semibold">{role.rateRange}</span>
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-medium">
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
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Sectors Hiring Admin Staff</h2>
            <p className="text-xl text-gray-500">Part-time admin opportunities across industries</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {adminSectors.map((sector, i) => (
              <div key={i} className="text-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <span className="text-4xl mb-3 block">{sector.icon}</span>
                <h3 className="font-bold text-gray-900 mb-1">{sector.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{sector.description}</p>
                <span className="text-indigo-600 text-xs font-medium">{sector.growth}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Part-Time Admin */}
      <section className="py-20 md:py-28 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Why Choose Part-Time Admin Work?</h2>
            <p className="text-xl text-gray-400">Benefits of flexible administrative careers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🏠</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Remote Options</h3>
              <p className="text-gray-600">
                Many part-time admin roles offer remote or hybrid working. Handle emails, scheduling, and document work from home.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">📚</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Transferable Skills</h3>
              <p className="text-gray-600">
                Admin skills transfer across industries. Build experience in tech, finance, healthcare, or any sector that interests you.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Career Progression</h3>
              <p className="text-gray-600">
                Start as an administrator, progress to Office Manager or Executive Assistant. Many senior professionals began in admin roles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Job Board */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest Part-Time Admin Jobs</h2>
            <p className="text-xl text-gray-500">Browse current administrative opportunities</p>
          </div>
          <EmbeddedJobBoard
            defaultDepartment="Operations"
            title="Part-Time Admin Jobs"
            jobsPerPage={6}
            showAllJobsLink={true}
            allJobsLinkText="View All Admin Jobs"
          />
        </div>
      </section>

      {/* Skills */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">In-Demand Admin Skills</h2>
            <p className="text-xl text-gray-500">Skills employers look for in part-time admin candidates</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {adminSkills.map((skill, i) => (
              <span key={i} className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm font-medium hover:bg-indigo-100 transition-colors">
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Part-Time Admin Jobs FAQ</h2>
          </div>

          <div className="space-y-6">
            <details className="group bg-white rounded-xl p-6 cursor-pointer border border-gray-200">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                How much do part-time admin jobs pay?
                <span className="text-gray-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Part-time admin jobs typically pay £10-20/hour depending on role and experience. Office Administrators earn £10-14/hour, while Executive Assistants and Office Managers can earn £15-25/hour. Senior PA roles to executives may pay £25-40/hour.
              </p>
            </details>

            <details className="group bg-white rounded-xl p-6 cursor-pointer border border-gray-200">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                Can I work from home in a part-time admin role?
                <span className="text-gray-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Yes! Many part-time admin jobs now offer remote or hybrid working. Virtual assistant roles, document management, email handling, and calendar coordination can all be done remotely. However, some roles require on-site presence for reception or physical filing.
              </p>
            </details>

            <details className="group bg-white rounded-xl p-6 cursor-pointer border border-gray-200">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                What qualifications do I need for admin work?
                <span className="text-gray-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Most admin roles require good communication skills and proficiency in Microsoft Office. Formal qualifications aren't always necessary, though business admin NVQs or secretarial diplomas can help. Experience is often valued more than qualifications.
              </p>
            </details>

            <details className="group bg-white rounded-xl p-6 cursor-pointer border border-gray-200">
              <summary className="flex justify-between items-center font-bold text-lg text-gray-900 list-none">
                How many hours is part-time admin work?
                <span className="text-gray-700 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Part-time admin jobs typically range from 15-30 hours per week. Common patterns include mornings only (9am-1pm), 3 full days per week, or flexible hours across the week. Many employers are open to discussing schedules that work for both parties.
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
                className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm hover:bg-indigo-100 hover:text-indigo-800 transition-colors"
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
            Find Part-Time Admin Jobs Today
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Browse part-time administrative opportunities across the UK
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/part-time-jobs"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-lg bg-indigo-500 text-white hover:bg-indigo-400 transition-all duration-200"
            >
              Browse All Jobs →
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
