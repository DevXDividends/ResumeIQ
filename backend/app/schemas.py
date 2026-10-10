from typing import Optional
from pydantic import BaseModel


# ---------------- Admin ----------------

class AdminLoginRequest(BaseModel):
    username: str
    password: str


class AdminLoginResponse(BaseModel):
    success: bool
    message: str


class AdminCreateRequest(BaseModel):
    username: str
    password: str


class AdminOut(BaseModel):
    username: str


# ---------------- Job Descriptions ----------------

class JobOut(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    filename: Optional[str] = None
    upload_date: Optional[str] = None


class JobSummary(BaseModel):
    id: int
    title: str


class JobCreateResponse(BaseModel):
    success: bool
    message: str
    job: Optional[JobOut] = None


class JobSummarizeResponse(BaseModel):
    summary: str


# ---------------- Resumes / Applications ----------------

class ApplyResponse(BaseModel):
    success: bool
    candidate_name: str
    relevance_score: float
    verdict: str
    message: str


class CandidateOut(BaseModel):
    id: int
    candidate_name: str
    score: float
    verdict: str
    filename: str
    feedback: Optional[str] = None


class ReviewResponse(BaseModel):
    high_fit: list[CandidateOut]
    medium_fit: list[CandidateOut]
    low_fit: list[CandidateOut]
