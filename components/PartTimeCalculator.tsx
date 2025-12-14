'use client'

import { useState } from 'react'

export function PartTimeCalculator() {
  const [dayRate, setDayRate] = useState(800)
  const [daysPerWeek, setDaysPerWeek] = useState(3)
  const [clients, setClients] = useState(2)

  const weeklyEarnings = dayRate * daysPerWeek * clients
  const monthlyEarnings = weeklyEarnings * 4.33
  const annualEarnings = weeklyEarnings * 48 // Assuming 48 working weeks

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Part-Time Earnings Calculator
        </h3>
        <p className="text-gray-600">
          See how much you could earn as a part-time executive
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Day Rate Slider */}
        <div>
          <label htmlFor="day-rate" className="block text-sm font-medium text-gray-700 mb-2">
            Day Rate
          </label>
          <div className="text-3xl font-bold text-gray-900 mb-2" aria-live="polite">
            {formatCurrency(dayRate)}
          </div>
          <input
            id="day-rate"
            type="range"
            min="400"
            max="2000"
            step="50"
            value={dayRate}
            onChange={(e) => setDayRate(Number(e.target.value))}
            aria-label={`Day rate: ${formatCurrency(dayRate)}`}
            aria-valuemin={400}
            aria-valuemax={2000}
            aria-valuenow={dayRate}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>£400</span>
            <span>£2,000</span>
          </div>
        </div>

        {/* Days Per Week */}
        <div>
          <label htmlFor="days-per-week" className="block text-sm font-medium text-gray-700 mb-2">
            Days per Client/Week
          </label>
          <div className="text-3xl font-bold text-gray-900 mb-2" aria-live="polite">
            {daysPerWeek} days
          </div>
          <input
            id="days-per-week"
            type="range"
            min="1"
            max="5"
            step="0.5"
            value={daysPerWeek}
            onChange={(e) => setDaysPerWeek(Number(e.target.value))}
            aria-label={`Days per week: ${daysPerWeek}`}
            aria-valuemin={1}
            aria-valuemax={5}
            aria-valuenow={daysPerWeek}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>1 day</span>
            <span>5 days</span>
          </div>
        </div>

        {/* Number of Clients */}
        <div>
          <label htmlFor="num-clients" className="block text-sm font-medium text-gray-700 mb-2">
            Number of Clients
          </label>
          <div className="text-3xl font-bold text-gray-900 mb-2" aria-live="polite">
            {clients} clients
          </div>
          <input
            id="num-clients"
            type="range"
            min="1"
            max="4"
            step="1"
            value={clients}
            onChange={(e) => setClients(Number(e.target.value))}
            aria-label={`Number of clients: ${clients}`}
            aria-valuemin={1}
            aria-valuemax={4}
            aria-valuenow={clients}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>1</span>
            <span>4</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-3 gap-4 p-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl">
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1">Weekly</div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(weeklyEarnings)}
          </div>
        </div>
        <div className="text-center border-x border-gray-300">
          <div className="text-sm text-gray-600 mb-1">Monthly</div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(monthlyEarnings)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1">Annual (48 weeks)</div>
          <div className="text-3xl font-bold text-gray-900">
            {formatCurrency(annualEarnings)}
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-600 text-center mt-4">
        Based on {daysPerWeek} days/week × {clients} clients × 48 working weeks. Actual earnings may vary.
      </p>
    </div>
  )
}
