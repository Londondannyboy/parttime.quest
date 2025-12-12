#!/usr/bin/env python3
"""
Add Internal Links to Existing Jobs

Retrospectively adds SEO internal links to all job descriptions.
Uses Pydantic AI to intelligently insert links without disrupting flow.
"""

import os
import asyncio
from typing import Optional

import psycopg2
from psycopg2.extras import RealDictCursor
from pydantic import BaseModel, Field
from pydantic_ai import Agent

from dotenv import load_dotenv
# Load .env.local first, then .env
load_dotenv('.env.local')
load_dotenv()


class LinkedDescription(BaseModel):
    """Job description with internal links added"""

    updated_description: str = Field(description="""
        The job description with 2-4 internal SEO links to DIFFERENT dedicated pages.

        AVAILABLE DEDICATED PAGES (each is a truly different page - use each ONLY ONCE):
        - /fractional-cfo-jobs-uk (for CFO, finance director, finance leadership mentions)
        - /fractional-cmo-jobs-uk (for CMO, marketing director mentions)
        - /fractional-cto-jobs-uk (for CTO, tech director mentions)
        - /fractional-coo-jobs-uk (for COO, operations director mentions)
        - /fractional-jobs (for generic: fractional jobs, portfolio career, fractional executive)

        CRITICAL RULES:
        1. NEVER link to the same page twice!
        2. Use DEDICATED PAGES not query parameters (e.g., /fractional-cfo-jobs-uk NOT /fractional-jobs?role=CFO)
        3. Replace any existing ?role= parameter links with dedicated page URLs
        4. Use 2-4 DIFFERENT dedicated pages per description
        5. Prioritize the role-specific page matching the job category
        6. Links must read smoothly - preserve editorial flow
        7. Use markdown format: [anchor text](url)

        Example transformation:
        Before: "This fractional CFO opportunity offers strategic impact for finance leaders seeking portfolio careers."
        After: "This [fractional CFO](/fractional-cfo-jobs-uk) opportunity offers strategic impact for finance leaders seeking [portfolio careers](/fractional-jobs)."
    """)

    links_added: int = Field(description="Number of internal links added (should be 2-4)")

    clusters_used: list[str] = Field(description="Which keyword clusters were linked (e.g., ['CFO', 'general'])")


# Create the agent - prefer Google Gemini (most reliable)
# Order: Google Gemini > Anthropic Claude > OpenAI
def get_model():
    if os.environ.get('GOOGLE_API_KEY'):
        return 'google-gla:gemini-2.0-flash'
    elif os.environ.get('ANTHROPIC_API_KEY'):
        return 'anthropic:claude-3-haiku-20240307'
    elif os.environ.get('OPENAI_API_KEY') and not os.environ.get('OPENAI_API_KEY', '').startswith('sk-proj-placeholder'):
        return 'openai:gpt-4o-mini'
    else:
        raise ValueError("No valid API key found. Set GOOGLE_API_KEY, ANTHROPIC_API_KEY, or OPENAI_API_KEY")

model_name = get_model()
print(f"Using model: {model_name}")

agent = Agent(
    model_name,
    output_type=LinkedDescription,
    system_prompt="""You are an SEO specialist adding internal links to job descriptions.

Your task: Add 2-4 internal links to DIFFERENT dedicated pages - Google penalizes duplicate links!

AVAILABLE DEDICATED PAGES (each is a truly different page - use each ONLY ONCE):
- /fractional-cfo-jobs-uk (CFO, finance director, finance leadership)
- /fractional-cmo-jobs-uk (CMO, marketing director, marketing leadership)
- /fractional-cto-jobs-uk (CTO, tech director, technology leadership)
- /fractional-coo-jobs-uk (COO, operations director, operations leadership)
- /fractional-jobs (generic: fractional jobs, portfolio career, fractional executive)

CRITICAL RULES:
1. NEVER use the same URL twice - each link must go to a DIFFERENT page!
2. These are DIFFERENT pages, not the same page with parameters
3. Replace any existing /fractional-jobs?role=X links with the dedicated page URLs
4. Prioritize the role-specific page matching the job's category
5. Links must feel natural and editorial
6. Use 2-4 different pages total

BAD: [fractional CFO](/fractional-jobs?role=CFO) - uses query parameter
GOOD: [fractional CFO](/fractional-cfo-jobs-uk) - uses dedicated page
"""
)


def has_duplicate_urls(text: str) -> bool:
    """Check if text has duplicate internal link URLs"""
    import re
    urls = re.findall(r'\]\((/fractional-jobs[^)]*)\)', text or '')
    return len(urls) != len(set(urls))


def get_unique_urls(text: str) -> list:
    """Extract unique URLs from markdown links"""
    import re
    urls = re.findall(r'\]\((/fractional-jobs[^)]*)\)', text or '')
    return list(set(urls))


def get_db_connection():
    """Get database connection"""
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        raise ValueError("DATABASE_URL environment variable not set")
    return psycopg2.connect(database_url)


def fetch_jobs_without_links(conn, limit: int = 100) -> list[dict]:
    """Fetch jobs that don't have internal links yet"""
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT id, title, company_name, role_category, full_description
            FROM jobs
            WHERE is_active = true
            AND full_description IS NOT NULL
            AND full_description != ''
            AND full_description NOT LIKE '%%](/fractional-jobs%%'
            ORDER BY posted_date DESC NULLS LAST
            LIMIT %s
        """, (limit,))
        return [dict(row) for row in cur.fetchall()]


def fetch_jobs_with_duplicate_links(conn, limit: int = 1000) -> list[dict]:
    """Fetch jobs that have duplicate internal link URLs (need fixing)"""
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT id, title, company_name, role_category, full_description
            FROM jobs
            WHERE is_active = true
            AND full_description IS NOT NULL
            AND full_description LIKE '%%](/fractional-jobs%%'
            ORDER BY posted_date DESC NULLS LAST
            LIMIT %s
        """, (limit,))
        # Filter to only those with duplicate URLs
        jobs = [dict(row) for row in cur.fetchall()]
        return [j for j in jobs if has_duplicate_urls(j['full_description'])]


def fetch_all_jobs(conn, limit: int = 1000) -> list[dict]:
    """Fetch all active jobs for processing"""
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT id, title, company_name, role_category, full_description
            FROM jobs
            WHERE is_active = true
            AND full_description IS NOT NULL
            AND full_description != ''
            ORDER BY posted_date DESC NULLS LAST
            LIMIT %s
        """, (limit,))
        return [dict(row) for row in cur.fetchall()]


async def add_links_to_job(job: dict) -> Optional[LinkedDescription]:
    """Add internal links to a single job description"""

    context = f"""
Job Title: {job['title']}
Company: {job['company_name']}
Role Category: {job.get('role_category', 'Not specified')}

Current Description:
{job['full_description']}

Add 2-4 internal links using markdown format. Prioritize the {job.get('role_category', 'general')} cluster if relevant.
"""

    try:
        result = await agent.run(context)
        return result.output
    except Exception as e:
        error_str = str(e)
        print(f"    Error: {error_str[:200]}")
        if 'invalid_api_key' in error_str.lower() or 'authentication' in error_str.lower():
            print("    ⚠️  API key issue detected!")
        return None


def update_job_description(conn, job_id: str, new_description: str):
    """Update job with linked description"""
    with conn.cursor() as cur:
        cur.execute("""
            UPDATE jobs
            SET full_description = %s,
                updated_date = NOW()
            WHERE id = %s
        """, (new_description, job_id))


async def process_jobs(limit: int = 100, force_all: bool = False, fix_duplicates: bool = False):
    """Main processing function"""
    conn = get_db_connection()

    try:
        # Fetch jobs
        if fix_duplicates:
            jobs = fetch_jobs_with_duplicate_links(conn, limit)
            print(f"Found {len(jobs)} jobs with DUPLICATE internal links to fix")
        elif force_all:
            jobs = fetch_all_jobs(conn, limit)
            print(f"Processing ALL {len(jobs)} jobs (including those with existing links)")
        else:
            jobs = fetch_jobs_without_links(conn, limit)
            print(f"Found {len(jobs)} jobs without internal links")

        if not jobs:
            print("No jobs to process!")
            return

        print(f"\n{'='*60}")
        print(f"ADDING INTERNAL SEO LINKS TO JOB DESCRIPTIONS")
        print(f"{'='*60}\n")

        success_count = 0
        error_count = 0

        for i, job in enumerate(jobs):
            print(f"\n[{i+1}/{len(jobs)}] {job['title'][:50]}")
            print(f"    Company: {job['company_name'][:30] if job['company_name'] else 'Unknown'}")
            print(f"    Category: {job.get('role_category', 'N/A')}")

            # Skip if already has links and not forcing/fixing
            if not force_all and not fix_duplicates and '](/fractional-jobs' in (job['full_description'] or ''):
                print(f"    ⏭ Already has links, skipping")
                continue

            if fix_duplicates:
                print(f"    🔧 Fixing duplicate URLs...")

            result = await add_links_to_job(job)

            if result:
                # Verify links were actually added and no duplicates
                if '](/fractional-jobs' in result.updated_description:
                    if has_duplicate_urls(result.updated_description):
                        print(f"    ⚠ Output still has duplicate URLs, skipping")
                        urls = get_unique_urls(result.updated_description)
                        print(f"      URLs found: {urls}")
                        error_count += 1
                    else:
                        update_job_description(conn, job['id'], result.updated_description)
                        conn.commit()
                        urls = get_unique_urls(result.updated_description)
                        print(f"    ✓ {len(urls)} unique links: {', '.join(urls)}")
                        success_count += 1
                else:
                    print(f"    ⚠ No links in output, skipping update")
                    error_count += 1
            else:
                error_count += 1

            # Rate limiting
            await asyncio.sleep(0.5)

        print(f"\n{'='*60}")
        print(f"COMPLETE: {success_count} updated, {error_count} errors/skipped")
        print(f"{'='*60}\n")

    finally:
        conn.close()


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description='Add internal SEO links to job descriptions')
    parser.add_argument('--limit', type=int, default=100, help='Number of jobs to process')
    parser.add_argument('--all', action='store_true', help='Process all jobs, even those with existing links')
    parser.add_argument('--force', action='store_true', help='Force reprocess all jobs (same as --all)')
    parser.add_argument('--fix-duplicates', action='store_true', help='Find and fix jobs with duplicate link URLs')

    args = parser.parse_args()

    print(f"\nStarting Internal Link Addition...")
    print(f"Limit: {args.limit}")
    if args.fix_duplicates:
        print(f"Mode: FIX DUPLICATE URLS")
    elif args.all or args.force:
        print(f"Mode: Process ALL jobs")
    else:
        print(f"Mode: Jobs without links only")

    asyncio.run(process_jobs(limit=args.limit, force_all=args.all or args.force, fix_duplicates=args.fix_duplicates))
