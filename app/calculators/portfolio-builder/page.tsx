'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { SliderInput, ToggleGroup, ResultsPanel, CalculatorCard } from '@/components/calculators'

export default function PortfolioBuilderCalculator() {
  // Inputs
  const [targetIncome, setTargetIncome] = useState(200000)
  const [dayRate, setDayRate] = useState(1000)
  const [maxDaysPerWeek, setMaxDaysPerWeek] = useState(4)
  const [clientMix, setClientMix] = useState<'startups' | 'scaleups' | 'enterprise' | 'mixed'>('mixed')

  // Calculations
  const calculations = useMemo(() => {
    const weeksPerYear = 46 // Accounting for holidays
    const maxBillableDays = maxDaysPerWeek * weeksPerYear
    const maxPotentialIncome = maxBillableDays * dayRate

    // Days needed for target income
    const daysNeededForTarget = Math.ceil(targetIncome / dayRate)
    const weeksNeededForTarget = Math.ceil(daysNeededForTarget / maxDaysPerWeek)

    // Client calculations based on mix
    const avgDaysPerClient = clientMix === 'enterprise' ? 2.5 :
                            clientMix === 'scaleups' ? 2 :
                            clientMix === 'startups' ? 1.5 : 2

    const clientsNeeded = Math.ceil((targetIncome / dayRate / weeksPerYear) / avgDaysPerClient)
    const daysPerClient = (targetIncome / dayRate / weeksPerYear) / clientsNeeded

    // Revenue per client
    const revenuePerClient = Math.round(targetIncome / clientsNeeded)

    // Buffer for business development (10-15% of time)
    const bizDevDays = Math.ceil(weeksPerYear * 0.12)

    // Utilization rate
    const utilizationRate = Math.round((daysNeededForTarget / maxBillableDays) * 100)

    // Risk assessment (concentration)
    let riskLevel: 'low' | 'medium' | 'high' = 'medium'
    if (clientsNeeded <= 2) riskLevel = 'high'
    else if (clientsNeeded >= 4) riskLevel = 'low'

    const riskMessage = riskLevel === 'high'
      ? 'High client concentration risk. Consider diversifying.'
      : riskLevel === 'low'
      ? 'Well-diversified portfolio. Good risk profile.'
      : 'Moderate diversification. Consider adding one more client.'

    return {
      maxPotentialIncome,
      daysNeededForTarget,
      weeksNeededForTarget,
      clientsNeeded,
      daysPerClient: Math.round(daysPerClient * 10) / 10,
      revenuePerClient,
      bizDevDays,
      utilizationRate,
      riskLevel,
      riskMessage
    }
  }, [targetIncome, dayRate, maxDaysPerWeek, clientMix])

  const riskColors = {
    low: 'text-green-600 bg-green-50',
    medium: 'text-amber-600 bg-amber-50',
    high: 'text-red-600 bg-red-50'
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
      <section className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="section-label text-emerald-100 mb-4 block">Career Planning</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Portfolio Builder Calculator
          </h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            Plan your fractional portfolio career. See how many clients you need
            and optimize your work-life balance.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Inputs */}
            <CalculatorCard
              title="Plan Your Portfolio"
              subtitle="Design your ideal fractional career"
              icon="📊"
            >
              <div className="space-y-8">
                <SliderInput
                  label="Target Annual Income"
                  value={targetIncome}
                  onChange={setTargetIncome}
                  min={80000}
                  max={400000}
                  step={10000}
                  prefix="£"
                />

                <SliderInput
                  label="Your Day Rate"
                  value={dayRate}
                  onChange={setDayRate}
                  min={500}
                  max={2000}
                  step={50}
                  prefix="£"
                  helpText="Use the Rate Finder calculator if unsure"
                />

                <ToggleGroup
                  label="Maximum Days Per Week"
                  options={[
                    { value: 2, label: '2 days' },
                    { value: 3, label: '3 days' },
                    { value: 4, label: '4 days' },
                    { value: 5, label: '5 days' }
                  ]}
                  value={maxDaysPerWeek}
                  onChange={setMaxDaysPerWeek}
                  variant="buttons"
                  helpText="How many days are you willing to work?"
                />

                <ToggleGroup
                  label="Preferred Client Mix"
                  options={[
                    { value: 'startups', label: 'Startups (1-2 days each)' },
                    { value: 'scaleups', label: 'Scale-ups (2 days each)' },
                    { value: 'enterprise', label: 'Enterprise (2-3 days each)' },
                    { value: 'mixed', label: 'Mixed Portfolio' }
                  ]}
                  value={clientMix}
                  onChange={setClientMix}
                  variant="pills"
                  helpText="Different stages require different time commitments"
                />
              </div>
            </CalculatorCard>

            {/* Results */}
            <div className="space-y-6">
              <ResultsPanel
                title="Your Portfolio Plan"
                results={[
                  {
                    label: 'Clients Needed',
                    value: calculations.clientsNeeded,
                    suffix: ' clients',
                    highlight: true
                  },
                  {
                    label: 'Days Per Client',
                    value: calculations.daysPerClient,
                    suffix: ' days/week',
                    sublabel: 'Average per client'
                  },
                  {
                    label: 'Revenue Per Client',
                    value: calculations.revenuePerClient,
                    prefix: '£',
                    suffix: '/year',
                    sublabel: 'Average per client'
                  }
                ]}
                accentColor="green"
              />

              {/* Portfolio Visualization */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Weekly Allocation</h3>

                {/* Visual representation */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const isWorking = i < maxDaysPerWeek
                    const isNeeded = i < Math.ceil(calculations.daysPerClient * calculations.clientsNeeded)
                    return (
                      <div
                        key={i}
                        className={`flex-1 h-16 rounded-lg flex items-center justify-center text-xs font-medium ${
                          !isWorking ? 'bg-gray-100 text-gray-400' :
                          isNeeded ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600'
                        }`}
                      >
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][i]}
                      </div>
                    )
                  })}
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-purple-600" />
                    Client Work
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-purple-100" />
                    Buffer/Biz Dev
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-gray-100" />
                    Off
                  </span>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Key Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500">Utilization Rate</p>
                    <p className="text-2xl font-data font-bold text-gray-900">
                      {calculations.utilizationRate}%
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500">Biz Dev Days/Year</p>
                    <p className="text-2xl font-data font-bold text-gray-900">
                      {calculations.bizDevDays}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500">Max Potential</p>
                    <p className="text-2xl font-data font-bold text-gray-900">
                      £{calculations.maxPotentialIncome.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500">Billable Days/Year</p>
                    <p className="text-2xl font-data font-bold text-gray-900">
                      {calculations.daysNeededForTarget}
                    </p>
                  </div>
                </div>
              </div>

              {/* Risk Assessment */}
              <div className={`rounded-2xl p-6 border ${riskColors[calculations.riskLevel]}`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">
                    {calculations.riskLevel === 'low' ? '✓' : calculations.riskLevel === 'medium' ? '⚠️' : '⚡'}
                  </span>
                  <h3 className="text-lg font-bold">Risk Assessment</h3>
                </div>
                <p className="text-sm">{calculations.riskMessage}</p>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl p-6 border border-purple-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Start building your portfolio
                </h3>
                <p className="text-gray-600 mb-4">
                  Find your first (or next) fractional client on our platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/fractional-jobs"
                    className="btn-gradient inline-flex items-center justify-center gap-2"
                  >
                    Browse Jobs
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link
                    href="/calculators/rate-finder"
                    className="btn-ghost inline-flex items-center justify-center gap-2"
                  >
                    Find Your Rate
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
