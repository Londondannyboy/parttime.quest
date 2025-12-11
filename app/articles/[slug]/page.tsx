import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Article | Fractional.Quest',
}

export default function ArticleDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">Article: {params.slug}</h1>
      <p className="text-gray-600">Article content coming soon.</p>
    </div>
  )
}
