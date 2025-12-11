import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Fractional.Quest</h3>
            <p className="text-sm text-gray-600">
              Connect with fractional executives and specialized talent for your team.
            </p>
          </div>

          {/* For Job Seekers */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">For Job Seekers</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/fractionaljobsuk" className="text-sm text-gray-600 hover:text-purple-700">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/fractional-jobs-articles" className="text-sm text-gray-600 hover:text-purple-700">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/contact/candidates" className="text-sm text-gray-600 hover:text-purple-700">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* For Companies */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">For Companies</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/contact/companies" className="text-sm text-gray-600 hover:text-purple-700">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link href="/fractional-jobs-articles" className="text-sm text-gray-600 hover:text-purple-700">
                  Career Guides & Articles
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-purple-700">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-600 hover:text-purple-700">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">
            © 2025 Fractional.Quest. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-600 hover:text-purple-700 text-sm">
              Twitter
            </a>
            <a href="#" className="text-gray-600 hover:text-purple-700 text-sm">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
