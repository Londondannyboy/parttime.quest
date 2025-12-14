import { redirect } from 'next/navigation'

// Redirect /cto to the SEO-optimized /part-time-cto-jobs-uk
export default function CtoRedirect() {
  redirect('/part-time-cto-jobs-uk')
}
