import { redirect } from 'next/navigation'

// Redirect /hr to the SEO-optimized /fractional-hr-jobs-uk
export default function HrRedirect() {
  redirect('/fractional-hr-jobs-uk')
}
