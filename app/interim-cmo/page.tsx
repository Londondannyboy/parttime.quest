import { Metadata } from 'next'
import Link from 'next/link'
import { VideoHeroBackground } from '@/components/VideoHeroBackground'
import { ServiceComparisonTable } from '@/components/ServiceComparisonTable'

export const revalidate = 3600

const HERO_VIDEO_PLAYBACK_ID = "qIS6PGKxIZyzjrDBzxQuqPRBOhHofDnXq1chdsqAY9Y"

export const metadata: Metadata = {
  title: 'Interim CMO Services UK | Hire a Temporary CMO',
  description: 'Hire an Interim CMO for your business. Full-time temporary marketing leadership for transitions, rebrands, and transformations. Expert CMOs available immediately.',
  keywords: 'interim cmo, interim cmo services, hire interim cmo, temporary cmo, interim chief marketing officer, interim cmo uk',
  alternates: { canonical: 'https://fractional.quest/interim-cmo' },
  openGraph: {
    title: 'Interim CMO Services UK | Hire a Temporary CMO',
    description: 'Hire an Interim CMO for your business. Full-time temporary marketing leadership.',
    url: 'https://fractional.quest/interim-cmo',
  },
}

export default function InterimCMOPage() {
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
              <span className="inline-block bg-amber-500 text-black px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] mb-6">Interim Leadership</span>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[0.9]">
                Interim CMO<br /><span className="text-amber-400">Services UK</span>
              </h1>
              <p className="text-xl text-white/80 leading-relaxed max-w-2xl mb-8">
                Full-time temporary CMO leadership for transitions, rebrands, and marketing transformations. Expert marketing executives available to start immediately.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="#contact" className="px-8 py-4 bg-amber-500 text-black font-bold uppercase tracking-wider hover:bg-amber-400 transition-colors">Hire an Interim CMO</Link>
                <Link href="/fractional-cmo-services" className="px-8 py-4 border-2 border-white text-white font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors">Consider Fractional Instead?</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">What is an Interim CMO?</h2>
          <div className="prose prose-lg prose-gray max-w-none">
            <p className="text-xl text-gray-600 leading-relaxed mb-6">
              An <strong>Interim CMO</strong> is a temporary Chief Marketing Officer who works full-time for a defined period—typically 3-12 months. Unlike fractional CMOs who work part-time, interim CMOs focus exclusively on one organisation during their engagement.
            </p>
            <p>Interim CMOs are typically hired to fill leadership gaps, lead rebrands, or drive marketing transformations during critical periods.</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-900 mb-8">When to Hire an Interim CMO</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { scenario: 'CMO Departure', description: 'Your CMO has left and you need immediate leadership while recruiting a permanent replacement.' },
              { scenario: 'Major Rebrand', description: 'Complete brand overhaul requiring full-time dedicated marketing leadership.' },
              { scenario: 'Market Launch', description: 'Launching into new markets and need intensive marketing leadership for the push.' },
              { scenario: 'Marketing Transformation', description: 'Overhauling marketing function, tech stack, or go-to-market approach.' },
              { scenario: 'Merger Integration', description: 'Integrating marketing teams and brands post-merger.' },
              { scenario: 'Turnaround', description: 'Marketing performance needs urgent improvement requiring full-time focus.' },
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
          <h2 className="text-3xl font-black text-gray-900 mb-8">Interim CMO vs Fractional CMO</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 text-left font-bold">Aspect</th>
                  <th className="p-4 text-left font-bold text-amber-700">Interim CMO</th>
                  <th className="p-4 text-left font-bold">Fractional CMO</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="p-4 font-medium">Time Commitment</td><td className="p-4">Full-time (5 days/week)</td><td className="p-4">Part-time (1-3 days/week)</td></tr>
                <tr className="border-b bg-gray-50"><td className="p-4 font-medium">Duration</td><td className="p-4">3-12 months (fixed term)</td><td className="p-4">Ongoing (indefinite)</td></tr>
                <tr className="border-b"><td className="p-4 font-medium">Cost</td><td className="p-4">£6,000-£10,000/week</td><td className="p-4">£3,000-£5,500/week</td></tr>
                <tr className="border-b bg-gray-50"><td className="p-4 font-medium">Best For</td><td className="p-4">Rebrands, transformations, gaps</td><td className="p-4">Ongoing strategic leadership</td></tr>
              </tbody>
            </table>
          </div>
          <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 font-medium mb-2">Not sure which is right for you?</p>
            <p className="text-amber-700 text-sm mb-4">If you need full-time focus for a specific project, choose interim. If you need ongoing marketing leadership at lower cost, choose fractional.</p>
            <Link href="/fractional-cmo-services" className="text-amber-700 font-bold hover:text-amber-900">Learn about Fractional CMO Services →</Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <ServiceComparisonTable role="CMO" accentColor="amber" />
        </div>
      </section>

      <section id="contact" className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black mb-6">Need an Interim CMO?</h2>
          <p className="text-xl text-gray-400 mb-10">Tell us about your situation and we'll help you find the right interim or fractional CMO.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/handler/sign-up" className="px-10 py-5 bg-amber-500 text-black font-bold uppercase tracking-wider hover:bg-amber-400 transition-colors">Find an Interim CMO</Link>
            <Link href="/fractional-cmo-services" className="px-10 py-5 border-2 border-white text-white font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors">Explore Fractional CMO</Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/fractional-cmo-services" className="text-gray-600 hover:text-amber-600 font-medium">Fractional CMO</Link>
            <Link href="/interim-cfo" className="text-gray-600 hover:text-amber-600 font-medium">Interim CFO</Link>
            <Link href="/interim-cto" className="text-gray-600 hover:text-amber-600 font-medium">Interim CTO</Link>
            <Link href="/interim-coo" className="text-gray-600 hover:text-amber-600 font-medium">Interim COO</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
