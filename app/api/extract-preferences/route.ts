import { NextRequest, NextResponse } from 'next/server'

/**
 * Extract structured preferences from conversation transcript
 *
 * This endpoint analyzes user messages and extracts:
 * - Roles they're interested in (CFO, CMO, CTO, etc.)
 * - Industries (tech, healthcare, fintech, etc.)
 * - Locations (London, remote, etc.)
 * - Availability (1-2 days/week, etc.)
 * - Day rate expectations
 * - Skills mentioned
 *
 * Uses pattern matching by default. If ANTHROPIC_API_KEY is set,
 * it will use Claude for more accurate extraction.
 */

interface ExtractedPreference {
  type: 'role' | 'industry' | 'location' | 'availability' | 'day_rate' | 'skill'
  values: string[]
  confidence: 'high' | 'medium' | 'low'
  raw_text: string
}

interface ExtractionResponse {
  preferences: ExtractedPreference[]
  should_confirm: boolean
}

// Pattern-based extraction (fallback when no AI API key)
function extractWithPatterns(transcript: string): ExtractionResponse {
  const preferences: ExtractedPreference[] = []
  const lowerTranscript = transcript.toLowerCase()

  // Role patterns
  const rolePatterns = [
    { pattern: /\b(cfo|chief financial officer)\b/gi, value: 'CFO' },
    { pattern: /\b(cmo|chief marketing officer)\b/gi, value: 'CMO' },
    { pattern: /\b(cto|chief technology officer)\b/gi, value: 'CTO' },
    { pattern: /\b(coo|chief operating officer)\b/gi, value: 'COO' },
    { pattern: /\b(cpo|chief product officer)\b/gi, value: 'CPO' },
    { pattern: /\b(hr director|head of hr|people director)\b/gi, value: 'HR Director' },
    { pattern: /\b(finance director|fd)\b/gi, value: 'Finance Director' },
    { pattern: /\b(marketing director|head of marketing)\b/gi, value: 'Marketing Director' },
  ]

  const foundRoles: string[] = []
  for (const { pattern, value } of rolePatterns) {
    if (pattern.test(transcript)) {
      foundRoles.push(value)
    }
  }
  if (foundRoles.length > 0) {
    preferences.push({
      type: 'role',
      values: [...new Set(foundRoles)],
      confidence: 'high',
      raw_text: transcript.substring(0, 100)
    })
  }

  // Industry patterns
  const industryPatterns = [
    { pattern: /\b(tech|technology|software)\b/gi, value: 'Technology' },
    { pattern: /\b(fintech|financial technology)\b/gi, value: 'Fintech' },
    { pattern: /\b(healthcare|health)\b/gi, value: 'Healthcare' },
    { pattern: /\b(gaming|games|game)\b/gi, value: 'Gaming' },
    { pattern: /\b(saas|b2b)\b/gi, value: 'SaaS' },
    { pattern: /\b(ecommerce|e-commerce|retail)\b/gi, value: 'E-commerce' },
    { pattern: /\b(manufacturing)\b/gi, value: 'Manufacturing' },
    { pattern: /\b(media|entertainment)\b/gi, value: 'Media' },
  ]

  const foundIndustries: string[] = []
  for (const { pattern, value } of industryPatterns) {
    if (pattern.test(transcript)) {
      foundIndustries.push(value)
    }
  }
  if (foundIndustries.length > 0) {
    preferences.push({
      type: 'industry',
      values: [...new Set(foundIndustries)],
      confidence: 'high',
      raw_text: transcript.substring(0, 100)
    })
  }

  // Location patterns
  const locationPatterns = [
    { pattern: /\b(london)\b/gi, value: 'London' },
    { pattern: /\b(manchester)\b/gi, value: 'Manchester' },
    { pattern: /\b(remote|remotely|work from home)\b/gi, value: 'Remote' },
    { pattern: /\b(hybrid)\b/gi, value: 'Hybrid' },
    { pattern: /\b(uk|united kingdom|britain)\b/gi, value: 'UK' },
  ]

  const foundLocations: string[] = []
  for (const { pattern, value } of locationPatterns) {
    if (pattern.test(transcript)) {
      foundLocations.push(value)
    }
  }
  if (foundLocations.length > 0) {
    preferences.push({
      type: 'location',
      values: [...new Set(foundLocations)],
      confidence: 'high',
      raw_text: transcript.substring(0, 100)
    })
  }

  // Availability patterns
  const availabilityMatch = transcript.match(/(\d+)(?:\s*-\s*(\d+))?\s*days?(?:\s*(?:a|per)\s*week)?/i)
  if (availabilityMatch) {
    const value = availabilityMatch[2]
      ? `${availabilityMatch[1]}-${availabilityMatch[2]} days/week`
      : `${availabilityMatch[1]} days/week`
    preferences.push({
      type: 'availability',
      values: [value],
      confidence: 'high',
      raw_text: availabilityMatch[0]
    })
  }

  // Day rate patterns
  const rateMatch = transcript.match(/[£$€]?\s*(\d{3,4})(?:\s*-\s*[£$€]?\s*(\d{3,4}))?\s*(?:per day|\/day|a day)?/i)
  if (rateMatch && parseInt(rateMatch[1]) >= 300) { // Only match realistic day rates
    const value = rateMatch[2]
      ? `£${rateMatch[1]}-${rateMatch[2]}/day`
      : `£${rateMatch[1]}/day`
    preferences.push({
      type: 'day_rate',
      values: [value],
      confidence: 'medium',
      raw_text: rateMatch[0]
    })
  }

  return {
    preferences,
    should_confirm: preferences.some(p => p.confidence === 'high')
  }
}

// AI-based extraction (when ANTHROPIC_API_KEY is set)
async function extractWithAI(transcript: string): Promise<ExtractionResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    console.log('[Extract] No ANTHROPIC_API_KEY, using pattern matching')
    return extractWithPatterns(transcript)
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `Analyze this conversation transcript and extract any career preferences the user has mentioned. Focus on what they want, not what they're being shown.

Transcript:
${transcript}

Extract preferences in these categories:
- role: Job roles they want (e.g., "CFO", "CMO", "CTO", "Finance Director")
- industry: Industries they're interested in (e.g., "tech", "fintech", "healthcare", "games")
- location: Where they want to work (e.g., "London", "remote", "UK")
- availability: How many days per week they can work (e.g., "2 days", "1-2 days/week")
- day_rate: Their rate expectations (e.g., "£800/day", "1000-1500")
- skill: Skills they mention having (e.g., "M&A experience", "Series A fundraising")

Return ONLY a JSON object with this exact structure:
{
  "preferences": [
    {
      "type": "role|industry|location|availability|day_rate|skill",
      "values": ["value1", "value2"],
      "confidence": "high|medium|low",
      "raw_text": "the exact quote where this was mentioned"
    }
  ],
  "should_confirm": true/false
}

Only include preferences explicitly stated by the user. Set should_confirm=true if you found at least one high-confidence preference.
Return empty preferences array if nothing clear was stated.`
          }
        ]
      })
    })

    if (!response.ok) {
      console.error('[Extract AI] API error:', await response.text())
      return extractWithPatterns(transcript)
    }

    const data = await response.json()
    const content = data.content[0]

    if (content.type !== 'text') {
      return extractWithPatterns(transcript)
    }

    // Extract JSON from response
    let jsonStr = content.text
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      jsonStr = jsonMatch[0]
    }

    return JSON.parse(jsonStr)
  } catch (error) {
    console.error('[Extract AI] Error:', error)
    return extractWithPatterns(transcript)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { transcript } = await request.json()

    if (!transcript || transcript.length === 0) {
      return NextResponse.json({ preferences: [], should_confirm: false })
    }

    // Try AI extraction first, fall back to patterns
    const extracted = await extractWithAI(transcript)

    console.log('[Extract Preferences] Found:', extracted)

    return NextResponse.json(extracted)
  } catch (error) {
    console.error('[Extract Preferences] Error:', error)
    return NextResponse.json(
      { preferences: [], should_confirm: false, error: String(error) },
      { status: 500 }
    )
  }
}
