# Pydantic AI Agent Architecture: Repo Validation Agent

## Overview

A real-time Pydantic AI agent that watches conversation transcripts and performs human-in-the-loop validation of extracted career preferences.

**Stack:**
- FastAPI backend (Python)
- Pydantic AI for structured extraction and agent logic
- **Vercel** for hosting (same platform as Next.js frontend)
- Vercel AI SDK for streaming responses
- Neon PostgreSQL for storage

---

## The Two Validation Types

### Soft Validation (Auto-detected)
- Agent detects preference from transcript
- Shows briefly in UI, then auto-saves as "unvalidated"
- User can confirm later to upgrade to validated
- Example: "I like tech companies" → saves `industry: Technology (soft)`

### Hard Validation (User-confirmed)
- Critical preferences that need explicit confirmation
- Agent asks user directly: "Just to confirm - you only want CMO roles above £5k/week in London?"
- Saved as "validated" only after user confirms
- Example: "CMO, £5000+/week, London only" → waits for "yes"

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        NEXT.JS FRONTEND                         │
│  ┌─────────────┐    ┌──────────────┐    ┌──────────────────┐   │
│  │ Hume Voice  │───▶│ Transcript   │───▶│ Validation UI    │   │
│  │ (Repo)      │    │ Display      │    │ Cards            │   │
│  └─────────────┘    └──────────────┘    └──────────────────┘   │
│         │                  │                      ▲             │
│         │                  │                      │             │
│         ▼                  ▼                      │             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              WebSocket / SSE Connection                  │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FASTAPI + PYDANTIC AI                        │
│                         (Railway)                               │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    RepoAgent                             │   │
│  │                                                          │   │
│  │  1. Receives transcript chunks via WebSocket             │   │
│  │  2. Extracts preferences using Pydantic AI              │   │
│  │  3. Determines soft vs hard validation needed            │   │
│  │  4. Sends validation requests to frontend               │   │
│  │  5. Handles confirmation responses                       │   │
│  │  6. Saves to Neon database                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Pydantic Models (Structured Output)         │   │
│  │                                                          │   │
│  │  - ExtractedPreference                                   │   │
│  │  - ValidationRequest                                     │   │
│  │  - UserRepo                                              │   │
│  │  - ConversationContext                                   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       NEON POSTGRESQL                           │
│                                                                 │
│  Tables:                                                        │
│  - user_repo_preferences (with validation_type column)          │
│  - validation_requests (pending confirmations)                  │
│  - agent_sessions (conversation context)                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Pydantic AI Models

```python
from pydantic import BaseModel, Field
from pydantic_ai import Agent
from enum import Enum
from typing import Optional
from datetime import datetime

class PreferenceType(str, Enum):
    ROLE = "role"
    INDUSTRY = "industry"
    LOCATION = "location"
    AVAILABILITY = "availability"
    DAY_RATE = "day_rate"
    SKILL = "skill"

class ValidationType(str, Enum):
    SOFT = "soft"      # Auto-detected, user can confirm later
    HARD = "hard"      # Requires explicit confirmation
    VALIDATED = "validated"  # User confirmed

class ExtractedPreference(BaseModel):
    """A preference extracted from conversation"""
    type: PreferenceType
    values: list[str]
    confidence: float = Field(ge=0.0, le=1.0)
    raw_text: str
    requires_hard_validation: bool = False
    reason: Optional[str] = None  # Why hard validation needed

class ValidationRequest(BaseModel):
    """Request for user validation"""
    id: str
    preference: ExtractedPreference
    validation_type: ValidationType
    prompt: str  # What to show/say to user
    expires_at: datetime

class UserRepo(BaseModel):
    """User's career repository"""
    user_id: str
    roles: list[str] = []
    industries: list[str] = []
    locations: list[str] = []
    availability: Optional[str] = None
    day_rate_min: Optional[int] = None
    day_rate_max: Optional[int] = None
    skills: list[str] = []
    # Validation status for each
    validation_status: dict[str, ValidationType] = {}
```

---

## FastAPI Endpoints

```python
from fastapi import FastAPI, WebSocket, HTTPException
from pydantic_ai import Agent

app = FastAPI()

# WebSocket for real-time transcript processing
@app.websocket("/ws/repo-agent/{user_id}")
async def repo_agent_websocket(websocket: WebSocket, user_id: str):
    await websocket.accept()
    agent = RepoAgent(user_id)

    try:
        while True:
            # Receive transcript chunk from frontend
            data = await websocket.receive_json()

            if data["type"] == "transcript":
                # Process with Pydantic AI
                validations = await agent.process_transcript(data["content"])

                # Send validation requests to frontend
                for v in validations:
                    await websocket.send_json({
                        "type": "validation_request",
                        "data": v.model_dump()
                    })

            elif data["type"] == "confirm":
                # User confirmed a validation
                await agent.confirm_preference(data["validation_id"])
                await websocket.send_json({
                    "type": "confirmed",
                    "validation_id": data["validation_id"]
                })

            elif data["type"] == "reject":
                # User rejected
                await agent.reject_preference(data["validation_id"])

    except Exception as e:
        await websocket.close()

# REST endpoint for getting user's repo
@app.get("/api/repo/{user_id}")
async def get_user_repo(user_id: str) -> UserRepo:
    return await fetch_user_repo(user_id)

# REST endpoint for manual preference update
@app.post("/api/repo/{user_id}/preference")
async def add_preference(user_id: str, preference: ExtractedPreference):
    return await save_preference(user_id, preference, ValidationType.VALIDATED)
```

---

## The RepoAgent Class

```python
from pydantic_ai import Agent
from pydantic_ai.models.anthropic import AnthropicModel

class RepoAgent:
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.context = []  # Conversation history
        self.pending_validations = {}

        # Pydantic AI agent for extraction
        self.extraction_agent = Agent(
            model=AnthropicModel("claude-sonnet-4-20250514"),
            result_type=list[ExtractedPreference],
            system_prompt="""
            You are a career preference extraction agent.
            Extract structured career preferences from conversation transcripts.

            For each preference found:
            1. Identify the type (role, industry, location, availability, day_rate, skill)
            2. Extract the specific values mentioned
            3. Assess confidence (0.0-1.0) based on clarity
            4. Determine if hard validation is needed:
               - Hard validation for: specific constraints, deal-breakers, salary requirements
               - Soft validation for: general interests, nice-to-haves

            Only extract preferences explicitly stated by the user.
            """
        )

    async def process_transcript(self, transcript: str) -> list[ValidationRequest]:
        """Process new transcript and return validation requests"""
        self.context.append(transcript)

        # Use Pydantic AI to extract preferences
        result = await self.extraction_agent.run(
            f"Extract career preferences from this transcript:\n\n{transcript}\n\nContext from earlier: {self.context[-5:]}"
        )

        validations = []
        for pref in result.data:
            validation = self._create_validation_request(pref)
            self.pending_validations[validation.id] = validation
            validations.append(validation)

            # Auto-save soft validations after timeout
            if validation.validation_type == ValidationType.SOFT:
                asyncio.create_task(self._auto_save_soft(validation))

        return validations

    def _create_validation_request(self, pref: ExtractedPreference) -> ValidationRequest:
        """Create a validation request from extracted preference"""
        validation_type = (
            ValidationType.HARD if pref.requires_hard_validation
            else ValidationType.SOFT
        )

        if validation_type == ValidationType.HARD:
            prompt = f"Just to confirm - {self._format_confirmation(pref)}?"
        else:
            prompt = f"Adding to your Repo: {pref.type.value} - {', '.join(pref.values)}"

        return ValidationRequest(
            id=str(uuid.uuid4()),
            preference=pref,
            validation_type=validation_type,
            prompt=prompt,
            expires_at=datetime.now() + timedelta(seconds=30)
        )

    async def _auto_save_soft(self, validation: ValidationRequest):
        """Auto-save soft validations after timeout"""
        await asyncio.sleep(8)  # Wait 8 seconds

        if validation.id in self.pending_validations:
            # Still pending, save as soft validation
            await self._save_to_db(
                validation.preference,
                ValidationType.SOFT
            )
            del self.pending_validations[validation.id]

    async def confirm_preference(self, validation_id: str):
        """User confirmed a preference"""
        if validation_id in self.pending_validations:
            validation = self.pending_validations[validation_id]
            await self._save_to_db(
                validation.preference,
                ValidationType.VALIDATED
            )
            del self.pending_validations[validation_id]

    async def _save_to_db(self, pref: ExtractedPreference, status: ValidationType):
        """Save preference to Neon database"""
        # Implementation with asyncpg or similar
        pass
```

---

## Hard Validation Triggers

The agent should request hard validation when it detects:

1. **Specific constraints**: "I only want...", "Must be...", "Nothing below..."
2. **Deal-breakers**: "I won't consider...", "Definitely not..."
3. **Salary/rate requirements**: "At least £X", "Minimum of..."
4. **Location exclusivity**: "Only London", "Has to be remote"
5. **Role level**: "C-suite only", "Not interested in director level"

Examples:
- "I'm interested in tech" → Soft (general interest)
- "I only want CMO roles" → Hard (constraint)
- "Maybe 2-3 days a week" → Soft (flexible)
- "I need at least £1200/day" → Hard (minimum requirement)

---

## Frontend Integration

### WebSocket Connection (Next.js)

```typescript
// hooks/useRepoAgent.ts
import { useEffect, useState, useCallback } from 'react'

interface ValidationRequest {
  id: string
  preference: {
    type: string
    values: string[]
  }
  validation_type: 'soft' | 'hard' | 'validated'
  prompt: string
}

export function useRepoAgent(userId: string) {
  const [ws, setWs] = useState<WebSocket | null>(null)
  const [validations, setValidations] = useState<ValidationRequest[]>([])
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const socket = new WebSocket(
      `${process.env.NEXT_PUBLIC_REPO_AGENT_URL}/ws/repo-agent/${userId}`
    )

    socket.onopen = () => setConnected(true)
    socket.onclose = () => setConnected(false)

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if (data.type === 'validation_request') {
        setValidations(prev => [...prev, data.data])
      }

      if (data.type === 'confirmed') {
        setValidations(prev =>
          prev.filter(v => v.id !== data.validation_id)
        )
      }
    }

    setWs(socket)
    return () => socket.close()
  }, [userId])

  const sendTranscript = useCallback((content: string) => {
    ws?.send(JSON.stringify({ type: 'transcript', content }))
  }, [ws])

  const confirmValidation = useCallback((id: string) => {
    ws?.send(JSON.stringify({ type: 'confirm', validation_id: id }))
  }, [ws])

  const rejectValidation = useCallback((id: string) => {
    ws?.send(JSON.stringify({ type: 'reject', validation_id: id }))
  }, [ws])

  return {
    connected,
    validations,
    sendTranscript,
    confirmValidation,
    rejectValidation
  }
}
```

### Sending Transcripts to Agent

```typescript
// In repo/page.tsx - inside VoiceInterface

const { sendTranscript, validations, confirmValidation } = useRepoAgent(userId)

// When new user message comes in
useEffect(() => {
  const lastUserMsg = messages.findLast(m => m.type === 'user_message')
  if (lastUserMsg?.message?.content) {
    sendTranscript(lastUserMsg.message.content)
  }
}, [messages, sendTranscript])
```

---

## Vercel Deployment

Vercel supports Python/FastAPI natively. Create an `api/` directory with Python files.

### Project Structure

```
fractional.quest/
├── app/                    # Next.js app
├── api/                    # FastAPI (Python) - Vercel serverless
│   ├── repo_agent.py       # Main agent endpoint
│   ├── models.py           # Pydantic models
│   └── requirements.txt    # Python deps
├── package.json
└── vercel.json
```

### vercel.json

```json
{
  "rewrites": [
    { "source": "/api/py/(.*)", "destination": "/api/$1" }
  ],
  "functions": {
    "api/*.py": {
      "runtime": "python3.11"
    }
  }
}
```

### api/requirements.txt

```txt
fastapi>=0.109.0
pydantic>=2.5.0
pydantic-ai>=0.0.14
anthropic>=0.18.0
asyncpg>=0.29.0
mangum>=0.17.0
```

### api/repo_agent.py

```python
from fastapi import FastAPI, Request
from mangum import Mangum
from pydantic_ai import Agent

app = FastAPI()

@app.post("/api/extract")
async def extract_preferences(request: Request):
    data = await request.json()
    # Pydantic AI extraction logic
    return {"preferences": [], "should_confirm": False}

@app.post("/api/validate")
async def validate_preference(request: Request):
    data = await request.json()
    # Save to Neon
    return {"success": True}

# Vercel serverless handler
handler = Mangum(app)
```

---

## Environment Variables

```env
# Vercel Environment Variables
ANTHROPIC_API_KEY=sk-ant-...
DATABASE_URL=postgres://...@ep-xxx.us-east-2.aws.neon.tech/neondb
```

Set via: Vercel Dashboard → Project → Settings → Environment Variables

---

## Next Steps

1. **Create FastAPI project** in `/repo-agent` directory
2. **Implement RepoAgent** with Pydantic AI
3. **Set up WebSocket** endpoint
4. **Deploy to Railway**
5. **Connect Next.js frontend** with WebSocket hook
6. **Test soft/hard validation flow**

---

## Migration Path

Current state → Pydantic AI agent:

1. Keep existing pattern-matching as fallback
2. Add WebSocket connection to FastAPI
3. Gradually migrate extraction to Pydantic AI
4. Remove old extraction endpoint once stable
