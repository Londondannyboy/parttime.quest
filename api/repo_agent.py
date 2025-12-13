"""
Repo Agent - Pydantic AI powered preference extraction and validation

This FastAPI app runs on Vercel serverless functions and provides:
1. /api/py/extract - Extract preferences from transcript using Pydantic AI
2. /api/py/extract-stream - Streaming extraction using Vercel AI SDK protocol
3. /api/py/validate - Save validated preferences to Neon
4. /api/py/repo - Get user's full repo

Uses Vercel AI SDK data stream protocol for streaming responses.
See: https://pydantic.dev/articles/pydantic-ai-ui-vercel-ai
"""
import os
import json
import uuid
from datetime import datetime, timedelta
from typing import Optional, AsyncGenerator

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic_ai import Agent
from mangum import Mangum

from models import (
    ExtractedPreference,
    ExtractionRequest,
    ExtractionResponse,
    PreferenceType,
    SavePreferenceRequest,
    ValidationRequest,
    ValidationType,
    UserRepo,
)

# Initialize FastAPI
app = FastAPI(
    title="Repo Agent",
    description="Pydantic AI agent for career preference extraction",
    version="1.0.0"
)

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://fractional.quest",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic AI Agent for extraction
extraction_agent = Agent(
    model="anthropic:claude-sonnet-4-20250514",
    result_type=list[ExtractedPreference],
    system_prompt="""
You are a career preference extraction agent for Fractional.Quest, a platform for fractional executive roles.

Your job is to analyze conversation transcripts and extract structured career preferences.

For each preference found:
1. Identify the type: role, industry, location, availability, day_rate, or skill
2. Extract the specific values mentioned
3. Assess confidence (0.0-1.0) based on how clearly it was stated
4. Determine if HARD validation is needed (requires explicit user confirmation)

HARD validation triggers (set requires_hard_validation=True):
- Specific constraints: "I only want...", "Must be...", "Nothing below..."
- Deal-breakers: "I won't consider...", "Definitely not..."
- Salary/rate minimums: "At least £X", "Minimum of..."
- Location exclusivity: "Only London", "Has to be remote"
- Role level constraints: "C-suite only", "Not interested in director level"

SOFT validation (requires_hard_validation=False):
- General interests: "I like tech companies"
- Flexible preferences: "Maybe 2-3 days"
- Nice-to-haves: "Would be good if..."

Only extract preferences EXPLICITLY stated by the user, not inferred.
Return an empty list if nothing clear was stated.

Examples:
- "I'm interested in tech" → industry: ["Technology"], confidence: 0.8, hard: False
- "I only want CMO roles" → role: ["CMO"], confidence: 0.95, hard: True, reason: "Explicit constraint"
- "Maybe 2-3 days a week" → availability: ["2-3 days/week"], confidence: 0.7, hard: False
- "I need at least £1200/day" → day_rate: ["£1200+/day"], confidence: 0.95, hard: True, reason: "Minimum requirement"
"""
)


def create_validation_request(pref: ExtractedPreference) -> ValidationRequest:
    """Create a validation request from extracted preference"""
    validation_type = ValidationType.HARD if pref.requires_hard_validation else ValidationType.SOFT

    if validation_type == ValidationType.HARD:
        # Format confirmation question based on type
        if pref.type == PreferenceType.ROLE:
            prompt = f"Just to confirm - you only want {', '.join(pref.values)} roles?"
        elif pref.type == PreferenceType.DAY_RATE:
            prompt = f"Confirming your rate requirement: {', '.join(pref.values)}?"
        elif pref.type == PreferenceType.LOCATION:
            prompt = f"You want to work in {', '.join(pref.values)} only?"
        else:
            prompt = f"Confirming: {pref.type.value} - {', '.join(pref.values)}?"
    else:
        prompt = f"Adding to your Repo: {pref.type.value} - {', '.join(pref.values)}"

    return ValidationRequest(
        id=str(uuid.uuid4()),
        preference=pref,
        validation_type=validation_type,
        prompt=prompt,
        expires_at=datetime.now() + timedelta(seconds=30 if validation_type == ValidationType.SOFT else 120)
    )


@app.post("/extract", response_model=ExtractionResponse)
async def extract_preferences(request: ExtractionRequest):
    """
    Extract career preferences from transcript using Pydantic AI

    Returns extracted preferences with validation requests
    """
    if not request.transcript or len(request.transcript.strip()) == 0:
        return ExtractionResponse(
            preferences=[],
            validation_requests=[],
            should_confirm=False
        )

    try:
        # Build context string
        context_str = ""
        if request.context:
            context_str = f"\n\nPrevious context:\n" + "\n".join(request.context[-5:])

        # Run Pydantic AI extraction
        result = await extraction_agent.run(
            f"Extract career preferences from this transcript:\n\n{request.transcript}{context_str}"
        )

        preferences = result.data

        # Create validation requests for each preference
        validation_requests = [create_validation_request(p) for p in preferences]

        # Check if any hard validations need confirmation
        should_confirm = any(
            v.validation_type == ValidationType.HARD
            for v in validation_requests
        )

        return ExtractionResponse(
            preferences=preferences,
            validation_requests=validation_requests,
            should_confirm=should_confirm
        )

    except Exception as e:
        print(f"[Repo Agent] Extraction error: {e}")
        # Return empty on error - don't break the UX
        return ExtractionResponse(
            preferences=[],
            validation_requests=[],
            should_confirm=False
        )


@app.post("/extract-stream")
async def extract_preferences_stream(request: ExtractionRequest):
    """
    Stream extraction results using Vercel AI SDK data stream protocol

    This endpoint streams results in the format expected by useChat/useCompletion
    from the Vercel AI SDK, allowing real-time updates in the frontend.

    Data Stream Protocol format:
    - '0:"text"\\n' for text chunks
    - '2:[{"validation": {...}}]\\n' for data chunks
    - 'd:{"finishReason":"stop"}\\n' for finish
    """

    async def generate_stream() -> AsyncGenerator[str, None]:
        if not request.transcript or len(request.transcript.strip()) == 0:
            # Send empty result
            yield f'2:{json.dumps([{"preferences": [], "should_confirm": False}])}\n'
            yield 'd:{"finishReason":"stop"}\n'
            return

        try:
            # Build context
            context_str = ""
            if request.context:
                context_str = f"\n\nPrevious context:\n" + "\n".join(request.context[-5:])

            # Stream text indicating we're processing
            yield f'0:"Analyzing your preferences..."\n'

            # Run extraction (could also use run_stream for true streaming)
            result = await extraction_agent.run(
                f"Extract career preferences from this transcript:\n\n{request.transcript}{context_str}"
            )

            preferences = result.data
            validation_requests = [create_validation_request(p) for p in preferences]

            should_confirm = any(
                v.validation_type == ValidationType.HARD
                for v in validation_requests
            )

            # Send validation requests as data
            for vr in validation_requests:
                yield f'2:{json.dumps([{"validation_request": vr.model_dump(mode="json")}])}\n'

                # Also send as text for display
                if vr.validation_type == ValidationType.HARD:
                    yield f'0:"{vr.prompt}"\n'

            # Send final result
            yield f'2:{json.dumps([{"extraction_complete": True, "should_confirm": should_confirm, "count": len(preferences)}])}\n'

            # Finish
            yield f'd:{{"finishReason":"stop"}}\n'

        except Exception as e:
            print(f"[Repo Agent] Stream error: {e}")
            yield f'0:"Error processing preferences"\n'
            yield f'd:{{"finishReason":"error"}}\n'

    return StreamingResponse(
        generate_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",  # Disable nginx buffering
        }
    )


@app.post("/validate")
async def validate_preference(request: SavePreferenceRequest):
    """
    Save a validated preference to Neon database
    """
    import asyncpg

    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        raise HTTPException(status_code=500, detail="Database not configured")

    try:
        conn = await asyncpg.connect(database_url)

        # Get internal user ID from neon_auth_id
        user_row = await conn.fetchrow(
            "SELECT id FROM users WHERE neon_auth_id = $1 LIMIT 1",
            request.user_id
        )

        if not user_row:
            await conn.close()
            raise HTTPException(status_code=404, detail="User not found")

        internal_user_id = user_row["id"]

        # Ensure table exists
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS user_repo_preferences (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                preference_type VARCHAR(50) NOT NULL,
                preference_value TEXT NOT NULL,
                validation_type VARCHAR(20) DEFAULT 'soft',
                raw_text TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, preference_type, preference_value)
            )
        """)

        # Insert preferences
        saved = []
        for value in request.values:
            try:
                result = await conn.fetchrow("""
                    INSERT INTO user_repo_preferences
                    (user_id, preference_type, preference_value, validation_type, raw_text)
                    VALUES ($1, $2, $3, $4, $5)
                    ON CONFLICT (user_id, preference_type, preference_value)
                    DO UPDATE SET
                        validation_type = CASE
                            WHEN user_repo_preferences.validation_type = 'validated' THEN 'validated'
                            ELSE EXCLUDED.validation_type
                        END,
                        raw_text = COALESCE(EXCLUDED.raw_text, user_repo_preferences.raw_text)
                    RETURNING id, preference_value, validation_type
                """, internal_user_id, request.preference_type.value, value,
                    request.validation_type.value, request.raw_text)

                if result:
                    saved.append({
                        "id": result["id"],
                        "value": result["preference_value"],
                        "validation_type": result["validation_type"]
                    })
            except Exception as e:
                print(f"[Repo Agent] Error saving {value}: {e}")

        await conn.close()

        return {
            "success": True,
            "saved": saved,
            "user_id": request.user_id
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"[Repo Agent] Validate error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/repo/{user_id}", response_model=UserRepo)
async def get_user_repo(user_id: str):
    """
    Get user's full career repository
    """
    import asyncpg

    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        raise HTTPException(status_code=500, detail="Database not configured")

    try:
        conn = await asyncpg.connect(database_url)

        # Get internal user ID
        user_row = await conn.fetchrow(
            "SELECT id FROM users WHERE neon_auth_id = $1 LIMIT 1",
            user_id
        )

        if not user_row:
            await conn.close()
            return UserRepo(user_id=user_id)

        internal_user_id = user_row["id"]

        # Get all preferences
        rows = await conn.fetch("""
            SELECT preference_type, preference_value, validation_type
            FROM user_repo_preferences
            WHERE user_id = $1
            ORDER BY created_at DESC
        """, internal_user_id)

        await conn.close()

        # Build repo
        repo = UserRepo(user_id=user_id)

        for row in rows:
            ptype = row["preference_type"]
            value = row["preference_value"]
            vtype = row["validation_type"]

            if ptype == "role":
                repo.roles.append(value)
            elif ptype == "industry":
                repo.industries.append(value)
            elif ptype == "location":
                repo.locations.append(value)
            elif ptype == "availability":
                repo.availability = value
            elif ptype == "skill":
                repo.skills.append(value)
            elif ptype == "day_rate":
                # Parse day rate
                pass

            # Track validation status
            repo.validation_status[f"{ptype}:{value}"] = ValidationType(vtype)

        return repo

    except Exception as e:
        print(f"[Repo Agent] Get repo error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "ok", "agent": "repo"}


# Vercel serverless handler
handler = Mangum(app)
