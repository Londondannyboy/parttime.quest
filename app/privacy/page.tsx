import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Fractional.Quest',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-black text-gray-900 mb-8">Privacy Policy</h1>

      <div className="prose prose-lg max-w-none space-y-6 text-gray-600">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
          <p>
            Fractional.Quest ("we," "us," or "our") operates the Fractional.Quest website. This Privacy Policy explains our
            data practices and your privacy rights.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
          <p>
            We collect information you voluntarily provide, such as when you create an account, apply for jobs, or contact
            us. We also collect information automatically through cookies and analytics.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
          <p>
            We use your information to provide our services, communicate with you, improve our platform, and comply with
            legal obligations.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Protection</h2>
          <p>
            We implement appropriate security measures to protect your personal information. However, no method of
            transmission over the internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal information. Contact us to exercise these
            rights.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:privacy@fractional.quest" className="text-purple-700 hover:text-purple-900">
              privacy@fractional.quest
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
