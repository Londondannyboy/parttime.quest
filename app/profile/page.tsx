import { redirect } from 'next/navigation'

// Profile redirects to dashboard - user profile is shown in sidebar
export default function ProfilePage() {
  redirect('/dashboard')
}
