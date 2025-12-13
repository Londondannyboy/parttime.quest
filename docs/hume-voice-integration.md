# Hume EVI Voice Integration - Fractional.Quest

## Summary

Working voice assistant using Hume EVI (Empathic Voice Interface) that:
- Knows user's name and profile from Neon database
- Passes session variables to personalize conversations
- Can query our database via tools for job searches

## Key Files

### 1. Voice Page (`app/voice-clean/page.tsx`)

```tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@stackframe/stack'
import { VoiceProvider, useVoice } from '@humeai/voice-react'

const CONFIG_ID = 'd57ceb71-4cf5-47e9-87cd-6052445a031c'

function VoiceInterface({ token, userId, profile }: { token: string; userId?: string; profile?: any }) {
  const { connect, disconnect, status, messages, isPlaying } = useVoice()

  const handleConnect = useCallback(async () => {
    // Pass profile data as session variables to Hume
    const vars = {
      user_id: userId || '',
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      is_authenticated: userId ? 'true' : 'false',
      current_country: profile?.current_country || '',
      interests: profile?.interests || '',
      timeline: profile?.timeline || '',
      budget: profile?.budget_monthly ? `£${profile.budget_monthly}/day` : '',
    }

    await connect({
      auth: { type: 'accessToken', value: token },
      configId: CONFIG_ID,
      sessionSettings: {
        type: 'session_settings' as const,
        variables: vars
      }
    })
  }, [connect, token, userId, profile])

  // ... UI code
}

export default function VoiceCleanPage() {
  const user = useUser()
  const [token, setToken] = useState<string | null>(null)
  const [profile, setProfile] = useState<any>(null)

  // Fetch Hume token
  useEffect(() => {
    fetch('/api/hume-token')
      .then(r => r.json())
      .then(d => setToken(d.accessToken))
  }, [])

  // Fetch profile from Neon
  useEffect(() => {
    if (!user) return
    fetch('/api/user-profile')
      .then(r => r.ok ? r.json() : null)
      .then(setProfile)
  }, [user])

  return (
    <VoiceProvider>
      <VoiceInterface token={token} userId={user?.id} profile={profile} />
    </VoiceProvider>
  )
}
```

### 2. Hume Token API (`app/api/hume-token/route.ts`)

```ts
import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey = process.env.HUME_API_KEY
  const secretKey = process.env.HUME_SECRET_KEY

  const response = await fetch('https://api.hume.ai/oauth2-cc/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: apiKey!,
      client_secret: secretKey!,
    }),
  })

  const data = await response.json()
  return NextResponse.json({ accessToken: data.access_token })
}
```

### 3. Hume Tool Endpoint (`app/api/hume-tool/route.ts`)

This endpoint allows Hume to query our database:

- `get_user_profile` - Get user's profile info
- `get_user_skills` - Get user's skills
- `search_jobs` - Search fractional jobs by role/location
- `save_user_preference` - Save user preferences
- `get_job_details` - Get specific job details

## Hume Dashboard Configuration

### Config ID: `d57ceb71-4cf5-47e9-87cd-6052445a031c`

### System Prompt:

```
<role>
You are Quest, an empathetic career advisor for Fractional.Quest, the UK's platform for fractional executive roles.
</role>

<user_context>
Name: {{first_name}} {{last_name}}
User ID: {{user_id}}
Authenticated: {{is_authenticated}}
Location: {{current_country}}
Interests: {{interests}}
Timeline: {{timeline}}
Day Rate: {{budget}}
</user_context>

<voice_only_response_format>
Format all responses as spoken words. Use natural inflections.
</voice_only_response_format>

<conversation_flow>
If name provided, greet warmly by name. Build their Repo by discovering fractional roles, availability, skills, achievements, day rate expectations.
</conversation_flow>

<tools>
When user asks about jobs, use the search_jobs tool.
When user shares preferences, use save_user_preference tool.
</tools>

<stay_concise>
One or two ideas per response. Under three sentences. One question at a time.
</stay_concise>
```

### Tool Configuration (MUST add in Hume dashboard):

**Tool URL for ALL tools:** `https://fractional.quest/api/hume-tool`

#### Tool 1: search_jobs
```json
{
  "name": "search_jobs",
  "description": "Search for fractional executive jobs. ALWAYS use this when user asks about roles, jobs, positions, or opportunities. After calling, tell the user you're showing results on their screen.",
  "parameters": {
    "type": "object",
    "properties": {
      "role_type": {
        "type": "string",
        "description": "Job role type like CFO, CMO, CTO, COO, HR Director, Marketing"
      },
      "location": {
        "type": "string",
        "description": "Location like London, Manchester, Remote, UK"
      },
      "limit": {
        "type": "number",
        "description": "Max results to return, default 5"
      }
    }
  }
}
```

#### Tool 2: get_user_profile
```json
{
  "name": "get_user_profile",
  "description": "Get the user's profile information including name, location, interests, timeline, and budget",
  "parameters": {
    "type": "object",
    "properties": {
      "user_id": {
        "type": "string",
        "description": "The user's ID from session variables"
      }
    },
    "required": ["user_id"]
  }
}
```

#### Tool 3: get_user_skills
```json
{
  "name": "get_user_skills",
  "description": "Get the user's recorded skills and experience levels",
  "parameters": {
    "type": "object",
    "properties": {
      "user_id": {
        "type": "string",
        "description": "The user's ID from session variables"
      }
    },
    "required": ["user_id"]
  }
}
```

#### Tool 4: save_user_preference
```json
{
  "name": "save_user_preference",
  "description": "Save a user preference. Use when user tells you their interests, timeline, budget, or location.",
  "parameters": {
    "type": "object",
    "properties": {
      "user_id": {
        "type": "string",
        "description": "The user's ID from session variables"
      },
      "field": {
        "type": "string",
        "enum": ["interests", "timeline", "budget_monthly", "current_country"],
        "description": "Which field to update"
      },
      "value": {
        "type": "string",
        "description": "The value to save"
      }
    },
    "required": ["user_id", "field", "value"]
  }
}
```

#### Tool 5: get_job_details
```json
{
  "name": "get_job_details",
  "description": "Get full details about a specific job by ID",
  "parameters": {
    "type": "object",
    "properties": {
      "job_id": {
        "type": "string",
        "description": "The job ID to look up"
      }
    },
    "required": ["job_id"]
  }
}
```

**IMPORTANT:** All tools must be registered in Hume dashboard with the same endpoint URL

## Environment Variables

```
HUME_API_KEY=your_api_key
HUME_SECRET_KEY=your_secret_key
```

## Package Version

```json
"@humeai/voice-react": "^0.2.11"
```

**Important:** Version 0.2.0 has "unknown message type" errors. Must use 0.2.11+.

## Flow

1. User loads page → Stack Auth identifies user
2. Fetch Hume access token from `/api/hume-token`
3. Fetch user profile from Neon via `/api/user-profile`
4. Connect to Hume with profile data as session variables
5. Hume uses `{{variable}}` syntax in system prompt to personalize
6. When user asks about jobs, Hume calls `/api/hume-tool` with `search_jobs`
7. Tool returns job data, Hume speaks the results
