'use client'

interface Step {
  number: number
  title: string
  description: string
}

interface HireProcessStepperProps {
  steps?: Step[]
  accentColor?: string
  className?: string
}

const DEFAULT_STEPS: Step[] = [
  {
    number: 1,
    title: 'Brief',
    description: 'Tell us about your needs, company stage, and what you\'re looking for in a part-time executive.',
  },
  {
    number: 2,
    title: 'Match',
    description: 'We curate a shortlist of pre-vetted part-time executives who match your specific requirements.',
  },
  {
    number: 3,
    title: 'Meet',
    description: 'Interview your top candidates. We handle scheduling and provide interview frameworks.',
  },
  {
    number: 4,
    title: 'Start',
    description: 'Your part-time executive begins within days. We support onboarding and ongoing success.',
  },
]

export function HireProcessStepper({
  steps = DEFAULT_STEPS,
  accentColor = 'emerald',
  className = ''
}: HireProcessStepperProps) {
  const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
    gray: { bg: 'bg-gray-900', text: 'text-gray-900', border: 'border-gray-900' },
    emerald: { bg: 'bg-gray-800', text: 'text-gray-800', border: 'border-gray-800' },
    amber: { bg: 'bg-gray-800', text: 'text-gray-800', border: 'border-gray-800' },
    blue: { bg: 'bg-gray-800', text: 'text-gray-800', border: 'border-gray-800' },
    orange: { bg: 'bg-gray-800', text: 'text-gray-800', border: 'border-gray-800' },
    purple: { bg: 'bg-gray-800', text: 'text-gray-800', border: 'border-gray-800' },
    pink: { bg: 'bg-gray-800', text: 'text-gray-800', border: 'border-gray-800' },
    red: { bg: 'bg-gray-800', text: 'text-gray-800', border: 'border-gray-800' },
  }

  const colors = colorClasses[accentColor] || colorClasses.gray

  return (
    <div className={`${className}`}>
      {/* Desktop: Horizontal */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Connector Line */}
          <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-200" />
          <div
            className={`absolute top-8 left-0 h-0.5 ${colors.bg} transition-all duration-500`}
            style={{ width: '100%' }}
          />

          {/* Steps */}
          <div className="relative grid grid-cols-4 gap-4">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-full ${colors.bg} text-white flex items-center justify-center text-2xl font-black mb-4 relative z-10`}>
                  {step.number}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: Vertical */}
      <div className="md:hidden">
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute top-0 bottom-0 left-8 w-0.5 bg-gray-200" />
          <div className={`absolute top-0 bottom-0 left-8 w-0.5 ${colors.bg}`} />

          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-6">
                <div className={`w-16 h-16 rounded-full ${colors.bg} text-white flex items-center justify-center text-2xl font-black flex-shrink-0 relative z-10`}>
                  {step.number}
                </div>
                <div className="pt-2">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
