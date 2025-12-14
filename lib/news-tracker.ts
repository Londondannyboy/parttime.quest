/**
 * Tracks job coverage for news generation to prevent duplicate content
 * and manage content rotation state
 */

import { createDbQuery } from '@/lib/db'
import type { ContentType, ArticleCategory, JobData } from './news-generator'

const sql = createDbQuery()

// Content type rotation order
const CONTENT_TYPE_ROTATION: ContentType[] = ['job_roundup', 'company_spotlight', 'market_trend']

// Category rotation for roundups
const CATEGORY_ROTATION: ArticleCategory[] = ['Finance', 'Marketing', 'Engineering', 'Operations', 'Sales', 'General']

/**
 * Get the next content type in rotation
 */
export async function getNextContentType(): Promise<ContentType> {
  const [state] = await sql`
    SELECT last_content_type FROM news_generation_state WHERE id = 1
  `

  const lastType = state?.last_content_type as ContentType | null
  const currentIndex = lastType ? CONTENT_TYPE_ROTATION.indexOf(lastType) : -1
  const nextIndex = (currentIndex + 1) % CONTENT_TYPE_ROTATION.length

  return CONTENT_TYPE_ROTATION[nextIndex]
}

/**
 * Get the next category for job roundups (cycles through categories)
 */
export async function getNextCategory(): Promise<ArticleCategory> {
  // Get count of roundups per category to find the least covered
  const categoryCounts = await sql`
    SELECT category, COUNT(*) as count
    FROM articles
    WHERE article_type = 'job_roundup'
      AND app = 'part-time'
      AND auto_generated = true
    GROUP BY category
  `

  const counts = new Map<string, number>()
  for (const row of categoryCounts) {
    counts.set(row.category, Number(row.count))
  }

  // Find category with lowest count
  let minCategory = CATEGORY_ROTATION[0]
  let minCount = counts.get(minCategory) || 0

  for (const category of CATEGORY_ROTATION) {
    const count = counts.get(category) || 0
    if (count < minCount) {
      minCount = count
      minCategory = category
    }
  }

  return minCategory
}

/**
 * Get uncovered jobs for a specific content type and category
 */
export async function getUncoveredJobs(
  contentType: ContentType,
  category?: ArticleCategory,
  limit: number = 5
): Promise<JobData[]> {
  // Map article category back to job role_category
  const roleCategory = category === 'General' ? 'Other' : category

  if (contentType === 'company_spotlight') {
    // For spotlights, get a single job from a company not recently covered
    const jobs = await sql`
      SELECT j.id, j.title, j.company_name, j.company_domain, j.location,
             j.role_category, j.salary_min, j.salary_max, j.is_remote,
             j.posted_date::text, j.description_snippet
      FROM jobs j
      WHERE j.is_active = true
        AND j.is_fractional = true
        AND NOT EXISTS (
          SELECT 1 FROM job_news_coverage jnc
          WHERE jnc.job_id = j.id::text
            AND jnc.coverage_type = 'company_spotlight'
            AND jnc.covered_at > NOW() - INTERVAL '7 days'
        )
      ORDER BY j.posted_date DESC NULLS LAST
      LIMIT 1
    `
    return jobs as JobData[]
  }

  if (contentType === 'job_roundup' && roleCategory) {
    // For roundups, get multiple jobs from the specified category
    const jobs = await sql`
      SELECT j.id, j.title, j.company_name, j.company_domain, j.location,
             j.role_category, j.salary_min, j.salary_max, j.is_remote,
             j.posted_date::text, j.description_snippet
      FROM jobs j
      WHERE j.is_active = true
        AND j.is_fractional = true
        AND j.role_category = ${roleCategory}
        AND NOT EXISTS (
          SELECT 1 FROM job_news_coverage jnc
          WHERE jnc.job_id = j.id::text
            AND jnc.coverage_type = 'job_roundup'
            AND jnc.covered_at > NOW() - INTERVAL '14 days'
        )
      ORDER BY j.posted_date DESC NULLS LAST
      LIMIT ${limit}
    `
    return jobs as JobData[]
  }

  // For market trends, get a mix of recent jobs
  const jobs = await sql`
    SELECT j.id, j.title, j.company_name, j.company_domain, j.location,
           j.role_category, j.salary_min, j.salary_max, j.is_remote,
           j.posted_date::text, j.description_snippet
    FROM jobs j
    WHERE j.is_active = true
      AND j.is_fractional = true
    ORDER BY j.posted_date DESC NULLS LAST
    LIMIT ${limit * 2}
  `
  return jobs as JobData[]
}

/**
 * Record job coverage for an article
 */
export async function recordJobCoverage(
  jobIds: string[],
  articleId: number,
  coverageType: ContentType
): Promise<void> {
  for (const jobId of jobIds) {
    await sql`
      INSERT INTO job_news_coverage (job_id, article_id, coverage_type)
      VALUES (${jobId}, ${articleId}, ${coverageType})
      ON CONFLICT (job_id, article_id) DO NOTHING
    `
  }
}

/**
 * Update generation state after successful article creation
 */
export async function updateGenerationState(contentType: ContentType): Promise<void> {
  await sql`
    UPDATE news_generation_state
    SET last_content_type = ${contentType},
        last_generated_at = NOW(),
        jobs_processed_count = jobs_processed_count + 1
    WHERE id = 1
  `
}

/**
 * Check if we should generate news (rate limiting)
 */
export async function shouldGenerateNews(): Promise<boolean> {
  const [state] = await sql`
    SELECT last_generated_at FROM news_generation_state WHERE id = 1
  `

  if (!state?.last_generated_at) {
    return true
  }

  // Don't generate more than once per hour (safety margin for 2-hour cron)
  const lastGenerated = new Date(state.last_generated_at)
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000)

  return lastGenerated < hourAgo
}

/**
 * Get recent news articles for display
 */
export async function getRecentNews(
  category?: ArticleCategory,
  limit: number = 6
): Promise<any[]> {
  if (category) {
    return sql`
      SELECT id, slug, title, excerpt, category, article_type,
             featured_asset_url, published_at
      FROM articles
      WHERE app = 'part-time'
        AND status = 'published'
        AND category = ${category}
      ORDER BY published_at DESC
      LIMIT ${limit}
    `
  }

  return sql`
    SELECT id, slug, title, excerpt, category, article_type,
           featured_asset_url, published_at
    FROM articles
    WHERE app = 'part-time'
      AND status = 'published'
    ORDER BY published_at DESC
    LIMIT ${limit}
  `
}
