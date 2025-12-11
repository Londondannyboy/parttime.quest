import { redirect } from 'next/navigation'

// Redirect /cfo to the SEO-optimized /fractional-cfo-jobs-uk
export default function CfoRedirect() {
  redirect('/fractional-cfo-jobs-uk')
}
