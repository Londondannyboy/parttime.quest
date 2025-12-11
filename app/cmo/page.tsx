import { redirect } from 'next/navigation'

// Redirect /cmo to the SEO-optimized /fractional-cmo-jobs-uk
export default function CmoRedirect() {
  redirect('/fractional-cmo-jobs-uk')
}
