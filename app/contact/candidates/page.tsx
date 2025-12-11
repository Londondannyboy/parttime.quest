import { Metadata } from 'next'
import { Input, Textarea } from '@/components/Input'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'

export const metadata: Metadata = {
  title: 'Contact - Job Seekers | Fractional.Quest',
  description: 'Get in touch with Fractional.Quest. We help executives find their next fractional role.',
}

export default function CandidateContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-purple-50 to-purple-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600">
            Have questions about fractional roles or want to share feedback? We'd love to hear from you.
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
                  label="Full Name"
                  placeholder="John Smith"
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <Input
                label="Current Role / Title"
                placeholder="e.g., Chief Financial Officer"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="LinkedIn Profile (optional)"
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                />
                <Input
                  label="Phone (optional)"
                  type="tel"
                  placeholder="+44 123 456 7890"
                />
              </div>

              <Textarea
                label="Message"
                placeholder="Tell us about your experience, what kind of roles you're interested in, or any questions you have..."
                rows={6}
                required
              />

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="newsletter"
                  className="mt-1 w-4 h-4 rounded border-gray-300"
                  defaultChecked
                />
                <label htmlFor="newsletter" className="text-sm text-gray-600">
                  I'd like to receive job alerts and updates about new fractional opportunities
                </label>
              </div>

              <Button size="lg" className="w-full">
                Send Message
              </Button>

              <p className="text-xs text-gray-500 text-center">
                We'll get back to you within 24 hours. Privacy policy applies.
              </p>
            </form>
          </Card>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card>
              <div className="text-3xl mb-3">📧</div>
              <h3 className="font-bold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600 text-sm">
                <a href="mailto:careers@fractional.quest" className="text-purple-700 hover:text-purple-900">
                  careers@fractional.quest
                </a>
              </p>
            </Card>

            <Card>
              <div className="text-3xl mb-3">💼</div>
              <h3 className="font-bold text-gray-900 mb-2">LinkedIn</h3>
              <p className="text-gray-600 text-sm">
                Connect with us on{' '}
                <a href="#" className="text-purple-700 hover:text-purple-900">
                  LinkedIn
                </a>
              </p>
            </Card>

            <Card>
              <div className="text-3xl mb-3">⏰</div>
              <h3 className="font-bold text-gray-900 mb-2">Response Time</h3>
              <p className="text-gray-600 text-sm">
                Typically within 24 hours during business days
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
