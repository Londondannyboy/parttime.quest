import Link from "next/link";
import { Button } from "@/components/Button";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 to-white pt-20 pb-32 md:pt-32 md:pb-48">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <div className="inline-block mb-4">
              <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                🚀 Find Your Next Executive Role
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
              Fractional <span className="text-purple-700">Executives</span>
              <br />& Specialized Talent
            </h1>

            <p className="max-w-2xl text-xl text-gray-600 mb-8 leading-relaxed">
              Connect with experienced fractional CFOs, CMOs, COOs, and specialized experts. Build your dream team without long-term commitments.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/fractionaljobsuk">
                <Button size="lg" variant="primary">
                  Browse Jobs →
                </Button>
              </Link>
              <Link href="/contact/companies">
                <Button size="lg" variant="secondary">
                  Post a Position
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-2 text-gray-600">
              <span className="text-sm">✨ 500+ active opportunities</span>
              <span className="text-gray-300">•</span>
              <span className="text-sm">Updated daily</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Why Choose Fractional.Quest?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "Specialized Matching",
                description: "AI-powered skill matching to find the perfect fit for your needs"
              },
              {
                icon: "⚡",
                title: "Quick Onboarding",
                description: "From job posting to hire in days, not months"
              },
              {
                icon: "💼",
                title: "Verified Professionals",
                description: "All executives are vetted and experienced fractional workers"
              },
              {
                icon: "🌍",
                title: "Remote Ready",
                description: "Access talent worldwide without geographic limitations"
              },
              {
                icon: "📊",
                title: "Transparent Pricing",
                description: "Clear day rates and flexible engagement models"
              },
              {
                icon: "🤝",
                title: "24/7 Support",
                description: "Dedicated support team to help throughout your journey"
              },
            ].map((feature, i) => (
              <div key={i} className="p-6 bg-gray-50 rounded-xl hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-purple-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to find your next executive?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Start your search today and connect with experienced professionals
          </p>
          <Link href="/fractionaljobsuk">
            <Button size="lg" variant="secondary">
              Browse All Jobs
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
