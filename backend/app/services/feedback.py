"""
Gemini-powered feedback + JD summarization.

Ported from admin_review.py / jobDesc.py. The Gemini API key is now read
from the GOOGLE_API_KEY environment variable instead of being hardcoded in
source, since it was previously committed in plaintext to a public repo.
"""
from functools import lru_cache

from app.config import settings


@lru_cache(maxsize=1)
def get_gemini():
    if not settings.google_api_key:
        return None
    from langchain_google_genai import ChatGoogleGenerativeAI

    return ChatGoogleGenerativeAI(
        model=settings.gemini_model,
        temperature=0,
        google_api_key=settings.google_api_key,
    )


def generate_feedback(resume_text: str, jd_text: str) -> str:
    """Same prompt as the original admin_review.py get_cached_feedback()."""
    gemini = get_gemini()
    if gemini is None:
        return "Feedback not available (GOOGLE_API_KEY is not configured)."
    try:
        prompt = f"""
        Resume Text: {resume_text}
        Job Description: {jd_text}
        Task: Identify missing skills, certifications, and projects.
        Give 3-5 concise bullet points for improvement.
        """
        response = gemini.invoke(prompt)
        return response.content or "Feedback not available."
    except Exception:
        return "Feedback not available."


def summarize_jd(jd_text: str) -> str:
    """Same prompt as the original jobDesc.py 'Generate Simplified Job Description'."""
    gemini = get_gemini()
    if gemini is None:
        return "Summary not available (GOOGLE_API_KEY is not configured)."
    try:
        response = gemini.invoke(f"Summarize for students:\n{jd_text}")
        return response.content or "Summary not available."
    except Exception:
        return "Summary not available."
