"""
Pydantic models for the Repo Agent
"""
from pydantic import BaseModel, Field
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
    SOFT = "soft"           # Auto-detected, user can confirm later
    HARD = "hard"           # Requires explicit confirmation before saving
    VALIDATED = "validated" # User confirmed


class ExtractedPreference(BaseModel):
    """A preference extracted from conversation transcript"""
    type: PreferenceType
    values: list[str]
    confidence: float = Field(ge=0.0, le=1.0, description="Confidence score 0-1")
    raw_text: str = Field(description="The original text that triggered extraction")
    requires_hard_validation: bool = Field(
        default=False,
        description="True if this is a critical constraint requiring explicit confirmation"
    )
    reason: Optional[str] = Field(
        default=None,
        description="Why hard validation is needed (if applicable)"
    )


class ValidationRequest(BaseModel):
    """Request sent to frontend for user validation"""
    id: str
    preference: ExtractedPreference
    validation_type: ValidationType
    prompt: str  # What to show/say to user
    expires_at: Optional[datetime] = None


class ExtractionRequest(BaseModel):
    """Request to extract preferences from transcript"""
    transcript: str
    user_id: str
    context: Optional[list[str]] = Field(
        default=None,
        description="Previous conversation context"
    )


class ExtractionResponse(BaseModel):
    """Response from extraction endpoint"""
    preferences: list[ExtractedPreference]
    validation_requests: list[ValidationRequest]
    should_confirm: bool = Field(
        description="True if any hard validations need confirmation"
    )


class SavePreferenceRequest(BaseModel):
    """Request to save a validated preference"""
    user_id: str
    preference_type: PreferenceType
    values: list[str]
    validation_type: ValidationType
    raw_text: Optional[str] = None


class UserRepo(BaseModel):
    """User's career repository - all their preferences"""
    user_id: str
    roles: list[str] = []
    industries: list[str] = []
    locations: list[str] = []
    availability: Optional[str] = None
    day_rate_min: Optional[int] = None
    day_rate_max: Optional[int] = None
    skills: list[str] = []
    # Track validation status
    validation_status: dict[str, ValidationType] = {}
