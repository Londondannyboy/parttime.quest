import { createDbQuery } from './db'

export interface Agency {
  id: number
  slug: string
  name: string
  description: string | null
  headquarters: string | null
  specializations: string[] | null
  overview: string | null
  meta_description: string | null
  payload: {
    fee?: string
    featured?: boolean
    website?: string | null
    highlights?: string[]
  }
}

export async function getAgencies(): Promise<Agency[]> {
  const sql = createDbQuery()
  const agencies = await sql`
    SELECT id, slug, name, description, headquarters, specializations, overview, meta_description, payload
    FROM companies
    WHERE app = 'part-time'
      AND company_type = 'part_time_recruiter'
      AND status = 'published'
    ORDER BY (payload->>'featured')::boolean DESC NULLS LAST, name
  `
  return agencies as Agency[]
}

export async function getAgencyBySlug(slug: string): Promise<Agency | null> {
  const sql = createDbQuery()
  const agencies = await sql`
    SELECT id, slug, name, description, headquarters, specializations, overview, meta_description, payload
    FROM companies
    WHERE slug = ${slug}
      AND app = 'part-time'
      AND company_type = 'part_time_recruiter'
      AND status = 'published'
    LIMIT 1
  `
  return (agencies[0] as Agency) || null
}

export async function getAgencySlugs(): Promise<string[]> {
  const sql = createDbQuery()
  const agencies = await sql`
    SELECT slug
    FROM companies
    WHERE app = 'part-time'
      AND company_type = 'part_time_recruiter'
      AND status = 'published'
  `
  return (agencies as Array<{ slug: string }>).map(a => a.slug)
}
