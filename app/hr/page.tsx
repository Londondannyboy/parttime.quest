import { redirect } from 'next/navigation'

// Redirect /hr to the SEO-optimized /part-time-hr-jobs-uk
export default function HrRedirect() {
  redirect('/part-time-hr-jobs-uk')
}
