'use client'

import { useState } from 'react'
import { Input, Textarea } from '@/components/Input'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'

export default function CandidateContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'candidate',
          fullName: formData.get('fullName'),
          email: formData.get('email'),
          currentRole: formData.get('currentRole'),
          linkedIn: formData.get('linkedIn'),
          phone: formData.get('phone'),
          message: formData.get('message'),
          newsletter: formData.get('newsletter') === 'on',
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus('success')
        e.currentTarget.reset()
      } else {
        setSubmitStatus('error')
        setErrorMessage(data.error || 'Something went wrong')
      }
    } catch {
      setSubmitStatus('error')
      setErrorMessage('Failed to submit. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-purple-50 to-purple-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600">
            Have questions about part-time roles or want to share feedback? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-12 md:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            {submitStatus === 'success' ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✅</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h2>
                <p className="text-gray-600 mb-6">
                  Thanks for reaching out. We&apos;ll be in touch within 24 hours.
                </p>
                <Button onClick={() => setSubmitStatus('idle')}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    name="fullName"
                    label="Full Name"
                    placeholder="John Smith"
                    required
                  />
                  <Input
                    name="email"
                    label="Email Address"
                    type="email"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <Input
                  name="currentRole"
                  label="Current Role / Title"
                  placeholder="e.g., Chief Financial Officer"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    name="linkedIn"
                    label="LinkedIn Profile (optional)"
                    type="url"
                    placeholder="https://linkedin.com/in/..."
                  />
                  <Input
                    name="phone"
                    label="Phone (optional)"
                    type="tel"
                    placeholder="+44 123 456 7890"
                  />
                </div>

                <Textarea
                  name="message"
                  label="Message"
                  placeholder="Tell us about your experience, what kind of roles you're interested in, or any questions you have..."
                  rows={6}
                  required
                />

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="newsletter"
                    name="newsletter"
                    className="mt-1 w-4 h-4 rounded border-gray-300"
                    defaultChecked
                  />
                  <label htmlFor="newsletter" className="text-sm text-gray-600">
                    I&apos;d like to receive job alerts and updates about new part-time opportunities
                  </label>
                </div>

                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {errorMessage}
                  </div>
                )}

                <Button size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>

                <p className="text-xs text-gray-600 text-center">
                  We&apos;ll get back to you within 24 hours. Privacy policy applies.
                </p>
              </form>
            )}
          </Card>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card>
              <div className="text-3xl mb-3">📧</div>
              <h3 className="font-bold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600 text-sm">
                <a href="mailto:careers@parttime.quest" className="text-purple-700 hover:text-purple-900">
                  careers@parttime.quest
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
