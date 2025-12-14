import { ExtractionResult, ExtractedSkill, SKILL_DEPTH_MAP } from './extraction-types'

// Pydantic AI Gateway configuration
const GATEWAY_URL = process.env.GATEWAY_URL || 'https://gateway.pydantic.dev/proxy/chat/'
const GATEWAY_API_KEY = process.env.PYDANTIC_AI_GATEWAY_API_KEY || process.env.PYDANTIC_GATEWAY_API_KEY

const EXTRACTION_PROMPT = `You are an expert career data extractor. Analyze the conversation transcript and extract structured professional information.

IMPORTANT: Be precise and conservative. Only extract what is clearly stated or strongly implied. Assign confidence scores:
- 0.9+ : Explicitly stated ("I worked at Google for 5 years")
- 0.7-0.9: Strongly implied ("At my time leading the finance team at a Big 4...")
- 0.5-0.7: Somewhat implied, needs confirmation
- <0.5: Don't include, too uncertain

Extract the following categories:

1. SKILLS - Technical skills, soft skills, domain expertise
   - Look for: tool names, methodologies, areas of expertise
   - Flag high-level skills that need depth exploration (e.g., "Python" → ask about frameworks)

2. COMPANIES - Places they've worked
   - Include role if mentioned
   - Note if it sounds like part-time/consulting vs full-time
   - Flag for validation (we'll verify company exists)

3. QUALIFICATIONS - Degrees, certifications, courses, awards
   - Educational background
   - Professional certifications (CFA, CPA, PMP, etc.)

4. PREFERENCES - What they want in their next role
   - Role types (CFO, CMO, etc.)
   - Location preferences
   - Availability (days per week)
   - Day rate expectations
   - Industry preferences
   - Company stage preferences (startup, scale-up, enterprise)

5. NARRATIVE - Key career story elements that don't fit structured fields

Return valid JSON matching this exact structure:
{
  "skills": [
    {
      "name": "string",
      "category": "technical|business|leadership|domain|soft",
      "proficiency": "beginner|intermediate|advanced|expert",
      "yearsExperience": number or null,
      "context": "how/where they used it",
      "needsDepth": boolean,
      "depthQuestions": ["follow-up question 1", "..."],
      "confidence": 0.0-1.0
    }
  ],
  "companies": [
    {
      "name": "string",
      "normalizedName": "lowercase-no-special-chars",
      "role": "their title",
      "roleType": "part-time|fulltime|contract|consulting",
      "startYear": number or null,
      "endYear": number or null,
      "isCurrent": boolean,
      "achievements": ["achievement 1", "..."],
      "teamSize": number or null,
      "needsValidation": true,
      "confidence": 0.0-1.0
    }
  ],
  "qualifications": [
    {
      "type": "degree|certification|course|award",
      "name": "string",
      "institution": "string or null",
      "year": number or null,
      "confidence": 0.0-1.0
    }
  ],
  "preferences": [
    {
      "type": "role|location|availability|rate|industry|companyStage",
      "value": "string",
      "confidence": 0.0-1.0
    }
  ],
  "narrative": "Key career story elements as a brief paragraph",
  "suggestedFollowUps": ["Good follow-up questions to dig deeper"]
}

TRANSCRIPT TO ANALYZE:
`

export async function extractFromTranscript(transcript: string): Promise<ExtractionResult> {
  // Use Pydantic AI Gateway (falls back to Gemini if not configured)
  if (GATEWAY_API_KEY) {
    return extractViaPydanticGateway(transcript)
  }

  // Fallback to direct Gemini API
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error('No API key found for extraction')
    return emptyResult()
  }

  return extractViaGemini(transcript, apiKey)
}

async function extractViaPydanticGateway(transcript: string): Promise<ExtractionResult> {
  try {
    const response = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GATEWAY_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Fast and good at structured output
        messages: [
          {
            role: 'system',
            content: 'You are an expert career data extractor. Always respond with valid JSON matching the exact schema requested.'
          },
          {
            role: 'user',
            content: EXTRACTION_PROMPT + transcript
          }
        ],
        temperature: 0.1,
        max_tokens: 4096,
        response_format: { type: 'json_object' }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Pydantic Gateway error:', errorText)
      // Fallback to Gemini
      const geminiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY
      if (geminiKey) {
        return extractViaGemini(transcript, geminiKey)
      }
      return emptyResult()
    }

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content

    if (!text) {
      console.error('No content in Gateway response')
      return emptyResult()
    }

    const extracted = JSON.parse(text) as ExtractionResult
    extracted.skills = enrichSkillsWithDepth(extracted.skills)
    return extracted
  } catch (error) {
    console.error('Pydantic Gateway extraction error:', error)
    return emptyResult()
  }
}

async function extractViaGemini(transcript: string, apiKey: string): Promise<ExtractionResult> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: EXTRACTION_PROMPT + transcript }]
          }],
          generationConfig: {
            temperature: 0.1,
            topP: 0.8,
            maxOutputTokens: 4096,
            responseMimeType: 'application/json'
          }
        })
      }
    )

    if (!response.ok) {
      console.error('Gemini API error:', await response.text())
      return emptyResult()
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      console.error('No text in Gemini response')
      return emptyResult()
    }

    const extracted = JSON.parse(text) as ExtractionResult
    extracted.skills = enrichSkillsWithDepth(extracted.skills)
    return extracted
  } catch (error) {
    console.error('Gemini extraction error:', error)
    return emptyResult()
  }
}

function enrichSkillsWithDepth(skills: ExtractedSkill[]): ExtractedSkill[] {
  return skills.map(skill => {
    const depthInfo = SKILL_DEPTH_MAP[skill.name]
    if (depthInfo && !skill.depthQuestions?.length) {
      return {
        ...skill,
        needsDepth: true,
        depthQuestions: depthInfo.questions
      }
    }
    return skill
  })
}

function emptyResult(): ExtractionResult {
  return {
    skills: [],
    companies: [],
    qualifications: [],
    preferences: [],
    suggestedFollowUps: []
  }
}

// Incremental extraction - extract only new information from latest message
export async function extractIncremental(
  newMessage: string,
  existingData: ExtractionResult
): Promise<ExtractionResult> {
  const incrementalPrompt = `${EXTRACTION_PROMPT}

ALREADY EXTRACTED (don't duplicate):
- Skills: ${existingData.skills.map(s => s.name).join(', ') || 'none'}
- Companies: ${existingData.companies.map(c => c.name).join(', ') || 'none'}
- Qualifications: ${existingData.qualifications.map(q => q.name).join(', ') || 'none'}

NEW MESSAGE TO ANALYZE (extract only NEW information):
${newMessage}`

  // Use Pydantic AI Gateway if available
  if (GATEWAY_API_KEY) {
    try {
      const response = await fetch(GATEWAY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GATEWAY_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are an expert career data extractor. Always respond with valid JSON.' },
            { role: 'user', content: incrementalPrompt }
          ],
          temperature: 0.1,
          max_tokens: 2048,
          response_format: { type: 'json_object' }
        })
      })

      if (response.ok) {
        const data = await response.json()
        const text = data.choices?.[0]?.message?.content
        if (text) {
          const extracted = JSON.parse(text) as ExtractionResult
          extracted.skills = enrichSkillsWithDepth(extracted.skills)
          return extracted
        }
      }
    } catch (error) {
      console.error('Gateway incremental extraction error:', error)
    }
  }

  // Fallback to Gemini
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY
  if (!apiKey) {
    return emptyResult()
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: incrementalPrompt }] }],
          generationConfig: {
            temperature: 0.1,
            topP: 0.8,
            maxOutputTokens: 2048,
            responseMimeType: 'application/json'
          }
        })
      }
    )

    if (!response.ok) return emptyResult()

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) return emptyResult()

    const extracted = JSON.parse(text) as ExtractionResult
    extracted.skills = enrichSkillsWithDepth(extracted.skills)
    return extracted
  } catch (error) {
    console.error('Gemini incremental extraction error:', error)
    return emptyResult()
  }
}

// Validate and normalize company name
export async function validateCompany(companyName: string): Promise<{
  validated: boolean
  normalizedName: string
  domain?: string
  industry?: string
  size?: string
  headquarters?: string
  linkedinUrl?: string
}> {
  // For now, basic normalization - later integrate with Clearbit/Apollo
  const normalizedName = companyName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/(ltd|limited|inc|incorporated|llc|plc|corp|corporation)$/i, '')
    .trim()

  // Future: Integrate Clearbit/Apollo API for company enrichment
  // Returns basic normalization for now - enrichment can be added later
  return {
    validated: true, // Basic validation passed
    normalizedName,
  }
}

// Get or create skill in database
export async function normalizeSkill(skillName: string): Promise<{
  id?: number
  name: string
  category?: string
  parentSkillId?: number
}> {
  // Uses pattern matching for skill categorization
  // Future: Could use LLM for more sophisticated categorization
  return {
    name: skillName,
    category: guessSkillCategory(skillName)
  }
}

function guessSkillCategory(skillName: string): string {
  const lower = skillName.toLowerCase()

  // Technical
  if (/python|javascript|typescript|react|node|sql|aws|azure|docker|kubernetes/i.test(lower)) {
    return 'technical'
  }

  // Business
  if (/finance|accounting|budgeting|forecasting|m&a|fundraising|strategy/i.test(lower)) {
    return 'business'
  }

  // Leadership
  if (/leadership|management|team|board|executive|stakeholder/i.test(lower)) {
    return 'leadership'
  }

  // Domain
  if (/saas|fintech|healthcare|retail|manufacturing|ecommerce/i.test(lower)) {
    return 'domain'
  }

  // Soft skills
  if (/communication|presentation|negotiation|problem.solving|critical.thinking/i.test(lower)) {
    return 'soft'
  }

  return 'other'
}
