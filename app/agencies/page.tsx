import { redirect } from 'next/navigation'

// Redirect /agencies to contact page (or create dedicated agencies page later)
export default function AgenciesRedirect() {
  redirect('/contact')
}
