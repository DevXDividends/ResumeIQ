from datetime import datetime

from fastapi import APIRouter, HTTPException, UploadFile, File, Form

from app import database as db
from app.config import settings
from app.services.text_extraction import extract_text_from_bytes
from app.services.embeddings import cosine_similarity_score, apply_time_verdict
from app.schemas import ApplyResponse

router = APIRouter(prefix="/api/jobs", tags=["applications"])


@router.post("/{jd_id}/apply", response_model=ApplyResponse)
async def apply_to_job(jd_id: int, candidate_name: str = Form(...), resume: UploadFile = File(...)):
    """Ported from jobDesc.py show_job() 'Check Relevance / Apply' flow."""
    job = db.get_job_by_id(jd_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if not candidate_name:
        raise HTTPException(status_code=400, detail="Enter your name")
    if not resume:
        raise HTTPException(status_code=400, detail="Upload your resume")

    file_bytes = await resume.read()

    # Save resume file (same naming convention as the original app)
    filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{resume.filename}"
    filepath = settings.upload_dir / filename
    filepath.write_bytes(file_bytes)

    resume_text = extract_text_from_bytes(file_bytes, resume.filename)
    if not resume_text:
        raise HTTPException(status_code=400, detail="Could not extract text from resume")

    relevance_score = cosine_similarity_score(resume_text, job["description"] or "")
    verdict = apply_time_verdict(relevance_score)

    db.add_resume(candidate_name, jd_id, resume_text, filename, relevance_score, verdict)

    return ApplyResponse(
        success=True,
        candidate_name=candidate_name,
        relevance_score=relevance_score,
        verdict=verdict,
        message="Your resume has been evaluated and saved!",
    )
