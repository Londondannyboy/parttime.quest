import { Metadata } from 'next'
import Link from 'next/link'
import { dbQuery } from '@/lib/db'

export const revalidate = 14400 // Revalidate every 4 hours

interface ArticleDetailPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ArticleDetailPageProps): Promise<Metadata> {
  try {
    const result = await dbQuery(
      `SELECT title, meta_description FROM articles WHERE slug = '${params.slug}' AND status = 'published' LIMIT 1`
    )

    const article = result?.[0]

    return {
      title: `${article?.title || 'Article'} | Fractional.Quest`,
      description: article?.meta_description || 'Read this article on Fractional.Quest',
      openGraph: {
        title: article?.title || 'Article',
        description: article?.meta_description || 'Read this article on Fractional.Quest',
        type: 'article',
      },
    }
  } catch (error) {
    return {
      title: 'Article | Fractional.Quest',
      description: 'Read this article on Fractional.Quest',
    }
  }
}

export async function generateStaticParams() {
  try {
    const articles = await dbQuery(
      `SELECT slug FROM articles WHERE status = 'published' AND app = 'fractional' LIMIT 100`
    )

    return articles.map((article: any) => ({
      slug: article.slug,
    }))
  } catch (error) {
    return []
  }
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  try {
    const result = await dbQuery(
      `
      SELECT
        id,
        slug,
        title,
        content,
        excerpt,
        meta_description,
        hero_asset_url,
        hero_asset_alt,
        published_at,
        word_count,
        author
      FROM articles
      WHERE slug = '${params.slug}' AND status = 'published'
      LIMIT 1
      `
    )

    if (!result || result.length === 0) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-6">This article may have been removed or is not available.</p>
            <Link href="/articles">
              <button className="px-6 py-2.5 bg-purple-700 text-white rounded-lg hover:bg-purple-800">
                Back to Articles
              </button>
            </Link>
          </div>
        </div>
      )
    }

    const article = result[0]

    return (
      <div className="min-h-screen bg-white">
        {/* Article Header */}
        <article className="bg-white">
          {/* Hero Image */}
          {article.hero_asset_url && (
            <div className="relative w-full h-96 md:h-96 overflow-hidden">
              <img
                src={article.hero_asset_url}
                alt={article.hero_asset_alt || article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          )}

          {/* Article Content */}
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Back Button */}
            <Link href="/articles" className="text-purple-700 hover:text-purple-900 mb-6 inline-block">
              ← Back to Articles
            </Link>

            {/* Title & Meta */}
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8 pb-8 border-b border-gray-200">
              {article.author && <span className="text-gray-600 font-medium">By {article.author}</span>}

              {article.published_at && (
                <span className="text-gray-600">
                  {new Date(article.published_at).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              )}

              {article.word_count && (
                <span className="text-gray-600">{article.word_count.toLocaleString()} words</span>
              )}

              {article.word_count && (
                <span className="text-gray-600">
                  {Math.ceil(article.word_count / 200)} min read
                </span>
              )}
            </div>

            {article.excerpt && (
              <p className="text-xl text-gray-600 mb-8 leading-relaxed italic">
                {article.excerpt}
              </p>
            )}

            {/* Article Body with Tailwind Typography */}
            <div className="prose prose-lg prose-purple max-w-none mb-12">
              <div
                dangerouslySetInnerHTML={{
                  __html: article.content || '<p>No content available</p>',
                }}
              />
            </div>

            {/* Article Footer */}
            <div className="py-8 border-t border-gray-200">
              <div className="bg-purple-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">About This Article</h3>
                <p className="text-gray-600">
                  {article.meta_description ||
                    'This article is part of our comprehensive guide to fractional executive roles.'}
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles CTA */}
        <section className="bg-gray-50 py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to explore fractional roles?</h2>
            <p className="text-gray-600 mb-6">Browse our latest job opportunities and find your next executive position.</p>
            <Link href="/fractionaljobsuk">
              <button className="px-6 py-2.5 bg-purple-700 text-white rounded-lg hover:bg-purple-800 font-medium">
                Browse Jobs
              </button>
            </Link>
          </div>
        </section>
      </div>
    )
  } catch (error) {
    console.error('Error fetching article:', error)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Article</h1>
          <p className="text-gray-600 mb-6">There was an error loading this article. Please try again.</p>
          <Link href="/articles">
            <button className="px-6 py-2.5 bg-purple-700 text-white rounded-lg hover:bg-purple-800">
              Back to Articles
            </button>
          </Link>
        </div>
      </div>
    )
  }
}
