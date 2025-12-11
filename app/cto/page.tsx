import { redirect } from 'next/navigation'

// Redirect /cto to the SEO-optimized /fractional-cto-jobs-uk
export default function CtoRedirect() {
  redirect('/fractional-cto-jobs-uk')
}
