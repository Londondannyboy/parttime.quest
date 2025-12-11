import { redirect } from 'next/navigation'

// Redirect /jobs to the SEO-optimized /fractional-jobs
export default function JobsRedirect() {
  redirect('/fractional-jobs')
}
