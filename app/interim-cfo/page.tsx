import { Metadata } from 'next'
import Link from 'next/link'
import { VideoHeroBackground } from '@/components/VideoHeroBackground'
import { ServiceComparisonTable } from '@/components/ServiceComparisonTable'

export const revalidate = 3600

const HERO_VIDEO_PLAYBACK_ID = "qIS6PGKxIZyzjrDBzxQuqPRBOhHofDnXq1chdsqAY9Y"

export const metadata: Metadata = {
  title: 'Interim CFO Services UK | Hire a Temporary CFO',
  description: 'Hire an Interim CFO for your business. Full-time temporary financial leadership for transitions, transformations, and gap-filling. Expert CFOs available immediately.',
  keywords: 'interim cfo, interim cfo services, hire interim cfo, temporary cfo, interim chief financial officer, interim cfo uk',
  alternates: { canonical: 'https://fractional.quest/interim-cfo' },
  openGraph: {
    title: 'Interim CFO Services UK | Hire a Temporary CFO',
    description: 'Hire an Interim CFO for your business. Full-time temporary financial leadership.',
    url: 'https://fractional.quest/interim-cfo',
  },
}

export default function InterimCFOPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <VideoHeroBackground playbackId={HERO_VIDEO_PLAYBACK_ID} fallbackGradient={true} />
        <div className="relative z-10 w-full py-20">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <Link href="/" className="inline-flex items-center text-white/60 hover:text-white mb-8 transition-colors text-sm">
              <span className="mr-2">←</span> Back to Home
            </Link>
            <div className="max-w-4xl">
              <span className="inline-block bg-emerald-500 text-black px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] mb-6">
                Interim Leadership
              </span>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[0.9]">
                Interim CFO<br /><span className="text-emerald-400">Services UK</span>
              </h1>
              <p className="text-xl text-white/80 leading-relaxed max-w-2xl mb-8">
                Full-time temporary CFO leadership for transitions, transformations, and critical periods. Expert financial executives available to start immediately.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="#contact" className="px-8 py-4 bg-emerald-500 text-black font-bold uppercase tracking-wider hover:bg-emerald-400 transition-colors">
                  Hire an Interim CFO
                </Link>
                <Link href="/fractional-cfo-services" className="px-8 py-4 border-2 border-white text-white font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors">
                  Consider Fractional Instead?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Interim */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">What is an Interim CFO?</h2>
          <div className="prose prose-lg prose-gray max-w-none">
            <p className="text-xl text-gray-600 leading-relaxed mb-6">
              An <strong>Interim CFO</strong> is a temporary Chief Financial Officer who works full-time for a defined period—typically 3-12 months. Unlike fractional CFOs who work part-time across multiple companies, interim CFOs focus exclusively on one organisation during their engagement.
            </p>
            <p>
              Interim CFOs are typically hired to fill leadership gaps, lead specific transformations, or navigate critical periods like M&A, restructuring, or CFO transitions.
            </p>
          </div>
        </div>
      </section>

      {/* When to Hire */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-900 mb-8">When to Hire an Interim CFO</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { scenario: 'CFO Departure', description: 'Your CFO has left and you need immediate leadership while recruiting a permanent replacement.' },
              { scenario: 'M&A Transaction', description: 'Buying or selling a company and need dedicated CFO leadership through the transaction.' },
              { scenario: 'Restructuring', description: 'Major restructuring or turnaround requiring full-time financial leadership focus.' },
              { scenario: 'IPO Preparation', description: 'Preparing for public markets and need experienced CFO leadership through the process.' },
              { scenario: 'Crisis Management', description: 'Financial crisis requiring immediate, full-time executive attention.' },
              { scenario: 'System Implementation', description: 'Major ERP or financial system implementation requiring dedicated leadership.' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">{item.scenario}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interim vs Fractional */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-900 mb-8">Interim CFO vs Fractional CFO</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 text-left font-bold">Aspect</th>
                  <th className="p-4 text-left font-bold text-emerald-700">Interim CFO</th>
                  <th className="p-4 text-left font-bold">Fractional CFO</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="p-4 font-medium">Time Commitment</td><td className="p-4">Full-time (5 days/week)</td><td className="p-4">Part-time (1-3 days/week)</td></tr>
                <tr className="border-b bg-gray-50"><td className="p-4 font-medium">Duration</td><td className="p-4">3-12 months (fixed term)</td><td className="p-4">Ongoing (indefinite)</td></tr>
                <tr className="border-b"><td className="p-4 font-medium">Focus</td><td className="p-4">Single company, deep immersion</td><td className="p-4">Multiple clients, broader perspective</td></tr>
                <tr className="border-b bg-gray-50"><td className="p-4 font-medium">Cost</td><td className="p-4">£8,000-£12,000/week</td><td className="p-4">£3,000-£6,000/week</td></tr>
                <tr className="border-b"><td className="p-4 font-medium">Best For</td><td className="p-4">Transitions, transformations, crises</td><td className="p-4">Ongoing strategic leadership</td></tr>
              </tbody>
            </table>
          </div>
          <div className="mt-8 p-6 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-emerald-800 font-medium mb-2">Not sure which is right for you?</p>
            <p className="text-emerald-700 text-sm mb-4">If you need full-time focus for a specific project or transition, choose interim. If you need ongoing strategic CFO leadership at lower cost, choose fractional.</p>
            <Link href="/fractional-cfo-services" className="text-emerald-700 font-bold hover:text-emerald-900">Learn about Fractional CFO Services →</Link>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Full Comparison</h2>
          <ServiceComparisonTable role="CFO" accentColor="emerald" />
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black mb-6">Need an Interim CFO?</h2>
          <p className="text-xl text-gray-400 mb-10">Tell us about your situation and we'll help you find the right interim or fractional CFO.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/handler/sign-up" className="px-10 py-5 bg-emerald-500 text-black font-bold uppercase tracking-wider hover:bg-emerald-400 transition-colors">
              Find an Interim CFO
            </Link>
            <Link href="/fractional-cfo-services" className="px-10 py-5 border-2 border-white text-white font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors">
              Explore Fractional CFO
            </Link>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/fractional-cfo-services" className="text-gray-600 hover:text-emerald-600 font-medium">Fractional CFO</Link>
            <Link href="/interim-cmo" className="text-gray-600 hover:text-emerald-600 font-medium">Interim CMO</Link>
            <Link href="/interim-cto" className="text-gray-600 hover:text-emerald-600 font-medium">Interim CTO</Link>
            <Link href="/interim-coo" className="text-gray-600 hover:text-emerald-600 font-medium">Interim COO</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
