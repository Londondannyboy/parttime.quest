'use client'

import { useState } from 'react'
import { Input, Textarea } from '@/components/Input'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'

export default function CompanyContactPage() {
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
          type: 'company',
          companyName: formData.get('companyName'),
          companyWebsite: formData.get('companyWebsite'),
          contactName: formData.get('contactName'),
          email: formData.get('email'),
          jobTitle: formData.get('jobTitle'),
          jobDescription: formData.get('jobDescription'),
          scheduleCall: formData.get('scheduleCall') === 'on',
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
          <h1 className="text-4xl font-black text-gray-900 mb-4">Hire Top Talent</h1>
          <p className="text-xl text-gray-600">
            Post a job or get in touch with our team about hiring part-time executives.
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
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Submission Received!</h2>
                <p className="text-gray-600 mb-6">
                  Thanks for your interest. Our team will contact you about posting options within 24 hours.
                </p>
                <Button onClick={() => setSubmitStatus('idle')}>
                  Submit Another Role
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    name="companyName"
                    label="Company Name"
                    placeholder="Acme Corp"
                    required
                  />
                  <Input
                    name="companyWebsite"
                    label="Company Website"
                    type="url"
                    placeholder="https://example.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    name="contactName"
                    label="Contact Name"
                    placeholder="Jane Doe"
                    required
                  />
                  <Input
                    name="email"
                    label="Email Address"
                    type="email"
                    placeholder="jane@example.com"
                    required
                  />
                </div>

                <Input
                  name="jobTitle"
                  label="Job Title / Role"
                  placeholder="e.g., Part-Time CFO, Interim CMO"
                  required
                />

                <Textarea
                  name="jobDescription"
                  label="Job Description"
                  placeholder="Tell us about the role, required skills, commitment level, and day rate budget..."
                  rows={6}
                  required
                />

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="scheduleCall"
                    name="scheduleCall"
                    className="mt-1 w-4 h-4 rounded border-gray-300"
                  />
                  <label htmlFor="scheduleCall" className="text-sm text-gray-600">
                    Schedule a call with our team to discuss your hiring needs
                  </label>
                </div>

                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {errorMessage}
                  </div>
                )}

                <Button size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Post Job'}
                </Button>

                <p className="text-xs text-gray-600 text-center">
                  Premium job listings start at £299. We&apos;ll reach out with pricing options.
                </p>
              </form>
            )}
          </Card>

          {/* Benefits */}
          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Why Post With Us?</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: '🎯',
                  title: 'Targeted Talent',
                  desc: 'Access experienced part-time executives pre-screened for quality',
                },
                {
                  icon: '⚡',
                  title: 'Quick Placements',
                  desc: 'Fill roles within days, not months',
                },
                {
                  icon: '💼',
                  title: 'Verified Professionals',
                  desc: 'All candidates vetted and experienced in part-time work',
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
