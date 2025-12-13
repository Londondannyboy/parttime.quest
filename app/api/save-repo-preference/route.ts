import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

/**
 * Save extracted preference to user's Repo
 *
 * Stores both validated and unvalidated preferences with their confidence level
 */

interface SavePreferenceRequest {
  user_id: string
  preference_type: 'role' | 'industry' | 'location' | 'availability' | 'day_rate' | 'skill'
  values: string[]
  validated: boolean
  raw_text?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: SavePreferenceRequest = await request.json()

    if (!body.user_id || !body.preference_type || !body.values || body.values.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, preference_type, values' },
        { status: 400 }
      )
    }

    // First get the internal user ID from neon_auth_id
    const userResult = await sql`
      SELECT id FROM users WHERE neon_auth_id = ${body.user_id} LIMIT 1
    `

    if (userResult.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const internalUserId = userResult[0].id

    // Save each value to the user_repo_preferences table
    // Create table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS user_repo_preferences (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        preference_type VARCHAR(50) NOT NULL,
        preference_value TEXT NOT NULL,
        validated BOOLEAN DEFAULT false,
        confidence VARCHAR(20) DEFAULT 'extracted',
        raw_text TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, preference_type, preference_value)
      )
    `

    // Insert or update each preference value
    const results = []
    for (const value of body.values) {
      try {
        const result = await sql`
          INSERT INTO user_repo_preferences (user_id, preference_type, preference_value, validated, raw_text)
          VALUES (${internalUserId}, ${body.preference_type}, ${value}, ${body.validated}, ${body.raw_text || null})
          ON CONFLICT (user_id, preference_type, preference_value)
          DO UPDATE SET
            validated = GREATEST(user_repo_preferences.validated, EXCLUDED.validated),
            raw_text = COALESCE(EXCLUDED.raw_text, user_repo_preferences.raw_text),
            created_at = CURRENT_TIMESTAMP
          RETURNING id, preference_type, preference_value, validated
        `
        results.push(result[0])
      } catch (e) {
        console.error('[SavePreference] Error saving value:', value, e)
      }
    }

    console.log('[SavePreference] Saved:', {
      user_id: body.user_id,
      type: body.preference_type,
      values: body.values,
      validated: body.validated
    })

    return NextResponse.json({
      success: true,
      saved: results,
      validated: body.validated
    })
  } catch (error) {
    console.error('[SavePreference] Error:', error)
    return NextResponse.json(
      { error: 'Failed to save preference', details: String(error) },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve user's repo preferences
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('user_id')

  if (!userId) {
    return NextResponse.json(
      { error: 'Missing user_id parameter' },
      { status: 400 }
    )
  }

  try {
    // Get internal user ID
    const userResult = await sql`
      SELECT id FROM users WHERE neon_auth_id = ${userId} LIMIT 1
    `

    if (userResult.length === 0) {
      return NextResponse.json({ preferences: [] })
    }

    const internalUserId = userResult[0].id

    // Get all preferences grouped by type
    const preferences = await sql`
      SELECT preference_type, preference_value, validated, created_at
      FROM user_repo_preferences
      WHERE user_id = ${internalUserId}
      ORDER BY preference_type, created_at DESC
    `

    // Group by type
    const grouped: Record<string, { value: string; validated: boolean }[]> = {}
    for (const pref of preferences) {
      if (!grouped[pref.preference_type]) {
        grouped[pref.preference_type] = []
      }
      grouped[pref.preference_type].push({
        value: pref.preference_value,
        validated: pref.validated
      })
    }

    return NextResponse.json({ preferences: grouped })
  } catch (error) {
    console.error('[GetPreferences] Error:', error)
    return NextResponse.json(
      { error: 'Failed to get preferences', details: String(error) },
      { status: 500 }
    )
  }
}
