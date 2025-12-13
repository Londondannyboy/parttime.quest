import { Metadata } from 'next'
import Link from 'next/link'
import { VideoHeroBackground } from '@/components/VideoHeroBackground'
import { ServiceComparisonTable } from '@/components/ServiceComparisonTable'

export const revalidate = 3600
const HERO_VIDEO_PLAYBACK_ID = "qIS6PGKxIZyzjrDBzxQuqPRBOhHofDnXq1chdsqAY9Y"

export const metadata: Metadata = {
  title: 'Interim CIO Services UK | Hire a Temporary CIO',
  description: 'Hire an Interim CIO for your business. Full-time temporary IT leadership for digital transformation, system migrations, and critical IT periods. Expert CIOs available immediately.',
  keywords: 'interim cio, interim cio services, hire interim cio, temporary cio, interim chief information officer, interim cio uk',
  alternates: { canonical: 'https://fractional.quest/interim-cio' },
}

export default function InterimCIOPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <VideoHeroBackground playbackId={HERO_VIDEO_PLAYBACK_ID} fallbackGradient={true} />
        <div className="relative z-10 w-full py-20">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <Link href="/" className="inline-flex items-center text-white/60 hover:text-white mb-8 transition-colors text-sm"><span className="mr-2">←</span> Back to Home</Link>
            <div className="max-w-4xl">
              <span className="inline-block bg-indigo-500 text-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] mb-6">Interim Leadership</span>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[0.9]">Interim CIO<br /><span className="text-indigo-400">Services UK</span></h1>
              <p className="text-xl text-white/80 leading-relaxed max-w-2xl mb-8">Full-time temporary IT leadership for digital transformations, system migrations, and critical technology periods. Expert IT executives available immediately.</p>
              <div className="flex flex-wrap gap-4">
                <Link href="#contact" className="px-8 py-4 bg-indigo-500 text-white font-bold uppercase tracking-wider hover:bg-indigo-400 transition-colors">Hire an Interim CIO</Link>
                <Link href="/fractional-cio-services" className="px-8 py-4 border-2 border-white text-white font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors">Consider Fractional Instead?</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-900 mb-6">What is an Interim CIO?</h2>
          <p className="text-xl text-gray-600 leading-relaxed mb-6">An <strong>Interim CIO</strong> is a temporary Chief Information Officer who works full-time for a defined period—typically 3-12 months. Unlike fractional CIOs who work part-time, interim CIOs focus exclusively on one organisation during major IT transformations or transitions.</p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-900 mb-8">When to Hire an Interim CIO</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { scenario: 'CIO Departure', description: 'Your CIO has left and you need immediate IT leadership while recruiting.' },
              { scenario: 'Digital Transformation', description: 'Major digital transformation requiring full-time dedicated leadership.' },
              { scenario: 'ERP Implementation', description: 'Large-scale ERP or system implementation needing intensive oversight.' },
              { scenario: 'IT Turnaround', description: 'IT function underperforming and needs dedicated leadership to fix.' },
              { scenario: 'M&A IT Integration', description: 'Integrating IT systems and teams post-acquisition.' },
              { scenario: 'Cloud Migration', description: 'Major cloud migration requiring full-time executive focus.' },
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
          <ServiceComparisonTable role="CIO" accentColor="purple" />
        </div>
      </section>

      <section id="contact" className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black mb-6">Need an Interim CIO?</h2>
          <p className="text-xl text-gray-400 mb-10">Tell us about your IT challenges and we'll help you find the right interim or fractional CIO.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/handler/sign-up" className="px-10 py-5 bg-indigo-500 text-white font-bold uppercase tracking-wider hover:bg-indigo-400 transition-colors">Find an Interim CIO</Link>
            <Link href="/fractional-cio-services" className="px-10 py-5 border-2 border-white text-white font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors">Explore Fractional CIO</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
