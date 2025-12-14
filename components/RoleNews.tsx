/**
 * RoleNews - Server component for displaying category-specific news articles
 * Fetches and displays recent articles for a given role category
 */

import Link from 'next/link'
import { createDbQuery } from '@/lib/db'

interface NewsArticle {
  id: number
  slug: string
  title: string
  excerpt: string | null
  category: string | null
  article_type: string | null
  featured_asset_url: string | null
  published_at: string | null
}

interface RoleNewsProps {
  category: 'Finance' | 'Marketing' | 'Engineering' | 'Operations' | 'HR' | 'Sales' | 'General'
  limit?: number
  title?: string
  showViewAll?: boolean
}

// Map category to display name
const categoryDisplayNames: Record<string, string> = {
  Finance: 'Finance & CFO',
  Marketing: 'Marketing & CMO',
  Engineering: 'Technology & CTO',
  Operations: 'Operations & COO',
  HR: 'People & HR',
  Sales: 'Sales & Revenue',
  General: 'Executive'
}

// Map article_type to badge
const typeBadges: Record<string, { label: string; color: string }> = {
  job_roundup: { label: 'Jobs Update', color: 'bg-blue-100 text-blue-800' },
  company_spotlight: { label: 'Company', color: 'bg-amber-100 text-amber-800' },
  market_trend: { label: 'Insights', color: 'bg-purple-100 text-purple-800' },
  manual: { label: 'Article', color: 'bg-gray-100 text-gray-700' }
}

function formatDate(dateString: string | null): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short'
  })
}

export async function RoleNews({
  category,
  limit = 3,
  title,
  showViewAll = true
}: RoleNewsProps) {
  const sql = createDbQuery()

  const articles = await sql`
    SELECT id, slug, title, excerpt, category, article_type,
           featured_asset_url, published_at
    FROM articles
    WHERE app = 'part-time'
      AND status = 'published'
      AND category = ${category}
    ORDER BY published_at DESC
    LIMIT ${limit}
  ` as NewsArticle[]

  if (articles.length === 0) {
    return null
  }

  const displayTitle = title || `${categoryDisplayNames[category]} News`

  return (
    <section className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          {displayTitle}
        </h3>
        {showViewAll && (
          <Link
            href="/part-time-jobs-articles"
            className="text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors"
          >
            View all articles →
          </Link>
        )}
      </div>

      {/* Articles Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {articles.map((article) => {
          const badge = typeBadges[article.article_type || 'manual']

          return (
            <Link
              key={article.id}
              href={`/${article.slug}`}
              className="group block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md hover:border-amber-200 transition-all duration-200"
            >
              {/* Image */}
              {article.featured_asset_url && (
                <div className="relative h-32 bg-gray-100 overflow-hidden">
                  <img
                    src={article.featured_asset_url}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-4">
                {/* Badge and Date */}
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${badge.color}`}>
                    {badge.label}
                  </span>
                  {article.published_at && (
                    <span className="text-xs text-gray-500">
                      {formatDate(article.published_at)}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h4 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-amber-700 transition-colors text-sm">
                  {article.title}
                </h4>

                {/* Excerpt */}
                {article.excerpt && (
                  <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                    {article.excerpt}
                  </p>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

/**
 * Compact version for sidebars
 */
export async function RoleNewsCompact({
  category,
  limit = 4
}: Omit<RoleNewsProps, 'showViewAll' | 'title'>) {
  const sql = createDbQuery()

  const articles = await sql`
    SELECT id, slug, title, article_type, published_at
    FROM articles
    WHERE app = 'part-time'
      AND status = 'published'
      AND category = ${category}
    ORDER BY published_at DESC
    LIMIT ${limit}
  ` as NewsArticle[]

  if (articles.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      <h4 className="font-bold text-sm text-gray-900 uppercase tracking-wide">
        Latest {categoryDisplayNames[category]} News
      </h4>
      <ul className="space-y-2">
        {articles.map((article) => (
          <li key={article.id}>
            <Link
              href={`/${article.slug}`}
              className="block text-sm text-gray-700 hover:text-amber-700 transition-colors line-clamp-2"
            >
              {article.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Mixed news component for homepage (shows all categories)
 */
export async function LatestNews({ limit = 6 }: { limit?: number }) {
  let articles: NewsArticle[] = []

  try {
    const sql = createDbQuery()
    articles = await sql`
      SELECT id, slug, title, excerpt, category, article_type,
             featured_asset_url, published_at
      FROM articles
      WHERE app = 'part-time'
        AND status = 'published'
      ORDER BY published_at DESC
      LIMIT ${limit}
    ` as NewsArticle[]
  } catch (error) {
    console.error('LatestNews: Failed to fetch articles', error)
    // Continue with empty articles array to show Coming Soon
  }

  // Coming Soon fallback when no articles exist or on error
  if (articles.length === 0) {
    return (
      <section className="py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Latest Part-Time Executive News
            </h2>
            <p className="text-gray-600 mt-1">
              Market insights, job updates, and industry trends
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 md:p-12 text-center border border-emerald-100">
          <div className="text-5xl mb-4">📰</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">News Coming Soon</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            We're launching our automated news feed with daily updates on part-time executive opportunities, market trends, and company insights.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/part-time-jobs-articles"
              className="inline-flex items-center px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Browse Existing Articles →
            </Link>
            <Link
              href="/part-time-jobs"
              className="inline-flex items-center px-5 py-2.5 bg-white text-gray-700 font-medium rounded-lg border border-gray-200 hover:border-emerald-300 transition-colors"
            >
              View Jobs
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Latest Part-Time Executive News
          </h2>
          <p className="text-gray-600 mt-1">
            Market insights, job updates, and industry trends
          </p>
        </div>
        <Link
          href="/part-time-jobs-articles"
          className="hidden md:inline-flex items-center text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors"
        >
          View all articles →
        </Link>
      </div>

      {/* Articles Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => {
          const badge = typeBadges[article.article_type || 'manual']
          const categoryBadge = article.category
            ? categoryDisplayNames[article.category]
            : null

          return (
            <Link
              key={article.id}
              href={`/${article.slug}`}
              className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-amber-200 transition-all duration-200"
            >
              {/* Image */}
              {article.featured_asset_url ? (
                <div className="relative h-40 bg-gray-100 overflow-hidden">
                  <img
                    src={article.featured_asset_url}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="h-2 bg-gradient-to-r from-amber-500 to-amber-600" />
              )}

              {/* Content */}
              <div className="p-5">
                {/* Badges */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${badge.color}`}>
                    {badge.label}
                  </span>
                  {categoryBadge && (
                    <span className="text-xs text-gray-500">
                      {categoryBadge}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-700 transition-colors">
                  {article.title}
                </h3>

                {/* Excerpt */}
                {article.excerpt && (
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {article.excerpt}
                  </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-sm">
                  <span className="text-gray-500">
                    {formatDate(article.published_at)}
                  </span>
                  <span className="font-medium text-amber-700 group-hover:text-amber-800">
                    Read →
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Mobile View All */}
      <div className="mt-6 md:hidden text-center">
        <Link
          href="/part-time-jobs-articles"
          className="inline-flex items-center text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors"
        >
          View all articles →
        </Link>
      </div>
    </section>
  )
}
