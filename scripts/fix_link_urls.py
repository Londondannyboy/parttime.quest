#!/usr/bin/env python3
"""
Fix Internal Link URLs - Convert query params to dedicated pages

Replaces:
- /fractional-jobs?role=CFO → /fractional-cfo-jobs-uk
- /fractional-jobs?role=CMO → /fractional-cmo-jobs-uk
- /fractional-jobs?role=CTO → /fractional-cto-jobs-uk
- /fractional-jobs?role=COO → /fractional-coo-jobs-uk

This gives proper SEO benefit as each is a genuinely different page.
"""

import os
import re

import psycopg2
from psycopg2.extras import RealDictCursor

from dotenv import load_dotenv
load_dotenv('.env.local')
load_dotenv()

# URL replacements - query params to dedicated pages
URL_REPLACEMENTS = {
    '/fractional-jobs?role=CFO': '/fractional-cfo-jobs-uk',
    '/fractional-jobs?role=CMO': '/fractional-cmo-jobs-uk',
    '/fractional-jobs?role=CTO': '/fractional-cto-jobs-uk',
    '/fractional-jobs?role=COO': '/fractional-coo-jobs-uk',
}


def fix_urls(text: str) -> tuple[str, int]:
    """
    Replace query parameter URLs with dedicated page URLs.
    Returns: (updated_text, replacements_made)
    """
    if not text:
        return text, 0

    result = text
    total_replacements = 0

    for old_url, new_url in URL_REPLACEMENTS.items():
        count = result.count(old_url)
        if count > 0:
            result = result.replace(old_url, new_url)
            total_replacements += count

    return result, total_replacements


def get_db_connection():
    """Get database connection"""
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        raise ValueError("DATABASE_URL environment variable not set")
    return psycopg2.connect(database_url)


def fetch_jobs_with_query_params(conn, limit: int = 1000) -> list[dict]:
    """Fetch jobs that have query parameter URLs"""
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT id, title, company_name, role_category, full_description
            FROM jobs
            WHERE is_active = true
            AND full_description LIKE '%%/fractional-jobs?role=%%'
            ORDER BY posted_date DESC NULLS LAST
            LIMIT %s
        """, (limit,))
        return [dict(row) for row in cur.fetchall()]


def update_job_description(conn, job_id: str, new_description: str):
    """Update job with fixed description"""
    with conn.cursor() as cur:
        cur.execute("""
            UPDATE jobs
            SET full_description = %s,
                updated_date = NOW()
            WHERE id = %s
        """, (new_description, job_id))


def process_jobs(limit: int = 1000, dry_run: bool = False):
    """Main processing function"""
    conn = get_db_connection()

    try:
        jobs = fetch_jobs_with_query_params(conn, limit)
        print(f"Found {len(jobs)} jobs with query parameter URLs to fix")

        if not jobs:
            print("No jobs to fix!")
            return

        print(f"\n{'='*60}")
        print(f"CONVERTING QUERY PARAMS TO DEDICATED PAGES")
        print(f"{'='*60}")
        print(f"Replacements:")
        for old, new in URL_REPLACEMENTS.items():
            print(f"  {old} → {new}")
        print(f"{'='*60}\n")

        fixed_count = 0
        total_replacements = 0

        for i, job in enumerate(jobs):
            print(f"\n[{i+1}/{len(jobs)}] {job['title'][:50]}")

            fixed_text, replacements = fix_urls(job['full_description'])

            if replacements > 0:
                print(f"    {replacements} URL(s) converted to dedicated pages")

                if not dry_run:
                    update_job_description(conn, job['id'], fixed_text)
                    conn.commit()
                    print(f"    ✓ Fixed")
                else:
                    print(f"    (dry run - not saved)")

                fixed_count += 1
                total_replacements += replacements

        print(f"\n{'='*60}")
        print(f"COMPLETE: {fixed_count} jobs fixed, {total_replacements} URLs converted")
        if dry_run:
            print("(DRY RUN - no changes saved)")
        print(f"{'='*60}\n")

    finally:
        conn.close()


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description='Convert query param URLs to dedicated pages')
    parser.add_argument('--limit', type=int, default=1000, help='Number of jobs to process')
    parser.add_argument('--dry-run', action='store_true', help='Preview changes without saving')

    args = parser.parse_args()

    print(f"\nFixing Internal Link URLs...")
    print(f"Limit: {args.limit}")
    print(f"Dry run: {args.dry_run}")

    process_jobs(limit=args.limit, dry_run=args.dry_run)
