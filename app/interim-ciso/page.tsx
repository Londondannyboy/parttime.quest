import { Metadata } from 'next'
import Link from 'next/link'
import { VideoHeroBackground } from '@/components/VideoHeroBackground'
import { ServiceComparisonTable } from '@/components/ServiceComparisonTable'

export const revalidate = 3600
const HERO_VIDEO_PLAYBACK_ID = "qIS6PGKxIZyzjrDBzxQuqPRBOhHofDnXq1chdsqAY9Y"

export const metadata: Metadata = {
  title: 'Interim CISO Services UK | Hire a Temporary CISO',
  description: 'Hire an Interim CISO for your business. Full-time temporary security leadership for breaches, compliance, and security transformations. Expert CISOs available immediately.',
  keywords: 'interim ciso, interim ciso services, hire interim ciso, temporary ciso, interim chief information security officer, interim ciso uk',
  alternates: { canonical: 'https://fractional.quest/interim-ciso' },
}

export default function InterimCISOPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <VideoHeroBackground playbackId={HERO_VIDEO_PLAYBACK_ID} fallbackGradient={true} />
        <div className="relative z-10 w-full py-20">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <Link href="/" className="inline-flex items-center text-white/60 hover:text-white mb-8 transition-colors text-sm"><span className="mr-2">←</span> Back to Home</Link>
            <div className="max-w-4xl">
              <span className="inline-block bg-red-500 text-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] mb-6">Interim Leadership</span>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[0.9]">Interim CISO<br /><span className="text-red-400">Services UK</span></h1>
              <p className="text-xl text-white/80 leading-relaxed max-w-2xl mb-8">Full-time temporary security leadership for breaches, compliance requirements, and security transformations. Expert security executives available immediately.</p>
              <div className="flex flex-wrap gap-4">
                <Link href="#contact" className="px-8 py-4 bg-red-500 text-white font-bold uppercase tracking-wider hover:bg-red-400 transition-colors">Hire an Interim CISO</Link>
                <Link href="/fractional-ciso-services" className="px-8 py-4 border-2 border-white text-white font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors">Consider Fractional Instead?</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-900 mb-6">What is an Interim CISO?</h2>
          <p className="text-xl text-gray-600 leading-relaxed mb-6">An <strong>Interim CISO</strong> is a temporary Chief Information Security Officer who works full-time for a defined period—typically 3-12 months. Unlike fractional CISOs who work part-time, interim CISOs focus exclusively on one organisation during critical security periods.</p>
          <p className="text-gray-600">Interim CISOs are typically hired following security breaches, during major compliance initiatives, or to lead security transformations requiring intensive daily attention.</p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-900 mb-8">When to Hire an Interim CISO</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { scenario: 'Security Breach', description: 'Active breach or incident requiring full-time crisis management and remediation.' },
              { scenario: 'CISO Departure', description: 'Your CISO has left and you need immediate security leadership while recruiting.' },
              { scenario: 'Compliance Deadline', description: 'Major compliance requirements (SOC 2, ISO 27001, PCI-DSS) with tight deadlines.' },
              { scenario: 'Security Transformation', description: 'Complete overhaul of security programme requiring dedicated leadership.' },
              { scenario: 'Due Diligence', description: 'Preparing for acquisition or investment with intensive security scrutiny.' },
              { scenario: 'Post-Breach Recovery', description: 'Rebuilding security posture after a significant incident.' },
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
          <ServiceComparisonTable role="CISO" accentColor="red" />
        </div>
      </section>

      <section id="contact" className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black mb-6">Need an Interim CISO?</h2>
          <p className="text-xl text-gray-400 mb-10">Tell us about your security challenges and we'll help you find the right interim or fractional CISO.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/handler/sign-up" className="px-10 py-5 bg-red-500 text-white font-bold uppercase tracking-wider hover:bg-red-400 transition-colors">Find an Interim CISO</Link>
            <Link href="/fractional-ciso-services" className="px-10 py-5 border-2 border-white text-white font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors">Explore Fractional CISO</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
