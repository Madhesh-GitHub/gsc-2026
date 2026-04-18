from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

# ==================== Auth Schemas ====================

class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    first_name: str
    last_name: str
    role: str = Field(..., pattern="^(candidate|recruiter)$")

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"

class UserResponse(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== Candidate Schemas ====================

class CandidateCreateRequest(BaseModel):
    resume_url: str
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None

class CandidateResponse(BaseModel):
    id: str
    user_id: str
    status: str
    resume_url: str
    github_url: Optional[str]
    linkedin_url: Optional[str]
    capability_score: Optional[float]
    verification_score: Optional[float]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class CandidateDetailResponse(CandidateResponse):
    decision_matrix: Optional[dict] = None


# ==================== Job Schemas ====================

class JobCreateRequest(BaseModel):
    title: str
    jd_text: str

class JobResponse(BaseModel):
    id: str
    title: str
    jd_text: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ==================== Candidate Proof Schemas ====================

class CandidateProofResponse(BaseModel):
    id: str
    candidate_id: str
    link_type: str
    url: str
    is_verified: bool
    forensic_match_score: Optional[float]
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== Error Schemas ====================

class ErrorResponse(BaseModel):
    detail: str
    code: str
