from datetime import datetime

from fastapi import APIRouter, HTTPException, UploadFile, File, Form

from app import database as db
from app.config import settings
from app.services.text_extraction import extract_text_from_bytes
from app.services.feedback import summarize_jd
from app.schemas import JobOut, JobCreateResponse, JobSummarizeResponse

router = APIRouter(prefix="/api/jobs", tags=["jobs"])


def _row_to_job(row) -> JobOut:
    return JobOut(
        id=row["id"],
        title=row["title"],
        description=row["description"],
        filename=row["filename"],
        upload_date=row["upload_date"],
    )


@router.get("", response_model=list[JobOut])
def list_jobs():
    """Ported from Apply_Jobs.py / adminDashboard.py get_all_jds()."""
    return [_row_to_job(r) for r in db.get_all_jds()]


@router.get("/{jd_id}", response_model=JobOut)
def get_job(jd_id: int):
    """Ported from jobDesc.py get_job_by_id()."""
    row = db.get_job_by_id(jd_id)
    if not row:
        raise HTTPException(status_code=404, detail="Job not found")
    return _row_to_job(row)


@router.post("", response_model=JobCreateResponse, status_code=201)
async def create_job(title: str = Form(...), file: UploadFile = File(...)):
    """Ported from adminDashboard.py JD upload flow."""
    if not title or not file:
        raise HTTPException(status_code=400, detail="Job title and JD file are required")

    file_bytes = await file.read()
    jd_text = extract_text_from_bytes(file_bytes, file.filename)
    if not jd_text:
        raise HTTPException(status_code=400, detail="Could not extract text from the file. Use PDF or DOCX.")

    filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{file.filename}"
    filepath = settings.upload_dir / filename
    filepath.write_bytes(file_bytes)

    jd_id = db.add_jd(title, jd_text, filename)
    job_row = db.get_job_by_id(jd_id)
    return JobCreateResponse(success=True, message=f"JD '{title}' uploaded successfully!", job=_row_to_job(job_row))


@router.delete("/{jd_id}")
def remove_job(jd_id: int):
    """Ported from Delete_job.py (also cascades resume deletion, same as original)."""
    row = db.get_job_by_id(jd_id)
    if not row:
        raise HTTPException(status_code=404, detail="Job not found")
    db.delete_job(jd_id)
    return {"success": True, "message": f"Job '{row['title']}' and all its resumes have been deleted!"}


@router.post("/{jd_id}/summarize", response_model=JobSummarizeResponse)
def summarize_job(jd_id: int):
    """Ported from jobDesc.py 'Generate Simplified Job Description' button."""
    row = db.get_job_by_id(jd_id)
    if not row:
        raise HTTPException(status_code=404, detail="Job not found")
    summary = summarize_jd(row["description"] or "")
    return JobSummarizeResponse(summary=summary)
