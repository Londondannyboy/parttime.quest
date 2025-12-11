import { Suspense } from 'react'

// Dashboard has its own layout - hide the main Navigation and Footer
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      {children}
    </Suspense>
  )
}
