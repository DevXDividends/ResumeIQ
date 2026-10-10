import os
import shutil

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from app import database as db
from app.config import settings
from app.services.embeddings import review_final_score, review_time_verdict
from app.services.feedback import generate_feedback
from app.schemas import ReviewResponse, CandidateOut

router = APIRouter(prefix="/api", tags=["review"])


def _verdict_label(verdict: str) -> str:
    """Original app prefixes verdicts with emoji (✅/⚠️/❌); keep for UI parity via a mapping."""
    return {
        "High Fit": "High Fit",
        "Medium Fit": "Medium Fit",
        "Low Fit": "Low Fit",
    }.get(verdict, verdict)


@router.get("/jobs/{jd_id}/review", response_model=ReviewResponse)
def review_candidates(jd_id: int):
    """Ported from admin_review.py: dedupe, re-score, categorize, generate+cache feedback."""
    job = db.get_job_by_id(jd_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    resumes = db.get_resumes_with_jd_for_review(jd_id)
    if not resumes:
        return ReviewResponse(high_fit=[], medium_fit=[], low_fit=[])

    # Remove duplicates, keep first occurrence (already ordered by score desc, date desc)
    unique_resumes = []
    seen = set()
    for r in resumes:
        name = r["candidate_name"]
        if name not in seen:
            unique_resumes.append(r)
            seen.add(name)

    high_fit, medium_fit, low_fit = [], [], []

    for r in unique_resumes:
        resume_id = r["id"]
        name = r["candidate_name"]
        hard_score = r["score"]
        resume_text = r["resume_text"]
        jd_text = r["description"]
        feedback = r["feedback"]

        final_score = review_final_score(hard_score, resume_text, jd_text)
        final_verdict = review_time_verdict(final_score)

        if not feedback or feedback == "Feedback not available.":
            feedback = generate_feedback(resume_text, jd_text)
            db.update_feedback(resume_id, feedback)

        candidate = CandidateOut(
            id=resume_id,
            candidate_name=name,
            score=round(final_score, 2),
            verdict=_verdict_label(final_verdict),
            filename=r["filename"],
            feedback=feedback,
        )

        if final_verdict == "High Fit":
            high_fit.append(candidate)
        elif final_verdict == "Medium Fit":
            medium_fit.append(candidate)
        else:
            low_fit.append(candidate)

    return ReviewResponse(high_fit=high_fit, medium_fit=medium_fit, low_fit=low_fit)


@router.get("/resumes/{resume_id}/download")
def download_resume(resume_id: int, candidate_name: str, filename: str):
    """Ported from admin_review.py get_download_file() - copies uploads/<file> to downloads/ and serves it."""
    source_path = settings.upload_dir / filename
    if not source_path.exists():
        raise HTTPException(status_code=404, detail="Original resume file not found")

    ext = os.path.splitext(filename)[1] or ".docx"
    safe_name = candidate_name.replace(" ", "_")
    output_path = settings.download_dir / f"{safe_name}{ext}"
    shutil.copy(source_path, output_path)

    return FileResponse(
        path=output_path,
        filename=f"{safe_name}{ext}",
        media_type="application/octet-stream",
    )
