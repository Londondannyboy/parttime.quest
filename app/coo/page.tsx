import { redirect } from 'next/navigation'

// Redirect /coo to the SEO-optimized /part-time-coo-jobs-uk
export default function CooRedirect() {
  redirect('/part-time-coo-jobs-uk')
}
