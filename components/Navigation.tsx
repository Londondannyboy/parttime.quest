import Link from 'next/link'
import { Button } from './Button'

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <span className="hidden sm:inline font-bold text-gray-900">Fractional.Quest</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/fractionaljobsuk" className="text-gray-600 hover:text-purple-700 font-medium transition-colors">
            Jobs
          </Link>
          <Link href="/articles" className="text-gray-600 hover:text-purple-700 font-medium transition-colors">
            Articles
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-purple-700 font-medium transition-colors">
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/profile">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Button size="sm">
            Post Job
          </Button>
        </div>
      </div>
    </nav>
  )
}
