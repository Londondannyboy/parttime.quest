import { redirect } from 'next/navigation'

// Redirect /guide to the SEO-optimized article
export default function GuideRedirect() {
  redirect('/how-to-become-a-fractional-executive')
}
