import { redirect } from 'next/navigation'

// Redirect /articles to the SEO-optimized /fractional-jobs-articles
export default function ArticlesRedirect() {
  redirect('/fractional-jobs-articles')
}
