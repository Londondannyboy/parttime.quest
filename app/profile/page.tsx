import { redirect } from 'next/navigation'

// Profile redirects to dashboard
export default function ProfilePage() {
  redirect('/dashboard')
}

function OldProfilePage() {
  // Keep old code as reference but unused
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-purple-700 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
          <p className="text-purple-100">Manage your Fractional.Quest account</p>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* User Info */}
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
              {user.displayName ? (
                <span className="text-3xl font-bold text-purple-700">
                  {user.displayName.charAt(0).toUpperCase()}
                </span>
              ) : (
                <span className="text-3xl font-bold text-purple-700">U</span>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {user.displayName || 'User'}
              </h2>
              <p className="text-gray-600">{user.primaryEmail}</p>
            </div>
          </div>

          {/* Account Settings */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
            <div className="space-y-4">
              <Link
                href="/handler/account-settings"
                className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="font-medium text-gray-900">Edit Profile</span>
                <p className="text-sm text-gray-500">Update your name and profile information</p>
              </Link>
              <Link
                href="/handler/account-settings"
                className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="font-medium text-gray-900">Security</span>
                <p className="text-sm text-gray-500">Manage your password and security settings</p>
              </Link>
            </div>
          </div>

          {/* Sign Out */}
          <div className="border-t border-gray-200 pt-8 mt-8">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Sign Out</h3>
                <p className="text-sm text-gray-500">Sign out of your account on this device</p>
              </div>
              <UserButton />
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <Link
            href="/fractionaljobsuk"
            className="bg-white rounded-lg border border-gray-200 p-6 hover:border-purple-300 hover:shadow-sm transition-all"
          >
            <h4 className="font-semibold text-gray-900 mb-1">Browse Jobs</h4>
            <p className="text-sm text-gray-500">Find fractional opportunities</p>
          </Link>
          <Link
            href="/fractional-jobs-articles"
            className="bg-white rounded-lg border border-gray-200 p-6 hover:border-purple-300 hover:shadow-sm transition-all"
          >
            <h4 className="font-semibold text-gray-900 mb-1">Read Articles</h4>
            <p className="text-sm text-gray-500">Career guides and insights</p>
          </Link>
          <Link
            href="/chat"
            className="bg-white rounded-lg border border-gray-200 p-6 hover:border-purple-300 hover:shadow-sm transition-all"
          >
            <h4 className="font-semibold text-gray-900 mb-1">Chat Assistant</h4>
            <p className="text-sm text-gray-500">Get personalized advice</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
