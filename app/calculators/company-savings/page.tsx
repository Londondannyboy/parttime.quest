'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { SliderInput, ToggleGroup, ResultsPanel, ComparisonChart, CalculatorCard } from '@/components/calculators'

const ROLE_DEFAULTS: Record<string, { salary: number; dayRate: number }> = {
  CFO: { salary: 150000, dayRate: 1200 },
  CTO: { salary: 160000, dayRate: 1300 },
  CMO: { salary: 140000, dayRate: 1100 },
  COO: { salary: 145000, dayRate: 1150 },
  HR: { salary: 120000, dayRate: 950 }
}

export default function CompanySavingsCalculator() {
  // Inputs
  const [roleType, setRoleType] = useState<keyof typeof ROLE_DEFAULTS>('CFO')
  const [salary, setSalary] = useState(150000)
  const [pensionPercent, setPensionPercent] = useState(5)
  const [benefits, setBenefits] = useState(15000)
  const [overheads, setOverheads] = useState(10000)
  const [hoursNeeded, setHoursNeeded] = useState(12)
  const [dayRate, setDayRate] = useState(1200)

  // When role changes, update defaults
  const handleRoleChange = (role: keyof typeof ROLE_DEFAULTS) => {
    setRoleType(role)
    setSalary(ROLE_DEFAULTS[role].salary)
    setDayRate(ROLE_DEFAULTS[role].dayRate)
  }

  // Calculations
  const calculations = useMemo(() => {
    // Full-time costs
    const employerNI = salary * 0.138 // 13.8% employer NI
    const pension = salary * (pensionPercent / 100)
    const fullTimeTotalCost = salary + employerNI + pension + benefits + overheads

    // Fractional costs
    const daysPerWeek = hoursNeeded / 8 // Assuming 8-hour days
    const weeksPerYear = 48 // Accounting for holidays
    const fractionalAnnualCost = dayRate * daysPerWeek * weeksPerYear

    // Savings
    const annualSavings = fullTimeTotalCost - fractionalAnnualCost
    const savingsPercentage = Math.round((annualSavings / fullTimeTotalCost) * 100)

    return {
      fullTime: {
        salary,
        employerNI: Math.round(employerNI),
        pension: Math.round(pension),
        benefits,
        overheads,
        total: Math.round(fullTimeTotalCost)
      },
      fractional: {
        dayRate,
        daysPerWeek: Math.round(daysPerWeek * 10) / 10,
        weeksPerYear,
        total: Math.round(fractionalAnnualCost)
      },
      savings: {
        annual: Math.round(annualSavings),
        percentage: savingsPercentage
      }
    }
  }, [salary, pensionPercent, benefits, overheads, hoursNeeded, dayRate])

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
      <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="section-label text-purple-300 mb-4 block">For Companies</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Company Savings Calculator
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            See how much your company could save by hiring a fractional executive
            instead of a full-time hire.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Inputs */}
            <CalculatorCard
              title="Calculate Your Savings"
              subtitle="Compare full-time vs fractional costs"
              icon="🏢"
            >
              <div className="space-y-8">
                {/* Role Type */}
                <ToggleGroup
                  label="Executive Role"
                  options={[
                    { value: 'CFO', label: 'CFO' },
                    { value: 'CTO', label: 'CTO' },
                    { value: 'CMO', label: 'CMO' },
                    { value: 'COO', label: 'COO' },
                    { value: 'HR', label: 'HR Director' }
                  ]}
                  value={roleType}
                  onChange={handleRoleChange}
                  variant="buttons"
                />

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">1</span>
                    Full-Time Costs
                  </h4>

                  <div className="space-y-6">
                    <SliderInput
                      label="Base Salary"
                      value={salary}
                      onChange={setSalary}
                      min={80000}
                      max={250000}
                      step={5000}
                      prefix="£"
                    />

                    <SliderInput
                      label="Pension Contribution"
                      value={pensionPercent}
                      onChange={setPensionPercent}
                      min={3}
                      max={15}
                      step={1}
                      suffix="%"
                      helpText="Employer pension contribution percentage"
                    />

                    <SliderInput
                      label="Benefits Package"
                      value={benefits}
                      onChange={setBenefits}
                      min={5000}
                      max={40000}
                      step={1000}
                      prefix="£"
                      helpText="Healthcare, car allowance, bonuses, etc."
                    />

                    <SliderInput
                      label="Overheads"
                      value={overheads}
                      onChange={setOverheads}
                      min={5000}
                      max={25000}
                      step={1000}
                      prefix="£"
                      helpText="Office space, equipment, software licenses"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center text-xs">2</span>
                    Fractional Requirements
                  </h4>

                  <div className="space-y-6">
                    <SliderInput
                      label="Hours Needed Per Week"
                      value={hoursNeeded}
                      onChange={setHoursNeeded}
                      min={4}
                      max={24}
                      step={2}
                      suffix=" hours"
                      helpText="How many hours of executive time do you actually need?"
                    />

                    <SliderInput
                      label="Fractional Day Rate"
                      value={dayRate}
                      onChange={setDayRate}
                      min={600}
                      max={1800}
                      step={50}
                      prefix="£"
                      helpText="Typical rates vary by role and experience"
                    />
                  </div>
                </div>
              </div>
            </CalculatorCard>

            {/* Results */}
            <div className="space-y-6">
              {/* Comparison Chart */}
              <ComparisonChart
                title="Annual Cost Comparison"
                items={[
                  {
                    label: 'Full-Time Hire',
                    value: calculations.fullTime.total,
                    color: 'gray',
                    details: [
                      { label: 'Base Salary', value: `£${calculations.fullTime.salary.toLocaleString()}` },
                      { label: 'Employer NI (13.8%)', value: `£${calculations.fullTime.employerNI.toLocaleString()}` },
                      { label: 'Pension', value: `£${calculations.fullTime.pension.toLocaleString()}` },
                      { label: 'Benefits', value: `£${calculations.fullTime.benefits.toLocaleString()}` },
                      { label: 'Overheads', value: `£${calculations.fullTime.overheads.toLocaleString()}` }
                    ]
                  },
                  {
                    label: 'Fractional Executive',
                    value: calculations.fractional.total,
                    color: 'purple',
                    details: [
                      { label: 'Day Rate', value: `£${calculations.fractional.dayRate.toLocaleString()}` },
                      { label: 'Days/Week', value: `${calculations.fractional.daysPerWeek}` },
                      { label: 'Weeks/Year', value: `${calculations.fractional.weeksPerYear}` },
                      { label: 'No Employer NI', value: '£0' },
                      { label: 'No Benefits/Pension', value: '£0' }
                    ]
                  }
                ]}
                showDifference={true}
                differenceLabel="Your Annual Savings"
              />

              {/* Key insights */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Key Benefits</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span className="text-gray-600">
                      <strong className="text-gray-900">Same strategic impact</strong> — Get experienced C-level expertise
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span className="text-gray-600">
                      <strong className="text-gray-900">Flexibility</strong> — Scale up or down as needs change
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span className="text-gray-600">
                      <strong className="text-gray-900">No long-term commitment</strong> — Month-to-month arrangements
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span className="text-gray-600">
                      <strong className="text-gray-900">Immediate availability</strong> — No 3-month notice periods
                    </span>
                  </li>
                </ul>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl p-6 border border-purple-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Ready to find your fractional executive?
                </h3>
                <p className="text-gray-600 mb-4">
                  Browse our network of experienced fractional CFOs, CTOs, CMOs and more.
                </p>
                <Link
                  href="/fractional-jobs"
                  className="btn-gradient inline-flex items-center gap-2"
                >
                  Browse Fractional Executives
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            These calculations are estimates for illustrative purposes only. Actual costs may vary based on
            specific circumstances, location, and contractual arrangements. Employer NI is calculated at 13.8%
            above the threshold. Consult with a financial advisor for precise figures.
          </p>
        </div>
      </section>
    </div>
  )
}
