import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Part-Time Executive Calculators | Day Rate, Savings & Portfolio Tools',
  description: 'Free calculators for part-time executives and companies. Calculate day rates, company savings vs full-time hires, and plan your portfolio career. Essential tools for the UK part-time market.',
  alternates: {
    canonical: 'https://parttime.quest/calculators'
  }
}

const calculators = [
  {
    slug: 'company-savings',
    title: 'Company Savings Calculator',
    subtitle: 'For Companies',
    description: 'See how much your company saves hiring a part-time executive vs a full-time hire. Compare total costs including NI, pension, benefits, and overheads.',
    icon: '🏢',
    color: 'from-purple-600 to-purple-800',
    features: ['Full-time cost breakdown', 'Part-Time cost comparison', 'Annual savings calculation', 'Role-specific defaults']
  },
  {
    slug: 'rate-finder',
    title: 'Rate Finder Calculator',
    subtitle: 'For Executives',
    description: 'Discover your recommended day rate based on your experience, specialization, and location. Get market positioning insights and negotiation tips.',
    icon: '🎯',
    color: 'from-amber-500 to-orange-600',
    features: ['Experience-based rates', 'Location adjustments', 'Specialization premiums', 'Market positioning']
  },
  {
    slug: 'portfolio-builder',
    title: 'Portfolio Builder Calculator',
    subtitle: 'Career Planning',
    description: 'Plan your part-time portfolio career. Calculate how many clients you need, optimize your schedule, and assess concentration risk.',
    icon: '📊',
    color: 'from-emerald-500 to-teal-600',
    features: ['Client number planning', 'Weekly allocation', 'Risk assessment', 'Income optimization']
  },
  {
    slug: 'earnings',
    title: 'Earnings Calculator',
    subtitle: 'Income Planning',
    description: 'Calculate your potential earnings as a part-time executive. Factor in day rate, clients, and working patterns to see annual income.',
    icon: '💰',
    color: 'from-blue-500 to-indigo-600',
    features: ['Annual income projection', 'Tax estimation', 'Multiple client scenarios', 'IR35 considerations'],
    comingSoon: true
  }
]

export default function CalculatorsHub() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="section-label text-purple-300 mb-4 block">Free Tools</span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Part-Time Executive Calculators
          </h1>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto leading-relaxed">
            Essential tools for executives exploring part-time careers and companies
            considering part-time hires. Make data-driven decisions about your next move.
          </p>
        </div>
      </section>

      {/* Calculators Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {calculators.map((calc) => (
              <Link
                key={calc.slug}
                href={calc.comingSoon ? '#' : `/calculators/${calc.slug}`}
                className={`group relative ${calc.comingSoon ? 'cursor-not-allowed' : ''}`}
              >
                <div className={`card-premium p-8 h-full ${calc.comingSoon ? 'opacity-60' : ''}`}>
                  {calc.comingSoon && (
                    <span className="absolute top-4 right-4 bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
                      Coming Soon
                    </span>
                  )}

                  {/* Icon and header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${calc.color} flex items-center justify-center text-2xl shadow-lg`}>
                      {calc.icon}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                        {calc.subtitle}
                      </span>
                      <h2 className="text-xl font-bold text-gray-900 group-hover:text-purple-800 transition-colors">
                        {calc.title}
                      </h2>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {calc.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {calc.features.map((feature, i) => (
                      <span
                        key={i}
                        className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  {!calc.comingSoon && (
                    <span className="inline-flex items-center gap-2 text-purple-700 font-semibold group-hover:gap-3 transition-all">
                      Open Calculator
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Who Are These Calculators For?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* For Executives */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <span className="text-3xl mb-4 block">👔</span>
              <h3 className="text-xl font-bold text-gray-900 mb-3">For Executives</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">✓</span>
                  <span>Exploring a transition to part-time work</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">✓</span>
                  <span>Setting your day rate for the first time</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">✓</span>
                  <span>Planning your portfolio of clients</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">✓</span>
                  <span>Negotiating rates with confidence</span>
                </li>
              </ul>
              <Link
                href="/calculators/rate-finder"
                className="mt-6 btn-gradient inline-flex items-center gap-2"
              >
                Find Your Rate →
              </Link>
            </div>

            {/* For Companies */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <span className="text-3xl mb-4 block">🏢</span>
              <h3 className="text-xl font-bold text-gray-900 mb-3">For Companies</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">✓</span>
                  <span>Comparing part-time vs full-time hiring costs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">✓</span>
                  <span>Building a business case for part-time leadership</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">✓</span>
                  <span>Understanding the true cost of employment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">✓</span>
                  <span>Budgeting for part-time executive support</span>
                </li>
              </ul>
              <Link
                href="/calculators/company-savings"
                className="mt-6 btn-gradient inline-flex items-center gap-2"
              >
                Calculate Savings →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Take the Next Step?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Whether you're an executive looking for your next opportunity or a
            company seeking part-time talent, we can help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/part-time-jobs"
              className="btn-gradient inline-flex items-center justify-center gap-2"
            >
              Browse Part-Time Jobs
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/handler/sign-up"
              className="btn-ghost inline-flex items-center justify-center"
            >
              Join Beta
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
