import { Metadata } from 'next'
import Link from 'next/link'
import { createDbQuery } from '@/lib/db'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/Badge'

// Revalidate every 4 hours for articles
export const revalidate = 14400

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getArticle(slug: string) {
  try {
    const sql = createDbQuery()
    const articles = await sql`
      SELECT
        id,
        slug,
        title,
        excerpt,
        content,
        hero_asset_url,
        hero_asset_alt,
        published_at,
        word_count
      FROM articles
      WHERE slug = ${slug}
        AND status = 'published'
        AND app = 'fractional'
      LIMIT 1
    `
    return articles[0] || null
  } catch (error) {
    console.error('Error fetching article:', error)
    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    return { title: 'Article Not Found | Fractional.Quest' }
  }

  return {
    title: `${article.title} | Fractional.Quest`,
    description: article.meta_description || article.excerpt || 'Read this article on Fractional.Quest',
  }
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    notFound()
  }

  const readingTime = article.word_count ? Math.ceil(article.word_count / 200) : null
  const formattedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <article className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link href="/fractional-jobs-articles" className="text-purple-200 hover:text-white transition-colors text-sm">
              ← Back to Articles
            </Link>
          </nav>

          {/* Category Badge */}
          <div className="mb-6">
            <Badge variant="primary" size="md" className="bg-purple-600/50 text-white border border-purple-400/30">
              Fractional Executive Guide
            </Badge>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6">
            {article.title}
          </h1>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-xl md:text-2xl text-purple-100 leading-relaxed mb-8 max-w-3xl">
              {article.excerpt}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-purple-200">
            {formattedDate && (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formattedDate}
              </span>
            )}
            {readingTime && (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {readingTime} min read
              </span>
            )}
            {article.word_count && (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {article.word_count.toLocaleString()} words
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Hero Image (if exists) */}
      {article.hero_asset_url && (
        <div className="relative -mt-8 max-w-5xl mx-auto px-4">
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={article.hero_asset_url}
              alt={article.hero_asset_alt || article.title}
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Article Body with Enhanced Styling */}
        <div
          className="
            bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12
            prose prose-lg max-w-none
            prose-headings:font-bold prose-headings:text-gray-900
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-gray-200
            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
            prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-3
            prose-p:text-gray-700 prose-p:leading-8 prose-p:mb-6
            prose-ul:my-6 prose-ul:space-y-3
            prose-ol:my-6 prose-ol:space-y-3
            prose-li:text-gray-700 prose-li:leading-7
            prose-strong:text-gray-900 prose-strong:font-semibold
            prose-em:italic prose-em:text-gray-600
            prose-blockquote:border-l-4 prose-blockquote:border-purple-500 prose-blockquote:bg-purple-50 prose-blockquote:rounded-r-lg prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:my-8 prose-blockquote:not-italic prose-blockquote:text-gray-700
            prose-code:bg-gray-100 prose-code:text-purple-700 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-[''] prose-code:after:content-['']
            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-6 prose-pre:rounded-xl prose-pre:overflow-x-auto prose-pre:my-8
            prose-a:text-purple-700 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
            prose-table:w-full prose-table:my-8 prose-table:rounded-lg prose-table:overflow-hidden prose-table:shadow-sm prose-table:border prose-table:border-gray-200
            prose-thead:bg-purple-50
            prose-th:px-6 prose-th:py-4 prose-th:text-left prose-th:font-semibold prose-th:text-gray-900 prose-th:border-b prose-th:border-gray-200
            prose-td:px-6 prose-td:py-4 prose-td:border-b prose-td:border-gray-100
            prose-tr:even:bg-gray-50
            prose-hr:my-12 prose-hr:border-gray-200
          "
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-8 md:p-10 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Ready to find fractional talent?</h3>
              <p className="text-purple-100">Browse our curated list of fractional executive opportunities.</p>
            </div>
            <Link href="/fractional-jobs">
              <button className="px-8 py-4 bg-white text-purple-700 rounded-xl font-bold hover:bg-purple-50 transition-colors whitespace-nowrap shadow-lg">
                Browse Jobs →
              </button>
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between items-center">
          <Link href="/fractional-jobs-articles" className="text-purple-700 hover:text-purple-900 font-medium flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to All Articles
          </Link>
          <a
            href="#top"
            className="text-gray-500 hover:text-gray-700 flex items-center gap-2"
          >
            Back to top
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  )
}
