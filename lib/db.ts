import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required')
}

export const sql = neon(process.env.DATABASE_URL)

// Query helpers
export async function queryJobs(filters: {
  isFractional?: boolean
  location?: string
  limit?: number
  offset?: number
}) {
  const { isFractional = true, location, limit = 50, offset = 0 } = filters

  let query = sql`
    SELECT
      id,
      title,
      company_name,
      location,
      workplace_type,
      compensation,
      posted_date,
      is_fractional,
      skills_required,
      seniority_level,
      role_category
    FROM jobs
    WHERE is_active = true
      AND is_fractional = ${isFractional}
  `

  if (location) {
    query = sql`
      SELECT
        id,
        title,
        company_name,
        location,
        workplace_type,
        compensation,
        posted_date,
        is_fractional,
        skills_required,
        seniority_level,
        role_category
      FROM jobs
      WHERE is_active = true
        AND is_fractional = ${isFractional}
        AND location ILIKE ${'%' + location + '%'}
    `
  }

  const results = await sql`
    ${query}
    ORDER BY posted_date DESC
    LIMIT ${limit} OFFSET ${offset}
  `

  return results
}

export async function getJobByTitle(title: string) {
  const results = await sql`
    SELECT
      id,
      title,
      company_name,
      location,
      workplace_type,
      compensation,
      posted_date,
      full_description,
      requirements,
      responsibilities,
      benefits,
      is_fractional,
      skills_required,
      seniority_level,
      about_company,
      about_team
    FROM jobs
    WHERE is_active = true
      AND title ILIKE ${title}
    LIMIT 1
  `

  return results[0]
}

export async function queryArticles(filters: {
  app?: string
  limit?: number
  offset?: number
}) {
  const { app = 'fractional', limit = 20, offset = 0 } = filters

  const results = await sql`
    SELECT
      id,
      slug,
      title,
      excerpt,
      content,
      status,
      app,
      created_at,
      published_at,
      meta_description,
      hero_asset_url,
      hero_asset_alt
    FROM articles
    WHERE status = 'published'
      AND app = ${app}
    ORDER BY published_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `

  return results
}

export async function getArticleBySlug(slug: string) {
  const results = await sql`
    SELECT
      id,
      slug,
      title,
      content,
      status,
      app,
      created_at,
      published_at,
      meta_description,
      hero_asset_url,
      hero_asset_alt,
      excerpt,
      word_count
    FROM articles
    WHERE slug = ${slug}
      AND status = 'published'
    LIMIT 1
  `

  return results[0]
}

export async function getJobCount(isFractional: boolean = true) {
  const results = await sql`
    SELECT COUNT(*) as count
    FROM jobs
    WHERE is_active = true
      AND is_fractional = ${isFractional}
  `

  return results[0]?.count || 0
}

export async function getAllJobSlugs() {
  const results = await sql`
    SELECT
      id,
      title,
      company_name
    FROM jobs
    WHERE is_active = true
      AND is_fractional = true
    ORDER BY posted_date DESC
    LIMIT 1000
  `

  return results
}

export async function getAllArticleSlugs() {
  const results = await sql`
    SELECT
      id,
      slug,
      title
    FROM articles
    WHERE status = 'published'
      AND app = 'fractional'
    ORDER BY published_at DESC
    LIMIT 500
  `

  return results
}
