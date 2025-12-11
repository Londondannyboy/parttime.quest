import { redirect } from 'next/navigation'

// Redirect /coo to the SEO-optimized /fractional-coo-jobs-uk
export default function CooRedirect() {
  redirect('/fractional-coo-jobs-uk')
}
