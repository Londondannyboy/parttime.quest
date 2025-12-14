// Cron job for automated news article generation
// Runs every 2 hours via Vercel Cron
// Schedule: "0 */2 * * *" (every 2 hours)

import { NextResponse } from 'next/server'
import { createDbQuery } from '@/lib/db'
import {
  generateArticle,
  generateSlug,
  getCompanyLogo,
  mapRoleCategoryToArticleCategory,
  type ContentType,
  type ArticleCategory
} from '@/lib/news-generator'
import {
  getNextContentType,
  getNextCategory,
  getUncoveredJobs,
  recordJobCoverage,
  updateGenerationState,
  shouldGenerateNews
} from '@/lib/news-tracker'

const sql = createDbQuery()

// Verify cron secret for security
function verifyCronSecret(request: Request): boolean {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  // In development, skip auth check if no secret configured
  if (!cronSecret && process.env.NODE_ENV === 'development') {
    return true
  }

  if (!cronSecret) {
    console.warn('CRON_SECRET not configured')
    return false
  }

  return authHeader === `Bearer ${cronSecret}`
}

export async function GET(request: Request) {
  try {
    // Verify authentication
    if (!verifyCronSecret(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Rate limiting check
    const canGenerate = await shouldGenerateNews()
    if (!canGenerate) {
      return NextResponse.json({
        success: false,
        message: 'Rate limited - last generation was too recent'
      })
    }

    // Determine what type of content to generate
    const contentType = await getNextContentType()
    console.log(`[News Generator] Generating: ${contentType}`)

    let category: ArticleCategory | undefined
    if (contentType === 'job_roundup') {
      category = await getNextCategory()
      console.log(`[News Generator] Category: ${category}`)
    }

    // Get uncovered jobs for this content type
    const jobs = await getUncoveredJobs(contentType, category)

    if (jobs.length === 0) {
      console.log('[News Generator] No uncovered jobs found')
      return NextResponse.json({
        success: false,
        message: 'No uncovered jobs available for content generation'
      })
    }

    console.log(`[News Generator] Found ${jobs.length} jobs to cover`)

    // Generate the article
    const article = await generateArticle(contentType, jobs, category)

    // Generate unique slug
    let slug = generateSlug(article.suggested_slug || article.title)
    const timestamp = Date.now().toString(36)
    slug = `${slug}-${timestamp}`

    // Get company logo for featured image (use first job's company)
    let featuredImageUrl: string | null = null
    if (jobs[0]?.company_domain) {
      featuredImageUrl = await getCompanyLogo(jobs[0].company_domain)
    }

    // Insert article into database
    const [insertedArticle] = await sql`
      INSERT INTO articles (
        slug,
        title,
        content,
        excerpt,
        status,
        app,
        category,
        article_type,
        auto_generated,
        generation_metadata,
        featured_asset_url,
        published_at
      ) VALUES (
        ${slug},
        ${article.title},
        ${article.content},
        ${article.excerpt},
        'published',
        'part-time',
        ${article.category},
        ${contentType},
        true,
        ${JSON.stringify({
          generated_at: new Date().toISOString(),
          content_type: contentType,
          jobs_used: jobs.map(j => ({ id: j.id, company: j.company_name, title: j.title })),
          model: 'google-gla:gemini-1.5-flash'
        })},
        ${featuredImageUrl},
        NOW()
      )
      RETURNING id
    `

    // Record job coverage
    const jobIds = jobs.map(j => j.id)
    await recordJobCoverage(jobIds, insertedArticle.id, contentType)

    // Update generation state
    await updateGenerationState(contentType)

    console.log(`[News Generator] Created article: ${slug} (ID: ${insertedArticle.id})`)

    return NextResponse.json({
      success: true,
      article: {
        id: insertedArticle.id,
        slug,
        title: article.title,
        category: article.category,
        contentType,
        jobsUsed: jobs.length
      }
    })

  } catch (error) {
    console.error('[News Generator] Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate news article', details: String(error) },
      { status: 500 }
    )
  }
}

// Also support POST for manual triggering
export async function POST(request: Request) {
  return GET(request)
}
