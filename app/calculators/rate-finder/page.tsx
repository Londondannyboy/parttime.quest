'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { SliderInput, ToggleGroup, ResultsPanel, CalculatorCard } from '@/components/calculators'

const EXPERIENCE_MULTIPLIERS = {
  mid: 0.8,
  senior: 1.0,
  executive: 1.2,
  csuite: 1.4
}

const SPECIALIZATION_PREMIUMS = {
  none: 0,
  niche: 0.15,
  rare: 0.3
}

const LOCATION_MODIFIERS = {
  london: 1.15,
  regional: 0.9,
  remote: 1.0
}

export default function RateFinderCalculator() {
  // Inputs
  const [salary, setSalary] = useState(120000)
  const [daysPerWeek, setDaysPerWeek] = useState(3)
  const [experience, setExperience] = useState<keyof typeof EXPERIENCE_MULTIPLIERS>('senior')
  const [specialization, setSpecialization] = useState<keyof typeof SPECIALIZATION_PREMIUMS>('none')
  const [location, setLocation] = useState<keyof typeof LOCATION_MODIFIERS>('london')

  // Calculations
  const calculations = useMemo(() => {
    // Base calculation: Convert salary to day rate equivalent
    // Assuming 230 working days per year for full-time
    const fullTimeDailyEquivalent = salary / 230

    // Apply multipliers
    const experienceAdjusted = fullTimeDailyEquivalent * EXPERIENCE_MULTIPLIERS[experience]
    const specializationAdjusted = experienceAdjusted * (1 + SPECIALIZATION_PREMIUMS[specialization])
    const locationAdjusted = specializationAdjusted * LOCATION_MODIFIERS[location]

    // Part-time premium (20-30% premium for flexibility and expertise)
    const partTimePremium = 1.25
    const recommendedRate = Math.round(locationAdjusted * partTimePremium / 50) * 50

    // Range calculation
    const lowRate = Math.round((recommendedRate * 0.85) / 50) * 50
    const highRate = Math.round((recommendedRate * 1.15) / 50) * 50

    // Market positioning
    let positioning: 'below' | 'at' | 'above' = 'at'
    if (recommendedRate < 800) positioning = 'below'
    else if (recommendedRate > 1400) positioning = 'above'

    // Annual potential
    const weeksPerYear = 48 - (5 - daysPerWeek) * 2 // More clients = less vacation flexibility
    const annualPotential = recommendedRate * daysPerWeek * weeksPerYear

    // Number of clients calculation
    const clientsNeeded = Math.ceil(daysPerWeek / 2) // Roughly 2 days per client

    return {
      lowRate,
      recommendedRate,
      highRate,
      positioning,
      annualPotential,
      clientsNeeded,
      hourlyEquivalent: Math.round(recommendedRate / 8)
    }
  }, [salary, daysPerWeek, experience, specialization, location])

  const positioningColors = {
    below: 'text-amber-600',
    at: 'text-green-600',
    above: 'text-purple-600'
  }

  const positioningLabels = {
    below: 'Entry-level part-time rates',
    at: 'Competitive market rates',
    above: 'Premium market positioning'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link href="/calculators" className="text-purple-700 hover:text-purple-900 text-sm font-medium flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Calculators
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="section-label text-amber-100 mb-4 block">For Executives</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Rate Finder Calculator
          </h1>
          <p className="text-xl text-amber-100 max-w-2xl mx-auto">
            Discover your recommended day rate based on your experience, specialization,
            and market positioning.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Inputs */}
            <CalculatorCard
              title="Find Your Day Rate"
              subtitle="Based on your background and goals"
              icon="🎯"
            >
              <div className="space-y-8">
                <SliderInput
                  label="Current/Target Full-Time Equivalent Salary"
                  value={salary}
                  onChange={setSalary}
                  min={60000}
                  max={300000}
                  step={5000}
                  prefix="£"
                  helpText="What would you earn in a full-time permanent role?"
                />

                <ToggleGroup
                  label="Days Per Week Available"
                  options={[
                    { value: 1, label: '1 day' },
                    { value: 2, label: '2 days' },
                    { value: 3, label: '3 days' },
                    { value: 4, label: '4 days' },
                    { value: 5, label: '5 days' }
                  ]}
                  value={daysPerWeek}
                  onChange={setDaysPerWeek}
                  variant="buttons"
                />

                <ToggleGroup
                  label="Experience Level"
                  options={[
                    { value: 'mid', label: 'Mid-Level' },
                    { value: 'senior', label: 'Senior' },
                    { value: 'executive', label: 'Executive' },
                    { value: 'csuite', label: 'C-Suite' }
                  ]}
                  value={experience}
                  onChange={setExperience}
                  variant="pills"
                  helpText="Your seniority affects rate positioning"
                />

                <ToggleGroup
                  label="Specialization Premium"
                  options={[
                    { value: 'none', label: 'Generalist' },
                    { value: 'niche', label: 'Niche (+15%)' },
                    { value: 'rare', label: 'Rare Expertise (+30%)' }
                  ]}
                  value={specialization}
                  onChange={setSpecialization}
                  variant="pills"
                  helpText="Rare skills like PE operating, IPO experience, etc."
                />

                <ToggleGroup
                  label="Primary Location"
                  options={[
                    { value: 'london', label: 'London (+15%)' },
                    { value: 'remote', label: 'Remote' },
                    { value: 'regional', label: 'Regional (-10%)' }
                  ]}
                  value={location}
                  onChange={setLocation}
                  variant="pills"
                />
              </div>
            </CalculatorCard>

            {/* Results */}
            <div className="space-y-6">
              <ResultsPanel
                title="Your Recommended Day Rate"
                results={[
                  {
                    label: 'Recommended Rate',
                    value: calculations.recommendedRate,
                    prefix: '£',
                    suffix: '/day',
                    highlight: true
                  },
                  {
                    label: 'Rate Range',
                    value: `£${calculations.lowRate.toLocaleString()} – £${calculations.highRate.toLocaleString()}`,
                    sublabel: 'Depending on specific engagements'
                  },
                  {
                    label: 'Hourly Equivalent',
                    value: calculations.hourlyEquivalent,
                    prefix: '£',
                    suffix: '/hour',
                    sublabel: 'Based on 8-hour day'
                  }
                ]}
                accentColor="amber"
              />

              {/* Market Position */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Market Positioning</h3>
                <div className={`text-xl font-bold ${positioningColors[calculations.positioning]} mb-2`}>
                  {positioningLabels[calculations.positioning]}
                </div>

                {/* Rate scale visualization */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>£500</span>
                    <span>£1,000</span>
                    <span>£1,500</span>
                    <span>£2,000</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full relative">
                    <div
                      className="absolute h-6 w-6 bg-amber-500 rounded-full -top-1.5 shadow-lg border-2 border-white transform -translate-x-1/2 transition-all duration-500"
                      style={{ left: `${Math.min(Math.max(((calculations.recommendedRate - 500) / 1500) * 100, 0), 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Annual Potential */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Annual Potential</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Working {daysPerWeek} days/week</p>
                    <p className="text-3xl font-data font-bold text-gray-900">
                      £{calculations.annualPotential.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">per year</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Typical client portfolio</p>
                    <p className="text-3xl font-data font-bold text-purple-800">
                      {calculations.clientsNeeded}
                    </p>
                    <p className="text-sm text-gray-600">clients</p>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Negotiation Tips</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500">→</span>
                    <span>Start at the higher end of your range and negotiate down if needed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500">→</span>
                    <span>Factor in project complexity — strategic work commands higher rates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500">→</span>
                    <span>Consider retainer arrangements for consistent income</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500">→</span>
                    <span>Value-based pricing for specific outcomes can exceed day rates</span>
                  </li>
                </ul>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl p-6 border border-purple-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Ready to find part-time opportunities?
                </h3>
                <p className="text-gray-600 mb-4">
                  Browse current part-time roles and see what companies are offering.
                </p>
                <Link
                  href="/part-time-jobs"
                  className="btn-gradient inline-flex items-center gap-2"
                >
                  Browse Jobs
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
