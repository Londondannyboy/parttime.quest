import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

interface Article {
  slug: string
  title: string
  meta_description: string
  content: string
}

// Simple keyword extraction for article matching
function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    'what', 'is', 'are', 'the', 'a', 'an', 'how', 'do', 'does', 'can', 'i',
    'me', 'my', 'about', 'for', 'to', 'in', 'on', 'with', 'this', 'that',
    'show', 'tell', 'find', 'get', 'give', 'help', 'please', 'want', 'need',
  ])

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word))
}

// Search articles by keywords
async function searchArticles(query: string): Promise<Article[]> {
  const keywords = extractKeywords(query)

  if (keywords.length === 0) {
    // Return some default articles
    const articles = await sql`
      SELECT slug, title, meta_description, LEFT(content, 500) as content
      FROM articles
      WHERE status = 'published' AND app = 'fractional'
      ORDER BY created_at DESC
      LIMIT 3
    `
    return articles as Article[]
  }

  // Build search pattern
  const searchPattern = keywords.join('|')

  const articles = await sql`
    SELECT slug, title, meta_description, LEFT(content, 500) as content
    FROM articles
    WHERE status = 'published'
      AND app = 'fractional'
      AND (
        title ~* ${searchPattern}
        OR meta_description ~* ${searchPattern}
        OR content ~* ${searchPattern}
      )
    ORDER BY
      CASE
        WHEN title ~* ${searchPattern} THEN 1
        WHEN meta_description ~* ${searchPattern} THEN 2
        ELSE 3
      END,
      created_at DESC
    LIMIT 5
  `

  return articles as Article[]
}

// Generate a response based on the query and articles
function generateResponse(query: string, articles: Article[]): string {
  const lowerQuery = query.toLowerCase()

  // Check for specific intents
  if (lowerQuery.includes('what is') || lowerQuery.includes('what are')) {
    if (lowerQuery.includes('fractional')) {
      return `A **fractional executive** is an experienced professional who works part-time for multiple companies, typically 1-3 days per week. They bring senior-level expertise (CFO, CMO, CTO, etc.) to businesses that need strategic leadership but can't justify or afford a full-time hire.

**Key benefits include:**
- Access to senior talent at a fraction of the cost
- Flexible engagement (typically 1-3 days per week)
- Fresh perspective from cross-industry experience
- Immediate impact without lengthy recruitment

${articles.length > 0 ? '\nI found some relevant articles that might help:' : ''}`
    }

    if (lowerQuery.includes('cfo')) {
      return `A **Fractional CFO** is a part-time Chief Financial Officer who provides strategic financial leadership to multiple companies. They handle:

- Financial strategy and planning
- Cash flow management and forecasting
- Fundraising and investor relations
- Financial reporting and compliance
- Building finance teams and processes

Typical day rates in the UK range from **£900-£1,500/day** depending on experience and complexity.`
    }
  }

  if (lowerQuery.includes('day rate') || lowerQuery.includes('earn') || lowerQuery.includes('salary') || lowerQuery.includes('money')) {
    return `**Typical UK Fractional Executive Day Rates:**

| Role | Day Rate Range |
|------|----------------|
| Fractional CFO | £900 - £1,500 |
| Fractional CMO | £850 - £1,400 |
| Fractional CTO | £950 - £1,600 |
| Fractional COO | £900 - £1,400 |
| Fractional HR Director | £700 - £1,200 |

Annual earnings depend on utilization:
- **3 days/week** × 46 weeks × £1,000/day = **£138,000**
- **2 days/week** × 46 weeks × £1,000/day = **£92,000**

Many fractional executives work with 2-3 clients simultaneously.`
  }

  if (lowerQuery.includes('london')) {
    return `**London** is the UK's largest market for fractional executives, with strong demand across:

- **Financial Services** - Fintech startups and PE-backed firms
- **Tech/Scale-ups** - Shoreditch/Tech City companies
- **Professional Services** - Law firms and consultancies

Day rates in London are typically 15-20% higher than the rest of the UK. Many London-based fractional executives also serve clients remotely across the UK and Europe.

${articles.length > 0 ? '\nHere are some relevant articles:' : ''}`
  }

  if (lowerQuery.includes('transition') || lowerQuery.includes('become') || lowerQuery.includes('start')) {
    return `**How to Transition to Fractional Work:**

1. **Build your network** - Let contacts know you're available for fractional work
2. **Define your niche** - Focus on specific industries or challenges
3. **Start with one client** - Often your first client is a former employer
4. **Create a runway** - Have 6-12 months of savings before going fully fractional
5. **Build your brand** - LinkedIn, speaking, and thought leadership help attract clients

Most successful fractional executives have 15-20+ years of experience before making the transition.

${articles.length > 0 ? '\nThese articles provide more detailed guidance:' : ''}`
  }

  if (lowerQuery.includes('article') || lowerQuery.includes('show') || lowerQuery.includes('read')) {
    if (articles.length > 0) {
      return `I found ${articles.length} articles that match your request. Here are the most relevant ones:`
    }
    return `I couldn't find specific articles matching your query. Try browsing our [articles page](/fractional-jobs-articles) for all our content.`
  }

  // Default response
  if (articles.length > 0) {
    return `Based on your question, here's what I found. I've also included some relevant articles that might help with more detail.`
  }

  return `I'd be happy to help you learn more about fractional executive work! You can ask me about:

- **Roles** - CFO, CMO, CTO, COO, HR Director positions
- **Day rates** - What fractional executives typically earn
- **Markets** - London, Manchester, remote opportunities
- **Career transition** - How to become a fractional executive
- **Our articles** - Detailed guides and insights

What would you like to know more about?`
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Search for relevant articles
    const articles = await searchArticles(message)

    // Generate response
    const response = generateResponse(message, articles)

    // Format sources for response
    const sources = articles.map((article) => ({
      title: article.title,
      slug: article.slug,
    }))

    return NextResponse.json({
      response,
      sources,
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'An error occurred processing your request' },
      { status: 500 }
    )
  }
}
