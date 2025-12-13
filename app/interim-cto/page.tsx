import { Metadata } from 'next'
import Link from 'next/link'
import { VideoHeroBackground } from '@/components/VideoHeroBackground'
import { ServiceComparisonTable } from '@/components/ServiceComparisonTable'

export const revalidate = 3600

const HERO_VIDEO_PLAYBACK_ID = "qIS6PGKxIZyzjrDBzxQuqPRBOhHofDnXq1chdsqAY9Y"

export const metadata: Metadata = {
  title: 'Interim CTO Services UK | Hire a Temporary CTO',
  description: 'Hire an Interim CTO for your business. Full-time temporary technical leadership for transformations, migrations, and critical technical periods. Expert CTOs available immediately.',
  keywords: 'interim cto, interim cto services, hire interim cto, temporary cto, interim chief technology officer, interim cto uk',
  alternates: { canonical: 'https://fractional.quest/interim-cto' },
  openGraph: {
    title: 'Interim CTO Services UK | Hire a Temporary CTO',
    description: 'Hire an Interim CTO for your business. Full-time temporary technical leadership.',
    url: 'https://fractional.quest/interim-cto',
  },
}

export default function InterimCTOPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <VideoHeroBackground playbackId={HERO_VIDEO_PLAYBACK_ID} fallbackGradient={true} />
        <div className="relative z-10 w-full py-20">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <Link href="/" className="inline-flex items-center text-white/60 hover:text-white mb-8 transition-colors text-sm">
              <span className="mr-2">←</span> Back to Home
            </Link>
            <div className="max-w-4xl">
              <span className="inline-block bg-blue-500 text-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] mb-6">Interim Leadership</span>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[0.9]">
                Interim CTO<br /><span className="text-blue-400">Services UK</span>
              </h1>
              <p className="text-xl text-white/80 leading-relaxed max-w-2xl mb-8">
                Full-time temporary CTO leadership for technical transformations, platform migrations, and critical periods. Expert technology executives available to start immediately.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="#contact" className="px-8 py-4 bg-blue-500 text-white font-bold uppercase tracking-wider hover:bg-blue-400 transition-colors">Hire an Interim CTO</Link>
                <Link href="/fractional-cto-services" className="px-8 py-4 border-2 border-white text-white font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors">Consider Fractional Instead?</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">What is an Interim CTO?</h2>
          <div className="prose prose-lg prose-gray max-w-none">
            <p className="text-xl text-gray-600 leading-relaxed mb-6">
              An <strong>Interim CTO</strong> is a temporary Chief Technology Officer who works full-time for a defined period—typically 3-12 months. Unlike fractional CTOs who work part-time, interim CTOs focus exclusively on one organisation during their engagement.
            </p>
            <p>Interim CTOs are typically hired to lead technical transformations, manage critical migrations, or fill leadership gaps during CTO transitions.</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-900 mb-8">When to Hire an Interim CTO</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { scenario: 'CTO Departure', description: 'Your CTO has left and you need immediate technical leadership while recruiting a permanent replacement.' },
              { scenario: 'Platform Migration', description: 'Major platform rewrite or cloud migration requiring dedicated technical leadership.' },
              { scenario: 'Technical Due Diligence', description: 'Preparing for acquisition or investment with intensive technical preparation needs.' },
              { scenario: 'Team Restructuring', description: 'Rebuilding or significantly restructuring the engineering organisation.' },
              { scenario: 'Security Incident', description: 'Major security breach requiring full-time technical crisis management.' },
              { scenario: 'Technical Turnaround', description: 'Technical debt or quality crisis requiring focused leadership to resolve.' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">{item.scenario}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-900 mb-8">Interim CTO vs Fractional CTO</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 text-left font-bold">Aspect</th>
                  <th className="p-4 text-left font-bold text-blue-700">Interim CTO</th>
                  <th className="p-4 text-left font-bold">Fractional CTO</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="p-4 font-medium">Time Commitment</td><td className="p-4">Full-time (5 days/week)</td><td className="p-4">Part-time (1-3 days/week)</td></tr>
                <tr className="border-b bg-gray-50"><td className="p-4 font-medium">Duration</td><td className="p-4">3-12 months (fixed term)</td><td className="p-4">Ongoing (indefinite)</td></tr>
                <tr className="border-b"><td className="p-4 font-medium">Cost</td><td className="p-4">£8,000-£14,000/week</td><td className="p-4">£3,500-£6,500/week</td></tr>
                <tr className="border-b bg-gray-50"><td className="p-4 font-medium">Best For</td><td className="p-4">Migrations, transformations, crises</td><td className="p-4">Ongoing technical leadership</td></tr>
              </tbody>
            </table>
          </div>
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 font-medium mb-2">Not sure which is right for you?</p>
            <p className="text-blue-700 text-sm mb-4">If you need full-time focus for a specific technical project, choose interim. If you need ongoing technical leadership at lower cost, choose fractional.</p>
            <Link href="/fractional-cto-services" className="text-blue-700 font-bold hover:text-blue-900">Learn about Fractional CTO Services →</Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <ServiceComparisonTable role="CTO" accentColor="blue" />
        </div>
      </section>

      <section id="contact" className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black mb-6">Need an Interim CTO?</h2>
          <p className="text-xl text-gray-400 mb-10">Tell us about your situation and we'll help you find the right interim or fractional CTO.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/handler/sign-up" className="px-10 py-5 bg-blue-500 text-white font-bold uppercase tracking-wider hover:bg-blue-400 transition-colors">Find an Interim CTO</Link>
            <Link href="/fractional-cto-services" className="px-10 py-5 border-2 border-white text-white font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors">Explore Fractional CTO</Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/fractional-cto-services" className="text-gray-600 hover:text-blue-600 font-medium">Fractional CTO</Link>
            <Link href="/interim-cfo" className="text-gray-600 hover:text-blue-600 font-medium">Interim CFO</Link>
            <Link href="/interim-cmo" className="text-gray-600 hover:text-blue-600 font-medium">Interim CMO</Link>
            <Link href="/interim-coo" className="text-gray-600 hover:text-blue-600 font-medium">Interim COO</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
