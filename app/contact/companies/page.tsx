import { Metadata } from 'next'
import { Input, Textarea } from '@/components/Input'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'

export const metadata: Metadata = {
  title: 'Contact - Companies | Fractional.Quest',
  description: 'Post a job or inquire about hiring fractional executives for your organization.',
}

export default function CompanyContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-purple-50 to-purple-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black text-gray-900 mb-4">Hire Top Talent</h1>
          <p className="text-xl text-gray-600">
            Post a job or get in touch with our team about hiring fractional executives.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-12 md:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Company Name"
                  placeholder="Acme Corp"
                  required
                />
                <Input
                  label="Company Website"
                  type="url"
                  placeholder="https://example.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Contact Name"
                  placeholder="Jane Doe"
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="jane@example.com"
                  required
                />
              </div>

              <Input
                label="Job Title / Role"
                placeholder="e.g., Fractional CFO, Interim CMO"
                required
              />

              <Textarea
                label="Job Description"
                placeholder="Tell us about the role, required skills, commitment level, and day rate budget..."
                rows={6}
                required
              />

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="schedule-call"
                  className="mt-1 w-4 h-4 rounded border-gray-300"
                />
                <label htmlFor="schedule-call" className="text-sm text-gray-600">
                  Schedule a call with our team to discuss your hiring needs
                </label>
              </div>

              <Button size="lg" className="w-full">
                Post Job
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Premium job listings start at £299. We'll reach out with pricing options.
              </p>
            </form>
          </Card>

          {/* Benefits */}
          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Why Post With Us?</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: '🎯',
                  title: 'Targeted Talent',
                  desc: 'Access experienced fractional executives pre-screened for quality',
                },
                {
                  icon: '⚡',
                  title: 'Quick Placements',
                  desc: 'Fill roles within days, not months',
                },
                {
                  icon: '💼',
                  title: 'Verified Professionals',
                  desc: 'All candidates vetted and experienced in fractional work',
                },
                {
                  icon: '📊',
                  title: 'Analytics',
                  desc: 'Track views, applications, and hiring metrics in real-time',
                },
              ].map((benefit) => (
                <Card key={benefit.title}>
                  <div className="text-3xl mb-3">{benefit.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
