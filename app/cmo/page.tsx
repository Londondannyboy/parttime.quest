import { redirect } from 'next/navigation'

// Redirect /cmo to the SEO-optimized /part-time-cmo-jobs-uk
export default function CmoRedirect() {
  redirect('/part-time-cmo-jobs-uk')
}
