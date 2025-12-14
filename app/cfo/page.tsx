import { redirect } from 'next/navigation'

// Redirect /cfo to the SEO-optimized /part-time-cfo-jobs-uk
export default function CfoRedirect() {
  redirect('/part-time-cfo-jobs-uk')
}
