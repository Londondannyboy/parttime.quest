import { Metadata } from 'next'
import Link from 'next/link'
import { VideoHeroBackground } from '@/components/VideoHeroBackground'
import { ServiceComparisonTable } from '@/components/ServiceComparisonTable'

export const revalidate = 3600
const HERO_VIDEO_PLAYBACK_ID = "qIS6PGKxIZyzjrDBzxQuqPRBOhHofDnXq1chdsqAY9Y"

export const metadata: Metadata = {
  title: 'Interim CRO Services UK | Hire a Temporary CRO',
  description: 'Hire an Interim CRO for your business. Full-time temporary revenue leadership for sales transformations and go-to-market pivots. Expert CROs available immediately.',
  keywords: 'interim cro, interim cro services, hire interim cro, temporary cro, interim chief revenue officer, interim cro uk',
  alternates: { canonical: 'https://fractional.quest/interim-cro' },
}

export default function InterimCROPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <VideoHeroBackground playbackId={HERO_VIDEO_PLAYBACK_ID} fallbackGradient={true} />
        <div className="relative z-10 w-full py-20">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <Link href="/" className="inline-flex items-center text-white/60 hover:text-white mb-8 transition-colors text-sm"><span className="mr-2">←</span> Back to Home</Link>
            <div className="max-w-4xl">
              <span className="inline-block bg-green-500 text-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] mb-6">Interim Leadership</span>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[0.9]">Interim CRO<br /><span className="text-green-400">Services UK</span></h1>
              <p className="text-xl text-white/80 leading-relaxed max-w-2xl mb-8">Full-time temporary revenue leadership for sales transformations, go-to-market pivots, and revenue crises. Expert revenue executives available immediately.</p>
              <div className="flex flex-wrap gap-4">
                <Link href="#contact" className="px-8 py-4 bg-green-500 text-white font-bold uppercase tracking-wider hover:bg-green-400 transition-colors">Hire an Interim CRO</Link>
                <Link href="/fractional-cro-services" className="px-8 py-4 border-2 border-white text-white font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors">Consider Fractional Instead?</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-900 mb-6">What is an Interim CRO?</h2>
          <p className="text-xl text-gray-600 leading-relaxed mb-6">An <strong>Interim CRO</strong> is a temporary Chief Revenue Officer who works full-time for a defined period—typically 3-12 months. Unlike fractional CROs who work part-time, interim CROs focus exclusively on one organisation during critical revenue periods.</p>
          <p className="text-gray-600">Interim CROs are typically hired to lead sales transformations, rebuild underperforming revenue teams, or manage go-to-market pivots requiring intensive daily leadership.</p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-900 mb-8">When to Hire an Interim CRO</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { scenario: 'CRO Departure', description: 'Your CRO or Sales VP has left and you need immediate revenue leadership while recruiting.' },
              { scenario: 'Revenue Crisis', description: 'Sales significantly underperforming and needs intensive turnaround leadership.' },
              { scenario: 'Go-to-Market Pivot', description: 'Major GTM strategy change requiring dedicated full-time focus to execute.' },
              { scenario: 'Sales Team Rebuild', description: 'Restructuring or rebuilding the entire sales organisation.' },
              { scenario: 'Market Expansion', description: 'Entering new markets or geographies with intensive sales buildout.' },
              { scenario: 'Pre-Funding Sprint', description: 'Need to demonstrate revenue growth for upcoming funding round.' },
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
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <ServiceComparisonTable role="CRO" accentColor="green" />
        </div>
      </section>

      <section id="contact" className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black mb-6">Need an Interim CRO?</h2>
          <p className="text-xl text-gray-400 mb-10">Tell us about your revenue challenges and we'll help you find the right interim or fractional CRO.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/handler/sign-up" className="px-10 py-5 bg-green-500 text-white font-bold uppercase tracking-wider hover:bg-green-400 transition-colors">Find an Interim CRO</Link>
            <Link href="/fractional-cro-services" className="px-10 py-5 border-2 border-white text-white font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors">Explore Fractional CRO</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
