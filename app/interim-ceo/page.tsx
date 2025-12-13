import { Metadata } from 'next'
import Link from 'next/link'
import { VideoHeroBackground } from '@/components/VideoHeroBackground'

export const revalidate = 3600
const HERO_VIDEO_PLAYBACK_ID = "qIS6PGKxIZyzjrDBzxQuqPRBOhHofDnXq1chdsqAY9Y"

export const metadata: Metadata = {
  title: 'Interim CEO Services UK | Hire a Temporary CEO',
  description: 'Hire an Interim CEO for your business. Full-time temporary executive leadership for transitions, turnarounds, and transformation. Expert CEOs available immediately.',
  keywords: 'interim ceo, interim ceo services, hire interim ceo, temporary ceo, interim chief executive officer, interim ceo uk',
  alternates: { canonical: 'https://fractional.quest/interim-ceo' },
}

export default function InterimCEOPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <VideoHeroBackground playbackId={HERO_VIDEO_PLAYBACK_ID} fallbackGradient={true} />
        <div className="relative z-10 w-full py-20">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <Link href="/" className="inline-flex items-center text-white/60 hover:text-white mb-8 transition-colors text-sm"><span className="mr-2">←</span> Back to Home</Link>
            <div className="max-w-4xl">
              <span className="inline-block bg-gray-800 text-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] mb-6">Interim Leadership</span>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[0.9]">Interim CEO<br /><span className="text-gray-400">Services UK</span></h1>
              <p className="text-xl text-white/80 leading-relaxed max-w-2xl mb-8">Full-time temporary CEO leadership for transitions, turnarounds, and critical transformation periods. Experienced chief executives available to lead immediately.</p>
              <div className="flex flex-wrap gap-4">
                <Link href="#contact" className="px-8 py-4 bg-white text-black font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors">Hire an Interim CEO</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-900 mb-6">What is an Interim CEO?</h2>
          <p className="text-xl text-gray-600 leading-relaxed mb-6">An <strong>Interim CEO</strong> is a temporary Chief Executive Officer who leads an organisation full-time for a defined period—typically 6-18 months. Interim CEOs are brought in during critical transitions when organisations need experienced executive leadership immediately.</p>
          <p className="text-gray-600">Unlike other C-suite roles, CEO positions rarely work on a fractional basis due to the all-encompassing nature of the role. Interim CEO is the appropriate model for temporary executive leadership.</p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-900 mb-8">When to Hire an Interim CEO</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { scenario: 'CEO Departure', description: 'Sudden or planned CEO departure requiring immediate leadership while the board recruits.' },
              { scenario: 'Turnaround', description: 'Company in crisis requiring experienced leadership to stabilise and redirect.' },
              { scenario: 'Founder Transition', description: 'Founder stepping back and needing professional CEO leadership during transition.' },
              { scenario: 'Pre-Exit', description: 'Preparing for sale or IPO and needing CEO experience to maximise value.' },
              { scenario: 'Board Conflict', description: 'Leadership conflicts requiring neutral, experienced interim leadership.' },
              { scenario: 'Strategic Pivot', description: 'Major strategic change requiring fresh leadership perspective and execution.' },
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
          <h2 className="text-3xl font-black text-gray-900 mb-8">What Does an Interim CEO Do?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Stabilise Operations', description: 'Quickly assess the situation and stabilise the organisation during uncertainty.' },
              { title: 'Lead the Team', description: 'Provide clear leadership to the executive team and broader organisation.' },
              { title: 'Board Relations', description: 'Work with the board on strategy, reporting, and CEO succession planning.' },
              { title: 'Stakeholder Management', description: 'Manage relationships with investors, customers, and key partners.' },
              { title: 'Drive Performance', description: 'Maintain or improve business performance during the transition period.' },
              { title: 'Prepare Succession', description: 'Set up the organisation for success under permanent leadership.' },
            ].map((item, i) => (
              <div key={i} className="p-6 bg-gray-50 border-l-4 border-gray-800">
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black mb-6">Need an Interim CEO?</h2>
          <p className="text-xl text-gray-400 mb-10">Tell us about your situation and we'll help you find experienced interim CEO candidates.</p>
          <Link href="/handler/sign-up" className="px-10 py-5 bg-white text-black font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors inline-block">Find an Interim CEO</Link>
        </div>
      </section>

      <section className="py-12 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/interim-cfo" className="text-gray-600 hover:text-gray-900 font-medium">Interim CFO</Link>
            <Link href="/interim-coo" className="text-gray-600 hover:text-gray-900 font-medium">Interim COO</Link>
            <Link href="/interim-cmo" className="text-gray-600 hover:text-gray-900 font-medium">Interim CMO</Link>
            <Link href="/interim-cto" className="text-gray-600 hover:text-gray-900 font-medium">Interim CTO</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
